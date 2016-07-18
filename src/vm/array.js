/**
 * Created by cgspine on 16/7/19.
 */
import { rword } from '../util/const'

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
            var data = this.__data__
            var root = this.root
            var result = origin.apply(data,args)
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
                this.observeArray(inserted)
            }
            root.$emit(this.spath)
            return result
        },
        writable:true,
        enumerable: false,
        configurable: false
    })

})