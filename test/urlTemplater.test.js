const expect = require('chai').expect
const UrlTemplater = require('../dist/url-templater')

describe('basic', function () {
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