import { auth, db } from "../firebase/firebaseConfig";
import {
    signInWithEmailAndPassword,
    AuthErrorCodes,
    sendEmailVerification,
    signOut,
} from "firebase/auth";
import getUid from "../components/getUid";
import { doc, getDoc } from "firebase/firestore";
import { userDataConverter } from "../firebase/firestoreTypes";
import $ from "jquery";

let isEmailLogin = true;

$("form").on("submit", async () => {
    // 入力された値を取得
    let email = $("#email").val() as string;
    const id = $("#id").val() as string;
    const password = $("#inputed-password").val() as string;

    // IDでのログインだった場合
    if (!isEmailLogin) {
        // uid取得
        const uid = await getUid(id);
        if (!uid) {
            alert("IDが間違っています");
            return;
        }

        // メールアドレスを取得
        email = (
            await getDoc(
                doc(db, `users/${uid}`).withConverter(userDataConverter)
            )
        ).data()!.mail;
    }

    // ログイン
    await signInWithEmailAndPassword(auth, email, password)
        // 成功時
        .then(async (userCredential) => {
            const user = userCredential.user;

            // 認証済みでない場合
            if (!user.emailVerified) {
                alert(
                    `メールアドレスの認証がされていません\n${user.email}に送信されたURLをクリックして認証を完了させてください`
                );
                // 認証メール送信
                await sendEmailVerification(user);
                await signOut(auth);
                return;
            }

            // ユーザーのデータを取得
            const userData = (
                await getDoc(
                    doc(db, `users/${user.uid}`).withConverter(
                        userDataConverter
                    )
                )
            ).data()!;

            // ユーザータイプ
            const userType = userData.type;

            // タイプによって別のページに飛ばす
            if (userType === "student") {
                location.href = "./student/";
            } else if (userType === "teacher") {
                location.href = "./teacher/";
            } else {
                location.href = "./parents/";
            }
        })

        // エラー時
        .catch((e) => {
            // エラーメッセージ
            const errorCode = e.code;
            if (
                errorCode === AuthErrorCodes.USER_DELETED ||
                errorCode === AuthErrorCodes.INVALID_PASSWORD
            ) {
                alert("メールアドレスもしくはパスワードが間違っています");
            } else {
                alert(errorCode);
            }
        });
});

// IDでログイン or メールアドレスでログインが押されたら
$(".change").on("click", () => {
    if (isEmailLogin) {
        $(".hide").show();
        $(".def").hide();
    } else {
        $(".hide").hide();
        $(".def").show();
    }
    isEmailLogin = !isEmailLogin;
});
