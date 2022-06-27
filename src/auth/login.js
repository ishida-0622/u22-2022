import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";

const login = (mail, pass) => {
    signInWithEmailAndPassword(auth, mail, pass)
        .then(() => {
            // window.location.href = '/test.html';
        })
        .catch((e) => {
            const errorCode = e.code;
            if (
                errorCode === AuthErrorCodes.USER_DELETED ||
                errorCode === AuthErrorCodes.INVALID_PASSWORD
            ) {
                alert("メールアドレスもしくはパスワードが間違っています");
            } else {
                alert(errorCode);
            }
        });
};

export default login;
