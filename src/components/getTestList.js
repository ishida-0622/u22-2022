import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { testDataConverter } from "../firebase/firestoreTypes";

/**
 * クラス名に対応するテストの情報を配列で返す
 * @param {string} className クラス名
 * @returns クラス名に対応するテストの情報の配列
 */
const getTestList = async (className) => {
    // 条件が「class_nameが引数classNameと一致する」のクエリを作成
    const testQuery = query(
        collection(db, "tests").withConverter(testDataConverter),
        where("class_name", "==", className)
    );

    // firestoreからクエリに一致するドキュメントを取得
    const testCollection = await getDocs(testQuery);

    //取得したドキュメントを配列に格納
    const testDocuments = testCollection.docs.map((doc) => doc.data());

    // 配列に格納したデータを返す
    return testDocuments;
};

export default getTestList;
