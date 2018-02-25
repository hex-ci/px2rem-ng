'use babel';

import { CompositeDisposable } from 'atom';
import Provider from './provider.js';
import SettingsView from './settings-view.js';
import helper from './helpers.js';

const pxReg = /[+-]?([0-9]*[.])?[0-9]+px/gm;

class Px2rem {
  activate(state) {
    helper.config = (state ? state.config : {});

    this.settingsView = new SettingsView();
    this.provider = new Provider();

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'px2rem-plus:convert': () => this.convert()
    }));
  }

  deactivate() {
    this.settingsView.destroy();
    this.subscriptions.dispose();
  }

  serialize() {
    return {
      config: helper.config
    };
  }

  provide() {
    return this.provider;
  }

  convert() {
    const editor = atom.workspace.getActiveTextEditor();

    if (!editor) {
      return;
    }

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
