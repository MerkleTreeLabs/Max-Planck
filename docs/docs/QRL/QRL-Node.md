# QRL Node 


### QRL

Following the guide here: https://docs.theqrl.org/use/node/install

```
/home/fr1t2/  
	├── .qrl/  
	│   ├── qrl_walletd.pid  
	│   └── walletd.log  
	├── QRL
	│   └── walletd-rest-proxy
```
	

## Install the QRL Node

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

## Bootstrap QRL Node

Grab the bootstrap files `cd ~/QRL && wget https://cdn.qrl.co.in/mainnet/QRL_Mainnet_State.tar.gz`

```bash
# Extract the tar file
tar xvf QRL_Mainnet_State.tar.gz
# Creat the directory for the state
mkdir -p ~/QRL/.qrl/data
# Place the state
mv state/ ~/QRL/.qrl/data/
```
