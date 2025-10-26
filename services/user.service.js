const { insertUsers } = require("../models/user.model");

// Extract mandatory fields from a JSON record
const extractMandatoryFields = (record) => {
    // console.log("user",record)
  const { name, age, address, ...rest } = record;

  const fullName = name
    ? `${name.firstName || ""} ${name.lastName || ""}`.trim()
    : "";

  return {
    name: fullName,
    age: parseInt(age) || 0,
    address: address || null,
    additional_info: Object.keys(rest).length > 0 ? rest : null,
  };
};

// Save array of json records into the database
const saveUsers = async (jsonRecords) => {
  const users = jsonRecords.map((record) => extractMandatoryFields(record));
  await insertUsers(users);
  return users.length;
};

module.exports = {
  extractMandatoryFields,
  saveUsers,
};
