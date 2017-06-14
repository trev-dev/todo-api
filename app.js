/* jshint esversion: 6 */
var express = require('express');
var app = express();

var routes = require('./modules/routes');


var PORT = process.env.PORT || 3000;

routes(app);

app.listen(PORT, function(){

    console.log(`Server running on port ${PORT}`);
    

});