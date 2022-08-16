import $ from "jquery";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

$("#logout").on("click", async () => {
    if (confirm("ログアウトしますか?")) {
        await signOut(auth).then(() => {
            window.location.href = "/login.html";
        });
    }
});
