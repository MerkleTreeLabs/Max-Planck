const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Zond API',
			version: '1.0.0',
			description: 'API documentation for Zond',
		},
	},
	apis: ['./discord/modules/server/routes/v1/zond/zondGetRoutes.js', './discord/modules/server/routes/v1/zond/zondPostRoutes.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
