'use strict'
/**
 * provide some function helpers
 */
const Util = {
    /**
     * judge is a string
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isString (arg) {
        return typeof arg === 'string'
    },
    /**
     * judge is a number
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNumber (arg) {
        return typeof arg === 'number'
    },
    /**
     * judge is a array
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isArray (arg) {
        return Array.isArray(arg)
    },
    /**
     * judge is a object
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isObject (arg) {
        return Object.prototype.toString.call(arg) === '[object Object]'
    },
    /**
     * judge is a function
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isFunction (arg) {
        return typeof arg === 'function'
    },
    /**
     * judge is null
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNull (arg) {
        return arg === null
    },
    /**
     * test is arg not a empty string,
     * when arg is null or undefined, return false
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNotEmptyString (arg) {
        if (Util.isString(arg) && arg.trim().length > 0) {
            return true
        } else {
            return false
        }
    },
    /**
     * concat all parameters to string,
     * when some parameter is null or undefined, not concat them
     * 
     * @param {any} arg 
     * @returns {String}
     */
    concatString () {
        const args = [...arguments]
        return args.reduce((prev, curr) => {
            if (curr) {
                return prev + curr
            }
            return prev
        }, '')
    }
}

export default Util