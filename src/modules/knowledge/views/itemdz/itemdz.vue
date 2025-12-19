<template>
	<div class="diagnostic-layout">
		<!-- 左侧双表格区域 -->
		<div class="left-panel">
			<!-- 上方主表格区域 -->
			<div class="top-table">
				<cl-crud ref="Crud">
					<!-- 表格区域 -->
					<cl-row>
						<cl-table ref="Table" :data="tableData" @row-click="handleRowClick" />
					</cl-row>
				</cl-crud>
			</div>

			<!-- 下方表格 -->
			<div class="bottom-table">
				<item-cs-table ref="itemCsTableRef" />
			</div>
		</div>

		<!-- 右侧单表格区域 -->
		<div class="right-panel">
			<item-mx-table
				ref="itemMxTableRef"
				:group-code="shouldLoadChildTables ? selectedGroupCode : ''"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useUpsert, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ref, nextTick, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import ItemCsTable from '../../components/item-cs-table.vue';
import ItemMxTable from '../../components/item-mx-table.vue';

const { service } = useCool();

// 当前选中的组合编码
const selectedGroupCode = ref<string>('');

// 组件引用
const itemCsTableRef = ref();
const itemMxTableRef = ref();

// 左侧主表格数据
const tableData = ref<any[]>([]);

// 控制子表格是否加载数据的标志
const shouldLoadChildTables = ref(false);

// 左侧主表格配置
const Table = useTable({
	autoHeight: false, // 在嵌套布局中设置为false
	height: '100%', // 设置表格高度为100%
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' }, // 减小内边距也有助于控制行高
		height: '100%' // 确保表格占满容器
	},
	columns: [
		{
			label: '组合编码',
			prop: 'groupCode',
			minWidth: 80
		},
		{
			label: '组合名称',
			prop: 'groupName',
			showOverflowTooltip: true,
			minWidth: 150
		}
	]
});

/**
 * 页面初始化，加载上方表格数据和下方表格数据
 */
onMounted(async () => {
	try {
		////console.log('页面初始化，加载组合列表数据');
		const data = await service.knowledge.items.findGroup({});
		//console.log('组合列表数据:', data);
		tableData.value = data;

		// 左侧下方表格会通过cl-crud自动加载数据
		//console.log('左侧下方表格会自动加载数据');
	} catch (error) {
		console.error('加载初始数据失败:', error);
		ElMessage.error('加载数据失败');
	}
});

/**
 * 处理左侧上方表格行点击事件
 * @param row 点击的行数据
 */
async function handleRowClick(row: any) {
	try {
		//console.log('左侧上方表格行点击，组合编码:', row.groupCode);

		// 如果点击的是同一行，不需要重新加载
		if (selectedGroupCode.value === row.groupCode) {
			//console.log('点击的是同一行，跳过加载');
			return;
		}

		// 设置选中的组合编码
		selectedGroupCode.value = row.groupCode;

		// 启用右侧表格数据加载
		shouldLoadChildTables.value = true;

		//console.log('已设置组合编码，开始加载右侧表格数据...');

		// 使用 nextTick 确保 props 更新后再触发子组件重新渲染
		await nextTick();

		// 只加载右侧表格数据
		if (itemMxTableRef.value && itemMxTableRef.value.loadData) {
			//console.log('加载右侧表格数据');
			await itemMxTableRef.value.loadData(row.groupCode);
		}

		ElMessage.success('右侧表格数据加载完成');
	} catch (error) {
		console.error('加载右侧表格数据失败:', error);
		ElMessage.error('加载数据失败');
	}
}
</script>

<style lang="scss" scoped>
.diagnostic-layout {
	display: flex;
	height: 100%;
	gap: 16px;

	.left-panel {
		width: 40%;
		display: flex;
		flex-direction: column;
		gap: 16px;

		.top-table,
		.bottom-table {
			flex: 1;
			background: var(--el-bg-color);
			border-radius: 8px;
			padding: 16px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: column;
			min-height: 0; // 允许flex子项缩小
		}

		.top-table {
			flex: 1; // 上下表格各占50%空间

			// 确保cl-crud占满空间
			:deep(.cl-crud) {
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			// 确保表格区域占满剩余空间
			:deep(.cl-row:nth-child(2)) {
				flex: 1;
				display: flex;
				flex-direction: column;
				min-height: 0;
			}

			// 确保cl-table占满空间
			:deep(.cl-table) {
				height: 100%;
				flex: 1;
			}
		}

		.bottom-table {
			flex: 1;

			// 同样为下方表格配置高度
			:deep(.cl-crud) {
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			:deep(.cl-row:nth-child(2)) {
				flex: 1;
				display: flex;
				flex-direction: column;
				min-height: 0;
			}

			:deep(.cl-table) {
				height: 100%;
				flex: 1;
			}
		}
	}

	.right-panel {
		width: 60%;
		min-width: 0;
		background: var(--el-bg-color);
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;

		// 为右侧表格配置高度
		:deep(.cl-crud) {
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		:deep(.cl-row:nth-child(2)) {
			flex: 1;
			display: flex;
			flex-direction: column;
			min-height: 0;
		}

		:deep(.cl-table) {
			height: 100%;
			flex: 1;
		}
	}
}

// 响应式设计
@media (max-width: 1200px) {
	.diagnostic-layout {
		flex-direction: column;

		.left-panel {
			width: 100%;
			flex-direction: row;

			.top-table,
			.bottom-table {
				flex: 1;
			}

			.top-table {
				flex: 1; // 在小屏幕下平分空间
			}
		}

		.right-panel {
			width: 100%;
			min-height: 300px;
		}
	}
}

@media (max-width: 768px) {
	.diagnostic-layout {
		.left-panel {
			flex-direction: column;
		}
	}
}
</style>
