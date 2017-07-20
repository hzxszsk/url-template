import MockWebUrlGroup from './MockWebUrlGroup'
import Util from './Util'

export default class MockWebUrlContainer {
    constructor (mockInterfaceObjs) {
        this.interfaces = {}
        for (let mockInterfaceName in mockInterfaceObjs) {
            let mockInterface = mockInterfaceObjs[mockInterfaceName]
            this.interfaces[mockInterfaceName] = new MockWebUrlGroup(mockInterface)
        }
    }

    /**
     * 获得一个MockWebUrlGroup对象
     * 
     * @param {String} mockInterfaceName 
     * @returns {MockWebUrlGroup}
     * @memberof MockWebUrlContainer
     */
    get (mockInterfaceName) {
        if (!Util.isString(mockInterfaceName)) {
            throw new Error('parameter mockInterfaceName must be a String')
        }
        if (this.interfaces.hasOwnProperty(mockInterfaceName)) {
            return this.interfaces[mockInterfaceName]
        } else {
            throw new Error('no such name mockInterface object')
        }
    }
}