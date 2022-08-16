import getUserData from "../auth/getUserData";
import getStuData from "../components/getStuData";
import $ from "jquery";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

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

    // stuDataを変数に代入
    const stuData = await getStuData(uid);

    // ユーザ情報のドキュメントを取り出して変数に代入
    const firstName = stuData.first_name;
    const lastName = stuData.last_name;
    const firstNameKana = stuData.first_name_kana;
    const lastNameKana = stuData.last_name_kana;
    const mail = stuData.mail;
    const birthday = stuData.birth_date;

    // 年、月、日をbirthdayから切り出して変数に代入
    const year = birthday.substring(0, 4);
    const month = birthday.substring(4, 6);
    const day = birthday.substring(6, 8);

    const tel = stuData.tel;

    // HTML要素を取得し、ユーザ情報を表示
    document.getElementById("first_name").value = firstName;
    document.getElementById("last_name").value = lastName;
    document.getElementById("first_name_kana").value = firstNameKana;
    document.getElementById("last_name_kana").value = lastNameKana;
    document.getElementById("mail").value = mail;
    document.getElementById("birth_date").value =
        year + "-" + month + "-" + day;
    document.getElementById("tel_number").value = tel;
};

const userEdit = async () => {
    const userData = getUserData();

    //userIDを変数に代入
    const uid = userData.uid;

    // replaceAllの処理のため先に生年月日を変数に代入
    const birthDate = document.getElementById("birth_date").value;

    // HTML要素を取得し、変数に代入
    const updateUserData = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        first_name_kana: document.getElementById("first_name_kana").value,
        last_name_kana: document.getElementById("last_name_kana").value,
        mail: document.getElementById("mail").value,

        // replaceAllで type="date" の内容を変形
        birth_date: birthDate.replaceAll("-", ""),

        tel: document.getElementById("tel_number").value,
    };

    // 受け取った情報を送信
    await updateDoc(doc(db, `users/${uid}`), updateUserData);
};

$(function () {
    $("#user_information_edit").on("submit", async () => {
        // 「OK」時の処理開始 ＋ 確認ダイアログの表示
        if (window.confirm("編集してもよろしいですか？")) {
            await userEdit();

            // ユーザ情報参照画面に遷移
            window.location.href = "./user-information.html";
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
// setTimeout(main, 600);
main();
