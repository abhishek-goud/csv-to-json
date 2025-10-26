const { getClient, query } = require("../config/database");

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

// insert with transaction (simpler batched multi-row INSERT)
const insertUsers = async (users) => {
  if (!Array.isArray(users) || users.length === 0) return;
  const client = await getClient();
  const BATCH_SIZE = 1000;

  try {
    await client.query("BEGIN");

    for (let offset = 0; offset < users.length; offset += BATCH_SIZE) {
      const chunk = users.slice(offset, offset + BATCH_SIZE);

      const params = [];
      const placeholders = chunk.map((u, idx) => {
        const base = idx * 4;
        // push values in same order as columns
        params.push(
          u.name ?? null,
          u.age ?? null,
          u.address ?? null,
          u.additional_info ?? null
        );
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
      }).join(", ");

      const sql = `
        INSERT INTO users (name, age, address, additional_info)
        VALUES ${placeholders}
      `;
      await client.query(sql, params);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
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
