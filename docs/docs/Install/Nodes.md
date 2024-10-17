# Nodes Required To Run The Bot

## QRL

The QRL node must be accessible to the bot on port `5359`. This allows access to the walletd and walletd-grpc proxy, making unlimited addresses and simplifying the process of calling functions without protobuffs and grpc.

This requires three things to function correctly

1. QRL Node running and synced
2. The walletd daemon started on the node
3. the golang project downloaded and built on the node server (see the [docs](https://docs.theqrl.org/api/walletd-rest-proxy))



With these loaded the QRL node is complete.

The qrl bot wallet will be located in the default QRL directory `~/.qrl/` Protect it and do not loose the private keys!

> side note this file must be loaded before the walletd is started.
> 
> Stop both the `qrl-walletd` and the `wallet_grpc_proxy` if you make any changes or restore the wallet file 



## Zond Node


The zond node is ran in two parts, the validator (qrysm) and the consensus engine (gzond)

### gzond

```bash
/home/fr1t2/zond/gzond --nat=extip:0.0.0.0 \
                        --betanet \
                        --http \
                        --http.port 8545 \
                        --http.addr 192.168.1.40 \
                        --http.api "web3,net,personal,zond,engine,debug" \
                        --datadir=/home/fr1t2/zond/gzonddata \
                        --syncmode=full \
                        --allow-insecure-unlock \
                        --password "/home/fr1t2/zond/passwords.txt" \
                        --unlock="0x20d20b8026b8f02540246f58120ddaaf35aecd9b" \
                        --snapshot=false \
                        --password "/home/fr1t2/zond/passwords.txt" \
                        --gcmode=archive
```

With clef enabled

```bash
./gzond --nat=extip:0.0.0.0 --betanet --http --http.api "web3,net,personal,zond,engine, debug" --datadir=gzonddata console --syncmode=full --snapshot=false  --gcmode=archive --signer=gzonddata/clef.ipc
```

Address must be imported and allowed insecure-unlock. Also the password file must contain the password that was used to setup during the import.


```bash
./gzond account import --datadir /some-dir ./keyfile
```


### Beacon

Check the docs for the latest version of this file.

```bash
/home/fr1t2/zond/beacon-chain \
        --datadir=/home/fr1t2/zond/beacondata \
        --min-sync-peers=1 \
        --genesis-state=/home/fr1t2/zond/genesis.ssz \
        --chain-config-file=/home/fr1t2/zond/config.yml \
        --config-file=/home/fr1t2/zond/config.yml \
        --chain-id=32382 \
        --execution-endpoint=http://localhost:8551 \
        --accept-terms-of-use \
        --jwt-secret=/home/fr1t2/zond/gzonddata/gzond/jwtsecret \
        --contract-deployment-block=0 \
        --minimum-peers-per-subnet=0 \
        --p2p-static-id \
        --bootstrap-node "enr:-MK4QB1-CQAEPXFwD0D_tS08YXWPsKuaWdCzentML2JhAJnvXUR4lSPHCRXHCjudviKciwBmbPirHjyL_kmI0T1ti6qGAY0sF6hgh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDeYa1-IAAAk___________gmlkgnY0gmlwhC1MJ0KJc2VjcDI1NmsxoQN_5eo8D8pFGWUX1SMAT7kMbY2a9Ryb6Bu2oAW8s28kyYhzeW5jbmV0cwCDdGNwgjLIg3VkcIIu4A" \
        --bootstrap-node "enr:-MK4QOiaZeOWRnUyxfJv0lTbvjh-Re4zfDBW7vNWl9wIW7n8OWzMmxhy8IVHgRF7QZrkm7OGShDogEYUtdg8Bt1nIqaGAY0sFwP7h2F0dG5ldHOIAAAAAAAAAACEZXRoMpDeYa1-IAAAk___________gmlkgnY0gmlwhC0g6p2Jc2VjcDI1NmsxoQK6I2IsSSRwnOtpsnzhgACTRfYZqUQ1aTsw-K4qMR_2BohzeW5jbmV0cwCDdGNwgjLIg3VkcIIu4A"
```

Also look to the gist here for a startup service file that can be ran