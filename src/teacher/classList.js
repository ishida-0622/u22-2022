import getClassList from "../components/getClassList";
import getClassData from "../components/getClassData";
import getTeacherData from "../components/getTeacherData";
import getUserData from "../auth/getUserData";
import $ from "jquery";
import { db } from "../firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

/**
 * クラス一覧画面のjs
 */
const main = async () => {
    // 現在ログイン出来ているかどうかを確認　出来ていなければログイン画面に飛ばす
    const userData = getUserData();
    if (userData === null) {
        window.location.href = "/login.html";
        return;
    }

    // useridを変数に代入
    const uid = userData.uid;

    // classListを変数に代入
    const classList = await getClassList(uid);

    //　HTML 要素を取得
    const element = document.getElementById("class-list");

    // クラス一覧の表示
    classList.forEach(async (value) => {
        // クラスデータを取得
        const classData = await getClassData(value);

        // クラスを担当する講師名を取得
        const teacherDocument = await getTeacherData(classData.teachers[0]);

        // 講師名を変数に代入
        const teacherName =
            teacherDocument.last_name + " " + teacherDocument.first_name;

        if (classData !== null) {
            // tableの中身を表示
            element.insertAdjacentHTML(
                "beforeend",
                "<tr><td>" +
                    classData.class_name +
                    "</td><td>" +
                    teacherName +
                    // クラス削除ボタンで表示非表示の切り替え
                    `</td><td class = "del-button"><button id = "${classData.class_name}" class="del-class-button">消去</button></td></tr>`
            );
            $(".del-button").slideToggle(0);
        }
    });
};

/**
 * クラスを削除する
 * 削除が実行出来たかどうかを bool型で返す
 * @param {string} className クラス名
 */
const delClass = async (className) => {
    // クラスデータを取得
    const document = await getClassData(className);

    // return用の変数の初期設定
    let res = false;

    // クラスデータがnullならば faluse を返す
    if (document === null) {
        return res;
    }

    // teachers/class/class-name の一致する class-name を削除する
    document.teachers.forEach(async (teacherName) => {
        await deleteDoc(doc(db, `users/${teacherName}/class/${className}`));
    });

    // classのclassNameのドキュメントを削除する関数
    await deleteDoc(doc(db, `class/${className}`))
        .then(() => {
            res = true;
        })
        .catch(() => {
            res = false;
        });
    return res;
};

// クリックをされた時、delClassを実行
$(function () {
    $("#show-del-button").on("click", async () => {
        // 削除ボタンを表示する
        $(".del-button").slideToggle(0);
    });

    $(document).on("click", ".del-class-button", async (event) => {
        // 「OK」時の処理開始 ＋ 確認ダイアログの表示
        if (window.confirm(event.target.id + "を削除しても良いですか？")) {
            await delClass(event.target.id);

            // リロード
            location.reload();
        }
        // 「OK」時の処理終了

        // 「キャンセル」時の処理開始
        else {
            // 警告ダイアログを表示
            window.alert("キャンセルされました");
        }
        // 「キャンセル」時の処理終了
    });
});

// mainを実行
main();
