// 模块导出文件
import { type ModuleConfig } from '/@/cool';
import PatientStep from './components/mua/PatientStep.vue';
import LabStep from './components/mua/LabStep.vue';
import AnalysisStep from './components/mua/AnalysisStep.vue';
import SuggestionStep from './components/mua/SuggestionStep.vue';
import EtiologyComponent from './views/component/component.vue';
export default (): ModuleConfig => {
	return {
		// 模块名称
		name: 'etiology',
		// 模块显示名称
		label: '病因学',
		// 模块排序
		order: 1,

		// 注册模块组件
		components: [
			// 患者档案
			PatientStep,
			// 检验数据
			LabStep,
			// 分析结果
			AnalysisStep,
			// 防治建议
			SuggestionStep
		],

		// 视图路由
		views: [
			{
				path: '/etiology/info',
				name: '代谢评估',
				component: () => import('./views/info.vue'),
				meta: {
					title: '代谢评估'
				}
			},
			{
				path: '/etiology/mua/info',
				name: '代谢评估内容',
				component: () => import('./views/mua/info.vue'),
				meta: {
					title: '代谢评估内容'
				}
			},
			{
				path: '/etiology/mua/muaPatient/:patientNo',
				name: 'MUA',
				component: () => import('./views/mua/muaPatient.vue'),
				props: true,
				meta: {
					title: '患者档案'
				}
			},
			{
				path: '/etiology/mua/muaLab/:patientNo',
				name: 'MUA',
				component: () => import('./views/mua/muaLab.vue'),
				props: true,
				meta: {
					title: '检验数据'
				}
			},
			{
				path: '/etiology/mua/muaAnalysis/:patientNo',
				name: 'MUA',
				component: () => import('./views/mua/muaAnalysis.vue'),
				props: true,
				meta: {
					title: '分析结果'
				}
			},
			{
				path: '/etiology/mua/muaSuggestion/:patientNo',
				name: 'MUA',
				component: () => import('./views/mua/muaSuggestion.vue'),
				props: true,
				meta: {
					title: '防治建议'
				}
			},
			{
				path: '/etiology/followup/near',
				name: 'MA近期随访',
				component: () => import('./views/followup/near.vue'),
				props: true,
				meta: {
					title: 'MA近期随访'
				}
			},
			{
				path: '/etiology/followup/future',
				name: 'MA远期随访',
				component: () => import('./views/followup/future.vue'),
				props: true,
				meta: {
					title: 'MA远期随访'
				}
			},
			{
				path: '/etiology/component/component',
				name: '结石成分',
				component: () => import('./views/component/component.vue'),
				props: true,
				meta: {
					title: '结石成分'
				}
			},
			{
				path: '/etiology/mua/muaSimplifyPrint',
				name: '简化评估打印',
				component: () => import('./views/mua/muaSimplifyPrint.vue'),
				props: true,
				meta: {
					title: '简化评估打印'
				}
			},
			{
				path: '/etiology/mua/muaOverallPrint',
				name: '全面评估打印',
				component: () => import('./views/mua/muaOverallPrint.vue'),
				props: true,
				meta: {
					title: '全面评估打印'
				}
			},
			{
				path: '/etiology/mua/muaSpecialPrint',
				name: '特殊评估打印',
				component: () => import('./views/mua/muaSpecialPrint.vue'),
				props: true,
				meta: {
					title: '特殊评估打印'
				}
			},
			{
				path: '/etiology/historyquestionnaire',
				name: '诊前问询',
				component: () => import('./views/historyquestionnaire/info.vue'),
				meta: {
					title: '诊前问询'
				}
			}
		]
	};
};

export const components = {
	PatientStep,
	LabStep,
	AnalysisStep,
	SuggestionStep,
	EtiologyComponent
};

export const service = {};
