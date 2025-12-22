<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key :placeholder="$t('搜索机构名称')" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" @row-click="onRowClick" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
/**
 * 机构列表组件
 * 对应 BaseSysDepartmentEntity 实体
 */
defineOptions({
	name: 'hospital-list'
});

import { useTable, useUpsert, useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { service } = useCool();

const emit = defineEmits<{
	(e: 'row-click', row: Eps.BaseSysDepartmentEntity): void;
}>();

// cl-crud
const Crud = useCrud({ service: service.base.sys.department }, app => {
	app.refresh();
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '600px'
	},

	items: [
		{
			prop: 'tenantId',
			label: t('机构ID'),
			span: 24,
			required: true,
			component: {
				name: 'el-input-number',
				props: {
					placeholder: t('请输入机构ID')
				}
			}
		},
		{
			prop: 'name',
			label: t('机构名称'),
			span: 24,
			required: true,
			component: {
				name: 'el-input',
				props: {
					placeholder: t('请输入机构名称')
				}
			}
		},
		{
			prop: 'orderNum',
			label: t('排序'),
			span: 24,
			value: 0,
			component: {
				name: 'el-input-number',
				props: {
					'controls-position': 'right',
					min: 0,
					max: 9999
				}
			}
		}
	],

	/**
	 * 提交钩子
	 * 在 add 和 update 方法中默认传递 isMain=1 参数
	 */
	onSubmit(data, { next }) {
		next({
			...data,
			isMain: 1
		});
	}
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'tenantId',
			label: t('机构ID'),
			minWidth: 150
		},
		{
			prop: 'name',
			label: t('机构名称'),
			minWidth: 150
		},
		{
			prop: 'orderNum',
			label: t('排序'),
			minWidth: 100,
			align: 'center'
		},
		{
			prop: 'createTime',
			label: t('创建时间'),
			minWidth: 170
		},
		{
			prop: 'updateTime',
			label: t('更新时间'),
			minWidth: 170
		},
		{
			type: 'op'
		}
	]
});

/**
 * 机构表格行点击事件
 */
function onRowClick(row: Eps.BaseSysDepartmentEntity) {
	emit('row-click', row);
}

// 暴露方法供父组件调用
defineExpose({
	Crud,
	Table,
	Upsert
});
</script>
