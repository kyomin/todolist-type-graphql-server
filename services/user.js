/* import moduls */
const { AuthenticationError, ForbiddenError } = require('apollo-server');
const bcrypt = require('bcrypt');
const sha256 = require('crypto-js/sha256');
const rand = require('csprng');

/* import datas */
const { users } = require('../database/users');

const saltRounds = 10;

//=======================================
//             User Service
//=======================================

/* For Mutation Service */
const signup = (parent, { signupInput: {name, email, password} }) => {
    // 이메일 중복 검사
    if(users.find(user => user.email === email)) return false;

    bcrypt.hash(password, saltRounds, function(err, passwordHash) {
        const newUser = {
            id: users.length + 1,
            name,
            email,
            passwordHash,
            role: ['user'],
            token: ''
        }

        users.push(newUser);
    });

    return true;
}

const login = (parent, { loginInput: {email, password} }) => {
    let user = users.find(user => user.email === email);

    if(!user) return null;  // 해당 가입 이메일이 없을 때
    if(user.token) return null; // 해당 이메일로 이미 로그인이 되어 있을 때
    if(!bcrypt.compareSync(password, user.passwordHash)) return null;   // 비밀번호가 일치하지 않을 때

    user.token = sha256(rand(160, 36) + email + password).toString();   // sha256으로 랜덤한 토큰 생성
    return user;
}

const logout = (parent, args, { user }) => {
    if(user.token) {
        user.token = '';
        return true;
    }

    throw new AuthenticationError('Not Authenticated'); // 로그인되어 있지 않거나 로그인 토큰이 없을 때
}

module.exports = {
    signup,
    login,
    logout
};