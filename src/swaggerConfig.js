require('module-alias/register');
// const config = require('@config');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Zond API',
			version: '1.0.0',
			description: 'API documentation for Max-Planck',
		},
	},
	apis: [
		'@zond-v1-routes/*.js',
		'@qrl-v1-routes/*.js',
	],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
