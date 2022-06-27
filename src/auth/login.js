import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, AuthErrorCodes } from "firebase/auth"

const login = (mail, pass) => {
    signInWithEmailAndPassword(auth, mail, pass).then(() => {
        // window.location.href = '/home.html';
    }).catch((e) => {
        switch (e.code) {
            case AuthErrorCodes.USER_DELETED:
            case AuthErrorCodes.INVALID_PASSWORD:
                alert("メールアドレスもしくはパスワードが間違っています");
                break;
            default:
                alert(e.code);
        }
    });
}

export default login;
