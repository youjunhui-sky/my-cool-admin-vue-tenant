<template>
	<div class="tech-panel-inner">
		<el-form label-width="120px" class="mua-form">
			<div class="mua-simplify-container">
				<mua-lab
					ref="muaLabRef"
					class="mua-simplify-table"
					v-model="formData.muaLab"
					:id="id"
					:patientNo="patientNo"
					:swlNo="swlNo"
					:serialNumber="serialNumber"
					:assessmentCount="assessmentCount"
					:name="name"
					:outpatientNo="outpatientNo"
					:inpatientNo="inpatientNo"
					@module-mode-changed="handleModuleModeChanged"
				/>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { inject, type Ref, ref } from 'vue';
import MuaLab from '../../views/mua/muaLab.vue';

// 从父组件注入必要的数据
const id = inject<number>('id', 0);
const patientNo = inject<string>('patientNo', '');
const swlNo = inject<string>('swlNo', '');
const serialNumber = inject<string>('serialNumber', '');
const assessmentCount = inject<number>('assessmentCount', 1);
//此处需要适配从PatientStep保存后传递过来的数据
const name = inject<Ref<string>>('name', ref(''));
const outpatientNo = inject<Ref<string>>('outpatientNo', ref(''));
const inpatientNo = inject<Ref<string>>('inpatientNo', ref(''));
const formData = inject<any>('formData', {
	simplify: ''
});

// 组件引用
const muaLabRef = ref<InstanceType<typeof MuaLab>>();

// 从父组件注入的刷新回调函数
const refreshAnalysisCallback = inject<(() => void) | null>('refreshAnalysisCallback', null);
const refreshSuggestionCallback = inject<(() => void) | null>('refreshSuggestionCallback', null);

/**
 * 处理评估模式切换事件
 */
function handleModuleModeChanged(moduleName: string) {
	// 调用刷新回调函数
	if (refreshAnalysisCallback) {
		refreshAnalysisCallback();
	}
	if (refreshSuggestionCallback) {
		refreshSuggestionCallback();
	}
}
</script>

<style lang="scss" scoped>
.tech-panel-inner {
	animation: fadeIn 0.3s ease;
	// 伸展到底部
	flex: 1 1 auto;
	min-height: 0;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.mua-form {
	flex: 1 1 auto;
	min-height: 0;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.mua-simplify-container {
	flex: 1 1 auto;
	min-height: 0;
	height: 100%;
	display: flex;
	flex-direction: column;
	margin-top: 5px;
	padding-top: 5px;

	h3 {
		margin-bottom: -10px;
		font-size: 16px;
		color: #0a58ca;
	}

	.mua-simplify-table {
		flex: 1 1 auto;
		min-height: 0;
		height: 100%;
		width: 100%;
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
