const fs = require('fs');
const path = require('path');
const Mock = require('mockjs');//mockjs 导入依赖模块
const JSON5 = require('json5');
//读取json文件
function getJsonFile(filePath) {
    //读取指定json文件
    var json = fs.readFileSync(path.resolve(__dirname,filePath), 'utf-8');
    //解析并返回
    return JSON5.parse(json);
}

//返回一个函数
module.exports = function(app){
    //监听http请求
    app.post('/api/user/sendCode', function (rep, res) {
        //每次响应请求时读取mock data的json文件
        //getJsonFile方法定义了如何读取json文件并解析成数据对象
        var json = getJsonFile('./json/success.json5');
        //将json传入 Mock.mock 方法中，生成的数据返回给浏览器
        res.json(Mock.mock(json));
    });

    app.post('/api/user/login', function (rep, res) {
        var json = getJsonFile('./json/login.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/manage/HbaseTable/auth/createTable', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/manage/hbaseDataSourceConfiguration/auth/createNamespace', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/manage/hbaseDataSourceConfiguration/auth/createDataConfig', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/user/auth/blackList', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.get('/api/manage/hbaseDataSourceConfiguration/auth/getNamespace', function (rep, res) {
        var json = getJsonFile('./json/namespace.json5');
        res.json(Mock.mock(json));
    });

    app.get('/api/manage/HbaseTable/auth/getTableName', function (rep, res) {
        var json = getJsonFile('./json/tableName.json5');
        res.json(Mock.mock(json));
    });

    app.get('/api/manage/HbaseTable/auth/getTable', function (rep, res) {
        var json = getJsonFile('./json/cells.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/manage/HbaseTable/auth/insertValue', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.get('/api/manage/HbaseTable/auth/delRowData', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/user/auth/logout', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/manage/HbaseTable/auth/delTable', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.get('/api/manage/hbaseManage/auth/delNamespace', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/manage/hbaseDataSourceConfiguration/auth/delSourceData', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.get('/api/manage/hbaseDataSourceConfiguration/auth/getDataSource', function (rep, res) {
        var json = getJsonFile('./json/sourceName.json5');
        res.json(Mock.mock(json));
    });

    app.get('/api/user/auth/getBlackList', function (rep, res) {
        var json = getJsonFile('./json/blackList.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/user/auth/blackList', function (rep, res) {
        var json = getJsonFile('./json/success.json5');
        res.json(Mock.mock(json));
    });

    app.post('/api/manage/HbaseTable/auth/getFamilies', function (rep, res) {
        var json = getJsonFile('./json/families.json5');
        res.json(Mock.mock(json));
    });

}
