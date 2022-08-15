import getUserData from "./auth/getUserData";

const main = async () => {
    const user = await getUserData();
    const url = location.pathname;
    if (user) {
        if (url === "/login.html" || url === "/signup.html") {
            location.href = "/";
        }
    } else {
        if (url !== "/login.html" && url !== "/signup.html") {
            location.href = "/login.html";
        }
    }
};

main();
