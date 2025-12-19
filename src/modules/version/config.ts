import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: '/version/info',
				meta: {
					label: '版本管理'
				},
				component: () => import('./views/info.vue')
			}
		]
	};
};
