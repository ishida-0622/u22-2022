import auth from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, AuthErrorCodes } from "firebase/auth"

const signUp = (mail, pass) => {
    createUserWithEmailAndPassword(auth, mail, pass).then(() => {
        // window.location.href = '/test.html';
    }).catch((e) => {
        switch (e.code) {
            case AuthErrorCodes.EMAIL_EXISTS:
                alert("そのメールアドレスは使用されています");
                break;
            case AuthErrorCodes.WEAK_PASSWORD:
                alert("パスワードは6文字以上で入力してください");
                break;
            case AuthErrorCodes.INVALID_EMAIL:
                alert("メールアドレスの形式が正しくありません");
                break;
            default:
                alert(e.code);
        }
    });
}

export default signUp;
