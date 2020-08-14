const userController = require('../../controllers/user');

//=======================================
//             User Resolver
//=======================================


const queries = {
    userList: userController.userList
};

const mutations = {
    signup: userController.signup,
    login: userController.login,
    logout: userController.logout
}

module.exports = {
    queries,
    mutations
};