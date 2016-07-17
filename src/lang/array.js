/**
 * Created by cgspine on 16/7/18.
 */

var arrProto = Array.prototype

Array.prototype.contain = function(el){
    return this.indexOf(el) !== -1
}

Array.prototype.ensure =function(el){
    if (!this.contain(el)) {
        this.push(el)
    }
}