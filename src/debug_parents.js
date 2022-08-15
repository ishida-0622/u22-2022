import login from "./auth/login";

const main = async () => {
    await login("parents@example.com", "pass00");
};

main();
