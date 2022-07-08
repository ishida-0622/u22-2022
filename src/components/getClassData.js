import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

const getClassData = async (className) => {
    // firestoreのclassコレクションからclassNameが一致するドキュメントを取得して変数に代入
    const firestoreDocument = await getDoc(doc(db, `class/${className}`));

    // データを変数に代入
    const firestoreData = firestoreDocument.data();

    // 変数に代入したデータを返す
    return firestoreData;
};

export default getClassData;
