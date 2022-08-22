import { auth, db } from "../firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    AuthErrorCodes,
    sendEmailVerification,
} from "firebase/auth";
import getUserData from "./getUserData";
import $ from "jquery";
import Vue from "vue";
import {
    idConverter,
    stuDataConverter,
    userType,
    stuData,
    teacherData,
    parentData,
    id,
} from "../firebase/firestoreTypes";
import zip from "../components/zip";

new Vue({
    el: "#app",
    data(): {
        // 型定義
        accountType: userType;
        userId: string;
        email: string;
        password: string;
        lastName: string;
        lastNameKana: string;
        firstName: string;
        firstNameKana: string;
        birthDate: string;
        sex: "0" | "1" | "2" | "9";
        tel: string;
        idList: Set<string>;
        isParent: boolean;
        childrenList: string[][];
    } {
        // 初期値をセット
        return {
            // 初期値を未選択にするために空文字 未選択の場合は先に進めないのでasで型エラーを握りつぶす
            accountType: "" as userType,
            userId: "",
            email: "",
            password: "",
            lastName: "",
            lastNameKana: "",
            firstName: "",
            firstNameKana: "",
            birthDate: "",
            // 初期値を未選択にするために空文字 未選択の場合は先に進めないのでasで型エラーを握りつぶす
            sex: "" as "0" | "1" | "2" | "9",
            tel: "",
            // すでに使用されているID 探索の高速化のためにsetを使用
            idList: new Set(),
            isParent: false,
            // 保護者の場合のみ使用
            childrenList: [],
        };
    },
    // DOM生成時に実行される関数
    async created() {
        // すでに取得されているIDのリストを取得
        this.idList = new Set(
            (await getDocs(collection(db, "id"))).docs.map((val) => val.id)
        );
    },
    methods: {
        /**
         * サインアップのメイン処理
         */
        async main() {
            // アカウントを作成
            await createUserWithEmailAndPassword(
                auth,
                this.email,
                this.password
            )
                // 成功時
                .then(async () => {
                    const user = await getUserData();
                    if (!user) {
                        return;
                    }

                    // 確認メールを送信
                    await sendEmailVerification(user)
                        // メール送信成功時
                        .then(async () => {
                            // DB登録用のデータ(users/)
                            const userData = await this.userDataCreate();

                            // DBに登録
                            await setDoc(
                                doc(db, `users/${user.uid}`),
                                userData
                            );

                            // DB登録用のデータ(id/)
                            const userIdData: id = {
                                uid: user.uid,
                            };

                            // DBに登録
                            await setDoc(
                                doc(db, `id/${this.userId}`),
                                userIdData
                            );

                            // HTMLを更新
                            $("#signup").remove();
                            $("<p>", {
                                html: `
                        ${this.email}にメールを送信しました<br>
                        URLをクリックして登録を完了させてください<br>
                        メールが届かない場合は再送信やアドレスの確認を行ってください
                        `,
                            }).appendTo("#after");
                            $("<button>", {
                                id: "retransmission",
                                text: "メールの再送信",
                            }).appendTo("#after");
                        });
                })

                // エラー時
                .catch((e) => {
                    const errorCode = e.code;
                    if (errorCode === AuthErrorCodes.EMAIL_EXISTS) {
                        alert("そのメールアドレスは使用されています");
                    } else if (AuthErrorCodes.WEAK_PASSWORD) {
                        alert("パスワードは6文字以上で入力してください");
                    } else if (AuthErrorCodes.INVALID_EMAIL) {
                        alert("メールアドレスの形式が正しくありません");
                    } else {
                        alert(errorCode);
                    }
                });
        },
        /**
         * DB登録用のデータを作成
         * @returns DB登録用のデータ
         */
        async userDataCreate(): Promise<stuData | teacherData | parentData> {
            // 保護者
            if (this.accountType === "parent") {
                // 子供のuidを取得
                const childrenId = await Promise.all(
                    this.childrenList.map(
                        async (val) =>
                            (
                                await getDoc(
                                    doc(db, `id/${val[0]}`).withConverter(
                                        idConverter
                                    )
                                )
                            ).data()!.uid
                    )
                );
                const res: parentData = {
                    id: this.userId,
                    type: "parent",
                    mail: this.email,
                    tel: this.tel,
                    first_name: this.firstName,
                    last_name: this.lastName,
                    first_name_kana: this.firstNameKana,
                    last_name_kana: this.lastNameKana,
                    sex: this.sex,
                    birth_date: this.birthDate,
                    children_id: childrenId,
                };
                return res;

                // 生徒
            } else if (this.accountType === "student") {
                const res: stuData = {
                    id: this.userId,
                    type: "student",
                    mail: this.email,
                    tel: this.tel,
                    first_name: this.firstName,
                    last_name: this.lastName,
                    first_name_kana: this.firstNameKana,
                    last_name_kana: this.lastNameKana,
                    sex: this.sex,
                    birth_date: this.birthDate,
                };
                return res;

                // 講師
            } else {
                const res: teacherData = {
                    id: this.userId,
                    type: "teacher",
                    mail: this.email,
                    tel: this.tel,
                    first_name: this.firstName,
                    last_name: this.lastName,
                    first_name_kana: this.firstNameKana,
                    last_name_kana: this.lastNameKana,
                    sex: this.sex,
                    birth_date: this.birthDate,
                };
                return res;
            }
        },
        /**
         * アカウントタイプを変更した時に走る処理
         */
        accountTypeChange() {
            // 保護者が選ばれたか？
            this.isParent = this.accountType === "parent";
        },
        /**
         * IDが重複していないかチェック
         */
        idCheck() {
            if (this.idList.has(this.userId)) {
                // 重複していたらエラーメッセージを表示
                $("#id-used").show();
            } else {
                $("#id-used").hide();
            }
        },
        /**
         * 保護者の場合のみ使用
         * 入力された子供のIDと名前が存在するか照合
         * @returns 存在するならtrue しないならfalse
         */
        async childrenCollation() {
            // 入力された文字列を取得
            const inputId = $("#children-id").val();
            const inputName = $("#children-name").val();

            // HTML要素を取得
            const idHtml =
                document.querySelector<HTMLInputElement>("#children-id");
            const nameHtml =
                document.querySelector<HTMLInputElement>("#children-name");

            // 入力された文字列がが不正か、HTMLのバリデーションがfalseを返したらエラーメッセージを表示してfalseを返す
            if (
                typeof inputId !== "string" ||
                typeof inputName !== "string" ||
                !idHtml ||
                !idHtml.reportValidity() ||
                !nameHtml ||
                !nameHtml.reportValidity()
            ) {
                $("#children-success-text").hide();
                $("#children-error-text").text("入力が不正です");
                $("#children-error-text").show();
                return false;
            }

            // 入力された文字列を分割して配列にする
            const idList = inputId.split(",");
            const nameList = inputName.split(",");

            // 入力された数が違ったらエラーメッセージを表示してfalseを返す
            if (idList.length !== nameList.length) {
                $("#children-success-text").hide();
                $("#children-error-text").text("IDと名前の数が一致しません");
                $("#children-error-text").show();
                return false;
            }

            // IDと名前が一致するかチェック
            if (await this.childrenCheck(idList, nameList)) {
                // 一致したらOKメッセージを表示してtrueを返す
                $("#children-error-text").hide();
                $("#children-success-text").show();

                // 子供のIDリストを更新
                this.childrenList = zip(idList, nameList);
                return true;
            } else {
                // 一致しなかったらエラーメッセージを表示してfalseを返す
                $("#children-success-text").hide();
                $("#children-error-text").text("見つかりませんでした");
                $("#children-error-text").show();
                return false;
            }
        },
        /**
         * IDと名前が存在かつ一致するかチェック
         * @param inputId 入力されたID
         * @param inputName 入力された名前
         * @returns 存在かつ一致すればtrue そうでなければfalse
         */
        async childrenCheck(inputId: string[], inputName: string[]) {
            // 配列の長さだけ繰り返し
            for (let i = 0; i < inputId.length; i++) {
                // id/入力されたid のドキュメントを取得
                const idDocument = (
                    await getDoc(
                        doc(db, `id/${inputId[i]}`).withConverter(idConverter)
                    )
                ).data();

                // 存在しなかったらfalseを返す
                if (!idDocument) {
                    return false;
                }

                // 存在した場合は取得したuidをもとに生徒情報を取得
                const stuDocument = (
                    await getDoc(
                        doc(db, `users/${idDocument.uid}`).withConverter(
                            stuDataConverter
                        )
                    )
                ).data();

                // 存在しない or 生徒ではない or 名前が一致しない場合はfalseを返す
                if (
                    !stuDocument ||
                    stuDocument.type !== "student" ||
                    stuDocument.last_name + stuDocument.first_name !==
                        inputName[i]
                ) {
                    return false;
                }
            }

            // 全て存在かつ一致していたらtrueを返す
            return true;
        },
        /**
         * 入力画面と確認画面の切り替え
         * @param type 入力->確認なら1 確認->入力なら0
         */
        async change(type: number) {
            if (type) {
                // 入力されたIDがすでに使われていたら切り替えを中断してIDの入力欄にフォーカス
                if (this.idList.has(this.userId)) {
                    $("#user-id").trigger("focus");
                    return;
                }

                // 保護者かつ子供のIDと名前が一致しなかったら切り替えを中断して子供の入力欄にフォーカス
                if (
                    this.accountType === "parent" &&
                    !(await this.childrenCollation())
                ) {
                    $("#children-id").trigger("focus");
                    return;
                }
                $("#def").hide();
                $("#hide").show();
            } else {
                $("#def").show();
                $("#hide").hide();
            }
        },
        /**
         * 入力欄のリセット
         */
        reset() {
            this.accountType = "" as userType;
            this.userId = "";
            this.email = "";
            this.password = "";
            this.lastName = "";
            this.lastNameKana = "";
            this.firstName = "";
            this.firstNameKana = "";
            this.birthDate = "";
            this.sex = "" as "0" | "1" | "2" | "9";
            this.tel = "";
            this.childrenList = [];
        },
    },
});

// メールの再送信が押された場合の処理 なんかうまくいかないけど優先度低いのでパス
$(document).on("click", "#retransmission", async () => {
    const user = await getUserData();
    if (!user) {
        console.log("null");
        return;
    }
    await sendEmailVerification(user);
});
