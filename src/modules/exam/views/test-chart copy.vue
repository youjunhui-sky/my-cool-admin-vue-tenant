<template>
	<div class="test-chart-page">
		<div class="chart-layout">
			<div class="chart-container">
				<test-indicators-chart :test-data="chartData" height="700px" />
			</div>
			<div class="chart-info">
				<h3>图表说明</h3>
				<ul>
					<li><span class="blue-dot">●</span> 蓝色线条：参考基线</li>
					<li><span class="red-dot">●</span> 红色数据点：实际检测值</li>
					<li>顶部数字：各指标的最大刻度值</li>
					<li>底部数字：各指标的最小刻度值</li>
					<li>鼠标悬浮可查看详细信息</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="TestChart">
import { ref } from 'vue';
import TestIndicatorsChart from '../components/test-indicators-chart.vue';

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

/**
 * 图表数据
 */
const chartData = ref<TestIndicatorData[]>([
	{
		name: 'PTH',
		actualValue: 40,
		referenceValue: 65,
		referenceRange: [15, 65],
		minScale: 0,
		maxScale: 600,
		unit: 'pg/mL'
	},
	{
		name: '血尿酸',
		actualValue: 300,
		referenceValue: 428,
		referenceRange: [150, 420],
		minScale: 200,
		maxScale: 800,
		unit: 'μmol/L'
	},
	{
		name: '血钙',
		actualValue: 1.2,
		referenceValue: 2.7,
		referenceRange: [2.25, 2.75],
		minScale: 0,
		maxScale: 5,
		unit: 'mmol/L'
	},
	{
		name: '血磷',
		actualValue: 0.6,
		referenceValue: 0.83,
		referenceRange: [0.81, 1.45],
		minScale: 0,
		maxScale: 2,
		unit: 'mmol/L',
		reverse: true
	},
	{
		name: '血钾',
		actualValue: 3,
		referenceValue: 3.5,
		referenceRange: [3.5, 5.3],
		minScale: 2,
		maxScale: 6,
		unit: 'mmol/L',
		reverse: true
	},
	{
		name: 'CO2CP',
		actualValue: 35,
		referenceValue: 20,
		referenceRange: [22, 29],
		minScale: 15,
		maxScale: 40,
		unit: 'mmol/L',
		reverse: true
	},
	{
		name: '尿钙',
		actualValue: 2.6,
		referenceValue: 5,
		referenceRange: [2.5, 7.5],
		minScale: 0,
		maxScale: 25,
		unit: 'mmol/24h'
	},
	{
		name: '草酸',
		actualValue: 60,
		referenceValue: 40,
		referenceRange: [10, 40],
		minScale: 0,
		maxScale: 200,
		unit: 'μmol/24h'
	},
	{
		name: '尿镁',
		actualValue: 2.2,
		referenceValue: 3,
		referenceRange: [3, 5],
		minScale: 0,
		maxScale: 5,
		unit: 'mmol/24h',
		reverse: true
	},
	{
		name: '尿尿酸',
		actualValue: 3600,
		referenceValue: 4000,
		referenceRange: [1500, 4500],
		minScale: 500,
		maxScale: 8000,
		unit: 'μmol/24h'
	},
	{
		name: '尿钾',
		actualValue: 1000,
		referenceValue: 900,
		referenceRange: [25, 125],
		minScale: 100,
		maxScale: 1500,
		unit: 'mmol/24h'
	},
	{
		name: '尿磷',
		actualValue: 56,
		referenceValue: 48,
		referenceRange: [13, 42],
		minScale: 10,
		maxScale: 70,
		unit: 'mmol/24h'
	},
	{
		name: '构橼酸',
		actualValue: 220,
		referenceValue: 320,
		referenceRange: [320, 1000],
		minScale: 0,
		maxScale: 1000,
		unit: 'mg/24h',
		reverse: true
	},
	{
		name: '尿量',
		actualValue: 1200,
		referenceValue: 1500,
		referenceRange: [800, 2500],
		minScale: 0,
		maxScale: 5000,
		unit: 'mL/24h',
		reverse: true
	},
	{
		name: 'PH',
		actualValue: 4.6,
		referenceValue: 5.5,
		referenceRange: [5.5, 7.5],
		minScale: 4,
		maxScale: 9,
		unit: '',
		reverse: true
	}
]);
</script>

<style lang="scss" scoped>
.test-chart-page {
	padding: 20px;

	.chart-layout {
		display: flex;
		gap: 20px;
		height: 700px;
	}

	.chart-container {
		flex: 3;
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.chart-info {
		flex: 1;
		padding: 20px;
		background: #f8f9fa;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

		h3 {
			margin-bottom: 20px;
			color: #333;
			font-size: 16px;
		}

		ul {
			list-style: none;
			padding: 0;

			li {
				margin-bottom: 16px;
				display: flex;
				align-items: center;
				font-size: 14px;
				line-height: 1.6;

				.blue-dot {
					color: #4a90e2;
					margin-right: 8px;
				}

				.red-dot {
					color: #e74c3c;
					margin-right: 8px;
				}
			}
		}
	}
}
</style>
