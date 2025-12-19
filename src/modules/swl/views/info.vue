<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />

			<cl-flex1 />
			<cl-search ref="Search" :reset-btn="true" />
			<!-- 高级搜索 -->
			<!-- <cl-adv-search ref="AdvSearch" /> -->
			<!-- 导出 -->
			<cl-export-btn :columns="Table?.columns" />
		</cl-row>
		<cl-row>
			<cl-table ref="Table">
				<template #column-preOpRecord="{ scope }">
					<el-link type="primary" :underline="false" @click="handlePreOpClick(scope.row)">
						术前病历
					</el-link>
				</template>
				<template #column-treatmentRecord="{ scope }">
					<el-link
						type="primary"
						@click="handleTreatmentClick(scope.row)"
						:underline="false"
					>
						治疗记录
					</el-link>
				</template>
				<template #column-nearRecord="{ scope }">
					<el-link type="primary" @click="handleNearClick(scope.row)" :underline="false">
						近期
					</el-link>
				</template>
				<template #column-curativeRecord="{ scope }">
					<el-link
						type="primary"
						@click="handleCurativeClick(scope.row)"
						:underline="false"
					>
						疗效
					</el-link>
				</template>
				<template #column-futureRecord="{ scope }">
					<el-link
						type="primary"
						@click="handleFutureClick(scope.row)"
						:underline="false"
					>
						远期
					</el-link>
				</template>
				<template #column-vibrationRecord="{ scope }">
					<el-link
						type="primary"
						@click="handleVibrationClick(scope.row)"
						:underline="false"
					>
						排石记录
					</el-link>
				</template>
				<template #column-expulsionFollowupRecord="{ scope }">
					<el-link
						type="primary"
						@click="handleExpulsionFollowupClick(scope.row)"
						:underline="false"
					>
						随访记录
					</el-link>
				</template>
				<template #column-ultrasonographyRecord="{ scope }">
					<el-link
						type="primary"
						@click="handleUltrasonographyClick(scope.row)"
						:underline="false"
					>
						超声报告
					</el-link>
				</template>
				<template #column-etiologyRecord="{ scope }">
					<el-link
						type="primary"
						@click="handleEtiologyClick(scope.row)"
						:underline="false"
					>
						结石成分
					</el-link>
				</template>
			</cl-table>
		</cl-row>
		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>
		<cl-upsert ref="Upsert">
			<!-- 添加科室选择器插槽 -->
			<template #slot-department="{ scope }">
				<component :is="DepartmentSelect" v-model="scope.department" />
			</template>
			<!-- 添加医生选择器插槽 -->
			<template #slot-doctor="{ scope }">
				<component :is="DoctorSelect" v-model="scope.doctor" />
			</template>
			<!-- 添加身份证输入插槽 -->
			<template #slot-idCard="{ scope }">
				<component
					:is="IdCardSelect"
					v-model="scope.idCard"
					:mode="Upsert.value?.mode"
					:recordId="selectedRecordId || scope.patientId"
					@birth-date-extracted="handleBirthDateExtracted(scope, $event)"
					@address-extracted="handleAddressExtracted(scope, $event)"
					@id-card-exists="handleIdCardExists"
				/>
			</template>
			<!-- 添加手机号输入插槽 -->
			<template #slot-mobile="{ scope }">
				<component
					:is="MobileSelect"
					v-model="scope.mobile"
					:mode="Upsert.value?.mode"
					:recordId="selectedRecordId || scope.patientId"
				/>
			</template>
			<!-- 添加籍贯省市区插槽 -->
			<template #slot-nativeAddress="{ scope }">
				<component
					:is="AddressSelect"
					v-model="scope.pca2"
					v-model:province="scope.nativeProvince"
					v-model:city="scope.nativeCity"
					v-model:district="scope.nativeDistrict"
					:mode="Upsert.value?.mode"
				/>
			</template>
			<!-- 添加现住址省市区插槽 -->
			<template #slot-currentAddress="{ scope }">
				<component
					:is="AddressSelect"
					v-model="scope.pca1"
					v-model:province="scope.currentProvince"
					v-model:city="scope.currentCity"
					v-model:district="scope.currentDistrict"
					:mode="Upsert.value?.mode"
				/>
			</template>
		</cl-upsert>
		<!-- 添加 cl-form 组件 -->
		<cl-form ref="PatientSelectForm" />
		<cl-form ref="ExamForm">
			<!-- 添加ExamInfo组件的插槽 -->
			<template #slot-exam-info>
				<div class="exam-info-container">
					<component
						:is="ExamInfo"
						:swlInfoId="currentExamRow.id || 0"
						:patientNo="currentExamRow.patientNo"
						:swlNo="currentExamRow.swlNo"
						:serialNumber="currentExamRow.serialNumber"
					/>
				</div>
			</template>
		</cl-form>

		<cl-form ref="EtiologyComponentForm">
			<!-- 添加EtiologyComponent组件的插槽 -->
			<template #slot-etiology-info>
				<div class="etiology-info-container">
					<component
						:is="EtiologyComponent"
						:swlInfoId="currentEtiologyComponentRow.id || 0"
						:patientNo="currentEtiologyComponentRow.patientNo"
						:swlNo="currentEtiologyComponentRow.swlNo"
						:serialNumber="currentEtiologyComponentRow.serialNumber"
					/>
				</div>
			</template>
		</cl-form>

		<!-- 添加患者选择组件 -->
		<component
			:is="PatientSWLSelect"
			ref="patientSelect"
			@select="onSelectPatient"
			:immediate-search="true"
			:remember-search="true"
		/>
	</cl-crud>
</template>

<script lang="ts" setup>
import { ref, reactive, h } from 'vue';
import { useCrud, useForm, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useRouter } from 'vue-router';
import { usePatient } from '/@/modules/patient';
import { useSwl } from '/@/modules/swl';
import { useEtiology } from '/@/modules/etiology';
import { useBase } from '/@/modules/base';
import { useStore } from '/$/base/store';
import { ElMessage } from 'element-plus';
import { useDict } from '/$/dict';
import dayjs from 'dayjs';
// 导入地址绑定修复补丁
import { fixAddressBindHook, fixAddressSubmitHook } from '../../../../patches/fix-address-binding';

import ExamInfo from '../../exam/views/info.vue';

const { service } = useCool();
const { dict } = useDict();
const { user } = useBase();
const {
	// 医生选择组件
	DoctorSelect,
	// 科室选择组件
	DepartmentSelect,
	// 身份证组件
	IdCardSelect,
	// 手机号组件
	MobileSelect,
	// 地址选择组件
	AddressSelect,
	// 患者选择组件
	PatientSWLSelect
} = usePatient().components;

//const { SwlPatientSelect } = useSwl().components;
const { EtiologyComponent } = useEtiology().components;

// 性别标签映射
const options = reactive({
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	]
});

// 验证状态
const idCardExists = ref(false);
const mobileExists = ref(false);

// 用于存储当前选中的记录ID
const selectedRecordId = ref<number | string | null>(null);

// 存储当前超声报告记录数据
const currentExamRow = reactive({
	id: null,
	patientNo: '',
	swlNo: '',
	name: '',
	serialNumber: '',
	sequenceNo: '',
	episode: ''
});

// 存储当前超声报告记录数据
const currentEtiologyComponentRow = reactive({
	id: null,
	patientNo: '',
	swlNo: '',
	name: '',
	serialNumber: '',
	sequenceNo: '',
	episode: ''
});

// 转成正式SWL
function convertToRealSwl() {
	////console.log('转成正式SWL');
	// 获取选中的记录
	const selection = Table.value?.selection || [];
	//console.log('选中记录数量:', selection.length);
	// 获取选中的行数据
	const selectedRow = selection[0];
	//console.log('选中的行数据:', selectedRow);
	if (selectedRow) {
		if (Number(selectedRow.type) === 1) {
			ElMessage.warning('该记录已经是正式SWL数据');
			return;
		}
		// 调用转换接口
		service.swl.info
			.convertToRealSwlNo({ id: selectedRow.id, swlNo: selectedRow.swlNo })
			.then(res => {
				//console.log('转换结果:', res);
				ElMessage.success('转换成功');
				// 刷新表格
				Crud.value?.refresh();
			});
	} else {
		ElMessage.warning('请先选中要转换的记录');
	}
}

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
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
			prop: 'visitDate',
			//label: '接诊日期',
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

// crud 配置
const Crud = useCrud(
	{
		service: {
			// 包装原 service 方法,分页传type参数
			...service.swl.info,
			page: params => {
				// 如果params中有type参数，则使用它，否则默认使用1
				const type = params.type !== undefined ? params.type : 1;
				//console.log('请求参数:', { ...params, type });
				return service.swl.info.page({ ...params });
			}
		}
	},
	app => {
		// 添加权限调试代码
		//console.log('=== SWL权限调试信息 ===');
		//console.log('service.swl.info._permission:', service.swl.info._permission);
		//console.log('service.swl.info.permission:', service.swl.info.permission);
		//console.log('app.permission:', app.permission);
		//console.log('app.getPermission("add"):', app.getPermission('add'));

		// 检查用户权限列表
		const { menu } = useStore();
		//console.log('用户权限列表:', menu.perms);

		app.refresh();
	}
);

// 表格配置
const Table = useTable({
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' } // 减小内边距也有助于控制行高
	},
	columns: [
		{
			type: 'selection', // 添加多选列
			minWidth: 40
		},
		{
			prop: 'id',
			label: 'ID',
			minWidth: 50,
			hidden: true // 隐藏ID列，但数据依然可用
		},
		{
			prop: 'patientId',
			label: '患者ID',
			minWidth: 50,
			hidden: true // 隐藏患者ID列，但数据依然可用
		},
		{
			prop: 'swlNo',
			label: '碎石号',
			fixed: true, // 固定选择列
			minWidth: 80
		},
		{
			prop: 'serialNumber',
			label: '流水号',
			fixed: true, // 固定选择列
			minWidth: 80
		},
		{
			prop: 'name',
			label: '姓名',
			fixed: true, // 固定选择列
			minWidth: 80
		},
		{
			prop: 'gender',
			label: '性别',
			minWidth: 60,
			dict: options.gender
		},
		{
			prop: 'sequenceNo',
			label: '序列号',
			minWidth: 60
		},
		{
			prop: 'episode',
			label: '期数',
			minWidth: 50
		},
		{
			prop: 'birthDate',
			label: '出生年月',
			minWidth: 100,
			formatter: (row: any) => {
				return row.birthDate?.split(' ')[0] || '';
			}
		},
		{
			prop: 'visitDate',
			label: '就诊日期',
			minWidth: 100,
			showOverflowTooltip: true
		},
		{
			prop: 'preOpRecord',
			label: '术前病历',
			minWidth: 80,
			slot: true
		},
		{
			label: '治疗记录',
			prop: 'treatmentRecord',
			minWidth: 80,
			slot: true
		},
		{
			label: '随访记录',
			children: [
				{
					label: '近期',
					prop: 'nearRecord',
					minWidth: 50,
					slot: true
				},
				{
					label: '疗效',
					prop: 'curativeRecord',
					minWidth: 50,
					slot: true
				},
				{
					label: '远期',
					prop: 'futureRecord',
					minWidth: 50,
					slot: true
				}
			]
		},
		{
			label: '排石记录',
			children: [
				{
					label: '排石记录',
					prop: 'vibrationRecord',
					minWidth: 80,
					slot: true
				},
				{
					label: '随访记录',
					prop: 'expulsionFollowupRecord',
					minWidth: 80,
					slot: true
				}
			]
		},
		{
			label: '超声报告',
			prop: 'ultrasonographyRecord',
			minWidth: 80,
			slot: true
		},
		{
			label: '结石成分',
			prop: 'etiologyRecord',
			minWidth: 80,
			slot: true
		},
		{
			type: 'op',
			minWidth: 160,
			buttons: ['edit', 'delete']
		}
	]
});

// upsert 配置
const Upsert = useUpsert({
	dialog: {
		//顶部距离
		top: '60px',
		width: '1000px',
		//高度
		height: '700px'
	},
	// 打开钩子
	onOpen() {
		//console.log('onOpen触发，模式:', Upsert.value?.mode);

		// 重置选中记录ID
		selectedRecordId.value = null;

		// 重置验证状态
		idCardExists.value = false;
		mobileExists.value = false;

		// 获取选中的表格记录
		const selection = Table.value?.selection || [];
		//console.log('选中记录数量:', selection.length);

		// 判断是否有选中的记录
		if (selection.length > 0) {
			// 获取选中的行数据
			const selectedRow = selection[0];
			//console.log('选中的行数据:', selectedRow);
			//console.log('selectedRow.id:', selectedRow.id);

			// 保存选中记录的ID，用于后续验证排除
			selectedRecordId.value = selectedRow.patientId;

			// 判断是否是新增模式，只在新增模式下执行序列号+1逻辑
			if (Upsert.value?.mode === 'add') {
				// 准备调用info接口
				//console.log('准备调用info接口获取完整信息...');

				// 先获取完整的记录信息，再填充表单
				service.swl.info
					.info({ id: selectedRow.id })
					.then(res => {
						// 打印服务器返回的完整信息
						//console.log('服务器info接口返回数据:', res);

						// 构建新的表单数据，保留选中记录的信息，序列号自动+1
						const formData = {
							// 不传递id，确保是新增而不是编辑
							name: res.name,
							gender: res.gender,
							swlNo: res.swlNo,
							patientNo: res.patientNo,
							// 序列号自动+1
							sequenceNo: parseInt(res.sequenceNo || '0') + 1,
							episode: 1,
							birthDate: res.birthDate,
							age: res.age,
							// 其他需要保留的字段
							department: res.department,
							doctor: res.doctor,
							mobile: res.mobile,
							idCard: res.idCard,
							height: res.height,
							weight: res.weight,
							bmi: res.bmi,
							outpatientNo: res.outpatientNo,
							inpatientNo: res.inpatientNo,
							bedNo: res.bedNo,
							nativeProvince: res.nativeProvince,
							nativeCity: res.nativeCity,
							nativeDistrict: res.nativeDistrict,
							nativeAddress: res.nativeAddress,
							zipCode: res.zipCode,
							currentProvince: res.currentProvince,
							currentCity: res.currentCity,
							currentDistrict: res.currentDistrict,
							currentAddress: res.currentAddress,
							telephone: res.telephone,
							occupation: res.occupation,
							specialCondition: res.specialCondition,
							// 设置当前日期为就诊日期
							visitDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
							// 设置级联选择器需要的数组数据
							pca1: [
								res.currentProvince,
								res.currentCity,
								res.currentDistrict
							].filter(Boolean),
							pca2: [res.nativeProvince, res.nativeCity, res.nativeDistrict].filter(
								Boolean
							)
						};

						// 打印构建的表单数据
						//console.log('构建的表单数据:', formData);

						// 更新表单数据
						if (Upsert.value?.form) {
							//console.log(
							// 	'赋值前的表单数据:',
							// 	JSON.parse(JSON.stringify(Upsert.value.form))
							// );

							// 应用数据到表单
							Object.assign(Upsert.value.form, formData);

							// 确保地址数组已正确设置
							const currentAddressArray = [
								res.currentProvince,
								res.currentCity,
								res.currentDistrict
							].filter(Boolean);

							const nativeAddressArray = [
								res.nativeProvince,
								res.nativeCity,
								res.nativeDistrict
							].filter(Boolean);

							// 强制设置数组数据，确保组件能正确显示
							if (currentAddressArray.length > 0) {
								//console.log('设置现住址数组:', currentAddressArray);
								Upsert.value.form.pca1 = [...currentAddressArray];
							}

							if (nativeAddressArray.length > 0) {
								//console.log('设置籍贯数组:', nativeAddressArray);
								Upsert.value.form.pca2 = [...nativeAddressArray];
							}

							//console.log(
							// 	'赋值后的表单数据:',
							// 	JSON.parse(JSON.stringify(Upsert.value.form))
							// );
						} else {
							console.error('Upsert.value.form 不存在，无法赋值');
						}

						// 调用后端生成流水号，避免并发重复问题
						service.swl.info
							.generateSerialNumber()
							.then(serialNumber => {
								//console.log('获取到的流水号:', serialNumber);
								if (Upsert.value?.form) {
									Upsert.value.form.serialNumber = serialNumber;
									//console.log(
									// 	'设置流水号后的表单:',
									// 	JSON.parse(JSON.stringify(Upsert.value.form))
									// );
								} else {
									console.error('Upsert.value.form 不存在，无法设置流水号');
								}
								// 提示用户
								ElMessage.success('已自动填充选中记录信息并增加序列号');
							})
							.catch(err => {
								console.error('生成流水号失败', err);
								ElMessage.warning('自动填充信息成功，但获取流水号失败');
							});
					})
					.catch(err => {
						console.error('获取完整记录信息失败', err);
						ElMessage.error('获取完整记录信息失败');
					});
			}
		}
	},
	// 表单配置
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
								onClick: openPatientSelect
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
			col: { span: 6 }
		},
		{
			prop: 'gender',
			label: '性别',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'cl-select',
				props: {
					options: options.gender,
					checkStrictly: true
				}
			},
			value: 1,
			col: { span: 2 }
		},
		{
			prop: 'patientNo',
			label: '档案号',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入档案号',
					readonly: true,
					disabled: true
				}
			},
			col: { span: 4 }
		},
		{
			prop: 'swlNo',
			label: '碎石号',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入碎石号',
					readonly: true,
					disabled: true
				}
			},
			col: { span: 4 }
		},
		{
			prop: 'sequenceNo',
			label: '序列号',
			value: 1,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input-number',
				props: {
					// 只读
					readonly: true,
					disabled: true
				}
			},
			col: { span: 4 }
		},
		{
			prop: 'episode',
			label: '期数',
			value: 1,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input-number',
				props: {
					// 只读
					readonly: true,
					disabled: true
				}
			},
			col: { span: 4 }
		},
		{
			prop: 'outpatientNo',
			label: '门诊号',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input'
			},
			col: { span: 4 }
		},
		{
			prop: 'inpatientNo',
			label: '住院号',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input'
			},
			col: { span: 4 }
		},
		{
			prop: 'bedNo',
			label: '病床号',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input'
			},
			col: { span: 4 }
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
			col: { span: 4 }
		},
		{
			prop: 'doctor',
			label: '接诊医生',
			value: user.info?.name,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'slot-doctor'
			},
			col: { span: 4 }
		},
		{
			prop: 'visitDate',
			label: '就诊日期',
			props: {
				labelPosition: 'top'
			},
			value: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			component: {
				name: 'el-date-picker',
				props: {
					type: 'datetime',
					valueFormat: 'YYYY-MM-DD HH:mm:ss',
					onChange(val) {
						// 当就诊日期变化时，立即触发年龄重新计算
						if (Upsert.value?.form) {
							// 直接设置表单中的age值
							Upsert.value.setForm(
								'age',
								handleAgeCalculation(val, Upsert.value.form.birthDate)
							);
						}
					}
				}
			},
			hook: {
				bind(value) {
					if (!value) {
						return dayjs().format('YYYY-MM-DD HH:mm:ss');
					}
					return value;
				}
			},
			col: { span: 4 }
		},
		{
			prop: 'idCard',
			label: '身份证号',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'slot-idCard'
			},
			col: { span: 6 }
		},
		{
			prop: 'birthDate',
			label: '出生日期',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-date-picker',
				props: {
					type: 'date',
					valueFormat: 'YYYY-MM-DD',
					onChange(val) {
						// 当出生日期变化时，立即触发年龄重新计算
						if (Upsert.value?.form) {
							// 直接设置表单中的age值
							Upsert.value.setForm(
								'age',
								handleAgeCalculation(Upsert.value.form.visitDate, val)
							);
						}
					}
				}
			},
			col: { span: 4 }
		},
		{
			prop: 'age',
			label: '年龄',
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
			// 自动计算年龄的hook
			hook: {
				bind(value, { form }) {
					// 如果有传入的value，则直接返回
					if (value) {
						return value;
					}
					// 如果没有传入value，则计算年龄
					if (form.birthDate && form.visitDate) {
						// //console.log(
						// 	'计算年龄, 出生日期:',
						// 	form.birthDate,
						// 	'就诊日期:',
						// 	form.visitDate
						// );
						// 调用通用的年龄计算函数
						return handleAgeCalculation(form.visitDate, form.birthDate);
					}
					return '';
				}
			},
			col: { span: 2 }
		},
		{
			prop: 'mobile',
			label: '手机号码',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'slot-mobile'
			},
			rules: [
				{
					required: false,
					validator: (rule, value, callback) => {
						if (value === '') {
							callback(new Error('手机号不能为空'));
						} else if (!/^1[3456789]\d{9}$/.test(value)) {
							callback(new Error('手机号格式错误'));
						} else {
							callback();
						}
					}
				}
			],
			col: { span: 3 }
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
			value: null,
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
			value: 0.0,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					step: 0.01,
					min: 0,
					precision: 2,
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
			col: { span: 3 }
		},
		{
			label: '籍贯',
			prop: 'pca2',
			props: {
				labelPosition: 'top'
			},
			//【很重要】hook 参数配置
			hook: {
				bind(value, { form }) {
					// 使用修复函数处理籍贯地址
					return fixAddressBindHook(value, { form }, 'native');
				},
				submit(value, { form, prop }) {
					// 使用修复函数处理提交数据
					fixAddressSubmitHook(value, { form, prop }, 'native');
				}
			},
			component: {
				name: 'slot-nativeAddress'
			},
			col: { span: 12 }
		},
		{
			prop: 'nativeAddress',
			label: '籍贯详情',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入籍贯详情'
				}
			},
			col: { span: 12 }
		},
		{
			label: '现住址',
			prop: 'pca1',
			props: {
				labelPosition: 'top'
			},
			hook: {
				bind(value, { form }) {
					// 使用修复函数处理现住址地址
					return fixAddressBindHook(value, { form }, 'current');
				},
				submit(value, { form, prop }) {
					// 使用修复函数处理提交数据
					fixAddressSubmitHook(value, { form, prop }, 'current');
				}
			},
			component: {
				name: 'slot-currentAddress'
			},
			col: { span: 12 }
		},
		{
			prop: 'currentAddress',
			label: '现住址详情',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入现住址详情'
				}
			},
			col: { span: 12 }
		},
		{
			prop: 'zipCode',
			label: '邮编',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入邮编'
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'telephone',
			label: '固定电话',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入固定电话'
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'occupation',
			label: '职业',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请输入职业',
					options: dict.get('duty'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'specialCondition',
			label: '特殊病情/禁忌症',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 1
				}
			},
			col: { span: 24 }
		},
		{
			label: '最初登记日期',
			prop: 'registerDate',
			component: {
				name: 'el-date-picker',
				props: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }
			},
			required: true,
			value: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			hook: {
				bind(value) {
					if (!value) {
						return dayjs().format('YYYY-MM-DD HH:mm:ss');
					}
					return value;
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'serialNumber',
			label: '就诊流水号',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					disabled: true,
					readonly: true
				}
			},
			col: { span: 8 }
		}
	],
	// 提交前验证
	async onSubmit(data, { next, done, close }) {
		//console.log('表单提交前验证');

		try {
			// 只在完全新增模式下检查身份证是否存在
			// 如果是新增模式并且没有关联已存在的患者记录，则阻止提交
			if (Upsert.value?.mode === 'add' && !selectedRecordId.value && idCardExists.value) {
				ElMessage.error('身份证号已存在，无法提交！请检查后重试');
				done();
				return;
			}

			// 如果有身份证重复但是关联了已有病历，则只显示警告
			if (idCardExists.value) {
				ElMessage.warning('身份证号已存在，请确认是否继续提交');
			}

			// 继续提交并等待完成
			await next(data);

			// 提交成功，关闭窗口并显示成功消息
			ElMessage.success('保存成功');

			// 重置选中记录ID
			selectedRecordId.value = null;

			// 关闭表单
			if (typeof close === 'function') {
				close();
			}
		} catch (error: any) {
			// 提交失败，结束加载状态但不关闭窗口
			console.error('提交失败:', error);
			ElMessage.error('提交失败: ' + (error.message || '未知错误'));

			// 检查done是否为函数再调用
			if (typeof done === 'function') {
				done();
			}
		}
	},
	// 关闭钩子
	onClose(action, done) {
		//console.log('表单关闭，触发动作:', action);

		// 重置选中记录ID
		selectedRecordId.value = null;

		// 执行关闭操作
		done();
	}
});

//	添加跳转路由
const router = useRouter();

/**
 * 处理页面点击事件
 * 通过router传递参数
 * 避免url请求过长，导致参数丢失
 * query只传递页面所需要参数
 * 传id是swl.info.info接口,只能接收id
 * 目标页面需要通过id调用接口查询出后端info
 */
// 处理术前病历点击
const handlePreOpClick = (row: any) => {
	// 利用路由跳转，config.ts中定义的SQBLDetail路由
	router.push({
		path: '/swl/sqbl',
		query: {
			id: row.id,
			swlNo: row.swlNo,
			serialNumber: row.serialNumber,
			gender: row.gender
		}
	});
};

// 处理治疗记录点击
const handleTreatmentClick = (row: any) => {
	// 利用路由跳转
	router.push({
		path: '/swl/treatment',
		query: {
			id: row.id,
			swlNo: row.swlNo,
			serialNumber: row.serialNumber
		}
	});
};

// 处理近期点击
const handleNearClick = (row: any) => {
	// 利用路由跳转
	router.push({
		path: '/swl/followup/near',
		query: {
			id: row.id,
			swlNo: row.swlNo,
			serialNumber: row.serialNumber,
			sequenceNo: row.sequenceNo,
			episode: row.episode
		}
	});
};

// 处理疗效点击
const handleCurativeClick = (row: any) => {
	// 利用路由跳转
	router.push({
		path: '/swl/followup/curative',
		query: {
			id: row.id,
			swlNo: row.swlNo,
			serialNumber: row.serialNumber,
			sequenceNo: row.sequenceNo,
			episode: row.episode
		}
	});
};

// 处理远期点击
const handleFutureClick = (row: any) => {
	// 利用路由跳转
	router.push({
		path: '/swl/followup/future',
		query: {
			id: row.id,
			swlNo: row.swlNo,
			serialNumber: row.serialNumber,
			sequenceNo: row.sequenceNo,
			episode: row.episode
		}
	});
};

// 处理排石记录点击
const handleVibrationClick = (row: any) => {
	// 利用路由跳转
	router.push({
		path: `/swl/sqbl/${row.swlNo}`,
		query: {
			id: row.id
		}
	});
};

// 处理排石随访记录点击
const handleExpulsionFollowupClick = (row: any) => {
	// 利用路由跳转
	router.push({
		path: `/swl/sqbl/${row.swlNo}`,
		query: {
			id: row.id
		}
	});
};

// 处理结石成分点击
const handleEtiologyClick = (row: any) => {
	//console.log('结石成分点击，准备打开弹出框:', row);

	// 保存当前行数据到currentEtiologyComponentRow
	Object.assign(currentEtiologyComponentRow, {
		id: row.id,
		patientNo: row.patientNo,
		swlNo: row.swlNo,
		name: row.name,
		serialNumber: row.serialNumber
	});

	// 使用EtiologyComponentInfo打开结石成分弹窗
	EtiologyComponentForm.value?.open({
		title: '结石成分',
		width: '74%', // 设置为更大的宽度
		height: '80vh', // 增加高度利用更多屏幕空间
		props: {
			// 设置为块级布局而非内联
			inline: false,
			// 设置更小的间距
			gutter: 0,
			// 设置标签位置为顶部
			labelPosition: 'top'
		},
		dialog: {
			// 顶部距离
			top: '2%',
			// 允许全屏和关闭
			controls: ['fullscreen', 'close']
		},
		items: [
			{
				// 使用插槽来渲染组件
				component: {
					name: 'slot-etiology-info'
				},
				// 设置跨度为整行
				span: 24
			}
		],
		on: {
			// 弹窗打开后执行自定义样式调整
			opened() {
				// 使用延时以确保DOM已完全渲染
				setTimeout(() => {
					// 查找并强制设置表格宽度
					const tables = document.querySelectorAll('.etiology-info-container .el-table');
					tables.forEach(table => {
						(table as HTMLElement).style.width = '100%';
					});
				}, 200);
			}
		},
		op: {
			hidden: true // 隐藏底部按钮
		}
	});
};

// 处理超声报告点击
const handleUltrasonographyClick = (row: any) => {
	//console.log('超声报告点击，准备打开弹出框:', row);

	// 保存当前行数据到currentExamRow
	Object.assign(currentExamRow, {
		id: row.id,
		patientNo: row.patientNo,
		swlNo: row.swlNo,
		name: row.name,
		serialNumber: row.serialNumber
	});

	// 使用ExamForm打开超声报告弹窗
	ExamForm.value?.open({
		title: '超声报告',
		width: '74%', // 设置为更大的宽度
		height: '80vh', // 增加高度利用更多屏幕空间
		props: {
			// 设置为块级布局而非内联
			inline: false,
			// 设置更小的间距
			gutter: 0,
			// 设置标签位置为顶部
			labelPosition: 'top'
		},
		dialog: {
			// 顶部距离
			top: '2%',
			// 允许全屏和关闭
			controls: ['fullscreen', 'close']
		},
		items: [
			{
				// 使用插槽来渲染ExamInfo组件
				component: {
					name: 'slot-exam-info',
					props: {
						style: {
							width: '100%'
						}
					}
				},
				// 设置跨度为整行
				span: 24
			}
		],
		op: {
			hidden: true // 隐藏底部按钮
		}
	});
};

// 处理身份证提取的生日和地址信息
const handleBirthDateExtracted = (scope: any, birthDate: string) => {
	// 只有当生日字段为空时才自动填充
	if (birthDate && (!scope.birthDate || scope.birthDate === '')) {
		scope.birthDate = birthDate;
		ElMessage.success('已自动填充出生日期');

		// 当出生日期更新后，触发年龄重新计算
		if (Upsert.value?.form) {
			// 手动触发表单更新，以便重新计算年龄
			setTimeout(() => {
				// 设置表单中的age值
				Upsert.value.setForm(
					'age',
					handleAgeCalculation(Upsert.value.form.visitDate, birthDate)
				);
			}, 10);
		}
	}
};

// 重写年龄计算函数，接收接诊日期和生日参数
const handleAgeCalculation = (visitDateStr: string, birthDateStr: string) => {
	// 参数验证
	if (!birthDateStr) return '';

	// 使用就诊日期或当前日期计算
	const visitDate = visitDateStr ? new Date(visitDateStr) : new Date();
	const birthDate = new Date(birthDateStr);

	// 计算两个日期之间的总天数差异
	const timeDiff = visitDate.getTime() - birthDate.getTime();

	// 检查日期是否有效
	if (timeDiff < 0) {
		return '出生日期不能晚于就诊日期';
	}

	const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

	// 计算年月日差值 (用于1岁以上的情况)
	let years = visitDate.getFullYear() - birthDate.getFullYear();
	let months = visitDate.getMonth() - birthDate.getMonth();
	let days = visitDate.getDate() - birthDate.getDate();

	// 处理天数为负的情况
	if (days < 0) {
		// 获取上个月的天数
		const lastMonth = new Date(visitDate.getFullYear(), visitDate.getMonth(), 0);
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

// 处理地址提取
const handleAddressExtracted = async (scope: any, addressInfo: any) => {
	if (!addressInfo) return;

	let updated = false;

	// 只有当籍贯省市区字段为空时才自动填充
	if (!scope.nativeProvince || scope.nativeProvince === '') {
		scope.nativeProvince = addressInfo.province || '';
		updated = true;
	}

	if (!scope.nativeCity || scope.nativeCity === '') {
		scope.nativeCity = addressInfo.city || '';
		updated = true;
	}

	if (!scope.nativeDistrict || scope.nativeDistrict === '') {
		scope.nativeDistrict = addressInfo.district || '';
		updated = true;
	}

	// 更新省市区级联选择器的值
	if (updated) {
		// 更新省市区数组
		scope.pca2 = [scope.nativeProvince, scope.nativeCity, scope.nativeDistrict].filter(Boolean);

		// 确保省市区组件已加载城市和区县数据
		try {
			if (scope.nativeProvince && !scope.nativeCity) {
				// 如果只有省份但没有城市，尝试加载城市数据
				const provinces = await service.dict.address.listProvince();
				const provinceItem = provinces.find(p => p.name === scope.nativeProvince);

				if (provinceItem) {
					await service.dict.address.listCity({ id: provinceItem.id });
				}
			}
		} catch (error) {
			console.error('加载地址数据失败:', error);
		}

		ElMessage.success('已自动填充籍贯地址');
	}
};

// 处理身份证存在事件
const handleIdCardExists = (exists: boolean) => {
	idCardExists.value = exists;
};

// 患者选择组件
const patientSelect = ref();
// 超声报告表单
const ExamForm = ref();
// 结石成分表单
const EtiologyComponentForm = ref();

function openPatientSelect() {
	// 判断当前表单的操作模式,新增才给打开
	if (Upsert.value?.mode === 'add') {
		// 检查是否勾选了患者
		const selection = Table.value?.selection || [];

		// 只有在没有勾选患者的情况下才能打开弹框
		if (selection.length > 0) {
			ElMessage.warning('已勾选患者记录，无需重新选择患者');
			return;
		}

		// 获取当前表单中输入的姓名
		const currentName = Upsert.value?.form?.name || '';
		if (currentName != null && currentName != '') {
			//console.log('准备打开患者选择对话框，传递姓名:', currentName);
			// 打开患者选择组件并传入当前输入的姓名作为搜索条件
			patientSelect.value?.open({
				keyword: currentName,
				autoSearch: true // 添加自动搜索标志
			});
		} else {
			ElMessage.warning('需要先录入姓名');
			return;
		}
	}
}

// 选择病人后的回调
function onSelectPatient(row: any) {
	// 处理选中的数据
	//console.log('Selected patient:', row);
	// 直接通过 Upsert.value?.form 访问表单数据
	if (Upsert.value?.form) {
		// 映射数据到表单
		Upsert.value.form.name = row.name;
		Upsert.value.form.patientNo = row.patientNo;
		Upsert.value.form.swlNo = row.swlNo;
		Upsert.value.form.gender = row.gender;
		Upsert.value.form.birthDate = row.birthDate?.split(' ')[0] || '';
		Upsert.value.form.mobile = row.mobile;
		Upsert.value.form.idCard = row.idCard;

		// 计算年龄
		Upsert.value.form.age = handleAgeCalculation(
			Upsert.value.form.visitDate,
			row.birthDate?.split(' ')[0] || ''
		);
		// 复制其他需要的字段
		if (row.height) Upsert.value.form.height = row.height || 0;
		if (row.weight) Upsert.value.form.weight = row.weight || 0;
		if (row.bmi) Upsert.value.form.bmi = row.bmi || 0;
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
</script>

<style lang="scss" scoped>
// 确保ExamInfo组件填充可用空间
.exam-info-container {
	width: 100%;
	height: 100%;
	overflow: auto;

	// 移除不必要的内边距
	:deep(.el-form-item) {
		margin-bottom: 0;
		padding: 0;
	}

	// 确保组件宽度100%
	:deep(.component-container) {
		width: 100%;
	}
}

// 确保结石成分组件填充可用空间
.etiology-info-container {
	width: 100% !important;
	height: 100% !important;
	overflow: auto;
	display: flex;
	flex-direction: column;

	// 移除不必要的内边距
	:deep(.el-form-item) {
		margin-bottom: 0;
		padding: 0;
	}

	// 确保组件宽度100%
	:deep(.component-container) {
		width: 100% !important;
		flex: 1;
	}

	// 确保表格能够填满容器宽度
	:deep(.el-table) {
		width: 100% !important;
		table-layout: fixed;
	}

	// 确保所有子元素也填满宽度
	> * {
		width: 100% !important;
	}

	// 确保所有表格相关元素填满宽度
	:deep(.el-table__header),
	:deep(.el-table__body),
	:deep(.el-table__footer) {
		width: 100% !important;
	}
}
</style>

<!-- 添加 cl-form 组件 -->
<cl-form ref="ExamForm" />
