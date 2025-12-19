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
		</cl-row>

		<!-- 表格区域 -->
		<cl-row>
			<cl-table ref="Table" :data="tableData" />
		</cl-row>

		<!-- 新增/编辑表单 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
import { useCrud, useUpsert, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ref, watch } from 'vue';
import { useDict } from '/$/dict';

interface DiagnosticRecommendationsEntity {
	diagnosticCode: string;
	diagnosticName: string;
	recommendationsName: string;
	recommendationsContent: string;
	sort: number;
}

const { service } = useCool();
const { dict } = useDict();

/**
 * 组件属性定义
 */
interface Props {
	/** 诊断编码 */
	diagnosticCode?: string;
}

const props = withDefaults(defineProps<Props>(), {
	diagnosticCode: ''
});

// 表格数据
const tableData = ref<any[]>([]);

// CRUD 配置
const Crud = useCrud({
	service: service.knowledge.diagnostic.recommendations
});

// 表格配置
const Table = useTable({
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' }
	},
	columns: [
		{
			type: 'selection',
			minWidth: 40
		},
		{
			label: '序号',
			prop: 'sort',
			minWidth: 60,
			align: 'center',
			sortable: 'asc'
		},
		{
			label: '诊断编码',
			prop: 'diagnosticCode',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			label: '建议类型',
			prop: 'recommendationsName',
			minWidth: 120,
			dict: dict.get('etiology_recomm')
		},
		{
			label: '建议内容',
			prop: 'recommendationsContent',
			minWidth: 300,
			showOverflowTooltip: true
		},
		{
			type: 'op',
			minWidth: 120,
			buttons: ['edit', 'delete']
		}
	]
});

// 表单配置
const Upsert = useUpsert({
	items: [
		{
			label: '诊断编码',
			prop: 'diagnosticCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入诊断编码'
				}
			},
			col: { span: 8 }
		},
		{
			label: '建议类型',
			prop: 'recommendationsName',
			value: '诊疗建议',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择建议类型',
					options: dict.get('etiology_recomm'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			},
			rules: {
				required: true,
				message: '请选择建议类型'
			},
			col: { span: 8 }
		},
		{
			label: '排序',
			prop: 'sort',
			value: 1,
			component: {
				name: 'el-input-number',
				props: {
					min: 0,
					max: 999,
					placeholder: '请输入排序'
				}
			},
			col: { span: 8 }
		},
		{
			label: '建议内容',
			prop: 'recommendationsContent',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 15,
					style: {
						fontSize: '20px'
					}
				}
			},
			col: { span: 24 }
		}
	],

	// 打开表单时设置默认值
	onOpen() {
		// 如果是新增模式，设置诊断编码默认值
		if (Upsert.value?.mode === 'add' && props.diagnosticCode) {
			Upsert.value.form.diagnosticCode = props.diagnosticCode;
		}
	},

	// 提交成功后刷新数据
	onSubmit(data, { next }) {
		return next(data).then(res => {
			// 提交成功后重新加载数据
			if (props.diagnosticCode) {
				loadData(props.diagnosticCode);
			}
			return res;
		});
	}
});

/**
 * 加载数据
 * @param diagnosticCode 诊断编码
 */
async function loadData(diagnosticCode: string) {
	//console.log('loadData 被调用，参数:', { diagnosticCode });

	// 验证 diagnosticCode 是否有效
	if (!diagnosticCode || diagnosticCode.trim() === '') {
		//console.log('diagnosticCode 无效，跳过加载');
		return;
	}

	// 获取表格数据
	const data = await service.knowledge.diagnostic.recommendations.list({
		diagnosticCode: diagnosticCode
	});
	//console.log('表格数据:', data);
	tableData.value = data;
}

/**
 * 获取表格数据
 */
function getTableData() {
	return Table.value?.data || [];
}

/**
 * 获取第一行数据
 */
function getFirstRow() {
	const data = getTableData();
	return data.length > 0 ? data[0] : null;
}

// 监听诊断编码变化
watch(
	() => props.diagnosticCode,
	(newCode, oldCode) => {
		//console.log('recommendations-table watch 触发:', {
		// 	newCode,
		// 	oldCode
		// });

		// 只有当新的编码不为空且与旧编码不同时才加载数据
		if (newCode && newCode.trim() !== '' && newCode !== oldCode) {
			//console.log('recommendations-table 开始加载数据');
			// 更新 CRUD 的查询条件
			//loadData(newCode);
		} else {
			//console.log('recommendations-table 跳过加载：编码无效或未变化');
		}
	}
);

// 暴露方法给父组件
defineExpose({
	loadData,
	getTableData,
	getFirstRow,
	tableData
});
</script>

<style lang="scss" scoped>
.cl-crud {
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>
