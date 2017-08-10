'use strict'
const Util = {
    /**
     * 判断是否为字符串
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isString (arg) {
        return typeof arg === 'string'
    },
    /**
     * 判断是否为数字
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNumber (arg) {
        return typeof arg === 'number'
    },
    /**
     * 判断是否为数组
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isArray (arg) {
        return Array.isArray(arg)
    },
    /**
     * 判断是否为对象
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isObject (arg) {
        return Object.prototype.toString.call(arg) === '[object Object]'
    },
    /**
     * 判断是否为函数
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isFunction (arg) {
        return typeof arg === 'function'
    },
    /**
     * 判断是否为null
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNull (arg) {
        return arg === null
    }
}

export default Util