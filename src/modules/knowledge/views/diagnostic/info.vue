<template>
	<div class="diagnostic-layout">
		<!-- 左侧表格区域 -->
		<div class="left-panel">
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
					<cl-filter label="是否停用">
						<cl-select
							:options="options.isDisabled"
							prop="isDisabled"
							:width="100"
							check-strictly
						/>
					</cl-filter>
					<!-- 关键字搜索 -->
					<cl-search-key placeholder="搜索编码或名称" :width="250" />
				</cl-row>

				<!-- 表格区域 -->
				<cl-row>
					<cl-table ref="Table" @row-click="handleRowClick" />
				</cl-row>

				<!-- 分页区域 -->
				<cl-row>
					<cl-flex1 />
					<cl-pagination />
				</cl-row>

				<!-- 新增/编辑表单 -->
				<cl-upsert ref="Upsert" />
			</cl-crud>
		</div>

		<!-- 右侧双表格区域 -->
		<div class="right-panel">
			<!-- 上方表格 -->
			<div class="top-table">
				<group-table
					ref="groupTableRef"
					:diagnostic-code="selectedDiagnosticCode"
					@row-click="handleGroupRowClick"
				/>
			</div>

			<!-- 下方表格 -->
			<div class="bottom-table">
				<rule-table
					ref="ruleTableRef"
					:diagnostic-code="selectedDiagnosticCode"
					:group-no="selectedGroupNo"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useUpsert, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ref, nextTick, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import GroupTable from '../../components/group-table.vue';
import RuleTable from '../../components/rule-table.vue';

const { service } = useCool();

// 标签映射
const options = reactive({
	//性别
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	],
	//评估类型
	assessmentType: [
		{ label: '简化评估', value: 'mua1', type: 'success' },
		{ label: '全面评估', value: 'mua2', type: 'warning' },
		{ label: '特殊评估', value: 'mua3', type: 'danger' }
	],
	//诊断类型
	diagnosticType: [
		{ label: '标准诊断', value: 1, type: 'success' },
		{ label: '鉴别诊断', value: 2, type: 'danger' }
	],
	//关系
	distinguishRelation: [
		{ label: '与', value: 1, type: 'success' },
		{ label: '或', value: 2, type: 'warning' },
		{ label: '非', value: 3, type: 'danger' }
	],
	//是否停用
	isDisabled: [
		{ label: '是', value: 1, type: 'danger' },
		{ label: '否', value: 0, type: 'success' }
	]
});

// 当前选中的诊断编码和组号
const selectedDiagnosticCode = ref<string>('');
const selectedGroupNo = ref<string>('');

// 组件引用
const groupTableRef = ref();
const ruleTableRef = ref();

// CRUD 配置
const Crud = useCrud(
	{
		service: service.knowledge.diagnostic.info
	},
	app => {
		app.refresh();
	}
);

// 左侧主表格配置
const Table = useTable({
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
			label: '序号',
			prop: 'sort',
			minWidth: 60,
			align: 'center',
			sortable: 'asc'
		},
		{
			label: '诊断编码',
			prop: 'diagnosticCode',
			minWidth: 80
		},
		{
			label: '诊断名称',
			prop: 'diagnosticName',
			showOverflowTooltip: true,
			minWidth: 150
		},
		{
			label: '诊断类型',
			prop: 'diagnosticType',
			minWidth: 100,
			align: 'center',
			dict: options.diagnosticType
		},
		{
			label: '诊断分组',
			prop: 'diagnosticGroup',
			minWidth: 240,
			showOverflowTooltip: true,
			dict: options.assessmentType
		},
		// {
		// 	label: '拼音码',
		// 	prop: 'pinyinCode',
		// 	minWidth: 80,
		// 	align: 'center'
		// },
		{
			label: '关系',
			prop: 'distinguishRelation',
			minWidth: 80,
			align: 'center',
			dict: options.distinguishRelation
		},
		{
			label: '鉴别次数',
			prop: 'distinguishCount',
			minWidth: 80
		},
		{
			label: '备注',
			prop: 'remark',
			minWidth: 80,
			align: 'center'
		},

		{
			label: '是否停用',
			prop: 'isDisabled',
			minWidth: 70,
			align: 'center',
			dict: options.isDisabled
		},
		{
			type: 'op',
			minWidth: 120,
			buttons: ['edit', 'delete']
		}
	]
});

// 左侧主表单配置
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
			rules: {
				required: true,
				message: '请输入诊断编码'
			},
			col: { span: 12 }
		},
		{
			label: '诊断名称',
			prop: 'diagnosticName',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入诊断名称'
				}
			},
			rules: {
				required: true,
				message: '请输入诊断名称'
			},
			col: { span: 12 }
		},
		{
			label: '诊断类型',
			prop: 'diagnosticType',
			component: {
				name: 'el-select',
				props: {
					placeholder: '请选择诊断类型'
				},
				options: options.diagnosticType
			},
			rules: {
				required: true,
				message: '请选择诊断类型'
			},
			col: { span: 12 }
		},
		{
			label: '诊断分组',
			prop: 'diagnosticGroup',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择所属分组',
					clearable: true,
					multiple: true,
					collapseTags: true,
					collapseTagsTooltip: true,
					valueKey: 'value',
					options: options.assessmentType
				}
			},
			col: { span: 12 },
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
					return Array.isArray(value) ? value.join(',').replaceAll("'", '') : value;
				}
			}
		},
		{
			label: '拼音码',
			prop: 'pinyinCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入拼音码'
				}
			},
			col: { span: 12 }
		},
		{
			label: '关系',
			prop: 'distinguishRelation',
			value: 1,
			component: {
				name: 'el-select',
				props: {
					placeholder: '请选择关系'
				},
				options: options.distinguishRelation
			},
			col: { span: 6 }
		},
		{
			label: '鉴别次数',
			prop: 'distinguishCount',
			value: 1,
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请选择鉴别次数',
					min: 1
				}
			},
			col: { span: 6 }
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
		},
		{
			label: '排序',
			prop: 'sort',
			value: 1,
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入排序值',
					min: 1
				}
			},
			col: { span: 12 }
		},
		{
			label: '是否停用',
			prop: 'isDisabled',
			value: 0,
			component: {
				name: 'el-select',
				props: {
					placeholder: '请选择是否停用'
				},
				options: options.isDisabled
			},
			col: { span: 12 }
		},
		{
			label: '互斥评估结果',
			prop: 'excludeDiagnosticCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入互斥评估结果的编码，多个以逗号","隔开'
				}
			},
			col: { span: 24 }
		}
	]
});

/**
 * 处理左侧表格行点击事件
 * @param row 点击的行数据
 */
async function handleRowClick(row: any) {
	try {
		//console.log('左侧表格行点击，诊断编码:', row.diagnosticCode);

		// 如果点击的是同一行，不需要重新加载
		if (selectedDiagnosticCode.value === row.diagnosticCode) {
			//console.log('点击的是同一行，跳过加载');
			return;
		}

		// 先清空右侧表格数据
		if (groupTableRef.value) {
			groupTableRef.value.tableData = [];
		}
		if (ruleTableRef.value) {
			ruleTableRef.value.tableData = [];
		}

		// 先清空组号选择，避免 rule-table 在诊断编码变化时使用旧的组号
		selectedGroupNo.value = '';

		// 使用 nextTick 确保组号清空后再设置新的诊断编码
		await nextTick();

		// 设置新的诊断编码，这会触发 group-table 的 watch
		// group-table 数据加载完成后会自动选择第一行
		selectedDiagnosticCode.value = row.diagnosticCode;

		//console.log('已设置诊断编码，等待 group-table 数据加载完成...');
	} catch (error) {
		console.error('加载右侧表格数据失败:', error);
		ElMessage.error('加载数据失败');
	}
}

/**
 * 处理右侧上方表格行点击事件
 * @param row 点击的行数据
 */
function handleGroupRowClick(row: any) {
	selectedGroupNo.value = String(row.groupNo);
}
</script>

<style lang="scss" scoped>
.diagnostic-layout {
	display: flex;
	height: 100%;
	gap: 16px;

	.left-panel {
		width: 50%;
		min-width: 0;
		background: var(--el-bg-color);
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.right-panel {
		width: 50%;
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
		}
	}
}

// 响应式设计
@media (max-width: 1200px) {
	.diagnostic-layout {
		flex-direction: column;

		.right-panel {
			width: 100%;
			flex-direction: row;

			.top-table,
			.bottom-table {
				flex: 1;
			}
		}
	}
}

@media (max-width: 768px) {
	.diagnostic-layout {
		.right-panel {
			flex-direction: column;
		}
	}
}
</style>
