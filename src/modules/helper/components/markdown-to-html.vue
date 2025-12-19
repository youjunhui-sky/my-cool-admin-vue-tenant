<template>
	<div class="markdown-to-html-tool">
		<div class="tool-header">
			<h2>Markdown转HTML工具</h2>
			<p class="tool-description">将Markdown格式的文本转换为HTML格式</p>
		</div>

		<div class="tool-content">
			<div class="input-section">
				<div class="section-header">
					<h3>输入 Markdown 文本</h3>
					<div class="actions">
						<el-button @click="clearInput" size="small" type="danger" plain
							>清空</el-button
						>
						<el-button @click="loadSample" size="small" type="primary" plain
							>加载示例</el-button
						>
					</div>
				</div>
				<el-input
					v-model="markdownText"
					type="textarea"
					:rows="15"
					placeholder="请输入Markdown格式的文本..."
					class="markdown-input"
				/>
			</div>

			<div class="convert-section">
				<el-button @click="convertToHtml" type="primary" size="large" class="convert-btn">
					<el-icon><refresh /></el-icon>
					转换为HTML
				</el-button>
			</div>

			<div class="output-section">
				<div class="section-header">
					<h3>HTML 输出</h3>
					<div class="actions">
						<el-button @click="copyHtml" size="small" type="success" plain
							>复制HTML</el-button
						>
						<el-button @click="previewHtml" size="small" type="info" plain
							>预览效果</el-button
						>
					</div>
				</div>
				<el-input
					v-model="htmlOutput"
					type="textarea"
					:rows="15"
					placeholder="转换后的HTML代码将在这里显示..."
					class="html-output"
					readonly
				/>
			</div>
		</div>

		<!-- HTML预览对话框 -->
		<el-dialog v-model="previewVisible" title="HTML预览效果" width="80%">
			<div class="html-preview" v-html="htmlOutput"></div>
			<template #footer>
				<el-button @click="previewVisible = false">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
import { convertMarkdownToHtml } from '../utils/markdown-converter';

const markdownText = ref('');
const htmlOutput = ref('');
const previewVisible = ref(false);

// 示例文本
const sampleMarkdown = `### 评估结果解析  
**疑似原发性高草酸尿**，需配合医生进行**家系基因检测**以明确诊断。未明确诊断前，按**高草酸尿症**进行饮食干预。

---

### 饮食建议  
• **饮水**：每日饮水 **2500ml 以上**，可饮用**橙汁、柠檬汁**，培养饮用**牛奶**的习惯（每日 **1-2 盒 250ml**），避免蔬菜汁等**高草酸饮品**。  
• **限制高草酸食物**：包括**菠菜、巧克力、坚果、草莓**等，每日草酸摄入量控制在 **200mg 以内**。  
• **烹饪建议**：  
  - 高草酸食物可通过**焯水**去除大部分草酸。  
  - 高草酸食物应与**富钙食物**（牛奶、豆干）搭配食用。  
  - **随餐补充钙剂**以减少草酸吸收。  
• **其他建议**：  
  - **不限制蔬菜水果总量**，但需注意草酸含量。  
  - 咖啡和茶可饮用，但**不宜太浓或过量**。  
  - **记录 3 天饮食清单**，由营养科医生指导。  

---

### 药物治疗及随访建议  
• **药物治疗**：需在**医师指导下**进行。  
• **随访建议**：  
  - 明确诊断后，每年 **1-2 次代谢评估**。  
  - 定期进行**结石影像学检查**（超声、CT）以评估疗效并调整方案。  

---

### 重点内容总结  
1. **诊断**：需基因检测明确是否为原发性高草酸尿。  
2. **饮食**：  
   - **多饮水**，限制高草酸食物，搭配富钙食物。  
   - **牛奶、橙汁**推荐，避免蔬菜汁。  
3. **随访**：定期代谢评估及影像学检查（超声/CT）。`;

// Markdown转HTML转换器现在使用外部工具函数

// 转换为HTML
function convertToHtml() {
	if (!markdownText.value.trim()) {
		ElMessage.warning('请输入Markdown文本');
		return;
	}

	try {
		htmlOutput.value = convertMarkdownToHtml(markdownText.value);
		ElMessage.success('转换成功！');
	} catch (error) {
		console.error('转换失败:', error);
		ElMessage.error('转换失败，请检查输入格式');
	}
}

// 清空输入
function clearInput() {
	markdownText.value = '';
	htmlOutput.value = '';
}

// 加载示例
function loadSample() {
	markdownText.value = sampleMarkdown;
	convertToHtml();
}

// 复制HTML到剪贴板
async function copyHtml() {
	if (!htmlOutput.value) {
		ElMessage.warning('没有可复制的HTML内容');
		return;
	}

	try {
		await navigator.clipboard.writeText(htmlOutput.value);
		ElMessage.success('HTML代码已复制到剪贴板');
	} catch (error) {
		console.error('复制失败:', error);
		ElMessage.error('复制失败');
	}
}

// 预览HTML效果
function previewHtml() {
	if (!htmlOutput.value) {
		ElMessage.warning('没有可预览的HTML内容');
		return;
	}
	previewVisible.value = true;
}
</script>

<style lang="scss" scoped>
.markdown-to-html-tool {
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;

	.tool-header {
		text-align: center;
		margin-bottom: 30px;

		h2 {
			color: #303133;
			margin-bottom: 10px;
		}

		.tool-description {
			color: #606266;
			font-size: 14px;
		}
	}

	.tool-content {
		display: flex;
		flex-direction: column;
		gap: 20px;

		.input-section,
		.output-section {
			.section-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10px;

				h3 {
					margin: 0;
					color: #303133;
					font-size: 16px;
				}

				.actions {
					display: flex;
					gap: 10px;
				}
			}

			.markdown-input,
			.html-output {
				:deep(.el-textarea__inner) {
					font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
					font-size: 13px;
					line-height: 1.5;
				}
			}
		}

		.convert-section {
			text-align: center;
			margin: 20px 0;

			.convert-btn {
				padding: 15px 40px;
				font-size: 16px;
				font-weight: bold;
			}
		}
	}
}

:deep(.html-preview) {
	padding: 20px;
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	background-color: #fafafa;
	max-height: 500px;
	overflow-y: auto;
	line-height: 1.6;

	h1,
	h2,
	h3 {
		color: #303133;
		margin: 16px 0 8px 0;
	}

	h1 {
		font-size: 24px;
	}
	h2 {
		font-size: 20px;
	}
	h3 {
		font-size: 18px;
	}

	p {
		margin: 8px 0;
		color: #606266;
	}

	strong {
		color: #409eff;
		font-weight: bold;
	}

	ul {
		padding-left: 20px;
		margin: 10px 0;

		li {
			margin: 5px 0;
			color: #606266;
		}
	}

	hr {
		border: none;
		height: 1px;
		background-color: #e4e7ed;
		margin: 20px 0;
	}
}

@media (max-width: 768px) {
	.markdown-to-html-tool {
		padding: 10px;

		.tool-content {
			.input-section,
			.output-section {
				.section-header {
					flex-direction: column;
					gap: 10px;
					align-items: flex-start;

					.actions {
						align-self: flex-end;
					}
				}
			}
		}
	}
}
</style>
