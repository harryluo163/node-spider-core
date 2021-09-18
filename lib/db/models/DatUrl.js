const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DatUrl', {
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
      comment: '应用程序名'
    },
    SpiderDate: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '日期'
    },
    PID: {
      type: DataTypes.STRING(36),
      allowNull: true,
      comment: '父编号'
    },
    SType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '类型'
    },
    SiteUrl: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: '站点路径'
    },
    SourUrl: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: '父页面路径'
    },
    Url: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      comment: '页面路径'
    },
    UrlType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '抓取方式(GET/POST/MGET)'
    },
    UrlPara: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: ' 参数'
    },
    EnCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '编码方式'
    },
    APara: {
      type: DataTypes.STRING(4000),
      allowNull: true,
      comment: '附加参数'
    },
    CookieContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Cookie值'
    },
    AContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '附加内容'
    },
    PConent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '页面内容'
    },
    TrySpiderTimes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '抓取次数'
    },
    Depth: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '抓取深度'
    },
    SpiderTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '抓取时间'
    },
    ErrorMsg: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'DatUrl',
    timestamps: false
  });

};
