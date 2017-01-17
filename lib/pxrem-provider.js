'use babel'

const pxReg = /^[+-]?([0-9]*[.])?[0-9]+(p|px)$/

export default {
    selector: '.source.css, .source.less, .source.scss, .source.sass, .source.styl',
    disableForSelector: '.source.css .comment, .source.css .string, .source.sass .comment, .source.sass .string, .source.less .comment, .source.less .string, .source.styl .comment, .source.styl .string, .source.scss .comment, .source.scss .string',
    getSuggestions({editor, bufferPosition, prefix}) {
        const lineNum = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])

        if(pxReg.test(prefix)){
            let num = parseFloat(prefix)
            if(num <= 1) return
            num = Number((num / atom.config.get('pxrem.base')).toFixed(atom.config.get('pxrem.length')))
            return [{
                text: `${num}rem`
            }]
        }
    }
}
