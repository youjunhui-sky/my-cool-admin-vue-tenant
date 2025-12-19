<template>
	<cl-crud ref="Crud" style="padding: 0px; background-color: transparent">
		<div class="split-layout-container">
			<!-- Upper Table Section -->
			<div class="upper-section">
				<lab
					ref="labRef"
					class="past-medical-table"
					:swlNo="swlNo"
					:serialNumber="serialNumber"
					:moduleCode="moduleCode"
					:patientNo="patientNo"
					:assessmentCount="assessmentCount"
					:onIndicatorUpdate="handleIndicatorUpdate"
				/>
			</div>

			<!-- Lower Section -->
			<div class="lower-section">
				<div class="lower-content">
					<!-- First row of tables and buttons -->
					<div class="tables-row">
						<!-- Analysis Button Section -->
						<div class="analysis-button-section">
							<el-button type="success" size="small" @click="onRefreshResult"
								>刷新</el-button
							>
							<el-button
								type="primary"
								size="small"
								class="analysis-btn"
								@click="onAnalysis"
								:loading="analysisLoading"
								:disabled="analysisLoading"
								>{{ analysisLoading ? '分析中...' : '智能分析' }}</el-button
							>
						</div>

						<!-- Table 2 with Evaluation Button -->
						<div class="table-group">
							<div class="table-with-button">
								<el-table
									ref="table2Ref"
									:data="tableData2"
									border
									style="width: 100%; height: 250px"
									:header-cell-style="{
										background: 'var(--el-fill-color-light)',
										color: 'var(--el-text-color-primary)',
										fontWeight: 'bold',
										padding: '2px'
									}"
									@selection-change="handleSelectionChange"
								>
									<el-table-column type="selection" width="40" align="center" />
									<el-table-column
										min-width="20%"
										prop="diagnosticCode"
										label="诊断编码"
										align="center"
									/>
									<el-table-column
										min-width="80%"
										prop="diagnosticName"
										label="诊断名称"
										align="center"
									/>
								</el-table>
								<!-- 操作按钮组 -->
								<div class="operation-buttons-table2">
									<el-button
										type="primary"
										size="small"
										@click="onMoveUp"
										:disabled="!hasSelectedRow"
										>上移</el-button
									>
									<el-button
										type="primary"
										size="small"
										@click="onMoveDown"
										:disabled="!hasSelectedRow"
										>下移</el-button
									>
									<el-button type="success" size="small" @click="onAdd"
										>新增</el-button
									>
									<el-button
										type="danger"
										size="small"
										@click="onDelete"
										:disabled="!hasSelectedRow"
										>删除</el-button
									>
									<el-button
										type="success"
										class="analysis-btn"
										@click="onTreatmentSuggestion"
										>生成防治建议</el-button
									>
								</div>
							</div>
						</div>

						<!-- Right side labels area -->
						<div class="table-group labels-group">
							<div class="labels-container">
								<!-- 第二个label：多行可滑动 -->
								<div class="details-section">
									<label class="section-label">诊疗建议</label>
									<div class="scrollable-details">
										<el-scrollbar height="240px">
											<div class="details-content">
												<div class="detail-item">
													{{ content.treatmentSuggestion }}
												</div>
											</div>
										</el-scrollbar>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Text input area - 三块布局 -->
					<div class="text-input-three-sections">
						<!-- 左侧：防治建议 -->
						<div class="left-textarea-section">
							<label class="textarea-label">防治建议</label>
							<div class="textarea-container">
								<el-scrollbar height="220px">
									<el-input
										v-model="content.guideSuggestion"
										type="textarea"
										:rows="20"
										placeholder="请输入防治建议..."
										class="scrollable-textarea"
									/>
								</el-scrollbar>
							</div>
						</div>

						<!-- 中间：四个按钮 -->
						<div class="middle-buttons-section">
							<el-button type="primary" @click="onAIOptimize" class="action-btn">
								<el-icon><edit-pen /></el-icon>
								AI整理
							</el-button>
							<el-button
								type="success"
								@click="onDirectAIGenerate"
								class="action-btn"
								:loading="aiGenerateLoading"
								:disabled="aiGenerateLoading"
							>
								<el-icon><magic-stick /></el-icon>
								{{ aiGenerateLoading ? '生成中...' : '直接AI生成' }}
							</el-button>
							<el-button type="warning" @click="onSave(true)" class="action-btn">
								<el-icon><document-checked /></el-icon>
								保存
							</el-button>
							<el-button type="info" @click="onPrint" class="action-btn">
								<el-icon><printer /></el-icon>
								打印报告
							</el-button>
						</div>

						<!-- 右侧：AI整理建议 -->
						<div class="right-textarea-section">
							<div class="textarea-header">
								<label class="textarea-label">AI整理建议</label>
								<div
									class="header-controls"
									v-if="
										content.aiGuideSuggestion &&
										content.aiGuideSuggestion.trim()
									"
								>
									<el-button
										@click="toggleRenderMode"
										size="small"
										type="text"
										class="mode-toggle-btn"
									>
										<el-icon
											><view v-if="!showRawContent" /><edit v-else
										/></el-icon>
										{{ showRawContent ? '预览' : '编辑' }}
									</el-button>
								</div>
							</div>
							<div class="textarea-container">
								<el-scrollbar height="220px">
									<div class="ai-suggestion-content">
										<!-- HTML渲染区域 -->
										<div
											v-if="
												!showRawContent &&
												content.aiGuideSuggestion &&
												content.aiGuideSuggestion.trim().startsWith('<')
											"
											v-html="content.aiGuideSuggestion"
											class="html-rendered-content"
										></div>
										<!-- 纯文本显示/编辑区域 -->
										<el-input
											v-else
											v-model="content.aiGuideSuggestion"
											type="textarea"
											:rows="20"
											placeholder="请输入整理建议..."
											class="scrollable-textarea"
										/>
									</div>
								</el-scrollbar>
							</div>
						</div>
					</div>

					<!-- Action buttons -->
					<div class="action-buttons">
						<!-- 保存按钮已移至上方按钮区域 -->
					</div>
				</div>
			</div>
		</div>
	</cl-crud>

	<!-- 诊断数据选择弹窗 -->
	<cl-form ref="DiagnosticSelectForm">
		<template #slot-diagnostic-table>
			<div style="display: flex; flex-direction: column; width: 100%">
				<el-table
					:data="diagnosticSelectData"
					style="width: 100%; height: 400px; margin-bottom: 0"
					highlight-current-row
					border
					:header-cell-style="{
						background: 'var(--el-fill-color-light)',
						color: 'var(--el-text-color-primary)',
						fontWeight: 'bold',
						padding: '2px'
					}"
					:row-class-name="getDiagnosticRowClassName"
					@current-change="handleDiagnosticRowClick"
				>
					<el-table-column
						prop="diagnosticCode"
						label="诊断编码"
						width="120"
						align="center"
					/>
					<el-table-column prop="diagnosticName" label="诊断名称" align="center" />
				</el-table>

				<div style="margin-top: 10px; color: #666; font-size: 12px; text-align: center">
					提示：点击表格行选择诊断数据
				</div>

				<div style="margin-top: 15px; display: flex; justify-content: center; width: 100%">
					<el-pagination
						v-model:current-page="diagnosticPagination.currentPage"
						v-model:page-size="diagnosticPagination.pageSize"
						:page-sizes="[5, 10, 20, 50]"
						:total="diagnosticPagination.total"
						layout="total, sizes, prev, pager, next, jumper"
						@current-change="handleDiagnosticPageChange"
						@size-change="handleDiagnosticPageSizeChange"
						size="small"
					/>
				</div>
			</div>
		</template>
	</cl-form>

	<!-- AI整理弹窗 -->
	<cl-form ref="AIOptimizeForm">
		<template #slot-ai-optimize-content>
			<div class="ai-optimize-dialog">
				<!-- 左侧：原始防治建议 -->
				<div class="left-section">
					<label class="section-label">原始防治建议</label>
					<div class="textarea-container">
						<el-scrollbar height="400px">
							<el-input
								v-model="aiOptimizeDialog.originalContent"
								type="textarea"
								:rows="25"
								placeholder="原始防治建议内容..."
								class="scrollable-textarea"
							/>
						</el-scrollbar>
					</div>
				</div>

				<!-- 中间：操作按钮 -->
				<div class="middle-section">
					<el-button
						type="primary"
						@click="onGenerateAIAdvice"
						class="optimize-btn"
						:loading="aiOptimizeDialog.generating"
						:disabled="aiOptimizeDialog.generating"
					>
						<el-icon><magic-stick /></el-icon>
						{{ aiOptimizeDialog.generating ? '生成中...' : '生成AI建议' }}
					</el-button>
					<el-button
						type="success"
						@click="onApplyOptimizedContent"
						class="optimize-btn"
						:disabled="!aiOptimizeDialog.optimizedContent"
					>
						<el-icon><check /></el-icon>
						引用
					</el-button>
				</div>

				<!-- 右侧：AI优化后的建议 -->
				<div class="right-section">
					<label class="section-label">AI优化建议</label>
					<div class="textarea-container">
						<cl-editor
							v-model="aiOptimizeDialog.optimizedContent"
							:height="400"
							:name="'cl-editor-wang'"
							placeholder="AI优化后的建议内容..."
							class="rich-text-editor"
						/>
					</div>
				</div>
			</div>
		</template>
	</cl-form>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, inject } from 'vue';
import { useCrud, useTable, useForm } from '@cool-vue/crud';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
	EditPen,
	MagicStick,
	Printer,
	DocumentChecked,
	Check,
	View,
	Edit
} from '@element-plus/icons-vue';
import { Plugins } from '/#/crud';
import { router, service } from '/@/cool';
import { useRoute } from 'vue-router';
import { analyzeResultValue } from '/$/swl/utils/labResultAnalysis';

import Lab from '/@/modules/etiology/views/mua/lab.vue';

import { convertToHtml } from '/@/modules/helper/utils/markdown-converter';

const content = reactive({
	id: 0,
	treatmentSuggestion: '',
	guideSuggestion: '',
	aiGuideSuggestion: ''
});

// 表格选择相关状态
const selectedRows = ref<DiagnosticData[]>([]);
const hasSelectedRow = computed(() => selectedRows.value.length > 0);
const table2Ref = ref();
const labRef = ref(); // Lab组件的引用

// 智能分析加载状态
const analysisLoading = ref(false);

// AI生成防治建议加载状态
const aiGenerateLoading = ref(false);

// AI建议内容渲染模式控制
const showRawContent = ref(false);

// 存储各项目编码对应的选项数据
const optionsMap = reactive<Record<string, Array<{ label: string; value: string }>>>({});
// Register CRUD components
const upTableData = ref<Eps.SwlLabResultDetailEntity[]>([]); // 使用Eps命名空间下的类型

// 诊断数据选择弹窗
const DiagnosticSelectForm = useForm();
const diagnosticSelectData = ref<Array<{ diagnosticCode: string; diagnosticName: string }>>([]);
const selectedDiagnosticRow = ref<{ diagnosticCode: string; diagnosticName: string } | null>(null);

// AI整理弹窗
const AIOptimizeForm = useForm();
const aiOptimizeDialog = reactive({
	originalContent: '',
	optimizedContent: '',
	generating: false
});

// 分页相关状态
const diagnosticPagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
});

interface ItemData {
	id: number;
	groupCode: string;
	groupName: string;
	itemCode: string;
	itemName: string;
	testTypeCode: string;
	testTypeName: string;
	resultValue: string;
	qualitativeResult: string;
	unit: string;
	referenceRange: string;
	testTime: string;
	// ... 其他数据类型定义
}

interface DiagnosticData {
	diagnosticCode: string;
	diagnosticName: string;
	analysisCode?: string;
	analysisName?: string;
}

interface MuaResultData {
	groupCode: string;
	groupName: string;
	itemCode: string;
	itemName: string;
	itemType: number;
	resultValue: string;
	resultJudgment: string;
	seq: number;
	description: string;
}
// 表格配置
const Table = useTable({
	props: {
		// 表头边距
		headerCellStyle: { padding: '2px' },
		rowStyle: { height: '20px' },
		cellStyle: { padding: '0' }, // 减小内边距也有助于控制行高
		rowClassName: ({ row }) => {
			// 根据qualitativeResult为行添加类名
			return row.qualitativeResult === '↓' || row.qualitativeResult === '↑'
				? 'abnormal-row'
				: '';
		}
	},
	columns: [
		{
			label: '检查项目',
			prop: 'groupName',
			minWidth: 60,
			showOverflowTooltip: true,
			formatter(row) {
				return row.groupName;
			}
		},
		{
			label: '项目编码',
			prop: 'itemCode',
			minWidth: 60,
			showOverflowTooltip: true,
			formatter(row) {
				return row.itemCode;
			}
		},
		{
			label: '项目名称',
			prop: 'itemName',
			minWidth: 120,
			align: 'left',
			showOverflowTooltip: true,
			formatter(row) {
				return row.itemName;
			}
		},
		{
			label: '结果值',
			prop: 'resultValue',
			minWidth: 120,
			slot: true // 使用插槽
		},
		{
			label: '异常提示',
			prop: 'qualitativeResult',
			minWidth: 60,
			slot: true, // 使用插槽进行自定义渲染
			edit: {
				enable: false
			}
		},
		{
			label: '单位',
			prop: 'unit',
			minWidth: 60
		},
		{
			label: '参考范围',
			prop: 'referenceRange',
			minWidth: 200
		},
		{
			label: '日期',
			prop: 'testTime',
			minWidth: 100
		},
		{
			type: 'op',
			buttons: []
		}
	],
	plugins: [Plugins.Table.rowEdit()]
});

const route = useRoute();
// 确保能获取到swlNo参数
//const swlNo = route.params.swlNo;
//const swlNo = route.query.swlNo as string;
//const serialNumber = route.query.serialNumber as string;
const moduleCode = 'mua3'; //特殊评估
//const patientNo = route.query.patientNo as string;
//const assessmentCount = parseInt(route.query.assessmentCount as string);

// 定义 props
const props = defineProps({
	id: {
		type: [Number, String],
		required: true
	},
	patientNo: {
		type: String,
		required: true
	},
	swlNo: {
		type: String,
		required: true
	},
	serialNumber: {
		type: String,
		required: true
	},
	assessmentCount: {
		type: Number,
		required: true
	}
});

// CRUD 配置
const Crud = useCrud({
	service: service.swl.lab
});

// 下方表格数据
const lowerTableData = ref([
	{
		date: '2024-03-20',
		name: '测试数据1',
		status: '启用'
	},
	{
		date: '2024-03-21',
		name: '测试数据2',
		status: '禁用'
	}
]);

// 表单数据
const formData = reactive({
	name: '',
	status: ''
});

// 诊断表格数据
const tableData2 = ref<DiagnosticData[]>([
	//{ diagnosticCode: '诊断编码1', diagnosticName: '诊断名称1' },
	//{ diagnosticCode: '诊断编码2', diagnosticName: '诊断名称2' }
]);

// 备注信息
const remarks = ref('');

// 右侧labels相关数据
const guidanceContent = ref('');
const detailItems = ref([
	{
		title: '检查项目详情',
		content:
			'这里显示详细的检查项目信息，包括各项指标的具体数值、参考范围、异常情况等详细说明。'
	},
	{
		title: '诊断分析',
		content: '基于检查结果进行的专业诊断分析，包括可能的疾病风险、健康状况评估等内容。'
	},
	{
		title: '历史对比',
		content: '与历史检查结果的对比分析，显示各项指标的变化趋势和改善情况。'
	},
	{
		title: '注意事项',
		content: '针对当前检查结果需要特别注意的事项，包括生活方式建议、复查时间等重要提醒。'
	},
	{
		title: '相关资料',
		content: '与当前检查相关的医学资料、参考文献、专业指南等补充信息。'
	},
	{
		title: '治疗方案',
		content: '根据当前检查结果制定的个性化治疗方案，包括药物治疗、物理治疗等建议。'
	}
]);

// 编辑
const onEdit = (row: any) => {
	ElMessage.success(`编辑行数据：${JSON.stringify(row)}`);
};

// 删除（原方法，保留用于其他地方）
const onDeleteRow = async (row: any) => {
	ElMessage.success(`删除行数据：${JSON.stringify(row)}`);
};

// 刷新
const onRefresh = () => {
	//Table.value?.reload();
};

// 提交表单
const onSubmit = () => {
	ElMessage.success(`提交的表单数据：${JSON.stringify(formData)}`);
};

// 重置表单
const onReset = () => {
	formData.name = '';
	formData.status = '';
};

// 按钮事件处理
const onSave = async (isSave: boolean = true) => {
	//取tableData2的数据
	const data = tableData2.value;
	let diagnosticName = '';
	if (data.length > 0) {
		for (const item of data) {
			diagnosticName += item.diagnosticName + ',';
		}
	}
	if (diagnosticName.length > 0) {
		diagnosticName = diagnosticName.substring(0, diagnosticName.length - 1);
	}

	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		assessmentType: moduleCode, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount,
		treatmentSuggestion: content.treatmentSuggestion,
		guideSuggestion: content.guideSuggestion,
		aiGuideSuggestion: content.aiGuideSuggestion,
		assessmentResult: diagnosticName
	};
	console.log('params:', params);
	try {
		const res = await service.etiology.mua.add(params);
		console.log('保存 MUA 记录:', res);
		//content.id = res.id; // 保存成功后更新id
		if (isSave) {
			ElMessage.success('评估信息保存成功');
		}
	} catch (error: any) {
		console.error('保存评估信息失败:', error);
		ElMessage.error('保存评估信息失败: ' + (error.message || '未知错误'));
	}
};

const onPrint = () => {
	//ElMessage.info('正在准备打印报告');
	//利用路由跳转，config.ts中定义的SQBLDetail路由
	router.push({
		path: '/etiology/mua/muaSpecialPrint',
		query: {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			assessmentType: moduleCode,
			patientNo: props.patientNo,
			assessmentCount: props.assessmentCount
		}
	});
};

// AI整理防治建议
const onAIOptimize = async () => {
	if (!content.guideSuggestion || content.guideSuggestion.trim().length === 0) {
		ElMessage.warning('请先输入防治建议内容');
		return;
	}

	// 设置弹窗数据
	aiOptimizeDialog.originalContent = content.guideSuggestion;
	aiOptimizeDialog.optimizedContent = '';
	aiOptimizeDialog.generating = false;

	// 打开弹窗
	AIOptimizeForm.value?.open({
		title: 'AI整理建议',
		width: '1200px',
		height: '600px',
		op: {
			hidden: true
		},
		items: [
			{
				prop: 'aiOptimizeContent',
				component: {
					name: 'slot-ai-optimize-content'
				}
			}
		],
		on: {
			submit(data, { close }) {
				// 弹窗确认时不需要特殊处理，因为引用按钮会处理应用逻辑
				close();
			}
		}
	});
};

// 直接AI生成防治建议
const onDirectAIGenerate = async () => {
	if (content.aiGuideSuggestion && content.aiGuideSuggestion.trim().length > 0) {
		try {
			await ElMessageBox.confirm(
				'已有AI整理建议内容，确定要直接AI生成新内容吗？',
				'AI生成确认',
				{
					confirmButtonText: 'AI生成',
					cancelButtonText: '取消',
					type: 'warning'
				}
			);
		} catch {
			ElMessage.info('已取消AI生成');
			return;
		}
	}

	if (content.guideSuggestion == null || content.guideSuggestion.trim().length == 0) {
		ElMessage.warning('请先输入指导建议');
		return;
	}

	// 开始生成，显示进度条
	aiGenerateLoading.value = true;

	try {
		const params = {
			prompt: content.guideSuggestion,
			system_prompt: content.guideSuggestion,
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

		//此处调用markdown工具
		const html = await convertToHtml(resultText);
		console.log('html:', html);

		// 将处理后的结果显示在右侧
		content.aiGuideSuggestion = html;

		ElMessage.success('AI建议生成成功');
		onSave(false);
	} catch (error: any) {
		console.error('生成AI建议失败:', error);
		ElMessage.error('生成AI建议失败: ' + (error.message || '未知错误'));

		// 如果API调用失败，可以显示模拟数据用于测试
		content.aiGuideSuggestion = ``;
	} finally {
		// 无论成功或失败，都要隐藏进度条
		aiGenerateLoading.value = false;
	}
};

// AI整理弹窗 - 生成AI建议
const onGenerateAIAdvice = async () => {
	if (!aiOptimizeDialog.originalContent || aiOptimizeDialog.originalContent.trim().length === 0) {
		ElMessage.warning('没有可优化的内容');
		return;
	}

	// 开始生成，显示进度条
	aiOptimizeDialog.generating = true;

	try {
		const params = {
			prompt: aiOptimizeDialog.originalContent,
			system_prompt:
				'请对以下医学指导建议进行AI整理和优化，使其更加清晰、专业、实用：' +
				aiOptimizeDialog.originalContent,
			temperature: 0.7
		};

		// 调用后台API接口
		const response = await service.etiology.muaItems.generateAdvice(params);

		// 解析返回结果
		let resultText = '';
		if (response && response.response) {
			resultText = response.response;
			if (resultText.startsWith('assistant:')) {
				resultText = resultText.substring('assistant:'.length).trim();
			}
		} else {
			resultText = response.data || response.result || response || '未获取到有效的AI优化内容';
		}

		//此处调用markdown工具
		const html = await convertToHtml(resultText);
		console.log('html:', html);

		// 将处理后的结果显示在右侧
		aiOptimizeDialog.optimizedContent = html;

		ElMessage.success('AI建议生成成功');
	} catch (error: any) {
		console.error('生成AI建议失败:', error);
		ElMessage.error('生成AI建议失败: ' + (error.message || '未知错误'));

		// 如果API调用失败，显示模拟优化内容
		aiOptimizeDialog.optimizedContent = `AI优化后的建议：\n\n${aiOptimizeDialog.originalContent}\n\n[此为模拟优化内容，请根据实际需要进行调整]`;
	} finally {
		// 无论成功或失败，都要隐藏进度条
		aiOptimizeDialog.generating = false;
	}
};

// AI整理弹窗
const onApplyOptimizedContent = async () => {
	if (!aiOptimizeDialog.originalContent || aiOptimizeDialog.originalContent.trim().length === 0) {
		ElMessage.warning('左边建议为空');
		return;
	}

	if (
		!aiOptimizeDialog.optimizedContent ||
		aiOptimizeDialog.optimizedContent.trim().length === 0
	) {
		ElMessage.warning('右边建议为空');
		return;
	}

	try {
		content.aiGuideSuggestion = aiOptimizeDialog.optimizedContent;
		ElMessage.success('引用成功');
		onSave(false);
		AIOptimizeForm.value.close();
	} catch (error: any) {
		console.error('引用失败:', error);
		ElMessage.error('引用失败: ' + (error.message || '未知错误'));

		// 如果API调用失败，可以显示模拟数据用于测试
		content.aiGuideSuggestion = ``;
	}
};

const onNext = () => {
	ElMessage.success('进入下一步');
};

// 切换AI建议显示模式
const toggleRenderMode = () => {
	showRawContent.value = !showRawContent.value;
};

//进页面就加载
onMounted(() => {
	//initMua();
	initMuaContent();
	initMuaAnalysis();
});

const initMuaAnalysis = async () => {
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: moduleCode, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	try {
		const data = await service.etiology.muaItems.getMuaAnalysis(params);
		console.log('data:', data);
		if (data.length > 0) {
			for (const item of data) {
				item.diagnosticCode = item.analysisCode;
				item.diagnosticName = item.analysisName;
			}
		}
		//将data赋值给upTableData
		tableData2.value = data;
	} catch (error: any) {
		console.error('initMuaAnalysis失败:', error);
		ElMessage.error('initMuaAnalysis失败: ' + (error.message || '未知错误'));
	}
};

const onAnalysis = async () => {
	//ElMessage.success('智能分析');
	// 显示确认提示框
	try {
		await ElMessageBox.confirm(`确定要智能分析吗？`, '智能分析确认', {
			confirmButtonText: '确定智能分析',
			cancelButtonText: '取消',
			type: 'warning',
			confirmButtonClass: 'el-button--danger'
		});
	} catch {
		// 用户取消智能分析
		ElMessage.info('已取消智能分析');
		return;
	}

	// 开始智能分析，显示进度条
	analysisLoading.value = true;

	//调用智能分析接口
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: moduleCode, //全面评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	try {
		const data = await service.etiology.muaItems.toMuaAnalysis(params);
		console.log('data:', data);
		if (data.length > 0) {
			for (const item of data) {
				item.diagnosticCode = item.analysisCode;
				item.diagnosticName = item.analysisName;
			}
		}
		//将data赋值给upTableData
		tableData2.value = data;
		ElMessage.success('智能分析完成');
	} catch (error: any) {
		console.error('智能分析失败:', error);
		ElMessage.error('智能分析失败: ' + (error.message || '未知错误'));
	} finally {
		// 无论成功或失败，都要隐藏进度条
		analysisLoading.value = false;
	}
};

const onTreatmentSuggestion = async () => {
	//ElMessage.success('防治建议');
	if (content.treatmentSuggestion != null && content.treatmentSuggestion.length > 0) {
		try {
			await ElMessageBox.confirm(
				`如果需要重新生成防治建议替换当前建议，请点击“确认”按钮`,
				'防治建议确认',
				{
					confirmButtonText: '重新生成防治建议',
					cancelButtonText: '取消',
					type: 'warning',
					confirmButtonClass: 'el-button--danger'
				}
			);
		} catch {
			// 用户取消防治建议
			ElMessage.info('已取消防治建议');
			return;
		}
	}

	//取tableData2的数据
	const data = tableData2.value;
	let diagnosticCode = '';
	if (data.length > 0) {
		for (const item of data) {
			diagnosticCode += "'" + item.diagnosticCode + "',";
		}
	}
	if (diagnosticCode.length > 0) {
		diagnosticCode = diagnosticCode.substring(0, diagnosticCode.length - 1);
	} else {
		return;
	}
	//调用防治建议接口
	const params = {
		diagnosticCode: diagnosticCode,
		patientNo: props.patientNo,
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: moduleCode,
		assessmentCount: props.assessmentCount
	};
	try {
		{
			const data = await service.etiology.muaItems.getMuaTreatment(params);
			console.log('data:', data);
			let advice = '';
			if (data != null && data.length > 0) {
				for (let i = 0; i < data.length; i++) {
					const item = data[i];
					advice += i + 1 + '、' + item.advice;
					if (i < data.length - 1) {
						advice += '\n';
					}
				}
			}
			content.treatmentSuggestion = advice;
		}

		{
			const data = await service.etiology.muaItems.getMuaGuide(params);
			console.log('data:', data);
			let advice = '';
			if (data != null && data.length > 0) {
				for (let i = 0; i < data.length; i++) {
					const item = data[i];
					advice += i + 1 + '、' + item.advice;
					if (i < data.length - 1) {
						advice += '\n';
					}
				}
			}
			content.guideSuggestion = advice;
		}
	} catch (error: any) {
		console.error('防治建议失败:', error);
		ElMessage.error('防治建议失败: ' + (error.message || '未知错误'));
	}
};

//初始化
const initMua = async () => {
	//获取swlNo
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: moduleCode, //简化评估
		assessmentCount: props.assessmentCount
	};
	//根据swlNo和serialNumber获取数据
	try {
		const data = await service.swl.lab.list(params);
		console.log('data:', data);
		//将data赋值给upTableData
		upTableData.value = data;
	} catch (error: any) {
		console.error('加载检验数据失败:', error);
		ElMessage.error('加载检验数据失败: ' + (error.message || '未知错误'));
	}
};

//获取评估内容
const initMuaContent = async () => {
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		assessmentType: moduleCode, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	try {
		const data = await service.etiology.mua.getMuaContent(params);
		console.log('data:', data);
		//将data赋值给upTableData
		if (data) {
			content.treatmentSuggestion = data.treatmentSuggestion;
			content.guideSuggestion = data.guideSuggestion;
		}
	} catch (error: any) {
		console.error('加载评估内容失败:', error);
		ElMessage.error('加载评估内容失败: ' + (error.message || '未知错误'));
	}
};

// 处理指标更新的回调函数
const handleIndicatorUpdate = async () => {
	console.log('收到指标更新通知');
	// 可以在这里添加其他需要更新的逻辑
};

// 表格选择变化处理
const handleSelectionChange = (selection: any[]) => {
	selectedRows.value = selection;
};

// 删除数据库记录
const deleteDatabaseRecords = async (deletedRows: DiagnosticData[]) => {
	try {
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: moduleCode,
			patientNo: props.patientNo,
			assessmentCount: props.assessmentCount,
			diagnosticData: deletedRows.map(item => ({
				diagnosticCode: item.diagnosticCode,
				diagnosticName: item.diagnosticName
			}))
		};

		console.log('删除数据:', params);
		// 调用删除接口，您需要根据实际后端接口调整
		await service.etiology.muaItems.deleteMuaAnalysis(params);

		// 临时注释掉实际API调用，避免报错
		// 实际使用时请根据后端接口调整方法名和参数
		console.log('删除API调用已注释，请根据实际后端接口实现');
	} catch (error: any) {
		console.error('删除数据库记录失败:', error);
		throw new Error('删除数据库记录失败: ' + (error.message || '未知错误'));
	}
};

// 更新数据库排序
const updateDatabaseOrder = async () => {
	try {
		// 为了同步排序到数据库，我们将当前排序的数据保存
		// 这里简化处理：直接保存当前的tableData2数据状态
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: moduleCode,
			patientNo: props.patientNo,
			assessmentCount: props.assessmentCount,
			diagnosticData: tableData2.value.map((item, index) => ({
				...item,
				sort: index + 1 // 添加排序字段
			}))
		};

		console.log('保存排序数据:', params);
		// 注释掉实际的API调用，避免报错，您需要根据实际后端接口调整
		await service.etiology.muaItems.updateMuaOrder(params);
	} catch (error: any) {
		console.error('更新排序失败:', error);
		ElMessage.error('更新排序失败: ' + (error.message || '未知错误'));
		throw error; // 重新抛出错误，让调用方知道操作失败
	}
};

// 上移操作
const onMoveUp = async () => {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning('请选择一行数据进行上移操作');
		return;
	}

	const selectedRow = selectedRows.value[0];
	const currentIndex = tableData2.value.findIndex(item => item === selectedRow);

	if (currentIndex <= 0) {
		ElMessage.warning('已经是第一行，无法上移');
		return;
	}

	// 交换位置
	const temp = tableData2.value[currentIndex];
	tableData2.value[currentIndex] = tableData2.value[currentIndex - 1];
	tableData2.value[currentIndex - 1] = temp;

	// 保持选中状态
	table2Ref.value.clearSelection();
	table2Ref.value.toggleRowSelection(selectedRow, true);

	// 同步到数据库
	try {
		await updateDatabaseOrder();
		ElMessage.success('上移成功');
	} catch (error) {
		// 如果数据库更新失败，回滚前端操作
		const temp = tableData2.value[currentIndex - 1];
		tableData2.value[currentIndex - 1] = tableData2.value[currentIndex];
		tableData2.value[currentIndex] = temp;

		table2Ref.value.clearSelection();
		table2Ref.value.toggleRowSelection(selectedRow, true);
	}
};

// 下移操作
const onMoveDown = async () => {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning('请选择一行数据进行下移操作');
		return;
	}

	const selectedRow = selectedRows.value[0];
	const currentIndex = tableData2.value.findIndex(item => item === selectedRow);

	if (currentIndex >= tableData2.value.length - 1) {
		ElMessage.warning('已经是最后一行，无法下移');
		return;
	}

	// 交换位置
	const temp = tableData2.value[currentIndex];
	tableData2.value[currentIndex] = tableData2.value[currentIndex + 1];
	tableData2.value[currentIndex + 1] = temp;

	// 保持选中状态
	table2Ref.value.clearSelection();
	table2Ref.value.toggleRowSelection(selectedRow, true);

	// 同步到数据库
	try {
		await updateDatabaseOrder();
		ElMessage.success('下移成功');
	} catch (error) {
		// 如果数据库更新失败，回滚前端操作
		const temp = tableData2.value[currentIndex + 1];
		tableData2.value[currentIndex + 1] = tableData2.value[currentIndex];
		tableData2.value[currentIndex] = temp;

		table2Ref.value.clearSelection();
		table2Ref.value.toggleRowSelection(selectedRow, true);
	}
};

// 打开诊断数据选择弹窗
const openDiagnosticSelectDialog = async () => {
	// 加载诊断数据
	await loadDiagnosticData();

	DiagnosticSelectForm.value?.open({
		title: '选择诊断数据',
		width: '800px',
		height: '600px',
		items: [
			{
				prop: 'diagnosticTable',
				component: {
					name: 'slot-diagnostic-table'
				}
			}
		],
		on: {
			submit(data, { close }) {
				if (!selectedDiagnosticRow.value) {
					ElMessage.warning('请选择一条诊断数据');
					return;
				}
				addDiagnosticToTable(selectedDiagnosticRow.value);
				close();
			}
		}
	});
};

// 加载诊断数据
const loadDiagnosticData = async (page = 1) => {
	try {
		diagnosticPagination.currentPage = page;

		// 这里应该调用获取诊断数据的接口
		// 暂时注释掉API调用，使用模拟数据
		// const response = await service.etiology.muaItems.getDiagnosticList({
		// 	moduleCode: moduleCode,
		// 	page: diagnosticPagination.currentPage,
		// 	size: diagnosticPagination.pageSize
		// });
		// diagnosticSelectData.value = response.list || [];
		// diagnosticPagination.total = response.pagination?.total || 0;

		const allData = await service.etiology.muaItems.getDiagnosticList({
			moduleCode: moduleCode
		});

		// 使用模拟数据模拟分页
		// const allData = [
		// 	{ diagnosticCode: 'D001', diagnosticName: '高血压病' },
		// 	{ diagnosticCode: 'D002', diagnosticName: '糖尿病' },
		// 	{ diagnosticCode: 'D003', diagnosticName: '冠心病' },
		// 	{ diagnosticCode: 'D004', diagnosticName: '脑卒中' },
		// 	{ diagnosticCode: 'D005', diagnosticName: '慢性肾病' },
		// 	{ diagnosticCode: 'D006', diagnosticName: '慢性支气管炎' },
		// 	{ diagnosticCode: 'D007', diagnosticName: '支气管哮喘' },
		// 	{ diagnosticCode: 'D008', diagnosticName: '肺炎' },
		// 	{ diagnosticCode: 'D009', diagnosticName: '胃炎' },
		// 	{ diagnosticCode: 'D010', diagnosticName: '胃溃疡' },
		// 	{ diagnosticCode: 'D011', diagnosticName: '肝炎' },
		// 	{ diagnosticCode: 'D012', diagnosticName: '肝硬化' },
		// 	{ diagnosticCode: 'D013', diagnosticName: '胆囊炎' },
		// 	{ diagnosticCode: 'D014', diagnosticName: '肾炎' },
		// 	{ diagnosticCode: 'D015', diagnosticName: '肾结石' },
		// 	{ diagnosticCode: 'D016', diagnosticName: '关节炎' },
		// 	{ diagnosticCode: 'D017', diagnosticName: '骨质疏松' },
		// 	{ diagnosticCode: 'D018', diagnosticName: '甲状腺功能亢进' },
		// 	{ diagnosticCode: 'D019', diagnosticName: '甲状腺功能减退' },
		// 	{ diagnosticCode: 'D020', diagnosticName: '贫血' }
		// ];

		diagnosticPagination.total = allData.length;
		const startIndex = (diagnosticPagination.currentPage - 1) * diagnosticPagination.pageSize;
		const endIndex = startIndex + diagnosticPagination.pageSize;
		diagnosticSelectData.value = allData.slice(startIndex, endIndex);
	} catch (error: any) {
		console.error('加载诊断数据失败:', error);
		// 使用模拟数据
		diagnosticSelectData.value = [
			{ diagnosticCode: 'D001', diagnosticName: '高血压病' },
			{ diagnosticCode: 'D002', diagnosticName: '糖尿病' },
			{ diagnosticCode: 'D003', diagnosticName: '冠心病' },
			{ diagnosticCode: 'D004', diagnosticName: '脑卒中' },
			{ diagnosticCode: 'D005', diagnosticName: '慢性肾病' }
		];
		diagnosticPagination.total = 5;
	}
};

// 处理表格行选择
const handleDiagnosticRowClick = (row: any) => {
	selectedDiagnosticRow.value = row;
};

// 获取诊断表格行样式类名
const getDiagnosticRowClassName = ({ row }: { row: any }) => {
	if (
		selectedDiagnosticRow.value &&
		selectedDiagnosticRow.value.diagnosticCode === row.diagnosticCode
	) {
		return 'selected-diagnostic-row';
	}
	return '';
};

// 分页事件处理
const handleDiagnosticPageChange = (page: number) => {
	selectedDiagnosticRow.value = null; // 切换页面时清空选择
	loadDiagnosticData(page);
};

const handleDiagnosticPageSizeChange = (pageSize: number) => {
	diagnosticPagination.pageSize = pageSize;
	diagnosticPagination.currentPage = 1; // 重置到第一页
	selectedDiagnosticRow.value = null; // 清空选择
	loadDiagnosticData(1);
};

// 添加诊断数据到表格并同步数据库
const addDiagnosticToTable = async (selectedRow: any) => {
	const newRow = {
		diagnosticCode: selectedRow.diagnosticCode,
		diagnosticName: selectedRow.diagnosticName,
		analysisCode: selectedRow.diagnosticCode,
		analysisName: selectedRow.diagnosticName
	};

	// 先添加到前端表格
	tableData2.value.push(newRow);

	try {
		// 同步到数据库
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: moduleCode,
			patientNo: props.patientNo,
			assessmentCount: props.assessmentCount,
			diagnosticData: [newRow]
		};

		console.log('新增诊断数据:', params);
		// 调用后端接口新增数据
		// await service.etiology.muaItems.addMuaAnalysis(params);
		// 暂时注释掉API调用，待后端接口开发完成后启用
		console.log('新增API调用已注释，请根据实际后端接口实现');

		// 更新排序
		await updateDatabaseOrder();

		ElMessage.success('新增诊断数据成功');
	} catch (error: any) {
		// 如果数据库操作失败，从前端表格中移除
		const index = tableData2.value.findIndex(
			item =>
				item.diagnosticCode === newRow.diagnosticCode &&
				item.diagnosticName === newRow.diagnosticName
		);
		if (index > -1) {
			tableData2.value.splice(index, 1);
		}

		console.error('新增诊断数据失败:', error);
		ElMessage.error('新增诊断数据失败: ' + (error.message || '未知错误'));
	}
};

// 新增操作
const onAdd = () => {
	// 打开诊断数据选择弹窗
	openDiagnosticSelectDialog();
};

// 删除操作
const onDelete = async () => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('请选择要删除的数据');
		return;
	}

	// 显示确认提示框
	try {
		await ElMessageBox.confirm(
			`确定要删除选中的 ${selectedRows.value.length} 条诊断数据吗？删除后不可恢复。`,
			'删除确认',
			{
				confirmButtonText: '确定删除',
				cancelButtonText: '取消',
				type: 'warning',
				confirmButtonClass: 'el-button--danger'
			}
		);
	} catch {
		// 用户取消删除
		ElMessage.info('已取消删除操作');
		return;
	}

	// 备份原始数据和选择状态，用于回滚
	const originalData = [...tableData2.value];
	const originalSelection = [...selectedRows.value];

	// 从后往前删除，避免索引变化问题
	const indicesToDelete = selectedRows.value
		.map(row => tableData2.value.findIndex(item => item === row))
		.sort((a, b) => b - a);

	const deletedRows: DiagnosticData[] = [];
	indicesToDelete.forEach(index => {
		if (index >= 0) {
			deletedRows.push(tableData2.value[index]);
			tableData2.value.splice(index, 1);
		}
	});

	// 清空选择
	table2Ref.value.clearSelection();
	selectedRows.value = [];

	try {
		// 同步删除操作到数据库
		await deleteDatabaseRecords(deletedRows);
		// 如果删除成功，更新剩余数据的排序
		await updateDatabaseOrder();
		ElMessage.success(`删除成功，共删除 ${indicesToDelete.length} 条数据`);
	} catch (error: any) {
		// 如果数据库操作失败，回滚前端操作
		tableData2.value = originalData;
		selectedRows.value = originalSelection;

		// 恢复表格选择状态
		originalSelection.forEach(row => {
			table2Ref.value.toggleRowSelection(row, true);
		});

		console.error('删除操作失败:', error);
		ElMessage.error('删除失败: ' + (error.message || '数据库操作失败'));
	}
};

/**
 * 刷新结果数据
 * 包括重新获取lab数据和刷新lab页面
 */
const onRefreshResult = async () => {
	try {
		// 1. 先刷新Lab组件的数据
		if (labRef.value && labRef.value.refreshLabData) {
			await labRef.value.refreshLabData();
			console.log('Lab数据刷新完成');
		}

		ElMessage.success('刷新成功');
	} catch (error: any) {
		console.error('刷新失败:', error);
		ElMessage.error('刷新失败: ' + (error.message || '未知错误'));
	}
};
</script>

<style lang="scss" scoped>
.split-layout-container {
	height: calc(100vh - 220px);
	display: flex;
	flex-direction: column;
	background-color: transparent;
	padding: 0px;
	gap: 3px;
	overflow-y: auto;

	.upper-section {
		height: 20vh;
		min-height: 360px;
		background-color: transparent;
		padding: 0px;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;
		display: flex;
		flex-direction: column;

		:deep(.cl-crud) {
			height: 100%;
			display: flex;
			flex-direction: column;

			.cl-table {
				flex: 1;
				overflow: hidden;
			}
		}
	}

	.lower-section {
		background-color: transparent;
		padding: 0px;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

		.lower-content {
			display: flex;
			flex-direction: column;
			gap: 10px;

			.tables-row {
				display: flex;
				gap: 10px;
				width: 100%;
				min-height: 200px;
				justify-content: flex-start;

				// 智能分析按钮区域
				.analysis-button-section {
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: flex-start;
					padding: 20px 10px;
					flex: 0 0 auto;
					min-height: 80px;
					gap: 4px;

					.el-button {
						height: 32px !important;
						font-size: 12px !important;
						padding: 0 16px !important;
						min-width: 80px;
						width: 80px !important; // 固定宽度确保对齐
						text-align: center !important; // 文字居中对齐
						justify-content: center !important; // 内容居中对齐
						margin: 0 !important; // 重置所有margin
						box-sizing: border-box !important; // 确保盒模型一致
						border: 1px solid transparent !important; // 确保边框一致
						display: flex !important; // 确保flex布局
						align-items: center !important; // 垂直居中

						// 刷新按钮特殊间距
						&:first-child {
							margin-bottom: 30px !important; // 刷新按钮下方增加更多间距
						}

						// 智能分析按钮样式
						&.analysis-btn {
							// 继承通用样式，不需要额外设置
						}

						// 确保按钮内的span元素也居中对齐
						:deep(span) {
							width: 100%;
							text-align: center;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}

				.table-group {
					min-width: 0;
					display: flex;
					flex-direction: column;
					height: 280px; // 设置统一高度

					&:nth-child(2) {
						flex: 0 0 calc(50% - 60px); // 表格占一半减去按钮空间
						max-width: calc(50% - 60px);
					} // 第二个表格占50%减去按钮空间
					&:nth-child(3) {
						flex: 1; // 占用剩余空间，确保右侧对齐
						max-width: none;
					} // 第三个区域（labels）占剩余空间

					.table-with-button {
						display: flex;
						flex-direction: row; // 改为水平排列
						gap: 10px;
						height: 100%;
						min-height: 200px;
						padding-top: 5px;
						// 改为顶部对齐，让按钮左对齐
						align-items: flex-start;

						.el-table {
							flex: 1;
							width: calc(
								100% - 130px
							) !important; // 减去按钮的宽度（120px + 10px gap）
							height: 250px !important;
							min-height: 250px !important;

							:deep(.el-table__inner-wrapper) {
								height: 100%;
							}

							// 控制单元格行高
							:deep(.el-table__cell) {
								padding: 2px 0px; // 减小单元格内边距
							}

							// 控制表头行高
							:deep(.el-table__header-row) {
								height: 26px;
							}

							// 控制内容行高
							:deep(.el-table__row) {
								height: 26px;
							}

							// 确保表格内容填充
							:deep(.el-table__body) {
								width: 100% !important;
							}

							// 确保表头填充
							:deep(.el-table__header) {
								width: 100% !important;
							}
						}

						// tableData2的操作按钮样式
						.operation-buttons-table2 {
							display: flex;
							flex-direction: column;
							gap: 4px;
							width: 120px; // 增加宽度以容纳"生成防治建议"按钮
							margin-right: 5px;
							margin-top: 0px; // 从顶部开始
							align-items: stretch; // 让所有按钮拉伸到相同宽度

							// 确保第一个按钮（上移）没有额外的margin
							> .el-button:first-child {
								margin-top: 0 !important;
							}

							.el-button {
								width: 100% !important;
								height: 28px !important;
								padding: 0 8px !important; // 添加左右内边距
								font-size: 12px !important;
								text-align: left !important; // 按钮文字左对齐
								justify-content: flex-start !important; // 按钮内容左对齐
								display: flex !important;
								align-items: center !important;
								margin: 0 !important; // 确保没有额外的margin
								border-radius: 4px !important; // 统一圆角
								box-sizing: border-box !important; // 确保盒模型一致

								// 确保按钮内的span元素也左对齐
								:deep(span) {
									width: 100%;
									text-align: left;
									display: flex;
									align-items: center;
									justify-content: flex-start;
								}
							}

							// 生成防治建议按钮特殊样式
							.analysis-btn {
								height: 32px !important;
								margin-top: 24px !important; // 与上面的按钮有更多间距
								margin-left: 0 !important;
								margin-right: 0 !important;
								margin-bottom: 0 !important;
							}
						}
					}

					// Labels组样式
					&.labels-group {
						.labels-container {
							height: 100%;
							display: flex;
							flex-direction: column;
							gap: 12px;
							padding: 8px;
							border: 1px solid var(--el-border-color-light);
							border-radius: 4px;
							background-color: var(--el-fill-color-blank);

							.guidance-section,
							.details-section {
								display: flex;
								flex-direction: column;
								gap: 6px;

								.section-label {
									font-size: 14px;
									font-weight: 600;
									color: var(--el-text-color-primary);
									margin: 0;
									padding: 0;
									line-height: 1.4;
								}
							}

							.guidance-section {
								flex: 0 0 auto;

								.guidance-textarea {
									:deep(.el-textarea__inner) {
										font-size: 13px;
										line-height: 1.5;
										border-radius: 4px;
										resize: none;
									}
								}
							}

							.details-section {
								flex: 1;
								min-height: 0;

								.scrollable-details {
									flex: 1;
									border: 1px solid var(--el-border-color-lighter);
									border-radius: 4px;
									background-color: white;

									:deep(.el-scrollbar) {
										height: 100%;

										.el-scrollbar__wrap {
											height: 100%;
										}

										.el-scrollbar__view {
											height: 100%;
										}
									}

									.details-content {
										padding: 8px;
										display: flex;
										flex-direction: column;
										gap: 12px;

										.input-section {
											flex: 0 0 auto;

											.guidance-input {
												:deep(.el-textarea__inner) {
													font-size: 13px;
													line-height: 1.5;
													border-radius: 4px;
													resize: none;
												}
											}
										}

										.detail-item {
											flex: 0 0 auto;
											padding: 8px;
											border: 1px solid var(--el-border-color-extra-light);
											border-radius: 4px;
											font-size: 14px;
											line-height: 1.5;
											color: var(--el-text-color-regular);
											white-space: pre-wrap;
											word-wrap: break-word;
											min-height: 100px;
										}
									}
								}
							}
						}
					}
				}
			}

			.text-input-row {
				width: 100%;
			}

			.action-buttons {
				display: flex;
				gap: 5px;
				justify-content: center;
				margin-top: 0px;
				margin-bottom: 0px;
			}
		}
	}
}

:deep(.el-select) {
	.el-select__wrapper {
		height: 26px;
		min-height: 26px;
	}

	.el-input {
		height: 24px; // 调整整体高度
		line-height: 24px;

		.el-input__wrapper {
			line-height: 24px;
			padding-top: 1px;
			padding-bottom: 1px;
		}

		.el-input__inner {
			height: 24px;
			line-height: 24px;
		}
	}

	.el-select__input {
		height: 18px !important;
		line-height: 18px !important;
		margin: 0;
		padding: 0;
	}
}

:deep(.el-table) {
	--el-table-border-color: var(--el-border-color-lighter);
	--el-table-border: 1px solid var(--el-table-border-color);
}

// 异常文本的显示
:deep(.result-abnormal) {
	color: #f56c6c; /* 使用Element Plus的红色 */
	font-weight: bold;
}

// 异常行的样式
:deep(.abnormal-row) {
	color: #f56c6c; /* 使用Element Plus的红色 */

	// 确保所有单元格都是红色
	td {
		color: #f56c6c !important;
	}

	// 确保select组件内的文字也是红色
	.el-select {
		.el-input {
			.el-input__wrapper {
				.el-input__inner {
					color: #f56c6c !important;
				}
			}
		}

		// 对于下拉选择框中当前选中的值
		.el-select__input {
			color: #f56c6c !important;
		}
	}

	// 直接选择所有input元素
	input {
		color: #f56c6c !important;
	}
}

// 诊断选择表格的选中行样式
:deep(.selected-diagnostic-row) {
	background-color: #409eff !important; // 使用Element Plus主色调
	color: white !important;

	td {
		background-color: #409eff !important;
		color: white !important;
	}

	&:hover {
		background-color: #337ecc !important; // 悬停时颜色更深

		td {
			background-color: #337ecc !important;
		}
	}
}

// 检验项目绑定管理弹窗样式
.lab-binding-container {
	display: flex;
	gap: 16px;
	height: 600px;
	padding: 16px;

	.left-table-container,
	.right-table-container {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--el-border-color-light);
		border-radius: 4px;
		overflow: hidden;

		.table-header {
			background: var(--el-fill-color-light);
			color: var(--el-text-color-primary);
			font-weight: bold;
			font-size: 14px;
			padding: 12px 16px;
			border-bottom: 1px solid var(--el-border-color-light);
			display: flex;
			align-items: center;

			.selected-group-info {
				color: var(--el-color-primary);
				font-weight: normal;
				margin-left: 8px;
			}
		}

		.search-conditions {
			padding: 12px 16px;
			background: var(--el-fill-color-lighter);
			border-bottom: 1px solid var(--el-border-color-light);

			.el-form {
				margin: 0;

				.el-form-item {
					margin-bottom: 8px;
					margin-right: 12px;

					&:last-child {
						margin-right: 0;
					}

					.el-form-item__label {
						font-size: 12px;
						color: var(--el-text-color-regular);
						font-weight: normal;
					}

					.el-input,
					.el-date-editor {
						.el-input__wrapper {
							height: 28px;
							font-size: 12px;
						}
					}

					.el-button {
						height: 28px;
						font-size: 12px;
						padding: 0 12px;
					}
				}
			}
		}
	}

	.left-table-container {
		flex: 0 0 35%;
		min-width: 350px;
	}

	.right-table-container {
		flex: 1;
		min-width: 0;

		.binding-actions {
			padding: 12px 16px;
			background: var(--el-fill-color-lighter);
			border-top: 1px solid var(--el-border-color-light);
			display: flex;
			gap: 8px;
			justify-content: flex-end;

			.el-button {
				height: 32px;
				font-size: 13px;
			}
		}
	}
}

// 检验项目组选中行样式
:deep(.selected-lab-group-row) {
	background-color: var(--el-color-primary-light-9) !important;
	color: var(--el-color-primary) !important;

	td {
		background-color: var(--el-color-primary-light-9) !important;
		color: var(--el-color-primary) !important;
	}

	&:hover {
		background-color: var(--el-color-primary-light-8) !important;

		td {
			background-color: var(--el-color-primary-light-8) !important;
		}
	}
}

// 三块布局样式
.text-input-three-sections {
	display: flex;
	gap: 16px;
	width: 100%;
	height: 280px;
	padding: 16px;
	background-color: var(--el-fill-color-blank);
	border: 1px solid var(--el-border-color-light);
	border-radius: 8px;
	margin-bottom: 16px;

	.left-textarea-section,
	.right-textarea-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;

		.textarea-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 0;

			.textarea-label {
				font-size: 14px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0;
				padding: 0;
				line-height: 1.4;
			}

			.header-controls {
				.mode-toggle-btn {
					height: 24px;
					padding: 0 8px;
					font-size: 12px;
					color: var(--el-color-primary);

					.el-icon {
						margin-right: 4px;
						font-size: 12px;
					}

					&:hover {
						background-color: var(--el-color-primary-light-9);
					}
				}
			}
		}

		.textarea-label {
			font-size: 14px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			margin: 0;
			padding: 0;
			line-height: 1.4;
		}

		.textarea-container {
			flex: 1;
			border: 1px solid var(--el-border-color-light);
			border-radius: 4px;
			background-color: white;
			overflow: hidden;

			:deep(.el-scrollbar) {
				height: 100%;

				.el-scrollbar__wrap {
					height: 100%;
				}

				.el-scrollbar__view {
					height: 100%;
				}
			}

			.scrollable-textarea {
				height: 100%;

				:deep(.el-textarea__inner) {
					height: 100% !important;
					min-height: 100% !important;
					max-height: none !important;
					resize: none !important;
					border: none !important;
					border-radius: 0 !important;
					padding: 12px !important;
					font-size: 14px;
					line-height: 1.5;
					background-color: transparent !important;
				}
			}
		}
	}

	.middle-buttons-section {
		flex: 0 0 140px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 12px;
		padding: 12px 8px;
		background-color: var(--el-fill-color-light);
		border: 1px solid var(--el-border-color-lighter);
		border-radius: 8px;

		.action-btn {
			width: 120px;
			height: 42px;
			padding: 0 8px;
			font-size: 13px;
			font-weight: 500;
			text-align: left !important;
			justify-content: flex-start !important;
			display: flex !important;
			align-items: center !important;
			gap: 6px;
			border-radius: 6px;
			transition: all 0.3s ease;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			margin: 0;
			box-sizing: border-box;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
			}

			&:active {
				transform: translateY(0);
			}

			.el-icon {
				font-size: 14px;
			}

			// 确保按钮内的span元素也左对齐
			:deep(span) {
				width: 100%;
				text-align: left;
				display: flex;
				align-items: center;
				justify-content: flex-start;
			}

			// 给保存按钮增加上边距，与直接AI生成按钮隔开
			&:nth-child(3) {
				margin-top: 8px;
			}
		}
	}
}

// AI整理弹窗样式
.ai-optimize-dialog {
	display: flex;
	gap: 16px;
	width: 100%;
	height: 500px;
	padding: 16px;

	.left-section,
	.right-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;

		.section-label {
			font-size: 14px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			margin: 0;
			padding: 0;
			line-height: 1.4;
		}

		.textarea-container {
			flex: 1;
			border: 1px solid var(--el-border-color-light);
			border-radius: 4px;
			background-color: white;
			overflow: hidden;

			:deep(.el-scrollbar) {
				height: 100%;

				.el-scrollbar__wrap {
					height: 100%;
				}

				.el-scrollbar__view {
					height: 100%;
				}
			}

			.scrollable-textarea {
				height: 100%;

				:deep(.el-textarea__inner) {
					height: 100% !important;
					min-height: 100% !important;
					max-height: none !important;
					resize: none !important;
					border: none !important;
					border-radius: 0 !important;
					padding: 12px !important;
					font-size: 14px;
					line-height: 1.5;
					background-color: transparent !important;
				}
			}
		}
	}

	.middle-section {
		flex: 0 0 140px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 24px;
		padding: 16px 8px;
		background-color: var(--el-fill-color-light);
		border: 1px solid var(--el-border-color-lighter);
		border-radius: 8px;

		.optimize-btn {
			width: 120px;
			height: 42px;
			padding: 0 8px;
			font-size: 13px;
			font-weight: 500;
			text-align: center !important;
			justify-content: center !important;
			display: flex !important;
			align-items: center !important;
			gap: 6px;
			border-radius: 6px;
			transition: all 0.3s ease;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			margin: 0;
			box-sizing: border-box;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
			}

			&:active {
				transform: translateY(0);
			}

			.el-icon {
				font-size: 14px;
			}

			// 确保按钮内的span元素也居中对齐
			:deep(span) {
				width: 100%;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
}

// AI建议内容渲染样式
.ai-suggestion-content {
	height: 100%;

	.html-rendered-content {
		height: 100%;
		padding: 12px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--el-text-color-primary);
		overflow-y: auto;

		// 标题样式
		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			color: var(--el-color-primary);
			margin: 16px 0 8px 0;
			font-weight: 600;
			line-height: 1.4;

			&:first-child {
				margin-top: 0;
			}
		}

		h1 {
			font-size: 20px;
			border-bottom: 2px solid var(--el-color-primary-light-7);
			padding-bottom: 8px;
		}

		h2 {
			font-size: 18px;
			border-bottom: 1px solid var(--el-color-primary-light-8);
			padding-bottom: 6px;
		}

		h3 {
			font-size: 16px;
			color: var(--el-color-primary-dark-2);
		}

		// 段落样式
		p {
			margin: 8px 0;
			text-align: justify;
			word-wrap: break-word;

			&:last-child {
				margin-bottom: 0;
			}
		}

		// 列表样式
		ul,
		ol {
			margin: 8px 0;
			padding-left: 20px;

			li {
				margin: 4px 0;
				line-height: 1.6;

				// 嵌套列表样式
				&[style*='margin-left'] {
					color: var(--el-text-color-regular);
					font-size: 13px;
					margin: 2px 0;

					&::before {
						content: '•';
						color: var(--el-color-primary);
						margin-right: 6px;
					}
				}
			}
		}

		// 粗体和强调样式
		strong,
		b {
			color: var(--el-color-primary);
			font-weight: 600;
		}

		em,
		i {
			color: var(--el-color-warning);
			font-style: italic;
		}

		// 水平线样式
		hr {
			border: none;
			height: 1px;
			background: linear-gradient(
				to right,
				transparent,
				var(--el-border-color-light),
				transparent
			);
			margin: 16px 0;
		}

		// 代码样式
		code {
			background-color: var(--el-fill-color-light);
			color: var(--el-color-danger);
			padding: 2px 4px;
			border-radius: 3px;
			font-family: 'Courier New', monospace;
			font-size: 13px;
		}

		pre {
			background-color: var(--el-fill-color-light);
			border: 1px solid var(--el-border-color-light);
			border-radius: 4px;
			padding: 12px;
			margin: 8px 0;
			overflow-x: auto;

			code {
				background: none;
				color: inherit;
				padding: 0;
			}
		}

		// 表格样式（如果需要）
		table {
			width: 100%;
			border-collapse: collapse;
			margin: 8px 0;

			th,
			td {
				border: 1px solid var(--el-border-color-light);
				padding: 6px 8px;
				text-align: left;
			}

			th {
				background-color: var(--el-fill-color-light);
				font-weight: 600;
				color: var(--el-text-color-primary);
			}
		}

		// 引用样式
		blockquote {
			border-left: 4px solid var(--el-color-primary);
			background-color: var(--el-fill-color-lighter);
			margin: 8px 0;
			padding: 8px 12px;
			font-style: italic;
			color: var(--el-text-color-regular);
		}

		// 链接样式
		a {
			color: var(--el-color-primary);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
				color: var(--el-color-primary-dark-2);
			}
		}

		// 医学专业术语高亮
		.medical-term {
			background-color: var(--el-color-success-light-9);
			color: var(--el-color-success-dark-2);
			padding: 2px 4px;
			border-radius: 3px;
			font-weight: 500;
		}

		// 重要提示样式
		.important-note {
			background-color: var(--el-color-warning-light-9);
			border-left: 4px solid var(--el-color-warning);
			padding: 8px 12px;
			margin: 8px 0;
			border-radius: 0 4px 4px 0;
		}

		// 数字和数据样式
		.number-highlight {
			color: var(--el-color-primary);
			font-weight: 600;
			background-color: var(--el-color-primary-light-9);
			padding: 1px 3px;
			border-radius: 2px;
		}
	}
}
</style>
