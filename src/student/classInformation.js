import getClassData from "../components/getClassData";
import getTeacherData from "../components/getTeacherData";
import getStuData from "../components/getStuData";
import getStuPerfData from "../components/getStuPerfData";
import getUserData from "../auth/getUserData";

const main = async () => {
    //URL取得
    const url = new URL(window.location.href);
    const param = url.searchParams;
    const className = param.get("class_name");
    if (!className) {
        location.href = "./";
        return;
    }
    const user = await getUserData();
    if (!user) {
        return;
    }

    const classInformation = await getClassData(className);
    if (!classInformation) {
        location.href = "./";
        return;
    }
    if (!classInformation.students.some((v) => v === user.uid)) {
        location.href = "./";
        return;
    }
    const teacherElement = document.getElementById("teacher-list");
    classInformation.teachers.forEach(async (uid) => {
        const teacherData = await getTeacherData(uid);
        const tr = document.createElement("tr");
        const tdName = document.createElement("td");
        const tdId = document.createElement("td");
        tdName.textContent = `${teacherData.last_name} ${teacherData.first_name}`;
        tdId.textContent = teacherData.id;

        tr.appendChild(tdName);
        tr.appendChild(tdId);
        teacherElement.appendChild(tr);
    });

    const studentListElement = document.getElementById("student-list");
    classInformation.students.forEach(async (uid) => {
        const studentData = await getStuData(uid);
        const studentRates = (await getStuPerfData(uid)).filter(
            (val) => val.class_name === className
        )[0].rate;
        const studentName = `${studentData.last_name} ${studentData.first_name}`;
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

    document.getElementById("class_name").textContent = className;
};

main();
