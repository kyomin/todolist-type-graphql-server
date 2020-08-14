const { Todo } = require('../models');
const { todoStatusEnumList } = require('../utils/constants');

//=======================================
//             Todo Service
//=======================================

/* For Auxiliary Function */
const makeTypeList = (totalList) => {
    const resultMap = {};
    const len = totalList.length;

    // 일단 empty array로 모든 state에 매핑 시킨다.
    for(let idx = 0; idx < todoStatusEnumList.length; idx++) {
        const status =  todoStatusEnumList[idx];

        resultMap[status] = [];
    }

    // 일치하는 status에 데이터를 추가하는 작업이다.
    for(let idx = 0; idx < len; idx++) {
        const curStatus = totalList[idx].status;
        const curData = totalList[idx];

        resultMap[curStatus].push(curData);
    }

    return resultMap;
}

/* For Query Service */
const todos = (parent, args, { user }) => {
    return new Promise((resolve, reject) => {
        Todo.findAll()
        .then((todos) => {
            resolve( makeTypeList(todos)['TODO'] );
        })
        .catch(() => {
            reject([]);
        });
    });
}

const dones = (parent, args, { user }) => {
    return new Promise((resolve, reject) => {
        Todo.findAll()
        .then((todos) => {
            resolve( makeTypeList(todos)['DONE'] );
        })
        .catch(() => {
            reject([]);
        });
    });
}

/* For Mutation Service */
const makeTodo = (parent, { userId, description, status, deadline }, { user }) => {
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
        .catch((err) => {
            return reject(false);
        });
    });
}

module.exports = {
    // queries
    todos,
    dones,

    // mutations
    makeTodo
};