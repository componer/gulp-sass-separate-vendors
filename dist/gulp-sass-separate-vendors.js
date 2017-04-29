module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  var _ = {};
	  var vendors;
	  var originFileId;
	  var vendorsFileId;
	  var importVendors = '';
	  var importModules = {};
	  var importBuild = function importBuild(content, file, context) {
	    var lines = content.split("\n");
	    lines.forEach(function (line, i) {
	      var text = line.trim();
	      if (text.indexOf('@import') !== 0) return;

	      var matches = text.match(/@import ['"](.+?)['"]/i);
	      if (!Array.isArray(matches)) return;

	      var mod = matches[1];

	      if (mod.substr(mod.length - 4) === '.css') return;

	      /**
	       * if we find this line is a importer for a vendor
	       */
	      if (vendors === undefined || vendors === true || Array.isArray(vendors) && vendors.indexOf(mod) > -1) {
	        importVendors += text + "\n";
	        lines[i] = '/*(vendor:' + mod + ':*/' + text + '/*:' + mod + ')*/'; // this line will be commented in original file
	        return;
	      }

	      /**
	       * if we find this line is a importer for a local .scss file
	       */
	      var dir = _path2.default.dirname(file.path);
	      var ext = file.path.substr(file.path.lastIndexOf('.'));
	      var build = function build(modfile) {
	        var modid = getFileWithoutExt(modfile);
	        importModules[modid] = {
	          module: mod,
	          file: modfile,
	          parent: file.path
	        };
	        lines[i] = '/*(module:' + mod + ':*/' + text + '/*:' + modid + ')*/'; // this line will be replaced with new file in original file

	        var newfile = file.clone();
	        var modbuffer = _fs2.default.readFileSync(modfile).toString();
	        newfile.path = modfile;
	        newfile.contents = importBuild(modbuffer, newfile, context);
	        context.push(newfile);
	      };
	      if (_fs2.default.existsSync(_path2.default.resolve(dir, mod))) {
	        var modfile = _path2.default.resolve(dir, mod);
	        build(modfile);
	        return;
	      } else if (_fs2.default.existsSync(_path2.default.resolve(dir, '_' + mod + ext))) {
	        var _modfile = _path2.default.resolve(dir, '_' + mod + ext);
	        build(_modfile);
	        return;
	      }
	    });
	    content = lines.join("\n");

	    originFileId = getFileWithoutExt(file.path);
	    return new Buffer(content);
	  };

	  _.init = function (vendors) {
	    return (0, _gulpBufferify2.default)(function (content, file, context, notifier) {
	      var callback = notifier();
	      vendors = vendors || options.vendors;
	      file.contents = importBuild(content, file, context, notifier);

	      /**
	       * add vendors as a new file in pipe line, then it will output a .vendors.css file
	       */
	      if (importVendors !== '') {
	        var vendorsCollector = file.clone();
	        var ext = file.path.substr(file.path.lastIndexOf('.'));
	        var vendorsFilePath = vendorsCollector.path = file.path.substr(0, file.path.lastIndexOf('.')) + '.vendors' + ext;
	        vendorsCollector.contents = new Buffer(importVendors);
	        context.push(vendorsCollector);
	        vendorsFileId = getFileWithoutExt(vendorsFilePath);
	      }

	      callback(null, file);
	    });
	  };
	  _.compile = function () {
	    return (0, _gulpBufferify2.default)(function (content, file, context, notifier) {
	      var callback = notifier();
	      var filepath = file.path;
	      var modid = getFileWithoutExt(filepath);

	      if (importModules[modid]) {
	        // remove @charset from import module files
	        if (content.indexOf('@charset') === 0) {
	          content = content.replace(/@charset\s+['"](.*?)['"];/i, function (match) {
	            return '';
	          });
	          content = content.trim();
	        }
	        importModules[modid].content = content;
	        return callback(); // drop this file in pipe line
	      }
	      callback(null, file); // only original file and vendors file left in pipe line
	    });
	  };
	  _.combine = function () {
	    return (0, _gulpBufferify2.default)(function (content, file, context, notifier) {
	      var callback = notifier();
	      var filepath = file.path;
	      var modid = getFileWithoutExt(filepath);
	      if (modid !== originFileId) {
	        return callback(null, file); // vendors will not be in pipe line
	      }

	      // find out import modules, and replace all of them
	      while (content.indexOf('/*(module:') > 0) {
	        content = content.replace(/\/\*\(module\:(.+?)\:\*\/([\s\S]+?)\/\*\:(.+?)\)\*\//ig, function (match, $1, $2, $3, string) {
	          var resolve = importModules[$3] && importModules[$3].content ? importModules[$3].content : '/* @import "' + $1 + '" */';
	          delete importModules[$3];
	          return resolve;
	        });
	      }

	      // find out vendors, and replace them with comments
	      content = content.replace(/\/\*\(vendor\:(.+?)\:\*\/([\s\S]+?)\/\*\:(.+?)\)\*\//ig, '/* @import "$1"; */');

	      file.contents = new Buffer(content);
	      callback(null, file);
	    });
	  };
	  _.extract = function (which) {
	    return (0, _gulpBufferify2.default)(function (content, file, context, notifier) {
	      var filepath = file.path;
	      var modid = getFileWithoutExt(filepath);
	      var extract = which === undefined ? options.extract : which;

	      if (extract === 1 && modid === originFileId) return notifier()();
	      if (extract === -1 && modid === vendorsFileId) return notifier()();
	    });
	  };
	  return _;
	};

	var _path = __webpack_require__(1);

	var _path2 = _interopRequireDefault(_path);

	var _fs = __webpack_require__(2);

	var _fs2 = _interopRequireDefault(_fs);

	var _gulpBufferify = __webpack_require__(3);

	var _gulpBufferify2 = _interopRequireDefault(_gulpBufferify);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var getFileWithoutExt = function getFileWithoutExt(filepath) {
	  return filepath.substr(0, filepath.lastIndexOf('.'));
	};

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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("fs");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = require("gulp-bufferify");

/***/ })
/******/ ]);