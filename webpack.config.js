const path = require('path');
const glob = require("glob");
const entries = glob.sync("./src/**/*.js");

module.exports = {
    // エントリーポイントの設定
    // entry: "./public/src/index.js",
    entry: entries,
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: 'index.js'
    }
};
