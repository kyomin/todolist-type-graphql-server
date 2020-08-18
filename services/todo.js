const { Todo } = require('../models');

//=======================================
//             Todo Service
//=======================================

/* For Query Service */
const todos = (parent, { userId, status }, { user }) => {
  return new Promise((resolve, reject) => {
    if(!status) {
      Todo.findAll({ where: {userId: userId}, order: [ ['createdAt', 'ASC'] ] })
      .then((todos) => {
        resolve( todos );
      })
      .catch(() => {
        reject([]);
      });
    } else {
      Todo.findAll({ where: {userId: userId, status: status}, order: [ ['createdAt', 'ASC'] ] })
      .then((todos) => {
        resolve( todos );
      })
      .catch(() => {
        reject([]);
      });
    }
  });
}


/* For Mutation Service */
const makeTodo = (parent, { makeTodoInput: { userId, description, status, deadline } }, { user }) => {
  return new Promise((resolve, reject) => {
    const newTodo = {
      userId,
      description,
      status,
      deadline
    };

    Todo.create(newTodo)
    .then(() => {
      return resolve(true);
    })
    .catch(() => {
      return reject(false);
    });
  });
}

const updateTodoStatus = (parent, { id, changedStatus }, { user }) => {
  return new Promise((resolve, reject) => {
    Todo.update({ status: changedStatus }, { where: {id: id} })
    .then(() => {
      resolve(true);     
    })
    .catch(() => {
      reject(false);
    })
  });
}

const updateTodoDescription = (parent, { id, newDescription }, { user }) => {
  return new Promise((resolve, reject) => {
    Todo.update({ description: newDescription }, { where: {id: id} })
    .then(() => {
      resolve(true);
    })
    .catch(() => {
      reject(false);
    }); 
  });
}

const deleteTodo = (parent, { id }, { user }) => {
  return new Promise((resolve, reject) => {
    Todo.destroy({ where: {id: id} })
    .then(() => {
      resolve(true);
    })
    .catch(() => {
      reject(false);
    });
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