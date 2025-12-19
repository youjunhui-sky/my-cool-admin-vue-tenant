import { ModuleConfig } from "/@/cool";
import logo from "./static/logo.jpg";

export default (): ModuleConfig => {
	return {
		label: "PDF打印",
		description: "基于 jspdf 和 html2canvas 开发",
		author: "任我行不行",
		version: "1.0.0",
		updateTime: "2024-02-02",
		logo,

		demo: [
			{
				name: "基础用法",
				component: () => import("./demo/base.vue")
			},
			{
				name: "表单插件",
				component: () => import("./demo/plugin.vue")
			}
		]
	};
};
