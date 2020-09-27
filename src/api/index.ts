import { Router } from 'express';
import message from './routes/message';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	message(app);

	return app
}
