import {camelize, isEmptyObject} from "./util";

export default function mixinData(maruo) {
    maruo.data = new Data()

}

function Data() {
    this.expando = "maruo" + (new Date() - 0);
}

Data.uid = 1;

Data.prototype = {
    cache: function (owner) {
        let value = owner[this.expando]
        if (!value) {
            value = {}
            if (acceptData(owner)) {
                if (owner.nodeType) {
                    owner[this.expando] = value
                } else {
                    Object.defineProperty(owner, this.expando, {
                        value: value,
                        configurable: true
                    })
                }
            }
        }
        return value
    },
    set: function (owner, key, val) {
        var cache = this.cache(owner)
        if (typeof key === 'string') {
            cache[camelize(key)] = val
        } else {
            for (var prop in key) {
                cache[camelize(prop)] = key[prop]
            }
        }
        return cache
    },
    get: function (owner, key) {
        if (key === undefined) {
            return this.cache(owner)
        }
        return owner[this.expando] && owner[this.expando][camelize(key)]
    },

    access: function (owner, key, val) {
        if (key === undefined || ((key && typeof key === "string") && val === undefined )) {
            return this.get(owner, key);
        }
        this.set(owner, key, val);
        return val
    },
    remove: function (owner, key) {
        var cache = owner[this.expando]
        if (cache === undefined) {
            return
        }
        if (key === undefined || isEmptyObject(cache)) {
            // Webkit & Blink performance suffers when deleting properties from DOM nodes, so set to undefined instead
            if (owner.nodeType) {
                owner[this.expando] = undefined
            } else {
                delete owner[this.expando]
            }
            return
        }
        if (Array.isArray(key)) {
            key = key.map(camelize)
        } else {
            key = camelize(key)
            key = key in cache ? [key] : []
        }
        var i = key.length
        while (i--) {
            delete cache[key[i]]
        }
    },
    hasData: function (owner) {
        var cache = owner[this.expando]
        return cache !== undefined && !isEmptyObject(cache)
    }
}

function acceptData(owner) {
    // Accepts only:
    //  - Node
    //    - Node.ELEMENT_NODE
    //    - Node.DOCUMENT_NODE
    //  - Object
    //    - Any
    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType )
}