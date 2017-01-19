'use babel'

export default {
  getRem(str) {
    const base = atom.config.get('px2rem-plus.base');
    const num = parseFloat(str);

    if (num <= 1) {
      return false;
    }

    const remStr = Number((num / base).toFixed(atom.config.get('px2rem-plus.precision')));

    return atom.config.get('px2rem-plus.comment') ? `${remStr}rem /* ${num}/${base} */` : `${remStr}rem`;
  },

  getBase() {
    return atom.config.get('px2rem-plus.base');
  }
}
