const Util = {
    /**
     * 判断是否为字符串
     * 
     * @param {any} str 
     * @returns {String}
     */
    isString (str) {
        return Object.prototype.toString.call(str) === '[object String]'
    },
    /**
     * 判断是否为数字
     * 
     * @param {any} num 
     * @returns {Number}
     */
    isNumber (num) {
        return Object.prototype.toString.call(num) === '[object Number]'
    },
    /**
     * 判断是否为数组
     * 
     * @param {any} arr 
     * @returns {Array}
     */
    isArray (arr) {
        return Array.isArray(arr)
    },
    /**
     * 判断是否为对象
     * 
     * @param {any} obj 
     * @returns {Object}
     */
    isObject (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]'
    },
    /**
     * 判断是否为函数
     * 
     * @param {any} fun 
     * @returns {Function}
     */
    isFunction (fun) {
        return Object.prototype.toString.call(fun) === '[object Function]'
    }
}

export default Util