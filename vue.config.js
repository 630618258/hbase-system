module.exports = {
    devServer: {
        before: require('./src/mock/index')//引入mock/index.js
    }
}