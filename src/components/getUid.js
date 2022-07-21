import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { idConverter } from "../firebase/firestoreTypes";

/**
 * idに対応するuidを返す
 * @param {string} id id
 * @returns idに対応するuid
 */
const getUid = async (id) => {
    // ドキュメントを取得
    const firestoreDocument = (
        await getDoc(doc(db, `id/${id}`).withConverter(idConverter))
    ).data();

    // undefinedならnull そうでないならuidを返却
    return firestoreDocument ? firestoreDocument.uid : null;
};

export default getUid;
