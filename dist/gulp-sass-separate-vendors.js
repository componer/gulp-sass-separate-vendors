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
	    var importers = '';
	    var styles = '';
	    _.extract = function () {
	        return (0, _gulpBufferify2.default)(function (content) {
	            var lines = content.split("\r\n");
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var line = _step.value;

	                    var text = line.trim();
	                    if (text.indexOf('@import') === 0) {
	                        var matches = text.match(/@import ['"](.+?)['"]/i);
	                        if (Array.isArray(matches)) {
	                            var mod = matches[1];
	                            var vendors = options.vendors;
	                            if (vendors === undefined || vendors === true || Array.isArray(vendors) && vendors.indexOf(mod)) {
	                                importers += text + "\r\n";
	                                continue;
	                            }
	                        }
	                    }
	                    styles += text + "\r\n";
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

	            return importers;
	        });
	    };
	    _.filter = function () {
	        return (0, _gulpBufferify2.default)(function (content) {
	            return styles.trim();
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