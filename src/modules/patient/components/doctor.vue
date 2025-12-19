<template>
	<el-select v-model="active" placeholder="请选择医生" clearable>
		<el-option
			v-for="item in doctorList"
			:key="item.value"
			:label="item.label"
			:value="item.label"
		/>
	</el-select>
</template>

<script setup lang="ts">
defineOptions({
	name: 'doctor-select'
});

import { ref, useModel, watch, onMounted } from 'vue';
import { useCool } from '/@/cool';

const props = defineProps({
	modelValue: String,
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

// 医生列表
const doctorList = ref<{ label: string; value: number }[]>([]);

// 在组件挂载时加载医生列表
onMounted(() => {
	// 预加载医生数据
	loadDoctors();
});

// 简化的医生加载方法,未判断条件，待添加
const loadDoctors = async () => {
	if (doctorList.value.length === 0) {
		try {
			const res = await service.base.sys.user.list();
			doctorList.value = res
				.filter(user => user.name && user.id)
				.map(user => ({
					label: user.name,
					value: user.id
				})) as { label: string; value: number }[];
		} catch (error) {
			console.error('加载医生列表失败:', error);
		}
	}
};
</script>
