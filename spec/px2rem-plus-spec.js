'use babel';

import Px2rem from '../lib/index';

describe('Px2rem Plus', () => {
  let editor, editorView, settingsView, workspaceElement, activationPromise;

  beforeEach(() => {
    activationPromise = atom.packages.activatePackage('px2rem-plus');

    waitsForPromise(() => {
      return atom.workspace.open();
    });

    runs(() => {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      editor = atom.workspace.getActiveTextEditor();
      editorView = atom.views.getView(editor);
      Px2rem.activate();
      settingsView = Px2rem.settingsView;
    });
  });

  describe('when the px2rem-plus:convert event is triggered', () => {
    it('converts', () => {
      let changeHandler;

      editor = atom.workspace.getActiveTextEditor();
      editor.setText('6px');
      changeHandler = jasmine.createSpy('changeHandler');
      editor.onDidChange(changeHandler);
      atom.commands.dispatch(workspaceElement, 'px2rem-plus:convert');

      waitsForPromise(() => {
        return activationPromise;
      });

      waitsFor(() => {
        return changeHandler.callCount > 0;
      });

      runs(() => {
        expect(editor.getText()).toEqual('.08rem');
      });
    });
  });

  describe('when the px2rem-plus:settings event is triggered', () => {
    it('adds a modal panel', () => {
      expect(settingsView.panel.isVisible()).toBeFalsy();
      atom.commands.dispatch(editorView, 'px2rem-plus:settings');
      expect(settingsView.panel.isVisible()).toBeTruthy();
    });
  });

  describe('when entering a number', () => {
    it('only allows 0-9 and ":" character to be entered in the mini editor', () => {
      expect(settingsView.miniEditor.getText()).toBe('');
      settingsView.miniEditor.insertText('a');
      expect(settingsView.miniEditor.getText()).toBe('');
      settingsView.miniEditor.insertText('path/file.txt:56');
      expect(settingsView.miniEditor.getText()).toBe('');
      settingsView.miniEditor.insertText('.');
      expect(settingsView.miniEditor.getText()).toBe('.');
      settingsView.miniEditor.setText('');
      settingsView.miniEditor.insertText('4');
      expect(settingsView.miniEditor.getText()).toBe('4');
    });
  });

  describe('when core:confirm is triggered', () => {
    it('closes the view', () => {
      atom.commands.dispatch(editorView, 'px2rem-plus:settings');
      expect(settingsView.panel.isVisible()).toBeTruthy();
      atom.commands.dispatch(settingsView.miniEditor.element, 'core:confirm');
      expect(settingsView.panel.isVisible()).toBeFalsy();
    });
  });

  describe('when core:cancel is triggered', () => {
    it('closes the view', () => {
      atom.commands.dispatch(editorView, 'px2rem-plus:settings');
      expect(settingsView.panel.isVisible()).toBeTruthy();
      atom.commands.dispatch(settingsView.miniEditor.element, 'core:cancel');
      expect(settingsView.panel.isVisible()).toBeFalsy();
    });
  });
});
