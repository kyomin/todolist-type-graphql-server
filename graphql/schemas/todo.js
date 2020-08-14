//=======================================
//             Todo Schema
//=======================================

const types = `
    scalar DateTime

    enum TodoStatus {
        TODO
        DONE
    }

    input MakeTodoInput {
        userId: Int!, 
        description: String!, 
        status: TodoStatus!, 
        deadline: DateTime!
    }

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
    makeTodo(makeTodoInput: MakeTodoInput!): Boolean!
    updateTodoStatus(id: Int!, changedStatus: TodoStatus!): Boolean!
    updateTodoDescription(id: Int!, newDescription: String!): Boolean!
    deleteTodo(id: Int!): Boolean!
`;

module.exports = {
    types,
    queries,
    mutations
};