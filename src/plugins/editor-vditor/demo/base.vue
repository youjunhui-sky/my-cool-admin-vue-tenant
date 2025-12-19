<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark" disable-transitions>base</el-tag>
			<span>基础用法</span>
		</div>

		<div class="c">
			<cl-editor-vditor
				v-model="content"
				:height="400"
				mode="wysiwyg"
				placeholder="请输入内容..."
			/>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const content = ref('# Hello Vditor\n\n这是一个基于 Vditor 的编辑器示例。');
</script>

<style lang="scss" scoped>
.scope {
	.h {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
	}

	.c {
		margin-bottom: 16px;
	}

	.f {
		.date {
			color: var(--el-text-color-secondary);
			font-size: 12px;
		}
	}
}
</style>
