import getClassList from "../components/getClassList";
import getClassData from "../components/getClassData";
import getTeacherData from "../components/getTeacherData";
import getUserData from "../auth/getUserData";
import $ from "jquery";
import { db } from "../firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

const main = async () => {
    const classList = await getClassList(uid);

    let classData = [];

    const element = document.getElementById("class-table");

    classList.forEach((value) => {
        classData = getClassData(value);

        if (classData != null) {
            element.insertAdjacentHTML(
                "beforeend",
                "<tr><td>" +
                    classData["class_name"] +
                    "</td><td>" +
                    classData["teachers"][0] +
                    "</td></tr>"
            );
        }
    });
};
