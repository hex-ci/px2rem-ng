'use babel'

import autoCompleteProvider from './provider.js'
import helper from './helpers.js'

const pxReg = /[+-]?([0-9]*[.])?[0-9]+px/gm

class Px2rem {
    config = {
        base: {
            title: 'Default base size',
            description: 'The base size for px convert to rem',
            type: 'integer',
            default: 75,
            minimum: 1
        },
        length: {
            title: 'Default length',
            description: 'The length after decimal point',
            type: 'integer',
            default: 2,
            minium: 0,
            maxium: 20
        }
    }
    activate() {
        let self = this
        atom.commands.add('atom-workspace', 'px2rem-ng:convert', () => {
            self.convert()
        })
        this.autoCompleteProvider = autoCompleteProvider
    }
    deactivate() {
        this.autoCompleteProvider = null
    }
    hinter() {
        return this.autoCompleteProvider
    }
    convert() {
        const editor = atom.workspace.getActiveTextEditor()
        const buffer = editor.getBuffer()
        const selection = editor.getLastSelection()
        const selectionRange = selection.getBufferRange()
        const selectionText = selection.getText()

        if (selectionText.length) {
            editor.setTextInBufferRange(selectionRange, selectionText.replace(pxReg, match => {
                return helper.toRem(match);
            }))
        }
        else {
            editor.scan(pxReg, res => {
                res.replace(helper.toRem(res.match[0]))
            })
        }
    }
}

export default new Px2rem()
