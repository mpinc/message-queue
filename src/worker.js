/**
 * Created by ling xue on 15-10-10.
 */
var sysError = require('./util/SystemError.js');
var sysMsg = require('./util/SystemMsg.js');
var listOfValue = require('./util/ListOfValue.js');
var serverLogger = require('./util/ServerLogger.js');
var logger = serverLogger.createLogger('worker.js');

var rq = require('./connection/QueueCon.js');

rq.receiveChannelMsg(listOfValue.RABBIT_QUEUE_NORMAL,function(error,result){
    if (error) {
        logger.error(' createOrder ' + error.message);
        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
    } else {
        logger.info('success ' +result);
    }
});