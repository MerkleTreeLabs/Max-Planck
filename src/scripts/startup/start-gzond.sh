#! /bin/bash

/home/fr1t2/.local/bin/gzond \
	--nat=extip:0.0.0.0 \
	--betanet \
	--http \
	--http.api "web3,net,personal,zond,engine,debug" \
	--datadir=/home/fr1t2/ZOND/gzond/gzonddata \
	--syncmode=full \
	--snapshot=false \
	--gcmode=archive \
	--keystore=/home/fr1t2/ZOND/keystore \
	--datadir=/home/fr1t2/ZOND/gzond/gzonddata \
	--history.state=0 \
	--signer=/home/fr1t2/ZOND/clef/clef.ipc