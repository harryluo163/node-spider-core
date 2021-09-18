(function() {
    var EventEmitter, NodeSpiderCore,async;
    EventEmitter = require('events').EventEmitter;
    async = require("async");

    module.exports = NodeSpiderCore = (function() {
        class NodeSpiderCore extends EventEmitter{
            constructor(options = {}) {
                super();
                this.options = options;
                this.options = Object.assign({
                    ProgramName:'Name',//应用程序名称
                    IsClearData:'N',//用于执行完，是否执行存储过程清洗数据
                    EndTime:'14:00',//启动时间在这个时间之后是抓今天，否则是补抓昨天
                    MainSleepTime:'300000',//主程序休眠时间
                    CheckTime:'300000',//检查周期
                    BegTimeOut:'180000',//开始抓取连接超时时长
                    IntervalTimeOut:'2000',//抓取连接递增间隔超时时长
                    BegRWTimeOut:'180000',//开始抓取读写超时时长
                    IntervalRWTimeOut:'2000',//抓取读写超时递增间隔时长
                    BegSpiderIntervalTime:'5000',//开始抓取间隔时长
                    IntervalSpiderIntervalTime:'300',//抓取递增间隔时长
                    MaxTrySpidertimes:'5',//最大失败次数
                    IntervalSpiderTime:'200',//如果抓取队列中没值，间隔时间
                    IntervalAnalysisTime:'200',//分析队列中没值，间隔时间
                    IntervalDBTime:'200',//如果数据库插入队列中没值，间隔时间
                    IntervalLogTime:'300000',//如果LogList中没值，间隔时间
                    MaxPage:'1000',//分析队列中最大页面数
                    SpiderSleepTime:'5000',//分析队列超过最大页面数，抓取队列休眠时间
                    MaxDepth:'10',//抓取最大深度
                    NetSleepTime:'60000',//网络不通，抓取线程休眠时间
                    IsSpiderHouse:'Y',//是否抓取房源
                    IsSpiderBatch:'Y',//是否抓取楼盘
                    IsSpiderBuildNext:'N',//是否抓取楼栋翻页
                    IsSpiderRoomState:'N',//是否抓取房间
                    IsSpiderRoom:'N',//是否抓取房间状态
                    IsFlateImg:'N',//是否抓取房源图片
                    PIndex:'1',//PIndex
                    PCount:'1',//程序总数量
                    SpiderConcurrency:1,//抓取队列并行运行值
                    AnalysisConcurrency:1,//分析队列并行运行值
                    DBConcurrency:1,//数据库插入队列并行运行值
                    priority:1,//优先级 1.广度 2.深度 3.最佳
                }, this.options);
                this.CurrSpiderTimes=1;//抓取次数
                this.clsPageUrl=async.queue(  async (task,callback) => {

                    try {
                        let PContent=""
                        switch (task.UrlType) {
                            case "GET":
                                PContent= await  GetUrlInfByGet(task.SourUrl, task.Url, task.EnCode,task.CookieContent, task.proxy)
                                task.CookieContent = task.CookieContent;
                                task.PContent = PContent;
                                clsPageContent.push(task)

                                break;
                            case "POST":
                                PContent= await  getUrlInfByPost(task.SourUrl, task.Url,task.UrlPara, task.EnCode,task.CookieContent, task.proxy)
                                task.PContent = PContent;
                                clsPageContent.push(task)
                                break;
                            case "MGET":
                                PContent= await getUrlImg(task.AContent, task.Url, '12', task.proxy)
                                task.PContent = PContent;
                                clsPageContent.push(task)
                                break;
                        }

                    } catch (err) {
                        this.emit("clsPageUrlerr", {err:err,msg:'抓取数据失败' + task.UrlType + ";" + task.Url + ";"});
                        SaveUrl(task,'抓取数据失败')

                    }

                    this.emit("clsPageUrl",task);
                    await sleep(this.options.BegSpiderIntervalTime+this.options.IntervalSpiderIntervalTime+this.CurrSpiderTimes)
                },this.options.SpiderConcurrency);//抓取队列
                this.clsPageContent = async.queue(async (task) => {
                    try{
                        this.emit("clsPageContent",task);
                    }catch (err) {

                    }

                },this.options.AnalysisConcurrency);//分析队列
                this.clsDB = async.queue(async  (task) => {
                    try{
                        this.emit("clsDB",task);
                    } catch (err) {

                    }
                },this.options.DBConcurrency);//数据库插入操作队列
            } //构造方法

            //使用静态函数获取单例模式
            static getInstance(options){
                if(!NodeSpiderCore.instance){
                    NodeSpiderCore.instance=new NodeSpiderCore(options)
                }
                return NodeSpiderCore.instance
            }

        }

        return NodeSpiderCore;
    })();


    function sleep(ms) {
        return new Promise(resolve =>setTimeout(() =>resolve(), ms));
    };
}).call(this);
