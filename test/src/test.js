'use strict'

import assert from 'power-assert'
import Url from '../../src/Url'
import UrlTemplater from '../../src/UrlTemplater'

describe('Url\'s static methods test', function () {
    it('parse - basic test', function () {
        const url_obj = Url.parse('http://localhost:8080/api/id/:id?type=json#a')
        assert.deepEqual(url_obj, {
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        })
    })

    it('parse - no protocal test', function () {
        const url_obj = Url.parse('localhost:8080/api/id/:id?type=json#a')
        assert.deepEqual(url_obj, {
            protocol: '',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        })
    })

    it('parse - no host test', function () {
        const url_obj = Url.parse('/api/id/:id?type=json#a')
        assert.deepEqual(url_obj, {
            protocol: '',
            host: '',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        })
    })

    it('parse - no path test', function () {
        const url_obj = Url.parse('http://localhost:8080?type=json#a')
        assert.deepEqual(url_obj, {
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '',
            query: 'type=json'
        })
    })

    it('parse - no query test', function () {
        const url_obj = Url.parse('http://localhost:8080/api/id/:id?#a')
        assert.deepEqual(url_obj, {
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: ''
        })
    })

    it('parse - no hash test', function () {
        const url_obj = Url.parse('http://localhost:8080/api/id/:id?type=json')
        assert.deepEqual(url_obj, {
            protocol: 'http',
            host: 'localhost:8080',
            hash: '',
            path: '/api/id/:id',
            query: 'type=json'
        })
    })

    it('format - basic test', function () {
        const url = Url.format({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        })
        assert(url === 'http://localhost:8080/api/id/:id?type=json#a')
    })

    it('format - no protocal test', function () {
        const url = Url.format({
            protocol: '',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        })
        assert(url === 'localhost:8080/api/id/:id?type=json#a')
    })

    it('format - no host test', function () {
        const url = Url.format({
            protocol: '',
            host: '',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json'
        })
        assert(url === '/api/id/:id?type=json#a')
    })

    it('format - no path test', function () {
        const url = Url.format({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '',
            query: 'type=json'
        })
        assert(url === 'http://localhost:8080?type=json#a')
    })

    it('format - no query test', function () {
        const url = Url.format({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: ''
        })
        assert(url === 'http://localhost:8080/api/id/:id#a')
    })

    it('format - no hash test', function () {
        const url = Url.format({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '',
            path: '/api/id/:id',
            query: 'type=json'
        })
        assert(url === 'http://localhost:8080/api/id/:id?type=json')
    })
})

describe('UrlTemplater\'s test', function () {

    it('resolve simple params', function () {
        const url = new UrlTemplater('http://localhost:8080/api/name/:name').resolve({
            params: {
                name: 'url-templater'
            }
        })
        assert(url === 'http://localhost:8080/api/name/url-templater')
    })

    it('resolve function params', function () {
        const url = new UrlTemplater('http://localhost:8080/api/time/:time').resolve({
            params: {
                time: function () {
                    return new Date().getTime()
                }
            }
        })
        const urlPattern = /^http:\/\/localhost:8080\/api\/time\/\d+$/
        assert.ok(urlPattern.test(url))
    })

    it('resolve simple query', function () {
        const url = new UrlTemplater('http://localhost:8080/api/query').resolve({
            query: {
                json: 'true'
            }
        })
        assert(url === 'http://localhost:8080/api/query?json=true')
    })

    it('resolve array query', function () {
        const url = new UrlTemplater('http://localhost:8080/api/query').resolve({
            query: {
                array: ['a', 'b', 'c']
            }
        })
        assert(url === 'http://localhost:8080/api/query?array[0]=a&array[1]=b&array[2]=c')
    })

    it('resolve object query', function () {
        const url = new UrlTemplater('http://localhost:8080/api/query').resolve({
            query: {
                obj: {
                    attr1: 'value1',
                    attr2: 'value2',
                    attr3: 'value3'
                }
            }
        })
        assert(url === 'http://localhost:8080/api/query?obj.attr1=value1&obj.attr2=value2&obj.attr3=value3')
    })

    it('resolve function query', function () {
        const url = new UrlTemplater('http://localhost:8080/api/query').resolve({
            query: {
                time: function () {
                    return new Date().getTime()
                }
            }
        })
        const urlPattern = /^http:\/\/localhost:8080\/api\/query\?time=\d+$/
        assert.ok(urlPattern.test(url))
    })

    it('resolve complex query and params', function () {
        const url = new UrlTemplater('http://localhost:8080/api/id/:id/type/:type/query').resolve({
            params: {
                id: 123456,
                type: 'json'
            },
            query: {
                projectInfo: {
                    name: 'url-templater',
                    teamMember: ['programmer', 'tester'],
                    birthday: function () {
                        let birthday = new Date(2017, 7, 10)
                        return `${birthday.getFullYear()}-${birthday.getMonth() + 1}-${birthday.getDate()}`
                    },
                    modules: {
                        Url: 'parse and format effect',
                        UrlTemplater: 'url template class'
                    }
                }
            }
        })

        const resultUrl = 'http://localhost:8080/api/id/123456/type/json/query?projectInfo.name=url-templater&projectInfo.teamMember[0]=programmer&projectInfo.teamMember[1]=tester&projectInfo.birthday=2017-8-10&projectInfo.modules.Url=parse and format effect&projectInfo.modules.UrlTemplater=url template class'

        assert(url === resultUrl)
    })
})