import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

/**
 * usersの中からidが一致する生徒のクラスごとの成績(レート)を全クラス分配列で取得する
 * @param {string} uid ログイン状態のユーザのuid
 * @returns idがuidに一致する生徒のクラスごとの成績(レート)を全クラス分配列
 */
const getStuPerfData = async (uid) => {
    // firestoreのusersから、idがuidに一致する生徒のクラスのドキュメントｗ全て取得する
    const firestoreCollection = await getDocs(collection(db, `users/${uid}/class`));

    
    //クラスごとの成績(レート)を配列に代入
    const documents = firestoreCollection.docs.map((doc) => doc.data());

    // 存在していなかったらnullを返す
    if (documents === undefined) {
        return null;
    }

    // 変数に代入したデータを返す
    return documents;
}

export default getStuPerfData;