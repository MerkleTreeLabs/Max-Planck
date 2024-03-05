const api = import.meta.env.VITE_API;

  const txValue = value.value.toString(16);

  const { nonce } = (await axios.get(`${api}/nonce?address=0x${PK.value}`)).data;
  const chainId = (await axios.get(`${api}/chainID`)).data.result;
  const pendingBaseFee = (await axios.get(`${api}/pendingBaseFee`)).data.result;
  const tip = 0x174876eabc; // around 100 Shor
  const txData  = {
    from: `0x${PK.value}`,
    to: sendTo.value,
    gasLimit: 21000,
    type: '0x2',
    value: `0x${txValue}`,
    chainId,
    nonce: nonce,
  };

  const estimatedGas = (await axios.post(`${api}/estimateGas`, txData)).data;
  txData.gas = estimatedGas.result;
  txData.maxPriorityFeePerGas = `0x${tip.toString(16)}`;
  txData.maxFeePerGas = `0x${(tip + parseInt(pendingBaseFee, 16) - 1).toString(16)}`;
  console.log('Transaction data (unsigned):', txData);

  const transaction = TransactionFactory.fromTxData(txData);
  const signedTx = await signTransaction(transaction, `${HEXSEED.value}`);

  console.log('Signed transaction:', signedTx.rawTransaction);
  const txHash = (await axios.post(`${api}/rawTransaction`, { body: signedTx.rawTransaction })).data;
  console.log('Result of sending raw transaction:', txHash);

