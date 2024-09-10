require('module-alias/register');
const config = require('@config');  // Import the config
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
    servers: [
      {
        url: `http://127.0.0.1`,
        description: 'Localhost API',
      },
      {
        url: `http://${config.zondPubAPI}`,
        description: 'Zond Public API',
      },
      {
        url: `http://${config.qrlPubAPI}`,
        description: 'QRL Public API',
      }
    ],
  },
  apis: [
    './src/api/routes/v1/zond/*.js',  // Correct Zond routes
    './src/api/routes/v1/qrl/*.js',   // Correct QRL routes
  ],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
