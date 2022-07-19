import getClassList from "../components/getClassList";
import getClassData from "../components/getClassData";
import getTeacherData from "../components/getTeacherData";
// import getUserData from "../auth/userData";
import $ from "jquery";
import { db } from "../firebase/firebaseConfig";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
// import getUserData from "../auth/userData";

// const userData = await getUserData().uid;

// const uid = userData.uid;
const main = async () => {
    const uid = "zTp17yLgZOQqgIAQ1iAXFmnm2Lq2";

    const classList = await getClassList(uid);

    const element = document.getElementById("class-list");

    classList.forEach(async (value) => {
        const classData = await getClassData(value);
        const teacherDocument = await getTeacherData(classData.teachers[0]);
        const teacherName =
            teacherDocument.last_name + " " + teacherDocument.first_name;

        if (classData !== null) {
            element.insertAdjacentHTML(
                "beforeend",
                "<tr><td>" +
                    classData.class_name +
                    "</td><td>" +
                    teacherName +
                    `</td><td class = "del-button"><button id = "${classData.class_name}" class="del-class-button">消去</button></td></tr>`
            );
        }
    });
};

/**
 *
 * @param {string} className クラス名
 */
const delClass = async (className) => {
    const document = await getClassData(className);
    if (document === null) {
        return;
    }
    document.teachers.forEach(async (v) => {
        await deleteDoc(doc(db, `users/${v}/class/${className}`));
    });
    let res = false;
    // classのclassNameのドキュメントを削除
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
        $(".del-button").slideToggle("");
    });

    $(document).on("click", ".del-class-button", async (event) => {
        console.log("hello");
        // 「OK」時の処理開始 ＋ 確認ダイアログの表示
        if (window.confirm("本当にいいんですね？")) {
            await delClass(event.target.id);
            // リロード
            location.href = "./";
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

main();
