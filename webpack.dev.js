const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        open: true,
    },
    output: {
        filename: 'dev.js',
        path: path.resolve(__dirname, 'dist'),
    },
});
