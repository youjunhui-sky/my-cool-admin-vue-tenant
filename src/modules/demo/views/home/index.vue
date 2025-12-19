<template>
	<el-scrollbar>
		<div class="demo-home">
			<el-row :gutter="10">
				<el-col :lg="24" :xs="24">
					<tab-patient />
				</el-col>
			</el-row>
		</div>
	</el-scrollbar>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'home'
});

import TabPatient from './components/tab-patient.vue';
</script>

<style lang="scss">
.demo-home {
	overflow-x: hidden;

	.card {
		border-radius: 10px;
		margin-bottom: 10px;
		border: 1px solid var(--el-border-color-extra-light);
		background-color: var(--el-bg-color);
		color: var(--el-text-color-primary);
		user-select: none;

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 20px;
			min-height: 50px;

			.label {
				font-size: 15px;
			}

			.icon {
				font-size: 30px;
				background-color: var(--el-fill-color-light);
				padding: 5px;
				border-radius: 6px;
			}
		}

		&__container {
			padding: 0 20px;
			min-height: 50px;

			.num {
				font-size: 32px;
			}
		}

		&__footer {
			display: flex;
			align-items: center;
			height: 50px;
			margin: 0 5px;
			padding: 0 15px;
			box-sizing: border-box;
			font-size: 12px;

			.label {
				margin-right: 10px;
			}
		}
	}
}
</style>
