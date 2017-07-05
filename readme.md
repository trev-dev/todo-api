# A "todo" list API
_A very simple API for using a cloud based to-do list_

### Live on Heroku
[Check it out here](https://trevdev-todo-api.herokuapp.com/)

### API Endpoints
#### GET:
* /todos - Get all items on the todo list
* /todos/id - Get specific todo item by id (Eg. todos/2)

#### POST:
* /todos - Add a todo item. Format is JSON, eg: {"description": "A todo item", "completed": false}

#### DELETE:
* /todos/id - Delete a todo list item. Eg /todos/2 - will delete todo item with the id of 2

#### PUT:
* /todos/id - Update a todo list item. Format is JSON, eg: {"description": "A todo item", "completed": true}

### TODO (lol)

- [ ] Convert static object of todo items into a database.
- [x] Add the ability to add/remove/modify todo items
- [ ] Add user authentication/independant todo lists (maybe)