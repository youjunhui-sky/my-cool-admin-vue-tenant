// 模块导出文件
import { type ModuleConfig } from '/@/cool';
import DepartmentSelect from './components/department.vue';
import DoctorSelect from './components/doctor.vue';
import PatientBaseInfo from './components/patient-base-info.vue';
import IdCardSelect from './components/id-card.vue';
import AddressSelect from './components/address.vue';
import MobileSelect from './components/mobile.vue';
import ProvinceCitySelect from './components/province-city-select.vue';
import PatientSelect from './components/patient-select-info.vue';
import PatientSWLSelect from './components/patient-select-swl.vue';
import PatientSelectMua from './components/patient-select-mua.vue';
export default (): ModuleConfig => {
	return {
		// 模块名称
		name: 'patient',
		// 模块显示名称
		label: '患者管理',
		// 模块排序
		order: 1,

		// 注册模块组件
		components: [
			// 患者基础信息组件
			PatientBaseInfo,
			// 科室选择组件
			DepartmentSelect,
			// 医生选择组件
			DoctorSelect,
			// 身份证选择组件
			IdCardSelect,
			// 地址选择组件
			AddressSelect,
			// 手机号选择组件
			MobileSelect,
			// 省市区选择组件
			ProvinceCitySelect,
			// 患者选择组件
			PatientSelect,
			// SWL患者选择组件 type = 1
			PatientSWLSelect,
			// 患者选择组件
			PatientSelectMua
		],

		// 视图路由
		views: [
			{
				path: '/patient/info',
				name: 'patient-info',
				component: () => import('./views/info.vue'),
				meta: {
					title: '患者信息'
				}
			}
		]
	};
};

export const components = {
	DepartmentSelect,
	DoctorSelect,
	PatientBaseInfo,
	IdCardSelect,
	AddressSelect,
	MobileSelect,
	ProvinceCitySelect,
	PatientSelect,
	PatientSWLSelect,
	PatientSelectMua
};

export const service = {};
