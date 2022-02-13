const {readFileSync} = require('fs')
const {resolve} = require('path')
const compileHTML = require('./compiler')

const INNER_MARK = '<!-- inner -->'

class MdToHtmlPlugin {
    constructor({template,filename}){
        if(!template){
            throw new Error('The config for "template" must be configured')
        }

        this.filename = filename ? filename : 'md.html'
        this.template = template
    }

    apply(compiler){
        compiler.hooks.emit.tap('md-to-html-plugin',(compilation) => {
            const _assets = compilation.assets
            const _mdContent = readFileSync(this.template,'utf-8')
            const _templateHTML = readFileSync(resolve(__dirname,'template.html'),'utf-8').toString()
            const _mdContentArr = _mdContent.split('\n');
            const _htmlStr = compileHTML(_mdContentArr)
            const _finalHTML = _templateHTML.replace(INNER_MARK,_htmlStr)


            _assets[this.filename] = {
                source(){
                    return _finalHTML
                },
                size(){
                    return _finalHTML.length
                }
            }
        })
        // console.log(compiler)
    }
}

module.exports = MdToHtmlPlugin