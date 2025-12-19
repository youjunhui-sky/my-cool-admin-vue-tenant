<template>
	<cl-form ref="LabItemBindingForm">
		<template #slot-lab-binding-tables>
			<div class="lab-binding-container">
				<!-- 搜索条件区域 - 移到顶部 -->
				<div class="search-conditions-top">
					<el-form :model="searchForm" inline size="small" label-width="60px">
						<div class="search-row">
							<el-form-item label="姓名">
								<el-input
									v-model="searchForm.name"
									placeholder="姓名"
									clearable
									style="width: 100px"
									@change="handleSearchChange"
								/>
							</el-form-item>
							<el-form-item label="就诊号">
								<el-input
									v-model="searchForm.visitNo"
									placeholder="就诊号"
									clearable
									style="width: 100px"
									@change="handleSearchChange"
								/>
							</el-form-item>
							<el-form-item label="身份证">
								<el-input
									v-model="searchForm.idCard"
									placeholder="身份证号"
									clearable
									style="width: 150px"
									@change="handleSearchChange"
								/>
							</el-form-item>
							<el-form-item label="时间">
								<el-date-picker
									v-model="searchForm.dateRange"
									type="daterange"
									range-separator="至"
									start-placeholder="开始"
									end-placeholder="结束"
									format="YYYY-MM-DD"
									value-format="YYYY-MM-DD"
									style="width: 220px"
									@change="handleSearchChange"
								/>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="handleSearch" size="small">
									搜索
								</el-button>
								<el-button @click="handleResetSearch" size="small">
									重置
								</el-button>
							</el-form-item>
						</div>
					</el-form>
				</div>

				<!-- 表格容器 -->
				<div
					class="tables-container"
					style="display: flex; flex-direction: column; flex: 1; gap: 10px; min-height: 0"
				>
					<!-- 上方表格 - 检验项目组 -->
					<div
						class="left-table-container"
						style="
							flex: 0 0 50% !important;
							width: 100% !important;
							display: flex;
							flex-direction: column;
							border-radius: 8px;
							overflow: hidden;
							background: var(--el-bg-color);
							box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
						"
					>
						<div class="table-header">
							检验项目组{{
								props.currentGroupName
									? ' ------- 当前绑定：（' + props.currentGroupName + '）'
									: ''
							}}
						</div>

						<el-table
							:data="paginatedLabGroupData"
							style="width: 100%"
							height="220"
							highlight-current-row
							border
							:header-cell-style="{
								background: 'var(--el-fill-color-light)',
								color: 'var(--el-text-color-primary)',
								fontWeight: 'bold',
								padding: '2px'
							}"
							:row-class-name="getLabGroupRowClassName"
							@current-change="handleLabGroupRowClick"
							@selection-change="handleLabGroupSelectionChange"
						>
							<el-table-column type="selection" width="50" align="center" />

							<el-table-column
								prop="reportTime"
								label="时间"
								width="200"
								align="center"
							/>
							<el-table-column
								prop="groupName"
								label="名称"
								width="500"
								align="left"
								show-overflow-tooltip
							/>
							<el-table-column prop="name" label="姓名" width="80" align="center" />
							<el-table-column
								prop="visitNo"
								label="就诊号"
								width="120"
								align="center"
							/>
							<el-table-column
								prop="visitType"
								label="类型"
								width="80"
								align="center"
							>
								<template #default="{ row }">
									{{
										row.visitType === '1' || row.visitType === 1
											? '门诊'
											: row.visitType === '2' || row.visitType === 2
												? '住院'
												: row.visitType
									}}
								</template>
							</el-table-column>
						</el-table>

						<!-- 分页组件 -->
						<div class="pagination-container">
							<el-pagination
								v-model:current-page="labGroupPagination.currentPage"
								v-model:page-size="labGroupPagination.pageSize"
								:page-sizes="[10, 20, 50, 100]"
								size="small"
								:total="labGroupPagination.total"
								layout="total, sizes, prev, pager, next, jumper"
								@size-change="handleLabGroupSizeChange"
								@current-change="handleLabGroupCurrentChange"
							/>
						</div>
					</div>

					<!-- 下方表格 - 检验项目详情（拆分成两个表格，左右结构） -->
					<div
						class="right-table-container"
						style="
							flex: 0 0 50% !important;
							width: 100% !important;
							display: flex;
							flex-direction: row;
							gap: 10px;
							border-radius: 8px;
							overflow: visible;
						"
					>
						<!-- 左侧表格 -->
						<div
							class="lab-item-table-wrapper"
							style="
								flex: 1;
								display: flex;
								flex-direction: column;
								border-radius: 8px;
								overflow: hidden;
								background: var(--el-bg-color);
								box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
								min-width: 0;
							"
						>
							<div class="table-header">
								检验项目详情（一）
								<span v-if="selectedLabGroup" class="selected-group-info">
									（{{ selectedLabGroup.groupName }}）
								</span>
							</div>
							<el-table
								:data="labItemDataPart1"
								style="width: 100%"
								height="300"
								border
								v-loading="labItemLoading"
								element-loading-text="加载中..."
								:row-class-name="getLabItemRowClassName"
								:header-cell-style="{
									background: 'var(--el-fill-color-light)',
									color: 'var(--el-text-color-primary)',
									fontWeight: 'bold',
									padding: '8px'
								}"
							>
								<el-table-column
									prop="itemCode"
									label="项目编码"
									width="150"
									align="center"
								/>
								<el-table-column
									prop="itemName"
									label="项目名称"
									width="200"
									align="left"
									show-overflow-tooltip
								/>
								<el-table-column
									prop="resultValue"
									label="结果"
									width="100"
									align="center"
								/>
								<el-table-column
									prop="unit"
									label="单位"
									width="100"
									align="center"
								/>
								<el-table-column
									prop="referenceRange"
									label="参考范围"
									width="150"
									align="center"
									show-overflow-tooltip
								/>
								<el-table-column
									prop="resultFlag"
									label="结果标识"
									width="100"
									align="center"
								/>
								<el-table-column
									prop="criticalValueFlag"
									label="危急值标识"
									width="120"
									align="center"
								/>
							</el-table>
						</div>

						<!-- 右侧表格 -->
						<div
							class="lab-item-table-wrapper"
							style="
								flex: 1;
								display: flex;
								flex-direction: column;
								border-radius: 8px;
								overflow: hidden;
								background: var(--el-bg-color);
								box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
								min-width: 0;
							"
						>
							<div class="table-header">
								检验项目详情（二）
								<span v-if="selectedLabGroup" class="selected-group-info">
									（{{ selectedLabGroup.groupName }}）
								</span>
							</div>
							<el-table
								:data="labItemDataPart2"
								style="width: 100%"
								height="300"
								border
								v-loading="labItemLoading"
								element-loading-text="加载中..."
								:row-class-name="getLabItemRowClassName"
								:header-cell-style="{
									background: 'var(--el-fill-color-light)',
									color: 'var(--el-text-color-primary)',
									fontWeight: 'bold',
									padding: '8px'
								}"
							>
								<el-table-column
									prop="itemCode"
									label="项目编码"
									width="150"
									align="center"
								/>
								<el-table-column
									prop="itemName"
									label="项目名称"
									width="200"
									align="left"
									show-overflow-tooltip
								/>
								<el-table-column
									prop="resultValue"
									label="结果"
									width="100"
									align="center"
								/>
								<el-table-column
									prop="unit"
									label="单位"
									width="100"
									align="center"
								/>
								<el-table-column
									prop="referenceRange"
									label="参考范围"
									width="150"
									align="center"
									show-overflow-tooltip
								/>
								<el-table-column
									prop="resultFlag"
									label="结果标识"
									width="100"
									align="center"
								/>
								<el-table-column
									prop="criticalValueFlag"
									label="危急值标识"
									width="120"
									align="center"
								/>
							</el-table>
						</div>
					</div>
				</div>

				<!-- 尿类型选择和操作按钮 -->
				<div class="urine-type-and-actions">
					<div class="action-buttons">
						<el-button
							type="primary"
							@click="bindSelectedGroups"
							:disabled="
								batchProcessing || selectedLabGroups.length === 0 || !canBatchBind
							"
							:loading="batchProcessing && batchType === 'bind'"
							size="default"
						>
							绑 定
						</el-button>
						<el-button @click="close" size="default"> 关 闭 </el-button>
					</div>

					<!-- 批量进度显示 -->
					<div v-if="batchProcessing" style="margin-top: 2px">
						<el-progress
							:percentage="batchPercent"
							:text-inside="true"
							:stroke-width="18"
						/>
						<el-text type="info" style="margin-left: 2px">
							{{ batchDone }}/{{ batchTotal }} 完成（成功 {{ batchSuccess }}）
						</el-text>
					</div>
				</div>
			</div>
		</template>
	</cl-form>
</template>

<script setup lang="ts">
import { useForm } from '@cool-vue/crud';
import { ref, reactive, computed } from 'vue';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';

const { service } = useCool();

// Props 定义
interface Props {
	patientNo: string;
	swlNo: string;
	serialNumber: string;
	moduleCode: string;
	assessmentCount: number;
	testCount?: string; // 检验次数，可选
	assessmentType?: string; // 评估级别，可选
	name?: string; // 患者姓名，可选
	outpatientNo?: string; // 门诊号，可选
	inpatientNo?: string; // 住院号，可选
	currentGroupCode?: string; // 当前组编码，可选
	currentGroupName?: string; // 当前组名称，可选
}

const props = withDefaults(defineProps<Props>(), {
	testCount: '',
	assessmentType: '',
	name: '',
	outpatientNo: '',
	inpatientNo: ''
});

// Emits 定义
const emit = defineEmits<{
	bound: []; // 绑定成功后触发
	unbound: []; // 解绑成功后触发
}>();

// 表单引用
const LabItemBindingForm = useForm();

// 实验室报告数据绑定相关数据
const labGroupData = ref<
	Array<{
		reportTime: string;
		groupCode: string;
		groupName: string;
		name: string;
		patientNo: string;
		patientId: string;
		visitNo: string;
		visitType: string;
		idCard?: string;
		createTime?: string;
		assessmentType?: string;
		reportNo?: string;
	}>
>([]);

const labItemData = ref<
	Array<{
		itemCode: string;
		itemName: string;
		testTypeName: string;
		unit: string;
		referenceRange: string;
		resultValue?: string;
		resultFlag?: string;
		criticalValueFlag?: string;
	}>
>([]);

const selectedLabGroup = ref<{
	reportTime: string;
	groupCode: string;
	groupName: string;
	reportNo: string;
	name: string;
	patientNo: string;
	patientId: string;
	visitNo: string;
	visitType: string;
} | null>(null);

// 多选：已选中的检验项目组
const selectedLabGroups = ref<any[]>([]);

// 是否可批量绑定/解绑（去除 isBinding 后，始终允许，具体校验在操作时进行）
const canBatchBind = computed(() => {
	return true;
});
const canBatchUnbind = computed(() => {
	return true;
});

const labItemLoading = ref(false);

// 批量处理状态
const batchProcessing = ref(false);
const batchType = ref<'bind' | 'unbind' | ''>('');
const batchTotal = ref(0);
const batchDone = ref(0);
const batchSuccess = ref(0);
const batchPercent = computed(() => {
	if (batchTotal.value === 0) return 0;
	return Math.min(100, Math.round((batchDone.value / batchTotal.value) * 100));
});

// 分页相关数据
const labGroupPagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
});

// 搜索表单数据
const searchForm = reactive({
	name: '',
	visitNo: '',
	idCard: '',
	dateRange: [] as string[],
	assessmentType: '', // 评估级别
	testCount: '' // 检验次数
});

// 原始数据备份，用于搜索过滤
const originalLabGroupData = ref<
	Array<{
		reportTime: string;
		groupCode: string;
		groupName: string;
		name: string;
		patientNo: string;
		patientId: string;
		visitNo: string;
		visitType: string;
		idCard?: string;
		createTime?: string;
		isBinding?: string;
		assessmentType?: string;
		reportNo?: string;
	}>
>([]);

// 计算分页后的数据
const paginatedLabGroupData = computed(() => {
	const start = (labGroupPagination.currentPage - 1) * labGroupPagination.pageSize;
	const end = start + labGroupPagination.pageSize;
	return labGroupData.value.slice(start, end);
});

// 将检验项目详情数据平均分成两部分
const labItemDataPart1 = computed(() => {
	const total = labItemData.value.length;
	const mid = Math.ceil(total / 2);
	return labItemData.value.slice(0, mid);
});

const labItemDataPart2 = computed(() => {
	const total = labItemData.value.length;
	const mid = Math.ceil(total / 2);
	return labItemData.value.slice(mid);
});

// ========== 公共方法 ==========

/**
 * 打开绑定弹窗
 */
const open = (options?: {
	testCount?: string;
	dialog?: {
		padding?: string;
		fullscreen?: boolean;
		[key: string]: any;
	};
}) => {
	console.log('options?.testCount:', options?.testCount);
	console.log('props.testCount:', props.testCount);
	// 如果传入了 testCount，则先设置默认值（优先级：options > props）
	if (options?.testCount) {
		searchForm.testCount = options.testCount;
		console.log('searchForm.testCount:', searchForm.testCount);
	} else if (props.testCount) {
		searchForm.testCount = props.testCount;
	}

	// 初始化数据（内部会根据 searchForm.testCount 触发首次搜索）
	initializeLabBindingData();

	// 打开绑定管理弹窗
	LabItemBindingForm.value?.open({
		title: '实验室报告数据绑定',
		width: '80%',
		height: '95vh',
		props: {
			inline: false,
			labelPosition: 'top',
			labelWidth: '0px'
		},
		dialog: {
			top: '2%',
			controls: ['fullscreen', 'close'],
			customClass: 'lab-binding-dialog',
			...(options?.dialog || {})
		},
		form: {
			testCount: searchForm.testCount
		},
		items: [
			{
				prop: 'labBindingTables',
				component: {
					name: 'slot-lab-binding-tables'
				},
				span: 24,
				style: {
					width: '100%',
					height: '100%'
				}
			}
		],
		op: {
			hidden: true // 隐藏底部按钮
		}
	});
};

/**
 * 关闭绑定弹窗
 */
const close = () => {
	LabItemBindingForm.value?.close();
};

/**
 * 初始化实验室报告数据绑定数据
 */
const initializeLabBindingData = async () => {
	console.log('currentGroupCode:', props.currentGroupCode);
	console.log('currentGroupName:', props.currentGroupName);
	// 清空搜索表单数据
	searchForm.name = props.name || '';
	searchForm.visitNo = props.outpatientNo || props.inpatientNo || '';
	searchForm.idCard = '';
	searchForm.dateRange = [];
	searchForm.assessmentType = props.assessmentType || '';
	console.log('searchForm.testCount:', searchForm.testCount);

	// 清空检验项目组数据
	labGroupData.value = [];
	originalLabGroupData.value = [];

	// 清空检验项目详情数据
	labItemData.value = [];

	// 清空选中的检验项目组
	selectedLabGroup.value = null;

	// 重置分页数据
	labGroupPagination.currentPage = 1;
	labGroupPagination.pageSize = 10;
	labGroupPagination.total = 0;

	// 停止加载状态
	labItemLoading.value = false;

	await handleSearch();
};

// ========== 数据加载方法 ==========

// 加载实验室报告数据
const loadLabGroupData = async () => {
	try {
		labItemData.value = [];
		const params: any = {};
		// 按姓名过滤
		if (searchForm.name.trim()) {
			params.name = searchForm.name.trim();
		}

		// 按档案号过滤
		if (searchForm.visitNo.trim()) {
			params.visitNo = searchForm.visitNo.trim();
		}

		// 按身份证号过滤
		if (searchForm.idCard.trim()) {
			params.idCard = searchForm.idCard.trim();
		}

		// 按时间范围过滤
		if (searchForm.dateRange && searchForm.dateRange.length === 2) {
			const [startDate, endDate] = searchForm.dateRange;
			params.startTime = startDate;
			params.endTime = endDate;
		}

		params.testCount = searchForm.testCount;
		params.assessmentType = props.moduleCode;
		params.moduleCode = props.moduleCode;
		params.swlNo = props.swlNo;
		params.serialNumber = props.serialNumber;
		params.assessmentCount = props.assessmentCount;

		const mockData = await service.etiology.muaItems.getHisReportMain(params);

		// 保存原始数据
		originalLabGroupData.value = [...mockData];
		labGroupData.value = [...mockData];

		// 更新分页总数
		labGroupPagination.total = mockData.length;
	} catch (error: any) {
		console.error('加载检验项目组失败:', error);
		ElMessage.error('加载检验项目组失败: ' + (error.message || '未知错误'));
	}
};

// 加载检验项目详情数据
const loadLabItemData = async (row: any) => {
	try {
		labItemLoading.value = true;

		const params = {
			patientNo: row.patientNo,
			patientId: row.patientId,
			visitType: row.visitType,
			reportNo: row.reportNo
		};

		const mockData = await service.etiology.muaItems.getHisReportMx(params);

		labItemData.value = mockData;
	} catch (error: any) {
		console.error('加载检验项目详情失败:', error);
		ElMessage.error('加载检验项目详情失败: ' + (error.message || '未知错误'));
	} finally {
		labItemLoading.value = false;
	}
};

// ========== 表格相关方法 ==========

// 处理检验项目组行点击
const handleLabGroupRowClick = (row: any) => {
	selectedLabGroup.value = row;
	if (row) {
		loadLabItemData(row);
	}
};

// 多选变更
const handleLabGroupSelectionChange = (selection: any[]) => {
	selectedLabGroups.value = selection;
	// 兼容原有单选逻辑：取第一项作为当前项
	if (selection && selection.length > 0) {
		selectedLabGroup.value = selection[0];
	} else {
		selectedLabGroup.value = null;
	}
};

// 获取检验项目组表格行样式类名
const getLabGroupRowClassName = ({ row }: { row: any }) => {
	if (selectedLabGroup.value && selectedLabGroup.value.groupCode === row.groupCode) {
		return 'selected-lab-group-row';
	}
	return '';
};

// 获取检验项目详情表格行样式类名（当resultFlag为H或L时，整行字体变红）
const getLabItemRowClassName = ({ row }: { row: any }) => {
	if (row.resultFlag === 'H' || row.resultFlag === 'L') {
		return 'lab-item-row-red';
	}
	return '';
};

// ========== 搜索相关方法 ==========

// 搜索按钮点击事件
const handleSearch = async () => {
	// 验证：至少填写一个搜索条件
	const hasName = searchForm.name && searchForm.name.trim() !== '';
	const hasVisitNo = searchForm.visitNo && searchForm.visitNo.trim() !== '';
	const hasIdCard = searchForm.idCard && searchForm.idCard.trim() !== '';
	const hasDateRange = searchForm.dateRange && searchForm.dateRange.length === 2;
	const hasTestCount = searchForm.testCount && String(searchForm.testCount).trim() !== '';

	if (!hasName && !hasVisitNo && !hasIdCard && !hasDateRange && !hasTestCount) {
		ElMessage.warning('请至少填写一个搜索条件（姓名、就诊号、身份证或时间）');
		return;
	}

	try {
		// 加载检验项目组数据
		await loadLabGroupData();
	} catch (error) {
		console.error('搜索失败:', error);
		ElMessage.error('搜索失败，请重试');
	}
};

// 重置搜索条件
const handleResetSearch = () => {
	// 清空搜索表单数据
	searchForm.name = '';
	searchForm.visitNo = '';
	searchForm.idCard = '';
	searchForm.dateRange = [];
	searchForm.assessmentType = props.assessmentType || '';
	searchForm.testCount = props.testCount || '';

	// 清空所有数据
	labGroupData.value = [];
	originalLabGroupData.value = [];

	// 重置分页
	labGroupPagination.total = 0;
	labGroupPagination.currentPage = 1;

	// 清空右侧选择
	selectedLabGroup.value = null;
	labItemData.value = [];

	ElMessage.info('搜索条件已重置');
};

// 搜索条件变化时的处理（可选，实现实时搜索）
const handleSearchChange = () => {
	// 如果需要实时搜索，可以在这里调用 handleSearch()
	// handleSearch();
};

// ========== 绑定/解绑相关方法 ==========

// 绑定选中的检验项目组
const bindSelectedGroup = async () => {
	if (!selectedLabGroup.value) {
		ElMessage.warning('请先选择检验项目组');
		return;
	}

	try {
		// 调用绑定接口
		const params = {
			patientNo: props.patientNo,
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			assessmentType: searchForm.assessmentType || props.moduleCode,
			assessmentCount: props.assessmentCount,
			reportNo: selectedLabGroup.value.reportNo,
			groupCode: selectedLabGroup.value.groupCode,
			hisPatientNo: selectedLabGroup.value.patientNo,
			hisPatientId: selectedLabGroup.value.patientId,
			hisVisitType: selectedLabGroup.value.visitType,
			hisVisitNo: selectedLabGroup.value.visitNo,
			testCount: searchForm.testCount, // 添加检验次数
			urineType: '', // 添加尿类型
			currentGroupCode: props.currentGroupCode
		};

		await service.etiology.muaItems.bindHisLab(params);

		// 去除 isBinding 字段后的状态更新无需处理列表状态

		ElMessage.success(`检验项目组 "${selectedLabGroup.value.groupName}" 绑定成功`);

		// 触发绑定成功事件
		emit('bound');
	} catch (error: any) {
		console.error('绑定检验项目组失败:', error);
		ElMessage.error('绑定检验项目组失败: ' + (error.message || '未知错误'));
	}
};

/**
 * 批量绑定已选检验项目组
 */
const bindSelectedGroups = async () => {
	if (!selectedLabGroups.value || selectedLabGroups.value.length === 0) {
		ElMessage.warning('请先选择检验项目组');
		return;
	}

	const targets = selectedLabGroups.value;
	if (targets.length === 0) {
		ElMessage.info('未选择任何检验项目组');
		return;
	}

	// 初始化进度
	batchProcessing.value = true;
	batchType.value = 'bind';
	batchTotal.value = targets.length;
	batchDone.value = 0;
	batchSuccess.value = 0;

	for (const row of targets) {
		try {
			const params = {
				patientNo: props.patientNo,
				swlNo: props.swlNo,
				serialNumber: props.serialNumber,
				assessmentType: searchForm.assessmentType || props.moduleCode,
				assessmentCount: props.assessmentCount,
				reportNo: row.reportNo,
				groupCode: row.groupCode,
				hisPatientNo: row.patientNo,
				hisPatientId: row.patientId,
				hisVisitType: row.visitType,
				hisVisitNo: row.visitNo,
				testCount: searchForm.testCount,
				urineType: '',
				currentGroupCode: props.currentGroupCode
			};

			await service.etiology.muaItems.bindHisLab(params);

			// 去除 isBinding 字段后的状态更新无需处理列表状态

			batchSuccess.value++;
		} catch (err) {
			console.error('批量绑定失败：', err);
		}

		batchDone.value++;
	}

	if (batchSuccess.value > 0) {
		ElMessage.success(`已成功绑定 ${batchSuccess.value} 条`);
		emit('bound');
	} else {
		ElMessage.warning('未完成任何绑定');
	}

	// 结束进度
	batchProcessing.value = false;
	batchType.value = '';
};

// 解绑选中的检验项目组
const unbindSelectedGroup = async () => {
	if (!selectedLabGroup.value) {
		ElMessage.warning('请先选择检验项目组');
		return;
	}

	// 检验次数
	if (!searchForm.testCount || String(searchForm.testCount).trim() === '') {
		ElMessage.warning('检验次数必须选择');
		return;
	}

	try {
		await ElMessageBox.confirm(
			`确定要解绑检验项目组 "${selectedLabGroup.value.groupName}" 吗？`,
			'解绑确认',
			{
				confirmButtonText: '确定解绑',
				cancelButtonText: '取消',
				type: 'warning'
			}
		);

		// 调用解绑接口
		const params = {
			patientNo: props.patientNo,
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			assessmentType: searchForm.assessmentType || props.moduleCode,
			assessmentCount: props.assessmentCount,
			reportNo: selectedLabGroup.value.reportNo,
			groupCode: selectedLabGroup.value.groupCode,
			hisPatientNo: selectedLabGroup.value.patientNo,
			hisVisitNo: selectedLabGroup.value.visitNo,
			hisPatientId: selectedLabGroup.value.patientId,
			hisVisitType: selectedLabGroup.value.visitType,
			testCount: searchForm.testCount // 添加检验次数
		};

		await service.etiology.muaItems.unBindHisLab(params);

		// 去除 isBinding 字段后的状态更新无需处理列表状态

		ElMessage.success(`检验项目组 "${selectedLabGroup.value.groupName}" 解绑成功`);

		// 触发解绑成功事件
		emit('unbound');
	} catch (error: any) {
		if (error !== 'cancel') {
			console.error('解绑检验项目组失败:', error);
			ElMessage.error('解绑检验项目组失败: ' + (error.message || '未知错误'));
		}
	}
};

/**
 * 批量解绑已选检验项目组
 */
const unbindSelectedGroups = async () => {
	if (!selectedLabGroups.value || selectedLabGroups.value.length === 0) {
		ElMessage.warning('请先选择检验项目组');
		return;
	}

	if (!searchForm.testCount.trim()) {
		ElMessage.warning('检验次数必须选择');
		return;
	}

	const targets = selectedLabGroups.value;
	if (targets.length === 0) {
		ElMessage.info('未选择任何检验项目组');
		return;
	}

	try {
		await ElMessageBox.confirm(
			`确定要批量解绑选中的 ${targets.length} 条检验项目组吗？`,
			'批量解绑确认',
			{ type: 'warning', confirmButtonText: '确定解绑', cancelButtonText: '取消' }
		);
	} catch (e) {
		return;
	}

	// 初始化进度
	batchProcessing.value = true;
	batchType.value = 'unbind';
	batchTotal.value = targets.length;
	batchDone.value = 0;
	batchSuccess.value = 0;
	for (const row of targets) {
		try {
			const params = {
				patientNo: props.patientNo,
				swlNo: props.swlNo,
				serialNumber: props.serialNumber,
				assessmentType: searchForm.assessmentType || props.moduleCode,
				assessmentCount: props.assessmentCount,
				reportNo: row.reportNo,
				groupCode: row.groupCode,
				hisPatientNo: row.patientNo,
				hisVisitNo: row.visitNo,
				hisPatientId: row.patientId,
				hisVisitType: row.visitType,
				testCount: searchForm.testCount
			};

			await service.etiology.muaItems.unBindHisLab(params);

			// 去除 isBinding 字段后的状态更新无需处理列表状态

			batchSuccess.value++;
		} catch (err) {
			console.error('批量解绑失败：', err);
		}

		batchDone.value++;
	}

	if (batchSuccess.value > 0) {
		ElMessage.success(`已成功解绑 ${batchSuccess.value} 条`);
		emit('unbound');
	} else {
		ElMessage.warning('未完成任何解绑');
	}

	// 结束进度
	batchProcessing.value = false;
	batchType.value = '';
};

// ========== 分页相关方法 ==========

// 处理每页条数变化
const handleLabGroupSizeChange = (newSize: number) => {
	labGroupPagination.pageSize = newSize;
	labGroupPagination.currentPage = 1; // 重置到第一页

	// 清空右侧选择
	selectedLabGroup.value = null;
	labItemData.value = [];
};

// 处理当前页变化
const handleLabGroupCurrentChange = (newPage: number) => {
	labGroupPagination.currentPage = newPage;

	// 清空右侧选择
	selectedLabGroup.value = null;
	labItemData.value = [];
};

// 暴露方法给父组件
defineExpose({
	open,
	close
});
</script>

<style lang="scss" scoped>
.lab-binding-container {
	display: flex !important;
	flex-direction: column !important;
	gap: 0;
	height: 100% !important;
	min-height: 0 !important;
	flex: 1 !important;
	padding: 5px 5px 0 0 !important;
	width: 100% !important;
	background: #f0f0f0 !important;
	box-sizing: border-box !important;

	// 搜索区域 - 固定高度
	.search-conditions-top {
		flex-shrink: 0;
		margin-bottom: 0 !important;

		.search-row {
			margin-bottom: 0;
		}

		/* 放大搜索区域的标签与控件字号 */
		:deep(.el-form-item__label) {
			font-size: 14px; /* 比默认大一级 */
			line-height: 32px;
			padding-right: 2px; /* 再缩小标签与输入框的水平间距 */
		}

		:deep(.el-input__inner),
		:deep(.el-textarea__inner) {
			font-size: 14px;
		}

		/* el-date-picker 内部输入框 */
		:deep(.el-date-editor .el-input__inner) {
			font-size: 14px;
		}

		/* 单选框字号与对齐 */
		:deep(.el-radio__label) {
			font-size: 14px;
			line-height: 32px;
		}

		/* 选择器下拉框输入字号 */
		:deep(.el-select .el-input__inner) {
			font-size: 14px;
		}

		/* 行内表单降低每个表单项之间的间距 */
		:deep(.el-form--inline .el-form-item) {
			margin-right: 2px; /* 再收紧每项间距 */
		}
	}

	// 表格区域 - 上下布局
	.tables-container {
		height: 500px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;

		.left-table-container,
		.right-table-container {
			border: 2px solid var(--el-border-color);
			border-radius: 8px;
			overflow: hidden;
			background: var(--el-bg-color);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			display: flex !important;
			flex-direction: column !important;
			width: 100%;

			.pagination-container {
				padding: 8px 12px;
				background: var(--el-fill-color-lighter);
				border-top: 1px solid var(--el-border-color-light);
				display: flex;
				justify-content: center;

				.el-pagination {
					--el-pagination-font-size: 12px;
					--el-pagination-button-width: 24px;
					--el-pagination-button-height: 24px;
				}
			}

			.table-header {
				background: var(--el-color-primary-light-9);
				color: var(--el-color-primary);
				font-weight: bold;
				font-size: 15px;
				padding: 5px 5px;
				border-bottom: 2px solid var(--el-color-primary-light-7);
				display: flex;
				align-items: center;

				.selected-group-info {
					color: var(--el-color-primary);
					font-weight: normal;
					margin-left: 8px;
				}
			}
		}

		.left-table-container {
			flex: 0 0 50% !important;
			width: 100% !important;
			border: 3px solid #409eff !important;
		}

		.right-table-container {
			flex: 0 0 50% !important;
			width: 100% !important;
			display: flex !important;
			flex-direction: row !important;
			gap: 10px;
			overflow: visible;

			.lab-item-table-wrapper {
				flex: 1 !important;
				display: flex;
				flex-direction: column;
				border: 2px solid var(--el-border-color);
				border-radius: 8px;
				overflow: hidden;
				background: var(--el-bg-color);
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				min-width: 0;

				.table-header {
					background: var(--el-color-primary-light-9);
					color: var(--el-color-primary);
					font-weight: bold;
					font-size: 15px;
					padding: 5px 5px;
					border-bottom: 2px solid var(--el-color-primary-light-7);
					display: flex;
					align-items: center;

					.selected-group-info {
						color: var(--el-color-primary);
						font-weight: normal;
						margin-left: 8px;
					}
				}
			}
		}
	}

	// 按钮区域 - 固定高度
	.urine-type-and-actions {
		padding: 10px;
		background: var(--el-fill-color-extra-light);
		border: 1px solid var(--el-border-color-light);
		border-radius: 8px;
		margin-top: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;

		.action-buttons {
			display: flex !important;
			justify-content: center !important;
			align-items: center !important;
			gap: 5px;
			width: 100%;

			.el-button {
				min-width: 80px;
				height: 50px;
				font-size: 13px;
				font-weight: 500;
				border-radius: 6px;
				transition: all 0.3s ease;

				&:hover:not(:disabled) {
					transform: translateY(-1px);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				}

				&:active:not(:disabled) {
					transform: translateY(0);
				}

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			}
		}
	}
}

// 选中行样式
:deep(.selected-lab-group-row) {
	background-color: var(--el-color-primary-light-9) !important;

	&:hover {
		background-color: var(--el-color-primary-light-8) !important;
	}
}

// 检验项目详情表格：当resultFlag为H或L时，整行字体变红
:deep(.lab-item-row-red) {
	color: #f56c6c !important;

	td {
		color: #f56c6c !important;
	}

	&:hover {
		td {
			color: #f56c6c !important;
		}
	}
}

// 设置对话框内容区域的 padding
:deep(.cl-dialog_default) {
	padding: 10px !important;
}
</style>

<style lang="scss">
// 全局样式：设置对话框内容区域的 padding
.lab-binding-dialog .cl-dialog_default {
	padding: 10px !important;
}
</style>
