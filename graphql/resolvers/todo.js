const todoController = require('../../controllers/todo');

//=======================================
//             Todo Resolver
//=======================================

const queries = {
    todos: todoController.todos,
    dones: todoController.dones
};

const mutations = {
    makeTodo: todoController.makeTodo
};

module.exports = {
    queries,
    mutations
};