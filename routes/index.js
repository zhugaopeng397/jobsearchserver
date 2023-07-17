require("dotenv").config();
const ethers = require('ethers');
const axios = require('axios');

var {createClient} = require('@vercel/postgres');
var express = require('express');
// const { Network, Alchemy } = require('alchemy-sdk');

var router = express.Router();

const contractNftABI = [
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
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_fromTokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_toTokenId",
        "type": "uint256"
      }
    ],
    "name": "BatchMetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "MetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "safeMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// const settings = {
//   apiKey: process.env.TESTNET_ALCHEMY_KEY,
//   network: Network.ETH_GOERLI,
// }
// const alchemy = new Alchemy(settings);
const nftContractAddr = process.env.NFT_CONTRACT_ADDRESS;
const alchemyKey =  process.env.TESTNET_ALCHEMY_KEY;

const provider = new ethers.providers.AlchemyProvider(
  'goerli',
  alchemyKey
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/jobs', async function(req, res, next) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL,
  });

  await client.connect();

  try {
    const { rows } = await client.sql`SELECT * FROM job;`;
    res.status(200).json({data:rows});
  } finally {
    await client.end();
  }
});

router.get('/job', async function(req, res, next) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL,
  });

  await client.connect();

  try {
    console.log(req.query);
    const jobid = req.query.jobid;
    const { rows } = await client.sql`SELECT * FROM jobdescription WHERE jobid=${jobid};`;
    res.status(200).json({data:rows});
  } finally {
    await client.end();
  }
});

router.get('/getAllNfts', async function(req, res, next) {
  //虽然在全局已经设置过，但在该接口还得设置一次，否则还是出现跨域问题。
  //貌似问题出在该接口又请求了另一个域名的接口，但不确定具体什么原因。
  res.setHeader('Access-Control-Allow-Origin', '*');

  const options = {
    method: 'GET',
    url: `https://eth-mainnet.g.alchemy.com/nft/v3/${alchemyKey}/getNFTsForContract`,
    params: {
      contractAddress: nftContractAddr,
      withMetadata: 'true'
    },
    headers: {accept: 'application/json'}
  };
  
  axios.request(options).then(function (response) {
      console.log(response.data);
      res.status(200).json(response.data);
      aa = response.data
    }).catch(function (error) {
      console.error(error);
    });

});

router.get('/nft', async function(req, res, next) {
  
  const jobid = req.query.jobid;
  const useraddress = req.query.useraddress;

  const contractNft = new ethers.Contract(
    nftContractAddr,
    contractNftABI,
    wallet
  );

  if (jobid == 1) {
    metadataCID = "Qmbp8X71YtDdt8Hi5inoEmeys5C6U91JUYWVr3ktX8Gwqm";
  } else {
    metadataCID = "Qmbp8X71YtDdt8Hi5inoEmeys5C6U91JUYWVr3ktX8Gwqm";
  }

  const nft = `ipfs://${metadataCID}`;

  await contractNft.safeMint(useraddress, nft);

  console.log('nft minted');
  res.status(200).json({result:true});
})

router.get('/nft/transfer', async function(req, res, next) {
  
  const jobid = req.query.jobid;
  const from = req.query.from;
  const to = req.query.to;

  const contractNft = new ethers.Contract(
    contractNftAddr,
    contractNftABI,
    wallet
  );

  let tokenId = '';
  if (jobid == 1) {
    tokenId = 1;
  } else {
    tokenId = 1;
  }


  // create the signer instance
  const wallet1 = new ethers.Wallet(process.env.PRIVATE_KEY_WINTER, provider);

  const tx = await contractNft.connect(wallet1).setApprovalForAll(to, true);
  await tx.wait();
  console.log("setApprovalForAll");
  await contractNft['safeTransferFrom(address,address,uint256)'](from, to, tokenId);


  console.log('nft transferred');
  res.status(200).json({result:true});
})


module.exports = router;
