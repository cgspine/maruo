(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["maruo"] = factory();
	else
		root["maruo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _coreIndex = __webpack_require__(1);
	
	var _coreIndex2 = _interopRequireDefault(_coreIndex);
	
	var _vmIndex = __webpack_require__(3);
	
	var _vmIndex2 = _interopRequireDefault(_vmIndex);
	
	function maruo(el) {
	    return new maruo.init(el);
	}
	
	maruo.init = function (el) {
	    this[0] = this.el = el;
	};
	
	maruo.fn = maruo.prototype = maruo.init.prototype;
	
	_coreIndex2['default'](maruo);
	_vmIndex2['default'](maruo);
	
	exports['default'] = maruo;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	var _utilConst = __webpack_require__(2);
	
	exports['default'] = function (maruo) {
	
	    /**
	     * shadow copy
	     * @param dest
	     * @param source
	     * @returns {*}
	     */
	    maruo.shadowCopy = function (dest, source) {
	        for (var prop in source) {
	            dest[prop] = source[prop];
	        }
	        return dest;
	    };
	
	    /**
	     * a empty function
	     */
	    maruo.noop = function () {};
	
	    maruo.rword = _utilConst.rword;
	};
	
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Created by cgspine on 16/7/14.
	 */
	
	"use strict";
	
	exports.__esModule = true;
	var rword = /[^, ]+/g;
	
	exports.rword = rword;
	var toString = String.prototype.toString;
	exports.toString = toString;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = mixinViewModel;
	
	var _factory = __webpack_require__(4);
	
	function mixinViewModel(maruo) {
	    maruo.define = function (definition) {
	        var $id = definition.$id;
	        if (!$id) {
	            maruo.warn('vm.$id must be defined');
	        }
	        if (maruo.vms[$id]) {
	            throw Error('error: [' + $id + '] had been defined!');
	        }
	        var vm = _factory.vmFactory(definition);
	    };
	
	    maruo.scan = function (el) {};
	}
	
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.vmFactory = vmFactory;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _util = __webpack_require__(5);
	
	var _config = __webpack_require__(6);
	
	var _config2 = _interopRequireDefault(_config);
	
	var $$skipArray = _config2['default'].$$skipArray;
	
	function vmFactory(definition) {
	    var $skipArray = {};
	    if (definition.$skipArray) {
	        $skipArray = _util.oneObject(definition.$skipArray);
	        delete definition.$skipArray;
	    }
	    var accessors = {},
	        key,
	        val;
	    for (key in definition) {
	        if ($$skipArray[key]) {
	            continue;
	        }
	        val = definition;
	    }
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.oneObject = oneObject;
	exports.camelize = camelize;
	exports.hyphenate = hyphenate;
	var rcamelize = /[-_]([^-_])/g;
	var rhyphenate = /([a-z\d])([A-Z]+)/g;
	var rhashcode = /\d\.\d{4}/;
	
	function oneObject(array, val) {
	    if (typeof array === 'string') {
	        array = array.match(maruo.rword) || [];
	    }
	    var result = {},
	        i = 0,
	        n = array.length,
	        value = val != void 0 ? val : 1;
	    for (; i < n; i++) {
	        result[array[i]] = value;
	    }
	    return result;
	}
	
	function camelize(str) {
	    str.replace(rcamelize, function (matched, element) {
	        return element.toUpperCase();
	    });
	}
	
	function hyphenate(str) {
	    return str.replace(rhyphenate, '$1-$2').toLowerCase();
	}
	
	//生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	var makeHashCode = typeof performance !== 'undefined' && performance.now ? function (prefix) {
	    prefix = prefix || 'maruo';
	    return (prefix + performance.now()).replace('.', '');
	} : function (prefix) {
	    prefix = prefix || 'maruo';
	    return String(Math.random() + Math.random()).replace(rhashcode, prefix);
	};
	
	exports.makeHashCode = makeHashCode;
	var noop = (function () {})();
	exports.noop = noop;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	var _util = __webpack_require__(5);
	
	exports['default'] = {
	    debug: true,
	
	    $$skipArray: _util.oneObject('$id,$render,$track,$element,$watch,$fire,$events,$model,$skipArray,$accessors,$hashcode,$run,$wait,__proxy__,__data__,__const__')
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=maruo.js.map