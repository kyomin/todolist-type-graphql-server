/*
    '스키마' 정의.
    스키마는 서버에 어떻게(how) 데이터를 요청할지 정의한 파일이다.
    요청 시 어떤 데이터를 얼마나 요청할지,
    각각의 데이터의 자료형이 무엇이고, 어떤 데이터를 필수로 요청할지에 대한 정보가 담긴다.
    즉, 사용자는 반드시 스키마에 정의된 형태로 서버에 요청해야 한다.

    - Query : 데이터베이스에서 데이터를 읽는 요청 (Read)
    - Mutation : 데이터베이스를 수정하는 요청 (Create, Update)

    스키마엔 Query, Mutatio과 같이 2가지 요청 type이 있다.
    또한, 본문의 코드와 같이 스키마엔 데이터베이스 구조(Movie)도 정의해야 한다.
    그래야 GraphQL 서버에서 데이터베이스 구조를 알고 처리할 수 있다.

    본문의 코드는 다음을 의미한다.

    - 서버에 Query 형태로 movies를 요청하면 Movie의 배열이 반드시 반환된다.
    - 서버에 Mutation 형태로 파라미터와 함께 addMovie를 요청하면 Movie가 반드시 반환된다.

    ! : Not Nullable. 데이터가 꼭 있어야 한다.
    [] : 배열
*/
const { gql } = require('apollo-server');

const movieSchema = require('./movie');
const userSchema = require('./user');

const typeDefs = gql`
    ${movieSchema.types}
    ${userSchema.types}

    type Query {
        ${movieSchema.queries}
        ${userSchema.queries}
    }

    type Mutation {
        ${movieSchema.mutations}
        ${userSchema.mutations}
    }
`

module.exports = {
    typeDefs
};