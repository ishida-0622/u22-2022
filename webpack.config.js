const path = require("path");

module.exports = {
    entry: {
        init: "./src/init.ts",
        openCloseSidebar: "./src/viewComponents/openCloseSidebar.js",
        scrollToTop: "./src/viewComponents/scrollToTop.js",
        showHidePassword: "./src/viewComponents/showHidePassword.js",
        signup: "./src/auth/signup.ts",
        login: "./src/auth/login.ts",
        logout: "./src/auth/logout.js",
        passwordReset: "./src/auth/passwordReset.ts",
        passwordChange: "./src/auth/passwordChange.ts",
        withdraw: "./src/auth/withdraw.ts",
        stuScoreInput: "./src/student/scoreInput.js",
        teacherScoreInput: "./src/teacher/scoreInput.js",
        classList: "./src/student/classList.ts",
        stuSearch: "./src/teacher/stuSearch.ts",
        stuData: "./src/teacher/stuData.ts",
        classCreate: "./src/teacher/classCreate.js",
        teacherInformation: "./src/teacher/userInformation.ts",
        teacherInformationEdit: "./src/teacher/userInformationEdit.ts",
        stuInformation: "./src/student/userInformation.ts",
        stuInformationEdit: "./src/student/userInformationEdit.ts",
        parentsInformation: "./src/parents/userInformation.ts",
        parentsInformationEdit: "./src/parents/userInformationEdit.ts",
        selectChildren: "./src/parents/selectChildren.ts",
        testList: "./src/teacher/testList.js",
        testCreate: "./src/teacher/testCreate.js",
        studentPerfData: "./src/student/studentPerfData.js",
        classInformation: "./src/teacher/classInformation.js",
        classEdit: "./src/teacher/classEdit.ts",
        stuIndex: "./src/student/index.ts",
        stuClassInformation: "./src/student/classInformation.js",
        teacherIndex: "./src/teacher/index.ts",
        parentIndex: "./src/parents/index.ts",
        stuRate: "./src/parents/stuRate.ts",
        addChild: "./src/parents/addChild.ts",
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
