import getClassData from "../components/getClassData";
import getTeacherData from "../components/getTeacherData";
import getStuData from "../components/getStuData";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebase/firebaseConfig";

const main = async () => {
    //URL取得
    const url = new URL(window.location.href);
    const param = url.searchParams;
    const className = param.get('class_name');

    const classInformtion = await getClassData(className);
    const teacherInformtion = await getTeacherData(classInformtion.teachers[0]);
    const teacherName = teacherInformtion.last_name + teacherInformtion.first_name;

    classInformtion.students.forEach(async (uid) => {
        const studentData = await getStuData(uid);
        const studentRate = (await getDoc(doc(db, `users/${uid}/class/${className}`))).data().rate;
    })

    document.getElementById("class_name").innerHTML = className;
    document.getElementById("teacher_name").innerHTML = teacherName;


}

main();
