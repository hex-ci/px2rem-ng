'use babel';

import { TextEditor } from 'atom';
import helper from './helpers.js';

class SettingsView {
  constructor () {
    this.miniEditor = new TextEditor({
      mini: true
    });
    this.miniEditor.element.addEventListener('blur', this.close.bind(this));

    this.message = document.createElement('div');
    this.message.classList.add('message');
    this.message.textContent = 'Enter a base pixel size of the current file. Examples: "75"';

    const panelHeading = document.createElement('div');
    panelHeading.classList.add('panel-heading');
    panelHeading.textContent = 'px2rem+';

    const panelBody = document.createElement('div');
    panelBody.classList.add('panel-body');

    const label = document.createElement('label');
    label.textContent = 'Base pixel size:';

    panelBody.appendChild(label);
    panelBody.appendChild(this.miniEditor.element);
    panelBody.appendChild(this.message);

    this.element = document.createElement('div');
    this.element.classList.add('px2rem-plus');
    this.element.appendChild(panelHeading);
    this.element.appendChild(panelBody);

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
    if (!this.panel.isVisible()) {
      return;
    }

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
      atom.notifications.addWarning('px2rem+', {
        description: 'The base pixel size of the current file has not been modified!'
      });

      return;
    }

    helper.setBase(base.trim());

    atom.notifications.addSuccess('px2rem+', {
      description: 'The base pixel size of the current file is modified successfully.'
    });
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
    if (this.panel.isVisible() || !atom.workspace.getActiveTextEditor()) {
      return;
    }
    this.storeFocusedElement();
    this.panel.show();
    this.miniEditor.setText(String(helper.getBase()));
    this.miniEditor.selectAll();
    this.miniEditor.element.focus();
  }
}

export default SettingsView;
