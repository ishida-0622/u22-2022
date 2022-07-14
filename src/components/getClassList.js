import getStuPerfData from "./getStuPerfData";
import getTeacherData from "./getTeacherData";

/**
 * useridに対応するクラスの一覧を返す
 * @param {string} uid userid
 * @returns useridに対応するクラスの一覧
 */
const getClassList = async (uid) => {
    // uidが講師ならばデータを代入
    let firestoreCollection = await getTeacherData(uid);

    // クラスリストの宣言
    let classList = [];

    // 生徒の場合
    if (firestoreCollection === null) {
        // コレクションを変数に代入
        firestoreCollection = await getStuPerfData(uid);

        // クラス名のリストを変数に代入
        classList = firestoreCollection.map((value) => value.class_name);

        // 講師の場合
    } else {
        // クラス名のリストを変数に代入
        classList = firestoreCollection.map((value) => value.class.class_name);
    }

    return classList;
};

export default getClassList;
