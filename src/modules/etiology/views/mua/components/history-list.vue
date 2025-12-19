<template>
	<div class="history-list-container">
		<div class="detail-content">
			<!-- 检验结果详情 -->
			<div class="detail-section">
				<div class="section-title">检验结果详情</div>
				<el-table
					:data="resultData"
					border
					style="width: 100%"
					:header-cell-style="{
						background: 'var(--el-fill-color-light)',
						color: 'var(--el-text-color-primary)',
						fontWeight: 'bold',
						padding: '2px'
					}"
					:row-class-name="getResultRowClassName"
				>
					<el-table-column
						min-width="25%"
						prop="groupName"
						align="center"
						label="检查项目"
					/>
					<el-table-column
						min-width="25%"
						prop="itemName"
						align="center"
						label="项目名称"
					/>
					<el-table-column
						min-width="40%"
						prop="description"
						align="center"
						label="主要结果"
					>
						<template #default="{ row }">
							<span v-html="formatDescription(row.description)"></span>
						</template>
					</el-table-column>
					<el-table-column min-width="10%" label="状态" align="center">
						<template #default="{ row }">
							<div class="status-icon-wrapper">
								<arrow-up
									width="18"
									height="18"
									color="#f56c6c"
									v-if="hasArrowUp(row.description)"
								/>
								<arrow-down
									width="18"
									height="18"
									color="#409eff"
									v-else-if="hasArrowDown(row.description)"
								/>
								<check width="18" height="18" color="#67c23a" v-else />
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- 诊断信息 -->
			<div class="detail-section">
				<div class="section-title">诊断信息</div>
				<div class="diagnostic-cards-container">
					<div
						v-for="(item, index) in diagnosticData"
						:key="index"
						class="diagnostic-card"
					>
						<div class="diagnostic-card-content">
							<div class="diagnostic-header-row">
								<div class="diagnostic-code-label">诊断编码</div>
								<div class="diagnostic-name-label">诊断名称</div>
							</div>
							<div class="diagnostic-value-row">
								<div class="diagnostic-code">
									{{ item.diagnosticCode || item.analysisCode }}
								</div>
								<div class="diagnostic-name">
									{{ item.diagnosticName || item.analysisName }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 诊疗建议和原始建议 -->
			<div class="detail-section">
				<div class="section-title">诊疗建议</div>
				<div class="suggestion-two-sections">
					<!-- 左侧：诊疗建议 -->
					<div class="left-suggestion-section">
						<div class="suggestion-label">诊疗建议</div>
						<div class="treatment-suggestion-area">
							<el-scrollbar>
								<div class="details-content">
									{{ treatmentSuggestion || '暂无诊疗建议' }}
								</div>
							</el-scrollbar>
						</div>
					</div>
					<!-- 右侧：原始建议 -->
					<div class="right-suggestion-section">
						<div class="suggestion-label">原始指导建议</div>
						<div class="original-suggestion-area">
							<el-scrollbar>
								<div class="details-content">
									{{ guideSuggestion || '暂无原始建议' }}
								</div>
							</el-scrollbar>
						</div>
					</div>
				</div>
			</div>

			<!-- 指导建议 -->
			<div class="detail-section">
				<div class="section-title">指导建议</div>
				<div class="guide-suggestion-area">
					<cl-editor-vditor
						:key="aiGuideSuggestionKey"
						v-model="aiGuideSuggestion"
						:height="600"
						:disabled="true"
						mode="wysiwyg"
						placeholder="指导建议内容..."
						class="editor-container"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
/**
 * 历史记录列表组件
 * @description 显示指定模块类型的检验结果详情、诊断信息、诊疗建议、原始建议和指导建议
 */
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowUp, ArrowDown, Check } from 'lucide-vue-next';
import { service } from '/@/cool';

// 定义 props
const props = defineProps({
	swlNo: {
		type: String,
		required: true
	},
	serialNumber: {
		type: String,
		required: true
	},
	patientNo: {
		type: String,
		required: true
	},
	moduleCode: {
		type: String,
		required: true
	},
	assessmentCount: {
		type: Number,
		required: true
	}
});

// 检验结果数据
const resultData = ref<any[]>([]);

// 诊断信息数据
const diagnosticData = ref<any[]>([]);

// 诊疗建议
const treatmentSuggestion = ref<string>('');

// 原始建议
const guideSuggestion = ref<string>('');

// 指导建议
const aiGuideSuggestion = ref<string>('');

// 用于强制重新渲染 vditor 编辑器的 key
const aiGuideSuggestionKey = ref(0);

/**
 * 加载详情数据
 */
const loadDetailData = async () => {
	try {
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: props.moduleCode,
			patientNo: props.patientNo,
			assessmentCount: props.assessmentCount
		};

		console.log('params:', JSON.stringify(params));

		// 加载检验结果数据
		try {
			const data = await service.etiology.muaItems.getMuaResult(params);
			resultData.value = data || [];
		} catch (error: any) {
			console.error('加载检验结果失败:', error);
			resultData.value = [];
		}

		// 加载诊断信息数据
		try {
			const data = await service.etiology.muaItems.getMuaAnalysis(params);
			if (data && data.length > 0) {
				diagnosticData.value = data.map((item: any) => ({
					diagnosticCode: item.analysisCode || item.diagnosticCode,
					diagnosticName: item.analysisName || item.diagnosticName
				}));
			} else {
				diagnosticData.value = [];
			}
		} catch (error: any) {
			console.error('加载诊断信息失败:', error);
			diagnosticData.value = [];
		}

		// 加载诊疗建议、原始建议和指导建议数据
		try {
			const contentParams = {
				swlNo: props.swlNo,
				serialNumber: props.serialNumber,
				assessmentType: props.moduleCode,
				patientNo: props.patientNo,
				assessmentCount: props.assessmentCount
			};
			const contentData = await service.etiology.mua.getMuaContent(contentParams);
			treatmentSuggestion.value = contentData?.treatmentSuggestion || '';
			guideSuggestion.value = contentData?.guideSuggestion || '';
			aiGuideSuggestion.value = contentData?.aiGuideSuggestion || '';

			// 更新 key 以强制重新渲染编辑器
			aiGuideSuggestionKey.value++;
		} catch (error: any) {
			console.error('加载建议数据失败:', error);
			treatmentSuggestion.value = '';
			guideSuggestion.value = '';
			aiGuideSuggestion.value = '';
		}
	} catch (error: any) {
		console.error('加载详情数据失败:', error);
		ElMessage.error('加载详情数据失败: ' + (error.message || '未知错误'));
	}
};

/**
 * 判断主要结果中是否包含向上箭头
 * @param description 主要结果文本
 * @returns 是否包含向上箭头
 */
const hasArrowUp = (description: string | undefined | null): boolean => {
	if (!description) return false;
	return description.includes('↑') || description.includes('▲');
};

/**
 * 判断主要结果中是否包含向下箭头
 * @param description 主要结果文本
 * @returns 是否包含向下箭头
 */
const hasArrowDown = (description: string | undefined | null): boolean => {
	if (!description) return false;
	return description.includes('↓') || description.includes('▼');
};

/**
 * 获取检验结果表格行的样式类名
 * @param row 行数据
 * @returns 样式类名
 */
const getResultRowClassName = ({ row }: { row: any }): string => {
	if (hasArrowUp(row.description)) {
		return 'result-row-arrow-up';
	} else if (hasArrowDown(row.description)) {
		return 'result-row-arrow-down';
	}
	return '';
};

/**
 * 格式化 description 字段显示
 * 将分号替换为 &nbsp;&nbsp;&nbsp;; 并删除最后一个分号
 * @param description 主要结果文本
 * @returns 格式化后的字符串
 */
const formatDescription = (description: string | undefined | null): string => {
	if (!description) return '';

	// 将分号替换为 &nbsp;&nbsp;&nbsp;;
	let formatted = description.replace(/;/g, '&nbsp;&nbsp;]&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;&nbsp;');
	formatted = '[&nbsp;&nbsp;' + formatted;

	// 删除最后一个分号（如果存在）
	if (formatted.endsWith('&nbsp;&nbsp;]&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;&nbsp;')) {
		formatted = formatted.slice(
			0,
			-'&nbsp;&nbsp;]&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;&nbsp;'.length
		);
	}
	formatted = formatted + '&nbsp;&nbsp;]';

	formatted = formatted.replace(/\[\&nbsp;&nbsp;&nbsp;&nbsp;]/g, '');
	return formatted;
};

// 监听 moduleCode 变化，重新加载数据
watch(
	() => props.moduleCode,
	() => {
		//loadDetailData();
	},
	{ immediate: true }
);

// 组件挂载时加载数据
onMounted(() => {
	loadDetailData();
});
</script>

<style lang="scss" scoped>
.history-list-container {
	display: flex;
	flex-direction: column;
	height: 100%;

	.detail-content {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 24px;

		.detail-section {
			display: flex;
			flex-direction: column;
			gap: 12px;

			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				padding-bottom: 8px;
				border-bottom: 1px solid var(--el-border-color-light);
			}

			// 检验结果详情表格样式
			:deep(.el-table) {
				width: 100%;

				.status-icon-wrapper {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					height: 100%;
				}

				// 向上箭头行样式 - 浅粉红背景
				.result-row-arrow-up {
					background-color: #ffeef0 !important;

					td {
						background-color: #ffeef0 !important;
					}

					&:hover {
						background-color: #ffe0e3 !important;

						td {
							background-color: #ffe0e3 !important;
						}
					}
				}

				// 向下箭头行样式 - 浅蓝背景
				.result-row-arrow-down {
					background-color: #e8f4fd !important;

					td {
						background-color: #e8f4fd !important;
					}

					&:hover {
						background-color: #d0e9fc !important;

						td {
							background-color: #d0e9fc !important;
						}
					}
				}
			}

			// 诊断卡片容器
			.diagnostic-cards-container {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 8px;
				padding: 8px 0;

				.diagnostic-card {
					padding: 12px 16px;
					border: 1px solid var(--el-border-color-light);
					border-radius: 4px;
					background-color: var(--el-bg-color);
					transition: all 0.2s ease;

					&:hover {
						border-color: var(--el-color-primary);
						box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
					}

					.diagnostic-card-content {
						display: flex;
						flex-direction: column;
						gap: 8px;

						.diagnostic-header-row {
							display: grid;
							grid-template-columns: auto 1fr;
							gap: 4px;
							font-size: 13px;
							color: var(--el-text-color-secondary);
							font-weight: 500;
						}

						.diagnostic-value-row {
							display: grid;
							grid-template-columns: auto 1fr;
							gap: 4px;
							padding-left: 0;
							text-align: left;
						}

						.diagnostic-code-label,
						.diagnostic-name-label {
							font-size: 13px;
							color: var(--el-text-color-secondary);
							font-weight: 500;
						}

						.diagnostic-code {
							font-size: 16px;
							font-weight: 600;
							color: var(--el-text-color-primary);
							text-align: left;
							padding-right: 8px;
						}

						.diagnostic-name {
							font-size: 16px;
							font-weight: 600;
							color: var(--el-text-color-primary);
							text-align: left;
						}
					}
				}
			}

			// 诊疗建议和原始建议并排布局
			.suggestion-two-sections {
				display: flex;
				flex-direction: row;
				gap: 12px;
				width: 100%;

				.left-suggestion-section,
				.right-suggestion-section {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 8px;
					min-width: 0;

					.suggestion-label {
						font-size: 14px;
						font-weight: 500;
						color: var(--el-text-color-primary);
					}
				}

				// 诊疗建议区域
				.treatment-suggestion-area {
					display: flex;
					flex-direction: column;
					gap: 8px;
					flex: 1;
					min-height: 200px;

					:deep(.el-scrollbar) {
						flex: 1;
						border: 1px solid var(--el-border-color-lighter);
						border-radius: 4px;
						background-color: white;

						.el-scrollbar__wrap {
							height: 100%;
						}

						.el-scrollbar__view {
							height: 100%;
						}
					}

					.details-content {
						padding: 12px;
						display: flex;
						flex-direction: column;
						gap: 12px;
						flex: 0 0 auto;
						font-size: 16px;
						line-height: 1.8;
						color: var(--el-text-color-regular);
						white-space: pre-wrap;
						word-wrap: break-word;
						word-break: break-word;
						background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1)) !important;
					}
				}

				// 原始建议区域
				.original-suggestion-area {
					display: flex;
					flex-direction: column;
					gap: 8px;
					flex: 1;
					min-height: 200px;

					:deep(.el-scrollbar) {
						flex: 1;
						border: 1px solid var(--el-border-color-lighter);
						border-radius: 4px;
						background-color: white;

						.el-scrollbar__wrap {
							height: 100%;
						}

						.el-scrollbar__view {
							height: 100%;
						}
					}

					.details-content {
						padding: 12px;
						display: flex;
						flex-direction: column;
						gap: 12px;
						flex: 0 0 auto;
						font-size: 16px;
						line-height: 1.8;
						color: var(--el-text-color-regular);
						white-space: pre-wrap;
						word-wrap: break-word;
						word-break: break-word;
						background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1)) !important;
					}
				}
			}

			// 指导建议区域
			.guide-suggestion-area {
				display: flex;
				flex-direction: column;
				gap: 8px;
				border: 1px solid var(--el-border-color-light);
				border-radius: 4px;
				background-color: white;
				overflow: hidden;
				min-height: 400px;

				.editor-container {
					flex: 1;
					display: flex;
					flex-direction: column;
					min-height: 0;

					:deep(.cl-editor-vditor) {
						display: flex;
						flex-direction: column;
						flex: 1 1 auto;
						min-height: 0;
						height: 100%;
						width: 100%;

						// 禁用状态下保持文字清晰可见
						&.disabled {
							opacity: 1 !important;

							:deep(.vditor) {
								opacity: 1 !important;
								background-color: var(--el-disabled-bg-color);

								// 确保所有内容区域文字清晰
								.vditor-content {
									opacity: 1 !important;

									.vditor-input,
									.vditor-preview {
										color: #303133 !important;
										opacity: 1 !important;
									}

									// 预览模式下的所有文字元素
									.vditor-preview {
										color: #303133 !important;
										opacity: 1 !important;

										// 覆盖所有可能的文字元素
										p,
										div,
										span,
										h1,
										h2,
										h3,
										h4,
										h5,
										h6,
										li,
										td,
										th,
										strong,
										em,
										a,
										code,
										pre,
										blockquote {
											color: #303133 !important;
											opacity: 1 !important;
										}

										// 确保所有子元素都清晰可见
										* {
											color: inherit !important;
											opacity: 1 !important;
										}
									}

									// 输入模式下的文字
									.vditor-input {
										color: #303133 !important;
										opacity: 1 !important;

										// 确保输入框内的所有文字清晰
										* {
											color: #303133 !important;
											opacity: 1 !important;
										}
									}
								}
							}
						}

						.vditor-container {
							flex: 1 1 auto;
							min-height: 0;
							height: 100%;
							width: 100%;
							display: flex;
							flex-direction: column;
						}

						.vditor {
							flex: 1 1 auto;
							min-height: 0;
							height: 100% !important;
							width: 100% !important;
							display: flex;
							flex-direction: column;
						}

						.vditor-toolbar {
							flex-shrink: 0;
							position: sticky !important;
							top: 0 !important;
							z-index: 100 !important;
							background-color: #fff;
							width: 100%;
						}

						.vditor-content {
							flex: 1 1 auto;
							min-height: 0;
							height: 100%;
							width: 100%;
							display: flex;
							flex-direction: column;
							overflow-y: auto;
							overflow-x: hidden;

							.vditor-input,
							.vditor-preview {
								flex: 1 1 auto;
								min-height: 0;
								height: 100%;
								width: 100%;
							}

							.vditor-content__left,
							.vditor-content__right {
								flex: 1 1 auto;
								min-height: 0;
								height: 100%;
								display: flex;
								flex-direction: column;
							}

							.vditor-content__left {
								.vditor-input {
									flex: 1 1 auto;
									min-height: 0;
									height: 100%;
								}
							}

							.vditor-content__right {
								.vditor-preview {
									flex: 1 1 auto;
									min-height: 0;
									height: 100%;
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>

<!-- 全局样式：确保禁用状态下编辑器文字清晰可见 -->
<style lang="scss">
// 针对 history-list 组件中的禁用编辑器，强制文字颜色清晰
.history-list-container {
	.guide-suggestion-area {
		.cl-editor-vditor.disabled {
			opacity: 1 !important;

			.vditor {
				opacity: 1 !important;
			}

			.vditor-content {
				opacity: 1 !important;

				// 覆盖所有内容区域，包括 WYSIWYG、预览、输入模式
				> * {
					opacity: 1 !important;
					color: #303133 !important;
				}

				// WYSIWYG 模式下的内容区域
				.vditor-wysiwyg,
				.vditor-content__left,
				.vditor-content__right {
					opacity: 1 !important;
					color: #303133 !important;

					// 覆盖所有可能的文字元素
					* {
						color: #303133 !important;
						opacity: 1 !important;
					}

					p,
					div,
					span,
					h1,
					h2,
					h3,
					h4,
					h5,
					h6,
					li,
					ul,
					ol,
					td,
					th,
					table,
					strong,
					em,
					b,
					i,
					a,
					code,
					pre,
					blockquote,
					hr {
						color: #303133 !important;
						opacity: 1 !important;
					}
				}

				// 预览模式
				.vditor-preview {
					opacity: 1 !important;
					color: #303133 !important;

					* {
						color: #303133 !important;
						opacity: 1 !important;
					}
				}

				// 输入模式
				.vditor-input {
					opacity: 1 !important;
					color: #303133 !important;

					* {
						color: #303133 !important;
						opacity: 1 !important;
					}
				}
			}
		}
	}
}
</style>
