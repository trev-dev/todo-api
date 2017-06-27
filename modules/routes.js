/* jshint esversion: 6 */

module.exports = function(app) {
    var todos = require('../modules/todos');
    var bodyParser = require('body-parser');

    app.use(bodyParser.json());

    app.get('/', function(req, res){

        res.send('Todo Root');

    });

    app.get('/todos', function(req, res) {

        res.json(todos.items);

    });

    app.get('/todos/:id', function(req, res, next){
        var todo = function() {

            for (var index = 0; index < todos.items.length; index++) {
                if (todos.items[index].id == req.params.id) {

                    return todos.items[index];

                }
            }

        }();

        todo ? res.json(todo) : next();

    });

    app.post('/todos', function(req, res){

        todo = req.body;
        todo.id = todos.todoNext;
        todos.todoNext++;
        todos.items.push(todo);
        res.json(todo);

    });

    app.use(function(req, res){

        var errors = {

            error: 404,
            description: "No response found for API query"

        };

        res.json(errors);

    });

};