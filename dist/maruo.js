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
	
	var _event = __webpack_require__(17);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _dom = __webpack_require__(18);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	var _directives = __webpack_require__(32);
	
	var _directives2 = _interopRequireDefault(_directives);
	
	__webpack_require__(34);
	
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
	var toString = String.prototype.toString;
	exports.toString = toString;

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
	
	var _data = __webpack_require__(9);
	
	_defaults(exports, _interopExportWildcard(_data, _defaults));
	
	var _is = __webpack_require__(10);
	
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
	
	var _const = __webpack_require__(3);
	
	var rcamelize = /[-_]([^-_])/g;
	var rhyphenate = /([a-z\d])([A-Z]+)/g;
	var rhashcode = /\d\.\d{4}/;
	var rescape = /[-.*+?^${}()|[\]\/\\]/g;
	
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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/14.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports.toJson = toJson;
	
	var _is = __webpack_require__(10);
	
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
/* 10 */
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
	
	var _const = __webpack_require__(3);
	
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
	
	var _utilData = __webpack_require__(9);
	
	var _utilIndex = __webpack_require__(7);
	
	var _array = __webpack_require__(16);
	
	var _compilerBatch = __webpack_require__(29);
	
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
	            self.batchUpdateView();
	            val = newValue;
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = mixinDom;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _ready = __webpack_require__(19);
	
	var _ready2 = _interopRequireDefault(_ready);
	
	var _scan = __webpack_require__(20);
	
	var _scan2 = _interopRequireDefault(_scan);
	
	function mixinDom(maruo) {
	    _ready2['default'](function () {
	        _scan2['default'](document.body, maruo);
	    });
	    maruo.scan = _scan2['default'];
	}
	
	module.exports = exports['default'];

/***/ },
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/21.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _class = __webpack_require__(21);
	
	var _class2 = _interopRequireDefault(_class);
	
	var _util = __webpack_require__(7);
	
	var _compilerLexer = __webpack_require__(22);
	
	var _compilerRender = __webpack_require__(27);
	
	var _compilerBatch = __webpack_require__(29);
	
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
/* 21 */
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
/* 22 */
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
	
	var _vdom = __webpack_require__(23);
	
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	var _VElement = __webpack_require__(24);
	
	_defaults(exports, _interopExportWildcard(_VElement, _defaults));
	
	var _VComment = __webpack_require__(25);
	
	_defaults(exports, _interopExportWildcard(_VComment, _defaults));
	
	var _VText = __webpack_require__(26);
	
	_defaults(exports, _interopExportWildcard(_VText, _defaults));

/***/ },
/* 24 */
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
/* 25 */
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
/* 26 */
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
/* 27 */
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
	
	var _vdom = __webpack_require__(23);
	
	var _parseExpr = __webpack_require__(4);
	
	var _maruo = __webpack_require__(1);
	
	var _maruo2 = _interopRequireDefault(_maruo);
	
	var _extractBinding = __webpack_require__(28);
	
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
/* 28 */
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _maruo = __webpack_require__(1);
	
	var _maruo2 = _interopRequireDefault(_maruo);
	
	var _reconcile = __webpack_require__(30);
	
	var _reconcile2 = _interopRequireDefault(_reconcile);
	
	var _domBrowser = __webpack_require__(13);
	
	var _domBrowser2 = _interopRequireDefault(_domBrowser);
	
	var _diff = __webpack_require__(31);
	
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
/* 30 */
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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = mixinDirectives;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _expr = __webpack_require__(36);
	
	var _expr2 = _interopRequireDefault(_expr);
	
	var _text = __webpack_require__(33);
	
	var _text2 = _interopRequireDefault(_text);
	
	var _controller = __webpack_require__(37);
	
	var _controller2 = _interopRequireDefault(_controller);
	
	function mixinDirectives(maruo) {
	    maruo.directive('expr', _expr2['default']);
	    maruo.directive('text', _text2['default']);
	    maruo.directive('controller', _controller2['default']);
	}
	
	module.exports = exports['default'];

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/23.
	 */
	'use strict';
	
	exports.__esModule = true;
	
	var _vdom = __webpack_require__(23);
	
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by cgspine on 16/7/18.
	 */
	
	'use strict';
	
	__webpack_require__(35);

/***/ },
/* 35 */
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

/***/ },
/* 36 */
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
/* 37 */
/***/ function(module, exports) {

	/**
	 * Created by cgspine on 16/7/30.
	 */
	
	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	    parse: function parse(cur, src, binding, scope) {},
	
	    diff: function diff(copy, src, name) {
	        console.log('haha');
	    }
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=maruo.js.map