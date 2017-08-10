import babel from 'rollup-plugin-babel'
import path from 'path'

const entry = path.join(__dirname, './src/test.js')
const dest = path.join(__dirname, './dist/test.js')

export default {
    entry: entry,
    format: 'cjs',
    dest: dest,
    external: ['power-assert'],
    plugins: [
        babel()
    ]
}