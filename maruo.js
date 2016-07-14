/**
 * Created by cgspine on 16/3/19.
 */

/**
 * #全局变量
 * #全局方法
 * #Cache
 * #静态方法
 * #原型方法
 * #JS底层补丁
 * #DOM Helper
 * #CSS
 * #Attr
 * #Support
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

    var cinerator = doc.createElement("div");

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
     *                    #Support                                       *
     *********************************************************************/
    var div = doc.createElement('div'),
        TAGS = 'getElementsByTagName';
    div.setAttribute("className","t");
    div.innerHTML = ' <link/><a href="/nasami"  style="float:left;opacity:.25;">d</a>' + '<object><param/></object><table></table><input type="checkbox" checked/>';
    var a = div[TAGS]('a')[0],
        style = a.style,
        select = doc.createElement('select'),
        input = div[TAGS]('input')[0],
        opt = select.appendChild(doc.createElement('option'));
    maruo.support = {
        // 在大多数游览器中checkbox的value默认为on，唯有chrome返回空字符串
        checkOn: input.value === "on",
        //IE67，无法取得用户设定的原始href值
        attrInnateHref: a.getAttribute("href") === "/nasami",
        //IE67，无法取得用户设定的原始style值，只能返回el.style（CSSStyleDeclaration）对象(bug)
        attrInnateStyle: a.getAttribute("style") !== style,
        //IE67, 对于某些固有属性需要进行映射才可以用，如class, for, char，IE8及其他标准浏览器不需要
        attrInnateName: div.className !== "t",
        //IE6-8,对于某些固有属性不会返回用户最初设置的值
        attrInnateValue: input.getAttribute("checked") == ""
    }

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
     *                    #Cache                                         *
     *********************************************************************/
    // https://github.com/rsms/js-lru
    var Cache = new function() {// jshint ignore:line
        function LRU(maxLength) {
            this.size = 0
            this.limit = maxLength
            this.head = this.tail = void 0
            this._keymap = {}
        }

        var p = LRU.prototype

        p.put = function(key, value) {
            var entry = {
                key: key,
                value: value
            }
            this._keymap[key] = entry
            if (this.tail) {
                this.tail.newer = entry
                entry.older = this.tail
            } else {
                this.head = entry
            }
            this.tail = entry
            if (this.size === this.limit) {
                this.shift()
            } else {
                this.size++
            }
            return value
        }

        p.shift = function() {
            var entry = this.head
            if (entry) {
                this.head = this.head.newer
                this.head.older =
                    entry.newer =
                        entry.older =
                            this._keymap[entry.key] = void 0
                delete this._keymap[entry.key] //#1029
            }
        }
        p.get = function(key) {
            var entry = this._keymap[key]
            if (entry === void 0)
                return
            if (entry === this.tail) {
                return  entry.value
            }
            // HEAD--------------TAIL
            //   <.older   .newer>
            //  <--- add direction --
            //   A  B  C  <D>  E
            if (entry.newer) {
                if (entry === this.head) {
                    this.head = entry.newer
                }
                entry.newer.older = entry.older // C <-- E.
            }
            if (entry.older) {
                entry.older.newer = entry.newer // C. --> E
            }
            entry.newer = void 0 // D --x
            entry.older = this.tail // D. --> E
            if (this.tail) {
                this.tail.newer = entry // E. <-- D
            }
            this.tail = entry
            return entry.value
        }
        return LRU
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
            var n = obj.length;
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

        each: function (obj, fn) {
            if (obj) {
                var i = 0;
                if (maruo.isArrayLike(obj)) {
                    for (var n = obj.length; i < n; i++) {
                        if(fn(i, obj[i]) === false){
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                            break
                        }
                    }
                }
            }
        },

        Array: {
            ensure: function (target, item) {
                if (target.indexOf(item) === -1) {
                    return target.push(item);
                }
            },
            removeAt: function (target, index) {
                return !!target.splice(index,1).length;
            },
            remove: function (target, item) {
                var index = target.indexOf(item);
                if (~index) {
                   return maruo.Array.removeAt(target,index);
                }
                return false;
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
        })(),
        
        contains :function (root, el) {
            try { //IE6-8,游离于DOM树外的文本节点，访问parentNode有时会抛错
                while ((el = el.parentNode))
                    if (el === root)
                        return true
                return false
            } catch (e) {
                return false
            }
        }
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
    //这里的属性不需要自行添加px
    maruo.cssNumber = maruo.oneObject("columnCount,fillOpacity,fontSizeAdjust,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom,rotate");

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
    };
    
    var cssBoxSizing = maruo.cssName('box-sizing');
    cssHooks['boxSizing:get'] = function (node,name) {
        return cssBoxSizing ? cssHooks['@:get'](node,name) : doc.compatMode === 'BackCompact' ? 'border-box' : 'content-box';
    };
    
    if (window.getComputedStyle) {
        cssHooks["@:get"] = function (node, name) {
            if (!node || !node.style) {
                throw new Error("要求传入一个节点 " + node)
            }
            //Firefox 3.6时，其frame中需要使用document.defaultView去获取window对象，才能使用其getComputedStyle方法
            var dom = node.ownerDocument,styles,ret;
            if(dom.defaultView.opener){
                styles = dom.defaultView.getComputedStyle(node,null);
            }else{
                styles = window.getComputedStyle(node,null);
            }
            if (styles) {
                //IE9下"filter"只能通过getPropertyValue取值.https://github.com/jquery/jquery/commit/9ced0274653b8b17ceb6b0675e2ae05433dcf202
                ret = styles.getPropertyValue(name) || styles[name];
                var style = node.style;//这里只有firefox与IE10会智能处理未插入DOM树的节点的样式,它会自动找内联样式
                if (ret === '' && domHelper.contains(node.ownerDocument,node)) {
                    ret = style[name]; //其他浏览器需要我们手动取内联样式
                }
            }
            return ret;
        };
        cssHooks['opacity:get'] = function (node) {
            var ret = cssHooks['@:get'](node,'opacity');
            return ret === '' ? 1 : ret;
        }
    } else {
        var rnumnonpx = /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i;
        var rposition = /^(top|right|bottom|left)$/;
        var ralpha = /alpha\([^)]*\)/i;
        var rmapper = /(\w+)_(\w+)/g;
        var ie8 = !!window.XDomainRequest;
        var salpha = "DXImageTransform.Microsoft.Alpha";
        var border = {
            thin: ie8 ? '1px' : '2px',
            medium: ie8 ? '3px' : '4px',
            thick: ie8 ? '5px' : '6px'
        };
        cssHooks["@:get"] = function (node, name) {
            var currentStyle = node.currentStyle;
            var ret = currentStyle[name];
            //IE的currentStyle得到的是Cascaded Style而不是Computed Style
            //http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
            if (rnumnonpx.test(ret) && !rposition.test(ret)) {
                var style = node.style;

                // Remember the original values
                var left = style.left;
                var rs = node.runtimeStyle;
                var rsLeft = rs && rs.left;

                // Put in the new values to get a computed value out
                if ( rsLeft ) {
                    rs.left = currentStyle.left;
                }
                //单位转换兼容详解:http://bugs.jquery.com/ticket/760
                style.left = name === "fontSize" ? "1em" : (ret || 0);
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if ( rsLeft ) {
                    rs.left = rsLeft;
                }
            }
            if (ret === "medium") {
                name = name.replace("Width", "Style")
                if (currentStyle[name] === "none") {
                    ret = "0px"
                }
            }
            return ret === "" ? "auto" : border[ret] || ret
        };

        cssHooks["opacity:set"] = function (node, name, value) {
            var style = node.style;
            var opacity = isFinite(value) && value <= 1 ? "alpha(opacity=" + value * 100 + ")" : "";
            var filter = style.filter || "";
            style.zoom = 1;//让元素获得hasLayout
            //不能使用以下方式设置透明度
            //node.filters.alpha.opacity = value * 100
            style.filter = (ralpha.test(filter) ?
                filter.replace(ralpha, opacity) :
            filter + " " + opacity).trim();
            if (!style.filter) {
                style.removeAttribute("filter")
            }
        };
        cssHooks["opacity:get"] = function (node) {
            //这是最快的获取IE透明值的方式，不需要动用正则了！
            var alpha = node.filters.alpha || node.filters[salpha],
                op = alpha && alpha.enabled ? alpha.opacity : 100;
            return (op / 100) + ""; //确保返回的是字符串
        }
    }

    var cssAttrsForMeasure = {
        position: "absolute",
        visibility: "hidden",
        display: ""
    };
    var cssPair = {
        Width: ['left', 'right'],
        Height: ['top', 'bottom']
    };
    function collectHiddenAndShow(node,arr) {
        if (node && node.nodeType === 1 && node.offsetWidth <= 0) {//opera.offsetWidth可能小于0
            if (maruo.css(node,'display') === 'none') {
                var obj = {
                    node : node
                }
                for (var name in cssAttrsForMeasure) {
                    obj[name] = node.style[name];
                    node.style[name] = cssAttrsForMeasure[name] || maruo.parseDisplayDefault(node.nodeName);
                }
                arr.push(obj);
            }
            showHidden(node.parentNode,arr);
        }
    }

    /**
     * 设置宽高
     * @param node
     * @param name
     * @param val 传入的值为offsetWidth/offsetHeight
     * @param extra 0->width/height; 1->innerWidth/innerHeight; 2->outerWidth/outerHeight
     */
    function correctWH(node, name, val, extra) {
        var witch = cssPair[name],
            getter =function (prop) {
                return maruo.css(node,prop,true);
            };
        witch.forEach(function (d) {
            if (extra < 1) {
                val -= getter('padding' + d);
            }
            if (extra < 2) {
                val -= getter('border' + d + 'Width');
            }
            if (extra === 3) {
                val += getter('margin' + d);
            }
            //用于set宽高时对box-sizing的处理
            if (extra === 'padding-box') {
               val += getter('padding' + d);
            }
            if (extra === 'border-box') {
                val += getter('padding' + d);
                val += getter('border' + d + 'Width');
            }
        });

    }
    
    function getWH(node, name, extra) { //name首字母大写
        var hidden = [];
        collectHiddenAndShow(node, hidden);
        var val = correctWH(node, name, node['offset'+name], extra);
        //还原测量样式
        for (var i = 0, obj; obj = hidden[i++]; ) {
            node = obj.node;
            for (name in obj) {
                if (typeof obj[name] === 'string') {
                    node.style[name] = obj[name];
                }
            }
        }
        return val;
    }

    //=========================　处理　width, height, innerWidth, innerHeight, outerWidth, outerHeight　========
    'Height,Width'.replace(rword, function (name) {
        var lower = name.toLowerCase(),
            clientProp = 'client' + name,
            offsetProp = 'offset' + name,
            scrollProp = 'scroll' + name;
        maruo.cssHooks[lower + ':get'] = function (node) {
            return getWH(node, name, 0) + 'px';
        };
        maruo.cssHooks[lower + ':set'] = function (node, nick, value) {
            var boxSizing = maruo.css(node,'box-sizing');
            node.style[nick] = box === 'content-box' ? value : correctWH(node, name, parseFloat(value), boxSizing) + 'px';
        };
        'no_0,inner_1,outer_2'.replace(rmapper,function (a, b, num) {
            var method = b === 'no' ? lower : b + name;
            maruo[method] = function (node,value) {
                num = b === 'outer' && value === true ? 3 : Number(num);
                value - typeof value === 'boolean' ? void 0 : value;
                if (value === void 0) {
                    if (maruo.type(node,'Window')) {
                        //取得窗口尺寸,IE9后可以用node.innerWidth /innerHeight代替
                        return node['inner' + name] || node.document.documentElement[clientProp];
                    }
                    if (node.nodeType === 9) {
                        var doc = node.documentElement;
                       return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp]);
                    }
                    return getWH(node, name, num);
                } else {
                    maruo.css(node,lower,value);
                }
            }
        })

    });

    var shadowRoot, shadowDoc, shadowWin, reuse;
    function applyShadowDOM(callback) {
        if (!shadowRoot) {
            shadowRoot = doc.createElement('iframe');
            shadowRoot.style.cssText = 'width:0;height:0;border:0 none;';
        }
        root.appendChild(shadowRoot);
        if(!reuse) { //firefox, safari, chrome不能重用shadowDoc,shadowWin
            shadowWin = shadowRoot.contentWindow;
            shadowDoc = shadowWin.document;
            shadowDoc.write("<!doctype html><html><body>");
            shadowDoc.close();
            reuse = window.VBArray || window.opera; //opera9-12, ie6-10有效
        }
        callback(shadowWin, shadowDoc, shadowDoc.body);
        setTimeout(function () {
            root.removeChild(shadowRoot);
        },1000);
    }
    
    
    
    var _scrollBarWidth = 0; // 记录scrollBar的宽度
    var _displayCache = maruo.oneObject('a,abbr,b,span,strong,em,font,i,kbd', 'inline');
    var _blocks = maruo.oneObject('div,h1,h2,h3,h4,h5,h6,section,p', 'block');
    maruo.mix(_displayCache,_blocks);

    maruo.mix(maruo, {
        parseDisplayDefault: function (nodeName) {
            nodeName = nodeName.toLowerCase();
            if (!_displayCache[nodeName]) {
                applyShadowDOM(function (win, doc, body, val) {
                    var node = doc.createElement(nodeName);
                    body.appendChild(node);
                    if (win.getComputedStyle) {
                        val = win.getComputedStyle(node,null).display;
                    } else {
                        val = node.currentStyle.display;
                    }
                    _displayCache[nodeName] = val;
                })
            }
            return _displayCache[nodeName];
        },
        css: function (node, name, value) {
            if (node instanceof maruo) {
                node = node[0];
            }
            var prop = /[_-]/.test(name) ? camlizeStyleName(name) : name,fn;
            name = maruo.cssName(name) || prop;
            if (value === void 0 || typeof value === 'boolean') {
                fn = cssHooks[prop + ':get'] || cssHooks['@:get'];
                if (name === 'background') {
                    name = 'backgroundColor';
                }
                var ret = fn(name);
                return typeof value === 'boolean' ? parseFloat(ret) || 0 : ret;
            } else if (value === '') {
                //清除样式
                node.style[name] = '';
            } else {
                if (value === null || value !== value) {
                    return;
                }
                if (isFinite(value) && !maruo.cssNumber[prop]) {
                    value += "px"
                }
                fn = cssHooks[prop + ':set'] || cssHooks['@:set'];
                fn(node, name, value);
            }

        },
        offset: function (node, value) {
            if (value && value.left && value.top) {
               setOffset(node, value); 
            }
            var box = {
                top: 0,
                left: 0
            };
            if (!node || !node.tagName || !node.ownerDocument) {
                return box;
            }
            var doc = node.ownerDocument,
                body = doc.body,
                root = doc.documentElement,
                win = doc.defaultView || doc.parentWindow;
            if(!maruo.contains(root,node)){
                return box;
            }
            if(node.getBoundingClientRect){
                box = node.getBoundingClientRect();
            }
            var clientTop = root.clientTop || body.clientTop,
                clientLeft = root.clientLeft || body.clientLeft,
                scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
                scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft);
            return {
                left : box.left - clientLeft + scrollLeft,
                top: box.top - clientTop + scrollTop
            }
        },
        ////如果元素被移出DOM树，或display为none，或作为HTML或BODY元素，或其position的精确值为fixed时，返回null
        offsetParent: function (node) {
            var el = node.offsetParent;
            while (el && maruo.css(el, 'position') === 'static') {
                el = el.offsetParent;
            }
            return el || root;
        },
        //取得相对于offsetParent的偏移
        position: function (node) {
            var offset,
                parentOffset = {
                    top:0,
                    left:0
                };
            if (!node) {
               return;
            }
            if (maruo.css(node,'postion') === 'fixed') {
                offset = node.getBoundingClientRect()
            } else {
                offset = maruo.offset(node);
                var offsetParent = maruo.offsetParent(node);
                if (offsetParent.tagName.toLowerCase() !== 'html') {
                   parentOffset = maruo.offset(offsetParent);
                }
                parentOffset.top += maruo.css(offsetParent, 'borderTopWidth', true);
                parentOffset.left += maruo.css(offsetParent, 'borderLeftWidth', true);
            }
            return {
                top: offset.top - parentOffset.top - maruo.css(node,'marginTop', true),
                left: offset.left - parentOffset.left - maruo.css(node, 'marginLeft', true)
            }
        },
        getScrollBarWidth: function (recal) {
            if (!_scrollBarWidth || recal) {
                var div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.left = '-9999px';
                div.style.width = '50px';
                div.style.height = '50px';
                div.style.overflow = 'scroll';
                doc.body.appendChild(div);
                _scrollBarWidth = div.offsetWidth - div.clientWidth;
                doc.body.removeChild(div);
            }
            return _scrollBarWidth;
        }
    });

    function setOffset(node, options) {
        if (node && node.nodeType === 1) {
            var position = maruo.css(node, 'position');
            if (position === 'static') {
                node.style.position = 'relative';
            }
            var offset = maruo.offset(node),
                top = maruo.css(node,'top'),
                left = maruo.css(node,'left'),
                needCalPos = (position === 'absolute' || position === 'fixed') && [top, left].indexOf('auto') > -1,
                retTop,retLeft;
            if (needCalPos) {
                var curPosition = maruo.position(node);
                retLeft = curPosition.left;
                retTop = curPosition.top;
            } else {
                retLeft = parseFloat(left) || 0;
                retTop = parseFloat(top) || 0;
            }
            if (parseFloat(options.left)) {
                retLeft = options.left - offset.left + retLeft;
            }
            if (parseFloat(options.top)) {
                retTop = options.top - offset.top + retTop;
            }
            maruo.css(node,'left',retLeft);
            maruo.css(node,'top',retTop);
        }
    }

    
    'scrollLeft_pageXOffset,scrollTop_pageYOffset'.replace(rmapper,function (_,method,prop) {
        maruo[method] = function (node, val) {
            var win = domHelper.getWindow(node),
                top = method === 'scrollTop';
            if (val === void 0) {
               if (!node) {
                   return null;
               }
                return win ? (prop in win) ? win[prop] : win.document.documentElement[method] : node[method];
            }
            if (win) {
                win.scrollTo(!top?val:maruo.scrollLeft(node),top?val:maruo.scrollTop(node));
            } else {
                node[method] = val;
            }
        }
    });

    maruo.mix(maruo.fn,{
        attr: function (name, value) {
            if (arguments.length === 2) {
                this[0].setAttribute(name, value);
                return this;
            }
            return this[0].getAttribute(name);
        },
        css: function (name, value) {
            if (maruo.isPlainObject(value)) {
                for (var i in name) {
                    maruo.css(this, name, value);
                }
            } else {
                var ret = maruo.css(this, name, value);
            }
            return ret !== void 0 ? ret : this;
        },
        position: function () {
            return maruo.position(this[0])
        },
        offsetParent: function () {
            var el = maruo.offset(this[0])
            return maruo(el)
        }
    });

    /*********************************************************************
     *                    #Attr & Val                                    *
     *********************************************************************/
    var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
    var valHooks = {
        //在IE11及W3C，如果没有指定value，那么node.value默认为node.text（存在trim作），但IE9-10则是取innerHTML(没trim操作)
        'option:get': function (node) {
            if(node.hasAttributes()){
                return node.hasAttributes('value') ? node.value : node.text.trim();
            }
            //specified并不可靠，因此通过分析outerHTML判定用户有没有显示定义value
            return roption.test(node.outerHTML) ? node.value : node.text.trim();
        },
        'select:get': function (node) {
            //显示声明多选:multiple, node.selectedIndex返回第一个
            //当没有option时,index == -1
            var options = node.options,
                index = node.selectedIndex,
                getter = valHooks['option:get'],
                one = node.type === 'select-one' || index < 0,
                max = one ? index + 1 : options.length,
                values = one ? null : [],
                i = index < 0 ? max : one ? index : 0,
                option,val;

            for (; i<max; i++) {
                option = options[i];
                //旧式IE在reset后不会改变selected，需要改用i === index判定
                //我们过滤所有disabled的option元素，但在safari5下，如果设置select为disable，那么其所有孩子都disable
                //因此当一个元素为disable，需要检测其是否显式设置了disable及其父节点的disable情况
                if ((option.selected || i === index) && !option.disabled) {
                    val = getter(option);
                    if (one) {
                        return val;
                    }
                    values.push(val);
                }
            }
            return values;
        },
        'select:set': function (node, val) {
            val = [].concat(val);
            var getter = valHooks['option:get'],
                optionSel, i = 0, el;
            for (; el = node.options[i++];) {
                if ((el.selected = val.indexOf(getter(el)) > -1)) {
                    optionSel = true;
                }
            }
            if(!optionSel){
                node.selectedIndex = -1;
            }
        }
    };
    
    if (!maruo.support.checkOn) {
        valHooks['checked:get'] = function (node) {
            return node.getAttribute('value') === null ? 'on' : node.value
        }
    }
    
    valHooks['checked:set'] = function (node, name, value) {
        if (Array.isArray(value)) {
            return node.checked == !!~value.indexOf(node.value);
        }
    };
    

    function getValType(node) {
        var ret = node.tagName.toLowerCase();
        return ret === 'input' && /checkbox|radio/.test(node.type) ? 'checked' : ret;
    }
    maruo.mix({
        /**
         * 判断是否是自定义属性
         * @param attr
         * @param host
         * @returns {boolean}
         */
        isAttribute: function (attr, host) {
            //有些熟悉是特殊元素才有的,需要用到第二个参数
            host = host || cinerator;
            return host.getAttribute(attr) === null && host[attr] === void 0;
        }
    });

    maruo.mix(maruo.fn,{
        attr: function (name, val) {
            if (arguments.length === 2) {
                this[0].setAttribute(name, val);
                return this;
            }
            return this[0].getAttribute(name);
        },
        val: function (value) {
            var node = this[0];
            if (node && node.nodeType === 1) {
                var get = arguments.length === 0;
                var access = get ? ":get" : ":set";
                var fn = valHooks[getValType(node) + access];
                if (fn) {
                    var val = fn(node, value);
                } else  if (get) {
                    return (node.value || "").replace(/\r/g,'');
                } else {
                    node.value = value;
                }
            }
            return get ? val : this;
        }
    });

    /*********************************************************************
     *                    #Event                                         *
     *********************************************************************/
    var rmouseEvent = /^(?:mouse|contextmenu|drag)|click/;
    function fixEvent(event) {
        var ret = {};
        for (var i in event) {
            ret[i] = event[i];
        }
        var target = ret.target = event.srcElement;
        if (event.type.indexOf('key') === 0) {
            ret.which = event.charCode != null ? event.charCode : event.keyCode;
        } else if (rmouseEvent.test(event.type)) {
            var _doc = target.ownerDocument || doc;
            var box = _doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;
            ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
            ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
            ret.wheelDeltaY = ret.wheelDelta
            ret.wheelDeltaX = 0
        }
        ret.timeStamp = new Date() - 0
        ret.originalEvent = event
        ret.preventDefault = function () { //阻止默认行为
            event.returnValue = false
        };
        ret.stopPropagation = function () { //阻止事件在DOM树中的传播
            event.cancelBubble = true
        };
        return ret;
    }
    
    var eventHooks = [];

    maruo.mix(maruo, {
        eventHooks: eventHooks,

        bind:function (el, type, fn, phase) {
            var hooks = maruo.eventHooks,
                hook = hooks[type];
            if (typeof hook === 'object') {
                type = hook.type || type;
                phase = hook.phase || !!phase;
                fn = hook.fn ? hook.fn(el,fn) : fn;
            }
            var callback = w3c? fn : function (e) {
                fn.call(el, fixEvent(e))
            };
            if (w3c) {
                el.addEventListener(type, callback, phase);
            } else {
                el.attachEvent('on' + type, callback);
            }
        },

        unbind: function (el, type, fn, phase) {
            var hooks = maruo.eventHooks,
                hook = hooks[type];
            var callback = fn || noop;
            if (typeof hook === 'object') {
                type = hook.type || type;
                phase = hook.phase || !!phase;
            }
            if (w3c) {
                el.removeEventListener(type,callback,phase);
            } else {
                el.detachEvent('on' + type, callback);
            }
        }
    });


    /*********************************************************************
     *                    #MVVM                                          *
     *********************************************************************/

    var vms = maruo.vms = {};
    maruo.define = function (id,factory) {
        var $id = id.$id || id;
        if (!$id) {
           log('waring: vm必须指定$id');
        }
        if (vms[$id]) {
           log.('warning:' + $id + '已经存在于vms中')
        }
        var model;
        if (typeof id === 'object') {
           model = modelFactory(id);
        } else {
            var scope = {
                $watch: noop
            };

            factory.call(scope,scope);
            model = modelFactory(scope);
        }
        model.$id = $id;
        return vms[$id] = model;
    };
    
    function modelFactory(scope) {
        
    }




    /*********************************************************************
     *                    #DOM Ready                                     *
     *********************************************************************/

    
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
