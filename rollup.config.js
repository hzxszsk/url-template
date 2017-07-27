import babel from 'rollup-plugin-babel'

export default {
    entry: './src/index.js',
    format: 'umd',
    dest: './dist/bundle.rollup.js',
    moduleName: 'UrlTemplate',
    sourceMap: 'inline',
    plugins: [babel({
        presets: [
            ["es2015", {
                "modules": false
            }]
        ],
        exclude: 'node_modules/**'
    })]
}