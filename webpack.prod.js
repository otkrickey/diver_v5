const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: {
                    // drop_console: true,
                },
            },
        })],
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new CompressionPlugin({
            algorithm: 'gzip',
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
        }),
    ],
    output: {
        filename: 'prod.js',
        path: path.resolve(__dirname, 'dist'),
    },
});
