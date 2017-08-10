'use strict'
import Util from './Util'
/**
 * a simple tool lib look like node's url module
 * 
 * @class Url
 */
export default class Url {
    
    /**
     * transform a url string to a url object
     * 
     * @static
     * @param {String} url 
     * @return {Url}
     * @memberof Url
     */
    static parse(url) {
        if (Util.isString(url)) {
            let urlObj = {
                protocol: null,
                host: null,
                path: null,
                query: null,
                hash: null
            }
            const protocolRegExp = /^(\w+):\/\//
            // parse url's protocol part
            let protocol = url.match(protocolRegExp)
            if (protocol) {
                urlObj.protocol = protocol[1]
                // remove protocol part
                url = url.slice(protocol[0].length)
            }
            // parse url's host part
            if (url.split('/')[0].length > 0) {
                let host = url.split('/')[0]
                urlObj.host = host
                // remove host part
                url = url.slice(host.length)
            }
            // parse url's hash part (this parse order can make parse path easier)
            let hashIndex = url.indexOf('#')
            if (hashIndex !== -1) {
                urlObj.hash = url.slice(hashIndex)
                // remove hash part
                url = url.slice(0, hashIndex)
            }
            // parse url's path part
            let queryIndex = url.indexOf('?')
            if (queryIndex !== -1) {
                urlObj.path = url.slice(0, queryIndex)
                urlObj.query = url.slice(queryIndex + 1)
            } else {
                urlObj.path = url
            }
            return urlObj
        } else {
            throw new Error('parameter url must be a string')
        }
    }

    /**
     * transform a url object to a url string
     * 
     * @static
     * @param {Object} urlObj 
     * @return {String}
     * @memberof Url
     */
    static format(urlObj) {
        if (Util.isObject(urlObj)) {
            let urlPartArray = []
            urlPartArray.push(urlObj.protocol ? urlObj.protocol + '://' : '')
            urlPartArray.push(urlObj.host ? urlObj.host : '')
            urlPartArray.push(urlObj.port ? ':' + urlObj.port : '')
            urlPartArray.push(urlObj.path ? urlObj.path : '')
            urlPartArray.push(urlObj.query ? '?' + urlObj.query : '')
            urlPartArray.push(urlObj.hash ? urlObj.hash : '')
            return urlPartArray.join('')
        } else {
            throw new Error('parameter url_obj must be a object')
        }
    }
}