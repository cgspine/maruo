/**
 * Created by cgspine on 16/7/23.
 */

import Cache from '../cache'
import config from '../config'
import { warn, noop } from '../util'

const exprCachePool = new Cache(1000)

const allowedKeywords =
    'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
    'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
    'encodeURIComponent,parseInt,parseFloat'
const rallowedKeywords =
    new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')

// keywords that don't make sense inside expressions
const improperKeywords =
    'break,case,class,catch,const,continue,debugger,default,' +
    'delete,do,else,export,extends,finally,for,function,if,' +
    'import,in,instanceof,let,return,super,switch,throw,try,' +
    'var,while,with,yield,enum,await,implements,package,' +
    'protected,static,interface,private,public'
const rimproperKeywords =
    new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')

const rws = /\s/g
const rnewline = /\n+/g
const rsave = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g
const rrestore = /"(\d+)"/g
const rpathTest = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
const rbooleanLiteral = /^(?:true|false)$/
const rident = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g


export function parseExpr(str, needSet) {
    str = str.trim()
    var hit = exprCachePool.get(str)
    if(hit){
        return hit
    }
    var ret = {
        expr: str,
        getter: isSimplePath(str) && str.indexOf('[') < 0
        ? makeGetterFn('scope.' + str)
            : compileGetter(str)
    }

    if(needSet){
        ret.setter = compileSetter(str)
    }

    exprCachePool.put(str, ret)

    return ret
}


function compileSetter (str) {
    if(isSimplePath(str) && str.indexOf('[') < 0) {
        try {
            return new Function('scope', 'val', 'scope.' + str + ' = val;')
        } catch (e) {
            config.debug && warn(
                'Invalid setter expression:  ' + expr
            )
        }
    }
    return noop
}

function makeGetterFn (body) {
    try {
        return new Function('scope', 'return ' + body + ';')
    } catch (e) {
        config.debug && warn(
            'Invalid expression. ' +
            'Generated function body: ' + body
        )
    }
}

/// 对于语言里的保留字、数字、字符串,不能加'scope.',需要先保存再还原

var saved = []

function restore (str, i) {
    return saved[i]
}


function save(str, isString) {
    var i = saved.length
    saved[i] = isString
        ? str.replace(rnewline, '\\n')
        : str
    return '"' + i + '"'
}


// 加'scope.'重写
function rewrite (raw) {
    var c = raw.charAt(0)
    var path = raw.slice(1)
    if (rallowedKeywords.test(path)) {
        return raw
    } else {
        path = path.indexOf('"') > -1
            ? path.replace(rrestore, restore)
            : path
        return c + 'scope.' + path
    }
}


function compileGetter (exp) {
    if (rimproperKeywords.test(exp)) {
        config.debug && warn('Avoid using reserved keywords in expression: ' + exp)
    }
    saved.length = 0
    var body = exp
        .replace(rsave, save)
        .replace(rws, '')
    body = (' ' + body)
        .replace(rident, rewrite)
        .replace(rrestore, restore)
    return makeGetterFn(body)
}


export function isSimplePath (exp) {
    return rpathTest.test(exp) &&
        // don't treat true/false as paths
        !rbooleanLiteral.test(exp) &&
        // Math constants e.g. Math.PI, Math.E etc.
        exp.slice(0, 5) !== 'Math.'
}