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
	
	var _maruo = __webpack_require__(1);
	
	var _maruo2 = _interopRequireDefault(_maruo);
	
	var _core = __webpack_require__(2);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _vm = __webpack_require__(14);
	
	var _vm2 = _interopRequireDefault(_vm);
	
	var _event = __webpack_require__(20);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _dom = __webpack_require__(21);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	var _directives = __webpack_require__(36);
	
	var _directives2 = _interopRequireDefault(_directives);
	
	__webpack_require__(40);
	
	_core2['default'](_maruo2['default']);
	_vm2['default'](_maruo2['default']);
	_event2['default'](_maruo2['default']);
	_dom2['default'](_maruo2['default']);
	_directives2['default'](_maruo2['default']);
	
	exports['default'] = _maruo2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	"use strict";
	
	exports.__esModule = true;
	function maruo(el) {
	    return new maruo.init(el);
	}
	
	maruo.init = function (el) {
	    this[0] = this.el = el;
	};
	
	maruo.fn = maruo.prototype = maruo.init.prototype;
	
	maruo.vms = {};
	maruo.scopes = {};
	maruo.directives = {};
	
	exports["default"] = maruo;
	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	var _utilConst = __webpack_require__(3);
	
	var _compilerParseExpr = __webpack_require__(4);
	
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
	
	    maruo.directive = function (name, definition) {
	        definition.parse = definition.parse || defaultParse;
	        return maruo.directives[name] = definition;
	    };
	};
	
	function defaultParse(cur, pre, binding) {
	    cur[binding.name] = _compilerParseExpr.parseExpr(binding.expr).getter();
	}
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Created by cgspine on 16/7/14.
	 */
	
	"use strict";
	
	exports.__esModule = true;
	var rword = /[^, ]+/g;
	
	exports.rword = rword;
	var toString = Object.prototype.toString;
	
	exports.toString = toString;
	var hasOwn = Object.prototype.hasOwnProperty;
	exports.hasOwn = hasOwn;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.parseExpr = parseExpr;
	exports.isSimplePath = isSimplePath;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _cache = __webpack_require__(5);
	
	var _cache2 = _interopRequireDefault(_cache);
	
	var _config = __webpack_require__(6);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _util = __webpack_require__(7);
	
	var exprCachePool = new _cache2['default'](1000);
	
	var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
	var rallowedKeywords = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	// keywords that don't make sense inside expressions
	var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';
	var rimproperKeywords = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	var rws = /\s/g;
	var rnewline = /\n+/g;
	var rsave = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
	var rrestore = /"(\d+)"/g;
	var rpathTest = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
	var rbooleanLiteral = /^(?:true|false)$/;
	var rident = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
	
	function parseExpr(str, needSet) {
	    str = str.trim();
	    var hit = exprCachePool.get(str);
	    if (hit) {
	        return hit;
	    }
	    var ret = {
	        expr: str,
	        getter: isSimplePath(str) && str.indexOf('[') < 0 ? makeGetterFn(str) : compileGetter(str)
	    };
	
	    if (needSet) {
	        ret.setter = compileSetter(str);
	    }
	
	    exprCachePool.put(str, ret);
	
	    return ret;
	}
	
	function compileSetter(str) {
	    if (isSimplePath(str) && str.indexOf('[') < 0) {
	        try {
	            return new Function('scope', 'val', 'scope.' + str + ' = val;');
	        } catch (e) {
	            _config2['default'].debug && _util.warn('Invalid setter expression:  ' + expr);
	        }
	    }
	    return _util.noop;
	}
	
	function makeGetterFn(body) {
	    try {
	        return new Function('scope', 'return scope.' + body + ';');
	    } catch (e) {
	        _config2['default'].debug && _util.warn('Invalid expression. ' + 'Generated function body: ' + body);
	    }
	}
	
	/// 对于语言里的保留字、数字、字符串,不能加'scope.',需要先保存再还原
	
	var saved = [];
	
	function restore(str, i) {
	    return saved[i];
	}
	
	function save(str, isString) {
	    var i = saved.length;
	    saved[i] = isString ? str.replace(rnewline, '\\n') : str;
	    return '"' + i + '"';
	}
	
	// 加'scope.'重写
	function rewrite(raw) {
	    var c = raw.charAt(0);
	    var path = raw.slice(1);
	    if (rallowedKeywords.test(path)) {
	        return raw;
	    } else {
	        path = path.indexOf('"') > -1 ? path.replace(rrestore, restore) : path;
	        return c + 'scope.' + path;
	    }
	}
	
	function compileGetter(exp) {
	    if (rimproperKeywords.test(exp)) {
	        _config2['default'].debug && _util.warn('Avoid using reserved keywords in expression: ' + exp);
	    }
	    saved.length = 0;
	    var body = exp.replace(rsave, save).replace(rws, '');
	    body = (' ' + body).replace(rident, rewrite).replace(rrestore, restore);
	    return makeGetterFn(body);
	}
	
	function isSimplePath(exp) {
	    return rpathTest.test(exp) &&
	    // don't treat true/false as paths
	    !rbooleanLiteral.test(exp) &&
	    // Math constants e.g. Math.PI, Math.E etc.
	    exp.slice(0, 5) !== 'Math.';
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * A doubly linked list-based Least Recently Used (LRU)
	 * cache. Will keep most recently used items while
	 * discarding least recently used items when its limit is
	 * reached. This is a bare-bone version of
	 * Rasmus Andersson's js-lru:
	 *
	 *   https://github.com/rsms/js-lru
	 *
	 * @param {Number} limit
	 * @constructor
	 */
	
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = Cache;
	
	function Cache(limit) {
	    this.size = 0;
	    this.limit = limit;
	    this.head = this.tail = undefined;
	    this._keymap = Object.create(null);
	}
	
	var p = Cache.prototype;
	
	/**
	 * Put <value> into the cache associated with <key>.
	 * Returns the entry which was removed to make room for
	 * the new entry. Otherwise undefined is returned.
	 * (i.e. if there was enough room already).
	 *
	 * @param {String} key
	 * @param {*} value
	 * @return {Entry|undefined}
	 */
	
	p.put = function (key, value) {
	    var removed;
	    if (this.size === this.limit) {
	        removed = this.shift();
	    }
	
	    var entry = this.get(key, true);
	    if (!entry) {
	        entry = {
	            key: key
	        };
	        this._keymap[key] = entry;
	        if (this.tail) {
	            this.tail.newer = entry;
	            entry.older = this.tail;
	        } else {
	            this.head = entry;
	        }
	        this.tail = entry;
	        this.size++;
	    }
	    entry.value = value;
	
	    return removed;
	};
	
	/**
	 * Purge the least recently used (oldest) entry from the
	 * cache. Returns the removed entry or undefined if the
	 * cache was empty.
	 */
	
	p.shift = function () {
	    var entry = this.head;
	    if (entry) {
	        this.head = this.head.newer;
	        this.head.older = undefined;
	        entry.newer = entry.older = undefined;
	        this._keymap[entry.key] = undefined;
	        this.size--;
	    }
	    return entry;
	};
	
	/**
	 * Get and register recent use of <key>. Returns the value
	 * associated with <key> or undefined if not in cache.
	 *
	 * @param {String} key
	 * @param {Boolean} returnEntry
	 * @return {Entry|*}
	 */
	
	p.get = function (key, returnEntry) {
	    var entry = this._keymap[key];
	    if (entry === undefined) return;
	    if (entry === this.tail) {
	        return returnEntry ? entry : entry.value;
	    }
	    // HEAD--------------TAIL
	    //   <.older   .newer>
	    //  <--- add direction --
	    //   A  B  C  <D>  E
	    if (entry.newer) {
	        if (entry === this.head) {
	            this.head = entry.newer;
	        }
	        entry.newer.older = entry.older; // C <-- E.
	    }
	    if (entry.older) {
	        entry.older.newer = entry.newer; // C. --> E
	    }
	    entry.newer = undefined; // D --x
	    entry.older = this.tail; // D. --> E
	    if (this.tail) {
	        this.tail.newer = entry; // E. <-- D
	    }
	    this.tail = entry;
	    return returnEntry ? entry : entry.value;
	};
	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	"use strict";
	
	exports.__esModule = true;
	
	var _util = __webpack_require__(7);
	
	var openTag = "{{";
	
	var closeTag = "}}";
	
	var safeOpenTag, safeCloseTag, rexpr, rexprg, rbind;
	updateExp();
	
	function updateExp() {
	    safeOpenTag = _util.escapeRegExp(openTag);
	
	    safeCloseTag = _util.escapeRegExp(closeTag);
	
	    rexpr = new RegExp(safeOpenTag + '([\\s\\S]*)' + safeCloseTag);
	
	    rexprg = new RegExp(safeOpenTag + '([\\s\\S]*)' + safeCloseTag, 'g');
	
	    rbind = new RegExp(safeOpenTag + '[\\s\\S]*' + safeCloseTag + '|\\bms-|\\bslot\\b');
	}
	
	var config = {
	
	    debug: true,
	
	    $$skipArray: _util.oneObject('$id,$render,$track,$parent,$element,$watch,$fire,$events,$model,$skipArray,$accessors,$hashcode,$run,$wait,__proxy__,__data__,__const__,__ob__')
	
	};
	
	Object.defineProperty(config, 'rexpr', {
	    value: rexpr,
	    writable: false,
	    configurable: true,
	    enumerable: true
	});
	
	Object.defineProperty(config, 'rexprg', {
	    value: rexprg,
	    writable: false,
	    configurable: true,
	    enumerable: true
	});
	
	Object.defineProperty(config, 'rbind', {
	    value: rbind,
	    writable: false,
	    configurable: true,
	    enumerable: true
	});
	
	Object.defineProperty(config, 'openTag', Object.defineProperties({
	    get: function get() {
	        return openTag;
	    },
	
	    enumerable: true,
	    configurable: true
	}, {
	    "function": {
	        set: function set(newValue) {
	            openTag = newValue;
	            updateExp();
	        },
	        configurable: true,
	        enumerable: true
	    }
	}));
	
	Object.defineProperty(config, 'closeTag', Object.defineProperties({
	    get: function get() {
	        return closeTag;
	    },
	
	    enumerable: true,
	    configurable: true
	}, {
	    "function": {
	        set: function set(newValue) {
	            closeTag = newValue;
	            updateExp();
	        },
	        configurable: true,
	        enumerable: true
	    }
	}));
	
	exports["default"] = config;
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	var _lang = __webpack_require__(8);
	
	_defaults(exports, _interopExportWildcard(_lang, _defaults));
	
	var _const = __webpack_require__(3);
	
	_defaults(exports, _interopExportWildcard(_const, _defaults));
	
	var _data = __webpack_require__(10);
	
	_defaults(exports, _interopExportWildcard(_data, _defaults));
	
	var _is = __webpack_require__(9);
	
	_defaults(exports, _interopExportWildcard(_is, _defaults));
	
	var _log = __webpack_require__(11);
	
	_defaults(exports, _interopExportWildcard(_log, _defaults));
	
	var _dom = __webpack_require__(12);
	
	_defaults(exports, _interopExportWildcard(_dom, _defaults));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.oneObject = oneObject;
	exports.stripQuotes = stripQuotes;
	exports.camelize = camelize;
	exports.hyphenate = hyphenate;
	exports.escapeRegExp = escapeRegExp;
	exports.hideProperty = hideProperty;
	exports.each = each;
	exports.trim = trim;
	
	var _const = __webpack_require__(3);
	
	var _is = __webpack_require__(9);
	
	var rcamelize = /[-_]([^-_])/g;
	var rhyphenate = /([a-z\d])([A-Z]+)/g;
	var rhashcode = /\d\.\d{4}/;
	var rescape = /[-.*+?^${}()|[\]\/\\]/g;
	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	
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
	
	/**
	 * Strip quotes from a string
	 * @param str
	 * @returns {String | false}
	 */
	
	function stripQuotes(str) {
	    var a = str.charCodeAt(0);
	    var b = str.charCodeAt(str.length - 1);
	    return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
	}
	
	function camelize(str) {
	    str.replace(rcamelize, function (matched, element) {
	        return element.toUpperCase();
	    });
	}
	
	function hyphenate(str) {
	    return str.replace(rhyphenate, '$1-$2').toLowerCase();
	}
	
	function escapeRegExp(target) {
	    //http://stevenlevithan.com/regex/xregexp/
	    //将字符串安全格式化为正则表达式的源码
	    return (target + '').replace(rescape, '\\$&');
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
	
	function each(obj, fn) {
	    if (obj) {
	        //排除null, undefined
	        var i = 0;
	        if (_is.isArrayLike(obj)) {
	            for (var n = obj.length; i < n; i++) {
	                if (fn(i, obj[i]) === false) break;
	            }
	        } else {
	            for (i in obj) {
	                if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
	                    break;
	                }
	            }
	        }
	    }
	}
	
	function trim(text) {
	    return text == null ? "" : (text + "").replace(rtrim, "");
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/14.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.type = type;
	exports.isFunction = isFunction;
	exports.isWinodow = isWinodow;
	exports.isPlainObject = isPlainObject;
	exports.isArrayLike = isArrayLike;
	
	var _const = __webpack_require__(3);
	
	var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/;
	var rarraylike = /(Array|List|Collection|Map|Arguments)\]$/;
	
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
	
	function isWinodow(win) {
	    return rwindow.test(_const.toString.call(win));
	}
	
	function isPlainObject(obj) {
	    return _const.toString.call(obj) === '[object Object]' && Object.getPrototypeOf(obj) === Object.prototype;
	}
	
	function isArrayLike(obj) {
	    if (obj && typeof obj === 'object') {
	        var n = obj.length,
	            str = _const.toString.call(obj);
	        if (rarraylike.test(str)) {
	            return true;
	        } else if (str === '[object Object]' && n === n >>> 0) {
	            return true; //由于ecma262v5能修改对象属性的enumerable，因此不能用propertyIsEnumerable来判定了
	        }
	    }
	    return false;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/14.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.toJson = toJson;
	
	var _is = __webpack_require__(9);
	
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
/* 11 */
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
	
	var _config = __webpack_require__(6);
	
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports.unescapeHTML = unescapeHTML;
	exports.escapeHTML = escapeHTML;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _domBrowser = __webpack_require__(13);
	
	var _domBrowser2 = _interopRequireDefault(_domBrowser);
	
	var reunescapeHTML = /&(?:amp|lt|gt|quot|#39|#96);/g;
	var htmlUnescapes = {
	    '&amp;': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&#39;': "'",
	    '&#96;': '`'
	};
	
	function unescapeHTML(string) {
	    var str = '' + string;
	    return str.replace(reunescapeHTML, function (c) {
	        return htmlUnescapes[c];
	    });
	}
	
	var rescapeHTML = /["'&<>]/;
	//https://github.com/nthtran/vdom-to-html
	//将字符串经过 str 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt
	
	function escapeHTML(string) {
	    var str = '' + string;
	    var match = rescapeHTML.exec(str);
	
	    if (!match) {
	        return str;
	    }
	
	    var escape;
	    var html = '';
	    var index = 0;
	    var lastIndex = 0;
	
	    for (index = match.index; index < str.length; index++) {
	        switch (str.charCodeAt(index)) {
	            case 34:
	                // "
	                escape = '&quot;';
	                break;
	            case 38:
	                // &
	                escape = '&amp;';
	                break;
	            case 39:
	                // '
	                escape = '&#39;';
	                break;
	            case 60:
	                // <
	                escape = '&lt;';
	                break;
	            case 62:
	                // >
	                escape = '&gt;';
	                break;
	            default:
	                continue;
	        }
	
	        if (lastIndex !== index) {
	            html += str.substring(lastIndex, index);
	        }
	
	        lastIndex = index + 1;
	        html += escape;
	    }
	
	    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
	}
	
	var commonTmpDiv = _domBrowser2['default'].document.createElement('div');
	exports.commonTmpDiv = commonTmpDiv;

/***/ },
/* 13 */
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = mixinViewModel;
	
	var _observable = __webpack_require__(15);
	
	var _utilLog = __webpack_require__(11);
	
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/14.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.Observable = Observable;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilData = __webpack_require__(10);
	
	var _utilIndex = __webpack_require__(7);
	
	var _array = __webpack_require__(16);
	
	var _compilerBatch = __webpack_require__(17);
	
	var _compilerBatch2 = _interopRequireDefault(_compilerBatch);
	
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
	    this.$id = options.id || '';
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
	    var sid = this.$id + '.' + 'key';
	    var spath = this.spath.length > 0 ? this.spath + '.' + key : key;
	    var self = this;
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
	            self.batchUpdateView();
	        },
	        enumerable: true,
	        configurable: true
	    });
	};
	
	Observable.prototype.batchUpdateView = function () {
	    var id = this.$id;
	    var dotIndex = id.indexOf('.');
	    if (dotIndex > 0) {
	        _compilerBatch2['default'](id.slice(0, dotIndex));
	    } else {
	        _compilerBatch2['default'](id);
	    }
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/19.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	var _utilConst = __webpack_require__(3);
	
	var _observable = __webpack_require__(15);
	
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _maruo = __webpack_require__(1);
	
	var _maruo2 = _interopRequireDefault(_maruo);
	
	var _reconcile = __webpack_require__(18);
	
	var _reconcile2 = _interopRequireDefault(_reconcile);
	
	var _domBrowser = __webpack_require__(13);
	
	var _domBrowser2 = _interopRequireDefault(_domBrowser);
	
	var _diff = __webpack_require__(19);
	
	var _diff2 = _interopRequireDefault(_diff);
	
	var needRenderIds = [];
	var renderingId = false;
	
	function batch(_x) {
	    var _again = true;
	
	    _function: while (_again) {
	        var id = _x;
	        _again = false;
	
	        if (renderingId) {
	            return needRenderIds.ensure(id);
	        } else {
	            renderingId = id;
	        }
	        var scope = _maruo2['default'].scopes[id];
	        if (!scope || !_domBrowser2['default'].document.nodeName) {
	            return renderingId = null;
	        }
	        var vm = scope.vmodel;
	        var dom = vm.$el;
	        var source = dom.vtree || [];
	        var copy = vm.$render();
	        if (scope.isTemp) {
	            //在最开始时,替换作用域的所有节点,确保虚拟DOM与真实DOM是对齐的
	            _reconcile2['default']([dom], source, dom.parentNode);
	            delete _maruo2['default'].scopes[id];
	        }
	
	        _diff2['default'](copy, source);
	
	        var index = needRenderIds.indexOf(renderingId);
	        renderingId = 0;
	        if (index > -1) {
	            var removed = needRenderIds.splice(index, 1);
	            _x = removed[0];
	            _again = true;
	            scope = vm = dom = source = copy = index = removed = undefined;
	            continue _function;
	        }
	
	        var more = needRenderIds.shift();
	        if (more) {
	            batch(more);
	        }
	    }
	}
	
	exports['default'] = batch;
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/24.
	 * 节点对齐算法
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _util = __webpack_require__(7);
	
	var _domBrowser = __webpack_require__(13);
	
	var _domBrowser2 = _interopRequireDefault(_domBrowser);
	
	var rforHolder = /^m\-for/;
	var rwhiteRetain = /[\S\xA0]/;
	var plainTag = _util.oneObject('script,style,template,noscript,textarea');
	
	function reconcile(nodes, vnodes, parent) {
	    vnodes = flatten(vnodes);
	    var vl = vnodes.length;
	    if (vl === 0) {
	        return;
	    }
	    var map = {};
	    vnodes.forEach(function (el, index) {
	        map[index] = getType(el);
	    });
	    var newNodes = [],
	        change = false,
	        el,
	        i = 0;
	    while (true) {
	        el = nodes[i++];
	        var vtype = el && getType(el);
	        var nl = newNodes.length;
	        if (map[nl] === vtype) {
	            newNodes.push(el);
	            var vnode = vnodes[nl];
	
	            if (vnode.dynamic) {
	                vnode.dom = el;
	            }
	
	            if (el.nodeType === 1 && !vnode.isVoidTag && !plainTag[vnode.type]) {
	                if (el.type === 'select-one') {
	                    //在chrome与firefox下删掉select中的空白节点，会影响到selectedIndex
	                    var fixedIndex = el.selectedIndex;
	                }
	                reconcile(el.childNodes, vnode.children, el);
	                if (el.type === 'select-one') {
	                    el.selectedIndex = fixedIndex;
	                }
	            }
	        } else {
	            change = true;
	            if (map[nl] === '8true') {
	                var vv = vnodes[nl];
	                var comment = document.createComment(vv.nodeValue);
	                vv.dom = comment;
	                newNodes.push(comment);
	                // comment是在lexer的时候被插进来的?
	                i = Math.max(0, --i);
	            }
	        }
	        if (newNodes.length === vl) {
	            break;
	        }
	    }
	
	    if (change) {
	        var f = _domBrowser2['default'].document.createDocumentFragment(),
	            i = 0;
	        while (el = newNodes[i++]) {
	            f.appendChild(el);
	        }
	        while (el = parent.firstChild) {
	            parent.removeChild(el);
	        }
	        parent.appendChild(f);
	    }
	}
	
	function flatten(nodes) {
	    var arr = [];
	    for (var i = 0, el; el = nodes[i]; i++) {
	        if (Array.isArray(el)) {
	            arr = arr.concat(flatten(el));
	        } else {
	            arr.push(el);
	        }
	    }
	    return arr;
	}
	
	function getType(node) {
	    switch (node.nodeType) {
	        case 3:
	            return '3' + rwhiteRetain.test(node.nodeValue);
	        case 1:
	            return '1' + (node.nodeName || node.type).toLowerCase();
	        case 8:
	            return '8' + rforHolder.test(node.nodeValue);
	    }
	}
	
	exports['default'] = reconcile;
	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _maruo = __webpack_require__(1);
	
	var _maruo2 = _interopRequireDefault(_maruo);
	
	var emptyArr = [];
	var emptyObj = function emptyObj() {
	    return {
	        children: [], props: {}
	    };
	};
	
	var directives = _maruo2['default'].directives;
	
	function diff(copys, sources) {
	    for (var i = 0; i < copys.length; i++) {
	        var copy = copys[i];
	        var src = sources[i] || emptyObj();
	
	        switch (copy.nodeType) {
	            case 3:
	                if (copy.dynamic) {
	                    directives['expr'].diff(copy, src);
	                }
	                break;
	            case 8:
	                break;
	            case 1:
	                diffElementBindings(copy, src);
	
	                if (!copy.skipContent && !copy.isVoidTag) {
	                    diff(copy.children, src.children || emptyArr, copy);
	                }
	        }
	    }
	}
	
	function diffElementBindings(copy, src) {
	    var bindings = src.bindings;
	    if (bindings) {
	        bindings.forEach(function (binding) {
	            directives[binding.type].diff(copy, src, binding.name);
	        });
	    }
	}
	
	exports['default'] = diff;
	module.exports = exports['default'];

/***/ },
/* 20 */
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = mixinDom;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _ready = __webpack_require__(22);
	
	var _ready2 = _interopRequireDefault(_ready);
	
	var _scan = __webpack_require__(23);
	
	var _scan2 = _interopRequireDefault(_scan);
	
	var _css2 = __webpack_require__(32);
	
	var _attr2 = __webpack_require__(33);
	
	var _val2 = __webpack_require__(34);
	
	function mixinDom(maruo) {
	    maruo.shadowCopy(maruo.fn, _css2.WH);
	    maruo.shadowCopy(maruo.fn, _css2.scroll);
	    maruo.shadowCopy(maruo.fn, {
	        offset: function offset() {
	            return _css2.offset(this[0]);
	        },
	        css: function css(name, val) {
	            return _css2.css(this[0], name, val);
	        },
	        offsetParent: function offsetParent() {
	            return _css2.offsetParent(this[0]);
	        },
	        position: function position() {
	            return _css2.position(this[0]);
	        },
	        prop: function prop(name, val) {
	            return _attr2.prop(this[0], name, val);
	        },
	        attr: function attr(name, val) {
	            return _attr2.attr(this[0], name, val);
	        },
	        val: function val(value) {
	            if (value !== void 0) {
	                _val2.val(this[0], value);
	                return this;
	            } else {
	                return _val2.val(this[0]);
	            }
	        }
	    });
	    _ready2['default'](function () {
	        _scan2['default'](document.body, maruo);
	    });
	    maruo.scan = _scan2['default'];
	}
	
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = ready;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _browser = __webpack_require__(13);
	
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _class = __webpack_require__(24);
	
	var _class2 = _interopRequireDefault(_class);
	
	var _util = __webpack_require__(7);
	
	var _compilerLexer = __webpack_require__(25);
	
	var _compilerRender = __webpack_require__(30);
	
	var _compilerBatch = __webpack_require__(17);
	
	var _compilerBatch2 = _interopRequireDefault(_compilerBatch);
	
	var _config = __webpack_require__(6);
	
	var _config2 = _interopRequireDefault(_config);
	
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
	                var now = new Date();
	                el.vtree = _compilerLexer.lexer(el.outerHTML);
	                _compilerLexer.optimizate(el.vtree);
	                var now2 = new Date();
	                _config2['default'].debug && _util.log('构建虚拟DOM耗时' + (now2 - now) + 'ms');
	                vm.$render = _compilerRender.render(el.vtree, vm);
	                maruo.scopes[vm.$id] = {
	                    vmodel: vm,
	                    isTemp: true
	                };
	                var now3 = new Date();
	                _config2['default'].debug && _util.log('构建当前vm的$render方法用时' + (now3 - now2) + 'ms');
	                _compilerBatch2['default']($id);
	            } else if (!$id) {
	                scan(el.childNodes, maruo);
	            }
	        }
	    }
	}
	
	exports['default'] = function (els, maruo) {
	    if (!els || !els.nodeType) {
	        _util.warn('[avalon.scan] first argument must be element , documentFragment, or document');
	        return;
	    }
	    scan([els], maruo);
	};
	
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	var _utilConst = __webpack_require__(3);
	
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	// https://rubylouvre.gitbooks.io/avalon/content/virtualdom.html
	
	'use strict';
	
	exports.__esModule = true;
	exports.lexer = lexer;
	exports.optimizate = optimizate;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _vdom = __webpack_require__(26);
	
	var _util = __webpack_require__(7);
	
	var _config = __webpack_require__(6);
	
	var _config2 = _interopRequireDefault(_config);
	
	var rnowhite = /\S+/g;
	var ropenTag = /^<([-A-Za-z0-9_]+)\s*([^>]*?)(\/?)>/;
	var rendTag = /^<\/([^>]+)>/;
	
	// Self-closing tags
	var voidTag = _util.oneObject('area,base,br,col,command,embed,frame,hr,img,input,link,meta,param,source,track,wbr');
	var plainTag = _util.oneObject('script,style,textarea,noscript,option,template');
	
	/**
	 * 步骤一: 将传入字符串进行parser,转换为虚拟DOM
	 */
	
	function lexer(str) {
	    var stack = [];
	    stack.last = function () {
	        return stack[stack.length - 1];
	    };
	    var ret = [];
	    var node, i, nodeValue;
	
	    do {
	        node = false;
	        // text
	        if (str.charAt(0) !== '<') {
	            i = str.indexOf('<');
	            nodeValue = str.slice(0, i);
	            str = str.slice(i);
	            node = new _vdom.VText({
	                type: '#text',
	                nodeType: 3,
	                nodeValue: nodeValue
	            });
	            if (rnowhite.test(nodeValue)) {
	                collectNodes(node, stack, ret);
	            }
	        }
	
	        // comment
	        if (!node) {
	            var i = str.indexOf('<!--');
	            if (i === 0) {
	                var l = str.indexOf('-->');
	                if (l === -1) {
	                    _util.err('注释节点没有闭合: ' + str);
	                }
	                nodeValue = str.slice(4, l);
	                str = str.slice(l + 3);
	                node = new _vdom.VComment({
	                    type: '#comment',
	                    nodeType: 8,
	                    nodeValue: nodeValue
	                });
	                collectNodes(node, stack, ret);
	            }
	        }
	
	        // element
	        if (!node) {
	            var match = str.match(ropenTag);
	            if (match) {
	                var type = match[1].toLowerCase();
	                var isVoidTag = voidTag[type] || match[3] == '\/';
	                node = new _vdom.VElement({
	                    type: type,
	                    nodeType: 1,
	                    props: {},
	                    children: [],
	                    isVoidTag: isVoidTag
	                });
	
	                var attrs = match[2];
	                if (attrs) {
	                    collectProps(attrs, node.props);
	                }
	
	                collectNodes(node, stack, ret);
	
	                str = str.slice(match[0].length);
	
	                if (isVoidTag) {
	                    node.finishCollect = node.isVoidTag = true;
	                } else {
	                    // 这里进入元素盒子里面
	                    stack.push(node);
	                    if (plainTag[type]) {
	                        var index = str.indexOf('</' + type + '>');
	                        var innerHTML = str.slice(0, index).trim();
	                        str = str.slice(index);
	                        if (innerHTML) {
	                            switch (type) {
	
	                                case 'style':
	                                case 'script':
	                                case 'noscript':
	                                case 'template':
	                                    node.skipContent = true;
	                                    node.children.push(new _vdom.VText({
	                                        type: '#text',
	                                        nodeType: 3,
	                                        nodeValue: _util.unescapeHTML(innerHTML)
	                                    }));
	                                    break;
	                                case 'textarea':
	                                    node.skipContent = true;
	                                    node.props.type = 'textarea';
	                                    node.props.value = _util.unescapeHTML(innerHTML);
	                                    break;
	                                case 'option':
	                                    node.children.push({
	                                        nodeType: 3,
	                                        type: '#text',
	                                        nodeValue: _util.unescapeHTML(innerHTML)
	                                    });
	                                    break;
	                            }
	                        }
	                    }
	                }
	            }
	        }
	
	        if (!node) {
	            var match = str.match(rendTag);
	            if (match) {
	                var type = match[1].toLowerCase();
	                var last = stack.last();
	                if (!last) {
	                    _util.err(match[0] + '前面缺少<' + type + '>');
	                } else if (last.type !== type) {
	                    _util.err(last.type + '没有闭合');
	                }
	                node = stack.pop();
	                node.finishCollect = true;
	                str = str.slice(match[0].length);
	            }
	        }
	
	        if (!node) {
	            break;
	        }
	
	        if (node.finishCollect) {
	            fireFinishCollect(node, stack, ret);
	            delete node.fire;
	        }
	    } while (str.length);
	
	    return ret;
	}
	
	/**
	 * 对input/textarea元素补上type属性
	 * ms-*自定义元素补上ms-widget属性
	 * 对table元素补上tbody
	 * 去掉所有只有空白的文本节点
	 */
	function fireFinishCollect(node, stack, ret) {
	    var type = node.type;
	    var props = node.props;
	    switch (type) {
	        case 'input':
	            if (!props.type) {
	                props.type = 'text';
	            }
	            break;
	        case 'select':
	            props.type = type + '-' + props.hasOwnProperty('multiple') ? 'multiple' : 'one';
	            break;
	        case 'table':
	            addTbody(node.children);
	            break;
	        default:
	            break;
	
	    }
	}
	
	//如果直接将tr元素写table下面,那么浏览器将将它们(相邻的那几个),放到一个动态创建的tbody底下
	function addTbody(nodes) {
	    var tbody,
	        needHandleTbody = false,
	        n = nodes.length,
	        node,
	        i;
	    var start = 0,
	        count = 0; //优化: 后面删除node==0的元素时减少遍历次数
	
	    for (i = 0; i < n; i++) {
	        node = nodes[i];
	        if (node.type !== 'tr' && node.nodeType === 1) {
	            tbody = false;
	        } else {
	            if (node.type === 'tr') {
	                needHandleTbody = true;
	                if (!tbody) {
	                    tbody = new _vdom.VElement({
	                        nodeType: 1,
	                        type: 'tbody',
	                        children: [],
	                        props: {}
	                    });
	                    nodes[i] = tbody;
	                    if (start == 0) {
	                        start = i;
	                    }
	                } else {
	                    nodes[i] = 0;
	                    count++;
	                }
	                tbody.children.push(node);
	            }
	        }
	    }
	
	    if (needHandleTbody) {
	        for (i = start; i < n; i++) {
	            if (node[i] === 0) {
	                nodes.splice(i, 1);
	                i--;
	                count--;
	                if (count === 0) {
	                    break;
	                }
	            }
	        }
	    }
	}
	
	function collectNodes(node, stack, ret) {
	    var p = stack.last();
	    if (p) {
	        p.children.push(node);
	    } else {
	        ret.push(node);
	    }
	}
	
	function collectProps(attrs, props) {
	    attrs.replace(rnowhite, function (attr) {
	        var arr = attr.split('=');
	        var name = arr[0];
	        var val = _util.stripQuotes(arr[1]) || '';
	        if (!(name in props)) {
	            props[name] = val;
	        }
	    });
	}
	
	/**
	 * 步骤二: 优化
	 * 对拥有m-*属性的虚拟DOM添加dynamic属性 表明它以后要保持其对应的真实节点
	 * 对没有m-*属性的元素添加skipAttrs属性,表明以后不需要遍历其属性
	 * 如果它的子孙没有m-*或插值表达式或m-自定义元素,那么还加上skipContent，表明以后不要遍历其孩子
	 */
	
	function optimizate(arr) {
	    for (var i = 0; i < arr.length; i++) {
	        hasDirective(arr[i]);
	    }
	}
	
	function hasDirective(a) {
	    switch (a.nodeType) {
	        case 3:
	            if (_config2['default'].rbind.test(a.nodeValue)) {
	                a.dynamic = 'expr';
	                return true;
	            } else {
	                a.skipContent = true;
	                return false;
	            }
	        case 8:
	            if (a.dynamic) {
	                return true;
	            } else {
	                a.skipContent = true;
	                return false;
	            }
	        case 1:
	            if (a.props['m-skip']) {
	                a.skipAttrs = true;
	                a.skipContent = true;
	                return false;
	            }
	            if (/^m\-/.test(a.type) || hasDirectiveAttrs(a.props)) {
	                a.dynamic = true;
	            } else {
	                a.skipAttrs = true;
	            }
	            if (a.isVoidTag && !a.dynamic) {
	                a.skipContent = true;
	                return false;
	            }
	            var hasDirective = childrenHasDirective(a.children);
	            if (!hasDirective && !a.dynamic) {
	                a.skipContent = true;
	                return false;
	            }
	            return true;
	        default:
	            if (Array.isArray(a)) {
	                return childrenHasDirective(a);
	            }
	    }
	}
	
	function childrenHasDirective(arr) {
	    var ret = false;
	    for (var i = 0, el; el = arr[i++];) {
	        if (hasDirective(el)) {
	            ret = true;
	        }
	    }
	    return ret;
	}
	
	function hasDirectiveAttrs(props) {
	    if ('m-skip' in props) return false;
	    for (var i in props) {
	        if (i.indexOf('m-') === 0) {
	            return true;
	        }
	    }
	    return false;
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	var _VElement = __webpack_require__(27);
	
	_defaults(exports, _interopExportWildcard(_VElement, _defaults));
	
	var _VComment = __webpack_require__(28);
	
	_defaults(exports, _interopExportWildcard(_VComment, _defaults));
	
	var _VText = __webpack_require__(29);
	
	_defaults(exports, _interopExportWildcard(_VText, _defaults));

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/22.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.VElement = VElement;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _domBrowser = __webpack_require__(13);
	
	var _domBrowser2 = _interopRequireDefault(_domBrowser);
	
	var _maruo = __webpack_require__(1);
	
	var _maruo2 = _interopRequireDefault(_maruo);
	
	function VElement(type, props, children) {
	    if (typeof type === 'object') {
	        for (var i in type) {
	            this[i] = type[i];
	        }
	    } else {
	        this.nodeType = 1;
	        this.type = type;
	        this.props = props;
	        this.children = children;
	        this.template = '';
	        this.isVoidTag = false;
	    }
	    this.bindings = [];
	    this.copyProto = {
	        props: {},
	        type: this.type,
	        nodeType: 1
	    };
	}
	
	function skipFalseOrFunc(obj) {
	    return obj !== false && Object(obj) !== obj;
	}
	
	VElement.prototype = {
	    constructor: VElement,
	    toDOM: function toDOM() {
	        var tagName = this.type;
	        var dom = _domBrowser2['default'].document.createElement(tagName);
	        for (var i in this.props) {
	            var val = this.props[i];
	            if (skipFalseOrFunc(val)) {
	                dom.setAttribute(i, val + '');
	            }
	        }
	        switch (this.type) {
	            case 'script':
	                dom.text = this.template;
	                break;
	            case 'style':
	                if ('styleSheet' in dom) {
	                    dom.setAttribute('type', 'text/css');
	                    dom.styleSheet.cssText = this.template;
	                } else {
	                    dom.innerHTML = this.template;
	                }
	                break;
	            case 'template':
	                dom.innerHTML = this.template;
	                break;
	            case 'noscript':
	                dom.textContent = this.template;
	                break;
	            default:
	                if (!this.isVoidTag) {
	                    this.children.forEach(function (c) {
	                        c && dom.appendChild(c.toDOM());
	                    });
	                }
	                break;
	        }
	        return dom;
	    },
	    toHTML: function toHTML() {
	        var arr = [];
	        for (var i in this.props) {
	            var val = this.props[i];
	            if (skipFalseOrFunc(val)) {
	                arr.push(i + '=' + JSON.stringify(val + ''));
	            }
	        }
	        arr = arr.length ? ' ' + arr.join(' ') : '';
	        var str = '<' + this.type + arr;
	        if (this.isVoidTag) {
	            return str + '/>';
	        }
	        str += '>';
	        if (this.children.length) {
	            str += this.children.map(function (c) {
	                return c ? c.toHTML() : '';
	            }).join('');
	        } else {
	            str += this.template || '';
	        }
	        return str + '</' + this.type + '>';
	    },
	    generate: function generate(vm) {
	        var copy = {};
	        _maruo2['default'].shadowCopy(copy, this.copyProto);
	        var bindings = this.bindings || [];
	        var self = this;
	        bindings.forEach(function (binding) {
	            _maruo2['default'].directives[binding.type].parse(copy, self, binding, vm);
	        });
	
	        if (this.isVoidTag) {
	            copy.isVoidTag = true;
	        } else {
	            if (!('children' in copy)) {
	                // directive或许或许会赋值给copy children属性
	                var children = this.children;
	                if (children.length) {
	                    copy.children = children.map(function (el) {
	                        return el.generate(vm);
	                    });
	                } else {
	                    copy.children = [];
	                }
	            }
	        }
	
	        if (this.skipContent) copy.skipContent = true;
	        if (this.skipAttrs) copy.skipAttrs = true;
	
	        return new VElement(copy);
	    }
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/22.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports.VComment = VComment;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _domBrowser = __webpack_require__(13);
	
	var _domBrowser2 = _interopRequireDefault(_domBrowser);
	
	function VComment(text) {
	    if (typeof text === 'string') {
	        this.type = '#comment';
	        this.nodeValue = text;
	        this.skipContent = true;
	        this.nodeType = 8;
	    } else {
	        for (var i in text) {
	            if (text.hasOwnProperty(i)) {
	                this[i] = text[i];
	            }
	        }
	    }
	}
	
	VComment.prototype = {
	    constructor: VComment,
	    toDOM: function toDOM() {
	        _domBrowser2['default'].document.createComment(this.nodeValue);
	    },
	    toHTML: function toHTML() {
	        return '<!-- ' + this.nodeValue + ' -->';
	    },
	    generate: function generate(vm) {
	        return this;
	    }
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/22.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports.VText = VText;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _domBrowser = __webpack_require__(13);
	
	var _domBrowser2 = _interopRequireDefault(_domBrowser);
	
	var _config = __webpack_require__(6);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _compilerParseExpr = __webpack_require__(4);
	
	function VText(text) {
	    if (typeof text === 'string') {
	        this.type = 'text';
	        this.nodeValue = text;
	        this.nodeType = 3;
	        this.expression = null;
	    } else {
	        for (var i in text) {
	            if (text.hasOwnProperty(i)) {
	                this[i] = text[i];
	            }
	        }
	    }
	}
	
	VText.prototype = {
	    constructor: VText,
	    toDOM: function toDOM() {
	        _domBrowser2['default'].document.createTextNode(this.nodeValue);
	    },
	    toHTML: function toHTML() {
	        return this.nodeValue;
	    },
	    generate: function generate(vm) {
	        var expr = this.expression;
	        if (expr == null || expr.length == 0) {
	            return this;
	        }
	        var nodeValue = expr.map(function (part) {
	            if (!part.expr) {
	                return part.value;
	            }
	            return _compilerParseExpr.parseExpr(part.value, false).getter(vm);
	        }).join('');
	        return new VText({
	            type: '#text',
	            nodeType: 3,
	            dynamic: true,
	            nodeValue: nodeValue,
	            expression: expr
	        });
	    }
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports.render = render;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _config = __webpack_require__(6);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _util = __webpack_require__(7);
	
	var _vdom = __webpack_require__(26);
	
	var _parseExpr = __webpack_require__(4);
	
	var _maruo = __webpack_require__(1);
	
	var _maruo2 = _interopRequireDefault(_maruo);
	
	var _extractBinding = __webpack_require__(31);
	
	var _extractBinding2 = _interopRequireDefault(_extractBinding);
	
	var rlineSp = /\n\s*/g;
	var rentities = /&[a-z0-9#]{2,10};/;
	
	/**
	 * 将虚拟DOM树转换为一个$render方法
	 */
	
	function render(vtree, vm) {
	    vtree = Array.isArray(vtree) ? vtree : [vtree];
	    parseNodes(vtree, vm);
	    return function () {
	        var vnodes = [];
	        for (var i = 0, el; el = vtree[i++];) {
	            vnodes.push(el.generate(vm));
	        }
	        return vnodes;
	    };
	}
	
	function parseNodes(vtree) {
	    for (var i = 0, el; el = vtree[i++];) {
	        parseNode(el);
	    }
	}
	
	function parseNode(vdom) {
	    switch (vdom.nodeType) {
	        case 3:
	            vdom.expression = extractExpr(vdom.nodeValue);
	            break;
	        case 8:
	            break;
	        case 1:
	            vdom.bindings = _extractBinding2['default'](vdom.copyProto, vdom.props);
	            if (!vdom.isVoidTag) {
	                parseNodes(vdom.children);
	            }
	            break;
	    }
	}
	
	/**
	 * 拆分字符串中的非表达式和表达式
	 * @param str
	 * @returns {Array}
	 */
	function extractExpr(str) {
	    var ret = [];
	    var val, index;
	    do {
	        index = str.indexOf(_config2['default'].openTag);
	        index = index === -1 ? str.length : index;
	        val = str.slice(0, index);
	        if (/\S/.test(val)) {
	            ret.push({
	                value: decode(val),
	                epxr: false
	            });
	            if (index === str.length) {
	                break;
	            }
	        }
	        str = str.slice(index + _config2['default'].openTag.length);
	        if (str) {
	            index = str.indexOf(_config2['default'].closeTag);
	            val = str.slice(0, index);
	            ret.push({
	                value: _util.unescapeHTML(val.replace(rlineSp, '')),
	                expr: true
	            });
	            str = str.slice(index + _config2['default'].openTag.length);
	        }
	    } while (str.length);
	    return ret;
	}
	
	function decode(str) {
	    if (rentities.test(str)) {
	        _util.commonTmpDiv.innerHTML = str;
	        return _util.commonTmpDiv.innerText || _util.commonTmpDiv.textContent;
	    }
	    return str;
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _maruo = __webpack_require__(1);
	
	var _maruo2 = _interopRequireDefault(_maruo);
	
	var _util = __webpack_require__(7);
	
	var directives = _maruo2['default'].directives;
	var eventMap = _util.oneObject('animationend,blur,change,input,click,dblclick,focus,keydown,keypress,' + 'keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit');
	var rbinding = /^m-(\w+)-?(.*)/;
	
	function extractBinds(cur, props) {
	    var bindings = [];
	    var skip = ('m-skip' in props);
	    var uniqSave = {};
	
	    for (var i in props) {
	        var val = props[i],
	            match;
	        if (!skip && (match = i.match(rbinding))) {
	            var type = match[1];
	            var param = match[2] || '';
	            var name = i;
	            if (eventMap[type]) {
	                var order = parseFloat(param) || 0;
	                param = type;
	                type = 'on';
	            }
	            name = 'm-' + type + (param ? '-' + param : '');
	            if (i !== name) {
	                delete props[i];
	                props[name] = val;
	            }
	            if (directives[type]) {
	                var binding = {
	                    type: type,
	                    param: param,
	                    name: name,
	                    expr: val,
	                    priority: directives[type].priority || type.charCodeAt(0) * 100
	                };
	                if (type === 'on') {
	                    order = order || 0;
	                    binding.name += '-' + order; //绑定多次事件
	                    binding.priority = param.charCodeAt(0) * 100 + order;
	                }
	                if (!uniqSave[binding.name]) {
	                    uniqSave[binding.name] = 1;
	                    bindings.push(binding);
	                }
	            }
	        } else {
	            cur.props[i] = props[i];
	        }
	    }
	    bindings.sort(byPriority);
	    return bindings;
	}
	
	function byPriority(a, b) {
	    return a.priority - b.priority;
	}
	
	exports['default'] = extractBinds;
	module.exports = exports['default'];

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/8/2.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports.position = position;
	exports.offset = offset;
	exports.offsetParent = offsetParent;
	exports.css = css;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _util = __webpack_require__(7);
	
	var _domBrowser = __webpack_require__(13);
	
	var _domBrowser2 = _interopRequireDefault(_domBrowser);
	
	/*********************************************************************
	 *                        CSS Hooks                                  *
	 *********************************************************************/
	var cssHooks = {
	    "@:set": function set(node, name, value) {
	        node.style[name] = value;
	    },
	    "@:get": function get(node, name) {
	        if (!node || !node.style) {
	            throw new Error("getComputedStyle要求传入一个节点 " + node);
	        }
	        var ret,
	            computed = _domBrowser2['default'].window.getComputedStyle(node);
	        if (computed) {
	            //IE9下"filter"只能通过getPropertyValue取值.https://github.com/jquery/jquery/commit/9ced0274653b8b17ceb6b0675e2ae05433dcf202
	            ret = name === "filter" ? computed.getPropertyValue(name) : computed[name];
	            if (ret === "") {
	                ret = node.style[name]; //一些浏览器需要我们手动取内联样式
	            }
	        }
	        return ret;
	    }
	};
	
	cssHooks["opacity:get"] = function (node) {
	    var ret = cssHooks["@:get"](node, "opacity");
	    return ret === "" ? "1" : ret;
	};
	
	"top,left".replace(_util.rword, function (name) {
	    cssHooks[name + ":get"] = function (node) {
	        var computed = cssHooks["@:get"](node, name);
	        return (/px$/.test(computed) ? computed : position(node)[name] + "px"
	        );
	    };
	});
	
	var WH = {};
	exports.WH = WH;
	_util.each({
	    Width: 'width',
	    Height: 'height'
	}, function (name, method) {
	    var clientProp = 'client' + name,
	        scrollProp = 'scroll' + name,
	        offsetProp = 'offset' + name;
	    cssHooks[method + ":get"] = function (node, which, override) {
	        var boxSizing = -4;
	        if (typeof override === "number") {
	            boxSizing = override;
	        }
	        which = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"];
	        var ret = node[offsetProp]; // border-box 0
	        if (boxSizing === 2) {
	            // margin-box 2
	            return ret + css(node, "margin" + which[0], true) + css(node, "margin" + which[1], true);
	        }
	        if (boxSizing < 0) {
	            // padding-box  -2
	            ret = ret - css(node, "border" + which[0] + "Width", true) - css(node, "border" + which[1] + "Width", true);
	        }
	        if (boxSizing === -4) {
	            // content-box -4
	            ret = ret - css(node, "padding" + which[0], true) - css(node, "padding" + which[1], true);
	        }
	        return ret;
	    };
	
	    cssHooks[method + "&get"] = function (node) {
	        var hidden = [];
	        showHidden(node, hidden);
	        var val = cssHooks[method + ":get"](node);
	        for (var i = 0, obj; obj = hidden[i++];) {
	            node = obj.node;
	            for (var n in obj) {
	                if (typeof obj[n] === "string") {
	                    node.style[n] = obj[n];
	                }
	            }
	        }
	        return val;
	    };
	    WH[method] = function (val) {
	        var node = this[0];
	        if (arguments.length === 0) {
	            if (node.setTimeout) {
	                // window, IE9+后可以用node.innerWidth /innerHeight代替
	                return node["inner" + name];
	            }
	            if (node.nodeType === 9) {
	                // document, 页面
	                var doc = node.documentElement;
	                // offsetWidth:
	                // IE、Opera认为 offsetWidth = clientWidth + 滚动条 + 边框
	                // NS、FF认为OffsetWidth为网页内容的实际宽度,可以小于页面宽度
	
	                // scrollWidth:
	                // IE、Opera认为scrollWidth为网页内容的实际宽度,可以小于clientWidth
	                // NS、FF认为scrollWidth为网页内容宽度,不过最小值为clientWidth
	
	                // FF chrome    html.scrollHeight< body.scrollHeight
	                // IE 标准模式 : html.scrollHeight> body.scrollHeight
	                return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp]);
	            }
	            return cssHooks[method + "&get"](node);
	        } else {
	            return this.css(method, val);
	        }
	    };
	
	    WH["inner" + name] = function () {
	        return cssHooks[method + ":get"](this[0], void 0, -2);
	    };
	    WH["outer" + name] = function (includeMargin) {
	        return cssHooks[method + ":get"](this[0], void 0, includeMargin === true ? 2 : 0);
	    };
	});
	
	var cssMap = {
	    'float': 'cssFloat'
	};
	
	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
	
	var cssShow = { position: "absolute", visibility: "hidden", display: "block" };
	
	function showHidden(node, array) {
	    //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
	    if (node.offsetWidth <= 0) {
	        //opera.offsetWidth可能小于0
	        var styles = getComputedStyle(node, null);
	        if (rdisplayswap.test(styles["display"])) {
	            var obj = {
	                node: node
	            };
	            for (var name in cssShow) {
	                obj[name] = styles[name];
	                node.style[name] = cssShow[name];
	            }
	            array.push(obj);
	        }
	        var parent = node.parentNode;
	        if (parent && parent.nodeType === 1) {
	            showHidden(parent, array);
	        }
	    }
	}
	
	//这里的属性不需要自行添加px
	var cssNumber = _util.oneObject("animationIterationCount,columnCount,fillOpacity,fontSizeAdjust,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom,rotate,flexGrow,flexShrink,order");
	
	var transitionPropertiesEndAndPrefix = (function () {
	    var endEvent,
	        prefix = '',
	        transitions = {
	        O: 'otransitionend',
	        Moz: 'transitionend',
	        Webkit: 'webkitTransitionEnd',
	        ms: 'MSTransitionEnd'
	    };
	
	    for (var vender in transitions) {
	        if (_util.hasOwn.call(transitions, vender)) {
	            if (_domBrowser2['default'].singletonDiv.style[vender + 'TransitionProperty'] !== void 0) {
	                prefix = '-' + vender.toLowerCase() + '-';
	                endEvent = transitions[vender];
	                break;
	            }
	        }
	    }
	
	    if (!endEvent && _domBrowser2['default'].singletonDiv.style.transitionProperty !== void 0) {
	        endEvent = 'transitionend';
	    }
	    return {
	        end: endEvent,
	        prefix: prefix
	    };
	})();
	
	var transitionEndEventName = transitionPropertiesEndAndPrefix.end;
	
	exports.transitionEndEventName = transitionEndEventName;
	var prefixes = [''];
	var prefix = transitionPropertiesEndAndPrefix.prefix;
	if (prefix !== '') {
	    prefixes.push(prefix);
	}
	
	/**
	 * 将css的name转换为js的表现形式
	 * @param name
	 * @param host
	 * @returns {*}
	 */
	function cssName(name, host) {
	    if (cssMap[name]) {
	        return cssMap[name];
	    }
	    host = host || _domBrowser2['default'].root.style;
	    for (var i = 0, n = prefixes.length, camelCase; i < n; i++) {
	        camelCase = camlizeStyleName(prefix + name);
	        if (camelCase in host) {
	            return cssMap[name] = camelCase;
	        }
	    }
	    return null;
	}
	
	/**
	 * position适用于取得相对于offsetParent的偏移量
	 * @param el
	 * @returns {*}
	 */
	
	function position(el) {
	    var parentOffset = { left: 0, top: 0 },
	        _offset,
	        _offsetParent;
	    if (!el) {
	        return parentOffset;
	    }
	    if (css(el, 'position') === 'fixed') {
	        //getBoundingClientRect返回值是一个DOMRect对象,其top、left值是相对于视口的,因此只有fixed可以采用这个
	        _offset = el.getBoundingClientRect();
	    } else {
	        _offsetParent = offsetParent(el); // Get *real* offsetParent
	        _offset = offset(el); // Get correct offsets
	        if (_offsetParent.tagName !== "HTML") {
	            parentOffset = offset(_offsetParent);
	        }
	        parentOffset.top += css(_offsetParent, "borderTopWidth", true);
	        parentOffset.left += css(_offsetParent, "borderLeftWidth", true);
	    }
	    // Subtract parent offsets and element margins
	    return {
	        top: _offset.top - parentOffset.top - css(el, "marginTop", true),
	        left: _offset.left - parentOffset.left - css(el, "marginLeft", true)
	    };
	}
	
	/**
	 * 获取元素到document.documentElement的offset
	 * @param el
	 * @returns {*}
	 */
	
	function offset(el) {
	    //取得距离页面左右角的坐标
	    if (!el.getClientRects().length) {
	        return { top: 0, left: 0 };
	    }
	
	    var rect = el.getBoundingClientRect();
	
	    // Make sure element is not hidden (display: none)
	    if (rect.width || rect.height) {
	        var doc = el.ownerDocument;
	        var root = doc.documentElement;
	        var win = doc.defaultView;
	        return {
	            top: rect.top + win.pageYOffset - root.clientTop,
	            left: rect.left + win.pageXOffset - root.clientLeft
	        };
	    }
	
	    // Return zeros for disconnected and hidden elements
	    return rect;
	}
	
	/**
	 * @param el
	 * @returns {offsetParent|HTMLElement|*}
	 * 
	 * 以下三种情况会返回documentElement (From JQuery)
	 * 1) For the element inside the iframe without offsetParent, this method will return documentElement of the parent window
	 * 2) For the hidden or detached element
	 * 3) For body or html element, i.e. in case of the html node - it will return itself
	 *
	 * 如果一个元素的css position为relative、absolute、fixed,那我们可以说这个元素被定位了
	 * An element is said to be positioned if it has a CSS position attribute of relative, absolute, or fixed (from JQuery)
	 *
	 * 用于寻找最近而且被定位的祖先元素
	 */
	
	function offsetParent(el) {
	    // 在 Webkit 中，如果元素为隐藏的（该元素或其祖先元素的 style.display 为 "none"），或者该元素的 style.position 被设为 "fixed"，则该属性返回 null。
	    // 在 IE 9 中，如果该元素的 style.position 被设置为 "fixed"，则该属性返回 null。（display:none 无影响。）
	    var offsetParent = el.offsetParent;
	    while (offsetParent && css(offsetParent, "position") === "static") {
	        offsetParent = offsetParent.offsetParent;
	    }
	    return offsetParent || root;
	}
	
	/**
	 * 将中划线式styleName转换为驼峰式
	 * eg:background-color => backgroundColor; -moz-transition => MozTransition; -ms-transition => msTransition
	 * ms前缀的需要特殊处理
	 * @param str
	 */
	function camlizeStyleName(str) {
	    if (!str || str.indexOf("-") < 0 && str.indexOf("_") < 0) {
	        return str;
	    }
	    return _util.camelize(str.replace(/^-ms-/, 'ms-'));
	}
	
	/**
	 * 将驼峰式styleName转换为中划线式
	 * eg:backgroundColor=>background-color; MozTransition => -moz-transition; msTransition => -ms-transition
	 * @param str
	 */
	function hyphenateStyleName(str) {
	    _util.hyphenate(str).replace(/^ms-/, '-ms-');
	}
	
	function css(el, name, value) {
	    if (el.nodeType !== 1) {
	        return;
	    }
	    var prop = _util.camelize(name);
	    name = cssName(prop) || prop;
	    var fn;
	    if (value === void 0 || typeof value === 'boolean') {
	        // 读取样式
	        fn = cssHooks[prop + ':get'] || cssHooks['@:get'];
	        if (name === 'background') {
	            name = 'backgroundColor';
	        }
	        var val = fn(el, name);
	        return value === true ? parseFloat(val) || 0 : val;
	    } else if (value === '') {
	        // 清除样式
	        node.style[name] = '';
	    } else {
	        // 设置样式
	        if (value == null || value !== value) {
	            return;
	        }
	        if (isFinite(value) && !cssNumber(prop)) {
	            value += 'px';
	        }
	        fn = cssHooks[prop + ':set'] || cssHooks['@:set'];
	        fn(el, name, value);
	    }
	}
	
	function getWindow(node) {
	    return node.window || node.defaultView || false;
	}
	
	var scroll = {};
	
	exports.scroll = scroll;
	_util.each({
	    scrollLeft: "pageXOffset",
	    scrollTop: "pageYOffset"
	}, function (method, prop) {
	    scroll[method] = function (val) {
	        var node = this[0] || {},
	            win = getWindow(node),
	            top = method === "scrollTop";
	        if (!arguments.length) {
	            return win ? win[prop] : node[method];
	        } else {
	            if (win) {
	                win.scrollTo(!top ? val : win[prop], top ? val : win[prop]);
	            } else {
	                node[method] = val;
	            }
	        }
	    };
	});

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/8/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports.isAttr = isAttr;
	exports.removeAttr = removeAttr;
	exports.removeProp = removeProp;
	exports.prop = prop;
	exports.attr = attr;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _support = __webpack_require__(35);
	
	var _support2 = _interopRequireDefault(_support);
	
	var _browser = __webpack_require__(13);
	
	var _browser2 = _interopRequireDefault(_browser);
	
	var rfocusable = /^(?:input|select|textarea|button)$/i,
	    rclickable = /^(?:a|area)$/i;
	var propMap = { //不规则的属性名映射
	    'accept-charset': 'acceptCharset',
	    'char': 'ch',
	    'charoff': 'chOff',
	    'class': 'className',
	    'for': 'htmlFor',
	    'http-equiv': 'httpEquiv'
	};
	/*
	 contenteditable不是布尔属性
	 http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/
	 contenteditable=''
	 contenteditable='events'
	 contenteditable='caret'
	 contenteditable='plaintext-only'
	 contenteditable='true'
	 contenteditable='false'
	 */
	var bools = ['autofocus,autoplay,async,allowTransparency,checked,controls', 'declare,disabled,defer,defaultChecked,defaultSelected,', 'isMap,loop,multiple,noHref,noResize,noShade', 'open,readOnly,selected'].join(',');
	
	bools.replace(/\w+/g, function (name) {
	    propMap[name.toLowerCase()] = name;
	});
	
	var anomaly = ['accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan', 'dateTime,defaultValue,contentEditable,frameBorder,longDesc,maxLength,' + 'marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'].join(',');
	
	anomaly.replace(/\w+/g, function (name) {
	    propMap[name.toLowerCase()] = name;
	});
	
	var pureDiv = _browser2['default'].document.createElement('div');
	
	function isAttr(name, host) {
	    host = host || pureDiv;
	    return host.getAttribute(name) === null && host[name] === void 0;
	}
	
	var cacheProp = {};
	function defaultProp(node, prop) {
	    var name = node.tagName + ":" + prop;
	    if (name in cacheProp) {
	        return cacheProp[name];
	    }
	    return cacheProp[name] = _browser2['default'].document.createElement(node.tagName)[prop];
	}
	
	function removeAttr(el, name) {
	    if (name && el.nodeType === 1) {
	        //小心contentEditable,会把用户编辑的内容清空
	        if (typeof el[name] !== "boolean") {
	            el.setAttribute(name, "");
	        }
	        el.removeAttribute(name);
	        // 确保bool属性的值为bool
	        if (el[name] === true) {
	            el[name] = false;
	        }
	    }
	}
	
	//只能用于HTML,元素节点的内建不能删除（chrome真的能删除，会引发灾难性后果），使用默认值覆盖
	
	function removeProp(el, name) {
	    name = propMap[name.toLowerCase()] || name;
	    if (name && el.nodeType === 1) {
	        el[name] = defaultProp(el, name);
	    } else {
	        el[name] = void 0;
	    }
	}
	
	function prop(el, name, value) {
	    if (el.nodeType === 1) {
	        name = propMap[name.toLowerCase()] || name;
	    }
	    var access = value === void 0 ? ":get" : ":set";
	    return (propHooks[name + access] || propHooks["@" + access])(el, name, value);
	}
	
	function attr(el, name, value) {
	    // Don't get/set attributes on text, comment and attribute nodes
	    var nType = el.nodeType;
	    if (nType === 3 || nType === 8 || nType === 2) {
	        return;
	    }
	
	    if (el.getAttribute === void 0) {
	        return prop(el, name, value);
	    }
	
	    name = name.toLowerCase();
	    var propName = propMap[name] || name;
	    var isBool = typeof el[propName] === "boolean" && typeof defaultProp(el, propName) === "boolean"; //判定是否为布尔属性
	
	    if (value === null || value === false && isBool) {
	        return removeAttr(el, name);
	    }
	
	    var access = value === void 0 ? ":get" : ":set";
	    var type = '@';
	    if (isBool) {
	        type = '@bool';
	        name = propName;
	    }
	    return (attrHooks[name + access] || attrHooks[type + access])(el, name, value);
	}
	
	var attrHooks = {
	    'type:set': function typeSet(el, name, value) {
	        if (!_support2['default'].radioValue && value === 'radio' && el.nodeName === 'input') {
	            var val = el.value;
	            el.setAttribute('type', value);
	            if (val) {
	                el.value = val;
	            }
	            return value;
	        }
	        el.setAttribute('type', value);
	    },
	    'type:get': function typeGet(el) {
	        var ret = el.getAttribute('type'),
	            type;
	        if (ret === null && (type = el.type) !== void 0) {
	            return type;
	        }
	        return ret;
	    },
	    '@:get': function get(el, name) {
	        var ret = el.getAttribute(name);
	        return ret == null ? void 0 : ret;
	    },
	    '@:set': function set(el, name, value) {
	        el.setAttribute(name, value + '');
	    },
	    '@bool:get': function boolGet(el, name) {
	        return node[name] ? name.toLowerCase() : void 0;
	    },
	    '@bool:set': function boolSet(el, name) {
	        el.setAttribute(name, name.toLowerCase());
	        el[name] = true;
	    }
	
	};
	
	var propHooks = {
	    // Support: IE <=9 - 11 only
	    'tabIndex:get': function tabIndexGet(node) {
	        var tabIndex = node.tabIndex;
	        if (tabIndex) {
	            return parseInt(tabIndex, 10);
	        }
	        // http://javascript.gakaa.com/reset-tabindex.aspx
	        return rfocusable.test(node.nodeName) || rclickable.test(node.nodeName) && node.href ? 0 : -1;
	    },
	    '@:get': function get(node, name) {
	        return node[name];
	    },
	    '@:set': function set(node, name, value) {
	        node[name] = value;
	    }
	};
	
	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// safari IE9 IE8 我们必须访问上一级元素时,才能获取这个值
	if (_support2['default'].optSelectedDefault) {
	    propHooks['selected:get'] = function (node) {
	        for (var p = node; p && typeof p.selectedIndex !== "number"; p = p.parentNode) {}
	        return node.selected;
	    };
	
	    propHooks['selected:set'] = function (el, node, value) {
	        var parent = el.parentNode;
	        if (parent) {
	            parent.selectedIndex;
	
	            if (parent.parentNode) {
	                parent.parentNode.selectedIndex;
	            }
	        }
	        el.node = value;
	    };
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/8/9.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports.getValType = getValType;
	exports.val = val;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _attr = __webpack_require__(33);
	
	var _util = __webpack_require__(7);
	
	var _support = __webpack_require__(35);
	
	var _support2 = _interopRequireDefault(_support);
	
	var rspaces = /[\x20\t\r\n\f]+/g;
	
	function getValType(el) {
	    var ret = el.tagName.toLowerCase();
	    return ret === 'input' && /checkbox|radio/.test(el.type) ? 'checked' : ret;
	}
	
	var valHooks = {
	    'option:get': function optionGet(node) {
	        var val = _attr.attr(node, "value");
	        return val != null ? val :
	
	        // Support: IE <=10 - 11 only
	        // option.text throws exceptions (#14686, #14858)
	        // Strip and collapse whitespace
	        // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
	        _util.trim(node.text).replace(rspaces, " ");
	    },
	    'select:get': function self(node) {
	        var value,
	            option,
	            i,
	            options = node.options,
	            index = node.selectedIndex,
	            one = node.type === "select-one",
	            values = one ? null : [],
	            max = one ? index + 1 : options.length;
	
	        if (index < 0) {
	            i = max;
	        } else {
	            i = one ? index : 0;
	        }
	
	        // Loop through all the selected options
	        for (; i < max; i++) {
	            option = options[i];
	
	            // Support: IE <=9 only
	            // IE8-9 doesn't update selected after form reset
	            if ((option.selected || i === index) &&
	            // Don't return options that are disabled or in a disabled optgroup
	            !option.disabled && (!option.parentNode.disabled || option.parentNode.nodeName.toLowerCase() === 'optgroup')) {
	
	                // Get the specific value for the option
	                value = val(option);
	
	                // We don't need an array for one selects
	                if (one) {
	                    return value;
	                }
	
	                // Multi-Selects return an array
	                values.push(value);
	            }
	        }
	
	        return values;
	    },
	    'select:set': function selectSet(node, values) {
	        if (_util.isArrayLike(values)) {
	            values = [].slice.call(values);
	        } else {
	            values = [values + ''];
	        }
	        var options = node.options,
	            i = options.length,
	            el,
	            optionSet;
	
	        while (i--) {
	            el = options[i];
	            if (el.selected = values.indexOf(val(el)) > -1) {
	                console.log(val(el));
	                optionSet = true;
	            }
	        }
	        if (!optionSet) {
	            node.selectedIndex = -1;
	        }
	        return values;
	    },
	
	    'checked:set': function checkedSet(node, values) {
	        if (_util.isArrayLike(values)) {
	            values = [].slice.call(values);
	        } else {
	            values = [values + ''];
	        }
	
	        return node.checked = values.indexOf(val(node)) > -1;
	    }
	};
	
	if (_support2['default'].checkOn) {
	    valHooks['checked:get'] = function (node) {
	        return node.getAttribute("value") === null ? "on" : node.value;
	    };
	}
	
	function val(node, value) {
	    if (node && node.nodeType === 1) {
	        var get = arguments.length === 1;
	        var access = get ? ':get' : ':set';
	        var fn = valHooks[getValType(node) + access];
	        if (fn) {
	            var val = fn(node, value);
	        } else if (get) {
	            return (node.value || '').replace(/\r/g, '');
	        } else {
	            node.value = value;
	        }
	    }
	    return val;
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/8/13.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _browser = __webpack_require__(13);
	
	var _browser2 = _interopRequireDefault(_browser);
	
	var support = {};
	
	var input = _browser2['default'].document.createElement('input'),
	    select = _browser2['default'].document.createElement("select"),
	    opt = select.appendChild(_browser2['default'].document.createElement("option"));
	input.type = "checkbox";
	
	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";
	
	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelectedDefault = opt.selected;
	
	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = _browser2['default'].document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
	
	exports['default'] = support;
	module.exports = exports['default'];

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = mixinDirectives;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _expr = __webpack_require__(37);
	
	var _expr2 = _interopRequireDefault(_expr);
	
	var _text = __webpack_require__(38);
	
	var _text2 = _interopRequireDefault(_text);
	
	var _controller = __webpack_require__(39);
	
	var _controller2 = _interopRequireDefault(_controller);
	
	function mixinDirectives(maruo) {
	    maruo.directive('expr', _expr2['default']);
	    maruo.directive('text', _text2['default']);
	    maruo.directive('controller', _controller2['default']);
	}
	
	module.exports = exports['default'];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/24.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _util = __webpack_require__(7);
	
	var _config = __webpack_require__(6);
	
	var _config2 = _interopRequireDefault(_config);
	
	exports['default'] = {
	    parse: _util.noop,
	    diff: function diff(copy, src) {
	        var copyValue = copy.nodeValue + '';
	        if (copyValue !== src.nodeValue) {
	            var dom = src.dom;
	            if (dom) {
	                dom.nodeValue = copyValue;
	            } else {
	                _config2['default'].debug && _util.warn('找不到[' + copy.nodeValue + ']对应的节点');
	            }
	        }
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	var _vdom = __webpack_require__(26);
	
	var _compilerParseExpr = __webpack_require__(4);
	
	exports['default'] = {
	    parse: function parse(cur, src, binding, scope) {
	        src.children = [];
	        cur.children = [];
	        cur.children.push(new _vdom.VText({
	            nodeType: 3,
	            type: '#text',
	            dynamic: true,
	            nodeValue: _compilerParseExpr.parseExpr(binding.expr).getter(scope)
	        }));
	    },
	
	    diff: function diff(copy, src) {
	        if (!src.children.length) {
	            var dom = src.dom;
	            if (dom && !src.isVoidTag) {
	                while (dom.firstChild) {
	                    dom.removeChild(dom.firstChild);
	                }
	                var text = document.createTextNode('x');
	                dom.appendChild(text);
	                var a = { nodeType: 3, type: '#text', dom: text };
	                src.children.push(new _vdom.VText(a));
	            }
	        }
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/30.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _maruo = __webpack_require__(1);
	
	var _maruo2 = _interopRequireDefault(_maruo);
	
	exports['default'] = {
	    parse: function parse(copy, src, binding) {
	        copy[binding.name] = binding.expr;
	    },
	
	    diff: function diff(copy, src, name) {
	        if (copy[name] !== src[name]) {
	            var id = src[name] = copy[name];
	            var scope = _maruo2['default'].scopes[id];
	            if (scope) {
	                return;
	            }
	            var vm = _maruo2['default'].vms[id];
	            _maruo2['default'].scopes[id] = {
	                vmodel: vm
	            };
	        }
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/18.
	 */
	
	'use strict';
	
	__webpack_require__(41);

/***/ },
/* 41 */
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