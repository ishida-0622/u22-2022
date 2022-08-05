import getClassData from "../components/getClassData";
import getTeacherData from "../components/getTeacherData";

const main = async () => {
    //URL取得
    const url = new URL(window.location.href);
    const param = url.searchParams;
    const className = param.get('class_name');
    const classInformtion = await getClassData(className);
    const teacherInformtion = await getTeacherData(classInformtion.teachers[0]);
    const teacherName = teacherInformtion.last_name + teacherInformtion.first_name;

    document.getElementById("class_name").innerHTML = className;
    document.getElementById("teacher_name").innerHTML = teacherName;


}

main();
