import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import $ from "jquery";

const main = async () => {
    const mail = document.querySelector("input")!.value;
    await sendPasswordResetEmail(auth, mail, {
        url: `${location.protocol}//${location.host}/login.html`,
    })
        .then(() => {
            alert(`${mail}にパスワードのリセットメールを送信しました`);
        })
        .catch((e) => {
            alert("メールの送信に失敗しました");
            console.error(e.code);
        });
    return false;
};

$("form").on("submit", main);
