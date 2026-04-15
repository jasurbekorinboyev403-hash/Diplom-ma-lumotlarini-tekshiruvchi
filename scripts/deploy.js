import hre from "hardhat";

async function main() {
  const academicRecords = await hre.ethers.deployContract("AcademicRecords");
  await academicRecords.waitForDeployment();

  const contractAddress = await academicRecords.getAddress();
  console.log(`AcademicRecords deployed to: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
