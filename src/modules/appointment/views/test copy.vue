<template>
	<div class="pdf-demo">
		<div class="pdf-print-wrapper">
			<user-info />
		</div>

		<el-button type="success" :loading="loading" @click="toPDF">打印</el-button>
	</div>
</template>

<script setup lang="ts">
import { usePDF } from '../../../plugins/pdf/hooks';
import UserInfo from '../components/user-info.vue';

const { loading, toPrint } = usePDF();

function toPDF() {
	toPrint({
		target: document.querySelector('.pdf-print-wrapper')
	});
}
</script>

<style lang="scss">
.pdf-print-wrapper {
	border: 1px solid red;
	border-radius: 5px;
	padding: 20px;
	margin-bottom: 10px;
}
</style>
