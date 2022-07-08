import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

/**
 * @param {string} uid ログイン状態のユーザのuid
 * @returns idがuidに一致するドキュメント
 */
const getStuData = async (uid) => {
    // firestoreのusersから、idがuidに一致する生徒情報のドキュメントを取得する
    const firestoreDoc = await getDoc(doc(db, `users/${uid}`));

    // オブジェクト型に変換する
    const document = firestoreDoc.data();

    // 取得したドキュメントのタイプが生徒でなかった場合はnullを返却する
    if (document["type"] !== "student") {
        return null;
    }

    // ドキュメントを返却
    return document;
};

export default getStuData;
