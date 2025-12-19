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
	zlrc: number;
	csrc: number;
	cfrc: number;
	pgrc: number;
}

// Add this interface after the existing ItemData interface
interface ChartSeriesItem {
	name: string;
	type: string;
	stack: string;
	emphasis: {
		focus: string;
	};
	data: number[];
}

const props = defineProps({
	workData: {
		type: Array as PropType<ItemData[]>,
		required: true
	}
});

const chartOption_bak = reactive({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow'
		}
	},
	legend: {
		data: ['Forest', 'Steppe', 'Desert', 'Wetland']
	},
	toolbox: {
		show: true,
		orient: 'vertical',
		left: 'right',
		top: 'center',
		feature: {
			mark: { show: true },
			dataView: { show: true, readOnly: false },
			magicType: { show: true, type: ['line', 'bar', 'stack'] },
			restore: { show: true },
			saveAsImage: { show: true }
		}
	},
	xAxis: [
		{
			type: 'category',
			axisTick: { show: false },
			data: ['2012', '2013', '2014', '2015', '2016']
		}
	],
	yAxis: [
		{
			type: 'value'
		}
	],
	series: [
		{
			name: 'Forest',
			type: 'bar',
			label: 'Forest',
			emphasis: {
				focus: 'series'
			},
			data: [320, 332, 301, 334, 390]
		},
		{
			name: 'Steppe',
			type: 'bar',
			label: 'Steppe',
			emphasis: {
				focus: 'series'
			},
			data: [220, 182, 191, 234, 290]
		},
		{
			name: 'Desert',
			type: 'bar',
			label: 'Desert',
			emphasis: {
				focus: 'series'
			},
			data: [150, 232, 201, 154, 190]
		},
		{
			name: 'Wetland',
			type: 'bar',
			label: 'Wetland',
			emphasis: {
				focus: 'series'
			},
			data: [98, 77, 101, 99, 40]
		}
	]
});

const chartOption = reactive({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow'
		}
	},
	legend: {
		data: [] as string[]
	},
	toolbox: {
		show: true,
		orient: 'vertical',
		left: 'right',
		top: 'center',
		feature: {
			mark: { show: true },
			dataView: { show: true, readOnly: false },
			magicType: { show: true, type: ['line', 'bar', 'stack'] },
			restore: { show: true },
			saveAsImage: { show: true }
		}
	},
	xAxis: [
		{
			type: 'category',
			axisTick: { show: false },
			data: [] as string[]
		}
	],
	yAxis: [
		{
			type: 'value'
		}
	],
	series: [] as ChartSeriesItem[]
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
	chartOption.legend.data = props.workData.map(e => e.doctor);
	const rc = ['zlrc', 'csrc', 'cfrc', 'pgrc'];
	const itemData = [
		{
			component: '诊疗人次',
			title: 'zlrc'
		},
		{
			component: '超声人次',
			title: 'csrc'
		},
		{
			component: '成分人次',
			title: 'cfrc'
		},
		{
			component: '评估人次',
			title: 'pgrc'
		}
	];
	const map = new Map();
	itemData.forEach(e => {
		map.set(e.title, e.component);
	});
	chartOption.legend.data = itemData.map(e => e.component);
	chartOption.xAxis[0].data = props.workData.map(e => e.doctor);

	chartOption.series = rc.map(rcKey => ({
		name: map.get(rcKey),
		type: 'bar',
		stack: '',
		emphasis: {
			focus: 'series'
		},
		data: props.workData.map(item => Number(item[rcKey]))
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
