/* 
    '리졸버' 정의.
    리졸버는 사용자가 쿼리를 요청했을 때, 이를 서버가 어떻게 처리할지 정의한 파일이다.
    리졸버는 요청에 대해 단순히 데이터를 반환할 수도 있지만,
    직접 데이터베이스를 찾거나, 메모리에 접근하거나, 다른 API에 요청해서 데이터를 가져올 수 있다.

    본문의 코드는 다음을 의미한다(Movie 모델 예시).

    - 데이터베이스를 읽는 요청(Query) 중 movies가 요청되면 ../../datas/movies.js에 있는 movies 데이터를 반환한다.
    - 데이터베이스를 수정하는 요청(Mutation) 중 name과 rating을 파라미터로 가진 addMovie가 요청되면, 데이터베이스에 영화를 추가한다.

    각 리졸버 항목의 매개변수는 4개까지 받을 수 있는데, 다음과 같다.

    1번째(parent) : 부모 타입 리졸버에서 반환된 결과를 가진 객체 => 잘 사용 x
    2번째(args) : 쿼리 요청 시 전달된 파라미터를 가진 객체
    3번째(context) : GraphQL의 모든 리졸버가 공유하는 객체로서 로그인 인증, 데이터베이스 접근 권한 등에 사용한다.
    4번째(info) : 명령 실행 상태 정보를 가진 객체 => 잘 사용 x
*/
const movieResolver = require('./movie');
const userResolver = require('./user');
const todoResolver = require('./todo');

const resolvers = {
    Query: {
        ...movieResolver.queries,
        ...userResolver.queries,
        ...todoResolver.queries
    },
    Mutation: {
        ...movieResolver.mutations,
        ...userResolver.mutations,
        ...todoResolver.mutations
    }
};

module.exports = {
    resolvers
};