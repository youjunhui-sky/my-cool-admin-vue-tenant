<template>
	<cl-crud ref="Crud">
		<!-- 顶部操作区域 -->
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 批量删除按钮 -->
			<cl-multi-delete-btn />

			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索检查所见、检查提示" :width="250" />
			<!-- 高级搜索按钮 -->
			<!-- <cl-adv-btn /> -->
		</cl-row>

		<!-- 表格区域 -->
		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<!-- 分页区域 -->
		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 新增/编辑表单 -->
		<cl-upsert ref="Upsert" />
		<!-- 高级搜索 -->
		<cl-adv-search ref="AdvSearch" />
	</cl-crud>
</template>

<script lang="ts" setup>
import { useCrud, useUpsert, useTable, useAdvSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// CRUD 配置
const Crud = useCrud(
	{
		service: service.knowledge.exam
	},
	app => {
		app.refresh();
	}
);

// 表格配置
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 40,
			fixed: 'left'
		},
		{
			label: '序号',
			prop: 'sort',
			width: 60,
			align: 'center'
		},
		{
			label: '模板编码',
			prop: 'templateCode',
			minWidth: 60
		},
		{
			label: '模板名称',
			prop: 'templateName',
			minWidth: 80
		},
		{
			label: '检查所见',
			prop: 'examFindings',
			width: 600,
			align: 'center'
		},
		{
			label: '检查提示',
			prop: 'examTips',
			width: 600,
			align: 'center'
		},
		{
			type: 'op',
			width: 180,
			buttons: ['edit', 'delete']
		}
	]
});

// 表单配置
const Upsert = useUpsert({
	items: [
		{
			label: '模板编码',
			prop: 'templateCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入模板编码'
				}
			},
			rules: {
				required: true,
				message: '请输入模板编码'
			}
		},
		{
			label: '模板名称',
			prop: 'templateName',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入模板名称'
				}
			},
			rules: {
				required: true,
				message: '请输入模板名称'
			}
		},
		{
			label: '检查所见',
			prop: 'examFindings',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 4,
					placeholder: '请输入检查所见'
				}
			}
		},
		{
			label: '检查提示',
			prop: 'examTips',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 4,
					placeholder: '请输入检查提示'
				}
			}
		},
		{
			label: '序号',
			prop: 'sort',
			value: 0,
			component: {
				name: 'el-input-number',
				props: {
					min: 0,
					max: 999,
					placeholder: '请输入序号'
				}
			}
		}
	]
});

// 高级搜索配置
const AdvSearch = useAdvSearch({
	items: [
		{
			label: '检查所见',
			prop: 'examFindings',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入检查所见',
					clearable: true
				}
			}
		},
		{
			label: '检查提示',
			prop: 'examTips',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入检查提示',
					clearable: true
				}
			}
		}
	]
});
</script>

<style lang="scss" scoped>
.cl-crud {
	// 可以添加自定义样式
	height: 100%;
}
</style>
