const async = require('async')//流程控制，队列
const nodespider = require('./../index')
const getothermodule = require('./getothermodule')

// var i=0;
// async.retry({times: 3, interval: 1000}, apiMethod, function(err, result) {
//     // do something with the result
// });
//
// async function apiMethod(){
//     // console.log(i)
//     i++;
//     await Promise.reject(new Error("触发重试!"));
//
// }

/*
function sleep(ms) {
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};

const  clsDB1 = async.queue(async function (dbEntity,cb) {
    await  sleep(5000)
    console.log("zhix")
    new Error("触发重试!");
},2)

const  clsDB2 = async.queue(async function (dbEntity) {

})

 function apiMethod2(){
    let i =0;
   setInterval(function (){
       for (let j = 0; j <10 ; j++) {
           clsDB1.push(j)
       }

       i++
   },200000)


 }
//
apiMethod2()
*/

// //队列监控，内存监控
// setInterval(  function () {
//     var mem = process.memoryUsage();
//     console.log(`抓取队列 ${clsDB1.length()}`)
//     console.log('Process: heapTotal '+formatMB(mem.heapTotal) + ' heapUsed ' +formatMB(mem.heapUsed)+ ' rss ' + formatMB(mem.rss))
//
// }, 1000);
//
//
//
// function formatMB(bytes){
//     return (bytes/1024/1024).toFixed(2)+'MB';
// }

//
//
// const  clsDB1 = async.queue(  function (dbEntity) {
//     dosth(dbEntity)
// },2)
//
// async function dosth(dbEntity){
//     return new Promise((resolve,reject)=>{
//         console.log(1);
//         if(true){
//             resolve('')
//         }else{
//             reject('')
//         }
//         // callback()
//     })
// }
//
// async function apiMethod2(){
//     for (let j = 0; j <10 ; j++) {
//         clsDB1.push(j)
//     }
//
//
// }
// clsDB1.drain(function() {
//      console.log('all items have been processed');
//  });

// apiMethod2()





function change(){

    var spider= nodespider.getInstance({
        SpiderConcurrency:1,//抓取队列并行运行值
        AnalysisConcurrency:1,//分析队列并行运行值
        DBConcurrency:1,//数据库插入队列并行运行值
        SpiderSleep:5000,
    })

    setInterval(function (){
        spider.clsPageUrl.push(1)
        spider.clsPageContent.push(2)
        spider.clsDB.push(3)
    },110)

    getothermodule()





}

  change()


