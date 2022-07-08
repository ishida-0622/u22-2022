import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

/**
 * コレクションからuidが一致するドキュメントを持ってきて講師であればreturnする関数
 * @param {string} uid userid
 * @returns 講師のIDであれば連想配列、それ以外であればnull
 */
const getTeacherData = async (uid) => {
    // firestoreのusersコレクションからuidが一致するドキュメントを取得して変数に代入
    const firestoreDocument = await getDoc(doc(db, `users/${uid}`));

    // データを変数に代入
    const firestoreData = firestoreDocument.data();

    // データが無かったらエラー出力して終了
    if (firestoreData === undefined) {
        console.error("undefined");
        return null;
    }

    // uidが講師のものであればreturnする。それ以外であればnullで返す。
    if (firestoreData["type"] === "teacher") {
        return firestoreData;
    } else {
        return null;
    }
};

export default getTeacherData;
