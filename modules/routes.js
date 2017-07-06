/* jshint esversion: 6 */

module.exports = function(app, db) {
    var todos = require('./todos');
    var bodyParser = require('body-parser');
    var _ = require('underscore');

    app.use(bodyParser.json());

    app.use('/', function(req, res, next){

        console.log(req.method, req.path, req.body);
        next();

    });
    app.get('/', function(req, res){

        res.send('Todo Root');

    });

    app.get('/todos', function(req, res, next) {
        var query = {};

        query.completed = req.query.completed == "true" ? true : false;
        if (req.query.q) { query.description = { $like: `%${req.query.q}%` }; }
        
        db.todo.findAll({where: query}).then(function(todos){

            todos ? res.json(todos) : next();

        }).catch(function(err){

            res.json(err);

        });

    });

    app.get('/todos/completed', function(req, res, next){
        
        db.todo.findAll({where: {
            completed: true
        }}).then(function(todos){

            todos ? res.json(todos) : next();

        }).catch(function(error){

        res.json(error);

    });

    });

    app.get('/todos/:id', function(req, res, next){

        db.todo.findById(parseInt(req.params.id)).then(function(todo){

            todo ? res.json(todo.toJSON()) : next();

        }).catch(function(error){
            console.log(error);
            res.status(400).json({error: error.parent.code, description: 'Ensure endpoint is a valid number'});

        });

    });

    app.post('/todos', function(req, res){

        var body = _.pick(req.body, 'description', 'completed');
        body.description = body.description.trim();

        db.todo.create(body).then(function(todo){

            res.json(todo.toJSON());

        }).catch(function(error){

            res.status(400).json(error);

        });

    });

    app.delete('/todos/:id', function(req, res, next){
 
        db.todo.destroy({
            where: {
                id: parseInt(req.params.id)
            }
        }).then(function(deleted){

            deleted ? res.json({success: "Todo Deleted"}) : next();

        }).catch(function(error){

            res.json(error);

        });


    });

    app.put('/todos/:id', function(req, res, next){
        // var todo = _.findWhere(todos.items, {id: parseInt(req.params.id)});
        // var body = _.pick(req.body, 'description', 'completed');
        // if (body.description){ body.description = body.description.trim(); }
        // var valid = {};

        // if (todo) {

        //      if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {

        //         valid.completed = body.completed;

        //     } else if (body.hasOwnProperty('completed')) {

        //         return res.status(400).json({error: "Completed status must be a boolean"});

        //     } else {

        //         // Completed value not set

        //     }

        //     if (body.hasOwnProperty('description') && body.description.length > 0) {

        //         valid.description = body.description;

        //     } else if (body.hasOwnProperty('description')) {

        //         return res.status(400).json({error: "Description should not be empty"});

        //     } else {

        //         // No Description

        //     }

        //     _.extend(todo, valid);
        //     res.json(todo);
     

        // } else {

        //     next();

        // }
        var body = _.pick(req.body, 'description', 'completed');
        console.log(body);
        db.todo.update(body, {where: {
            id: parseInt(req.params.id)
        }}).then(function(update){
            console.log(update);
            
            update[0] ? res.json({success: "Todo Updated"}) : next();

        }).catch(function(error){

            res.json(error);

        });
       
    });

    app.use(function(req, res){

        var errors = {

            error: 404,
            description: "No response found for API query"

        };

        res.status(404).json(errors);

    });

};