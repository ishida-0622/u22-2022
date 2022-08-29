import getClassList from "../components/getClassList";
import getTestList from "../components/getTestList";
import getTestData from "../components/getTestData";
import getUserData from "../auth/getUserData";
import getClassData from "../components/getClassData";
import $ from "jquery";
import { db } from "../firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

/**
 * テスト一覧画面のjs
 */
const main = async () => {
    // ユーザ情報を取得する
    const userData = await getUserData();

    if (userData === null) {
        return;
    }

    // uidを変数に代入する
    const uid = userData.uid;

    // classList（クラス名の配列）を取得し、変数に代入する
    const classList = await getClassList(uid);

    // classListを渡し、testList（テスト情報）を変数に代入する
    const testList = (
        await Promise.all(
            classList.map(async (className) => await getTestList(className))
        )
    ).flat();

    // テスト一覧を表示するテーブル部分のHTML要素を取得する
    const element = document.getElementById("test-list");

    // テスト情報を走査し、テスト一覧の表示する
    testList.forEach(async (test) => {
        // tableの中身を表示
        element.insertAdjacentHTML(
            "beforeend",
            "<tr><td>" +
                // テスト名
                test.test_name +
                "</td><td>" +
                // クラス名
                test.class_name +
                "</td><td>" +
                // テストの最高得点
                test.max_score +
                "</td><td>" +
                // テストの最低得点
                test.min_score +
                // テスト削除ボタンで表示非表示の切り替え
                `</td><td class = "del-button"><button id = "${test.test_name}" class="del-test-button">消去</button></td></tr>`
        );
    });
    $(".del-button").slideToggle(0);
};

/**
 * テストを削除する
 * 削除が実行出来たかどうかを bool型で返す
 * @param {string} testName テスト名
 */
const delTest = async (testName) => {
    // 取得したテスト名に一致するテストの情報を取得し、testDataに代入する
    const testData = await getTestData(testName);

    // testDataが属するクラスの情報を取得する
    const classData = await getClassData(testData.class_name);

    // classDataの生徒IDを走査し、user/${生徒のID}/tests/${テスト名} の一致するドキュメントを削除する
    classData.students.forEach(async (stuId) => {
        await deleteDoc(doc(db, `users/${stuId}/class/tests/${testName}`));
    });

    // tests内のtestNameに一致するドキュメントを削除する関数
    await deleteDoc(doc(db, `tests/${testName}`));
};

$(function () {
    $("#show-del-button").on("click", async () => {
        // 削除ボタンを表示する
        $(".del-button").slideToggle(0);
    });

    $(document).on("click", ".del-test-button", async (event) => {
        // 「OK」時の処理開始 ＋ 確認ダイアログの表示
        if (window.confirm(event.target.id + "を削除しても良いですか？")) {
            await delTest(event.target.id);
            // リロード
            location.reload();
        }

        // 「キャンセル」時の処理開始
        else {
            // 警告ダイアログを表示
            window.alert("キャンセルされました");
        }
    });
});

main();
