import WebUrlTemplate from './WebUrlTemplate'

export default class MockWebUrlGroup {
    /**
     * 创建
     * 
     * @param {Object} mockInterface 
     * @memberof MockWebUrlGroup
     */
    constructor ({realUrl, proxyUrl}) {
        this.realUrl = new WebUrlTemplate(realUrl)
        this.proxyUrl = new WebUrlTemplate(proxyUrl)
        this.usingUrl = this.proxyUrl
    }

    /**
     * 切换使用的url模板类型
     * 
     * @param {String} urlTemplateType 
     * @returns {MockWebUrlGroup}
     * @memberof MockWebUrlGroup
     */
    use (urlTemplateType) {
        if (urlTemplateType === MockWebUrlGroup.PROXY_URL) {
            this.usingUrl = this.proxyUrl
        } else if (urlTemplateType === MockWebUrlGroup.REAL_URL) {
            this.usingUrl = this.realUrl
        } else {
            throw new Error('it\'s not a specified urlTemplateType')
        }
        return this
    }

    /**
     * 解析当前使用的url模板，生成目标url
     * 
     * @param {Object} resolveObj 
     * @returns 
     * @memberof MockWebUrlGroup
     */
    resolve (resolveObj = {}) {
        return this.usingUrl.resolve(resolveObj)
    }

}

MockWebUrlGroup.REAL_URL = 'realUrl'
MockWebUrlGroup.PROXY_URL = 'proxyUrl'