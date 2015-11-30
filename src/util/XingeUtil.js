/**
 * Created by ling xue on 15-10-29.
 */
var xinge = require("xinge");
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('XingeUtil.js');

var ORDER_TITLE_TAKED = "订单被接受";
var ORDER_TITLE_CONFIRM = "订单被确认";
var ORDER_TITLE_CANCELLED = "订单被取消";
var ORDER_TITLE_FINISHED = "订单被完成";

var ORDER_INFO_TITLE = "订单信息";



var USER_VERIFY_TITLE_CONFIRM = "验证申请通过";
var USER_VERIFY_TITLE_REJECT = "验证申请驳回";

var ANDROID_ACTIVITY_DEFAULT = 'EntryActivity';
var ANDROID_ACTIVITY_CURRENT = 'CurrentQiangDanActivity';
var ANDROID_ACTIVITY_HISTORY = 'PaiDanHistoryDetailActivity';
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
    if(title==ORDER_TITLE_TAKED || title == ORDER_TITLE_CONFIRM){
        action.activity = ANDROID_ACTIVITY_CURRENT;
    }else if(title == ORDER_TITLE_FINISHED){
        action.activity = ANDROID_ACTIVITY_HISTORY;
    }else{
        action.activity = ANDROID_ACTIVITY_DEFAULT;
    }
    androidMessage.action = action;
    androidMessage.expireTime = 2*60*60;
    androidMessage.multiPkg = 0;
    return androidMessage;
}



function getAcceptOrderMessage(orderId,username){
    var content = " 您的派单"+orderId+"已被用户"+username+"接受，请您主动与他联系，并保持电话畅通。";
    return content;
}

function getConfirmOrderMessage(orderId){
    var content = " 您的订单"+orderId+"已被派单方接受，请访问系统查看详细信息。";
    return content;
}

function getCancelOrderMessage(orderId){
    var content = "非常抱歉,您的订单"+orderId+"已被取消，请访问系统查看详细信息";
    return content;
}

function getFinishOrderMessage(orderId,username){
    var content = "您的派单"+orderId+"已被用户"+username+"完成,请注意查收并对本次派单做出评价。";
    return content;
}

function getConfirmVerifyMessage(){
    var content = "您的注册验证已被审核通过，您可以访问奔奔集运，进行派单与抢单。";
    return content;
}

function getRejectVerifyMessage(){
    var content = "很抱歉的通知您的注册申请没有通过验证，请重新提交申请。";
    return content;
}

function getOrderContainerMessage(orderId,containerId,sealId){
    var content = "您的订单"+orderId+"已经提取集装箱和封条,集装箱号"+containerId+"和封条号"+sealId+",请您确认。";
    return content;
}


module.exports ={
    getBaseStyle : getBaseStyle ,
    getBaseAction : getBaseAction ,
    getBaseAndroidMsg : getBaseAndroidMsg ,
    getAcceptOrderMessage : getAcceptOrderMessage ,
    getCancelOrderMessage : getCancelOrderMessage ,
    getFinishOrderMessage : getFinishOrderMessage ,
    getConfirmOrderMessage : getConfirmOrderMessage ,
    ORDER_TITLE_TAKED : ORDER_TITLE_TAKED,
    ORDER_TITLE_CONFIRM : ORDER_TITLE_CONFIRM ,
    ORDER_TITLE_CANCELLED : ORDER_TITLE_CANCELLED,
    ORDER_TITLE_FINISHED : ORDER_TITLE_FINISHED ,
    ORDER_INFO_TITLE : ORDER_INFO_TITLE ,
    USER_VERIFY_TITLE_CONFIRM : USER_VERIFY_TITLE_CONFIRM ,
    USER_VERIFY_TITLE_REJECT : USER_VERIFY_TITLE_REJECT ,
    getConfirmVerifyMessage : getConfirmVerifyMessage ,
    getRejectVerifyMessage : getRejectVerifyMessage ,
    getOrderContainerMessage : getOrderContainerMessage

}