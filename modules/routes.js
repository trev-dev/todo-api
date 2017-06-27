/* jshint esversion: 6 */

module.exports = function(app) {
    var todos = require('../modules/todos');
    var bodyParser = require('body-parser');
    var _ = require('underscore');

    app.use(bodyParser.json());

    app.get('/', function(req, res){

        res.send('Todo Root');

    });

    app.get('/todos', function(req, res) {

        res.json(todos.items);

    });

    app.get('/todos/:id', function(req, res, next){
        todo = _.findWhere(todos.items, {id: parseInt(req.params.id)});

        todo ? res.json(todo) : next();

    });

    app.post('/todos', function(req, res){

        todo = _.pick(req.body, 'description', 'completed');
        todo.description = todo.description.trim();
        // Underscore Validation
        if (!_.isBoolean(todo.completed) || !_.isString(todo.description) || todo.description.length === 0){

            return res.status(400).send();

        }

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