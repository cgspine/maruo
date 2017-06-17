/**
 * Created by cgspine on 2017/6/16.
 */
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";

export default {
    entry: 'src/index.js',
    format: 'umd',
    moduleName: 'maruo',
    plugins: [
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        json(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    dest: 'dist/maruo.js'
};