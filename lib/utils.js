const  mkdirp = require('mkdirp');
const  fs = require('fs');
const path = require("path");
const uuid = require('uuid')
/**
 * 创建目录
 */
const mkdir = title => {
   return new Promise((resolve,reject)=>{
       if (fs.existsSync(path.dirname(title))) {
           resolve()
       }else {
           mkdirp(path.dirname(title)).then(made =>
               resolve())

       }
   })
}
//获取参数
const par2Json = (string)=> {
    let arr = []; // 存储参数的数组
    let res = {}; // 存储最终JSON结果对象
    arr = string.split('&'); // 获取浏览器地址栏中的参数
    for (let i = 0; i < arr.length; i++) { // 遍历参数
        if (arr[i].indexOf('=') != -1){ // 如果参数中有值
            let str = arr[i].split('=');
            res[str[0]] = str[1];
        } else { // 如果参数中无值
            res[arr[i]] = '';
        }
    }
    return res;

};

function sleep(ms) {
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};

/**
 *
 * @param Model Sequelize的实体
 * @returns {*} 返回json
 */
function getSequelizeModelsJSON(Model){
    let Entity = {...Model.tableAttributes};
    Object.keys(Entity).forEach(key => Entity[key]= '');
    return Entity
}
module.exports = {
    statusCode:{
        ERROR_500: (msg) => {
            return {
                code: 500,
                msg
            }
        },
        ERROR_401: (msg) => {
            return {
                code: 401,
                msg
            }
        },

        ERROR_403: (msg) => {
            return {
                code: 403,
                msg
            }
        },

        ERROR_404: (msg) => {
            return {
                code: 404,
                msg
            }
        },

        ERROR_412: (msg) => {
            return {
                code: 412,
                msg
            }
        },

        ERROR_413: (msg) => {
            return {
                code: 413,
                msg
            }
        },

        SUCCESS_200: (msg, data) => {
            return {
                code: 200,
                msg,
                data,
            }
        }
    },
    mkdir,
    par2Json,
    sleep,
    getSequelizeModelsJSON,
    uuid
}