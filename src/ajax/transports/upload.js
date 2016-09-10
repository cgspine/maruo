/**
 * Created by cgspine on 16/9/10.
 */
import { each, mixin } from '../../util'
import xhr from './xhr'

var upload = {
    proprecess: function () {
        var opts = this.opts
        var formdata = new FormData(opts.form)
        each(opts.data, function (key, val) {
            formdata.append(key, val)
        })
        this.formdata = formdata;
    }
}
mixin(upload, xhr)

export default upload