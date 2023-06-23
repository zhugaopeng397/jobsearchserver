async function run() {
    const { create } = await import('ipfs-http-client');
    const ipfs = await create();
    
    // we added three attributes, add as many as you want!
    const metadata = {
        path: '/',
        content: JSON.stringify({
            name: "My First NFT",
            attributes: [
            {
                "trait_type": "Peace",
                "value": "10" 
            },
            {
                "trait_type": "Love",
                "value": "100"
            },
            {
                "trait_type": "Web3",
                "value": "999"
            }
            ],
            // update the IPFS CID to be your image CID
            image: "https://ipfs.io/ipfs/Qmb4rgWRqomezEcpY2nbg9wSajUdmX6vGi9YMTEN1NPDKW?filename=cuteboy1.jpg",
            description: "A Cute Boy1!"
        })
    };

    const result = await ipfs.add(metadata);
    console.log(result);

    process.exit(0);
}

run();