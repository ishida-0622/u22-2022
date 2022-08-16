const path = require("path");
const glob = require("glob");
const entries = glob.sync("./src/**/*.js");

module.exports = {
    entry: {
        init: "./src/init.js",
        openCloseSidebar: "./src/viewComponents/openCloseSidebar.js",
        scrollToTop: "./src/viewComponents/scrollToTop.js",
        showHidePassword: "./src/viewComponents/showHidePassword.js",
        signup: "./src/auth/signup.ts",
        logout: "./src/auth/logout.js",
        withdraw: "./src/auth/withdraw.ts",
        stuScoreInput: "./src/student/scoreInput.js",
        teacherScoreInput: "./src/teacher/scoreInput.js",
        classList: "./src/teacher/classList.js",
        stuSearch: "./src/teacher/stuSearch.ts",
        classCreate: "./src/teacher/classCreate.js",
        teacherInformation: "./src/teacher/userInformation.js",
        stuInformation: "./src/student/userInformation.js",
        parentsInformation: "./src/parents/userInformation.js",
        stuInformationEdit: "./src/student/userInformationEdit.js",
        // testList: "./src/teacher/testList.js",
        testCreate: "./src/teacher/testCreate.js",
        studentPerfData: "./src/student/studentPerfData.js",
        classInformation: "./src/teacher/classInformation.js",

        debugLogin: "./src/debug/debugLogin.js",
    },
    output: {
        path: path.resolve(__dirname, "./public/dist"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
        },
    },
};
