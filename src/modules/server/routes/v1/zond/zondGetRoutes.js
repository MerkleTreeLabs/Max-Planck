require('module-alias/register');
const express = require('express');

const { block } = require('@zond-chain/blockLookup');
const { balance } = require('@zond-chain/balanceLookup');
const { transaction } = require('@zond-chain/transactionLookup');

const router = express.Router();

/**
 * @swagger
 * /v1/zond-block:
 *   get:
 *     summary: Get the current Zond block
 *     tags: [Zond]
 *     responses:
 *       200:
 *         description: Successful response with the current Zond block
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
 *                   properties:
 *                     jsonrpc:
 *                       type: string
 *                       example: "2.0"
 *                     id:
 *                       type: number
 *                       example: 1
 *                     result:
 *                       type: string
 *                       example: "0x17a64"
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
router.get('/zond-block', async (req, res) => {
	try {
		// fetch the current block
		const currentBlock = await block();
		res.status(200).json({ success: true, block: currentBlock });
	}
	catch (error) {
		// Handle any errors
		console.error('Error in fetching block:', error);
		res.status(500).json({ success: false, error: 'Failed to fetch block' });
	}
});

/**
 * @swagger
 * /v1/zond-balance:
 *   get:
 *     summary: Get the balance for a Zond dilithium address without 0x prefix
 *     tags: [Zond]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The Zond address to get the balance for without prefix ( length == 40 )
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: string
 *                       example: "0x29a842cfdf08e080"
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
router.get('/zond-balance', async (req, res) => {
	try {
		const address = req.query.address;

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
 *   get:
 *     summary: Get transaction details by transaction hash
 *     tags: [Zond]
 *     parameters:
 *       - in: query
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction hash to look up
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
router.get('/zond-transaction', async (req, res) => {
	try {
		const txHash = req.query.hash;

		if (!txHash) {
			return res.status(400).json({ success: false, error: 'Transaction Hash is required' });
		}

		// Process the txHash and get the transaction details
		const transactionLookup = await transaction(txHash);
		// console.log(`transactionLookup: ${JSON.stringify(transactionLookup)}`);
		res.status(200).json({ success: true, transaction: transactionLookup });
	}
	catch (error) {
		// Handle any errors
		console.error(`Error in fetching transaction details: ${error}`);
		res.status(500).json({ success: false, error: 'Failed to fetch transaction details' });
	}
});

module.exports = router;
