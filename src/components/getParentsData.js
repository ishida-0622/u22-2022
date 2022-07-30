import { db } from "../firebase/firebaseConfig";
import { parentDataConverter } from "../firebase/firestoreTypes";
import { doc, getDoc } from "firebase/firestore";

/**
 * usersの中からuidが一致する保護者のドキュメントを取得する
 * @param {string} uid ログイン状態のユーザのuid
 * @returns 存在するかつ保護者のドキュメントならparentData型のオブジェクト、それ以外はnull
 */
const getParentsData = async (uid) => {
    // usersからuidが一致する保護者情報のドキュメントを取得する
    const firestoreDoc = await getDoc(
        doc(db, `users/${uid}`).withConverter(parentDataConverter)
    );

    // オブジェクト型に変換する
    const document = firestoreDoc.data();

    // 存在していなかったらnullを返却
    if (document === undefined) {
        return null;
    }

    // 取得したドキュメントのタイプが生徒でなかった場合はnullを返却する
    if (document.type !== "parent") {
        return null;
    }

    // ドキュメントを返却
    return document;
};

export default getParentsData;
