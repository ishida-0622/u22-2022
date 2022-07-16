const path = require('path');
const glob = require("glob");
const entries = glob.sync("./src/**/*.js");

module.exports = {
    entry: {
        all: entries,
        stuScoreInput: "./src/student/scoreInput.js",
        stuScoreCfm: "./scr/student/scoreCfm.js",
        teacherScoreInput: "./scr/teacher/scoreInput.js",
        teacherScoreCfm: "./scr/teacher/scoreCfm.js",
        classList: "./src/teacher/classList.js",
        stuSearch: "./src/teacher/stuSearch.js"
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: "[name].bundle.js"
    }
};
