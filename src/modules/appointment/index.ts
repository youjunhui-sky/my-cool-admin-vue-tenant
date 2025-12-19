import { Module } from '/@/cool';
import routes from './router';

export default (): Module => {
	return {
		name: 'appointment',
		options: {
			routes
		}
	};
};
