require('module-alias/register');
const express = require('express');

const { block } = require('@zond-chain/blockLookup');

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

module.exports = router;
