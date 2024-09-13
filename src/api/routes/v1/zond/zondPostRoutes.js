const express = require('express');
const { faucet } = require('@zond-chain/faucet');
const { balance } = require('@zond-chain/balanceLookup');
const { blockByNumber } = require('@zond-chain/blockLookup');
const { transaction } = require('@zond-chain/transactionLookup');

const router = express.Router();

/**
 * @swagger
 * /v1/zond-balance:
 *   post:
 *     summary: Get the balance for a Zond Dilithium address (without 0x prefix)
 *     description: This endpoint retrieves the balance of a specified Zond Dilithium address. The address must be provided without the 0x prefix and must be exactly 40 characters in length. If the address contains the prefix or is invalid, an error is returned.
 *     tags: [Zond]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *                 description: The Zond address to get the balance for (must be 40 characters without the 0x prefix)
 *                 example: "20d20b8026b8f02540246f58120ddaaf35aecd9b"
 *     responses:
 *       200:
 *         description: Successfully retrieved the balance for the Zond address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 balance:
 *                   type: object
 *                   description: The balance result or error returned from the JSON-RPC call
 *                   properties:
 *                     jsonrpc:
 *                       type: string
 *                       description: JSON-RPC version used
 *                       example: "2.0"
 *                     id:
 *                       type: number
 *                       description: JSON-RPC request identifier
 *                       example: 1
 *                     result:
 *                       type: string
 *                       description: The balance of the provided Zond address (in hexadecimal)
 *                       example: "0x17a7d5578ec808b18b40e"
 *       400:
 *         description: Bad request, address is invalid or contains the 0x prefix
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: false
 *                 balance:
 *                   type: object
 *                   description: Error information from the JSON-RPC call
 *                   properties:
 *                     jsonrpc:
 *                       type: string
 *                       example: "2.0"
 *                     id:
 *                       type: number
 *                       example: 1
 *                     error:
 *                       type: object
 *                       description: Error details
 *                       properties:
 *                         code:
 *                           type: number
 *                           description: Error code returned by JSON-RPC
 *                           example: -32602
 *                         message:
 *                           type: string
 *                           description: Detailed error message
 *                           example: "invalid argument 0: hex string has length 42, want 40 for common.Address"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request failed due to a server-side issue
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message describing the failure
 *                   example: "Failed to fetch balance"
 */

router.post('/zond-balance', async (req, res) => {
	try {
		const address = req.body.address;

		if (!address) {
			return res.status(400).json({ success: false, error: 'Address is required' });
		}

		// Process the address and get the balance
		const currentBalance = await balance(address);

		res.status(200).json({ success: true, balance: currentBalance });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ success: false, error: 'Failed to fetch balance' });
	}
});

/**
 * @swagger
 * /v1/zond-transaction:
 *   post:
 *     summary: Get transaction details by transaction hash
 *     description: This endpoint retrieves the details of a Zond transaction based on the provided transaction hash. The transaction hash must be a valid hexadecimal string with exactly 64 characters.
 *     tags: [Zond]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hash
 *             properties:
 *               hash:
 *                 type: string
 *                 description: The transaction hash to look up (must be a valid 64-character hexadecimal string)
 *                 example: "6f0298b744156582bc5d47b126956c5b504ec4eacf5df6dd5faeeac95486fc00"
 *     responses:
 *       200:
 *         description: Successful response with the transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 transaction:
 *                   type: object
 *                   description: The details of the Zond transaction
 *                   properties:
 *                     jsonrpc:
 *                       type: string
 *                       description: JSON-RPC version used
 *                       example: "2.0"
 *                     id:
 *                       type: number
 *                       description: JSON-RPC request identifier
 *                       example: 1
 *                     result:
 *                       type: object
 *                       description: Transaction result details
 *                       properties:
 *                         blockHash:
 *                           type: string
 *                           description: Hash of the block containing the transaction
 *                           example: "0xee54a91ac3079f6f753ba5fb5018efeabe0ff274ec97d53143e1294b3884a10c"
 *                         blockNumber:
 *                           type: string
 *                           description: Block number in which the transaction is included
 *                           example: "0x4e053"
 *                         contractAddress:
 *                           type: string
 *                           nullable: true
 *                           description: Contract address created, if applicable (null if none)
 *                           example: null
 *                         cumulativeGasUsed:
 *                           type: string
 *                           description: Total gas used by the transaction (in hexadecimal)
 *                           example: "0x5208"
 *                         effectiveGasPrice:
 *                           type: string
 *                           description: Gas price used (in hexadecimal)
 *                           example: "0x174876eac2"
 *                         from:
 *                           type: string
 *                           description: The address from which the transaction was sent
 *                           example: "0x20d20b8026b8f02540246f58120ddaaf35aecd9b"
 *                         gasUsed:
 *                           type: string
 *                           description: Gas used by the transaction
 *                           example: "0x5208"
 *                         logs:
 *                           type: array
 *                           description: Logs generated during the execution of the transaction
 *                           items:
 *                             type: string
 *                           example: []
 *                         logsBloom:
 *                           type: string
 *                           description: Bloom filter for the logs
 *                           example: "0x000000000...0000000000"
 *                         status:
 *                           type: string
 *                           description: Status of the transaction (1 for success, 0 for failure)
 *                           example: "0x1"
 *                         to:
 *                           type: string
 *                           description: The address to which the transaction was sent
 *                           example: "0x20d20b8026b8f02540246f58120ddaaf35aecd8b"
 *                         transactionHash:
 *                           type: string
 *                           description: The hash of the transaction
 *                           example: "0x6f0298b744156582bc5d47b126956c5b504ec4eacf5df6dd5faeeac95486fc00"
 *                         transactionIndex:
 *                           type: string
 *                           description: The index position of the transaction in the block
 *                           example: "0x0"
 *                         type:
 *                           type: string
 *                           description: Type of transaction
 *                           example: "0x2"
 *       400:
 *         description: Bad request, transaction hash is invalid (wrong length or format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: false
 *                 transaction:
 *                   type: object
 *                   description: Error information from the JSON-RPC call
 *                   properties:
 *                     jsonrpc:
 *                       type: string
 *                       example: "2.0"
 *                     id:
 *                       type: number
 *                       example: 1
 *                     error:
 *                       type: object
 *                       description: Error details
 *                       properties:
 *                         code:
 *                           type: number
 *                           description: Error code returned by JSON-RPC
 *                           example: -32602
 *                         message:
 *                           type: string
 *                           description: Detailed error message
 *                           example: "invalid argument 0: hex string has length 66, want 64 for common.Hash"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request failed due to a server-side issue
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message describing the failure
 *                   example: "Failed to fetch transaction details"
 */

router.post('/zond-transaction', async (req, res) => {
	try {
		const txHash = req.body.hash;

		if (!txHash) {
			return res.status(400).json({ success: false, error: 'Transaction Hash is required' });
		}

		// Process the txHash and get the transaction details
		const transactionLookup = await transaction(txHash);
		res.status(200).json({ success: true, transaction: transactionLookup });
	}
	catch (error) {
		// Handle any errors
		console.error(`Error in fetching transaction details: ${error}`);
		res.status(500).json({ success: false, error: 'Failed to fetch transaction details' });
	}
});

/**
 * @swagger
 * /v1/zond-block-by-number:
 *   post:
 *     summary: Get block details by block number
 *     description: This endpoint retrieves detailed information about a specific block on the Zond blockchain based on the provided block number.
 *     tags:
 *       - Zond
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - block
 *             properties:
 *               block:
 *                 type: string
 *                 description: The block number to fetch the details for
 *                 example: "319571"
 *     responses:
 *       200:
 *         description: Successful response with the block details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 block:
 *                   type: object
 *                   description: The block details for the given block number
 *                   properties:
 *                     jsonrpc:
 *                       type: string
 *                       description: JSON-RPC version used
 *                       example: "2.0"
 *                     id:
 *                       type: number
 *                       description: JSON-RPC request identifier
 *                       example: 1
 *                     result:
 *                       type: object
 *                       description: Block details
 *                       properties:
 *                         baseFeePerGas:
 *                           type: string
 *                           description: Base fee per gas
 *                           example: "0x7"
 *                         difficulty:
 *                           type: string
 *                           description: Difficulty of the block
 *                           example: "0x0"
 *                         extraData:
 *                           type: string
 *                           description: Extra data included in the block
 *                           example: "0xd882010085677a6f6e6488676f312e32302e35856c696e7578"
 *                         gasLimit:
 *                           type: string
 *                           description: Gas limit of the block
 *                           example: "0x1c9c380"
 *                         gasUsed:
 *                           type: string
 *                           description: Gas used in the block
 *                           example: "0x5208"
 *                         hash:
 *                           type: string
 *                           description: Block hash
 *                           example: "0xee54a91ac3079f6f753ba5fb5018efeabe0ff274ec97d53143e1294b3884a10c"
 *                         logsBloom:
 *                           type: string
 *                           description: Bloom filter for logs
 *                           example: "0x0000000000...00000000000"
 *                         miner:
 *                           type: string
 *                           description: Miner address
 *                           example: "0x20e526833d2ab5bd20de64cc00f2c2c7a07060bf"
 *                         mixHash:
 *                           type: string
 *                           description: Mix hash
 *                           example: "0x8569379391bc7e10b725068ba99f54f29bfcba11a7cda950f8c0b153ecc9cf10"
 *                         nonce:
 *                           type: string
 *                           description: Block nonce
 *                           example: "0x0000000000000000"
 *                         number:
 *                           type: string
 *                           description: Block number in hexadecimal
 *                           example: "0x4e053"
 *                         parentHash:
 *                           type: string
 *                           description: Parent block hash
 *                           example: "0xf3c328f6114828c8b280f95c98836c50b13a820160d5c38932fbaa7a2fe9d801"
 *                         receiptsRoot:
 *                           type: string
 *                           description: Root of the receipts tree
 *                           example: "0xf78dfb743fbd92ade140711c8bbc542b5e307f0ab7984eff35d751969fe57efa"
 *                         sha3Uncles:
 *                           type: string
 *                           description: SHA3 hash of the block's uncles
 *                           example: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347"
 *                         size:
 *                           type: string
 *                           description: Size of the block
 *                           example: "0x1e93"
 *                         stateRoot:
 *                           type: string
 *                           description: Root of the state tree
 *                           example: "0xdc44eb871ac09faca6d079b850ef84b4dcce19e6cc9ff351c796a0296955973a"
 *                         timestamp:
 *                           type: string
 *                           description: Timestamp of the block
 *                           example: "0x66e0ed8c"
 *                         totalDifficulty:
 *                           type: string
 *                           description: Total difficulty of the block
 *                           example: "0x1"
 *                         transactions:
 *                           type: array
 *                           description: Array of transactions in the block
 *                           items:
 *                             type: object
 *                             description: Transaction details
 *                             properties:
 *                               blockHash:
 *                                 type: string
 *                                 description: The block hash the transaction belongs to
 *                                 example: "0xee54a91ac3079f6f753ba5fb5018efeabe0ff274ec97d53143e1294b3884a10c"
 *                               blockNumber:
 *                                 type: string
 *                                 description: The block number in which this transaction is included
 *                                 example: "0x4e053"
 *                               from:
 *                                 type: string
 *                                 description: The sender address of the transaction
 *                                 example: "0x20d20b8026b8f02540246f58120ddaaf35aecd9b"
 *                               gas:
 *                                 type: string
 *                                 description: Gas limit provided by the sender
 *                                 example: "0x5208"
 *                               gasPrice:
 *                                 type: string
 *                                 description: Gas price for the transaction
 *                                 example: "0x174876eac2"
 *                               hash:
 *                                 type: string
 *                                 description: The hash of the transaction
 *                                 example: "0x6f0298b744156582bc5d47b126956c5b504ec4eacf5df6dd5faeeac95486fc00"
 *                               nonce:
 *                                 type: string
 *                                 description: The number of transactions made by the sender prior to this one
 *                                 example: "0x73"
 *                               to:
 *                                 type: string
 *                                 description: The recipient address of the transaction
 *                                 example: "0x20d20b8026b8f02540246f58120ddaaf35aecd8b"
 *                               value:
 *                                 type: string
 *                                 description: The value transferred in the transaction
 *                                 example: "0xde0b6b3a7640000"
 *                               transactionIndex:
 *                                 type: string
 *                                 description: The transaction index in the block
 *                                 example: "0x0"
 *                         transactionsRoot:
 *                           type: string
 *                           description: Root of the transaction tree
 *                           example: "0x0093a2acf69a795078341f051be4dadee0ee674c6c5db82b2ce542324e404a58"
 *                         uncles:
 *                           type: array
 *                           description: Array of uncles included in the block
 *                           example: []
 *                         withdrawals:
 *                           type: array
 *                           description: Array of withdrawals included in the block
 *                           example: []
 *                         withdrawalsRoot:
 *                           type: string
 *                           description: Root of the withdrawals tree
 *                           example: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
 *       400:
 *         description: Bad request, block number is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message indicating the block number is missing
 *                   example: Block number is required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message describing the failure
 *                   example: Failed to fetch block
 */

// GetBlockByNumber
router.post('/zond-block-by-number', async (req, res) => {
	try {
		const block = req.body.block;

		if (!block) {
			return res.status(400).json({ success: false, error: 'Block number is required' });
		}

		// Process the block and get the data
		const blockData = await blockByNumber(block);

		res.status(200).json({ success: true, block: blockData });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ success: false, error: 'Failed to fetch block' });
	}
});

/**
 * @swagger
 * /v1/zond-faucet:
 *   post:
 *     summary: Send Zond from Faucet
 *     tags:
 *       - Zond
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - amount
 *             properties:
 *               address:
 *                 type: string
 *                 description: Zond address to send the amount to
 *                 example: "20d20b8026b8f02540246f58120ddaaf35aecd9b"
 *               amount:
 *                 type: number
 *                 description: Amount of Zond to send
 *                 example: "1"
 *     responses:
 *       '200':
 *         description: Successful response with the transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     jsonrpc:
 *                       type: string
 *                     id:
 *                       type: number
 *                     result:
 *                       type: string
 *       '400':
 *         description: Bad request, address or amount is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Address and Amount are required
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Failed to fetch transaction details
 */
router.post('/zond-faucet', async (req, res) => {
	try {
		const { address, amount } = req.body;

		if (!address || !amount) {
			return res.status(400).json({ success: false, error: 'Address and Amount are required' });
		}

		// Process the address and amount and get the transaction details
		const transactionSend = await faucet(address, amount);
		res.status(200).json({ success: true, transaction: transactionSend });
	}
	catch (error) {
		// Handle any errors
		console.error(`Error in fetching transaction details: ${error}`);
		res.status(500).json({ success: false, error: 'Failed to fetch transaction details' });
	}
});

module.exports = router;
