<!-- 页面顺序
	1.<template>
	2.<script>
		2.1 import
		2.2 base
		2.3 options
		2.4 crud
		2.5 table
		2.6 upsert
		2.7 自定义组件
		2.7 search
		2.8 function
	      2.8.1 基础函数
		  2.8.2 验证函数
		  2.8.3 事件函数
	 </script>
	3.<style>
  -->
<template>
	<cl-crud ref="Crud">
		<!-- 顶部工具栏 -->
		<cl-row>
			<cl-refresh-btn />
			<cl-flex1 />
			<!-- 搜索插件 -->
			<cl-search ref="Search" :reset-btn="true" />
		</cl-row>

		<!-- 表格主体 -->
		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<!-- 分页 -->
		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" setup>
// --- 依赖导入 ---
import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { reactive, ref, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useDict } from '/$/dict';
import dayjs from 'dayjs';
import { extname } from '/@/cool/utils';

// --- 基础设置 ---
const { service } = useCool();
const { dict } = useDict();

// --- 数据字典 ---
const options = reactive({
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' }
	]
});

// --- CRUD配置 ---
// 主CRUD配置
const Crud = useCrud(
	{
		service: {
			// 包装原 service 方法，手动获取搜索条件
			...service.stat.info,
			page: async params => {
				// 使用异步函数确保搜索组件已初始化
				// 从CRUD组件中获取表单值
				const searchForm = params || {};

				// 调用实际服务
				return service.stat.info.getSwlAllStat({
					...params,
					swlNo: searchForm.swlNo,
					name: searchForm.name,
					gender: searchForm.gender,
					serialNumber: searchForm.serialNumber,
					startDate:
						searchForm.visitDate && searchForm.visitDate[0]
							? searchForm.visitDate[0]
							: null,
					endDate:
						searchForm.visitDate && searchForm.visitDate[1]
							? searchForm.visitDate[1]
							: null
				});
			}
		}
	},
	app => {
		app.refresh();
	}
);

// 表格配置
const Table = useTable({
	//表格行高调整，先关闭自动高度
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' } // 减小内边距也有助于控制行高
	},
	columns: [
		{
			prop: 'swlNo',
			label: '碎石号',
			fixed: true, // 固定选择列
			minWidth: 120
		},
		{
			prop: 'serialNumber',
			label: '就诊流水号',
			fixed: true, // 固定选择列
			minWidth: 120
		},
		{
			prop: 'sequenceNo',
			label: '序列号',
			minWidth: 100
		},
		{
			prop: 'episode',
			label: '期数',
			minWidth: 100
		},
		{
			prop: 'name',
			label: '姓名',
			minWidth: 120,
			fixed: true // 固定选择列
		},
		{ label: '性别', prop: 'gender', minWidth: 60, dict: options.gender },

		{
			prop: 'age',
			label: '年龄',
			minWidth: 100
		},

		{
			prop: 'visitDate',
			label: '就诊日期',
			minWidth: 120
		},
		{
			prop: 'occupation',
			label: '职业',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'native',
			label: '籍贯',
			minWidth: 100,
			showOverflowTooltip: true,
			formatter(row: any) {
				return transformEmpty(row.nativeProvince) + transformEmpty(row.nativeCity);
			}
		},
		{
			prop: 'bmi',
			label: 'BMI',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'bloodPressure',
			label: '血压',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'diseaseDuration',
			label: '病程',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'hasSymptom',
			label: '症状',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'renalColicLocation',
			label: '肾绞痛部位',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'renalColicCount',
			label: '肾绞痛次数',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'hasHematuria',
			label: '血尿',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'hasKUB',
			label: 'KUB',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'complication',
			label: '合并症',
			minWidth: 100,
			showOverflowTooltip: true,
			formatter(row: any) {
				return formatComplication(row);
			}
		},
		{
			prop: 'stoneNature',
			label: '结石性质',
			minWidth: 100,
			showOverflowTooltip: true,
			formatter(row: any) {
				return (
					transformEmpty(row.leftKidneyStoneNature) +
					transformEmpty(row.rightKidneyStoneNature) +
					transformEmpty(row.leftUreterStoneNature) +
					transformEmpty(row.rightUreterStoneNature) +
					transformEmpty(row.bladderStoneNature) +
					transformEmpty(row.urethraStoneNature)
				);
			}
		},
		{
			prop: 'preopDiagnosis',
			label: '术前诊断',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'preopPreparation',
			label: '术前准备',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'targetingMethod',
			label: '定位方式',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'machine',
			label: '机型',
			minWidth: 100,
			showOverflowTooltip: true,
			formatter(row: any) {
				return transformEmpty(row.machine1) + '-' + transformEmpty(row.machine2);
			}
		},
		{
			prop: 'bodyPosition',
			label: '体位',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'position1',
			label: '治疗部位一',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'depth1',
			label: '治疗深度一',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'stoneArea1',
			label: '结石大小一',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'position2',
			label: '治疗部位二',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'depth2',
			label: '治疗深度二',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'stoneArea2',
			label: '结石大小二',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'voltage',
			label: '治疗电压',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'shockwaveCount',
			label: '冲击次数',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'stoneResponse',
			label: '结石对冲击波的反应',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'painScore',
			label: '局部疼痛指数',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'curativeParamStoneFree',
			label: '无石',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'curativeParamInitialShock',
			label: '初震',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'curativeParamRepeatShock',
			label: '复震',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'curativeParamPreSWL',
			label: 'SWL前辅助性治疗',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'curativeParamPostSWLTherapy',
			label: 'SWL补助性治疗',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'curativeParamPostSWLSupport',
			label: 'SWL后辅助性治疗',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'curativeComplication',
			label: '近期并发症',
			minWidth: 100,
			showOverflowTooltip: true,
			formatter(row: any) {
				return formatCurativeComplication(row);
			}
		},
		{
			prop: 'effectiveness',
			label: '疗效',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'component1',
			label: '结石成分1',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'component2',
			label: '结石成分2',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'component3',
			label: '结石成分3',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'component4',
			label: '结石成分4',
			minWidth: 100,
			showOverflowTooltip: true
		}
	]
});

function formatCurativeComplication(row: any) {
	let complications = '';
	if (row.subcapsularHematoma === 1) {
		complications += '肾包膜下血肿' + '、';
	}
	if (row.renalHemorrhage === 1) {
		complications += '肾出血' + '、';
	}
	if (row.infection === 1) {
		complications += '感染' + '、';
	}
	if (row.renalColic === 1) {
		complications += '肾绞痛' + '、';
	}
	if (row.renalFailure === 1) {
		complications += '肾衰' + '、';
	}

	return complications;
}

function formatComplication(row: any) {
	let complications = '';
	if (row.complicationPolycysticKidney === 1) {
		complications += '多囊肾' + '、';
	}
	if (row.complicationDuplicateKidney === 1) {
		complications += '重复肾' + '、';
	}
	if (row.complicationHorseshoeKidney === 1) {
		complications += '马蹄肾' + '、';
	}
	if (row.complicationUreteralStenosis === 1) {
		complications += '输尿管狭窄' + '、';
	}
	if (row.complicationUrethralStenosis === 1) {
		complications += '尿道狭窄' + '、';
	}
	if (row.complicationBladderDiverticulum === 1) {
		complications += '膀胱憩室' + '、';
	}
	if (row.complicationSpongyKidney === 1) {
		complications += '海绵肾' + '、';
	}
	if (row.complicationRenalCyst === 1) {
		complications += '肾囊肿' + '、';
	}
	if (row.complicationEctopicKidney === 1) {
		complications += '异位肾' + '、';
	}
	if (row.complicationNeurogenicBladder === 1) {
		complications += '神经源性膀胱' + '、';
	}
	if (row.complicationUreteralDiverticulum === 1) {
		complications += '输尿管囊肿' + '、';
	}
	if (row.complicationUrethralForeignBody === 1) {
		complications += '尿道异物' + '、';
	}
	if (row.complicationRenalDiverticulum === 1) {
		complications += '肾脏憩室' + '、';
	}
	if (row.complicationUpjStenosis === 1) {
		complications += 'UPJ狭窄' + '、';
	}
	if (row.complicationBph === 1) {
		complications += 'BPH' + '、';
	}
	if (row.complicationUrethralDiverticulum === 1) {
		complications += '尿道憩室' + '、';
	}
	if (row.hasOtherComplications === 1) {
		complications += row.otherComplicationsDesc + '、';
	}
	if (complications != null && complications.includes('、')) {
		complications = complications.slice(0, -1);
	}

	return complications;
}

//空字符串转换为''
function transformEmpty(str: string) {
	if (str === null || str === undefined || str === '') {
		return '';
	}
	return str;
}

// --- 搜索配置 ---
const Search = useSearch({
	items: [
		{
			prop: 'name',
			component: {
				name: 'el-input',
				props: {
					placeholder: '姓名',
					clearable: true,
					onChange(val: string) {
						refresh({
							name: val,
							page: 1
						});
					}
				}
			}
		},
		{
			prop: 'gender',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '性别',
					clearable: false,
					// 禁用过滤和创建功能，防止用户输入
					filterable: false,
					allowCreate: false,
					// 设置为只读
					readonly: true,
					options: options.gender,
					onChange(val: string) {
						refresh({
							gender: val,
							page: 1
						});
					}
				}
			}
		},
		{
			prop: 'swlNo',
			component: {
				name: 'el-input',
				props: {
					placeholder: '碎石号',
					clearable: true,
					onChange(val: string) {
						refresh({
							swlNo: val,
							page: 1
						});
					}
				}
			}
		},
		{
			prop: 'serialNumber',
			component: {
				name: 'el-input',
				props: {
					placeholder: '序列号',
					clearable: true,
					onChange(val: string) {
						refresh({
							serialNumber: val,
							page: 1
						});
					}
				}
			}
		},
		{
			prop: 'visitDate',
			component: {
				name: 'el-date-picker',
				props: {
					type: 'daterange',
					startPlaceholder: '开始日期',
					endPlaceholder: '结束日期',
					valueFormat: 'YYYY-MM-DD',
					clearable: true,
					style: 'width: 240px'
				}
			}
		}
	]
});

/**
 * 刷新列表数据
 * @param params 查询参数
 */
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>

<style lang="scss" scoped></style>
