import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const babelOptions = {
    presets: [
        ['es2015', {
            modules: false
        }]
    ],
    plugins: [
        'external-helpers'
    ],
    runtimeHelpers: true,
    exclude: 'node_modules/**'
}

// const prod = process.env.NODE_ENV === 'production'

export default [{
    // dev build
    entry: './src/index.js',
    format: 'umd',
    dest: './dist/url-templater.js',
    moduleName: 'url-templater',
    plugins: [
        babel(babelOptions)
    ]
},{
    // prod build
    entry: './src/index.js',
    format: 'umd',
    dest: './dist/url-templater.min.js',
    moduleName: 'url-templater',
    sourceMap: true,
    plugins: [
        babel(babelOptions),
        uglify()
    ]
}]