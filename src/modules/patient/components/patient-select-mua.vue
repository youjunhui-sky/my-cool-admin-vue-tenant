<template>
	<cl-dialog
		v-model="visible"
		title="选择患者"
		width="80%"
		destroy-on-close
		:before-close="handleBeforeClose"
	>
		<cl-crud ref="Crud">
			<cl-row>
				<!-- 搜索插件，增加key强制每次重新渲染 -->
				<cl-search
					ref="Search"
					:reset-btn="true"
					:props="{ labelWidth: 'auto' }"
					:key="searchKey"
				/>
			</cl-row>

			<cl-row>
				<cl-table ref="Table" @row-click="onRowClick" />
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
				<el-button type="primary" @click="chooseTemplate">选择</el-button>
			</span>
		</template>
	</cl-dialog>
</template>

<script lang="ts" name="template-select" setup>
import { useCrud, useTable, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ref, onMounted, nextTick, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const { service } = useCool();

const emit = defineEmits(['select']);

// 标签映射
const options = reactive({
	gender: [
		{ label: '男', value: 1 },
		{ label: '女', value: 2 },
		{ label: '未知', value: 0 }
	]
});
// 显示状态
const visible = ref(false);
// 搜索组件key，用于强制重新渲染
const searchKey = ref(0);

// cl-table
const Table = useTable({
	autoHeight: false,

	columns: [
		{ type: 'selection' },
		{
			prop: 'patientNo',
			label: '档案号',
			minWidth: 50
		},
		{
			prop: 'swlNo',
			label: '评估号',
			minWidth: 60
		},
		{
			prop: 'serialNumber',
			label: '流水号',
			minWidth: 60
		},
		{
			prop: 'assessmentDate',
			label: '日期',
			minWidth: 120
		},
		{
			prop: 'name',
			label: '姓名',
			minWidth: 80
		},
		{
			prop: 'gender',
			label: '性别',
			minWidth: 40,
			dict: options.gender
		},
		{
			prop: 'birthDate',
			label: '出生年月',
			minWidth: 60,
			formatter: (row: any) => {
				return row.birthDate?.split(' ')[0] || '';
			}
		},
		{
			prop: 'age',
			label: '年龄',
			minWidth: 80
		},
		{
			prop: 'mobile',
			label: '电话号码',
			minWidth: 120
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: {
			// 包装原 service 方法，自动注入 swlNo
			...service.etiology.info,
			page: params => service.etiology.info.selectMuaPatient({ ...params, size: 5 })
		},
		async onRefresh(params, { next }) {
			try {
				const res = await next(params);

				// 如果查询参数中有关键字但结果为空，显示提示
				if (params.keyword && (!res.list || res.list.length === 0)) {
					ElMessage.warning(`未查询到患者"${params.keyword}"的信息`);
				}

				return res;
			} catch (error) {
				console.error('查询出错', error);
				return { list: [], pagination: { total: 0, page: 1, size: 20 } };
			}
		}
	},
	app => {
		// 初始化不自动刷新，等用户操作再刷新
		// app.refresh();
	}
);

// 打开
function open(params?: { keyword?: string; autoSearch?: boolean }) {
	// 增加key值强制重新渲染搜索组件
	searchKey.value++;

	// 先显示对话框
	visible.value = true;

	// 使用nextTick确保DOM已更新
	nextTick(() => {
		// 延迟执行搜索操作，确保表单组件已完全挂载
		setTimeout(() => {
			try {
				// 如果传入了关键字，设置到搜索框中
				if (params?.keyword && Search.value) {
					Search.value.setForm('keyword', params.keyword);

					// 如果需要立即执行搜索
					if (params.autoSearch) {
						refresh({
							keyword: params.keyword,
							page: 1
						});
					}
				} else {
					// 如果没有关键字，默认刷新
					refresh();
				}
			} catch (error) {
				console.warn('设置搜索条件出错', error);
				// 出错时也进行刷新
				refresh();
			}
		}, 100); // 增加延迟时间，确保组件完全挂载
	});
}

// 在关闭前处理清理工作
function handleBeforeClose(done: () => void) {
	try {
		// 先重置表单避免宽度计算错误
		if (Search.value) {
			Search.value.reset();
		}
	} catch (e) {
		console.warn('关闭前重置表单出错', e);
	}

	// 关闭对话框
	done();
}

// 行点击
function onRowClick(row: any) {
	emit('select', row);
	close();
}

// 关闭弹框
function close() {
	try {
		// 关闭对话框
		visible.value = false;
	} catch (error) {
		console.warn('关闭对话框出错', error);
	}
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
		ElMessage.warning('请选择一个患者');
	}
}

// 导出组件方法
defineExpose({
	open,
	close
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
					placeholder: '姓名、档案号、碎石号、电话号码、身份证号',
					clearable: true,
					// 值改变的时候刷新列表
					onChange(val: string) {
						refresh({
							keyword: val || undefined, // 如果为空字符串则传undefined
							page: 1
						});
					}
				}
			}
		}
	],
	// 增加默认宽度配置防止标签宽度计算错误
	props: {
		labelWidth: 'auto',
		labelPosition: 'left' // 显式设置标签位置
	}
});

// 处理组件挂载
onMounted(() => {
	// 使用setTimeout确保挂载后有足够的时间初始化
	setTimeout(() => {
		try {
			// 确保表单组件已经挂载和初始化
			if (Search.value) {
				Search.value.reset();
			}
		} catch (error) {
			console.warn('初始化表单出错', error);
		}
	}, 50);
});
</script>
