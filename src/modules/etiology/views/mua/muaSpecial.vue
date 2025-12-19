<template>
	<cl-crud ref="Crud" style="padding: 0px; background-color: transparent">
		<div class="split-layout-container">
			<!-- Upper Table Section -->
			<div ref="upperSectionRef" class="upper-section">
				<lab
					ref="labRef"
					class="past-medical-table"
					:swlNo="props.swlNo"
					:serialNumber="props.serialNumber"
					:moduleCode="moduleCode"
					:patientNo="props.patientNo"
					:name="props.name"
					:outpatientNo="props.outpatientNo"
					:inpatientNo="props.inpatientNo"
					:assessmentCount="props.assessmentCount"
					:onIndicatorUpdate="handleIndicatorUpdate"
				/>
			</div>

			<!-- Lower Section -->
			<div ref="lowerSectionRef" class="lower-section">
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
								>{{ analysisLoading ? '分析中...' : '评估分析' }}</el-button
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
										min-width="40%"
										prop="diagnosticCode"
										label="诊断编码"
										align="center"
									/>
									<el-table-column
										min-width="60%"
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
										:loading="treatmentLoading"
										:disabled="treatmentLoading"
									>
										{{ treatmentLoading ? '生成中...' : '防治建议' }}
									</el-button>
								</div>
							</div>
						</div>

						<!-- Right side labels area -->
						<div class="table-group labels-group">
							<label class="section-label">诊疗建议</label>
							<el-scrollbar height="210px">
								<div class="details-content">
									{{ content.treatmentSuggestion }}
								</div>
							</el-scrollbar>
						</div>
					</div>

					<!-- Text input area - 两块布局 -->
					<div class="text-input-two-sections">
						<!-- 左侧：防治建议 -->
						<div class="left-textarea-section">
							<div class="left-header">
								<label class="textarea-label">防治建议</label>
								<div class="header-buttons">
									<el-button v-if="aiFlag" type="primary" @click="onAIOptimize">
										AI整理
									</el-button>

									<!-- <el-button
										type="success"
										@click="onDirectAIGenerate"
										class="action-btn"
										:loading="aiGenerateLoading"
										:disabled="aiGenerateLoading"
									>
										<el-icon><magic-stick /></el-icon>
										{{ aiGenerateLoading ? '生成中...' : '直接AI生成' }}
									</el-button> -->
									<el-button type="warning" @click="onSave(true)">
										保存
									</el-button>
									<el-button type="info" @click="onPrint"> 打印报告 </el-button>
								</div>
							</div>
							<div class="textarea-container">
								<el-scrollbar height="210px">
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
											placeholder="请输入防治建议..."
											class="scrollable-textarea"
										/>
									</div>
								</el-scrollbar>
							</div>
						</div>
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
				<!-- 上方：原始防治建议 -->
				<div class="top-section">
					<label class="section-label">原始防治建议</label>
					<div class="textarea-container">
						<el-scrollbar height="120px">
							<el-input
								v-model="aiOptimizeDialog.originalContent"
								type="textarea"
								:rows="5"
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
						@click="onApplyOriginalContent"
						class="optimize-btn"
						:disabled="!aiOptimizeDialog.originalContent"
					>
						引用原始建议
					</el-button>
					<el-button
						type="success"
						@click="onApplyOptimizedContent"
						class="optimize-btn"
						:disabled="!aiOptimizeDialog.optimizedContent"
					>
						引用AI建议
					</el-button>
					<el-button type="warning" @click="onApplyClose" class="optimize-btn">
						关闭
					</el-button>
				</div>

				<!-- 下方：AI优化后的建议 -->
				<div class="bottom-section">
					<!-- <label class="section-label">AI优化建议</label> -->
					<div class="textarea-container">
						<cl-editor
							v-model="aiOptimizeDialog.optimizedContent"
							:height="500"
							:name="'cl-editor-wang'"
							placeholder="AI优化后的建议内容..."
							class="rich-text-editor"
						/>
					</div>
				</div>
			</div>
		</template>
	</cl-form>

	<!-- 打印内容组件 -->
	<print-content
		v-if="showPrintContent"
		:key="printKey"
		ref="printContentRef"
		:swlNo="props.swlNo"
		:serialNumber="props.serialNumber"
		:moduleCode="moduleCode"
		:patientNo="props.patientNo"
		:assessmentCount="String(props.assessmentCount)"
	/>

	<!-- 打印进度条 -->
	<el-dialog
		v-model="printProgressVisible"
		title="打印进度"
		width="400px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:show-close="false"
		center
	>
		<div class="print-progress-container">
			<div class="progress-text">{{ printProgressText }}</div>
			<el-progress
				:percentage="printProgress"
				:stroke-width="20"
				:show-text="false"
				:color="printProgress === 100 ? '#67c23a' : '#409eff'"
			/>
			<div class="progress-percentage">{{ printProgress }}%</div>
		</div>
	</el-dialog>

	<!-- 在 template 的最后，</template> 标签之前添加 -->
	<!-- PDF预览弹框 -->
	<el-dialog
		v-model="printPreviewVisible"
		title="PDF预览"
		width="90%"
		:fullscreen="true"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<div class="pdf-preview-container">
			<!-- 操作按钮区域 -->
			<div class="pdf-actions">
				<!-- <el-button type="primary" @click="downloadPDF" :disabled="!pdfUrl">
					<el-icon><document /></el-icon>
					下载PDF
				</el-button> -->
				<el-button type="success" @click="printPDF" :disabled="!pdfUrl">
					<el-icon><printer /></el-icon>
					打印PDF
				</el-button>
				<el-button @click="printPreviewVisible = false">
					<el-icon><close /></el-icon>
					关闭
				</el-button>
			</div>

			<!-- PDF预览区域 -->
			<div v-if="pdfUrl" class="pdf-preview">
				<iframe
					:src="pdfUrl"
					width="100%"
					height="100%"
					frameborder="0"
					allowfullscreen
					type="application/pdf"
					title="PDF预览"
				>
				</iframe>
			</div>

			<!-- 加载状态 -->
			<div v-else-if="pdfLoading" class="pdf-loading">
				<el-icon class="is-loading" size="48"><loading /></el-icon>
				<p>正在生成PDF，请稍候...</p>
			</div>

			<!-- 错误状态 -->
			<div v-else class="pdf-error">
				<el-icon size="48" color="#f56c6c"><circle-close /></el-icon>
				<p>PDF生成失败，请重试</p>
			</div>
		</div>
	</el-dialog>
</template>

<script lang="ts" setup>
/**
 * 全面评估组件
 * @description 代谢性尿路结石病因学评估 - 全面评估
 */
defineOptions({
	name: 'mua-special'
});

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
	name: {
		type: String,
		required: true,
		default: ''
	},
	outpatientNo: {
		type: String,
		required: false,
		default: ''
	},
	inpatientNo: {
		type: String,
		required: false,
		default: ''
	},
	assessmentCount: {
		type: Number,
		required: true
	},
	id: {
		type: Number,
		required: true
	}
});

////console.log('props=================:', props);

// 定义组件 emits
defineEmits<{
	(e: 'update:modelValue', value: any): void;
}>();

import { ref, reactive, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import { useCrud, useTable, useForm } from '@cool-vue/crud';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
	EditPen,
	MagicStick,
	Printer,
	DocumentChecked,
	Check,
	View,
	Edit,
	Document,
	Close,
	Loading,
	CircleClose
} from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { Plugins } from '/#/crud';
import { router, service } from '/@/cool';
import { useRoute } from 'vue-router';
import { analyzeResultValue } from '/$/swl/utils/labResultAnalysis';

import Lab from '/@/modules/etiology/views/mua/lab.vue';
import PrintContent from './components/mua-special-print-content.vue';

//import { convertToHtml } from '/@/modules/helper/utils/markdown-converter';
import { markdownToHTML } from '/@/modules/helper/utils/markdown-converter-github';

// 浏览器兼容的 base64 编码/解码函数
const base64Encode = (str: string): string => {
	return btoa(unescape(encodeURIComponent(str)));
};

const base64Decode = (str: string): string => {
	return decodeURIComponent(escape(atob(str)));
};

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

// 智能分析加载状态
const analysisLoading = ref(false);

// AI整理防治建议加载状态
const aiGenerateLoading = ref(false);

// 防治建议生成加载状态
const treatmentLoading = ref(false);

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

// 打印预览相关
const printPreviewVisible = ref(false);
const pdfLoading = ref(false);
const pdfUrl = ref('');
const pdfBlob = ref<Blob | null>(null);
const printContentRef = ref<InstanceType<typeof PrintContent>>();
const showPrintContent = ref(false);
const printKey = ref(0);

// 打印进度相关
const printProgress = ref(0);
const printProgressVisible = ref(false);
const printProgressText = ref('准备中...');

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
			//隐藏
			hidden: true,
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
// const swlNo = route.params.swlNo;
// const serialNumber = route.params.serialNumber;
const moduleCode = 'mua3'; //特殊评估
// const patientNo = route.query.patientNo as string;
// const assessmentCount = parseInt(route.query.assessmentCount as string);

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

// 三个表格的数据
const tableData1 = ref<MuaResultData[]>([]);
// const tableData1 = ref([
// 	{ item: '项目1', value: '数值1' },
// 	{ item: '项目2', value: '数值2' }
// ]);

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
const onSave = async (isSave: boolean) => {
	//ElMessage.success('保存成功');

	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		assessmentType: moduleCode, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount,
		aiGuideSuggestion: content.aiGuideSuggestion,
		treatmentSuggestion: content.treatmentSuggestion
	};
	////console.log('params:', params);
	try {
		const res = await service.etiology.mua.add(params);
		////console.log('保存 MUA 记录:', res);
		//content.id = res.id; // 保存成功后更新id
		if (isSave) {
			ElMessage.success('评估信息保存成功');
		}
	} catch (error: any) {
		console.error('保存评估信息失败:', error);
		ElMessage.error('保存评估信息失败: ' + (error.message || '未知错误'));
	}
};

const onPrint = async () => {
	// 检查组件状态
	if (printProgressVisible.value) {
		////console.log('打印进度条已显示，忽略重复点击');
		return;
	}

	// 显示打印进度条
	printProgressVisible.value = true;
	printProgress.value = 0;
	printProgressText.value = '准备打印内容...';

	// 每次打印前强制重建打印内容组件，确保重新取数
	showPrintContent.value = false;
	printKey.value++;
	await nextTick();
	showPrintContent.value = true;

	// 等待组件完全挂载和数据加载完成
	try {
		// 等待组件挂载
		await nextTick();

		// 等待更长时间确保组件完全渲染
		await new Promise(resolve => setTimeout(resolve, 500));

		// 再次等待下一个tick
		await nextTick();

		// 检查组件引用是否存在
		if (!printContentRef.value) {
			console.error('打印内容组件引用未找到，等待更长时间...');
			await new Promise(resolve => setTimeout(resolve, 1000));
			await nextTick();
		}

		// 最终检查
		if (!printContentRef.value) {
			ElMessage.error('打印内容组件加载失败，请重试');
			return;
		}

		// 显示打印进度条
		printProgressVisible.value = true;
		printProgress.value = 0;
		printProgressText.value = '准备打印内容...';

		// 打开打印预览弹框
		openPrintPreviewDialog();
	} catch (error) {
		console.error('等待打印组件挂载时出错:', error);
		ElMessage.error('打印组件加载失败，请重试');
	}
};

// AI整理防治建议
const onAIOptimize = async () => {
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		assessmentType: moduleCode,
		assessmentCount: props.assessmentCount
	};
	// 使用正确的service路径获取患者信息
	const data = await service.etiology.info.findBySwlNo(params);

	if (data) {
		// 设置弹窗数据
		aiOptimizeDialog.originalContent = data.guideSuggestion;
		aiOptimizeDialog.optimizedContent = data.aiGuideSuggestion;
	}

	if (data.guideSuggestion == null || data.guideSuggestion == '') {
		ElMessage.warning('没有匹配到防治建议');
	}

	aiOptimizeDialog.generating = false;

	// 打开弹窗
	AIOptimizeForm.value?.open({
		title: 'AI整理建议',
		width: '100%',
		height: '100%',
		dialog: {
			padding: '8px',
			// 默认最大化
			fullscreen: true
		},
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
			await ElMessageBox.confirm('已有AI建议内容，确定要直接AI生成新内容吗？', 'AI生成确认', {
				confirmButtonText: 'AI生成',
				cancelButtonText: '取消',
				type: 'warning'
			});
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
		// const response = await service.etiology.muaItems.generateAdvice(params);
		// 暂时使用模拟数据，请根据实际后端接口调整
		const response = {
			response:
				'基于您提供的指导建议，AI生成的防治建议内容将在这里显示。请根据实际需要调整AI接口调用。'
		};

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
			resultText = typeof response === 'string' ? response : '未获取到有效的AI建议内容';
		}

		//此处调用markdown工具
		const html = await markdownToHTML(resultText);
		//console.log('html:', html);

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

// AI生成弹窗 - 生成AI建议
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
		// const response = await service.etiology.muaItems.generateAdvice(params);
		// 暂时使用模拟数据，请根据实际后端接口调整
		const response = {
			response:
				'基于您提供的原始建议，AI优化后的防治建议内容将在这里显示。请根据实际需要调整AI接口调用。'
		};

		// 解析返回结果
		let resultText = '';
		if (response && response.response) {
			resultText = response.response;
			if (resultText.startsWith('assistant:')) {
				resultText = resultText.substring('assistant:'.length).trim();
			}
		} else {
			resultText = typeof response === 'string' ? response : '未获取到有效的AI优化内容';
		}

		//此处调用markdown工具
		const html = await markdownToHTML(resultText);
		//console.log('html:', html);

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

// 引用原始建议
const onApplyOriginalContent = async () => {
	if (!aiOptimizeDialog.originalContent || aiOptimizeDialog.originalContent.trim().length === 0) {
		ElMessage.warning('原始建议为空');
		return;
	}

	try {
		content.aiGuideSuggestion = aiOptimizeDialog.originalContent;
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

// 引用AI建议
const onApplyOptimizedContent = async () => {
	if (
		!aiOptimizeDialog.optimizedContent ||
		aiOptimizeDialog.optimizedContent.trim().length === 0
	) {
		ElMessage.warning('AI建议为空');
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

const onApplyClose = () => {
	AIOptimizeForm.value.close();
};

const onNext = () => {
	ElMessage.success('进入下一步');
};

// 切换AI建议显示模式
const toggleRenderMode = () => {
	showRawContent.value = !showRawContent.value;
};

const aiFlag = ref(false);

//进页面就加载
onMounted(async () => {
	//initMua();
	await initMuaResult();
	await initMuaContent();
	await initMuaAnalysis();

	const aiEnable = await service.base.sys.param.data({
		key: 'aiEnable'
	});
	//console.log('aiEnable:', aiEnable);
	if (aiEnable == '1') {
		aiFlag.value = true;
	} else {
		aiFlag.value = false;
	}

	// 设置初始高度
	if (upperSectionRef.value) {
		upperSectionRef.value.style.setProperty('height', '200px', 'important');
	}

	// 延迟执行，确保 lab 组件已经完全渲染
	setTimeout(() => {
		observeLabHeight();
	}, 200);

	// 监听 lab 组件的高度变化事件
	window.addEventListener('lab-height-change', (event: any) => {
		const {
			height,
			activePanels,
			buttonHeight,
			suggestedHeight,
			hasExpandedPanels,
			expandedPanelCount
		} = event.detail;
		if (upperSectionRef.value) {
			// 使用 lab 组件建议的高度，如果没有则使用默认逻辑
			const targetHeight = suggestedHeight || (hasExpandedPanels ? 360 : 200);
			//console.log('设置 upper-section 高度为:', targetHeight);

			// 设置高度，使用 !important 确保覆盖其他样式
			upperSectionRef.value.style.setProperty('height', `${targetHeight}px`, 'important');

			// 验证高度是否设置成功
			setTimeout(() => {
				const actualHeight = upperSectionRef.value?.offsetHeight;
				const computedHeight = window.getComputedStyle(upperSectionRef.value!).height;
				const inlineStyle = upperSectionRef.value?.style.height;
				//console.log('高度设置验证:', {
				// 	targetHeight,
				// 	actualHeight,
				// 	computedHeight,
				// 	inlineStyle,
				// 	hasImportant: upperSectionRef.value?.style.getPropertyValue('height')
				// });
			}, 50);

			// 确保 lower-section 能够正确跟随
			if (lowerSectionRef.value) {
				const lowerSectionRect = lowerSectionRef.value.getBoundingClientRect();
				//console.log('lower-section 位置已更新，跟随 upper-section 变化:', {
				// 	top: lowerSectionRect.top,
				// 	height: lowerSectionRect.height,
				// 	upperSectionHeight: targetHeight
				// });
			}

			// //console.log('收到lab高度变化事件:', {
			// 	height,
			// 	activePanels,
			// 	buttonHeight,
			// 	targetHeight,
			// 	hasExpandedPanels,
			// 	expandedPanelCount,
			// 	suggestedHeight,
			// 	upperSectionHeight: upperSectionRef.value?.style.height
			// });
		}
	});
});

// 监听门诊号/住院号变化，页面已打开时也能即时刷新
watch(
	() => [props.outpatientNo, props.inpatientNo],
	async () => {
		try {
			// 刷新Lab数据
			if (labRef.value && labRef.value.refreshLabData) {
				await labRef.value.refreshLabData();
			}
			// 重新拉取本页相关数据
			await initMuaResult();
			await initMuaContent();
			await initMuaAnalysis();
		} catch (e) {}
	}
);

// 组件卸载时清理事件监听器
onUnmounted(() => {
	window.removeEventListener('lab-height-change', () => {});
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
		//console.log('data:', data);
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
		await ElMessageBox.confirm(`评估分析前请核对关键项目，确保数据准确无误！`, '评估分析', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			confirmButtonClass: 'el-button--danger'
		});
	} catch {
		// 用户取消智能分析
		ElMessage.info('已取消评估分析');
		return;
	}

	// 开始智能分析，显示进度条
	analysisLoading.value = true;

	//调用智能分析接口
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: moduleCode, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	try {
		const data = await service.etiology.muaItems.toMuaAnalysis(params);
		//console.log('data:', data);
		if (data.length > 0) {
			for (const item of data) {
				item.diagnosticCode = item.analysisCode;
				item.diagnosticName = item.analysisName;
			}
		} else {
			ElMessage.warning('评估分析完成，没有匹配到诊断');
			return;
		}
		//将data赋值给upTableData
		tableData2.value = data;
		ElMessage.success('评估分析完成');
	} catch (error: any) {
		console.error('评估分析失败:', error);
		ElMessage.error('评估分析失败: ' + (error.message || '未知错误'));
	} finally {
		// 无论成功或失败，都要隐藏进度条
		analysisLoading.value = false;
	}
};

const onTreatmentSuggestion = async () => {
	//ElMessage.success('防治建议');
	try {
		let diagFlag = false; //是否诊断为空
		let guideSuggestionFlag = false; //是否指导建议为空
		let clear = false; //是否清空防治建议
		//取tableData2的数据
		const data = tableData2.value;
		let diagnosticCode = '';
		let diagnosticName = '';
		if (data.length > 0) {
			for (const item of data) {
				diagnosticCode += "'" + item.diagnosticCode + "',";
				diagnosticName += item.diagnosticName + ',';
			}
		}
		if (diagnosticCode.length > 0) {
			diagnosticCode = diagnosticCode.substring(0, diagnosticCode.length - 1);
			diagnosticName = diagnosticName.substring(0, diagnosticName.length - 1);
		} else {
			diagFlag = true;
		}
		if (
			content.aiGuideSuggestion == '' ||
			content.aiGuideSuggestion == null ||
			content.aiGuideSuggestion.length === 0
		) {
			guideSuggestionFlag = true;
		}
		//如果诊断为空，且指导建议为空，则直接返回
		if (diagFlag && guideSuggestionFlag) {
			ElMessage.success('当前无评估结果，请完善数据集或手工记录防治建议');
			return;
		} else if (diagFlag && !guideSuggestionFlag) {
			//如果诊断为空，且指导建议不为空，则提示用户是否清空防治建议
			try {
				await ElMessageBox.confirm(
					`当前评估结果为空，是否清空当前防治建议？`,
					'防治建议确认',
					{
						confirmButtonText: '确认',
						cancelButtonText: '取消',
						type: 'warning',
						confirmButtonClass: 'el-button--danger'
					}
				);

				content.aiGuideSuggestion = '';
				clear = true;
			} catch {
				// 用户取消防治建议
			}

			if (clear) {
				await onSave(false);
				return;
			}
		} else if (!diagFlag && !guideSuggestionFlag) {
			try {
				await ElMessageBox.confirm(
					`如果需要重新生成防治建议替换当前建议，请点击“确认”按钮`,
					'防治建议确认',
					{
						confirmButtonText: '确认',
						cancelButtonText: '取消',
						type: 'warning',
						confirmButtonClass: 'el-button--danger'
					}
				);
				content.aiGuideSuggestion = '';
			} catch {
				// 用户取消防治建议
				return;
			}
		}
		// 设置加载状态
		treatmentLoading.value = true;
		//调用防治建议接口
		diagnosticCode = diagnosticCode.substring(0, diagnosticCode.length - 1);
		diagnosticName = diagnosticName.substring(0, diagnosticName.length - 1);
		const diagnosticCodeBase64 = base64Encode(diagnosticCode);
		const diagnosticNameBase64 = base64Encode(diagnosticName);
		const params = {
			diagnosticCode: diagnosticCodeBase64,
			diagnosticName: diagnosticNameBase64,
			patientNo: props.patientNo,
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: moduleCode,
			assessmentCount: props.assessmentCount
		};
		{
			const data = await service.etiology.muaItems.getMuaTreatment(params);
			let decodeAdvice = '';
			if (data != '' && data != null && data.advice != '') {
				decodeAdvice = base64Decode(data.advice);
			}
			content.treatmentSuggestion = decodeAdvice;
		}

		{
			const response = await service.etiology.muaItems.getMuaGuide(params);
			////console.log('response1111:', response);
			if (response != '' && response != null && response.advice != '') {
				////console.log('response2222:', response);
				//解密html
				const decodeHtml = base64Decode(response.advice);
				//此处调用markdown工具
				if (aiFlag.value) {
					const html = await markdownToHTML(decodeHtml);
					////console.log('html:', html);
					// 将处理后的结果显示在右侧
					content.aiGuideSuggestion = html;
				} else {
					content.aiGuideSuggestion = decodeHtml;
				}
				ElMessage.success('防治建议完成');
			} else {
				ElMessage.success('当前评估结果没有匹配到防治建议');
				return;
			}
		}
		await onSave(false);
	} catch (error: any) {
		console.error('防治建议失败:', error);
		ElMessage.error('防治建议失败: ' + (error.message || '未知错误'));
	} finally {
		// 无论成功或失败，都要隐藏进度条
		treatmentLoading.value = false;
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
		//console.log('data:', data);
		//将data赋值给upTableData
		upTableData.value = data;
	} catch (error: any) {
		console.error('加载检验数据失败:', error);
		ElMessage.error('加载检验数据失败: ' + (error.message || '未知错误'));
	}
};

//获取异常指标数据
const initMuaResult = async () => {
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: moduleCode, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	try {
		const data = await service.etiology.muaItems.getMuaResult(params);
		//console.log('data:', data);
		//将data赋值给upTableData
		if (data.length > 0) {
			tableData1.value = data;
		} else {
			generateIndicatorData();
		}
	} catch (error: any) {
		console.error('加载指标项失败:', error);
		ElMessage.error('加载指标项失败: ' + (error.message || '未知错误'));
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
		//console.log('data:', data);
		//将data赋值给upTableData
		if (data) {
			content.treatmentSuggestion = data.treatmentSuggestion;
			content.guideSuggestion = data.guideSuggestion;
			content.aiGuideSuggestion = data.aiGuideSuggestion;
		}
	} catch (error: any) {
		console.error('加载评估内容失败:', error);
		ElMessage.error('加载评估内容失败: ' + (error.message || '未知错误'));
	}
};

const handleResultValueClick = async (row, newValue) => {
	//console.log('处理结果值变化:', row, '新值:', newValue);

	// 使用共享分析方法处理结果
	const updatedRow = analyzeResultValue(row, newValue);

	// 将分析结果应用回当前行
	Object.assign(row, updatedRow);

	//console.log('更新后的行:', JSON.stringify(row));

	try {
		// 保存更新后的数据
		if (row.id == null) {
			row.swlNo = props.swlNo;
			row.serialNumber = props.serialNumber;
			const res = await service.swl.lab.add(row);
			//console.log('res:', res);
			row.id = res.id;
		} else {
			row.swlNo = props.swlNo;
			row.serialNumber = props.serialNumber;
			await service.swl.lab.update(row); // 确保有 await
		}
		await generateIndicatorData(); // 移动到try块内部
	} catch (error: any) {
		console.error('保存检验结果失败:', error);
		ElMessage.error('保存检验结果失败: ' + (error.message || '未知错误'));
	}
};

//生成指标数据
const generateIndicatorData = async () => {
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: moduleCode, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	//根据swlNo和serialNumber获取数据生成
	try {
		const data = await service.etiology.muaItems.toMuaResult(params);
		//console.log('data:', data);
		//将data赋值给upTableData
		tableData1.value = data;
	} catch (error: any) {
		console.error('生成指标数据失败:', error);
		ElMessage.error('生成指标数据失败: ' + (error.message || '未知错误'));
	}
};

// 处理指标更新的回调函数
const handleIndicatorUpdate = async () => {
	//console.log('收到指标更新通知，开始重新生成指标数据');
	await generateIndicatorData();
};

// 在script部分添加handleBlur函数
const handleBlur = async (row, event) => {
	// 记录原始值，用于比较是否有变化
	const originalValue = row.resultValue;

	// 获取当前值（从row对象中获取最新值，v-model应该已经更新）
	let inputValue = row.resultValue;
	let valueChanged = false;

	// 尝试从元素中直接获取值（对于某些情况可能更可靠）
	try {
		// 1. 检查是否为普通input元素
		if (event && event.target && event.target.tagName === 'INPUT') {
			// 如果是input元素，直接从event.target.value获取
			const targetValue = event.target.value;
			if (targetValue !== undefined && targetValue !== originalValue) {
				inputValue = targetValue;
				valueChanged = true;
				// 确保同步回row对象
				row.resultValue = inputValue;
			}
		}
		// 2. 检查是否为el-select元素（查找内部input）
		else if (event && event.target) {
			const selectInput = event.target.querySelector('input');
			if (selectInput && selectInput.value !== undefined) {
				const selectInputValue = selectInput.value;
				if (selectInputValue !== '' && selectInputValue !== originalValue) {
					inputValue = selectInputValue;
					valueChanged = true;
					// 确保同步回row对象
					row.resultValue = inputValue;
				}
			}
		}
	} catch (e) {
		console.error('尝试从事件获取值时出错:', e);
	}

	//console.log(
	// 	'失去焦点，判断是否提交:',
	// 	row,
	// 	'当前输入值:',
	// 	inputValue,
	// 	'值是否变化:',
	// 	valueChanged
	// );

	// 如果结果值为空或未发生变化，则不处理
	if (!inputValue || !valueChanged) {
		//console.log('值未变化或为空，不提交');
		row.resultValue = originalValue;
		return;
	}

	// 使用相应的方法处理结果并保存
	handleResultValueClick(row, inputValue);
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

		//console.log('删除数据:', params);
		// 调用删除接口，您需要根据实际后端接口调整
		await service.etiology.muaItems.deleteMuaAnalysis(params);

		// 临时注释掉实际API调用，避免报错
		// 实际使用时请根据后端接口调整方法名和参数
		//console.log('删除API调用已注释，请根据实际后端接口实现');
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

		//console.log('保存排序数据:', params);
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

		//console.log('新增诊断数据:', params);
		// 调用后端接口新增数据
		// await service.etiology.muaItems.addMuaAnalysis(params);
		// 暂时注释掉API调用，待后端接口开发完成后启用
		//console.log('新增API调用已注释，请根据实际后端接口实现');

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

// 在script部分添加相关变量和函数
const selectedResultRows = ref<any[]>([]);
const hasSelectedResultRow = computed(() => selectedResultRows.value.length > 0);
const table1Ref = ref();
const labRef = ref(); // Lab组件的引用

// 处理结果表格选择变化
const handleResultSelectionChange = (selection: any[]) => {
	selectedResultRows.value = selection;
};

// 上移结果
const onMoveUpResult = async () => {
	if (selectedResultRows.value.length !== 1) {
		ElMessage.warning('请选择一行数据进行上移操作');
		return;
	}

	const selectedRow = selectedResultRows.value[0];
	const currentIndex = tableData1.value.findIndex(item => item === selectedRow);

	if (currentIndex <= 0) {
		ElMessage.warning('已经是第一行，无法上移');
		return;
	}

	// 交换位置
	const temp = tableData1.value[currentIndex];
	tableData1.value[currentIndex] = tableData1.value[currentIndex - 1];
	tableData1.value[currentIndex - 1] = temp;

	// 保持选中状态
	table1Ref.value?.clearSelection();
	table1Ref.value?.toggleRowSelection(selectedRow, true);

	// 同步到数据库
	try {
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: moduleCode,
			patientNo: props.patientNo,
			assessmentCount: props.assessmentCount,
			resultData: tableData1.value.map((item, index) => ({
				groupCode: item.groupCode,
				groupName: item.groupName,
				itemCode: item.itemCode,
				itemName: item.itemName,
				itemType: item.itemType,
				resultValue: item.resultValue,
				resultJudgment: item.resultJudgment,
				seq: item.seq,
				sort: index + 1
			}))
		};

		await service.etiology.muaItems.updateMuaResultOrder(params);
		ElMessage.success('上移成功');
	} catch (error: any) {
		// 如果数据库更新失败，回滚前端操作
		const temp = tableData1.value[currentIndex - 1];
		tableData1.value[currentIndex - 1] = tableData1.value[currentIndex];
		tableData1.value[currentIndex] = temp;

		table1Ref.value?.clearSelection();
		table1Ref.value?.toggleRowSelection(selectedRow, true);

		console.error('上移失败:', error);
		ElMessage.error('上移失败: ' + (error.message || '未知错误'));
	}
};

// 下移结果
const onMoveDownResult = async () => {
	if (selectedResultRows.value.length !== 1) {
		ElMessage.warning('请选择一行数据进行下移操作');
		return;
	}

	const selectedRow = selectedResultRows.value[0];
	const currentIndex = tableData1.value.findIndex(item => item === selectedRow);

	if (currentIndex >= tableData1.value.length - 1) {
		ElMessage.warning('已经是最后一行，无法下移');
		return;
	}

	// 交换位置
	const temp = tableData1.value[currentIndex];
	tableData1.value[currentIndex] = tableData1.value[currentIndex + 1];
	tableData1.value[currentIndex + 1] = temp;

	// 保持选中状态
	table1Ref.value?.clearSelection();
	table1Ref.value?.toggleRowSelection(selectedRow, true);

	// 同步到数据库
	try {
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: moduleCode,
			patientNo: props.patientNo,
			assessmentCount: props.assessmentCount,
			resultData: tableData1.value.map((item, index) => ({
				groupCode: item.groupCode,
				groupName: item.groupName,
				itemCode: item.itemCode,
				itemName: item.itemName,
				itemType: item.itemType,
				resultValue: item.resultValue,
				resultJudgment: item.resultJudgment,
				seq: item.seq,
				sort: index + 1
			}))
		};

		await service.etiology.muaItems.updateMuaResultOrder(params);
		ElMessage.success('下移成功');
	} catch (error: any) {
		// 如果数据库更新失败，回滚前端操作
		const temp = tableData1.value[currentIndex + 1];
		tableData1.value[currentIndex + 1] = tableData1.value[currentIndex];
		tableData1.value[currentIndex] = temp;

		table1Ref.value?.clearSelection();
		table1Ref.value?.toggleRowSelection(selectedRow, true);

		console.error('下移失败:', error);
		ElMessage.error('下移失败: ' + (error.message || '未知错误'));
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
			//console.log('Lab数据刷新完成');
		}

		// 2. 重新生成指标数据
		await generateIndicatorData();

		ElMessage.success('刷新成功');
	} catch (error: any) {
		console.error('刷新失败:', error);
		ElMessage.error('刷新失败: ' + (error.message || '未知错误'));
	}
};

// 从父组件注入必要的数据
// const id = inject<number>('id', 0);
//const patientNo = inject<string>('patientNo', '');
//const swlNo = inject<string>('swlNo', '');
//const serialNumber = inject<string>('serialNumber', '');

// 动态高度调整相关
const upperSectionRef = ref();
const lowerSectionRef = ref();

// 监听 lab 组件高度变化
const observeLabHeight = () => {
	if (!labRef.value) return;

	// 使用 ResizeObserver 监听 lab 组件的高度变化
	const resizeObserver = new ResizeObserver(entries => {
		for (const entry of entries) {
			const newHeight = entry.contentRect.height;
			//console.log('Lab组件高度变化:', newHeight);

			// 注释掉 ResizeObserver 的高度设置，让自定义事件监听器来控制
			// 更新 upper-section 的高度，确保最小高度
			// if (upperSectionRef.value) {
			// 	const minHeight = 200; // 最小高度
			// 	const expandedHeight = 360; // 展开时的固定高度

			// 	// 根据 lab 组件的实际高度来判断是否有展开内容
			// 	let targetHeight;
			// 	if (newHeight > minHeight + 50) {
			// 		// 如果高度明显大于最小高度，认为有展开内容
			// 		targetHeight = expandedHeight;
			// 	} else {
			// 		targetHeight = minHeight;
			// 	}

			// 	upperSectionRef.value.style.height = `${targetHeight}px`;

			// 	// 确保 lower-section 能够正确跟随
			// 	if (lowerSectionRef.value) {
			// 		//console.log('ResizeObserver: lower-section 位置已更新');
			// 	}
			// }
		}
	});

	// 开始观察 lab 组件的根元素
	if (labRef.value.$el) {
		resizeObserver.observe(labRef.value.$el);
	}
};

// 手动更新高度函数
const updateLabHeight = () => {
	if (!labRef.value || !upperSectionRef.value) return;

	const labElement = labRef.value.$el;
	if (labElement) {
		const newHeight = labElement.offsetHeight;
		//console.log('手动更新Lab组件高度:', newHeight);

		// 注释掉手动更新函数的高度设置，让自定义事件监听器来控制
		// const minHeight = 200;
		// const expandedHeight = 360; // 展开时的固定高度

		// // 根据 lab 组件的实际高度来判断是否有展开内容
		// let targetHeight;
		// if (newHeight > minHeight + 50) {
		// 	// 如果高度明显大于最小高度，认为有展开内容
		// 	targetHeight = expandedHeight;
		// } else {
		// 	targetHeight = minHeight;
		// }

		// upperSectionRef.value.style.height = `${targetHeight}px`;

		// // 确保 lower-section 能够正确跟随
		// if (lowerSectionRef.value) {
		// 	//console.log('手动更新: lower-section 位置已更新');
		// 		}
	}
};

// 打开打印预览弹框
const openPrintPreviewDialog = () => {
	// 检查组件状态
	if (!printProgressVisible.value) {
		//console.log('打印进度条未显示，取消PDF生成');
		return;
	}

	// 显示进度条
	//ElMessage.info('正在准备打印内容，请稍候...');

	// 直接生成PDF预览，使用隐藏的打印内容
	generatePDF();
};

// 生成PDF预览
const generatePDF = async () => {
	// 检查组件是否仍然挂载
	if (!printProgressVisible.value) {
		//console.log('组件已卸载，取消PDF生成');
		return;
	}

	pdfLoading.value = true;

	// 更新进度条
	printProgress.value = 10;
	printProgressText.value = '正在生成PDF...';

	try {
		//ElMessage.info('正在生成PDF，请稍候...');
		//console.log('开始生成PDF...');

		// 创建PDF实例
		const pdf = new JsPDF({
			orientation: 'p',
			unit: 'mm',
			format: 'a4'
		});
		//console.log('PDF实例创建成功');
		//ElMessage.info('PDF实例创建成功，正在渲染页面...');

		// 更新进度条
		printProgress.value = 20;
		printProgressText.value = 'PDF实例创建成功，正在渲染页面...';

		// 定义Canvas配置，提高渲染质量和文字对齐
		const canvasOptions = {
			scale: 2, // 提高分辨率
			useCORS: true,
			logging: false,
			letterRendering: true, // 提高文字渲染质量
			allowTaint: true,
			backgroundColor: '#ffffff',
			// 解决文字下移和截断问题
			onclone: clonedDoc => {
				try {
					// 找到所有表格单元格，调整内部文字垂直对齐
					const tableCells = clonedDoc.querySelectorAll('td, th');
					tableCells.forEach(cell => {
						cell.style.verticalAlign = 'middle';
						// 不统一设置textAlign，让每个单元格保持自己的对齐方式
						cell.style.lineHeight = '1.2';
						cell.style.padding = '8px 4px'; // 增加padding确保文字不贴边
						cell.style.height = 'auto';
						cell.style.minHeight = '30px';
					});

					// 确保防治建议内容保持左对齐
					const suggestionCells = clonedDoc.querySelectorAll('.suggestion-content');
					suggestionCells.forEach(cell => {
						cell.style.textAlign = 'left';
						cell.style.paddingLeft = '12px';
					});

					// 确保评估结果内容保持左对齐
					const resultCells = clonedDoc.querySelectorAll('.result-content');
					resultCells.forEach(cell => {
						cell.style.textAlign = 'left';
						cell.style.paddingLeft = '12px';
					});

					// 确保标签列居中对齐
					const labelCells = clonedDoc.querySelectorAll(
						'.result-label, .suggestion-label, .signature-row'
					);
					labelCells.forEach(cell => {
						cell.style.textAlign = 'center';
					});

					// 确保HTML渲染内容也左对齐
					const htmlRenderedContent =
						clonedDoc.querySelectorAll('.html-rendered-content');
					htmlRenderedContent.forEach(content => {
						content.style.textAlign = 'left';
						content.style.width = '100%';
						// 确保HTML内容中的所有元素都左对齐
						const allElements = content.querySelectorAll('*');
						allElements.forEach(element => {
							element.style.textAlign = 'left';
						});
					});

					// 调整表格样式
					const tables = clonedDoc.querySelectorAll('table');
					tables.forEach(table => {
						table.style.tableLayout = 'fixed';
						table.style.width = '100%';
						table.style.borderCollapse = 'collapse';
					});

					// 确保表格内的所有单元格内容居中
					const tableCellContents = clonedDoc.querySelectorAll('.cell');
					tableCellContents.forEach(cell => {
						cell.style.textAlign = 'center';
						cell.style.display = 'flex';
						cell.style.alignItems = 'center';
						cell.style.justifyContent = 'center';
						cell.style.lineHeight = '1.2';
						cell.style.padding = '0'; // 移除.cell的padding避免重复
						cell.style.height = '100%';
					});

					// 确保内容高度正确
					const labResultsElements = clonedDoc.querySelectorAll('.lab-results-section');
					labResultsElements.forEach(el => {
						el.style.height = 'auto';
						el.style.overflow = 'visible';
					});

					// 检测并调整第四页表格的防治建议字体大小
					const clonedAssessmentTable = clonedDoc.querySelector(
						'.assessment-result-table'
					) as HTMLElement;
				} catch (cloneError) {
					console.warn('Clone处理过程中出现错误:', cloneError);
				}
			}
		};

		// 获取所有页面 - 通过组件的 printContentRef 属性访问 DOM 元素
		//console.log('printContentRef.value:', printContentRef.value);
		//console.log('printContentRef.value type:', typeof printContentRef.value);

		// 检查组件是否仍然挂载
		if (!printProgressVisible.value) {
			throw new Error('组件已卸载，取消PDF生成');
		}

		if (!printContentRef.value) {
			throw new Error('打印内容组件引用未找到');
		}

		// 检查组件是否已经挂载
		if (!printContentRef.value.$el) {
			throw new Error('打印内容组件尚未挂载到DOM');
		}

		//console.log(
		// 	'printContentRef.value.printContentRef:',
		// 	printContentRef.value.printContentRef
		// );
		//console.log('printContentRef.value.$el:', printContentRef.value.$el);

		const printContentElement = printContentRef.value.printContentRef;
		if (!printContentElement) {
			throw new Error('打印内容组件的DOM元素未找到');
		}

		// console.log('printContentElement:', printContentElement);
		// //console.log('printContentElement type:', typeof printContentElement);
		// //console.log(
		// 	'printContentElement instanceof HTMLElement:',
		// 	printContentElement instanceof HTMLElement
		// );

		// 等待DOM完全渲染
		await new Promise(resolve => setTimeout(resolve, 100));

		// 验证DOM元素是否可用
		if (!(printContentElement instanceof HTMLElement)) {
			throw new Error('打印内容元素不是有效的HTML元素');
		}

		const allPages = printContentElement.querySelectorAll('.a4-page');
		const pdfWidth = pdf.internal.pageSize.getWidth();

		////console.log('找到页面数量:', allPages?.length);
		////console.log('PDF宽度:', pdfWidth);

		if (!allPages || allPages.length === 0) {
			throw new Error('未找到可打印的页面内容');
		}

		for (let i = 0; i < allPages.length; i++) {
			// 检查组件是否仍然挂载
			if (!printProgressVisible.value) {
				//console.log('组件已卸载，取消PDF生成');
				return;
			}

			const pageElement = allPages[i];
			//ElMessage.info(`正在处理第${i + 1}页...`);
			//console.log(`开始处理第${i + 1}页...`);

			// 更新进度条 - 根据页面数量计算进度
			const pageProgress = 30 + (i / allPages.length) * 50; // 30-80% 用于页面渲染
			printProgress.value = Math.round(pageProgress);
			printProgressText.value = `正在处理第${i + 1}页，共${allPages.length}页...`;

			if (!pageElement) {
				console.warn(`未找到第${i + 1}页元素`);
				continue;
			}

			// 如果不是第一页，添加新页
			if (i > 0) {
				pdf.addPage();
				//console.log(`添加新页: 第${i + 1}页`);
			}

			try {
				// 渲染当前页
				//ElMessage.info(`正在渲染第${i + 1}页...`);
				//console.log(`开始渲染第${i + 1}页canvas...`);
				const pageCanvas = await html2canvas(pageElement as HTMLElement, canvasOptions);
				//console.log(
				// 	`第${i + 1}页canvas渲染完成, 尺寸:`,
				// 	pageCanvas.width,
				// 	'x',
				// 	pageCanvas.height
				// );

				// 当前页的图像数据
				const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0);
				//console.log(`第${i + 1}页图像数据生成完成`);

				// 计算图像在PDF中的宽度和高度
				const pageImgWidth = pdfWidth;
				const pageImgHeight = (pageCanvas.height * pageImgWidth) / pageCanvas.width;
				//console.log(`第${i + 1}页PDF尺寸:`, pageImgWidth, 'x', pageImgHeight);

				// 添加当前页内容到PDF
				pdf.addImage(pageImgData, 'JPEG', 0, 0, pageImgWidth, pageImgHeight);
				//console.log(`第${i + 1}页添加到PDF完成`);
			} catch (pageError: unknown) {
				console.error(`第${i + 1}页处理失败:`, pageError);
				const errorMessage =
					pageError instanceof Error ? pageError.message : String(pageError);
				throw new Error(`第${i + 1}页处理失败: ${errorMessage}`);
			}
		}

		// 生成PDF Blob
		//ElMessage.info('正在生成PDF文件...');
		//console.log('开始生成PDF Blob...');

		// 更新进度条
		printProgress.value = 85;
		printProgressText.value = '正在生成PDF文件...';

		const pdfOutput = pdf.output('blob');
		//console.log('PDF Blob生成完成, 大小:', pdfOutput.size, 'bytes');

		// 保存生成的Blob并创建URL
		pdfBlob.value = pdfOutput;
		pdfUrl.value = URL.createObjectURL(pdfOutput);
		//console.log('PDF URL创建完成:', pdfUrl.value);

		//ElMessage.success('PDF生成完成！');

		// 更新进度条到100%
		printProgress.value = 100;
		printProgressText.value = 'PDF生成完成！';

		// 延迟隐藏进度条
		setTimeout(() => {
			if (printProgressVisible.value !== undefined) {
				printProgressVisible.value = false;
			}
		}, 1500);

		// 显示PDF预览弹框
		showPDFPreviewDialog();
	} catch (error) {
		console.error('PDF生成失败:', error);
		ElMessage.error('PDF生成失败: ' + (error instanceof Error ? error.message : String(error)));

		// 更新进度条显示错误
		printProgress.value = 0;
		printProgressText.value = 'PDF生成失败，请重试';

		// 延迟隐藏进度条
		setTimeout(() => {
			if (printProgressVisible.value !== undefined) {
				printProgressVisible.value = false;
			}
		}, 3000);
	} finally {
		pdfLoading.value = false;
	}
};

// 显示PDF预览弹框
const showPDFPreviewDialog = () => {
	printPreviewVisible.value = true;
	// 延迟调用printPDF，确保组件状态稳定
	setTimeout(() => {
		if (printPreviewVisible.value) {
			//printPDF();
		}
	}, 100);
};

// 下载PDF
const downloadPDF = () => {
	if (!pdfBlob.value) {
		ElMessage.warning('PDF文件未准备好');
		return;
	}

	const downloadLink = document.createElement('a');
	downloadLink.href = pdfUrl.value;
	downloadLink.download = `泌尿系结石代谢评估报告_${props.swlNo || '未知'}_${new Date().toISOString().split('T')[0]}.pdf`;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);

	ElMessage.success('PDF下载完成！');
};

// 打印PDF
const printPDF = () => {
	if (!pdfBlob.value) {
		ElMessage.warning('PDF文件未准备好');
		return;
	}

	try {
		// 创建隐藏的iframe来打印PDF，避免打开新标签页
		const printFrame = document.createElement('iframe');
		printFrame.style.display = 'none';
		printFrame.src = pdfUrl.value;

		document.body.appendChild(printFrame);

		// 等待iframe加载完成后打印
		printFrame.onload = () => {
			try {
				// 延迟一点时间确保PDF完全加载
				setTimeout(() => {
					printFrame.contentWindow?.print();

					// 使用更可靠的方式检测打印完成
					let printCheckCount = 0;
					const maxPrintCheckCount = 30; // 最多检查30次，避免无限循环

					const checkPrintComplete = () => {
						printCheckCount++;

						// 检查打印是否完成
						if (document.hasFocus() && printCheckCount > 5) {
							// 打印对话框关闭后，延迟清理iframe
							setTimeout(() => {
								if (document.body.contains(printFrame)) {
									document.body.removeChild(printFrame);
									//console.log('打印完成，iframe已清理');
								}
							}, 3000);
						} else if (printCheckCount < maxPrintCheckCount) {
							// 继续检查，间隔1秒
							setTimeout(checkPrintComplete, 1000);
						} else {
							// 达到最大检查次数，强制清理
							if (document.body.contains(printFrame)) {
								document.body.removeChild(printFrame);
								//console.log('达到最大检查次数，强制清理iframe');
							}
						}
					};

					// 开始检查打印状态
					setTimeout(checkPrintComplete, 2000);
				}, 500);
			} catch (error) {
				console.error('打印失败:', error);
				ElMessage.error(
					'打印失败: ' + (error instanceof Error ? error.message : String(error))
				);
				document.body.removeChild(printFrame);
			}
		};

		// 如果加载失败，也移除iframe
		printFrame.onerror = () => {
			ElMessage.error('PDF加载失败，无法打印');
			document.body.removeChild(printFrame);
		};
	} catch (error) {
		console.error('创建打印框架失败:', error);
		ElMessage.error('打印失败: ' + (error instanceof Error ? error.message : String(error)));
	}
};
</script>

<style lang="scss" scoped>
// 引入HTML内容渲染通用样式
@use './html-content-styles.scss' as *;

.split-layout-container {
	height: calc(100vh - 220px);
	display: flex;
	flex-direction: column;
	background-color: transparent;
	padding: 0px;
	gap: 3px;
	overflow-y: auto;
	position: relative;

	.upper-section {
		background-color: transparent;
		padding: 0px;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		overflow: visible;
		display: flex;
		flex-direction: column;
		min-height: 200px;
		/* 移除固定高度，让 JavaScript 动态设置 */
		transition: height 0.3s ease;

		:deep(.cl-crud) {
			height: 100%;
			display: flex;
			flex-direction: column;

			.cl-table {
				flex: 1;
				overflow: visible;
			}
		}

		// Lab组件容器样式
		.past-medical-table {
			height: 100%;
			min-height: 200px;
			transition: height 0.3s ease;
		}
	}

	.lower-section {
		background-color: transparent;
		padding: 0px;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		flex: 1;
		min-height: 0;

		.lower-content {
			display: flex;
			flex-direction: column;
			gap: 0px;

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
					height: 260px; // 设置统一高度

					&:nth-child(1) {
						flex: 0 0 calc(33.33% - 25px); // 减去按钮占用的空间
						max-width: calc(33.33% - 25px);

						// 第一个表格保持与第二个表格相同的布局
						.table-with-button {
							.el-table {
								height: 250px !important;
								min-height: 250px !important;
							}
						}
					} // 第一个表格占1/3减去按钮空间
					&:nth-child(2) {
						flex: 0 0 calc(33.33% - 25px); // 减去按钮占用的空间
						max-width: calc(33.33% - 25px);
					} // 第二个表格占1/3减去按钮空间
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
								100% - 90px
							) !important; // 减去按钮的宽度（80px + 10px gap）
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

						// tableData1的操作按钮样式
						.operation-buttons-table1 {
							display: flex;
							flex-direction: column;
							gap: 8px;
							width: 80px; // 调整为系统默认按钮宽度
							margin-right: 5px;
							margin-top: 0px; // 向上移动更多，与表头对齐
							align-items: stretch; // 让所有按钮拉伸到相同宽度

							// 确保第一个按钮（刷新）没有额外的margin
							> .el-button:first-child {
								margin-top: 0 !important;
								margin-bottom: 0px !important; // 刷新按钮下方增加间距
							}

							.el-button {
								width: 100% !important;
								height: 32px !important; // 调整为系统默认按钮高度
								padding: 8px 15px !important; // 调整为系统默认内边距
								font-size: 14px !important; // 调整为系统默认字体大小
								text-align: center !important; // 按钮文字居中对齐
								justify-content: center !important; // 按钮内容居中对齐
								display: flex !important;
								align-items: center !important;
								margin: 0 !important; // 确保没有额外的margin
								border-radius: 4px !important; // 统一圆角
								box-sizing: border-box !important; // 确保盒模型一致

								// 确保按钮内的span元素也居中对齐
								:deep(span) {
									width: 100%;
									text-align: center;
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}

							// 生成防治建议按钮特殊样式
							.analysis-btn {
								height: 32px !important;
								margin-top: 64px !important; // 与上面的按钮有更多间距
								margin-left: 0 !important;
								margin-right: 0 !important;
								margin-bottom: 0 !important;
							}
						}

						// tableData2的操作按钮样式
						.operation-buttons-table2 {
							display: flex;
							flex-direction: column;
							gap: 8px;
							width: 80px; // 调整为系统默认按钮宽度
							margin-right: 5px;
							margin-top: 0px; // 从顶部开始
							align-items: stretch; // 让所有按钮拉伸到相同宽度

							// 确保第一个按钮（上移）没有额外的margin
							> .el-button:first-child {
								margin-top: 0 !important;
							}

							.el-button {
								width: 100% !important;
								height: 32px !important; // 调整为系统默认按钮高度
								padding: 8px 15px !important; // 调整为系统默认内边距
								font-size: 14px !important; // 调整为系统默认字体大小
								text-align: center !important; // 按钮文字居中对齐
								justify-content: center !important; // 按钮内容居中对齐
								display: flex !important;
								align-items: center !important;
								margin: 0 !important; // 确保没有额外的margin
								border-radius: 4px !important; // 统一圆角
								box-sizing: border-box !important; // 确保盒模型一致

								// 确保按钮内的span元素也居中对齐
								:deep(span) {
									width: 100%;
									text-align: center;
									display: flex;
									align-items: center;
									justify-content: center;
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
						height: 255px; // 设置固定高度为240px
						display: flex;
						flex-direction: column;
						gap: 12px;
						padding: 8px;
						border: 1px solid var(--el-border-color-light);
						border-radius: 4px;
						background-color: var(--el-fill-color-blank);
						// 确保容器能够正确适应240px高度

						// 标题样式
						.section-label {
							font-size: 14px;
							font-weight: 600;
							color: var(--el-text-color-primary);
							margin: 0;
							padding: 0;
							line-height: 1.4;
						}

						// 滚动区域样式
						:deep(.el-scrollbar) {
							flex: 1;
							border: 1px solid var(--el-border-color-lighter);
							border-radius: 4px;
							background-color: white;
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
							flex: 0 0 auto;
							border: 1px solid var(--el-border-color-extra-light);
							border-radius: 4px;
							font-size: 14px;
							line-height: 1.5;
							color: var(--el-text-color-regular);
							white-space: pre-wrap;
							word-wrap: break-word;
							min-height: 100px;

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

// 两块布局样式
.text-input-two-sections {
	display: flex;
	gap: 5px;
	width: 100%;
	height: 260px;
	padding: 5px;
	background-color: var(--el-fill-color-blank);
	border: 1px solid var(--el-border-color-light);
	border-radius: 8px;
	margin-bottom: 16px;

	.left-textarea-section,
	.right-textarea-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0px;
		min-width: 0;

		.left-header {
			display: flex;
			align-items: center;
			gap: 20px;
			margin-bottom: 8px;

			.textarea-label {
				font-size: 14px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0;
				padding: 0;
				line-height: 1.4;
				white-space: nowrap;
			}

			.header-buttons {
				display: flex;
				gap: 8px;
				align-items: center;

				.action-btn {
					height: 28px;
					padding: 0 12px;
					font-size: 12px;
					border-radius: 4px;

					.el-icon {
						margin-right: 4px;
						font-size: 12px;
					}
				}
			}
		}

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
}

// AI生成弹窗样式
.ai-optimize-dialog {
	display: flex;
	flex-direction: column;
	gap: 2px;
	width: 100%;
	height: 100%;
	padding: 2px;

	.top-section {
		flex: 0 0 140px; // 固定高度，约5行文本
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-height: 0;
	}

	.bottom-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-height: 0;
		// 确保伸展到最下面
		height: 100%;
	}

	.top-section,
	.bottom-section {
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
					padding: 6px !important;
					font-size: 14px;
					line-height: 1.5;
					background-color: transparent !important;
				}
			}
		}
	}

	.middle-section {
		flex: 0 0 40px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 30px;
		padding: 2px 0;
		//background-color: var(--el-fill-color-light);
		border: 0px solid var(--el-border-color-lighter);
		border-radius: 8px;

		.optimize-btn {
			width: 100px;
			height: 32px;
			padding: 8px 15px;
			font-size: 14px;
			font-weight: 500;
			text-align: center !important;
			justify-content: center !important;
			display: flex !important;
			align-items: center !important;
			gap: 6px;
			border-radius: 4px;
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

// 富文本编辑器样式 - 与 html-rendered-content 保持一致
:deep(.rich-text-editor) {
	@include html-content-styles;
}

// AI建议内容渲染样式
.ai-suggestion-content {
	height: 100%;

	:deep(.html-rendered-content) {
		@include html-content-styles;
	}

	// 诊疗建议区域样式
	.treatment-section {
		width: 250px;
		display: flex;
		flex-direction: column;
		gap: 8px;

		.treatment-label {
			font-size: 14px !important;
			font-weight: 600 !important;
			color: #409eff !important;
			margin: 0 !important;
			padding: 0 !important;
			line-height: 1.4 !important;
		}

		.treatment-content {
			flex: 1;
			border: 2px solid var(--el-border-color);
			border-radius: 6px;
			background-color: var(--el-bg-color);
			overflow: hidden;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

			.treatment-text {
				padding: 12px;
				font-size: 12px;
				line-height: 1.6;
				color: var(--el-text-color-regular);
				white-space: pre-wrap;
				word-wrap: break-word;
			}
		}
	}
}

// 打印预览弹框样式
.print-preview-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	gap: 16px;

	.print-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		padding: 16px;
		background-color: var(--el-fill-color-light);
		border-radius: 8px;
		flex-shrink: 0;

		.el-button {
			min-width: 120px;
		}
	}

	.pdf-preview {
		flex: 1;
		border: 1px solid var(--el-border-color-light);
		border-radius: 8px;
		overflow: hidden;
		background-color: white;
	}

	.print-content {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
		background-color: var(--el-fill-color-blank);
	}
}
// 在 style 部分添加PDF预览弹框样式
.pdf-preview-container {
	display: flex;
	flex-direction: column;
	height: 800px; /* 使用100%高度，让父容器控制实际高度 */
	gap: 16px;

	.pdf-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		padding: 12px 16px;
		background-color: var(--el-fill-color-light);
		border-radius: 8px;
		flex-shrink: 0;

		.el-button {
			min-width: 120px;
		}
	}

	.pdf-preview {
		flex: 1;
		border: 1px solid var(--el-border-color-light);
		border-radius: 8px;
		overflow: hidden;
		background-color: white;
		min-height: 0; /* 移除固定最小高度，让flex: 1生效 */
		position: relative; /* 确保定位正确 */

		iframe {
			width: 100%;
			height: 100%;
			border: none;
			position: relative; /* 改为相对定位，避免覆盖PDF控件 */
			display: block; /* 确保iframe正确显示 */
		}
	}

	/* 确保弹框内部布局正确 */
	:deep(.el-dialog__body) {
		padding: 16px;
		height: calc(100vh - 120px);
		overflow: hidden;
	}

	/* 全屏弹框样式优化 */
	:deep(.el-dialog) {
		margin: 0 !important;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	:deep(.el-dialog__header) {
		flex-shrink: 0;
		padding: 16px 20px;
	}

	:deep(.el-dialog__body) {
		flex: 1;
		padding: 16px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.pdf-loading {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		color: var(--el-text-color-regular);

		.el-icon.is-loading {
			animation: rotate 2s linear infinite;
		}

		p {
			margin: 0;
			font-size: 16px;
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.pdf-error {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		color: var(--el-color-danger);

		p {
			margin: 0;
			font-size: 16px;
		}
	}
}

// 打印进度条样式
.print-progress-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	padding: 20px;

	.progress-text {
		font-size: 16px;
		color: var(--el-text-color-primary);
		text-align: center;
		line-height: 1.5;
	}

	.progress-percentage {
		font-size: 18px;
		font-weight: bold;
		color: var(--el-color-primary);
	}
}
</style>
