import { Router } from 'express';
import message from './routes/message';
import swagger from './routes/swagger';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	message(app);
	swagger(app);

	return app
}
