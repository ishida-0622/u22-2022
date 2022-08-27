import fileDownload from "../storage/fileDownload";
import getUserData from "../auth/getUserData";
import getStuData from "../components/getStuData";

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
    if (!stuData) {
        return;
    }

    // ユーザ情報のドキュメントを取り出して変数に代入
    const firstName = stuData.first_name;
    const lastName = stuData.last_name;
    const firstNameKana = stuData.first_name_kana;
    const lastNameKana = stuData.last_name_kana;
    const sexNum = stuData.sex;

    const sex = sexNum === "1" ? "男" : sexNum === "2" ? "女" : "その他";

    const mail = stuData.mail;
    const birthday = stuData.birth_date.split("-");

    // 年、月、日をbirthdayから切り出して変数に代入
    const year = birthday[0];
    const month = birthday[1];
    const day = birthday[2];

    const tel = stuData.tel;

    // HTML要素を取得し、ユーザ情報を表示
    document.getElementById("first_name")!.textContent = firstName;
    document.getElementById("last_name")!.textContent = lastName;
    document.getElementById("first_name_kana")!.textContent = firstNameKana;
    document.getElementById("last_name_kana")!.textContent = lastNameKana;
    document.getElementById("sex")!.textContent = sex;
    document.getElementById("mail")!.textContent = mail;
    document.getElementById("birth_date")!.textContent =
        year + "/" + month + "/" + day;
    document.getElementById("tel")!.textContent = tel;

    const image = await fileDownload(uid);
    const imageElement = document.getElementById(
        "user-img"
    ) as HTMLImageElement | null;
    if (image && imageElement) {
        imageElement.src = image;
    }
};

main();
