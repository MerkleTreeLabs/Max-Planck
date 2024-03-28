// zondV1post.js
const express = require('express');
const { faucet } = require('@zond-chain/faucet');

const router = express.Router();
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
