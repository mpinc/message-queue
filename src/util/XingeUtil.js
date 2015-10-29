/**
 * Created by ling xue on 15-10-29.
 */
var xinge = require("Xinge");
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('XingeUtil.js');

var ORDER_TITLE_TAKED = "订单被接受";
var ORDER_TITLE_CANCELLED = "订单被取消";
var ORDER_TITLE_FINISHED = "订单被完成";

function getBaseStyle(){
    var style = new xinge.Style();
    style.ring = 1;
    style.vibrate = 1;
    style.light = 1;
    style.builderId = 77;
    return style;
}

function getBaseAction(){
    var action = new xinge.ClickAction();
    action.actionType = xinge.ACTION_TYPE_ACTIVITY;
    action.activity = "EntryActivity";
    return action;
}

function getBaseAndroidMsg(title,content,style,action){
    var androidMessage = new xinge.AndroidMessage();
    androidMessage.type = xinge.MESSAGE_TYPE_NOTIFICATION;
    androidMessage.title = title;
    androidMessage.content = content;
    androidMessage.style = style;
    androidMessage.action = action;
    androidMessage.expireTime = 2*60*60;
    androidMessage.multiPkg = 0;
    return androidMessage;
}



function getAcceptOrderMessage(orderId,username){
    var content = " 您的派单"+orderId+"已被用户"+username+"接受，请您主动与他联系，并保持电话畅通。";
    return content;
}

function getCancelOrderMessage(orderId){
    var content = "非常抱歉,您的派单"+orderId+"已被取消，请访问系统查看详细信息";
    return content;
}

function getFinishOrderMessage(orderId,username){
    var content = "您的派单"+orderId+"已被用户"+username+"完成,请注意查收并对本次派单做出评价。"
    return content;
}


module.exports ={
    getBaseStyle : getBaseStyle ,
    getBaseAction : getBaseAction ,
    getBaseAndroidMsg : getBaseAndroidMsg ,
    getAcceptOrderMessage : getAcceptOrderMessage ,
    getCancelOrderMessage : getCancelOrderMessage ,
    getFinishOrderMessage : getFinishOrderMessage ,
    ORDER_TITLE_TAKED : ORDER_TITLE_TAKED,
    ORDER_TITLE_CANCELLED : ORDER_TITLE_CANCELLED,
    ORDER_TITLE_FINISHED : ORDER_TITLE_FINISHED

}