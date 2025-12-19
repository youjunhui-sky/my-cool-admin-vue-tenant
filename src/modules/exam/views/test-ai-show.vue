<template>
	<div class="ai-suggestion-container">
		<div class="content-layout">
			<!-- 左侧输入框 -->
			<div class="input-section">
				<div class="section-title">输入内容</div>
				<el-input
					v-model="inputText"
					type="textarea"
					placeholder="请输入需要生成AI建议的内容..."
					class="input-textarea"
					:rows="20"
				/>
			</div>

			<!-- 中间按钮 -->
			<div class="button-section">
				<el-button
					type="primary"
					size="large"
					@click="generateAISuggestion"
					:loading="loading"
					:disabled="loading"
					class="generate-btn"
				>
					<el-icon><magic-stick /></el-icon>
					{{ loading ? '正在生成...' : '生成AI建议' }}
				</el-button>
			</div>

			<!-- 右侧输出框 -->
			<div class="output-section">
				<div class="section-title">AI建议结果</div>
				<div class="output-textarea">
					{{ outputText || '点击"生成AI建议"按钮查看结果...' }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { MagicStick } from '@element-plus/icons-vue';
import { useCool } from '/@/cool';

const { service } = useCool();

// 响应式数据
const inputText = ref('');
const outputText = ref('');
const loading = ref(false);

/**
 * 生成AI建议
 */
const generateAISuggestion = async () => {
	if (!inputText.value.trim()) {
		ElMessage.warning('请先输入内容');
		return;
	}

	// 如果已有输出内容，显示确认弹窗
	if (
		outputText.value &&
		outputText.value.trim() &&
		!outputText.value.includes('点击"生成AI建议"按钮查看结果')
	) {
		try {
			await ElMessageBox.confirm(`已有AI建议内容，确定要重新生成AI建议吗？`, 'AI建议确认', {
				confirmButtonText: '重新生成建议',
				cancelButtonText: '取消',
				type: 'warning',
				confirmButtonClass: 'el-button--danger'
			});
		} catch {
			// 用户取消生成
			ElMessage.info('已取消生成AI建议');
			return;
		}
	}

	// 开始生成，显示进度条
	loading.value = true;

	try {
		const params = {
			prompt: inputText.value,
			system_prompt: inputText.value,
			temperature: 0.7
		};
		// 调用后台API接口
		// 这里需要根据您的实际后台接口进行调整
		const response = await service.etiology.muaItems.generateAdvice(params);

		// 解析返回结果，取出response字段并去掉assistant:前缀
		let resultText = '';
		if (response && response.response) {
			// 取出response字段的值
			resultText = response.response;
			// 去掉assistant:前缀（如果存在）
			if (resultText.startsWith('assistant:')) {
				resultText = resultText.substring('assistant:'.length).trim();
			}
		} else {
			// 兼容其他可能的返回格式
			resultText = response.data || response.result || response || '未获取到有效的AI建议内容';
		}

		// 将处理后的结果显示在右侧
		outputText.value = resultText;

		ElMessage.success('AI建议生成成功');
	} catch (error: any) {
		console.error('生成AI建议失败:', error);
		ElMessage.error('生成AI建议失败: ' + (error.message || '未知错误'));

		// 如果API调用失败，可以显示模拟数据用于测试
		outputText.value = `针对您输入的内容，以下是AI生成的建议：

---

### **分析结果**
根据您提供的信息进行分析...

### **建议方案**
1. 建议方案一
2. 建议方案二
3. 建议方案三

### **注意事项**
- 注意事项一
- 注意事项二

---

*此为示例数据，实际结果将根据后台接口返回*`;
	} finally {
		// 无论成功或失败，都要隐藏进度条
		loading.value = false;
	}
};
</script>

<style scoped>
.ai-suggestion-container {
	padding: 20px;
	height: 100vh;
	background: #f5f7fa;
}

.content-layout {
	display: flex;
	gap: 20px;
	height: calc(100vh - 40px);
	max-width: 1400px;
	margin: 0 auto;
}

.input-section,
.output-section {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.button-section {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 160px;
}

.section-title {
	font-size: 16px;
	font-weight: 600;
	color: #333;
	margin-bottom: 12px;
	padding: 0 4px;
}

.input-textarea {
	flex: 1;
}

.input-textarea :deep(.el-textarea__inner) {
	height: 100% !important;
	resize: none;
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	font-size: 14px;
	line-height: 1.6;
}

.output-textarea {
	flex: 1;
	white-space: pre-wrap;
	line-height: 1.6;
	padding: 12px;
	background: #fff;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	overflow-y: auto;
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	font-size: 14px;
	color: #333;
}

.generate-btn {
	height: 50px;
	width: 140px;
	font-size: 16px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
}

.generate-btn .el-icon {
	font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
	.content-layout {
		flex-direction: column;
		height: auto;
	}

	.button-section {
		order: 2;
		padding: 20px 0;
	}

	.input-section,
	.output-section {
		min-height: 400px;
	}
}

/* 滚动条样式美化 */
.output-textarea::-webkit-scrollbar,
.input-textarea :deep(.el-textarea__inner)::-webkit-scrollbar {
	width: 6px;
}

.output-textarea::-webkit-scrollbar-track,
.input-textarea :deep(.el-textarea__inner)::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 3px;
}

.output-textarea::-webkit-scrollbar-thumb,
.input-textarea :deep(.el-textarea__inner)::-webkit-scrollbar-thumb {
	background: #c1c1c1;
	border-radius: 3px;
}

.output-textarea::-webkit-scrollbar-thumb:hover,
.input-textarea :deep(.el-textarea__inner)::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}
</style>
