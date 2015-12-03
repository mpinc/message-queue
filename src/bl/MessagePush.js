/**
 * Created by ling xue on 15-10-29.
 */
var xinge = require("xinge");
var apn = require("apn");
var xingeUtil = require("../util/XingeUtil.js");
var sysConfig = require('../config/SystemConfig.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('MessagePush.js');
var iosPushDao = require("../dao/IosPushDAO.js");

var XingeApp = new xinge.XingeApp(sysConfig.xingeOptions.accessId, sysConfig.xingeOptions.secretKey);

function pushToSingoAndroidDevice(params,callback){
    var message = xingeUtil.getBaseAndroidMsg(params.title,params.content,xingeUtil.getBaseStyle(),xingeUtil.getBaseAction())
    XingeApp.pushToSingleDevice(params.deviceToken,message,null,function(error,result){
        console.log(error);
        console.log(result);
        callback(error,result);
    })
}



function pushToSingleIosDevice(params,callback){
    var message = new apn.notification();
    var device = new apn.Device(params.deviceToken);
    message.setAlertText(params.title);
    message.badge = params.badge
    message.sound = "ping.aiff";
    message.payload = {'messageFrom': sysConfig.iosPushConfig.messageFrom};
    message.expiry = Math.floor(Date.now() / 1000) + 3600;
    iosPushDao.pushNotification({device:device,message:message},function(error,result){
        callback(error,result);
    });
}

module.exports ={
    pushToSingoAndroidDevice : pushToSingoAndroidDevice ,
    pushToSingleIosDevice :  pushToSingleIosDevice
}