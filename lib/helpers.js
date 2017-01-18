'use babel'

export default {
  toRem(str) {
    const base = atom.config.get('px2rem-ng.base');
    const num = parseFloat(str);

    if (num <= 1) {
      return false;
    }

    const remStr = Number((num / base).toFixed(atom.config.get('px2rem-ng.precision')));

    return atom.config.get('px2rem-ng.comment') ? `${remStr}rem /* ${num}/${base} */` : `${remStr}rem`;
  }
}
