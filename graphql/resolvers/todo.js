const todoController = require('../../controllers/todo');

//=======================================
//             Todo Resolver
//=======================================

const queries = {
    todos: todoController.todos,
    dones: todoController.dones
};

const mutations = {
    makeTodo: todoController.makeTodo,
    updateTodoStatus: todoController.updateTodoStatus,
    updateTodoDescription: todoController.updateTodoDescription,
    deleteTodo: todoController.deleteTodo
};

module.exports = {
    queries,
    mutations
};