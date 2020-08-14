// sequelize.define( "객체이름", 스키마 정의, 테이블 설정 )
module.exports = (sequelize, Sequelize) => {

  return sequelize.define('user', {
      uno: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      name: {
          type: Sequelize.STRING(20),
          allowNull: false,
      },
      password: {
          type: Sequelize.STRING(500),
          allowNull: false
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      roles: {
        type: Sequelize.STRING(50),
        allowNull: true
      }
  }, { timestamps: true });
}