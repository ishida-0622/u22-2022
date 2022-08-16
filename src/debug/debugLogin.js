import $ from "jquery";
import login from "../auth/login";

$("form").on("submit", async () => {
    const mail = $("#email").val();
    const pass = $("#password").val();
    await login(mail, pass);
    $("p").text("ログイン完了");
});
