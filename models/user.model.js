const { getClient, query } = require("../config/database");
const { Readable } = require('stream');
const copyFrom = require('pg-copy-streams').from;


// Create the users table if not exists
const createTable = async () => {
  const tableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      age INTEGER NOT NULL,
      address JSONB NULL,
      additional_info JSONB NULL
    )
  `;
  await query(tableQuery);
};

// Truncate (clear) users table
const truncate = async () => {
  await query("TRUNCATE TABLE users RESTART IDENTITY");
};

// Batch insert with transaction
const insertUsers = async (users) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO users (name, age, address, additional_info)
      VALUES ($1, $2, $3, $4)
    `;

    for (const user of users) {
      await client.query(insertQuery, [
        user.name,
        user.age,
        user.address,
        user.additional_info,
      ]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


// Age distribution grouped into categories
const getAgeDistribution = async () => {
  const sql = `
    SELECT 
      age_group,
      COUNT(*) as count
    FROM (
      SELECT 
        CASE 
          WHEN age < 20 THEN '< 20'
          WHEN age >= 20 AND age < 40 THEN '20 to 40'
          WHEN age >= 40 AND age < 60 THEN '40 to 60'
          ELSE '> 60'
        END as age_group
      FROM users
    ) as age_groups
    GROUP BY age_group
    ORDER BY 
      CASE age_group
        WHEN '< 20' THEN 1
        WHEN '20 to 40' THEN 2
        WHEN '40 to 60' THEN 3
        WHEN '> 60' THEN 4
      END
  `;

  const result = await query(sql);
  return result.rows;
};

// Get total user count
const getTotalCount = async () => {
  const result = await query("SELECT COUNT(*) as count FROM users");
  return parseInt(result.rows[0].count);
};

module.exports = {
  createTable,
  truncate,
  insertUsers,
  getAgeDistribution,
  getTotalCount,
};
