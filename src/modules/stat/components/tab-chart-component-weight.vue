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
	component: string;
	total: number;
	weight1: number;
	weight2: number;
	weight3: number;
	weight4: number;
	weight5: number;
	weight6: number;
	weight7: number;
}

// Add this interface after the existing ItemData interface
interface ChartSeriesItem {
	name: string;
	type: string;
	stack: string;
	data: number[];
}

const props = defineProps({
	weightData: {
		type: Array as PropType<ItemData[]>,
		required: true
	}
});

const chartOption = reactive({
	title: {
		text: '结石成分--体重'
	},
	grid: {
		left: '5%',
		right: '5%',
		top: '10%',
		containLabel: true
	},
	legend: {
		data: [] as string[],
		// 图例位置,左右边
		orient: 'horizontal',
		left: 'center',
		top: 'top'
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: [] as string[]
	},
	yAxis: {
		type: 'value',
		offset: 20,
		splitLine: {
			show: true
		},
		axisTick: {
			show: true
		},
		axisLine: {
			show: true
		}
	},
	tooltip: {
		trigger: 'axis'
	},
	series: [] as ChartSeriesItem[]
	// 	}
	// },
	// {
	// 	type: 'bar',
	// 	barWidth: 25,
	// 	xAxisIndex: 0,
	// 	barGap: '-100%',
	// 	data: [] as number[],
	// 	itemStyle: {
	// 		color: computed(() => (isDark.value ? '#f1f1f911' : '#f1f1f9'))
	// 	},
	// 	zlevel: -1
	// }
	//]
});

const series_bak = [
	{
		name: '0-20kg',
		type: 'line',
		stack: 'Total',
		data: [120, 132, 101, 134, 90, 230, 210]
	},
	{
		name: '21-40kg',
		type: 'line',
		stack: 'Total',
		data: [220, 182, 191, 234, 290, 330, 310]
	},
	{
		name: '41-60kg',
		type: 'line',
		stack: 'Total',
		data: [150, 232, 201, 154, 190, 330, 410]
	},
	{
		name: '61-80kg',
		type: 'line',
		stack: 'Total',
		data: [320, 332, 301, 334, 390, 330, 320]
	},
	{
		name: '81-100kg',
		type: 'line',
		stack: 'Total',
		data: [820, 932, 901, 934, 1290, 1330, 1320]
	},
	{
		name: '101-120kg',
		type: 'line',
		stack: 'Total',
		data: [820, 932, 901, 934, 1290, 1330, 1320]
	},
	{
		name: '121kg以上',
		type: 'line',
		stack: 'Total',
		data: [820, 932, 901, 934, 1290, 1330, 1320]
	}
];

/**
 * 组件属性定义
 */
interface ItemData {
	name: string;
	type: string;
	stack: string;
	data: number[];
}
// 监听 props.weightData 变化，确保数据更新时表格也更新
watch(
	() => props.weightData,
	newVal => {
		refresh();
	},
	{ immediate: true, deep: true }
);

function refresh() {
	const legendData = [
		'0-20kg',
		'21-40kg',
		'41-60kg',
		'61-80kg',
		'81-100kg',
		'101-120kg',
		'121kg以上'
	];
	const weights = ['weight1', 'weight2', 'weight3', 'weight4', 'weight5', 'weight6', 'weight7'];

	const itemData = [
		{
			component: '0-20kg',
			title: 'weight1'
		},
		{
			component: '21-40kg',
			title: 'weight2'
		},
		{
			component: '41-60kg',
			title: 'weight3'
		},
		{
			component: '61-80kg',
			title: 'weight4'
		},
		{
			component: '81-100kg',
			title: 'weight5'
		},
		{
			component: '101-120kg',
			title: 'weight6'
		},
		{
			component: '121kg以上',
			title: 'weight7'
		}
	];
	const map = new Map();
	itemData.forEach(e => {
		map.set(e.title, e.component);
	});
	chartOption.legend.data = itemData.map(e => e.component);
	chartOption.xAxis.data = props.weightData.map(e => e.component);

	chartOption.series = weights.map(weightKey => ({
		name: map.get(weightKey),
		type: 'line',
		stack: '',
		data: props.weightData.map(item => Number(item[weightKey]))
	})) as ChartSeriesItem[];
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
		height: 350px;
		width: 100%;
	}
}
</style>
