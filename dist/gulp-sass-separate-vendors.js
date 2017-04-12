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
/***/ function(module, exports, __webpack_require__) {

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
	            var lines = content.split("\r\n");

	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var line = _step.value;

	                    var text = line.trim();
	                    if (text.indexOf('@import') !== 0) continue;

	                    var matches = text.match(/@import ['"](.+?)['"]/i);
	                    if (!Array.isArray(matches)) continue;

	                    var mod = matches[1];
	                    if (mod.substr(mod.length - 4) === '.css') continue;

	                    var vendors = options.vendors;
	                    if (vendors === undefined || vendors === true || Array.isArray(vendors) && vendors.indexOf(mod) > -1) {
	                        importers += text + "\r\n";
	                        content = content.replace(text, '/*(' + mod + ':*/' + text + '/*:' + mod + ')*/');
	                    }
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }

	            var filepath = originFile = file.path;
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

	            if (output === -1 && filename === _originFile) return notifier()();
	            if (output === 1 && filename === _vendorsFile) return notifier()();

	            return content.replace(/\/\*\((.+?)\:\*\/([\s\S]+?)\/\*\:(.+?)\)\*\//ig, '/* @import "$1"; */');
	        });
	    };
	    return _;
	};

	var _gulpBufferify = __webpack_require__(1);

	var _gulpBufferify2 = _interopRequireDefault(_gulpBufferify);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("gulp-bufferify");

/***/ }
/******/ ]);