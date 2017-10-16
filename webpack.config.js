var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        'fetchy-js': './src/index.ts',
        'fetchy-js.min': './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, '_bundles'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'fetchyJs',
        umdNamedDefine: true,
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            include: /\.min\.js$/,
        }),
    ],
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/,
            query: {
                declaration: false,
            }
        }]
    },
};
