'use babel'

import autoCompleteProvider from './provider.js';
import SettingsView from './settings-view.js';
import helper from './helpers.js';

const pxReg = /[+-]?([0-9]*[.])?[0-9]+px/gm;

let settingsView;
let settingsPanel;

class Px2rem {
  config = {
    base: {
      title: 'Default base size',
      description: 'The base size for px convert to rem',
      type: 'number',
      default: 75,
      minimum: 1,
      order: 1
    },
    precision: {
      title: 'Default precision',
      description: 'The number of digits to the right of the decimal point',
      type: 'integer',
      default: 2,
      minium: 0,
      maxium: 20,
      order: 2
    },
    comment: {
      title: 'Add comment',
      description: 'Add origin pixel value like /&#0042; 100/75 &#0042;/',
      type: 'boolean',
      default: false,
      order: 3
    }
  }

  activate() {
    const me = this;

    settingsView = new SettingsView();

    settingsPanel = atom.workspace.addModalPanel({
      item: settingsView.$el,
      visible: false
    });

    settingsView.on('close', this.hideSettingsPanel);
    //settingsView.on('submit', onConverterViewSubmit);

    atom.commands.add('atom-text-editor', {
      'px2rem-plus:convert': () => {
        me.convert();
      },
      'px2rem-plus:settings': () => {
        me.settings();
      }
    });

    this.autoCompleteProvider = new autoCompleteProvider();
  }

  deactivate() {
    delete this.autoCompleteProvider;
    this.autoCompleteProvider = null;
    settingsPanel.destroy();
    settingsView = null;
  }

  hideSettingsPanel(editor) {
    settingsPanel.hide();
    atom.views.getView(editor).focus();
    settingsView.editor = null;
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
    const selectionText = selection.getText();

    if (selectionText.length) {
      editor.setTextInBufferRange(selectionRange, selectionText.replace(pxReg, match => {
        let remStr = helper.getRem(match);

        return remStr !== false ? remStr : match;
      }));
    }
    else {
      editor.scan(pxReg, res => {
        let remStr = helper.getRem(res.match[0]);

        res.replace(remStr !== false ? remStr : res.match[0]);
      });
    }
  }

  settings() {
    const editor = atom.workspace.getActiveTextEditor();

    settingsPanel.show();
    settingsView.focus();
    settingsView.editor = editor;
  }
}

export default new Px2rem();
