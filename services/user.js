const { users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const saltRounds = 10;
// const jwtObj = require('../config/jwt')   - 비밀키 보관소

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
    
    // 만약 같은 email이 있는 user가 존재한다면 false를 반환
    users.findOne({where : { 'email' : email }})
    .then((user) => {
      if(user){
        resolve(false);
      }
    })
    .catch((err) => {
      reject(err);
    })
    
    // 같은 email을 갖는 user가 없다면 DB에 user 생성 후, true를 반환
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

    // email 이 존재하지 않으면 false 반환, 존재하면 bcrypt.compare를 이용하여 password 검사
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
            //만약 일치하면 token return, 일치하지 않으면 false return, 
            if(res){
              getToken(email, password)     // token을 받아와서 반환
              .then( (token) =>{
                resolve(token)
              })
            }else{
              resolve(false)
            }
          });
        }
      })
      .catch((err) => {
        reject(err);
      })
  });
}

// User make Token - jwt.sign(payload, secret, options, [callback]) , default : HS256
const getToken = (email, password) => {

  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        "email": email         // payload 구간
      },
      'SeCrEtKeYfOrHaShInG',   // 임시로 여기에 선언, 현재 임시로 보관중   
      {
        expiresIn: '2h',       // 만료 기간을 잡는 옵션
        issuer: 'tempissuer',  // 토큰 발급자
        subject: 'temptitle'   // 토큰 제목
      }, 
      function(err,token){
        if(err) reject(err)      // 생성 후 콜백함수
        else resolve(token)
      })
  });  // return promise
}

module.exports = {
  userList,
  signup,
  login
}