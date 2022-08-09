import getUserData from "../auth/getUserData";
import getClassList from "../components/getClassList";
import getTestList from "../components/getTestList";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

// 各HTML要素を取得する
// テストセレクトボックスを含む要素を取得する
const selectTestWrap = document.querySelector("#test-selectbox");


// テストセレクトボックスのHTML要素を取得する
const selectBox = document.createElement("select");

// 点数入力欄のHTML要素を取得する
const scoreInputArea = document.querySelector("#score-input");

// 登録するボタンのHTML要素を取得する
const btn = document.querySelector("#cfm-dialog");

// ログイン中のユーザ（生徒）のIDを取得する
const uid = getUserData().uid;

/**
 * DBからテスト名を取得し、テストセレクトボックスに与える
 */
const main = async () => {
    // ユーザ（生徒）の所属しているクラス（複数の場合、配列）を取得する
    const uclasses = getClassList(uid);

    // クラスを渡し、テスト情報を取得する
    let tests = (
        await Promise.all(uclasses.map(async (val) => await getTestList(val)))
    ).flat();
    tests.unshift({ test_name: "未選択" });

    // DBから取得したテスト名を走査する
    tests.forEach((test) => {
        // option要素を生成する
        const option = document.createElement("option");

        // 画面表示用のテスト名を渡す
        option.textContent = test.test_name; // 画面表示用

        // 内部管理用のテスト名を取得する（画面表示用と同様）
        option.value = test.test_name;

        // テスト名をセレクトボックスに追加する
        selectBox.appendChild(option);
    });

    // テストセレクトボックスの要素selectをselectWrapに加える
    selectTestWrap.appendChild(selectBox);
};

/**
 * 点数入力欄に、点数の最低点未満または最高点より上の値が入力されたら、0にリセットする関数
 */
const scoreInput = () => {
    // 入力された値が最低点未満または最高点より上だった場合
    if (
        scoreInputArea.value < tests.min_score ||
        tests.max_score < scoreInputArea.value
    ) {
        // アラートで通知する
        alert(
            "テストの点数範囲外です。登録するにはテスト情報を更新してください。"
        );
    }
};

/**
 * テストの点数をDBに更新する関数
 * @param {string} uid テストを受験した生徒のID
 * @param {string} testName テスト
 * @param {number} score 点数
 */
const scoreUpdate = async (uid, testName, score) => {
    // アップデートするテストの点数の情報
    const updateUserData = {
        score: score,
    };

    // 該当する生徒のテストの点数が変更される
    await updateDoc(doc(db, `users/${uid}/tests/${testName}`), updateUserData);
};

/**
 * 登録の意思を確認するダイアログを表示する。
 */
const cfm = async () => {
    // テストセレクトボックスの値が未定義の場合
    if (selectBox.value == "未選択") {
        // テストの選択がないことをアラートで通知する
        alert("テストの選択がされていません");

        // 点数の入力がない場合
    } else if (String(scoreInputArea.value) == "") {
        // 点数の入力がないことをアラートで通知する
        alert("点数の入力がありません");

        // テストの選択および点数の入力がある場合
    } else {
        // 登録の意思を確認するダイアログを表示する
        const result = window.confirm("登録しますか？");

        // OKを選択されたら、
        if (result) {
            // 入力された情報をDBへ更新する
            await scoreUpdate(uid, selectBox.value, scoreInputArea.value);

            // 完了をアラートで通知する
            alert("登録が完了しました");
        } // キャンセルを選択されたら、何もしない
    }
};

// ページがロードされたら、テストセレクトボックスを表示する
window.addEventListener("load", main);

// 点数を入力されたら、不正な点数がないかどうかチェックする
window.addEventListener("change", scoreInput);

// 登録するボタンをクリックされたら、登録の意思を確認するダイアログを表示する
btn.addEventListener("click", cfm);
