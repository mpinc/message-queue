/**
 * Created by ling xue on 15-10-9.
 */

var smsOptions = {
    action : 'SMS/TemplateSMS',
    accountType : 'Accounts',
    accountSID : 'aaf98f894f4fbec2014f6c943d4d135b',
    accountToken : '29ef088c9cc740908f96eec00ba2354c',
    appSID : '8a48b5514fba2f87014fceb947232c47',
    appToken : 'bb59e452d89e2fce47be409324d192ef',
    signTemplateId : 37356,
    pswdTemplateId : 37351 ,
    takedTemplateId : 43284 ,
    confirmTemplateId : 45793 ,
    cancelledTemplateId : 43285 ,
    finishedTemplateId : 44175 ,
    confirmVerifyTemplateId : 45911,
    rejectVerifyTemplateId : 45912,
    orderContainerTemplateId : 45934,
    server  : 'app.cloopen.com',
    port : '8883'
}


var logLevel = 'DEBUG';
var loggerConfig = {
    appenders: [
        { type: 'console' }
        ,{
         type: 'file',
         filename: '/var/log/tuoche/message.log',
         maxLogSize: '4m',
         backups:4
         }
    ],
    replaceConsole: true
}

var rabbitUrl = 'amqp://127.0.0.1' ;

var mysqlConnectOptions ={
    user: 'ti',
    password: 'tuoche',
    database:'ti',
    host: '123.57.11.150' ,
    charset : 'utf8mb4'
    //,dateStrings : 'DATETIME'
};

var xingeOptions = {
    accessId : 2100157755 ,
    accessKey : "AHV1BV7796TC" ,
    secretKey : "c1cac06f25844315990ce605d388fe8a",
    packageName : "com.mp.tuoche"
}

var iosPushConfig ={
    production: false,
    cert: 'E:/WebStormWorkSpace/bizwise/cert.pem',
    key : 'E:/WebStormWorkSpace/bizwise/key.pem',
    gateway: 'gateway.sandbox.push.apple.com' ,
    messageFrom : '奔奔集运'
}


module.exports = {
    smsOptions : smsOptions ,
    rabbitUrl : rabbitUrl ,
    logLevel : logLevel ,
    loggerConfig : loggerConfig ,
    mysqlConnectOptions: mysqlConnectOptions,
    xingeOptions : xingeOptions ,
    iosPushConfig : iosPushConfig
}