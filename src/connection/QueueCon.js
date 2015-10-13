/**
 * Created by ling xue on 15-10-8.
 */

var amqp = require('amqplib/callback_api');
var sysConfig = require('../config/SystemConfig.js');
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var lov = require('../util/ListOfValue.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('QueueCon.js');
var sms = require('../bl/SMS.js');

var rabbitConnect = null;
var rabbitChannel = null;
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
                    ch.assertQueue(queue, {durable: true}, function(err, result) {
                        if (err !== null) {
                            logger.error("create rabbit queue error :"+err.message);

                        }else{
                            ch.prefetch(1);
                            ch.consume(queue, doWork, {noAck: false});

                            logger.info(" send to rabbit success " );
                        }
                        callback(err,result)
                    });
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
            ch.assertQueue(lov.RABBIT_QUEUE_ERROR, {durable: true}, function(err, result) {
                if (err !== null) {
                    logger.error("sendErrorMsg create rabbit queue error :"+err.message);


                }else{
                    ch.sendToQueue(lov.RABBIT_QUEUE_ERROR, new Buffer(msg));
                    logger.info(" sendErrorMsg send to rabbit success " + msg);
                }
                if(ch){ch.close();}
            });
        }
    })
}

function msgDispatch(msg,callback){
    if(msg.type == lov.MESSAGE_TYPE_SMS){
        if(msg.subType == lov.MESSAGE_SUB_TYPE_SIGNIN){
            sms.sendSignSms({phone:msg.phone,code:msg.code},function(error,result){
                callback(error,result);
            })
        }
        if(msg.subType == lov.MESSAGE_SUB_TYPE_PASSWORD){
            sms.sendPasswordSms({phone:msg.phone,code:msg.code},function(error,result){
                callback(error,result);
            })
        }
    }
}

module.exports = {
    sendChannelMsg : sendChannelMsg,
    receiveChannelMsg : receiveChannelMsg
}