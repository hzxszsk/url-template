'use strict'
import Util from './Util'
import Url from './Url'

/**
 * url-templater main class
 * 
 * @export
 * @class UrlTemplater
 */
export default class UrlTemplater {

    /**
     * create a url-template object
     * 
     * @param {String} url      url Template
     * @param {Object} options  constructor's option object, has attrs like UrlTemplater.DEFAULT_OPTIONS
     * @memberof UrlTemplate
     */
    constructor(url, options) {
        if (Util.isString(url)) {
            this.options = Object.assign({}, UrlTemplater.DEFAULT_OPTIONS, options)
            this.template = url
            this.templateObj = Url.parse(url)
        } else {
            throw new Error('parameter url must be a string!')
        }
    }

    /**
     * resolve url parameters and query parameters, and return a url result string
     * 
     * @param {Object} {
     *         params = {}  url parameters
     *         query = {}   query parameters
     *     } 
     * @returns {String}
     * @memberof UrlTemplate
     */
    resolve({
        params = {},
        query = {}
    }) {
        let queryString = this.getQueryPart(query)
        return this.getFullUrl(params, queryString)
    }

    /**
     * resolve query parameters
     * 
     * @param {Object} queryObj 
     * @returns {String}
     * @memberof UrlTemplate
     */
    getQueryPart(queryObj) {

        /**
         * add a new element into an array
         * 
         * @param {Array} array 
         * @param {*} elem 
         */
        const addArrayElem = function (array, elem) {
            if (!Util.isArray(array)) {
                throw new Error('parameter array must be an Array Object')
            }
            if (Util.isArray(elem)) {
                array = array.concat(elem)
            } else {
                array.push(elem)
            }
            return array
        }

        /**
         * transform all key-value entity to an array, and the array's value is string look like key=value
         * 
         * @param {String} key 
         * @param {String|Number|Array|Object|Function} value 
         * @returns {String|Array}
         */
        const transformToEntity = function (key, value) {
            if (Util.isArray(value)) {

                // value is an array, combine keys with []
                let entityList = []
                for (let i = 0; i < value.length; i++) {

                    let newKey = `${key}${transformRule.arrCombine[0]}${i}${transformRule.arrCombine[1]}`
                    let newValue = value[i]

                    entityList = addArrayElem(entityList, transformToEntity(newKey, newValue))
                }
                return entityList

            } else if (Util.isObject(value)) {

                // value is a object, combine keys with '.'
                let entityList = []
                for (let nextKey in value) {

                    let newKey = `${key}${transformRule.objCombine}${nextKey}`
                    let newValue = value[nextKey]

                    entityList = addArrayElem(entityList, transformToEntity(newKey, newValue))
                }
                return entityList

            } else if (Util.isFunction(value)) {

                // value is a function, use value's return result as key's value
                return transformToEntity(key, value())

            } else {

                // value is other type, use value's toString function's return result as key's value
                return Util.concatString(key, '=', value)

            }
        }

        let transformRule = {
                objCombine: this.options.objCombine,
                arrCombine: this.options.arrCombine
            },
            queryList = [],
            andSymbol = '&'

        for (let key in queryObj) {
            let value = queryObj[key],
                transformResult = transformToEntity(key, value)
            queryList = addArrayElem(queryList, transformResult)
        }

        return queryList.join(andSymbol)
    }

    /**
     * resolve url parameters and concat queryString, finally return a whole url
     * 
     * @param {Object} paramsObj 
     * @param {string} [queryString=''] 
     * @returns 
     * @memberof UrlTemplater
     */
    getFullUrl(paramsObj, queryString = '') {

        let paramsRule = new RegExp(this.options.paramsRule, 'g'),
            urlObj = Object.assign({}, this.templateObj),
            queryConcatSymbol = ''
        
        if (urlObj.query && urlObj.query.length > 0 && queryString.length > 0) {
            queryConcatSymbol = '&'
        }

        // concat static query string and dynamic query string 
        urlObj.query = Util.concatString(urlObj.query, queryConcatSymbol, queryString)
        // replace url parameters in path string, the no-value parameter will be replace with empty string
        urlObj.path = urlObj.path.replace(paramsRule, (substring, key) => {
            let value = paramsObj[key]
            while (Util.isFunction(value)) {
                value = value()
            }
            return value || ''
        })

        return Url.format(urlObj)
    }
}

UrlTemplater.DEFAULT_OPTIONS = {
    objCombine: '.',
    arrCombine: ['[', ']'],
    paramsRule: /:(\w+)/g
}

UrlTemplater.version = '{{version}}'