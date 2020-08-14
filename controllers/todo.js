const todoService = require('../services/todo');

//=======================================
//             Todo Controller
//=======================================

/* For Query Controll */
const todos = (parent, args, { user }) => {
    return todoService.todos(parent, args, { user })
    .then((todos) => {
        return todos;
    })
    .catch((err) => {
        return err;
    });
}

const dones = (parent, args, { user }) => {
    return todoService.dones(parent, args, { user })
    .then((dones) => {
        return dones;
    })
    .catch((err) => {
        return err;
    });
}

/* For Mutation Controll */
const makeTodo = (parent, { userId, description, status, deadline }, { user }) => {
    return todoService.makeTodo(parent, { userId, description, status, deadline }, { user })
    .then((result) => {
        return result;
    })
    .catch((err) => {
        return err;
    });
}

const updateStatus = (parent, { id, changedStatus }, { user }) => {
    return todoService.updateStatus(parent, { id, changedStatus }, { user })
    .then((result) => {
        return result;
    })
    .catch((err) => {
        return err;
    });
}

module.exports = {
    // queries
    todos,
    dones,

    // mutations
    makeTodo,
    updateStatus
};