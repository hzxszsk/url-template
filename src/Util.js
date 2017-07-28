'use strict'
const Util = {
    /**
     * 判断是否为字符串
     * 
     * @param {any} str 
     * @returns {Boolean}
     */
    isString (str) {
        return typeof str === 'string'
    },
    /**
     * 判断是否为数字
     * 
     * @param {any} num 
     * @returns {Boolean}
     */
    isNumber (num) {
        return typeof num === 'number'
    },
    /**
     * 判断是否为数组
     * 
     * @param {any} arr 
     * @returns {Boolean}
     */
    isArray (arr) {
        return Array.isArray(arr)
    },
    /**
     * 判断是否为对象
     * 
     * @param {any} obj 
     * @returns {Boolean}
     */
    isObject (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]'
    },
    /**
     * 判断是否为函数
     * 
     * @param {any} fun 
     * @returns {Boolean}
     */
    isFunction (fun) {
        return typeof fun === 'function'
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