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
        var todo = _.findWhere(todos.items, {id: parseInt(req.params.id)});

        todo ? res.json(todo) : next();

    });

    app.post('/todos', function(req, res){

        var todo = _.pick(req.body, 'description', 'completed');
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

    app.delete('/todos/:id', function(req, res, next){

        var todo = _.findWhere(todos.items, {id: parseInt(req.params.id)});
 
        if (todo) {

            todos.items = _.without(todos.items, todo);
            todo.status = 'Deleted';
            res.json(todo);

        } else {

            next();

        }

    });

    app.put('/todos/:id', function(req, res, next){
        var todo = _.findWhere(todos.items, {id: parseInt(req.params.id)});
        var body = _.pick(req.body, 'description', 'completed');
        if (body.description){ body.description = body.description.trim(); }
        var valid = {};

        if (todo) {

             if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {

                valid.completed = body.completed;

            } else if (body.hasOwnProperty('completed')) {

                return res.status(400).json({error: "Completed status must be a boolean"});

            } else {

                // Completed value not set

            }

            if (body.hasOwnProperty('description') && body.description.length > 0) {

                valid.description = body.description;

            } else if (body.hasOwnProperty('description')) {

                return res.status(400).json({error: "Description should not be empty"});

            } else {

                // No Description

            }

            _.extend(todo, valid);
            res.json(todo);
     

        } else {

            next();

        }
       
    });

    app.use(function(req, res){

        var errors = {

            error: 404,
            description: "No response found for API query"

        };

        res.status(404).json(errors);

    });

};