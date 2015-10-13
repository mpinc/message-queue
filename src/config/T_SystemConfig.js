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
    signTemplateId : 36776,
    pswdTemplateId : 36776 ,
    server  : 'app.cloopen.com',
    port : '8883'
}


var logLevel = 'DEBUG';
var loggerConfig = {
    appenders: [
        { type: 'console' }
        /*,{
         type: 'file',
         filename: './logs/access.log',
         maxLogSize: '4m',
         backups:4
         }*/
    ],
    replaceConsole: true
}

var rabbitUrl = 'amqp://127.0.0.1' ;


module.exports = {
    smsOptions : smsOptions ,
    rabbitUrl : rabbitUrl ,
    logLevel : logLevel ,
    loggerConfig : loggerConfig
}