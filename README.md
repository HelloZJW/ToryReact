# 实现ToyReact

## 准备工作
需要用到 babel 和 webpack 相关的依赖：
```javascript
"devDependencies": {
  "@babel/core": "^7.10.5",
  "@babel/preset-env": "^7.10.4",
  "@babel/plugin-transform-react-jsx": "^7.10.4",
  "babel-loader": "^8.1.0",
  "webpack": "^4.43.0",
  "webpack-cli": "^3.3.12"
}
```
webpack 配置
```javascript
const path = require('path')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    },
    mode: 'development',
    optimization: {
        minimize: false
    }
}
```
.babelrc 配置
```json
{
    "presets": [
        "@babel/preset-env"
    ],
    "plugins": [
        [
            "@babel/plugin-transform-react-jsx",
            {
                "pragma": "ToyReact.createElement"
            }
        ]
    ]
}
```
开始之前，通过[Babel 在线转译](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=DYUwLgBAhhC8EB4AmBLAbhFTYHIoEYcA-AKAnMQGcAHKAOyIAkRhgB7AGgQHob7SKVWgwDubAE7AkPPgzIUAhCR6o0pIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2%2Cenv&prettier=false&targets=&version=7.10.5&externalPlugins=)工具我们了解一下 babel 是如何支持 JSX 的。![image.png](https://cdn.nlark.com/yuque/0/2020/png/622179/1595301363856-3e7f9c53-d442-43ec-b369-5d63734ed26c.png#align=left&display=inline&height=150&margin=%5Bobject%20Object%5D&name=image.png&originHeight=300&originWidth=2662&size=83071&status=done&style=none&width=1331)
可以看到，babel 把 JSX 代码转译成了通过 React.createElement 组成的带有层级关系的一段原生 JavaScript 代码。 React.createElement 函数返回的是一个 virtual dom 的节点树。有了这个背景，我们就来动手实现 createElement 函数。
## Let's start


