// 模块导出文件
import { type ModuleConfig } from '/@/cool';
import MedicalHistoryStep from './components/sqbl/MedicalHistoryStep.vue';
import LaboratoryStep from './components/sqbl/LaboratoryStep.vue';
import ImagingStep from './components/sqbl/ImagingStep.vue';
import DiagnosisStep from './components/sqbl/DiagnosisStep.vue';
export default (): ModuleConfig => {
	return {
		// 模块名称
		name: 'swl',
		// 模块显示名称
		label: '碎石管理',
		// 模块排序
		order: 1,

		// 注册模块组件
		components: [
			// 病史步骤组件
			MedicalHistoryStep,
			// 检验步骤组件
			LaboratoryStep,
			// 影像步骤组件
			ImagingStep,
			// 诊断步骤组件
			DiagnosisStep
		],

		// 视图路由
		views: [
			{
				path: '/swl/info',
				name: 'swl-info',
				component: () => import('./views/info.vue'),
				meta: {
					title: '碎石信息'
				}
			},
			{
				path: '/swl/sqbl/:swlNo',
				name: 'SQBLDetail',
				component: () => import('./views/sqbl/info.vue'),
				props: true,
				meta: {
					title: '术前病历'
				}
			},
			{
				path: '/swl/followup/near',
				name: '近期随访',
				component: () => import('./views/followup/near.vue'),
				props: true,
				meta: {
					title: '近期随访'
				}
			},
			{
				path: '/swl/followup/curative',
				name: '疗效评定',
				component: () => import('./views/followup/curative.vue'),
				props: true,
				meta: {
					title: '疗效评定'
				}
			},
			{
				path: '/swl/followup/future',
				name: '远期随访',
				component: () => import('./views/followup/future.vue'),
				props: true,
				meta: {
					title: '远期随访'
				}
			},
			{
				path: '/exam',
				name: '超声报告',
				component: () => import('./views/info.vue'),
				props: true,
				meta: {
					title: '超声报告'
				}
			},
			{
				path: '/etiology/component/component',
				name: '结石成分',
				component: () => import('../etiology/views/component/component.vue'),
				props: true,
				meta: {
					title: '结石成分'
				}
			},
			{
				path: '/swl/treatment/health',
				name: '健康教育处方',
				component: () => import('./views/treatment/health.vue'),
				props: true,
				meta: {
					title: '健康教育处方'
				}
			},
			{
				path: '/swl/treatment/record',
				name: '打印治疗记录',
				component: () => import('./views/treatment/record.vue'),
				props: true,
				meta: {
					title: '打印治疗记录'
				}
			},
			{
				path: '/exam/record',
				name: '打印B超报告',
				component: () => import('../exam/views/record.vue'),
				props: true,
				meta: {
					title: '打印B超报告'
				}
			}
		]
	};
};

export const components = {
	MedicalHistoryStep,
	LaboratoryStep,
	ImagingStep,
	DiagnosisStep
};

export const service = {};
