'use babel';

import fs from 'fs';

let config = {};
const filename = atom.getConfigDirPath() + '/px2rem-plus.json';

try {
  config = JSON.parse(fs.readFileSync(filename));
} catch (e) {
}

export default {
  getRem(str) {
    const base = this.getBase();
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
        if (isNaN(base)) {
          delete config[path];
        }
        else {
          config[path] = {
            base: base
          };
        }

        fs.writeFileSync(filename, JSON.stringify(config, null, '  '));
      }
    }
  }
};
