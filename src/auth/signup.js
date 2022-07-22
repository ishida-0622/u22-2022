import { auth } from "../firebase/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    AuthErrorCodes,
    sendEmailVerification,
} from "firebase/auth";
import getUserData from "./getUserData";

const signUp = async (mail, pass) => {
    await createUserWithEmailAndPassword(auth, mail, pass)
        .then(async () => {
            const user = getUserData();
            await sendEmailVerification(user);
            // window.location.href = '/home.html';
        })
        .catch((e) => {
            const errorCode = e.code;
            if (errorCode === AuthErrorCodes.EMAIL_EXISTS) {
                alert("そのメールアドレスは使用されています");
            } else if (AuthErrorCodes.WEAK_PASSWORD) {
                alert("パスワードは6文字以上で入力してください");
            } else if (AuthErrorCodes.INVALID_EMAIL) {
                alert("メールアドレスの形式が正しくありません");
            } else {
                alert(errorCode);
            }
        });
};

export default signUp;
