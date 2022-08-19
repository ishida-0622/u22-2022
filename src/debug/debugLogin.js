import $ from "jquery";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

$("form").on("submit", async () => {
    const mail = $("#email").val();
    const pass = $("#password").val();
    await signInWithEmailAndPassword(auth, mail, pass)
        .then(() => {
            $("p").text("ログイン完了");
        })
        .catch(() => {
            $("p").text("ログイン失敗");
        });
});
