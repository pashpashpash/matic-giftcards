/* eslint-disable require-jsdoc */
const {
    DefenderRelaySigner,
    DefenderRelayProvider,
} = require('defender-relay-client/lib/ethers');
const ethers = require('ethers');

const REDEEMABLE_NATIVE = '0xC9b8F651c1D86cB3C4408755Af1340295c3441F5';

const RedeemableNative = {
    "contractName": "RedeemableNative",
    "abi": [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "slotId",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenAmount",
            "type": "uint256"
          }
        ],
        "name": "Deposit",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address payable",
            "name": "relayerAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "functionSignature",
            "type": "bytes"
          }
        ],
        "name": "MetaTransactionExecuted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "slotId",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "Redeem",
        "type": "event"
      },
      {
        "stateMutability": "payable",
        "type": "fallback",
        "payable": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "functionSignature",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "sigR",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "sigS",
            "type": "bytes32"
          },
          {
            "internalType": "uint8",
            "name": "sigV",
            "type": "uint8"
          }
        ],
        "name": "executeMetaTransaction",
        "outputs": [
          {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
          }
        ],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "getNonce",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "slotId",
            "type": "address"
          }
        ],
        "name": "isSlotActive",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "slotId",
            "type": "address"
          }
        ],
        "name": "slotData",
        "outputs": [
          {
            "components": [
              {
                "internalType": "bool",
                "name": "used",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
              },
              {
                "internalType": "uint256[]",
                "name": "tokenAmount",
                "type": "uint256[]"
              }
            ],
            "internalType": "struct RedeemableNative.TokenSlot",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "slotId",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "redeem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "networks": {
      "137": {
        "events": {
          "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c": {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "slotId",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
              }
            ],
            "name": "Deposit",
            "type": "event"
          },
          "0x5845892132946850460bff5a0083f71031bc5bf9aadcd40f1de79423eac9b10b": {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "address payable",
                "name": "relayerAddress",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "bytes",
                "name": "functionSignature",
                "type": "bytes"
              }
            ],
            "name": "MetaTransactionExecuted",
            "type": "event"
          },
          "0x2f39d8fc9160ae00ea6a02229ae376184d7ad48d669c511863fedeb3f6f27edf": {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "slotId",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
              }
            ],
            "name": "Redeem",
            "type": "event"
          }
        },
        "links": {},
        "address": "0xC9b8F651c1D86cB3C4408755Af1340295c3441F5",
        "transactionHash": "0x3c21866ec93d5c90a5c46bca02af9eada2fb77f58c5efb4f35de3cf7541622a9"
      }
    },
    "schemaVersion": "3.3.4",
    "updatedAt": "2022-11-05T21:25:50.832Z",
    "networkType": "ethereum",
  }
// eslint-disable-next-line func-style
async function handler(event) {
    // Parse webhook payload
    if (!event.request || !event.request.body) throw new Error(`Missing payload`);
    // eslint-disable-next-line prefer-const
    let {
        depositaccountaddress,
        functionsignature,
        r,
        s,
        v,
    } = event.request.body;
    r = JSON.parse(r);
    r = new Uint8Array(r.data);
    s = JSON.parse(s);
    s = new Uint8Array(s.data);
    v = parseInt(v, 10);

    // Initialize Relayer provider and signer, and redeemable contract
    const credentials = { ...event };
    const provider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, provider, {
        speed: 'fast',
    });

    const contract = new ethers.Contract(
        REDEEMABLE_NATIVE,
        RedeemableNative.abi,
        signer
    );
    await contract.functions.executeMetaTransaction(
        depositaccountaddress,
        functionsignature,
        r, // bytes32
        s, // bytes32
        v // uint8
    );
}


module.exports = {
    handler,
};
