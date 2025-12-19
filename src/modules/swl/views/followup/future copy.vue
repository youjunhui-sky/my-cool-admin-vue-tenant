<template>
	<div class="scroll-container">
		<div class="future-info">
			<!-- 标题 -->
			<div class="tech-header">
				<div class="tech-title-container">
					<div class="tech-title">
						智能泌尿系结石诊疗管理系统<span class="blink">_</span>
					</div>
					<div class="model-info">
						<span title="模型">Model.{{ '远期随访' }}</span>
					</div>
				</div>
			</div>
			<!-- 患者信息栏 -->
			<div class="tech-patient-info">
				<div class="patient-info">
					<span title="碎石号">No.{{ swlNo || ' ' }}</span>
					<span title="姓名">N.{{ patientSwlInfo.name || ' ' }}</span>
					<span title="性别">G.{{ patientSwlInfo.gender || ' ' }}</span>
					<span title="年龄">A.{{ patientSwlInfo.age || ' ' }}</span>
					<span title="序列号">SN.{{ patientSwlInfo.sequenceNo || ' ' }}</span>
				</div>
			</div>
			<div class="tech-content">
				<cl-row>
					<cl-form ref="Form" inner> </cl-form>
				</cl-row>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plugins } from '/#/crud';
import { useBase } from '/@/modules/base';
import { ref, onMounted, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';

// 导入URL工具函数
import { formatImageUrl, cleanImageUrlForSubmit } from '/@/modules/base/utils/url';

const Form = useForm();
const cool = useCool();
const { user } = useBase();
const { dict } = useDict();
const { service } = useCool();
const route = useRoute();

// 获取路由参数
const id = route.query.id;
const swlNo = route.query.swlNo;
const serialNumber = route.query.serialNumber;

// 定义随访ID引用
const followupId = ref(0);

// 标签映射
const options = reactive({
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	],
	assessmentType: [
		{ label: '简化评估', value: 'mua1', type: 'success' },
		{ label: '全面评估', value: 'mua2', type: 'warning' },
		{ label: '特殊评估', value: 'mua3', type: 'danger' }
	]
});

// 添加患者信息对象
const patientSwlInfo = reactive({
	id: '', // 患者ID
	swlNo: '', // 碎石号
	name: '', // 姓名
	gender: '', // 性别
	age: '', // 年龄
	sequenceNo: '', // 序列号
	episode: '', // 期数
	nativeProvince: '', // 籍贯省
	nativeCity: '', // 籍贯市
	currentProvince: '', // 现住址省
	currentCity: '', // 现住址市
	height: '', // 身高
	weight: '', // 体重
	bmi: '' // BMI
});

// 查询病人基本信息
const querySwl = async () => {
	try {
		const params = { id: id };
		const data = await service.swl.info.info(params);

		if (data) {
			// 不再使用setForm，而是直接返回数据，后续在合并时使用
			//console.log('查询到患者基本信息:', data);
			// 将查询到的数据赋值给患者信息对象
			Object.assign(patientSwlInfo, data);
			return data;
		}
		return null;
	} catch (error: any) {
		console.error('获取患者信息失败', error);
		ElMessage.error('获取患者信息失败: ' + (error.message || '未知错误'));
		// 错误时也使用空格确保内容显示
		Object.assign(patientSwlInfo, {
			id: ' ',
			swlNo: ' ',
			name: ' ',
			gender: ' ',
			age: ' ',
			sequenceNo: ' ',
			episode: ' '
		});
	}
};
// 清空数据
const clearData = () => {
	followupId.value = 0;
	openForm({
		swlNo: swlNo,
		serialNumber: serialNumber,
		followupDate: new Date()
	});
};

// 表单提交处理
const handleSubmit = async (data: any) => {
	try {
		// 准备要保存的数据对象
		const saveData = {
			id: followupId.value,
			swlNo: swlNo,
			serialNumber: serialNumber,
			followupDate: data.followupDate,
			followupType: data.followupType,
			followupMethod: data.followupMethod,
			followupResult: data.followupResult,
			followupImagePath: data.followupImagePath,
			followupNotes: data.followupNotes,
			nextFollowupDate: data.nextFollowupDate,
			physician: data.physician
		};

		if (followupId.value > 0) {
			const params = { ...saveData, id: followupId.value };
			await service.swl.future.update(params);
		} else {
			const res = await service.swl.future.add(saveData);
			followupId.value = res.id;
		}

		ElMessage.success('保存成功');

		// 刷新表单数据
		initFollowup();

		return true;
	} catch (error: any) {
		console.error('保存失败:', error);
		ElMessage.error('保存失败: ' + (error.message || '未知错误'));
		return false;
	}
};

// 打印功能
const handlePrint = () => {
	ElMessage.info('打印功能尚未实现');
};

// 初始化表单数据
const initFollowup = async () => {
	try {
		const params = { swlNo: swlNo, serialNumber: serialNumber };
		const data = await service.swl.future.findBySwlNo(params);

		if (data && data.swlNo) {
			openForm(data);
		} else {
			// 如果没有随访记录，查询患者基本信息
			await querySwl();
			// 初始化新记录
			openForm({
				swlNo: swlNo,
				serialNumber: serialNumber,
				followupDate: new Date()
			});
		}
	} catch (error: any) {
		console.error('Failed to load followup info:', error);
		ElMessage.error('加载远期随访信息失败: ' + (error.message || '未知错误'));
	}
};

// 打开表单并填充数据
const openForm = (data: any) => {
	if (data.id) {
		followupId.value = data.id;
	}

	Form.value?.open({
		title: '碎石随访记录',
		form: data,
		items: [
			{
				label: 'id',
				prop: 'id',
				hidden: true,
				component: {
					name: 'el-input',
					props: { disabled: true }
				}
			},
			{
				label: '就诊流水号',
				prop: 'serialNumber',
				span: 6,
				hidden: true,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						placeholder: '请输入就诊流水号',
						disabled: true
					}
				}
			},
			{
				label: '碎石号',
				prop: 'swlNo',
				span: 6,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						disabled: true
					}
				}
			},
			{
				label: '姓名',
				prop: 'name',
				span: 6,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						disabled: true
					}
				}
			},
			{
				label: '性别',
				prop: 'gender',
				span: 6,
				component: {
					name: 'cl-select',
					props: {
						options: options.gender,
						checkStrictly: true
					}
				}
			},
			{
				label: '随访日期',
				prop: 'followupDate',
				span: 6,
				component: {
					name: 'el-date-picker',
					props: {
						type: 'date',
						valueFormat: 'YYYY-MM-DD'
					}
				}
			},
			{
				label: '随访类型',
				prop: 'followupType',
				span: 6,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择随访类型',
						tree: true,
						options: dict.get('followup_type'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '随访方式',
				prop: 'followupMethod',
				span: 6,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择随访方式',
						tree: true,
						options: dict.get('followup_method'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '随访结果',
				prop: 'followupResult',
				span: 24,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 4
					}
				}
			},
			{
				label: '随访图像',
				prop: 'followupImagePath',
				span: 12,
				component: {
					name: 'cl-upload',
					props: {
						isSpace: true,
						size: [80, 80],
						showUpload: true,
						showDelete: true,
						showPreview: true
					}
				},
				hook: {
					bind(value) {
						//console.log('image3 hook bind, 原始value:', value);
						// 使用公共方法处理图片URL
						return formatImageUrl(value);
					},
					submit(value) {
						//console.log('image3 hook submit:', value);
						// 使用公共方法处理图片URL提交
						return cleanImageUrlForSubmit(value);
					}
				}
			},
			{
				label: '备注',
				prop: 'followupNotes',
				span: 24,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 3
					}
				}
			},
			{
				label: '下次随访日期',
				prop: 'nextFollowupDate',
				span: 6,
				component: {
					name: 'el-date-picker',
					props: {
						type: 'date',
						valueFormat: 'YYYY-MM-DD'
					}
				}
			},
			{
				label: '医生',
				prop: 'physician',
				span: 6,
				component: {
					name: 'el-select',
					props: { clearable: true }
				}
			}
		],
		plugins: [Plugins.Form.setFocus('')],
		op: {
			// 默认靠右布局
			justify: 'center',
			buttons: [
				{
					label: '保存',
					type: 'primary',
					onClick: () => Form.value?.submit()
				},
				{
					label: '清空',
					onClick: clearData
				},
				{
					label: '打印',
					onClick: handlePrint
				}
			]
		},
		on: {
			submit: handleSubmit
		}
	});
};

onMounted(() => {
	initFollowup();
});
</script>

<style lang="scss" scoped>
.future-info {
	padding: 20px;
	background-color: #f8fafc;
	background-image:
		radial-gradient(circle at 10% 10%, rgba(224, 242, 254, 0.8), transparent 30%),
		radial-gradient(circle at 90% 90%, rgba(186, 230, 253, 0.4), transparent 40%);
	border-radius: 15px;
	box-shadow: 0 12px 30px rgba(32, 160, 255, 0.12);
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(90deg, rgba(32, 160, 255, 0.8), rgba(29, 233, 182, 0.8));
		background-size: 200% 100%;
		animation: gradientFlow 5s infinite linear;
	}

	.tech-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3px;
		padding-bottom: 3px;
		border-bottom: 1px solid rgba(32, 160, 255, 0.25);
		position: relative;

		.tech-title-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: nowrap;
			width: 100%; // 确保占满整行

			.tech-title {
				font-size: 22px;
				font-weight: 600;
				color: #0a58ca;
				text-shadow: 0 0 10px rgba(32, 160, 255, 0.2);
				white-space: nowrap;
				flex-shrink: 0; // 防止标题被压缩
				letter-spacing: 0.5px;
				position: relative;
				padding-left: 15px;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 5px;
					height: 80%;
					background: linear-gradient(
						to bottom,
						rgba(32, 160, 255, 0.8),
						rgba(29, 233, 182, 0.8)
					);
					border-radius: 2px;
				}

				.blink {
					animation: blink 1.2s infinite;
					font-weight: normal;
					color: rgba(32, 160, 255, 0.9);
				}
			}

			.model-info {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-end;
				font-size: 18px;
				color: #6c757d;
				font-family: 'Courier New', monospace;
				margin-left: auto;
				padding-left: 20px;
				flex-grow: 1; // 允许信息区域在有空间时扩展
				text-align: right; // 确保文本靠右对齐

				span {
					margin-left: 18px;
					padding: 2px 5px;
					white-space: nowrap;
					display: inline-block;
					position: relative;
					font-weight: bold;
					font-style: italic;
					color: #0d1a26;
					transition: all 0.3s ease;
					cursor: default; // 显示提示鼠标样式

					// 去掉原有的背景和边框
					background: transparent;
					border: none;

					// 添加虚线分隔
					&:not(:first-child)::before {
						content: '';
						position: absolute;
						left: 5px; // 稍微调整虚线位置
						top: 25%;
						height: 50%;
						width: 1px;
						border-left: 1px dashed rgba(32, 160, 255, 0.4);
					}

					&:hover {
						color: rgba(32, 160, 255, 1);
						transform: translateY(-1px);
					}

					&:empty::after {
						content: ' ';
						display: inline-block;
						width: 1px;
					}
				}
			}
		}

		&::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: -1px;
			width: 50px;
			height: 3px;
			background: linear-gradient(90deg, rgba(32, 160, 255, 0.8), rgba(29, 233, 182, 0.8));
		}
	}

	.tech-patient-info {
		padding: 8px 5px 10px;
		margin-bottom: 5px;
		background: rgba(240, 248, 255, 0.9);
		border: 1px solid rgba(32, 160, 255, 0.3);
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(32, 160, 255, 0.2);
		position: relative;
		z-index: 2;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background:
				radial-gradient(circle at 10% 20%, rgba(32, 160, 255, 0.1), transparent 30%),
				radial-gradient(circle at 90% 80%, rgba(29, 233, 182, 0.05), transparent 30%),
				linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
			pointer-events: none;
			z-index: -1;
		}
		.patient-info {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-end;
			font-size: 18px;
			color: #6c757d;
			font-family: 'Courier New', monospace;
			margin-left: auto;
			padding-left: 20px;
			flex-grow: 1; // 允许信息区域在有空间时扩展
			text-align: right; // 确保文本靠右对齐

			span {
				margin-left: 18px;
				padding: 2px 5px;
				white-space: nowrap;
				display: inline-block;
				position: relative;
				font-weight: bold;
				font-style: italic;
				color: #0d1a26;
				transition: all 0.3s ease;
				cursor: default; // 显示提示鼠标样式

				// 去掉原有的背景和边框
				background: transparent;
				border: none;

				// 添加虚线分隔
				&:not(:first-child)::before {
					content: '';
					position: absolute;
					left: 5px; // 稍微调整虚线位置
					top: 25%;
					height: 50%;
					width: 1px;
					border-left: 1px dashed rgba(32, 160, 255, 0.4);
				}

				&:hover {
					color: rgba(32, 160, 255, 1);
					transform: translateY(-1px);
				}

				&:empty::after {
					content: ' ';
					display: inline-block;
					width: 1px;
				}
			}
		}
	}
}

.tech-content {
	position: relative;
	//background-color: #f8fafc;
	//透明背景
	background-color: transparent;
	background-image:
		linear-gradient(125deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 40%),
		radial-gradient(circle at 5% 95%, rgba(32, 160, 255, 0.1), transparent 20%);
	// 增加内容内边距
	padding: 10px;
	// 增加内容圆角
	border-radius: 12px;
	// 增加内容阴影
	box-shadow: 0 10px 25px rgba(32, 160, 255, 0.12);
	// 增加内容最小高度
	min-height: 600px;
	// 增加内容边框
	border: 1px solid rgba(32, 160, 255, 0.25);
	// 增加内容过渡
	transition: all 0.3s ease;
	// 增加内容溢出隐藏
	overflow: hidden;
	// 增加内容顶部间距
	margin-top: 0px;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		background: linear-gradient(90deg, rgba(32, 160, 255, 0.8), rgba(29, 233, 182, 0.8));
		opacity: 0.8;
	}

	// &::after {
	// 	content: '';
	// 	position: absolute;
	// 	width: 100%;
	// 	height: 2px;
	// 	background-color: rgba(32, 160, 255, 0.1);
	// 	left: 0;
	// 	top: 50%;
	// 	animation: scanning 4s ease-in-out infinite;
	// 	pointer-events: none;
	// 	background-image: linear-gradient(
	// 		90deg,
	// 		transparent,
	// 		rgba(32, 160, 255, 0.5),
	// 		rgba(29, 233, 182, 0.5),
	// 		transparent
	// 	);
	// }
}

.scroll-container {
	width: 100%;
	height: 100%;
	max-height: 90vh;
	min-height: 300px;
	overflow-y: auto !important;
	overflow-x: auto !important;
	padding: 15px;
	position: relative;
	display: block;
	box-sizing: border-box;
	z-index: 1;

	&::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	&::-webkit-scrollbar-track {
		background-color: #f1f1f1;
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #c1c1c1;
		border-radius: 4px;
		transition: all 0.2s ease;

		&:hover {
			background-color: #a8a8a8;
		}
	}

	:deep(.cl-form) {
		width: 100%;
		min-width: 100%;
		overflow: visible;
	}
}

@media screen and (max-width: 768px) {
	.scroll-container {
		padding: 10px;
		max-height: 55vh;
	}
}
</style>
