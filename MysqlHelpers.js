var mysql = require('mysql');
var nodeCleanup = require('node-cleanup');

const _mysql_pw = process.env._MYSQL_PW || 'root00020';
const _mysql_user = process.env._MYSQL_USER || 'root';
const _mysql_url =  process.env._MYSQL_URL || 'localhost';
const _mysql_port =  3306;

const CONFIG = {
  host: _mysql_url,
  user: _mysql_user,
  password: _mysql_pw,
  port: _mysql_port
}

async function createTestDb() {
  let connection = mysql.createConnection(CONFIG);
  return new Promise((resolve, reject) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS hidora_test CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`, (err, result)=>{
      if(err) throw err;
      connection.end();
      resolve();
    })
  });
}

async function createTestTable(db = new Db()) {
  await (db.query(`CREATE TABLE IF NOT EXISTS 09errorlogs(
      \`fehler\` int(11) NOT NULL AUTO_INCREMENT,
      \`errno\` int(11) NOT NULL,
      \`error\` text NOT NULL,
      \`usr\` text,
      \`datum\` datetime DEFAULT CURRENT_TIMESTAMP,
      \`erledigt\` int(1) DEFAULT 0,
      PRIMARY KEY (\`fehler\`)
    ) ENGINE=InnoDB 
  `));
}

class Db {
  constructor(dbname = 'hidora_test') {
    this.pool = mysql.createPool({
      ...CONFIG,
      database: dbname
    });
    nodeCleanup((exitCode, signal) => {
      this.pool.end();
      console.log({exitCode, signal});
      return true;
    });
  }
  async query(sql, args) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, args, function(err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    }); 
  }
  
  // end() {
  // 	this.pool.end();
  // }
}

module.exports = {Db, esc: mysql.escape.bind(mysql), createTestDb, createTestTable}