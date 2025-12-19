<template>
	<el-scrollbar>
		<div class="demo-home">
			<!-- 添加时间搜索区域 -->
			<div class="search-bar">
				<el-row :gutter="2" type="flex" align="middle">
					<!-- 缩小gutter间距并启用flex布局 -->
					<el-col :span="2" style="margin-right: -8px">
						<!-- 负边距抵消间距 -->
						记录日期：
					</el-col>
					<el-col :span="4">
						<el-date-picker
							v-model="visitDate"
							type="daterange"
							startPlaceholder="开始日期"
							endPlaceholder="结束日期"
							valueFormat="YYYY-MM-DD"
							format="YYYY-MM-DD"
							style="width: 100%"
							:clearable="false"
						/>
					</el-col>
					<!-- 添加统计类型下拉框 -->
					<el-col :span="3" style="margin-left: 8px; margin-right: -8px">
						统计类型：
					</el-col>
					<el-col :span="3">
						<el-select
							v-model="statType"
							placeholder="请选择统计类型"
							style="width: 100%"
							@change="handleSearch"
						>
							<el-option label="根据年龄性别统计" value="age" />
							<el-option label="根据部位统计" value="location" />
						</el-select>
					</el-col>
					<el-col :span="2">
						<el-button type="primary" @click="handleSearch" style="margin-left: 8px"
							>查询</el-button
						>
					</el-col>
				</el-row>
			</div>

			<!-- 年龄性别统计视图 -->
			<div v-if="statType === 'age'">
				<el-row :gutter="10">
					<el-col :lg="10" :xs="24">
						<stat-age :ageData="ageData" />
					</el-col>
					<el-col :lg="8" :xs="24">
						<tab-chart-age :ageData="ageData" />
					</el-col>
					<el-col :lg="6" :xs="24">
						<tab-chart-sex :ageData="ageData" />
					</el-col>
				</el-row>
			</div>

			<!-- 部位统计视图 -->
			<div v-else-if="statType === 'location'">
				<el-row :gutter="10">
					<el-col :lg="24" :xs="24">
						<stat-location :locationData="locationData" />
					</el-col>
				</el-row>
			</div>
		</div>
	</el-scrollbar>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'home'
});

import TabChartSex from '../components/tab-chart-swl-treatment-sex.vue';
import TabChartAge from '../components/tab-chart-swl-treatment-age.vue';
import StatAge from '../components/stat-swl-treatment-age.vue';
import StatLocation from '../components/stat-swl-treatment-location.vue';
import { onMounted, ref } from 'vue';
import { service } from '/@/cool';
import dayjs from 'dayjs';

// 添加统计类型选择，默认为年龄性别统计
const statType = ref<'age' | 'location'>('age');

interface ItemDataAge {
	age: string;
	total: number;
	nan: number;
	nv: number;
}

const ageData = ref<ItemDataAge[]>([]);
const locationData = ref<any[]>([]);
const visitDate = ref<string[]>([
	dayjs().startOf('month').format('YYYY-MM-DD'),
	dayjs().format('YYYY-MM-DD')
]);

/**
 * 获取权重统计数据
 */
async function fetchStatData() {
	try {
		if (statType.value === 'age') {
			const res = await service.stat.info.getTreatmentAgeStat({
				startDate: visitDate.value[0],
				endDate: visitDate.value[1]
			});
			ageData.value = res;
		} else if (statType.value === 'location') {
			const res = await service.stat.info.getTreatmentLocationStat({
				startDate: visitDate.value[0],
				endDate: visitDate.value[1]
			});
			locationData.value = res;
		}
	} catch (error) {
		console.error('获取权重统计数据失败:', error);
	}
}

/**
 * 处理查询按钮点击事件
 */
function handleSearch() {
	fetchStatData();
}

onMounted(() => {
	// 初始化时加载数据
	fetchStatData();
});
</script>

<style lang="scss">
/* 可选的自定义样式 */
.label-text {
	line-height: 40px; /* 保持与输入框对齐 */
}
.separator {
	padding: 0 5px;
	color: #606266;
}

.demo-home {
	overflow-x: hidden;

	.search-bar {
		margin-bottom: 20px;
		padding: 15px;
		background-color: var(--el-bg-color);
		border-radius: 10px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
	}

	.card {
		border-radius: 10px;
		margin-bottom: 10px;
		border: 1px solid var(--el-border-color-extra-light);
		background-color: var(--el-bg-color);
		color: var(--el-text-color-primary);
		user-select: none;

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 20px;
			min-height: 50px;

			.label {
				font-size: 15px;
			}

			.icon {
				font-size: 30px;
				background-color: var(--el-fill-color-light);
				padding: 5px;
				border-radius: 6px;
			}
		}

		&__container {
			padding: 0 20px;
			min-height: 50px;

			.num {
				font-size: 32px;
			}
		}

		&__footer {
			display: flex;
			align-items: center;
			height: 50px;
			margin: 0 5px;
			padding: 0 15px;
			box-sizing: border-box;
			font-size: 12px;

			.label {
				margin-right: 10px;
			}
		}
	}
}
</style>
