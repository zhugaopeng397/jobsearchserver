// import pinata from '../ipfs/pinata.js';

require("dotenv").config();
const ethers = require('ethers');
const axios = require('axios');

var {createClient} = require('@vercel/postgres');
var express = require('express');

const { testauth, uploadFromBuffer, uploadFileToIPFS, uploadJSONToIPFS } = require("../ipfs/pinata.js");

// const pinata  = require("../ipfs/pinata.js");
const multer = require('multer');
const upload = multer();
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "currentlyListed",
        "type": "bool"
      }
    ],
    "name": "TokenListedSuccess",
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
    "inputs": [],
    "name": "basePercent",
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
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "createToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
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
    "name": "executeSale",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllNFTs",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "currentlyListed",
            "type": "bool"
          }
        ],
        "internalType": "struct JobSearchNft.ListedToken[]",
        "name": "",
        "type": "tuple[]"
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
    "inputs": [],
    "name": "getCurrentToken",
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
    "inputs": [],
    "name": "getLatestIdToListedToken",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "currentlyListed",
            "type": "bool"
          }
        ],
        "internalType": "struct JobSearchNft.ListedToken",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getListPrice",
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
    "name": "getListedTokenForId",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "currentlyListed",
            "type": "bool"
          }
        ],
        "internalType": "struct JobSearchNft.ListedToken",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyNFTs",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "currentlyListed",
            "type": "bool"
          }
        ],
        "internalType": "struct JobSearchNft.ListedToken[]",
        "name": "",
        "type": "tuple[]"
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "resellNft",
    "outputs": [],
    "stateMutability": "payable",
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
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "tenPercent",
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
        "internalType": "uint256",
        "name": "_listPrice",
        "type": "uint256"
      }
    ],
    "name": "updateListPrice",
    "outputs": [],
    "stateMutability": "payable",
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
const contractNft = new ethers.Contract(
  nftContractAddr,
  contractNftABI,
  wallet
);
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


router.post('/nft/uploadFile', upload.single('file'), async function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const file = req.file;
  console.log("req.file===", file);
  try {
    //upload the file to IPFS
    // const response = await uploadFileToIPFS(file);
    const response = await uploadFromBuffer(file.buffer);
    // const response = await testauth();
    
    console.log("response===",response);
    if(response.success === true) {
        console.log("Uploaded image to Pinata: ", response.pinataURL)
        res.status(200).json({
          success: true,
          pinataURL:response.pinataURL
        });
    }
  }
  catch(error) {
      console.log("Error during file upload", error);
      res.status(200).json({
        success: false,
        message: error.message
      });
  }
}) 

router.post('/nft/listnft', async function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const metadata = req.body;
    console.log("metadata===", metadata);
    // console.log("req===", req);

    //upload the metadata JSON to IPFS
    const response = await uploadJSONToIPFS(metadata);
    if(response.success === true){
      console.log("Uploaded JSON to Pinata: ", response.pinataURL);
    
      // const metadataURL = await uploadMetadataToIPFS(metadata);
      const price = ethers.utils.parseUnits(metadata.price, 'ether');
      console.log("price===", price);
      let listingPrice = await contractNft.getListPrice();
      listingPrice = listingPrice.toString();
      console.log("listingPrice===", listingPrice);

      //actually create the NFT
      let transaction = await contractNft.createToken(response.pinataURL, price, { value: listingPrice });
      await transaction.wait();
      console.log("NFT listed successfully!");
      res.status(200).json({
        success: true
      });
    }
  } catch(error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
})


// //This function uploads the metadata to IPFS
// async function uploadMetadataToIPFS(metadata) {
//   // const {name, description, price} = formParams;
//   // //Make sure that none of the fields are empty
//   // if( !name || !description || !price || !fileURL)
//   //     return;

//   // const nftJSON = {
//   //     name, description, price, image: fileURL
//   // }

//   try {
//       //upload the metadata JSON to IPFS
//       const response = await uploadJSONToIPFS(metadata);
//       if(response.success === true){
//           console.log("Uploaded JSON to Pinata: ", response);
//           return response.pinataURL;
//       }
//   }
//   catch(e) {
//       console.log("error uploading JSON metadata:", e)
//   }
// }

module.exports = router;
