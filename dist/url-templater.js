(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.UrlTemplater = factory());
}(this, (function () { 'use strict';

var Util = {
    /**
     * 判断是否为字符串
     * 
     * @param {any} str 
     * @returns {Boolean}
     */
    isString: function isString(str) {
        return typeof str === 'string';
    },

    /**
     * 判断是否为数字
     * 
     * @param {any} num 
     * @returns {Boolean}
     */
    isNumber: function isNumber(num) {
        return typeof num === 'number';
    },

    /**
     * 判断是否为数组
     * 
     * @param {any} arr 
     * @returns {Boolean}
     */
    isArray: function isArray(arr) {
        return Array.isArray(arr);
    },

    /**
     * 判断是否为对象
     * 
     * @param {any} obj 
     * @returns {Boolean}
     */
    isObject: function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    },

    /**
     * 判断是否为函数
     * 
     * @param {any} fun 
     * @returns {Boolean}
     */
    isFunction: function isFunction(fun) {
        return typeof fun === 'function';
    },

    /**
     * 判断是否为null
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNull: function isNull(arg) {
        return arg === null;
    }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * a simple tool lib look like node's url module
 * 
 * @class Url
 */

var Url = function () {
    function Url() {
        classCallCheck(this, Url);
    }

    createClass(Url, null, [{
        key: 'parse',

        /**
         * transform a url string to a url object
         * 
         * @static
         * @param {String} url 
         * @return {Url}
         * @memberof Url
         */
        value: function parse(url) {
            if (Util.isString(url)) {
                var url_obj = {
                    protocol: null,
                    host: null,
                    path: null,
                    query: null,
                    hash: null
                };
                var regExp_protocol = /^(\w+):\/\//;
                // parse url's protocol part
                var protocol = url.match(regExp_protocol);
                if (protocol) {
                    url_obj.protocol = protocol[1];
                    // remove protocol part
                    url = url.slice(protocol[0].length);
                }
                // parse url's host part
                if (url.split('/')[0].length > 0) {
                    var host = url.split('/')[0];
                    url_obj.host = host;
                    // remove host part
                    url = url.slice(host.length);
                }
                // parse url's hash part (this parse order can make parse path easier)
                var hash_index = url.indexOf('#');
                if (hash_index !== -1) {
                    url_obj.hash = url.slice(hash_index);
                    // remove hash part
                    url = url.slice(0, hash_index);
                }
                // parse url's path part
                var path_end_index = url.indexOf('?');
                if (path_end_index !== -1) {
                    url_obj.path = url.slice(0, path_end_index);
                    url_obj.query = url.slice(path_end_index + 1);
                } else {
                    url_obj.path = url;
                }
                return url_obj;
            } else {
                throw new Error('parameter url must be a string');
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

    }, {
        key: 'format',
        value: function format(url_obj) {
            if (Util.isObject(url_obj)) {
                var _urlPartArray = [];
                _urlPartArray.push(url_obj.protocol ? url_obj.protocol + '://' : '');
                _urlPartArray.push(url_obj.host ? url_obj.host : '');
                _urlPartArray.push(url_obj.port ? ':' + url_obj.port : '');
                _urlPartArray.push(url_obj.path ? url_obj.path : '');
                _urlPartArray.push(url_obj.query ? '?' + url_obj.query : '');
                _urlPartArray.push(url_obj.hash ? url_obj.hash : '');
                return _urlPartArray.join('');
            } else {
                throw new Error('parameter url_obj must be a object');
            }
        }
    }]);
    return Url;
}();

// import nodejs module by rollup-plugin-node-builtins
var UrlTemplater = function () {

    /**
     * create a url-template object
     * 
     * @param {String} url 模板URL
     * @param {Object} options 配置项
     * @memberof UrlTemplate
     */
    function UrlTemplater(url, options) {
        classCallCheck(this, UrlTemplater);

        if (Util.isString(url)) {
            this._templater = url;
            this._templaterObj = Url.parse(url);
            this.options = Object.assign({}, UrlTemplater.DEFAULT_OPTIONS, options);
        } else {
            throw new Error('parameter url must be a string!');
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


    createClass(UrlTemplater, [{
        key: 'resolve',
        value: function resolve(_ref) {
            var _ref$params = _ref.params,
                params = _ref$params === undefined ? {} : _ref$params,
                _ref$query = _ref.query,
                query = _ref$query === undefined ? {} : _ref$query;

            return this.getResolvedParamsPart(params) + this.getResolvedQueryPart(query);
        }

        /**
         * 解析查询参数部分
         * 
         * @param {Object} queryObj 
         * @returns {String}
         * @memberof UrlTemplate
         */

    }, {
        key: 'getResolvedQueryPart',
        value: function getResolvedQueryPart(queryObj) {

            /**
             * 将键-值对转化成key=value的数组
             * 
             * @param {String} key 
             * @param {String|Number|Array|Object} value 
             * @returns 
             */
            var _transformToEntity = function _transformToEntity(key, value) {
                if (Util.isArray(value)) {

                    // 数组，按数组规则解析，用[]连接
                    var _entityList = [];
                    for (var i = 0; i < value.length; i++) {
                        _entityList.concat(_transformToEntity('' + key + _transformRule.arrCombineStart + i + _transformRule.arrCombineEnd, value[i]));
                    }
                    return _entityList;
                } else if (Util.isObject(value)) {

                    // 对象，按对象规则解析，用.连接
                    var _entityList2 = [];
                    for (var _inner_key in value) {
                        _entityList2.concat(_transformToEntity('' + key + _transformRule.objCombine + _inner_key, value[_inner_key]));
                    }
                    return _entityList2;
                } else if (Util.isFunction(value)) {

                    // 函数，按函数结果类型解析
                    return _transformToEntity(key, value());
                } else {

                    // 其他类型，直接转化字符串，进行编码拼接
                    value = encodeURI(value.toString());
                    return key + '=' + value;
                }
            };

            var _transformRule = {
                objCombine: this.options.objCombine,
                arrCombineStart: this.options.arrCombineStart,
                arrCombineEnd: this.options.arrCombineEnd
            },
                _queryStart = this._templater.endsWith('?') ? '' : '?',
                _queryList = [],
                _andFlag = '&';

            for (var key in queryObj) {
                var value = queryObj[key];
                var _transformResult = _transformToEntity(key, value);
                if (Util.isArray(_transformResult)) {
                    _queryList.concat(_transformResult);
                } else if (Util.isString) {
                    _queryList.push(_transformResult);
                }
            }

            return _queryStart + _queryList.join(_andFlag);
        }

        /**
         * 解析URL路径参数部分
         * 
         * @param {Object} paramsObj 
         * @returns {String}
         * @memberof UrlTemplate
         */

    }, {
        key: 'getResolvedParamsPart',
        value: function getResolvedParamsPart(paramsObj) {

            var _paramsRule = this.options.paramsRule;
            var _urlObj = Object.assign({}, this._templaterObj);

            // replace url path parameters
            _urlObj.path = _urlObj.path.replace(_paramsRule, function (substring, key) {
                return paramsObj[key] || '';
            });

            return Url.format(_urlObj);
        }
    }]);
    return UrlTemplater;
}();

UrlTemplater.DEFAULT_OPTIONS = {
    objCombine: '.',
    arrCombineStart: '[',
    arrCombineEnd: ']',
    paramsRule: /:(\w+)/g
};

UrlTemplater.version = '1.0.0';

var index = {
    UrlTemplater: UrlTemplater,
    Url: Url
};

return index;

})));
