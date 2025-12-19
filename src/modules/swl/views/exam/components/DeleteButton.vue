<template>
	<span class="delete-text" @click.stop="onClick">删除</span>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus';

// 定义 props
const props = defineProps<{
	index: number;
	label: string;
}>();

// 定义事件
const emit = defineEmits<{
	(e: 'delete', index: number): void;
}>();

// 点击处理
const onClick = (event: MouseEvent) => {
	// 阻止事件冒泡
	event.stopPropagation();
	event.preventDefault();

	ElMessage.closeAll();
	// 使用确认弹窗
	ElMessageBox.confirm(`确定要删除"${props.label}"检查吗？`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			emit('delete', props.index);

			ElMessage({
				message: `已成功删除"${props.label}"检查`,
				type: 'success',
				duration: 3000,
				showClose: true
			});
		})
		.catch(() => {
			// 取消操作
		});
};
</script>

<style scoped>
.delete-text {
	color: #f56c6c;
	font-size: 14px;
	margin-left: 15px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.delete-text:hover {
	color: #e53e3e;
	text-decoration: underline;
}
</style>
