import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'

export default {
    entry: './src/index.js',
    format: 'umd',
    dest: './dist/url-templater.js',
    moduleName: 'url-templater',
    plugins: [babel({
        presets: [
            ["es2015", {
                "modules": false
            }]
        ],
        exclude: 'node_modules/**'
    }),builtins()]
}