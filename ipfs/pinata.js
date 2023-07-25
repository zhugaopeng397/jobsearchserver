require('dotenv').config();

const key = process.env.PINATA_API_KEY;
const secret = process.env.PINATA_API_SECRET;
const JWT = process.env.PINATA_JWT;

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs')

const { Readable } = require("stream");


const testauth = async () => {
    var config = {
        method: 'get',
        url: 'https://api.pinata.cloud/data/testAuthentication',
        headers: { 
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZDU2MDI5ZC1jMWRjLTRhNTAtOTM1My1jNmY5ZDhmMTczMTkiLCJlbWFpbCI6InpodWdhb3BlbmczOTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjdjMjgyM2ZiNGZkOTFhYjJlY2YwIiwic2NvcGVkS2V5U2VjcmV0IjoiYmQ1ZTcwMjY3ZmZiMDVhNDJmNGFlYzhjYzE2ZTM2MTUwNjEwZjE0ZTQ4ZjNhZTQ2NDJiZTk0NjZmMDU1OTY1MSIsImlhdCI6MTY5MDI0NjY5NX0.7NteuU1AL276atdDfGyTyAZ7MSXn-dX30rciecTia8c'
        }
    };
    const res = await axios(config)
    console.log(res.data);
};

const uploadFromBuffer = async (buffer) => {
    const stream = Readable.from(buffer);
    const data = new FormData();
    data.append('file', stream, {
        filepath: 'cuteboy.png'
    })

    return axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
        maxBodyLength: "Infinity",
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            Authorization: `Bearer ${JWT}`
        }
        }).then(function (response) {
        console.log("image uploaded", response.data.IpfsHash)
        return {
            success: true,
            pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
    }).catch(function (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        }
    });
};

const uploadJSONToIPFS = async (JSONBody) => {
    
    var data = JSON.stringify({
        "pinataOptions": {
            "cidVersion": 1
        },
        "pinataMetadata": {
            "name": "testing",
            "keyvalues": {
            "customKey": "customValue",
            "customKey2": "customValue2"
            }
        },
        "pinataContent": JSONBody
    });

    console.log("data====", data);

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${JWT}`
        },
        data : data
    };
    return await axios(config).then(function (response) {
        console.log("json uploaded", response.data.IpfsHash)
        return {
            success: true,
            pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        }
    });
}


const uploadFileToIPFS = async (file) => {
    const formData = new FormData();
    // const src = file.originalname;
    // const file1 = fs.createReadStream(src)
    // const file1 = fs.writeFileSync(file);
    formData.append('file', file1)
    
    const metadata = JSON.stringify({
      name: 'cuteboy',
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT
        }
      });
      console.log("res=====", res);
    } catch (error) {
      console.log("error====", error);
    }
};






// const uploadJSONToIPFS = async (JSONBody) => {
//     const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
//     //making axios POST request to Pinata ⬇️
//     return axios 
//         .post(url, JSONBody, {
//             headers: {
//                 pinata_api_key: key,
//                 pinata_secret_api_key: secret,
//             }
//         })
//         .then(function (response) {
//            return {
//                success: true,
//                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
//            };
//         })
//         .catch(function (error) {
//             console.log(error)
//             return {
//                 success: false,
//                 message: error.message,
//             }

//     });
// };

// const uploadFileToIPFS = async (file) => {

//     console.log("okkok",file);
//     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//     //making axios POST request to Pinata ⬇️
    
//     let data = new FormData();
//     data.append('file', file.buffer);

//     const metadata = JSON.stringify({
//         name: 'JobSearch',
//         keyvalues: {
//             exampleKey: 'cuteboy'
//         }
//     });
//     data.append('pinataMetadata', metadata);

//     //pinataOptions are optional
//     const pinataOptions = JSON.stringify({
//         cidVersion: 0,
//         customPinPolicy: {
//             regions: [
//                 {
//                     id: 'FRA1',
//                     desiredReplicationCount: 1
//                 },
//                 {
//                     id: 'NYC1',
//                     desiredReplicationCount: 2
//                 }
//             ]
//         }
//     });
//     data.append('pinataOptions', pinataOptions);

//     return axios 
//         .post(url, data, {
//             maxBodyLength: 'Infinity',
//             headers: {
//                 'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
//                 pinata_api_key: key,
//                 pinata_secret_api_key: secret,
//             }
//         })
//         .then(function (response) {
//             console.log("image uploaded", response.data.IpfsHash)
//             return {
//                success: true,
//                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
//            };
//         })
//         .catch(function (error) {
//             console.log(error)
//             return {
//                 success: false,
//                 message: error.message,
//             }

//     });
// };


module.exports = {testauth, uploadFromBuffer, uploadJSONToIPFS, uploadFileToIPFS};

