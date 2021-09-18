
const db =require('../DB/models/init-models')(global.config.mydb)
function GetUrlPortal()
{

    var SqlStr = "SELECT ID,KeyWord,ProgramName,SpiderDate,PID,SType,SiteUrl,SourUrl,Url,UrlType,UrlPara,EnCode,APara,CookieContent" +
        ",AContent,PConent,TrySpiderTimes,Depth,SpiderTime  FROM DatUrl WHERE ProgramName='" + global.config.ProgramName +
        "' and TrySpiderTimes=" + global.CurrSpiderTimes;
    if (global.config.CurrSpiderTimes > 1)
    {
        SqlStr = "SELECT ID,KeyWord,ProgramName,SpiderDate,PID,SType,SiteUrl,SourUrl,Url,UrlType,UrlPara,EnCode,APara,CookieContent" +
            ",AContent,PConent,TrySpiderTimes,Depth,SpiderTime  FROM DatUrl WHERE ProgramName='" +global.config.ProgramName +
            "' and TrySpiderTimes=" +global.config.CurrSpiderTimes + " and SpiderDate='" + global.config.SpiderDate + "'";
    }
    else if (global.config.CurrSpiderTimes < 4 && global.config.CurrSpiderTimes > 1)
    {
        SqlStr = "SELECT ID,KeyWord,ProgramName,SpiderDate,PID,SType,SiteUrl,SourUrl,Url,UrlType,UrlPara,EnCode,APara,CookieContent" +
            ",AContent,PConent,TrySpiderTimes,Depth,SpiderTime  FROM DatUrl WHERE ProgramName='" +global.config.ProgramName +
            "' and TrySpiderTimes=" + global.config.CurrSpiderTimes + " and SpiderDate='" +global.config.SpiderDate + "' and ErrorMsg NOT LIKE '%分析数据失败%'";
    }

    return SqlStr;
}



function  SaveUrl(pageUrlEntity,   ErrorMsg)
{
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
    urlEntity.CookieContent =pageUrlEntity.CookieContent;
    urlEntity.AContent = pageUrlEntity.AContent;
    urlEntity.PConent = pageUrlEntity.PContent;
    urlEntity.ErrorMsg = ErrorMsg;
    urlEntity.TrySpiderTimes = pageUrlEntity.TrySpiderTimes + 1;
    urlEntity.Depth = pageUrlEntity.Depth;
    urlEntity.SpiderTime = pageUrlEntity.SpiderTime;
    global.clsDB.push({Entity: urlEntity, sequelizeModel: db.DatUrl,SType:"create"})

}

module.exports={
    GetUrlPortal,
    SaveUrl,
}