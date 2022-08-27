import { doc, getDoc } from "firebase/firestore";
import getUserData from "./auth/getUserData";
import { db } from "./firebase/firebaseConfig";
import { userDataConverter } from "./firebase/firestoreTypes";
import fileDownload from "./storage/fileDownload";

const main = async () => {
    const user = await getUserData();
    const path = location.pathname;
    const folder = path.split("/")[1];
    if (user) {
        const userData = (
            await getDoc(
                doc(db, `users/${user.uid}`).withConverter(userDataConverter)
            )
        ).data()!;

        if (userData.type === "student") {
            if (
                path === "/login.html" ||
                path === "/signup.html" ||
                folder === "teacher" ||
                folder === "parents"
            ) {
                location.href = "/student/";
            }
        } else if (userData.type === "teacher") {
            if (
                path === "/login.html" ||
                path === "/signup.html" ||
                folder === "student" ||
                folder === "parents"
            ) {
                location.href = "/teacher/";
            }
        } else {
            if (
                path === "/login.html" ||
                path === "/signup.html" ||
                folder === "student" ||
                folder === "teacher"
            ) {
                location.href = "/parents/";
            }
        }

        const idElement = document.getElementById("user-id");
        if (idElement) {
            idElement.textContent = userData.id;
        }
        const nameElement = document.getElementById("user-name");
        if (nameElement) {
            nameElement.textContent = userData.last_name + userData.first_name;
        }
        const icon = document.getElementById("icon") as HTMLImageElement | null;
        if (icon) {
            const url = await fileDownload(user.uid);
            if (url) {
                icon.src = url;
            }
        }
    } else {
        if (path !== "/login.html" && path !== "/signup.html") {
            location.href = "/login.html";
        }
    }
};

main();

const toInfo = () => {
    location.href = "./user-information.html";
};

if (document.getElementById("icon")) {
    document.getElementById("icon")!.onclick = toInfo;
}
