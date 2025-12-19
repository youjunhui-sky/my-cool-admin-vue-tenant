<template>
	<cl-dialog v-model="visible" title="选择模板" width="60%">
		<cl-crud ref="Crud">
			<cl-row>
				<!-- 搜索插件 -->
				<cl-search-key placeholder="搜索检查所见、检查提示" :width="250" />
				<!-- <cl-search ref="Search" :reset-btn="true" /> -->
			</cl-row>

			<cl-row>
				<cl-table ref="Table" />
			</cl-row>

			<cl-row>
				<cl-flex1 />
				<cl-pagination />
			</cl-row>
		</cl-crud>

		<!-- 添加底部操作按钮配置 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="chooseTemplate"> 选择 </el-button>
			</span>
		</template>
	</cl-dialog>
</template>

<script lang="ts" name="template-select" setup>
import { useCrud, useTable, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const { service } = useCool();

const emit = defineEmits(['select']);

// 显示状态
const visible = ref(false);

// cl-table
const Table = useTable({
	autoHeight: false,

	columns: [
		{ type: 'selection' },
		{
			label: '检查所见',
			prop: 'examFindings',
			width: 300
		},
		{
			label: '检查提示',
			prop: 'examTips',
			width: 300
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.knowledge.exam
	},
	app => {
		app.refresh();
	}
);

// 打开
function open() {
	visible.value = true;
}

// 行点击
function onRowClick(row: any) {
	emit('select', row);
	visible.value = false;
}

// 关闭弹框
function close() {
	visible.value = false;
}

// 保存选择
function chooseTemplate() {
	// 获取选中的行数据
	const selection = Table.value?.selection;

	if (selection && selection.length > 0) {
		// 触发选择事件
		emit('select', selection[0]);
		// 关闭弹框
		close();
	} else {
		ElMessage.warning('请选择一个检查模板');
	}
}

defineExpose({
	open
});

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 搜索配置
const Search = useSearch({
	items: [
		{
			prop: 'keyword',
			component: {
				name: 'el-input',
				props: {
					placeholder: '检查所见/检查提示',
					clearable: true,
					// 值改变的时候刷新列表
					onChange(val: string) {
						refresh({
							keyword: val,
							page: 1
						});
					}
				}
			}
		}
	]
});
</script>
