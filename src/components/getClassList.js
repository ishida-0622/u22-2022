import getStuPerfData from "./getStuPerfData";
import getTeacherData from "./getTeacherData";
import getStuData from "./getStuData";
import { collection, getDocs } from "firebase/firestore";
import { teacherClassDataConverter } from "../firebase/firestoreTypes";

/**
 * useridに対応するクラスの一覧を返す
 * @param {string} uid userid
 * @returns useridに対応するクラスの一覧
 */
const getClassList = async (uid) => {
    // uidが講師かどうか
    const isTeacher = (await getTeacherData(uid)) !== null;

    // uidが生徒化どうか
    const isStudent = (await getStuData(uid)) !== null;
    // 生徒の場合
    if (isStudent) {
        // コレクションを変数に代入
        const firestoreCollection = await getStuPerfData(uid);

        // クラス名のリストを変数に代入
        const classList = firestoreCollection.map((value) => value.class_name);

        return classList;
    }

    // 講師の場合
    if (isTeacher) {
        const firestoreCollection = await getDocs(
            collection(db, `users/${uid}/class`).withConverter(
                teacherClassDataConverter
            )
        );

        // クラス名のリストを変数に代入
        const classList = firestoreCollection.docs.map(
            (value) => value.data().class_name
        );

        return classList;
    }

    return null;
};

export default getClassList;
