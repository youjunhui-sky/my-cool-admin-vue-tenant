import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: '/questionnaire/info',
				meta: {
					label: '问卷管理'
				},
				component: () => import('./views/info.vue')
			}
		]
	};
};
