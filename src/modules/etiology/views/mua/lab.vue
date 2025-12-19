<template>
	<div class="lab-wrapper">
		<div>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<div class="main-container" :class="{ 'right-collapsed': isRightContainerCollapsed }">
			<div class="scroll-container">
				<div class="lab-collapse-container">
					<el-collapse v-model="activeNames" accordion class="lab-collapse">
						<el-collapse-item
							v-for="(a, ai) in list"
							:key="ai"
							:name="a.title"
							:title="a.title"
						>
							<template #title>
								<div class="collapse-title-container">
									<div class="title-section">
										<span class="title-text">{{ a.title }}</span>
									</div>
									<div class="controls-section">
										<!-- 根据 a.cs 循环生成多个控件组合 -->
										<template
											v-for="index in a.cs"
											:key="`${a.title}-${index}`"
										>
											<div class="control-group">
												<el-date-picker
													v-if="a.commonZh === 0"
													v-model="a[`date${index}`]"
													type="date"
													:placeholder="`选择日期${index}`"
													size="small"
													style="width: 120px"
													class="date-picker"
													@change="handleDateChange(a, index, $event)"
												/>
												<div
													v-if="a.urineType === 1"
													class="urine-type-group"
												>
													<label class="date-label"
														>尿类型{{ index }}：</label
													>
													<el-radio-group
														v-model="a[`type${index}`]"
														@change="
															handleUrineTypeChange(a, index, $event)
														"
													>
														<el-radio label="随机尿 " value="random" />
														<el-radio label="晨尿" value="morning" />
													</el-radio-group>
												</div>
											</div>
										</template>
									</div>
								</div>
							</template>
							<div v-for="(b, bi) in a.children" :key="bi" class="group">
								<el-row :gutter="10">
									<el-col
										v-for="(c, ci) in b.children"
										:key="ci"
										:xs="24"
										:sm="24"
										:md="24"
										:lg="24"
									>
										<component :is="renderComponent(c, a)" />
									</el-col>
								</el-row>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>
			</div>
			<div class="right-table-container" :class="{ collapsed: isRightContainerCollapsed }">
				<div class="table-header">
					<el-button
						type="primary"
						size="default"
						@click="handleDataAnalysis"
						:loading="analysisLoading"
						:disabled="analysisLoading"
						>{{ analysisLoading ? '分析中...' : '数据分析' }}
					</el-button>
				</div>
				<el-table
					:data="rightTableData"
					border
					style="width: 100%; flex: 1"
					:header-cell-style="{
						background: 'var(--el-fill-color-light)',
						color: 'var(--el-text-color-primary)',
						fontWeight: 'bold'
					}"
				>
					<!-- <el-table-column prop="name" label="名称" min-width="60" />
					<el-table-column prop="isMatched" label="是否匹配" min-width="50" /> -->

					<el-table-column min-width="100">
						<template #header>
							<div class="missing-item-group">
								<div class="group-name">类别</div>
								<div class="divider-line"></div>
								<div class="tags-container header-label">缺失项目详情</div>
							</div>
						</template>
						<template #default="{ row }">
							<div class="missing-items-container">
								<!-- 情况2: row 本身就有 groupName 和 ruleInfo -->
								<div class="missing-item-group">
									<div class="group-name">{{ row.groupName }}</div>
									<div class="divider-line"></div>
									<div class="tags-container">
										<el-tag
											v-for="item in row.ruleInfo"
											:key="item.itemName"
											:type="
												row.sort % 5 === 0
													? 'success'
													: row.sort % 5 === 1
														? 'primary'
														: row.sort % 5 === 2
															? 'warning'
															: row.sort % 5 === 3
																? 'info'
																: 'danger'
											"
											effect="plain"
											class="item-tag"
										>
											{{ item.itemName }}
										</el-tag>
									</div>
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onActivated, onMounted, h, markRaw, computed, reactive } from 'vue';
import { service, useCool } from '/@/cool';
import { ElMessage, type CollapseModelValue, ElMessageBox } from 'element-plus';
import { type Component } from 'vue';
import LabFormTime from '/@/modules/etiology/views/mua/lab-form-time.vue';
import LabForm1 from '/@/modules/etiology/views/mua/lab-form1.vue';
import LabForm2 from '/@/modules/etiology/views/mua/lab-form2.vue';
import LabForm3 from '/@/modules/etiology/views/mua/lab-form3.vue';
import LabForm4 from '/@/modules/etiology/views/mua/lab-form4.vue';
import { useForm } from '@cool-vue/crud';
const { route, router } = useCool();
const active = ref();
//const contentRef = ref();

// 定义响应式数据
const emit = defineEmits<{
	(e: 'collapse-change', collapsed: boolean): void;
}>();

const list = ref<any[]>([]);
//const loading = ref(false);
const error = ref<string | null>(null);

// 右侧表格数据
const rightTableData = ref<any[]>([]);

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
	moduleCode: {
		type: String,
		required: true
	},
	patientNo: {
		type: String,
		required: true
	},
	assessmentCount: {
		type: Number,
		required: true
	},
	onIndicatorUpdate: {
		type: Function,
		required: false
	},
	onLabModuleUpdate: {
		type: Function,
		required: false
	},
	name: {
		type: String,
		required: false
	},
	outpatientNo: {
		type: String,
		required: false
	},
	inpatientNo: {
		type: String,
		required: false
	}
});

// 用于 el-collapse 的展开项名称（手风琴模式，字符串类型）
const activeNames = ref<string>('');

// 计算属性，返回所有折叠面板的标题数组，用于默认全部展开
const setAllActive = () => {
	if (list.value && list.value.length > 0) {
		// 手风琴模式：默认展开第一个
		activeNames.value = list.value[0].title;
	}
};
const cool = useCool();

//处理选择时间变化
const handleDateChange = async (item: any, index: number, value: any) => {
	// console.log('日期选择变化:', {
	// 	item: item.title,
	// 	index,
	// 	value
	// });
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: props.moduleCode,
		assessmentCount: props.assessmentCount,
		groupCode: item.groupCode,
		seq: index,
		testTime: value
	};
	await cool.service.etiology.muaItems.updateMuaItemsTestTime(params);
	ElMessage.success('调整检验时间成功');
};

const handleUrineTypeChange = async (item: any, index: number, value: any) => {
	// console.log('尿类型选择变化:', {
	// 	item: item.title,
	// 	index,
	// 	value
	// });
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: props.moduleCode,
		assessmentCount: props.assessmentCount,
		groupCode: item.groupCode,
		seq: index,
		urineType: value
	};
	await cool.service.etiology.muaItems.updateMuaItemsUrineType(params);
	ElMessage.success('调整尿类型成功');
};

// 数据分析加载状态
const analysisLoading = ref(false);

// 右侧容器收缩状态，默认收起
const isRightContainerCollapsed = ref(true);

const emitCollapseState = () => {
	emit('collapse-change', isRightContainerCollapsed.value);
};

// 切换右侧容器显示/隐藏
const toggleRightContainer = () => {
	isRightContainerCollapsed.value = !isRightContainerCollapsed.value;
	emitCollapseState();
};

// 数据分析按钮点击事件
const handleDataAnalysis = async () => {
	// 开始智能分析，显示进度条
	analysisLoading.value = true;

	//调用智能分析接口
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		moduleCode: props.moduleCode, //简化评估
		patientNo: props.patientNo,
		assessmentCount: props.assessmentCount
	};
	try {
		const data = await service.etiology.muaItems.toMuaDataAnalysis(params);
		console.log('data:', data);
		if (data.length > 0) {
			// 将分析结果转换为表格数据格式
			// const tableData = data.map((item: any) => ({
			// 	name: item.analysisName || item.diagnosticName || '',
			// 	value: item.analysisCode || item.diagnosticCode || '',
			// 	isMatched: item.isMatched || '',
			// 	ruleInfo: processRuleInfo(item.ruleInfo || '')
			// }));
			// console.log('data', data);
			// let tableData2 = '';
			// for (const value of data) {
			// 	tableData2 += value.ruleInfo + '\n';
			// }
			// console.log('tableData2 before', tableData2);

			rightTableData.value = data;
			console.log('rightTableData', rightTableData.value);
			// 调试：打印第一条数据的结构
			if (rightTableData.value && rightTableData.value.length > 0) {
				console.log('第一条数据示例:', rightTableData.value[0]);
				console.log('第一条数据的 keys:', Object.keys(rightTableData.value[0]));
				if (rightTableData.value[0].value) {
					console.log(
						'row.value 的类型:',
						Array.isArray(rightTableData.value[0].value)
							? '数组'
							: typeof rightTableData.value[0].value
					);
					if (
						Array.isArray(rightTableData.value[0].value) &&
						rightTableData.value[0].value.length > 0
					) {
						console.log('row.value[0] 示例:', rightTableData.value[0].value[0]);
					}
				}
			}
			ElMessage.success('评估分析完成');
			// 通知父组件数据已更新
			if (props.onIndicatorUpdate) {
				await props.onIndicatorUpdate();
			}
		} else {
			ElMessage.warning('评估分析完成，没有匹配到诊断');
			rightTableData.value = [];
		}
	} catch (error: any) {
		console.error('评估分析失败:', error);
		ElMessage.error('评估分析失败: ' + (error.message || '未知错误'));
	} finally {
		// 无论成功或失败，都要隐藏加载状态
		analysisLoading.value = false;
	}
};

// 从后端获取数据
const fetchData = async () => {
	try {
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: props.moduleCode,
			assessmentCount: props.assessmentCount
		};
		const response = await cool.service.swl.lab.list(params);
		console.log('response', response);
		// 转换数据格式
		list.value = response.map(item => {
			// 创建基础对象
			const baseItem = {
				groupCode: item.groupCode,
				groupName: item.groupName,
				title: item.groupName,
				cs: item.cs,
				urineType: item.urineType,
				commonZh: item.commonZh,
				children: Array.from({ length: 1 }, () => ({
					label: item.groupName,
					children: Array.from({ length: 1 }, () => ({
						component: markRaw(componentMap[item.commonZh === 0 ? item.cs : 0]),
						props: {
							itemData: item.children,
							cs: item.cs,
							swlNo: props.swlNo,
							serialNumber: props.serialNumber,
							moduleCode: props.moduleCode,
							patientNo: props.patientNo,
							assessmentCount: props.assessmentCount,
							onIndicatorUpdate: props.onIndicatorUpdate,
							onLabModuleUpdate: props.onLabModuleUpdate,
							name: props.name,
							outpatientNo: props.outpatientNo,
							inpatientNo: props.inpatientNo
						}
					}))
				}))
			};

			// 根据 cs 的值动态添加日期和类型字段
			// 遍历 children，根据 item.cs 取出各自对应次数的最大 testTime 和对应的 urineType
			let testTime = '';
			const testTimeMap = new Map();
			if (item.children && item.children.length > 0) {
				for (const data of item.children) {
					for (let j = 1; j <= item.cs; j++) {
						if (data[`testTime${j}`] != null && data[`testTime${j}`] != '') {
							if (testTimeMap.has(j)) {
								if (new Date(data[`testTime${j}`]) > new Date(testTimeMap.get(j))) {
									testTime = data[`testTime${j}`];
									testTimeMap.set(j, testTime);
								}
							} else {
								testTime = data[`testTime${j}`];
								testTimeMap.set(j, testTime);
							}
						}
					}
				}
			}

			if (testTimeMap.size > 0) {
				for (let i = 1; i <= item.cs; i++) {
					if (testTimeMap.has(i)) {
						baseItem[`date${i}`] = testTimeMap.get(i);
					} else {
						baseItem[`date${i}`] = '';
					}
				}
			}

			//只要尿常规、尿24小时，需要显示，其他都置空
			if (item.urineType == 1) {
				let urineType = '';
				if (item.children && item.children.length > 0) {
					for (const data of item.children) {
						for (let j = 1; j <= item.cs; j++) {
							if (data[`urineType${j}`] != null && data[`urineType${j}`] != '') {
								urineType = data[`urineType${j}`];
								baseItem[`type${j}`] = urineType;
								break;
							}
						}
					}
				}

				//默认随机尿
				for (let j = 1; j <= item.cs; j++) {
					if (baseItem[`type${j}`] == null || baseItem[`type${j}`] == '') {
						baseItem[`type${j}`] = 'random';
					}
				}
			} else {
				for (let j = 1; j <= item.cs; j++) {
					baseItem[`type${j}`] = '';
				}
			}
			console.log('baseItem', baseItem);
			return baseItem;
		});
		// 设置默认展开第一个面板（手风琴模式：字符串类型）
		if (list.value && list.value.length > 0) {
			activeNames.value = list.value[0].title;
		}
	} catch (err) {
		error.value = '数据加载失败，请稍后重试';
		console.error('API Error:', err);
	}
};

// 动态组件渲染时传递数据
const renderComponent = (component: any, parentItem?: any) => {
	return h(component.component, {
		...component.props,
		// 传递当前折叠项的信息
		parentGroupData: parentItem
			? {
					groupCode: parentItem.groupCode,
					groupName: parentItem.groupName,
					title: parentItem.title,
					cs: parentItem.cs,
					urineType: parentItem.urineType,
					commonZh: parentItem.commonZh,
					// 传递所有的type值
					...Object.keys(parentItem)
						.filter(key => key.startsWith('type'))
						.reduce((acc, key) => {
							acc[key] = parentItem[key];
							return acc;
						}, {}),
					// 传递所有的date值
					...Object.keys(parentItem)
						.filter(key => key.startsWith('date'))
						.reduce((acc, key) => {
							acc[key] = parentItem[key];
							return acc;
						}, {})
				}
			: null
	});
};

// 将后端返回的 type 映射到前端组件
const componentMap: Record<string, Component> = {
	0: markRaw(LabFormTime), // 带时间的表格
	1: markRaw(LabForm1), // 一个结果的表格
	2: markRaw(LabForm2), // 两个结果的表格
	3: markRaw(LabForm3), // 三个结果的表格
	4: markRaw(LabForm4) // 四个结果的表格
};

/**
 * 刷新Lab数据的方法
 * 暴露给父组件调用
 */
const refreshLabData = async () => {
	try {
		await fetchData();
		//console.log('Lab数据刷新成功');
	} catch (error) {
		console.error('Lab数据刷新失败:', error);
		throw error;
	}
};

// 暴露方法给父组件
defineExpose({
	refreshLabData,
	toggleRightContainer,
	getCollapseState: () => isRightContainerCollapsed.value
});

// 生命周期钩子中调用
onMounted(async () => {
	await fetchData();
	emitCollapseState();
});

onActivated(() => {
	const { key } = route.query;
	active.value = (key || '尿常规') as string;

	// 确保激活状态与路由参数同步（手风琴模式：直接设置值）
	if (key) {
		activeNames.value = key as string;
	}
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

// 实验室报告数据绑定相关
const LabItemBindingForm = useForm();
const labGroupData = ref<
	Array<{
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
	}>
>([]);
const labItemData = ref<
	Array<{
		itemCode: string;
		itemName: string;
		testTypeName: string;
		unit: string;
		referenceRange: string;
		isBinding: string;
	}>
>([]);
const selectedLabGroup = ref<{
	groupCode: string;
	groupName: string;
	reportNo: string;
	name: string;
	patientNo: string;
	patientId: string;
	visitNo: string;
	visitType: string;
	isBinding?: string;
} | null>(null);
const labItemLoading = ref(false);

// 分页相关数据
const labGroupPagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
});

// 尿类型选择
const urineType = ref(''); // 不默认选择

/**
 * 初始化实验室报告数据绑定数据
 */
const initializeLabBindingData = () => {
	// 清空搜索表单数据
	searchForm.name = '';
	searchForm.visitNo = '';
	searchForm.idCard = '';
	searchForm.dateRange = [];
	searchForm.assessmentType = '';
	searchForm.testCount = '';

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

	// 清空尿类型选择
	urineType.value = '';

	// 停止加载状态
	labItemLoading.value = false;
};

/**
 * 实验室报告数据绑定按钮点击事件
 */
const onLabItemBinding = async () => {
	// 初始化数据 - 清空所有状态
	initializeLabBindingData();

	// 打开绑定管理弹窗
	LabItemBindingForm.value?.open({
		title: '实验室报告数据绑定',
		width: '80%',
		height: '70vh',
		props: {
			inline: false,
			labelPosition: 'top',
			labelWidth: '0px'
		},
		dialog: {
			top: '2%',
			controls: ['fullscreen', 'close'],
			customClass: 'lab-binding-dialog'
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

// 原始数据备份，用于搜索过滤
const originalLabGroupData = ref<
	Array<{
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
	}>
>([]);

// 计算分页后的数据
const paginatedLabGroupData = computed(() => {
	const start = (labGroupPagination.currentPage - 1) * labGroupPagination.pageSize;
	const end = start + labGroupPagination.pageSize;
	return labGroupData.value.slice(start, end);
});

// ========== 实验室报告数据绑定相关方法 ==========

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

		// 按评估级别过滤
		if (searchForm.assessmentType.trim()) {
			params.assessmentType = searchForm.assessmentType;
		}

		// 按检验次数过滤
		if (searchForm.testCount.trim()) {
			params.testCount = searchForm.testCount;
		}

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

// 处理检验项目组行点击
const handleLabGroupRowClick = (row: any) => {
	selectedLabGroup.value = row;
	if (row) {
		loadLabItemData(row);
	}
};

// 获取检验项目组表格行样式类名
const getLabGroupRowClassName = ({ row }: { row: any }) => {
	if (selectedLabGroup.value && selectedLabGroup.value.groupCode === row.groupCode) {
		return 'selected-lab-group-row';
	}
	return '';
};

// ========== 搜索相关方法 ==========

// 执行搜索过滤
const performSearch = () => {
	const filteredData = [...originalLabGroupData.value];
	labGroupData.value = filteredData;

	// 更新分页总数并重置到第一页
	labGroupPagination.total = filteredData.length;
	labGroupPagination.currentPage = 1;

	// 清空右侧选择
	selectedLabGroup.value = null;
	labItemData.value = [];
};

// 搜索按钮点击事件
const handleSearch = async () => {
	// 验证必要条件
	if (!searchForm.assessmentType.trim()) {
		ElMessage.warning('请先选择评估级别');
		return;
	}

	if (!searchForm.testCount.trim()) {
		ElMessage.warning('请先选择检验次数');
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
	searchForm.assessmentType = '';
	searchForm.testCount = '';

	// 清空所有数据
	labGroupData.value = [];
	originalLabGroupData.value = [];

	// 重置分页
	labGroupPagination.total = 0;
	labGroupPagination.currentPage = 1;

	// 清空右侧选择
	selectedLabGroup.value = null;
	labItemData.value = [];

	// 清空尿类型选择
	urineType.value = '';

	ElMessage.info('搜索条件已重置');
};

// 搜索条件变化时的处理（可选，实现实时搜索）
const handleSearchChange = () => {
	// 如果需要实时搜索，可以在这里调用 performSearch()
	// performSearch();
};

// 检查是否可以触发检索的通用函数
const checkAndTriggerSearch = async () => {
	// 只有当评估级别和检验次数都选择了才触发检索
	if (searchForm.assessmentType && searchForm.testCount) {
		try {
			await loadLabGroupData();
		} catch (error) {
			console.error('自动检索失败:', error);
		}
	}
};

// 评估级别变化时的处理
const handleAssessmentTypeChange = async () => {
	// 检查是否可以触发检索
	await checkAndTriggerSearch();
};

// 检验次数变化时的处理
const handleTestCountChange = async () => {
	// 检查是否可以触发检索
	await checkAndTriggerSearch();
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
			assessmentType: searchForm.assessmentType,
			assessmentCount: props.assessmentCount,
			reportNo: selectedLabGroup.value.reportNo,
			groupCode: selectedLabGroup.value.groupCode,
			hisPatientNo: selectedLabGroup.value.patientNo,
			hisPatientId: selectedLabGroup.value.patientId,
			hisVisitType: selectedLabGroup.value.visitType,
			hisVisitNo: selectedLabGroup.value.visitNo,
			testCount: searchForm.testCount, // 添加检验次数
			urineType: urineType.value // 添加尿类型
		};

		//console.log('绑定参数:', params);
		await service.etiology.muaItems.bindHisLab(params);

		// 更新左侧表格中对应行的绑定状态
		const groupIndex = labGroupData.value.findIndex(
			item =>
				item.groupCode === selectedLabGroup.value?.groupCode &&
				item.patientNo === selectedLabGroup.value?.patientNo
		);

		if (groupIndex !== -1) {
			labGroupData.value[groupIndex].isBinding = '1';
			// 同时更新原始数据
			const originalIndex = originalLabGroupData.value.findIndex(
				item =>
					item.groupCode === selectedLabGroup.value?.groupCode &&
					item.patientNo === selectedLabGroup.value?.patientNo
			);
			if (originalIndex !== -1) {
				originalLabGroupData.value[originalIndex].isBinding = '1';
			}
		}

		ElMessage.success(`检验项目组 "${selectedLabGroup.value.groupName}" 绑定成功`);
	} catch (error: any) {
		console.error('绑定检验项目组失败:', error);
		ElMessage.error('绑定检验项目组失败: ' + (error.message || '未知错误'));
	}
};

// 解绑选中的检验项目组
const unbindSelectedGroup = async () => {
	if (!selectedLabGroup.value) {
		ElMessage.warning('请先选择检验项目组');
		return;
	}

	// 检验次数
	if (!searchForm.testCount.trim()) {
		ElMessage.success(`检验次数必须选择`);
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
			assessmentType: searchForm.assessmentType,
			assessmentCount: props.assessmentCount,
			reportNo: selectedLabGroup.value.reportNo,
			groupCode: selectedLabGroup.value.groupCode,
			hisPatientNo: selectedLabGroup.value.patientNo,
			hisVisitNo: selectedLabGroup.value.visitNo,
			hisPatientId: selectedLabGroup.value.patientId,
			hisVisitType: selectedLabGroup.value.visitType,
			testCount: searchForm.testCount // 添加检验次数
		};

		//console.log('解绑参数:', params);
		await service.etiology.muaItems.unBindHisLab(params);

		// 更新左侧表格中对应行的绑定状态
		const groupIndex = labGroupData.value.findIndex(
			item =>
				item.groupCode === selectedLabGroup.value?.groupCode &&
				item.patientNo === selectedLabGroup.value?.patientNo
		);

		if (groupIndex !== -1) {
			labGroupData.value[groupIndex].isBinding = '0';
			// 同时更新原始数据
			const originalIndex = originalLabGroupData.value.findIndex(
				item =>
					item.groupCode === selectedLabGroup.value?.groupCode &&
					item.patientNo === selectedLabGroup.value?.patientNo
			);
			if (originalIndex !== -1) {
				originalLabGroupData.value[originalIndex].isBinding = '0';
			}
		}

		ElMessage.success(`检验项目组 "${selectedLabGroup.value.groupName}" 解绑成功`);
	} catch (error: any) {
		if (error !== 'cancel') {
			console.error('解绑检验项目组失败:', error);
			ElMessage.error('解绑检验项目组失败: ' + (error.message || '未知错误'));
		}
	}
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
</script>

<style lang="scss" scoped>
.lab-wrapper {
	height: 100%;
	overflow-y: auto;
	position: relative;
	//background-color: var(--el-bg-color);
	background-color: transparent; // 改为透明背景
	display: flex;
	flex-direction: column;
	transition: height 0.3s ease;
}

.main-container {
	display: flex;
	flex-direction: row;
	gap: 10px;
	height: 100%;
	width: 100%;

	// 当右侧容器收缩时
	&.right-collapsed {
		.scroll-container {
			flex: 0 0 100%;
			width: 100%;
		}

		.right-table-container {
			flex: 0 0 0;
			width: 0;
		}
	}
}

.lab-collapse-container {
	padding: 2px;
	margin-bottom: 10px; /* 增加底部间距 */
	flex: 1;
}

.lab-collapse-container .lab-collapse {
	width: 100%;

	:deep(.el-collapse-item__header) {
		display: flex;
		font-size: 16px;
		min-height: 30px;
		height: auto;
		align-items: stretch;
		font-weight: bold;
		background-color: #f5f7fa;
		//background-color: transparent; // 改为透明背景
		padding: 0 16px;
		border-radius: 4px;
		margin-bottom: 2px;
	}

	:deep(.el-collapse-item__wrap) {
		background-color: transparent; // 改为透明背景
	}

	:deep(.el-collapse-item__content) {
		padding: 0px 0px;
	}

	:deep(.el-collapse-item) {
		margin-bottom: 10px;
	}
}

// 按钮容器样式
.lab-collapse-container .button-container {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 2px;
}

// 检验数据管理按钮样式
.lab-collapse-container .data-management-btn {
	position: relative;
	min-width: 120px;
	height: 30px;
	padding: 0 16px;
	background: rgba(103, 194, 58, 0.8);
	border-radius: 6px;
	border: none;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
	overflow: hidden;
	font-size: 14px;
	font-weight: 500;
	letter-spacing: 0.5px;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transform: translateX(-100%);
		transition: transform 0.6s ease;
	}

	&:hover {
		background: rgba(103, 194, 58, 1);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(103, 194, 58, 0.35);

		&::before {
			transform: translateX(100%);
		}
	}

	&:active {
		transform: translateY(1px);
		box-shadow: 0 2px 8px rgba(103, 194, 58, 0.25);
	}
}

.collapse-title-container {
	display: grid;
	grid-template-columns: 120px 1fr; /* 标题固定120px宽度，控件区域自适应 */
	align-items: stretch; /* 让两个区域自动拉伸到相同高度 */
	gap: 20px; /* 网格间距 */
	width: 100%;
	padding: 4px 0; /* 增加上下内边距 */
	min-width: 0; /* 允许收缩 */

	// 响应式布局：当界面变小时，改为垂直布局
	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		gap: 12px;
		padding: 12px 0; /* 增加上下内边距，使高度增加 */
		min-height: 60px; /* 设置最小高度 */
	}

	.title-section {
		display: flex;
		align-items: center; /* 标题文本垂直居中 */
		justify-content: flex-start; /* 标题左对齐 */
		min-width: 0; /* 允许收缩 */
		/* 移除 min-height，让高度由 grid 的 align-items: stretch 自动控制 */

		.title-text {
			font-weight: bold;
			line-height: 1.5; /* 使用相对行高，不限制高度 */
			white-space: nowrap; /* 防止标题换行 */
		}
	}

	.controls-section {
		display: flex;
		align-items: flex-start;
		gap: 12px; /* 控件之间的间距 */
		flex-wrap: wrap; /* 允许换行 */
		justify-content: flex-start; /* 控件左对齐 */
		min-width: 0; /* 允许收缩 */
		flex: 1; /* 允许伸缩 */

		.control-group {
			display: flex;
			align-items: center;
			gap: 8px; /* 控件组内部间距 */
			flex-shrink: 1; /* 允许收缩 */
			min-width: 0; /* 允许收缩 */

			.date-picker {
				min-width: 120px; /* 减小最小宽度 */
				width: 140px; /* 固定宽度确保对齐 */
				max-width: 100%; /* 最大宽度不超过父容器 */
				flex-shrink: 1; /* 允许收缩 */
			}

			.urine-type-group {
				display: flex;
				align-items: center;
				gap: 4px;
				flex-shrink: 1; /* 允许收缩 */
				min-width: 0; /* 允许收缩 */
				flex-wrap: wrap; /* 允许换行 */

				.date-label {
					margin: 0;
					white-space: nowrap;
					line-height: 32px; /* 设置行高与其他控件一致 */
					display: flex;
					align-items: center; /* label内部居中对齐 */
					flex-shrink: 0; /* 标签不收缩 */
				}

				/* 单选按钮组样式 */
				.el-radio-group {
					display: flex;
					gap: 8px; /* 单选按钮之间的间距 */
					align-items: center; /* 单选按钮组内部居中对齐 */
					flex-wrap: wrap; /* 允许换行 */
					flex-shrink: 1; /* 允许收缩 */

					.el-radio {
						margin-right: 0; /* 移除默认间距，使用gap控制 */
						display: flex;
						align-items: center; /* 单选按钮内部居中对齐 */
						flex-shrink: 0; /* 单选按钮不收缩 */
					}
				}
			}
		}
	}
}

.group {
	margin-bottom: 10px;

	.group-title {
		margin-bottom: 15px;
		font-size: 15px;
		font-weight: bold;
		color: #606266;
		border-left: 3px solid #409eff;
		padding-left: 10px;
	}
}

// 实验室报告数据绑定弹窗样式
.lab-binding-container {
	display: flex !important;
	flex-direction: column !important;
	gap: 10px;
	height: 100% !important;
	min-height: 0 !important; // 关键：允许flex子项收缩
	flex: 1 !important; // 确保占满父容器
	padding: 16px !important;
	width: 100% !important;
	background: #f0f0f0 !important;
	box-sizing: border-box !important;

	// 搜索区域 - 固定高度
	.search-conditions-top {
		flex-shrink: 0;
	}

	// 表格区域 - 固定合理高度
	.tables-container {
		height: 350px; // 固定合理高度，避免弹框滚动
		flex-shrink: 0; // 不允许收缩
		display: flex;
		gap: 20px;

		.left-table-container,
		.right-table-container {
			border: 2px solid var(--el-border-color);
			border-radius: 8px;
			overflow: hidden;
			background: var(--el-bg-color);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			display: flex !important;
			flex-direction: column !important;
			height: 100%; // 使用容器的100%高度

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
				padding: 14px 16px;
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
			flex: 0 0 45% !important;
			min-width: 400px;
			max-width: 500px;
			border: 3px solid #409eff !important;
		}

		.right-table-container {
			flex: 1 !important;
			min-width: 0;
			border: 3px solid #67c23a !important;
		}
	}

	// 按钮区域 - 固定高度
	.urine-type-and-actions {
		padding: 16px;
		background: var(--el-fill-color-extra-light);
		border: 1px solid var(--el-border-color-light);
		border-radius: 8px;
		margin-top: 20px;

		.urine-type-row {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 20px;

			.el-form-item {
				margin-bottom: 0;
				display: flex;
				align-items: center;

				.el-form-item__label {
					font-size: 14px;
					font-weight: 500;
					color: var(--el-text-color-primary);
					margin-right: 16px;
					margin-bottom: 0 !important;
				}

				.el-form-item__content {
					display: flex;
					align-items: center;
				}

				.el-radio-group {
					display: flex;
					align-items: center;

					.el-radio {
						margin-right: 20px;

						&:last-child {
							margin-right: 0;
						}

						.el-radio__label {
							font-size: 13px;
							font-weight: 500;
						}
					}
				}
			}
		}

		.action-buttons {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 20px;

			.el-button {
				min-width: 80px;
				height: 32px;
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

.scroll-container {
	flex: 0 0 70%; // 占 70%
	width: 70%;
	height: 100%; // 改为100%高度，让父组件控制
	min-height: 300px;
	overflow-y: auto !important;
	overflow-x: auto !important;
	padding: 0px;
	position: relative;
	display: block;
	box-sizing: border-box;
	z-index: 1; // 确保滚动条在最上层
	transition:
		flex 0.3s ease,
		width 0.3s ease; // 添加过渡动画
	//background-color: transparent; // 改为透明背景

	// 自定义滚动条样式
	&::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	&::-webkit-scrollbar-track {
		background-color: #f1f1f1;
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #c1c1c1;
		border-radius: 4px;
		transition: all 0.2s ease;

		&:hover {
			background-color: #a8a8a8;
		}
	}

	&::-webkit-scrollbar-corner {
		background-color: #f1f1f1;
		border-radius: 4px;
	}

	// 确保 cl-form 不会影响滚动
	:deep(.cl-form) {
		width: 100%;
		min-width: 100%;
		overflow: visible;
	}

	:deep(.cl-crud) {
		height: 100%;
		overflow: hidden auto;
		position: relative;
		box-sizing: border-box;
		/* background-color: #fff; */
		background-color: transparent; // 改为透明背景
	}
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
	.main-container {
		flex-direction: column;
	}

	.scroll-container {
		flex: 1;
		width: 100%;
		padding: 10px;
		max-height: 55vh;

		.el-form-item {
			.el-input,
			.el-select {
				width: 100%;
			}
		}
	}

	.right-table-container {
		flex: 1;
		width: 100%;
		min-height: 200px;
	}
}

.right-table-container {
	flex: 0 0 30%; // 占 30%
	width: 30%;
	height: 100%;
	min-height: 300px;
	display: flex;
	flex-direction: column;
	border: 1px solid var(--el-border-color-light);
	border-radius: 4px;
	background-color: var(--el-bg-color);
	overflow: hidden;
	gap: 10px;
	padding: 10px;
	box-sizing: border-box;
	transition:
		flex 0.3s ease,
		width 0.3s ease,
		opacity 0.3s ease; // 添加过渡动画

	// 收缩状态
	&.collapsed {
		flex: 0 0 0;
		width: 0;
		opacity: 0;
		overflow: hidden;
		padding: 0;
		border: none;
	}

	.table-header {
		flex-shrink: 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 8px;
		padding: 8px 0;
	}

	:deep(.el-table) {
		flex: 1;
		min-height: 0;
	}

	.rule-info-cell {
		white-space: pre-wrap;
		word-wrap: break-word;
		line-height: 1.5;
	}

	.missing-items-container {
		padding: 8px 0;
	}

	.missing-item-group {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-bottom: 12px;

		&:last-child {
			margin-bottom: 0;
		}

		.group-name {
			font-weight: 600;
			color: var(--el-text-color-primary);
			font-size: 16px;
			width: 80px;
			flex-shrink: 0;
			white-space: nowrap;
			text-align: left;
		}

		.divider-line {
			width: 1px;
			height: 20px;
			background-color: var(--el-border-color);
			flex-shrink: 0;
		}

		.tags-container {
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
			align-items: center;
			flex: 1;

			.item-tag {
				margin: 0;
			}
		}
	}

	// 表头样式，移除 margin-bottom
	:deep(.el-table__header-wrapper) {
		.missing-item-group {
			margin-bottom: 0;
		}

		.header-label {
			font-weight: 600;
			color: var(--el-text-color-primary);
			font-size: 16px;
		}
	}
}
</style>
