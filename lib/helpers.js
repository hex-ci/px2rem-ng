'use babel'

export default {
  toRem(str) {
    let num = parseFloat(str);

    if (num <= 1) {
      return false;
    }

    num = Number((num / atom.config.get('px2rem-ng.base')).toFixed(atom.config.get('px2rem-ng.length')));

    return `${num}rem`;
  }
}
