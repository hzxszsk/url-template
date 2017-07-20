module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.webpack.js',
        path: __dirname + '/dist'
    },
    module: {
        rules: [{
            test: /\.js/,
            use: ['babel-loader']
        }]
    }
}