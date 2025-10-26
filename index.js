const express = require('express');
const config = require('./config/app.config');
const {processCSV} = require('./controllers/user.controller');

const app = express();

app.use(express.json());

// Routes
app.get('/api/process-csv', (req, res) => processCSV(req, res));

app.get('/check-status', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`CSV file path: ${config.csvFilePath}`);
});
