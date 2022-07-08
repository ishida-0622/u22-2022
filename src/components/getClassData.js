import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

/**
 * クラス名に対応するクラスの情報を返す
 * @param {string} className クラス名
 * @returns クラス名に対応するクラスの情報
 */
const getClassData = async (className) => {
    // firestoreのclassコレクションからclassNameが一致するドキュメントを取得して変数に代入
    const firestoreDocument = await getDoc(doc(db, `class/${className}`));

    // データを変数に代入
    const firestoreData = firestoreDocument.data();

    // 存在していなかったらnullを返す
    if (firestoreData === undefined) {
        return null;
    }

    // 変数に代入したデータを返す
    return firestoreData;
};

export default getClassData;
