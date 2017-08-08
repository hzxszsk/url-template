import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

const isProd = process.env.ENV === 'production'
const destPath = isProd ? './dist/url-templater.min.js' : './dist/url-templater.js'

export default {
    entry: './src/index.js',
    format: 'umd',
    moduleName: 'UrlTemplater',
    dest: destPath,
    sourceMap: isProd,
    plugins: [
        babel(),
        replace({
            delimiters: ['{{', '}}'],
            version: pkg.version
        }),
        isProd && uglify()
    ]
}