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
    if (!userData) {
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

    const tel = stuData.tel;

    // HTML要素を取得し、ユーザ情報を表示
    document.getElementById("first_name").value = firstName;
    document.getElementById("last_name").value = lastName;
    document.getElementById("first_name_kana").value = firstNameKana;
    document.getElementById("last_name_kana").value = lastNameKana;
    document.getElementById("mail").value = mail;
    document.getElementById("birth_date").value = birthday;
    document.getElementById("tel_number").value = tel;
};

const userEdit = async () => {
    const userData = getUserData();

    //userIDを変数に代入
    const uid = userData.uid;

    // HTML要素を取得し、変数に代入
    const updateUserData = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        first_name_kana: document.getElementById("first_name_kana").value,
        last_name_kana: document.getElementById("last_name_kana").value,
        mail: document.getElementById("mail").value,
        birth_date: document.getElementById("birth_date").value,
        tel: document.getElementById("tel_number").value,
    };

    // 受け取った情報を送信
    await updateDoc(doc(db, `users/${uid}`), updateUserData);
};

$(function () {
    $("#user_information_edit").on("submit", async () => {
        if (window.confirm("編集してもよろしいですか？")) {
            await userEdit();
            window.location.href = "./user-information.html";
        } else {
            window.alert("キャンセルされました");
        }
    });
});

main();
