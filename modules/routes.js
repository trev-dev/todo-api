/* jshint esversion: 6 */

module.exports = function(app) {
    var todos = require('../modules/todos');

    app.get('/', function(req, res){

        res.send('Todo Root');

    });

    app.get('/todos', function(req, res) {

        res.json(todos);

    });

    app.get('/todos/:id', function(req, res, next){
        var todo = function() {

            for (var index = 0; index < todos.length; index++) {
                if (todos[index].id == req.params.id) {

                    return todos[index];

                }
            }

        }();

        todo ? res.json(todo) : next();

    });

    app.use(function(req, res){

        var errors = {

            error: 404,
            description: "No response found for API query"

        };

        res.json(errors);

    });

};