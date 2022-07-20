import { db } from "../firebase/firebaseConfig";
import { testDataConverter } from "../firebase/firestoreTypes";
import { getDoc, doc } from "firebase/firestore";

/**
 * テスト名に対応するテストの情報を返す
 * @param {string} testName テスト名
 * @returns テスト名に対応するテストの情報
 */
const getTestData = async (testName) => {
    // firestoreのclassコレクションからtestNameが一致するドキュメントを取得して変数に代入
    const firestoreDocument = await getDoc(
        doc(db, `tests/${testName}`).withConverter(testDataConverter)
    );

    // データを変数に代入
    const firestoreData = firestoreDocument.data();

    // 存在していなかったらnullを返す
    if (firestoreData === undefined) {
        return null;
    }

    // 変数に代入したデータを返す
    return firestoreData;
};

export default getTestData;
