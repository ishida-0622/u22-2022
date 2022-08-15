import getUserData from "../auth/getUserData";
import $ from "jquery";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import getTestData from "../components/getTestData";
import getClassList from "../components/getClassList";

/**
 * ユーザ情報参照画面のjs
 */
const main = async () => {
    const userData = await getUserData();
    if (userData === null) {
        return;
    }

    // useridを変数に代入
    const uid = userData.uid;

    // getClassListでuidに対応したクラス名の配列を取得
    const classList = await getClassList(uid);

    //select要素を取得する
    const selectClassName = document.getElementById("class_name");

    classList.forEach((val) => {
        //option要素を新しく作る
        const option = document.createElement("option");

        //option要素にvalueと表示名を設定
        option.value = val;
        option.textContent = val;

        //select要素にoption要素を追加する
        selectClassName.appendChild(option);
    });
};

const testRegister = async () => {
    // テスト名をHTMLから取得し変数に代入
    const testName = document.getElementById("test_name").value;

    // HTML要素を取得し、変数に代入
    const setTestData = {
        test_name: testName,
        class_name: document.getElementById("class_name").value,
        max_score: document.getElementById("max_score").value,
        min_score: document.getElementById("min_score").value,
        test_overview: document.getElementById("test_overview").value,
    };

    // 受け取った情報を送信
    await setDoc(doc(db, `tests/${testName}`), setTestData);
};

$(function () {
    $("#test-create").on("submit", async () => {
        // getTestDataでテスト名に対応した要素を取得、存在しない場合は"null"が返ってくる
        const isTestExist = await getTestData(
            document.getElementById("test_name").value
        );

        // 「OK」時の処理開始 ＋ 確認ダイアログの表示
        if (
            window.confirm(
                "以下の内容で登録してもよろしいですか？\n\nテスト名：" +
                    document.getElementById("test_name").value +
                    "\nクラス名：" +
                    document.getElementById("class_name").value +
                    "\n最高点：" +
                    // 点数をintからstringに変更
                    String(document.getElementById("max_score").value) +
                    "\n最低点：" +
                    String(document.getElementById("min_score").value) +
                    "\n[概要]\n" +
                    document.getElementById("test_overview").value
            )
        ) {
            // 取得した内容が"null"で無い場合、アラートを表示してreturn
            if (isTestExist !== null) {
                window.alert("そのテスト名は既に存在しています");
                return;
            }

            await testRegister();

            // トップ画面に遷移
            window.location.href = "test-list.html";
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
