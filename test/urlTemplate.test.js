const expect = require('chai').expect
const UrlTemplate = require('../dist/bundle.rollup')

describe('basic', function () {
    it('string params and query resolve', function () {
        let url = new UrlTemplate('http://localhost:8080/api/name/:name').resolve({
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