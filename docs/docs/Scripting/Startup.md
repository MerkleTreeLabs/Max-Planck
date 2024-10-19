
These startup guides will get the services needed to run the bot working through `systemctl` on the host server. While not required this simplifies startup and keeps the bot functioning without intervention on reboots. 


## start-beacon.sh


## start-gzond.sh


## start-qrl-walletd.sh


## start-qrl.sh

Configure the QRL node to start using `systemctl` startup scripting

1. Modify the startup script found in the bot repo `/src/scripts/startup/start-qrl.sh` to fit to the local install (Most important is the default directory, which *should* be the block storage mount). 
2. Test the node starts with the script, and the data is being written to the right location.
3. modify the service file for the QRL in the `zond-bot/src/scripts/service_files` directory.
4. Move the file to the `/etc/systemctl/system/...` reload the services `systemctl daemon-reload`
5. start the service, and the node `systemctl start qrl.service`
6. enable the service `systemctl enable qrl.service` to let it start on startup and failure

## start-zond-api.sh

## start-zond-bot.sh

