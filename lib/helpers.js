'use babel';

let config = {};

export default {
  getRem(str) {
    const base = this.base;
    const num = parseFloat(str);

    if (num <= 1) {
      return false;
    }

    const rem = Number((num / base).toFixed(atom.config.get('px2rem-plus.precision')));
    let remStr = String(rem);

    if (atom.config.get('px2rem-plus.leadingZero') === false) {
      if (rem < 1) {
        remStr = remStr.replace(/^([-+])?0+/, '$1');
      }
    }

    return atom.config.get('px2rem-plus.comments') ? `${remStr}rem /* ${num}/${base} */` : `${remStr}rem`;
  },

  getPx(str) {
    const base = this.base;
    const num = parseFloat(str);

    const px = Number((num * base).toFixed(atom.config.get('px2rem-plus.precision')));
    let pxStr = String(px);

    if (atom.config.get('px2rem-plus.leadingZero') === false) {
      if (px < 1) {
        pxStr = pxStr.replace(/^([-+])?0+/, '$1');
      }
    }

    return atom.config.get('px2rem-plus.comments') ? `${pxStr}px /* ${num}*${base} */` : `${pxStr}px`;
  },

  get base() {
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

  set base(str) {
    const base = parseFloat(str);
    const editor = atom.workspace.getActiveTextEditor();

    if (editor) {
      const path = editor.getPath();

      if (path) {
        if (isNaN(base)) {
          delete config[path];
        }
        else {
          config[path] = {
            base: base
          };
        }
      }
    }
  },

  set config(obj) {
    config = obj || {};
  },

  get config() {
    return config;
  },

  get isTwoWay() {
    return atom.config.get('px2rem-plus.twoWayConversion');
  }
};
