const { readFile } = require("../utils/csv.reader");
const { convertToJson } = require("../services/csv.parser.service");
const { saveUsers } = require("../services/user.service");
const { generateAgeDistributionReport } = require("../services/report.service");
const { createTable, truncate } = require("../models/user.model");
const config = require("../config/app.config");

// Process CSV, save users, and generate report
const processCSV = async (req, res) => {
  try {
    console.log("Starting CSV processing...");

    // Ensure table exists
    await createTable();

    // Read CSV file
    const csvContent = await readFile(config.csvFilePath);
    console.log("csv file read successfully");

    // Parse CSV to JSON
    const jsonRecords = convertToJson(csvContent);
    console.log(`Parsed ${jsonRecords.length} records`);

    // Clear existing data
    await truncate();

    // Save to database
    const savedCount = await saveUsers(jsonRecords);
    console.log(`Saved ${savedCount} users to database`);

    // Generate report
    await generateAgeDistributionReport();

    res.json({
      success: true,
      message: "csv processed successfully",
      recordsProcessed: savedCount,
    });
  } catch (error) {
    console.error("Error processing csv:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  processCSV,
};
