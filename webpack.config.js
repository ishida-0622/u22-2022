const path = require('path');
const glob = require("glob");
const entries = glob.sync("./src/**/*.js");

module.exports = {
    entry: {
        // all: entries,
        test: "./src/test/test.tsx"
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
};
