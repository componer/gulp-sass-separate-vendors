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
	    var originFile;
	    var vendorsFile;

	    _.init = function () {
	        return (0, _gulpBufferify2.default)(function (content, file, context) {
	            var importers = '';
	            var filepath = originFile = file.path;
	            var dir = _path2.default.dirname(filepath);

	            /**
	             * first loop, find out the first level of input .scss files, for find out vendors in these .scss files
	             */
	            var lines = content.split("\n");
	            lines.forEach(function (line, i) {
	                var text = line.trim();
	                if (text.indexOf('@import') !== 0) return;

	                var matches = text.match(/@import ['"](.+?)['"]/i);
	                if (!Array.isArray(matches)) return;

	                var mod = matches[1];

	                if (mod.substr(mod.length - 4) === '.css') return;

	                var build = function build(modfile) {
	                    var buffer = _fs2.default.readFileSync(modfile).toString();
	                    lines[i] = buffer;
	                };

	                if (_fs2.default.existsSync(_path2.default.resolve(dir, mod))) {
	                    var modfile = _path2.default.resolve(dir, mod);
	                    build(modfile);
	                    return;
	                } else if (_fs2.default.existsSync(_path2.default.resolve(dir, '_' + mod + '.scss'))) {
	                    var _modfile = _path2.default.resolve(dir, '_' + mod + '.scss');
	                    build(_modfile);
	                    return;
	                }
	            });
	            content = lines.join("\n");

	            /**
	             * second loop, use new content to find out modules and record them
	             */
	            lines = content.split("\n");
	            lines.forEach(function (line, i) {
	                var text = line.trim();
	                if (text.indexOf('@import') !== 0) return;

	                var matches = text.match(/@import ['"](.+?)['"]/i);
	                if (!Array.isArray(matches)) return;

	                var mod = matches[1];

	                if (mod.substr(mod.length - 4) === '.css') return;

	                var vendors = options.vendors;
	                if (vendors === undefined || vendors === true || Array.isArray(vendors) && vendors.indexOf(mod) > -1) {
	                    importers += text + "\r\n";
	                    lines[i] = '/*(' + mod + ':*/' + text + '/*:' + mod + ')*/';
	                }
	            });
	            content = lines.join("\n");

	            /**
	             * if importers is not empty, add a new file in pipe line
	             */
	            if (importers !== '') {
	                var newfile = file.clone();
	                var ext = filepath.substr(filepath.lastIndexOf('.'));
	                vendorsFile = newfile.path = filepath.substr(0, filepath.lastIndexOf('.')) + '.vendors' + ext;
	                newfile.contents = new Buffer(importers);
	                context.push(newfile);
	            }

	            return content;
	        });
	    };
	    _.extract = function (output) {
	        return (0, _gulpBufferify2.default)(function (content, file, context, notifier) {
	            var filepath = file.path;
	            var filename = filepath.substr(0, filepath.lastIndexOf('.'));
	            var _originFile = originFile.substr(0, originFile.lastIndexOf('.'));
	            var _vendorsFile = vendorsFile && vendorsFile.substr(0, vendorsFile.lastIndexOf('.'));

	            output = output === undefined ? options.output : output;

	            if (output === 1 && filename === _originFile) return notifier()();
	            if (output === -1 && filename === _vendorsFile) return notifier()();

	            return content.replace(/\/\*\((.+?)\:\*\/([\s\S]+?)\/\*\:(.+?)\)\*\//ig, '/* @import "$1"; */');
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