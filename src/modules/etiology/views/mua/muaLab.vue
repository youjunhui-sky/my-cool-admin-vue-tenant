<template>
	<cl-crud ref="Crud" style="padding: 0px; background-color: transparent">
		<div class="split-layout-container">
			<!-- Upper Table Section -->
			<div class="upper-section">
				<div v-if="moduleName" class="module-header">
					<el-alert
						:title="`当前评估模式：${moduleName}`"
						type="info"
						:closable="false"
						show-icon
						class="module-mode-alert"
					/>
					<el-button
						type="info"
						size="small"
						class="toggle-right-panel-btn"
						@click="toggleRightPanel"
					>
						<el-icon>
							<arrow-right v-if="!isRightPanelCollapsed" />
							<arrow-left v-else />
						</el-icon>
						<span class="toggle-right-panel-btn__text">
							{{ isRightPanelCollapsed ? '展开右侧面板' : '收起右侧面板' }}
						</span>
					</el-button>
				</div>
				<lab
					ref="labRef"
					class="past-medical-table"
					:swlNo="props.swlNo"
					:serialNumber="props.serialNumber"
					:moduleCode="moduleCode"
					:patientNo="props.patientNo"
					:assessmentCount="props.assessmentCount"
					:onIndicatorUpdate="handleIndicatorUpdate"
					:onLabModuleUpdate="handleLabModuleUpdate"
					:name="props.name"
					:outpatientNo="props.outpatientNo"
					:inpatientNo="props.inpatientNo"
					@collapse-change="handleLabCollapseChange"
				/>
			</div>
		</div>
	</cl-crud>
</template>

<script lang="ts" setup>
/**
 * 检验数据组件
 * @description 代谢性尿路结石病因学评估 - 检验数据
 */
defineOptions({
	name: 'mua-lab'
});

// 定义 props
const props = defineProps({
	swlNo: {
		type: String,
		required: true
	},
	serialNumber: {
		type: String,
		required: true
	},
	patientNo: {
		type: String,
		required: true
	},
	assessmentCount: {
		type: Number,
		required: true
	},
	id: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	outpatientNo: {
		type: String,
		required: false
	},
	inpatientNo: {
		type: String,
		required: false
	}
});

// 定义组件 emits
const emit = defineEmits<{
	(e: 'update:modelValue', value: any): void;
	(e: 'module-mode-changed', moduleName: string): void;
}>();

import { ref, onMounted, watch } from 'vue';
import { useCrud } from '@cool-vue/crud';
import { ElMessage } from 'element-plus';
import { service } from '/@/cool';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';

import Lab from '/@/modules/etiology/views/mua/lab.vue';

const moduleCode = 'mua'; //检验数据

// CRUD 配置
const Crud = useCrud({
	service: service.swl.lab
});

// 监听门诊号/住院号变化，页面已打开时也能即时刷新
watch(
	() => [props.outpatientNo, props.inpatientNo],
	async () => {
		try {
			// 刷新Lab数据
			if (labRef.value && labRef.value.refreshLabData) {
				await labRef.value.refreshLabData();
			}
		} catch (e) {}
	}
);

// Lab组件的引用
const labRef = ref<InstanceType<typeof Lab>>();

const moduleName = ref('');
const handleLabCollapseChange = (collapsed: boolean) => {
	isRightPanelCollapsed.value = collapsed;
};

const toggleRightPanel = () => {
	labRef.value?.toggleRightContainer?.();
};
// 默认收起右侧面板
const isRightPanelCollapsed = ref(true);

// 初始化模块名称
const initModuleName = async () => {
	const oldModuleName = moduleName.value;
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	const code = await service.etiology.muaItems.queryModuleCode(params);
	if (code) {
		if (code == 'mua3') {
			moduleName.value = '特殊评估';
		} else if (code == 'mua2') {
			moduleName.value = '全面评估';
		} else {
			moduleName.value = '简化评估';
		}
		//判断moduleName是否改变，如果改变，需要弹框提示
		if (oldModuleName != null && oldModuleName != '' && oldModuleName != moduleName.value) {
			ElMessage.warning('当前已切换到【' + moduleName.value + '】');
			//此处改变后需要传递信息给muaAnalysis组件和muaSuggestion组件
			// 通过事件通知父组件，由父组件协调调用相应组件的方法
			emit('module-mode-changed', moduleName.value);
		}
	}
};

// 刷新Lab数据
const refreshLabData = async () => {
	if (labRef.value && labRef.value.refreshLabData) {
		await labRef.value.refreshLabData();
	}
};

// 处理指标更新的回调函数
const handleIndicatorUpdate = async () => {
	await refreshLabData();
};

// 处理Lab模块更新的回调函数
const handleLabModuleUpdate = async () => {
	await initModuleName();
};

//进页面就加载
onMounted(async () => {
	await initModuleName();
});
</script>

<style lang="scss" scoped>
.split-layout-container {
	height: calc(100vh - 220px);
	display: flex;
	flex-direction: column;
	background-color: transparent;
	padding: 0px;
	gap: 3px;
	overflow-y: auto;
	position: relative;

	.upper-section {
		background-color: transparent;
		padding: 0px;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		overflow: visible;
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 200px;
		transition: height 0.3s ease;

		// 评估模式提醒样式
		.module-mode-alert {
			flex: 1;
			margin-bottom: 0;
			border-radius: 4px;
			font-size: 14px;

			:deep(.el-alert__content) {
				.el-alert__title {
					font-size: 14px;
					font-weight: 500;
					color: var(--el-text-color-primary);
				}
			}
		}

		.module-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			margin-bottom: 12px;
		}

		.toggle-right-panel-btn {
			display: inline-flex;
			align-items: center;
			gap: 6px;

			&__text {
				white-space: nowrap;
			}
		}

		:deep(.cl-crud) {
			height: 100%;
			display: flex;
			flex-direction: column;

			.cl-table {
				flex: 1;
				overflow: visible;
			}
		}

		// Lab组件容器样式
		.past-medical-table {
			height: 100%;
			min-height: 200px;
			transition: height 0.3s ease;
		}
	}
}
</style>
