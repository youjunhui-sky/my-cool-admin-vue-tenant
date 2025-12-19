<template>
	<div class="password-test-page">
		<div class="container">
			<h1>密码强度验证测试</h1>

			<div class="test-section">
				<h2>密码输入测试</h2>
				<el-form :model="form" label-width="120px">
					<el-form-item label="密码">
						<el-input
							v-model="form.password"
							type="password"
							placeholder="请输入密码进行测试"
							show-password
							maxlength="128"
							@blur="onPasswordBlur"
						/>

						<!-- 密码强度指示器 - 只在失去焦点且有错误时显示 -->
						<password-strength-indicator
							v-if="showPasswordErrors && passwordErrors.length > 0"
							:password="form.password"
							:show-errors="true"
							:show-suggestion="false"
						/>
					</el-form-item>

					<!-- 密码强度指示器 -->
					<password-strength-indicator
						v-if="form.password"
						:password="form.password"
						:show-errors="true"
						:show-suggestion="true"
						@suggestion="onPasswordSuggestion"
					/>
				</el-form>
			</div>

			<div class="test-section">
				<h2>验证结果</h2>
				<div class="result-card">
					<div class="result-item">
						<strong>验证状态：</strong>
						<span :class="validation.isValid ? 'success' : 'error'">
							{{ validation.isValid ? '通过' : '未通过' }}
						</span>
					</div>
					<div class="result-item" v-if="validation.errors.length > 0">
						<strong>错误信息：</strong>
						<ul class="error-list">
							<li v-for="error in validation.errors" :key="error">{{ error }}</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="test-section">
				<h2>测试用例</h2>
				<div class="test-cases">
					<div
						v-for="testCase in testCases"
						:key="testCase.password"
						class="test-case"
						@click="setTestPassword(testCase.password)"
					>
						<div class="test-password">{{ testCase.password }}</div>
						<div class="test-description">{{ testCase.description }}</div>
					</div>
				</div>
			</div>

			<div class="test-section">
				<h2>密码要求说明</h2>
				<div class="requirements">
					<ul>
						<li>密码长度至少8个字符，最多128个字符</li>
						<li>必须包含至少一个大写字母</li>
						<li>必须包含至少一个小写字母</li>
						<li>必须包含至少一个数字</li>
						<li>必须包含至少一个特殊字符</li>
						<li>不能使用常见弱密码</li>
						<li>不能包含连续字符（如123、abc）</li>
						<li>不能包含重复字符（如aaa、111）</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'password-test'
});

import { reactive, computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import PasswordStrengthIndicator from '../../components/password-strength-indicator.vue';
import { passwordValidator, type PasswordValidationResult } from '../../utils/password-validator';

// 表单数据
const form = reactive({
	password: ''
});

// 密码错误状态
const showPasswordErrors = ref(false);
const passwordErrors = ref<string[]>([]);

// 验证结果
const validation = computed((): PasswordValidationResult => {
	return passwordValidator.validate(form.password);
});

// 测试用例
const testCases = [
	{ password: '123456', description: '弱密码 - 只有数字' },
	{ password: 'password', description: '弱密码 - 常见密码' },
	{ password: 'abc123', description: '弱密码 - 缺少大写和特殊字符' },
	{ password: 'Password123', description: '中等密码 - 缺少特殊字符' },
	{ password: 'Password123!', description: '强密码 - 符合所有要求' },
	{ password: 'MySecurePass123!@#', description: '非常强密码 - 长度和复杂度都很高' },
	{ password: '123abc', description: '弱密码 - 连续字符' },
	{ password: 'aaa123', description: '弱密码 - 重复字符' }
];

// 密码失去焦点时验证
function onPasswordBlur() {
	if (form.password) {
		const validation = passwordValidator.validate(form.password);
		if (!validation.isValid) {
			passwordErrors.value = validation.errors;
			showPasswordErrors.value = true;
		} else {
			passwordErrors.value = [];
			showPasswordErrors.value = false;
		}
	}
}

// 设置测试密码
function setTestPassword(password: string) {
	form.password = password;
	// 触发验证
	onPasswordBlur();
}
</script>

<style lang="scss" scoped>
.password-test-page {
	padding: 20px;
	background-color: #f5f5f5;
	min-height: 100vh;

	.container {
		max-width: 800px;
		margin: 0 auto;
		background-color: white;
		border-radius: 8px;
		padding: 30px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

		h1 {
			text-align: center;
			color: #409eff;
			margin-bottom: 30px;
		}

		.test-section {
			margin-bottom: 30px;

			h2 {
				color: #333;
				margin-bottom: 15px;
				padding-bottom: 10px;
				border-bottom: 2px solid #409eff;
			}

			.result-card {
				background-color: #f8f9fa;
				border-radius: 6px;
				padding: 20px;

				.result-item {
					margin-bottom: 10px;

					strong {
						color: #333;
					}

					.success {
						color: #67c23a;
						font-weight: bold;
					}

					.error {
						color: #f56c6c;
						font-weight: bold;
					}

					.error-list {
						margin: 5px 0 0 20px;
						color: #f56c6c;

						li {
							margin-bottom: 3px;
						}
					}
				}
			}

			.test-cases {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
				gap: 15px;

				.test-case {
					background-color: #f8f9fa;
					border: 2px solid #e9ecef;
					border-radius: 6px;
					padding: 15px;
					cursor: pointer;
					transition: all 0.3s ease;

					&:hover {
						border-color: #409eff;
						background-color: #f0f9ff;
					}

					.test-password {
						font-family: monospace;
						font-size: 16px;
						font-weight: bold;
						color: #333;
						margin-bottom: 5px;
					}

					.test-description {
						font-size: 12px;
						color: #666;
					}
				}
			}

			.requirements {
				background-color: #f8f9fa;
				border-radius: 6px;
				padding: 20px;

				ul {
					margin: 0;
					padding-left: 20px;

					li {
						margin-bottom: 8px;
						color: #333;
					}
				}
			}
		}
	}
}
</style>
