/**
 * Created by cgspine on 16/7/21.
 */
import ready from './ready'
import scan from './scan'


export default function mixinDom(maruo) {
    ready(function () {
        scan(document.body, maruo)
    })
    maruo.scan = scan
}