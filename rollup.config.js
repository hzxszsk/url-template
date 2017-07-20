import babel from 'rollup-plugin-babel'

export default {
    entry: './app.js',
    format: 'umd',
    dest: './dist/bundle.rollup.js',
    // sourceMap: true,
    plugins: [babel({
        presets: [
            ["es2015", {
                "modules": false
            }]
        ]
    })]
}