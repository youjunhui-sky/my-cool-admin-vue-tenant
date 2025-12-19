<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<!-- 字典 -->
			<cl-filter label="项目类型">
				<cl-select
					tree
					:options="dict.get('item_type')"
					prop="itemType"
					:width="100"
					check-strictly
				/>
			</cl-filter>
			<cl-filter label="项目分组">
				<cl-select
					tree
					:options="dict.get('item_group')"
					prop="groupCode"
					:width="160"
					check-strictly
				/>
			</cl-filter>
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索项目编码、项目名称" :width="250" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<template #column-referenceRange="{ scope }">
					<el-link
						type="primary"
						:underline="false"
						@click="handleReferenceRangeClick(scope.row)"
					>
						参考范围
					</el-link>
				</template>
				<template #column-commonResult="{ scope }">
					<el-link
						type="primary"
						@click="handleCommonResultClick(scope.row)"
						:underline="false"
					>
						常见结果
					</el-link>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert">
			<!-- 添加操作人选择器插槽 -->
			<template #slot-operator="{ scope }">
				<component :is="DoctorSelect" v-model="scope.operator" />
			</template>
		</cl-upsert>

		<cl-form ref="Form">
			<template #slot-reference>
				<reference-component
					:item-code="referenceData.itemCode"
					:item-name="referenceData.itemName"
				/>
			</template>
		</cl-form>

		<cl-form ref="ResultForm">
			<template #slot-commonResult>
				<common-result-component
					:item-code="commonResultData.itemCode"
					:item-name="commonResultData.itemName"
				/>
			</template>
		</cl-form>
	</cl-crud>
</template>

<script lang="ts" name="machine-maintain" setup>
import { useCrud, useForm, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { router, useCool } from '/@/cool';
import { useDict } from '/$/dict';

import { usePatient } from '/@/modules/patient';
import ReferenceComponent from './reference.vue';
import CommonResultComponent from './result.vue';
import { ref, reactive } from 'vue';

const { service } = useCool();
const { dict } = useDict();
//操作人选择组件
const { DoctorSelect } = usePatient().components;

// 标签映射
const options = reactive({
	//项目类型
	itemType: [
		{ label: '检验', value: 1, type: 'success' },
		{ label: '检查', value: 2, type: 'warning' },
		{ label: '结石成分', value: 3, type: 'danger' },
		{ label: '体格', value: 4, type: 'info' }
	],
	//是否指标
	isIndicator: [
		{ label: '是', value: 1, type: 'success' },
		{ label: '否', value: 0, type: 'danger' }
	],
	//是否停用
	isDisabled: [
		{ label: '是', value: 1, type: 'danger' },
		{ label: '否', value: 0, type: 'success' }
	],
	//所属模块
	moduleCode: [
		{ label: 'swl', value: 'swl', type: 'success' },
		{ label: '代谢评估', value: 'mua', type: 'warning' },
		{ label: '简化评估', value: 'mua1', type: 'warning' },
		{ label: '全面评估', value: 'mua2', type: 'danger' },
		{ label: '特殊评估', value: 'mua3', type: 'info' }
	]
});

const Form = useForm();
const ResultForm = useForm();
const handleReferenceRangeClick = (row: any) => {
	//console.log('Opening reference range dialog with row:', row);

	// Make sure itemCode and itemName are available in the row
	if (!row.itemCode || !row.itemName) {
		console.error('Missing itemCode or itemName in row:', row);
		return;
	}

	// Update the reference data
	referenceData.value = {
		itemCode: row.itemCode,
		itemName: row.itemName
	};

	//console.log('Setting referenceData to:', referenceData.value);

	Form.value?.open({
		width: '1000px',
		height: '600px',
		title: '参考范围',
		op: { hidden: true },
		items: [
			{
				component: {
					name: 'slot-reference'
				}
			}
		]
	});
};

const handleCommonResultClick = (row: any) => {
	//console.log('Opening reference range dialog with row:', row);

	// Make sure itemCode and itemName are available in the row
	if (!row.itemCode || !row.itemName) {
		console.error('Missing itemCode or itemName in row:', row);
		return;
	}

	// Update the reference data
	commonResultData.value = {
		itemCode: row.itemCode,
		itemName: row.itemName
	};

	//console.log('Setting referenceData to:', commonResultData.value);

	ResultForm.value?.open({
		width: '1000px',
		height: '600px',
		title: '常见结果',
		op: { hidden: true },
		items: [
			{
				component: {
					name: 'slot-commonResult'
				}
			}
		]
	});
};

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: '项目编号',
			prop: 'itemCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入项目编号',
					clearable: true
				}
			},
			rules: {
				required: true,
				message: '请输入项目编号'
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
					clearable: true
				}
			},
			rules: {
				required: true,
				message: '请输入项目名称'
			},
			col: { span: 8 }
		},
		{
			prop: 'itemType',
			label: '项目类型',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择项目类型',
					options: options.itemType,
					clearable: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '项目分组',
			prop: 'groupCode',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择项目分组编码',
					clearable: true,
					options: dict.get('item_group')
				}
			},
			col: { span: 8 }
		},
		{
			label: '拼音码',
			prop: 'pinyinCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入拼音码',
					clearable: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '标准价格',
			prop: 'price',
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入标准价格',
					min: 0,
					precision: 2,
					step: 1,
					clearable: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '成本价格',
			prop: 'cost',
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入成本价格',
					min: 0,
					precision: 2,
					step: 1,
					clearable: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '单位',
			prop: 'unit',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入单位',
					clearable: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '排序',
			prop: 'sort',
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入排序号',
					min: 0,
					step: 1,
					clearable: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '备注说明',
			prop: 'remark',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3,
					placeholder: '请输入备注说明',
					clearable: true
				}
			},
			col: { span: 24 }
		},
		{
			label: '是否指标',
			prop: 'isIndicator',
			component: {
				name: 'el-switch',
				props: {
					activeText: '是',
					inactiveText: '否'
				}
			},
			col: { span: 8 }
		},
		{
			label: '是否停用',
			prop: 'isDisabled',
			component: {
				name: 'el-switch',
				props: {
					activeText: '是',
					inactiveText: '否'
				}
			},
			col: { span: 8 }
		},
		{
			label: '所属模块',
			prop: 'moduleCode',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择所属模块',
					clearable: true,
					multiple: true,
					collapseTags: true,
					collapseTagsTooltip: true,
					valueKey: 'value',
					options: options.moduleCode
				}
			},
			hook: {
				bind: (value, { form }) => {
					// 如果值是字符串，转换为数组
					if (typeof value === 'string') {
						return value.split(',').filter(Boolean);
					}
					return value;
				},
				submit: (value, { form, prop }) => {
					// 提交时将数组转换为字符串
					// 将数组转换为字符串，并去除单引号

					//console.log('0000:' + form[prop]);
					//console.log('1111:' + value.join(','));
					//console.log('2222:' + value.join(',').replaceAll("'", ''));
					return Array.isArray(value) ? value.join(',').replaceAll("'", '') : value;
				}
			},
			col: { span: 8 }
		}
	]
});

// cl-table
const Table = useTable({
	autoHeight: false,
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' }
	},
	columns: [
		{ type: 'selection' },
		{
			label: '项目编号',
			prop: 'itemCode',
			showOverflowTooltip: true,
			minWidth: 80
		},
		{
			prop: 'itemName',
			label: '项目名称',
			showOverflowTooltip: true,
			minWidth: 80
		},
		{
			prop: 'itemType',
			label: '项目类型',
			minWidth: 90,
			//排序
			sortable: true,
			dict: options.itemType
		},
		{
			label: '项目分组',
			prop: 'groupCode',
			minWidth: 90,
			sortable: true,
			dict: dict.get('item_group')
		},
		// {
		// 	label: '拼音码',
		// 	prop: 'pinyinCode',
		// 	minWidth: 80
		// },
		{
			label: '标准价格',
			prop: 'price',
			minWidth: 70
		},
		// {
		// 	label: '成本价格',
		// 	prop: 'cost',
		// 	minWidth: 80
		// },
		{
			label: '单位',
			prop: 'unit',
			minWidth: 70,
			showOverflowTooltip: true
		},
		{
			label: '排序',
			prop: 'sort',
			minWidth: 60,
			sortable: true
		},
		{
			label: '是否指标',
			prop: 'isIndicator',
			minWidth: 70,
			dict: options.isIndicator
		},
		{
			label: '是否停用',
			prop: 'isDisabled',
			minWidth: 70,
			dict: options.isDisabled
		},
		{
			label: '所属模块',
			prop: 'moduleCode',
			minWidth: 120,
			showOverflowTooltip: true,
			dict: options.moduleCode
		},
		{
			label: '备注',
			prop: 'remark',
			showOverflowTooltip: true,
			minWidth: 80
		},
		{
			prop: 'referenceRange',
			label: '参考范围',
			width: 90,
			slot: true
		},
		{
			label: '常见结果',
			prop: 'commonResult',
			width: 90,
			slot: true
		},
		{
			type: 'op',
			buttons: ['edit', 'delete'],
			width: 160
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.knowledge.items
	},
	app => {
		app.refresh();
	}
);

// 搜索
const Search = useSearch({
	items: [
		{
			prop: 'itemName',
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		}
	]
});

// Add this for storing reference data
const referenceData = ref({
	itemCode: '',
	itemName: ''
});

const commonResultData = ref({
	itemCode: '',
	itemName: ''
});
</script>
