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
 *     summary: Get the balance for a Zond dilithium address without 0x prefix
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
 *                 description: The Zond address to get the balance for without prefix ( length == 40 )
 *     responses:
 *       200:
 *         description: Successful response with the balance for the Zond address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 balance:
 *                   type: string
 *                   example: "0x29a842cfdf08e080"
 *       400:
 *         description: Bad request, address is missing
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
 *                   example: Address is required
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
 *                   example: Failed to fetch balance
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
 *                 description: The transaction hash to look up
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
 *                   example: true
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     // Define transaction properties here
 *       400:
 *         description: Bad request, transaction hash is missing
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
 *                   example: Transaction Hash is required
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
 *                   example: Failed to fetch transaction details
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
 *                   example: true
 *                 block:
 *                   type: object
 *                   description: The block details for the given block number
 *       400:
 *         description: Bad request, block number is missing
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
 *               amount:
 *                 type: string
 *                 description: Amount of Zond to send
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
