<template>
	<div class="card">
		<div class="card__header">
			<cl-select-button v-model="tab.active" :options="tab.list" @change="onChange" />
		</div>

		<el-row v-if="tab.active === 'yuyue'" :gutter="10">
			<el-col v-for="(item, index) in appointmentData" :key="index" :lg="6" :md="12" :xs="24">
				<yuyue-patient
					:patient-no="item.patientNo"
					:appointment-no="item.appointmentNo"
					:doctor-name="item.doctor"
					:patient-name="item.patientName"
					:appointment-time="item.timeSlot"
					:appointment-type="item.visitType"
					:serial-number="item.serialNumber"
					:swl-no="item.swlNo"
				/>
			</el-col>
		</el-row>

		<el-row v-if="tab.active === 'register'" :gutter="10">
			<el-col v-for="(item, index) in registerData" :key="index" :lg="6" :md="12" :xs="24">
				<register-patient
					:visit-no="item.visitNo"
					:patient-name="item.name"
					:register-time="item.visitTime"
					:patient-type="item.visitType"
					:department="item.department"
					:doctor-name="item.doctor"
				/>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts" setup>
import { range } from 'lodash-es';
import { computed, onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { useDark } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useTheme } from '/#/theme';
import { useCool } from '/@/cool';
import YuyuePatient from './yuyue-patient.vue';
import RegisterPatient from './register-patient.vue';

const { t } = useI18n();
const isDark = useDark();
const theme = useTheme();
const { service } = useCool();

const tab = reactive({
	active: 'yuyue',

	list: [
		{
			label: t('当日预约'),
			value: 'yuyue'
		},
		{
			label: t('当日挂号'),
			value: 'register'
		}
	]
});

const appointmentData = ref<any[]>([]);
const registerData = ref<any[]>([]);

async function refresh() {
	if (tab.active === 'yuyue') {
		//根据visitType为2的获取数据
		const res = await service.appointment.info.getTodayAppointment();
		if (res && res.length > 0) {
			appointmentData.value = res;
		} else {
			//增加模拟10条数据，一个一个的不要循环
			// appointmentData.value = [
			// 	{
			// 		patientNo: '1234567890',
			// 		appointmentNo: '1234567890',
			// 		doctor: '医生',
			// 		patientName: '患者',
			// 		timeSlot: '09:00-10:00',
			// 		visitType: 2
			// 	},
			// 	{
			// 		patientNo: '1234567890',
			// 		appointmentNo: '1234567890',
			// 		doctor: '医生',
			// 		patientName: '患者',
			// 		timeSlot: '10:00-11:00',
			// 		visitType: 1
			// 	},
			// 	{
			// 		patientNo: '1234567890',
			// 		appointmentNo: '1234567890',
			// 		doctor: '医生',
			// 		patientName: '患者',
			// 		timeSlot: '11:00-12:00',
			// 		visitType: 2
			// 	},
			// 	{
			// 		patientNo: '1234567890',
			// 		appointmentNo: '1234567890',
			// 		doctor: '医生',
			// 		patientName: '患者',
			// 		timeSlot: '12:00-13:00',
			// 		visitType: 2
			// 	},
			// 	{
			// 		patientNo: '1234567890',
			// 		appointmentNo: '1234567890',
			// 		doctor: '医生',
			// 		patientName: '患者',
			// 		timeSlot: '13:00-14:00',
			// 		visitType: 1
			// 	},
			// 	{
			// 		patientNo: '1234567890',
			// 		appointmentNo: '1234567890',
			// 		doctor: '医生',
			// 		patientName: '患者',
			// 		timeSlot: '14:00-15:00',
			// 		visitType: 2
			// 	},
			// 	{
			// 		patientNo: '1234567890',
			// 		appointmentNo: '1234567890',
			// 		doctor: '医生',
			// 		patientName: '患者',
			// 		timeSlot: '15:00-16:00',
			// 		visitType: 1
			// 	},
			// 	{
			// 		patientNo: '1234567890',
			// 		appointmentNo: '1234567890',
			// 		doctor: '医生',
			// 		patientName: '患者',
			// 		timeSlot: '16:00-17:00',
			// 		visitType: 2
			// 	},
			// 	{
			// 		patientNo: '1234567890',
			// 		appointmentNo: '1234567890',
			// 		doctor: '医生',
			// 		patientName: '患者',
			// 		timeSlot: '17:00-18:00',
			// 		visitType: 2
			// 	}
			// ];
		}
	} else if (tab.active === 'register') {
		const res = await service.interface.vpatient.getTodayRegister();

		if (res && res.length > 0) {
			registerData.value = res;
		} else {
		}
	}
}

function onChange() {
	refresh();
}

onMounted(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.card {
	&__header {
		padding: 10px 20px 10px 10px !important;

		.year {
			display: flex;
			align-items: center;
			font-size: 14px;
			line-height: 1;
			color: var(--el-text-color-primary);

			&::before {
				content: '';
				display: inline-block;
				width: 6px;
				height: 6px;
				border-radius: 50%;
				background-color: var(--el-color-info);
				margin-right: 6px;
			}
		}
	}

	.echarts {
		height: 500px;
		width: 100%;
	}
}
</style>
