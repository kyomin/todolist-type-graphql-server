//=======================================
//             User Schema
//=======================================

const types = `
  type User {
    uno: Int!
    name: String!
    password: String!
    email: String!
    roles: [String!]!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input VerifyInput {
    token: String!
  }
`;

const queries = `
    userList: [User]!
    me: User!
`;

// verifytoken add
const mutations = `
    signup(signupInput: SignupInput!): Boolean!
    login(loginInput: LoginInput!): String!
    verifytoken(verifyInput: VerifyInput!): String!
`;

module.exports = {
    types,
    queries,
    mutations
};