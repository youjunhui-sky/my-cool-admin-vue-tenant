<template>
	<cl-crud ref="Crud">
		<p hidden>patientNo: {{ patientNo }}</p>
		<p hidden>swlNo: {{ swlNo }}</p>
		<p hidden>serialNumber: {{ serialNumber }}</p>
		<p hidden>swlInfoId: {{ swlInfoId }}</p>
		<p hidden>etiologyId: {{ etiologyId }}</p>
		<p hidden>name: {{ name }}</p>

		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="姓名、碎石号、就诊流水号" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<!-- 展开信息 -->
				<template #column-detail="{ scope }">
					<div style="padding: 0 10px">
						<el-descriptions border :column="4" class="treatment-descriptions">
							<el-descriptions-item label="成分一">
								{{ scope.row.component1 }}
							</el-descriptions-item>
							<el-descriptions-item label="成分一占比">
								{{ scope.row.component1Percent }}
							</el-descriptions-item>
							<el-descriptions-item label="成分二">
								{{ scope.row.component2 }}
							</el-descriptions-item>
							<el-descriptions-item label="成分二占比">
								{{ scope.row.component2Percent }}
							</el-descriptions-item>
							<el-descriptions-item label="成分三">
								{{ scope.row.component3 }}
							</el-descriptions-item>
							<el-descriptions-item label="成分三占比">
								{{ scope.row.component3Percent }}
							</el-descriptions-item>
							<el-descriptions-item label="成分四">
								{{ scope.row.component4 }}
							</el-descriptions-item>
							<el-descriptions-item label="成分四占比">
								{{ scope.row.component4Percent }}
							</el-descriptions-item>
						</el-descriptions>
					</div>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert">
			<!-- 添加医生选择器插槽 -->
			<template #slot-doctor="{ scope }">
				<doctor-select v-model="scope.operator" />
			</template>
		</cl-upsert>
		<component
			:is="PatientSWLSelect"
			ref="patientSelect"
			@select="onSelectPatientAll"
			:immediate-search="true"
			:remember-search="true"
		/>
	</cl-crud>
</template>

<script lang="ts" name="swl-family-form" setup>
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { h, nextTick, onMounted, reactive, ref } from 'vue';
import { useBase } from '/@/modules/base';
import { usePatient } from '/@/modules/patient';
import { ElMessageBox, ElMessage } from 'element-plus';
import dayjs from 'dayjs';

const { dict } = useDict();
const { service } = useCool();
//const route = useRoute();
const { user } = useBase();
// 引入医生选择器组件
const { DoctorSelect, PatientSWLSelect } = usePatient().components;
// 创建组件引用
const patientSelect = ref();
// 获取路由参数
//const id = route.query.id;
//const swlNo = route.query.swlNo;
//const serialNumber = route.query.serialNumber;
//const patientNo = route.query.patientNo;

// 定义 props
const props = defineProps({
	patientNo: {
		type: String,
		required: false
	},
	swlInfoId: {
		type: Number,
		required: false
	},
	etiologyId: {
		type: Number,
		required: false
	},
	swlNo: {
		type: String,
		required: false
	},
	serialNumber: {
		type: String,
		required: false
	},
	name: {
		type: String,
		required: false
	}
});

// 页面数据和状态
const pageData = reactive({
	loading: false,
	hasRecords: false,
	analysisCount: 0
});

// 静态配置和选项
const options = reactive({
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	]
});

/**
 * 第一步：crud配置
 * page:后端重写page方法，用于查询治疗记录，需包含SWL登记信息
 * info:后端重写info方法，用于查询治疗记录详情，需包含SWL登记信息
 */
const Crud = useCrud(
	{
		service: service.etiology.component
	},
	app => {
		//app.refresh();
	}
);

// 创建统一的刷新参数构建函数
const buildRefreshParams = () => {
	return props.swlNo && props.serialNumber
		? { swlNo: props.swlNo, serialNumber: props.serialNumber }
		: {};
};

/**
 * 第二步：填写结石成分的前置信息：
 * 查询病人SWL登记信息
 */
const patientSwlInfo = reactive({
	id: '', // 患者ID
	patientNo: '', // 患者编号
	swlNo: '', // 碎石号
	serialNumber: '', // 就诊流水号
	name: '', // 姓名
	gender: '', // 性别
	age: '', // 年龄
	height: '', // 身高
	weight: '', // 体重
	bmi: '' // BMI
});

// 查询病人基本信息
const querySwl = async () => {
	try {
		const params = { id: props.swlInfoId };
		const data = await service.swl.info.info(params);
		if (data) {
			// 不再使用setForm，而是直接返回数据，后续在合并时使用
			//console.log('查询到患者基本信息:', data);
			// 将查询到的数据赋值给患者信息对象
			Object.assign(patientSwlInfo, data);
			return data;
		}
		return null;
	} catch (error) {
		console.error('获取患者信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(patientSwlInfo, {
			id: null,
			swlNo: ' ',
			serialNumber: ' ',
			name: ' ',
			gender: null,
			age: ' ',
			height: null,
			weight: null,
			bmi: null
		});
	}
};

// 查询病因基本信息
const queryEtiology = async () => {
	try {
		const params = { id: props.etiologyId };
		const data = await service.etiology.info.info(params);
		if (data) {
			// 不再使用setForm，而是直接返回数据，后续在合并时使用
			//console.log('查询到病因基本信息:', data);
			// 将查询到的数据赋值给患者信息对象
			Object.assign(patientSwlInfo, data);
			return data;
		}
		return null;
	} catch (error) {
		console.error('获取病因信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(patientSwlInfo, {
			id: null,
			swlNo: ' ',
			serialNumber: ' ',
			name: ' ',
			gender: null,
			age: ' ',
			height: null,
			weight: null,
			bmi: null
		});
	}
};

/**
 * 第三步：页面初始化
 * url参数：swlNo,serialNumber有值时，table初始化该患者治疗记录
 * 无url参数时，table初始化所有患者治疗记录
 */
const initPage = async () => {
	pageData.loading = true;

	try {
		// 查询患者基本信息 - 优先使用 etiologyId，其次使用 swlInfoId
		if (props.etiologyId) {
			await queryEtiology();
		} else if (props.swlInfoId) {
			await querySwl();
		}

		// 如果有patientNo、swlNo和serialNumber，检查是否有记录
		if (props.patientNo && props.swlNo && props.serialNumber) {
			try {
				const records = await service.etiology.component.page({
					patientNo: props.patientNo,
					swlNo: props.swlNo,
					serialNumber: props.serialNumber,
					page: 1,
					size: 999
				});

				if (records && records.list && records.list.length > 0) {
					pageData.hasRecords = true;
					const maxAnalysisCount = records.list.reduce((max, item) => {
						const analysisCount = parseInt(item.analysisCount) || 0;
						return analysisCount > max ? analysisCount : max;
					}, 0);
					pageData.analysisCount = maxAnalysisCount;
					// 使用统一的刷新参数
					Crud.value?.refresh(buildRefreshParams());
				} else {
					pageData.hasRecords = false;
					ElMessageBox.confirm('是否新增新的结石成分记录？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
						.then(() => {
							Crud.value?.rowAdd();
						})
						.catch(() => {
							// 使用统一的刷新参数
							Crud.value?.refresh(buildRefreshParams());
						});
				}
			} catch (error) {
				console.error('查询结石成分记录失败', error);
				ElMessage.error('查询结石成分记录失败');
				pageData.hasRecords = false;
				// 使用统一的刷新参数
				Crud.value?.refresh(buildRefreshParams());
			}
		} else {
			// 使用统一的刷新参数
			Crud.value?.refresh(buildRefreshParams());
		}
	} catch (error) {
		console.error('页面初始化失败', error);
		ElMessage.error('页面初始化失败');
	} finally {
		pageData.loading = false;
	}
};

// 使用nextTick包装初始化函数，确保组件已经渲染
const safeInit = () => {
	nextTick(() => {
		initPage();
	});
};

// 在mounted钩子中使用setTimeout避免生命周期问题
onMounted(() => {
	setTimeout(safeInit, 0);
});

// cl-table
const Table = useTable({
	// 自动高度关闭
	autoHeight: false,
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' }
	},
	columns: [
		{ type: 'selection' },
		// 展开列
		{
			label: '展开',
			type: 'expand',
			prop: 'detail',
			fixed: true, // 固定选择列
			minWidth: 60
		},
		{
			label: '档案号',
			prop: 'patientNo',
			fixed: true, // 固定选择列
			minWidth: 120
		},
		{
			label: '碎石号',
			prop: 'swlNo',
			fixed: true, // 固定选择列
			minWidth: 100
		},
		{
			label: '姓名',
			prop: 'name',
			fixed: true, // 固定选择列
			minWidth: 100
		},
		{
			label: '就诊流水号',
			prop: 'serialNumber',
			hidden: true,
			minWidth: 120
		},
		{
			label: '次数',
			prop: 'analysisCount',
			minWidth: 60
		},
		{
			label: '分析日期',
			prop: 'analysisDate',
			showOverflowTooltip: true,
			//鼠标悬停显示
			tooltipEffect: 'dark',
			formatter: (row: any) => {
				return row.analysisDate?.split(' ')[0] || '';
			},
			minWidth: 120
		},
		{
			label: '性别',
			prop: 'gender',
			minWidth: 60,
			dict: options.gender
		},
		{
			label: '身高',
			prop: 'height',
			minWidth: 60
		},
		{
			label: '体重',
			prop: 'weight',
			minWidth: 60
		},
		{
			label: 'BMI指数',
			prop: 'bmi',
			minWidth: 80
		},
		{
			label: '结石位置',
			prop: 'stoneLocation',
			minWidth: 120
		},
		{
			label: '分析方法',
			prop: 'analysisMethod',
			minWidth: 120
		},
		// {
		// 	label: '成分一',
		// 	prop: 'component1',
		// 	minWidth: 120
		// },
		// {
		// 	label: '成分一占比',
		// 	prop: 'component1Percent',
		// 	minWidth: 120
		// },
		// {
		// 	label: '成分二',
		// 	prop: 'component2',
		// 	minWidth: 120
		// },
		// {
		// 	label: '成分二占比',
		// 	prop: 'component2Percent',
		// 	minWidth: 120
		// },
		// {
		// 	label: '成分三',
		// 	prop: 'component3',
		// 	minWidth: 120
		// },
		// {
		// 	label: '成分三占比',
		// 	prop: 'component3Percent',
		// 	minWidth: 120
		// },
		// {
		// 	label: '成分四',
		// 	prop: 'component4',
		// 	minWidth: 120
		// },
		// {
		// 	label: '成分四占比',
		// 	prop: 'component4Percent',
		// 	minWidth: 120
		// },
		{
			label: '备注',
			prop: 'remark',
			minWidth: 150
		},
		{
			type: 'op',
			buttons: ['edit', 'delete']
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '60%',
		// 顶部距离
		top: '2%',
		// 内边距
		padding: '10px 30px 10px 30px'
	},
	// 在表单打开前执行
	async onOpen() {
		// 判断当前表单的操作模式
		if (Upsert.value?.mode === 'add') {
			try {
				let currentSwlNo = '';
				let currentSerialNumber = '';
				let currentPatientNo = '';
				let selection: any[] = [];
				// 如果props中patientNo、swlNo和serialNumber的值不为空或者undefined
				if (props.patientNo && props.swlNo && props.serialNumber) {
					currentPatientNo = props.patientNo as string;
					currentSwlNo = props.swlNo as string;
					currentSerialNumber = props.serialNumber as string;
				} else {
					// 如果没有props参数，检查表格选中行
					selection = Table.value?.getSelectionRows() || [];
					if (selection.length === 1) {
						currentPatientNo = selection[0].patientNo as string;
						currentSwlNo = selection[0].swlNo as string;
						currentSerialNumber = selection[0].serialNumber as string;
					}
				}

				// 如果有patientNo、swlNo和serialNumber，查询最大次数
				if (currentPatientNo && currentSwlNo && currentSerialNumber) {
					const records = await service.etiology.component.page({
						patientNo: currentPatientNo,
						swlNo: currentSwlNo,
						serialNumber: currentSerialNumber,
						page: 1,
						size: 999
					});

					let maxAnalysisCount = 0;
					if (records && records.list && records.list.length > 0) {
						// 找出最大次数
						maxAnalysisCount = records.list.reduce((max, item) => {
							const analysisCount = parseInt(item.analysisCount) || 0;
							return analysisCount > max ? analysisCount : max;
						}, 0);
					}

					// 初始化表单数据
					if (Upsert.value?.form) {
						const defaulData = {
							patientNo: currentPatientNo,
							swlNo: currentSwlNo,
							serialNumber: currentSerialNumber,
							analysisCount: maxAnalysisCount + 1,
							name: patientSwlInfo.name || selection?.[0]?.name,
							gender: patientSwlInfo.gender || selection?.[0]?.gender,
							height: patientSwlInfo.height || selection?.[0]?.height,
							weight: patientSwlInfo.weight || selection?.[0]?.weight,
							bmi: patientSwlInfo.bmi || selection?.[0]?.bmi,
							//复制上一次的数据，如果不需要可以删除selection?.[0]?
							stoneLocation: selection?.[0]?.stoneLocation || '',
							analysisMethod: selection?.[0]?.analysisMethod || '',
							component1: selection?.[0]?.component1 || '',
							component1Percent: selection?.[0]?.component1Percent || null,
							component2: selection?.[0]?.component2 || '',
							component2Percent: selection?.[0]?.component2Percent || null,
							component3: selection?.[0]?.component3 || '',
							component3Percent: selection?.[0]?.component3Percent || null,
							component4: selection?.[0]?.component4 || '',
							component4Percent: selection?.[0]?.component4Percent || null,
							analysisDate: dayjs().format('YYYY-MM-DD'),
							operator: selection?.[0]?.operator || user.info?.name,
							remark: ''
						};
						Object.assign(Upsert.value.form, defaulData);
					}
				}
			} catch (error) {
				ElMessage.error('获取次数信息失败');
			}
		}
	},

	// async onOpen() {
	// 	// 获取当前用户信息
	// 	const currentUser = user.info;

	// 	// 如果是新增模式
	// 	if (Upsert.value?.mode === 'add') {
	// 		// 1. 如果是从表格选择行新增
	// 		if (Table.value?.selection.length > 0) {
	// 			const selectedRow = Table.value.selection[0];
	// 			if (Upsert.value?.form) {
	// 				// 设置选中行的信息
	// 				Upsert.value.form.name = selectedRow.name;
	// 				Upsert.value.form.patientNo = selectedRow.patientNo;
	// 				Upsert.value.form.gender = selectedRow.gender;
	// 				Upsert.value.form.age = selectedRow.age;
	// 				Upsert.value.form.birthDate = selectedRow.birthDate;
	// 				Upsert.value.form.department = selectedRow.department;
	// 			}
	// 		}
	// 		// 2. 如果是从 patientNo 路由参数跳转来的，且没有选中表格行
	// 		else if (props.patientNo && !Table.value?.selection.length) {
	// 			const patientInfo = await querySwl();
	// 			if (patientInfo && Upsert.value?.form) {
	// 				// 设置患者基本信息
	// 				Upsert.value.form.name = patientInfo.name;
	// 				Upsert.value.form.patientNo = props.patientNo;
	// 				Upsert.value.form.gender = patientInfo.gender;
	// 				Upsert.value.form.age = patientInfo.age;
	// 				Upsert.value.form.birthDate = patientInfo.birthDate;
	// 				// 设置默认科室和医生
	// 				Upsert.value.form.department = currentUser?.departmentName;
	// 			}
	// 		}
	// 		// 3. 普通新增，只设置默认科室和医生
	// 		else {
	// 			if (Upsert.value?.form) {
	// 				Upsert.value.form.department = currentUser?.departmentName;
	// 			}
	// 		}
	// 	}
	// },
	onSubmit(data, { next, done, close }) {
		// 确保必要字段存在
		if (!data.patientNo && props.patientNo) {
			data.patientNo = props.patientNo;
		}
		if (!data.swlNo && props.swlNo) {
			data.swlNo = props.swlNo;
		}
		if (!data.serialNumber && props.serialNumber) {
			data.serialNumber = props.serialNumber;
		}

		// 确保编辑时id存在
		if (Upsert.value?.mode === 'update' && !data.id) {
			ElMessage.error('无法更新记录：缺少ID');
			done();
			return;
		}

		if (
			data.component1 != null ||
			data.component2 != null ||
			data.component3 != null ||
			data.component4 != null
		) {
			// 检测成分占比总和是否等于100
			const component1Percent = parseFloat(data.component1Percent) || 0;
			const component2Percent = parseFloat(data.component2Percent) || 0;
			const component3Percent = parseFloat(data.component3Percent) || 0;
			const component4Percent = parseFloat(data.component4Percent) || 0;

			const totalPercent =
				component1Percent + component2Percent + component3Percent + component4Percent;

			// 允许一定的浮点数误差（0.01）
			if (Math.abs(totalPercent - 100) > 0.01) {
				ElMessage.error(
					`成分占比总和必须等于100%，当前总和为：${totalPercent.toFixed(2)}%`
				);
				done();
				return;
			}
		}

		if (data.component1Percent === '' || data.component1Percent === null) {
			data.component1Percent = undefined;
		}
		if (data.component2Percent === '' || data.component2Percent === null) {
			data.component2Percent = undefined;
		}
		if (data.component3Percent === '' || data.component3Percent === null) {
			data.component3Percent = undefined;
		}
		if (data.component4Percent === '' || data.component4Percent === null) {
			data.component4Percent = undefined;
		}

		// 继续提交
		next(data)
			.then(() => {
				// 提交成功后刷新列表
				Crud.value?.refresh(buildRefreshParams());
				close();
			})
			.catch(() => {
				done();
			});
	},

	items: [
		{
			label: '姓名',
			prop: 'name',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入姓名',
					clearable: true
				},
				slots: {
					append: () => {
						return h(
							'el-button',
							{
								type: 'primary',
								onClick: openPatientSelectAll
							},
							'选择'
						);
					}
				}
			},
			col: { span: 6 }
		},
		{
			prop: 'gender',
			label: '性别',
			component: {
				name: 'cl-select',
				props: {
					options: options.gender,
					// 严格模式，确保选择器只选择一个值
					checkStrictly: true
				}
			},
			col: { span: 6 }
		},
		{
			prop: 'height',
			label: '身高',
			value: null,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入身高(cm)',
					step: 0.1,
					min: 0,
					precision: 1,
					controlsPosition: 'right',
					onChange(val) {
						//console.log('身高更新为: ', val);
						// 更新BMI值
						if (Upsert.value?.form) {
							Upsert.value.setForm(
								'bmi',
								handleBMICalculation(Number(val), Upsert.value.form.weight)
							);
						}
					}
				}
			},
			col: { span: 3 }
		},
		{
			prop: 'weight',
			label: '体重',
			props: {
				labelPosition: 'top'
			},
			value: null, // 确保有初始值
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入体重(kg)',
					step: 0.1,
					min: 0,
					precision: 1,
					controlsPosition: 'right',
					onChange(val) {
						//console.log('体重更新为: ', val);
						// 更新BMI值
						if (Upsert.value?.form) {
							Upsert.value.setForm(
								'bmi',
								handleBMICalculation(Upsert.value.form.height, Number(val))
							);
						}
					}
				}
			},
			col: { span: 3 }
		},
		{
			prop: 'bmi',
			label: 'BMI指数',
			value: null,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					readonly: true,
					disabled: true
				}
			},
			// 自动计算BMI的hook
			hook: {
				bind(value, { form }) {
					//console.log('计算BMI, 身高:', form.height, '体重:', form.weight);
					// 调用通用的BMI计算函数
					return handleBMICalculation(form.height, form.weight);
				}
			},
			col: { span: 6 }
		},
		{
			label: '碎石号',
			prop: 'swlNo',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入碎石号',
					clearable: true,
					readonly: true,
					disabled: true
				}
			},
			col: { span: 6 }
		},
		{
			label: '就诊流水号',
			prop: 'serialNumber',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入就诊流水号',
					clearable: true,
					readonly: true,
					disabled: true
				}
			},
			col: { span: 6 }
		},
		{
			label: '次数',
			prop: 'analysisCount',
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入次数',
					clearable: true,
					step: 1,
					min: 0,
					precision: 0,
					controlsPosition: 'right'
				}
			},
			col: { span: 3 }
		},
		{
			label: '出生日期',
			prop: 'birthDate',
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
			col: { span: 3 }
		},
		{
			label: '就诊日期',
			prop: 'visitDate',
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
			col: { span: 3 }
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
			col: { span: 3 }
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
			col: { span: 6 }
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
			col: { span: 6 }
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
			col: { span: 6 }
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
			col: { span: 6 }
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
			col: { span: 6 }
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
			col: { span: 6 }
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
			col: { span: 6 }
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
			col: { span: 6 }
		},
		{
			prop: 'operator',
			label: '登记人',
			value: user.info?.name,
			component: {
				name: 'slot-doctor'
			},
			col: { span: 6 }
		},
		{
			prop: 'remark',
			label: '备注',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入备注',
					clearable: true
				}
			},
			col: { span: 18 }
		}
	]
});

// 修改openPatientSelectAll函数
function openPatientSelectAll() {
	// 判断当前表单的操作模式,新增才给打开
	if (Upsert.value?.mode === 'add') {
		// 获取当前表单中输入的姓名
		const currentName = Upsert.value?.form?.name || '';
		//console.log('准备打开患者选择对话框，传递姓名:', currentName);
		// 打开患者选择组件并传入当前输入的姓名作为搜索条件
		patientSelect.value?.open({
			keyword: currentName,
			autoSearch: true // 添加自动搜索标志
		});
	}
}

// 选择病人后的回调
function onSelectPatientAll(row: any) {
	// 处理选中的数据
	//console.log('Selected patient:', row);
	// 直接通过 Upsert.value?.form 访问表单数据
	if (Upsert.value?.form) {
		// 映射数据到表单
		Upsert.value.form.name = row.name;
		Upsert.value.form.patientNo = row.patientNo;
		Upsert.value.form.swlNo = row.swlNo;
		Upsert.value.form.serialNumber = row.serialNumber;
		Upsert.value.form.gender = row.gender;
		Upsert.value.form.birthDate = row.birthDate?.split(' ')[0] || '';
		Upsert.value.form.visitDate = row.visitDate?.split(' ')[0] || '';

		// // 计算年龄
		// Upsert.value.form.age = handleAgeCalculation(
		// 	Upsert.value.form.visitDate,
		// 	row.birthDate?.split(' ')[0] || ''
		// );
		// 复制其他需要的字段
		if (row.height) Upsert.value.form.height = Number(row.height) || 0;
		if (row.weight) Upsert.value.form.weight = Number(row.weight) || 0;
		if (row.bmi) Upsert.value.form.bmi = Number(row.bmi) || 0;

		// 复制地址相关信息
		if (row.nativeProvince) {
			Upsert.value.form.nativeProvince = row.nativeProvince;
			Upsert.value.form.nativeCity = row.nativeCity;
			Upsert.value.form.nativeDistrict = row.nativeDistrict;
			Upsert.value.form.nativeAddress = row.nativeAddress;

			// 更新籍贯级联选择器的值
			Upsert.value.form.pca2 = [
				row.nativeProvince,
				row.nativeCity,
				row.nativeDistrict
			].filter(Boolean);
		}

		if (row.currentProvince) {
			Upsert.value.form.currentProvince = row.currentProvince;
			Upsert.value.form.currentCity = row.currentCity;
			Upsert.value.form.currentDistrict = row.currentDistrict;
			Upsert.value.form.currentAddress = row.currentAddress;

			// 更新现住址级联选择器的值
			Upsert.value.form.pca1 = [
				row.currentProvince,
				row.currentCity,
				row.currentDistrict
			].filter(Boolean);
		}

		// 设置患者ID,排除身份证以及手机号验证
		//selectedRecordId.value = row?.id;

		ElMessage.success('已成功选择患者并填充信息');
	}
}

// BMI计算函数，接收身高和体重参数
const handleBMICalculation = (height: number, weight: number) => {
	// 参数验证
	if (!height || !weight || isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
		return null;
	}

	// 计算BMI: 体重(kg) / 身高(m)的平方
	// 将身高从厘米转换为米
	const heightInMeters = height / 100;
	const bmi = weight / (heightInMeters * heightInMeters);

	// 打印计算过程便于调试
	//console.log(`BMI计算结果: ${weight} / (${heightInMeters})² = ${bmi.toFixed(2)}`);

	// 返回保留两位小数的BMI值
	return bmi.toFixed(2);
};
</script>

<style lang="scss" scoped>
/* el-descriptions样式 */
.treatment-descriptions {
	:deep(.el-descriptions__cell) {
		// 确保单元格宽度平均分配
		width: 25% !important;
	}

	:deep(.el-descriptions__item) {
		// 设置弹性布局基础值
		flex: 1 1 25% !important;
		// 设置最小和最大宽度确保4列布局
		min-width: 25% !important;
		max-width: 25% !important;
	}
	:deep(.el-descriptions__label) {
		text-align: left !important;
		// 如果需要固定标签宽度，可以设置
		min-width: 150px !important;
		width: auto !important;
	}

	:deep(.el-descriptions-item__container) {
		text-align: left !important;
	}

	:deep(.el-descriptions-item__content) {
		text-align: left !important;
	}
}
</style>
