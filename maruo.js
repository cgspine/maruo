/**
 * Created by cgspine on 16/3/19.
 */

/**
 * #全局变量
 * #全局方法
 * #静态方法
 * #JS底层补丁
 * #DOM Helper
 * #CSS
 * #MVVM
 */

(function(global, factory){
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document ? factory(global,true) : function (w) {
            if(!w.document){
                throw new Error("require browser environment");
            }
            return factory(w);
        }
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ?
    window : this, function (window, noGlobal) {

    /*********************************************************************
     *                    #全局变量                                       *
     *********************************************************************/
    var expose = new Date() - 0;
    var doc = window.document;
    var root = doc.documentElement;
    var head = doc.head ||doc.getElementsByTagName('head')[0];
    var w3c = doc.dispatchEvent;

    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;
    var aslice = Array.prototype.slice;

    var rword = /[^, ]+/g;
    var rnative = /\[native code\]/ //判定是否原生函数

    var cinerator = doc.createElement("div")

    var class2type = {
        "[object HTMLDocument]": "Document",
        "[object HTMLCollection]": "NodeList",
        "[object StaticNodeList]": "NodeList",
        "[object DOMWindow]": "Window",
        "[object global]": "Window",
        "null": "Null",
        "NaN": "NaN",
        "undefined": "Undefined"
    };
    "Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList".replace(rword, function(name){
        class2type["[object " + name + "]"] = name;
    });

    var maruo = function (el) {
        return new maruo.init(el);
    };

    /*********************************************************************
     *                    #全局方法                                       *
     *********************************************************************/
    function noop() {
        
    }
    
    function oneObject(arr, val) {
        if(typeof arr === 'string'){
            arr = arr.match(rword) || [];
        }
        var result = {},
            val = val !== void 0 ? val : 1;
        for (var i = 0, n = arr.length; i < n; i++) {
            result[arr[i]] = val;
        }
        return result;
    }

    //生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var generateID = function () {
        return (expose++).toString(36);
    };

    // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
    function log() {
        if (window.console && maruo.config.debug) {
            Function.apply.call(console.log,console,arguments);
        }
    }

    // IE678:typeof alert === 'object'
    var isFunction = typeof alert === 'object' ? function (fn) {
        try {
            return /^\s*\bfunction\b/.test(fn + "");
        } catch (e) {
            return false;
        }
    } : function (fn) {
        return toString.call(fn) === '[object Function]';
    };

    var rcamelize = /[-_]([^-_])/g;
    function camelize(str){
        return str.replace(rcamelize,function(matched,element){
            return element.toUpperCase();
        });
    }

    var rhyphenate = /([a-z\d])([A-Z]+)/g;
    function hyphenate(str){
        return str.replace(rhyphenate,'$1-$2').toLowerCase();
    }




    /*********************************************************************
     *                    #静态方法                                       *
     *********************************************************************/
    
    maruo.nextTick = (function () {
        var queue = [];
        var pending = false;
        function callbacks(){
            pending = false;
            var copies = queue.slice(0);
            queue = [];
            for(var i=0; i<copies.length;i++){
                copies[i]();
            }
        }
        var tickImmediate = window.setImmediate;
        var tickObserver = window.MutationObserver
            || window.WebKitMutationObserver
            || window.MozMutationObserver;

        var timerFunc;


        if (tickImmediate) { //IE10 \11 edage
            timerFunc = tickImmediate;
        } else if(tickObserver){ //支持MutationObserver
            var counter = 1;
            var observer = new tickObserver(callbacks);
            var textNode = document.createTextNode(counter);
            observer.observe(textNode, {
                characterData: true
            });
            timerFunc = function () {
                counter = (counter + 1) % 2;
                textNode.data = counter;
            }
        }else{
            timerFunc = setTimeout;
        }

        return function (fn){
            queue.push(fn);
            if(pending){
                return;
            }
            pending = true;
            timerFunc(callbacks,0)
        }
    })();
    
    maruo.init = function (el) {
        this[0] = this.element = el;
    };
    
    maruo.fn = maruo.prototype = maruo.init.prototype;

    /**
     * 判断是否为函数
     * @type {Function}
     */
    maruo.isFunction = isFunction;

    /**
     * 判断是否为原生的javascript对象
     * @param obj
     *
     */
    maruo.isPlainObject = function(obj,key){
        if(!obj || !maruo.type(obj,'Object') || obj.nodeType) {
            return false;
        }
        try {
            //IE67下DOM和BOM的constructor没有暴露出来
            if (obj.constructor && !hasOwn.call(obj,'constructor') && !hasOwn.call(obj.constructor.prototype,'isPrototypeOf')) {
                return false;
            }
        } catch (e) { //IE89会抛错
            return false;
        }

        for (key in obj){}

        return key === void 0 || hasOwn.call(obj,key);
    };

    /**
     * 快捷方式:判断是否为window
     * @param obj
     * @returns {*}
     */
    maruo.isWindow = function (obj) {
        return maruo.type(obj,'Window');
    };

    /**
     * 判断类型
     * @param obj
     * @param str 用于判断与给定的类型是否相等
     * @returns {*}
     *
     * !obj => null, undefined
     * obj !== obj => NaN
     */
    maruo.type = function (obj,str) {
        var key = (!obj || obj !== obj) ? String(obj) : toString.call(obj);
        var result = class2type[key] || obj.nodeName || '#';
        if (result.charAt(0) === '#') {
            //IE678 window == document && document != window
            if (obj == obj.document && obj.document != obj) {
                result = 'Window';
            } else if (obj.nodeType === 9) {
                result = 'Document';
            } else if(isFinite(obj.length) && obj.item) {
                result = 'NodeList';
            } else if(obj.callee) {
                result = 'Argument';
            } else {
                result = toString.call(obj).slice(8, -1);
            }
        }
        if (str) {
            return result === str;
        }
        return result;
    };

    /**
     * 对象扩展
     */
    maruo.mix = maruo.fn.mix = function () {
        var target = arguments[0] || {},
            deep = false,
            length = arguments.length,
            i = 1,
            option,name,ret,copy,copyAsArray,clone;
        //如果第一个参数为boolean: 判断是否为深拷贝
        if(typeof target === 'boolean'){
            deep = target;
            target = arguments[1] || {};
            i++;
        }
        
        if(typeof target !== 'object' && !isFunction(target)){
            target = {};
        }
        
        //如果只有一个对象参数,则mix到调用者上
        if(i === length){
            target = this;
            i--;
        }
        
        for(; i<length; i++){
            option = arguments[i];
            if (option != null) {
               for (name in option) {
                   ret = target[name];
                   copy = option[name];
                   
                   //防止环引用
                   if (target === copy) {
                       continue;
                   }
                   
                   if (deep && copy && (maruo.isPlainObject(copy) || (copyAsArray = Array.isArray(copy)))) {
                       if (copyAsArray) {
                           copyAsArray = false;
                           clone = ret && Array.isArray(ret) ? ret : [];
                       } else {
                           clone = ret && maruo.isPlainObject(ret) ? ret : {};
                       }
                       target[name] = maruo.mix(deep,clone,copy);
                   } else if (copy !== void 0) {
                       target[name] = copy
                   }
               }
            }
        }
        return target;
    };

    maruo.mix({
        rword : rword,
        version : 'v0.0.1',
        log : log,
        /**
         * 将类数组转换为数组
         */
        slice : w3c ? function (nodes, start, end) {
            return aslice.call(nodes, start, end);
        } : function (nodes, start, end) {
            var ret =[],
                length = nodes.length;
            if (end == void 0) {
                end = length;
            }
            if (typeof end === 'number' && isFinite(end)) {
                start = parseInt(start,10);
                end = parseInt(end,10);

                if(start < 0){
                    start += length;
                }

                if(end < 0){
                    end += length;
                }
                for(var i = start; i < end; i++){
                    ret[i-start] = nodes[i];
                }
            }
            return ret;
        },
        noop : noop,
        error : function (str, e) {
            throw (e || Error)(str);
        },
        oneObject : oneObject,
        
        range : function (start, end, step) {
            step || (step = 1);
            if (!end) {
                end = start || 0;
                start = 0;
            }
            var i = -1,
                len = Math.max(0,Math.ceil((end - start) / step)),
                result = new Array(len);
            while (++i < len) {
                result[i] = start;
                start += step;
            }
            return result;
        },
        
        isArrayLike : function (obj) {
            if (!obj) {
                return false;
            }
            var len = obj.length;
            if (n === (n>>>0)) { //是否为非负数
                var type = toString.call(obj).slice(8,-1);
                if (/(?:regexp|string|function|window|global)$/i.test(type)) {
                    return false;
                }
                if (type === 'Array') {
                    return true;
                }

                try {
                    if ({}.propertyIsEnumerable.call(obj, 'length') === false) {
                        return /^\s?function/.test(obj.item || obj.callee);
                    }
                    return true;
                } catch (e) { //IE的NodeList直接抛错
                    return !obj.window; //IE6-8 window
                }
            }
            return false;
        },
        
        bind:function (el, type, fn, phase) {
            if (w3c) {
                el.addEventListener(type, fn, !!phase);
            } else {
                el.attachEvent('on' + type, fn);
            }
        },
        
        unbind: function (el, type, fn, phase) {
            if (w3c) {
                el.removeEventListener(type,fn,phase);
            } else {
                el.detachEvent('on' + type, fn);
            }
        }
    });

    /*********************************************************************
     *                    #JS底层补丁                                     *
     *********************************************************************/

    if(!Array.isArray){
        Array.isArray = function (arr) {
            return toString.call(arr) === '[object Array]';
        }
    }

    //IE著名bug——如果某个实例属性与标为[[DontEnum]]的某个属性同名，那么该实例属性不会出现在for in;IE9修复
    var hasDontEnumBug = !({
            'toString': null
        }).propertyIsEnumerable('toString'),
        hasProtoEnumBug = (function () {
        }).propertyIsEnumerable('prototype'),
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;
    if (!Object.keys) {
        Object.keys = function (object) {
            var theKeys = [];
            var skipProto = hasProtoEnumBug && typeof object === "function";
            if (typeof object === "string" || (object && object.callee)) {
                for (var i = 0; i < object.length; ++i) {
                    theKeys.push(String(i))
                }
            } else {
                for (var name in object) {
                    if (!(skipProto && name === "prototype") && hasOwn.call(object, name)) {
                        theKeys.push(String(name))
                    }
                }
            }

            if (hasDontEnumBug) {
                var ctor = object.constructor,
                    skipConstructor = ctor && ctor.prototype === object;
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j];
                    if (!(skipConstructor && dontEnum === "constructor") && hasOwn.call(object, dontEnum)) {
                        theKeys.push(dontEnum)
                    }
                }
            }
            return theKeys
        }
    }

    if (!noop.bind) {
        Function.prototype.bind = function (scope) {
            if (arguments.length < 2 && scope === void 0)
                return this;
            var fn = this,
                argv = arguments;
            return function () {
                var args = [], i;
                for (i = 1; i < argv.length; i++)
                    args.push(argv[i])
                for (i = 0; i < arguments.length; i++)
                    args.push(arguments[i])
                return fn.apply(scope, args)
            }
        }
    }

    function iterator(vars, body, ret) {
        var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret
        /* jshint ignore:start */
        return Function("fn,scope", fun)
        /* jshint ignore:end */
    }
    if (!rnative.test([].map)) {
        maruo.mix(Array.prototype, {
            //定位操作，返回数组中第一个等于给定参数的元素的索引值。
            indexOf: function (item, index) {
                var n = this.length,
                    i = ~~index;
                if (i < 0)
                    i += n;
                for (; i < n; i++)
                    if (this[i] === item)
                        return i;
                return -1;
            },
            //定位操作，同上，不过是从后遍历。
            lastIndexOf: function (item, index) {
                var n = this.length,
                    i = index == null ? n - 1 : index;
                if (i < 0)
                    i = Math.max(0, n + i);
                for (; i >= 0; i--)
                    if (this[i] === item)
                        return i;
                return -1;
            },
            //迭代操作，将数组的元素挨个儿传入一个函数中执行。Prototype.js的对应名字为each。
            forEach: iterator("", '_', ""),
            //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
            filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
            //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Prototype.js的对应名字为collect。
            map: iterator('r=[],', 'r[i]=_', 'return r'),
            //只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true。Prototype.js的对应名字为any。
            some: iterator("", 'if(_)return true', 'return false'),
            //只有数组中的元素都满足条件（放进给定函数返回true），它才返回true。Prototype.js的对应名字为all。
            every: iterator("", 'if(!_)return false', 'return true')
        })
    }

    /*********************************************************************
     *                    #DOM Helper                                    *
     *********************************************************************/

    var domHelper = {
        hasClass : function (el, c) {
            if (el.classList) {
                return c && el.classList.contains(c);
            }
            return el.className.indexOf(c) !== -1;
        },
        addClass : function (el, c) {
            if (el.classList) {
                el.classList.add(c);
            } else if (!domHelper.hasClass(el,c)) {
                el.className += ' ' + c;
            }
        },
        removeClass : function (el, c) {
            if (el.classList) {
                el.classList.remove(c);
            } else {
                var pattern = new RegExp('(^|\\s)' + c + '(?:\\s|$)','g');
                el.className = el.className
                    .replace(pattern,'$1')
                    .replace(/\s+/,' ')
                    .replace(/^\s*|\s*$/g,'');
            }
        },
        togglerClass : function (el, c) {
            if (domHelper.hasClass(el,c)) {
                domHelper.removeClass(el,c);
            } else {
                domHelper.addClass(el,c);
            }
        },

        ownerDocument : function (node) {
            return (node && node.ownerDocument) || doc;
        },
        isInDom : function () {
            return typeof window !== "undefined" && !!window.document && !!window.document.createElement;
        },
        getWindow : function (node) {
            return node === node.window ? node
                : (node = domHelper.ownerDocument(node)) && node.defaultView || node.parentWindow;
        },
        requestAnimationFrame: (function(){
            var venders = ['','webkit','moz','o','ms'],
                success = fallback,
                cancel = 'clearTimeout',
                output,
                getKey = function(vender,key){
                    return (!vender?key:key[0].toUpperCase()+key.substr(1)) + 'AnimationFrame';
                };

            venders.some(function(vender){
                var successKey = getKey(vender,'request');
                if(successKey in window){
                    cancel = getKey(vender,'cancel');
                    success = function(fn){
                        return window[successKey](fn);
                    };
                    return true;
                }
                return false;
            });

            var prev = new Date().getTime();
            function fallback(fn){
                var cur = new Date().getTime(),
                    ms = Math.max(0,16-(cur-prev)),
                    req = setTimeout(fn,ms);
                prev = cur;
                return req;
            }



            output = function(fn){
                return success(fn);
            };
            output.cancel = function(id){
                window[cancel](id);
            };

            return output;
        })()
    };



    maruo.domHelper = domHelper;

    /*********************************************************************
     *                    #CSS                                           *
     *********************************************************************/

    /**
     * 将中划线式styleName转换为驼峰式
     * eg:background-color => backgroundColor; -moz-transition => MozTransition; -ms-transition => msTransition
     * ms前缀的需要特殊处理
     * @param str
     */
    function camlizeStyleName(str){
        if (!str || str.indexOf("-") < 0 && str.indexOf("_") < 0) {
            return str
        }
        return camelize(str.replace(/^-ms-/,'ms-'));
    }

    /**
     * 将驼峰式styleName转换为中划线式
     * eg:backgroundColor=>background-color; MozTransition => -moz-transition; msTransition => -ms-transition
     * @param str
     */
    function hyphenateStyleName(str){
        hyphenate(str).replace(/^ms-/,'-ms-');
    }

    var _getTransitionPropertiesEndAndPrefix = (function(){
        var endEvent,
            prefix = '',
            transitions = {
                O:'otransitionend',
                Moz:'transitionend',
                Webkit:'webkitTransitionEnd',
                ms:'MSTransitionEnd'
            };

        for(var vender in transitions){
            if(hasOwn.call(transitions,vender)){
                if(cinerator.style[vender+'TransitionProperty'] !== void 0){
                    prefix = '-'+vender.toLowerCase()+'-';
                    endEvent = transitions[vender];
                    break;
                }
            }
        }

        if(!endEvent && cinerator.style.transitionProperty !== void 0){
            endEvent = 'transitionend';
        }
        return {
            end:endEvent,
            prefix:prefix
        }
    })();

    var prefixes = [''];
    var prefix = _getTransitionPropertiesEndAndPrefix.prefix;
    if(prefix !== ''){
        prefixes.push(prefix);
    }

    var cssMap = {
        'float' : w3c ? 'cssFloat' : 'styleFloat'
    };

    maruo.transitionend = _getTransitionPropertiesEndAndPrefix.end;
    
    maruo.cssName = function (name,host) {
        if(cssMap[name]){
            return cssMap[name];
        }
        host = host || root.style;
        for (var i = 0, n = prefixes.length,camelCase; i < n; i++){
            camelCase = camlizeStyleName(prefix + name);
            if (camelCase in host) {
                return (cssMap[name] = camelCase);
            }
        }
        return null;
    };

    var  cssHooks = maruo.cssHooks = {};

    cssHooks["@:set"] = function (node, name, value) {
        try { //node.style.width = NaN;node.style.width = "xxxxxxx";node.style.width = undefine 在旧式IE下会抛异常
            node.style[name] = value
        } catch (e) {
        }
    }

    maruo.css = function (node, name, value) {
        if (node instanceof maruo) {
            node = node[0];
        }

    }


    /*********************************************************************
     *                    #MVVM                                          *
     *********************************************************************/

    maruo.vms = {};
    maruo.define = function (id,factory) {

    };


    
    // Register as a named AMD module
    if (typeof define === 'function' && define.amd) {
        define("maruo", [], function() {
            return maruo;
        })
    }
    //no conflict
    var _maruo = window.maruo;
    maruo.noConflict = function(deep){
        if (deep && window.maruo === maruo) {
            window.maruo = _maruo;
        }
        return maruo;
    };
    
    if (noGlobal === void 0) {
        window.maruo = maruo;
    }
    
    return maruo;
});
