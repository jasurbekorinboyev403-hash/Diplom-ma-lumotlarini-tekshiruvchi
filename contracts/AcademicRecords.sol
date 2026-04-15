// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AcademicRecords {
    struct Record {
        uint256 id;
        string studentWalletId;
        address studentAddress;
        string studentName;
        string institutionName;
        string programName;
        string credentialType;
        string grade;
        string metadataUri;
        string detailsHash;
        uint256 issuedAt;
        address issuer;
        bool revoked;
    }

    uint256 private nextRecordId = 1;
    address public owner;

    mapping(address => bool) public authorizedIssuers;
    mapping(uint256 => Record) private records;
    mapping(string => uint256[]) private recordsByStudentWalletId;
    mapping(address => uint256[]) private recordsSharedWith;

    event IssuerAuthorized(address indexed issuer, bool allowed);
    event RecordIssued(uint256 indexed id, string indexed studentWalletId, address indexed issuer);
    event RecordRevoked(uint256 indexed id, address indexed issuer);
    event RecordShared(uint256 indexed id, address indexed viewer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner, "Not authorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
    }

    function authorizeIssuer(address issuer, bool allowed) external onlyOwner {
        authorizedIssuers[issuer] = allowed;
        emit IssuerAuthorized(issuer, allowed);
    }

    function issueRecord(
        string calldata studentWalletId,
        address studentAddress,
        string calldata studentName,
        string calldata institutionName,
        string calldata programName,
        string calldata credentialType,
        string calldata grade,
        string calldata metadataUri,
        string calldata detailsHash
    ) external onlyAuthorizedIssuer returns (uint256) {
        require(bytes(studentWalletId).length > 0, "Student wallet id required");
        require(studentAddress != address(0), "Student address required");
        require(bytes(studentName).length > 0, "Student name required");
        require(bytes(institutionName).length > 0, "Institution required");
        require(bytes(programName).length > 0, "Program required");
        require(bytes(credentialType).length > 0, "Credential type required");
        require(bytes(detailsHash).length > 0, "Hash required");

        uint256 id = nextRecordId;
        nextRecordId += 1;

        records[id] = Record({
            id: id,
            studentWalletId: studentWalletId,
            studentAddress: studentAddress,
            studentName: studentName,
            institutionName: institutionName,
            programName: programName,
            credentialType: credentialType,
            grade: grade,
            metadataUri: metadataUri,
            detailsHash: detailsHash,
            issuedAt: block.timestamp,
            issuer: msg.sender,
            revoked: false
        });

        recordsByStudentWalletId[studentWalletId].push(id);

        emit RecordIssued(id, studentWalletId, msg.sender);
        return id;
    }

    function revokeRecord(uint256 recordId) external onlyAuthorizedIssuer {
        require(records[recordId].id != 0, "Record not found");
        records[recordId].revoked = true;
        emit RecordRevoked(recordId, msg.sender);
    }

    function shareRecord(uint256 recordId, address viewer) external {
        require(records[recordId].id != 0, "Record not found");
        require(
            msg.sender == records[recordId].studentAddress ||
            authorizedIssuers[msg.sender] ||
            msg.sender == owner,
            "Not allowed to share"
        );
        recordsSharedWith[viewer].push(recordId);
        emit RecordShared(recordId, viewer);
    }

    function verifyRecord(uint256 recordId, string calldata detailsHash)
        external
        view
        returns (bool isValid, bool isRevoked)
    {
        Record memory record = records[recordId];
        require(record.id != 0, "Record not found");
        return (
            keccak256(abi.encodePacked(record.detailsHash)) == keccak256(abi.encodePacked(detailsHash)),
            record.revoked
        );
    }

    function getRecord(uint256 recordId) external view returns (Record memory) {
        require(records[recordId].id != 0, "Record not found");
        return records[recordId];
    }

    function getRecordsByStudentWalletId(string calldata studentWalletId) external view returns (uint256[] memory) {
        return recordsByStudentWalletId[studentWalletId];
    }

    function getSharedRecords(address viewer) external view returns (uint256[] memory) {
        return recordsSharedWith[viewer];
    }
}
