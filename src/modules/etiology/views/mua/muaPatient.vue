<template>
	<div class="mua-container">
		<div class="hidden-info">
			<div>{{ props.id }}</div>
			<div>{{ props.patientNo }}</div>
			<div>{{ props.swlNo }}</div>
			<div>{{ props.serialNumber }}</div>
			<div>{{ props.assessmentCount }}</div>
		</div>
		<div class="scroll-container">
			<cl-form ref="Form" inner></cl-form>
		</div>
	</div>

	<!-- 成分数据选择弹窗 -->
	<cl-form ref="ComponentSelectForm">
		<template #slot-component-table>
			<div style="display: flex; flex-direction: column; width: 100%">
				<el-table
					:data="componentSelectData"
					style="width: 100%; height: 400px; margin-bottom: 0"
					highlight-current-row
					border
					:header-cell-style="{
						background: 'var(--el-fill-color-light)',
						color: 'var(--el-text-color-primary)',
						fontWeight: 'bold',
						padding: '2px'
					}"
					:row-class-name="getComponentRowClassName"
					@current-change="handleComponentRowClick"
				>
					<el-table-column
						prop="analysisDate"
						label="分析日期"
						width="100"
						align="center"
						:formatter="
							(row: any) => {
								return row.analysisDate?.split(' ')[0] || '';
							}
						"
					/>
					<el-table-column prop="component1" label="成分一" width="100" align="center" />
					<el-table-column
						prop="component1Percent"
						label="比例"
						width="80"
						align="center"
					/>
					<el-table-column prop="component2" label="成分二" align="center" />
					<el-table-column
						prop="component2Percent"
						label="比例"
						width="80"
						align="center"
					/>
					<el-table-column prop="component3" label="成分三" align="center" />
					<el-table-column
						prop="component3Percent"
						label="比例"
						width="80"
						align="center"
					/>
					<el-table-column prop="component4" label="成分四" align="center" />
					<el-table-column
						prop="component4Percent"
						label="比例"
						width="80"
						align="center"
					/>
					<el-table-column prop="analysisMethod" label="分析方法" align="center" />
					<el-table-column prop="stoneLocation" label="结石位置" align="center" />
				</el-table>

				<div style="margin-top: 10px; color: #666; font-size: 12px; text-align: center">
					提示：点击表格行选择成分数据
				</div>

				<div style="margin-top: 15px; display: flex; justify-content: center; width: 100%">
					<el-pagination
						v-model:current-page="componentPagination.currentPage"
						v-model:page-size="componentPagination.pageSize"
						:page-sizes="[5, 10, 20, 50]"
						:total="componentPagination.total"
						layout="total, sizes, prev, pager, next, jumper"
						@current-change="handleComponentPageChange"
						@size-change="handleComponentPageSizeChange"
						size="small"
					/>
				</div>
			</div>
		</template>
	</cl-form>
</template>

<script setup lang="ts">
import { onMounted, watch, reactive, h, ref, inject, type Ref } from 'vue';
import { useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { usePatient } from '/@/modules/patient';
import { Plugins } from '/#/crud';
import { ElMessage } from 'element-plus';
import { useBase } from '/@/modules/base';
import dayjs from 'dayjs';
const Form = useForm();
const { user } = useBase();
const { dict } = useDict();
const { service } = useCool();

const {
	// 医生选择组件
	DoctorSelect,
	// 科室选择组件
	DepartmentSelect
} = usePatient().components;

// 定义 props 接口
interface Props {
	id: number | string;
	patientNo: string;
	swlNo: string;
	serialNumber: string;
	assessmentCount: number;
}

// 定义 props
const props = defineProps<Props>();

// 注入可更新的就诊号（用于同步 SimplifyStep）
const injectedOutpatientNo = inject<Ref<string>>('outpatientNo', ref(''));
const injectedInpatientNo = inject<Ref<string>>('inpatientNo', ref(''));

////console.log('muaPatient props=================:', props);

// 监听 id 的变化
// watch(
// 	() => props.id,
// 	newValue => {
// 		////console.log('id changed:', newValue);
// 	}
// );
watch(
	() => props.patientNo,
	newValue => {
		////console.log('patientNo changed:', newValue);
	}
);

// 静态配置和选项
const options = reactive({
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	]
});

//检查方法
const checkMethodOptions = [
	{ label: '超声', value: 'hasUltrasound' },
	{ label: 'KUB', value: 'hasKUB' },
	{ label: 'CT', value: 'hasCT' },
	{ label: 'MRI', value: 'hasMRI' },
	{ label: 'CTU', value: 'hasCTU' },
	{ label: 'IVU', value: 'hasIVU' }
];

//格式化检查方法选项
const formatCheckMethodOptions = (data: any) => {
	const reactions: string[] = [];
	if (data && typeof data === 'object') {
		if (Number(data.hasUltrasound) === 1) reactions.push('hasUltrasound');
		if (Number(data.hasKUB) === 1) reactions.push('hasKUB');
		if (Number(data.hasCT) === 1) reactions.push('hasCT');
		if (Number(data.hasMRI) === 1) reactions.push('hasMRI');
		if (Number(data.hasCTU) === 1) reactions.push('hasCTU');
		if (Number(data.hasIVU) === 1) reactions.push('hasIVU');
	}
	return reactions;
};

/**
 * 第一步：前置信息，patient,swl,component
 */
// 页面加载
onMounted(async () => {
	//console.log('组件挂载，当前props:', props.id);
	try {
		// 获取患者档案
		const formData = await service.etiology.info.findById({ id: Number(props.id) });
		//console.log('当前患者查询到的数据:' + JSON.stringify(formData));

		// 格式化检查方法
		formData.checkMethod = formatCheckMethodOptions(formData);

		// 初始化表单
		Form.value?.open({
			form: formData,
			items: [
				{
					label: '档案号',
					prop: 'patientNo',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入档案号',
							readonly: true,
							disabled: true
						}
					}
				},
				{
					label: '评估号',
					prop: 'swlNo',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入评估号',
							readonly: true,
							disabled: true
						}
					}
				},
				{
					label: '流水号',
					prop: 'serialNumber',
					span: 4,
					hidden: true,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入流水号',
							readonly: true,
							disabled: true
						}
					}
				},
				{
					label: '姓名',
					prop: 'name',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入姓名'
						}
					}
				},
				{
					label: '性别',
					prop: 'gender',
					span: 4,
					component: {
						name: 'cl-select',
						props: {
							options: options.gender,
							checkStrictly: true
						}
					}
				},
				{
					label: '年龄',
					prop: 'age',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入年龄'
						}
					}
				},
				{
					label: '诊断医生',
					prop: 'doctor',
					span: 4,
					value: user.info?.name,
					component: {
						vm: DoctorSelect
					}
				},
				{
					label: '评估日期',
					prop: 'assessmentDate',
					span: 4,
					component: {
						name: 'el-date-picker',
						props: {
							placeholder: '请输入评估日期',
							type: 'date',
							valueFormat: 'YYYY-MM-DD'
						}
					}
				},
				{
					label: '评估次数',
					prop: 'assessmentCount',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入评估次数'
						}
					}
				},
				{
					label: '门诊号',
					prop: 'outpatientNo',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入门诊号'
						}
					}
				},
				{
					label: '住院号',
					prop: 'inpatientNo',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入住院号'
						}
					}
				},
				{
					label: '病床号',
					prop: 'bedNo',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入病床号'
						}
					}
				},
				{
					label: '就诊科室',
					prop: 'department',
					span: 4,
					component: {
						vm: DepartmentSelect
					}
				},
				{
					label: '身高',
					prop: 'height',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入身高',
							onInput: function () {
								handleBMICalculation();
							}
						}
					}
				},
				{
					label: '体重',
					prop: 'weight',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入体重',
							onInput: function () {
								handleBMICalculation();
							}
						}
					}
				},
				{
					label: 'BMI',
					prop: 'bmi',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: 'BMI',
							readonly: true,
							disabled: true
						}
					}
				},
				{
					label: '解剖异常',
					prop: 'anatomicalAbnormal',
					span: 6,
					component: {
						name: 'cl-select',
						props: {
							placeholder: '请输入解剖异常',
							labelKey: 'name',
							valueKey: 'name',
							multiple: true,
							collapseTags: true,
							collapseTagsTooltip: true,
							checkStrictly: true,
							options: dict.get('metabolic-anatomical')
						}
					},
					hook: {
						bind: (value, { form }) => {
							// 如果值是字符串，转换为数组
							if (typeof value === 'string') {
								return value.split(',').filter(Boolean);
							}
							return value;
						},
						submit: (value, { form, prop }) => {
							// 提交时将数组转换为字符串
							// 将数组转换为字符串，并去除单引号
							return Array.isArray(value) ? value.join(',').replace(/'/g, '') : value;
						}
					}
				},
				{
					label: '记录人',
					prop: 'operator',
					span: 6,
					value: user.info?.name,
					component: {
						vm: DoctorSelect
					}
				},
				{
					label: '结石病史',
					prop: 'stoneHistory',
					span: 8,
					component: {
						name: 'el-input',
						props: {
							type: 'textarea',
							rows: 2,
							placeholder: '请输入结石病史'
						}
					}
				},
				{
					label: '其他病史',
					prop: 'otherHistory',
					span: 8,
					component: {
						name: 'el-input',
						props: {
							type: 'textarea',
							rows: 2,
							placeholder: '请输入其他病史'
						}
					}
				},
				{
					label: '家族史',
					prop: 'familyHistory',
					span: 8,
					component: {
						name: 'el-input',
						props: {
							type: 'textarea',
							rows: 2,
							placeholder: '请输入家族史'
						}
					}
				},

				{
					label: '检查方法',
					prop: 'checkMethod',
					span: 8,
					component: {
						name: 'el-checkbox-group',
						options: checkMethodOptions
					}
				},
				{
					label: 'CT值',
					prop: 'ctValue',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入CT值'
						}
					}
				},
				{
					label: 'KUB',
					prop: 'kub',
					span: 4,
					component: {
						name: 'cl-select',
						props: {
							placeholder: '请输入KUB',
							labelKey: 'name',
							valueKey: 'name',
							options: dict.get('image_kubsize')
						}
					}
				},
				{
					label: '双能源CT预判结石成分',
					prop: 'stoneComp',
					span: 4,
					component: {
						name: 'cl-select',
						props: {
							placeholder: '请输入双能源CT预判结石成分',
							labelKey: 'name',
							valueKey: 'name',
							options: dict.get('ct_near_compose')
						}
					}
				},
				{
					label: '其他',
					prop: 'otherStoneComp',
					span: 4,
					component: {
						name: 'el-input',
						props: {
							placeholder: '请输入其他双能源CT预判结石成分'
						}
					}
				},
				{
					label: '影像诊断',
					prop: 'imageDiagnosis',
					span: 24,
					component: {
						name: 'el-input',
						props: {
							type: 'textarea',
							rows: 2,
							placeholder: '请输入影像诊断'
						}
					}
				},
				{
					label: '分析日期',
					prop: 'analysisDate',
					value: dayjs().format('YYYY-MM-DD'),
					showOverflowTooltip: true,
					component: {
						name: 'el-date-picker',
						props: {
							type: 'date',
							valueFormat: 'YYYY-MM-DD',
							clearable: true
						}
					},
					col: { span: 6 }
				},
				{
					prop: 'analysisMethod',
					label: '分析方法',
					component: {
						name: 'cl-select',
						props: {
							placeholder: '请输入分析方法',
							clearable: true,
							options: dict.get('near_analyse2'),
							labelKey: 'name',
							valueKey: 'name',
							checkStrictly: true,
							defaultExpandAll: true
						}
					},
					col: { span: 6 }
				},
				{
					prop: 'stoneLocation',
					label: '结石位置',
					component: {
						name: 'cl-select',
						props: {
							placeholder: '请输入结石位置',
							clearable: true,
							options: dict.get('compose_location'),
							labelKey: 'name',
							valueKey: 'name',
							checkStrictly: true,
							defaultExpandAll: true
						}
					},
					col: { span: 12 }
				},

				{
					prop: 'component1',
					label: '成分一',
					component: {
						name: 'cl-select',
						props: {
							placeholder: '成分一',
							clearable: true,
							options: dict.get('near_compose'),
							labelKey: 'name',
							valueKey: 'name',
							checkStrictly: true,
							defaultExpandAll: true
						}
					},
					col: { span: 2 }
				},
				{
					prop: 'component1Select',
					label: '',
					component: {
						name: 'el-button',
						props: {
							type: 'primary',
							onClick: openComponentSelect
						},
						slots: {
							default: () => '选择'
						}
					},
					col: { span: 1 }
				},
				{
					prop: 'component1Percent',
					label: '',
					component: {
						name: 'el-input',
						props: {
							placeholder: '成分一占比',
							clearable: true
						}
					},
					col: { span: 3 }
				},
				{
					prop: 'component2',
					label: '成分二',
					component: {
						name: 'cl-select',
						props: {
							placeholder: '成分二',
							clearable: true,
							options: dict.get('near_compose'),
							labelKey: 'name',
							valueKey: 'name',
							checkStrictly: true,
							defaultExpandAll: true
						}
					},
					col: { span: 3 }
				},
				{
					prop: 'component2Percent',
					label: '',
					component: {
						name: 'el-input',
						props: {
							placeholder: '成分二占比',
							clearable: true
						}
					},
					col: { span: 3 }
				},
				{
					prop: 'component3',
					label: '成分三',
					component: {
						name: 'cl-select',
						props: {
							placeholder: '成分三',
							clearable: true,
							options: dict.get('near_compose'),
							labelKey: 'name',
							valueKey: 'name',
							checkStrictly: true,
							defaultExpandAll: true
						}
					},
					col: { span: 3 }
				},
				{
					prop: 'component3Percent',
					label: '',
					component: {
						name: 'el-input',
						props: {
							placeholder: '成分三占比',
							clearable: true
						}
					},
					col: { span: 3 }
				},
				{
					prop: 'component4',
					label: '成分四',
					component: {
						name: 'cl-select',
						props: {
							placeholder: '成分四',
							clearable: true,
							options: dict.get('near_compose'),
							labelKey: 'name',
							valueKey: 'name',
							checkStrictly: true,
							defaultExpandAll: true
						}
					},
					col: { span: 3 }
				},
				{
					prop: 'component4Percent',
					label: '',
					component: {
						name: 'el-input',
						props: {
							placeholder: '成分四占比',
							clearable: true
						}
					},
					col: { span: 3 }
				}
			],
			// 需要设置form不聚焦，否则会自动聚焦到第一个输入框
			plugins: [Plugins.Form.setFocus('')],

			op: {
				// 设置操作按钮
				buttons: ['save'],
				justify: 'center'
			},
			on: {
				// 提交表单
				submit: async (data, { done }) => {
					// 处理检查方法数据 - 从多选框数组转为单独的字段
					const checkMethodOptions = data.checkMethod || [];
					const checkMethodData = {
						hasUltrasound: checkMethodOptions.includes('hasUltrasound') ? 1 : 0,
						hasKUB: checkMethodOptions.includes('hasKUB') ? 1 : 0,
						hasCT: checkMethodOptions.includes('hasCT') ? 1 : 0,
						hasMRI: checkMethodOptions.includes('hasMRI') ? 1 : 0,
						hasCTU: checkMethodOptions.includes('hasCTU') ? 1 : 0,
						hasIVU: checkMethodOptions.includes('hasIVU') ? 1 : 0
					};

					// 创建最终提交的数据对象 - 合并原数据和检查方法数据
					const submitData = {
						...data,
						...checkMethodData
					};

					try {
						// 确保编辑时id存在
						if (data.id != undefined && Number(data.id) > 0) {
							if (
								data.component1 != null ||
								data.component2 != null ||
								data.component3 != null ||
								data.component4 != null
							) {
								//console.log('data.component1:', data.component1);
								//console.log('data.component2:', data.component2);
								//console.log('data.component3:', data.component3);
								//console.log('data.component4:', data.component4);
								// 检测成分占比总和是否等于100
								const component1Percent = parseFloat(data.component1Percent) || 0;
								const component2Percent = parseFloat(data.component2Percent) || 0;
								const component3Percent = parseFloat(data.component3Percent) || 0;
								const component4Percent = parseFloat(data.component4Percent) || 0;

								const totalPercent =
									component1Percent +
									component2Percent +
									component3Percent +
									component4Percent;

								// 允许一定的浮点数误差（0.01）
								if (Math.abs(totalPercent - 100) > 0.01) {
									ElMessage.error(
										`成分占比总和必须等于100%，当前总和为：${totalPercent.toFixed(2)}%`
									);
									done();
									return;
								}
							}
							if (
								submitData.component1Percent === '' ||
								submitData.component1Percent === null
							) {
								submitData.component1Percent = undefined;
							}
							if (
								submitData.component2Percent === '' ||
								submitData.component2Percent === null
							) {
								submitData.component2Percent = undefined;
							}
							if (
								submitData.component3Percent === '' ||
								submitData.component3Percent === null
							) {
								submitData.component3Percent = undefined;
							}
							if (
								data.component4Percent === '' ||
								submitData.component4Percent === null
							) {
								submitData.component4Percent = undefined;
							}
							await service.etiology.info.update(submitData);
							ElMessage.success('保存成功');
							// 同步门诊号、住院号到共享ref，供 SimplifyStep 实时使用
							try {
								if (injectedOutpatientNo) {
									injectedOutpatientNo.value = submitData.outpatientNo || '';
								}
								if (injectedInpatientNo) {
									injectedInpatientNo.value = submitData.inpatientNo || '';
								}
							} catch (e) {}
						} else {
							// 如果没有id，可能需要调用 add 方法，或者提示错误
							console.warn('尝试更新记录但缺少ID');
							ElMessage.warning('缺少记录ID，无法更新');
						}
					} catch (error: any) {
						console.error('保存失败:', error);
						ElMessage.error('保存失败: ' + (error.message || '未知错误'));
					} finally {
						done();
					}
				}
			}
		});
	} catch (error: any) {
		console.error('组件初始化失败:', error);
		ElMessage.error('加载患者信息失败: ' + (error.message || '未知错误'));
	}
});

// 修正 BMI 计算函数
const handleBMICalculation = () => {
	// 获取当前表单数据
	const formValue = Form.value?.form || {};

	// 参数验证
	const height = Number(formValue.height || 0);
	const weight = Number(formValue.weight || 0);
	if (!height || !weight || isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
		return;
	}

	// 计算BMI: 体重(kg) / 身高(m)的平方
	// 将身高从厘米转换为米
	const heightInMeters = height / 100;
	const bmi = weight / (heightInMeters * heightInMeters);

	// 打印计算过程便于调试
	//console.log(`BMI计算结果: ${weight} / (${heightInMeters})² = ${bmi.toFixed(2)}`);

	// 设置BMI值
	Form.value?.setForm('bmi', bmi.toFixed(2));
};

// 成分数据选择弹窗相关
const ComponentSelectForm = useForm();
const componentSelectData = ref<Array<any>>([]);
const selectedComponentRow = ref<any>(null);

// 成分选择分页相关状态
const componentPagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
});

/**
 * 打开成分选择弹窗
 */
const openComponentSelect = async () => {
	try {
		// 加载成分数据
		await loadComponentData();

		ComponentSelectForm.value?.open({
			title: '选择成分数据',
			width: '800px',
			height: '600px',
			items: [
				{
					prop: 'componentTable',
					component: {
						name: 'slot-component-table'
					}
				}
			],
			on: {
				submit(data, { close }) {
					if (!selectedComponentRow.value) {
						ElMessage.warning('请选择一条成分数据');
						return;
					}
					// 将选中的成分填充到成分一输入框
					addComponentToForm(selectedComponentRow.value);
					close();
				}
			}
		});
	} catch (error: any) {
		console.error('打开成分选择弹窗失败:', error);
		ElMessage.error('打开成分选择弹窗失败: ' + (error.message || '未知错误'));
	}
};

/**
 * 加载成分数据
 */
const loadComponentData = async (page = 1) => {
	try {
		componentPagination.currentPage = page;

		// 获取成分数据
		const allData = await service.etiology.muaItems.componentList({
			patientNo: props.patientNo,
			swlNo: props.swlNo
		});

		// 模拟分页处理
		componentPagination.total = allData.length;
		const startIndex = (componentPagination.currentPage - 1) * componentPagination.pageSize;
		const endIndex = startIndex + componentPagination.pageSize;

		// 将数据格式化为统一的格式
		componentSelectData.value = allData.slice(startIndex, endIndex).map(item => ({
			analysisDate: item.analysisDate || '',
			component1: item.component1 || '',
			component1Percent: item.component1Percent || '',
			component2: item.component2 || '',
			component2Percent: item.component2Percent || '',
			component3: item.component3 || '',
			component3Percent: item.component3Percent || '',
			component4: item.component4 || '',
			component4Percent: item.component4Percent || '',
			analysisMethod: item.analysisMethod || '',
			stoneLocation: item.stoneLocation || ''
		}));
	} catch (error: any) {
		console.error('加载成分数据失败:', error);
		ElMessage.error('加载成分数据失败: ' + (error.message || '未知错误'));
	}
};

/**
 * 处理成分表格行选择
 */
const handleComponentRowClick = (row: any) => {
	selectedComponentRow.value = row;
};

/**
 * 获取成分表格行样式类名
 */
const getComponentRowClassName = ({ row }: { row: any }) => {
	if (
		selectedComponentRow.value &&
		selectedComponentRow.value.analysisDate === row.analysisDate &&
		selectedComponentRow.value.component1 === row.component1 &&
		selectedComponentRow.value.component2 === row.component2 &&
		selectedComponentRow.value.component3 === row.component3 &&
		selectedComponentRow.value.component4 === row.component4 &&
		selectedComponentRow.value.component1Percent === row.component1Percent &&
		selectedComponentRow.value.component2Percent === row.component2Percent &&
		selectedComponentRow.value.component3Percent === row.component3Percent &&
		selectedComponentRow.value.component4Percent === row.component4Percent &&
		selectedComponentRow.value.analysisMethod === row.analysisMethod &&
		selectedComponentRow.value.stoneLocation === row.stoneLocation
	) {
		return 'selected-component-row';
	}
	return '';
};

/**
 * 成分分页事件处理
 */
const handleComponentPageChange = (page: number) => {
	selectedComponentRow.value = null; // 切换页面时清空选择
	loadComponentData(page);
};

/**
 * 成分分页大小改变事件处理
 */
const handleComponentPageSizeChange = (pageSize: number) => {
	componentPagination.pageSize = pageSize;
	componentPagination.currentPage = 1; // 重置到第一页
	selectedComponentRow.value = null; // 清空选择
	loadComponentData(1);
};

/**
 * 添加成分数据到表单
 */
const addComponentToForm = (selectedRow: any) => {
	try {
		// 将选中的成分数据设置到成分一输入框
		Form.value?.setForm(
			'component1',
			selectedRow.component1 != null && selectedRow.component1 != ''
				? selectedRow.component1
				: null
		);
		Form.value?.setForm(
			'component1Percent',
			Number(selectedRow.component1Percent) > 0 ? selectedRow.component1Percent : null
		);
		Form.value?.setForm(
			'component2',
			selectedRow.component2 != null && selectedRow.component2 != ''
				? selectedRow.component2
				: null
		);
		Form.value?.setForm(
			'component2Percent',
			Number(selectedRow.component2Percent) > 0 ? selectedRow.component2Percent : null
		);
		Form.value?.setForm(
			'component3',
			selectedRow.component3 != null && selectedRow.component3 != ''
				? selectedRow.component3
				: null
		);
		Form.value?.setForm(
			'component3Percent',
			Number(selectedRow.component3Percent) > 0 ? selectedRow.component3Percent : null
		);
		Form.value?.setForm(
			'component4',
			selectedRow.component4 != null && selectedRow.component4 != ''
				? selectedRow.component4
				: null
		);
		Form.value?.setForm(
			'component4Percent',
			Number(selectedRow.component4Percent) > 0 ? selectedRow.component4Percent : null
		);
		Form.value?.setForm('analysisMethod', selectedRow.analysisMethod || '');
		Form.value?.setForm('stoneLocation', selectedRow.stoneLocation || '');
		Form.value?.setForm('analysisDate', selectedRow.analysisDate || '');

		ElMessage.success('成分选择成功');
	} catch (error: any) {
		console.error('添加成分数据失败:', error);
		ElMessage.error('添加成分数据失败: ' + (error.message || '未知错误'));
	}
};

// 监听表单字段变化，更新BMI
watch(() => Form.value?.form?.height, handleBMICalculation);
watch(() => Form.value?.form?.weight, handleBMICalculation);
</script>

<style lang="scss" scoped>
.mua-container {
	width: 100%;
	height: 100%;
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
}

.hidden-info {
	display: none;
}

:deep(.el-form-item__label) {
	font-weight: bold;
}

/* 新增滚动容器样式 */
/* 新增滚动容器样式 */
.scroll-container {
	width: 100%;
	flex: 1;
	min-height: 0;
	overflow-y: auto !important;
	overflow-x: auto !important;
	padding: 15px;
	position: relative;
	display: block;
	box-sizing: border-box;
	z-index: 1; // 确保滚动条在最上层

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

	// 确保内容宽度超出容器以启用横向滚动
	.content {
		width: 100%; // 示例宽度，确保超出容器
	}
}
.scroll-container .el-form-item {
	margin: 0;
	padding: 0;
	width: 100%;
}

:deep(.el-form) {
	.el-form-item {
		margin-bottom: 5px;
	}

	.el-row {
		margin-bottom: 5px;
	}
}

:deep(.el-select) {
	width: 100%;
}

/* 成分选择表格的选中行样式 */
:deep(.selected-component-row) {
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
</style>
