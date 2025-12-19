import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		enable: true,
		components: [() => import('./components/vditor.vue')],

		label: 'Vditor 编辑器',
		description: '基于 Vditor 封装的 Markdown 编辑器',
		author: 'COOL',
		version: '1.0.0',
		updateTime: '2024-01-01',
		demo: [
			{
				name: '基础用法',
				component: () => import('./demo/base.vue')
			}
		],
		doc: 'https://b3log.org/vditor/'
	};
};
