import getClassList from "../components/getClassList";
import getClassData from "../components/getClassData";

classList = await getClassList(uid);

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
