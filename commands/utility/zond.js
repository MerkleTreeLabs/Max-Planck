const getTransaction = require('../../modules/api/transaction');
const helper = require('../../modules/helpers');
const fs = require('fs');
const timestamp = new Date().getTime();

const { SlashCommandBuilder } = require('discord.js');
// const wait = require('node:timers/promises').setTimeout;
const userFile = '../../userlog.json';
module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('zond')
		.setDescription('Zond testnet info!')
		// add sub-commands for various zond things here.
		// block returns the latest block from the node
		.addSubcommand(subcommand =>
			subcommand
				.setName('block')
				.setDescription('Get the current Zond block number'))
		// balance takes zond address and returns the balance in ephemeral response
		.addSubcommand(subcommand =>
			subcommand
				.setName('balance')
				.setDescription('Zond address balance')
				.addStringOption(option => option.setName('address').setDescription('Zond dilithium address (0x)').setRequired(true).setMaxLength(42).setMinLength(42))
				.addStringOption(option => option.setName('denomination').setDescription('Whether or not the balance should be in quanta or Wei (default quanta)')
					.addChoices({ name: 'Wei', value: 'wei' }, { name: 'quanta', value: 'quanta' }),
				),
		)

		// tx takes a transaction hash and returns some information to the user 0xc50e891a34eacedf2b3e6e7f4b245da2a2c6f5128f5de7419da41e1c54134040
		.addSubcommand(subcommand =>
			subcommand
				.setName('transaction')
				.setDescription('Zond transaction Lookup')
				.addStringOption(option => option.setName('hash').setDescription('Zond transaction hash').setRequired(true).setMaxLength(66).setMinLength(66)),
		)


		// faucet gives the requested amount to user
		.addSubcommand(subcommand =>
			subcommand
				.setName('faucet')
				.setDescription('Zond transaction Lookup')
				.addStringOption(option => option.setName('address').setDescription('Zond dilithium address').setRequired(true).setMaxLength(42).setMinLength(42))
				.addNumberOption(option => option.setName('amount').setDescription('Amount of testnet quanta to receive').setRequired(true).setMaxValue(100)),
		),

	async execute(interaction) {
		if (!interaction.isCommand()) return;
		// subcommand "block" entered
		if (interaction.options.getSubcommand() === 'block') {
			const blockLookup = require('../../modules/zond/zondBlock');
			blockLookup.getBlockSub(interaction);
		}
		// balance subcommand given
		else if (interaction.options.getSubcommand() === 'balance') {
			const balanceLookup = require('../../modules/zond/zondBlock');
			balanceLookup.getBalanceSub(interaction);
		}
		else if (interaction.options.getSubcommand() === 'transaction') {
			const userTxHash = interaction.options.getString('hash');
			try {
				const validationResults = await helper.validateTxHash(userTxHash);
				if (validationResults.isValid) {
					const txHashData = await getTransaction(validationResults.hash);
					await interaction.reply({ content: `Transaction Data:\n\`\`\`json\n${JSON.stringify(txHashData, null, 4)}\n\`\`\``, ephemeral: true });
				}
				else {
					await interaction.reply(`Invalid txHash:\t${validationResults.error}`);
				}
			}
			catch (error) {
				console.error('An error occurred during Transaction retrieval:', error);
				await interaction.reply('Looks like I\'m struggling to complete that right now...');
			}
		}

		// faucet called
		else if (interaction.options.getSubcommand() === 'faucet') {
			console.log('faucet');

			const userAddress = interaction.options.getString('address');
			const userAmount = interaction.options.getNumber('amount');
			try {
				const validationResults = await helper.validateAddress(userAddress);
				if (validationResults.isValid) {
					const address = validationResults.address;
					

					const amountShor = await helper.quantaToSor(userAmount);
					console.log(`amountShor:\t${amountShor}`);

					const userInfo = {
						discord_id: interaction.user.id,
						discord_name: interaction.user.username,
						last_seen: timestamp,
						amount: amountShor
					};

					const userData = fs.readFileSync(userFile);
					const parsedData = JSON.parse(userData);
					// Find user information by discord_id
					const userIndex = parsedData.users.findIndex(user => user.discord_id === userInfo.discord_id);
					if (userIndex !== -1) {
						// user found
						const { last_seen, amount } = parsedData.users[userIndex];
						const existingAmount = new BigNumber(amount);
						const timeDifference = timestamp - parseInt(last_seen);

						if (timeDifference > config.timeout) {
							// proceed with adding user data to file. overwrite the array entry that matches discord_id
						}
						else {
							if (existingAmount.isLessThanOrEqualTo(config.maxDrip)) {
								// still some left to give 
								const combinedAmount = existingAmount.plus(amountShor).toFixed();
								if (combinedAmount.isLessThanOrEqualTo(config.maxDrip)) {
									// total request and existing is less or equal to allowed
									userInfo.amount = combinedAmount
									// leave the timestamp alone resetting sooner
									userInfo.last_seen = last_seen
								}
								else {
									await interaction.reply(`Requested amount exceeds maximum allowed drip ${helper.shorToQuanta(combinedAmount)}`);
									return;
								}
							}
							else {
								await interaction.reply(`User's existing amount exceeds maximum allowed drip ${helper.shorToQuanta(existingAmount)}`);
								return;
							}
						}





						await interaction.reply(`Last Seen: ${last_seen}, Amount: ${amount}`);
					} else {
						// If user not found, add user details to the JSON array
						parsedData.users.push(userInfo);

						// Write the updated JSON data back to the file
						fs.writeFileSync(userFile, JSON.stringify(parsedData, null, 2));

						await interaction.reply('User details added to the database.');
					}
					

				}
				else {
					await interaction.reply(`Invalid address given:\t${validationResults.error}`);
				}
			}
			catch (error) {
				console.error('An error occurred during address validation:', error);
				await interaction.reply('Looks like I\'m struggling to complete that right now...');
			}

			console.log(JSON.stringify(userInfo));


			await interaction.reply('faucet');
		}
	},

};
