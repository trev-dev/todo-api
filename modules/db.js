var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';

var sql;

if (env === 'production') {

    sql = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });

} else {

    sql = new Sequelize(undefined, undefined, undefined,{
        'dialect': 'sqlite',
        'storage': './data/todos.sqlite'
    });

}



module.exports = {

    todo: sql.import(`../models/todo.js`),
    user: sql.import('../models/user.js'),
    sql: sql,
    Sequelize: Sequelize

}