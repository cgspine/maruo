/**
 * Created by cgspine on 16/9/4.
 */
import { ajax } from './ajax'

export default function mixinAjax(maruo) {
    maruo.ajax = ajax
}