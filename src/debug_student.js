import login from "./auth/login";

const main = async () => {
    await login("satomichi@example.com", "pass00");
};

main();
