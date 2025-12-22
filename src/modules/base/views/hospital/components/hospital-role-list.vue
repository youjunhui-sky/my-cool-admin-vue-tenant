<template>
	<cl-crud ref="Crud">
		<cl-row>
			<div class="table-title">
				<h3>管理员角色</h3>
			</div>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert">
			<template #slot-relevance="{ scope }">
				<div>
					<el-row>
						<cl-switch v-model="scope.relevance" />

						<span
							:style="{
								marginLeft: '10px',
								fontSize: '12px'
							}"
						>
							{{ t('是否关联上下级') }}
						</span>
					</el-row>
				</div>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" setup>
/**
 * 机构角色列表组件
 */
defineOptions({
	name: 'hospital-role-list'
});

import { useTable, useUpsert, useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const { t } = useI18n();
const { service } = useCool();

const props = defineProps<{
	selectedHospitalId?: number;
}>();

// cl-crud
const Crud = useCrud(
	{
		service: service.base.sys.role,
		onRefresh(params, { next }) {
			// 如果选中了机构，则根据机构ID过滤角色
			if (props.selectedHospitalId) {
				next({
					...params,
					tenantId: props.selectedHospitalId,
					isMain: 1
				});
			} else {
				next({
					...params,
					isMain: 1
				});
			}
		}
	},
	app => {
		// 初始不刷新，等待选择机构后再刷新
	}
);

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '800px'
	},

	items: [
		{
			prop: 'name',
			label: t('名称'),
			span: 12,
			required: true,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'label',
			label: t('标识'),
			span: 12,
			required: true,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'remark',
			label: t('备注'),
			span: 24,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 4
				}
			}
		},
		{
			label: t('功能权限'),
			prop: 'menuIdList',
			value: [],
			component: {
				name: 'cl-menu-check'
			}
		},
		{
			label: t('数据权限'),
			prop: 'relevance',
			component: {
				name: 'slot-relevance'
			}
		}
	],

	onSubmit(data, { next }) {
		next({
			...data,
			departmentIdList: data.departmentIdList || [],
			tenantId: props.selectedHospitalId || data.tenantId,
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
			prop: 'name',
			label: t('名称'),
			minWidth: 150
		},
		{
			prop: 'label',
			label: t('标识'),
			minWidth: 120
		},
		{
			prop: 'remark',
			label: t('备注'),
			showOverflowTooltip: true,
			minWidth: 150
		},
		{
			prop: 'createTime',
			label: t('创建时间'),
			sortable: 'desc',
			minWidth: 170
		},
		{
			prop: 'updateTime',
			label: t('更新时间'),
			sortable: 'custom',
			minWidth: 170
		},
		{
			type: 'op'
		}
	]
});

// 监听机构选择变化，刷新角色列表
watch(
	() => props.selectedHospitalId,
	(hospitalId, oldHospitalId) => {
		// 只有当 hospitalId 存在且发生变化时才刷新
		if (hospitalId !== undefined && hospitalId !== null && hospitalId !== oldHospitalId) {
			Crud.value?.refresh({
				page: 1,
				tenantId: hospitalId,
				isMain: 1
			});
		}
	}
);

// 暴露方法供父组件调用
defineExpose({
	Crud,
	Table,
	Upsert
});
</script>
