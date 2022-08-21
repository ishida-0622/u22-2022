import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    signOut,
    updatePassword,
} from "firebase/auth";
import $ from "jquery";
import getUserData from "./getUserData";
import { auth } from "../firebase/firebaseConfig";

const main = async () => {
    const password = $("#inputed-password").val() as string;
    const newPassword = $("#new-inputed-password").val() as string;
    const reNewPassword = $("#re-inputed-password").val() as string;
    if (newPassword !== reNewPassword) {
        alert("新しいパスワードが一致しません");
        return;
    }

    const user = await getUserData();
    if (!user) {
        return;
    }

    const credential = EmailAuthProvider.credential(user.email ?? "", password);
    await reauthenticateWithCredential(user, credential)
        .then(async () => {
            await updatePassword(user, newPassword)
                .then(async () => {
                    alert(
                        "パスワードを変更しました\n新しいパスワードで再度ログインしてください"
                    );
                    await signOut(auth);
                    location.href = "/login.html";
                })
                .catch((e) => {
                    const errorCode = e.code;
                    alert("パスワードの変更に失敗しました");
                    console.error(errorCode);
                });
        })
        .catch((e) => {
            const errorCode = e.code;
            alert("現在のパスワードが一致しません");
            console.error(errorCode);
        });
};

$("#password-change-form").on("submit", main);
