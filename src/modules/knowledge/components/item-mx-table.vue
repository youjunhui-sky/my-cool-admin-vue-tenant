<template>
	<div class="tips-table">
		<cl-crud ref="TipsCrud">
			<!-- 顶部操作区域 -->
			<cl-row>
				<div class="table-title">
					<h3>对照</h3>
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
				<cl-table ref="TipsTable" />
			</cl-row>

			<cl-row>
				<cl-flex1 />
				<cl-pagination />
			</cl-row>

			<!-- 新增/编辑表单 -->
			<cl-upsert ref="TipsUpsert" />
		</cl-crud>

		<!-- 项目选择弹窗 -->
		<cl-form ref="ItemSelectForm">
			<template #slot-item-select-table>
				<div style="display: flex; flex-direction: column; width: 100%">
					<!-- 搜索条件 -->
					<div class="search-conditions">
						<el-form :model="itemSearchForm" inline size="small" label-width="80px">
							<el-form-item label="项目编码">
								<el-input
									v-model="itemSearchForm.itemCode"
									placeholder="请输入项目编码"
									clearable
									style="width: 110px"
									@change="handleItemSearchChange"
								/>
							</el-form-item>
							<el-form-item label="项目名称">
								<el-input
									v-model="itemSearchForm.itemName"
									placeholder="请输入项目名称"
									clearable
									style="width: 110px"
									@change="handleItemSearchChange"
								/>
							</el-form-item>
							<el-form-item label="项目类型">
								<el-select
									v-model="itemSearchForm.itemType"
									placeholder="请选择项目类型"
									clearable
									style="width: 100px"
									@change="handleItemSearchChange"
								>
									<el-option
										v-for="item in options.itemType"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="handleItemSearch" size="small">
									搜索
								</el-button>
								<el-button @click="handleResetItemSearch" size="small">
									重置
								</el-button>
							</el-form-item>
						</el-form>
					</div>

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
							prop="itemCode"
							label="项目编码"
							width="120"
							align="center"
						/>
						<el-table-column
							prop="itemName"
							label="项目名称"
							align="left"
							width="200"
							show-overflow-tooltip
						/>
						<el-table-column
							prop="groupCode"
							label="组合编码"
							width="120"
							align="center"
						/>
						<el-table-column
							prop="groupName"
							label="组合名称"
							width="200"
							align="left"
							show-overflow-tooltip
						/>
						<el-table-column
							prop="itemType"
							label="项目类型"
							width="100"
							align="center"
						>
							<template #default="{ row }">
								<el-tag
									:type="getItemTypeTag(row.itemType)?.type as any"
									size="small"
								>
									{{ getItemTypeTag(row.itemType)?.label }}
								</el-tag>
							</template>
						</el-table-column>
					</el-table>

					<div style="margin-top: 10px; color: #666; font-size: 12px; text-align: center">
						提示：点击表格行选择项目数据
					</div>

					<div
						style="
							margin-top: 15px;
							display: flex;
							justify-content: center;
							width: 100%;
						"
					>
						<el-pagination
							v-model:current-page="itemPagination.currentPage"
							v-model:page-size="itemPagination.pageSize"
							:page-sizes="[10, 20, 50, 100]"
							:total="itemPagination.total"
							layout="total, sizes, prev, pager, next, jumper"
							@current-change="handleItemPageChange"
							@size-change="handleItemPageSizeChange"
							size="small"
						/>
					</div>
				</div>
			</template>
		</cl-form>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useUpsert, useTable, useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { watch, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

import { useDict } from '/$/dict';

const { dict } = useDict();

const { service } = useCool();

// 标签映射
const options = reactive({
	//项目类型
	itemType: [
		{ label: '检验', value: 1, type: 'success' },
		{ label: '检查', value: 2, type: 'warning' },
		{ label: '结石成分', value: 3, type: 'danger' },
		{ label: '体格', value: 4, type: 'info' }
	],
	//逻辑关系
	relation: [
		{ label: '模糊匹配', value: 1, type: 'success' },
		{ label: '包含', value: 2, type: 'warning' },
		{ label: '等于', value: 3, type: 'danger' },
		{ label: '不等于', value: 4, type: 'info' },
		{ label: '大于', value: 5, type: 'success' },
		{ label: '小于', value: 6, type: 'warning' },
		{ label: '大于等于', value: 7, type: 'danger' },
		{ label: '小于等于', value: 8, type: 'info' }
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
	itemCode: string;
	itemName: string;
	groupCode: string;
	groupName: string;
	itemType: number;
} | null>(null);

// 项目搜索表单
const itemSearchForm = reactive({
	itemCode: '',
	itemName: '',
	itemType: undefined as number | undefined
});

// 原始项目数据备份
const originalItemData = ref<
	Array<{
		itemCode: string;
		itemName: string;
		groupCode: string;
		groupName: string;
		itemType: number;
	}>
>([]);

// 项目分页相关状态
const itemPagination = reactive({
	currentPage: 1,
	pageSize: 20,
	total: 0
});

/**
 * 组件属性定义
 */
interface Props {
	groupCode?: string;
}

const props = withDefaults(defineProps<Props>(), {
	groupCode: ''
});

// 添加防抖标识
const isLoading = ref(false);
const loadTimer: number | null = null;

// 检查提示 CRUD 配置
const TipsCrud = useCrud(
	{
		service: service.knowledge.hisdz,
		// 自定义刷新事件
		onRefresh(params, { next }) {
			// 确保传递 groupCode 参数
			if (props.groupCode) {
				return next({
					...params,
					groupCode: props.groupCode
				});
			} else {
				// 如果没有 groupCode，返回空数据
				return Promise.resolve({
					list: [],
					pagination: {
						total: 0,
						page: 1,
						size: 20
					}
				});
			}
		}
	},
	app => {
		// 初始化时不自动加载数据
		// app.refresh({ groupCode: props.groupCode });
	}
);

// 检查提示表格配置
const TipsTable = useTable({
	autoHeight: false, // 在嵌套布局中设置为false
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
			label: '组合名称',
			prop: 'groupName',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			label: '项目名称',
			prop: 'itemName',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			label: 'his项目编码',
			prop: 'hisItemCode',
			minWidth: 80
		},
		{
			label: 'his项目名称',
			prop: 'hisItemName',
			minWidth: 100
		},
		{
			type: 'op',
			minWidth: 120,
			buttons: ['edit', 'delete']
		}
	]
});

// 检查提示表单配置
const TipsUpsert = useUpsert({
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
			col: { span: 6 }
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
						disabled: TipsUpsert.value?.mode === 'update' || !props.groupCode, // 编辑模式或无groupCode时禁用
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
			col: { span: 8 }
		},
		{
			label: '项目编码',
			prop: 'itemCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入项目编码',
					disabled: true
				}
			},
			rules: {
				required: true,
				message: '请输入项目编码'
			},
			col: { span: 8 }
		},
		{
			label: '项目名称',
			prop: 'itemName',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入项目名称',
					disabled: true
				}
			},
			rules: {
				required: true,
				message: '请输入项目名称'
			},
			col: { span: 8 }
		},
		{
			label: 'his项目编码',
			prop: 'hisItemCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入his项目编码'
				}
			},
			col: { span: 8 }
		},
		{
			label: 'his项目名称',
			prop: 'hisItemName',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入his项目名称'
				}
			},
			col: { span: 8 }
		},
		{
			label: '备注',
			prop: 'remark',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3,
					placeholder: '请输入备注'
				}
			},
			col: { span: 24 }
		}
	],

	// 打开表单时设置默认值
	onOpen() {
		// 如果是新增模式，设置默认值
		if (TipsUpsert.value?.mode === 'add') {
			if (props.groupCode) {
				TipsUpsert.value.form.groupCode = props.groupCode;
			}
		}
	},

	// 提交成功后刷新数据
	onSubmit(data, { next }) {
		return next(data).then(res => {
			// 提交成功后重新加载数据
			if (props.groupCode) {
				loadData(props.groupCode);
			}
			return res;
		});
	}
});

/**
 * 打开项目选择弹窗
 */
async function openItemSelect() {
	//console.log('openItemSelect, groupCode:', props.groupCode);

	// 检查是否有 groupCode
	if (!props.groupCode || props.groupCode === '') {
		ElMessage.warning('请先选择组合后再添加项目');
		return;
	}

	// 加载项目数据，如果有 groupCode 则传递过滤条件
	await loadItemData(1, props.groupCode);

	// 打开项目选择弹窗
	ItemSelectForm.value?.open({
		title: props.groupCode ? `选择项目 (组合: ${props.groupCode})` : '选择项目',
		width: '800px',
		height: '65vh',
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
async function loadItemData(page = 1, filterGroupCode?: string) {
	try {
		itemPagination.currentPage = page;

		const params: any = {
			isDisabled: 0
		};

		// 如果有 groupCode，添加到过滤条件中
		if (filterGroupCode) {
			params.groupCode = filterGroupCode;
		}

		const mockData = await service.knowledge.items.list(params);

		const itemGroup = dict.get('item_group');
		const itemGroupMap = new Map(itemGroup.value.map((item: any) => [item.value, item.label]));

		// 保存原始数据，转换数据格式
		originalItemData.value = mockData.map((item: any) => ({
			itemCode: String(item.itemCode || ''),
			itemName: String(item.itemName || ''),
			groupCode: String(item.groupCode || ''),
			groupName: String(itemGroupMap.get(item.groupCode) || ''),
			itemType: Number(item.itemType || 1)
		}));

		// 应用搜索过滤
		performItemSearch();
	} catch (error: any) {
		console.error('加载项目数据失败:', error);
		ElMessage.error('加载项目数据失败: ' + (error.message || '未知错误'));
	}
}

/**
 * 执行项目搜索过滤
 */
function performItemSearch() {
	let filteredData = [...originalItemData.value];

	// 按项目编码过滤
	if (itemSearchForm.itemCode.trim()) {
		filteredData = filteredData.filter(item =>
			item.itemCode.toLowerCase().includes(itemSearchForm.itemCode.trim().toLowerCase())
		);
	}

	// 按项目名称过滤
	if (itemSearchForm.itemName.trim()) {
		filteredData = filteredData.filter(item =>
			item.itemName.includes(itemSearchForm.itemName.trim())
		);
	}

	// 按项目类型过滤
	if (itemSearchForm.itemType !== undefined) {
		filteredData = filteredData.filter(item => item.itemType === itemSearchForm.itemType);
	}

	// 更新分页信息
	itemPagination.total = filteredData.length;
	const startIndex = (itemPagination.currentPage - 1) * itemPagination.pageSize;
	const endIndex = startIndex + itemPagination.pageSize;
	itemSelectData.value = filteredData.slice(startIndex, endIndex);
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
	if (selectedItemRow.value && selectedItemRow.value.itemCode === row.itemCode) {
		return 'selected-item-row';
	}
	return '';
}

/**
 * 获取项目类型标签
 */
function getItemTypeTag(itemType: number) {
	return options.itemType.find(item => item.value === itemType);
}

/**
 * 将选中的项目数据填充到表单
 */
function selectItemToForm(selectedItem: any) {
	if (TipsUpsert.value?.form) {
		TipsUpsert.value.form.itemCode = selectedItem.itemCode;
		TipsUpsert.value.form.itemName = selectedItem.itemName;
		TipsUpsert.value.form.groupCode = selectedItem.groupCode;
		TipsUpsert.value.form.groupName = selectedItem.groupName;
		TipsUpsert.value.form.itemType = selectedItem.itemType;
	}
	ElMessage.success('项目选择成功');
}

/**
 * 项目搜索按钮点击事件
 */
function handleItemSearch() {
	itemPagination.currentPage = 1; // 重置到第一页
	performItemSearch();
	ElMessage.success(`搜索完成，找到 ${itemPagination.total} 条记录`);
}

/**
 * 重置项目搜索条件
 */
function handleResetItemSearch() {
	itemSearchForm.itemCode = '';
	itemSearchForm.itemName = '';
	itemSearchForm.itemType = undefined;

	itemPagination.currentPage = 1;
	performItemSearch();

	// 清空选择
	selectedItemRow.value = null;

	ElMessage.info('搜索条件已重置');
}

/**
 * 项目搜索条件变化时的处理
 */
function handleItemSearchChange() {
	// 可以实现实时搜索，这里暂时不启用
	// performItemSearch();
}

/**
 * 项目分页事件处理
 */
function handleItemPageChange(page: number) {
	selectedItemRow.value = null; // 切换页面时清空选择
	loadItemData(page, props.groupCode);
}

/**
 * 项目分页大小变化处理
 */
function handleItemPageSizeChange(pageSize: number) {
	itemPagination.pageSize = pageSize;
	itemPagination.currentPage = 1; // 重置到第一页
	selectedItemRow.value = null; // 清空选择
	performItemSearch();
}

/**
 * 加载数据
 * @param groupCode 组合编码
 */
async function loadData(groupCode: string) {
	//console.log('item-mx-table loadData 被调用，参数:', { groupCode });

	// 验证参数是否有效
	if (!groupCode || (typeof groupCode === 'string' && groupCode.trim() === '')) {
		//console.log('groupCode 无效，清空表格数据');
		// 使用 cl-crud 的刷新机制，传递空的 groupCode
		TipsCrud.value?.refresh({ groupCode: '' });
		return;
	}

	try {
		// 使用 cl-crud 的刷新机制，这样分页组件会正确更新
		//console.log('使用 cl-crud 刷新数据，groupCode:', groupCode);
		TipsCrud.value?.refresh({
			groupCode: groupCode,
			page: 1 // 重置到第一页
		});
	} catch (error) {
		console.error('加载 item-mx-table 数据失败:', error);
		ElMessage.error('加载数据失败');
	}
}

/**
 * 获取表格数据
 */
function getTableData() {
	return TipsTable.value?.data || [];
}

// 监听组合编码变化（但不自动加载，由父组件控制）
watch(
	() => [props.groupCode],
	([newGroupCode], [oldGroupCode]) => {
		//console.log('item-mx-table watch 触发:', {
		//	newGroupCode,
		//	oldGroupCode
		//});

		// 如果编码为空，清空数据
		if (!newGroupCode || (typeof newGroupCode === 'string' && newGroupCode.trim() === '')) {
			//console.log('item-mx-table 清空数据');
			// 使用 cl-crud 刷新机制清空数据
			TipsCrud.value?.refresh({ groupCode: '' });
		}
		// 注意：这里不自动加载数据，由父组件通过 loadData 方法控制
	}
);

// 暴露方法给父组件
defineExpose({
	loadData,
	getTableData
});
</script>

<style lang="scss" scoped>
.tips-table {
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

// 项目选择弹窗样式
.search-conditions {
	padding: 12px 16px;
	background: var(--el-fill-color-lighter);
	border-bottom: 1px solid var(--el-border-color-light);
	margin-bottom: 10px;

	.el-form {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;

		.el-form-item {
			margin-bottom: 8px;
			margin-right: 12px;
			display: flex;
			align-items: center;

			&:last-child {
				margin-right: 0;
			}

			.el-form-item__label {
				font-size: 12px;
				color: var(--el-text-color-regular);
				font-weight: normal;
				line-height: 28px;
				padding-right: 8px;
			}

			.el-form-item__content {
				line-height: 28px;
			}

			.el-input,
			.el-select {
				.el-input__wrapper {
					height: 28px;
					font-size: 12px;
				}
			}

			.el-button {
				height: 28px;
				font-size: 12px;
				padding: 0 12px;
			}
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
