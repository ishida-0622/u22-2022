import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import getStuData from "./getStuData";
import { stuClassDataConverter } from "../firebase/firestoreTypes";

/**
 * 生徒のレートを返す
 * @param uid uid
 * @param className クラス名
 * @returns uidが生徒なら該当クラスのレート そうでないならnull
 */
const getRate = async (uid: string, className: string) => {
    if (!(await getStuData(uid))) {
        return null;
    }
    const res = (
        await getDoc(
            doc(db, `users/${uid}/class/${className}`).withConverter(
                stuClassDataConverter
            )
        )
    ).data()?.rate;
    return res ? res : null;
};

export default getRate;
