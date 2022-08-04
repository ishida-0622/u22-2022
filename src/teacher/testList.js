import getClassList from "../components/getClassList";
import getTestList from "../components/getTestList";
import getTestData from "../components/getTestData";
import getUserData from "../auth/getUserData";
import $ from "jquery";
import { db } from "../firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

/**
 * テスト一覧画面のjs
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

    // classListを渡し、testListを変数に代入
    let testList = (await Promise.all(uclasses.map(async (classList) => await getTestList(uclass)))).flat();

    //　HTML 要素を取得
    const element = document.getElementById("test-list");

    // テスト一覧の表示
    testList.forEach(async (test) => {

        // テストデータを取得
        const testData = await getTestData(test);

        if (testData !== null) {
            // tableの中身を表示
            element.insertAdjacentHTML(
                "beforeend",
                "<tr><td>" +
                    test.test_name +
                    "</td><td>" +
                    test.max_score +
                    "</td><td>" +
                    test.min_score +
                    // テスト削除ボタンで表示非表示の切り替え
                    `</td><td class = "del-button"><button id = "${testData.test_name}" class="del-test-button">消去</button></td></tr>`
            );
            $(".del-button").slideToggle(0);
        }
    });
};

/**
 * テストを削除する
 * 削除が実行出来たかどうかを bool型で返す
 * @param {string} testName テスト名
 */
const delTest = async (testName) => {

    // テストデータを取得
    const document = await getTestData(testName);

    // return用の変数の初期設定
    let res = false;

    // テストデータがnullならば false を返す
    if (document === null) {
        return res;
    }

    // テストデータの所在を確認

    // students/tests/test-name の一致する test_name を削除する
    document.test_name.forEach(async (testName) => {
        await deleteDoc(doc(db, `users/${studentName}/tests/${testName}`));
    });

    // testのtestNameのドキュメントを削除する関数
    await deleteDoc(doc(db, `test/${testName}`))
        .then(() => {
            res = true;
        })
        .catch(() => {
            res = false;
        });
    return res;
};

// クリックをされた時、delTestを実行
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
