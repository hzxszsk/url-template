'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var assert = _interopDefault(require('power-assert'));

/**
 * provide some function helpers
 */

var Util = {
    /**
     * judge is a string
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isString: function isString(arg) {
        return typeof arg === 'string';
    },

    /**
     * judge is a number
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNumber: function isNumber(arg) {
        return typeof arg === 'number';
    },

    /**
     * judge is a array
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isArray: function isArray(arg) {
        return Array.isArray(arg);
    },

    /**
     * judge is a object
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isObject: function isObject(arg) {
        return Object.prototype.toString.call(arg) === '[object Object]';
    },

    /**
     * judge is a function
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isFunction: function isFunction(arg) {
        return typeof arg === 'function';
    },

    /**
     * judge is null
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNull: function isNull(arg) {
        return arg === null;
    },

    /**
     * test is arg not a empty string,
     * when arg is null or undefined, return false
     * 
     * @param {any} arg 
     * @returns {Boolean}
     */
    isNotEmptyString: function isNotEmptyString(arg) {
        if (Util.isString(arg) && arg.trim().length > 0) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * concat all parameters to string,
     * when some parameter is null or undefined, not concat them
     * 
     * @param {any} arg 
     * @returns {String}
     */
    concatString: function concatString() {
        var args = [].concat(Array.prototype.slice.call(arguments));
        return args.reduce(function (prev, curr) {
            if (curr) {
                return prev + curr;
            }
            return prev;
        }, '');
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
                var urlObj = {
                    protocol: '',
                    host: '',
                    path: '',
                    query: '',
                    hash: ''

                    // parse url's protocol part
                };var protocolRegExp = /^(\w+):\/\//;
                var protocol = url.match(protocolRegExp);
                if (protocol) {
                    urlObj.protocol = protocol[1];
                    // remove protocol part
                    url = url.slice(protocol[0].length);
                }

                // parse url's host part
                var hostRegExp = /^[a-zA-Z0-9][-a-zA-Z0-9_]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9_]{0,62})*(:\d{0,5})?/;
                var host = url.match(hostRegExp);
                if (host) {
                    urlObj.host = host[0];
                    // remove host part
                    url = url.slice(urlObj.host.length);
                }

                // parse url's hash part (this parse order can make parse path easier)
                var hashRegExp = /#.*$/;
                var hash = url.match(hashRegExp);
                if (hash) {
                    urlObj.hash = hash[0];
                    // remove hash part
                    url = url.slice(0, url.length - urlObj.hash.length);
                }

                // parse url's path part
                var queryRegExp = /\?(.*)$/;
                var query = url.match(queryRegExp);
                if (query) {
                    urlObj.query = query[1];
                    urlObj.path = url.slice(0, query.index);
                } else {
                    urlObj.path = url;
                }

                return urlObj;
            } else {
                throw new Error('parameter url must be a string');
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

    }, {
        key: 'format',
        value: function format(urlObj) {
            if (Util.isObject(urlObj)) {
                var urlPartArray = [];
                urlPartArray.push(Util.isNotEmptyString(urlObj.protocol) ? urlObj.protocol + '://' : '');
                urlPartArray.push(Util.isNotEmptyString(urlObj.host) ? urlObj.host : '');
                urlPartArray.push(Util.isNotEmptyString(urlObj.path) ? urlObj.path : '');
                urlPartArray.push(Util.isNotEmptyString(urlObj.query) ? '?' + urlObj.query : '');
                urlPartArray.push(Util.isNotEmptyString(urlObj.hash) ? urlObj.hash : '');
                return urlPartArray.join('');
            } else {
                throw new Error('parameter url_obj must be a object');
            }
        }
    }]);
    return Url;
}();

var UrlTemplater = function () {

    /**
     * create a url-template object
     * 
     * @param {String} url      url Template
     * @param {Object} options  constructor's option object, has attrs like UrlTemplater.DEFAULT_OPTIONS
     * @memberof UrlTemplate
     */
    function UrlTemplater(url, options) {
        classCallCheck(this, UrlTemplater);

        if (Util.isString(url)) {
            this.options = Object.assign({}, UrlTemplater.DEFAULT_OPTIONS, options);
            this.template = url;
            this.templateObj = Url.parse(url);
        } else {
            throw new Error('parameter url must be a string!');
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


    createClass(UrlTemplater, [{
        key: 'resolve',
        value: function resolve(_ref) {
            var _ref$params = _ref.params,
                params = _ref$params === undefined ? {} : _ref$params,
                _ref$query = _ref.query,
                query = _ref$query === undefined ? {} : _ref$query;

            var queryString = this.getQueryPart(query);
            return this.getFullUrl(params, queryString);
        }

        /**
         * resolve query parameters
         * 
         * @param {Object} queryObj 
         * @returns {String}
         * @memberof UrlTemplate
         */

    }, {
        key: 'getQueryPart',
        value: function getQueryPart(queryObj) {

            /**
             * add a new element into an array
             * 
             * @param {Array} array 
             * @param {*} elem 
             */
            var addArrayElem = function addArrayElem(array, elem) {
                if (!Util.isArray(array)) {
                    throw new Error('parameter array must be an Array Object');
                }
                if (Util.isArray(elem)) {
                    array = array.concat(elem);
                } else {
                    array.push(elem);
                }
                return array;
            };

            /**
             * transform all key-value entity to an array, and the array's value is string look like key=value
             * 
             * @param {String} key 
             * @param {String|Number|Array|Object|Function} value 
             * @returns {String|Array}
             */
            var transformToEntity = function transformToEntity(key, value) {
                if (Util.isArray(value)) {

                    // value is an array, combine keys with []
                    var entityList = [];
                    for (var i = 0; i < value.length; i++) {

                        var newKey = '' + key + transformRule.arrCombineStart + i + transformRule.arrCombineEnd;
                        var newValue = value[i];

                        entityList = addArrayElem(entityList, transformToEntity(newKey, newValue));
                    }
                    return entityList;
                } else if (Util.isObject(value)) {

                    // value is a object, combine keys with '.'
                    var _entityList = [];
                    for (var nextKey in value) {

                        var _newKey = '' + key + transformRule.objCombine + nextKey;
                        var _newValue = value[nextKey];

                        _entityList = addArrayElem(_entityList, transformToEntity(_newKey, _newValue));
                    }
                    return _entityList;
                } else if (Util.isFunction(value)) {

                    // value is a function, use value's return result as key's value
                    console.log(value()); // eslint-disable-line
                    return transformToEntity(key, value());
                } else {

                    // value is other type, use value's toString function's return result as key's value
                    return Util.concatString(key, '=', value);
                }
            };

            var transformRule = {
                objCombine: this.options.objCombine,
                arrCombineStart: this.options.arrCombineStart,
                arrCombineEnd: this.options.arrCombineEnd
            },
                queryList = [],
                andSymbol = '&';

            for (var key in queryObj) {
                var value = queryObj[key],
                    transformResult = transformToEntity(key, value);
                queryList = addArrayElem(queryList, transformResult);
            }

            return queryList.join(andSymbol);
        }

        /**
         * resolve url parameters and concat queryString, finally return a whole url
         * 
         * @param {Object} paramsObj 
         * @param {string} [queryString=''] 
         * @returns 
         * @memberof UrlTemplater
         */

    }, {
        key: 'getFullUrl',
        value: function getFullUrl(paramsObj) {
            var queryString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';


            var paramsRule = this.options.paramsRule,
                urlObj = Object.assign({}, this.templateObj),
                queryConcatSymbol = '';

            if (urlObj.query && urlObj.query.length > 0 && queryString.length > 0) {
                queryConcatSymbol = '&';
            }

            // concat static query string and dynamic query string 
            urlObj.query = Util.concatString(urlObj.query, queryConcatSymbol, queryString);
            // replace url parameters in path string, the no-value parameter will be replace with empty string
            urlObj.path = urlObj.path.replace(paramsRule, function (substring, key) {
                if (Util.isFunction(paramsObj[key])) {
                    return paramsObj[key]() || '';
                }
                return paramsObj[key] || '';
            });

            return Url.format(urlObj);
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

UrlTemplater.version = '{{version}}';

describe('Url\'s static methods test', function () {
    it('parse - basic test', function () {
        var url_obj = Url.parse('http://localhost:8080/api/id/:id?type=json#a');
        assert.deepEqual(url_obj, {
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        });
    });

    it('parse - no protocal test', function () {
        var url_obj = Url.parse('localhost:8080/api/id/:id?type=json#a');
        assert.deepEqual(url_obj, {
            protocol: '',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        });
    });

    it('parse - no host test', function () {
        var url_obj = Url.parse('/api/id/:id?type=json#a');
        assert.deepEqual(url_obj, {
            protocol: '',
            host: '',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        });
    });

    it('parse - no path test', function () {
        var url_obj = Url.parse('http://localhost:8080?type=json#a');
        assert.deepEqual(url_obj, {
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '',
            query: 'type=json'
        });
    });

    it('parse - no query test', function () {
        var url_obj = Url.parse('http://localhost:8080/api/id/:id?#a');
        assert.deepEqual(url_obj, {
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: ''
        });
    });

    it('parse - no hash test', function () {
        var url_obj = Url.parse('http://localhost:8080/api/id/:id?type=json');
        assert.deepEqual(url_obj, {
            protocol: 'http',
            host: 'localhost:8080',
            hash: '',
            path: '/api/id/:id',
            query: 'type=json'
        });
    });

    it('format - basic test', function () {
        var url = Url.format({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        });
        assert(url === 'http://localhost:8080/api/id/:id?type=json#a');
    });

    it('format - no protocal test', function () {
        var url = Url.format({
            protocol: '',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        });
        assert(url === 'localhost:8080/api/id/:id?type=json#a');
    });

    it('format - no host test', function () {
        var url = Url.format({
            protocol: '',
            host: '',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        });
        assert(url === '/api/id/:id?type=json#a');
    });

    it('format - no path test', function () {
        var url = Url.format({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '',
            query: 'type=json'
        });
        assert(url === 'http://localhost:8080?type=json#a');
    });

    it('format - no query test', function () {
        var url = Url.format({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: ''
        });
        assert(url === 'http://localhost:8080/api/id/:id#a');
    });

    it('format - no hash test', function () {
        var url = Url.format({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '',
            path: '/api/id/:id',
            query: 'type=json'
        });
        assert(url === 'http://localhost:8080/api/id/:id?type=json');
    });
});

describe('UrlTemplater\'s test', function () {

    it('resolve simple params', function () {
        var url = new UrlTemplater('http://localhost:8080/api/name/:name').resolve({
            params: {
                name: 'url-templater'
            }
        });
        assert(url === 'http://localhost:8080/api/name/url-templater');
    });

    it('resolve function params', function () {
        var url = new UrlTemplater('http://localhost:8080/api/time/:time').resolve({
            params: {
                time: function time() {
                    return new Date().getTime();
                }
            }
        });
        var urlPattern = /^http:\/\/localhost:8080\/api\/time\/\d+$/;
        assert.ok(urlPattern.test(url));
    });

    it('resolve simple query', function () {
        var url = new UrlTemplater('http://localhost:8080/api/query').resolve({
            query: {
                json: 'true'
            }
        });
        assert(url === 'http://localhost:8080/api/query?json=true');
    });

    it('resolve array query', function () {
        var url = new UrlTemplater('http://localhost:8080/api/query').resolve({
            query: {
                array: ['a', 'b', 'c']
            }
        });
        assert(url === 'http://localhost:8080/api/query?array[0]=a&array[1]=b&array[2]=c');
    });

    it('resolve object query', function () {
        var url = new UrlTemplater('http://localhost:8080/api/query').resolve({
            query: {
                obj: {
                    attr1: 'value1',
                    attr2: 'value2',
                    attr3: 'value3'
                }
            }
        });
        assert(url === 'http://localhost:8080/api/query?obj.attr1=value1&obj.attr2=value2&obj.attr3=value3');
    });

    it('resolve function query', function () {
        var url = new UrlTemplater('http://localhost:8080/api/query').resolve({
            query: {
                time: function time() {
                    return new Date().getTime();
                }
            }
        });
        var urlPattern = /^http:\/\/localhost:8080\/api\/query\?time=\d+$/;
        assert.ok(urlPattern.test(url));
    });

    it('resolve complex query and params', function () {
        var url = new UrlTemplater('http://localhost:8080/api/id/:id/type/:type/query').resolve({
            params: {
                id: 123456,
                type: 'json'
            },
            query: {
                projectInfo: {
                    name: 'url-templater',
                    teamMember: ['programmer', 'tester'],
                    birthday: function birthday() {
                        var birthday = new Date(2017, 7, 10);
                        return birthday.getFullYear() + '-' + (birthday.getMonth() + 1) + '-' + birthday.getDate();
                    },
                    modules: {
                        Url: 'parse and format effect',
                        UrlTemplater: 'url template class'
                    }
                }
            }
        });

        var resultUrl = 'http://localhost:8080/api/id/123456/type/json/query?projectInfo.name=url-templater&projectInfo.teamMember[0]=programmer&projectInfo.teamMember[1]=tester&projectInfo.birthday=2017-8-10&projectInfo.modules.Url=parse and format effect&projectInfo.modules.UrlTemplater=url template class';

        assert(url === resultUrl);
    });
});
