import getUserData from "../auth/getUserData";
import getStuData from "../components/getStuData";

/**
 * ユーザ情報参照画面のjs
 */
const main = async () => {
    // 現在ログイン出来ているかどうかを確認　出来ていなければログイン画面に飛ばす
    const userData = getUserData();
    if (userData === null) {
        window.location.href = "/login.html";
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
    const sexNum = stuData.sex;

    //デフォルトでは性別無し
    let sex = "";

    // "sex"の番号によって性別を判定
    if (sexNum == "1") {
        sex = "男";
    } else {
        sex = "女";
    }

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
    document.getElementById("sex").value = sex;
    document.getElementById("mail").value = mail;
    document.getElementById("birth_date").value =
        year + "/" + month + "/" + day;
    document.getElementById("tel").value = tel;
};

const userEdit = async () => {
    const registration = document.getElementById('registration_button');
 
    registration.addEventListener('click', function() {
  
      //submit()でフォームの内容を送信
      document.myform.submit();
    })
}

$(function () {

    $(document).on("click", ".registration_button", async (event) => {
        // 「OK」時の処理開始 ＋ 確認ダイアログの表示
        if (window.confirm("編集してもよろしいですか？")) {
            await userEdit();

            // リロード
            location.reload();
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

main();
