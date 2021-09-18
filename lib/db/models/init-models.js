var DataTypes = require("sequelize").DataTypes;

var _DatUrl = require("./DatUrl");


function initModels(sequelize) {

  var DatUrl = _DatUrl(sequelize, DataTypes);
  return {
    DatUrl,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
