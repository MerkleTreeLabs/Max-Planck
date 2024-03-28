require('module-alias/register');
const express = require('express');

const { block } = require('@zond-api/blockLookup');
const { balance } = require('@zond-api/balanceLookup');

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
 *                 data:
 *                   type: object
 *                   properties:
 *                     block:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           // Define block properties here
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

		res.status(200).json({ success: true, data: { block: currentBlock } });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ success: false, error: 'Failed to fetch block' });
	}
});

/**
 * @swagger
 * /v1/zond-balance:
 *   get:
 *     summary: Get the balance for a Zond address
 *     tags: [Zond]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The Zond address to get the balance for
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
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           // Define balance properties here
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

		res.status(200).json({ success: true, data: { balance: currentBalance } });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ success: false, error: 'Failed to fetch balance' });
	}
});

module.exports = router;
