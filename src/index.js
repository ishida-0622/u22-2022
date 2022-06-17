import signUp from "./auth/signup";
import $ from "jquery"
import getUserData from "./auth/userData"

$(function () {
    $("#main").on("click", async () => {
        // signUp("test001@example.com", "pass00");
        console.log(getUserData());
        // window.location.href = '/test.html';
    });
});
