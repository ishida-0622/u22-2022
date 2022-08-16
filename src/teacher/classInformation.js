import getClassData from "../components/getClassData";
import getTeacherData from "../components/getTeacherData";
import getStuData from "../components/getStuData";
import getStuPerfData from "../components/getStuPerfData";

const main = async () => {
    //URL取得
    const url = new URL(window.location.href);
    const param = url.searchParams;
    const className = param.get("class_name");

    const classInformtion = await getClassData(className);
    const teacherInformtion = await getTeacherData(classInformtion.teachers[0]);
    const teacherName =
        teacherInformtion.last_name + teacherInformtion.first_name;

    const studentListElement = document.getElementById("student-list");
    classInformtion.students.forEach(async (uid) => {
        const studentData = await getStuData(uid);
        const studentRates = (await getStuPerfData(uid)).filter(
            (val) => val.class_name === className
        )[0].rate;
        const studentName = studentData.last_name + studentData.first_name;
        const studentId = studentData.id;
        const studentRate = studentRates[studentRates.length - 1].score;

        const tr = document.createElement("tr");
        tr.id = studentId;
        const tdName = document.createElement("td");
        tdName.textContent = studentName;
        const tdId = document.createElement("td");
        tdId.textContent = studentId;
        const tdRate = document.createElement("td");
        tdRate.textContent = studentRate;

        tr.appendChild(tdName);
        tr.appendChild(tdId);
        tr.appendChild(tdRate);
        studentListElement.appendChild(tr);
    });

    document.getElementById("class_name").innerHTML = className;
    document.getElementById("teacher_name").innerHTML = teacherName;
};

main();
