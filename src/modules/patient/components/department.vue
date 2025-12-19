<template>
	<el-select v-model="active" placeholder="请选择科室" clearable>
		<el-option
			v-for="item in departmentList"
			:key="item.value"
			:label="item.label"
			:value="item.label"
		/>
	</el-select>
</template>

<script setup lang="ts">
// 组件名称
defineOptions({
	name: 'department-select'
});

import { ref, onMounted, watch, useModel } from 'vue';
import { useCool } from '/@/cool';

const props = defineProps({
	modelValue: [Number, String],
	disabled: Boolean
});

const emit = defineEmits(['update:modelValue', 'change']);

// 双向绑定
const active = useModel(props, 'modelValue');

// 监听active变化并触发change事件
watch(active, val => {
	emit('change', val);
});

const { service } = useCool();

// 部门列表
const departmentList = ref<{ label: string; value: number }[]>([]);

// 在组件挂载时加载部门列表
onMounted(() => {
	// 预加载部门数据
	loadDepartments();
});

// 简化的部门加载方法,未判断条件，待添加
const loadDepartments = async () => {
	if (departmentList.value.length === 0) {
		try {
			const res = await service.base.sys.department.list();
			// 还没有修改list方法，表还未加字段，只查询科室类型的数据
			departmentList.value = res
				.filter(dept => dept.name && dept.id)
				.map(dept => ({
					label: dept.name,
					value: dept.id
				})) as { label: string; value: number }[];
		} catch (error) {
			console.error('加载部门列表失败:', error);
		}
	}
};
</script>
