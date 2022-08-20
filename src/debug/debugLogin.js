import $ from "jquery";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

$("form").on("submit", async () => {
    const mail = $("#email").val();
    const pass = $("#inputed-password").val();
    await signInWithEmailAndPassword(auth, mail, pass)
        .then(() => {
            $("#debug").text("ログイン完了");
        })
        .catch(() => {
            $("#debug").text("ログイン失敗");
        });
});
