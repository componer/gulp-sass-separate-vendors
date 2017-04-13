import bufferify from 'gulp-bufferify'

/**
@desc separate sass importers from source sass, look into ../test/gulp-sass-dll.js
@param object options: {
    boolean|array vendors: modules to separate from source sass, default is true
    init extract:
        1: only vendors in a single file
        0 or false or undefined: vendors in vendors file, and internal styles in single file, two output files
        -1: only styles without vendors
}
@return {
    function extract: only vendors,
    function filter: without vendors,
}
**/
export default function(options = {}) {
    var _ = {}
    var originFile
    var vendorsFile

    _.init = () => bufferify((content, file, context) => {
        let importers = ''
        let lines = content.split("\r\n")

        for(let line of lines) {
            let text = line.trim()
            if(text.indexOf('@import') !== 0) continue

            let matches = text.match(/@import ['"](.+?)['"]/i)
            if(!Array.isArray(matches)) continue

            let mod = matches[1]
            if(mod.substr(mod.length - 4) === '.css') continue

            let vendors = options.vendors
            if(vendors === undefined || vendors === true || (Array.isArray(vendors) && vendors.indexOf(mod) > -1)) {
                importers += text + "\r\n"
                content = content.replace(text, '/*(' + mod + ':*/' + text + '/*:' + mod + ')*/')
            }
        }

        let filepath = originFile = file.path
        if(importers !== '') {
            let newfile = file.clone()
            let ext = filepath.substr(filepath.lastIndexOf('.'))
            vendorsFile = newfile.path = filepath.substr(0, filepath.lastIndexOf('.')) + '.vendors' + ext
            newfile.contents = new Buffer(importers)
            context.push(newfile)
        }

        return content
    })
    _.extract = (output) => bufferify((content, file, context, notifier) => {
        let filepath = file.path
        let filename = filepath.substr(0, filepath.lastIndexOf('.'))
        let _originFile = originFile.substr(0, originFile.lastIndexOf('.'))
        let _vendorsFile = vendorsFile && vendorsFile.substr(0, vendorsFile.lastIndexOf('.'))


        output = output === undefined ? options.output : output

        if(output === 1 && filename === _originFile) return notifier()()
        if(output === -1 && filename === _vendorsFile) return notifier()()

        return content.replace(/\/\*\((.+?)\:\*\/([\s\S]+?)\/\*\:(.+?)\)\*\//ig, '/* @import "$1"; */')
	})
    return _
}
