/**
 * Created by ling xue on 15-10-29.
 */
var db=require('../connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDeviceDAO.js');

function getUserOrderDevice(params,callback){
    var query = "select oi.*,sender.name sender_name,sender.phone sender_phone, taker.name taker_name," +
        " taker.phone taker_phone , uds.device_token sender_device_token,uds.device_type sender_device_type," +
        " uds.device_account sender_device_account,uds.sound_type sender_sound_type, udt.device_token taker_device_token," +
        " udt.device_type taker_device_type,udt.device_account taker_device_account,udt.sound_type taker_sound_type " +
        " from order_info oi  left join user sender on oi.order_sender = sender.id left join user taker on oi.order_taker = taker.id " +
        " left join user_device uds on oi.order_sender = uds.user_id left join user_device udt on oi.order_taker = udt.user_id " +
        " where oi.id =? ";
    var paramArray=[],i=0;
    paramArray[i++] = params.orderId;
    if(params.takerId){
        query = query + " and oi.order_taker = ? "
        paramArray[i++] = params.takerId;
    }
    if(params.senderId){
        query = query + " and oi.order_sender = ? "
        paramArray[i++] = params.senderId;
    }
    db.dbQuery(query,paramArray,function(error,rows){
        logger.debug(' getUserOrderDevice ');
        return callback(error,rows);
    });
}

function getUserBaseDevice(params,callback){
    var query = " select u.*,ud.device_token,ud.device_type,ud.device_account,ud.sound_type " +
        " from user u left join user_device ud on u.id = ud.user_id where u.id is not null ";
    var paramArray=[],i=0;
    if(params.userId){
        query = query + " and u.id = ? "
        paramArray[i++] = params.userId;
    }
    if(params.phone){
        query = query + " and u.phone = ? "
        paramArray[i++] = params.phone;
    }
    if(params.deviceToken){
        query = query + " and ud.device_token = ? "
        paramArray[i++] = params.deviceToken;
    }
    if(params.deviceAccount){
        query = query + " and ud.device_account = ? "
        paramArray[i++] = params.deviceAccount;
    }
    if(params.deviceToken){
        query = query + " and ud.device_type = ? "
        paramArray[i++] = params.deviceType;
    }
    if(params.soundType){
        query = query + " and ud.sound_type = ? "
        paramArray[i++] = params.soundType;
    }

    db.dbQuery(query,paramArray,function(error,rows){
        logger.debug(' getUserBaseDevice ');
        return callback(error,rows);
    });
}

module.exports ={
    getUserOrderDevice : getUserOrderDevice ,
    getUserBaseDevice : getUserBaseDevice
}