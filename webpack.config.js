const path = require('path');
const glob = require("glob");
const entries = glob.sync("./src/**/*.js");

module.exports = {
    entry: {
        signup: "./src/auth/signup.js",
        stuScoreInput: "./src/student/scoreInput.js",
        stuScoreCfm: "./src/student/scoreCfm.js",
        teacherScoreInput: "./src/teacher/scoreInput.js",
        teacherScoreCfm: "./src/teacher/scoreCfm.js",
        classList: "./src/teacher/classList.js",
        stuSearch: "./src/teacher/stuSearch.ts",
        classCreate: "./src/teacher/classCreate.js",
        teacherInformation: "./src/teacher/userInformation.js",
        stuInformation: "./src/student/userInformation.js",
        parentsInformation: "./src/parents/userInformation.js",
        stuInformationEdit: "./src/student/userInformationEdit.js",
        // testList: "./src/teacher/testList.js",
        testCreate: "./src/teacher/testCreate.js",
        classInfomation: "./src/teacher/classInfomation.js"
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
};
