<template>
	<div class="card">
		<v-chart :option="chartOption" autoresize />
	</div>
</template>

<script lang="ts" setup>
import { range } from 'lodash-es';
import { computed, onMounted, PropType, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useDark } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useTheme } from '/#/theme';
import { service } from '/@/cool';

const { t } = useI18n();
const isDark = useDark();
const theme = useTheme();

/**
 * 组件属性定义
 */
interface ItemData {
	doctor: string;
	zsr: number;
}

// Add this interface after the existing ItemData interface
interface ChartSeriesItem {
	name: string;
	value: number;
}

const props = defineProps({
	workData: {
		type: Array as PropType<ItemData[]>,
		required: true
	}
});

const chartOption = reactive({
	title: {
		text: '收入图表'
	},
	grid: {
		left: '5%',
		right: '5%',
		top: '10%',
		containLabel: true
	},
	xAxis: {
		type: 'category',
		axisLabel: {
			interval: 0,
			rotate: 0
		},
		data: [] as string[]
	},
	yAxis: {
		type: 'value'
	},
	series: [
		{
			data: [] as number[],
			type: 'bar'
		}
	]
});

/**
 * 组件属性定义
 */
interface ItemData {
	name: string;
	type: string;
	stack: string;
	data: number[];
}
// 监听 props.workData 变化，确保数据更新时表格也更新
watch(
	() => props.workData,
	newVal => {
		refresh();
	},
	{ immediate: true, deep: true }
);

function refresh() {
	chartOption.xAxis.data = props.workData.map(e => e.doctor);
	chartOption.series[0].data = props.workData.map(e => e.zsr);
}

function onChange() {
	refresh();
}

onMounted(() => {
	//refresh();
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
		height: 350px;
		width: 100%;
	}
}
</style>
