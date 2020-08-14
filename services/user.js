/* import moduls */
const { AuthenticationError, ForbiddenError } = require('apollo-server');
const bcrypt = require('bcrypt');
const sha256 = require('crypto-js/sha256');
const rand = require('csprng');

/* import datas */
const { users } = require('../models');

const saltRounds = 10;

//=======================================
//             User Service
//=======================================

/*

[ INSERT 함수 ]
create(values: Object, options: Object) : 레코드 생성 함수이다.
findOrCreate(options: Object): 조회 시 없으면 생성해주는 함수이다.
findCreateFind(options: Object) : 조회 시 없으면 생성 후 조회하는 함수이다.
upsert(values: Object, options: Object) : 한 레코드만 인서트하거나 업데이트 해주는 함수.

[ SELECT 함수 ]
findOne(options: Object) : 하나만 조회하는 함수이다. find()와 동일
findAll(options: Object) : 여러 개를 조회하는 함수이다.
findAndCountAll(findOptions: Object) : 조회 후 총 수까지 알 수 있다. 조회 객체.count로 접근
findByPk(id: Number | String | Buffer, options: Object) : 프라이머리키로 조회하는 함수이다.
findCreateFind(options: Object) : 조회 시 없으면 생성 후 조회하는 함수이다.
findOrCreate(options: Object): 조회수 없으면 생성해주는 함수이다.

[ UPDATE 함수 ]
update(values: Object, options: Object) : 값을 업데이트 해주는 함수. 여러 레코드도 가능.
upsert(values: Object, options: Object) : 한 레코드만 인서트하거나 업데이트해 주는 함수.

[ DELETE 함수 ]
destroy(options: Object) : 한 개나 여러 레코드를 삭제하는 함수.

-attributes : 조회할 칼럼을 정하는 옵션.
-attributes안의 include : table없는 칼럼을 추가할 때 쓰는 옵션.
-where : 조회할 칼럼의 조건문을 정하는 옵션.

ex ) User.find({ attributes: ['useremail', 'username' ], where: {id:1, useremail:"admin@admin.com"}});

*/


/* For Query Service */
const userList = () => {
    
    return users.findAll();
}


/* For Mutation Service */
const signup = (parent, { signupInput: {name, email, password} }) => {
    
    // 이메일 중복 검사
    // await users.findOne({where : { 'email' : email }})
    //     .then((user) => {
    //         if(user){
    //             console.log("findOne then()",user)
    //             return false;
    //         }
    //     }).catch((err) => {
    //         console.log('findOne Error');
    // })

    bcrypt.hash(password, saltRounds, function(err, passwordHash) {
        
        const newUser = {
            'name' : name,
            'password' : passwordHash,
            'email' : email,
            'role': ['user']
        }

        users.create(newUser)
            .then( (user) => {
                console.log('success', user.toJSON());
            })
            .catch((err) => {
                console.log('fail', err);
        });
    });

    return true;
}

const login = async (parent, { loginInput: {email, password} }) => {

    const user = await findId();
    console.log("async",user);
    
    return user;

    // if(!user) return null;  // 해당 가입 이메일이 없을 때
    // if(user.token) return null; // 해당 이메일로 이미 로그인이 되어 있을 때
    // if(!bcrypt.compareSync(password, user.password)) return null;   // 비밀번호가 일치하지 않을 때

    // user.token = sha256(rand(160, 36) + email + password).toString();   // sha256으로 랜덤한 토큰 생성
}

const logout = (parent, args, { user }) => {
    if(user.token) {
        user.token = '';
        return true;
    }

    throw new AuthenticationError('Not Authenticated'); // 로그인되어 있지 않거나 로그인 토큰이 없을 때
}
///////findId////////
const findId = () => {
   
    return new promise((resolve,reject) => {
    users.findOne({where : { 'email' : email }})
    .then((user) => {
        if(user){
            console.log("findOne then()",user)
            resolve(user);
        }
    }).catch((err) => {
        console.log('findOne Error');
    })

    reject(null)})
};

///////////////////
module.exports = {
    userList,
    signup,
    login,
    logout
};