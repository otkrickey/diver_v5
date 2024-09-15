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
                ecma: 5,
                mangle: {
                    properties: true
                },
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log'],
                    passes: 3,
                },
                output: {
                    comments: false,
                    beautify: false,
                },
                keep_classnames: false,
                keep_fnames: false,
                module: false,
                toplevel: false,
                nameCache: null,
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
