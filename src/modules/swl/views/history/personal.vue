<template>
	<div class="personal-history-wrapper">
		<div>
			<p hidden>id: {{ id }}</p>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<div class="personal-history">
			<cl-crud ref="Crud">
				<cl-row>
					<cl-form ref="Form" inner>
						<!-- 添加籍贯省市区插槽 -->
						<template #slot-nativeAddress="{ scope }">
							<component
								:is="ProvinceCitySelect"
								v-model="scope.pca2"
								v-model:province="scope.nativeProvince"
								v-model:city="scope.nativeCity"
								v-model:district="scope.nativeDistrict"
								:mode="Form.value?.mode"
							/>
						</template>
						<!-- 添加现住址省市区插槽 -->
						<template #slot-currentAddress="{ scope }">
							<component
								:is="ProvinceCitySelect"
								v-model="scope.pca1"
								v-model:province="scope.currentProvince"
								v-model:city="scope.currentCity"
								v-model:district="scope.currentDistrict"
								:mode="Form.value?.mode"
							/>
						</template>
						<!-- 添加省市二级联动插槽 -->
						<template #slot-birthplace="{ scope }">
							<component
								:is="ProvinceCitySelect"
								v-model="scope.birthplaceCombined"
								:mode="Form.value?.mode"
							/>
						</template>
						<!-- 添加居住地省市二级联动插槽 -->
						<template #slot-residence="{ scope }">
							<component
								:is="ProvinceCitySelect"
								v-model="scope.residenceCombined"
								:mode="Form.value?.mode"
							/>
						</template>
					</cl-form>
				</cl-row>
				<cl-row>
					<!-- 数据表格 -->
					<cl-table ref="Table" />
				</cl-row>
			</cl-crud>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useTable, useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { onMounted, watch, ref } from 'vue';
import { useBase } from '/@/modules/base';
import { Plugins } from '/#/crud';
import { usePatient } from '/@/modules/patient';
import { ElMessage } from 'element-plus';

const { user } = useBase();
const { ProvinceCitySelect } = usePatient().components;

// 定义 props
const props = defineProps({
	id: {
		type: String,
		required: true
	},
	swlNo: {
		type: String,
		required: true
	},
	serialNumber: {
		type: String,
		required: true
	}
});

// 因为swlNo和serialNumber是在swl的info传递的，所以需要通过props接收
// 定义一个接口来描述 patientSwlInfo 的结构
interface PatientSwlInfo {
	nativeProvince?: string;
	nativeCity?: string;
	currentProvince?: string;
	currentCity?: string;
	[key: string]: any; // 允许其他任何属性
}

// 使用 props
//console.log('swlNo:', props.swlNo);
//console.log('serialNumber:', props.serialNumber);

// 存储患者信息的变量
const patientData = ref<PatientSwlInfo>({});

// 获取患者信息
const fetchPatientInfo = async () => {
	try {
		const data = await service.swl.info.info({ id: props.id });
		patientData.value = data || {};
		//console.log('获取到患者信息:', patientData.value);
	} catch (error) {
		console.error('获取患者信息失败:', error);
	}
};

// 使用 props
//console.log('swlNo:', props.swlNo);
//console.log('serialNumber:', props.serialNumber);

watch(
	() => props.swlNo,
	newValue => {
		//console.log('swlNo changed:', newValue);
	}
);

watch(
	() => props.serialNumber,
	newValue => {
		//console.log('serialNumber changed:', newValue);
	}
);

const { service } = useCool();

// crud
const Crud = useCrud(
	{
		service: {
			// 包装原 service 方法，自动注入 swlNo
			...service.swl.personal,
			page: params => service.swl.personal.page({ ...params, swlNo: props.swlNo }),
			list: data => service.swl.personal.list({ ...data, swlNo: props.swlNo }),
			add: data => {
				data.swlNo = props.swlNo;
				return service.swl.personal.add(data);
			},
			update: data => {
				data.swlNo = props.swlNo;
				return service.swl.personal.update(data);
			},
			// 自定义 info 方法，直接返回行数据，避免再次请求接口
			info: data => {
				return Promise.resolve(data);
			}
		}
	},
	app => {
		app.refresh();
	}
);

// 表格配置
const Table = useTable({
	autoHeight: false,
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' } // 减小内边距也有助于控制行高
	},
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			label: '碎石号',
			prop: 'swlNo',
			width: 150,
			hidden: true
		},
		{
			label: '出生地',
			prop: 'birthplace',
			width: 220
		},
		{
			label: '居住地',
			prop: 'residence',
			width: 220
		},
		{
			label: '起始居住年月',
			prop: 'startResidenceDate',
			width: 250
		},
		{
			label: '录入人工号',
			prop: 'operator',
			width: 120,
			hidden: true
		},
		{
			type: 'op',
			width: 200,
			buttons: [
				{
					label: '编辑',
					type: 'primary',
					onClick({ scope }) {
						// 重置表单，恢复到全新状态
						Form.value?.reset();
						// 使用clear替代open方法
						Form.value?.clear();

						//console.log('编辑行数据:', scope.row); // 添加调试日志

						// 将行数据逐个设置到表单中
						for (const key in scope.row) {
							// 特殊处理日期字段
							if (key === 'startResidenceDate' && scope.row[key]) {
								if (/^\d{4}-\d{2}-\d{2}$/.test(scope.row[key])) {
									Form.value?.setForm(key, scope.row[key]);
								}
								// 如果是包含时间的格式，截取日期部分
								else if (
									scope.row[key].includes('T') ||
									scope.row[key].includes(' ')
								) {
									const dateStr = scope.row[key].split(/[T ]/)[0];
									Form.value?.setForm(key, dateStr);
								}
								// 其他格式尝试直接赋值
								else {
									Form.value?.setForm(key, scope.row[key]);
								}
							}
							// 特殊处理出生地字段，解析分隔符
							else if (key === 'birthplace' && scope.row[key]) {
								// 直接设置原始值给birthplaceCombined
								// 省市选择组件会自动解析分隔符
								Form.value?.setForm('birthplaceCombined', scope.row[key]);

								// 保留原始值以备后续使用
								Form.value?.setForm(key, scope.row[key]);
							}
							// 特殊处理居住地字段，解析分隔符
							else if (key === 'residence' && scope.row[key]) {
								// 直接设置原始值给residenceCombined
								// 省市选择组件会自动解析分隔符
								Form.value?.setForm('residenceCombined', scope.row[key]);

								// 保留原始值以备后续使用
								Form.value?.setForm(key, scope.row[key]);
							}
							// 其他字段直接赋值
							else {
								Form.value?.setForm(key, scope.row[key]);
							}
						}
					}
				},
				'delete'
			]
		}
	]
});

// 彻底重置表单，确保回到新增状态
function completeReset() {
	// 先调用普通重置
	Form.value?.reset();
	// 明确清除id字段
	Form.value?.setForm('id', undefined);
	// 使用clear方法清除表单内容
	Form.value?.clear();
}

// 表单配置
const Form = useForm();

onMounted(async () => {
	// 获取患者信息
	await fetchPatientInfo();

	Form.value?.open(
		{
			title: '新增', // 设置为新增，以区分编辑操作
			width: '800px',
			// 禁用自动聚焦到第一个输入框
			//autofocus: false,
			props: {
				labelPosition: 'top', // 标签在上方，减少水平空间占用
				labelWidth: 'auto', // 自动标签宽度
				inline: true, // 内联表单
				size: 'default', // 表单尺寸小一点，更容易一行显示
				class: 'form-inline-custom' // 添加自定义类名
			},
			// 自定义底部操作按钮
			op: {
				// 默认靠右布局
				justify: 'flex-end',
				// 按钮配置
				buttons: [
					// save 保存按钮
					'save',
					// 自定义重置按钮替代原来的close(取消)按钮
					{
						label: '重置',
						onClick() {
							// 完全重置表单，回到新增状态
							completeReset();
						}
					}
				]
			},
			items: [
				{
					label: '碎石号',
					prop: 'swlNo',
					value: props.swlNo,
					hidden: true,
					component: {
						name: 'el-input'
					}
				},
				{
					label: '出生地',
					prop: 'birthplaceCombined',
					props: {
						labelPosition: 'top'
					},
					component: {
						name: 'slot-birthplace'
					},
					col: { span: 6 }
				},
				{
					label: '居住地',
					prop: 'residenceCombined',
					props: {
						labelPosition: 'top'
					},
					component: {
						name: 'slot-residence'
					},
					col: { span: 6 }
				},
				{
					label: '起始居住年月',
					prop: 'startResidenceDate',
					component: {
						name: 'el-date-picker',
						props: {
							type: 'month',
							format: 'YYYY-MM',
							valueFormat: 'YYYY-MM',
							placeholder: '请选择起始居住年月',
							clearable: true,
							style: 'width: 230px;'
						}
					},
					span: 6
				},
				{
					label: '备注',
					prop: 'remark',
					component: {
						name: 'el-input',
						props: {
							// type: 'textarea',
							// rows: 1,
							placeholder: '请输入备注',
							//style: 'width: 280px; height: 100px; resize: none;'
							style: 'width: 330px;'
						}
					},
					span: 6
				},
				{
					label: '录入人工号',
					prop: 'operator',
					value: user.info?.name,
					hidden: true,
					component: {
						name: 'el-input',
						props: {
							disabled: true,
							readonly: true
						}
					}
				}
			],
			// 需要设置form不聚焦，否则会自动聚焦到第一个输入框
			plugins: [Plugins.Form.setFocus('')],
			on: {
				// 表单加载完成后，设置初始值
				open() {
					// 查询出患者信息，将地址信息赋值给表单
					if (patientData.value && Object.keys(patientData.value).length > 0) {
						// 处理出生地信息
						if (patientData.value.nativeProvince && patientData.value.nativeCity) {
							const birthplaceCombined =
								patientData.value.nativeProvince + patientData.value.nativeCity;
							// 将籍贯省市赋值给出生地省市
							Form.value?.setForm('birthplaceCombined', birthplaceCombined);
						}

						// 处理居住地信息
						if (patientData.value.currentProvince && patientData.value.currentCity) {
							const residenceCombined =
								patientData.value.currentProvince + patientData.value.currentCity;
							// 将现住址省市赋值给居住地省市
							Form.value?.setForm('residenceCombined', residenceCombined);
						}
					}
				},
				submit: (data, { done }) => {
					//console.log('提交的原始数据:', data); // 添加日志查看提交的原始数据

					// 处理出生地字段
					if (data.birthplaceCombined) {
						// birthplaceCombined 已经是省市以"-"分隔的格式
						// 直接赋值给birthplace
						data.birthplace = data.birthplaceCombined;

						//console.log('处理后的出生地:', data.birthplace);

						// 删除临时字段，避免提交到后端
						delete data.birthplaceCombined;
					}

					// 处理居住地字段
					if (data.residenceCombined) {
						// residenceCombined 已经是省市以"-"分隔的格式
						// 直接赋值给residence
						data.residence = data.residenceCombined;

						//console.log('处理后的居住地:', data.residence);

						// 删除临时字段，避免提交到后端
						delete data.residenceCombined;
					}

					//console.log('处理后的提交数据:', data); // 添加日志查看处理后的数据

					// 根据表单是否有ID字段判断是新增还是更新
					if (data.id) {
						// 更新操作
						service.swl.personal
							.update(data)
							.then(() => {
								// 关闭加载状态
								done();
								// 刷新表格
								Crud.value?.refresh();
								// 提交后重置表单
								completeReset();
							})
							.catch(err => {
								console.error('更新失败:', err);
								ElMessage.error('更新失败：' + (err.message || '未知错误'));
								done();
							});
					} else {
						// 新增操作
						// 确保swlNo被正确添加
						data.swlNo = props.swlNo;
						service.swl.personal
							.add(data)
							.then(() => {
								// 关闭加载状态
								done();
								// 刷新表格
								Crud.value?.refresh();
								// 提交后重置表单
								completeReset();
							})
							.catch(err => {
								console.error('添加失败:', err);
								ElMessage.error('添加失败：' + (err.message || '未知错误'));
								done();
							});
					}
				}
			}
		},
		// 需要设置form不聚焦，否则会自动聚焦到第一个输入框
		[Plugins.Form.setFocus(' ')]
	);
});

// const handleAddressExtracted = async (scope: any, addressInfo: any) => {
// 	if (!addressInfo) return;

// 	let updated = false;

// 	// 只有当籍贯省市区字段为空时才自动填充
// 	if (!scope.nativeProvince || scope.nativeProvince === '') {
// 		scope.nativeProvince = addressInfo.province || '';
// 		updated = true;
// 	}

// 	if (!scope.nativeCity || scope.nativeCity === '') {
// 		scope.nativeCity = addressInfo.city || '';
// 		updated = true;
// 	}

// 	if (!scope.nativeDistrict || scope.nativeDistrict === '') {
// 		scope.nativeDistrict = addressInfo.district || '';
// 		updated = true;
// 	}

// 	// 更新省市区级联选择器的值
// 	if (updated) {
// 		// 更新省市区数组
// 		scope.pca2 = [scope.nativeProvince, scope.nativeCity, scope.nativeDistrict].filter(Boolean);

// 		// 确保省市区组件已加载城市和区县数据
// 		try {
// 			if (scope.nativeProvince && !scope.nativeCity) {
// 				// 如果只有省份但没有城市，尝试加载城市数据
// 				const provinces = await service.dict.address.listProvince();
// 				const provinceItem = provinces.find(p => p.name === scope.nativeProvince);

// 				if (provinceItem) {
// 					await service.dict.address.listCity({ id: provinceItem.id });
// 				}
// 			}
// 		} catch (error) {
// 			console.error('加载地址数据失败:', error);
// 		}

// 		ElMessage.success('已自动填充籍贯地址');
// 	}
// };
</script>

<style lang="scss" scoped>
:deep(.form-inline-custom) {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;

	.el-form-item {
		margin-bottom: 15px;

		// 确保所有表单元素垂直对齐
		.el-form-item__content {
			display: flex;
			align-items: center;
		}

		// 修改textarea的内部样式，使其高度与其他输入框一致
		.el-textarea__inner {
			line-height: 1.5;
			padding-top: 8px;
			padding-bottom: 8px;
		}
	}
}

.personal-history {
	width: 1000px;
	height: calc(100vh - 350px); // 考虑到 tab 头部、父容器边距和其他元素的高度
	max-height: 60vh;
	min-height: 300px;
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
	:deep(.cl-crud) {
		height: 100%;
		overflow: hidden auto;
		position: relative;
		box-sizing: border-box;
		background-color: transparent; // 改为透明背景
	}
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
	.personal-history {
		padding: 10px;
		max-height: 55vh;

		.el-form-item {
			.el-input,
			.el-select {
				width: 100%;
			}
		}
	}
}
</style>
