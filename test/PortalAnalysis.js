const nodespider = require('./../index')

function status(){
    let spider =nodespider.getInstance()

    spider.on("clsPageUrl",function (task){
        console.log("处理自定义抓取队列"+task.Portal)
        console.log("还有"+spider.clsPageUrl.length())
    })
    spider.on("clsPageContent",function (task){
        console.log("处理分析队列"+task.Portal)
        console.log("内容是"+task.PContent)
        console.log("使用正则或者cheerio分析返回数据")
        console.log("获取列表****")
        console.log("加入数据库队列使用 spider.clsDB.push()  加入抓取队列 spider.clsDB.push()")
    })
    spider.on("clsDB",function (task){
        console.log("处理数据库插入队列"+task.Portal)
        console.log("还有"+spider.clsPageUrl.length())
    })


}


module.exports=status