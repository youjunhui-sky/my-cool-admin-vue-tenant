<template>
	<div class="tech-panel-inner">
		<el-form label-width="120px" class="mua-form">
			<div class="mua-special-container">
				<special
					class="mua-special-table"
					v-model="formData.special"
					:id="id"
					:patientNo="patientNo"
					:swlNo="swlNo"
					:serialNumber="serialNumber"
					:assessmentCount="assessmentCount"
					:name="name"
					:outpatientNo="outpatientNo"
					:inpatientNo="inpatientNo"
				/>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
/**
 * 特殊评估步骤组件
 * @description 代谢性尿路结石病因学评估 - 特殊评估
 */
defineOptions({
	name: 'special-step'
});

import { inject, type Ref } from 'vue';
import { ref } from 'vue';
import Special from '../../views/mua/muaSpecial.vue';

// 从父组件注入必要的数据
const id = inject<number>('id', 0);
const patientNo = inject<string>('patientNo', '');
const swlNo = inject<string>('swlNo', '');
const serialNumber = inject<string>('serialNumber', '');
const assessmentCount = inject<number>('assessmentCount', 1);
const name = inject<Ref<string>>('name', ref(''));
const outpatientNo = inject<Ref<string>>('outpatientNo', ref(''));
const inpatientNo = inject<Ref<string>>('inpatientNo', ref(''));
const formData = inject<any>('formData', {
	special: ''
});
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

.mua-special-container {
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

	.mua-special-table {
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
