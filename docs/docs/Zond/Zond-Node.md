
### ZOND

Install following the guide at https://test-zond.theqrl.org/install


> changes to the install process below

- all build files are moved to the `~/.local/bin` directory that is added to $PATH
- gzond `make all` to get the clef exe


#### Overall

Zond node is structured in the following way:

```
/home/fr1t2/  
	└── ZOND
	    ├── beacon
	    │   ├── beacon-chain
	    │   ├── beacondata
	    │   │   ├── beaconchaindata
	    │   │   ├── metaData
	    │   │   ├── network-keys
	    │   │   └── tosaccepted
	    │   ├── client-stats
	    │   ├── qrysmctl
	    │   └── validator
	    ├── clef
	    │   ├── 30c2553dea2516dc1a70
	    │   │   └── config.json
	    │   ├── audit.log
	    │   ├── clef.ipc
	    │   ├── masterseed.json
	    │   ├── rules.js
	    │   ├── secrets.sh
	    │   └── signer.txt
	    ├── gzond
	    │   ├── go-zond
	    │   └── gzonddata
	    │       ├── config.yml
	    │       ├── genesis.ssz
	    │       ├── gzond
	    │       └── gzond.ipc
	    ├── keystore
	    └── lost+found
		
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


