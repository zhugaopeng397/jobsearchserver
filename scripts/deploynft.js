async function main() {
    // if you changed the name of the contract, be sure to update this here!
    const MyToken = await hre.ethers.getContractFactory("JobSearchNft");
  
    const nft = await MyToken.deploy();
  
    await nft.deployed();
  
    console.log("NFT deployed to:", nft.address);
    //NFT deployed to: 0xa3b802d484980baF12d816Ec5f898919b7a73874
    
    // // mint one to yourself!
    // const signer0 = await ethers.provider.getSigner(0);
    // // update the IPFS CID to be your metadata CID
    // await nft.safeMint(await signer0.getAddress(), "ipfs://Qmbp8X71YtDdt8Hi5inoEmeys5C6U91JUYWVr3ktX8Gwqm");
  
    // console.log("NFT Minted!");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });