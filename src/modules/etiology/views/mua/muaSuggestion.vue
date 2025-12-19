<template>
	<div v-bind="$attrs">
		<cl-crud ref="Crud" style="padding: 0px; background-color: transparent">
			<div class="split-layout-container">
				<!-- Text input area - 两块布局 -->
				<div
					class="text-input-two-sections"
					:class="{ 'right-collapsed': !mainRightSectionExpanded }"
				>
					<!-- 左侧：防治建议（占3/5，当右侧收缩时占100%） -->
					<div
						class="left-textarea-section"
						:class="{ 'full-width': !mainRightSectionExpanded }"
					>
						<div class="left-header">
							<div class="header-buttons">
								<el-button
									type="success"
									@click="onTreatmentSuggestion"
									:loading="treatmentLoading"
									:disabled="treatmentLoading"
								>
									{{ treatmentLoading ? '生成中...' : '防治建议' }}
								</el-button>
								<!-- <el-button v-if="aiFlag" type="primary" @click="onAIOptimize">
									AI整理
								</el-button> -->

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
								<el-button type="warning" @click="onSave(true)"> 保存 </el-button>
								<el-button type="info" @click="onPrint"> 打印报告 </el-button>
								<el-button
									v-if="!mainRightSectionExpanded && aiFlag"
									@click="toggleMainRightSection"
									class="toggle-right-panel-btn"
									size="small"
								>
									<el-icon>
										<arrow-right />
									</el-icon>
									<span class="toggle-right-panel-btn__text">
										展开原始建议面板
									</span>
								</el-button>
							</div>
						</div>
						<div class="textarea-container" ref="mainEditorContainerRef">
							<div class="ai-suggestion-content">
								<!-- HTML渲染区域 -->
								<cl-editor-vditor
									v-if="aiFlag"
									:key="aiGuideSuggestionKey"
									v-model="content.aiGuideSuggestion"
									:height="mainEditorHeight"
									:disabled="false"
									mode="wysiwyg"
									placeholder="请输入防治建议内容..."
									class="editor-container"
								/>
								<!-- 纯文本显示/编辑区域 -->
								<el-input
									v-else
									v-model="content.aiGuideSuggestion"
									type="textarea"
									:rows="30"
									placeholder="请输入防治建议..."
									class="scrollable-textarea ai-suggestion-textarea"
									:style="{
										'--ai-textarea-font-size': '18px',
										'--ai-textarea-font-weight': '500'
									}"
								/>
							</div>
						</div>
					</div>

					<!-- 右侧面板（占2/5，可展开/收缩） -->
					<div
						class="right-textarea-section"
						:class="{ collapsed: !mainRightSectionExpanded }"
					>
						<div class="right-header">
							<el-button
								type="primary"
								@click="onApplySuggestionContent"
								class="right-header-btn"
							>
								引用原始建议
							</el-button>
							<el-button
								v-if="mainRightSectionExpanded && aiFlag"
								@click="toggleMainRightSection"
								class="toggle-right-panel-btn"
							>
								<el-icon>
									<arrow-left />
								</el-icon>
								<span class="toggle-right-panel-btn__text"> 收缩原始建议面板 </span>
							</el-button>
						</div>
						<div class="right-textarea-container">
							<el-scrollbar>
								<el-input
									:key="guideSuggestionKey"
									v-model="content.guideSuggestion"
									type="textarea"
									placeholder="原始防治建议内容..."
									class="scrollable-textarea guide-suggestion-textarea"
								/>
							</el-scrollbar>
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

					<div
						style="
							margin-top: 15px;
							display: flex;
							justify-content: center;
							width: 100%;
						"
					>
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
					<!-- 主要内容区域：左右布局 -->
					<div class="main-content-section">
						<!-- 左侧：AI优化后的建议编辑器（占3/5，当右侧收缩时占100%） -->
						<div
							class="left-section"
							:class="{ 'full-width': !aiOptimizeDialog.rightSectionExpanded }"
						>
							<div class="section-header">
								<label class="section-label">AI优化建议</label>
								<el-button
									type="success"
									@click="onApplyOptimizedContent"
									class="optimize-btn"
									:disabled="!aiOptimizeDialog.optimizedContent"
									size="small"
								>
									引用AI建议
								</el-button>
								<el-button
									type="warning"
									@click="onApplyClose"
									class="optimize-btn"
									size="small"
								>
									关闭窗口
								</el-button>
								<el-button
									v-if="!aiOptimizeDialog.rightSectionExpanded"
									@click="toggleRightSection"
									class="toggle-right-panel-btn"
									size="small"
								>
									<el-icon>
										<arrow-right />
									</el-icon>
									<span class="toggle-right-panel-btn__text">
										展开原始建议面板
									</span>
								</el-button>
							</div>
							<div
								class="textarea-container editor-container"
								ref="editorContainerRef"
							>
								<cl-editor-vditor
									v-model="aiOptimizeDialog.optimizedContent"
									:height="editorHeight"
									:disabled="false"
									mode="wysiwyg"
									placeholder="AI优化后的建议内容..."
									class="rich-text-editor"
								/>
							</div>
						</div>

						<!-- 右侧：原始防治建议（占2/5） -->
						<transition name="slide-fade">
							<div
								v-show="aiOptimizeDialog.rightSectionExpanded"
								class="right-section"
							>
								<div class="section-header">
									<label class="section-label">原始防治建议</label>
									<el-button
										type="primary"
										@click="onApplyOriginalContent"
										class="optimize-btn"
										:disabled="!aiOptimizeDialog.originalContent"
										size="small"
									>
										引用原始建议
									</el-button>
									<el-button
										@click="toggleRightSection"
										class="toggle-right-panel-btn"
										size="small"
									>
										<el-icon>
											<arrow-left />
										</el-icon>
										<span class="toggle-right-panel-btn__text">
											收起原始建议面板
										</span>
									</el-button>
								</div>
								<div class="textarea-container">
									<el-scrollbar>
										<el-input
											v-model="aiOptimizeDialog.originalContent"
											type="textarea"
											:rows="20"
											placeholder="原始防治建议内容..."
											class="scrollable-textarea"
										/>
									</el-scrollbar>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</template>
		</cl-form>

		<!-- 打印内容组件 -->
		<simplify-print-content
			v-if="showPrintContent && moduleCode == 'mua1'"
			:key="printKey"
			ref="simplifyPrintContentRef"
			:swlNo="props.swlNo"
			:serialNumber="props.serialNumber"
			:patientNo="props.patientNo"
			:assessmentCount="String(props.assessmentCount)"
		/>
		<overall-print-content
			v-if="showPrintContent && moduleCode == 'mua2'"
			:key="printKey"
			ref="overallPrintContentRef"
			:swlNo="props.swlNo"
			:serialNumber="props.serialNumber"
			:patientNo="props.patientNo"
			:assessmentCount="String(props.assessmentCount)"
		/>
		<special-print-content
			v-if="showPrintContent && moduleCode == 'mua3'"
			:key="printKey"
			ref="specialPrintContentRef"
			:swlNo="props.swlNo"
			:serialNumber="props.serialNumber"
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
	</div>
</template>

<script lang="ts" setup>
/**
 * 全面评估组件
 * @description 代谢性尿路结石病因学评估 - 全面评估
 */
defineOptions({
	name: 'mua-overall',
	inheritAttrs: false
});

// 定义 props
const props = defineProps({
	modelValue: {
		type: [String, Object],
		required: false,
		default: ''
	},
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

// 定义组件 emits
defineEmits<{
	(e: 'update:modelValue', value: any): void;
}>();

import { ref, reactive, onMounted, onUnmounted, onActivated, computed, nextTick, watch } from 'vue';
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
	CircleClose,
	ArrowRight,
	ArrowLeft
} from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { Plugins } from '/#/crud';
import { router, service } from '/@/cool';
import { useRoute } from 'vue-router';
import OverallPrintContent from './components/mua-overall-print-content.vue';
import SimplifyPrintContent from './components/mua-simplify-print-content.vue';
import SpecialPrintContent from './components/mua-special-print-content.vue';

//import { convertToHtml } from '/@/modules/helper/utils/markdown-converter';
import { markdownToHTML } from '/@/modules/helper/utils/markdown-converter-github';
import { init } from 'echarts';

// 浏览器兼容的 base64 编码/解码函数
const base64Encode = (str: string): string => {
	return btoa(unescape(encodeURIComponent(str)));
};

const base64Decode = (str: string): string => {
	return decodeURIComponent(escape(atob(str)));
};

const content = reactive({
	id: 0,
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
	generating: false,
	rightSectionExpanded: false // 原始建议区域展开状态，默认收缩
});

// 主界面右侧面板展开状态
const mainRightSectionExpanded = ref(false); // 默认收缩

// 用于强制重新渲染 el-input 的 key
const guideSuggestionKey = ref(0);

// 用于强制重新渲染 Vditor 编辑器的 key
const aiGuideSuggestionKey = ref(0);

// 编辑器容器引用和高度
const editorContainerRef = ref<HTMLElement>();
const mainEditorContainerRef = ref<HTMLElement>(); // 主界面编辑器容器引用
const editorHeight = ref(600);
const mainEditorHeight = ref(720); // 主界面编辑器高度
let resizeObserver: ResizeObserver | null = null;
let mainEditorResizeObserver: ResizeObserver | null = null; // 主界面编辑器 ResizeObserver

// 计算编辑器高度
const calculateEditorHeight = () => {
	nextTick(() => {
		if (editorContainerRef.value) {
			const containerHeight = editorContainerRef.value.clientHeight;
			if (containerHeight > 0) {
				editorHeight.value = containerHeight - 10; // 减去一些边距
			}
		}
	});
};

// 初始化 ResizeObserver 监听容器大小变化
const initResizeObserver = () => {
	if (editorContainerRef.value) {
		// 清理旧的观察器
		if (resizeObserver) {
			resizeObserver.disconnect();
		}

		// 创建新的观察器
		resizeObserver = new ResizeObserver(() => {
			calculateEditorHeight();
		});

		// 开始观察容器
		resizeObserver.observe(editorContainerRef.value);
	}
};

// 清理 ResizeObserver
const cleanupResizeObserver = () => {
	if (resizeObserver) {
		resizeObserver.disconnect();
		resizeObserver = null;
	}
};

// 触发主界面编辑器重新计算布局
const triggerMainEditorResize = () => {
	nextTick(() => {
		// 直接查找 Vditor 元素并强制重新计算滚动容器高度
		const editorElement = document.querySelector('.left-textarea-section .cl-editor-vditor');
		if (editorElement) {
			const vditorElement = editorElement.querySelector('.vditor') as HTMLElement;
			if (vditorElement) {
				const vditorContent = vditorElement.querySelector('.vditor-content') as HTMLElement;
				const vditorToolbar = vditorElement.querySelector('.vditor-toolbar') as HTMLElement;

				if (vditorContent && vditorElement) {
					// 方法1: 先移除所有内联样式，让 CSS 重新计算
					const originalHeight = vditorContent.style.height;
					const originalMinHeight = vditorContent.style.minHeight;
					const originalMaxHeight = vditorContent.style.maxHeight;

					// 清除内联样式，让 flex 布局重新计算
					vditorContent.style.height = '';
					vditorContent.style.minHeight = '';
					vditorContent.style.maxHeight = '';

					// 使用 requestAnimationFrame 确保浏览器完成重排
					requestAnimationFrame(() => {
						// 强制触发重新计算
						const containerHeight = vditorElement.clientHeight;
						const toolbarHeight = vditorToolbar ? vditorToolbar.offsetHeight : 0;
						const availableHeight = containerHeight - toolbarHeight;

						// 如果高度计算不正确，临时设置一个明确的高度值
						if (availableHeight > 0 && vditorContent.clientHeight !== availableHeight) {
							// 临时设置高度，触发浏览器重新计算
							vditorContent.style.height = `${availableHeight}px`;

							// 再次使用 requestAnimationFrame 确保设置生效
							requestAnimationFrame(() => {
								// 移除临时高度，恢复 flex 布局
								vditorContent.style.height = '';

								// 确保 overflow 属性正确
								vditorContent.style.overflowY = 'auto';
								vditorContent.style.overflowX = 'hidden';

								// 触发窗口 resize 事件
								window.dispatchEvent(new Event('resize'));
							});
						} else {
							// 确保 overflow 属性正确
							vditorContent.style.overflowY = 'auto';
							vditorContent.style.overflowX = 'hidden';

							// 触发窗口 resize 事件
							window.dispatchEvent(new Event('resize'));
						}
					});

					// 延迟再次触发，确保所有计算都完成
					setTimeout(() => {
						// 再次检查并确保 overflow 正确
						vditorContent.style.overflowY = 'auto';
						vditorContent.style.overflowX = 'hidden';

						// 触发窗口 resize 事件
						window.dispatchEvent(new Event('resize'));
					}, 100);

					// 最后再触发一次，确保滚动条正确显示
					setTimeout(() => {
						window.dispatchEvent(new Event('resize'));

						// 验证滚动条是否可用，如果不可用则强制设置
						if (vditorContent.scrollHeight > vditorContent.clientHeight) {
							vditorContent.style.overflowY = 'auto';
						}
					}, 300);
				}

				// 尝试调用 Vditor 实例的 resize 方法（如果存在）
				const vditorInstance =
					(editorElement as any).__vditor || (vditorElement as any).__vditor;
				if (vditorInstance && typeof vditorInstance.resize === 'function') {
					setTimeout(() => {
						try {
							vditorInstance.resize();
						} catch (e) {
							console.warn('Vditor resize method call failed:', e);
						}
					}, 200);
				}
			}
		}
	});
};

// 计算主界面编辑器高度
const calculateMainEditorHeight = () => {
	nextTick(() => {
		if (mainEditorContainerRef.value) {
			const containerHeight = mainEditorContainerRef.value.clientHeight;
			if (containerHeight > 0) {
				mainEditorHeight.value = containerHeight - 10; // 减去一些边距
			}
		}
	});
};

// 初始化主界面编辑器 ResizeObserver
const initMainEditorResizeObserver = () => {
	if (mainEditorContainerRef.value) {
		// 清理旧的观察器
		if (mainEditorResizeObserver) {
			mainEditorResizeObserver.disconnect();
		}

		// 创建新的观察器，监听宽度和高度变化
		mainEditorResizeObserver = new ResizeObserver(() => {
			calculateMainEditorHeight();
			triggerMainEditorResize();
		});

		// 开始观察容器
		mainEditorResizeObserver.observe(mainEditorContainerRef.value);

		// 初始化时计算一次高度
		calculateMainEditorHeight();
	}
};

// 清理主界面编辑器 ResizeObserver
const cleanupMainEditorResizeObserver = () => {
	if (mainEditorResizeObserver) {
		mainEditorResizeObserver.disconnect();
		mainEditorResizeObserver = null;
	}
};

// 打印预览相关
const printPreviewVisible = ref(false);
const pdfLoading = ref(false);
const pdfUrl = ref('');
const pdfBlob = ref<Blob | null>(null);
const overallPrintContentRef = ref<InstanceType<typeof OverallPrintContent>>();
const simplifyPrintContentRef = ref<InstanceType<typeof SimplifyPrintContent>>();
const specialPrintContentRef = ref<InstanceType<typeof SpecialPrintContent>>();
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
const moduleCode = ref(''); //全面评估
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
		assessmentType: moduleCode.value, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount,
		aiGuideSuggestion: content.aiGuideSuggestion
	};
	try {
		const res = await service.etiology.mua.add(params);
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
		if (moduleCode.value == 'mua2') {
			if (!overallPrintContentRef.value) {
				console.error('打印内容组件引用未找到，等待更长时间...');
				await new Promise(resolve => setTimeout(resolve, 1000));
				await nextTick();
			}
		} else if (moduleCode.value == 'mua1') {
			if (!simplifyPrintContentRef.value) {
				console.error('打印内容组件引用未找到，等待更长时间...');
				await new Promise(resolve => setTimeout(resolve, 1000));
				await nextTick();
			}
		} else if (moduleCode.value == 'mua3') {
			if (!specialPrintContentRef.value) {
				console.error('打印内容组件引用未找到，等待更长时间...');
				await new Promise(resolve => setTimeout(resolve, 1000));
				await nextTick();
			}
		}

		if (moduleCode.value == 'mua2') {
			if (!overallPrintContentRef.value) {
				ElMessage.error('打印内容组件加载失败，请重试');
				return;
			}
		} else if (moduleCode.value == 'mua1') {
			if (!simplifyPrintContentRef.value) {
				ElMessage.error('打印内容组件加载失败，请重试');
				return;
			}
		} else if (moduleCode.value == 'mua3') {
			if (!specialPrintContentRef.value) {
				ElMessage.error('打印内容组件加载失败，请重试');
				return;
			}
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

// 引用原始建议
const onApplySuggestionContent = async () => {
	try {
		content.aiGuideSuggestion = content.guideSuggestion;
		ElMessage.success('引用成功');
		onSave(false);
	} catch (error: any) {
		console.error('引用失败:', error);
		ElMessage.error('引用失败: ' + (error.message || '未知错误'));

		// 如果API调用失败，可以显示模拟数据用于测试
		content.aiGuideSuggestion = ``;
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
		// 确保编辑器保持启用状态
		nextTick(() => {
			enableEditorAndToolbar();
		});
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
		// 确保编辑器保持启用状态
		nextTick(() => {
			enableEditorAndToolbar();
		});
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

// 启用编辑器和工具栏（Vditor 编辑器不需要特殊处理，已通过 disabled 属性控制）
const enableEditorAndToolbar = () => {
	// Vditor 编辑器通过 disabled 属性控制启用/禁用状态
	// 不需要额外的 DOM 操作
};

// 切换原始建议区域的展开/收缩
const toggleRightSection = () => {
	aiOptimizeDialog.rightSectionExpanded = !aiOptimizeDialog.rightSectionExpanded;
};

// 切换主界面右侧面板的展开/收缩
const toggleMainRightSection = () => {
	mainRightSectionExpanded.value = !mainRightSectionExpanded.value;

	// 立即触发一次，确保快速响应
	nextTick(() => {
		triggerMainEditorResize();
	});

	// 等待 DOM 更新后再次触发
	setTimeout(() => {
		triggerMainEditorResize();
	}, 50);

	// 等待过渡动画完成（0.4s）后触发
	setTimeout(() => {
		triggerMainEditorResize();
	}, 450);

	// 最后再触发一次，确保滚动条正确显示
	setTimeout(() => {
		triggerMainEditorResize();
	}, 650);
};

const onNext = () => {
	ElMessage.success('进入下一步');
};

// 切换AI建议显示模式
const toggleRenderMode = () => {
	showRawContent.value = !showRawContent.value;
};

const aiFlag = ref(false);

//初始化
const initMua = async () => {
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	const code = await service.etiology.muaItems.queryModuleCode(params);
	if (code) {
		moduleCode.value = code;
		console.log('moduleCode:', moduleCode.value);
	}
};

/**
 * 刷新 MUA Suggestion 数据
 * @description 供外部调用的刷新方法，会检查组件是否已激活
 */
const refreshMuaSuggestion = async () => {
	try {
		// 先更新模块代码
		await initMua();

		// 检查组件是否已挂载（在 keep-alive 中可能未激活）
		await nextTick();

		// 检查编辑器容器是否存在
		const editorContainer = document.querySelector('.left-textarea-section .cl-editor-vditor');
		const isComponentActive = editorContainer !== null;

		if (isComponentActive) {
			// 组件已激活，正常加载内容
			await initMuaContent();
		} else {
			// 组件未激活，只更新数据，不触发编辑器重新渲染
			// 等待组件激活后再更新（通过 onActivated 钩子）
			const params = {
				swlNo: props.swlNo,
				serialNumber: props.serialNumber,
				assessmentType: moduleCode.value,
				patientNo: props.patientNo,
				assessmentCount: props.assessmentCount
			};
			try {
				const data = await service.etiology.mua.getMuaContent(params);
				// 只更新数据，不触发编辑器重新渲染
				if (data) {
					content.guideSuggestion = data?.guideSuggestion || '';
					content.aiGuideSuggestion = data?.aiGuideSuggestion || '';
				} else {
					content.guideSuggestion = '';
					content.aiGuideSuggestion = '';
				}
			} catch (error: any) {
				console.error('刷新评估内容失败:', error);
			}
		}
	} catch (error: any) {
		console.error('refreshMuaSuggestion失败:', error);
		ElMessage.error('刷新防治建议失败: ' + (error.message || '未知错误'));
	}
};

// 暴露方法供父组件调用
defineExpose({
	refreshMuaSuggestion
});

//进页面就加载
onMounted(async () => {
	// 先等待组件完全挂载
	await nextTick();

	await initMua();
	// 然后加载数据
	await initMuaContent();

	// 等待更长时间确保编辑器完全初始化并更新
	await new Promise(resolve => setTimeout(resolve, 300));
	await nextTick();

	const aiEnable = await service.base.sys.param.data({
		key: 'aiEnable'
	});
	//console.log('aiEnable:', aiEnable);
	if (aiEnable == '1') {
		aiFlag.value = true;
	} else {
		aiFlag.value = false;
	}

	// 初始化主界面编辑器 ResizeObserver
	nextTick(() => {
		initMainEditorResizeObserver();
	});
});

// keep-alive 组件激活时触发
onActivated(async () => {
	// 如果数据已更新但编辑器未渲染，此时重新渲染
	await nextTick();
	// 检查是否需要更新编辑器
	const editorContainer = document.querySelector('.left-textarea-section .cl-editor-vditor');
	if (editorContainer) {
		// 强制更新编辑器 key 以重新渲染
		await nextTick();
		guideSuggestionKey.value++;
		aiGuideSuggestionKey.value++;
	}
});

// 组件卸载时清理
onUnmounted(() => {
	cleanupMainEditorResizeObserver();
});

// 监听门诊号/住院号变化，页面已打开时也能即时刷新
watch(
	() => [props.outpatientNo, props.inpatientNo],
	async () => {
		try {
			// 重新拉取本页相关数据
			await initMuaContent();
		} catch (e) {}
	}
);

// 监听右侧面板展开状态，当面板展开时确保数据正确绑定
watch(
	() => mainRightSectionExpanded.value,
	async newVal => {
		if (newVal) {
			// 面板展开时，等待 DOM 更新后强制重新渲染 el-input
			await nextTick();
			guideSuggestionKey.value++;
		}
	}
);

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
		moduleCode: moduleCode.value, //简化评估
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
		const analysisParams = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: moduleCode.value, //简化评估
			patientNo: props.patientNo,
			assessmentCount: props.assessmentCount
		};
		const data = await service.etiology.muaItems.getMuaAnalysis(analysisParams);
		//console.log('data:', data);

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
					`如果需要重新生成防治建议替换当前建议，请点击"确认"按钮`,
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
		if (diagnosticCode.length > 0 && diagnosticCode.endsWith(',')) {
			diagnosticCode = diagnosticCode.substring(0, diagnosticCode.length - 1);
		}
		if (diagnosticName.length > 0 && diagnosticName.endsWith(',')) {
			diagnosticName = diagnosticName.substring(0, diagnosticName.length - 1);
		}
		const diagnosticCodeBase64 = base64Encode(diagnosticCode);
		const diagnosticNameBase64 = base64Encode(diagnosticName);
		const params = {
			diagnosticCode: diagnosticCodeBase64,
			diagnosticName: diagnosticNameBase64,
			patientNo: props.patientNo,
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: moduleCode.value,
			assessmentCount: props.assessmentCount
		};

		{
			const response = await service.etiology.muaItems.getMuaGuide(params);
			////console.log('response1111:', response);
			if (response != '' && response != null) {
				if (response.advice != '' && response.advice != null) {
					const adviceDecodeHtml = base64Decode(response.advice);
					content.guideSuggestion = adviceDecodeHtml;
				}

				if (aiFlag.value) {
					if (response.aiAdvice != '' && response.aiAdvice != null) {
						const aiAdviceDecodeHtml = base64Decode(response.aiAdvice);
						content.aiGuideSuggestion = aiAdviceDecodeHtml;
					}
				} else {
					if (response.advice != '' && response.advice != null) {
						const adviceDecodeHtml = base64Decode(response.advice);
						content.aiGuideSuggestion = adviceDecodeHtml;
					}
				}
				await onSave(false);
				ElMessage.success('防治建议完成');
			} else {
				ElMessage.success('当前评估结果没有匹配到防治建议');
				return;
			}
		}
	} catch (error: any) {
		console.error('防治建议失败:', error);
		ElMessage.error('防治建议失败: ' + (error.message || '未知错误'));
	} finally {
		// 无论成功或失败，都要隐藏加载状态
		treatmentLoading.value = false;
	}
};

//获取评估内容
const initMuaContent = async () => {
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		assessmentType: moduleCode.value, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	try {
		const data = await service.etiology.mua.getMuaContent(params);
		//console.log('initMuaContent data:', data);
		//console.log('aiGuideSuggestion value:', data?.aiGuideSuggestion);

		// 使用 nextTick 确保响应式更新，并处理 null/undefined 情况
		await nextTick();

		const newGuideSuggestion = data?.guideSuggestion || '';
		const newAiGuideSuggestion = data?.aiGuideSuggestion || '';

		// 检查值是否真的变化了
		const guideSuggestionChanged = content.guideSuggestion !== newGuideSuggestion;
		const aiGuideSuggestionChanged = content.aiGuideSuggestion !== newAiGuideSuggestion;

		if (data) {
			// 先赋值
			content.guideSuggestion = newGuideSuggestion;
			content.aiGuideSuggestion = newAiGuideSuggestion;
			//console.log('赋值后 content.aiGuideSuggestion:', content.aiGuideSuggestion);
		} else {
			// 如果 data 为空，确保重置为空字符串
			content.guideSuggestion = '';
			content.aiGuideSuggestion = '';
		}

		// 等待 DOM 更新
		await nextTick();

		// 检查编辑器容器是否存在（组件可能未激活）
		const editorContainer = document.querySelector('.left-textarea-section .cl-editor-vditor');
		const isComponentActive = editorContainer !== null;

		// 只在组件激活且值真正变化时才更新 key，避免不必要的重新渲染
		if (isComponentActive) {
			if (guideSuggestionChanged) {
				guideSuggestionKey.value++;
			}

			// 对于编辑器，如果值变化了，需要强制重新渲染以确保正确显示
			if (aiGuideSuggestionChanged) {
				// 等待一下确保编辑器有足够时间处理值的变化
				await new Promise(resolve => setTimeout(resolve, 100));
				await nextTick();
				aiGuideSuggestionKey.value++;
			}

			// 再次等待确保编辑器完全初始化
			await nextTick();
		}
		//console.log('最终 content.aiGuideSuggestion:', content.aiGuideSuggestion);
	} catch (error: any) {
		console.error('加载评估内容失败:', error);
		ElMessage.error('加载评估内容失败: ' + (error.message || '未知错误'));
		// 出错时也重置为空字符串
		content.guideSuggestion = '';
		content.aiGuideSuggestion = '';
		// 即使出错也要更新 key，确保组件重新渲染
		await nextTick();
		guideSuggestionKey.value++;
		aiGuideSuggestionKey.value++;
	}
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
			moduleCode: moduleCode.value,
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
			moduleCode: moduleCode.value,
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
			moduleCode: moduleCode.value
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
			moduleCode: moduleCode.value,
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
			moduleCode: moduleCode.value,
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
			moduleCode: moduleCode.value,
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
						cell.style.verticalAlign = 'top';
						cell.style.textAlign = 'center';
						cell.style.lineHeight = '1.2';
						cell.style.height = 'auto';
						cell.style.minHeight = '30px';

						// 为th和td设置不同的padding
						if (cell.tagName.toLowerCase() === 'th') {
							cell.style.padding = '0px 4px 16px 4px'; // th的上padding继续减少到1px，让文字更靠上
						} else {
							cell.style.padding = '2px 4px 14px 4px'; // td的上padding从6px减少到3px，让文字更靠上
						}
					});

					// 特殊处理建议内容单元格，确保左对齐
					const suggestionCells = clonedDoc.querySelectorAll('.suggestion-content');
					suggestionCells.forEach(cell => {
						cell.style.setProperty('text-align', 'left', 'important');
						cell.style.setProperty('padding-left', '12px', 'important');
						//cell.style.setProperty('white-space', 'pre-wrap', 'important');
						cell.style.setProperty('justify-content', 'flex-start', 'important');
						cell.style.setProperty('align-items', 'flex-start', 'important');
						cell.style.setProperty('display', 'block', 'important');
					});

					// 特殊处理assessment-result-table中的colspan单元格宽度
					const assessmentTables = clonedDoc.querySelectorAll('.assessment-result-table');
					assessmentTables.forEach(table => {
						// 设置表格为固定布局
						table.style.setProperty('table-layout', 'fixed', 'important');
						table.style.setProperty('width', '100%', 'important');

						// 强制设置colgroup列宽
						const colElements = table.querySelectorAll('col');
						colElements.forEach(col => {
							col.style.setProperty('width', '12.5%', 'important');
						});

						// 处理colspan=7的单元格（评估结果和防治建议内容列）
						const colspan7Cells = table.querySelectorAll('td[colspan="7"]');
						colspan7Cells.forEach(cell => {
							cell.style.setProperty('width', '87.5%', 'important'); // 7/8 = 87.5%
							cell.style.setProperty('min-width', '87.5%', 'important');
							cell.style.setProperty('max-width', '87.5%', 'important');
							cell.style.setProperty('display', 'table-cell', 'important');
						});

						// 处理标签列
						const labelCells = table.querySelectorAll(
							'.result-label, .suggestion-label'
						);
						labelCells.forEach(cell => {
							cell.style.setProperty('width', '12.5%', 'important');
							cell.style.setProperty('min-width', '12.5%', 'important');
							cell.style.setProperty('max-width', '12.5%', 'important');
							cell.style.setProperty('text-align', 'center', 'important');
							cell.style.setProperty('display', 'table-cell', 'important');
						});

						// 确保内容列正确显示
						const contentCells = table.querySelectorAll(
							'.result-content, .suggestion-content'
						);
						contentCells.forEach(cell => {
							cell.style.setProperty('width', '87.5%', 'important');
							cell.style.setProperty('min-width', '87.5%', 'important');
							cell.style.setProperty('max-width', '87.5%', 'important');
							cell.style.setProperty('display', 'table-cell', 'important');
							if (cell.classList.contains('suggestion-content')) {
								cell.style.setProperty('text-align', 'left', 'important');
								cell.style.setProperty('padding-left', '12px', 'important');
								//cell.style.setProperty('white-space', 'pre-wrap', 'important');
							}
						});

						// 处理签名行的单元格
						const signatureCells = table.querySelectorAll('.signature-row');
						signatureCells.forEach(cell => {
							cell.style.setProperty('width', '12.5%', 'important');
							cell.style.setProperty('min-width', '12.5%', 'important');
							cell.style.setProperty('max-width', '12.5%', 'important');
							cell.style.setProperty('display', 'table-cell', 'important');
							cell.style.setProperty('text-align', 'center', 'important');
						});
					});

					// 确保表格布局和colspan属性正确处理
					const allTables = clonedDoc.querySelectorAll('table');
					allTables.forEach(table => {
						// 检查是否是血液生化表格或尿常规表格，如果是则使用auto布局
						if (
							table.classList.contains('blood-chemistry-table') ||
							table.classList.contains('urine-routine-table')
						) {
							table.style.setProperty('table-layout', 'auto', 'important');
						} else {
							table.style.setProperty('table-layout', 'fixed', 'important');
						}
						table.style.setProperty('width', '100%', 'important');
						table.style.setProperty('border-collapse', 'collapse', 'important');
					});

					// 调整表格样式
					const printTables = clonedDoc.querySelectorAll('table');
					printTables.forEach(table => {
						// 检查是否是血液生化表格或尿常规表格，如果是则使用auto布局
						if (
							table.classList.contains('blood-chemistry-table') ||
							table.classList.contains('urine-routine-table')
						) {
							table.style.tableLayout = 'auto';
						} else {
							table.style.tableLayout = 'fixed';
						}
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

		if (moduleCode.value == 'mua2') {
			if (!overallPrintContentRef.value) {
				throw new Error('打印内容组件引用未找到');
			}
		} else if (moduleCode.value == 'mua1') {
			if (!simplifyPrintContentRef.value) {
				throw new Error('打印内容组件引用未找到');
			}
		} else if (moduleCode.value == 'mua3') {
			if (!specialPrintContentRef.value) {
				throw new Error('打印内容组件引用未找到');
			}
		}

		// 检查组件是否已经挂载
		if (moduleCode.value == 'mua2') {
			if (!overallPrintContentRef.value?.$el) {
				throw new Error('打印内容组件尚未挂载到DOM');
			}
		} else if (moduleCode.value == 'mua1') {
			if (!simplifyPrintContentRef.value?.$el) {
				throw new Error('打印内容组件尚未挂载到DOM');
			}
		} else if (moduleCode.value == 'mua3') {
			if (!specialPrintContentRef.value?.$el) {
				throw new Error('打印内容组件尚未挂载到DOM');
			}
		}

		//console.log(
		// 	'printContentRef.value.printContentRef:',
		// 	printContentRef.value.printContentRef
		// );
		////console.log('printContentRef.value.$el:', printContentRef.value.$el);

		let printContentElement;
		if (moduleCode.value == 'mua2') {
			printContentElement = overallPrintContentRef.value?.printContentRef;
		} else if (moduleCode.value == 'mua1') {
			printContentElement = simplifyPrintContentRef.value?.printContentRef;
		} else if (moduleCode.value == 'mua3') {
			printContentElement = specialPrintContentRef.value?.printContentRef;
		}
		if (!printContentElement) {
			throw new Error('打印内容组件的DOM元素未找到');
		}

		//console.log('printContentElement:', printContentElement);
		//console.log('printContentElement type:', typeof printContentElement);
		//console.log(
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

		//console.log('找到页面数量:', allPages?.length);
		//console.log('PDF宽度:', pdfWidth);

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

// Vditor 重置样式 - 确保编辑器伸展到底部
:deep(.cl-editor-vditor) {
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	min-height: 0;
	height: 100%;
	width: 100%;

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
		box-sizing: border-box; // 确保边框计算正确
		position: relative; // 确保定位上下文正确
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
		overflow-y: auto !important;
		overflow-x: hidden !important;
		position: relative; // 确保定位上下文正确
		box-sizing: border-box; // 确保边框计算正确

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

.split-layout-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: transparent;
	padding: 0px;
	gap: 0;
	overflow: hidden;
	position: relative;
	min-height: 0;
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
	flex-direction: row;
	gap: 12px;
	width: 100%;
	flex: 1 1 auto;
	min-height: 0;
	height: 100%;
	padding: 5px;
	padding-right: 5px; // 确保右侧有足够空间显示边框
	background-color: var(--el-fill-color-blank);
	border: 1px solid var(--el-border-color-light);
	border-radius: 8px;
	margin-bottom: 0;
	transition: gap 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	overflow: visible; // 确保内容不被裁剪

	&.right-collapsed {
		gap: 0;
	}

	.left-textarea-section {
		flex: 0 0 60%; // 默认占3/5
		display: flex;
		flex-direction: column;
		gap: 0px;
		min-width: 0;
		min-height: 0;
		height: 100%;
		transition: flex 0.4s cubic-bezier(0.4, 0, 0.2, 1);

		.textarea-container {
			flex: 1 1 auto;
			min-height: 0;
			height: 100%;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}

		&.full-width {
			flex: 1 1 auto; // 当右侧收缩时占满
			min-height: 0;
			height: 100%;
			width: 100%;

			.textarea-container {
				flex: 1 1 auto;
				min-height: 0;
				height: 100%;
				display: flex;
				flex-direction: column;
			}
		}

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
				flex: 1;
				padding-right: 16px; // 添加右边距，避免与边框重叠

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

				.toggle-right-panel-btn {
					height: 32px;
					font-size: 13px;
					margin-left: auto;
					margin-right: 0; // 确保按钮不超出容器

					.toggle-right-panel-btn__text {
						margin-left: 4px;
					}
				}
			}
		}
	}

	.right-textarea-section {
		flex: 0 0 40%; // 占2/5
		display: flex;
		flex-direction: column;
		gap: 0px;
		min-width: 0;
		min-height: 0;
		height: 100%;
		max-width: 40%;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: visible; // 改为 visible，确保边框可见
		padding-right: 8px; // 添加右边距，确保边框完全可见

		&.collapsed {
			flex: 0 0 0;
			min-width: 0;
			max-width: 0;
			opacity: 0;
			overflow: hidden;
			margin: 0;
			padding: 0;
		}

		.right-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 20px;
			margin-bottom: 8px;
			padding-right: 16px; // 添加右边距，避免与边框重叠

			.section-label {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0;
				padding: 0;
				line-height: 1.4;
			}

			.optimize-btn {
				// 确保按钮高度与左侧按钮一致（Element Plus small 按钮默认高度为 24px）
				height: 24px;
				padding: 4px 15px;
				font-size: 12px;
			}

			.toggle-right-panel-btn {
				margin-left: auto;
				margin-right: 0; // 确保按钮不超出容器
			}
		}

		.right-textarea-container {
			flex: 1 1 auto;
			min-height: 0;
			height: 100%;
			border: 1px solid var(--el-border-color-light);
			border-radius: 4px;
			background-color: white;
			overflow: hidden;
			margin-right: 0; // 确保右边框可见
			box-sizing: border-box; // 确保边框计算正确
			width: 100%; // 确保宽度正确计算
			display: flex;
			flex-direction: column;

			:deep(.el-scrollbar) {
				flex: 1;
				min-height: 0;
				height: 100%;

				.el-scrollbar__wrap {
					height: 100%;
				}

				.el-scrollbar__view {
					height: 100%;
				}
			}

			.scrollable-textarea {
				flex: 1 1 auto;
				min-height: 0;
				height: 100%;
				display: flex;
				flex-direction: column;

				:deep(.el-textarea) {
					flex: 1 1 auto;
					min-height: 0;
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				:deep(.el-textarea__inner) {
					flex: 1 1 auto;
					min-height: 0;
					height: 100% !important;
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

			// AI建议输入框样式（左侧）- 提高优先级确保样式生效
			.scrollable-textarea.ai-suggestion-textarea {
				:deep(.el-textarea__inner) {
					font-size: 18px !important; // 字体大一号（从14px到18px）
					font-weight: 500 !important; // 字体加粗，区别于下方
					color: var(--el-text-color-primary) !important;
					letter-spacing: 0.3px !important; // 字间距
					line-height: 1.6 !important; // 行高调整，提升可读性
				}
			}

			// 为 guideSuggestion 增加字体大小（右侧）
			.guide-suggestion-textarea {
				:deep(.el-textarea__inner) {
					font-size: 16px !important; // 从 14px 增加到 15px（增加一号）
				}
			}
		}

		.section-header {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			gap: 8px;
			margin-bottom: 8px;
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
			flex: 1 1 auto;
			min-height: 0;
			height: 100%;
			border: 1px solid var(--el-border-color-light);
			border-radius: 4px;
			background-color: white;
			overflow: hidden;
			box-sizing: border-box; // 确保边框计算正确
			width: 100%; // 确保宽度正确计算
			display: flex;
			flex-direction: column;

			:deep(.el-scrollbar) {
				flex: 1 1 auto;
				min-height: 0;
				height: 100%;
				display: flex;
				flex-direction: column;

				.el-scrollbar__wrap {
					flex: 1 1 auto;
					min-height: 0;
					height: 100%;
				}

				.el-scrollbar__view {
					flex: 1 1 auto;
					min-height: 0;
					height: 100%;
					display: flex;
					flex-direction: column;
				}
			}

			.scrollable-textarea {
				flex: 1 1 auto;
				min-height: 0;
				height: 100%;
				display: flex;
				flex-direction: column;

				:deep(.el-textarea) {
					flex: 1 1 auto;
					min-height: 0;
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				:deep(.el-textarea__inner) {
					flex: 1 1 auto;
					min-height: 0;
					height: 100% !important;
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

			.right-panel-content {
				padding: 12px;
				font-size: 14px;
				line-height: 1.8;
				color: var(--el-text-color-regular);
			}
		}
	}
}

// AI生成弹窗样式
.ai-optimize-dialog {
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
	height: 100%;
	padding: 2px 24px 2px 2px; // 右侧再增加一点 padding，确保按钮和边框完整显示
	overflow: visible; // 确保内容不被裁剪

	// 主要内容区域：左右布局
	.main-content-section {
		flex: 1;
		display: flex;
		flex-direction: row;
		gap: 12px;
		min-height: 0;
		height: 100%;
		overflow-x: visible; // 允许水平方向溢出，确保边框完整显示
		overflow-y: hidden; // 防止垂直方向溢出
		padding-right: 16px; // 为右侧边框和按钮留出更多空间
		position: relative; // 确保定位正确
	}

	// 左侧：编辑器（占3/5，当右侧收缩时占100%）
	.left-section {
		flex: 0 0 60%; // 默认占60%
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
		min-height: 0;
		height: 100%;
		transition: flex 0.4s cubic-bezier(0.4, 0, 0.2, 1);

		&.full-width {
			flex: 1 1 auto; // 当右侧收缩时占满
			min-height: 0;
			height: 100%;
			width: 100%;

			.textarea-container {
				flex: 1 1 auto;
				min-height: 0;
				height: 100%;
			}
		}
	}

	// 右侧：原始建议（占2/5，可展开/收缩）
	.right-section {
		flex: 0 0 40%; // 2/5 = 40%
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
		min-height: 0;
		height: 100%;
		min-height: 0;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: visible; // 确保边框完整显示
		box-sizing: border-box; // 确保边框计算正确
		margin-right: 0; // 确保右侧有足够空间
		padding-right: 0; // 确保内容不被裁剪
	}

	.left-section,
	.right-section {
		position: relative;
		z-index: 1;

		.section-header {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			gap: 8px;
			flex-wrap: wrap;
			position: relative;
			z-index: 1;
			overflow: visible; // 确保按钮不被裁剪
			min-width: 0; // 允许收缩，但确保内容可见

			.header-buttons {
				display: flex;
				align-items: center;
				gap: 8px;
			}

			.optimize-btn {
				flex-shrink: 0;
				height: 28px;
				padding: 4px 12px;
				font-size: 12px;
				border-radius: 4px;
				transition: all 0.3s ease;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

				&:hover {
					transform: translateY(-1px);
					box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
				}

				&:active {
					transform: translateY(0);
				}
			}

			.toggle-right-panel-btn {
				margin-left: auto;
				flex-shrink: 0;
				display: inline-flex;
				align-items: center;
				gap: 6px;
				height: 30px;
				padding: 4px 12px;
				font-size: 12px;
				border-radius: 16px;
				transition: all 0.3s ease;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
				position: relative; // 确保按钮定位正确
				z-index: 10; // 确保按钮在最上层
				overflow: visible; // 确保按钮内容不被裁剪

				&:hover {
					transform: translateY(-1px);
					box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
				}

				&:active {
					transform: translateY(0);
				}

				.toggle-right-panel-btn__text {
					white-space: nowrap;
					overflow: visible; // 确保文字不被裁剪
				}
			}
		}

		.section-label {
			font-size: 14px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			margin: 0;
			padding: 0;
			line-height: 1.4;
			flex-shrink: 0;
			margin-right: 4px;
		}

		.textarea-container {
			flex: 1 1 auto;
			min-height: 0;
			height: 100%;
			border: 1px solid var(--el-border-color-light);
			border-radius: 4px;
			background-color: white;
			overflow: hidden;
			box-sizing: border-box; // 确保边框计算正确
			width: 100%; // 确保宽度正确计算
			position: relative; // 确保边框定位正确
			display: flex;
			flex-direction: column;

			:deep(.el-scrollbar) {
				flex: 1 1 auto;
				min-height: 0;
				height: 100%;
				display: flex;
				flex-direction: column;

				.el-scrollbar__wrap {
					flex: 1 1 auto;
					min-height: 0;
					height: 100%;
				}

				.el-scrollbar__view {
					flex: 1 1 auto;
					min-height: 0;
					height: 100%;
					display: flex;
					flex-direction: column;
				}
			}

			.scrollable-textarea {
				flex: 1 1 auto;
				min-height: 0;
				height: 100%;
				display: flex;
				flex-direction: column;

				:deep(.el-textarea) {
					flex: 1 1 auto;
					min-height: 0;
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				:deep(.el-textarea__inner) {
					flex: 1 1 auto;
					min-height: 0;
					height: 100% !important;
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

	// 过渡动画 - 优化为更平滑的效果
	.slide-fade-enter-active {
		transition:
			opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			flex 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: visible; // 确保边框完整显示
	}

	.slide-fade-leave-active {
		transition:
			opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			flex 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: visible; // 确保边框完整显示
	}

	.slide-fade-enter-from {
		opacity: 0;
		transform: translateX(15px);
		flex: 0 0 0;
		min-width: 0;
		overflow: hidden; // 收缩时隐藏溢出
	}

	.slide-fade-leave-to {
		opacity: 0;
		transform: translateX(15px);
		flex: 0 0 0;
		min-width: 0;
		overflow: hidden; // 收缩时隐藏溢出
	}

	.slide-fade-enter-to,
	.slide-fade-leave-from {
		opacity: 1;
		transform: translateX(0);
		flex: 0 0 40%;
		overflow: visible; // 展开时确保边框完整显示
	}
}

// 富文本编辑器样式 - 与 html-rendered-content 保持一致
:deep(.rich-text-editor) {
	@include html-content-styles;
}

// HTML内容直接显示样式（使用v-html时）
.html-content-display {
	@include html-content-styles;
	min-height: 200px;
	padding: 12px;
	border: 1px solid var(--el-border-color-light);
	border-radius: 4px;
	background-color: white;
	outline: none;

	&:focus {
		border-color: var(--el-color-primary);
	}
}

// AI建议内容渲染样式
.ai-suggestion-content {
	flex: 1 1 auto;
	min-height: 0;
	height: 100%;
	display: flex;
	flex-direction: column;

	:deep(.html-rendered-content) {
		@include html-content-styles;
	}

	// AI建议输入框样式（左侧）- 使用多重选择器提高优先级
	:deep(.ai-suggestion-textarea),
	:deep(.scrollable-textarea.ai-suggestion-textarea),
	:deep(.ai-suggestion-content .scrollable-textarea.ai-suggestion-textarea) {
		.el-textarea__inner {
			font-size: 16px !important; // 字体大一号（从14px到18px）
			font-weight: 500 !important; // 字体加粗，区别于下方
			color: var(--el-text-color-primary) !important;
			letter-spacing: 0.3px !important; // 字间距
			line-height: 1.6 !important; // 行高调整，提升可读性
		}
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
				//white-space: pre-wrap;
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
