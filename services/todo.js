const { Todo } = require('../models');

//=======================================
//             Todo Service
//=======================================

/* For Auxiliary Function */
const returnMatchStateList = (totalList, targetState) => {
    const resultList = [];
    const len = totalList.length;

    // 일치하는 status에 데이터를 추가하는 작업이다.
    for(let idx = 0; idx < len; idx++) {
        const curStatus = totalList[idx].status;
        const curData = totalList[idx];

        if(curStatus === targetState) {
            resultList.push(curData)
        }
    }

    return resultList;
}

/* For Query Service */
const todos = (parent, args, { user }) => {
    return new Promise((resolve, reject) => {
        // if(!user) {
        //     reject([]);
        // }

        Todo.findAll()
        .then((todos) => {
            resolve( returnMatchStateList(todos, 'TODO') );
        })
        .catch(() => {
            reject([]);
        });
    });
}

const dones = (parent, args, { user }) => {
    return new Promise((resolve, reject) => {
        // if(!user) {
        //     reject([]);
        // }

        Todo.findAll()
        .then((todos) => {
            resolve( returnMatchStateList(todos, 'DONE') );
        })
        .catch(() => {
            reject([]);
        });
    });
}

/* For Mutation Service */
const makeTodo = (parent, { userId, description, status, deadline }, { user }) => {
    return new Promise((resolve, reject) => {
        // if(!user) {
        //     reject(false);
        // }

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
        .catch((err) => {
            return reject(false);
        });
    });
}

const updateTodoStatus = (parent, { id, changedStatus }, { user }) => {
    return new Promise((resolve, reject) => {
        // if(!user) {
        //     reject(false);
        // }

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
        // if(!user) {
        //     reject(false);
        // }

        Todo.update({ description: newDescription }, { where: {id: id} })
        .then(() => {
            console.log('newDescription : ', newDescription);
            resolve(true);
        })
        .catch((err) => {
            reject(false);
        }); 
    });
}

const deleteTodo = (parent, { id }, { user }) => {
    return new Promise((resolve, reject) => {
        // if(!user) {
        //     reject(false);
        // }

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
    dones,

    // mutations
    makeTodo,
    updateTodoStatus,
    updateTodoDescription,
    deleteTodo
};