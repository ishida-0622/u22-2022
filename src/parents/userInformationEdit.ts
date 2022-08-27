import getUserData from "../auth/getUserData";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import getParentsData from "../components/getParentsData";

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
    const parentData = await getParentsData(uid);
    if (!parentData) {
        return;
    }

    // ユーザ情報のドキュメントを取り出して変数に代入
    const firstName = parentData.first_name;
    const lastName = parentData.last_name;
    const firstNameKana = parentData.first_name_kana;
    const lastNameKana = parentData.last_name_kana;
    const tel = parentData.tel;

    // HTML要素を取得し、ユーザ情報を表示
    (document.getElementById("first_name") as HTMLInputElement).value =
        firstName;
    (document.getElementById("last_name") as HTMLInputElement).value = lastName;
    (document.getElementById("first_name_kana") as HTMLInputElement).value =
        firstNameKana;
    (document.getElementById("last_name_kana") as HTMLInputElement).value =
        lastNameKana;
    (document.getElementById("tel_number") as HTMLInputElement).value = tel;
};

const userEdit = async () => {
    const userData = await getUserData();
    if (!userData) {
        return;
    }

    //userIDを変数に代入
    const uid = userData.uid;

    // HTML要素を取得し、変数に代入
    const updateUserData = {
        first_name: (document.getElementById("first_name") as HTMLInputElement)
            .value,
        last_name: (document.getElementById("last_name") as HTMLInputElement)
            .value,
        first_name_kana: (
            document.getElementById("first_name_kana") as HTMLInputElement
        ).value,
        last_name_kana: (
            document.getElementById("last_name_kana") as HTMLInputElement
        ).value,
        tel: (document.getElementById("tel_number") as HTMLInputElement).value,
    };

    // 受け取った情報を送信
    await updateDoc(doc(db, `users/${uid}`), updateUserData);
};

const form = document.getElementById("user_information_edit");
if (form) {
    form as HTMLFormElement;
    form.onsubmit = async (e) => {
        e.preventDefault();
        if (window.confirm("編集してもよろしいですか？")) {
            await userEdit();
            window.location.href = "./user-information.html";
        }
    };
}

main();
