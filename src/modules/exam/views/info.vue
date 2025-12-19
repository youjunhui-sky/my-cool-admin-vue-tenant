<template>
	<cl-crud ref="Crud">
		<p hidden>id: {{ swlInfoId }}</p>
		<p hidden>patientNo: {{ patientNo }}</p>
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />

			<cl-flex>
				<el-button type="primary" @click="handlePrintExam">打印B超报告</el-button>
			</cl-flex>
			<cl-flex1 />
			<!-- 关键字搜索 重置按钮-->
			<cl-search-key placeholder="姓名、档案号、超声号" :refreshOnInput="true" />
		</cl-row>
		<cl-row>
			<cl-table ref="Table"></cl-table>
		</cl-row>
		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>
		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert">
			<!-- 添加科室选择器插槽 -->
			<template #slot-department="{ scope }">
				<component :is="DepartmentSelect" v-model="scope.department" />
			</template>
			<!-- 添加医生选择器插槽 -->
			<template #slot-doctor="{ scope }">
				<component :is="DoctorSelect" v-model="scope.doctor" />
			</template>
		</cl-upsert>
		<ris-template-select ref="RisTemplate" @select="onSelectTemplate" />
		<!-- 添加患者选择组件 -->
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
import { useCrud, useForm, useTable, useUpsert } from '@cool-vue/crud';
import { router, useCool } from '/@/cool';
import { usePatient } from '/@/modules/patient';
import { nextTick, onMounted, reactive, ref, watch, h } from 'vue';
import RisTemplateSelect from '../components/ris-template-select.vue';
import { useBase } from '../../base';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
// 导入URL工具函数
import { formatImageUrl, cleanImageUrlForSubmit } from '../../base/utils/url';

const { service } = useCool();
const { user } = useBase();
const {
	// 医生选择组件
	DoctorSelect,
	// 科室选择组件
	DepartmentSelect,
	// 患者选择组件
	PatientSWLSelect
} = usePatient().components;

//const route = useRoute();

// 获取路由参数
//const id = route.query.id;
//const patientNo = route.query.patientNo;

const handlePrintExam = () => {
	//console.log('打印B超报告');
	//取到勾选的行
	const selectedRows = Table.value?.getSelectionRows();
	if (selectedRows.length === 0) {
		ElMessage.error('请选择要打印的B超记录');
		return;
	}
	router.push({
		path: '/exam/record',
		query: {
			id: selectedRows[0].id
		}
	});
};

// 定义 props
const props = defineProps({
	patientNo: {
		type: String,
		required: true
	},
	swlInfoId: {
		type: [Number, String],
		required: true
	}
});

// 使用 props
//console.log('patientNo:', props.patientNo);
//console.log('id:', props.swlInfoId);

// 标签映射
const options = reactive({
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	]
});

// 添加患者信息对象
const patientSwlInfo = reactive({
	id: '', // 患者ID
	swlNo: '', // 碎石号
	name: '', // 姓名
	gender: '', // 性别
	age: '', // 年龄
	sequenceNo: '', // 序列号
	episode: '' // 期数
});

// 默认费用缓存
const defaultFeeCache = ref<number>(120);

// 使用nextTick包装初始化函数，确保组件已经渲染
const safeInit = async () => {
	nextTick(async () => {
		await querySwl();
		// 获取默认费用
		await loadDefaultFee();
	});
};

// 在mounted钩子中使用setTimeout避免生命周期问题
onMounted(() => {
	setTimeout(safeInit, 0);
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
			id: ' ',
			swlNo: ' ',
			name: ' ',
			gender: ' ',
			age: ' ',
			sequenceNo: ' ',
			episode: ' '
		});
	}
};

const Crud = useCrud(
	{
		service: {
			...service.imgexam.info,
			// 重写 page 方法，根据 patientNo 过滤
			page: async params => {
				// 如果有 patientNo，添加到查询参数中
				if (props.patientNo) {
					params.patientNo = props.patientNo;
				}
				const res = await service.imgexam.info.page(params);

				// 处理首次加载且有 patientNo 但无数据的情况
				if (props.patientNo && res.list.length === 0) {
					ElMessageBox.confirm('该患者未有B超报告，是否新增报告？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
						.then(() => {
							// 用户点击确定，打开新增表单
							Crud.value?.rowAdd();
						})
						.catch(() => {
							// 用户点击取消，显示空表格
							//console.log('用户取消新增');
						});
				}
				return res;
			},
			// 其他方法保持不变
			add: data => service.imgexam.info.add(data),
			update: data => service.imgexam.info.update(data),
			delete: data => service.imgexam.info.delete(data),
			info: data => service.imgexam.info.info(data)
		}
	},
	app => {
		app.refresh();
	}
);

// cl-table
const Table = useTable({
	autoHeight: false,
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' }
		// 添加以下属性
		//fit: true, // 列的宽度自动撑开
		//maxHeight: 'calc(100vh - 280px)' // 设置最大高度，避免内容溢出
	},
	columns: [
		{ type: 'selection' },
		{
			label: '档案号',
			prop: 'patientNo',
			fixed: true, // 固定选择列
			minWidth: 120
		},
		{
			label: '超声号',
			prop: 'ultrasoundNo',
			fixed: true, // 固定选择列
			minWidth: 120
		},
		{
			label: '患者姓名',
			prop: 'name',
			fixed: true, // 固定选择列
			minWidth: 100
		},
		{
			label: '性别',
			prop: 'gender',
			minWidth: 60,
			dict: options.gender
		},
		{
			label: '年龄',
			prop: 'age',
			minWidth: 80
		},
		{
			label: '检查所见',
			prop: 'findings',
			showOverflowTooltip: true,
			tooltip: true,
			minWidth: 200
		},
		{
			label: '超声提示',
			prop: 'ultrasoundNote',
			showOverflowTooltip: true,
			tooltip: true,
			minWidth: 200
		},
		{
			label: '就诊科室',
			prop: 'department',
			minWidth: 100
		},
		{
			label: '收费金额',
			prop: 'fee',
			minWidth: 100
		},
		{
			label: '录入医生',
			prop: 'doctor',
			minWidth: 120
		},
		{
			label: '检查日期',
			prop: 'examDate',
			formatter: (row: any) => {
				return row.examDate?.split(' ')[0] || '';
			},
			minWidth: 120
		},
		{
			type: 'op',
			minWidth: 160,
			buttons: ['edit', 'delete']
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '50%',
		// 顶部距离
		top: '2%',
		// 内边距
		padding: '10px 30px 10px 30px'
	},
	items: [
		{
			prop: 'name',
			label: '姓名',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入姓名',
					// 清除按钮
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
			rules: [
				{
					required: true,
					message: '请输入姓名',
					trigger: 'blur'
				}
			],
			col: { span: 8 }
		},
		{
			label: '超声号',
			prop: 'ultrasoundNo',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入超声号',
					clearable: true,
					disabled: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '档案号',
			prop: 'patientNo',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入档案号',
					clearable: true,
					disabled: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '性别',
			prop: 'gender',
			component: {
				name: 'cl-select',
				props: {
					options: options.gender,
					// 严格模式，确保选择器只选择一个值
					checkStrictly: true
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'age',
			label: '年龄',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input'
			},
			// 自动计算年龄的hook
			hook: {
				bind(value, { form }) {
					// 如果有传入的value值，直接返回
					if (value) {
						return value;
					}
					// 如果没有value但有patientSwlInfo的age，返回patientSwlInfo的age
					if (patientSwlInfo.age) {
						return patientSwlInfo.age;
					}
					// 如果都没有，则计算年龄
					if (form.birthDate && form.examDate) {
						//console.log(
						// 	'计算年龄, 出生日期:',
						// 	form.birthDate,
						// 	'就诊日期:',
						// 	form.examDate
						// );
						return handleAgeCalculation(form.examDate, form.birthDate);
					}
					return '';
				}
			},
			col: { span: 8 }
		},
		{
			label: '收费金额',
			prop: 'fee',
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入收费金额',
					min: 0,
					precision: 2,
					controlsPosition: 'right'
				}
			},
			// 使用hook来动态设置默认值
			hook: {
				bind(value, { form }) {
					// 如果表单中已有值，直接返回
					if (value) {
						return value;
					}
					// 否则使用缓存的默认值
					return defaultFeeCache.value;
				}
			},
			col: { span: 8 }
		},
		{
			label: '检查所见',
			prop: 'findings',
			col: { span: 20 },
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 5,
					placeholder: '请输入检查所见',
					clearable: true
				}
			}
		},
		{
			label: '',
			prop: 'findingsBtn',
			col: { span: 4 },
			component: {
				name: 'el-button',
				props: {
					type: 'primary',
					onClick: openRisTemplateSelect
				},
				slots: {
					default: () => '选择'
				}
			}
		},
		{
			label: '超声提示',
			prop: 'ultrasoundNote',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 5,
					placeholder: '请输入超声提示',
					clearable: true
				}
			},
			col: { span: 20 }
		},
		{
			prop: 'department',
			label: '科室',
			value: user.info?.departmentName,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'slot-department'
			},
			col: { span: 8 }
		},
		{
			prop: 'doctor',
			label: '录入医生',
			value: user.info?.name,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'slot-doctor'
			},
			col: { span: 8 }
		},
		{
			label: '检查日期',
			prop: 'examDate',
			required: true,
			value: dayjs().format('YYYY-MM-DD'),
			component: {
				name: 'el-date-picker',
				props: {
					type: 'date',
					placeholder: '请选择检查日期',
					valueFormat: 'YYYY-MM-DD'
				}
			},
			col: { span: 8 }
		},
		{
			label: '图像一',
			prop: 'image1',
			span: 8,
			component: {
				name: 'cl-upload',
				props: {
					isSpace: true,
					size: [80, 80],
					showUpload: true,
					showDelete: true,
					showPreview: true
				}
			},
			hook: {
				bind(value) {
					//console.log('image1 hook bind, 原始value:', value);
					// 使用公共方法处理图片URL
					return formatImageUrl(value);
				},
				submit(value) {
					//console.log('image1 hook submit:', value);
					// 使用公共方法处理图片URL提交
					return cleanImageUrlForSubmit(value);
				}
			}
		},
		{
			label: '图像二',
			prop: 'image2',
			span: 8,
			component: {
				name: 'cl-upload',
				props: {
					isSpace: true,
					size: [80, 80],
					showUpload: true,
					showDelete: true,
					showPreview: true
				}
			},
			hook: {
				bind(value) {
					//console.log('image2 hook bind, 原始value:', value);
					// 使用公共方法处理图片URL
					return formatImageUrl(value);
				},
				submit(value) {
					//console.log('image2 hook submit:', value);
					// 使用公共方法处理图片URL提交
					return cleanImageUrlForSubmit(value);
				}
			}
		},
		{
			label: '图像三',
			prop: 'image3',
			span: 8,
			component: {
				name: 'cl-upload',
				props: {
					isSpace: true,
					size: [80, 80],
					showUpload: true,
					showDelete: true,
					showPreview: true
				}
			},
			hook: {
				bind(value) {
					//console.log('image3 hook bind, 原始value:', value);
					// 使用公共方法处理图片URL
					return formatImageUrl(value);
				},
				submit(value) {
					//console.log('image3 hook submit:', value);
					// 使用公共方法处理图片URL提交
					return cleanImageUrlForSubmit(value);
				}
			}
		}
	],
	async onOpen() {
		// 获取当前用户信息
		const currentUser = user.info;

		// 如果是新增模式
		if (Upsert.value?.mode === 'add') {
			// 1. 如果是从表格选择行新增
			if (Table.value?.selection.length > 0) {
				const selectedRow = Table.value.selection[0];
				if (Upsert.value?.form) {
					// 设置选中行的信息
					Upsert.value.form.name = selectedRow.name;
					Upsert.value.form.patientNo = selectedRow.patientNo;
					Upsert.value.form.gender = selectedRow.gender;
					Upsert.value.form.age = selectedRow.age;
					Upsert.value.form.birthDate = selectedRow.birthDate;
					Upsert.value.form.department = selectedRow.department;
				}
			}
			// 2. 如果是从 patientNo 路由参数跳转来的，且没有选中表格行
			else if (props.patientNo && !Table.value?.selection.length) {
				const patientInfo = await querySwl();
				if (patientInfo && Upsert.value?.form) {
					// 设置患者基本信息
					Upsert.value.form.name = patientInfo.name;
					Upsert.value.form.patientNo = props.patientNo;
					Upsert.value.form.gender = patientInfo.gender;
					Upsert.value.form.age = patientInfo.age;
					Upsert.value.form.birthDate = patientInfo.birthDate;
					// 设置默认科室和医生
					Upsert.value.form.department = currentUser?.departmentName;
				}
			}
			// 3. 普通新增，只设置默认科室和医生
			else {
				if (Upsert.value?.form) {
					Upsert.value.form.department = currentUser?.departmentName;
				}
			}
		}
	},
	onSubmit(data, { next, done, close }) {
		// 确保必要字段存在
		if (!data.patientNo && props.patientNo) {
			data.patientNo = props.patientNo;
		}

		// 继续提交
		next(data)
			.then(() => {
				// 提交成功后刷新列表
				Crud.value?.refresh();
				close();
			})
			.catch(err => {
				console.error('提交失败:', err);
				ElMessage.error('提交失败：' + (err.message || '未知错误'));
				done();
			});
	}
});

const RisTemplate = ref();

function openRisTemplateSelect() {
	RisTemplate.value?.open();
	// 监听选择事件
	RisTemplate.value?.on('select', (row: any) => {
		onSelectTemplate(row);
	});
}

// 选择模板后的回调
function onSelectTemplate(row: any) {
	// 处理选中的数据
	//console.log('Selected template:', row);
	// 直接通过 Upsert.value?.form 访问表单数据
	if (Upsert.value?.form) {
		// 映射数据到表单
		Upsert.value.form.findings = row.examFindings;
		Upsert.value.form.ultrasoundNote = row.examTips;
	}
}

// 患者选择组件
const patientSelect = ref();
// 用于存储当前选中的记录ID
const selectedRecordId = ref<number | string | null>(null);

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
		Upsert.value.form.mobile = row.mobile;
		Upsert.value.form.idCard = row.idCard;
		Upsert.value.form.department = row.department;

		// 计算年龄
		Upsert.value.form.age = handleAgeCalculation(
			Upsert.value.form.visitDate,
			row.birthDate?.split(' ')[0] || ''
		);
		// 复制其他需要的字段
		if (row.height) Upsert.value.form.height = Number(row.height) || 0;
		if (row.weight) Upsert.value.form.weight = Number(row.weight) || 0;
		if (row.bmi) Upsert.value.form.bmi = Number(row.bmi) || 0;
		if (row.outpatientNo) Upsert.value.form.outpatientNo = row.outpatientNo;
		if (row.inpatientNo) Upsert.value.form.inpatientNo = row.inpatientNo;
		if (row.bedNo) Upsert.value.form.bedNo = row.bedNo;

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

		// 其他信息
		if (row.zipCode) Upsert.value.form.zipCode = row.zipCode;
		if (row.telephone) Upsert.value.form.telephone = row.telephone;
		if (row.occupation) Upsert.value.form.occupation = row.occupation;

		// 设置患者ID,排除身份证以及手机号验证
		selectedRecordId.value = row?.id;

		ElMessage.success('已成功选择患者并填充信息');
	}
}

/**
 * 获取默认费用
 * @param key 参数键名
 * @returns 默认费用值
 */
async function getDefaultFee(key: string): Promise<number> {
	try {
		const res = await service.base.sys.param.data({
			key: key
		});
		//console.log('获取默认费用参数:', res);
		// 如果返回的是数字，直接返回；否则尝试转换为数字
		const fee = typeof res === 'number' ? res : parseFloat(res);
		return isNaN(fee) ? 120 : fee; // 如果转换失败，返回默认值120
	} catch (error) {
		console.error('获取默认费用失败:', error);
		return 120; // 出错时返回默认值
	}
}

/**
 * 加载默认费用到缓存
 */
async function loadDefaultFee() {
	try {
		const fee = await getDefaultFee('ultrasoundCost');
		defaultFeeCache.value = fee;
		//console.log('已加载默认费用:', fee);
	} catch (error) {
		console.error('加载默认费用失败:', error);
		// 保持默认值120
	}
}

// 重写年龄计算函数，接收接诊日期和生日参数
const handleAgeCalculation = (examDateStr: string, birthDateStr: string) => {
	// 参数验证
	if (!birthDateStr) return '';

	// 使用就诊日期或当前日期计算
	const examDate = examDateStr ? new Date(examDateStr) : new Date();
	const birthDate = new Date(birthDateStr);

	// 计算两个日期之间的总天数差异
	const timeDiff = examDate.getTime() - birthDate.getTime();

	// 检查日期是否有效
	if (timeDiff < 0) {
		return '出生日期不能晚于就诊日期';
	}

	const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

	// 计算年月日差值 (用于1岁以上的情况)
	let years = examDate.getFullYear() - birthDate.getFullYear();
	let months = examDate.getMonth() - birthDate.getMonth();
	let days = examDate.getDate() - birthDate.getDate();

	// 处理天数为负的情况
	if (days < 0) {
		// 获取上个月的天数
		const lastMonth = new Date(examDate.getFullYear(), examDate.getMonth(), 0);
		days += lastMonth.getDate();
		months -= 1;
	}

	// 处理月份为负的情况
	if (months < 0) {
		months += 12;
		years -= 1;
	}

	// 根据不同年龄段分别显示：
	// 1. 满1岁以上显示"X岁"
	if (years >= 1) {
		return years + '岁';
	}

	// 2. 不满1岁但满1个月以上显示"X月"
	if (months >= 1) {
		return months + '月';
	}

	// 3. 不满1个月但满1周以上显示"X周"
	const weeks = Math.floor(daysDiff / 7);
	if (weeks >= 1) {
		return weeks + '周';
	}

	// 4. 不满1周显示"X天"
	return daysDiff + '天';
};

// 添加表格选择行变化的监听
watch(
	() => Table.value?.selection,
	newSelection => {
		if (newSelection && newSelection.length > 0) {
			//console.log('已选择行:', newSelection);
		}
	},
	{ deep: true }
);
</script>
