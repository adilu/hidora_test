const http = require('http');
const fs = require("fs").promises
const {log, logError, warn, logger} = require("3e8-logremote");

const port = 8080;

const {Db, esc, createTestDb, createTestTable} = require('./MysqlHelpers');

let db;

async function test() {
  await createTestTable(db);
  await db.query(`INSERT INTO 09errorlogs SET ${esc({errno: 1, error: "ok"})}`)
  await db.query(`INSERT INTO 09errorlogs (errno, error) VALUES ${esc([[1, '1'], [2, 'works!']])}`)
  let result = await db.query(`SELECT * FROM 09errorlogs`);
  await db.query(`DROP TABLE 09errorlogs`);
  let files = await fs.readdir("./")
  let up = await fs.readdir("../")
  let data;
  try {
    data = await fs.readdir("/data")
  }
  catch(e) {logError(e)}
  log(files)
  let t = Date.now()
  await fs.writeFile(t+".txt", "aaa");
  //await fs.writeFile("/h" +t+".txt", "aaa");
  return {result, files, up, data};
}

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  let result = await test();
  res.end(JSON.stringify(result));
});

async function init() {

  await createTestDb();
  db = new Db();

  server.listen(port, () => {
    console.log(`Server running at Port ${port}`);
  });
}


init().catch(console.log)