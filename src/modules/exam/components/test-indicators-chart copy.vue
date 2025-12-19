<template>
	<div class="test-indicators-chart">
		<div class="chart-title">检测指标分析图表</div>
		<v-chart class="chart" :option="chartOption" />
	</div>
</template>

<script setup lang="ts" name="TestIndicatorsChart">
import { computed } from 'vue';

/**
 * 检测指标图表组件属性
 */
interface Props {
	/** 检测数据 */
	testData?: TestIndicatorData[];
	/** 图表高度 */
	height?: string;
}

/**
 * 检测指标数据类型
 */
interface TestIndicatorData {
	/** 指标名称 */
	name: string;
	/** 实际值 */
	actualValue: number;
	/** 参考值 */
	referenceValue: number;
	/** 参考值范围 */
	referenceRange: [number, number];
	/** 最小刻度值 */
	minScale: number;
	/** 最大刻度值 */
	maxScale: number;
	/** 单位 */
	unit?: string;
	/** 是否反向 */
	reverse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	testData: () => [],
	height: '600px'
});

/**
 * 使用的检测数据
 */
const testIndicators = computed(() => (props.testData.length > 0 ? props.testData : []));

/**
 * 图表配置选项
 */
const chartOption = computed(() => {
	const indicators = testIndicators.value;
	const numIndicators = indicators.length;

	// 生成X轴类别数据
	const categories = indicators.map(item => item.name);

	// 计算垂直位置（从上到下，0-10的范围内）

	const getVerticalPosition = indicators.map((item, index) => {
		const valueRange = (item.maxScale - item.minScale) / 10;
		let valueRatio = (item.referenceValue - item.minScale) / valueRange;

		if (item.reverse) {
			valueRatio = 10 - valueRatio;
		}

		return [index, valueRatio];
	});

	// 蓝色连线数据（参考线）
	const blueLineData = getVerticalPosition;

	console.log(blueLineData, 'blueLineData');

	// 红色数据点 - 按照比例显示每个指标的实际值
	const redPoints = indicators.map((item, index) => {
		const valueRange = (item.maxScale - item.minScale) / 10;
		let valueRatio = (item.actualValue - item.minScale) / valueRange;

		if (item.reverse) {
			valueRatio = 10 - valueRatio;
		}

		return [index, valueRatio];
	});

	return {
		grid: {
			left: '8%',
			right: '8%',
			bottom: '25%',
			top: '20%',
			containLabel: false
		},
		xAxis: {
			type: 'category',
			data: categories,
			position: 'bottom',
			axisTick: {
				show: false
			},
			axisLabel: {
				show: true,
				interval: 0,
				rotate: 0,
				fontSize: 12,
				color: '#333',
				margin: 70,
				verticalAlign: 'top'
			},
			axisLine: {
				show: false
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#c8c8c8',
					width: 1,
					type: 'dashed'
				}
			}
		},
		yAxis: {
			type: 'value',
			min: 0,
			max: 10,
			interval: 1, // 每1个单位一条横线，10等分显示
			show: true,
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: false
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#c8c8c8',
					width: 1,
					type: 'dashed'
				}
			}
		},
		series: [
			// 蓝色折线
			{
				name: '参考线',
				type: 'line',
				data: blueLineData,
				lineStyle: {
					color: '#4A90E2',
					width: 2
				},
				symbol: 'circle',
				symbolSize: 6,
				itemStyle: {
					color: '#4A90E2'
				},
				showSymbol: true,
				smooth: true,
				smoothMonotone: 'x',
				label: {
					show: true,
					position: 'bottom',
					offset: [0, 5],
					formatter: function (params: any) {
						const indicator = indicators[params.dataIndex];
						const value = indicator.referenceValue;
						return value.toString();
					},
					textStyle: {
						color: '#4A90E2',
						fontSize: 12,
						fontWeight: 'bold'
					}
				}
			},
			// 红色数据点
			{
				name: '检测值',
				type: 'scatter',
				data: redPoints,
				symbol: 'circle',
				symbolSize: 10,
				itemStyle: {
					color: '#E74C3C'
				},
				label: {
					show: true,
					position: 'right',
					offset: [3, 0],
					formatter: function (params: any) {
						const indicator = indicators[params.dataIndex];
						const value = indicator.actualValue;
						// 特殊处理尿铵显示为 <900
						if (indicator.name === '尿铵' && value === 900) {
							return '<900';
						}
						return value.toString();
					},
					textStyle: {
						color: '#E74C3C',
						fontSize: 12,
						fontWeight: 'bold'
					}
				}
			}
		],
		// 显示每个指标的刻度值
		graphic: [
			// 顶部数值
			...indicators.map((item, index) => ({
				type: 'text',
				left: `${8 + (84 / numIndicators) * index + 84 / numIndicators / 2}%`,
				top: '12%',
				style: {
					// 血磷是反向刻度，顶部显示minScale；其他指标顶部显示maxScale
					text: item.reverse ? item.minScale.toString() : item.maxScale.toString(),
					fontSize: 12,
					fill: '#4A90E2',
					textAlign: 'center'
				}
			})),
			// 底部数值
			...indicators.map((item, index) => ({
				type: 'text',
				left: `${8 + (84 / numIndicators) * index + 84 / numIndicators / 2}%`,
				bottom: '17%',
				style: {
					// 血磷是反向刻度，底部显示maxScale；其他指标底部显示minScale
					text: item.reverse ? item.maxScale.toString() : item.minScale.toString(),
					fontSize: 12,
					fill: '#333',
					textAlign: 'center'
				}
			}))
		],
		tooltip: {
			trigger: 'item',
			formatter: function (params: any) {
				const indicator = indicators[params.dataIndex];

				return `
					<div style="padding: 10px; font-size: 14px;">
						<div style="font-weight: bold; margin-bottom: 8px; color: #333;">${indicator.name}</div>
						<div style="margin-bottom: 5px;">
							<span style="color: #E74C3C;">●</span> 
							检测值: <strong>${indicator.actualValue}${indicator.unit || ''}</strong>
						</div>
						<div style="margin-bottom: 5px;">
							参考范围: ${indicator.referenceRange[0]} - ${indicator.referenceRange[1]}${indicator.unit || ''}
						</div>
						<div style="color: #666;">
							最大刻度: ${indicator.maxScale}${indicator.unit || ''}
						</div>
					</div>
				`;
			}
		}
	};
});
</script>

<style lang="scss" scoped>
.test-indicators-chart {
	width: 100%;
	height: 100%;
	padding: 20px;
	background: #fff;

	.chart-title {
		font-size: 20px;
		font-weight: bold;
		text-align: center;
		padding: 0 0 20px 0;
		margin: 0;
		color: #333;
		border-bottom: 1px solid #eee;
		margin-bottom: 20px;
	}

	.chart {
		width: 100% !important;
		height: calc(100% - 80px) !important;
		background: #fff;
	}
}
</style>
