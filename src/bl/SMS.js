/**
 * Created by ling xue on 15-9-1.
 */
var dateUtil = require('../util/DateUtil.js');
var encrypt = require('../util/Encrypt.js');
var sysConfig = require('../config/SystemConfig.js');
var https = require("https");
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SMSUtil.js');

function sendSms(params,callback){
    var d = new Date();
    var timeStampStr = dateUtil.getDateFormat(d,'yyyyMMddhhmmss');

    var originSignStr = sysConfig.smsOptions.accountSID+sysConfig.smsOptions.accountToken+timeStampStr;
    var signature = encrypt.encryptByMd5NoKey(originSignStr);

    var originAuthStr = sysConfig.smsOptions.accountSID +":"+ timeStampStr;
    var auth = encrypt.base64Encode(originAuthStr);
    var url = "/2013-12-26/"+sysConfig.smsOptions.accountType+"/"+
        sysConfig.smsOptions.accountSID+"/"+sysConfig.smsOptions.action+"?sig=";

    url = url +signature;


    var msg ={
        "to": params.phone,
        "appId":sysConfig.smsOptions.appSID,
        "templateId":sysConfig.smsOptions.templateId,
        "datas":[encrypt.getSmsRandomKey(),'15']
    };


    console.log(msg);
    var postData = JSON.stringify(msg);
    var options = {
        host: sysConfig.smsOptions.server,
        port: sysConfig.smsOptions.port,
        path: url,
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'Content-Length' : Buffer.byteLength(postData, 'utf8'),
            'Authorization' : auth
        }
    }
    console.log(postData);
    var httpsReq = https.request(options,function(result){
        var data = "";
        result.setEncoding('utf8');
        result.on('data', function(d) {
            data += d;
        }).on('end',function(){
                var resObj = eval("(" + data + ")");
                logger.info("sendSms "+resObj);
                callback(null,resObj);
            }).on('error', function(e) {
                logger.error("sendSms "+ e.message);
                callback(e,null);
            });

    });

    httpsReq.write(postData+"\n",'utf-8');
    httpsReq.end();
    httpsReq.on('error', function(e) {
        callback(e,null)
    });
}


function getAccountInfo(params,callback){
    var d = new Date();
    var timeStampStr = dateUtil.getDateFormat(d,'yyyyMMddhhmmss');

    var originSignStr = sysConfig.smsOptions.accountSID+sysConfig.smsOptions.accountToken+timeStampStr;
    var signature = encrypt.encryptByMd5NoKey(originSignStr);

    var originAuthStr = sysConfig.smsOptions.accountSID +":"+ timeStampStr;
    var auth = encrypt.base64Encode(originAuthStr);
    var url = "/2013-12-26/"+sysConfig.smsOptions.accountType+"/"+
        sysConfig.smsOptions.accountSID+"/"+"AccountInfo"+"?sig=";

    url = url +signature;


    var msg = {};


    console.log(msg);
    var postData = JSON.stringify(msg);
    var options = {
        host: sysConfig.smsOptions.server,
        port: sysConfig.smsOptions.port,
        path: url,
        method: 'GET',
        headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'Content-Length' : Buffer.byteLength(postData, 'utf8'),
            'Authorization' : auth
        }
    }
    console.log(postData);
    var httpsReq = https.request(options,function(result){
        var data = "";
        result.setEncoding('utf8');
        result.on('data', function(d) {
            data += d;
        }).on('end',function(){
                var resObj = eval("(" + data + ")");
                logger.info("sendMsg "+resObj);
                callback(null,resObj);
            }).on('error', function(e) {
                logger.error("sendMsg "+ e.message);
                callback(e,null);
            });

    });

    httpsReq.write(postData+"\n",'utf-8');
    httpsReq.end();
    httpsReq.on('error', function(e) {
        callback(e,null)
    });
}

function httpSend(msg,callback){
    var d = new Date();
    var timeStampStr = dateUtil.getDateFormat(d,'yyyyMMddhhmmss');

    var originSignStr = sysConfig.smsOptions.accountSID+sysConfig.smsOptions.accountToken+timeStampStr;
    var signature = encrypt.encryptByMd5NoKey(originSignStr);

    var originAuthStr = sysConfig.smsOptions.accountSID +":"+ timeStampStr;
    var auth = encrypt.base64Encode(originAuthStr);
    var url = "/2013-12-26/"+sysConfig.smsOptions.accountType+"/"+
        sysConfig.smsOptions.accountSID+"/"+sysConfig.smsOptions.action+"?sig=";

    url = url +signature;
    var postData = JSON.stringify(msg);
    var options = {
        host: sysConfig.smsOptions.server,
        port: sysConfig.smsOptions.port,
        path: url,
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'Content-Length' : Buffer.byteLength(postData, 'utf8'),
            'Authorization' : auth
        }
    }

    var httpsReq = https.request(options,function(result){
        var data = "";
        result.setEncoding('utf8');
        result.on('data', function(d) {
            data += d;
        }).on('end',function(){
                var resObj = eval("(" + data + ")");
                logger.info("sendSignSms "+resObj);
                callback(null,resObj);
            }).on('error', function(e) {
                logger.error("sendSignSms "+ e.message);
                callback(e,null);
            });

    });

    httpsReq.write(postData+"\n",'utf-8');
    httpsReq.end();
    httpsReq.on('error', function(e) {
        callback(e,null)
    });
}

function sendSignSms(params,callback){
    var msg ={
        "to": params.phone,
        "appId":sysConfig.smsOptions.appSID,
        "templateId":sysConfig.smsOptions.signTemplateId,
        "datas":[params.code,'15']
    };
    httpSend(msg,callback);
}


function sendPasswordSms(params,callback){
    var msg ={
        "to": params.phone,
        "appId":sysConfig.smsOptions.appSID,
        "templateId":sysConfig.smsOptions.pswdTemplateId,
        "datas":[params.code,'15']
    };
    httpSend(msg,callback);
}

function sendTakeOrderSms(params,callback){
    var userInfo = params.takeUser+"("+params.takeUserPhone+")" ;
    var msg ={
        "to": params.phone,
        "appId":sysConfig.smsOptions.appSID,
        "templateId":sysConfig.smsOptions.takedTemplateId,
        "datas":[params.orderId,userInfo]
    };
    httpSend(msg,callback);
}

function sendCancelledOrderSms(params,callback){
    var msg ={
        "to": params.phone,
        "appId":sysConfig.smsOptions.appSID,
        "templateId":sysConfig.smsOptions.takedTemplateId,
        "datas":[params.orderId]
    };
    httpSend(msg,callback);
}

function sendFinishedOrderSms(params,callback){
    var msg ={
        "to": params.phone,
        "appId":sysConfig.smsOptions.appSID,
        "templateId":sysConfig.smsOptions.takedTemplateId,
        "datas":[params.orderId]
    };
    httpSend(msg,callback);
}

module.exports = {
    sendSms : sendSms ,
    getAccountInfo: getAccountInfo ,
    sendSignSms : sendSignSms ,
    sendPasswordSms : sendPasswordSms ,
    sendTakeOrderSms : sendTakeOrderSms ,
    sendCancelledOrderSms : sendCancelledOrderSms ,
    sendFinishedOrderSms : sendFinishedOrderSms
}