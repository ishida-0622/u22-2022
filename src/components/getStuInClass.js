import getClassData from "./getClassData";
import getStuData from "./getStuData";

/**
 * クラス名を引数に貰って、クラスに所属している生徒の情報を配列で返す
 * @param {string} className クラス名
 * @returns クラス名に対応する生徒の情報
 */
const getStuInClass = async (className) => {
    // classNameを引数にgetClassDataを呼び出し、クラスの情報をclassDocumentに代入
    const classDocument = await getClassData(className);

    // 存在していなかったらnullを返す
    if (classDocument === null) {
        return null;
    }

    // class/studentsのuidを全てstudentIdに代入
    const studentIdList = classDocument.students;

    // studentIdを引数に渡してgetStuDataを呼び出し、生徒の情報を配列studentDocumentに格納
    const studentDocuments = await Promise.all(
        studentIdList.map(async (val) => await getStuData(val))
    );

    // nullを取り除いたstudentDocuments
    const notNullStudentDocuments = studentDocuments.flatMap((val) =>
        val === null ? [] : [val]
    );

    // 配列に格納したデータを返す
    return notNullStudentDocuments;
};

export default getStuInClass;
