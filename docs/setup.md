# Zond Bot Setup

Setup and configuration guide for the zond bot.

- **Server**: Vultar 8Gb RAM instance $48
- **Block Storage**: 
	- **QRL**: 120Gb HDD
	- **ZOND**: 80Gb NVME

## 1. OS Setup

Install and configure the Operating system to run the bot.

1. Add new user to run the bot
2. Secure SSH to only key based login
3. Mount QRL and ZOND Block storage to server and mount the block device. 
4. update and upgrade
5. UFW firewall rules 



UFW Firewall rules: 

```
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] OpenSSH                    ALLOW IN    Anywhere
[ 3] 19000                      ALLOW IN    Anywhere
[ 4] 30303/tcp                  ALLOW IN    Anywhere
[ 5] 30303/udp                  ALLOW IN    Anywhere
[ 6] 22/tcp (v6)                ALLOW IN    Anywhere (v6)
[ 7] OpenSSH (v6)               ALLOW IN    Anywhere (v6)
[ 8] 19000 (v6)                 ALLOW IN    Anywhere (v6)
[ 9] 30303/tcp (v6)             ALLOW IN    Anywhere (v6)
[10] 30303/udp (v6)             ALLOW IN    Anywhere (v6)
```


#### Blockstorage fstab config

```bash
echo /dev/vdb1               /home/fr1t2/ZOND       ext4    defaults,noatime,nofail 0 0 >> /etc/fstab

echo /dev/vdc1               /home/fr1t2/QRL       ext4    defaults,noatime,nofail 0 0 >> /etc/fstab

```

## 2. Node Setup

Installation and startup script configuration for the blockchain nodes.

### QRL

Following the guide here: https://docs.theqrl.org/use/node/install

#### Install the QRL Node

```bash
sudo apt-get -y install swig3.0 python3-dev python3-pip build-essential pkg-config libssl-dev libffi-dev libhwloc-dev libboost-dev cmake libleveldb-dev
pip3 install -U setuptools
pip3 install service-identity==21.1.0
pip3 install -U qrl
```
Add the executable to the path:

```bash
export PATH="/home/fr1t2/.local/bin/:$PATH"
```

#### Bootstrap QRL Node

Grab the bootstrap files `cd ~/QRL && wget https://cdn.qrl.co.in/mainnet/QRL_Mainnet_State.tar.gz`

```bash
# Extract the tar file
tar xvf QRL_Mainnet_State.tar.gz
# Creat the directory for the state
mkdir -p ~/QRL/.qrl/data
# Place the state
mv state/ ~/QRL/.qrl/data/
```

#### QRL Node Startup

Configure the QRL node to start using systemctl startup scripting

1. Modify the startup script found in the bot repo `/src/scripts/startup/start-qrl.sh` to fit to the local install (Most important is the default directory, which should be the block storage). 
2. Test the node starts with the script, and the data is being written to the right location.
3. modify the service file for the QRL in the `zond-bot/src/scripts/service_files` directory.
4. Move the file to the `/etc/systemctl/system/...` reload the services `systemctl daemon-reload`
5. start the service, and the node `systemctl start qrl.service`
6. enable the service `systemctl enable qrl.service` to let it start on startup and failure

#### QRL walletD Startup

the walletd-rest-proxy is required to run the bot, giving unlimited wallet access.

This requires GOLANG be installed.

```bash
 curl -sL https://raw.githubusercontent.com/kevincobain2000/gobrew/master/git.io.sh | bash

 # then add to path

    export PATH="$HOME/.gobrew/current/bin:$HOME/.gobrew/bin:$PATH"
    export GOROOT="$HOME/.gobrew/current/go"
```

Get the latest walletd-rest-proxy files from github `git clone https://github.com/theQRL/walletd-rest-proxy.git`

```bash
cd walletd-rest-proxy && go build
```

ensure the start-qrl-walletd.sh fits the server and give it a start to test.

If all works, move, enable, and start the `start-grpc-proxy.service` file.

---

### ZOND

Install following the guide at https://test-zond.theqrl.org/install


> changes to the install process below

- all build files are moved to the `~/.local/bin` directory that is added to $PATH
- gzond `make all` to get the clef exe


#### Overall

Zond node is structured in the following way for the zond-bot

```
/home/fr1t2/  
		├── .qrl/  
		│   ├── qrl_walletd.pid  
		│   └── walletd.log  
		├── QRL
		│   └── walletd-rest-proxy
		├── ZOND
		│   ├── beacon
		│   │   ├── beacon-chain
		│   │   ├── beacondata
		│   │   │   ├── beaconchaindata
		│   │   │   ├── metaData
		│   │   │   ├── network-keys
		│   │   │   └── tosaccepted
		│   │   ├── client-stats
		│   │   ├── qrysmctl
		│   │   └── validator
		│   ├── clef
		│   │   ├── 30c2553dea2516dc1a70
		│   │   │   └── config.json
		│   │   ├── audit.log
		│   │   ├── clef.ipc
		│   │   ├── masterseed.json
		│   │   ├── rules.js
		│   │   ├── secrets.sh
		│   │   └── signer.txt
		│   ├── gzond
		│   │   ├── go-zond
		│   │   └── gzonddata
		│   │       ├── config.yml
		│   │       ├── genesis.ssz
		│   │       ├── gzond
		│   │       └── gzond.ipc
		│   ├── keystore
		│   └── lost+found
		└── zond-bot
		    ├── docs
		    │   ├── api.md
		    │   ├── Commands.md
		    │   ├── Database.md
		    │   ├── Nodes.md
		    │   ├── README.md
		    │   └── ZondWallets.md
		    ├── package.json
		    ├── README.md
		    └── src
		        ├── api
		        │   ├── routes
		        │   └── server.js
		        ├── bots
		        │   └── discord
		        ├── config.json.example
		        ├── emojiCharacters.js
		        ├── helpers.js
		        ├── rules.js
		        ├── scripts
		        │   ├── service_files
		        │   │   ├── beacon.service
		        │   │   ├── clef.service
		        │   │   ├── gzond.service
		        │   │   ├── qrl-grpc-proxy.service
		        │   │   ├── qrl.service
		        │   │   ├── qrl-walletd.service
		        │   │   ├── zond-api.service
		        │   │   └── zond-bot.service
		        │   └── startup
		        │       ├── start-beacon.sh
		        │       ├── start-clef.sh
		        │       ├── start-gzond.sh
		        │       ├── start-qrl.sh
		        │       ├── start-qrl-walletd.sh
		        │       ├── start-zond-api.sh
		        │       └── start-zond-bot.sh
		        ├── services
		        │   ├── chain
		        │   └── database
		        └── swaggerConfig.js
```


#### startup files

modify the start up scripts to suit.

Enable system services and start all zond processes

- clef.service
- gzond.service
- beacon.service

ensure chain syncs when started and clef takes control

#### CLEF configuration

The startup file lays out the command that starts clef.

You must enable the masterseed first with a password, then save that password in the secrets.sh.example file and rename it to secrets.sh and place it in the default clef directory (~/ZOND/clef/)

This password is loaded to the module with a pipe (|) to pass the secret to the program when started. The terms enter "ok" is being suppressed with `--`


