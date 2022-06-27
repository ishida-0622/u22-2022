import { auth } from '../firebase/firebaseConfig';
import {
    createUserWithEmailAndPassword,
    AuthErrorCodes,
    sendEmailVerification,
} from 'firebase/auth';
import getUserData from './userData';

const signUp = async (mail, pass) => {
    await createUserWithEmailAndPassword(auth, mail, pass)
        .then(async () => {
            const user = getUserData();
            await sendEmailVerification(user);
            // window.location.href = '/home.html';
        })
        .catch((e) => {
            switch (e.code) {
                case AuthErrorCodes.EMAIL_EXISTS:
                    alert('そのメールアドレスは使用されています');
                    break;
                case AuthErrorCodes.WEAK_PASSWORD:
                    alert('パスワードは6文字以上で入力してください');
                    break;
                case AuthErrorCodes.INVALID_EMAIL:
                    alert('メールアドレスの形式が正しくありません');
                    break;
                default:
                    alert(e.code);
            }
        });
};

export default signUp;
