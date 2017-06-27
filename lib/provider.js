'use babel';

import helper from './helpers.js';

const pxReg = /^[+-]?([0-9]*[.])?[0-9]+(p|px)$/;
const remReg = /^[+-]?([0-9]*[.])?[0-9]+(r|re|rem)$/;

class Provider {
  constructor() {
    this.selector = '.source.css, .source.less, .source.scss, .source.sass, .source.styl';
    this.disableForSelector = '.source.css .comment, .source.css .string, .source.sass .comment, .source.sass .string, .source.less .comment, .source.less .string, .source.styl .comment, .source.styl .string, .source.scss .comment, .source.scss .string';
  }

  getSuggestions({editor, bufferPosition}) {
    const prefix = this.getPrefix(editor, bufferPosition);

    if (pxReg.test(prefix)) {
      return this.getConvertSuggestions(prefix);
    }
    else if (helper.isTwoWay && remReg.test(prefix)) {
      return this.getConvertSuggestions(prefix, true);
    }
  }

  getConvertSuggestions(prefix, isRem2Px) {
    const str = isRem2Px ? helper.getPx(prefix) : helper.getRem(prefix);

    if (str !== false) {
      const base = helper.base;

      return [{
        text: str,
        replacementPrefix: prefix,
        rightLabel: `base: ${base}`
      }];
    }
  }

  getPrefix(editor, bufferPosition) {
    const regex = /[+-]?[\w\d.]+$/;
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    const match = line.match(regex);

    return match ? match[0] : '';
  }
}

export default Provider;
