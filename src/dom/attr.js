/**
 * Created by cgspine on 16/8/9.
 */
import support from './support'
import browser from './browser'

var rfocusable = /^(?:input|select|textarea|button)$/i,
    rclickable = /^(?:a|area)$/i
var propMap = {//不规则的属性名映射
    'accept-charset': 'acceptCharset',
    'char': 'ch',
    'charoff': 'chOff',
    'class': 'className',
    'for': 'htmlFor',
    'http-equiv': 'httpEquiv'
}
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
var bools = ['autofocus,autoplay,async,allowTransparency,checked,controls',
    'declare,disabled,defer,defaultChecked,defaultSelected,',
    'isMap,loop,multiple,noHref,noResize,noShade',
    'open,readOnly,selected'
].join(',')

bools.replace(/\w+/g, function (name) {
    propMap[name.toLowerCase()] = name
})

var anomaly = ['accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan',
    'dateTime,defaultValue,contentEditable,frameBorder,longDesc,maxLength,'+
    'marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'
].join(',')

anomaly.replace(/\w+/g, function (name) {
    propMap[name.toLowerCase()] = name
})

var pureDiv = browser.document.createElement('div')
export  function isAttr(name, host) {
    host = host || pureDiv
    return host.getAttribute(name) === null && host[name] === void 0
}

var cacheProp = {}
function defaultProp(node, prop) {
    var name = node.tagName + ":" + prop;
    if(name in cacheProp) {
        return cacheProp[name];
    }
    return cacheProp[name] = browser.document.createElement(node.tagName)[prop];
}

export function removeAttr(el, name) {
    if (name && el.nodeType === 1) {
        //小心contentEditable,会把用户编辑的内容清空
        if(typeof el[name] !== "boolean") {
            el.setAttribute(name, "");
        }
        el.removeAttribute(name);
        // 确保bool属性的值为bool
        if(el[name] === true) {
            el[name] = false;
        } 
    }
}

//只能用于HTML,元素节点的内建不能删除（chrome真的能删除，会引发灾难性后果），使用默认值覆盖
export function removeProp(el, name) {
    name = propMap[name.toLowerCase()] || name
    if(name && el.nodeType === 1) {
        el[name] = defaultProp(el, name);
    }else{
        el[name] = void 0;
    }
}

export function prop(el, name, value) {
    if(el.nodeType === 1) {
        name = propMap[name.toLowerCase()] || name;
    }
    var access = value === void 0 ? ":get" : ":set";
    return (propHooks[name + access] || propHooks["@" + access])(el, name, value);
}

export function attr(el, name, value) {
    // Don't get/set attributes on text, comment and attribute nodes
    var nType = el.nodeType;
    if ( nType === 3 || nType === 8 || nType === 2 ) {
        return;
    }

    if (el.getAttribute === void 0){
        return prop(el, name, value)
    }

    name = name.toLowerCase();
    var propName = propMap[name] || name
    var isBool = typeof el[propName] === "boolean" && typeof defaultProp(el, propName) === "boolean"; //判定是否为布尔属性

    if(value === null || value === false && isBool) {
        return removeAttr(el, name);
    }

    var access = value === void 0 ? ":get" : ":set";
    var type = '@'
    if(isBool) {
        type = '@bool'
        name = propName
    }
    return (attrHooks[name + access] || attrHooks[type + access])(el, name, value);
}

var attrHooks ={
    'type:set': function(el, name, value){
        if (!support.radioValue && value === 'radio' && el.nodeName === 'input') {
            var val = el.value
            el.setAttribute('type', value)
            if(val){
                el.value = val
            }
            return value
        }
        el.setAttribute('type', value)
    },
    'type:get': function (el) {
        var ret = el.getAttribute('type'),
            type
       if (ret === null && (type = el.type) !== void 0) {
           return type
       }
        return ret
    },
    '@:get': function (el,name) {
        var ret = el.getAttribute(name);
        return ret == null ? void 0 : ret;
    },
    '@:set': function (el,name, value) {
        el.setAttribute(name, value + '')
    },
    '@bool:get': function (el, name) {
        return node[name] ? name.toLowerCase() : void 0;
    },
    '@bool:set': function (el, name) {
        el.setAttribute(name, name.toLowerCase());
        el[name] = true;
    }
    
}

var propHooks = {
    // Support: IE <=9 - 11 only
    'tabIndex:get': function (node) {
        var tabIndex = node.tabIndex;
        if (tabIndex) {
          return parseInt(tabIndex, 10)
        }
        // http://javascript.gakaa.com/reset-tabindex.aspx
        return rfocusable.test(node.nodeName) || rclickable.test(node.nodeName) && node.href ? 0 : -1
    },
    '@:get':function (node, name) {
        return node[name]
    },
    '@:set': function (node, name, value) {
        node[name] = value
    }
}

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// safari IE9 IE8 我们必须访问上一级元素时,才能获取这个值
if (support.optSelectedDefault) {
    propHooks['selected:get'] = function (node) {
        for(var p = node; p && typeof p.selectedIndex !== "number"; p = p.parentNode) {}
        return node.selected;
    }
    
    propHooks['selected:set'] = function (el, node, value) {
        var parent = el.parentNode;
        if ( parent ) {
            parent.selectedIndex;

            if ( parent.parentNode ) {
                parent.parentNode.selectedIndex;
            }
        }
        el.node = value

    }
}
