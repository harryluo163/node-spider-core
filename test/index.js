const async = require('async')//流程控制，队列
const nodespider = require('./../index')
const PortalAnalysis = require('./PortalAnalysis')

function start(){
    var spider= nodespider.getInstance({
        SpiderConcurrency:1,//抓取队列并行运行值
        AnalysisConcurrency:1,//分析队列并行运行值
        DBConcurrency:1,//数据库插入队列并行运行值
        SpiderSleep:5000,
        FisrtDatUrl: {
            Url:"https://www.csdn.net/"
        }
    })

    //再次获取初始化后的爬虫，单例模式
    spider1 =nodespider.getInstance()
    console.log(spider==spider1)

    spider1.on("clsPageContent",function (task){
        console.log("处理分析队列"+task.Portal)
        console.log("内容是"+task.PContent)
        console.log("使用正则或者cheerio分析返回数据")
        console.log("获取列表****")
        console.log("加入数据库队列使用 spider.clsDB.push()  加入抓取队列 spider.clsDB.push()")
    })

    spider1.on("clsDB",function (task){
        console.log("处理数据库插入队列"+task.Portal)
        console.log("还有"+spider.clsPageUrl.length())
    })

    //当option.FisrtDatUrl.UseclsPageUrl==true 可触发这个事件，就可以自定义http请求了
    spider1.on("clsPageUrl",function (task){
        console.log("处理自定义抓取队列"+task.Portal)
        console.log("还有"+spider.clsPageUrl.length())
    })
    //触发重试 设置MaxTrySpidertimes最大失败次数 以及CheckTime 检查周期
    spider1.on("retry",function (num){
        console.log(`第${num}次重试`)

    })
    //抓取结束
    spider1.on("finish",function (task){
        console.log("抓取结束")

    })
    //请求页面错误
    spider1.on("clsPageUrlerr",function (task){
        console.log("请求页面错误")

    })



}

start()


