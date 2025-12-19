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
	/** 实际值 - 支持单个值或多个值数组 */
	actualValue: number[];
	/** 参考值 - 支持单个值或多个值数组 */
	referenceValue: number[];
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

	// 计算垂直位置（从上到下，0-10的范围内）- 只取第一个参考值用于连线
	const getVerticalPosition = indicators.map((item, index) => {
		const valueRange = (item.maxScale - item.minScale) / 10;
		const firstReferenceValue = Array.isArray(item.referenceValue)
			? item.referenceValue[0]
			: item.referenceValue;
		let valueRatio = (firstReferenceValue - item.minScale) / valueRange;

		if (item.reverse) {
			valueRatio = 10 - valueRatio;
		}

		return [index, valueRatio];
	});

	// 蓝色连线数据（参考线）
	const blueLineData = getVerticalPosition.map((point, index) => {
		const indicator = indicators[index];
		// 在CO2CP之后插入断点，断开与尿钙的连线
		if (indicator.name === 'CO2CP') {
			// CO2CP点正常显示
			return point;
		} else if (indicator.name === '尿钙') {
			// 在尿钙之前插入null值断开连线，然后再显示尿钙点
			return point;
		}
		return point;
	});

	// 为了断开CO2CP和尿钙之间的连线，需要重新构建数据
	const processedBlueLineData: any[] = [];
	getVerticalPosition.forEach((point, index) => {
		const indicator = indicators[index];
		processedBlueLineData.push(point);

		// 在CO2CP之后插入断点
		if (indicator.name === 'CO2CP') {
			processedBlueLineData.push([index + 0.5, null]); // 插入断点
		}
	});

	const finalBlueLineData = processedBlueLineData;

	// 生成所有蓝色参考点（包括多个参考值）
	const allBluePoints = indicators.flatMap((item, index) => {
		const valueRange = (item.maxScale - item.minScale) / 10;
		const referenceValues = Array.isArray(item.referenceValue)
			? item.referenceValue
			: [item.referenceValue];

		return referenceValues.map((refValue, refIndex) => {
			let valueRatio = (refValue - item.minScale) / valueRange;

			if (item.reverse) {
				valueRatio = 10 - valueRatio;
			}

			// 蓝色点显示在垂直虚线上
			// 垂直虚线在每个指标的中心位置，对应x坐标为index
			const xPosition = index;

			return [xPosition, valueRatio, refValue, item]; // x坐标对应垂直分割线位置
		});
	});

	console.log(finalBlueLineData, 'blueLineData');

	// 红色数据点 - 按照比例显示每个指标的实际值
	const redPoints = indicators.flatMap((item, index) => {
		const valueRange = (item.maxScale - item.minScale) / 10;

		// 处理单个值或多个值的情况
		const actualValues = Array.isArray(item.actualValue)
			? item.actualValue
			: [item.actualValue];

		return actualValues.map(actualValue => {
			let valueRatio = (actualValue - item.minScale) / valueRange;

			if (item.reverse) {
				valueRatio = 10 - valueRatio;
			}

			// 限制在图表范围内：超出最大值显示在最上方，低于最小值显示在最下方
			valueRatio = Math.max(0, Math.min(10, valueRatio));

			return [index, valueRatio, actualValue, item]; // 添加原始值和指标信息用于tooltip
		});
	});

	return {
		grid: {
			left: '10%',
			right: '10%',
			bottom: '15%',
			top: '35%',
			containLabel: false
		},
		xAxis: {
			type: 'category',
			data: categories,
			position: 'top',
			boundaryGap: true,
			axisTick: {
				show: false
			},
			axisLabel: {
				show: true,
				interval: 0,
				rotate: 0,
				fontSize: 12,
				color: '#333',
				margin: 30,
				verticalAlign: 'bottom'
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
			},
			// 添加额外的分割线配置，确保垂直线显示在正确位置
			splitArea: {
				show: false
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
			// 蓝色折线（只连接第一个参考值点）
			{
				name: '参考线',
				type: 'line',
				data: finalBlueLineData,
				lineStyle: {
					color: '#4A90E2',
					width: 2
				},
				symbol: 'none', // 隐藏线上的点，因为用散点系列显示
				itemStyle: {
					color: '#4A90E2'
				},
				showSymbol: false,
				smooth: true,
				smoothMonotone: 'x',
				label: {
					show: false // 隐藏蓝色参考线上的标签
				}
			},
			// 蓝色参考点（显示所有参考值点）
			{
				name: '参考值',
				type: 'scatter',
				data: allBluePoints,
				symbol: 'circle',
				symbolSize: 6,
				itemStyle: {
					color: '#4A90E2'
				},
				label: {
					show: false // 隐藏标签
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
						const actualValue = params.data[2]; // 从数据中获取原始值
						const indicator = params.data[3]; // 从数据中获取指标信息

						// 特殊处理尿铵显示为 <900
						if (indicator.name === '尿铵' && actualValue === 900) {
							return '<900';
						}
						return actualValue.toString();
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
			// 垂直虚线
			...indicators.map((item, index) => {
				// 计算每个类别在boundaryGap=true时的精确位置
				const categoryWidth = 80 / numIndicators;
				const left = 10 + categoryWidth * (index + 0.5);
				return {
					type: 'line',
					left: `${left}%`,
					top: '35%',
					bottom: '15%',
					shape: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: '100%'
					},
					style: {
						stroke: '#c8c8c8',
						lineWidth: 1,
						lineDash: [5, 5]
					}
				};
			}),
			// 顶部数值
			...indicators.map((item, index) => {
				// 计算每个类别在boundaryGap=true时的精确位置
				const categoryWidth = 80 / numIndicators;
				const left = 10 + categoryWidth * (index + 0.5);
				return {
					type: 'text',
					left: `${left}%`,
					top: '32%',
					style: {
						// 血磷是反向刻度，顶部显示minScale；其他指标顶部显示maxScale
						text: item.reverse ? item.minScale.toString() : item.maxScale.toString(),
						fontSize: 12,
						fill: '#4A90E2',
						textAlign: 'center'
					}
				};
			}),
			// 底部数值
			...indicators.map((item, index) => {
				// 计算每个类别在boundaryGap=true时的精确位置
				const categoryWidth = 80 / numIndicators;
				const left = 10 + categoryWidth * (index + 0.5);
				return {
					type: 'text',
					left: `${left}%`,
					bottom: '10%',
					style: {
						// 血磷是反向刻度，底部显示maxScale；其他指标底部显示minScale
						text: item.reverse ? item.maxScale.toString() : item.minScale.toString(),
						fontSize: 12,
						fill: '#333',
						textAlign: 'center'
					}
				};
			})
		],
		tooltip: {
			trigger: 'item',
			formatter: function (params: any) {
				// 从数据中获取原始值和指标信息
				if (params.seriesName === '检测值') {
					const actualValue = params.data[2];
					const indicator = params.data[3];

					return `
						<div style="padding: 10px; font-size: 14px;">
							<div style="font-weight: bold; margin-bottom: 8px; color: #333;">${indicator.name}</div>
							<div style="margin-bottom: 5px;">
								<span style="color: #E74C3C;">●</span> 
								检测值: <strong>${actualValue}${indicator.unit || ''}</strong>
							</div>
							<div style="margin-bottom: 5px;">
								参考范围: ${indicator.referenceRange[0]} - ${indicator.referenceRange[1]}${indicator.unit || ''}
							</div>
							<div style="color: #666;">
								最大刻度: ${indicator.maxScale}${indicator.unit || ''}
							</div>
						</div>
					`;
				} else if (params.seriesName === '参考值') {
					// 蓝色参考点的tooltip
					const referenceValue = params.data[2];
					const indicator = params.data[3];

					return `
						<div style="padding: 10px; font-size: 14px;">
							<div style="font-weight: bold; margin-bottom: 8px; color: #333;">${indicator.name}</div>
							<div style="margin-bottom: 5px;">
								<span style="color: #4A90E2;">●</span> 
								参考值: <strong>${referenceValue}${indicator.unit || ''}</strong>
							</div>
							<div style="margin-bottom: 5px;">
								参考范围: ${indicator.referenceRange[0]} - ${indicator.referenceRange[1]}${indicator.unit || ''}
							</div>
							<div style="color: #666;">
								最大刻度: ${indicator.maxScale}${indicator.unit || ''}
							</div>
						</div>
					`;
				} else {
					// 参考线的tooltip
					const indicator = indicators[params.dataIndex];
					const firstReferenceValue = Array.isArray(indicator.referenceValue)
						? indicator.referenceValue[0]
						: indicator.referenceValue;
					return `
						<div style="padding: 10px; font-size: 14px;">
							<div style="font-weight: bold; margin-bottom: 8px; color: #333;">${indicator.name}</div>
							<div style="margin-bottom: 5px;">
								<span style="color: #4A90E2;">●</span> 
								参考值: <strong>${firstReferenceValue}${indicator.unit || ''}</strong>
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
