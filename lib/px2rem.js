'use babel'

import autoCompleteProvider from './px2rem-provider.js'

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
        atom.commands.add('atom-workspace', 'px2rem:convert', () => {
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
        editor.scan(pxReg, res => {
            let num = parseFloat(res.match[0])
            num = Number((num / atom.config.get('px2rem.base')).toFixed(atom.config.get('px2rem.length')))
            res.replace(`${num}rem`)
        })
    }
}

export default new Px2rem()
