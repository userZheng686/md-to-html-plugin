const {resolve} = require('path')
const fs = require('fs')
const MdToHtmlPlugin = require('./plugin/md-to-html-plugin')

module.exports = {
    mode : 'development',
    entry : resolve(__dirname,'src/app.js'),
    output : {
        path : resolve(__dirname,'dist'),
        filename : 'app.[hash].js'
    },
    module: {
        rules : []
    },
    plugins : [
        new MdToHtmlPlugin({
            template : resolve(__dirname,'test.md'),
            filename : 'test.html'
        })
    ]
}