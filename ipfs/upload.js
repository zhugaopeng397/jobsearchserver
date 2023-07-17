async function run() {
    const { create } = await import('ipfs-http-client');
    const ipfs = await create();
    
    // we added three attributes, add as many as you want!
    const metadata = {
        path: '/',
        content: JSON.stringify({
            name: "My Third NFT",
            attributes: [
            {
                "trait_type": "Peace",
                "value": "7" 
            },
            {
                "trait_type": "Love",
                "value": "77"
            },
            {
                "trait_type": "Web3",
                "value": "777"
            }
            ],
            // update the IPFS CID to be your image CID
            image: "https://ipfs.io/ipfs/QmXaK8XcTM3RNsPgEzMmzaUYiaiHovatGz5R1pUHUHr7t8?filename=cuteboy3.jpg",
            description: "A Cute Boy3!"
        })
    };

    const result = await ipfs.add(metadata);
    console.log(result);

    process.exit(0);
}

run();