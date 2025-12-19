<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search ref="Search" :reset-btn="true" />
			<!-- 导出 -->
			<cl-export-btn :columns="Table?.columns" />
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
			<!-- 添加操作人选择器插槽 -->
			<template #slot-operator="{ scope }">
				<component :is="DoctorSelect" v-model="scope.operator" />
			</template>
		</cl-upsert>
		<!-- 添加 cl-form 组件 -->
		<cl-form ref="PatientSelectForm" />

		<swl-patient-select ref="PatientSelect" @select="onSelectPatient" />
	</cl-crud>
</template>

<script lang="ts" name="swl-family-form" setup>
import { useCrud, useForm, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { usePatient } from '/@/modules/patient';
import { h, ref, onBeforeUnmount, reactive } from 'vue';
import SwlPatientSelect from '../../patient/components/patient-select-mua.vue';
import { useBase } from '../../base';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
const { dict } = useDict();
const { user } = useBase();
const {
	// 医生选择组件
	DoctorSelect,
	// 科室选择组件
	DepartmentSelect
} = usePatient().components;

const { service } = useCool();

// 性别标签映射
const options = reactive({
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	]
});

// 添加一个新的Form实例用于患者选择
const PatientSelectForm = useForm();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: '姓名',
			prop: 'patientName',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入姓名',
					clearable: true,
					onKeyup: event => {
						// 阻止事件冒泡，避免多次触发
						if (event.stopPropagation) {
							event.stopPropagation();
						}

						// 只有在Enter或Tab且输入框有值时才触发选择按钮
						if (
							(event.key === 'Enter' || event.key === 'Tab') &&
							Upsert.value?.form?.patientName?.trim()
						) {
							// 使用setTimeout避免在事件循环中直接打开对话框
							setTimeout(() => {
								openPatientSelect();
							}, 0);
						}
					}
				},
				slots: {
					append: () => {
						return h(
							'el-button',
							{
								type: 'primary',
								onClick: openPatientSelect
							},
							'选择'
						);
					}
				}
			},
			col: { span: 6 }
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
					disabled: true
				}
			},
			col: { span: 6 }
		},
		{
			label: '预约号',
			prop: 'appointmentNo',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入预约号',
					clearable: true,
					disabled: true
				}
			},
			col: { span: 6 }
		},

		{
			label: '性别',
			prop: 'gender',
			value: 1,
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
			label: '年龄',
			prop: 'age',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入年龄'
				}
			},
			col: { span: 6 }
		},
		{
			label: '电话号码',
			prop: 'mobile',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入电话号码',
					min: 0,
					controlsPosition: 'right'
				}
			},
			col: { span: 6 }
		},
		{
			label: '身份证号',
			prop: 'idCard',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入身份证号',
					min: 0,
					controlsPosition: 'right'
				}
			},
			col: { span: 6 }
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
			col: { span: 6 }
		},
		{
			prop: 'doctor',
			label: '医生',
			value: user.info?.name,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'slot-doctor'
			},
			col: { span: 6 }
		},
		{
			label: '预约日期',
			prop: 'appointmentDate',
			col: { span: 6 },
			value: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			component: {
				name: 'el-date-picker',
				props: {
					type: 'date',
					valueFormat: 'YYYY-MM-DD',
					placeholder: '请输入预约日期',
					clearable: true
				}
			}
		},
		{
			label: '时间段',
			prop: 'timeSlot',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请输入时间段',
					clearable: true,
					options: dict.get('appointment_time'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			},
			col: { span: 6 }
		},
		{
			label: '状态',
			prop: 'status',
			value: 0,
			component: {
				name: 'el-radio-group',
				props: {
					placeholder: '请输入预约类型',
					clearable: true
				},
				options: [
					{ label: '未就诊', value: 0 },
					{ label: '已就诊', value: 1 }
				]
			},
			col: { span: 6 }
		},

		{
			label: '就诊类型',
			prop: 'visitType',
			value: 1,
			component: {
				name: 'el-radio-group',
				props: {
					placeholder: '请输入预约类型',
					clearable: true
				},
				options: [
					{ label: 'SWL', value: 1 },
					{ label: '代谢评估', value: 2 },
					{ label: '随访', value: 3 }
				]
			},
			col: { span: 6 }
		},
		{
			label: 'SWL序列',
			prop: 'swlSequence',
			value: 0,
			component: {
				name: 'el-radio-group',
				props: {
					placeholder: '请输入SWL序列',
					clearable: true
				},
				options: [
					{ label: '原序列', value: 0 },
					{ label: '新序列', value: 1 }
				]
			},
			col: { span: 6 }
		},
		{
			label: '结石位置',
			prop: 'stoneLocation',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3,
					placeholder: '请输入结石位置',
					clearable: true
				}
			},
			col: { span: 12 }
		},
		{
			label: '诊疗内容',
			prop: 'treatmentContent',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3,
					placeholder: '请输入诊疗内容',
					clearable: true
				}
			},
			col: { span: 12 }
		},
		{
			prop: 'operator',
			label: '操作人',
			hidden: true,
			value: user.info?.name,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'slot-operator'
			},
			col: { span: 8 }
		}
	],

	// 添加关闭事件处理
	onClose(action, done) {
		// 确保表单数据能够被正确重置
		setTimeout(() => {
			done();
		}, 0);
	},

	// 添加提交事件处理
	onSubmit(data, { next, done, close }) {
		// 调用API提交数据
		next(data)
			.then(() => {
				// 关闭前延迟一下，让表单状态能够正确更新
				setTimeout(() => {
					close();
				}, 0);
			})
			.catch(err => {
				console.error('提交失败', err);
				ElMessage.error('提交失败：' + (err.message || '未知错误'));
				done();
			});
	}
});

// cl-table
const Table = useTable({
	autoHeight: false,

	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' }
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
			label: '碎石号',
			prop: 'swlNo',
			fixed: true, // 固定选择列
			minWidth: 100
		},
		{
			label: '预约号',
			prop: 'appointmentNo',
			fixed: true, // 固定选择列
			minWidth: 100
		},
		{
			label: '姓名',
			prop: 'patientName',
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
			minWidth: 60
		},
		{
			label: '预约日期',
			prop: 'appointmentDate',
			formatter: (row: any) => {
				return row.appointmentDate?.split(' ')[0] || '';
			},
			minWidth: 120
		},
		{
			label: '时间段',
			prop: 'timeSlot',
			showOverflowTooltip: true,
			minWidth: 120
		},
		{
			label: '状态',
			prop: 'status',
			minWidth: 100,
			dict: [
				{ label: '未就诊', value: 0, type: 'danger' },
				{ label: '已就诊', value: 1, type: 'success' }
			]
		},
		{
			label: '就诊类型',
			prop: 'visitType',
			minWidth: 100,
			dict: [
				{ label: 'SWL', value: 1, type: 'success' },
				{ label: '代谢评估', value: 2, type: 'warning' },
				{ label: '随访', value: 3, type: 'info' }
			]
		},
		{
			label: 'SWL序列',
			prop: 'swlSequence',
			minWidth: 100,
			dict: [
				{ label: '原序列', value: 0, type: 'warning' },
				{ label: '新序列', value: 1, type: 'success' }
			]
		},
		{
			label: '结石位置',
			prop: 'stoneLocation',
			showOverflowTooltip: true,
			minWidth: 100
		},
		{
			label: '诊疗内容',
			prop: 'treatmentContent',
			showOverflowTooltip: true,
			minWidth: 150
		},
		{
			label: '电话号码',
			prop: 'mobile',
			minWidth: 120
		},
		{
			label: '身份证号',
			prop: 'idCard',
			minWidth: 180
		},
		{
			label: '科室',
			prop: 'department',
			minWidth: 100
		},
		{
			label: '医生',
			prop: 'doctor',
			minWidth: 100
		},
		{
			label: '操作人',
			prop: 'operator',
			hidden: true,
			minWidth: 100
		},
		{
			type: 'op',
			width: 160,
			buttons: ['edit', 'delete']
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: {
			// 包装原 service 方法，自动注入 swlNo
			...service.appointment.info,
			// 重写 page 方法，根据 patientNo 过滤
			add: data => {
				data.patientNo = Upsert.value.form.patientNo;
				data.swlNo = Upsert.value.form.swlNo;
				data.serialNumber = Upsert.value.form.serialNumber;
				data.patientName = Upsert.value.form.patientName;
				data.gender = Upsert.value.form.gender;
				data.age = Upsert.value.form.age;
				data.mobile = Upsert.value.form.mobile;
				data.idCard = Upsert.value.form.idCard;

				return service.appointment.info.add(data);
			}
		}
	},
	app => {
		app.refresh();
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

const PatientSelect = ref();

function openPatientSelect() {
	// 先清空可能存在的患者选择组件搜索条件
	try {
		if (PatientSelect.value) {
			// 强制关闭再打开，确保组件状态正确
			PatientSelect.value.close();
		}
	} catch (error: any) {
		console.warn('清理患者选择组件出错', error);
		ElMessage.error('清理患者选择组件出错：' + (error.message || '未知错误'));
	}

	// 使用setTimeout延迟打开，确保组件完全清理
	setTimeout(() => {
		const patientName = Upsert.value?.form?.patientName?.trim() || '';

		// 打开选择器
		if (PatientSelect.value) {
			PatientSelect.value.open({
				// 如果姓名不为空，传递给选择器作为查询条件
				keyword: patientName || undefined,
				// 如果有姓名，立即执行搜索
				autoSearch: !!patientName
			});
		}
	}, 50);
}

// 选择病人后的回调
function onSelectPatient(row: any) {
	// 处理选中的数据
	//console.log('Selected patient:', row);

	// 直接通过 Upsert.value?.form 访问表单数据
	if (Upsert.value?.form) {
		try {
			// 映射数据到表单
			Upsert.value.form.patientName = row.name || '';
			Upsert.value.form.patientNo = row.patientNo || '';
			Upsert.value.form.swlNo = row.swlNo || '';
			Upsert.value.form.gender = row.gender ?? 0;
			Upsert.value.form.age = row.age || '';
			Upsert.value.form.mobile = row.mobile || '';
			Upsert.value.form.idCard = row.idCard || '';
		} catch (error: any) {
			console.error('数据映射错误', error);
			ElMessage.error('数据映射错误：' + (error.message || '未知错误'));
		}
	}
}

// cl-search
// 搜索配置
const Search = useSearch({
	items: [
		{
			// 搜索关键字keyword传给后台papg
			prop: 'keyword',
			component: {
				name: 'el-input',
				props: {
					placeholder: '姓名/档案号/碎石号',
					clearable: true,
					// 值改变的时候刷新列表
					onChange(val: string) {
						refresh({
							keyword: val,
							page: 1
						});
					}
				}
			}
		},
		{
			prop: 'appointmentDate',
			//label: '预约日期',
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

// 清理函数，用于组件卸载前清理表单实例
function cleanup() {
	// 清理搜索表单
	if (Search.value) {
		Search.value.reset();
	}

	// 清理患者选择组件
	if (PatientSelect.value) {
		// 使用可选链避免方法不存在的错误
		PatientSelect.value?.close?.();
	}

	// 清理主表单实例
	if (Upsert.value) {
		// 如果upsert打开了，则关闭
		if (Upsert.value.visible) {
			Upsert.value.close();
		}
	}
}

// 组件卸载前执行清理
onBeforeUnmount(() => {
	cleanup();
});
</script>
