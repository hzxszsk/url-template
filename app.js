import UrlBuilder from './src/index'

// import data from './test/data.json'

const data = {
    "interface1":{
        "realUrl": "http://www.realUrl.com/api/interface1",
        "proxyUrl": "http://www.proxyUrl.com/api/interface1"
    },
    "interface2":{
        "realUrl": "http://www.realUrl.com/api/interface2/param/:param/id/:id",
        "proxyUrl": "http://www.proxyUrl.com/api/interface1/param/:param/id/:id"
    }
}

let resultUrl = new UrlBuilder.MockWebUrlContainer(data).get('interface2').use(UrlBuilder.MockWebUrlGroup.REAL_URL).resolve({
    params: {
        param: 1,
        id: 2
    },
    query: {
        name: 'zsk',
        hobby: 'animation'
    }
})

console.log(resultUrl)