<template>
	<div class="sqbl-info-wrapper">
		<div>
			<p hidden>id: {{ id }}</p>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<div class="sqbl-info tech-panel">
			<!-- 标题 -->
			<div class="tech-header">
				<div class="tech-title-container">
					<div class="tech-title">
						智能泌尿系结石诊疗管理系统<span class="blink">_</span>
					</div>
					<div class="patient-info">
						<span title="碎石号">No.{{ patientSwlInfo.swlNo || ' ' }}</span>
						<span title="姓名">N.{{ patientSwlInfo.name || ' ' }}</span>
						<span title="性别">G.{{ formatGender(patientSwlInfo.gender) }}</span>
						<span title="年龄">A.{{ patientSwlInfo.age || ' ' }}</span>
						<span title="序列号">SN.{{ patientSwlInfo.sequenceNo || ' ' }}</span>
						<span title="期数">P.{{ patientSwlInfo.episode || ' ' }}</span>
					</div>
				</div>
			</div>

			<!-- 使用Steps -->
			<div class="steps-with-nav">
				<el-steps
					:active="activeStepIndex"
					finish-status="success"
					process-status="process"
					class="tech-steps"
					@change="handleStepChange"
					align-center
					simple
				>
					<el-step
						title="病史"
						icon="InfoFilled"
						class="step-item"
						@click="goToStep(0)"
					/>
					<el-step title="检验" icon="Document" class="step-item" @click="goToStep(1)" />
					<el-step
						title="影像"
						icon="PictureFilled"
						class="step-item"
						@click="goToStep(2)"
					/>
					<el-step
						title="诊断"
						icon="CircleCheckFilled"
						class="step-item"
						@click="goToStep(3)"
					/>
				</el-steps>

				<!-- 导航按钮容器 -->
				<div class="nav-buttons-container">
					<el-button
						type="primary"
						:disabled="activeStepIndex === 0"
						@click="previousStep"
						class="tech-button nav-arrow-btn prev-btn"
					>
						<el-icon class="multi-arrow"><arrow-left /></el-icon>
						<el-icon class="multi-arrow"><arrow-left /></el-icon>
						<span class="arrow-text">上一步</span>
					</el-button>
					<el-button
						type="primary"
						:disabled="activeStepIndex === 3"
						@click="nextStep"
						class="tech-button nav-arrow-btn next-btn"
					>
						<span class="arrow-text">下一步</span>
						<el-icon class="multi-arrow"><arrow-right /></el-icon>
						<el-icon class="multi-arrow"><arrow-right /></el-icon>
					</el-button>
				</div>
			</div>

			<div class="step-content tech-content">
				<!-- 使用keep-alive包装动态组件 -->
				<keep-alive>
					<component :is="activeStepComponent" />
				</keep-alive>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, computed, onMounted, markRaw, provide } from 'vue';
// 导入方式修改，使用模块useSwl
import { useSwl } from '/@/modules/swl';
import { useRoute } from 'vue-router';
import { useCool } from '/@/cool';
// 修正Element Plus图标导入，添加ArrowLeft和ArrowRight
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';

// 使用组合式API，只调用一次useCool
const cool = useCool();
const { service } = cool;
const { components } = useSwl();

/**
 * 术前病历资料先接收跳转过来的参数
 * 1、获取路由及参数
 * 2、响应式数据加载
 * 3、数据加载
 */
const route = useRoute();
const data = route.query;
// 确保能获取到swlNo参数
const id = route.query.id as string;
const swlNo = route.query.swlNo as string;
const serialNumber = route.query.serialNumber as string;

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

// 追踪已加载的步骤
const loadedSteps = reactive({
	medicalHistory: true, // 病史默认为已加载
	laboratory: false,
	imaging: false,
	diagnosis: false
});

// 直接使用框架注册的组件
const stepComponents = {
	MedicalHistoryStep: markRaw(components.MedicalHistoryStep),
	LaboratoryStep: markRaw(components.LaboratoryStep),
	ImagingStep: markRaw(components.ImagingStep),
	DiagnosisStep: markRaw(components.DiagnosisStep)
};

// 根据当前激活的tab返回对应的组件
const activeStepComponent = computed(() => {
	switch (activeTab.value) {
		case 'medicalHistory':
			return stepComponents.MedicalHistoryStep;
		case 'laboratory':
			return stepComponents.LaboratoryStep;
		case 'imaging':
			return stepComponents.ImagingStep;
		case 'diagnosis':
			return stepComponents.DiagnosisStep;
		default:
			return stepComponents.MedicalHistoryStep;
	}
});

// TODO: 从后端获取患者信息
const fetchPatientSwlInfo = async () => {
	try {
		//这里应该调用API获取患者信息
		const res = await service.swl.info.info({ id: id });
		//如果res有值，则赋值给patientSwlInfo
		if (res) {
			Object.assign(patientSwlInfo, res);
		}
	} catch (error) {
		console.error('获取患者信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(patientSwlInfo, {
			id: ' ',
			swlNo: ' ',
			name: ' ',
			gender: ' ',
			age: ' ',
			episode: ' ',
			sequenceNo: ' ',
			nativeProvince: ' ',
			nativeCity: ' ',
			currentProvince: ' ',
			currentCity: ' ',
			height: ' ',
			weight: ' ',
			bmi: ' '
		});
	}
};

// 页面加载时获取患者信息
onMounted(() => {
	fetchPatientSwlInfo();
});

// 当前激活的tab - 保留原有状态标识符
const activeTab = ref('medicalHistory');
const activeMedicalHistoryTab = ref('pastHistory');

// 添加当前激活的step索引
const activeStepIndex = ref(0);

// 病史二级tab列表
const medicalHistoryTabs = [
	'pastHistory', // 既往病史
	'familyHistory', // 家族史
	'stoneHistory', // 既往结石病史
	'personalHistory', // 个人史
	'menstrualHistory', // 月经婚姻生育史
	'current', // 现病史
	'physicalSigns' // 体征
];

// tab和step索引映射关系
const tabNameToStepIndex = {
	medicalHistory: 0,
	laboratory: 1,
	imaging: 2,
	diagnosis: 3
};

const stepIndexToTabName = ['medicalHistory', 'laboratory', 'imaging', 'diagnosis'];

// 切换step的处理函数
function handleStepChange(index) {
	activeStepIndex.value = index;
	activeTab.value = stepIndexToTabName[index];

	// 记录该步骤已经加载
	loadedSteps[activeTab.value] = true;

	// 如果切换到病史tab，总是显示第一个二级tab
	if (activeTab.value === 'medicalHistory') {
		activeMedicalHistoryTab.value = medicalHistoryTabs[0];
	}
}

// 添加直接跳转到指定步骤的函数
function goToStep(index) {
	if (index !== activeStepIndex.value) {
		handleStepChange(index);
	}
}

// 获取当前病史二级tab的索引
function getCurrentMedicalHistoryTabIndex() {
	const index = medicalHistoryTabs.indexOf(activeMedicalHistoryTab.value);
	return index >= 0 ? index : 0;
}

// 上一步函数
function previousStep() {
	if (activeTab.value === 'medicalHistory') {
		// 在病史页面内，先尝试切换到上一个二级tab
		const currentTabIndex = getCurrentMedicalHistoryTabIndex();
		if (currentTabIndex > 0) {
			// 如果不是第一个病史二级tab，切换到上一个
			activeMedicalHistoryTab.value = medicalHistoryTabs[currentTabIndex - 1];
			return;
		}
	}

	// 如果已经是第一个病史二级tab，或者当前不在病史页面，则切换到上一个主标签
	if (activeStepIndex.value > 0) {
		activeStepIndex.value--;
		activeTab.value = stepIndexToTabName[activeStepIndex.value];

		// 如果从其他标签切换回病史，显示第一个二级tab
		if (activeTab.value === 'medicalHistory') {
			activeMedicalHistoryTab.value = medicalHistoryTabs[0];
		}
	}
}

// 下一步函数
function nextStep() {
	if (activeTab.value === 'medicalHistory') {
		// 在病史页面内，先尝试切换到下一个二级tab
		const currentTabIndex = getCurrentMedicalHistoryTabIndex();
		if (currentTabIndex < medicalHistoryTabs.length - 1) {
			// 如果不是最后一个病史二级tab，切换到下一个
			activeMedicalHistoryTab.value = medicalHistoryTabs[currentTabIndex + 1];
			return;
		}
	}

	// 如果已经是最后一个病史二级tab，或者当前不在病史页面，则切换到下一个主标签
	if (activeStepIndex.value < 3) {
		activeStepIndex.value++;
		activeTab.value = stepIndexToTabName[activeStepIndex.value];

		// 记录该步骤已经加载
		loadedSteps[activeTab.value] = true;
	}
}

// 监听activeTab变化，同步更新activeStepIndex
watch(activeTab, newValue => {
	activeStepIndex.value = tabNameToStepIndex[newValue];
});

// 监听activeStepIndex变化，同步更新activeTab
watch(activeStepIndex, newValue => {
	activeTab.value = stepIndexToTabName[newValue];
});

// 表单数据
const formData = reactive({
	medicalHistory: {
		pastHistory: '',
		familyHistory: '',
		stoneHistory: '',
		personalHistory: '',
		menstrualHistory: '',
		current: '',
		vital: ''
	},
	laboratory: {
		results: ''
	},
	imaging: {
		results: ''
	},
	diagnosis: {
		results: ''
	}
});

// 提供数据给子组件
provide('id', id);
provide('swlNo', swlNo);
provide('serialNumber', serialNumber);
provide('patientSwlInfo', patientSwlInfo);
provide('loadedSteps', loadedSteps);
provide('activeMedicalHistoryTab', activeMedicalHistoryTab);
provide('formData', formData);

// 格式化性别
function formatGender(gender) {
	if (gender === undefined || gender === null) return ' ';
	const genderMap = {
		'0': '未知',
		'1': '男',
		'2': '女'
	};
	return genderMap[gender] || gender;
}
</script>

<style lang="scss" scoped>
@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(32, 160, 255, 0.7);
	}
	70% {
		box-shadow: 0 0 0 10px rgba(32, 160, 255, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(32, 160, 255, 0);
	}
}

@keyframes gradientFlow {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

@keyframes blink {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
}

@keyframes scanning {
	0% {
		transform: translateY(-100%);
		opacity: 0.5;
	}
	100% {
		transform: translateY(100%);
		opacity: 0;
	}
}

@keyframes glow {
	0%,
	100% {
		text-shadow: 0 0 5px rgba(32, 160, 255, 0.3);
	}
	50% {
		text-shadow:
			0 0 15px rgba(32, 160, 255, 0.7),
			0 0 20px rgba(32, 160, 255, 0.5);
	}
}

.sqbl-info {
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

	// 增加步骤导航与按钮之间的间距
	.steps-with-nav {
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.tech-steps {
		padding: 8px 5px 10px;
		margin-bottom: 0;
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

		:deep(.el-steps) {
			display: flex;
			justify-content: space-around;
			flex-wrap: nowrap;
		}

		:deep(.el-step__line) {
			display: none;
		}

		:deep(.el-step) {
			padding: 8px 10px;
			margin: 0 5px;
			cursor: pointer;
			transition: all 0.3s ease;
			background: rgba(255, 255, 255, 0.5);
			border-radius: 8px;
			border: 1px solid transparent;
			backdrop-filter: blur(5px);
			position: relative;
			overflow: hidden;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 0;
				height: 2px;
				background: linear-gradient(90deg, #0a58ca, #2ecc71);
				transition: width 0.3s ease;
			}

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 5px 15px rgba(32, 160, 255, 0.15);
				background: rgba(255, 255, 255, 0.8);
				border-color: rgba(32, 160, 255, 0.3);

				&::after {
					width: 80%;
				}
			}

			&.is-active,
			&.is-finish {
				background: rgba(240, 248, 255, 0.9);
				border-color: rgba(32, 160, 255, 0.5);
				box-shadow: 0 0 15px rgba(32, 160, 255, 0.3);

				&::after {
					width: 90%;
				}
			}

			.el-step__icon {
				width: 36px;
				height: 36px;
				background-color: rgba(240, 248, 255, 0.9);
				border: 2px solid rgba(32, 160, 255, 0.7);
				transition: all 0.3s ease;
				position: relative;
				overflow: hidden;

				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: radial-gradient(
						circle at center,
						rgba(32, 160, 255, 0.2),
						transparent 70%
					);
					opacity: 0;
					transition: opacity 0.5s ease;
				}

				&.is-active {
					animation: pulse 2s infinite;
					background-color: rgba(240, 248, 255, 1);
					border-color: rgba(32, 160, 255, 1);

					&::before {
						opacity: 1;
					}
				}

				&.is-finish {
					background-color: rgba(29, 233, 182, 0.1);
					border-color: rgba(29, 233, 182, 0.7);
				}
			}

			.el-step__title {
				font-weight: 500;
				font-size: 16px;
				line-height: 1.2;
				margin-top: 10px;
				transition: all 0.3s ease;
				color: rgba(13, 26, 38, 0.8);
				text-shadow: 0 0 5px rgba(32, 160, 255, 0.1);

				&.is-process {
					color: rgba(10, 88, 202, 0.9);
					font-weight: 600;
					text-shadow: 0 0 8px rgba(32, 160, 255, 0.2);
				}

				&.is-finish {
					color: rgba(29, 233, 182, 0.9);
				}
			}

			.el-step__icon-inner {
				color: rgba(10, 88, 202, 0.8);
				font-weight: normal;

				&.is-active,
				&.is-finish {
					color: rgba(10, 88, 202, 1);
				}
			}
		}
	}

	// 导航按钮容器样式
	.nav-buttons-container {
		display: flex;
		align-items: center;
		justify-content: center;
		// 增加按钮之间的间距
		gap: 25px;
		z-index: 20;
		// 增加按钮与容器之间的间距
		margin: 5px auto 0px;
		width: 100%;
		max-width: 500px;
	}

	// 导航箭头按钮样式
	.nav-arrow-btn {
		position: relative;
		min-width: 100px;
		height: 30px; // 减少5px高度
		// 增加按钮内边距
		padding: 0 12px;
		background: rgba(32, 160, 255, 0.8);
		border-radius: 6px;
		border: none;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		// 增加按钮阴影
		box-shadow: 0 4px 12px rgba(32, 160, 255, 0.2);
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.2), transparent);
			transform: translateX(-100%);
			transition: transform 0.6s ease;
		}

		.arrow-text {
			font-size: 15px;
			font-weight: 500;
			letter-spacing: 1px;
			margin: 0 8px;
			z-index: 2;
		}

		.multi-arrow {
			font-size: 14px;
			transition: all 0.3s ease;
			margin: 0 -2px;
			z-index: 2;
		}

		&.prev-btn {
			.multi-arrow:first-child {
				margin-left: 0;
				opacity: 0.7;
			}
		}

		&.next-btn {
			.multi-arrow:last-child {
				margin-right: 0;
				opacity: 0.7;
			}
		}

		&:hover:not([disabled]) {
			background: rgba(32, 160, 255, 1);
			transform: translateY(-2px);
			box-shadow: 0 6px 16px rgba(32, 160, 255, 0.35);

			&::before {
				transform: translateX(100%);
			}

			.multi-arrow:first-child {
				transform: translateX(-4px);
				opacity: 1;
			}

			.multi-arrow:last-child {
				transform: translateX(4px);
				opacity: 1;
			}
		}

		&:active:not([disabled]) {
			transform: translateY(1px);
			box-shadow: 0 2px 8px rgba(32, 160, 255, 0.25);
		}

		&:disabled {
			background: rgba(144, 147, 153, 0.4);
			cursor: not-allowed;
			box-shadow: none;
		}
	}

	.tech-content {
		position: relative;
		background-color: #f8fafc;
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

	.tech-panel-inner {
		animation: fadeIn 0.3s ease;
	}

	.tech-tabs {
		:deep(.el-tabs__header) {
			margin-bottom: 20px;
			border-bottom: 1px solid rgba(32, 160, 255, 0.15);
		}

		:deep(.el-tabs__item) {
			transition: all 0.3s ease;

			&.is-active {
				color: #0a58ca;
				font-weight: 600;
			}

			&:hover {
				color: #0a58ca;
			}
		}

		:deep(.el-tabs__active-bar) {
			background-color: #0a58ca;
			height: 3px;
		}
	}

	.tech-button {
		position: relative;
		transition: all 0.3s ease;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(
				90deg,
				rgba(255, 255, 255, 0) 0%,
				rgba(255, 255, 255, 0.2) 50%,
				rgba(255, 255, 255, 0) 100%
			);
			transition: all 0.6s;
		}

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 10px rgba(10, 88, 202, 0.2);

			&::before {
				left: 100%;
			}
		}
	}

	// .past-medical-container {
	// 	margin-top: 5px;
	// 	padding-top: 5px;

	// 	h3 {
	// 		margin-bottom: -10px;
	// 		font-size: 16px;
	// 		color: #0a58ca;
	// 	}

	// 	.past-medical-table {
	// 		width: 100%;
	// 		min-height: 300px;
	// 	}
	// }

	.loading-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 300px;
		width: 100%;
		color: #0a58ca;
		gap: 15px;

		.el-icon {
			font-size: 32px;
		}

		span {
			font-size: 16px;
		}
	}

	// 添加步骤项自定义样式
	:deep(.step-item) {
		position: relative;

		// 添加点击反馈效果
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: transparent;
			border-radius: 4px;
			transition: background-color 0.3s ease;
			z-index: -1;
		}

		&:hover::after {
			background-color: rgba(32, 160, 255, 0.05);
		}

		&.is-active {
			.el-step__title,
			.el-step__icon-inner {
				font-weight: 600;
			}
		}
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
