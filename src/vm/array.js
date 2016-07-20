/**
 * Created by cgspine on 16/7/19.
 */
import { rword } from '../util/const'
import { Observable } from  './observable'

const arrayProto = Array.prototype

export const arrayMethods = Object.create(arrayProto)

'push,pop,shift,unshift,splice,sort,reverse'.replace(rword, function (method) {
    var origin = arrayProto[method]
    Object.defineProperty(arrayMethods, method, {
        value:function () {
            var i = arguments.length
            var args = new Array(i)
            while (i--) {
                args[i] = arguments[i]
            }

            var ob = this.__ob__
            //只处理Observable对象上的调用
            if(!ob){
                return origin.apply(this,args)
            }

            var size = this.length
            var self = this
            var result = origin.apply(this, args)
            var inserted
            switch(method){
                case 'push':
                    inserted = args
                case 'unshift':
                    inserted = args
                case 'splice':
                    inserted = args.slice(2)
            }
            if (inserted) {
                inserted.forEach(function (el) {
                    var index = self.indexOf(el)
                    ob.arrayAdapter(el, index)
                })
            }
            if(this.length != size) {
                ob.root.$emit(ob.spath.length > 0 ? ob.spath + '.length' : 'length', size, this.length)
            }
            ob.root.$emit(ob.spath)
            return result
        },
        writable:true,
        enumerable: false,
        configurable: false
    })

})

Object.defineProperty(arrayMethods, '$get', {
    value: function (index) {

        var item = this[index]
        if(item.__ob__){
            return item.__ob__.__data__
        }
        return item
    },
    writable:true,
    enumerable: false,
    configurable: false
})

Object.defineProperty(arrayMethods, '$set', {
    value: function (index , value) {
        this.splice(index,1, value)
    },
    writable:true,
    enumerable: false,
    configurable: false
})

