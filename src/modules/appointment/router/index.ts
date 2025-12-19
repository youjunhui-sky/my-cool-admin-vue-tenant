import { RouteRecordRaw } from 'vue-router';

// 路由配置
export const routes: RouteRecordRaw[] = [
	{
		path: '/appointment',
		name: 'appointment',
		component: () => import('../views/index.vue'),
		meta: {
			title: '预约管理'
		}
	},
	{
		path: '/appointment/test',
		name: 'appointment-test',
		component: () => import('../views/test.vue'),
		meta: {
			title: 'PDF测试'
		}
	},
	{
		path: '/appointment/stone-prescription',
		name: 'stone-prescription',
		component: () => import('../views/stone-prescription.vue'),
		meta: {
			title: '结石健康教育处方'
		}
	}
];

export default routes;
