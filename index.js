const http = require('http');


const port = 8080;

const {Db, esc, createTestDb, createTestTable} = require('./MysqlHelpers');



async function main() {
  await createTestDb();
  await createTestTable();
  let db = new Db();
  await db.query(`INSERT INTO 09errorlogs SET ${esc({errno: 1, error: "ok"})}`)
  await db.query(`INSERT INTO 09errorlogs (errno, error) VALUES ${esc([[1, '1'], [2, 'works!']])}`)
  let result = await db.query(`SELECT * FROM 09errorlogs`);
  console.log(result);
  await db.query(`DROP TABLE 09errorlogs`);
}

main().catch(console.log)

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, () => {
  console.log(`Server running at Port ${port}`);
});