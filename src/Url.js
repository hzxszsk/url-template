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
            let url_obj = {
                protocol: null,
                host: null,
                path: null,
                query: null,
                hash: null
            }
            const regExp_protocol = /^(\w+):\/\//
            // parse url's protocol part
            let protocol = url.match(regExp_protocol)
            if (protocol) {
                url_obj.protocol = protocol[1]
                // remove protocol part
                url = url.slice(protocol[0].length)
            }
            // parse url's host part
            if (url.split('/')[0].length > 0) {
                let host = url.split('/')[0]
                url_obj.host = host
                // remove host part
                url = url.slice(host.length)
            }
            // parse url's hash part (this parse order can make parse path easier)
            let hash_index = url.indexOf('#')
            if (hash_index !== -1) {
                url_obj.hash = url.slice(hash_index)
                // remove hash part
                url = url.slice(0, hash_index)
            }
            // parse url's path part
            let path_end_index = url.indexOf('?')
            if (path_end_index !== -1) {
                url_obj.path = url.slice(0, path_end_index)
                url_obj.query = url.slice(path_end_index+1)
            } else {
                url_obj.path = url
            }
            return url_obj
        } else {
            throw new Error('parameter url must be a string')
        }
    }
    /**
     * transform a url object to a url string
     * 
     * @static
     * @param {Object} url_obj 
     * @return {String}
     * @memberof Url
     */
    static format(url_obj) {
        if (Util.isObject(url_obj)) {
            let url = ''
            url += url_obj.protocol ? url_obj.protocol + '://' : ''
            url += url_obj.host ? url_obj.host : ''
            url += url_obj.port ? ':' + url_obj.port : ''
            url += url_obj.path ? url_obj.path : ''
            url += url_obj.query ? '?' + url_obj.query : ''
            url += url_obj.hash ? url_obj.hash : ''
            return url
        } else {
            throw new Error('parameter url_obj must be a object')
        }
    }
}