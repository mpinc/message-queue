/**
 * Created by ling xue on 15-10-10.
 */
var sysError = require('./util/SystemError.js');
var sysMsg = require('./util/SystemMsg.js');
var messagePush = require('./bl/MessagePush.js');
var listOfValue = require('./util/ListOfValue.js');
var serverLogger = require('./util/ServerLogger.js');
var logger = serverLogger.createLogger('worker.js');

var rq = require('./connection/QueueCon.js');

rq.receiveChannelMsg(listOfValue.RABBIT_QUEUE_NORMAL,function(error,result){
    if (error) {
        logger.error(' listen ti message queue ' + error.message);
        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
    } else {
        logger.info('success ' +result);
    }
});

rq.receiveFhuChannelMsg(listOfValue.RABBIT_QUEUE_FOR_FHU,function(error,result){
    if (error) {
        logger.error(' listen flyhighus message queue ' + error.message);
        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
    } else {
        logger.info('success ' +result);
    }
});

rq.receiveChumuuChannelMsg(listOfValue.RABBIT_QUEUE_FOR_CHUMUU,function(error,result){
    if (error) {
        logger.error(' listen chumuu message queue ' + error.message);
        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
    } else {
        logger.info('success ' +result);
    }
});
/*var paramsObj = {
    title : '订单被接受',
    content : '您的派单{1}已被用户{2}接受，请您主动与他联系，并保持电话畅通。',
    deviceToken : '123755228ce8d5b848dc90574b9181396c00a08d'
};
messagePush.pushToSingoAndroidDevice(paramsObj,function(error,result){
    console.log(error);
    console.log(result);
});*/

logger.info("TuoChe message queue start at "+ new Date());