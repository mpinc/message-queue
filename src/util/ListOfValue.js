/**
 * Created by ling xue on 15-10-12.
 */

var RABBIT_QUEUE_ERROR = "error" ;
var RABBIT_QUEUE_NORMAL = "ti" ;

var MESSAGE_TYPE_SMS = "1" ;
var MESSAGE_TYPE_ORDER= "2";

var MESSAGE_SUB_TYPE_SIGNIN = "1" ;
var MESSAGE_SUB_TYPE_PASSWORD = "2";

var RABBIT_EXCHANGE = "tuoche";
var RABBIT_TOPIC_NOTIFICATION = "notification";
var RABBIT_TOPIC_ORDER = "order";

/**
 *DEVICE TYPE
 */
var DEVICE_TYPE_ANDRIOD = 1;
var DEVICE_TYPE_IOS = 2;


module.exports = {
    RABBIT_QUEUE_ERROR : RABBIT_QUEUE_ERROR,
    RABBIT_QUEUE_NORMAL : RABBIT_QUEUE_NORMAL ,
    MESSAGE_TYPE_SMS : MESSAGE_TYPE_SMS ,
    MESSAGE_TYPE_ORDER : MESSAGE_TYPE_ORDER ,
    MESSAGE_SUB_TYPE_PASSWORD : MESSAGE_SUB_TYPE_PASSWORD ,
    MESSAGE_SUB_TYPE_SIGNIN : MESSAGE_SUB_TYPE_SIGNIN,
    RABBIT_EXCHANGE : RABBIT_EXCHANGE ,
    RABBIT_TOPIC_NOTIFICATION : RABBIT_TOPIC_NOTIFICATION ,
    RABBIT_TOPIC_ORDER : RABBIT_TOPIC_ORDER ,
    DEVICE_TYPE_ANDRIOD : DEVICE_TYPE_ANDRIOD ,
    DEVICE_TYPE_IOS : DEVICE_TYPE_IOS
}