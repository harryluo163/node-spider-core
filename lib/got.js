const got = require("got");
const {mkdir,par2Json} = require("./utils");
const fs = require("fs");
const {CookieJar} = require('tough-cookie');
const {promisify} = require('util');

/**
 *
 * @param SourceUrl 源页面
 * @param UrlStr 请求页面
 * @param EnCode 编码
 * @param CookieContainer  如果有cookie就加
 * @param proxy 代理
 * @constructor
 */
function  GetUrlInfByGet(SourceUrl,UrlStr,EnCode,CookieContainer,proxy){
    return new Promise(async(resolve,reject)=>{
        var option={}
        const cookieJar = new CookieJar()
        if(CookieContainer){
            const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));
            await setCookie(CookieContainer, SourceUrl);
        }
        const response =await got(encodeURI(UrlStr),{cookieJar})
            .on('error',  (error)=>{
                reject(error)//抛出请求error
            });
        resolve(response.body)
    })

}

/*
{
    "bid": "",
    "fid": "",
    "nc": "",
    "QYJG": "8ba5c404-9e1c-4c83-8bea-3231c3c0446c",
    "type": "1",
    "Accuracy": "false"
}
*/

function  getUrlInfByPost(SourceUrl,UrlStr,postDataStr,EnCode,CookieContainer,proxy){
    return new Promise(async(resolve,reject)=>{
        var option={}
        const cookieJar = new CookieJar()
        if(CookieContainer){
            const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));
            await setCookie(CookieContainer, SourceUrl);
        }
        const response =await got.post(encodeURI(UrlStr),{
            form: par2Json(postDataStr),
        }).on('error',  (error)=>{
                reject(error)//抛出请求error
            });
        resolve(response.body)
    })

}

/**
 *
 * @param file 文件路径
 * @param UrlStr 链接
 * @param CookieContainer 如果有cookie就加
 * @param proxy 如果有代理就加
 * @returns {Promise<unknown>}
 */
function  getUrlImg(file,UrlStr,CookieContainer,proxy){
    return new Promise(async (resolve,reject)=>{
            await mkdir(file);//根据文件路径创建目录
            var option={}
            if(UrlStr!=""){
                const cookieJar = new CookieJar()
                const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));
                await setCookie('foo=bar', 'https://example.com');
                option={cookieJar}
            }
            const readstream =await got.stream(encodeURI(UrlStr))
                .on('error',  (error)=>{
                    reject(error)//抛出请求error
                });
            if(readstream){//文件保存
                const writestream =fs.createWriteStream(file);
                writestream.on('finish', (src) => {
                    resolve('');
                });
                writestream.on('error', (error) => {
                    reject(error)//抛出保存文件error
                });
                readstream.pipe(writestream)
            }
    })

}

module.exports={
    getUrlImg,
    GetUrlInfByGet,
    getUrlInfByPost
}