const path = require('path');
const glob = require("glob");
const entries = glob.sync("./src/**/*.js");

module.exports = {
    entry: {
        all: entries,
        stuScoreInput: "./src/student/score_input.js",
        stuScoreCfm: "./scr/student/score_cfm.js",
        teacherScoreInput: "./scr/teacher/score_input.js",
        teacherScoreCfm: "./scr/teacher/score_cfm.js",
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: "[name].bundle.js"
    }
};
