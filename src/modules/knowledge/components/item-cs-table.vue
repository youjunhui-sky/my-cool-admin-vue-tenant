<template>
	<div class="findings-table">
		<cl-crud ref="ItemCsCrud">
			<!-- 顶部操作区域 -->
			<cl-row>
				<div class="table-title">
					<h3>次数设置</h3>
				</div>
				<!-- 刷新按钮 -->
				<cl-refresh-btn />
				<!-- 新增按钮 -->
				<cl-add-btn />
				<!-- 批量删除按钮 -->
				<cl-multi-delete-btn />

				<cl-flex1 />
			</cl-row>

			<!-- 表格区域 -->
			<cl-row>
				<cl-table ref="ItemCsTable" />
			</cl-row>

			<cl-row>
				<cl-flex1 />
				<cl-pagination />
			</cl-row>

			<!-- 新增/编辑表单 -->
			<cl-upsert ref="ItemCsUpsert" />
		</cl-crud>

		<!-- 项目选择弹窗 -->
		<cl-form ref="ItemSelectForm">
			<template #slot-item-select-table>
				<div style="display: flex; flex-direction: column; width: 100%">
					<el-table
						:data="itemSelectData"
						style="width: 100%; height: 400px; margin-bottom: 0"
						highlight-current-row
						border
						:header-cell-style="{
							background: 'var(--el-fill-color-light)',
							color: 'var(--el-text-color-primary)',
							fontWeight: 'bold',
							padding: '8px'
						}"
						:row-class-name="getItemRowClassName"
						@current-change="handleItemRowClick"
					>
						<el-table-column
							prop="groupCode"
							label="组合编码"
							width="120"
							align="center"
						/>
						<el-table-column
							prop="groupName"
							label="组合名称"
							width="400"
							align="left"
							show-overflow-tooltip
						/>
					</el-table>

					<div style="margin-top: 10px; color: #666; font-size: 12px; text-align: center">
						提示：点击表格行选择项目数据
					</div>
				</div>
			</template>
		</cl-form>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useUpsert, useTable, useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { watch, nextTick, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useDict } from '/$/dict';

const { service } = useCool();
const { dict } = useDict();

const options = reactive({
	//模块
	moduleCode: [
		{ label: '代谢评估', value: 'mua', type: 'success' },
		{ label: 'ESWL', value: 'eswl', type: 'warning' }
	]
});

// 项目选择弹窗相关
const ItemSelectForm = useForm();
const itemSelectData = ref<
	Array<{
		itemCode: string;
		itemName: string;
		groupCode: string;
		groupName: string;
		itemType: number;
	}>
>([]);
const selectedItemRow = ref<{
	groupCode: string;
	groupName: string;
} | null>(null);

// 检查所见 CRUD 配置
const ItemCsCrud = useCrud(
	{
		service: service.knowledge.itemcs
	},
	app => {
		app.refresh();
	}
);

// 检查所见表格配置
const ItemCsTable = useTable({
	autoHeight: false,
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' } // 减小内边距也有助于控制行高
	},
	columns: [
		{
			type: 'selection',
			minWidth: 40
		},
		{
			type: 'index',
			label: '序号',
			minWidth: 50,
			align: 'center'
		},
		{
			label: '组合编码',
			prop: 'groupCode',
			minWidth: 80
		},
		{
			label: '组名名称',
			prop: 'groupName',
			minWidth: 100
		},
		{
			label: '所属模块',
			prop: 'moduleCode',
			minWidth: 80,
			dict: options.moduleCode
		},
		{
			label: '判断次数',
			prop: 'cs',
			minWidth: 70
		},
		{
			type: 'op',
			minWidth: 120,
			buttons: ['edit', 'delete']
		}
	]
});

// 规则组表单配置
const ItemCsUpsert = useUpsert({
	items: [
		{
			label: '组合编码',
			prop: 'groupCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入组合编码',
					disabled: true
				}
			},
			rules: {
				required: true,
				message: '请输入组合编码'
			},
			col: { span: 10 }
		},
		() => {
			return {
				label: '',
				prop: 'itemCodeBtn',
				col: { span: 2 },
				component: {
					name: 'el-button',
					props: {
						type: 'primary',
						disabled: ItemCsUpsert.value?.mode === 'update', // 编辑模式时禁用
						onClick: openItemSelect
					},
					slots: {
						default: () => '选择'
					}
				}
			};
		},
		{
			label: '组合名称',
			prop: 'groupName',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入组合名称',
					disabled: true
				}
			},
			rules: {
				required: true,
				message: '请输入组合名称'
			},
			col: { span: 12 }
		},
		{
			label: '所属模块',
			prop: 'moduleCode',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请输入所属模块',
					options: options.moduleCode
				}
			},
			rules: {
				required: true,
				message: '请输入所属模块'
			},
			col: { span: 12 }
		},
		{
			label: '判断次数',
			prop: 'cs',
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入判断次数'
				}
			},
			rules: {
				required: true,
				message: '请输入判断次数'
			},
			col: { span: 12 }
		}
	]
});

/**
 * 打开项目选择弹窗
 */
async function openItemSelect() {
	//console.log('openItemSelect');

	// 加载项目数据
	await loadItemData();

	// 打开项目选择弹窗
	ItemSelectForm.value?.open({
		title: '选择项目',
		width: '600px',
		height: '60vh',
		props: {
			inline: false,
			labelPosition: 'top'
		},
		dialog: {
			top: '5%',
			controls: ['fullscreen', 'close']
		},
		items: [
			{
				prop: 'itemSelectTable',
				component: {
					name: 'slot-item-select-table'
				},
				span: 24
			}
		],
		op: {
			saveButtonText: '选择'
		},
		on: {
			submit(data, { close }) {
				if (!selectedItemRow.value) {
					ElMessage.warning('请选择一个项目');
					return;
				}
				selectItemToForm(selectedItemRow.value);
				close();
			}
		}
	});
}

/**
 * 加载项目数据
 */
async function loadItemData() {
	try {
		const mockData = await service.knowledge.items.findGroup({});

		itemSelectData.value = mockData;
	} catch (error: any) {
		console.error('加载项目数据失败:', error);
		ElMessage.error('加载项目数据失败: ' + (error.message || '未知错误'));
	}
}

/**
 * 处理项目表格行点击
 */
function handleItemRowClick(row: any) {
	selectedItemRow.value = row;
}

/**
 * 获取项目表格行样式类名
 */
function getItemRowClassName({ row }: { row: any }) {
	if (selectedItemRow.value && selectedItemRow.value.groupCode === row.groupCode) {
		return 'selected-item-row';
	}
	return '';
}

/**
 * 将选中的项目数据填充到表单
 */
function selectItemToForm(selectedItem: any) {
	if (ItemCsUpsert.value?.form) {
		ItemCsUpsert.value.form.groupCode = selectedItem.groupCode;
		ItemCsUpsert.value.form.groupName = selectedItem.groupName;
	}
	ElMessage.success('项目选择成功');
}
</script>

<style lang="scss" scoped>
.findings-table {
	height: 100%;
	display: flex;
	flex-direction: column;

	.table-title {
		h3 {
			margin: 0;
			font-size: 16px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			margin-right: 16px;
		}
	}
}

// 项目选择表格的选中行样式
:deep(.selected-item-row) {
	background-color: var(--el-color-primary-light-9) !important;
	color: var(--el-color-primary) !important;

	td {
		background-color: var(--el-color-primary-light-9) !important;
		color: var(--el-color-primary) !important;
	}

	&:hover {
		background-color: var(--el-color-primary-light-8) !important;

		td {
			background-color: var(--el-color-primary-light-8) !important;
		}
	}
}
</style>
