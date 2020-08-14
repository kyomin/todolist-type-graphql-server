//=======================================
//             Todo Schema
//=======================================

const types = `
    enum TodoStatus {
        TODO
        DONE
    }

    scalar DateTime

    type Todo {
        id: Int
        userId: Int!
        description: String!
        status: TodoStatus!
        deadline: DateTime!
        createdAt: DateTime
    }
`;

const queries = `
    todos: [Todo!]!
    dones: [Todo!]!
`;

const mutations = `
    makeTodo(userId: Int!, description: String!, status: TodoStatus!, deadline: DateTime!): Boolean!
    updateTodoStatus(id: Int!, changedStatus: TodoStatus!): Boolean!
    updateTodoDescription(id: Int!, newDescription: String!): Boolean!
    deleteTodo(id: Int!): Boolean!
`;

module.exports = {
    types,
    queries,
    mutations
};