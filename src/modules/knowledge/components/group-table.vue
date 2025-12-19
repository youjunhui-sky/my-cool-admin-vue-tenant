<template>
	<div class="findings-table">
		<cl-crud ref="GroupCrud">
			<!-- 顶部操作区域 -->
			<cl-row>
				<div class="table-title">
					<h3>规则组</h3>
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
				<cl-table ref="GroupTable" :data="tableData" @row-click="handleRowClick" />
			</cl-row>

			<!-- 新增/编辑表单 -->
			<cl-upsert ref="GroupUpsert" />
		</cl-crud>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useUpsert, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { watch, nextTick, ref, reactive } from 'vue';

const { service } = useCool();

// 标签映射
const options = reactive({
	//关系
	distinguishRelation: [
		{ label: '与', value: 1, type: 'success' },
		{ label: '或', value: 2, type: 'warning' },
		{ label: '非', value: 3, type: 'danger' }
	]
});

const tableData = ref<any[]>([]);

/**
 * 组件属性定义
 */
interface Props {
	/** 诊断编码 */
	diagnosticCode?: string;
}

/**
 * 组件事件定义
 */
interface Emits {
	/** 行点击事件 */
	(e: 'row-click', row: any): void;
}

const props = withDefaults(defineProps<Props>(), {
	diagnosticCode: ''
});

const emit = defineEmits<Emits>();

// 检查所见 CRUD 配置
const GroupCrud = useCrud({
	service: service.knowledge.diagnostic.group,
	// 删除成功后的回调
	onDelete(data, { next }) {
		return next(data).then(res => {
			// 删除成功后重新加载数据
			if (props.diagnosticCode) {
				loadData(props.diagnosticCode);
			}
			return res;
		});
	}
});

// 检查所见表格配置
const GroupTable = useTable({
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
			minWidth: 60,
			align: 'center'
		},
		{
			label: '诊断编码',
			prop: 'diagnosticCode',
			minWidth: 100
		},
		{
			label: '组名',
			prop: 'groupName',
			minWidth: 80
		},
		{
			label: '组号',
			prop: 'groupNo',
			minWidth: 80
		},
		{
			label: '组内关系',
			prop: 'groupRelation',
			minWidth: 100,
			options: options.distinguishRelation,
			showOverflowTooltip: true,
			formatter: (row: any) => {
				const relation = options.distinguishRelation.find(
					item => item.value === row.groupRelation
				);
				return relation ? relation.label : '';
			}
		},
		{
			label: '判断次数',
			prop: 'seq',
			minWidth: 80
		},
		{
			type: 'op',
			minWidth: 120,
			buttons: ['edit', 'delete']
		}
	]
});

// 规则组表单配置
const GroupUpsert = useUpsert({
	items: [
		{
			label: '诊断编码',
			prop: 'diagnosticCode',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入诊断编码',
					disabled: true // 始终不可编辑
				}
			},
			rules: {
				required: true,
				message: '请输入诊断编码'
			}
		},
		{
			label: '组名',
			prop: 'groupName',
			value: '规则一',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入组名'
				}
			},
			rules: {
				required: true,
				message: '请输入组名'
			}
		},
		() => {
			return {
				label: '组号',
				prop: 'groupNo',
				default: 1,
				component: {
					name: 'el-input-number',
					props: {
						placeholder: '请输入组号',
						disabled: GroupUpsert.value?.mode === 'update' // 编辑模式时禁用
					}
				},
				rules: {
					required: true,
					message: '请输入组号'
				}
			};
		},
		{
			label: '组内关系',
			prop: 'groupRelation',
			value: 1,
			component: {
				name: 'el-select',
				props: {
					placeholder: '请选择组内关系'
				},
				options: options.distinguishRelation
			},
			rules: {
				required: true,
				message: '请选择组内关系'
			}
		},
		{
			label: '判断次数',
			prop: 'seq',
			default: 1,
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入判断次数'
				}
			},
			rules: {
				required: true,
				message: '请输入判断次数'
			}
		}
	],

	// 打开表单时设置默认值
	onOpen() {
		// 如果是新增模式，设置默认值
		if (GroupUpsert.value?.mode === 'add') {
			// 设置诊断编码默认值
			if (props.diagnosticCode) {
				GroupUpsert.value.form.diagnosticCode = props.diagnosticCode;
			}
			// 设置判断次数默认值为1
			GroupUpsert.value.form.seq = 1;
			// 设置组号默认值为1
			GroupUpsert.value.form.groupNo = 1;
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
 * 处理行点击事件
 * @param row 点击的行数据
 */
function handleRowClick(row: any) {
	emit('row-click', row);
}

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
	const data = await service.knowledge.diagnostic.group.list({
		diagnosticCode: diagnosticCode
	});
	//console.log('表格数据:', data);
	tableData.value = data;
}

/**
 * 获取表格数据
 */
function getTableData() {
	return GroupTable.value?.data || [];
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
		//console.log('group-table watch 触发:', {
		// 	newCode,
		// 	oldCode
		// });

		// 只有当新的编码不为空且与旧编码不同时才加载数据
		if (newCode && newCode.trim() !== '' && newCode !== oldCode) {
			//console.log('group-table 开始加载数据');
			loadData(newCode);
		} else {
			//console.log('group-table 跳过加载：编码无效或未变化');
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
</style>
