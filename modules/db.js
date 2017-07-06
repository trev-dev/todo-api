var Sequelize = require('sequelize');
var sql = new Sequelize(undefined, undefined, undefined,{
    'dialect': 'sqlite',
    'storage': './data/todos.sqlite'
});

module.exports = {

    todo: sql.import(`../models/dbmodels.js`),
    sql: sql,
    Sequelize: Sequelize

}