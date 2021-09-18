# node-spider-core


[![NPM package version](https://img.shields.io/npm/v/node-spider-core?label=npm%20package)](https://www.npmjs.com/package/node-spider-core)

# 简单快捷的NodeJS爬虫队列框架

# Install

```bash
	npm install node-spider-core --save
```



# Examples:

## Initialize (INIT):

```js
const NodeCache = require( "node-spider-core" );

let spider= nodespider.getInstance()

spider.clsPageUrl.push(1)
spider.clsPageContent.push(2)
spider.clsDB.push(3)

```

### Options
- `ProgramName`: *(default:`Name`)* 应用程序名称
- `IsClearData`: *(default:`N`)* 用于执行完，是否执行存储过程清洗数据
- `EndTime`: *(default:`14`: *(default:00`)* 启动时间在这个时间之后是抓今天，否则是补抓昨天
- `MainSleepTime`: *(default:`300000`)* 主程序休眠时间
- `CheckTime`: *(default:`300000`)* 检查周期
- `BegTimeOut`: *(default:`180000`)* 开始抓取连接超时时长
- `IntervalTimeOut`: *(default:`2000`)* 抓取连接递增间隔超时时长
- `BegRWTimeOut`: *(default:`180000`)* 开始抓取读写超时时长
- `IntervalRWTimeOut`: *(default:`2000`)* 抓取读写超时递增间隔时长
- `BegSpiderIntervalTime`: *(default:`5000`)* 开始抓取间隔时长
- `IntervalSpiderIntervalTime`: *(default:`300`)* 抓取递增间隔时长
- `MaxTrySpidertimes`: *(default:`5`)* 最大失败次数
- `IntervalSpiderTime`: *(default:`200`)* 如果抓取队列中没值，间隔时间
- `IntervalAnalysisTime`: *(default:`200`)* 分析队列中没值，间隔时间
- `IntervalDBTime`: *(default:`200`)* 如果数据库插入队列中没值，间隔时间
- `IntervalLogTime`: *(default:`300000`)* 如果LogList中没值，间隔时间
- `MaxPage`: *(default:`1000`)* 分析队列中最大页面数
- `SpiderSleepTime`: *(default:`5000`)* 分析队列超过最大页面数，抓取队列休眠时间
- `MaxDepth`: *(default:`10`)* 抓取最大深度
- `NetSleepTime`: *(default:`60000`)* 网络不通，抓取线程休眠时间
- `IsSpiderHouse`: *(default:`Y`)* 是否抓取房源
- `IsSpiderBatch`: *(default:`Y`)* 是否抓取楼盘
- `IsSpiderBuildNext`: *(default:`N`)* 是否抓取楼栋翻页
- `IsSpiderRoomState`: *(default:`N`)* 是否抓取房间
- `IsSpiderRoom`: *(default:`N`)* 是否抓取房间状态
- `IsFlateImg`: *(default:`N`)* 是否抓取房源图片
- `PIndex`: *(default:`1`)* 开始页
- `PCount`: *(default:`1`)* 程序总数量
- `SpiderConcurrency`: *(default:1)* 抓取队列并行运行值
- `AnalysisConcurrency`: *(default:1)* 分析队列并行运行值
- `DBConcurrency`: *(default:1)* 数据库插入队列并行运行值
- `priority`: *(default:1)* 优先级 1.广度 2.深度 3.最佳
- `FisrtDatUrl`: *(default:DatUrl)* 开始第一个url

### Options.FisrtDatUrl
- `ID`: *(default:`uuid.v4()`)* 随机生成
- `KeyWord`: *(default:`''`)*
- `ProgramName`: *(default:`"Options.ProgramName"`)* 
- `SpiderDate`: *(default:`Options.SpiderDate`)* 抓取日期
- `PID`: *(default:`""`)*
- `SiteUrl`: *(default:`""`)* 站点url
- `SType`: *(default:`"Portal"`)* 类型·
- `SourUrl`: *(default:`""`)* 父页面路径
- `Url`: *(default:``)* 站点路径
- `UrlType`: *(default:`GET`)* 抓取方式(GET/POST/MGET)
- `UrlPara`: *(default:``)* 参数
- `EnCode`: *(default:`'UTF-8'`)* 编码方式
- `APara`: *(default:`''`)* 附加参数
- `CookieContent`: *(default:``)* Cookie值
- `AContent`: *(default:``)* 附加内容
- `PConent`: *(default:``)* 页面内容
- `ErrorMsg`: *(default:``)* 错误信息
- `TrySpiderTimes`: *(default:`1`)* 抓取次数
- `Depth`: *(default:`1`)* 抓取深度
- `SpiderTime`: *(default:`moment().format('YYYY-MM-DD HHs ss')`)* 抓取时间
- `UseclsPageUrl`: *(default:`false`)* 是否使用自己定义的请求方法，监听clsPageUrl事件


# Methods
spider.clsPageUr  //抓取队列
spider.clsPageContent //分析队列
spider.clsDB //数据库插入队列
```js
let spider= nodespider.getInstance()


// 向抓取队列插入一条。先进先出
spider.clsPageUrl.push({name: 'bar'});
// 向抓取队列插入一组
q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
    console.log('finished processing item');
});
//插到最前面 
spider.clsPageUrl.unshift({name: 'bar'}, function (err) {

});

spider.clsPageUrl.drain(function() {
    console.log('抓取队列中所有数据已经处理完');
});

// 向抓取队列插入一条。先进先出
spider.clsPageUrl.push({name: 'bar'});
// 向抓取队列插入一组
q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
    console.log('finished processing item');
});
//插到最前面 
spider.clsPageUrl.unshift({name: 'bar'}, function (err) {

});

spider.clsPageUrl.drain(function() {
    console.log('抓取队列中所有数据已经处理完');
});

```



# Events

## clsPageUrl


```js
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

//触发重试
spider.on("retry",function (num){
    console.log('第'+num+'次抓取完成')
})

spider.on("finish",function (){
    console.log("抓取结束")
})


```

