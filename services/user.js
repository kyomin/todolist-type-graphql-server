const { AuthenticationError, ForbiddenError } = require('apollo-server');

const { users } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// User List Method - temp Method
const userList = () => {
  return new Promise((resolve, reject) => {
    users.findAll({})
      .then((users) => {
        resolve(users);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// User signup Method 
const signup = (parent, { signupInput: {name, email, password} }) => {
  
  return new Promise((resolve, reject) => {
    
    //만약 같은 email이 있는 user가 존재한다면 false를 return 
    users.findOne({where : { 'email' : email }})
    .then((user) => {
      if(user){
        resolve(false);
      }
    })
    .catch((err) => {
      reject(err);
    })
    
    // 같은 email을 갖는 user가 없다면 DB에 user 생성 후, true를 return 
    bcrypt.hash(password, saltRounds, function(err, passwordHash) {
      
      const newUser = {
        'name' : name,
        'password' : passwordHash,
        'email' : email,
        'roles': "user"
      }

      users.create(newUser)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

// User login Method 
const login = (parent, { loginInput: {email, password} }) => {
  
  
  return new Promise((resolve, reject) => {

    // email 이 존재하지 않으면 false, 존재하면 bcrypt.compare를 이용하여 password 검사
    users.findOne({where : { 'email' : email }})
      .then((user) => {
        if(!user){
          resolve(false)
        }
        else{
          bcrypt.compare(password,user.password,function(err, res) {
            if (err){
              reject(err)
            }
            //만약 일치하면 res === true , 일치하지 않으면 res === false
            resolve(res)
          });
        }
      })
      .catch((err) => {
        reject(err);
      })
  });
}

module.exports = {
  userList,
  signup,
  login
}