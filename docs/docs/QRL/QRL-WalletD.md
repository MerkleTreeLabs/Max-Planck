The QRL walletd-rest-proxy is required to run the QRL portion of the bot, giving unlimited wallet access to the xmss addresses and slave tree system.

## Golang

This requires GOLANG be installed.

```bash
 curl -sL https://raw.githubusercontent.com/kevincobain2000/gobrew/master/git.io.sh | bash

 # then add to path

    export PATH="$HOME/.gobrew/current/bin:$HOME/.gobrew/bin:$PATH"
    export GOROOT="$HOME/.gobrew/current/go"
```

## walletd-rest-proxy

Get the latest walletd-rest-proxy files from github 

```bash
git clone https://github.com/theQRL/walletd-rest-proxy.git 
cd walletd-rest-proxy && go build
```


## Startup Command

```bash
 /home/fr1t2/QRL/walletd-rest-proxy/walletd-rest-proxy -serverIPPort 127.0.0.1:5359 -walletServiceEndpoint 127.0.0.1:19010 -log_dir /home/fr1t2/QRL/
```