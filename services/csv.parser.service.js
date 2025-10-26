// Parse csv header line into array of trimmed strings
const parseHeaders = (headerLine) => headerLine.split(",").map((h) => h.trim());

// Build nested object from dot notation ["user.address.city": "mumbai"]
const buildNestedObject = (keys, value) => {
  const result = {};
  const parts = keys.split(".");
  let current = result;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    current[part] = current[part] || {};
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
  return result;
};

// Deep merge two objects (non-destructive)
const mergeObjects = (target, source) => {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      target[key] = target[key] || {};
      mergeObjects(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

// Parse one CSV row into JSON object based on headers
const parseRow = (headers, values) => {
  const obj = {};

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const value = values[i] || "";

    if (header.includes(".")) {
      const nested = buildNestedObject(header, value);
      mergeObjects(obj, nested);
    } else {
      obj[header] = value;
    }
  }
  // console.log("parsed row:", obj);
  return obj;
};

// Convert entire CSV content into JSON array
const convertToJson = (csvContent) => {
  const lines = csvContent.split("\n").filter((line) => line.trim());

  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = parseHeaders(lines[0]);
  const records = [];
  // console.log("headers:", headers);
  // console.log("tempHeader", parseHeaders('userId,name.firstName,name.lastName,email'));
  // console.log("line0",lines[0])
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const record = parseRow(headers, values);
    records.push(record);
  }
  // console.log("converted to json:", records);
  return records;
};

module.exports = {
  parseHeaders,
  buildNestedObject,
  mergeObjects,
  parseRow,
  convertToJson,
};
