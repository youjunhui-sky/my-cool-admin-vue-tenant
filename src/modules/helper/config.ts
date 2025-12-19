import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		plugins: ['crud'],
		pages: [
			{
				path: '/helper/markdown-to-html',
				meta: {
					label: 'Markdown转HTML工具',
					keepAlive: true
				},
				component: () => import('./views/markdown-to-html.vue')
			}
		]
	};
};
