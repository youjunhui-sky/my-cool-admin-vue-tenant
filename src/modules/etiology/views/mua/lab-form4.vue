<template>
	<div class="lab-form-wrapper">
		<div>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<cl-crud ref="Crud">
			<cl-row>
				<cl-table ref="Table" :data="tableData">
					<!-- 使用插槽自定义结果值列 -->
					<template #column-resultValue1="{ scope }">
						<!-- 当有选项数据时显示select组件 -->
						<el-select
							v-if="
								scope.row.qualitativeResultOptions &&
								scope.row.qualitativeResultOptions.length > 0
							"
							v-model="scope.row.resultValue1"
							filterable
							clearable
							allow-create
							default-first-option
							placeholder="请选择或输入结果值"
							no-data-text="可直接输入自定义值"
							no-match-text="可创建此选项"
							@focus="scope.row.qualitativeResultOptions"
							@change="val => handleResultValueClick(scope.row, val, 1)"
							@blur="e => handleBlur(scope.row, e, 1)"
							class="custom-select"
						>
							<el-option
								v-for="item in scope.row.qualitativeResultOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>

						<!-- 当没有选项数据时显示input组件 -->
						<el-input
							v-else
							v-model="scope.row.resultValue1"
							placeholder="请输入结果值"
							clearable
							@change="val => handleResultValueClick(scope.row, val, 1)"
							@blur="e => handleBlur(scope.row, e, 1)"
							class="custom-input"
						></el-input>
					</template>

					<!-- 使用插槽自定义结果值列 -->
					<template #column-resultValue2="{ scope }">
						<!-- 当有选项数据时显示select组件 -->
						<el-select
							v-if="
								scope.row.qualitativeResultOptions &&
								scope.row.qualitativeResultOptions.length > 0
							"
							v-model="scope.row.resultValue2"
							filterable
							clearable
							allow-create
							default-first-option
							placeholder="请选择或输入结果值"
							no-data-text="可直接输入自定义值"
							no-match-text="可创建此选项"
							@focus="scope.row.qualitativeResultOptions"
							@change="val => handleResultValueClick(scope.row, val, 2)"
							@blur="e => handleBlur(scope.row, e, 2)"
							class="custom-select"
						>
							<el-option
								v-for="item in scope.row.qualitativeResultOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>

						<!-- 当没有选项数据时显示input组件 -->
						<el-input
							v-else
							v-model="scope.row.resultValue2"
							placeholder="请输入结果值"
							clearable
							@change="val => handleResultValueClick(scope.row, val, 2)"
							@blur="e => handleBlur(scope.row, e, 2)"
							class="custom-input"
						></el-input>
					</template>

					<!-- 使用插槽自定义结果值列 -->
					<template #column-resultValue3="{ scope }">
						<!-- 当有选项数据时显示select组件 -->
						<el-select
							v-if="
								scope.row.qualitativeResultOptions &&
								scope.row.qualitativeResultOptions.length > 0
							"
							v-model="scope.row.resultValue3"
							filterable
							clearable
							allow-create
							default-first-option
							placeholder="请选择或输入结果值"
							no-data-text="可直接输入自定义值"
							no-match-text="可创建此选项"
							@focus="scope.row.qualitativeResultOptions"
							@change="val => handleResultValueClick(scope.row, val, 3)"
							@blur="e => handleBlur(scope.row, e, 3)"
							class="custom-select"
						>
							<el-option
								v-for="item in scope.row.qualitativeResultOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>

						<!-- 当没有选项数据时显示input组件 -->
						<el-input
							v-else
							v-model="scope.row.resultValue3"
							placeholder="请输入结果值"
							clearable
							@change="val => handleResultValueClick(scope.row, val, 3)"
							@blur="e => handleBlur(scope.row, e, 3)"
							class="custom-input"
						></el-input>
					</template>

					<!-- 使用插槽自定义结果值列 -->
					<template #column-resultValue4="{ scope }">
						<!-- 当有选项数据时显示select组件 -->
						<el-select
							v-if="
								scope.row.qualitativeResultOptions &&
								scope.row.qualitativeResultOptions.length > 0
							"
							v-model="scope.row.resultValue4"
							filterable
							clearable
							allow-create
							default-first-option
							placeholder="请选择或输入结果值"
							no-data-text="可直接输入自定义值"
							no-match-text="可创建此选项"
							@focus="scope.row.qualitativeResultOptions"
							@change="val => handleResultValueClick(scope.row, val, 4)"
							@blur="e => handleBlur(scope.row, e, 4)"
							class="custom-select"
						>
							<el-option
								v-for="item in scope.row.qualitativeResultOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>

						<!-- 当没有选项数据时显示input组件 -->
						<el-input
							v-else
							v-model="scope.row.resultValue4"
							placeholder="请输入结果值"
							clearable
							@change="val => handleResultValueClick(scope.row, val, 4)"
							@blur="e => handleBlur(scope.row, e, 4)"
							class="custom-input"
						></el-input>
					</template>

					<!-- 自定义异常提示列的渲染 -->
					<template #column-qualitativeResult="{ scope }">
						<span
							:class="{
								'result-abnormal':
									scope.row.qualitativeResult1 === '↓' ||
									scope.row.qualitativeResult1 === '↑' ||
									scope.row.qualitativeResult2 === '↓' ||
									scope.row.qualitativeResult2 === '↑' ||
									scope.row.qualitativeResult3 === '↓' ||
									scope.row.qualitativeResult3 === '↑' ||
									scope.row.qualitativeResult4 === '↓' ||
									scope.row.qualitativeResult4 === '↑'
							}"
						>
							{{ scope.row.qualitativeResult1 }}
							{{ scope.row.qualitativeResult2 }}
							{{ scope.row.qualitativeResult3 }}
							{{ scope.row.qualitativeResult4 }}
						</span>
					</template>
					<!-- 自定义结果值列表头，添加操作按钮 -->
					<template #header-resultValue1>
						<div class="result-value-header">
							<span>结果值</span>
							<el-button
								type="primary"
								size="small"
								@click="handleBindButtonClick(1)"
							>
								绑定
							</el-button>
							<el-button
								type="success"
								size="small"
								@click="handleClearButtonClick(1)"
							>
								清空
							</el-button>
						</div>
					</template>
					<template #header-resultValue2>
						<div class="result-value-header">
							<span>结果值</span>
							<el-button
								type="primary"
								size="small"
								@click="handleBindButtonClick(2)"
							>
								绑定
							</el-button>
							<el-button
								type="success"
								size="small"
								@click="handleClearButtonClick(2)"
							>
								清空
							</el-button>
						</div>
					</template>
					<template #header-resultValue3>
						<div class="result-value-header">
							<span>结果值</span>
							<el-button
								type="primary"
								size="small"
								@click="handleBindButtonClick(3)"
							>
								绑定
							</el-button>
							<el-button
								type="success"
								size="small"
								@click="handleClearButtonClick(3)"
							>
								清空
							</el-button>
						</div>
					</template>
					<template #header-resultValue4>
						<div class="result-value-header">
							<span>结果值</span>
							<el-button
								type="primary"
								size="small"
								@click="handleBindButtonClick(4)"
							>
								绑定
							</el-button>
							<el-button
								type="success"
								size="small"
								@click="handleClearButtonClick(4)"
							>
								清空
							</el-button>
						</div>
					</template>
				</cl-table>
			</cl-row>
		</cl-crud>

		<!-- 实验室报告数据绑定弹窗 -->
		<lab-item-binding-form
			ref="LabItemBindingFormRef"
			:patient-no="props.patientNo"
			:swl-no="props.swlNo"
			:serial-number="props.serialNumber"
			:module-code="props.moduleCode"
			:assessment-count="props.assessmentCount"
			:name="props.name"
			:outpatientNo="props.outpatientNo"
			:inpatientNo="props.inpatientNo"
			:current-group-code="props.parentGroupData?.groupCode"
			:current-group-name="props.parentGroupData?.groupName"
			@bound="handleBound"
			@unbound="handleUnbound"
		/>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useTable } from '@cool-vue/crud';
import { useDict } from '/$/dict';
import { Plugins } from '/#/crud';
import { ref, watch, onMounted, reactive } from 'vue';
import { useCool } from '/@/cool';
import { analyzeResultValue, analyzeResultValueMany } from '/$/swl/utils/labResultAnalysis';
import { ElMessage, ElMessageBox } from 'element-plus';
import LabItemBindingForm from './components/lab-item-binding-form.vue';

const { dict } = useDict();
const { service } = useCool();

// 存储各项目编码对应的选项数据
const optionsMap = reactive<Record<string, Array<{ label: string; value: string }>>>({});

// cl-crud 配置
const Crud = useCrud({
	service: 'test' // 根据实际情况修改
});

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	rowKey: 'itemCode', // 使用 itemCode 作为行的唯一标识符，避免 id 为 null 时的重复 key 警告
	props: {
		rowStyle: { height: '30px' },
		cellStyle: { padding: '0' }, // 减小内边距也有助于控制行高
		rowClassName: ({ row }) => {
			// 根据qualitativeResult为行添加类名
			return row.qualitativeResult1 === '↓' ||
				row.qualitativeResult1 === '↑' ||
				row.qualitativeResult2 === '↓' ||
				row.qualitativeResult2 === '↑' ||
				row.qualitativeResult3 === '↓' ||
				row.qualitativeResult3 === '↑' ||
				row.qualitativeResult4 === '↓' ||
				row.qualitativeResult4 === '↑'
				? 'abnormal-row'
				: '';
		}
	},
	height: '50%',
	contextMenu: ['refresh'],
	columns: [
		{
			label: '项目编码',
			prop: 'itemCode',
			minWidth: 100,
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
			formatter(row) {
				return row.itemName;
			}
		},
		{
			label: '结果值1',
			prop: 'resultValue1',
			minWidth: 180,
			slot: true // 使用插槽
		},
		{
			label: '结果值2',
			prop: 'resultValue2',
			minWidth: 180,
			slot: true // 使用插槽
		},
		{
			label: '结果值3',
			prop: 'resultValue3',
			minWidth: 180,
			slot: true // 使用插槽
		},
		{
			label: '结果值4',
			prop: 'resultValue4',
			minWidth: 180,
			slot: true // 使用插槽
		},
		{
			label: '异常提示',
			prop: 'qualitativeResult',
			minWidth: 100,
			slot: true, // 使用插槽进行自定义渲染
			edit: {
				enable: false
			}
		},
		{
			label: '单位',
			prop: 'unit',
			minWidth: 100
		},
		{
			label: '参考范围',
			prop: 'referenceRange',
			minWidth: 200
		}
	],
	//【很重要】行编辑插件
	plugins: [Plugins.Table.rowEdit()]
});

/**
 * 组件属性定义
 */
interface ItemData {
	id: number;
	itemCode: string;
	itemName: string;
	resultValue: string;
	qualitativeResult: string;
	unit: string;
	referenceRange: string;
	referenceMin?: string;
	referenceMax?: string;
	qualitativeResultOptions: OptionData[];
	// 动态属性支持（用于支持 resultValue1, qualitativeResult1, id1 等）
	[key: string]: any;
}

interface OptionData {
	label: string;
	value: string;
}

const props = defineProps<{
	itemData: ItemData[];
	cs: number;
	swlNo: string;
	serialNumber: string;
	moduleCode: string;
	patientNo: string;
	assessmentCount: number;
	name: string;
	outpatientNo: string;
	inpatientNo: string;
	onIndicatorUpdate?: () => Promise<void>;
	onLabModuleUpdate?: () => Promise<void>;
	parentGroupData?: {
		groupCode: string;
		groupName: string;
		title: string;
		cs: number;
		urineType: number;
		commonZh: number;
		[key: string]: any; // 允许动态的type1, type2等属性
	};
}>();

const tableData = ref<ItemData[]>([]); // 初始化空数组，后续接收JSON数据

// 实验室报告数据绑定组件引用
const LabItemBindingFormRef = ref<InstanceType<typeof LabItemBindingForm>>();

const handleBlur = async (row, event, index) => {
	// 记录原始值，用于比较是否有变化
	const originalValue = row[`resultValue${index}`];

	// 获取当前值（从row对象中获取最新值，v-model应该已经更新）
	let inputValue = row[`resultValue${index}`];
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
				row[`resultValue${index}`] = inputValue;
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
					row[`resultValue${index}`] = inputValue;
				}
			}
		}
	} catch (e) {
		console.error('尝试从事件获取值时出错:', e);
	}

	// console.log(
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
		row[`resultValue${index}`] = originalValue;
		return;
	}

	// 使用共享分析方法处理结果
	const updatedRow = analyzeResultValueMany(row, inputValue, index);

	// 将分析结果应用回当前行
	Object.assign(row, updatedRow);

	saveMuaItems(row, index);
};

const saveMuaItems = async (row, index) => {
	try {
		// 获取当前序号对应的尿类型
		let urineType = ''; // 默认值
		if (props.parentGroupData && props.parentGroupData[`type${index}`]) {
			urineType = props.parentGroupData[`type${index}`];
		}

		let testTime = ''; // 默认值
		if (props.parentGroupData && props.parentGroupData[`date${index}`]) {
			testTime = props.parentGroupData[`date${index}`];
		}

		// console.log(
		// 	`保存检验结果 - 序号: ${index}, 尿类型: ${urineType}, 组编码: ${props.parentGroupData?.groupCode}`
		// );

		// 保存更新后的数据
		//if (row[`resultValue${index}`] != null && row[`resultValue${index}`] != '') {
		if (row[`id${index}`] == null) {
			row.swlNo = props.swlNo;
			row.serialNumber = props.serialNumber;
			row.seq = index;
			row.moduleCode = props.moduleCode;
			row.patientNo = props.patientNo;
			row.itemType = 1;
			row.assessmentCount = props.assessmentCount;
			// 添加尿类型字段
			row[`urineType${index}`] = urineType;
			row[`testTime${index}`] = testTime;
			// 添加组编码
			if (props.parentGroupData?.groupCode) {
				row.groupCode = props.parentGroupData.groupCode;
			}
			const res = await service.etiology.muaItems.add(row);
			//console.log('res:', res);
			row[`id${index}`] = res.id;
			ElMessage.success('新增检验结果成功');
		} else {
			row.swlNo = props.swlNo;
			row.serialNumber = props.serialNumber;
			row.seq = index;
			row.moduleCode = props.moduleCode;
			row.patientNo = props.patientNo;
			row.itemType = 1;
			row.assessmentCount = props.assessmentCount;
			// 添加尿类型字段
			row[`urineType${index}`] = urineType;
			row[`testTime${index}`] = testTime;
			// 添加组编码
			if (props.parentGroupData?.groupCode) {
				row.groupCode = props.parentGroupData.groupCode;
			}
			if (row[`resultValue${index}`] == null || row[`resultValue${index}`] == '') {
				// 按接口规范仅传递 id
				await service.etiology.muaItems.delete({ ids: [row[`id${index}`]] });
				// 清除本地 id 以与已删除状态一致
				row[`id${index}`] = null;
				ElMessage.success('删除检验结果成功');
			} else {
				await service.etiology.muaItems.add(row);
				ElMessage.success('更新检验结果成功');
			}
		}
		//}
	} catch (error) {
		console.error('保存检验结果失败:', error);
		ElMessage.error('保存检验结果失败：' + (error as Error).message || '未知错误');
	}
	if (props.onLabModuleUpdate) {
		await props.onLabModuleUpdate();
	}
};

const handleResultValueClick = async (row, newValue, index) => {
	console.log('处理结果值变化:', row, '新值:', newValue);

	// 使用共享分析方法处理结果
	const updatedRow = analyzeResultValueMany(row, newValue, index);

	// 将分析结果应用回当前行
	Object.assign(row, updatedRow);

	console.log('更新后的行:', JSON.stringify(row));

	saveMuaItems(row, index);
};

const handleClearButtonClick = async (index: number) => {
	// 批量清空所有结果值
	try {
		await ElMessageBox.confirm('确定要清空所有结果值吗？', '提示', {
			type: 'warning',
			confirmButtonText: '确定',
			cancelButtonText: '取消'
		});

		tableData.value.forEach(async row => {
			if (row[`id${index}`] != null) {
				row[`resultValue${index}`] = '';
				row[`qualitativeResult${index}`] = '';
				row[`resultFlag${index}`] = 0;

				// 获取当前序号对应的尿类型
				let urineType = ''; // 默认值
				if (props.parentGroupData && props.parentGroupData[`type${index}`]) {
					urineType = props.parentGroupData[`type${index}`];
				}

				let testTime = ''; // 默认值
				if (props.parentGroupData && props.parentGroupData[`date${index}`]) {
					testTime = props.parentGroupData[`date${index}`];
				}
				row.swlNo = props.swlNo;
				row.serialNumber = props.serialNumber;
				row.seq = index;
				row.moduleCode = props.moduleCode;
				row.patientNo = props.patientNo;
				row.itemType = 1;
				row.assessmentCount = props.assessmentCount;
				// 添加尿类型字段
				row[`urineType${index}`] = urineType;
				row[`testTime${index}`] = testTime;
				// 添加组编码
				if (props.parentGroupData?.groupCode) {
					row.groupCode = props.parentGroupData.groupCode;
				}

				// 按接口规范仅传递 id
				await service.etiology.muaItems.delete({ ids: [row[`id${index}`]] });
				// 清除本地 id 以与已删除状态一致
				row[`id${index}`] = null;
			}
		});

		ElMessage.success('已清空所有结果值');
		if (props.onLabModuleUpdate) {
			await props.onLabModuleUpdate();
		}
	} catch {
		// 用户取消操作
	}
};

/**
 * 处理绑定按钮点击事件，打开实验室报告数据绑定弹窗
 */
const handleBindButtonClick = async (index: number) => {
	const count = index.toString(); // 转换为字符串，因为检验次数是字符串类型
	// 打开绑定管理弹窗
	LabItemBindingFormRef.value?.open({
		testCount: count,
		dialog: {
			padding: '5px',
			// 默认最大化
			fullscreen: true
		}
	});
};

/**
 * 处理绑定成功事件
 */
const handleBound = async () => {
	if (props.onLabModuleUpdate) {
		await props.onLabModuleUpdate();
	}
	// 刷新当前表格数据
	if (props.onIndicatorUpdate) {
		await props.onIndicatorUpdate();
	}
};

/**
 * 处理解绑成功事件
 */
const handleUnbound = async () => {
	if (props.onLabModuleUpdate) {
		await props.onLabModuleUpdate();
	}
	// 刷新当前表格数据
	if (props.onIndicatorUpdate) {
		await props.onIndicatorUpdate();
	}
};

onMounted(async () => {
	// 初始化表格数据
	if (props.itemData && props.itemData.length > 0) {
		// 处理数据，提取引用范围的最小值和最大值
		// const processedData = props.itemData.map(item => {
		// 	// 处理引用范围，提取最小值和最大值
		// 	const rangeRegex = /(\d+\.?\d*)\s*[-~]\s*(\d+\.?\d*)/;
		// 	const match = item.referenceRange?.match(rangeRegex);

		// 	// 创建新的对象，保留原有属性
		// 	const newItem = { ...item };

		// 	if (match && match.length >= 3) {
		// 		newItem.referenceMin = match[1];
		// 		newItem.referenceMax = match[2];
		// 		console.log(
		// 			`项目 ${item.itemName} 参考范围: ${item.referenceRange}, 解析为: 最小=${newItem.referenceMin}, 最大=${newItem.referenceMax}`
		// 		);
		// 	}

		// 	return newItem;
		// });

		//tableData.value = processedData;
		tableData.value = props.itemData;
		//console.log('处理后的表格数据:', tableData.value);

		// 预加载所有项目的选项数据
		// for (const item of tableData.value) {
		// 	if (item.itemCode) {
		// 		//await loadOptions(item.itemCode);
		// 		// 如果已经加载过该项目的选项，则不重复加载
		// 		if (optionsMap[item.itemCode] && optionsMap[item.itemCode].length > 0) {
		// 			continue; // 使用continue而不是return，确保循环继续
		// 		}
		// 		optionsMap[item.itemCode] = item.qualitativeResultOptions || [];
		// 	}
		// }

		// 验证现有值并设置异常标记
		setTimeout(() => {
			//validateExistingValues();
		}, 500); // 稍微延迟一下，确保表格渲染完成
	}
});

const onSaveTableData = async () => {
	//console.log('保存表格数据:', tableData.value);
	const data = tableData.value;
	//console.log('data:', JSON.stringify(data));
	try {
		//将data的数据保存到数据库
		const res = await service.swl.lab.saveLabData(data);
		//console.log('res:', res);
		ElMessage.success('批量保存检验结果成功');
		//保存后重新刷新列表
		Crud.value.refresh();
	} catch (error) {
		console.error('批量保存检验结果失败:', error);
		ElMessage.error('批量保存检验结果失败：' + (error as Error).message || '未知错误');
	}
};
// 监听数据变化
watch(
	() => props.itemData,
	newVal => {
		// 当父组件传入的数据变更时，立即同步到本地表格
		tableData.value = Array.isArray(newVal) ? newVal : [];
	},
	{ deep: true }
);
</script>

<style lang="scss" scoped>
.lab-form-wrapper {
	:deep(.custom-select) {
		width: 100%;
	}

	:deep(.result-abnormal) {
		color: #f56c6c; /* 使用Element Plus的红色 */
		font-weight: bold;
	}

	// 整行文字为红色的样式
	:deep(.abnormal-row) {
		color: #f56c6c; /* 使用Element Plus的红色 */

		// 确保所有单元格都是红色
		td {
			color: #f56c6c !important;
		}

		// 确保select组件内的文字也是红色
		.el-select .el-input__inner {
			color: #f56c6c !important;
		}
	}

	.save-button-container {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		padding: 3px 0;
		margin-bottom: 3px;
		padding-left: calc(10% - 44px);
	}

	// 结果值列表头样式
	.result-value-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		span {
			flex: 1;
		}

		:deep(.el-button) {
			padding: 4px 8px;
			margin-left: 8px;

			// 保持按钮原有的背景色，hover 时不改变背景色
			&.el-button--primary:hover {
				background-color: var(--el-color-primary) !important;
				border-color: var(--el-color-primary) !important;
				color: #fff !important;
			}

			&.el-button--success:hover {
				background-color: var(--el-color-success) !important;
				border-color: var(--el-color-success) !important;
				color: #fff !important;
			}
		}
	}
}
</style>
