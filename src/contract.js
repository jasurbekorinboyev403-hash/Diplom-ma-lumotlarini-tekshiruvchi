export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "0xYourContractAddress";

export const contractAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "allowed",
        "type": "bool"
      }
    ],
    "name": "IssuerAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "studentWalletId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "RecordIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "viewer",
        "type": "address"
      }
    ],
    "name": "RecordShared",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "RecordRevoked",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "allowed",
        "type": "bool"
      }
    ],
    "name": "authorizeIssuer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      }
    ],
    "name": "getRecord",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "studentWalletId", "type": "string" },
          { "internalType": "address", "name": "studentAddress", "type": "address" },
          { "internalType": "string", "name": "studentName", "type": "string" },
          { "internalType": "string", "name": "institutionName", "type": "string" },
          { "internalType": "string", "name": "programName", "type": "string" },
          { "internalType": "string", "name": "credentialType", "type": "string" },
          { "internalType": "string", "name": "grade", "type": "string" },
          { "internalType": "string", "name": "metadataUri", "type": "string" },
          { "internalType": "string", "name": "detailsHash", "type": "string" },
          { "internalType": "uint256", "name": "issuedAt", "type": "uint256" },
          { "internalType": "address", "name": "issuer", "type": "address" },
          { "internalType": "bool", "name": "revoked", "type": "bool" }
        ],
        "internalType": "struct AcademicRecords.Record",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "studentWalletId",
        "type": "string"
      }
    ],
    "name": "getRecordsByStudentWalletId",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "viewer",
        "type": "address"
      }
    ],
    "name": "getSharedRecords",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "studentWalletId", "type": "string" },
      { "internalType": "address", "name": "studentAddress", "type": "address" },
      { "internalType": "string", "name": "studentName", "type": "string" },
      { "internalType": "string", "name": "institutionName", "type": "string" },
      { "internalType": "string", "name": "programName", "type": "string" },
      { "internalType": "string", "name": "credentialType", "type": "string" },
      { "internalType": "string", "name": "grade", "type": "string" },
      { "internalType": "string", "name": "metadataUri", "type": "string" },
      { "internalType": "string", "name": "detailsHash", "type": "string" }
    ],
    "name": "issueRecord",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "recordId", "type": "uint256" }
    ],
    "name": "revokeRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "recordId", "type": "uint256" },
      { "internalType": "address", "name": "viewer", "type": "address" }
    ],
    "name": "shareRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "detailsHash",
        "type": "string"
      }
    ],
    "name": "verifyRecord",
    "outputs": [
      { "internalType": "bool", "name": "isValid", "type": "bool" },
      { "internalType": "bool", "name": "isRevoked", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
