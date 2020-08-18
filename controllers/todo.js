const todoService = require('../services/todo');

//=======================================
//             Todo Controller
//=======================================

/* For Query Controll */
const todos = (parent, { userId, status }, { user }) => {
  return todoService.todos(parent, { userId, status }, { user })
  .then((todos) => {
    return todos;
  })
  .catch((err) => {
    return err;
  });
}

/* For Mutation Controll */
const makeTodo = (parent, { makeTodoInput: { userId, description, status, deadline } }, { user }) => {
  return todoService.makeTodo(parent, { makeTodoInput: { userId, description, status, deadline } }, { user })
  .then((result) => {
    return result;
  })
  .catch((err) => {
    return err;
  });
}

const updateTodoStatus = (parent, { id, changedStatus }, { user }) => {
  return todoService.updateTodoStatus(parent, { id, changedStatus }, { user })
  .then((result) => {
    return result;
  })
  .catch((err) => {
    return err;
  });
}

const updateTodoDescription = (parent, { id, newDescription }, { user }) => {
  return todoService.updateTodoDescription(parent, { id, newDescription }, { user })
  .then((result) => {
    return result;
  })
  .catch((err) => {
    return err;
  });
}

const deleteTodo = (parent, { id }, { user }) => {
  return todoService.deleteTodo(parent, { id }, { user })
  .then((result) => {
    return result
  })
  .catch((err) => {
    return err;
  });
}

module.exports = {
  // queries
  todos,

  // mutations
  makeTodo,
  updateTodoStatus,
  updateTodoDescription,
  deleteTodo
};