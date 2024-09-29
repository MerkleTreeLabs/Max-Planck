# start the walletd

sleep 60 && /home/fr1t2/.local/bin/qrl_walletd --qrldir /home/fr1t2/QRL/.qrl

# run the walletd rest proxy
/home/fr1t2/QRL/walletd-rest-proxy/walletd-rest-proxy -serverIPPort 127.0.0.1:5359 -walletServiceEndpoint 127.0.0.1:19010 -log_dir /home/fr1t2/QRL/