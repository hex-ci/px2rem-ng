'use babel';

let config = {};

export default {
  getRem(str) {
    const base = this.getBase();
    const num = parseFloat(str);

    if (num <= 1) {
      return false;
    }

    const remStr = Number((num / base).toFixed(atom.config.get('px2rem-plus.precision')));

    return atom.config.get('px2rem-plus.comment') ? `${remStr}rem /* ${num}/${base} */` : `${remStr}rem`;
  },

  getBase() {
    let base = atom.config.get('px2rem-plus.base');
    const editor = atom.workspace.getActiveTextEditor();

    if (editor) {
      const path = editor.getPath();

      if (path && config[path] && config[path].base) {
        base = config[path].base;
      }
    }

    return base;
  },

  setBase(str) {
    const base = parseFloat(str);
    const editor = atom.workspace.getActiveTextEditor();

    if (editor) {
      const path = editor.getPath();

      if (path) {
        config[path] = {
          base: base
        };
      }
    }
  }
};
