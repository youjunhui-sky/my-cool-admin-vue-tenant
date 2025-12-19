<template>
	<div class="tech-panel-inner">
		<el-form label-width="120px">
			<div class="past-medical-container">
				<exam
					class="past-medical-table"
					v-model="formData.imaging.results"
					:swlNo="swlNo"
					:serialNumber="serialNumber"
				/>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import Exam from '../../views/exam/exam.vue';

// 从父组件注入必要的数据
const swlNo = inject<string>('swlNo', '');
const serialNumber = inject<string>('serialNumber', '');
const formData = inject<any>('formData', {
	imaging: {
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
