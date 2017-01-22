'use babel';

import autoCompleteProvider from './provider.js';
import SettingsView from './settings-view.js';
import helper from './helpers.js';

const pxReg = /[+-]?([0-9]*[.])?[0-9]+px/gm;

class Px2rem {
  activate() {
    const me = this;

    this.settingsView = new SettingsView();

    atom.commands.add('atom-text-editor', {
      'px2rem-plus:convert': () => {
        me.convert();
      }
    });

    this.autoCompleteProvider = new autoCompleteProvider();
  }

  deactivate() {
    delete this.autoCompleteProvider;
    this.autoCompleteProvider = null;
    this.settingsView = null;
  }

  provide() {
    return this.autoCompleteProvider;
  }

  convert() {
    const editor = atom.workspace.getActiveTextEditor();

    if (!editor) {
      return;
    }

    const buffer = editor.getBuffer();
    const selection = editor.getLastSelection();
    const selectionRange = selection.getBufferRange();

    const cb = res => {
      const remStr = helper.getRem(res.match[0]);

      res.replace(remStr !== false ? remStr : res.match[0]);
    };

    editor.transact(() => {
      if (selectionRange.isEmpty()) {
        editor.scan(pxReg, cb);
      }
      else {
        editor.scanInBufferRange(pxReg, selectionRange, cb);
      }
    });
  }
}

export default new Px2rem();
