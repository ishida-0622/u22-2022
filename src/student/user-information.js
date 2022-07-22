import getUserData from "../auth/getUserData";
import getStuData from "../components/getStudata";

const main = async () => {
    const userData = getUserData();
    if (userData === null) {
        window.location.href = "/login.html";
        return;
    }

    const uid = userData.uid;
    const stuData = await getStuData(uid);

    const firstName = stuData.first_name;
    const lastName = stuData.last_name;
    const firstNameKana = stuData.first_name_kana;
    const lastNameKana = stuData.last_name_kana;
    const sexNum = stuData.sex;
    let sex = "";
    if (sexNum == "1") {
        sex = "男";
    } else {
        sex = "女";
    }
    const mail = stuData.mail;
    const birthday = stuData.birth_date;
    const year = birthday.substring(0, 4);
    const month = birthday.substring(4, 6);
    const day = birthday.substring(6, 8);
    const tel = stuData.tel;

    document.getElementById("first_name").innerHTML = firstName;
    document.getElementById("last_name").innerHTML = lastName;
    document.getElementById("first_name_kana").innerHTML = firstNameKana;
    document.getElementById("last_name_kana").innerHTML = lastNameKana;
    document.getElementById("sex").innerHTML = sex;
    document.getElementById("mail").innerHTML = mail;
    document.getElementById("birth_date").innerHTML =
        year + "/" + month + "/" + day;
    document.getElementById("tel").innerHTML = tel;
};
