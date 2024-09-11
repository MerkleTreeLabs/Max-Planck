const express = require('express');
// Import QRL API functions here
const { balance } = require('@qrl-chain/balanceLookup');
const { blockByNumber } = require('@qrl-chain/blockLookup');
const { otsIndex } = require('@qrl-chain/otsLookup');
const { isValidAddress } = require('@qrl-chain/isValidAddressLookup');
const { getTransaction } = require('@qrl-chain/transactionLookup');

const router = express.Router();

// Define QRL endpoints here

// qrl balance
/**
 * @swagger
 * /v1/qrl-balance:
 *   post:
 *     summary: Retrieve the balance for a given QRL address
 *     description: Fetch the current balance of a specified QRL address. The address must be provided in the request body. If the address is invalid or missing, a 400 error is returned.
 *     tags: [QRL]
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
 *                 description: The QRL address to retrieve the balance for (without the 0x prefix)
 *                 example: "Q0105004d754755eaf039013bfad8e88565d9e15a25e7b048e7f5f56b88d16f8c05b52fbfd303e0"
 *     responses:
 *       200:
 *         description: Successfully retrieved the QRL balance
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
 *                   type: string
 *                   description: The balance of the provided QRL address in atomic units
 *                   example: "500000000000"
 *       400:
 *         description: Bad request, address missing or invalid
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
 *                   description: Error message explaining the issue
 *                   example: "Address is required"
 *       500:
 *         description: Internal server error, indicating an issue with retrieving the balance
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
 *                   description: Detailed error message
 *                   example: "Failed to fetch balance"
 */

router.post('/qrl-balance', async (req, res) => {
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


// GetBlockByNumber

/**
 * @swagger
 * /v1/qrl-block-by-number:
 *   post:
 *     summary: Retrieve block information by block number from the QRL blockchain
 *     description: This endpoint returns detailed information about a specific block on the QRL blockchain based on the block number provided in the request body. If the block number is missing or invalid, a 400 error is returned.
 *     tags: [QRL]
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
 *                 type: number
 *                 description: The block number to retrieve information for
 *                 example: 3278560
 *     responses:
 *       200:
 *         description: Successfully retrieved the block information
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
 *                   description: Details of the block associated with the provided block number
 *                   properties:
 *                     blockNumber:
 *                       type: number
 *                       description: The block number
 *                       example: 3278560
 *                     timestamp:
 *                       type: string
 *                       description: The timestamp of the block
 *                       example: "2023-09-12T12:34:56Z"
 *                     transactions:
 *                       type: array
 *                       description: Array of transactions in the block
 *                       items:
 *                         type: object
 *                         properties:
 *                           txId:
 *                             type: string
 *                             description: Transaction ID
 *                             example: "a1b2c3d4e5f6g7h8i9j0"
 *                           amount:
 *                             type: string
 *                             description: Amount transferred in the transaction (in atomic units)
 *                             example: "1000000000"
 *       400:
 *         description: Bad request, block number missing or invalid
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
 *                   description: Error message explaining what went wrong
 *                   example: "Block number is required"
 *       500:
 *         description: Internal server error, indicating an issue with retrieving the block information
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
 *                   description: Detailed error message
 *                   example: "Failed to fetch block number"
 */

router.post('/qrl-block-by-number', async (req, res) => {
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
		res.status(500).json({ success: false, error: 'Failed to fetch block number' });
	}
});


// qrl OTS index

/**
 * @swagger
 * /v1/qrl-ots:
 *   post:
 *     summary: Retrieve the OTS index for a given QRL address
 *     description: This endpoint returns the OTS (One Time Signature) index for a specified QRL address. The address must be provided in the request body.
 *     tags: [QRL]
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
 *                 description: The QRL address to retrieve the OTS index for
 *                 example: "Q0105004d754755eaf039013bfad8e88565d9e15a25e7b048e7f5f56b88d16f8c05b52fbfd303e0"
 *     responses:
 *       200:
 *         description: Successfully retrieved the OTS index
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The OTS index data associated with the provided address
 *                   properties:
 *                     otsIndex:
 *                       type: number
 *                       description: The current OTS index for the address
 *                       example: 128
 *       400:
 *         description: Bad request, address missing or invalid
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
 *                   description: Error message explaining the issue
 *                   example: "Address is required"
 *       500:
 *         description: Internal server error, indicating an issue with retrieving the OTS index
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
 *                   description: Detailed error message
 *                   example: "Failed to fetch OTS index"
 */

router.post('/qrl-ots', async (req, res) => {
	try {
		const address = req.body.address;

		if (!address) {
			return res.status(400).json({ success: false, error: 'Address is required' });
		}
		// Process the address and get the OTS index
		const otsInfo = await otsIndex(address);
		res.status(200).json({ success: true, data: otsInfo });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ success: false, error: 'Failed to fetch OTS index' });
	}
});


// qrl is Valid Address

/**
 * @swagger
 * /v1/qrl-is-valid-address:
 *   post:
 *     summary: Validate if a QRL address is valid
 *     description: This endpoint checks if a provided QRL address is valid. The address must be included in the request body.
 *     tags: [QRL]
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
 *                 description: The QRL address to validate
 *                 example: "Q0105004d754755eaf039013bfad8e88565d9e15a25e7b048e7f5f56b88d16f8c05b52fbfd303e0"
 *     responses:
 *       200:
 *         description: Successfully validated the QRL address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   description: Indicates whether the address is valid or not
 *                   example: true
 *       400:
 *         description: Bad request, address missing or invalid
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
 *                   description: Error message explaining the issue
 *                   example: "Address is required"
 *       500:
 *         description: Internal server error, indicating an issue with validating the address
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
 *                   description: Detailed error message
 *                   example: "Failed to validate address"
 */

router.post('/qrl-is-valid-address', async (req, res) => {
	try {
		const address = req.body.address;

		if (!address) {
			return res.status(400).json({ success: false, error: 'Address is required' });
		}
		// Process the address and get the balance
		const validAddress = await isValidAddress(address);
		res.status(200).json({ success: true, data: validAddress });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ success: false, error: 'Failed to fetch IsValidAddress' });
	}
});

// GetTransaction

router.post('/qrl-get-transaction', async (req, res) => {
	try {
		const txHash = req.body.txHash;
		console.log(`txHash routes: ${txHash} ${typeof (txHash)}`);

		if (!txHash) {
			return res.status(400).json({ success: false, error: 'TX Hash is required' });
		}

		// Process the txHash and get the balance
		const transactionResult = await getTransaction(txHash);
		console.log(`transactionResult: ${transactionResult}`);
		res.status(200).json({ success: true, data: transactionResult });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ success: false, error: 'Failed to fetch GetTransaction' });
	}
});


// listAddresses


// AddNewAddressWithSlaves

// RelayTransferTxnBySlave

// RelayMessageTxnBySlave

// RelayTransferTokenTxnBySlave

module.exports = router;
