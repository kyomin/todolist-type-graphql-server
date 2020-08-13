//=======================================
//             User Schema
//=======================================

const types = `
  type User {
    id: Int!
    name: String!
    email: String!
    passwordHash: String!
    roles: [String!]!
    token: String
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!, 
    password: String!
  }
`;

const queries = `
    users: [User]!
    me: User!
`;

const mutations = `
    signup(signupInput: SignupInput!): Boolean!
    login(loginInput: LoginInput!): User
    logout: Boolean!
`;

module.exports = {
    types,
    queries,
    mutations
};