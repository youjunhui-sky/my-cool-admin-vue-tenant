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
	ageData: {
		type: Array as PropType<ItemData[]>,
		required: true
	}
});

const chartOption = reactive({
	title: {
		text: 'SWL治疗记录--性别分布',
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
	age: string;
	nv: number;
	nan: number;
}
// 监听 props.ageData 变化，确保数据更新时图表也更新
watch(
	() => props.ageData,
	newVal => {
		refresh();
	},
	{ immediate: true, deep: true }
);

function refresh() {
	if (props.ageData != null && props.ageData.length > 0) {
		let nan = 0;
		let nv = 0;
		for (const item of props.ageData) {
			if (item.age === '合计') {
				nan = item.nan;
				nv = item.nv;
				break;
			}
		}
		chartOption.series[0].data = [
			{ name: '男', value: nan },
			{ name: '女', value: nv }
		];
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
		height: 350px;
		width: 100%;
	}
}
</style>
