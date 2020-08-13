/*
    '컨텍스트' 정의!
    Context는 모든 GraphQL API 요청이 불릴 때마다 '항상' 실행되는 함수이다.
    보통 Context에 사용자 인증 정보를 저장해서 특정 API 실행 권한이 있는지 확인하는 용도로 사용한다.
*/
const { users } = require('../../database/users');

const context = ({ req }) => {
    const token = req.headers.authorization || '';

    // 로그인되어 있지 않거나, 로그인 토큰이 없을 때
    if(token.length !== 64) return { user: null };

    // 클라이언트에서 토큰을 가지고 있고, 인증이 되었으므로 토큰을 이용해 해당 유저를 찾는다.
    const user = users.find(user => user.token === token);

    return { user };
};

module.exports = {
    context
};