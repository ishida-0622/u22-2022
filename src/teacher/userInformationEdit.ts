import getUserData from "../auth/getUserData";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import getTeacherData from "../components/getTeacherData";
import imagePreview from "../pageComponents/imagePreview";
import fileUpload from "../storage/fileUpload";
import fileDownload from "../storage/fileDownload";

/**
 * ユーザ情報参照画面のjs
 */
const main = async () => {
    const userData = await getUserData();
    if (!userData) {
        return;
    }
    const uid = userData.uid;

    const teacherData = await getTeacherData(uid);
    if (!teacherData) {
        return;
    }

    // ユーザ情報のドキュメントを取り出して変数に代入
    const firstName = teacherData.first_name;
    const lastName = teacherData.last_name;
    const firstNameKana = teacherData.first_name_kana;
    const lastNameKana = teacherData.last_name_kana;
    const tel = teacherData.tel;

    // HTML要素を取得し、ユーザ情報を表示
    (document.getElementById("first_name") as HTMLInputElement).value =
        firstName;
    (document.getElementById("last_name") as HTMLInputElement).value = lastName;
    (document.getElementById("first_name_kana") as HTMLInputElement).value =
        firstNameKana;
    (document.getElementById("last_name_kana") as HTMLInputElement).value =
        lastNameKana;
    (document.getElementById("tel_number") as HTMLInputElement).value = tel;

    const image = await fileDownload(uid);
    if (image) {
        (document.getElementById("user-img") as HTMLImageElement).src = image;
    }
};

const userEdit = async () => {
    const userData = (await getUserData())!;
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

    if (
        fileInputElement &&
        imageElement &&
        imageElement.src !== "../images/icon.png"
    ) {
        await fileUpload(uid, fileInputElement);
    }
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

const fileInputElement = document.getElementById(
    "icon-file"
) as HTMLInputElement | null;
const imageElement = document.getElementById(
    "user-img"
) as HTMLImageElement | null;

if (fileInputElement && imageElement) {
    fileInputElement.onchange = () => {
        imagePreview(fileInputElement, imageElement);
    };
}
