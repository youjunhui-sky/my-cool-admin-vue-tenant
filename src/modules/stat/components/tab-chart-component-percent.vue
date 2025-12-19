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
	per: number;
	mainTotal: number;
	mainPer: number;
}

// Add this interface after the existing ItemData interface
interface ChartSeriesItem {
	name: string;
	value: number;
}

const props = defineProps({
	componentPercentData: {
		type: Array as PropType<ItemData[]>,
		required: true
	}
});

const chartOption = reactive({
	title: {
		text: '结石成分--检出率',
		left: 'center'
	},
	tooltip: {
		trigger: 'item'
	},
	legend: {
		orient: 'vertical',
		left: 'left'
	},

	series: [
		{
			name: 'Access From',
			type: 'pie',
			radius: '50%',
			// data: [
			// 	{ value: 1048, name: 'Search Engine' },
			// 	{ value: 735, name: 'Direct' },
			// 	{ value: 580, name: 'Email' },
			// 	{ value: 484, name: 'Union Ads' },
			// 	{ value: 300, name: 'Video Ads' }
			// ],
			data: [] as ChartSeriesItem[],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
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
// 监听 props.componentPercentData 变化，确保数据更新时表格也更新
watch(
	() => props.componentPercentData,
	newVal => {
		refresh();
	},
	{ immediate: true, deep: true }
);

function refresh() {
	const data = props.componentPercentData.map(e => ({
		name: e.component,
		value: e.per
	}));

	//console.log('data====', data);
	chartOption.series[0].data = data;
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
