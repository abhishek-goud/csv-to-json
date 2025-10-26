const { getAgeDistribution, getTotalCount } = require("../models/user.model");

//print Age Distribution Report
const generateAgeDistributionReport = async () => {
  const distribution = await getAgeDistribution();
  const total = await getTotalCount();

  console.log("\n" + "=".repeat(50));
  console.log("AGE DISTRIBUTION REPORT");
  console.log("=".repeat(50));
  console.log("Age-Group       % Distribution");
  console.log("-".repeat(50));

  distribution.forEach((row) => {
    const percentage = ((row.count / total) * 100).toFixed(2);
    const ageGroup = row.age_group.padEnd(15);
    console.log(`${ageGroup} ${percentage}`);
  });

  console.log("=".repeat(50) + "\n");
};

module.exports = {
  generateAgeDistributionReport,
};
