<template>
	<div class="mua-wrapper">
		<div>
			<p hidden>patientNo: {{ patientNo }}</p>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
			<p hidden>assessmentCount: {{ assessmentCount }}</p>
		</div>
		<div class="mua-info">
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
					<el-step title="患者档案" icon="InfoFilled" @click="goToStep(0)" />
					<el-step
						title="检验数据"
						icon="Document"
						class="step-item"
						@click="goToStep(1)"
					/>
					<el-step
						title="分析结果"
						icon="PictureFilled"
						class="step-item"
						@click="goToStep(2)"
					/>
					<el-step
						title="防治建议"
						icon="CircleCheckFilled"
						class="step-item"
						@click="goToStep(3)"
					/>
				</el-steps>
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
import { reactive, ref, watch, computed, markRaw, provide } from 'vue';
// 导入方式修改，使用模块useEtiology
import { useEtiology } from '/@/modules/etiology';
import { useRoute } from 'vue-router';
// 修正Element Plus图标导入，添加ArrowLeft和ArrowRight
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { useForm } from '@cool-vue/crud';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { service } from '/@/cool';

// 使用组合式API，只调用一次useCool
const { components } = useEtiology();

/**
 * 术前病历资料先接收跳转过来的参数
 * 1、获取路由及参数
 * 2、响应式数据加载
 * 3、数据加载
 */
const route = useRoute();
// 确保能获取到swlNo参数
const id = Number(route.query.id);
const patientNo = route.query.patientNo as string;
const swlNo = route.query.swlNo as string;
const serialNumber = route.query.serialNumber as string;
const assessmentCount = Number(route.query.assessmentCount);
// 使用 ref 以便后续子组件更新并实时同步
const name = ref((route.query.name as string) || '');
const outpatientNo = ref((route.query.outpatientNo as string) || '');
const inpatientNo = ref((route.query.inpatientNo as string) || '');
// 追踪已加载的步骤
const loadedSteps = reactive({
	patient: true, // 患者档案 默认加载
	lab: false, // 检验数据
	analysis: false, // 分析结果
	suggestion: false // 防治建议
});

// 直接使用框架注册的组件
const stepComponents = {
	PatientStep: markRaw(components.PatientStep),
	LabStep: markRaw(components.LabStep),
	AnalysisStep: markRaw(components.AnalysisStep),
	SuggestionStep: markRaw(components.SuggestionStep)
};

// 根据当前激活的tab返回对应的组件
const activeStepComponent = computed(() => {
	switch (activeTab.value) {
		case 'patient':
			return stepComponents.PatientStep;
		case 'lab':
			return stepComponents.LabStep;
		case 'analysis':
			return stepComponents.AnalysisStep;
		case 'suggestion':
			return stepComponents.SuggestionStep;
		default:
			return stepComponents.PatientStep;
	}
});

// 当前激活的tab - 保留原有状态标识符
const activeTab = ref('patient');

// 添加当前激活的step索引
const activeStepIndex = ref(0);

// tab和step索引映射关系
const tabNameToStepIndex = {
	patient: 0,
	lab: 1,
	analysis: 2,
	suggestion: 3
};

const stepIndexToTabName = ['patient', 'lab', 'analysis', 'suggestion'];

// 切换step的处理函数
function handleStepChange(index) {
	activeStepIndex.value = index;
	activeTab.value = stepIndexToTabName[index];
	// 记录该步骤已经加载
	loadedSteps[activeTab.value] = true;
}

// 添加直接跳转到指定步骤的函数
function goToStep(index) {
	if (index !== activeStepIndex.value) {
		handleStepChange(index);
	}
}

// 上一步函数
function previousStep() {
	if (activeStepIndex.value > 0) {
		activeStepIndex.value--;
		activeTab.value = stepIndexToTabName[activeStepIndex.value];
	}
}

// 下一步函数
function nextStep() {
	if (activeStepIndex.value < 3) {
		activeStepIndex.value++;
		activeTab.value = stepIndexToTabName[activeStepIndex.value];
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

// 刷新回调函数管理
const refreshAnalysisCallback = ref<(() => void) | null>(null);
const refreshSuggestionCallback = ref<(() => void) | null>(null);

/**
 * 注册刷新分析组件的回调函数
 */
const registerRefreshAnalysisCallback = (callback: () => void) => {
	refreshAnalysisCallback.value = callback;
};

/**
 * 注册刷新建议组件的回调函数
 */
const registerRefreshSuggestionCallback = (callback: () => void) => {
	refreshSuggestionCallback.value = callback;
};

// 提供数据给子组件
provide('id', id);
provide('patientNo', patientNo);
provide('swlNo', swlNo);
provide('serialNumber', serialNumber);
provide('assessmentCount', assessmentCount);
provide('name', name);
provide('outpatientNo', outpatientNo);
provide('inpatientNo', inpatientNo);
provide('loadedSteps', loadedSteps);
provide('activeStepIndex', activeStepIndex);
provide('activeTab', activeTab);

// 提供刷新回调函数注册器和回调函数
provide('registerRefreshAnalysisCallback', registerRefreshAnalysisCallback);
provide('registerRefreshSuggestionCallback', registerRefreshSuggestionCallback);
provide('refreshAnalysisCallback', () => {
	if (refreshAnalysisCallback.value) {
		refreshAnalysisCallback.value();
	}
});
provide('refreshSuggestionCallback', () => {
	if (refreshSuggestionCallback.value) {
		refreshSuggestionCallback.value();
	}
});
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

.mua-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.mua-info {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	// 增加步骤导航与按钮之间的间距
	.steps-with-nav {
		margin-top: 5px;
		margin-bottom: 5px;
		flex-shrink: 0;
	}

	// 导航按钮容器样式
	.nav-buttons-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		// 增加按钮之间的间距
		gap: 15px;
		z-index: 20;
		// 增加按钮与容器之间的间距
		margin: 5px auto 0px;
		width: 100%;
		max-width: 100%; // 增加最大宽度以容纳三个按钮
		padding: 0 20px; // 添加左右内边距
		position: relative; // 添加相对定位

		// 左侧导航按钮组 - 修改为居中
		.nav-group {
			display: flex;
			gap: 25px;
			position: absolute; // 绝对定位
			left: 50%; // 左边缘到容器中心
			transform: translateX(-50%); // 向左偏移自身宽度的一半，实现居中
		}

		// 实验室报告数据绑定按钮 - 靠右对齐
		.data-management-btn {
			margin-left: auto; // 自动左边距，推送到右侧
		}
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

	.step-content,
	.tech-content {
		position: relative;
		// background-color: #f8fafc;
		// background-image:
		// 	linear-gradient(125deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 40%),
		// 	radial-gradient(circle at 5% 95%, rgba(32, 160, 255, 0.1), transparent 20%);
		// 增加内容内边距
		padding: 0px;
		// 增加内容圆角
		border-radius: 12px;
		// 增加内容阴影
		box-shadow: 0 10px 25px rgba(32, 160, 255, 0.12);
		// 占满可用空间
		flex: 1 1 auto;
		min-height: 0;
		height: 100%;
		// 增加内容边框
		border: 1px solid rgba(32, 160, 255, 0.25);
		// 增加内容过渡
		transition: all 0.3s ease;
		// 允许内容滚动
		overflow: auto;
		// 增加内容顶部间距
		margin-top: 0px;
		display: flex;
		flex-direction: column;
		// 确保伸展到底部
		align-self: stretch;
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
}

// 搜索条件顶部样式
.search-conditions-top {
	background: var(--el-fill-color-lighter);
	border: 1px solid var(--el-border-color-light);
	border-radius: 8px;
	padding: 8px 16px;
	margin-bottom: 0;

	.el-form {
		margin: 0;

		.search-row {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 8px;
			margin-bottom: 8px;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.el-form-item {
			margin-bottom: 0;
			margin-right: 0;

			.el-form-item__label {
				font-size: 13px;
				color: var(--el-text-color-regular);
				font-weight: 500;
			}

			.el-input,
			.el-date-editor {
				.el-input__wrapper {
					height: 32px;
					font-size: 13px;
				}
			}

			.el-button {
				height: 32px;
				font-size: 13px;
				padding: 0 16px;
			}
		}
	}
}

// 尿类型选择和操作按钮的组合样式
.urine-type-and-actions {
	padding: 16px;
	background: var(--el-fill-color-extra-light);
	border: 1px solid var(--el-border-color-light);
	border-radius: 8px;
	margin-top: 20px;

	.urine-type-row {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;

		.el-form-item {
			margin-bottom: 0;
			display: flex;
			align-items: center;

			.el-form-item__label {
				font-size: 14px;
				font-weight: 500;
				color: var(--el-text-color-primary);
				margin-right: 16px;
				margin-bottom: 0 !important;
			}

			.el-form-item__content {
				display: flex;
				align-items: center;
			}

			.el-radio-group {
				display: flex;
				align-items: center;

				.el-radio {
					margin-right: 20px;

					&:last-child {
						margin-right: 0;
					}

					.el-radio__label {
						font-size: 13px;
						font-weight: 500;
					}
				}
			}
		}
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;

		.el-button {
			min-width: 80px;
			height: 32px;
			font-size: 13px;
			font-weight: 500;
			border-radius: 6px;
			transition: all 0.3s ease;

			&:hover:not(:disabled) {
				transform: translateY(-1px);
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			}

			&:active:not(:disabled) {
				transform: translateY(0);
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}
	}
}

// 弹窗专用样式
:deep(.lab-binding-dialog) {
	.el-dialog {
		display: flex;
		flex-direction: column;
		margin: 0 !important;
		height: 70vh !important; // 确保弹窗有固定高度
		max-height: 70vh !important;
	}

	.el-dialog__header {
		flex-shrink: 0;
		padding: 20px 24px 0 24px !important;
	}

	.el-dialog__body {
		padding: 0 !important;
		flex: 1 !important;
		overflow: hidden !important;
		display: flex !important;
		flex-direction: column !important;
		min-height: 0 !important; // 关键：允许flex子项收缩
	}

	.el-form {
		height: 100% !important;
		display: flex !important;
		flex-direction: column !important;
		min-height: 0 !important; // 关键：允许flex子项收缩

		.el-form-item {
			margin-bottom: 0 !important;
			flex: 1 !important;
			display: flex !important;
			flex-direction: column !important;
			min-height: 0 !important; // 关键：允许flex子项收缩

			.el-form-item__content {
				flex: 1 !important;
				line-height: normal !important;
				display: flex !important;
				flex-direction: column !important;
				min-height: 0 !important; // 关键：允许flex子项收缩
			}
		}
	}
}

// 检验项目组选中行样式
:deep(.selected-lab-group-row) {
	background-color: #409eff !important; // 使用Element Plus主色调
	color: white !important;

	td {
		background-color: #409eff !important;
		color: white !important;
	}

	&:hover {
		background-color: #337ecc !important; // 悬停时颜色更深

		td {
			background-color: #337ecc !important;
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
