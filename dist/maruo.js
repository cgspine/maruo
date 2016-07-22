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
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _vm = __webpack_require__(3);
	
	var _vm2 = _interopRequireDefault(_vm);
	
	var _event = __webpack_require__(11);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _dom = __webpack_require__(12);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	__webpack_require__(17);
	
	function maruo(el) {
	    return new maruo.init(el);
	}
	
	maruo.init = function (el) {
	    this[0] = this.el = el;
	};
	
	maruo.fn = maruo.prototype = maruo.init.prototype;
	
	maruo.vms = {};
	
	_core2['default'](maruo);
	_vm2['default'](maruo);
	_event2['default'](maruo);
	_dom2['default'](maruo);
	
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
	        var vm = new _observable.Observable(definition, {
	            id: $id
	        });
	        return maruo.vms[$id] = vm;
	    };
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
	
	var _utilData = __webpack_require__(5);
	
	var _utilIndex = __webpack_require__(7);
	
	var _array = __webpack_require__(8);
	
	var arrayKeys = Object.getOwnPropertyNames(_array.arrayMethods);
	
	function def(ob, key, value, enumerable) {
	    Object.defineProperty(ob, key, {
	        value: value,
	        writable: true,
	        configurable: true,
	        enumerable: !!enumerable
	    });
	}
	
	function Observable(definition, options) {
	    options = options || {};
	    this.id = options.id || '';
	    this.spath = options.spath || '';
	    this.root = options.root || this;
	    this.hashCode = options.hashCode || _utilIndex.makeHashCode('$');
	    this.$events = {};
	    if (Array.isArray(definition)) {
	        this.__data__ = options.__data__ || [];
	        this.observeArray(definition, options);
	    } else {
	        this.__data__ = options.__data__ || Object.create(null);
	        this.$skipArray = {};
	        if (definition.$skipArray) {
	            this.$skipArray = _utilIndex.oneObject(definition.$skipArray);
	            delete definition.$skipArray;
	        }
	        this.observeObject(definition, options);
	    }
	    def(this.__data__, '__ob__', this);
	}
	
	Observable.prototype.wait = function () {
	    this.root.$events.$$wait$$ = true;
	};
	
	Observable.prototype.$watch = function (expr, callback) {
	    if (arguments.length === 2) {
	        (this.root.$events[expr] || (this.root.$events[expr] = [])).ensure(callback);
	    } else {
	        throw '$watch方法参数不对';
	    }
	};
	
	Observable.prototype.$emit = function (expr, oldVal, newVal) {
	    var root = this.root;
	    var list = root.$events[expr];
	    if (list) {
	        list.forEach(function (callback) {
	            callback.call(root, oldVal, newVal);
	        });
	    }
	};
	
	Observable.prototype.observeObject = function (definition, options) {
	    var key,
	        val,
	        values = {};
	    for (key in definition) {
	        if (definition.hasOwnProperty(key)) {
	            val = values[key] = definition[key];
	            if (!this.isPropSkip(key, val)) {
	                this.makePropAccessor(key);
	            } else if (typeof val === 'function') {
	                this.makeFuncAccessor(key, val);
	            }
	        }
	    }
	    // 赋值与代理
	    for (key in values) {
	        if (values.hasOwnProperty(key)) {
	            //对普通监控属性或访问器属性进行赋值
	            this.__data__[key] = values[key];
	            this.proxy(key);
	            if (key in this.$skipArray) {
	                delete values[key];
	            } else {
	                values[key] = true;
	            }
	        }
	    }
	    // 使得$id不可被枚举
	    _utilIndex.hideProperty(this.__data__, '$id', options.id);
	
	    // 改写hasOwnProperty
	    _utilIndex.hideProperty(this.__data__, 'hasOwnProperty', function (key) {
	        return values[key] === true;
	    });
	};
	
	Observable.prototype.observeArray = function (definition, options) {
	    this.proxy('length');
	    // 劫持数组的方法
	    for (var i = 0; i < arrayKeys.length; i++) {
	        var key = arrayKeys[i];
	        defArrayMethods(this.__data__, key, _array.arrayMethods[key]);
	    }
	    this.makeArrayAccessor(definition, options);
	};
	
	function defArrayMethods(ob, key, val) {
	    Object.defineProperty(ob, key, {
	        value: function value() {
	            return val.apply(ob, arguments);
	        },
	        writable: true,
	        configurable: true,
	        enumerable: false
	    });
	}
	
	/**
	 * 代理__data__
	 * @param key
	 */
	Observable.prototype.proxy = function (key) {
	    var self = this;
	    Object.defineProperty(this, key, {
	        get: function get() {
	            return self.__data__[key];
	        },
	        set: function set(val) {
	            self.__data__[key] = val;
	        },
	        enumerable: false,
	        configurable: true
	    });
	};
	
	/**
	 * 转换为纯对象
	 * @returns {*}
	 */
	Observable.prototype.$model = function () {
	    return _utilData.toJson(this.__data__);
	};
	
	/**
	 * 属性accessor构造
	 * @param sid
	 * @param key
	 */
	Observable.prototype.makePropAccessor = function (key) {
	    var val = NaN;
	    var root = this.root;
	    var sid = this.id + '.' + 'key';
	    var spath = this.spath.length > 0 ? this.spath + '.' + key : key;
	    Object.defineProperty(this.__data__, key, {
	        get: function get() {
	            return val.__data__ || val;
	        },
	        set: function set(newValue) {
	            if (val === newValue) {
	                return;
	            }
	            if (newValue && typeof newValue === 'object') {
	                newValue = new Observable(newValue, {
	                    id: sid,
	                    root: root,
	                    spath: spath,
	                    oldVm: val
	                });
	                root.$emit(spath, val, newValue.__data__);
	            } else {
	                root.$emit(spath, val, newValue);
	            }
	            val = newValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	};
	
	/**
	 * 函数accessor构造
	 * @param key
	 * @param val
	 */
	Observable.prototype.makeFuncAccessor = function (key, val) {
	    var self = this;
	    Object.defineProperty(self, key, {
	        value: function value() {
	            return val.apply(self, arguments);
	        },
	        writable: true,
	        enumerable: true,
	        configurable: true
	    });
	};
	
	Observable.prototype.makeArrayAccessor = function (array) {
	    var i, l, el;
	
	    for (i = 0, l = array.length; i < l; i++) {
	        el = array[i];
	        el = this.arrayAdapter(el, i);
	        this.__data__[i] = el;
	    }
	};
	
	// 数组插入元素、删除元素等都会使得排序发生变化,因此subscript就会非常不靠谱,所以需要引入hashCode
	Observable.prototype.arrayAdapter = function (element) {
	    if (element !== null && typeof element === 'object') {
	        var hashCode = _utilIndex.makeHashCode('$');
	        def(element, '__ob__', new Observable(element, {
	            id: this.id + '.*',
	            spath: this.spath + '.*',
	            root: this.root,
	            hashCode: hashCode,
	            __data__: element
	        }));
	        return element;
	    }
	    return element;
	};
	
	Observable.prototype.isPropSkip = function (key, value) {
	    // 判定此属性能否转换访问器
	    return key.charAt(0) === '$' || this.$skipArray[key] || typeof value === 'function' || value && value.nodeName && value.nodeType > 0;
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
	 * Created by cgspine on 16/7/19.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	var _utilConst = __webpack_require__(2);
	
	var _observable = __webpack_require__(4);
	
	var arrayProto = Array.prototype;
	
	var arrayMethods = Object.create(arrayProto);
	
	exports.arrayMethods = arrayMethods;
	'push,pop,shift,unshift,splice,sort,reverse'.replace(_utilConst.rword, function (method) {
	    var origin = arrayProto[method];
	    Object.defineProperty(arrayMethods, method, {
	        value: function value() {
	            var i = arguments.length;
	            var args = new Array(i);
	            while (i--) {
	                args[i] = arguments[i];
	            }
	
	            var ob = this.__ob__;
	            //只处理Observable对象上的调用
	            if (!ob) {
	                return origin.apply(this, args);
	            }
	
	            var size = this.length;
	            var self = this;
	            var result = origin.apply(this, args);
	            var inserted;
	            switch (method) {
	                case 'push':
	                    inserted = args;
	                case 'unshift':
	                    inserted = args;
	                case 'splice':
	                    inserted = args.slice(2);
	            }
	            if (inserted) {
	                inserted.forEach(function (el) {
	                    var index = self.indexOf(el);
	                    ob.arrayAdapter(el, index);
	                });
	            }
	            if (this.length != size) {
	                ob.root.$emit(ob.spath.length > 0 ? ob.spath + '.length' : 'length', size, this.length);
	            }
	            ob.root.$emit(ob.spath);
	            return result;
	        },
	        writable: true,
	        enumerable: false,
	        configurable: false
	    });
	});
	
	Object.defineProperty(arrayMethods, '$get', {
	    value: function value(index) {
	
	        var item = this[index];
	        if (item.__ob__) {
	            return item.__ob__.__data__;
	        }
	        return item;
	    },
	    writable: true,
	    enumerable: false,
	    configurable: false
	});
	
	Object.defineProperty(arrayMethods, '$set', {
	    value: function value(index, _value) {
	        this.splice(index, 1, _value);
	    },
	    writable: true,
	    enumerable: false,
	    configurable: false
	});

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
	
	var _config = __webpack_require__(10);
	
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

/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = mixinEvent;
	
	function mixinEvent(maruo) {
	    maruo.bind = function (el, type, fn) {
	        el.addEventListener(type, fn);
	    };
	}
	
	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = mixinDom;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _ready = __webpack_require__(13);
	
	var _ready2 = _interopRequireDefault(_ready);
	
	var _scan = __webpack_require__(15);
	
	var _scan2 = _interopRequireDefault(_scan);
	
	function mixinDom(maruo) {
	    _ready2['default'](function () {
	        _scan2['default'](document.body, maruo);
	    });
	    maruo.scan = _scan2['default'];
	}
	
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = ready;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _browser = __webpack_require__(14);
	
	var _browser2 = _interopRequireDefault(_browser);
	
	var document = _browser2['default'].document;
	var window = _browser2['default'].window;
	
	var readyList = [],
	    isReady;
	var fireReady = function fireReady(fn) {
	    isReady = true;
	    while (fn = readyList.shift()) {
	        fn();
	    }
	};
	
	if (document.readyState === 'complete') {
	    setTimeout(fireReady);
	} else {
	    document.addEventListener('DOMContentLoaded', fireReady);
	}
	
	window.addEventListener('load', fireReady);
	
	function ready(fn) {
	    if (!isReady) {
	        readyList.push(fn);
	    } else {
	        fn();
	    }
	}
	
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Created by cgspine on 16/7/21.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	var browser = {
	    window: global,
	    document: { //方便在nodejs环境不会报错
	        createElement: function createElement() {
	            return {};
	        },
	        createElementNS: function createElementNS() {
	            return {};
	        },
	        contains: Boolean
	    },
	    root: {
	        outerHTML: 'x'
	    },
	    singletonDiv: {},
	    singletonFragment: null
	};
	
	if (window.location && window.navigator && window.window) {
	    var document = window.document;
	    browser.document = document;
	    browser.root = document.documentElement;
	    browser.singletonDiv = document.createElement('div');
	    browser.singletonFragment = document.createDocumentFragment();
	}
	
	exports['default'] = browser;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _class = __webpack_require__(16);
	
	var _class2 = _interopRequireDefault(_class);
	
	var _utilLog = __webpack_require__(9);
	
	function getController(a) {
	    return a.getAttribute('m-controller') || a.getAttribute('m-important');
	}
	
	function scan(els, maruo) {
	    // 不能这样玩, el.childNodes返回nodeList(类数组),并不是Array
	    // els = Array.isArray(els) ? els : [els]
	    maruo = maruo || this;
	    for (var i = 0, el; el = els[i++];) {
	        if (el.nodeType === 1) {
	            var $id = getController(el);
	            var vm = maruo.vms[$id];
	            if (vm && !vm.$el) {
	                _class2['default'].removeClass(el, 'm-controller');
	                vm.$el = el;
	                console.log("hahahahahaha");
	            } else if (!$id) {
	                scan(el.childNodes, maruo);
	            }
	        }
	    }
	}
	
	exports['default'] = function (els, maruo) {
	    if (!els || !els.nodeType) {
	        _utilLog.warn('[avalon.scan] first argument must be element , documentFragment, or document');
	        return;
	    }
	    scan([els], maruo);
	};
	
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	var _utilConst = __webpack_require__(2);
	
	var o = Object.create(null);
	
	var rnoWhite = /\S+/g;
	'add, remove'.replace(_utilConst.rword, function (method) {
	    o[method + 'Class'] = function (el, cls) {
	        if (cls && typeof cls === 'string' && el.nodeType === 1) {
	            cls.replace(rnoWhite, function (c) {
	                el.classList[method](c);
	            });
	        }
	    };
	});
	
	o.hasClass = function (el, cls) {
	    return el.nodeType === 1 && el.classList.contains(cls);
	};
	
	o.toggleClass = function (el, val, stateVal) {
	    var isBool = typeof stateVal === 'boolean';
	    String(val).replace(rnoWhite, function (c) {
	        var state = isBool ? stateVal : !o.hasClass(el, c);
	        o[state ? 'addClass' : 'removeClass'](el, c);
	    });
	};
	
	exports['default'] = o;
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/18.
	 */
	
	'use strict';
	
	__webpack_require__(18);

/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * Created by cgspine on 16/7/18.
	 */
	
	"use strict";
	
	var arrProto = Array.prototype;
	
	Array.prototype.contain = function (el) {
	    return this.indexOf(el) !== -1;
	};
	
	Array.prototype.ensure = function (el) {
	    if (!this.contain(el)) {
	        this.push(el);
	    }
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=maruo.js.map