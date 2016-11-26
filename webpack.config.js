var webpack = require('webpack')

module.exports = {
    entry: [
        './src/App.js'
    ],
    output:{
        path: __dirname,
        filename: 'app.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query:{
                presets: ['es2015','react']
            }
        }]
    },
    plugins: [
       new webpack.DefinePlugin({
         'process.env': {
           'NODE_ENV': '"production"'
         }
       }),
       new webpack.optimize.UglifyJsPlugin()
    ]
};