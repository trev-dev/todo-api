/* jshint esversion: 6 */
var express = require('express');
var app = express();
var db = require(`${__dirname}/modules/db.js`);

var routes = require(`${__dirname}/modules/routes`);


var PORT = process.env.PORT || 3000;

routes(app, db);

db.sql.sync({force: true}).then(function(){

    app.listen(PORT, function(){

        console.log(`Server running on port ${PORT}`);
    

    });
});
