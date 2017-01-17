'use babel'

const pxReg = /[+-]?([0-9]*[.])?[0-9]+(p|px)$/

export default {
    selector: '.source.css, .source.less, .source.scss, .source.sass, .source.styl',
    disableForSelector: '.source.css .comment, .source.css .string, .source.sass .comment, .source.sass .string, .source.less .comment, .source.less .string, .source.styl .comment, .source.styl .string, .source.scss .comment, .source.scss .string',
    getSuggestions({editor, bufferPosition}) {
        const lineText = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
        const matches = pxReg.exec(lineText)

        if(matches){
            let num = parseFloat(matches[0])
            if(num <= 1) return
            num = Number((num / atom.config.get('px2rem.base')).toFixed(atom.config.get('px2rem.length')))
            return [{
                text: `${num}rem`
            }]
        }
    }
}
