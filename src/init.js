import { doc, getDoc } from "firebase/firestore";
import getUserData from "./auth/getUserData";
import { db } from "./firebase/firebaseConfig";
import { userDataConverter } from "./firebase/firestoreTypes";

const main = async () => {
    const user = await getUserData();
    const url = location.pathname;
    if (user) {
        const userData = (
            await getDoc(
                doc(db, `users/${user.uid}`).withConverter(userDataConverter)
            )
        ).data();

        if (url === "/login.html" || url === "/signup.html") {
            if (userData.type === "student") {
                location.href = "/student/";
            } else if (userData.type === "teacher") {
                location.href = "/teacher/";
            } else {
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
    } else {
        if (url !== "/login.html" && url !== "/signup.html") {
            location.href = "/login.html";
        }
    }
};

main();
