# url-template

![Build Status](https://travis-ci.org/hzxszsk/url-templater.svg?branch=master)

Create url that you want to use with different data.

## Installation

```
$ npm install url-templater --save
```

## Usage

### Basic

import the UrlTemplater class, and new a UrlTemplater instance by passing a string parameter, then use `resolve` method to get the rendered url string.

**example:**
``` js
const UrlTemplater = require('url-templater')

const url = new UrlTemplater('http://localhost:8080/api/name/:name')
url.resolve({
    params: {
        name: 'url-templater'
    },
    query: {
        json: 'true'
    }
})
// http://localhost:8080/api/name/url-templater?json=true
```

`resolve` method receive a object include `params` and `query` propertise.

The `params` property resolve the path parameter( like `:name`), and the `query` property resolve the url's search part.

`params` support `string` and `function`,

if param property's value is a function, url-templater will use the funciton return value as the property value.

``` js
new UrlTemplater('http://localhost:8080/api/name/:name').resolve({
    params: {
        name: function () {
            return 'a'
        }
    }
})
// http://localhost:8080/api/name/a
```

`query` support several typeof properties:

- *string* use string as the final value type
- *function* use function's return value as property value
- *Array* url-templater will resolve array as multiple value, the key will be transform to a formatted key like `key[index]`
- *object* when query's property is a object, it will combined current key with previous key like `prevKey.currKey`

**example:**
``` js
new UrlTemplater('http://localhost:8080/api/query').resolve({
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
// http://localhost:8080/api/query?projectInfo.name=url-templater&projectInfo.teamMember[0]=programmer&projectInfo.teamMember[1]=tester&projectInfo.birthday=2017-8-10&projectInfo.modules.Url=parse and format effect&projectInfo.modules.UrlTemplater=url template class
```

### Advanced

if you want to use you own habits to replace the default configuration (such as the character that used to combine object's key), you can add a options object parameter in UrlTemplater's constructor.

**example:**
``` js
const templater = new UrlTemplater('http://localhost:8080/api/name/{{name}}/query', {
    // the character combine with object's key
    objCombine: '#',
    // the characters insert before and after array's index key
    arrCombine: ['{', '}'],
    // the regular expression that used to replace url parameters with real value
    paramsRule: /{{(\w+)}}/g
})
templater.resolve({
    params: {
        name: 'url-templater'
    },
    query: {
        array: ['a', 'b', 'c'],
        modules: {
            Url: 'parse and format effect'
        }
    }
})
// http://localhost:8080/api/name/url-templater/query?array{0}=a&array{1}=b&array{2}=c&modules#Url=parse and format effect
```

### Run Tests

```
npm run test
```



