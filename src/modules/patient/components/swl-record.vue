<template>
	<div class="card" @click="$emit('click', data)">
		<div class="card__header">
			<span class="larger-text">
				{{ data.treatmentTime }}(序列{{ data.sequenceNo }},{{ data.episode }}期)
			</span>
		</div>
		<div class="card__container">
			<div class="largest-text">治疗结石：{{ getStoneInfo(data) }}</div>
		</div>
		<div class="card__footer">
			<div class="label">治疗电压：{{ data.voltage }}</div>
		</div>
		<div class="card__footer">
			<div class="label">冲击次数：{{ data.shockwaveCount }}</div>
		</div>
		<div class="card__footer">
			<div class="label">治疗反应：{{ data.stoneResponse }}</div>
		</div>
		<div class="card__footer">
			<div class="label">治疗医生：{{ data.doctor }}</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

// 定义组件事件
const emit = defineEmits(['click']);

// 定义组件接收的props
defineProps({
	data: {
		type: Object,
		default: () => ({
			treatmentTime: '',
			sequenceNo: '',
			episode: '',
			voltage: '',
			shockwaveCount: '',
			stoneResponse: '',
			doctor: ''
		})
	}
});

/**
 * 获取结石信息的格式化显示
 * @param data 数据对象
 * @returns 格式化后的结石信息文本
 */
function getStoneInfo(data: any) {
	if (!data) return '-';

	// 处理第一个结石信息
	const info1 = formatSingleStoneInfo(
		data.position1,
		data.location1,
		data.stoneSizeFront1,
		data.stoneSizeBack1,
		data.stoneArea1
	);

	// 处理第二个结石信息（如果存在）
	const info2 = formatSingleStoneInfo(
		data.position2,
		data.location2,
		data.stoneSizeFront2,
		data.stoneSizeBack2,
		data.stoneArea2
	);

	// 如果两个部位都有信息，合并它们
	if (info1 && info2) {
		return `${info1} / ${info2}`;
	}

	// 返回有效的那个信息，或默认值
	return info1 || info2 || '-';
}

/**
 * 格式化单个结石信息
 */
function formatSingleStoneInfo(
	position?: string,
	location?: string,
	sizeFront?: string | number,
	sizeBack?: string | number,
	area?: string | number
) {
	if (!position && !location && !sizeFront && !sizeBack && !area) {
		return '';
	}

	// 位置信息
	const posInfo = [position, location].filter(Boolean).join('');

	// 尺寸信息
	const sizeInfo = sizeFront || sizeBack ? `${sizeFront || '?'}*${sizeBack || '?'}mm` : '';

	// 面积信息
	const areaInfo = area ? `SA:${area}` : '';

	// 组合所有部分
	return [posInfo, sizeInfo, areaInfo].filter(Boolean).join(', ');
}
</script>

<style lang="scss" scoped>
.card {
	border-radius: 10px;
	margin-bottom: 10px;
	border: 1px solid var(--el-border-color-extra-light);
	background-color: var(--el-bg-color);
	color: var(--el-text-color-primary);
	user-select: none;
	transition: all 0.3s ease;
	cursor: pointer; /* 添加指针样式表明可点击 */

	&:hover {
		transform: translateY(-3px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-color: var(--el-color-primary-light-5);
	}

	&:active {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	/* 普通大小（默认） */
	.label {
		font-size: 1rem;
	}

	/* 大一号（序列） */
	.larger-text {
		font-size: 1.2rem;
	}

	/* 大两号（治疗结石） */
	.largest-text {
		font-size: 1.3rem;
		//font-weight: bold;
	}
}
</style>
