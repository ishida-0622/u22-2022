// import getUserData from "../auth/userData";
import $ from jQuery;

/**
 * クラス作成画面のjs
 */
const main = async () => {
    // 現在ログイン出来ているかどうかを確認　出来ていなければログイン画面に飛ばす
    // const userData = getUserData();
    // if (userData === null) {
    //     window.location.href = "/login.html";
    //     return;
    // }

    // // useridを変数に代入
    // const uid = userData.uid;

    const uid = "EjQWBubQ3oPR7KDOTplWxCLhe9b2";

    console.log("mainが実行されています。")
};



$(function () {
    $("#add-input-form").on("click", async () => {
        count=addForm(count);
    });

    $("#input-decision").on("click", async () => {
        console.log("実行されています。");
        let element = document.getElementById('class-list');
        element.insertAdjacentHTML(
            "beforeend",
            "<tr><td>" +
                "生徒名1" +
                "</td><td>" +
                "生徒ID1" +
                "</td></tr>"
        );
    });

});

// mainを実行
main();
