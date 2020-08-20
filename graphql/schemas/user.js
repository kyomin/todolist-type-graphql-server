//=======================================
//             User Schema
//=======================================
  
const types = `
  #사용자 정보
  type User {
    uno: Int!                
    name: String!  
    password: String!
    email: String!
    roles: [String!]!
  }

  #토큰 정보
  type Token{
    email: String!
    sub: String!
  }

  #회원가입 할 때 필요한 이름,이메일 그리고 패스워드 
  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  #로그인 할 때 필요한 이름과 패스워드
  input LoginInput {
    email: String!
    password: String!
  }

  #데이터에 접근할 때 필요한 토큰
  input VerifyInput {
    token: String!
  }
`;

const queries = `
  #모든 사용자를 불러오는 쿼리
  userList: [User]!
  me: User!
`;

const mutations = `
  #SignupInput Type[ name, email, password ]로 회원가입하는 Mutation
  signup(signupInput: SignupInput!): Boolean!
  
  #LoginInput Type[ email, password ]로 로그인하는 Mutation
  login(loginInput: LoginInput!): String!
  
  #VerifyInput Type[ token ]으로 토큰이 유효한지 검증하는 Mutation
  verifytoken(verifyInput: VerifyInput!): Token!
`;

module.exports = {
    types,
    queries,
    mutations
};