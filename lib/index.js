'use babel';

import { CompositeDisposable } from 'atom';
import autoCompleteProvider from './provider.js';
import SettingsView from './settings-view.js';
import helper from './helpers.js';

const pxReg = /[+-]?([0-9]*[.])?[0-9]+px/gm;

class Px2rem {
  activate(state) {
    const me = this;

    helper.config = (state ? state.config : {});

    this.settingsView = new SettingsView();
    this.autoCompleteProvider = new autoCompleteProvider();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'px2rem-plus:convert': () => this.convert()
    }));
  }

  deactivate() {
    this.subscriptions.dispose();
    delete this.autoCompleteProvider;
    this.autoCompleteProvider = null;
    this.settingsView.destroy();
  }

  serialize() {
    return {
      config: helper.config
    };
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
