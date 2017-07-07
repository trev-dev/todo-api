# A "todo" list API
_A very simple API for using a cloud based to-do list_

### Live on Heroku
[Check it out here](https://trevdev-todo-api.herokuapp.com/)

### API Endpoints
#### GET:
* /todos - Get all incompleted items on the todo list
* /todos/id - Get specific todo item by id (Eg. todos/2)
* /todos/completed - Get all completed todos

_Search parameters_
* /todos?completed=true Same as /todos/completed
* /todos?q=search Filter by search query. Example: /todos?q=dog&completed=true - will return all dog related todos that are completed

#### POST:
* /todos - Add a todo item. Format is JSON, eg: {"description": "A todo item", "completed": false}

#### DELETE:
* /todos/id - Delete a todo list item. Eg /todos/2 - will delete todo item with the id of 2

#### PUT:
* /todos/id - Update a todo list item. Format is JSON, eg: {"description": "A todo item", "completed": true}

### TODO (lol)

- [x] Convert static object of todo items into a database.
- [x] Add the ability to add/remove/modify todo items
- [ ] Add user authentication/independant todo lists (maybe)

### A note on Databases
This app is setup to use postgres on the live server (heroku). If you clone or download this git and run NPM install, it should work locally using sqlite.