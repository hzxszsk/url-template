'use strict'
import Util from './Util'
import Url from './Url'

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
            // set default UrlParser
            this.UrlParser = this.options.UrlParser || Url
            this.template = url
            this.templateObj = this.UrlParser.parse(url)
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
        return this.getParamsPart(params) + this.getQueryPart(query)
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
         * add a new elem into an array
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
                    entityList = addArrayElem(entityList, transformToEntity(`${key}${transformRule.arrCombineStart}${i}${transformRule.arrCombineEnd}`, value[i]))
                }
                return entityList

            } else if (Util.isObject(value)) {

                // value is a object, combine keys with '.'
                let entityList = []
                for (let nextKey in value) {
                    entityList = addArrayElem(entityList, transformToEntity(`${key}${transformRule.objCombine}${nextKey}`, value[nextKey]))
                }
                return entityList

            } else if (Util.isFunction(value)) {

                // value is a function, use value's return result as key's value
                return transformToEntity(key, value())

            } else {

                // value is other type, use value's toString function's return result as key's value
                value = encodeURI(value.toString())
                return `${key}=${value}`

            } 
        }

        let transformRule = {
                objCombine: this.options.objCombine,
                arrCombineStart: this.options.arrCombineStart,
                arrCombineEnd: this.options.arrCombineEnd,
            },
            queryStart = this.template.endsWith('?') ? '' : '?',
            queryList = [],
            andSymbol = '&'

        for (let key in queryObj) {
            let value = queryObj[key]
            let transformResult = transformToEntity(key, value)
            queryList = addArrayElem(queryList, transformResult)
        }

        let queryResult = queryList.join(andSymbol)
        return queryResult.length > 0 ? queryStart + queryResult : queryResult

    }

    /**
     * resolve url parameters
     * 
     * @param {Object} paramsObj 
     * @returns {String}
     * @memberof UrlTemplate
     */
    getParamsPart(paramsObj) {

        let paramsRule = this.options.paramsRule
        let urlObj = Object.assign({}, this.templateObj)

        // replace url parameters in path string, the no-value parameter will be replace with empty string
        urlObj.path = urlObj.path.replace(paramsRule, (substring, key) => {
            if (Util.isFunction(paramsObj[key])) {
                return paramsObj[key]() || ''
            }
            return paramsObj[key] || ''
        })

        return this.UrlParser.format(urlObj)
    }
}

UrlTemplater.DEFAULT_OPTIONS = {
    objCombine: '.',
    arrCombineStart: '[',
    arrCombineEnd: ']',
    paramsRule: /:(\w+)/g,
    UrlParser: null
}

UrlTemplater.version = '{{version}}'