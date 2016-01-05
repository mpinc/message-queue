/**
 * Created by ling xue on 15-12-3.
 */
var apn = require("apn");
var sysConfig = require('../config/SystemConfig.js');
var serverLogger = require('../util/ServerLogger.js');
var sysError = require('../util/SystemError.js');
var logger = serverLogger.createLogger('IosPushDAO.js');

function errorHappened(err, notification){
    console.log(err);
    console.log(notification);
}
var apnOptions = sysConfig.iosPushConfig;
apnOptions.errorCallback =errorHappened ;
var service = new apn.connection(apnOptions);

service.on("connected", function() {
    logger.debug("Connected APN");
});

service.on("transmitted", function(notification, device) {
    logger.info("Notification transmitted to:" + device.token.toString("hex"));
});

service.on("transmissionError", function(errCode, notification, device) {
    logger.error("Notification caused error: " + errCode + " for device ", device, notification);
    if (errCode === 8) {
        logger.error("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
    }
});

service.on("timeout", function (err) {
    logger.error("Connection APN Timeout");

});

service.on("disconnected", function() {
    logger.error("Disconnected from APNS");
    //console.log('5')
});

service.on("socketError", function(error){
    logger.error(error.message);

});

function pushNotification(params,callback) {
    service.pushNotification(params.message, params.device);
    callback(null,{success:true});
}

module.exports = {
    pushNotification : pushNotification
}