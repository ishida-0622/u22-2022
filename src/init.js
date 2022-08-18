import { doc, getDoc } from "firebase/firestore";
import getUserData from "./auth/getUserData";
import { db } from "./firebase/firebaseConfig";
import { userDataConverter } from "./firebase/firestoreTypes";

const main = async () => {
    const user = await getUserData();
    const url = location.pathname;
    if (user) {
        if (url === "/login.html" || url === "/signup.html") {
            location.href = "/";
        }

        const userData = (
            await getDoc(
                doc(db, `users/${user.uid}`).withConverter(userDataConverter)
            )
        ).data();

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
