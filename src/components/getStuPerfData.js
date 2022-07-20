import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { stuClassDataConverter } from "../firebase/firestoreTypes";
import getStuData from "./getStuData";

/**
 * usersの中からidが一致する生徒のクラスごとの成績(レート)を全クラス分配列で取得する
 * @param {string} uid ログイン状態のユーザのuid
 * @returns idがuidに一致する生徒のクラスごとの成績(レート)を全クラス分配列
 */
const getStuPerfData = async (uid) => {
    // 生徒でなかった場合はnullを返却
    if (getStuData(uid) === null) {
        return null;
    }

    // firestoreのusersから、idがuidに一致する生徒のクラスのドキュメントｗ全て取得する
    const firestoreCollection = await getDocs(
        collection(db, `users/${uid}/class`).withConverter(
            stuClassDataConverter
        )
    );

    //クラスごとの成績(レート)を配列に代入
    const documents = firestoreCollection.docs.map((doc) => doc.data());

    // 変数に代入したデータを返す
    return documents;
};

export default getStuPerfData;
