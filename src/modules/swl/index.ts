// 模块导出文件
import { components } from './config';
// 不要在这里导入useCool
// import { useCool } from '/@/cool';

export function useSwl() {
	// 不在函数外部直接初始化，而是在调用时才初始化
	// 这样可以保证只有在组件内部调用useSwl时才会初始化这些值

	return {
		// 自定义方法
		getSwlInfo(swlNo: string) {
			return {
				swlNo
			};
		},

		// 导出组件
		components
	};
}
