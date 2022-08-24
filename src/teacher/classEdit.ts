import getUserData from "../auth/getUserData";
import getUid from "../components/getUid";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import getClassData from "../components/getClassData";
import getTeacherData from "../components/getTeacherData";
import getStuData from "../components/getStuData";
import {
    classData,
    stuClassData,
    stuClassDataConverter,
} from "../firebase/firestoreTypes";
import getYMD from "../components/getYMD";
import getTestList from "../components/getTestList";
import { teacherClassData } from "../firebase/firestoreTypes";

let teacherIdSet = new Set<string>();
let studentIdSet = new Set<string>();

const main = async () => {
    const userData = await getUserData();
    if (!userData) {
        return;
    }

    // urlからクラス名を取得
    const url = new URL(location.href);
    const params = url.searchParams;
    const className = params.get("class_name");
    if (!className) {
        location.href = "./";
        return;
    }

    const classData = await getClassData(className);
    if (!classData) {
        location.href = "./";
        return;
    }
    const teachers = classData.teachers;
    const students = classData.students;

    // ログイン中の講師が所属していなかったらindex.htmlに飛ばす
    if (!teachers.find((v) => v === userData.uid)) {
        location.href = "./";
        return;
    }

    (document.getElementById("class_name") as HTMLInputElement).value =
        className;

    teachers.forEach(async (val) => {
        const teacherData = (await getTeacherData(val))!;
        const firstName = teacherData.first_name;
        const lastName = teacherData.last_name;
        const id = teacherData.id;

        teacherIdSet.add(id);

        // 要素を作成
        addTeacherElement(id, `${lastName} ${firstName}`);
    });

    students.forEach(async (uid) => {
        const studentData = (await getStuData(uid))!;
        const name = `${studentData.last_name} ${studentData.first_name}`;
        const id = studentData.id;
        studentIdSet.add(id);
        addStudentElement(id, name);
    });
};

const addTeacherElement = (id: string, name: string) => {
    const trElement = document.createElement("tr");
    const tdNameElement = document.createElement("td");
    const tdIdElement = document.createElement("td");
    const tdButtonElement = document.createElement("td");
    const removeButton = document.createElement("a");

    trElement.className = "teacher-name";
    trElement.id = id;

    tdNameElement.textContent = name;

    tdIdElement.textContent = id;

    removeButton.textContent = "削除";
    removeButton.addEventListener("click", () => removeTeacher(id));

    tdButtonElement.className = "button-area";
    tdButtonElement.appendChild(removeButton);

    trElement.appendChild(tdNameElement);
    trElement.appendChild(tdIdElement);
    trElement.appendChild(tdButtonElement);

    const teacherTableElement = document.getElementById(
        "teachers"
    ) as HTMLTableElement;
    teacherTableElement.appendChild(trElement);
};

const addStudentElement = (id: string, name: string) => {
    const trElement = document.createElement("tr");
    const tdNameElement = document.createElement("td");
    const tdIdElement = document.createElement("td");
    const tdButtonElement = document.createElement("td");
    const removeButton = document.createElement("a");

    trElement.className = "student-name";
    trElement.id = id;

    tdNameElement.textContent = name;

    tdIdElement.textContent = id;

    removeButton.textContent = "削除";
    removeButton.addEventListener("click", () => removeStudent(id));

    tdButtonElement.className = "button-area";
    tdButtonElement.appendChild(removeButton);

    trElement.appendChild(tdNameElement);
    trElement.appendChild(tdIdElement);
    trElement.appendChild(tdButtonElement);

    const studentTableElement = document.getElementById(
        "students"
    ) as HTMLTableElement;
    studentTableElement.appendChild(trElement);
};

// 削除ボタン
const removeTeacher = (id: string) => {
    const element = document.getElementById(id);
    if (element && confirm(`${id}を削除しますか？`)) {
        element.remove();
        // Setからidを削除
        teacherIdSet.delete(id);
    }
};

const removeStudent = (id: string) => {
    const element = document.getElementById(id);
    if (element && confirm(`${id}を削除しますか？`)) {
        element.remove();
        studentIdSet.delete(id);
    }
};

// 追加ボタンの機能
const addTeacher = async () => {
    // HTMLからidを取得
    const id = (document.getElementById("teacher-id") as HTMLInputElement)
        .value;

    // 未入力の場合はreturn
    if (id === "") {
        alert("IDを入力してください");
        return;
    }

    // 追加されたidが既に追加済みの場合return
    if (teacherIdSet.has(id)) {
        alert("そのユーザは既に追加済みです");
        return;
    }

    // uidを取得し、それを元にteacherのドキュメントを取得
    const uid = await getUid(id);
    if (!uid) {
        alert("IDが一致するユーザは存在しませんでした");
        return;
    }
    const teacherData = (await getTeacherData(uid))!;

    // Setにidを追加
    teacherIdSet.add(id);

    // 講師名を代入
    const firstName = teacherData.first_name;
    const lastName = teacherData.last_name;

    // confirmを表示
    if (
        confirm(
            `以下の講師を追加します。よろしいですか？\n\n講師名：${lastName} ${firstName}\nID：${id}`
        )
    ) {
        addTeacherElement(id, `${lastName} ${firstName}`);
    }
};

const addStudent = async () => {
    // HTMLからidを取得
    const id = (document.getElementById("student-id") as HTMLInputElement)
        .value;

    // 未入力の場合はreturn
    if (id === "") {
        alert("IDを入力してください");
        return;
    }

    if (studentIdSet.has(id)) {
        alert("そのユーザは既に追加済みです");
        return;
    }

    const uid = await getUid(id);
    if (!uid) {
        alert("IDが一致するユーザは存在しませんでした");
        return;
    }
    const studentData = (await getStuData(uid))!;
    studentIdSet.add(id);

    const name = `${studentData.last_name} ${studentData.first_name}`;
    if (
        confirm(
            `以下の生徒を追加します。よろしいですか？\n\n生徒名：${name}\nID：${id}`
        )
    ) {
        addStudentElement(id, name);
    }
};

// 登録ボタンの機能
document.getElementById("registration")!.onclick = async () => {
    if (!confirm("登録しますか？")) {
        return;
    }

    if (teacherIdSet.size === 0) {
        alert("講師は1人以上必要です");
        return;
    }

    // inputからクラス名と講師名を取得
    const className = (
        document.getElementById("class_name") as HTMLInputElement
    ).value;

    const classData = await getClassData(className);
    const beforeClassName = new URL(location.href).searchParams.get(
        "class_name"
    )!;
    if (classData && className !== beforeClassName) {
        alert("そのクラス名は使われています");
        return;
    }

    const teacherUids = (
        await Promise.all(
            Array.from(teacherIdSet).map(async (val) => await getUid(val))
        )
    ).flatMap((v) => (v ? [v] : []));

    const studentUids = (
        await Promise.all(
            Array.from(studentIdSet).map(async (val) => await getUid(val))
        )
    ).flatMap((v) => (v ? [v] : []));

    const beforeClassData = await getClassData(beforeClassName);
    // 高速化のためにSet
    const tmp = new Set(teacherUids);
    // 削除された講師
    const deleteTeachers = beforeClassData!.teachers.filter(
        (val) => !tmp.has(val)
    );
    // 削除
    deleteTeachers.forEach(async (uid) => {
        await deleteDoc(doc(db, `users/${uid}/class/${beforeClassName}`));
    });

    const updateTeacherClassData: teacherClassData = {
        class_name: className,
    };

    const setStudentClassData: stuClassData = {
        class_name: className,
        rate: [{ date: getYMD(), score: 50, test_name: "" }],
    };

    const updateClassData: classData = {
        class_name: className,
        teachers: teacherUids,
        students: studentUids,
    };

    // クラス名が変更された場合
    if (className !== beforeClassName) {
        // 新しいクラス名のドキュメントを作成
        await setDoc(doc(db, `class/${className}`), updateClassData);

        // 古いクラス名のドキュメントを削除
        await deleteDoc(doc(db, `class/${beforeClassName}`));

        // 講師の新しいクラスのドキュメントを作成
        teacherUids.forEach(async (uid) => {
            await setDoc(
                doc(db, `users/${uid}/class/${className}`),
                updateTeacherClassData
            );
            // 古いドキュメントを削除
            await deleteDoc(doc(db, `users/${uid}/class/${beforeClassName}`));
        });

        // 生徒の新しいクラスのドキュメントを作成
        studentUids.forEach(async (uid) => {
            // 古いクラスのドキュメント
            const beforeClassData = (
                await getDoc(
                    doc(
                        db,
                        `users/${uid}/class/${beforeClassName}`
                    ).withConverter(stuClassDataConverter)
                )
            ).data();
            // データが存在する場合、新しいドキュメントにセット
            if (beforeClassData) {
                // クラス名を更新
                beforeClassData.class_name = className;
                await setDoc(
                    doc(db, `users/${uid}/class/${className}`),
                    beforeClassData
                );
                // 古いドキュメントを削除
                await deleteDoc(
                    doc(db, `users/${uid}/class/${beforeClassName}`)
                );
            } else {
                // 存在しない場合 = 新しく追加された場合は初期値をセット
                await setDoc(
                    doc(db, `users/${uid}/class/${className}`),
                    setStudentClassData
                );
            }
        });
        const testList = await getTestList(beforeClassName);
        const updateTestData = {
            class_name: className,
        };
        // テストのクラス名を変更
        testList.forEach(async (val) => {
            await updateDoc(doc(db, `tests/${val.test_name}`), updateTestData);
        });
    } else {
        // クラスのデータを更新
        await updateDoc(doc(db, `class/${className}`), updateClassData);

        // 講師のデータを更新（こうしを、こうしん!w）
        teacherUids.forEach(async (uid) => {
            await setDoc(
                doc(db, `users/${uid}/class/${className}`),
                updateTeacherClassData
            );
        });

        // 生徒のデータを更新
        studentUids.forEach(async (uid) => {
            const classData = (
                await getDoc(doc(db, `users/${uid}/class/${className}`))
            ).data();

            // データがnull = 初めて追加された場合はレートの初期値をセット
            if (!classData) {
                await setDoc(
                    doc(db, `users/${uid}/class/${className}`),
                    setStudentClassData
                );
            }
        });
    }

    alert("更新しました");
    location.href = "./";
};

document.getElementById("add-teacher")!.onclick = addTeacher;
document.getElementById("add-student")!.onclick = addStudent;

main();
