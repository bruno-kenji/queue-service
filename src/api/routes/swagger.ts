import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('../swagger.json');

export default (app: Router) => {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
