const nodespider = require('./../index')

function cname(){
    setInterval( async function () {
        let spider =nodespider.getInstance()
        spider.on("clsPageUrl",function (task){
            console.log("处理"+task)
            console.log("还有"+spider.clsPageUrl.length())
        })
        spider.on("clsPageContent",function (task){
            console.log("处理"+task)
            console.log("还有"+spider.clsPageUrl.length())
        })
        spider.on("clsDB",function (task){
            console.log("处理"+task)
            console.log("还有"+spider.clsPageUrl.length())
        })

    }, 1000)
}


module.exports=cname