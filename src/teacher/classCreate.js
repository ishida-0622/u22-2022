// import getUserData from "../auth/userData";

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

    element.insertAdjacentHTML(
        "beforeend",
        "<tr><td>" +
            "生徒名" +
            "</td><td>" +
            "生徒ID" +
            "</td><td>" +
            "学年" +
            "</td><td>" +
            "レート" +
            "</td></tr>"
    );
    $(".del-button").slideToggle(0);
};

$(function () {
    $("#add-input-form").on("click", async () => {
        const addid = document.getElementById("id-text");
    });
});

// mainを実行
main();
