'use babel';

import { TextEditor } from 'atom';
import helper from './helpers.js';

class SettingsView {
  constructor () {
    this.miniEditor = new TextEditor({ mini: true });
    this.miniEditor.element.addEventListener('blur', this.close.bind(this));

    this.message = document.createElement('div');
    this.message.classList.add('message');

    this.element = document.createElement('div');
    this.element.classList.add('px2rem-plus');
    this.element.appendChild(this.miniEditor.element);
    this.element.appendChild(this.message);

    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false
    });
    atom.commands.add('atom-text-editor', 'px2rem-plus:settings', () => {
      this.toggle();
      return false;
    });
    atom.commands.add(this.miniEditor.element, 'core:confirm', () => {
      this.confirm();
    });
    atom.commands.add(this.miniEditor.element, 'core:cancel', () => {
      this.close();
    });
    this.miniEditor.onWillInsertText((arg) => {
      if (isNaN(arg.text)) {
        arg.cancel();
      }
    });
  }

  toggle () {
    this.panel.isVisible() ? this.close() : this.open();
  }

  close () {
    if (!this.panel.isVisible()) return;
    this.miniEditor.setText('');
    this.panel.hide();
    if (this.miniEditor.element.hasFocus()) {
      this.restoreFocus();
    }
  }

  confirm () {
    const base = this.miniEditor.getText();
    const editor = atom.workspace.getActiveTextEditor();

    this.close();

    if (!editor || !editor.getPath()) {
      atom.notifications.addWarning('px2rem+ pixel base not modified!');
      return;
    }

    helper.setBase(base.trim());

    atom.notifications.addSuccess('px2rem+ pixel base modify success!');
  }

  storeFocusedElement () {
    this.previouslyFocusedElement = document.activeElement;
    return this.previouslyFocusedElement;
  }

  restoreFocus () {
    if (this.previouslyFocusedElement && this.previouslyFocusedElement.parentElement) {
      return this.previouslyFocusedElement.focus();
    }
    atom.views.getView(atom.workspace).focus();
  }

  open () {
    if (this.panel.isVisible() || !atom.workspace.getActiveTextEditor()) return;
    this.storeFocusedElement();
    this.panel.show();
    this.miniEditor.setText(String(helper.getBase()));
    this.miniEditor.selectAll();
    this.message.textContent = 'Enter a pixel base for current file. Examples: "75"';
    this.miniEditor.element.focus();
  }
}

export default SettingsView;
