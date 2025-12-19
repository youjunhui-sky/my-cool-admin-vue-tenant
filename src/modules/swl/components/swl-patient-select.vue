<template>
	<cl-dialog v-model="visible" title="选择患者" width="80%">
		<cl-crud ref="Crud">
			<cl-row>
				<cl-table ref="Table" @row-dblclick="onRowClick" />
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
import { ref, h, onMounted, reactive } from 'vue';
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

// cl-table
const Table = useTable({
	autoHeight: false,

	columns: [
		{ type: 'selection' },
		{
			prop: 'patientNo',
			label: '档案号',
			minWidth: 60
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
			prop: 'idCard',
			label: '身份证号',
			minWidth: 120
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
			prop: 'mobile',
			label: '电话号码',
			minWidth: 120
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		// 修改为数组模式
		service: {
			page: async params => {
				// 打印请求参数，便于调试
				//console.log('调用findPatient的参数:', params);
				try {
					// 调用findPatient接口
					const result = await service.swl.info.findPatient(params);

					// 打印返回结果以便调试
					//console.log('findPatient返回结果:', result);

					// 直接返回数组数据
					if (Array.isArray(result)) {
						return result;
					} else {
						// 处理非数组情况，尝试提取数组
						const list = result?.list || result?.records || result?.data || [];
						return Array.isArray(list) ? list : [];
					}
				} catch (error) {
					console.error('查询患者出错:', error);
					ElMessage.error('查询患者失败');
					// 返回空数组
					return [];
				}
			}
		},
		dict: {
			api: {
				list: 'page', // 使用page作为list方法，保持与数组模式兼容
				page: 'page'
			}
		}
	},
	// 第二个参数可以指定初始化事件，但不执行刷新
	app => {
		// 不执行自动刷新
		//console.log('CRUD初始化完成，等待手动调用刷新');
	}
);

// 组件加载完成后，确保不自动刷新
onMounted(() => {
	// 阻止自动刷新，直到手动调用
	//console.log('组件挂载完成，等待手动查询');
});

// 打开
function open(name?: string) {
	visible.value = true;

	// 如果传入了姓名参数，则进行查询
	if (name && name.trim() !== '') {
		// 设置搜索框的值
		if (Search.value?.form) {
			Search.value.form.keyword = name;
		}

		// 立即执行查询，使用直接的方式而不是通过CRUD组件
		service.swl.info
			.findPatient({
				name: name
			})
			.then(result => {
				// 手动设置数据到表格
				if (result && Table.value) {
					// 直接处理数组数据
					if (Array.isArray(result)) {
						Table.value.data = result;
					} else {
						// 处理非数组情况
						const list = result?.list || result?.records || result?.data || [];
						Table.value.data = Array.isArray(list) ? list : [];
					}
					//console.log('手动设置表格数据:', Table.value.data);
				}
			})
			.catch(error => {
				console.error('查询患者出错:', error);
				ElMessage.error('查询患者失败');
			});
	} else {
		// 如果没有提供姓名，仍执行一次空查询以显示所有数据
		refresh({});
	}
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
		ElMessage.warning('请选择一个患者');
	}
}

defineExpose({
	open
});

// 刷新，确保参数正确传递
function refresh(params?: any) {
	//console.log('执行刷新操作，参数:', params);

	// 修改刷新方式，避免CRUD组件丢失参数
	if (params && params.keyword) {
		// 如果有关键词，采用与open函数相同的手动方式
		service.swl.info
			.findPatient(params)
			.then(result => {
				// 手动设置数据到表格
				if (result && Table.value) {
					// 直接处理数组数据
					if (Array.isArray(result)) {
						Table.value.data = result;
					} else {
						// 处理非数组情况
						const list = result?.list || result?.records || result?.data || [];
						Table.value.data = Array.isArray(list) ? list : [];
					}
					//console.log('刷新设置表格数据:', Table.value.data);
				}
			})
			.catch(error => {
				console.error('刷新查询患者出错:', error);
				ElMessage.error('刷新查询患者失败');
			});
	} else {
		// 如果没有关键词，使用CRUD组件的刷新方法
		Crud.value?.refresh(params);
	}
}

// 搜索配置
const Search = useSearch({
	items: [
		{
			prop: 'keyword',
			component: {
				name: 'el-input',
				props: {
					placeholder: '搜索姓名',
					clearable: true,
					// 回车键搜索
					onKeyup: (e: KeyboardEvent) => {
						if (e.key === 'Enter') {
							const name = Search.value?.form?.name || '';
							// 确保传递关键词参数
							refresh({
								name
							});
						}
					},
					// 值改变的时候刷新列表
					onChange(val: string) {
						// 无需立即刷新，等用户按回车或点击搜索按钮
						// 避免每次输入字符都触发查询
					}
				}
			}
		}
	]
});
</script>
