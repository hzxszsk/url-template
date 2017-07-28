const expect = require('chai').expect
const { UrlTemplater, Url } = require('../dist/url-templater')

describe('UrlTemplater test', function () {
    it('string params and query resolve', function () {
        let url = new UrlTemplater('http://localhost:8080/api/name/:name').resolve({
            params: {
                name: 'zsk'
            },
            query: {
                json: 'true'
            }
        })
        expect(url).to.be.equal('http://localhost:8080/api/name/zsk?json=true')
    })
})

describe('Url static methods test', function () {
    it('parse a url string', function () {
        let url_obj = Url.parse('http://localhost:8080/api/id/:id?type=json#a')
        expect(url_obj).to.be.equals({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json' 
        })
    })
    it('format a url object to a url string', function () {
        let url = Url.format({
            protocol: 'http',
            host: 'localhost:8080',
            hash: '#a',
            path: '/api/id/:id',
            query: 'type=json' 
        })
        expect(url).to.be.equals('http://localhost:8080/api/id/:id?type=json#a')
    })
})