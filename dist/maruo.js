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
	
	maruo.vms = {};
	
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
	
	var _observable = __webpack_require__(4);
	
	var _utilLog = __webpack_require__(9);
	
	function mixinViewModel(maruo) {
	    maruo.define = function (definition) {
	        var $id = definition.$id;
	        if (!$id) {
	            _utilLog.warn('vm.$id must be defined');
	        }
	        if (maruo.vms[$id]) {
	            throw Error('error: [' + $id + '] had been defined!');
	        }
	        var vm = {};
	        new _observable.Observable(vm, definition, {
	            id: $id
	        });
	        return maruo.vms[$id] = vm;
	    };
	
	    maruo.scan = function (el) {};
	}
	
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/14.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.Observable = Observable;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilData = __webpack_require__(5);
	
	var _utilIndex = __webpack_require__(7);
	
	var _config = __webpack_require__(8);
	
	var _config2 = _interopRequireDefault(_config);
	
	var $$skipArray = _config2['default'].$$skipArray;
	
	function Observable(vm, definition, options) {
	    this.vm = vm;
	    vm.__ob__ = this;
	    options = options || {};
	    options.$skipArray = {};
	    if (definition.$skipArray) {
	        options.$skipArray = _utilIndex.oneObject(definition.$skipArray);
	        delete definition.$skipArray;
	    }
	    var hashcode = _utilIndex.makeHashCode('$');
	    options.id = options.id || hashcode;
	    options.hashcode = hashcode;
	
	    this.makeAccessors(definition, options);
	}
	
	Observable.prototype.hideProperties = function (keys, options) {
	    function hasOwnKey(key) {
	        return keys[key] === true;
	    }
	    _utilIndex.hideProperty(this.vm, 'hasOwnProperty', hasOwnKey);
	    _utilIndex.hideProperty(this.vm, '$id', options.id);
	    _utilIndex.hideProperty(this.vm, '$hashcode', options.hashcode);
	    _utilIndex.hideProperty(this.vm, '$track', Object.keys(keys).sort().join(';;'));
	    _utilIndex.hideProperty(this.vm, '$element', null);
	    _utilIndex.hideProperty(this.vm, '$run', this.run.bind(this.vm));
	    _utilIndex.hideProperty(this.vm, '$wait', this.wait.bind(this.vm));
	    _utilIndex.hideProperty(this.vm, '$render', 0);
	    _utilIndex.hideProperty(this.vm, '$events', {});
	
	    var self = this;
	    _utilIndex.hideProperty(this, '$watch', function () {
	        if (arguments.length === 2) {
	            return self.watch.apply(self.vm, arguments);
	        } else {
	            throw '$watch方法参数不对';
	        }
	    });
	    _utilIndex.hideProperty(this.vm, '$fire', this.emit.bind(this.vm));
	};
	
	Observable.prototype.wait = function () {
	    this.vm.$events.$$wait$$ = true;
	};
	
	Observable.prototype.run = function () {
	    var host = this.vm.$events;
	    delete host.$$wait$$;
	    if (host.$$dirty$$) {
	        delete host.$$dirty$$;
	        avalon.rerenderStart = new Date();
	        var id = this.$id;
	        var dotIndex = id.indexOf('.');
	        if (dotIndex > 0) {
	            avalon.batch(id.slice(0, dotIndex));
	        } else {
	            avalon.batch(id);
	        }
	    }
	};
	
	Observable.prototype.watch = function (expr, callback) {};
	
	Observable.prototype.emit = function (expr, a, b) {
	    var list = self.$events[expr];
	};
	
	Observable.prototype.makeAccessors = function (definition, options) {
	    this.makePureModelAccessor();
	
	    var key,
	        val,
	        sid,
	        values = {};
	    options.$skipArray = options.$skipArray || {};
	    for (key in definition) {
	        if (definition.hasOwnProperty(key)) {
	            if ($$skipArray[key]) {
	                continue;
	            }
	            val = values[key] = definition[key];
	            if (!this.isSkip(key, val, options.$skipArray)) {
	                sid = options.id + '.' + key;
	                this.makeAccessor(sid, key);
	            }
	        }
	    }
	    for (key in values) {
	        if (values.hasOwnProperty(key)) {
	            //对普通监控属性或访问器属性进行赋值
	            this.vm[key] = values[key];
	            if (key in options.$skipArray) {
	                delete values[key];
	            } else {
	                values[key] = true;
	            }
	        }
	    }
	
	    this.hideProperties(values, options);
	};
	
	Observable.prototype.makePureModelAccessor = function () {
	    Object.defineProperty(this.vm, "$model", {
	        get: function get() {
	            return _utilData.toJson(this);
	        },
	        set: _utilIndex.noop,
	        enumerable: false,
	        configurable: true
	    });
	};
	
	Observable.prototype.makeAccessor = function (sid, key) {
	    var val = NaN;
	    Object.defineProperty(this.vm, key, {
	        get: function get() {
	            return val;
	        },
	        set: function set(newValue) {
	            if (val === newValue) {
	                return;
	            }
	            val = newValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	};
	
	Observable.prototype.isSkip = function (key, value, skipArray) {
	    // 判定此属性能否转换访问器
	    return key.charAt(0) === '$' || skipArray[key] || typeof value === 'function' || value && value.nodeName && value.nodeType > 0;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/14.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.toJson = toJson;
	
	var _is = __webpack_require__(6);
	
	function toJson(val) {
	    var xtype = _is.type(val);
	    if (xtype === 'array') {
	        var array = [];
	        for (var i = 0; i < val.length; i++) {
	            array[i] = toJson(val[i]);
	        }
	        return array;
	    } else if (xtype === 'object') {
	        var obj = {};
	        for (i in val) {
	            if (i === '__proxy__' || i === '__data__' || i === '__const__') continue;
	            if (val.hasOwnProperty(i)) {
	                var value = val[i];
	                obj[i] = value && value.nodeType ? value : toJson(value);
	            }
	        }
	        return obj;
	    }
	    return val;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/14.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.type = type;
	exports.isFunction = isFunction;
	exports.isWinodw = isWinodw;
	exports.isPlainObject = isPlainObject;
	
	var _const = __webpack_require__(2);
	
	var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/;
	
	var class2type = {};
	'Boolean Number String Function Array Date RegExp Object Error'.replace(_const.rword, function (name) {
	    class2type['[object ' + name + ']'] = name.toLowerCase();
	});
	
	function type(obj) {
	    if (obj == null) {
	        return String(obj);
	    }
	    return typeof obj === 'object' || typeof obj === 'function' ? class2type[_const.toString.call(obj)] || 'object' : typeof obj;
	}
	
	function isFunction(fn) {
	    return typeof fn === 'function';
	}
	
	function isWinodw(win) {
	    return rwindow.test(_const.toString.call(win));
	}
	
	function isPlainObject(obj) {
	    return _const.toString.call(obj) === '[object Object]' && Object.getPrototypeOf(obj) === Object.prototype;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.oneObject = oneObject;
	exports.camelize = camelize;
	exports.hyphenate = hyphenate;
	exports.hideProperty = hideProperty;
	
	var _const = __webpack_require__(2);
	
	var rcamelize = /[-_]([^-_])/g;
	var rhyphenate = /([a-z\d])([A-Z]+)/g;
	var rhashcode = /\d\.\d{4}/;
	
	function oneObject(array, val) {
	    if (typeof array === 'string') {
	        array = array.match(_const.rword) || [];
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
	
	function hideProperty(host, name, value) {
	    Object.defineProperty(host, name, {
	        value: value,
	        writable: true,
	        enumerable: false,
	        configurable: true
	    });
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	var _util = __webpack_require__(7);
	
	exports['default'] = {
	    debug: true,
	
	    $$skipArray: _util.oneObject('$id,$render,$track,$parent,$element,$watch,$fire,$events,$model,$skipArray,$accessors,$hashcode,$run,$wait,__proxy__,__data__,__const__,__ob__')
	};
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports.log = log;
	exports.warn = warn;
	exports.err = err;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _config = __webpack_require__(8);
	
	var _config2 = _interopRequireDefault(_config);
	
	function log() {
	    if (_config2['default'].debug) {
	        console.log(arguments);
	    }
	}
	
	function warn() {
	    if (_config2['default'].debug) {
	        console.warn(arguments);
	    }
	}
	
	function err() {
	    if (_config2['default'].debug) {
	        console.error(arguments);
	    }
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=maruo.js.map