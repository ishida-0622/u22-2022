import getUserData from "../auth/getUserData";
import getTestData from "../components/getTestData";
import getClassList from "../components/getClassList";
import getTestList from "../components/getTestList";
import getStuInClass from "../components/getStuInClass";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

// 各HTML要素を取得する
// テストセレクトボックスを含む要素を取得する
const selectTestWrap = document.querySelector("#test-selectbox");

// テストセレクトボックスを生成し、HTML要素を取得する
const selectBox = document.createElement("select");

// テーブルを生成し、HTML要素を取得する
const tbl = document.querySelector("table");

// 登録ボタンのHTML要素を取得する
const btn = document.querySelector("#cfm-dialog");

// ログイン中のユーザ（講師）のIDを取得する
const uid = getUserData().uid;

// ユーザ（講師）の所属しているクラス（複数の場合、配列）を取得する
const uclasses = getClassList(uid);

/**
 * DBからテスト名を取得し、テストセレクトボックスに与える
 */
const main = async () => {
    // クラスを渡し、テスト情報を取得する
    let tests = (
        await Promise.all(
            uclasses.map(async (uclass) => await getTestList(uclass))
        )
    ).flat();

    // テストのデフォルト値を設定する
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
 * DBからクラスの生徒名を取得し、テーブルを追加する
 */
const addTable = async () => {
    // 選択されたテストを渡してテストデータを取得し、テストのクラス名を取得する
    const testClass = await getTestData(selectBox.value);
    if (testClass === null) {
        return;
    }

    // クラスに所属する生徒情報を取得する
    const stuDatas = await getStuInClass(testClass.class_name);
    if (stuDatas === null) {
        return;
    }

    // 入力があったら、scoreCheckを実行する
    const scoreInput = (event) => {
        scoreCheck(event.target.value);
    };

    // 生徒名を走査する
    stuDatas.forEach((stu) => {
        // テーブルに１行追加する
        const row = tbl.insertRow(-1);

        // 生徒名のセルを生成する
        const stuCell = row.insertCell(-1);

        // 生徒名のセルに取得した生徒名を挿入する
        stuCell.innerHTML = `<p>${stu.last_name}${stu.first_name}</p>`;

        // 点数入力欄のセルを生成する
        const scoreCell = row.insertCell(-1);

        // 入力欄を設け、HTML要素を取得する
        const element = document.createElement("input");

        // 入力欄のデータ型numberにする
        element.type = "number";

        // 各セルのidを各生徒idで設定する
        element.id = stu.id;

        // 入力欄に操作があったら、scoreInputを実行する
        element.addEventListener("input", scoreInput);

        // 設定した入力欄を点数入力欄にする
        scoreCell.appendChild(element);
    });
};

/**
 * 点数入力欄に、点数の最低点未満または最高点より上の値が入力されたら、アラートで通知する関数
 * @param socre 入力された点数
 */
const scoreCheck = (score) => {
    // 入力された点数が、テストの点数の範囲外であった場合
    if (Number(score) < tests.min_score || tests.max_score < Number(score)) {
        // アラートで通知する
        alert(
            "範囲外の点数が入力されました。登録するには、テスト情報を編集して下さい。"
        );
    }
};

/**
 * テストの情報をDBに更新する関数
 * @param {string} uid 登録をしている講師のuid
 * @param {string} testName テスト名
 * @param {number} minScore 最低得点
 * @param {number} maxScore 最高得点
 */
const testUpdate = async (uid, testName, minScore, maxScore) => {

    // アップデートするテストの点数の情報
    const updateUserData = {
        score: score,
    };

    // 該当するテストの情報が変更される
    await updateDoc(doc(db, `users/${uid}/tests/${testName}`), updateUserData);
};

/**
 * 登録の意思を確認するダイアログを表示する。
 */
const cfm = () => {

    // 最低得点と最高得点の入力欄のHTML要素を取得する
    const minElement = document.getElementById("min-score");
    const maxElement = document.getElementById("max-score");

    // テストセレクトボックスの値が未定義の場合
    if (selectBox.value == "未選択") {

        // テストの選択がないことをアラートで通知する
        alert("テストの選択がされていません。");

    // 最低得点または最高得点の入力に、マイナスの値が含まれる場合
    } else if (( minElement.value < 0 ) || ( maxElement.value < 0 )) {
        alert("マイナスの得点は登録できません。");

    // 上記の問題がない場合
    } else {

        // 登録の意思を確認するダイアログを表示する
        const result = window.confirm("登録しますか？");

        // OKを選択されたら、
        if (result) {

            // テスト名と最低得点、最高得点をtestUpdateに渡し、DBを更新する
            await testUpdate(uid, selectBox.value, minElement.value, maxElement.value);
            };

            // 正常完了をアラートで通知する
            alert("登録が完了しました");
    }
};

// ページがロードされたら、テストセレクトボックスを画面に表示する
window.addEventListener("load", main);

// 登録するボタンをクリックされたら、登録の意思を確認するダイアログを表示する
btn.addEventListener("click", cfm);
