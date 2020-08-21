const userController = require('../../controllers/user.ts');

//=======================================
//             User Resolver
//=======================================

const queries = {
  userList: userController.userList
};

const mutations = {
  signup: userController.signup,
  login: userController.login,
  verifytoken: userController.verifytoken
}

module.exports = {
  queries,
  mutations
};