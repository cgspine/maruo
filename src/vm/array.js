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

            var ob = this.__ob__
            //只处理Observable对象上的调用
            if(!ob){
                return origin.apply(this,args)
            }

            var size = this.length
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
                ob.observeArray(inserted)
            }
            if(this.length != size) {
                ob.root.$emit(ob.spath.length > 0 ? ob.spath + '.length' : 'length', size, this.length)
            }
            ob.root.$emit(this.spath)
            return result
        },
        writable:true,
        enumerable: false,
        configurable: false
    })

})