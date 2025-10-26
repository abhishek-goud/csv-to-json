const fs = require("fs").promises;

// Read file content
const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    throw new Error(`Failed to read CSV file: ${error.message}`);
  }
};

// trim lines
const parseLines = (content) =>
  content.split("\n").filter((line) => line.trim());

// Parse a single csv file line
const parseCsvLine = (line) => {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
};

module.exports = {
  readFile,
  parseLines,
  parseCsvLine,
};
