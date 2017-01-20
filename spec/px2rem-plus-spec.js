'use babel';

import Px2rem from '../lib/index';

describe('Px2rem Plus', () => {
  let activationPromise;

  beforeEach(() => {
    activationPromise = atom.packages.activatePackage('px2rem-plus');

    return waitsForPromise(() => {
      return atom.workspace.open();
    });
  });

  it('converts', () => {
    let editor, changeHandler;

    editor = atom.workspace.getActiveTextEditor();
    editor.setText('6px');
    changeHandler = jasmine.createSpy('changeHandler');
    editor.onDidChange(changeHandler);
    atom.commands.dispatch(atom.views.getView(editor), 'px2rem-plus:convert');

    waitsForPromise(() => {
      return activationPromise;
    });

    waitsFor(() => {
      return changeHandler.callCount > 0;
    });

    return runs(() => {
      return expect(editor.getText()).toEqual('0.08rem');
    });
  });
});
