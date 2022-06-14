import signUp from "./auth/signup";
import $ from "jquery"

$(function () {
    $("#main").on("click", () => {
        signUp("test001@example.com", "pass00");
    });
});
