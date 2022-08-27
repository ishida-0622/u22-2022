import fileDownload from "../storage/fileDownload";
import getUserData from "../auth/getUserData";
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
    const sexNum = parentData.sex;

    const sex = sexNum === "1" ? "男" : sexNum === "2" ? "女" : "その他";

    const mail = parentData.mail;
    const birthday = parentData.birth_date.split("-");

    // 年、月、日をbirthdayから切り出して変数に代入
    const year = birthday[0];
    const month = birthday[1];
    const day = birthday[2];

    const tel = parentData.tel;

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
