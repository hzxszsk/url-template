'use strict'
import Util from './Util'
// import nodejs module by rollup-plugin-node-builtins
import Url from './Url'

export default class UrlTemplate {

    /**
     * create a url-template object
     * 
     * @param {String} url 模板URL
     * @param {Object} options 配置项
     * @memberof UrlTemplate
     */
    constructor(url, options) {
        if (Util.isString(url)) {
            this._url = url
            this._obj = Url.parse(url)
            this.options = Object.assign({}, UrlTemplate.DEFAULT_OPTIONS, options)
        } else {
            throw new Error('parameter url must be a string!')
        }
    }

    /**
     * 解析URL参数和请求参数，返回解析完的结果URL
     * 
     * @param {Object} {
     *         params = {}, Url参数
     *         query = {}   Query参数
     *     } 
     * @returns {String}
     * @memberof UrlTemplate
     */
    resolve({
        params = {}, 
        query = {}
    }) {
        return this.getResolvedParamsPart(params) + this.getResolvedQueryPart(query)
    }

    /**
     * 解析查询参数部分
     * 
     * @param {Object} queryObj 
     * @returns {String}
     * @memberof UrlTemplate
     */
    getResolvedQueryPart(queryObj) {

        /**
         * 将键-值对转化成key=value的数组
         * 
         * @param {String} key 
         * @param {String|Number|Array|Object} value 
         * @returns 
         */
        const _transformToEntity = function (key, value) {
            if (Util.isArray(value)) {

                // 数组，按数组规则解析，用[]连接
                let _entityList = []
                for (let i = 0; i < value.length; i++) {
                    _entityList.concat(_transformToEntity(`${key}${_transformRule.arrCombineStart}${i}${_transformRule.arrCombineEnd}`, value[i]))
                }
                return _entityList

            } else if (Util.isObject(value)) {

                // 对象，按对象规则解析，用.连接
                let _entityList = []
                for (let _inner_key in value) {
                    _entityList.concat(_transformToEntity(`${key}${_transformRule.objCombine}${_inner_key}`, value[_inner_key]))
                }
                return _entityList

            } else if (Util.isFunction(value)) {

                // 函数，按函数结果类型解析
                return _transformToEntity(key, value())

            } else {

                // 其他类型，直接转化字符串，进行编码拼接
                value = encodeURI(value.toString())
                return `${key}=${value}`

            } 
        }

        let _transformRule = {
                objCombine: this.options.objCombine,
                arrCombineStart: this.options.arrCombineStart,
                arrCombineEnd: this.options.arrCombineEnd,
            },
            _queryStart = this._url.endsWith('?') ? '' : '?',
            _queryList = [],
            _andFlag = '&'

        for (let key in queryObj) {
            let value = queryObj[key]
            let _transformResult = _transformToEntity(key, value)
            if (Util.isArray(_transformResult)) {
                _queryList.concat(_transformResult)
            } else if (Util.isString) {
                _queryList.push(_transformResult)
            }
        }

        return _queryStart + _queryList.join(_andFlag)

    }

    /**
     * 解析URL路径参数部分
     * 
     * @param {Object} paramsObj 
     * @returns {String}
     * @memberof UrlTemplate
     */
    getResolvedParamsPart(paramsObj) {

        let _paramsRule = this.options.paramsRule
        let _url = this._url

        _url = _url.replace(_paramsRule, function (substring, key) {
            if (!isNaN(key)) {
                return substring
            }
            return paramsObj[key] || ''
        })

        return _url
    }
}

UrlTemplate.DEFAULT_OPTIONS = {
    objCombine: '.',
    arrCombineStart: '[',
    arrCombineEnd: ']',
    paramsRule: /:(\w+)/g
}