(function () {
    var EventEmitter, NodeSpiderCore, async;
    EventEmitter = require('events').EventEmitter;
    async = require("async");
    const {Sequelize, DataTypes} = require('sequelize');
    const {getUrlImg, GetUrlInfByGet, getUrlInfByPost} = require('./got')
    const moment = require("moment");
    const uuid = require('uuid')
    module.exports = NodeSpiderCore = (function () {
        class NodeSpiderCore extends EventEmitter {
            constructor(options = {}) {
                super();
                this.options = Object.assign({
                    ProgramName: 'Name',//应用程序名称
                    IsClearData: 'N',//用于执行完，是否执行存储过程清洗数据
                    EndTime: '14:00',//启动时间在这个时间之后是抓今天，否则是补抓昨天
                    MainSleepTime: '300000',//主程序休眠时间
                    CheckTime: '3000',//检查周期
                    BegTimeOut: '180000',//开始抓取连接超时时长
                    IntervalTimeOut: '2000',//抓取连接递增间隔超时时长
                    BegRWTimeOut: '180000',//开始抓取读写超时时长
                    IntervalRWTimeOut: '2000',//抓取读写超时递增间隔时长
                    BegSpiderIntervalTime: '5000',//抓取间隔时长
                    IntervalSpiderIntervalTime: '300',//重抓抓取递增间隔时长
                    MaxTrySpidertimes: '5',//最大失败次数
                    IntervalSpiderTime: '200',//如果抓取队列中没值，间隔时间
                    IntervalAnalysisTime: '200',//分析队列中没值，间隔时间
                    IntervalDBTime: '200',//如果数据库插入队列中没值，间隔时间
                    IntervalLogTime: '300000',//如果LogList中没值，间隔时间
                    MaxPage: '1000',//分析队列中最大页面数
                    SpiderSleepTime: '5000',//分析队列超过最大页面数，抓取队列休眠时间
                    MaxDepth: '10',//抓取最大深度
                    NetSleepTime: '60000',//网络不通，抓取线程休眠时间
                    IsSpiderHouse: 'Y',//是否抓取房源
                    IsSpiderBatch: 'Y',//是否抓取楼盘
                    IsSpiderBuildNext: 'N',//是否抓取楼栋翻页
                    IsSpiderRoomState: 'N',//是否抓取房间
                    IsSpiderRoom: 'N',//是否抓取房间状态
                    IsFlateImg: 'N',//是否抓取房源图片
                    PIndex: '1',//PIndex
                    PCount: '1',//程序总数量
                    SpiderConcurrency: 1,//抓取队列并行运行值
                    AnalysisConcurrency: 1,//分析队列并行运行值
                    DBConcurrency: 1,//数据库插入队列并行运行值
                    priority: 1,//优先级 1.广度 2.深度 3.最佳
                    mydb: new Sequelize({
                        host: 'localhost',
                        dialect: 'sqlite',
                        pool: {
                            max: 2000,//池中最大连接数
                            acquire: 300000,//该池在抛出错误之前尝试获取连接的最长时间（以毫秒为单位）
                            idle: 100000//连接在被释放之前可以空闲的最长时间（以毫秒为单位）。
                        },
                        operatorsAliases: 0,
                        logging: 0,
                        storage: './database.sqlite'
                    }),
                    SpiderDate: moment().format('YYYY-MM-DD'),

                }, options);
                if (options.FisrtDatUrl) {
                    this.options.FisrtDatUrl = Object.assign({
                        ID: uuid.v4(),
                        KeyWord: '',
                        ProgramName: options.ProgramName,
                        SpiderDate: options.SpiderDate,
                        PID: "",// 父编号
                        SiteUrl: "",// 站点路径
                        SType: "Portal",// 类型
                        SourUrl: "",// 父页面路径
                        Url: "",// 页面路径
                        UrlType: "GET",// 抓取方式(GET/POST/MGET)
                        UrlPara: "",// 参数
                        EnCode: 'UTF-8',// 编码方式
                        APara: '',// 附加参数
                        CookieContent: "",// Cookie值
                        AContent: "",
                        PConent: "",//  页面内容
                        ErrorMsg: "",
                        TrySpiderTimes: 1,// 抓取次数
                        Depth: "1",
                        SpiderTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        UseclsPageUrl: false
                    }, options.FisrtDatUrl)
                }
                this.CurrSpiderTimes = 1;//抓取次数
                this.clsPageUrl = async.queue(async (task) => {
                    return new Promise(async (resolve, reject) => {
                        await this.sleep(Number(this.options.BegSpiderIntervalTime) + (Number(this.options.IntervalSpiderIntervalTime)-1) * Number(this.CurrSpiderTimes))
                        if (!task.UseclsPageUrl) {
                            try {
                                let PContent = ""
                                switch (task.UrlType) {
                                    case "GET":
                                        PContent = await GetUrlInfByGet(task.SourUrl, task.Url, task.EnCode, task.CookieContent, task.proxy)
                                        task.CookieContent = task.CookieContent;
                                        task.PContent = PContent;
                                        this.clsPageContent.push(task)

                                        break;
                                    case "POST":
                                        PContent = await getUrlInfByPost(task.SourUrl, task.Url, task.UrlPara, task.EnCode, task.CookieContent, task.proxy)
                                        task.PContent = PContent;
                                        this.clsPageContent.push(task)
                                        break;
                                    case "MGET":
                                        PContent = await getUrlImg(task.AContent, task.Url, '12', task.proxy)
                                        task.PContent = PContent;
                                        this.clsPageContent.push(task)
                                        break;
                                }
                            } catch (err) {
                                this.emit("clsPageUrlerr", {
                                    err: err,
                                    msg: '抓取数据失败' + task.UrlType + ";" + task.Url + ";"
                                });
                                this.SaveUrl(task, '抓取数据失败')
                            } finally {
                                resolve()
                            }
                        } else {
                            this.emit("clsPageUrl", task, resolve);
                        }

                    })
                }, this.options.SpiderConcurrency);//抓取队列
                this.clsPageContent = async.queue(async (task) => {
                    return new Promise(async (resolve, reject) => {
                        this.emit("clsPageContent", task, resolve, reject);
                    })
                }, this.options.AnalysisConcurrency);//分析队列
                this.clsDB = async.queue(async (task) => {
                    return new Promise(async (resolve, reject) => {
                        this.emit("clsDB", task, resolve, reject);
                    })
                }, this.options.DBConcurrency);//数据库插入操作队列
                //抓取结束
                this.emit("start");
                let _this = this;
                let now=moment().format('YYYY-MM-DD HH:mm:ss');
                if(this.options.mydb.options.dialect=="mssql"){
                    now= Sequelize.Sequelize.fn('getdate')
                }
                //如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
                _this.DatStatus(_this.options.mydb).sync().then(async function (){
                    await _this.DatUrl(_this.options.mydb).sync();
                    await _this.DatStatus(_this.options.mydb).create({
                        ID:uuid.v4(),
                        SpiderDate:_this.options.SpiderDate,
                        ProgramName:_this.options.ProgramName,
                        RunStatus:'Run',
                        TrySpiderTimes:'1',
                        BegDate: now
                    })
                    async.retry({times: _this.options.MaxTrySpidertimes, interval: 1000}, async () => {
                        return new Promise(async (resolve, reject) => {
                            if (_this.options.FisrtDatUrl.Url != '' && _this.CurrSpiderTimes == 1) {
                                _this.clsPageUrl.push(_this.options.FisrtDatUrl)
                            } else {
                                const [results, metadata] = await _this.options.mydb.query(_this.GetUrlPortal());
                                if (metadata == 0) {
                                    _this.emit("err", {err: "数据库DatUrl或者FisrtDatUrl参数为空", msg: '请填写入口url'});

                                } else {
                                    for (let i = 0; i < results.length; i++) {
                                        let pageUrlEntity = {};
                                        pageUrlEntity.ID = uuid.v4();
                                        pageUrlEntity.KeyWord = results[i]["KeyWord"];
                                        pageUrlEntity.ProgramName = results[i]["ProgramName"];
                                        pageUrlEntity.SpiderDate = _this.options.SpiderDate;
                                        pageUrlEntity.PID = results[i]["PID"];
                                        pageUrlEntity.SType = results[i]["SType"];
                                        pageUrlEntity.SiteUrl = results[i]["SiteUrl"];
                                        pageUrlEntity.SourUrl = results[i]["SourUrl"];
                                        pageUrlEntity.Url = results[i]["Url"];
                                        pageUrlEntity.UrlType = results[i]["UrlType"];
                                        pageUrlEntity.UrlPara = results[i]["UrlPara"];
                                        pageUrlEntity.EnCode = results[i]["EnCode"];
                                        pageUrlEntity.APara = results[i]["APara"];
                                        pageUrlEntity.CookieContent = results[i]["CookieContent"];
                                        pageUrlEntity.AContent = results[i]["AContent"];
                                        pageUrlEntity.TrySpiderTimes = results[i]["TrySpiderTimes"];
                                        pageUrlEntity.Depth = results[i]["Depth"];
                                        pageUrlEntity.SpiderTime = now;
                                        _this.clsPageUrl.push(pageUrlEntity)
                                    }
                                }

                            }

                            //判断是否结束
                            var over = setInterval(async function () {
                                if (_this.clsPageUrl.length() == _this.clsPageContent.length() == _this.clsDB.length() == 0) {
                                    _this.emit("retry", _this.CurrSpiderTimes);

                                    clearInterval(over);
                                    _this.CurrSpiderTimes++
                                    await reject(new Error("触发重试!"));
                                }
                            }, _this.options.CheckTime)

                        })
                    }, function (err, result) {
                        //记录结束
                        _this.DatStatus(_this.options.mydb).update({
                            TrySpiderTimes: _this.CurrSpiderTimes,
                            EndDate:new Date(),
                            RunStatus:'Complete'
                        }, {
                            where: {
                                ProgramName: _this.options.ProgramName,
                                SpiderDate:_this.options.SpiderDate
                            }
                        });
                        //抓取结束
                        _this.emit("finish");

                    });
                })




            } //构造方法

            //使用静态函数获取单例模式
            static getInstance(options) {
                if (!NodeSpiderCore.instance) {
                    NodeSpiderCore.instance = new NodeSpiderCore(options)
                }
                return NodeSpiderCore.instance
            }

            sleep(ms) {
                return new Promise(resolve => setTimeout(() => resolve(), ms));
            };

            GetUrlPortal() {
                var SqlStr = "SELECT ID,KeyWord,ProgramName,SpiderDate,PID,SType,SiteUrl,SourUrl,Url,UrlType,UrlPara,EnCode,APara,CookieContent" +
                    ",AContent,PConent,TrySpiderTimes,Depth,SpiderTime  FROM DatUrl WHERE ProgramName='" + this.options.ProgramName +
                    "' and TrySpiderTimes=" + this.CurrSpiderTimes;
                if (this.CurrSpiderTimes > 1) {
                    SqlStr = "SELECT ID,KeyWord,ProgramName,SpiderDate,PID,SType,SiteUrl,SourUrl,Url,UrlType,UrlPara,EnCode,APara,CookieContent" +
                        ",AContent,PConent,TrySpiderTimes,Depth,SpiderTime  FROM DatUrl WHERE ProgramName='" + this.options.ProgramName +
                        "' and TrySpiderTimes=" + this.CurrSpiderTimes + " and SpiderDate='" + this.options.SpiderDate + "'";
                } else if (this.CurrSpiderTimes < 4 && this.CurrSpiderTimes > 1) {
                    SqlStr = "SELECT ID,KeyWord,ProgramName,SpiderDate,PID,SType,SiteUrl,SourUrl,Url,UrlType,UrlPara,EnCode,APara,CookieContent" +
                        ",AContent,PConent,TrySpiderTimes,Depth,SpiderTime  FROM DatUrl WHERE ProgramName='" + this.options.ProgramName +
                        "' and TrySpiderTimes=" + this.CurrSpiderTimes + " and SpiderDate='" + this.options.SpiderDate + "' and ErrorMsg NOT LIKE '%分析数据失败%'";
                }

                return SqlStr;
            }

            SaveUrl(clsDB, pageUrlEntity, ErrorMsg) {
                let urlEntity = {}
                urlEntity.ID = pageUrlEntity.ID;
                urlEntity.KeyWord = pageUrlEntity.KeyWord;
                urlEntity.ProgramName = pageUrlEntity.ProgramName;
                urlEntity.SpiderDate = pageUrlEntity.SpiderDate;
                urlEntity.PID = pageUrlEntity.PID;
                urlEntity.SiteUrl = pageUrlEntity.SiteUrl;
                urlEntity.SType = pageUrlEntity.SType;
                urlEntity.SourUrl = pageUrlEntity.SourUrl;
                urlEntity.Url = pageUrlEntity.Url;
                urlEntity.UrlType = pageUrlEntity.UrlType;
                urlEntity.UrlPara = pageUrlEntity.UrlPara;
                urlEntity.EnCode = pageUrlEntity.EnCode;
                urlEntity.APara = pageUrlEntity.APara;
                urlEntity.CookieContent = pageUrlEntity.CookieContent;
                urlEntity.AContent = pageUrlEntity.AContent;
                urlEntity.PConent = pageUrlEntity.PContent;
                urlEntity.ErrorMsg = ErrorMsg;
                urlEntity.TrySpiderTimes = pageUrlEntity.TrySpiderTimes + 1;
                urlEntity.Depth = pageUrlEntity.Depth;
                urlEntity.SpiderTime = pageUrlEntity.SpiderTime;
                this.DatUrl(this.options.mydb).create(urlEntity)
            }

            DatUrl(mydb) {
                return mydb.define('DatUrl', {
                    ID: {
                        type: DataTypes.STRING(36),
                        allowNull: false,
                        primaryKey: true
                    },
                    KeyWord: {
                        type: DataTypes.STRING(500),
                        allowNull: true
                    },
                    ProgramName: {
                        type: DataTypes.STRING(100),
                        allowNull: true,
                    },
                    SpiderDate: {
                        type: DataTypes.STRING(10),
                        allowNull: false,
                    },
                    PID: {
                        type: DataTypes.STRING(36),
                        allowNull: true,
                    },
                    SType: {
                        type: DataTypes.STRING(50),
                        allowNull: true,
                    },
                    SiteUrl: {
                        type: DataTypes.STRING(2000),
                        allowNull: true,
                    },
                    SourUrl: {
                        type: DataTypes.STRING(2000),
                        allowNull: true,
                    },
                    Url: {
                        type: DataTypes.STRING(2000),
                        allowNull: false,
                    },
                    UrlType: {
                        type: DataTypes.STRING(50),
                        allowNull: true,
                    },
                    UrlPara: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                    },
                    EnCode: {
                        type: DataTypes.STRING(50),
                        allowNull: true,
                    },
                    APara: {
                        type: DataTypes.STRING(4000),
                        allowNull: true,
                    },
                    CookieContent: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                    },
                    AContent: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                    },
                    PConent: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                    },
                    TrySpiderTimes: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                    },
                    Depth: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                    },
                    SpiderTime: {
                        type: DataTypes.DATE,
                        allowNull: true,
                    },
                    ErrorMsg: {
                        type: DataTypes.TEXT,
                        allowNull: true
                    }
                }, {
                    tableName: 'DatUrl',
                    timestamps: false
                });
            }
            DatStatus(mydb) {
                return mydb.define('DatStatus', {
                    ID: {
                        type: DataTypes.STRING(36),
                        allowNull: false,
                        primaryKey: true
                    },
                    SpiderDate: {
                        type: DataTypes.STRING(10),
                        allowNull: true
                    },
                    ProgramName: {
                        type: DataTypes.STRING(100),
                        allowNull: true
                    },
                    RunStatus: {
                        type: DataTypes.STRING(50),
                        allowNull: true
                    },
                    TrySpiderTimes: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    BegDate: {
                        type: DataTypes.DATE,
                        allowNull: true
                    },
                    EndDate: {
                        type: DataTypes.DATE,
                        allowNull: true
                    },
                    ProNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    DelProNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    InsProNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    BuildNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    DelBuildNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    InsBuildNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    LicenseNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    DelLicenseNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    InsLicenseNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    RoomStateNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    RoomNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    DelRoomNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    InsRoomNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    TransNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    UnsubscribedNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    },
                    SaleNum: {
                        type: DataTypes.INTEGER,
                        allowNull: true
                    }
                }, {
                    tableName: 'DatStatus',
                    timestamps: false,

                });
            }

        }

        return NodeSpiderCore;
    })();

}).call(this);
