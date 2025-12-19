<template>
	<div class="tech-panel-inner">
		<el-form :model="formData.medicalHistory" label-width="120px">
			<el-tabs v-model="activeMedicalHistoryTab" class="tech-tabs">
				<!-- 既往病史 -->
				<el-tab-pane label="既往病史" name="pastHistory">
					<div class="past-medical-container">
						<pastmedical
							class="past-medical-table"
							v-model="formData.medicalHistory.pastHistory"
							:id="id"
							:swlNo="swlNo"
							:serialNumber="serialNumber"
						/>
					</div>
				</el-tab-pane>

				<!-- 家族史 -->
				<el-tab-pane label="家族史" name="familyHistory" lazy>
					<div class="family-container">
						<family
							ref="familyRef"
							class="family-table"
							v-model="formData.medicalHistory.familyHistory"
							:id="id"
							:swlNo="swlNo"
							:serialNumber="serialNumber"
						/>
					</div>
				</el-tab-pane>

				<!-- 既往结石病史 -->
				<el-tab-pane label="既往结石病史" name="stoneHistory" lazy>
					<div class="past-stone-container">
						<paststone
							class="past-stone-table"
							v-model="formData.medicalHistory.stoneHistory"
							:id="id"
							:swlNo="swlNo"
							:serialNumber="serialNumber"
						/>
					</div>
				</el-tab-pane>

				<!-- 个人史 -->
				<el-tab-pane label="个人史" name="personalHistory" lazy>
					<div class="personal-container">
						<personal
							class="personal-table"
							v-model="formData.medicalHistory.personalHistory"
							:id="id"
							:swlNo="swlNo"
							:serialNumber="serialNumber"
						/>
					</div>
				</el-tab-pane>

				<div v-if="Number(gender) == 2">
					<!-- 月经婚姻生育史 -->
					<el-tab-pane label="月经婚姻生育史" name="menstrualHistory" lazy>
						<div class="menstrual-container">
							<menstrual
								class="menstrual-table"
								v-model="formData.medicalHistory.menstrualHistory"
								:id="Number(id)"
								:swlNo="swlNo"
								:serialNumber="serialNumber"
							/>
						</div>
					</el-tab-pane>
				</div>

				<!-- 现病史 -->
				<el-tab-pane label="现病史" name="current" lazy>
					<div class="current-container">
						<current
							class="current-table"
							v-model="formData.medicalHistory.current"
							:id="Number(id)"
							:swlNo="swlNo"
							:serialNumber="serialNumber"
						/>
					</div>
				</el-tab-pane>

				<!-- 体征 -->
				<el-tab-pane label="体征" name="physicalSigns" lazy>
					<div class="vital-container">
						<vital
							class="vital-table"
							v-model="formData.medicalHistory.vital"
							:id="Number(id)"
							:swlNo="swlNo"
							:serialNumber="serialNumber"
						/>
					</div>
				</el-tab-pane>

				<!-- 患者固定信息，仅展示 -->
			</el-tabs>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { inject, ref, Ref, onMounted } from 'vue';
import Pastmedical from '../../views/history/pastmedical.vue';
import Family from '../../views/history/family.vue';
import Paststone from '../../views/history/paststone.vue';
import Menstrual from '../../views/history/menstrual.vue';
import Personal from '../../views/history/personal.vue';
import Current from '../../views/history/current.vue';
import Vital from '../../views/history/vital.vue';
import { number } from 'echarts';

// 从父组件注入必要的数据
const id = inject<string>('id', '');
const swlNo = inject<string>('swlNo', '');
const serialNumber = inject<string>('serialNumber', '');
const gender = inject<string>('gender', '');
//console.log('gender性别:' + gender);
const formData = inject<any>('formData', {
	medicalHistory: {
		pastHistory: '',
		familyHistory: '',
		stoneHistory: '',
		personalHistory: '',
		menstrualHistory: '',
		current: '',
		vital: ''
	}
});
const activeMedicalHistoryTab = inject<Ref<string>>('activeMedicalHistoryTab', ref('pastHistory'));
</script>

<style lang="scss" scoped>
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
// 既往史
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
		height: auto;
		overflow: visible;
	}
}

// 家族史
.family-container {
	margin-top: 5px;
	padding-top: 5px;

	h3 {
		margin-bottom: -10px;
		font-size: 16px;
		color: #0a58ca;
	}

	.family-table {
		width: 100%;
		min-height: 300px;
		height: auto;
		overflow: visible;
	}
}

// 既往结石病史
.past-stone-container {
	margin-top: 5px;
	padding-top: 5px;

	h3 {
		margin-bottom: -10px;
		font-size: 16px;
		color: #0a58ca;
	}

	.past-stone-table {
		width: 100%;
		min-height: 300px;
		height: auto;
		overflow: visible;
	}
}

// 个人史
.personal-container {
	margin-top: 5px;
	padding-top: 5px;

	h3 {
		margin-bottom: -10px;
		font-size: 16px;
		color: #0a58ca;
	}

	.personal-table {
		width: 100%;
		min-height: 300px;
		height: auto;
		overflow: visible;
	}
}

// 月经婚姻生育史
.menstrual-container {
	margin-top: 5px;
	padding-top: 5px;

	h3 {
		margin-bottom: -10px;
		font-size: 16px;
		color: #0a58ca;
	}

	.menstrual-table {
		width: 100%;
		min-height: 300px;
		height: auto;
		overflow: visible;
	}
}

// 现病史
.current-container {
	margin-top: 5px;
	padding-top: 5px;

	h3 {
		margin-bottom: -10px;
		font-size: 16px;
		color: #0a58ca;
	}

	.current-table {
		width: 100%;
		min-height: 300px;
		height: auto;
		overflow: visible;
	}
}

// 体征
.vital-container {
	margin-top: 5px;
	padding-top: 5px;

	h3 {
		margin-bottom: -10px;
		font-size: 16px;
		color: #0a58ca;
	}

	.vital-table {
		width: 100%;
		min-height: 300px;
		height: auto;
		overflow: visible;
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
