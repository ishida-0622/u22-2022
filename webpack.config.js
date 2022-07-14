const path = require('path');
const glob = require("glob");
const entries = glob.sync("./src/**/*.js");

module.exports = {
    entry: {
        all: entries,
        test: "./src/test/test.js"
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: "[name].bundle.js"
    }
};
