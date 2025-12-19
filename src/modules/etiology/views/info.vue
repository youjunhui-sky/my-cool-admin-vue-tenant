<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<el-button
				type="success"
				:disabled="Table?.selection?.length !== 1"
				@click="handleMultiAppointment"
			>
				预约
			</el-button>
			<cl-flex1 />
			<cl-search ref="Search" :reset-btn="true" />
			<!-- 导出 -->
			<cl-export-btn :columns="Table?.columns" />
		</cl-row>
		<cl-row>
			<cl-table ref="Table">
				<!-- 展开信息 -->
				<template #column-detail="{ scope }">
					<div style="padding: 0 10px">
						<el-descriptions border :column="2" class="etiology-descriptions">
							<el-descriptions-item label="评估结果">
								{{ scope.row.assessmentResult }}
							</el-descriptions-item>
							<el-descriptions-item label="治疗建议">
								{{ scope.row.treatmentSuggestion }}
							</el-descriptions-item>
						</el-descriptions>
					</div>
				</template>
				<!-- <template #column-component="{ scope }">
					<el-link
						type="primary"
						@click="handleComponentClick(scope.row)"
						:underline="false"
					>
						结石成分
					</el-link>
				</template> -->
				<template #column-metabolicAssessment="{ scope }">
					<el-link
						type="primary"
						@click="handleMetabolicClick(scope.row)"
						:underline="false"
					>
						代谢评估
					</el-link>
				</template>
				<template #column-appointmentRecord="{ scope }">
					<el-link
						type="primary"
						@click="handleAppointmentClick(scope.row)"
						:underline="false"
					>
						预约记录
					</el-link>
				</template>
				<template #column-nearRecord="{ scope }">
					<el-link type="primary" @click="handleNearClick(scope.row)" :underline="false">
						近期
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
			<!-- 添加患者选择组件插槽 -->
		</cl-upsert>
		<!-- 添加患者选择组件 -->
		<component
			:is="PatientSelectMua"
			ref="patientSelect"
			@select="onSelectPatientAll"
			:immediate-search="true"
			:remember-search="true"
		/>

		<!-- 预约弹框 -->
		<cl-form ref="AppointmentForm">
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
		</cl-form>

		<!-- 预约记录列表弹框 -->
		<cl-form ref="AppointmentRecordForm">
			<template #slot-appointment-record>
				<el-table :data="appointmentRecords" :style="{ width: '100%' }">
					<el-table-column type="selection" width="50" />
					<el-table-column label="档案号" prop="patientNo" min-width="120" />
					<el-table-column label="碎石号" prop="swlNo" min-width="100" />
					<el-table-column label="预约号" prop="appointmentNo" min-width="100" />
					<el-table-column label="姓名" prop="patientName" min-width="100" />
					<el-table-column
						label="性别"
						prop="gender"
						min-width="60"
						:formatter="
							row => options.gender.find(g => g.value === row.gender)?.label || ''
						"
					/>
					<el-table-column label="年龄" prop="age" min-width="60" />
					<el-table-column
						label="预约日期"
						prop="appointmentDate"
						min-width="120"
						:formatter="
							row => (row.appointmentDate ? row.appointmentDate.split(' ')[0] : '')
						"
					/>
					<el-table-column
						label="时间段"
						prop="timeSlot"
						min-width="120"
						show-overflow-tooltip
					/>
					<el-table-column
						label="状态"
						prop="status"
						min-width="100"
						:formatter="row => (row.status === 1 ? '已就诊' : '未就诊')"
					/>
					<el-table-column
						label="就诊类型"
						prop="visitType"
						min-width="100"
						:formatter="
							row =>
								row.visitType === 1
									? 'SWL'
									: row.visitType === 2
										? '代谢评估'
										: '随访'
						"
					/>
					<el-table-column
						label="SWL序列"
						prop="swlSequence"
						min-width="100"
						:formatter="row => (row.swlSequence === 1 ? '新序列' : '原序列')"
					/>
					<el-table-column
						label="结石位置"
						prop="stoneLocation"
						min-width="120"
						show-overflow-tooltip
					/>
					<el-table-column
						label="诊疗内容"
						prop="treatmentContent"
						min-width="150"
						show-overflow-tooltip
					/>
					<el-table-column label="电话号码" prop="mobile" min-width="120" />
					<el-table-column label="身份证号" prop="idCard" min-width="180" />
					<el-table-column label="科室" prop="department" min-width="100" />
					<el-table-column label="医生" prop="doctor" min-width="100" />
				</el-table>
			</template>
		</cl-form>
		<!-- 预约患者选择组件 -->
		<component
			:is="PatientSelectMua"
			ref="appointmentPatientSelect"
			@select="onSelectAppointmentPatient"
			:immediate-search="true"
			:remember-search="true"
		/>

		<cl-form ref="EtiologyComponentForm">
			<!-- 添加EtiologyComponent组件的插槽 -->
			<template #slot-etiology-info>
				<div class="etiology-info-container">
					<component
						:is="EtiologyComponent"
						:etiologyId="currentEtiologyComponentRow.id || 0"
						:patientNo="currentEtiologyComponentRow.patientNo"
						:swlNo="currentEtiologyComponentRow.swlNo"
						:serialNumber="currentEtiologyComponentRow.serialNumber"
					/>
				</div>
			</template>
		</cl-form>
	</cl-crud>
</template>

<script lang="ts" setup>
import { ref, reactive, h, onMounted, nextTick, watch } from 'vue';
import { useCrud, useSearch, useTable, useUpsert, useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useRouter, useRoute } from 'vue-router';
import { usePatient } from '/@/modules/patient';
import { useBase } from '/@/modules/base';
import { useEtiology } from '/@/modules/etiology';
import { ElMessage } from 'element-plus';
import { useDict } from '/$/dict';
import dayjs from 'dayjs';
// 导入地址绑定修复补丁
import { fixAddressBindHook, fixAddressSubmitHook } from '../../../../patches/fix-address-binding';

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
	PatientSelectMua
} = usePatient().components;

const { EtiologyComponent } = useEtiology().components;

//	添加跳转路由
const router = useRouter();
const route = useRoute();

// 标签映射
const options = reactive({
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	],
	assessmentType: [
		{ label: '简化评估', value: 'mua1', type: 'success' },
		{ label: '全面评估', value: 'mua2', type: 'warning' },
		{ label: '特殊评估', value: 'mua3', type: 'danger' }
	]
});

// 验证状态
const idCardExists = ref(false);
const mobileExists = ref(false);

// 用于存储当前选中的记录ID
const selectedRecordId = ref<number | string | null>(null);

// 存储当前结石成分记录数据
const currentEtiologyComponentRow = reactive({
	id: null,
	patientNo: '',
	swlNo: '',
	name: '',
	serialNumber: '',
	etiologyId: null
});

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 标志位，用于控制是否允许 onChange 触发查询
const allowSearchChange = ref(true);

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
					placeholder: '姓名/档案号/评估号/门诊号/住院号',
					clearable: true,
					// 值改变的时候刷新列表
					onChange(val: string) {
						// 只有在允许的情况下才触发查询
						if (allowSearchChange.value) {
							refresh({
								keyword: val,
								page: 1
							});
						}
					}
				}
			}
		},
		{
			prop: 'assessmentDate',
			//label: '评估日期',
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
		service: service.etiology.info
	},
	app => {
		// 检查是否有 keyword 参数，如果有则延迟刷新，等 keyword 处理完再刷新
		const keyword = route.query.keyword as string;
		if (keyword && keyword.trim() !== '') {
			// 有 keyword 参数，不立即刷新，等 handleKeywordFromRoute 处理
			return;
		}
		// 没有 keyword 参数，正常刷新
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
			width: 40
		},
		// 展开列
		{
			label: '展开',
			type: 'expand',
			prop: 'detail',
			width: 60
		},
		{
			prop: 'id',
			label: 'ID',
			minWidth: 40,
			hidden: true // 隐藏ID列，但数据依然可用
		},
		{
			prop: 'patientId',
			label: '患者ID',
			minWidth: 40,
			hidden: true // 隐藏患者ID列，但数据依然可用
		},
		{
			prop: 'patientNo',
			label: '档案号',
			minWidth: 100
		},
		{
			prop: 'swlNo',
			label: '评估号',
			minWidth: 100
		},
		{
			prop: 'serialNumber',
			label: '流水号',
			minWidth: 100
		},
		{
			prop: 'name',
			label: '姓名',
			minWidth: 80
		},
		{
			prop: 'gender',
			label: '性别',
			minWidth: 60,
			dict: options.gender
		},
		{
			prop: 'age',
			label: '年龄',
			minWidth: 60
		},
		{
			prop: 'assessmentCount',
			label: '次数',
			minWidth: 60
		},
		{
			prop: 'assessmentType',
			label: '类型',
			minWidth: 90,
			dict: options.assessmentType
		},
		{
			prop: 'assessmentDate',
			label: '评估日期',
			minWidth: 100,
			showOverflowTooltip: true,
			formatter: (row: any) => {
				return row.assessmentDate?.split(' ')[0] || '';
			}
		},
		// {
		// 	prop: 'imageDiagnosis',
		// 	label: '影像诊断',
		// 	minWidth: 200,
		// 	showOverflowTooltip: true
		// },
		// {
		// 	prop: 'component',
		// 	label: '结石成分',
		// 	width: 100,
		// 	slot: true
		// },
		{
			label: '代谢评估',
			prop: 'metabolicAssessment',
			width: 100,
			slot: true
		},
		{
			label: '预约记录',
			prop: 'appointmentRecord',
			width: 100,
			slot: true
		},
		{
			label: '随访记录',
			children: [
				{
					label: '近期',
					prop: 'nearRecord',
					width: 60,
					slot: true
				},
				{
					label: '远期',
					prop: 'futureRecord',
					width: 60,
					slot: true
				}
			]
		},

		{
			type: 'op',
			width: 220,
			buttons: [
				'edit',
				'delete'
				// {
				// 	label: '预约',
				// 	type: 'success',
				// 	onClick({ scope }) {
				// 		handleAppointment(scope.row);
				// 	}
				// }
			]
		}
	]
});

// upsert 配置
const Upsert = useUpsert({
	dialog: {
		width: '60%',
		// 顶部距离
		top: '5%',
		// 内边距
		padding: '10px 30px 10px 30px'
	},
	// 打开钩子
	onOpen() {
		//console.log('onOpen触发，模式:', Upsert.value?.mode);

		// 重置选中记录ID
		selectedRecordId.value = null;

		// 重置验证状态
		idCardExists.value = false;
		mobileExists.value = false;

		// 如果是从路由跳转过来的新增操作，不处理选中记录逻辑
		const isAddFromRoute = route.query.action === 'add';
		if (isAddFromRoute) {
			return;
		}

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

			// 判断是否是新增模式，只在新增模式下执行评估次数+1逻辑
			if (Upsert.value?.mode === 'add') {
				// 准备调用info接口
				//console.log('准备调用info接口获取完整信息...');

				// 先获取完整的记录信息，再填充表单
				service.etiology.info
					.info({ id: selectedRow.id })
					.then(res => {
						// 打印服务器返回的完整信息
						//console.log('服务器info接口返回数据:', res);

						// 构建新的表单数据，保留选中记录的信息，评估次数自动+1
						const formData = {
							// 不传递id，确保是新增而不是编辑
							patientNo: res.patientNo,
							swlNo: res.swlNo,
							//流水号不要都新增
							serialNumber: '',
							name: res.name,
							gender: res.gender,
							age: res.age,
							// add时评估类型默认为简化评估
							assessmentType: '简化评估',
							// 评估次数自动+1
							assessmentCount: Number(res.assessmentCount) + 1,
							imageDiagnosis: res.imageDiagnosis,
							birthDate: res.birthDate,
							department: res.department,
							doctor: res.doctor,
							mobile: res.mobile,
							idCard: res.idCard,
							height: Number(res.height),
							weight: Number(res.weight),
							bmi: Number(res.bmi),
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
							// 设置当前日期为评估日期
							assessmentDate: dayjs().format('YYYY-MM-DD'),
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
							// console.log(
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

							// console.log(
							// 	'赋值后的表单数据:',
							// 	JSON.parse(JSON.stringify(Upsert.value.form))
							// );
						} else {
							console.error('Upsert.value.form 不存在，无法赋值');
						}
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
			col: { span: 4 }
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
					// 严格模式，确保选择器只选择一个值
					checkStrictly: true
				}
			},
			col: { span: 4 }
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
					// 只读
					readonly: true,
					// 禁用
					disabled: true
				}
			},
			col: { span: 4 }
		},
		{
			prop: 'swlNo',
			label: '评估号',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入评估号',
					// 只读
					readonly: true,
					// 禁用
					disabled: true
				}
			},
			col: { span: 4 }
		},
		{
			prop: 'assessmentType',
			label: '评估类型',
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-select',
				props: {
					placeholder: '请输入评估类型',
					// 只读
					readonly: true,
					// 禁用
					disabled: true
				},
				options: [
					{
						label: '简化评估',
						value: 'mua1'
					},
					{ label: '全面评估', value: 'mua2' },
					{ label: '特殊评估', value: 'mua3' }
				]
			},
			col: { span: 4 }
		},
		{
			prop: 'assessmentCount',
			label: '评估次数',
			value: 1,
			props: {
				labelPosition: 'top'
			},
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请输入评估次数',
					min: 1,
					max: 100,
					step: 1
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
			prop: 'assessmentDate',
			label: '评估日期',
			props: {
				labelPosition: 'top'
			},
			value: dayjs().format('YYYY-MM-DD'),
			component: {
				name: 'el-date-picker',
				props: {
					type: 'date',
					valueFormat: 'YYYY-MM-DD',
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
						return new Date().toISOString();
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
			col: { span: 4 }
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
					//console.log('计算年龄, 出生日期:', form.birthDate, '就诊日期:', form.visitDate);
					// 调用通用的年龄计算函数
					return handleAgeCalculation(form.visitDate, form.birthDate);
				}
			},
			col: { span: 4 }
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
					hook: {
						bind(value) {
							// 确保返回数字类型
							return value ? Number(value) : null;
						}
					},
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
			col: { span: 4 }
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
					hook: {
						bind(value) {
							// 确保返回数字类型
							return value ? Number(value) : null;
						}
					},
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
			col: { span: 4 }
		},
		{
			prop: 'bmi',
			label: 'BMI指数',
			value: 0,
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
					return handleBMICalculation(Number(form.height), Number(form.weight));
				}
			},
			col: { span: 4 }
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
			col: { span: 4 }
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
			col: { span: 4 }
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
			col: { span: 4 }
		},
		{
			prop: 'occupation',
			label: '职业',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请输入职业',
					tree: true,
					options: dict.get('duty'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			},
			col: { span: 4 }
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
			col: { span: 4 }
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

			// 保存 appointmentNo，用于后续更新预约记录
			// 优先从表单数据中获取，如果没有则从路由参数中获取
			const appointmentNo = data.appointmentNo || (route.query.appointmentNo as string);

			// 继续提交并等待完成
			const result = await next(data);

			// 提交成功，关闭窗口并显示成功消息
			ElMessage.success('保存成功');

			// 如果有 appointmentNo，更新预约记录的 serialNumber
			if (appointmentNo && appointmentNo.trim() !== '') {
				try {
					// 根据 appointmentNo 查找预约记录
					const appointmentList = await service.appointment.info.page({
						page: 1,
						size: 1,
						appointmentNo: appointmentNo
					});

					// 兼容不同返回结构
					const appointmentRecords =
						(appointmentList as any)?.list || (appointmentList as any)?.rows || [];

					if (appointmentRecords.length > 0) {
						const appointmentRecord = appointmentRecords[0];
						// 获取保存后的 serialNumber（优先从返回结果中获取，如果没有则从 data 中获取）
						const serialNumber =
							result?.serialNumber || result?.data?.serialNumber || data.serialNumber;

						if (serialNumber && serialNumber.trim() !== '') {
							// 更新预约记录的 serialNumber
							await service.appointment.info.update({
								id: appointmentRecord.id,
								serialNumber: serialNumber
							});
							console.log(
								'预约记录 serialNumber 已更新:',
								appointmentNo,
								serialNumber
							);
						} else {
							console.warn(
								'serialNumber 为空，无法更新预约记录，appointmentNo:',
								appointmentNo
							);
						}
					} else {
						console.warn('未找到预约记录，appointmentNo:', appointmentNo);
					}
				} catch (updateError: any) {
					console.error('更新预约记录 serialNumber 失败:', updateError);
					// 不阻止主流程，只记录错误
					ElMessage.warning(
						'保存成功，但更新预约记录流水号失败: ' + (updateError.message || '未知错误')
					);
				}
			}

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

// 预约弹框配置
const AppointmentForm = useForm();
// 预约记录列表弹框
const AppointmentRecordForm = useForm();
// 预约记录列表数据
const appointmentRecords = ref<any[]>([]);

// 创建组件引用
const patientSelect = ref();
// 预约患者选择组件引用
const appointmentPatientSelect = ref();
// 结石成分表单
const EtiologyComponentForm = ref();

// 修改openPatientSelectAll函数
function openPatientSelectAll() {
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
function onSelectPatientAll(row: any) {
	// 处理选中的数据
	//console.log('Selected patient:', row);
	// 直接通过 Upsert.value?.form 访问表单数据
	if (Upsert.value?.form) {
		// 映射数据到表单
		Upsert.value.form.name = row.name;
		Upsert.value.form.patientNo = row.patientNo;
		Upsert.value.form.swlNo = row.swlNo;
		Upsert.value.form.serialNumber = '';
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
 * 处理预约记录点击，弹出预约记录列表
 * @param row - 当前代谢评估行数据
 */
const handleAppointmentClick = async (row: any) => {
	try {
		// 调用预约记录分页接口，按档案号和碎石号过滤
		const res = await service.appointment.info.page({
			page: 1,
			size: 50,
			patientNo: row.patientNo,
			swlNo: row.swlNo
		});

		// 兼容不同返回结构
		appointmentRecords.value = (res as any)?.list || (res as any)?.rows || [];
	} catch (error: any) {
		console.error('获取预约记录失败:', error);
		ElMessage.error('获取预约记录失败：' + (error.message || '未知错误'));
		return;
	}

	// 打开预约记录列表弹框
	AppointmentRecordForm.value?.open({
		title: '预约记录',
		width: '80%',
		height: '60vh',
		props: {
			labelWidth: '0px'
		},
		op: {
			hidden: true
		},
		items: [
			{
				component: {
					name: 'slot-appointment-record'
				}
			}
		]
	});
};

// 处理结石成分点击
const handleComponentClick = (row: any) => {
	//console.log('结石成分点击，准备打开弹出框:', row);

	// 保存当前行数据到currentEtiologyComponentRow
	Object.assign(currentEtiologyComponentRow, {
		id: row.id,
		patientNo: row.patientNo,
		swlNo: row.swlNo,
		name: row.name,
		serialNumber: row.serialNumber
	});

	// 使用EtiologyComponentForm打开结石成分弹窗
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

// 处理代谢评估点击
const handleMetabolicClick = (row: any) => {
	// 利用路由跳转
	router.push({
		path: `etiology/mua/info`,
		query: {
			id: row.id,
			swlNo: row.swlNo,
			serialNumber: row.serialNumber,
			patientNo: row.patientNo,
			assessmentCount: row.assessmentCount,
			name: row.name,
			outpatientNo: row.outpatientNo || '',
			inpatientNo: row.inpatientNo || ''
		}
	});
};

// 处理近期点击
const handleNearClick = (row: any) => {
	// 利用路由跳转
	router.push({
		path: `etiology/followup/near`,
		query: {
			id: row.id
		}
	});
};

// 处理远期点击
const handleFutureClick = (row: any) => {
	// 利用路由跳转
	router.push({
		path: `etiology/followup/future`,
		query: {
			id: row.id
		}
	});
};

/**
 * 处理预约按钮点击（仅支持单条记录）
 */
/**
 * 处理预约按钮点击（仅支持单条记录）
 */
const handleMultiAppointment = () => {
	const selection = Table.value?.selection || [];
	if (selection.length === 0) {
		ElMessage.warning('请先选择要预约的记录');
		return;
	}
	if (selection.length > 1) {
		ElMessage.warning('每次只能选择一条记录进行预约');
		return;
	}
	const row = selection[0];

	// 打开预约弹框
	AppointmentForm.value?.open({
		title: '预约',
		width: '60%',
		disabled: false,
		op: {
			hidden: false,
			saveButtonText: '确定',
			closeButtonText: '取消',
			buttons: ['close', 'save']
		},
		items: [
			{
				label: '姓名',
				prop: 'patientName',
				component: {
					name: 'el-input',
					props: {
						placeholder: '请输入姓名',
						clearable: true,
						disabled: true
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
						placeholder: '请输入电话号码'
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
						disabled: true
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
				value: dayjs().format('YYYY-MM-DD'),
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
						clearable: true,
						disabled: true
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
						clearable: true,
						disabled: true
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
		form: {
			patientName: row.name || '',
			patientNo: row.patientNo || '',
			swlNo: row.swlNo || '',
			gender: row.gender ?? 0,
			age: row.age || '',
			mobile: row.mobile || '',
			idCard: row.idCard || '',
			department: row.department || user.info?.departmentName,
			doctor: row.doctor || user.info?.name,
			appointmentDate: dayjs().format('YYYY-MM-DD'),
			status: 0,
			visitType: 2, // 默认为代谢评估
			swlSequence: 0,
			operator: user.info?.name
		},
		on: {
			submit(data, { close }) {
				data.serialNumber = row.serialNumber;
				// 直接调用 appointment service 的 add 方法
				service.appointment.info
					.add(data)
					.then(() => {
						ElMessage.success('预约成功');
						close();
					})
					.catch(err => {
						console.error('提交失败', err);
						ElMessage.error('提交失败：' + (err.message || '未知错误'));
					});
			}
		}
	});
};

/**
 * 打开预约患者选择组件
 */
/**
 * 打开预约患者选择组件
 */
function openAppointmentPatientSelect() {
	try {
		if (appointmentPatientSelect.value) {
			appointmentPatientSelect.value.close();
		}
	} catch (error: any) {
		console.warn('清理预约患者选择组件出错', error);
	}

	setTimeout(() => {
		const patientName = AppointmentForm.value?.form?.patientName?.trim() || '';
		if (appointmentPatientSelect.value) {
			appointmentPatientSelect.value.open({
				keyword: patientName || undefined,
				autoSearch: !!patientName
			});
		}
	}, 50);
}

/**
 * 选择预约患者后的回调
 * @param row - 选中的患者数据
 */
function onSelectAppointmentPatient(row: any) {
	if (AppointmentForm.value?.form) {
		try {
			AppointmentForm.value.form.patientName = row.name || '';
			AppointmentForm.value.form.patientNo = row.patientNo || '';
			AppointmentForm.value.form.swlNo = row.swlNo || '';
			AppointmentForm.value.form.gender = row.gender ?? 0;
			AppointmentForm.value.form.age = row.age || '';
			AppointmentForm.value.form.mobile = row.mobile || '';
			AppointmentForm.value.form.idCard = row.idCard || '';
		} catch (error: any) {
			console.error('数据映射错误', error);
			ElMessage.error('数据映射错误：' + (error.message || '未知错误'));
		}
	}
}

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

/**
 * 处理从预约页面跳转过来的新增操作
 * 当路由参数中包含 action=add 和患者信息时，自动打开新增弹框并填充数据
 */
const handleAddFromRoute = async () => {
	// 检查路由参数
	const action = route.query.action;
	const patientNo = route.query.patientNo as string;
	const swlNo = route.query.swlNo as string;
	const patientName = route.query.patientName as string;

	// 如果是新增操作且有患者信息，打开新增弹框
	if (action === 'add' && (patientNo || swlNo || patientName)) {
		// 确保表格没有选中任何记录，避免打开详情页
		if (Table.value?.selection && Table.value.selection.length > 0) {
			Table.value.clearSelection();
		}

		// 等待一下确保选中状态已清除
		await nextTick();

		// 确保 Upsert 已初始化
		if (!Upsert.value) {
			// 如果 Upsert 还没初始化，等待一下
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		Crud.value?.rowAdd();
		// 等待弹框打开和表单初始化
		await nextTick();
		// 额外等待一段时间，确保表单完全初始化
		setTimeout(async () => {
			// 再次确认是新增模式，避免被其他逻辑改变
			if (Upsert.value?.mode === 'add' && Upsert.value?.form) {
				// 填充患者基本信息
				if (patientNo) {
					Upsert.value.setForm('patientNo', patientNo);
				}
				if (swlNo) {
					Upsert.value.setForm('swlNo', swlNo);
				}
				if (patientName) {
					Upsert.value.setForm('name', patientName);
				}

				// 如果有预约相关信息，填充到表单
				if (route.query.appointmentNo) {
					Upsert.value.setForm('appointmentNo', route.query.appointmentNo);
				}
				if (route.query.doctorName) {
					// 可以根据实际需求填充医生姓名到相应字段
					// Upsert.value.setForm('xxx', route.query.doctorName);
				}

				ElMessage.success('已自动填充患者信息');
			}

			// 清除路由参数，避免刷新页面时重复打开
			router.replace({
				path: route.path,
				query: {}
			});
		}, 500);
	}
};

// 监听路由变化，处理从预约页面跳转过来的新增操作
watch(
	() => route.query.action,
	async action => {
		// if (action === 'add') {
		// 	await nextTick();
		// 	await handleAddFromRoute();
		// }
	},
	{ immediate: true }
);

// 标志位，确保 keyword 处理只执行一次
const keywordProcessed = ref(false);

/**
 * 处理从路由参数中获取 keyword 并填充到搜索框
 */
const handleKeywordFromRoute = async () => {
	// 如果已经处理过，直接返回
	if (keywordProcessed.value) {
		return;
	}

	const keyword = route.query.keyword as string;
	if (keyword && keyword.trim() !== '') {
		keywordProcessed.value = true;

		await nextTick();

		// 等待 Search 组件初始化
		let retryCount = 0;
		while (!Search.value && retryCount < 10) {
			await new Promise(resolve => setTimeout(resolve, 50));
			retryCount++;
		}

		// 设置搜索框的值
		if (Search.value) {
			// 暂时禁用 onChange 触发查询，避免重复查询
			allowSearchChange.value = false;

			// 使用 setForm 方法设置值
			if (typeof Search.value.setForm === 'function') {
				Search.value.setForm('keyword', keyword);
			} else if (Search.value.form) {
				// 如果 setForm 不存在，直接设置 form
				Search.value.form.keyword = keyword;
			}

			// 等待一下确保值已设置
			await nextTick();

			// 重新启用 onChange 触发查询
			allowSearchChange.value = true;

			// 只触发一次查询
			refresh({
				keyword: keyword,
				page: 1
			});
		}

		// 清除路由参数，避免刷新页面时重复查询
		router.replace({
			path: route.path,
			query: {}
		});
	}
};

// 监听路由变化，处理 keyword 参数
// watch(
// 	() => route.query.keyword,
// 	async keyword => {
// 		if (keyword) {
// 			await nextTick();
// 			await handleKeywordFromRoute();
// 		}
// 	},
// 	{ immediate: true }
// );

// 组件挂载时也检查一次
onMounted(async () => {
	await nextTick();
	await handleAddFromRoute();
	await handleKeywordFromRoute();
});
</script>
<style lang="scss" scoped>
/* el-descriptions样式 */
.etiology-descriptions {
	:deep(.el-descriptions__label) {
		text-align: left !important;
		width: 130px !important;
	}

	:deep(.el-descriptions-item__container) {
		text-align: left !important;
	}

	:deep(.el-descriptions-item__content) {
		text-align: left !important;
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
