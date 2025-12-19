<template>
	<el-scrollbar>
		<cl-crud ref="Crud">
			<!-- 顶部工具栏 -->
			<cl-row>
				<cl-flex1 />
				<!-- 搜索插件 -->
				<cl-search ref="Search" :reset-btn="true" />
			</cl-row>
		</cl-crud>
		<div class="demo-home">
			<!-- 有数据时显示列表 -->
			<el-row v-if="statistics.length > 0" :gutter="10">
				<el-col v-for="(item, index) in statistics" :key="index" :lg="12" :md="12" :xs="24">
					<swl-record :data="item" @click="handleRecordClick(item)" />
				</el-col>
			</el-row>

			<!-- 无数据时显示空状态提示 -->
			<el-empty v-else description="请输入搜索条件并点击搜索按钮查询数据" :image-size="200">
			</el-empty>
		</div>
	</el-scrollbar>

	<!-- 添加对话框组件 -->
	<el-dialog v-model="dialogVisible" :title="currentRecord?.name || '详细信息'" width="70%">
		<div v-if="currentRecord" class="record-detail">
			<el-descriptions :column="2" border>
				<el-descriptions-item label="姓名">{{ currentRecord.name }}</el-descriptions-item>
				<el-descriptions-item label="碎石号">{{
					currentRecord.swlNo
				}}</el-descriptions-item>
				<el-descriptions-item label="档案号">{{
					currentRecord.patientNo
				}}</el-descriptions-item>
				<el-descriptions-item label="临床诊断">{{
					currentRecord.lczd
				}}</el-descriptions-item>
				<!-- 可根据实际数据结构添加更多字段 -->
				<el-descriptions-item
					v-for="(value, key) in currentRecord"
					:key="key"
					:label="key"
					v-if="!['name', 'swlNo', 'patientNo', 'lczd'].includes(key)"
				>
					{{ value }}
				</el-descriptions-item>
			</el-descriptions>
		</div>
	</el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useCool } from '/@/cool';
import { ElMessage } from 'element-plus';
import { useSearch } from '@cool-vue/crud';

defineOptions({
	name: 'allzl'
});

import SwlRecord from '../../components/swl-record.vue';

// 获取服务方法
const { service } = useCool();

// 统计数据
const statistics = ref<any[]>([]);

// 添加对话框相关状态
const dialogVisible = ref(false);
const currentRecord = ref<any>(null);

/**
 * 处理记录点击事件
 * @param record 被点击的记录
 */
function handleRecordClick(record: any) {
	currentRecord.value = record;
	dialogVisible.value = true;
}

/**
 * 获取统计数据
 * @param params 搜索参数
 */
async function handleSearch(params?: any) {
	try {
		// 从后台获取统计数据，传入搜索参数
		const res = await service.patient.info.getStatistics(params || {});

		// 如果有返回数据，则使用，否则使用默认数据
		if (res && Array.isArray(res) && res.length > 0) {
			statistics.value = res;
		} else {
			statistics.value = [];
			// 如果没有数据，显示提示
			ElMessage.info('未查询到相关数据');
		}
	} catch (error) {
		console.error('获取统计数据失败:', error);
		ElMessage.error('获取统计数据失败');
	}
}

// --- 搜索配置 ---
const Search = useSearch({
	items: [
		{
			prop: 'name',
			component: {
				name: 'el-input',
				props: {
					placeholder: '姓名',
					clearable: true
				}
			}
		},
		{
			prop: 'swlNo',
			component: {
				name: 'el-input',
				props: {
					placeholder: '碎石号',
					clearable: true
				}
			}
		},
		{
			prop: 'patientNo',
			component: {
				name: 'el-input',
				props: {
					placeholder: '档案号',
					clearable: true
				}
			}
		},
		{
			prop: 'lczd',
			component: {
				name: 'el-input',
				props: {
					placeholder: '临床诊断',
					clearable: true
				}
			}
		}
	],
	// 添加搜索按钮点击事件处理
	onSearch: (data, { next }) => {
		const patientNo = data.patientNo;
		const lczd = data.lczd;
		const swlNo = data.swlNo;
		const name = data.name;

		if (!patientNo && !lczd && !swlNo && !name) {
			ElMessage.info('请至少输入一个搜索条件');
			return;
		}
		// 处理搜索参数
		const params = {
			name: data.name,
			swlNo: data.swlNo,
			lczd: data.lczd,
			patientNo: data.patientNo
		};

		// 调用handleSearch方法获取数据
		handleSearch(params);

		// 如果还需要调用原来的搜索逻辑，可以取消注释下面一行
		// next(data);
	}
});

onMounted(() => {
	// 页面加载时不自动查询数据
	// handleSearch();

	// 初始化空数据状态
	statistics.value = [];
});
</script>

<style lang="scss">
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

/* 添加记录详情样式 */
.record-detail {
	padding: 15px;
}
</style>
