import { db } from "../firebase/firebaseConfig";
import { stuDataConverter } from "../firebase/firestoreTypes";
import { doc, getDoc } from "firebase/firestore";

/**
 * usersの中からidが一致するドキュメントを取得する
 * @param {string} uid ログイン状態のユーザのuid
 * @returns idがuidに一致するドキュメント
 */
const getStuData = async (uid) => {
    // firestoreのusersから、idがuidに一致する生徒情報のドキュメントを取得する
    const firestoreDoc = await getDoc(
        doc(db, `users/${uid}`).withConverter(stuDataConverter)
    );

    // オブジェクト型に変換する
    const document = firestoreDoc.data();

    // 存在していなかったらnullを返却
    if (document === undefined) {
        return null;
    }

    // 取得したドキュメントのタイプが生徒でなかった場合はnullを返却する
    if (document.type !== "student") {
        return null;
    }

    // ドキュメントを返却
    return document;
};

export default getStuData;
