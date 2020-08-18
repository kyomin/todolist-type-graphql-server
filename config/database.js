const mysql = require('mysql2');
const dbInfo = require('./dev').dbInfo;

module.exports = {
  init: function() {
    return mysql.createConnection(dbInfo);
  },
  connect: function(conn) {
    conn.connect(function(err) {
      if(err) {
          console.error('MySQL connection error : ', err);
      } else {
          console.log('MySQL is connected successfully !!');
      }
    })
  }
};