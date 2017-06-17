/**
 * Created by cgspine on 16/7/9.
 */

var webpack = require('webpack')

var path = require('path');
var fs = require('fs')
var json = require('./../package.json')

var version =  json.version.split('.')

module.exports = {
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'maruo.js',
        library: 'maruo',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel' }
        ]
    },
    babel: {
        loose: 'all'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        })
    ],
    devtool: 'source-map',
    eslint: {
        configFile: './eslintrc.json'
    },
}

