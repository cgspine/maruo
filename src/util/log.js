/**
 * Created by cgspine on 16/7/9.
 */
import config from '../config'

export function log() {
    if (config.debug) {
        console.log(arguments)
    }
}

export function warn() {
    if (config.debug) {
        console.warn(arguments)
    }
}

export function err() {
    if (config.debug) {
        console.error(arguments)
    }
}