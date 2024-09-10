require('module-alias/register');

const axios = require('axios');
const { apiPort } = require('@config');
const helper = require('@helper');
const { hideLinkEmbed } = require('discord.js');

async function getBlockSub(interaction) {
    try {
        let lookupBlock = 0;
        const currentHeight = await axios.get(`http://localhost:${apiPort}/v1/zond-height`);
        const userBlock = interaction.options.getNumber('number');

        // no block given or undefined, use the current block
        if (userBlock == null) {
            if (!currentHeight.data.success) {
                return await interaction.reply('There is an issue looking up the Block Height at this time...');
            }
            // set the lookup block to the current block
            lookupBlock = currentHeight.data.block.result;
        } else {
            // use the user-given block
            if (parseInt(helper.hexToDec(currentHeight.data.block.result)) < parseInt(userBlock)) {
                return await interaction.reply(`Sorry, I can't do that... The block requested is in the future!\nLatest: ${helper.hexToDec(currentHeight.data.block.result)} Request: ${userBlock}`);
            }
            lookupBlock = `0x${helper.decToHex(parseInt(userBlock))}`;
        }

        // lookup the block data
        const blockResponse = await axios.post(`http://localhost:${apiPort}/v1/zond-block-by-number`, { block: lookupBlock });

        let transactionCount = 0;
        let unclesCount = 0;
        let withdrawalsCount = 0;

        // Check if block.result exists safely
        const blockResult = blockResponse?.data?.block?.result;
        if (blockResult) {

            // Check for transactions array
            if (Array.isArray(blockResult.transactions)) {
                transactionCount = blockResult.transactions.length;
            }

            // Check for uncles array
            if (Array.isArray(blockResult.uncles)) {
                unclesCount = blockResult.uncles.length;
            }

            // Check for withdrawals array
            if (Array.isArray(blockResult.withdrawals)) {
                withdrawalsCount = blockResult.withdrawals.length;
            }

            // Safely access blockResult properties
            const url = `https://zond-explorer.theqrl.org/block/${helper.hexToDec(blockResult.number)}`;
            const explorerLink = hideLinkEmbed(url);

//                    > **blobGasUsed** \`${blockResult.blobGasUsed ? helper.hexToDec(blockResult.blobGasUsed) : 'N/A'}\`
//                    > **excessBlobGas** \`${blockResult.excessBlobGas ? helper.hexToDec(blockResult.excessBlobGas) : 'N/A'}\`
//                    > **parentBeaconBlockRoot** \`${blockResult.parentBeaconBlockRoot ? helper.truncateHash(blockResult.parentBeaconBlockRoot) : 'N/A'}\`



            // Send the reply to the channel
            await interaction.reply(`
                Here's the Zond block data:\n> **baseFeePerGas** \`${blockResult.baseFeePerGas ? helper.hexToDec(blockResult.baseFeePerGas) : 'N/A'}\`
                    > __**block_number**__ \`${blockResult.number ? helper.hexToDec(blockResult.number) : 'N/A'}\`
                    > **difficulty** \`${blockResult.difficulty ? helper.hexToDec(blockResult.difficulty) : 'N/A'}\`
                    > **extraData** \`${blockResult.extraData ? helper.truncateHash(blockResult.extraData) : 'N/A'}\`
                    > **gasLimit** \`${blockResult.gasLimit ? helper.hexToDec(blockResult.gasLimit) : 'N/A'}\`
                    > **gasUsed** \`${blockResult.gasUsed ? helper.hexToDec(blockResult.gasUsed) : 'N/A'}\`
                    > **hash** \`${blockResult.hash ? helper.truncateHash(blockResult.hash) : 'N/A'}\`
                    > **logsBloom** \`${blockResult.logsBloom ? helper.truncateHash(blockResult.logsBloom) : 'N/A'}\`
                    > **miner** \`${blockResult.miner ? helper.truncateHash(blockResult.miner) : 'N/A'}\`
                    > **mixHash** \`${blockResult.mixHash ? helper.truncateHash(blockResult.mixHash) : 'N/A'}\`
                    > **nonce** \`${blockResult.nonce ? helper.hexToDec(blockResult.nonce) : 'N/A'}\`
                    > **parentHash** \`${blockResult.parentHash ? helper.truncateHash(blockResult.parentHash) : 'N/A'}\`
                    > **receiptsRoot** \`${blockResult.receiptsRoot ? helper.truncateHash(blockResult.receiptsRoot) : 'N/A'}\`
                    > **sha3Uncles** \`${blockResult.sha3Uncles ? helper.truncateHash(blockResult.sha3Uncles) : 'N/A'}\`
                    > **size** \`${blockResult.size ? helper.hexToDec(blockResult.size) : 'N/A'} bytes\`
                    > **stateRoot** \`${blockResult.stateRoot ? helper.truncateHash(blockResult.stateRoot) : 'N/A'}\`
                    > **timestamp** \`${blockResult.timestamp ? helper.hexToDec(blockResult.timestamp) : 'N/A'}\`
                    > **totalDifficulty** \`${blockResult.totalDifficulty ? helper.hexToDec(blockResult.totalDifficulty) : 'N/A'}\`
                    > **transactions *count* ** \`${transactionCount}\`
                    > **transactionsRoot** \`${blockResult.transactionsRoot ? helper.truncateHash(blockResult.transactionsRoot) : 'N/A'}\`
                    > **uncles *count* ** \`${unclesCount}\`
                    > **withdrawals *count* ** \`${withdrawalsCount}\`
                    > **withdrawalsRoot** \`${blockResult.withdrawalsRoot ? helper.truncateHash(blockResult.withdrawalsRoot) : 'N/A'}\`\nMore info ${explorerLink}`,
            );

        } else {
            console.log('Block result is not available.');
            throw new Error('Block result is undefined or invalid.');
        }

    } catch (error) {
        const errorMessage = `An error occurred during block retrieval: ${error.message}`;
        console.error(errorMessage);
        await interaction.reply(`Looks like I'm struggling to complete that block request right now...${errorMessage}`);
    }
}

module.exports = getBlockSub;
