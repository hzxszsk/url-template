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
                protocol: '',
                host: '',
                path: '',
                query: '',
                hash: ''
            }

            // parse url's protocol part
            const protocolRegExp = /^(\w+):\/\//
            let protocol = url.match(protocolRegExp)
            if (protocol) {
                urlObj.protocol = protocol[1]
                // remove protocol part
                url = url.slice(protocol[0].length)
            }

            // parse url's host part
            const hostRegExp = /^[a-zA-Z0-9][-a-zA-Z0-9_]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9_]{0,62})*(:\d{0,5})?/
            let host = url.match(hostRegExp)
            if (host) {
                urlObj.host = host[0]
                // remove host part
                url = url.slice(urlObj.host.length)
            }

            // parse url's hash part (this parse order can make parse path easier)
            const hashRegExp = /#.*$/
            let hash = url.match(hashRegExp)
            if (hash) {
                urlObj.hash = hash[0]
                // remove hash part
                url = url.slice(0, url.length - urlObj.hash.length)
            }

            // parse url's path part
            const queryRegExp = /\?(.*)$/
            let query = url.match(queryRegExp)
            if (query) {
                urlObj.query = query[1]
                urlObj.path = url.slice(0, query.index)
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
            urlPartArray.push(Util.isNotEmptyString(urlObj.protocol) ? urlObj.protocol + '://' : '')
            urlPartArray.push(Util.isNotEmptyString(urlObj.host) ? urlObj.host : '')
            urlPartArray.push(Util.isNotEmptyString(urlObj.path) ? urlObj.path : '')
            urlPartArray.push(Util.isNotEmptyString(urlObj.query) ? '?' + urlObj.query : '')
            urlPartArray.push(Util.isNotEmptyString(urlObj.hash) ? urlObj.hash : '')
            return urlPartArray.join('')
        } else {
            throw new Error('parameter url_obj must be a object')
        }
    }
}