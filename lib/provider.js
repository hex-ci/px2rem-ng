'use babel'

import helper from './helpers.js'

const pxReg = /[+-]?([0-9]*[.])?[0-9]+(p|px)$/

export default {
  selector: '.source.css, .source.less, .source.scss, .source.sass, .source.styl',

  disableForSelector: '.source.css .comment, .source.css .string, .source.sass .comment, .source.sass .string, .source.less .comment, .source.less .string, .source.styl .comment, .source.styl .string, .source.scss .comment, .source.scss .string',

  getSuggestions({editor, bufferPosition}) {
    const lineText = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
    const matches = pxReg.exec(lineText)

    if (matches) {
      const remStr = helper.toRem(matches[0])

      if (remStr !== false) {
        return [{
          text: remStr
        }]
      }
    }
  }
}
