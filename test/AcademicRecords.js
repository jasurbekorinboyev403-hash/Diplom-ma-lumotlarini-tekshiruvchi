import { expect } from "chai";
import hardhat from "hardhat";

const { ethers } = hardhat;

describe("AcademicRecords", function () {
  async function deployFixture() {
    const [owner, student, employer] = await ethers.getSigners();
    const academicRecords = await ethers.deployContract("AcademicRecords");
    await academicRecords.waitForDeployment();
    return { academicRecords, owner, student, employer };
  }

  it("issues and verifies a record", async function () {
    const { academicRecords, student } = await deployFixture();
    const detailsHash = ethers.keccak256(ethers.toUtf8Bytes("demo-hash"));

    await academicRecords.issueRecord(
      "student-001",
      student.address,
      "Ali Valiyev",
      "Tashkent State University",
      "Computer Science",
      "Diploma",
      "A",
      "ipfs://demo",
      detailsHash
    );

    const [isValid, isRevoked] = await academicRecords.verifyRecord(1, detailsHash);
    const record = await academicRecords.getRecord(1);

    expect(isValid).to.equal(true);
    expect(isRevoked).to.equal(false);
    expect(record.studentName).to.equal("Ali Valiyev");
    expect(record.studentAddress).to.equal(student.address);
  });

  it("allows the student to share a record", async function () {
    const { academicRecords, student, employer } = await deployFixture();
    const detailsHash = ethers.keccak256(ethers.toUtf8Bytes("share-hash"));

    await academicRecords.issueRecord(
      "student-002",
      student.address,
      "Madina Karimova",
      "Open Learning Center",
      "Blockchain Bootcamp",
      "Certificate",
      "98",
      "ipfs://share",
      detailsHash
    );

    await academicRecords.connect(student).shareRecord(1, employer.address);
    const sharedIds = await academicRecords.getSharedRecords(employer.address);

    expect(sharedIds.map((value) => Number(value))).to.deep.equal([1]);
  });
});
