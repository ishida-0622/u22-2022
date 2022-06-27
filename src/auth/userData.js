import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";

const getUserData = () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    console.log(user);
    if (user) {
        return user;
    }
    return null;
};

export default getUserData;
