/**
 * Created by ling xue on 15-10-8.
 */

var amqp = require('amqplib/callback_api');
var sysConfig = require('../config/SystemConfig.js');
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var lov = require('../util/ListOfValue.js');
var messageType = require('../util/MessageType.js');
var xingeUtil = require('../util/XingeUtil.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('QueueCon.js');
var sms = require('../bl/SMS.js');
var orderDao = require('../dao/OrderDAO.js');
var userDeviceDao = require('../dao/UserDeviceDAO.js');
var messagePush = require('../bl/MessagePush.js');

var rabbitConnect = null;
var rabbitChannel = null;
var keys = [];
keys.push(messageType.RABBIT_TOPIC_NOTIFICATION);
keys.push(messageType.RABBIT_TOPIC_ORDER);
getConnection();


function getConnection(){
    if(rabbitConnect){
        return rabbitConnect;
    }else{
        amqp.connect(sysConfig.rabbitUrl,function(error,con){
            if(error){
                logger.error("Connect rabbit error :"+error.message);
                if (con) con.close(function() { process.exit(1); });
                return null;
            }else{
                rabbitConnect = con;
                return rabbitConnect;
            }
        })
    }
}


function sendChannelMsg(msg , queue ,callback){
    if(rabbitConnect == null){
        logger.error("can not connect rabbit :" + sysMsg.SYS_MESSAGE_QUEUE_ERROR_MSG)
        return callback(sysError.InternalError,null);
    }
    rabbitConnect.createChannel(function(error,ch){
        if(error){
            logger.error("create rabbit channel error :"+error.message);
            callback(error,null);
        }else{
            ch.assertQueue(queue, {durable: false}, function(err, result) {
                if (err !== null) {
                    logger.error("create rabbit queue error :"+err.message);

                }else{
                    ch.sendToQueue(queue, new Buffer(msg));
                    logger.info(" send to rabbit success " + msg);
                }
                if(ch){ch.close();}
                callback(err,result)
            });
        }
    })
}

function receiveChannelMsg(queue,callback){
    amqp.connect(sysConfig.rabbitUrl,function(error,rabbitConnect){
        if(error){
            logger.error("Connect rabbit error :"+error.message);
            if (rabbitConnect) rabbitConnect.close(function() { process.exit(1); });
            return null;
        }else{
            rabbitConnect.createChannel(function(error,ch){
                if(error){
                    logger.error("create rabbit channel error :"+error.message);
                    callback(error,null);
                }else{
                    ch.assertExchange(messageType.RABBIT_EXCHANGE, 'topic', {durable:true});
                    ch.assertQueue('', {exclusive: true,durable:true}, function(err, ok) {
                        if (err !== null) {
                            logger.error("create rabbit queue error :"+err.message);

                        }else{
                            var queue = ok.queue,i=0;
                            function sub(err) {
                                if (err !== null) {
                                    logger.error("create rabbit queue error :"+err.message);
                                }
                                else if (i < keys.length) {
                                    ch.bindQueue(queue, messageType.RABBIT_EXCHANGE, keys[i], {durable:true}, sub);
                                    i++;
                                }
                            }
                            ch.consume(queue, doWork, {noAck: false,durable:true}, function(err) {
                                if (err !== null) {
                                    logger.error("create rabbit queue error :"+err.message);
                                }else{
                                    sub(null);
                                }
                            });
                        }
                    })
                    /*ch.assertQueue(queue, {durable: true}, function(err, result) {
                        if (err !== null) {
                            logger.error("create rabbit queue error :"+err.message);

                        }else{
                            ch.prefetch(1);
                            ch.consume(queue, doWork, {noAck: false});

                            logger.info(" send to rabbit success " );
                        }
                        callback(err,result)
                    });*/
                    function doWork(msg) {
                        var body = msg.content.toString();
                        try{
                            var msgObj = eval('('+body+')');
                            //TODO msg logic
                            logger.info("  Received Msg :"+msgObj);
                            msgDispatch(msgObj,function(error,result){
                                if(error){
                                    logger.error("receiveChannelMsg dispatch " + error.message);
                                    sendErrorMsg(msg);
                                }else{
                                    logger.info("receiveChannelMsg dispatch success " );
                                }
                                ch.ack(msg);
                            })

                        }catch(error ){
                            logger.error(error);
                            sendErrorMsg(msg);
                            ch.ack(msg);
                        }
                    }
                }
            })

        }
    })

}

function sendErrorMsg (msg){
    if(rabbitConnect == null){
        logger.error("sendErrorMsg can not connect rabbit :" + sysMsg.SYS_MESSAGE_QUEUE_ERROR_MSG);
    }
    rabbitConnect.createChannel(function(error,ch){
        if(error){
            logger.error("sendErrorMsg create rabbit channel error :"+error.message);

        }else{
            ch.assertQueue(messageType.RABBIT_QUEUE_ERROR, {durable: true}, function(err, result) {
                if (err !== null) {
                    logger.error("sendErrorMsg create rabbit queue error :"+err.message);


                }else{
                    ch.sendToQueue(messageType.RABBIT_QUEUE_ERROR, new Buffer(msg));
                    logger.info(" sendErrorMsg send to rabbit success " + msg);
                }
                if(ch){ch.close();}
            });
        }
    })
}

function msgDispatch(msg,callback){
    if(msg.type == messageType.MESSAGE_TYPE_SMS){
        if(msg.subType == messageType.MESSAGE_SUB_TYPE_SIGNIN){
            sms.sendSignSms({phone:msg.phone,code:msg.code},function(error,result){
                callback(error,result);
            })
        }else if(msg.subType == messageType.MESSAGE_SUB_TYPE_PASSWORD){
            sms.sendPasswordSms({phone:msg.phone,code:msg.code},function(error,result){
                callback(error,result);
            })
        }else if(msg.subType == messageType.MESSAGE_SUB_TYPE_VERIFY_CONFIRM){
            sms.sendConfirmVerifySms({phone:msg.phone},function(error,result){
                callback(error,result);
            })
        }else if(msg.subType == messageType.MESSAGE_SUB_TYPE_VERIFY_REJECT){
            sms.sendRejectVerifySms({phone:msg.phone},function(error,result){
                callback(error,result);
            })
        }
    }else if(msg.type == messageType.MESSAGE_TYPE_ORDER){
        userDeviceDao.getUserOrderDevice({orderId:msg.orderId},function(error,result){
            if (error !== null) {
                logger.error("query order info for message error :"+error.message);
            }else{
                if(result && result.length>0){
                    //console.log(msg.subType);
                    //console.log(messageType.MESSAGE_SUB_TYPE_ORDER_ACCEPTED);
                    //console.log(msg.subType == messageType.MESSAGE_SUB_TYPE_ORDER_ACCEPTED);
                    var androidArray =[];
                    var iosArray = [];
                    var smsArray = [];
                    if(msg.subType == messageType.MESSAGE_SUB_TYPE_ORDER_ACCEPTED){
                        sms.sendTakeOrderSms({phone:result[0].phone,orderId:msg.orderId,takeUser:result[0].taker_name,takerUserPhone:result[0].taker_phone},sendSmsCallback);
                        var content = xingeUtil.getAcceptOrderMessage(msg.orderId,result[0].taker_name +"("+result[0].taker_phone+")");
                        for(var i=0;i<result.length;i++){
                            if(result[i].sender_device_type == lov.DEVICE_TYPE_ANDRIOD ){
                                if(androidArray.indexOf(result[i].sender_device_token)<0){
                                    androidArray.push(result[i].sender_device_token);
                                    messagePush.pushToSingoAndroidDevice(
                                        {deviceToken:result[i].sender_device_token,title:xingeUtil.ORDER_TITLE_TAKED,content:content},pushAndroidCallback);
                                }
                            }else{
                                if(iosArray.indexOf(result[i].sender_device_token)<0){
                                    iosArray.push(result[i].sender_device_token);
                                    messagePush.pushToSingleIosDevice(
                                        {deviceToken:result[i].sender_device_token,title:content},pushIosCallback);
                                }
                            }
                        }
                    }else if (msg.subType == messageType.MESSAGE_SUB_TYPE_ORDER_CONFIRMED){
                        sms.sendConfirmOrderSms({phone:result[0].taker_phone,orderId:msg.orderId},sendSmsCallback);
                        var content = xingeUtil.getConfirmOrderMessage(msg.orderId);
                        for(var i=0;i<result.length;i++){
                            if(result[i].taker_device_type == lov.DEVICE_TYPE_ANDRIOD) {
                                if(androidArray.indexOf(result[i].taker_device_token)<0) {
                                    androidArray.push(result[i].taker_device_token);
                                    messagePush.pushToSingoAndroidDevice(
                                        {deviceToken:result[i].taker_device_token,title:xingeUtil.ORDER_TITLE_CONFIRM,content:content},pushAndroidCallback);
                                }
                            }else{
                                if(iosArray.indexOf(result[i].taker_device_token)<0) {
                                    iosArray.push(result[i].taker_device_token);
                                    messagePush.pushToSingleIosDevice(
                                        {deviceToken:result[i].taker_device_token,title:content},pushIosCallback);
                                }
                            }
                        }
                    } else if(msg.subType == messageType.MESSAGE_SUB_TYPE_ORDER_CANCELED){
                        sms.sendCancelledOrderSms({phone:result[0].taker_phone,orderId:msg.orderId},sendSmsCallback);
                        var content = xingeUtil.getCancelOrderMessage(msg.orderId);
                        for(var i=0;i<result.length;i++){
                            if(result[i].taker_device_type == lov.DEVICE_TYPE_ANDRIOD ) {
                                if(androidArray.indexOf(result[i].taker_device_token)<0) {
                                    androidArray.push(result[i].taker_device_token)
                                    messagePush.pushToSingoAndroidDevice(
                                        {deviceToken:result[i].taker_device_token,title:xingeUtil.ORDER_TITLE_CANCELLED,content:content},pushAndroidCallback)
                                }
                            }else{
                                if(iosArray.indexOf(result[i].taker_device_token)<0) {
                                    iosArray.push(result[i].taker_device_token)
                                    messagePush.pushToSingleIosDevice(
                                        {deviceToken:result[i].taker_device_token,title:content},pushIosCallback())
                                }
                            }
                        }
                    }else if(msg.subType == messageType.MESSAGE_SUB_TYPE_ORDER_FINISHED){
                        sms.sendFinishedOrderSms({phone:result[0].phone,orderId:msg.orderId,takeUser:result[0].taker_name,takerUserPhone:result[0].taker_phone},sendSmsCallback);
                        var content = xingeUtil.getFinishOrderMessage(msg.orderId,result[0].taker_name +"("+result[0].taker_phone+")");
                        for(var i=0;i<result.length;i++){
                            if(result[i].sender_device_type == lov.DEVICE_TYPE_ANDRIOD ) {
                                if(androidArray.indexOf(result[i].sender_device_token)<0) {
                                    androidArray.push(result[i].sender_device_token)
                                    messagePush.pushToSingoAndroidDevice(
                                        {deviceToken:result[i].sender_device_token,title:xingeUtil.ORDER_TITLE_FINISHED,content:content},pushAndroidCallback)
                                }
                            }else{
                                if(iosArray.indexOf(result[i].sender_device_token)<0) {
                                    iosArray.push(result[i].sender_device_token)
                                    messagePush.pushToSingleIosDevice(
                                        {deviceToken:result[i].sender_device_token,title:content},pushIosCallback)
                                }
                            }
                        }
                    }else if(msg.subType == messageType.MESSAGE_SUB_TYPE_ORDER_CONTAINER){
                        msg.phone = result[0].phone;
                        sms.sendOrderContainerSms(msg,sendSmsCallback);
                        var content = xingeUtil.getOrderContainerMessage(msg.orderId,msg.cabinId,msg.containerId,msg.sealId);
                        for(var i=0;i<result.length;i++){
                            if(result[i].sender_device_type == lov.DEVICE_TYPE_ANDRIOD) {
                                if( androidArray.indexOf(result[i].sender_device_token)<0) {
                                    androidArray.push(result[i].sender_device_token);
                                    messagePush.pushToSingoAndroidDevice(
                                        {deviceToken:result[i].sender_device_token,title:xingeUtil.ORDER_INFO_TITLE,content:content},pushAndroidCallback);
                                }

                            }else{
                                if( iosArray.indexOf(result[i].sender_device_token)<0) {
                                    iosArray.push(result[i].sender_device_token);
                                    messagePush.pushToSingleIosDevice(
                                        {deviceToken:result[i].sender_device_token,title:content},pushIosCallback);
                                }
                            }
                        }

                    }
                }
            }
        })
    }else if(msg.type == messageType.MESSAGE_TYPE_USER){
        userDeviceDao.getUserBaseDevice({userId:msg.userId},function(error,rows){
            if (error !== null) {
                logger.error("query user info for message error :"+error.message);
            }else{
                if(rows && rows.length>0){
                    var userPhone = rows[0].phone;
                    var userDevice = rows[0].device_token;
                    if(msg.subType == messageType.MESSAGE_SUB_TYPE_VERIFY_CONFIRM){
                        sms.sendConfirmVerifySms({phone:userPhone},sendSmsCallback)
                        var content = xingeUtil.getConfirmVerifyMessage();
                        messagePush.pushToSingoAndroidDevice({deviceToken:userDevice,title:xingeUtil.USER_VERIFY_TITLE_CONFIRM,content:content},pushAndroidCallback);
                    }else if(msg.subType == messageType.MESSAGE_SUB_TYPE_VERIFY_REJECT){
                        sms.sendRejectVerifySms({phone:userPhone},sendSmsCallback);
                        var content = xingeUtil.getRejectVerifyMessage();
                        messagePush.pushToSingoAndroidDevice({deviceToken:userDevice,title:xingeUtil.USER_VERIFY_TITLE_REJECT,content:content},pushAndroidCallback);
                    }
                }
            }
        })
    }
}

function sendSmsCallback(error,result){
    if(error){
        logger.error("sendSmsCallback" +JSON.stringify(error));
    }
}

function pushAndroidCallback(error,result){
    if(error){
        logger.error("pushAndroidCallback" +JSON.stringify(error));
    }
}

function pushIosCallback(error,result){
    if(error){
        logger.error("pushIosCallback" +JSON.stringify(error));
    }
}
module.exports = {
    sendChannelMsg : sendChannelMsg,
    receiveChannelMsg : receiveChannelMsg
}