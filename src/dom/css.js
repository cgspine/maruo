/**
 * Created by cgspine on 16/8/2.
 */
import { hasOwn, rword, camelize, hyphenate, each, oneObject } from '../util'
import browser from '../dom/browser'

/*********************************************************************
 *                        CSS Hooks                                  *
 *********************************************************************/
var cssHooks = {
    "@:set": function (node, name, value) {
        node.style[name] = value
    },
    "@:get": function (node, name) {
        if (!node || !node.style) {
            throw new Error("getComputedStyle要求传入一个节点 " + node)
        }
        var ret, computed = browser.window.getComputedStyle(node)
        if (computed) {
            //IE9下"filter"只能通过getPropertyValue取值.https://github.com/jquery/jquery/commit/9ced0274653b8b17ceb6b0675e2ae05433dcf202
            ret = name === "filter" ? computed.getPropertyValue(name) : computed[name]
            if (ret === "") {
                ret = node.style[name] //一些浏览器需要我们手动取内联样式
            }
        }
        return ret
    }
};

cssHooks["opacity:get"] = function (node) {
    var ret = cssHooks["@:get"](node, "opacity")
    return ret === "" ? "1" : ret
}

"top,left".replace(rword, function (name) {
    cssHooks[name + ":get"] = function (node) {
        var computed = cssHooks["@:get"](node, name)
        return /px$/.test(computed) ? computed : position(node)[name] + "px"
    }
})

export const WH = {
    
}
each({
    Width: 'width',
    Height: 'height'
}, function (name, method) {
    var clientProp = 'client' + name,
        scrollProp = 'scroll' + name,
        offsetProp = 'offset' + name
    cssHooks[method + ":get"] = function (node, which, override) {
        var boxSizing = -4
        if (typeof override === "number") {
            boxSizing = override
        }
        which = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"]
        var ret = node[offsetProp] // border-box 0
        if (boxSizing === 2) { // margin-box 2
            return ret + css(node, "margin" + which[0], true) + css(node, "margin" + which[1], true)
        }
        if (boxSizing < 0) { // padding-box  -2
            ret = ret - css(node, "border" + which[0] + "Width", true) - css(node, "border" + which[1] + "Width", true)
        }
        if (boxSizing === -4) { // content-box -4
            ret = ret - css(node, "padding" + which[0], true) - css(node, "padding" + which[1], true)
        }
        return ret
    }

    cssHooks[method + "&get"] = function (node) {
        var hidden = []
        showHidden(node, hidden)
        var val = cssHooks[method + ":get"](node)
        for (var i = 0, obj; obj = hidden[i++]; ) {
            node = obj.node
            for (var n in obj) {
                if (typeof obj[n] === "string") {
                    node.style[n] = obj[n]
                }
            }
        }
        return val
    }
    WH[method] = function (val) {
        var node = this[0]
        if (arguments.length === 0) {
            if (node.setTimeout) { // window, IE9+后可以用node.innerWidth /innerHeight代替
                return node["inner" + name]
            }
            if (node.nodeType === 9) { // document, 页面
                var doc = node.documentElement
                // offsetWidth:
                // IE、Opera认为 offsetWidth = clientWidth + 滚动条 + 边框
                // NS、FF认为OffsetWidth为网页内容的实际宽度,可以小于页面宽度

                // scrollWidth:
                // IE、Opera认为scrollWidth为网页内容的实际宽度,可以小于clientWidth
                // NS、FF认为scrollWidth为网页内容宽度,不过最小值为clientWidth

                // FF chrome    html.scrollHeight< body.scrollHeight
                // IE 标准模式 : html.scrollHeight> body.scrollHeight
                return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
            }
            return cssHooks[method + "&get"](node)
        } else {
            return this.css(method, val)
        }
    }

    WH["inner" + name] = function () {
        return cssHooks[method + ":get"](this[0], void 0, -2)
    }
    WH["outer" + name] = function (includeMargin) {
        return cssHooks[method + ":get"](this[0], void 0, includeMargin === true ? 2 : 0)
    }
})

var cssMap = {
    'float' : 'cssFloat'
};

// Swappable if display is none or starts with table
// except "table", "table-cell", or "table-caption"
// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
var rdisplayswap = /^(none|table(?!-c[ea]).+)/

var cssShow = { position: "absolute", visibility: "hidden", display: "block" }

function showHidden(node, array) {
    //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
    if (node.offsetWidth <= 0) { //opera.offsetWidth可能小于0
        var styles = getComputedStyle(node, null)
        if (rdisplayswap.test(styles["display"])) {
            var obj = {
                node: node
            }
            for (var name in cssShow) {
                obj[name] = styles[name]
                node.style[name] = cssShow[name]
            }
            array.push(obj)
        }
        var parent = node.parentNode
        if (parent && parent.nodeType === 1) {
            showHidden(parent, array)
        }
    }
}

//这里的属性不需要自行添加px
var cssNumber = oneObject("animationIterationCount,columnCount,fillOpacity,fontSizeAdjust,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom,rotate,flexGrow,flexShrink,order");

var transitionPropertiesEndAndPrefix = (function(){
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
            if(browser.singletonDiv.style[vender+'TransitionProperty'] !== void 0){
                prefix = '-'+vender.toLowerCase()+'-';
                endEvent = transitions[vender];
                break;
            }
        }
    }

    if(!endEvent && browser.singletonDiv.style.transitionProperty !== void 0){
        endEvent = 'transitionend';
    }
    return {
        end:endEvent,
        prefix:prefix
    }
})();

export const transitionEndEventName = transitionPropertiesEndAndPrefix.end


var prefixes = [''];
var prefix = transitionPropertiesEndAndPrefix.prefix;
if(prefix !== ''){
    prefixes.push(prefix);
}

/**
 * 将css的name转换为js的表现形式
 * @param name
 * @param host
 * @returns {*}
 */
function cssName(name, host) {
    if(cssMap[name]){
        return cssMap[name];
    }
    host = host || browser.root.style;
    for (var i = 0, n = prefixes.length,camelCase; i < n; i++){
        camelCase = camlizeStyleName(prefix + name);
        if (camelCase in host) {
            return (cssMap[name] = camelCase);
        }
    }
    return null;
}

/**
 * position适用于取得相对于offsetParent的偏移量
 * @param el
 * @returns {*}
 */
export function position(el) {
    var parentOffset = { left : 0, top: 0 },
        _offset, _offsetParent
    if (!el) {
        return parentOffset
    }
    if (css(el,'position') === 'fixed') {
        //getBoundingClientRect返回值是一个DOMRect对象,其top、left值是相对于视口的,因此只有fixed可以采用这个
        _offset = el.getBoundingClientRect()
    } else {
        _offsetParent = offsetParent(el) // Get *real* offsetParent
        _offset = offset(el) // Get correct offsets
        if (_offsetParent.tagName !== "HTML") {
            parentOffset = offset(_offsetParent)
        }
        parentOffset.top += css(_offsetParent, "borderTopWidth", true)
        parentOffset.left += css(_offsetParent, "borderLeftWidth", true)
    }
    // Subtract parent offsets and element margins
    return {
        top: _offset.top - parentOffset.top - css(el, "marginTop", true),
        left: _offset.left - parentOffset.left - css(el, "marginLeft", true)
    }
}

/**
 * 获取元素到document.documentElement的offset
 * @param el
 * @returns {*}
 */
export function offset(el) { //取得距离页面左右角的坐标
    if ( !el.getClientRects().length ) {
        return { top: 0, left: 0 };
    }

    var rect = el.getBoundingClientRect();

    // Make sure element is not hidden (display: none)
    if ( rect.width || rect.height ) {
        var doc = el.ownerDocument;
        var root =  doc.documentElement
        var win = doc.defaultView
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
export function offsetParent(el) {
    // 在 Webkit 中，如果元素为隐藏的（该元素或其祖先元素的 style.display 为 "none"），或者该元素的 style.position 被设为 "fixed"，则该属性返回 null。
    // 在 IE 9 中，如果该元素的 style.position 被设置为 "fixed"，则该属性返回 null。（display:none 无影响。）
    var offsetParent = el.offsetParent
    while (offsetParent && css(offsetParent, "position") === "static") {
        offsetParent = offsetParent.offsetParent
    }
    return offsetParent || root
}

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

export function css(el, name, value) {
    if (el.nodeType !== 1) {
        return
    }
    var prop = camelize(name)
    name = cssName(prop) || prop
    var fn
    if (value === void 0 || typeof value === 'boolean') { // 读取样式
        fn = cssHooks[prop+ ':get'] || cssHooks['@:get']
        if (name === 'background') {
            name = 'backgroundColor'
        }
        var val = fn(el, name)
        return value === true ? parseFloat(val) || 0 : val
    } else if (value === '') {  // 清除样式
        node.style[name] = ''
    } else {  // 设置样式
        if (value == null || value !== value) {
            return
        }
        if (isFinite(value) && !cssNumber(prop)) {
            value += 'px'
        }
        fn = cssHooks[prop + ':set'] || cssHooks['@:set']
        fn(el, name, value)
    }
}

function getWindow(node) {
    return node.window || node.defaultView || false
}

export const scroll = {}

each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
}, function (method, prop) {
    scroll[method] = function (val) {
        var node = this[0] || {},
            win = getWindow(node),
            top = method === "scrollTop"
        if (!arguments.length) {
            return win ? win[prop] : node[method]
        } else {
            if (win) {
                win.scrollTo(!top ? val : win[prop], top ? val : win[prop])
            } else {
                node[method] = val
            }
        }
    }
})