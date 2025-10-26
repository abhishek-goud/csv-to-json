require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  csvFilePath: process.env.CSV_FILE_PATH || './uploads/users.csv',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'csv_converter',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
  }
};
