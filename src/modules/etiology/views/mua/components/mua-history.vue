<template>
	<div class="mua-history-container">
		<div class="history-content">
			<el-tabs v-model="activeTab" type="card" @tab-change="onTabChange">
				<el-tab-pane label="简化评估" name="MUASIMPLIFY">
					<history-list
						v-if="activeTab === 'MUASIMPLIFY'"
						:swl-no="props.swlNo"
						:serial-number="props.serialNumber"
						:patient-no="props.patientNo"
						:assessment-count="props.assessmentCount"
						:module-code="'mua1'"
					/>
				</el-tab-pane>
				<el-tab-pane label="全面评估" name="MUAOVERALL">
					<history-list
						v-if="activeTab === 'MUAOVERALL'"
						:swl-no="props.swlNo"
						:serial-number="props.serialNumber"
						:patient-no="props.patientNo"
						:assessment-count="props.assessmentCount"
						:module-code="'mua2'"
					/>
				</el-tab-pane>
				<el-tab-pane label="特殊评估" name="MUASPECIAL">
					<history-list
						v-if="activeTab === 'MUASPECIAL'"
						:swl-no="props.swlNo"
						:serial-number="props.serialNumber"
						:patient-no="props.patientNo"
						:assessment-count="props.assessmentCount"
						:module-code="'mua3'"
					/>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts" setup>
/**
 * 评估分析历史记录组件
 * @description 显示评估分析的历史记录列表，包含三个Tab：简化评估、全面评估、特殊评估
 */
import { ref } from 'vue';
import HistoryList from './history-list.vue';

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
	}
});

// 当前激活的Tab
const activeTab = ref('MUASIMPLIFY');

/**
 * Tab切换事件处理
 * @param tabName Tab名称
 */
const onTabChange = (tabName: string | number) => {
	// Tab切换时，子组件会自动根据 moduleCode 重新加载数据
	console.log('切换到Tab:', tabName);
};
</script>

<style lang="scss" scoped>
.mua-history-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;

	.history-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;

		:deep(.el-tabs) {
			display: flex;
			flex-direction: column;
			height: 100%;

			.el-tabs__header {
				margin: 0;
				padding: 0;
				flex-shrink: 0;
				order: 1;
			}

			.el-tabs__content {
				flex: 1;
				overflow: hidden;
				min-height: 0;
				order: 2;

				.el-tab-pane {
					height: 100%;
					overflow: hidden;
				}
			}
		}
	}
}
</style>
