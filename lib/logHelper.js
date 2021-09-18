var helper = {};  
exports.helper = helper;  

var log4js = require('log4js');
// 加载配置文件  
var objConfig ={
    replaceConsole: true,
    appenders: {
        out: { type: 'console' },                          //控制台输出
        debug: {//debug日志
            type: 'dateFile',
            filename: 'logs/debug_logs/deb',       // 首先手动建好目录，写入日志文件的路径
            //maxLogSize: 1024,                        // 只在 type: 'file' 中才支持
            // 指定pattern后无限备份,pattern精确到ss(秒)就是一秒一个文件,精确到mm(分)就是一分一个文件,hh(小时),dd(天),MM(月),yyyy(年)
            pattern: 'yyyy-MM-dd.log',
            encoding: 'utf-8',                               //文件的编码
            alwaysIncludePattern: true,              // 不指定pattern时若为true会使用 默认值'.yyyy-MM-dd'

            daysToKeep:10,//时间文件 保存多少天，以前的log将被删除
            //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
        },
        err: {  //err日志
            type: 'dateFile',
            filename: 'logs/error_logs/err',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        info: {  //info日志
            type: 'dateFile',
            filename: 'logs/info_logs/info',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },

    categories: {
        //appenders:采用的appender,取appenders项,level:设置级别
        default: { appenders: ['out', 'debug'], level: 'debug' },
        err: { appenders: ['out', 'err'], level: 'error' },
        info: { appenders: ['out', 'info'], level: 'info' },

    }
};  
  
// 目录创建完毕，才加载配置，不然会出异常  
log4js.configure(objConfig);  

var logDebug = log4js.getLogger('debug');
var logInfo = log4js.getLogger('info');
var logErr = log4js.getLogger('err');

  
helper.writeDebug = function(msg){
    if(msg == null)
        msg = "";
    logDebug.debug(msg);
};

helper.writeInfo = function(msg){
    if(msg == null)  
        msg = "";  
    logInfo.info(msg);
};  


helper.writeErr = function(msg, exp){
    if(msg == null)
        msg = "";
    if(exp != null)
        msg += "\r\n" + exp;
    logErr.error(msg);
};
  
