
The startup services are used to trigger and control the various services the bot needs to function.

These include nodes, databases API's, and the discord integration. Each one will need to be configured to function based on the server installation and folder structure.


> [!NOTE] Service File Location
> The service files can be found in the repository at [`/src/scripts/service_files`](https://github.com/MerkleTreeLabs/Max-Planck/tree/main/src/scripts/service_files)

## Example


```ini
[Unit]
Description=gzond node
Requires=clef.service
After=clef.service
#Before=beacon.service

[Service]
ExecStart=/home/fr1t2/zond-bot/src/scripts/startup/start-gzond.sh
WorkingDirectory=/home/fr1t2/ZOND/gzond/

Type=simple
Restart=always
User=fr1t2
Group=fr1t2
RestartSec=60

[Install]
WantedBy=multi-user.target
```


## beacon.service

## clef.service

## gzond.service

## qrl-grpc-proxy.service

## qrl-walletd.service

## zond-api.service

## zond-bot.service
