import signUp from "./auth/signup";
import $ from "jquery"

$(function () {
    $("#main").on("click", () => {
        console.log(signUp("test001@example.com", "pass00"));
    });
});
