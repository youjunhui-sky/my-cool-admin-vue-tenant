import { Module } from '/@/cool';
import { components, service } from './config';

/**
 * 导出模块函数
 */
export function usePatient() {
	return {
		service,
		components,
		DepartmentSelect: components.DepartmentSelect,
		DoctorSelect: components.DoctorSelect,
		PatientBaseInfo: components.PatientBaseInfo
	};
}
