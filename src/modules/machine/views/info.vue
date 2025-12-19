<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="设备名称、维护人员" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
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
	</cl-crud>
</template>

<script lang="ts" name="machine-maintain" setup>
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import dayjs from 'dayjs';
import { useBase } from '../../base';

import { usePatient } from '/@/modules/patient';

const { service } = useCool();
const { dict } = useDict();

const { user } = useBase();
const {
	// 医生选择组件
	DoctorSelect,
	// 科室选择组件
	DepartmentSelect
} = usePatient().components;

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: '设备编号',
			prop: 'machineNo',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入设备编号',
					clearable: true
				}
			},
			// rules: {
			// 	required: true,
			// 	message: '请输入设备编号'
			// },
			col: { span: 8 }
		},
		{
			prop: 'machineType',
			label: '设备类型',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请输入设备类型',
					tree: true,
					options: dict.get('machineType'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'maintainType',
			label: '维护科目',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请输入维护科目',
					tree: true,
					options: dict.get('maintainType'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '维修日期',
			prop: 'repairDate',
			component: {
				name: 'el-date-picker',
				props: { type: 'date', valueFormat: 'YYYY-MM-DD' }
			},
			value: dayjs().format('YYYY-MM-DD'),
			hook: {
				bind(value) {
					if (!value) {
						return dayjs().format('YYYY-MM-DD');
					}
					return value;
				}
			},
			col: { span: 8 }
		},
		{
			label: '维护费用',
			prop: 'maintainCost',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入维护费用',
					clearable: true
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'operator',
			label: '登记人',
			value: user.info?.name,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'slot-operator'
			},
			col: { span: 8 }
		},
		{
			label: '维修记录',
			prop: 'remark',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 5,
					placeholder: '请输入维修记录',
					clearable: true
				}
			},
			col: { span: 24 }
		},
		{
			label: '登记时间',
			prop: 'registerDate',
			value: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			component: {
				name: 'el-date-picker',
				props: {
					type: 'datetime',
					valueFormat: 'YYYY-MM-DD HH:mm:ss',
					placeholder: '请选择登记时间',
					clearable: true
				}
			},
			hook: {
				bind(value) {
					if (!value) {
						return dayjs().format('YYYY-MM-DD HH:mm:ss');
					}
					return value;
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
			label: '设备编号',
			prop: 'machineNo',
			minWidth: 80
		},
		{
			prop: 'machineType',
			label: '设备类型',
			minWidth: 80
		},
		{
			prop: 'maintainType',
			label: '维护科目',
			minWidth: 80
		},
		{
			label: '维修日期',
			prop: 'repairDate',
			showOverflowTooltip: true,
			formatter: (row: any) => {
				return row.repairDate?.split(' ')[0] || '';
			},
			minWidth: 100
		},
		{
			label: '维护费用',
			prop: 'maintainCost',
			minWidth: 60
		},
		{
			label: '登记人',
			prop: 'operator',
			minWidth: 80
		},
		{
			label: '登记时间',
			prop: 'registerDate',
			showOverflowTooltip: true,
			tooltip: true,
			minWidth: 120
		},
		{
			label: '维修记录',
			prop: 'remark',
			minWidth: 400,
			showOverflowTooltip: true,
			tooltip: true
		},
		{
			type: 'op',
			buttons: ['edit', 'delete'],
			minWidth: 160
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.machine.info
	},
	app => {
		app.refresh();
	}
);
</script>
