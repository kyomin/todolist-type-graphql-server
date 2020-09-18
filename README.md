# todolist-type-graphql-server
## make todo list using TypeScript and GraphQL and Apollo-Express-Server

서버 프로젝트의 디렉토리 구조는 다음과 같습니다.

`/config`                         => webpack 설정, 로거 모듈 설정
`/error`                          => 전역적으로 에러 발생 시 아폴로 에러 객체를 이용해 처리할 수 있도록 도와주는 클래스 정의

`/src/main_server/context`        => Apollo 서버의 컨텍스트 정의
`/src/main_server/dto`            => 서버로 들어오고 나가는 데이터 전달용 객체 정의
`/src/main_server/entity`         => 각 모델들의 엔티티 정의
`/src/main_server/enum`           => 각 엔티티에서 사용하는 enum 타입 정의
`/src/main_server/interface`      => interface 타입 정의
`/src/main_server/middleware`     => Express 서버의 미들웨어 정의
`/src/main_server/proxy`          => 각 층에서 수행하는 주 업무를 보조해주는 클래스 정의
`/src/main_server/resolver`       => 각 엔티티를 위한 리졸버 정의
`/src/main_server/service`        => 리졸버로의 요청(Query, Mutation)을 처리하기 위한 비즈니스 로직을 담당하는 서비스 정의
`/src/main_server/utils`          => 전역적으로 사용하는 상수 정의

`/src/main_server/MainServer.ts`  => Apollo Express Server 엔트리 포인트
