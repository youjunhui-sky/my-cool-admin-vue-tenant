<template>
	<div class="password-strength-indicator">
		<!-- 只显示错误信息，不显示强度 -->
		<div v-if="showErrors && errors.length > 0" class="error-list">
			<div v-for="error in errors" :key="error" class="error-item">
				<el-icon><warning /></el-icon>
				<span>{{ error }}</span>
			</div>
		</div>

		<div v-if="showSuggestion" class="suggestion">
			<el-button type="text" size="small" @click="generateSuggestion">
				生成安全密码建议
			</el-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'password-strength-indicator'
});

import { computed } from 'vue';
import { Warning } from '@element-plus/icons-vue';
import { passwordValidator, type PasswordValidationResult } from '../utils/password-validator';

interface Props {
	password: string;
	showErrors?: boolean;
	showSuggestion?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	showErrors: true,
	showSuggestion: true
});

const emit = defineEmits<{
	suggestion: [password: string];
}>();

// 验证密码
const validation = computed((): PasswordValidationResult => {
	return passwordValidator.validate(props.password);
});

// 错误信息
const errors = computed(() => validation.value.errors);

// 生成密码建议
function generateSuggestion() {
	const suggestion = passwordValidator.generatePasswordSuggestion();
	emit('suggestion', suggestion);
}
</script>

<style lang="scss" scoped>
.password-strength-indicator {
	margin-top: 8px;

	.error-list {
		margin-top: 8px;

		.error-item {
			display: flex;
			align-items: center;
			margin-bottom: 4px;
			font-size: 12px;
			color: #f56c6c;

			.el-icon {
				margin-right: 4px;
				font-size: 12px;
			}
		}
	}

	.suggestion {
		margin-top: 8px;
		text-align: center;

		.el-button {
			font-size: 12px;
			color: #409eff;
		}
	}
}
</style>
