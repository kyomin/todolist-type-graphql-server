const userService = require('../services/user');

//=======================================
//             User Controller
//=======================================

/* For Query Controll */
const userList = ()=> {
    return userService.userList();
}

/* For Mutation Controll */
const signup = (parent, { signupInput: {name, email, password} }) => {
    return userService.signup(parent, { signupInput: {name, email, password} });
}

const login = (parent, { loginInput: {email, password} }) => {
    return userService.login(parent, { loginInput: {email, password} });
}


module.exports = {
    userList,
    signup,
    login
};