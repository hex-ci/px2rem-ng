'use babel'

export default {
    toRem(str) {
        let num = parseFloat(str)
        num = Number((num / atom.config.get('px2rem-ng.base')).toFixed(atom.config.get('px2rem-ng.length')))
        return `${num}rem`
    }
}
