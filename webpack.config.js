const path = require("path");

module.exports = {
    mode: 'development',
    entry: "./src/js/professorReporting/professor_reporting.js",
    output: {
        path: `${__dirname}/src/js/professorReporting`,
        filename: 'professor_reporting.bundle.js'
    },
    watch: true,
    devtool: "cheap-module-eval-source-map",
    module: {
        rules : [{
            test: /\.js$/,  exclude: /node_modules/,
            loader: 'babel-loader',
            query: { presets: ['es2015', 'stage-2', 'react'] }
        }]
    }
};
