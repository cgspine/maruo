/**
 * Created by cgspine on 16/8/9.
 */
import { attr } from './attr'
import { trim, isArrayLike } from '../util'
import support from './support'

var rspaces = /[\x20\t\r\n\f]+/g


export function getValType(el) {
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
        var value, option, i,
            options = node.options,
            index = node.selectedIndex,
            one = node.type === "select-one",
            values = one ? null : [],
            max = one ? index + 1 : options.length;

        if ( index < 0 ) {
            i = max;

        } else {
            i = one ? index : 0;
        }

        // Loop through all the selected options
        for ( ; i < max; i++ ) {
            option = options[i];

            // Support: IE <=9 only
            // IE8-9 doesn't update selected after form reset
            if ((option.selected || i === index ) &&
                // Don't return options that are disabled or in a disabled optgroup
                !option.disabled &&
                (!option.parentNode.disabled ||
                option.parentNode.nodeName.toLowerCase() === 'optgroup')) {

                // Get the specific value for the option
                value = val(option);

                // We don't need an array for one selects
                if ( one ) {
                    return value;
                }

                // Multi-Selects return an array
                values.push( value );
            }
        }

        return values;
    },
    'select:set': function (node, values) {
        if (isArrayLike(values)){
            values = [].slice.call(values)
        } else {
            values = [values + '']
        }
        var options = node.options,
            i = options.length,
            el,
            optionSet

        while (i--) {
            el = options[i];
            if (el.selected = values.indexOf(val(el)) > -1) {
                console.log(val(el))
                optionSet = true;
            }
        }
        if ( !optionSet ) {
            node.selectedIndex = -1;
        }
        return values;
    },

    'checked:set': function (node,values) {
        if (isArrayLike(values)){
            values = [].slice.call(values)
        } else {
            values = [values + '']
        }
       
        return node.checked = (values.indexOf(val(node)) > -1)
    }
}

if (support.checkOn) {
    valHooks['checked:get'] = function (node) {
        return node.getAttribute("value") === null ? "on" : node.value;
    }
}

export function val(node, value) {
    if (node && node.nodeType === 1) {
        var get = arguments.length === 1
        var access = get ? ':get' : ':set'
        var fn = valHooks[getValType(node) + access]
        if (fn) {
            var val = fn(node, value)
        } else if (get) {
            return (node.value || '').replace(/\r/g, '')
        } else {
            node.value = value
        }
    }
    return val
}