import $ from "jquery";
import getUserData from "../auth/getUserData";
import getStuData from "../components/getStuData";
import getUid from "../components/getUid";
import getClassData from "../components/getClassData";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

let stuids = new Set();

/**
 * クラス作成画面のjs
 */
const main = async () => {
    // 現在ログイン出来ているかどうかを確認　出来ていなければログイン画面に飛ばす
    const userData = await getUserData();
    if (userData === null) {
        return;
    }
};

// 生徒を消す関数
const stu_del = (id) => {
    document.getElementById(id).remove();
    stuids.delete(id);
};

// 日付を取得する関数
const getNowYMD = () => {
    const dt = new Date();
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth() + 1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    const result = y + m + d;
    return result;
};

$(function () {
    // クラス作成ボタンの処理
    $("#class-create").on("click", async () => {
        const className = document.getElementById("class-name").value;

        if (className == "") {
            alert("クラス名を入力してください");
            return;
        }

        if ((await getClassData(className)) !== null) {
            alert("そのクラス名はすでに存在します");
            return;
        }

        if (stuids.size === 0) {
            alert("生徒を追加してください");
            return;
        }

        if (!window.confirm("このクラスを登録してもよろしいですか？")) {
            return;
        }

        let stuUids = [];

        // 追加される生徒IDをUserIDに変換
        for (let val of stuids) {
            stuUids.push(await getUid(val));
        }

        // 担当講師のUserIDを取得
        const userData = await getUserData();
        const uid = userData.uid;

        // DBに登録するデータを作成
        const classData = {
            class_name: className,
            students: stuUids,
            teachers: [uid],
        };

        // DBに登録するデータを作成
        const userClassData = {
            class_name: className,
            rate: [
                {
                    date: getNowYMD(),
                    score: 1000,
                },
            ],
        };

        // 講師データの登録
        await setDoc(doc(db, "users", uid, "class", className), {
            class_name: className,
        });

        // 生徒データの登録
        stuUids.forEach(async (stuid) => {
            await setDoc(
                doc(db, "users", stuid, "class", className),
                userClassData
            );
        });

        // クラス名の登録
        await setDoc(doc(db, "class", className), classData);

        alert("追加されました");
        window.location.href = "./class-list.html";
    });

    // キャンセルボタンの処理
    $("#cancel").on("click", async () => {
        if (window.confirm("本当にキャンセルしてもよろしいですか？")) {
            window.location.href = "./class-list.html";
        }
    });

    // 生徒追加の確定ボタンの処理
    $("#input-decision").on("click", async () => {
        // inputの値をidに代入
        const id = document.getElementById("id-input").value;

        if (id === "") {
            alert("idを入力してください");
            return;
        }

        const uid = await getUid(id);

        const userData = await getStuData(uid);

        if (userData === null) {
            alert("存在しない生徒です");
            return;
        }

        if (stuids.has(id)) {
            alert("既に登録されている生徒です");
            document.getElementById("id-input").value = "";
            return;
        }

        // ダイアログの表示
        if (
            !window.confirm(
                "この生徒を登録してもよろしいですか？\n" +
                    `生徒名:${userData.last_name} ${userData.first_name}\n` +
                    `生徒ID:${id}`
            )
        ) {
            return;
        }

        const element = document.getElementById("class-list");

        // tableに要素を追加
        element.insertAdjacentHTML(
            "beforeend",
            `<tr id="${id}" ><td>` +
                userData.last_name +
                " " +
                userData.first_name +
                "</td><td>" +
                id +
                `</td></tr>`
        );

        // テーブルの削除ボタンの設定
        const button = document.createElement("button");
        button.textContent = "削除";
        button.addEventListener("click", () => stu_del(id));
        const td = document.createElement("td");
        td.appendChild(button);
        document.getElementById(id).appendChild(td);

        // 配列にidを追加
        stuids.add(id);
        document.getElementById("id-input").value = "";
    });
});

// mainを実行
main();
