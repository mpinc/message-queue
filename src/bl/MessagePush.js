/**
 * Created by ling xue on 15-10-29.
 */
var xinge = require("Xinge");
var xingeUtil = require("../util/XingeUtil.js");
var sysConfig = require('../config/SystemConfig.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('MessagePush.js');

var XingeApp = new xinge.XingeApp(sysConfig.xingeOptions.accessId, sysConfig.xingeOptions.secretKey);

function pushToSingoAndroidDevice(params,callback){
    var message = xingeUtil.getBaseAndroidMsg(params.title,params.content,xingeUtil.getBaseStyle(),xingeUtil.getBaseAction())
    XingeApp.pushToSingleDevice(params.deviceToken,message,null,function(error,result){
        callback(error,result);
    })
}

module.exports ={
    pushToSingoAndroidDevice : pushToSingoAndroidDevice
}