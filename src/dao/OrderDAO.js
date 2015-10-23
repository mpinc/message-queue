/**
 * Created by ling xue on 15-10-23.
 */

var db=require('../connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('OrderDAO.js');

function queryOrderWithUser(params,callback){
    var query = "select oi.*,sender.name sender_name,sender.phone sender_phone, " +
        " taker.name taker_name,taker.phone taker_phone " +
        " from order_info oi  left join user sender on oi.order_sender = sender.id " +
        " left join user taker on oi.order_taker = taker.id where oi.id =? ";
    var paramArray=[],i=0;
    paramArray[i] = params.orderId;
    db.dbQuery(query,paramArray,function(error,rows){
        logger.debug(' queryOrderWithUser ');
        return callback(error,rows);
    });
}

module.exports ={
    queryOrderWithUser : queryOrderWithUser
}