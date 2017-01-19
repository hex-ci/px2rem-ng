'use babel';

import EventEmitter from 'events';
import { TextEditorView } from 'atom-space-pen-views';
import { $ } from 'atom-space-pen-views';

export default class SettingsView extends EventEmitter {

  constructor() {
    super();

    const me = this;

    this.data = {};

    const baseEditor = new TextEditorView({
      mini: true,
      placeholderText: 'Pixel Base'
    });
    baseEditor.setText('75');
    this.baseEditor = baseEditor;
    const precisionEditor = new TextEditorView({
      mini: true,
      placeholderText: 'Precision'
    });
    precisionEditor.setText('2');

    let el = $('<div class="px2rem"></div>');
    el.append('<div class="panel-heading">px => rem</div>');

    let body = $('<div class="panel-body padded"></div>');

    let item = $('<div class="px2rem-control"></div>');
    item.append('<label>Pixel Base</label>');
    item.append(baseEditor.element);
    body.append(item);

    item = $('<div class="px2rem-control"></div>');
    item.append('<label>Precision</label>');
    item.append(precisionEditor.element);
    body.append(item);

    let action = $('<div class="actions text-right"></div>');
    let cancel = $('<button type="button" class="btn inline-block">Cancel</button>');
    let ok = $('<button type="button" class="btn btn-primary inline-block">OK</button>');
    action.append(cancel);
    action.append(ok);
    body.append(action);

    el.append(body);

    this.$el = el[0];

    el.on('keydown', this.onKeydown.bind(this));

    cancel.click(() => {
      me.close();
    });

  }

  destroy() {
    this.$el.remove();
  }

  set editor(editor = null) {
    this.data.editor = editor || null;
  }

  focus() {
    this.baseEditor.element.focus();
  }

  onKeydown(event) {
    if (event.which === 27) {
      this.close();
    }
  }

  // onChangeFrom() {
  //   this.data.from = this.$from.value;
  //   this.data.to = options[0].value;
  //   this.$to.options.length = 0;
  //   this.$to.appendChild(createOptionsFromArray(options, { value: this.data.from }));
  //   this.$submit.disabled = !this.validate();
  // }
  //
  // onChangeTo() {
  //   this.data.to = this.$to.value;
  //   this.$submit.disabled = !this.validate();
  // }
  //
  // onChangeBase() {
  //   this.data.base = this.$base.model.getText();
  //   this.$submit.disabled = !this.validate();
  // }

  onSubmit() {
    if (this.validate()) {
      this.emit('submit', this.data);
      this.close();
    }
  }

  close() {
    this.emit('close', this.data.editor);
  }

  validate() {
    if (this.data.editor === null) {
      return false;
    }

    if (this.data.from === this.data.to) {
      return false;
    }

    if (!+this.data.base) {
      return false;
    }

    return true;
  }
}
