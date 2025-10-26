const { Pool } = require("pg");
const config = require("./app.config");

let connection = null; // shared singleton instance

// create or return existing connection
const getConnection = () => {
  if (!connection) {
    connection = new Pool(config.db);
    console.log("connected to DB");
  }
  return connection;
};

const query = async (text, params) => {
  const db = getConnection();
  const start = Date.now();
  const res = await db.query(text, params);
  const duration = Date.now() - start;
  console.log("Executed query", { text, duration, rows: res.rowCount });
  return res;
};

// get client 
const getClient = async () => {
  const db = getConnection();
  return await db.connect();
};

//  close connection 
const end = async () => {
  if (connection) {
    await connection.end();
    console.log("DB connection closed");
    connection = null;
  }
};

module.exports = {
  query,
  getClient,
  end,
};
