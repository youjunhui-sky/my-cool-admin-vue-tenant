<template>
	<div class="count-patient">
		<div class="card">
			<div class="card__container">
				<!-- 评估按钮 - 右侧中间 -->
				<el-button
					class="action-button"
					type="primary"
					size="small"
					@click="handleEvaluateClick"
				>
					评估
				</el-button>

				<div class="info-item">
					<span class="info-label">{{ $t('患者就诊号') }}：</span>
					<span class="info-value">{{ visitNo || '-' }}</span>
				</div>

				<div class="info-item">
					<span class="info-label">{{ $t('患者姓名') }}：</span>
					<span class="info-value">{{ patientName || '-' }}</span>
				</div>

				<div class="info-item">
					<span class="info-label">{{ $t('挂号时间') }}：</span>
					<span class="info-value">{{ registerTime || '-' }}</span>
				</div>

				<div class="info-item">
					<span class="info-label">{{ $t('患者类型') }}：</span>
					<span class="info-value">{{ getPatientTypeText(patientType) }}</span>
				</div>

				<div class="info-item">
					<span class="info-label">{{ $t('科室') }}：</span>
					<span class="info-value">{{ department || '-' }}</span>
				</div>

				<div class="info-item">
					<span class="info-label">{{ $t('医生') }}：</span>
					<span class="info-value">{{ doctorName || '-' }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
/**
 * 患者挂号信息卡片组件
 * @description 显示患者挂号的详细信息，包括就诊号、姓名、挂号时间、患者类型、科室、医生等
 */
import { useCool } from '/@/cool';
import { useRouter } from 'vue-router';

const { service } = useCool();
const router = useRouter();

interface Props {
	/** 患者就诊号 */
	visitNo?: string;
	/** 患者姓名 */
	patientName?: string;
	/** 挂号时间 */
	registerTime?: string;
	/** 患者类型：1-门诊，2-住院 */
	patientType?: string | number;
	/** 科室 */
	department?: string;
	/** 医生 */
	doctorName?: string;
}

const props = withDefaults(defineProps<Props>(), {
	visitNo: '',
	patientName: '',
	registerTime: '',
	patientType: '',
	department: '',
	doctorName: ''
});

/**
 * 获取患者类型文本
 * @param type 患者类型值
 * @returns 患者类型文本
 */
const getPatientTypeText = (type: string | number | undefined): string => {
	if (type === undefined || type === null || type === '') {
		return '-';
	}

	const typeNum = typeof type === 'string' ? parseInt(type, 10) : type;

	switch (typeNum) {
		case 1:
			return '门诊';
		case 2:
			return '住院';
		default:
			return String(type);
	}
};

/**
 * 评估按钮点击事件处理
 */
const handleEvaluateClick = async () => {
	router.push({
		path: '/etiology/info',
		query: {
			keyword: props.visitNo || ''
		}
	});
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
