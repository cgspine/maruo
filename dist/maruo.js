(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.maruo = factory());
}(this, (function () { 'use strict';

/**
 * Created by cgspine on 16/7/23.
 */

function maruo$1(el) {
    return new maruo$1.init(el);
}

maruo$1.init = function (el) {
    this[0] = this.el = el;
};

maruo$1.fn = maruo$1.prototype = maruo$1.init.prototype;

maruo$1.vms = {};
maruo$1.scopes = {};
maruo$1.directives = {};

/**
 * Created by cgspine on 16/7/14.
 */

const rword = /[^, ]+/g;

const toString = Object.prototype.toString;

const hasOwn = Object.prototype.hasOwnProperty;

/**
 * Created by cgspine on 16/7/14.
 */

var rarraylike = /(Array|List|Collection|Map|Arguments)\]$/;

var class2type = {};
'Boolean Number String Function Array Date RegExp Object Error'.replace(rword, function (name) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
});

function type(obj) {
    if (obj == null) {
        return String(obj);
    }
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj;
}





function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]' && Object.getPrototypeOf(obj) === Object.prototype;
}

function isArrayLike(obj) {
    if (obj && typeof obj === 'object') {
        var n = obj.length,
            str = toString.call(obj);
        if (rarraylike.test(str)) {
            return true;
        } else if (str === '[object Object]' && n === n >>> 0) {
            return true; //由于ecma262v5能修改对象属性的enumerable，因此不能用propertyIsEnumerable来判定了
        }
    }
    return false;
}

function isEmptyObject(obj) {
    /* eslint-disable no-unused-vars */
    // See https://github.com/eslint/eslint/issues/6125
    var name;

    for (name in obj) {
        return false;
    }
    return true;
}

/**
 * Created by cgspine on 16/7/23.
 */

var rcamelize = /[-_]([^-_])/g;
var rhashcode = /\d\.\d{4}/;
var rescape = /[-.*+?^${}()|[\]\/\\]/g;
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

function oneObject(array, val) {
    if (typeof array === 'string') {
        array = array.match(rword) || [];
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



function escapeRegExp(target) {
    //http://stevenlevithan.com/regex/xregexp/
    //将字符串安全格式化为正则表达式的源码
    return (target + '').replace(rescape, '\\$&');
}

//生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
const makeHashCode = typeof performance !== 'undefined' && performance.now ? function (prefix) {
    prefix = prefix || 'maruo';
    return (prefix + performance.now()).replace('.', '');
} : function (prefix) {
    prefix = prefix || 'maruo';
    return String(Math.random() + Math.random()).replace(rhashcode, prefix);
};

const noop = function () {}();

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
        if (isArrayLike(obj)) {
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

/**
 * Created by cgspine on 16/7/14.
 */

function toJson(val) {
    var xtype = type(val);
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

/**
 * Created by cgspine on 16/7/9.
 */
var openTag = "{{";

var closeTag = "}}";

var safeOpenTag;
var safeCloseTag;
var rexpr;
var rexprg;
var rbind;
updateExp();

function updateExp() {
    safeOpenTag = escapeRegExp(openTag);

    safeCloseTag = escapeRegExp(closeTag);

    rexpr = new RegExp(safeOpenTag + '([\\s\\S]*)' + safeCloseTag);

    rexprg = new RegExp(safeOpenTag + '([\\s\\S]*)' + safeCloseTag, 'g');

    rbind = new RegExp(safeOpenTag + '[\\s\\S]*' + safeCloseTag + '|\\bms-|\\bslot\\b');
}

var config = {

    debug: true,

    $$skipArray: oneObject('$id,$render,$track,$parent,$element,$watch,$fire,$events,$model,$skipArray,$accessors,$hashcode,$run,$wait,__proxy__,__data__,__const__,__ob__')

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

Object.defineProperty(config, 'openTag', {
    get: function () {
        return openTag;
    },
    set function(newValue) {
        openTag = newValue;
        updateExp();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(config, 'closeTag', {
    get: function () {
        return closeTag;
    },
    set function(newValue) {
        closeTag = newValue;
        updateExp();
    },
    enumerable: true,
    configurable: true
});

/**
 * Created by cgspine on 16/7/9.
 */
function log() {
    if (config.debug) {
        console.log(arguments);
    }
}

function warn() {
    if (config.debug) {
        console.warn(arguments);
    }
}

function err() {
    if (config.debug) {
        console.error(arguments);
    }
}

/**
 * Created by cgspine on 16/7/21.
 */

var browser = {
    window: window,
    document: { //方便在nodejs环境不会报错
        createElement: function () {
            return {};
        },
        createElementNS: function () {
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
    var document$1 = window.document;
    browser.document = document$1;
    browser.root = document$1.documentElement;
    browser.singletonDiv = document$1.createElement('div');
    browser.singletonFragment = document$1.createDocumentFragment();
}

/**
 * Created by cgspine on 16/7/23.
 */
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


const commonTmpDiv = browser.document.createElement('div');

/**
 * Created by cgspine on 16/9/4.
 */
function mixin(target, source) {
    var args = Array.prototype.slice.call(arguments),
        i = 1,
        key,
        ride = typeof args[args.length - 1] === 'boolean' ? args.pop() : true; // 如果最后参数是布尔，判定是否覆写同名属性
    if (args.length === 1) {
        target = this.window ? {} : this;
        i = 0;
    }
    while (source = args[i++]) {
        for (key in source) {
            if (hasOwn.call(source, key) && (ride || !(key in target))) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

/**
 * Created by cgspine on 16/9/4.
 */
const encode = encodeURIComponent;
const r20 = /%20/g;

function param(json) {
    if (!isPlainObject(json)) {
        return '';
    }
    var key,
        val,
        ret = [];
    for (key in json) {
        if (json.hasOwnProperty(key)) {
            val = json[key];
            key = encode(key);
            if (isValidParamValue(val)) {
                ret.push(`${key}=${encode(val + '')}`);
            } else if (Array.isArray(val) && val.length > 0) {
                for (var i = 0, n = val.length; i < n; i++) {
                    if (isValidParamValue(val[i])) {
                        ret.push(`${key}${encode('[]')}=${encode(val[i] + '')}`);
                    }
                }
            }
        }
    }
    return ret.join('&').replace(r20, '+');
}



function isValidParamValue(val) {
    var t = typeof val; // If the type of val is null, undefined, number, string, boolean, return true.
    return val == null || t !== 'object' && t !== 'function';
}

/**
 * Created by cgspine on 16/7/9.
 */

function mixinData(maruo) {
    maruo.data = new Data();
}

function Data() {
    this.expando = "maruo" + (new Date() - 0);
}

Data.uid = 1;

Data.prototype = {
    cache: function (owner) {
        let value = owner[this.expando];
        if (!value) {
            value = {};
            if (acceptData(owner)) {
                if (owner.nodeType) {
                    owner[this.expando] = value;
                } else {
                    Object.defineProperty(owner, this.expando, {
                        value: value,
                        configurable: true
                    });
                }
            }
        }
        return value;
    },
    set: function (owner, key, val) {
        var cache = this.cache(owner);
        if (typeof key === 'string') {
            cache[camelize(key)] = val;
        } else {
            for (var prop in key) {
                cache[camelize(prop)] = key[prop];
            }
        }
        return cache;
    },
    get: function (owner, key) {
        if (key === undefined) {
            return this.cache(owner);
        }
        return owner[this.expando] && owner[this.expando][camelize(key)];
    },

    access: function (owner, key, val) {
        if (key === undefined || key && typeof key === "string" && val === undefined) {
            return this.get(owner, key);
        }
        this.set(owner, key, val);
        return val;
    },
    remove: function (owner, key) {
        var cache = owner[this.expando];
        if (cache === undefined) {
            return;
        }
        if (key === undefined || isEmptyObject(cache)) {
            // Webkit & Blink performance suffers when deleting properties from DOM nodes, so set to undefined instead
            if (owner.nodeType) {
                owner[this.expando] = undefined;
            } else {
                delete owner[this.expando];
            }
            return;
        }
        if (Array.isArray(key)) {
            key = key.map(camelize);
        } else {
            key = camelize(key);
            key = key in cache ? [key] : [];
        }
        var i = key.length;
        while (i--) {
            delete cache[key[i]];
        }
    },
    hasData: function (owner) {
        var cache = owner[this.expando];
        return cache !== undefined && !isEmptyObject(cache);
    }
};

function acceptData(owner) {
    // Accepts only:
    //  - Node
    //    - Node.ELEMENT_NODE
    //    - Node.DOCUMENT_NODE
    //  - Object
    //    - Any
    return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
}

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

/**
 * Created by cgspine on 16/7/23.
 */

const exprCachePool = new Cache(1000);

const allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
const rallowedKeywords = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

// keywords that don't make sense inside expressions
const improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';
const rimproperKeywords = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');

const rws = /\s/g;
const rnewline = /\n+/g;
const rsave = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
const rrestore = /"(\d+)"/g;
const rpathTest = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
const rbooleanLiteral = /^(?:true|false)$/;
const rident = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;

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
            config.debug && warn('Invalid setter expression:  ' + expr);
        }
    }
    return noop;
}

function makeGetterFn(body) {
    try {
        return new Function('scope', 'return scope.' + body + ';');
    } catch (e) {
        config.debug && warn('Invalid expression. ' + 'Generated function body: ' + body);
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
        config.debug && warn('Avoid using reserved keywords in expression: ' + exp);
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

/**
 * Created by cgspine on 16/7/9.
 */
var mixinCore = function (maruo) {

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

    maruo.rword = rword;

    maruo.directive = function (name, definition) {
        definition.parse = definition.parse || defaultParse;
        return maruo.directives[name] = definition;
    };
};

function defaultParse(cur, pre, binding) {
    cur[binding.name] = parseExpr(binding.expr).getter();
}

/**
 * Created by cgspine on 16/7/19.
 */
const arrayProto = Array.prototype;

const arrayMethods = Object.create(arrayProto);

'push,pop,shift,unshift,splice,sort,reverse'.replace(rword, function (method) {
    var origin = arrayProto[method];
    Object.defineProperty(arrayMethods, method, {
        value: function () {
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
    value: function (index) {

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
    value: function (index, value) {
        this.splice(index, 1, value);
    },
    writable: true,
    enumerable: false,
    configurable: false
});

/**
 * Created by cgspine on 16/7/24.
 * 节点对齐算法
 */

var rforHolder = /^m\-for/;
var rwhiteRetain = /[\S\xA0]/;
var plainTag = oneObject('script,style,template,noscript,textarea');

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
                newNodes.push(comment
                // comment是在lexer的时候被插进来的?
                );i = Math.max(0, --i);
            }
        }
        if (newNodes.length === vl) {
            break;
        }
    }

    if (change) {
        var f = browser.document.createDocumentFragment(),
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

/**
 * Created by cgspine on 16/7/23.
 */

var emptyArr = [];
var emptyObj = function () {
    return {
        children: [], props: {}
    };
};

var directives = maruo$1.directives;

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

/**
 * Created by cgspine on 16/7/23.
 */

var needRenderIds = [];
var renderingId = false;

function batch(id) {
    if (renderingId) {
        return needRenderIds.ensure(id);
    } else {
        renderingId = id;
    }
    var scope = maruo$1.scopes[id];
    if (!scope || !browser.document.nodeName) {
        return renderingId = null;
    }
    var vm = scope.vmodel;
    var dom = vm.$el;
    var source = dom.vtree || [];
    var copy = vm.$render();
    if (scope.isTemp) {
        //在最开始时,替换作用域的所有节点,确保虚拟DOM与真实DOM是对齐的
        reconcile([dom], source, dom.parentNode);
        delete maruo$1.scopes[id];
    }

    diff(copy, source);

    var index = needRenderIds.indexOf(renderingId);
    renderingId = 0;
    if (index > -1) {
        var removed = needRenderIds.splice(index, 1);
        return batch(removed[0]);
    }

    var more = needRenderIds.shift();
    if (more) {
        batch(more);
    }
}

/**
 * Created by cgspine on 16/7/14.
 */

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

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
    this.hashCode = options.hashCode || makeHashCode('$');
    this.$events = {};
    if (Array.isArray(definition)) {
        this.__data__ = options.__data__ || [];
        this.observeArray(definition, options);
    } else {
        this.__data__ = options.__data__ || Object.create(null);
        this.$skipArray = {};
        if (definition.$skipArray) {
            this.$skipArray = oneObject(definition.$skipArray);
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
    hideProperty(this.__data__, '$id', options.id

    // 改写hasOwnProperty
    );hideProperty(this.__data__, 'hasOwnProperty', function (key) {
        return values[key] === true;
    });
};

Observable.prototype.observeArray = function (definition, options) {
    this.proxy('length'
    // 劫持数组的方法
    );for (var i = 0; i < arrayKeys.length; i++) {
        var key = arrayKeys[i];
        defArrayMethods(this.__data__, key, arrayMethods[key]);
    }
    this.makeArrayAccessor(definition, options);
};

function defArrayMethods(ob, key, val) {
    Object.defineProperty(ob, key, {
        value: function () {
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
        get: function () {
            return self.__data__[key];
        },
        set: function (val) {
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
    return toJson(this.__data__);
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
        get: function () {
            return val.__data__ || val;
        },
        set: function (newValue) {
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
        batch(id.slice(0, dotIndex));
    } else {
        batch(id);
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
        value: function () {
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
        var hashCode = makeHashCode('$');
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

/**
 * Created by cgspine on 16/7/9.
 */
function mixinViewModel(maruo) {
    maruo.define = function (definition) {
        var $id = definition.$id;
        if (!$id) {
            warn('vm.$id must be defined');
        }
        if (maruo.vms[$id]) {
            throw Error('error: [' + $id + '] had been defined!');
        }
        var vm = new Observable(definition, {
            id: $id
        });
        return maruo.vms[$id] = vm;
    };
}

/**
 * Created by cgspine on 16/7/21.
 */

var nextGuid = 1;

function mixinEvent(maruo) {
    maruo.on = function (el, type$$1, fn) {
        var data = maruo.data.cache(el);
        if (!data.handlers) {
            data.handlers = {};
        }

        if (!data.handlers[type$$1]) {
            data.handlers[type$$1] = [];
        }

        if (!fn.guid) {
            fn.guid = nextGuid++;
        }
        data.handlers[type$$1].push(fn);

        if (!data.dispatcher) {
            data.disabled = false;
            data.dispatcher = function (event) {
                if (data.disabled) {
                    return;
                }
                event = fixEvent(event);
                var handlers = data.handlers[event.type];
                if (handlers) {
                    var length = handlers.length;
                    while (length--) {
                        handlers[length].call(el, event);
                    }
                }
            };
        }
        if (data.handlers[type$$1].length === 1) {
            if (el.addEventListener) {
                el.addEventListener(type$$1, data.dispatcher, false);
            } else if (el.attachEvent) {
                el.attachEvent("on" + type$$1, data.dispatcher);
            }
        }
    };

    maruo.off = function (el, type$$1, fn) {
        var data = maruo.data.cache(el);
        if (!data.handlers) {
            return;
        }

        function removeType(type$$1) {
            data.handlers[type$$1] = [];
            teardown(maruo, el, type$$1);
        }

        if (!type$$1) {
            for (var t in data.handlers) {
                removeType(t);
            }
            return;
        }

        var handlers = data.handlers[type$$1];
        if (!handlers) {
            return;
        }
        if (!fn) {
            removeType(type$$1);
            return;
        }
        if (fn.guid) {
            var i = handlers.length;
            while (i--) {
                if (handlers[i].guid === fn.guid) {
                    handlers.splice(i, 1);
                }
            }
        }
        teardown(el, type$$1);
    };

    maruo.trigger = function (el, event) {
        var data = maruo.data.cache(el),
            parent = el.parentNode || el.ownerDocument;
        if (typeof event === 'string') {
            event = { type: event, target: el };
        }
        event = fixEvent(event);
        if (data.dispatcher) {
            data.dispatcher(event);
        }

        if (parent && !event.isPropagationStopped) {
            maruo.trigger(parent, event);
        } else if (!parent && !event.isDefaultPrevented) {
            // 冒泡结束后，如果有浏览器默认事件并且没有调用event.preventDefault，则触发浏览器默认事件
            var target = event.target,
                type$$1 = event.type,
                targetData = maruo.data.cache(target);
            if (target[type$$1]) {
                targetData.disabled = true;
                target[type$$1]();
                targetData.disabled = false;
            }
        }
    };

    maruo.prototype.on = function (type$$1, fn) {
        maruo.on(this[0], type$$1, fn);
    };

    maruo.prototype.off = function (type$$1, fn) {
        maruo.off(this[0], type$$1, fn);
    };

    maruo.prototype.trigger = function (event) {
        maruo.trigger(this[0], event);
    };
}

/**
 * 清理资源
 * @param maruo
 * @param el
 * @param type
 */
function teardown(maruo, el, type$$1) {
    var data = maruo.data.cache(el);

    if (data.handlers[type$$1].length === 0) {
        delete data.handlers[type$$1];
        if (el.removeEventListener) {
            el.removeEventListener(type$$1, data.dispatcher, false);
        } else if (el.detachEvent) {
            el.detachEvent("on" + type$$1, data.dispatcher);
        }
    }

    if (isEmptyObject(data.handlers)) {
        delete data.handlers;
        delete data.dispatcher;
    }

    if (isEmptyObject(data)) {
        maruo.data.remove(el);
    }
}

function fixEvent(event) {
    function returnFalse() {
        return false;
    }

    function returnTrue() {
        return true;
    }

    if (!event || !event.stopPropagation) {
        var old = event || browser.window.event;
        event = {};
        for (var p in old) {
            event[p] = old[p];
        }
        if (!event.target) {
            event.target = event.srcElement || browser.document;
        }

        event.relatedTarget = event.target === event.fromElement ? event.toElement : event.fromElement;

        event.preventDefault = function () {
            event.returnValue = false;
            event.isDefaultPrevented = returnTrue;
        };
        event.isDefaultPrevented = returnFalse;

        event.stopPropagation = function () {
            event.cancelBubble = true;
            event.isPropagationStopped = returnTrue;
        };
        event.isPropagationStopped = returnFalse;

        event.stopImmediatePropagation = function () {
            event.isImmediatePropagationStopped = returnTrue;
            event.stopPropagation();
        };
        event.isImmediatePropagationStopped = returnFalse;

        if (event.clientX != null) {
            var doc = browser.document.documentElement,
                body = browser.document.body;
            event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }

        event.which = event.charCode || event.keyCode;

        // fix button for mouse clicks
        // 0 == left; 1 == middle; 2 == right
        if (event.button != null) {
            event.button = event.button & 1 ? 0 : event.button & 4 ? 1 : event.button & 2 ? 2 : 0;
        }
    }
    return event;
}

/**
 * Created by cgspine on 16/7/21.
 */

var document$2 = browser.document;
var window$1 = browser.window;

var readyList = [];
var isReady;
var fireReady = function (fn) {
    isReady = true;
    while (fn = readyList.shift()) {
        fn();
    }
};

if (document$2.readyState === 'complete') {
    setTimeout(fireReady);
} else {
    document$2.addEventListener('DOMContentLoaded', fireReady);
}

window$1.addEventListener('load', fireReady);

function ready(fn) {
    if (!isReady) {
        readyList.push(fn);
    } else {
        fn();
    }
}

/**
 * Created by cgspine on 16/7/21.
 */

var o = Object.create(null);

var rnoWhite = /\S+/g;
'add, remove'.replace(rword, function (method) {
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

/**
 * Created by cgspine on 16/7/22.
 */

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
    toDOM: function () {
        var tagName = this.type;
        var dom = browser.document.createElement(tagName);
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
    toHTML: function () {
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
    generate: function (vm) {
        var copy = {};
        maruo$1.shadowCopy(copy, this.copyProto);
        var bindings = this.bindings || [];
        var self = this;
        bindings.forEach(function (binding) {
            maruo$1.directives[binding.type].parse(copy, self, binding, vm);
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

/**
 * Created by cgspine on 16/7/22.
 */
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
    toDOM: function () {
        browser.document.createComment(this.nodeValue);
    },
    toHTML: function () {
        return `<!-- ${this.nodeValue} -->`;
    },
    generate: function (vm) {
        return this;
    }
};

/**
 * Created by cgspine on 16/7/22.
 */
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
    toDOM: function () {
        browser.document.createTextNode(this.nodeValue);
    },
    toHTML: function () {
        return this.nodeValue;
    },
    generate: function (vm) {
        var expr = this.expression;
        if (expr == null || expr.length == 0) {
            return this;
        }
        var nodeValue = expr.map(function (part) {
            if (!part.expr) {
                return part.value;
            }
            return parseExpr(part.value, false).getter(vm);
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

/**
 * Created by cgspine on 16/7/23.
 */

/**
 * Created by cgspine on 16/7/23.
 */

// https://rubylouvre.gitbooks.io/avalon/content/virtualdom.html

var rnowhite = /\S+/g;
var ropenTag = /^<([-A-Za-z0-9_]+)\s*([^>]*?)(\/?)>/;
var rendTag = /^<\/([^>]+)>/;

// Self-closing tags
var voidTag = oneObject('area,base,br,col,command,embed,frame,hr,img,input,link,meta,param,source,track,wbr');
var plainTag$1 = oneObject('script,style,textarea,noscript,option,template'

/**
 * 步骤一: 将传入字符串进行parser,转换为虚拟DOM
 */
);function lexer(str) {
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
            node = new VText({
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
                    err(`注释节点没有闭合: ${str}`);
                }
                nodeValue = str.slice(4, l);
                str = str.slice(l + 3);
                node = new VComment({
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
                var type$$1 = match[1].toLowerCase();
                var isVoidTag = voidTag[type$$1] || match[3] == '\/';
                node = new VElement({
                    type: type$$1,
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
                    if (plainTag$1[type$$1]) {
                        var index = str.indexOf(`</${type$$1}>`);
                        var innerHTML = str.slice(0, index).trim();
                        str = str.slice(index);
                        if (innerHTML) {
                            switch (type$$1) {

                                case 'style':
                                case 'script':
                                case 'noscript':
                                case 'template':
                                    node.skipContent = true;
                                    node.children.push(new VText({
                                        type: '#text',
                                        nodeType: 3,
                                        nodeValue: unescapeHTML(innerHTML)
                                    }));
                                    break;
                                case 'textarea':
                                    node.skipContent = true;
                                    node.props.type = 'textarea';
                                    node.props.value = unescapeHTML(innerHTML);
                                    break;
                                case 'option':
                                    node.children.push({
                                        nodeType: 3,
                                        type: '#text',
                                        nodeValue: unescapeHTML(innerHTML)
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
                var type$$1 = match[1].toLowerCase();
                var last = stack.last();
                if (!last) {
                    err(`${match[0]}前面缺少<${type$$1}>`);
                } else if (last.type !== type$$1) {
                    err(`${last.type}没有闭合`);
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
    var type$$1 = node.type;
    var props = node.props;
    switch (type$$1) {
        case 'input':
            if (!props.type) {
                props.type = 'text';
            }
            break;
        case 'select':
            props.type = type$$1 + '-' + props.hasOwnProperty('multiple') ? 'multiple' : 'one';
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
                    tbody = new VElement({
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
        var val = stripQuotes(arr[1]) || '';
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
            if (config.rbind.test(a.nodeValue)) {
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

/**
 * Created by cgspine on 16/7/23.
 */

var directives$1 = maruo$1.directives;
var eventMap = oneObject('animationend,blur,change,input,click,dblclick,focus,keydown,keypress,' + 'keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit');
var rbinding = /^m-(\w+)-?(.*)/;

function extractBinds(cur, props) {
    var bindings = [];
    var skip = 'm-skip' in props;
    var uniqSave = {};

    for (var i in props) {
        var val = props[i],
            match;
        if (!skip && (match = i.match(rbinding))) {
            var type$$1 = match[1];
            var param$$1 = match[2] || '';
            var name = i;
            if (eventMap[type$$1]) {
                var order = parseFloat(param$$1) || 0;
                param$$1 = type$$1;
                type$$1 = 'on';
            }
            name = 'm-' + type$$1 + (param$$1 ? '-' + param$$1 : '');
            if (i !== name) {
                delete props[i];
                props[name] = val;
            }
            if (directives$1[type$$1]) {
                var binding = {
                    type: type$$1,
                    param: param$$1,
                    name: name,
                    expr: val,
                    priority: directives$1[type$$1].priority || type$$1.charCodeAt(0) * 100
                };
                if (type$$1 === 'on') {
                    order = order || 0;
                    binding.name += '-' + order; //绑定多次事件
                    binding.priority = param$$1.charCodeAt(0) * 100 + order;
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

/**
 * Created by cgspine on 16/7/23.
 */
const rlineSp = /\n\s*/g;
const rentities = /&[a-z0-9#]{2,10};/;

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
            vdom.bindings = extractBinds(vdom.copyProto, vdom.props);
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
        index = str.indexOf(config.openTag);
        index = index === -1 ? str.length : index;
        val = str.slice(0, index);
        if (/\S/.test(val)) {
            ret.push({
                value: decode$1(val),
                epxr: false
            });
            if (index === str.length) {
                break;
            }
        }
        str = str.slice(index + config.openTag.length);
        if (str) {
            index = str.indexOf(config.closeTag);
            val = str.slice(0, index);
            ret.push({
                value: unescapeHTML(val.replace(rlineSp, '')),
                expr: true
            });
            str = str.slice(index + config.openTag.length);
        }
    } while (str.length);
    return ret;
}

function decode$1(str) {
    if (rentities.test(str)) {
        commonTmpDiv.innerHTML = str;
        return commonTmpDiv.innerText || commonTmpDiv.textContent;
    }
    return str;
}

/**
 * Created by cgspine on 16/7/21.
 */
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
                o.removeClass(el, 'm-controller');
                vm.$el = el;
                var now = new Date();
                el.vtree = lexer(el.outerHTML);
                optimizate(el.vtree);
                var now2 = new Date();
                config.debug && log(`构建虚拟DOM耗时${now2 - now}ms`);
                vm.$render = render(el.vtree, vm);
                maruo.scopes[vm.$id] = {
                    vmodel: vm,
                    isTemp: true
                };
                var now3 = new Date();
                config.debug && log(`构建当前vm的$render方法用时${now3 - now2}ms`);
                batch($id);
            } else if (!$id) {
                scan(el.childNodes, maruo);
            }
        }
    }
}

var scan$1 = function (els, maruo) {
    if (!els || !els.nodeType) {
        warn('[avalon.scan] first argument must be element , documentFragment, or document');
        return;
    }
    scan([els], maruo);
};

/**
 * Created by cgspine on 16/8/2.
 */
/*********************************************************************
 *                        CSS Hooks                                  *
 *********************************************************************/
var cssHooks = {
    "@:set": function (node, name, value) {
        node.style[name] = value;
    },
    "@:get": function (node, name) {
        if (!node || !node.style) {
            throw new Error("getComputedStyle要求传入一个节点 " + node);
        }
        var ret,
            computed = browser.window.getComputedStyle(node);
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

"top,left".replace(rword, function (name) {
    cssHooks[name + ":get"] = function (node) {
        var computed = cssHooks["@:get"](node, name);
        return (/px$/.test(computed) ? computed : position(node)[name] + "px"
        );
    };
});

const WH = {};
each({
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
var cssNumber = oneObject("animationIterationCount,columnCount,fillOpacity,fontSizeAdjust,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom,rotate,flexGrow,flexShrink,order");

var transitionPropertiesEndAndPrefix = function () {
    var endEvent,
        prefix = '',
        transitions = {
        O: 'otransitionend',
        Moz: 'transitionend',
        Webkit: 'webkitTransitionEnd',
        ms: 'MSTransitionEnd'
    };

    for (var vender in transitions) {
        if (hasOwn.call(transitions, vender)) {
            if (browser.singletonDiv.style[vender + 'TransitionProperty'] !== void 0) {
                prefix = '-' + vender.toLowerCase() + '-';
                endEvent = transitions[vender];
                break;
            }
        }
    }

    if (!endEvent && browser.singletonDiv.style.transitionProperty !== void 0) {
        endEvent = 'transitionend';
    }
    return {
        end: endEvent,
        prefix: prefix
    };
}();



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
    host = host || browser.root.style;
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
        _offsetParent = offsetParent(el // Get *real* offsetParent
        );_offset = offset(el // Get correct offsets
        );if (_offsetParent.tagName !== "HTML") {
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
    return camelize(str.replace(/^-ms-/, 'ms-'));
}

function css(el, name, value) {
    if (el.nodeType !== 1) {
        return;
    }
    var prop = camelize(name);
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

const scroll = {};

each({
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

/**
 * Created by cgspine on 16/8/13.
 */
var support = {};

var input = browser.document.createElement('input');
var select = browser.document.createElement("select");
var opt = select.appendChild(browser.document.createElement("option"));
input.type = "checkbox";

// Support: Android <=4.3 only
// Default value for a checkbox should be "on"
support.checkOn = input.value !== "";

// Support: IE <=11 only
// Must access selectedIndex to make default options select
support.optSelectedDefault = opt.selected;

// Support: IE <=11 only
// An input loses its value after becoming a radio
input = browser.document.createElement("input");
input.value = "t";
input.type = "radio";
support.radioValue = input.value === "t";

/**
 * Created by cgspine on 16/8/9.
 */
var rfocusable = /^(?:input|select|textarea|button)$/i;
var rclickable = /^(?:a|area)$/i;
var propMap = { //不规则的属性名映射
    'accept-charset': 'acceptCharset',
    'char': 'ch',
    'charoff': 'chOff',
    'class': 'className',
    'for': 'htmlFor',
    'http-equiv': 'httpEquiv'
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
};var bools = ['autofocus,autoplay,async,allowTransparency,checked,controls', 'declare,disabled,defer,defaultChecked,defaultSelected,', 'isMap,loop,multiple,noHref,noResize,noShade', 'open,readOnly,selected'].join(',');

bools.replace(/\w+/g, function (name) {
    propMap[name.toLowerCase()] = name;
});

var anomaly = ['accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan', 'dateTime,defaultValue,contentEditable,frameBorder,longDesc,maxLength,' + 'marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'].join(',');

anomaly.replace(/\w+/g, function (name) {
    propMap[name.toLowerCase()] = name;
});

var pureDiv = browser.document.createElement('div');


var cacheProp = {};
function defaultProp(node, prop) {
    var name = node.tagName + ":" + prop;
    if (name in cacheProp) {
        return cacheProp[name];
    }
    return cacheProp[name] = browser.document.createElement(node.tagName)[prop];
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
    'type:set': function (el, name, value) {
        if (!support.radioValue && value === 'radio' && el.nodeName === 'input') {
            var val = el.value;
            el.setAttribute('type', value);
            if (val) {
                el.value = val;
            }
            return value;
        }
        el.setAttribute('type', value);
    },
    'type:get': function (el) {
        var ret = el.getAttribute('type'),
            type;
        if (ret === null && (type = el.type) !== void 0) {
            return type;
        }
        return ret;
    },
    '@:get': function (el, name) {
        var ret = el.getAttribute(name);
        return ret == null ? void 0 : ret;
    },
    '@:set': function (el, name, value) {
        el.setAttribute(name, value + '');
    },
    '@bool:get': function (el, name) {
        return node[name] ? name.toLowerCase() : void 0;
    },
    '@bool:set': function (el, name) {
        el.setAttribute(name, name.toLowerCase());
        el[name] = true;
    }

};

var propHooks = {
    // Support: IE <=9 - 11 only
    'tabIndex:get': function (node) {
        var tabIndex = node.tabIndex;
        if (tabIndex) {
            return parseInt(tabIndex, 10);
        }
        // http://javascript.gakaa.com/reset-tabindex.aspx
        return rfocusable.test(node.nodeName) || rclickable.test(node.nodeName) && node.href ? 0 : -1;
    },
    '@:get': function (node, name) {
        return node[name];
    },
    '@:set': function (node, name, value) {
        node[name] = value;
    }

    // Support: IE <=11 only
    // Accessing the selectedIndex property
    // forces the browser to respect setting selected
    // on the option
    // The getter ensures a default option is selected
    // safari IE9 IE8 我们必须访问上一级元素时,才能获取这个值
};if (support.optSelectedDefault) {
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

/**
 * Created by cgspine on 16/8/9.
 */
var rspaces = /[\x20\t\r\n\f]+/g;

function getValType(el) {
    var ret = el.tagName.toLowerCase();
    return ret === 'input' && /checkbox|radio/.test(el.type) ? 'checked' : ret;
}

var valHooks = {
    'option:get': function (node) {
        var val = attr(node, "value");
        return val != null ? val :

        // Support: IE <=10 - 11 only
        // option.text throws exceptions (#14686, #14858)
        // Strip and collapse whitespace
        // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
        trim(node.text).replace(rspaces, " ");
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
    'select:set': function (node, values) {
        if (isArrayLike(values)) {
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

    'checked:set': function (node, values) {
        if (isArrayLike(values)) {
            values = [].slice.call(values);
        } else {
            values = [values + ''];
        }

        return node.checked = values.indexOf(val(node)) > -1;
    }
};

if (support.checkOn) {
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

/**
 * Created by cgspine on 16/7/21.
 */
function mixinDom(maruo) {
    maruo.ready = ready;
    maruo.shadowCopy(maruo.fn, WH);
    maruo.shadowCopy(maruo.fn, scroll);
    maruo.shadowCopy(maruo.fn, {
        offset: function () {
            return offset(this[0]);
        },
        css: function (name, val$$1) {
            return css(this[0], name, val$$1);
        },
        offsetParent: function () {
            return offsetParent(this[0]);
        },
        position: function () {
            return position(this[0]);
        },
        prop: function (name, val$$1) {
            return prop(this[0], name, val$$1);
        },
        attr: function (name, val$$1) {
            return attr(this[0], name, val$$1);
        },
        val: function (value) {
            if (value !== void 0) {
                val(this[0], value);
                return this;
            } else {
                return val(this[0]);
            }
        }
    });
    ready(function () {
        scan$1(document.body, maruo);
    });
    maruo.scan = scan$1;
}

/**
 * Created by cgspine on 16/9/10.
 */

var xmlParser = function (text) {
  return text;
};

/**
 * Created by cgspine on 16/9/10.
 */

var htmlParser = function (text) {
  return text;
};

/**
 * Created by cgspine on 16/9/10.
 */

var scriptParser = function (text) {
  return text;
};

/**
 * Created by cgspine on 16/9/10.
 */
var converters = {
    text: function (text) {
        return text || '';
    },
    xml: function (text, xml) {
        return xml !== void 0 ? xml : xmlParser(text);
    },
    html: function (text) {
        htmlParser(text);
    },
    json: function (text) {
        return JSON.parse(text);
    },
    script: function (text) {
        return scriptParser(text);
    },
    jsonp: function () {
        var json = maruo$1[this.jsonpCallback];
        delete maruo$1[this.jsonpCallback];
        return json;
    }
};

/**
 * Created by cgspine on 16/9/4.
 */
function getRealXhr() {
    try {
        return new window.XMLHttpRequest();
    } catch (e) {}
}

var uniqueId = 1;

const rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg;

function XHR(opts) {
    this._events = {};
    this.opts = opts || {};

    this.responseHeadersString = '';
    this.responseHeaders = {};
    this.requestHeaders = {};
    this.querystring = this.opts.querystring;
    this.readyState = 0;
    this.uniqueId = uniqueId++;
    this.status = 0;
    this.addEventListener = this.bind;
    this.removeEventListener = this.unbind;
}

XHR.prototype = {
    constructor: XHR,

    setRequestHeader: function (name, value) {
        this.requestHeaders[name] = value;
        return this;
    },
    getAllResponseHeaders: function () {
        return this.readyState === 4 ? this.responseHeadersString : null;
    },
    getResponseHeader: function (name, match) {
        if (this.readyState === 4) {
            while (match = rheaders.exec(this.responseHeadersString)) {
                this.responseHeaders[match[1]] = match[2];
            }
            match = this.responseHeaders[name];
        }
        return match === void 0 ? null : match;
    },
    overrideMimeType: function (type) {
        this.mimeType = type;
        return this;
    },
    abort: function () {
        this.respond('abort');
        return this;
    },

    dispatch(status, statusText) {
        if (!this.fetcher) {
            return;
        }
        this.readyState = 4;
        var eventType = 'error';
        if (status >= 200 && status < 300 || status === 304) {
            eventType = 'success';
            if (status === 204) {
                statusText = 'no content';
            } else if (status === 304) {
                statusText = 'not modified';
            } else {
                if (typeof this.response === 'undefined') {
                    var dataType = this.opts.dataType || this.opts.mimeType;
                    if (!dataType) {
                        dataType = this.getResponseHeader('Content-Type') || '';
                        dataType = dataType.match(/json|xml|xml|script|html/) || ['text'];
                        dataType = dataType[0];
                    }
                    try {
                        this.response = converters[dataType].call(this, this.responseText, this.responseXML);
                    } catch (e) {
                        eventType = 'error';
                        statusText = 'parser error: ' + e;
                    }
                }
            }
        }
        this.status = status;
        this.statusText = statusText;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            delete this.timeoutId;
        }
        if (eventType === 'success') {
            this.fire(eventType, this.response, statusText, this);
        } else {
            this.fire(eventType, this, statusText);
        }
        this.fire('complete', this, statusText);
        delete this.fetcher;
    },

    bind: function (type, callback) {
        var listeners = this._events[type];
        if (listeners) {
            listeners.push(callback);
        } else {
            this._events[type] = [callback];
        }
        return this;
    },
    unbind: function (type, callback) {
        var n = arguments.length;
        if (n === 0) {
            this._events = {};
        } else if (n === 1) {
            this._events[type] = [];
        } else {
            var listeners = this._events[type] || [],
                i = listeners.length;
            while (--i >= 0) {
                if (listeners[i] === callback) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
        return this;
    },
    once: function (type, callback) {
        var self = this;
        var wrapper = function () {
            callback.apply(self, arguments);
            self.unbind(type, wrapper);
        };
        this.bind(type, wrapper);
        return this;
    },
    fire: function (type) {
        var listeners = (this._events[type] || []).concat(); // 防止影响原数组
        if (listeners.length) {
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0, callback; callback = listeners[i++];) {
                callback.apply(this, args);
            }
        }
    },
    toString: function () {
        return '[object XHR]';
    }
};

/**
 * Created by cgspine on 16/9/7.
 */
const xhrSuccessStatusMap = {
    0: 200, // File protocol always yields status code 0, assume 200
    1223: 204 // Support: IE <=9 only
};

var xhr = {
    request: function () {
        var self = this;
        var opts = this.opts;
        var fetcher = this.fetcher = getRealXhr();
        if (opts.crossDomain && !('withCredentials' in fetcher)) {
            err('browser does not support cross domain xhr');
        }
        if (opts.username) {
            fetcher.open(opts.type, opts.url, opts.async, opts.username, opts.password);
        } else {
            fetcher.open(opts.type, opts.url, opts.async);
        }

        // Override mime type if needed
        if (this.mimeType && fetcher.overrideMimeType) {
            fetcher.overrideMimeType(this.mimeType);
        }

        // Set headers
        if (!opts.crossDomain && this.requestHeaders["X-Requested-With"]) {
            this.requestHeaders["X-Requested-With"] = "XMLHttpRequest";
        }
        for (var i in this.requestHeaders) {
            fetcher.setRequestHeader(i, this.requestHeaders[i]);
        }
        var dataType = opts.dataType;
        if ("responseType" in fetcher && /^(blob|arraybuffer|text)$/.test(dataType)) {
            fetcher.responseType = dataType;
            this.useResponseType = true;
        }
        var callback, errback;

        callback = function (type$$1) {
            return function () {
                if (callback) {
                    callback = errback = null;
                    self.respond(type$$1);
                }
            };
        };
        fetcher.onload = callback();
        errback = fetcher.onerror = callback('error'

        // Support: IE 9 only
        // Use onreadystatechange to replace onabort to handle uncaught aborts
        );if (fetcher.onabort !== void 0) {
            fetcher.onabort = errback;
        } else {
            fetcher.onreadystatechange = function () {
                if (fetcher.readyState === 4) {
                    // Allow onerror to be called first, but that will not handle a native abort
                    browser.window.setTimeout(function () {
                        if (callback) {
                            errback();
                        }
                    });
                }
            };
        }

        // Create the abort callback
        callback = callback("abort");

        try {

            fetcher.send(opts.hasContent && this.querystring || null);
        } catch (e) {
            // Only rethrow if this hasn't been notified as an error yet
            if (callback) {
                throw e;
            }
        }
    },
    respond: function (type$$1) {
        var fetcher = this.fetcher;
        if (!fetcher) {
            return;
        }
        fetcher.onerror = fetcher.onload = fetcher.onreadystatechange = noop;
        try {
            if (type$$1 === 'abort') {
                fetcher.abort();
            } else if (type$$1 === 'error') {
                // On a manual native abort, IE9 throws errors on any property access that is not readyState
                if (typeof fetcher.status !== "number") {
                    this.dispatch(0, "error");
                } else {
                    this.dispatch(fetcher.status, fetcher.statusText);
                }
            } else {
                var status = xhrSuccessStatusMap[fetcher.status] || fetcher.status;
                this.responseText = fetcher.responseText;
                try {
                    //当responseXML为[Exception: DOMException]时，
                    //访问它会抛“An attempt was made to use an object that is not, or is no longer, usable”异常
                    var xml = fetcher.responseXML;
                } catch (e) {}

                if (this.useResponseType) {
                    this.response = fetcher.response;
                }
                if (xml && xml.documentElement) {
                    this.responseXML = xml;
                }
                this.responseHeadersString = fetcher.getAllResponseHeaders();
                //火狐在跨城请求时访问statusText值会抛出异常
                try {
                    var statusText = fetcher.statusText;
                } catch (e) {
                    statusText = "firefoxAccessError";
                }
                this.dispatch(status, statusText);
            }
        } catch (e) {
            // 如果网络问题时访问XHR的属性，在FF会抛异常
            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
            if (type$$1 !== 'abort') {
                this.dispatch(500, e + "");
            }
        }
    }
};

/**
 * Created by cgspine on 16/9/10.
 */
var script = {
    request: function () {
        var opts = this.opts;
        var self = this;
        var node = this.fetcher = browser.document.createElement('script');
        if (opts.charset) {
            node.charset = opts.charset;
        }
        node.onerror = function () {
            self.respond('error');
        };
        node.onload = function () {
            self.respond();
        };
        node.src = opts.url;
        browser.document.head.appendChild(node);
    },
    respond: function (type) {
        var node = this.fetcher;
        if (!node) {
            return;
        }
        node.onerror = node.onload = null;
        var parent = node.parentNode;
        if (parent) {
            parent.removeChild(node);
        }
        // abort就什么都不做了
        if (type === 'error') {
            this.dispatch(404, 'error');
        } else if (type !== 'abort') {
            if (typeof maruo$1[this.jsonpCallback] == 'function') {
                // jsonp返回时复写maruo[this.jsonpCallback]为json，如果还是function,则说明jsonp出错
                this.dispatch(500, 'error');
            } else {
                this.dispatch(200, 'success');
            }
        }
    }
};

/**
 * Created by cgspine on 16/9/10.
 */
var uuid = 0;
const rquery$1 = /\?/;

var jsonp = {
    preprocess: function () {
        var opts = this.opts;
        var name = this.jsonpCallback = opts.jsonpCallback || 'ajax_jsonp_' + uuid++;
        opts.url = opts.url + (rquery$1.test(opts.url) ? "&" : "?") + opts.jsonp + "=" + "maruo." + name;
        //将后台返回的json保存在惰性函数中
        maruo$1[name] = function (json) {
            maruo$1[name] = json;
        };
        return "script";
    }
};
mixin(jsonp, script);

/**
 * Created by cgspine on 16/9/10.
 */
var upload = {
    proprecess: function () {
        var opts = this.opts;
        var formdata = new FormData(opts.form);
        each(opts.data, function (key, val) {
            formdata.append(key, val);
        });
        this.formdata = formdata;
    }
};
mixin(upload, xhr);

/**
 * Created by cgspine on 16/9/4.
 */

var transports = {
    xhr: xhr,
    script: script,
    jsonp: jsonp,
    upload: upload
};

/**
 * Created by cgspine on 16/9/4.
 */
const rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
const curl = browser.document.URL;
const segments = rurl.exec(curl.toLowerCase()) || [];
const rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
const rnoContent = /^(?:GET|HEAD)$/;
const rquery = /\?/;
const defaults = {
    type: 'GET',
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    async: true,
    jsonp: "callback",
    isLocal: rlocalProtocol.test(segments[1])
};
const accepts = {
    xml: "application/xml, text/xml",
    html: "text/html",
    text: "text/plain",
    json: "application/json, text/javascript",
    script: "text/javascript, application/javascript",
    "*": ["*/"] + ["*"] //避免被压缩掉
};

function ajax(opts) {
    if (!opts || !opts.url) {
        err("argument must be object which has a property named url");
    }
    opts = setOptions(opts);
    var xhr = new XHR(opts);
    'complete,success,error'.replace(rword, function (name) {
        if (typeof opts[name] === 'function') {
            xhr.bind(name, opts[name]);
            delete opts[name];
        }
    });
    var dataType = opts.dataType; // 目标返回数据类型
    var name = opts.form ? 'upload' : dataType;
    var transport = transports[name] || transports.xhr;
    mixin(xhr, transport);
    if (xhr.preprocess) {
        dataType = xhr.preprocess() || dataType;
    }
    // 设置首部
    if (opts.contentType) {
        xhr.setRequestHeader('Content-Type', opts.contentType);
    }
    xhr.setRequestHeader("Accept", accepts[dataType] ? accepts[dataType] + ", */*; q=0.01" : accepts["*"]);
    for (var i in opts.headers) {
        xhr.setRequestHeader(i, opts.headers[i]);
    }
    // 处理超时
    if (opts.async && opts.timeout > 0) {
        xhr.timeoutId = setTimeout(function () {
            xhr.abort("timeout");
        }, opts.timeoutId);
    }

    // request
    xhr.request();
    return xhr;
}

function setOptions(opts) {
    opts = mixin({}, defaults, opts);
    if (typeof opts.crossDomain !== 'boolean') {
        // 是否跨域
        var parts = rurl.exec(opts.url.toLowerCase());
        opts.crossDomain = !!(parts && (parts[1] !== segments[1] || parts[2] !== segments[2] || (parts[3] || (parts[1] === 'http:' ? 80 : 443)) !== (segments[3] || (segments[1] === 'http:' ? 80 : 443))));
    }
    if (opts.data && typeof opts.data !== 'object') {
        err('data must be a object');
    }
    var querystring = param(opts.data);
    opts.querystring = querystring || '';
    opts.url = opts.url.replace(/#.*$/, '').replace(/^\/\//, segments[1] + '//');
    opts.type = opts.type.toUpperCase();
    opts.hasContent = !rnoContent.test(opts.type);
    if (!opts.hasContent) {
        if (querystring) {
            opts.url += (rquery.test(opts.url) ? '&' : '?') + querystring;
        }
        if (opts.cache === false) {
            opts.url += (rquery.test(opts.url) ? '&' : '?') + 'maruo_timestamp' + Date.now();
        }
    }
    return opts;
}

/**
 * Created by cgspine on 16/9/4.
 */
function mixinAjax(maruo) {
  maruo.ajax = ajax;
}

/**
 * Created by cgspine on 16/7/24.
 */
var expr$1 = {
    parse: noop,
    diff: function (copy, src) {
        var copyValue = copy.nodeValue + '';
        if (copyValue !== src.nodeValue) {
            var dom = src.dom;
            if (dom) {
                dom.nodeValue = copyValue;
            } else {
                config.debug && warn(`找不到[${copy.nodeValue}]对应的节点`);
            }
        }
    }
};

/**
 * Created by cgspine on 16/7/23.
 */
var text = {
    parse: function (cur, src, binding, scope) {
        src.children = [];
        cur.children = [];
        cur.children.push(new VText({
            nodeType: 3,
            type: '#text',
            dynamic: true,
            nodeValue: parseExpr(binding.expr).getter(scope)
        }));
    },

    diff: function (copy, src) {
        if (!src.children.length) {
            var dom = src.dom;
            if (dom && !src.isVoidTag) {
                while (dom.firstChild) {
                    dom.removeChild(dom.firstChild);
                }
                var text = document.createTextNode('x');
                dom.appendChild(text);
                var a = { nodeType: 3, type: '#text', dom: text };
                src.children.push(new VText(a));
            }
        }
    }
};

/**
 * Created by cgspine on 16/7/30.
 */

var controller = {
    parse: function (copy, src, binding) {
        copy[binding.name] = binding.expr;
    },

    diff(copy, src, name) {
        if (copy[name] !== src[name]) {
            var id = src[name] = copy[name];
            var scope = maruo$1.scopes[id];
            if (scope) {
                return;
            }
            var vm = maruo$1.vms[id];
            maruo$1.scopes[id] = {
                vmodel: vm
            };
        }
    }
};

/**
 * Created by cgspine on 16/7/23.
 */

function mixinDirectives(maruo) {
    maruo.directive('expr', expr$1);
    maruo.directive('text', text);
    maruo.directive('controller', controller);
}

/**
 * Created by cgspine on 16/7/9.
 */

mixinCore(maruo$1);
mixinData(maruo$1);
mixinViewModel(maruo$1);
mixinEvent(maruo$1);
mixinDom(maruo$1);
mixinAjax(maruo$1);
mixinDirectives(maruo$1);

return maruo$1;

})));
