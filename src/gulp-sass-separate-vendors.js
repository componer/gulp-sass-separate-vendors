import path from 'path'
import fs from 'fs'
import bufferify from 'gulp-bufferify'

var getFileWithoutExt = filepath => filepath.substr(0, filepath.lastIndexOf('.'))

/**
@desc separate sass importers from source sass, look into ../test/gulp-sass-dll.js
@param object options: {
  boolean|array vendors: modules to separate from source sass, default is true
  init extract:
    1: only vendors in a single file
    0 or false or undefined: vendors in vendors file, and internal (only current source file, other imported local files will be treated as vendors) styles in single file, two output files
    -1: only styles without vendors
}
@return {
  function init(vendors): use before sass compile,
  function compile(): use after sass compiled,
  function combine(): use after compile(), output both styles and vendors styles
  function extract(which): use after combine(), extract vendors or filter vendors
    1: only output vendors css file
    -1: only output styles css file without vendors css file
}
**/
export default function(options = {}) {
  var _ = {}
  var vendors
  var originFileId
  var vendorsFileId
  var importVendors = ''
  var importModules = {}
  var importBuild = (content, file, context) => {
    let lines = content.split("\n")
    lines.forEach((line, i) => {
      let text = line.trim()
      if(text.indexOf('@import') !== 0) return

      let matches = text.match(/@import ['"](.+?)['"]/i)
      if(!Array.isArray(matches)) return

      let mod = matches[1]

      if(mod.substr(mod.length - 4) === '.css') return

      /**
       * if we find this line is a importer for a vendor
       */
      if(vendors === undefined || vendors === true || (Array.isArray(vendors) && vendors.indexOf(mod) > -1)) {
        importVendors += text + "\n"
        lines[i] = '/*(vendor:' + mod + ':*/' + text + '/*:' + mod + ')*/' // this line will be commented in original file
        return
      }

      /**
       * if we find this line is a importer for a local .scss file
       */
      let dir = path.dirname(file.path)
      let ext = file.path.substr(file.path.lastIndexOf('.'))
      let build = modfile => {
        let modid = getFileWithoutExt(modfile)
        importModules[modid] = {
            module: mod,
            file: modfile,
            parent: file.path,
        }
        lines[i] = '/*(module:' + mod + ':*/' + text + '/*:' + modid + ')*/' // this line will be replaced with new file in original file

        let newfile = file.clone()
        let modbuffer = fs.readFileSync(modfile).toString()
        newfile.path = modfile
        newfile.contents = importBuild(modbuffer, newfile, context)
        context.push(newfile)
      }
      if(fs.existsSync(path.resolve(dir, mod))) {
        let modfile = path.resolve(dir, mod)
        build(modfile)
        return
      }
      else if(fs.existsSync(path.resolve(dir, '_' + mod + ext))) {
        let modfile = path.resolve(dir, '_' + mod + ext)
        build(modfile)
        return
      }
    })
    content = lines.join("\n")

    originFileId = getFileWithoutExt(file.path)
    return new Buffer(content)
  }

  _.init = (vendors) => bufferify((content, file, context, notifier) => {
    let callback = notifier()
    vendors = vendors || options.vendors
    file.contents = importBuild(content, file, context, notifier)

    /**
     * add vendors as a new file in pipe line, then it will output a .vendors.css file
     */
    if(importVendors !== '') {
      let vendorsCollector = file.clone()
      let ext = file.path.substr(file.path.lastIndexOf('.'))
      let vendorsFilePath = vendorsCollector.path = file.path.substr(0, file.path.lastIndexOf('.')) + '.vendors' + ext
      vendorsCollector.contents = new Buffer(importVendors)
      context.push(vendorsCollector)
      vendorsFileId = getFileWithoutExt(vendorsFilePath)
    }

    callback(null, file)
  })
  _.compile = () => bufferify((content, file, context, notifier) => {
    let callback = notifier()
    let filepath = file.path
    let modid = getFileWithoutExt(filepath)

    if(importModules[modid]) {
      // remove @charset from import module files
      if(content.indexOf('@charset') === 0) {
        content = content.replace(/@charset\s+['"](.*?)['"];/i, match => {
          return ''
        })
        content = content.trim()
      }
      importModules[modid].content = content
      return callback() // drop this file in pipe line
    }
    callback(null, file) // only original file and vendors file left in pipe line
  })
  _.combine = () => bufferify((content, file, context, notifier) => {
    let callback = notifier()
    let filepath = file.path
    let modid = getFileWithoutExt(filepath)
    if(modid !== originFileId) {
      return callback(null, file) // vendors will not be in pipe line
    }

    // find out import modules, and replace all of them
    while(content.indexOf('/*(module:') > 0) {
      content = content.replace(/\/\*\(module\:(.+?)\:\*\/([\s\S]+?)\/\*\:(.+?)\)\*\//ig, (match, $1, $2, $3, string) => {
        let resolve = importModules[$3] && importModules[$3].content ? importModules[$3].content : '/* @import "' + $1 + '" */'
        delete importModules[$3]
        return resolve
      })
    }

    // find out vendors, and replace them with comments
    content = content.replace(/\/\*\(vendor\:(.+?)\:\*\/([\s\S]+?)\/\*\:(.+?)\)\*\//ig, '/* @import "$1"; */')

    file.contents = new Buffer(content)
    callback(null, file)
  })
  _.extract = which => bufferify((content, file, context, notifier) => {
    let filepath = file.path
    let modid = getFileWithoutExt(filepath)
    let extract = which === undefined ? options.extract : which

    if(extract === 1 && modid === originFileId) return notifier()()
    if(extract === -1 && modid === vendorsFileId) return notifier()()
  })
  return _
}
