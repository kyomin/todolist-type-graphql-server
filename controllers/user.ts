const userService = require('../services/user');

//=======================================
//             User Controller
//=======================================

//let myFn: Function = function() { };
/* For Query Controll */
const userList = () => {
  return userService.userList();
}

/* For Mutation Controll */
// 회원가입 기능
const signup = (parent, { signupInput: {name, email, password} }) => {
  return userService.signup(parent, { signupInput: {name, email, password} });
}

// 로그인 기능
const login = (parent, { loginInput: {email, password} }) => {
  return userService.login(parent, { loginInput: {email, password} });
}

// 토큰 유효값 확인 기능
const verifytoken = (parent, { verifyInput: {token} }) => {
  return userService.verifytoken(parent, { verifyInput: {token} });
}

module.exports = {
  userList,
  signup,
  login,
  verifytoken
};