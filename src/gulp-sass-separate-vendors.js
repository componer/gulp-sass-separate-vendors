import bufferify from 'gulp-bufferify'

/**
@desc separate sass importers from source sass, look into ../test/gulp-sass-dll.js
@param object options: {
    boolean|array vendors: modules to separate from source sass, default is true
}
@return {
    function extract: only vendors,
    function filter: without vendors,
}
**/
export default function(options = {}) {
    var _ = {}
    var importers = ''
    var styles = ''
    _.extract = () => bufferify(content => {
        let lines = content.split("\r\n")
        for(let line of lines) {
            let text = line.trim()
            if(text.indexOf('@import') === 0) {
                let matches = text.match(/@import ['"](.+?)['"]/i)
                if(Array.isArray(matches)) {
                    let mod = matches[1]
                    let vendors = options.vendors
                    if(vendors === undefined || vendors === true || (Array.isArray(vendors) && vendors.indexOf(mod))) {
                        importers += text + "\r\n"
                        continue
                    }
                }
            }
            styles += text + "\r\n"
        }
        return importers
	})
    _.filter = () => bufferify(content => {
        return styles.trim()
	})
    return _
}
