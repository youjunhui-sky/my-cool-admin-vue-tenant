<template>
	<div class="md5-test-page">
		<div class="container">
			<h2>MD5加密测试</h2>

			<div class="test-section">
				<h3>基本测试</h3>
				<div class="test-item">
					<label>输入文本:</label>
					<el-input v-model="testInput" placeholder="请输入要测试的文本" />
				</div>
				<div class="test-item">
					<label>MD5结果:</label>
					<el-input v-model="md5Result" readonly />
				</div>
				<el-button type="primary" @click="testMD5">计算MD5</el-button>
			</div>

			<div class="test-section">
				<h3>标准MD5测试用例</h3>
				<div class="test-cases">
					<div
						class="test-case"
						v-for="(testCase, index) in standardTestCases"
						:key="'standard-' + index"
					>
						<div class="case-info"><strong>输入:</strong> "{{ testCase.input }}"</div>
						<div class="case-info"><strong>期望:</strong> {{ testCase.expected }}</div>
						<div class="case-info">
							<strong>实际:</strong> {{ md5(testCase.input) }}
						</div>
						<div
							class="case-status"
							:class="{
								pass: md5(testCase.input) === testCase.expected,
								fail: md5(testCase.input) !== testCase.expected
							}"
						>
							{{ md5(testCase.input) === testCase.expected ? '✓ 通过' : '✗ 失败' }}
						</div>
					</div>
				</div>
			</div>

			<div class="test-section">
				<h3>密码加密测试</h3>
				<div class="test-item">
					<label>原始密码:</label>
					<el-input v-model="password" type="password" placeholder="请输入密码" />
				</div>
				<div class="test-item">
					<label>加密结果:</label>
					<el-input v-model="encryptedPassword" readonly />
				</div>
				<div class="test-item">
					<label>验证密码:</label>
					<el-input
						v-model="verifyPasswordInput"
						type="password"
						placeholder="请输入验证密码"
					/>
				</div>
				<div class="test-item">
					<label>验证结果:</label>
					<el-input v-model="verifyResult" readonly />
				</div>
				<el-button type="primary" @click="testPasswordEncryption">测试密码加密</el-button>
				<el-button type="warning" @click="testPasswordVerification">测试密码验证</el-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { md5, encryptPassword, verifyPassword } from '../../utils/md5';

const testInput = ref('');
const md5Result = ref('');

const password = ref('');
const encryptedPassword = ref('');
const verifyPasswordInput = ref('');
const verifyResult = ref('');

// 标准MD5测试用例
const standardTestCases = ref([
	{ input: '', expected: 'd41d8cd98f00b204e9800998ecf8427e' },
	{ input: 'a', expected: '0cc175b9c0f1b6a831c399e269772661' },
	{ input: 'abc', expected: '900150983cd24fb0d6963f7d28e17f72' },
	{ input: 'message digest', expected: 'f96b697d7cb7938d525a2f31aaf161d0' },
	{ input: 'abcdefghijklmnopqrstuvwxyz', expected: 'c3fcd3d76192e4007dfb496cca67e13b' },
	{
		input: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
		expected: 'd174ab98d277d9f5a5611c2c9f419d9f'
	},
	{
		input: '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
		expected: '57edf4a22be3c955ac49da2e2107b67a'
	},
	{ input: '123456', expected: 'e10adc3949ba59abbe56e057f20f883e' }
]);

// 标准MD5测试用例
const testCases = reactive([
	{
		input: '',
		expected: 'd41d8cd98f00b204e9800998ecf8427e',
		actual: '',
		pass: false
	},
	{
		input: 'a',
		expected: '0cc175b9c0f1b6a831c399e269772661',
		actual: '',
		pass: false
	},
	{
		input: 'abc',
		expected: '900150983cd24fb0d6963f7d28e17f72',
		actual: '',
		pass: false
	},
	{
		input: 'message digest',
		expected: 'f96b697d7cb7938d525a2f31aaf161d0',
		actual: '',
		pass: false
	},
	{
		input: 'abcdefghijklmnopqrstuvwxyz',
		expected: 'c3fcd3d76192e4007dfb496cca67e13b',
		actual: '',
		pass: false
	},
	{
		input: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
		expected: 'd174ab98d277d9f5a5611c2c9f419d9f',
		actual: '',
		pass: false
	},
	{
		input: '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
		expected: '57edf4a22be3c955ac49da2e2107b67a',
		actual: '',
		pass: false
	}
]);

// 测试MD5计算
function testMD5() {
	if (testInput.value) {
		md5Result.value = md5(testInput.value);
	} else {
		md5Result.value = '';
	}
}

// 运行所有测试用例
function runAllTests() {
	testCases.forEach(testCase => {
		testCase.actual = md5(testCase.input);
		testCase.pass = testCase.actual === testCase.expected;
	});
}

// 测试密码加密
function testPasswordEncryption() {
	if (password.value) {
		encryptedPassword.value = encryptPassword(password.value);
	} else {
		encryptedPassword.value = '';
	}
}

// 测试密码验证
function testPasswordVerification() {
	if (verifyPasswordInput.value && encryptedPassword.value) {
		const isValid = verifyPassword(verifyPasswordInput.value, encryptedPassword.value);
		verifyResult.value = isValid ? '验证成功' : '验证失败';
	} else {
		verifyResult.value = '';
	}
}

// 页面加载时运行所有测试
runAllTests();
</script>

<style lang="scss" scoped>
.md5-test-page {
	padding: 20px;

	.container {
		max-width: 800px;
		margin: 0 auto;

		h2 {
			text-align: center;
			margin-bottom: 30px;
			color: #333;
		}

		.test-section {
			margin-bottom: 40px;
			padding: 20px;
			border: 1px solid #e0e0e0;
			border-radius: 8px;
			background-color: #fafafa;

			h3 {
				margin-bottom: 20px;
				color: #555;
				border-bottom: 2px solid #409eff;
				padding-bottom: 10px;
			}

			.test-item {
				margin-bottom: 15px;

				label {
					display: block;
					margin-bottom: 5px;
					font-weight: bold;
					color: #666;
				}
			}

			.test-cases {
				margin-bottom: 20px;

				.test-case {
					margin-bottom: 15px;
					padding: 10px;
					border: 1px solid #ddd;
					border-radius: 4px;
					background-color: white;

					.case-info {
						margin-bottom: 5px;
						font-family: monospace;
						font-size: 12px;

						strong {
							color: #333;
						}
					}

					.case-status {
						font-weight: bold;
						margin-top: 5px;

						&.pass {
							color: #67c23a;
						}

						&.fail {
							color: #f56c6c;
						}
					}
				}
			}
		}
	}
}
</style>
