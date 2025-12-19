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
	age1: number;
	age2: number;
	age3: number;
	age4: number;
	age5: number;
	age6: number;
	age7: number;
	age8: number;
	age9: number;
}

// Add this interface after the existing ItemData interface
interface ChartSeriesItem {
	name: string;
	type: string;
	stack: string;
	data: number[];
}

const props = defineProps({
	locationData: {
		type: Array as PropType<any[]>,
		required: true
	}
});

const chartOption = reactive({
	title: {
		text: '结石成分--部位'
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

/**
 * 组件属性定义
 */
interface ItemData {
	name: string;
	type: string;
	stack: string;
	data: number[];
}
// 监听 props.ageData 变化，确保数据更新时表格也更新
watch(
	() => props.locationData,
	newVal => {
		refresh();
	},
	{ immediate: true, deep: true }
);

async function refresh() {
	chartOption.xAxis.data = props.locationData.map(e => e.component);

	const locationColumn = await service.stat.info.getComponentLocationStatColumn();
	//console.log('locationColumn', JSON.stringify(locationColumn));
	const map = new Map();
	locationColumn.forEach(e => {
		map.set(e.stoneLocation, e.stoneLocation);
	});
	if (locationColumn && Array.isArray(locationColumn)) {
		const stoneLocations = locationColumn.map(e => e.stoneLocation);
		//console.log('stoneLocations', stoneLocations);

		chartOption.legend.data = stoneLocations;

		chartOption.series = stoneLocations.map(key => ({
			name: key,
			type: 'line',
			stack: '',
			data: props.locationData.map(item => Number(item[key]))
		})) as ChartSeriesItem[];
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
