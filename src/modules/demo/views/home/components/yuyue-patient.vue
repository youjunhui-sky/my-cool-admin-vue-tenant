<template>
	<div class="count-patient">
		<div class="card">
			<div class="card__container">
				<!-- 右上角“新”标签：无就诊流水号时显示 -->
				<div v-if="!hasSerialNumber" class="appointment-type-badge">新</div>

				<!-- 操作按钮 - 右侧中间 -->
				<el-button
					v-if="shouldShowButton"
					class="action-button"
					type="primary"
					size="small"
					@click="handleButtonClick"
				>
					{{ getButtonText() }}
				</el-button>

				<div class="info-item">
					<span class="info-label">{{ $t('患者档案号') }}：</span>
					<span class="info-value">{{ patientNo || '-' }}</span>
				</div>

				<div class="info-item">
					<span class="info-label">{{ $t('患者预约号') }}：</span>
					<span class="info-value">{{ appointmentNo || '-' }}</span>
				</div>

				<div class="info-item">
					<span class="info-label">{{ $t('预约医生') }}：</span>
					<span class="info-value">{{ doctorName || '-' }}</span>
				</div>

				<div class="info-item">
					<span class="info-label">{{ $t('患者姓名') }}：</span>
					<span class="info-value">{{ patientName || '-' }}</span>
				</div>

				<div class="info-item">
					<span class="info-label">{{ $t('预约时间') }}：</span>
					<span class="info-value">{{ appointmentTime || '-' }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
/**
 * 患者预约信息卡片组件
 * @description 显示患者预约的详细信息，包括档案号、预约号、医生、姓名、时间、类型等
 */
import { computed } from 'vue';
import { useCool } from '/@/cool';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const { service } = useCool();

//	添加跳转路由
const router = useRouter();

interface Props {
	/** 患者档案号 */
	patientNo?: string;
	/** 患者预约号 */
	appointmentNo?: string;
	/** 预约医生 */
	doctorName?: string;
	/** 患者姓名 */
	patientName?: string;
	/** 预约时间 */
	appointmentTime?: string;
	/** 预约类型 */
	appointmentType?: string | number;
	/** 就诊流水号 */
	serialNumber?: string;
	/** 评估号 */
	swlNo?: string;
}

const props = withDefaults(defineProps<Props>(), {
	patientNo: '',
	appointmentNo: '',
	doctorName: '',
	patientName: '',
	appointmentTime: '',
	appointmentType: '',
	serialNumber: '',
	swlNo: ''
});

/**
 * 获取预约类型数值
 * @returns 预约类型数值
 */
const getAppointmentTypeNum = (): number | null => {
	if (
		props.appointmentType === undefined ||
		props.appointmentType === null ||
		props.appointmentType === ''
	) {
		return null;
	}
	return typeof props.appointmentType === 'string'
		? parseInt(props.appointmentType, 10)
		: props.appointmentType;
};

/**
 * 是否显示按钮
 */
const shouldShowButton = computed(() => {
	const typeNum = getAppointmentTypeNum();
	// SWL诊疗按钮（类型1）始终显示
	if (typeNum === 1) {
		return true;
	}
	// 评估按钮（类型2）只有在有就诊流水号时才显示
	if (typeNum === 2) {
		return true;
	}
	return false;
});

/**
 * 是否有就诊流水号
 */
const hasSerialNumber = computed(() => {
	return !!props.serialNumber && props.serialNumber.trim() !== '';
});

/**
 * 获取按钮文本
 * @returns 按钮文本
 */
const getButtonText = (): string => {
	const typeNum = getAppointmentTypeNum();
	if (typeNum === 1) {
		return 'SWL诊疗';
	} else if (typeNum === 2) {
		return '评估';
	}
	return '';
};

/**
 * 按钮点击事件处理
 */
const handleButtonClick = async () => {
	const typeNum = getAppointmentTypeNum();
	if (typeNum === 1) {
		// SWL诊疗按钮点击事件
		console.log('SWL诊疗', props);
	} else if (typeNum === 2) {
		// 评估按钮点击事件
		// 判断 serialNumber 是否有值
		if (
			props.serialNumber == null ||
			props.serialNumber == '' ||
			props.serialNumber == undefined
		) {
			// 没有 serialNumber，跳转到 etiology/info.vue 的新增弹框，带上患者信息
			router.push({
				path: '/etiology/info',
				query: {
					action: 'add',
					patientNo: props.patientNo || '',
					swlNo: props.swlNo || '',
					patientName: props.patientName || '',
					appointmentNo: props.appointmentNo || '',
					doctorName: props.doctorName || '',
					appointmentTime: props.appointmentTime || ''
				}
			});
			return;
		}
		// 有 serialNumber，查询评估信息并跳转
		console.log('评估', JSON.stringify(props));
		//通过patientNo、swlNo、serialNumber查询评估信息
		const res = await service.etiology.info.findBySwlNo({
			patientNo: props.patientNo,
			swlNo: props.swlNo,
			serialNumber: props.serialNumber
		});
		console.log('评估信息', JSON.stringify(res));
		if (res && res.id) {
			// 利用路由跳转
			router.push({
				path: `etiology/mua/info`,
				query: {
					id: res.id,
					swlNo: res.swlNo,
					serialNumber: res.serialNumber,
					patientNo: res.patientNo,
					assessmentCount: res.assessmentCount,
					name: res.name,
					outpatientNo: res.outpatientNo || '',
					inpatientNo: res.inpatientNo || ''
				}
			});
		}
	}
};

/**
 * 获取预约类型文本
 * @param type 预约类型值
 * @returns 预约类型文本
 */
const getAppointmentTypeText = (type: string | number | undefined): string => {
	if (type === undefined || type === null || type === '') {
		return '-';
	}

	const typeNum = typeof type === 'string' ? parseInt(type, 10) : type;

	switch (typeNum) {
		case 1:
			return 'SWL';
		case 2:
			return '代谢评估';
		default:
			return String(type);
	}
};
</script>

<style lang="scss" scoped>
.count-patient {
	.card {
		&__container {
			position: relative;
			padding: 15px 20px;
			display: flex;
			flex-direction: column;
			gap: 12px;

			.action-button {
				position: absolute;
				right: 20px;
				top: 50%;
				transform: translateY(-50%);
				z-index: 1;
			}

			.appointment-type-badge {
				position: absolute;
				top: 15px;
				right: 20px;
				padding: 4px 12px;
				border: 1px solid var(--el-color-primary);
				border-radius: 12px;
				background-color: var(--el-color-primary);
				color: #fff;
				font-size: 12px;
				font-weight: 500;
				white-space: nowrap;
				z-index: 1;
			}

			.info-item {
				display: flex;
				align-items: center;
				font-size: 14px;
				line-height: 1.5;

				.info-label {
					color: var(--el-text-color-secondary);
					min-width: 90px;
					font-weight: 500;
				}

				.info-value {
					color: var(--el-text-color-primary);
					flex: 1;
					word-break: break-all;
				}
			}
		}
	}
}
</style>
