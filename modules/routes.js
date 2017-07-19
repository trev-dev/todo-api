/* jshint esversion: 6 */

module.exports = function(app, db) {
    var bodyParser = require('body-parser');
    var _ = require('underscore');
    var crypt = require('./passwords.js')(db);
    app.use(bodyParser.json());

    app.use('/', function(req, res, next){

        console.log(req.method, req.path, req.body);
        next();

    });
    app.get('/', function(req, res){

        res.send('Todo Root');

    });

    // TODO LIST ROUTES

    app.get('/todos', crypt.requireAuth, function(req, res, next) {
        var query = {userId: req.user.id};
        query.completed = req.query.completed == "true" ? true : false;
        if (req.query.q) { query.description = { $like: `%${req.query.q}%` }; }
        
        db.todo.findAll({where: query}).then(function(todos){

            todos ? res.json(todos) : next();

        }).catch(function(err){

            res.json(err);

        });

    });

    app.get('/todos/completed', crypt.requireAuth, function(req, res, next){
        
        db.todo.findAll({where: {
            completed: true,
            userId: req.user.id
        }}).then(function(todos){

            todos ? res.json(todos) : next();

        }).catch(function(error){

        res.json(error);

    });

    });

    app.get('/todos/:id', crypt.requireAuth, function(req, res, next){

        db.todo.findOne({where: {
            id: parseInt(req.params.id),
            userId: req.user.id
        }}).then(function(todo){

            todo ? res.json(todo.toJSON()) : next();

        }).catch(function(error){
            console.log(error);
            res.status(400).json({error: error.parent.code, description: 'Ensure endpoint is a valid number'});

        });

    });

    app.post('/todos', crypt.requireAuth, function(req, res){

        var body = _.pick(req.body, 'description', 'completed');
        body.description = body.description.trim();

        db.todo.create(body).then(function(todo){
            req.user.addTodo(todo).then(function(){

                return todo.reload();

            }).then(function(todo){

                res.json(todo.toJSON());

            });
            // res.json(todo.toJSON());

        }).catch(function(error){

            res.status(400).json(error);

        });

    });

    app.delete('/todos/:id', crypt.requireAuth, function(req, res, next){
 
        db.todo.destroy({
            where: {
                id: parseInt(req.params.id),
                userId: req.user.id
            }
        }).then(function(deleted){

            deleted ? res.json({success: "Todo Deleted"}) : next();

        }).catch(function(error){

            res.json(error);

        });


    });

    app.put('/todos/:id', crypt.requireAuth, function(req, res, next){

        var body = _.pick(req.body, 'description', 'completed');
        db.todo.update(body, {where: {
            id: parseInt(req.params.id),
            userId: req.user.id
        }}).then(function(update){
            console.log(update);

            update[0] ? res.json({success: "Todo Updated"}) : next();

        }).catch(function(error){

            res.json(error);

        });
       
    });

    // USERS ROUTES

    app.post('/users', function(req, res, next){

        var body = _.pick(req.body, 'email', 'password');
        body.email = body.email.toLowerCase();

        db.user.create(body).then(function(user){

            res.json(`User Created: ${user.toJSON().email}`);

        }).catch(function(error){

            res.json(error);

        });

    });

    app.post('/users/login', function(req, res, next){

        var body = _.pick(req.body, 'email', 'password');
        var userInstance;
        body.email = body.email.toLowerCase().trim();

        db.user.auth(body).then(function(resp){
            var token = resp.generateToken('authentication');
            userInstance = resp;
            return db.token.create({token: token});
            // if (token) {res.header('Auth', token).json(resp.publicJSON());}
            

        }).then(function(token){

            res.header('Auth', token.token).json(userInstance.publicJSON());

        }).catch(function(err){
            
            res.status(401).json({error: 'Not authorized. Incorrect email/password combination'});

        });


    });

    app.delete('/users/login', crypt.requireAuth, function(req, res){

        req.token.destroy().then(function(){
            res.status(204).json({success: 'Logout Successful'});
        }).catch(function(){

            res.status(500).send();

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