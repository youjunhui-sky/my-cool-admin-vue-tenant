<template>
	<div class="split-layout-container">
		<!-- Upper Table Section -->
		<div class="upper-section">
			<cl-crud ref="Crud">
				<cl-row>
					<!-- Search bar -->
					<cl-flex1>
						<cl-search-key placeholder="请输入关键字搜索" />
					</cl-flex1>

					<!-- Operation buttons -->
					<cl-flex2>
						<cl-button-group>
							<cl-button @click="onAdd">新增</cl-button>
							<cl-button @click="onRefresh">刷新</cl-button>
						</cl-button-group>
					</cl-flex2>
				</cl-row>

				<!-- Upper table -->
				<cl-table ref="Table" v-bind="table">
					<template #column-action="{ scope }">
						<cl-button-group>
							<cl-button @click="onEdit(scope.row)">编辑</cl-button>
							<cl-button @click="onDelete(scope.row)">删除</cl-button>
						</cl-button-group>
					</template>
				</cl-table>
			</cl-crud>
		</div>

		<!-- Lower Section -->
		<div class="lower-section">
			<div class="lower-content">
				<!-- Lower table -->
				<div class="table-section">
					<el-table :data="lowerTableData" border style="width: 100%">
						<el-table-column prop="date" label="日期" width="180" />
						<el-table-column prop="name" label="名称" width="180" />
						<el-table-column prop="status" label="状态" />
					</el-table>
				</div>

				<!-- Form section -->
				<div class="form-section">
					<el-form :model="formData" label-width="100px">
						<el-form-item label="名称">
							<el-input v-model="formData.name" placeholder="请输入名称" />
						</el-form-item>

						<el-form-item label="状态">
							<el-select v-model="formData.status" placeholder="请选择状态">
								<el-option label="启用" value="1" />
								<el-option label="禁用" value="0" />
							</el-select>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" @click="onSubmit">提交</el-button>
							<el-button @click="onReset">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useCrud, useTable } from '@cool-vue/crud';
import { ElMessage } from 'element-plus';

// 表格配置
const table = reactive({
	// 表格列配置
	columns: [
		{
			type: 'selection'
		},
		{
			prop: 'name',
			label: '名称'
		},
		{
			prop: 'status',
			label: '状态'
		},
		{
			label: '操作',
			type: 'action',
			width: 200
		}
	]
});

// CRUD 配置
const { service, permission } = useCrud({
	service: 'demo/split'
});

// 表格
const Table = useTable();

// 下方表格数据
const lowerTableData = ref([
	{
		date: '2024-03-20',
		name: '测试数据1',
		status: '启用'
	},
	{
		date: '2024-03-21',
		name: '测试数据2',
		status: '禁用'
	}
]);

// 表单数据
const formData = reactive({
	name: '',
	status: ''
});

// 新增
const onAdd = () => {
	ElMessage.success('点击了新增按钮');
};

// 编辑
const onEdit = (row: any) => {
	ElMessage.success(`编辑行数据：${JSON.stringify(row)}`);
};

// 删除
const onDelete = async (row: any) => {
	ElMessage.success(`删除行数据：${JSON.stringify(row)}`);
};

// 刷新
const onRefresh = () => {
	Table.value?.reload();
};

// 提交表单
const onSubmit = () => {
	ElMessage.success(`提交的表单数据：${JSON.stringify(formData)}`);
};

// 重置表单
const onReset = () => {
	formData.name = '';
	formData.status = '';
};
</script>

<style lang="scss" scoped>
.split-layout-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #f5f7fa;
	padding: 10px;
	gap: 10px;

	.upper-section {
		flex: 1;
		background-color: #fff;
		padding: 15px;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.lower-section {
		flex: 1;
		background-color: #fff;
		padding: 15px;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

		.lower-content {
			display: flex;
			gap: 20px;
			height: 100%;

			.table-section {
				flex: 2;
			}

			.form-section {
				flex: 1;
				padding: 20px;
				border-left: 1px solid #ebeef5;
			}
		}
	}
}

:deep(.el-table) {
	--el-table-border-color: var(--el-border-color-lighter);
	--el-table-border: 1px solid var(--el-table-border-color);
}
</style>
