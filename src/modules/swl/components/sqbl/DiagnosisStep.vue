<template>
	<div class="tech-panel-inner">
		<el-form label-width="120px">
			<div class="past-medical-container">
				<diagnos
					class="past-medical-table"
					v-model="formData.diagnosis.results"
					:swlNo="swlNo"
					:serialNumber="serialNumber"
				/>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import Diagnos from '../../views/diagnos/diagnos.vue';

// 从父组件注入必要的数据
const swlNo = inject<string>('swlNo', '');
const serialNumber = inject<string>('serialNumber', '');
const formData = inject<any>('formData', {
	diagnosis: {
		results: ''
	}
});
</script>

<style lang="scss" scoped>
.tech-panel-inner {
	animation: fadeIn 0.3s ease;
}

.past-medical-container {
	margin-top: 5px;
	padding-top: 5px;

	h3 {
		margin-bottom: -10px;
		font-size: 16px;
		color: #0a58ca;
	}

	.past-medical-table {
		width: 100%;
		min-height: 300px;
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
