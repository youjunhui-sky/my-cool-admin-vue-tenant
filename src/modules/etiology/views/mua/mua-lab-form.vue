<template>
	<div class="lab-form-wrapper">
		<div>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<cl-crud ref="Crud">
			<cl-row>
				<cl-table ref="Table" :data="tableData">
					<!-- 自定义异常提示列的渲染 -->
					<template #column-qualitativeResult="{ scope }">
						<span
							:class="{
								'result-abnormal':
									scope.row.qualitativeResult === '↓' ||
									scope.row.qualitativeResult === '↑'
							}"
						>
							{{ scope.row.qualitativeResult }}
						</span>
					</template>
				</cl-table>
			</cl-row>
		</cl-crud>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useTable } from '@cool-vue/crud';
import { useDict } from '/$/dict';
import { Plugins } from '/#/crud';
import { ref, watch, onMounted, reactive } from 'vue';
import { useCool } from '/@/cool';
import { analyzeResultValue } from '/$/swl/utils/labResultAnalysis';
import { ElMessage } from 'element-plus';

const { dict } = useDict();
const { service } = useCool();

// 存储各项目编码对应的选项数据
const optionsMap = reactive<Record<string, Array<{ label: string; value: string }>>>({});

// crud 配置
const Crud = useCrud({
	service: {
		// 包装原 service 方法，自动注入 swlNo
		...service.swl.lab,
		add: data => {
			data.swlNo = props.swlNo;
			return service.swl.lab.add(data);
		},
		update: data => {
			data.swlNo = props.swlNo;
			return service.swl.lab.update(data);
		}
	}
	// 移除自动刷新的回调函数
});

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	props: {
		// 表头边距
		headerCellStyle: { padding: '0' },
		rowStyle: { height: '25px' },
		cellStyle: { padding: '0' }, // 减小内边距也有助于控制行高
		rowClassName: ({ row }) => {
			// 根据qualitativeResult为行添加类名
			return row.qualitativeResult === '↓' || row.qualitativeResult === '↑'
				? 'abnormal-row'
				: '';
		}
	},
	height: '100%',
	contextMenu: ['refresh'],
	columns: [
		{
			label: '项目名称',
			prop: 'itemName',
			minWidth: 100,
			align: 'left',
			formatter(row) {
				return row.itemName;
			}
		},
		{
			label: '结果值',
			prop: 'resultValue',
			minWidth: 60
		},
		{
			label: '异常结果',
			prop: 'qualitativeResult',
			minWidth: 60
		},
		{
			label: '参考范围',
			prop: 'referenceRange',
			minWidth: 100
		},
		{
			label: '单位',
			prop: 'unit',
			minWidth: 60
		}
	]
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
}

interface OptionData {
	label: string;
	value: string;
}

const props = defineProps<{
	itemData: ItemData[];
	swlNo: string;
	serialNumber: string;
}>();

const tableData = ref<ItemData[]>([]); // 初始化空数组，后续接收JSON数据

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
			await service.swl.lab.update(row);
		}
	} catch (error: any) {
		console.error('保存检验结果失败:', error);
		ElMessage.error('保存检验结果失败：' + (error.message || '未知错误'));
	}
};

// 验证现有值的有效性
const validateExistingValues = () => {
	if (!tableData.value || tableData.value.length === 0) {
		return;
	}

	// 检查每一行数据
	tableData.value.forEach(row => {
		const resultValue = row.resultValue;

		if (resultValue && !isNaN(Number(resultValue))) {
			// 如果有现有的结果值，检查并设置异常标记
			handleResultValueClick(row, resultValue);
		}
	});
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
		//保存后重新刷新列表 (Crud.refresh 应该由框架处理错误)
		Crud.value.refresh();
	} catch (error: any) {
		console.error('批量保存检验结果失败:', error);
		ElMessage.error('批量保存检验结果失败：' + (error.message || '未知错误'));
	}
};

// 监听数据变化
watch(
	() => props.itemData,
	newVal => {
		if (newVal && newVal.length > 0) {
			// 处理数据，提取引用范围的最小值和最大值
			const processedData = newVal.map(item => {
				// 处理引用范围，提取最小值和最大值
				const rangeRegex = /(\d+\.?\d*)\s*[-~]\s*(\d+\.?\d*)/;
				const match = item.referenceRange?.match(rangeRegex);

				// 创建新的对象，保留原有属性
				const newItem = { ...item };

				if (match && match.length >= 3) {
					newItem.referenceMin = match[1];
					newItem.referenceMax = match[2];
				}

				return newItem;
			});

			tableData.value = processedData;

			// 更新选项数据
			for (const item of tableData.value) {
				if (item.itemCode && item.qualitativeResultOptions) {
					optionsMap[item.itemCode] = item.qualitativeResultOptions;
				}
			}
		}
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
}
</style>
