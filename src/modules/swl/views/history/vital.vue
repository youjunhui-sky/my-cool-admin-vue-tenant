<template>
	<div class="vital-history-wrapper">
		<div>
			<p hidden>id: {{ id }}</p>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<div class="scroll-container">
			<cl-row>
				<cl-form ref="Form" inner>
					<!-- 体温输入框插槽 -->
					<template #slot-temperature="{ scope }">
						<div class="temperature-input">
							<el-input
								v-model="scope.temperature.intPart"
								class="int-part"
								placeholder="整数"
								type="number"
								:min="34"
								:max="42"
								@change="
									val => {
										//console.log('体温整数部分更新：', scope.temperature);
										// 确保直接更新Form实例的值
										if (Form.value?.form) {
											const intPart = scope.temperature.intPart || '0';
											const decPart = scope.temperature.decPart || '0';
											const tempValue = parseFloat(`${intPart}.${decPart}`);
											// 使用setForm方法直接更新Form实例的temperature值
											Form.value.setForm('temperature', tempValue);
											//console.log('直接更新Form体温值:', tempValue);
										}
									}
								"
							/>
							<span class="separator">.</span>
							<el-input
								v-model="scope.temperature.decPart"
								class="dec-part"
								placeholder="小数"
								type="number"
								:min="0"
								:max="9"
								@change="
									val => {
										//console.log('体温小数部分更新：', scope.temperature);
										// 确保直接更新Form实例的值
										if (Form.value?.form) {
											const intPart = scope.temperature.intPart || '0';
											const decPart = scope.temperature.decPart || '0';
											const tempValue = parseFloat(`${intPart}.${decPart}`);
											// 使用setForm方法直接更新Form实例的temperature值
											Form.value.setForm('temperature', tempValue);
											//console.log('直接更新Form体温值:', tempValue);
										}
									}
								"
							/>
							<span class="unit">℃</span>
						</div>
					</template>

					<!-- 血压输入框插槽 -->
					<template #slot-bloodPressure="{ scope }">
						<div class="blood-pressure-input">
							<el-input
								v-model="scope.bloodPressure.systolic"
								class="systolic-part"
								placeholder="收缩压"
								type="number"
								:min="60"
								:max="220"
								@change="
									val => {
										//console.log('血压收缩压更新：', scope.bloodPressure);
										// 确保直接更新Form实例的值
										if (Form.value?.form) {
											const systolic = scope.bloodPressure.systolic || '0';
											const diastolic = scope.bloodPressure.diastolic || '0';
											const bpValue = `${systolic}/${diastolic}`;
											// 使用setForm方法直接更新Form实例的bloodPressure值
											Form.value.setForm('bloodPressure', bpValue);
											//console.log('直接更新Form血压值:', bpValue);
										}
									}
								"
							/>
							<span class="separator">/</span>
							<el-input
								v-model="scope.bloodPressure.diastolic"
								class="diastolic-part"
								placeholder="舒张压"
								type="number"
								:min="40"
								:max="140"
								@change="
									val => {
										//console.log('血压舒张压更新：', scope.bloodPressure);
										// 确保直接更新Form实例的值
										if (Form.value?.form) {
											const systolic = scope.bloodPressure.systolic || '0';
											const diastolic = scope.bloodPressure.diastolic || '0';
											const bpValue = `${systolic}/${diastolic}`;
											// 使用setForm方法直接更新Form实例的bloodPressure值
											Form.value.setForm('bloodPressure', bpValue);
											//console.log('直接更新Form血压值:', bpValue);
										}
									}
								"
							/>
							<span class="unit">mmHg</span>
						</div>
					</template>

					<!-- 呼吸频率输入框插槽 -->
					<template #slot-respiratory="{ scope }">
						<div class="input-with-unit">
							<el-input-number
								v-model="scope.respiratoryRate"
								class="value-part"
								placeholder="请输入频率"
								:step="1"
								:min="8"
								:max="40"
								:precision="0"
								controls-position="right"
							/>
							<span class="unit">次/分</span>
						</div>
					</template>

					<!-- 脉搏输入框插槽 -->
					<template #slot-pulse="{ scope }">
						<div class="input-with-unit">
							<el-input-number
								v-model="scope.pulse"
								class="value-part"
								placeholder="请输入脉搏"
								:step="1"
								:min="40"
								:max="200"
								:precision="0"
								controls-position="right"
							/>
							<span class="unit">次/分</span>
						</div>
					</template>

					<!-- 身高输入框插槽 -->
					<template #slot-height="{ scope }">
						<div class="input-with-unit">
							<el-input-number
								v-model="scope.height"
								class="value-part"
								placeholder="请输入身高"
								:step="0.1"
								:min="0"
								:precision="1"
								controls-position="right"
								@change="
									val => {
										//console.log('身高更新为: ', val);
										// 更新BMI值 - 直接使用scope对象
										//console.log('当前表单数据:', scope);
										// 使用scope直接计算BMI
										const bmiValue = handleBMICalculation(
											Number(val),
											Number(scope.weight)
										);
										// 先更新scope.bmi
										scope.bmi = bmiValue;
										// 再尝试更新form.bmi (如果Form.value?.form存在)
										if (Form.value?.form) {
											Form.value.setForm('bmi', bmiValue);
										}
									}
								"
							/>
							<span class="unit">cm</span>
						</div>
					</template>

					<!-- 体重输入框插槽 -->
					<template #slot-weight="{ scope }">
						<div class="input-with-unit">
							<el-input-number
								v-model="scope.weight"
								class="value-part"
								placeholder="请输入体重"
								:step="0.1"
								:min="0"
								:precision="1"
								controls-position="right"
								@change="
									val => {
										//console.log('体重更新为: ', val);
										// 更新BMI值 - 直接使用scope对象
										//console.log('当前表单数据:', scope);
										// 使用scope直接计算BMI
										const bmiValue = handleBMICalculation(
											Number(scope.height),
											Number(val)
										);
										// 先更新scope.bmi
										scope.bmi = bmiValue;
										// 再尝试更新form.bmi (如果Form.value?.form存在)
										if (Form.value?.form) {
											Form.value.setForm('bmi', bmiValue);
										}
									}
								"
							/>
							<span class="unit">kg</span>
						</div>
					</template>
				</cl-form>
			</cl-row>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useBase } from '/@/modules/base';
import { Plugins } from '/#/crud';

const Form = useForm();
const cool = useCool();
const { dict } = useDict();
const { user } = useBase();
const { service } = useCool();

// 定义 props
const props = defineProps({
	id: {
		type: Number,
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

// 根据碎石号查询查询体征信息
const vitalId = ref(0);

// BMI计算函数，接收身高和体重参数
const handleBMICalculation = (
	height: number | string | null | undefined,
	weight: number | string | null | undefined
) => {
	// 转换参数为数字类型
	const numHeight = Number(height);
	const numWeight = Number(weight);

	// 参数验证
	if (isNaN(numHeight) || isNaN(numWeight) || numHeight <= 0 || numWeight <= 0) {
		//console.log('BMI计算参数无效:', { height, weight, numHeight, numWeight });
		return null;
	}

	// 计算BMI: 体重(kg) / 身高(m)的平方
	// 将身高从厘米转换为米
	const heightInMeters = numHeight / 100;
	const bmi = numWeight / (heightInMeters * heightInMeters);

	// 打印计算过程便于调试
	//console.log(`BMI计算过程: ${numWeight}kg / (${heightInMeters}m)² = ${bmi.toFixed(2)}`);

	// 返回保留两位小数的BMI值
	return bmi.toFixed(2);
};

// const initForm = async () => {
// 	try {
// 		//console.log('获取体征数据swlNo:' + props.swlNo);
// 		//console.log('获取体征数据serialNumber:' + props.serialNumber);

// 		const params = { swlNo: props.swlNo, serialNumber: props.serialNumber };
// 		//const data = await cool.service.swl.vital.findBySwlNo(params);
// 		// //console.log('获取体征数据data:' + JSON.stringify(data));
// 		// Form.value.setForm(Form.value.model, data);
// 	} catch (error) {
// 		console.error('Failed to load data:', error);
// 	}
// };

onMounted(async () => {
	//console.log('获取体征数据swlNo:' + props.swlNo);
	//console.log('获取体征数据serialNumber:' + props.serialNumber);

	const params = { swlNo: props.swlNo, serialNumber: props.serialNumber };

	try {
		// 尝试获取体征记录
		const data: any = await service.swl.vital.list(params);
		//console.log('获取体征数据返回:', data);

		// 检查是否有数据返回
		let vitalData: any = null;
		let isNewRecord = false;

		// 判断是否有数据，同时处理数组和对象两种情况
		if (Array.isArray(data)) {
			// 是数组则取第一条
			if (data.length > 0) {
				vitalData = data[0];
				vitalId.value = vitalData.id || 0;
			} else {
				// 空数组，标记为新记录
				isNewRecord = true;
			}
		} else if (data && typeof data === 'object') {
			// 是单个对象
			if ('id' in data) {
				vitalData = data;
				vitalId.value = data.id || 0;
			} else {
				// 空对象或没有id，标记为新记录
				isNewRecord = true;
			}
		} else {
			// 其他情况（null、undefined等），标记为新记录
			isNewRecord = true;
		}

		// 如果是新记录，需要创建基础数据结构并从患者基本信息获取数据
		if (isNewRecord) {
			//console.log('未找到体征记录，将从患者基本信息获取身高体重数据');

			// 创建基础数据结构
			vitalData = {
				swlNo: props.swlNo,
				serialNumber: props.serialNumber,
				operator: user.info?.name
			};

			try {
				// 尝试从患者基本信息中获取身高体重数据
				const patientInfo = await service.swl.info.info({ id: props.id });
				//console.log('获取患者基本信息:', patientInfo);

				if (patientInfo) {
					// 将身高、体重、BMI赋值给vitalData
					vitalData.height = patientInfo.height;
					vitalData.weight = patientInfo.weight;
					vitalData.bmi = patientInfo.bmi;

					//console.log('从患者信息获取到的数据:', {
					// 	height: vitalData.height,
					// 	weight: vitalData.weight,
					// 	bmi: vitalData.bmi
					// });
				}
			} catch (infoError) {
				console.error('获取患者基本信息失败:', infoError);
			}
		}

		// 获取SWL登记时的身高、体重、BMI给form赋值
		if (vitalData) {
			Form.value?.setForm('height', vitalData.height);
			Form.value?.setForm('weight', vitalData.weight);
			Form.value?.setForm('bmi', vitalData.bmi);
			//console.log('设置表单数据:', vitalData);
		}

		// 设置ID值
		vitalId.value = isNewRecord ? 0 : vitalData?.id || 0;

		// 初始化表单
		if (Form.value) {
			Form.value.open(
				{
					title: isNewRecord ? '体征信息(新录入)' : '体征信息(已有记录)',
					form: vitalData || {
						swlNo: props.swlNo,
						serialNumber: props.serialNumber
					},
					items: [
						{
							label: 'id',
							prop: 'id',
							props: {
								labelPosition: 'top'
							},
							span: 6,
							hidden: true,
							component: {
								name: 'el-input',
								props: {
									placeholder: '请输入id',
									clearable: true,
									disabled: true // 禁用输入框
								}
							}
						},
						{
							label: '碎石号',
							prop: 'swlNo',
							props: {
								labelPosition: 'top'
							},
							span: 6,
							hidden: true,
							component: {
								name: 'el-input',
								props: {
									placeholder: '请输入碎石号',
									clearable: true,
									disabled: true
								}
							}
						},
						{
							label: '流水号',
							prop: 'serialNumber',
							props: {
								labelPosition: 'top'
							},
							span: 6,
							hidden: true,
							component: {
								name: 'el-input',
								props: {
									placeholder: '请输入流水号',
									clearable: true,
									disabled: true
								}
							}
						},
						{
							label: '体温(T)',
							prop: 'temperature',
							span: 6,
							// 使用hook处理数据的拆分和合并
							hook: {
								bind(value) {
									// 读取时拆分为整数和小数部分
									//console.log('体温bind前: 原始值=', value, typeof value);
									if (!value) {
										//console.log('体温bind: 值为空，返回空对象');
										return { intPart: '', decPart: '' };
									}
									const parts = String(value).split('.');
									const result = {
										intPart: parts[0] || '',
										decPart: parts[1] || ''
									};
									//console.log('体温bind后: ', value, ' -> ', result);
									return result;
								},
								submit(value, { form, prop }) {
									// 提交时合并整数和小数部分
									//console.log('体温submit前: ', value, typeof value);
									if (value && (value.intPart || value.decPart)) {
										const intPart = value.intPart || '0';
										const decPart = value.decPart || '0';
										form[prop] = parseFloat(`${intPart}.${decPart}`);
										//console.log(
										// 	'体温submit后: form[prop]=',
										// 	form[prop],
										// 	'form=',
										// 	form
										// );
									} else {
										form[prop] = null;
										//console.log('体温submit为null, form=', form);
									}
								}
							},
							component: {
								name: 'slot-temperature'
							}
						},
						{
							label: '呼吸频率(RR)',
							prop: 'respiratoryRate',
							span: 6,
							component: {
								name: 'slot-respiratory'
							}
						},
						{
							label: '血压(BP)',
							prop: 'bloodPressure',
							span: 6,
							// 使用hook处理数据的拆分和合并
							hook: {
								bind(value) {
									// 读取时拆分为收缩压和舒张压
									//console.log('血压bind前: 原始值=', value, typeof value);
									if (!value) {
										//console.log('血压bind: 值为空，返回空对象');
										return { systolic: '', diastolic: '' };
									}
									const parts = String(value).split('/');
									const result = {
										systolic: parts[0] || '',
										diastolic: parts[1] || ''
									};
									//console.log('血压bind后: ', value, ' -> ', result);
									return result;
								},
								submit(value, { form, prop }) {
									// 提交时合并收缩压和舒张压
									//console.log('血压submit前: ', value, typeof value);
									if (value && (value.systolic || value.diastolic)) {
										const systolic = value.systolic || '0';
										const diastolic = value.diastolic || '0';
										form[prop] = `${systolic}/${diastolic}`;
										// //console.log(
										// 	'血压submit后: form[prop]=',
										// 	form[prop],
										// 	'form=',
										// 	form
										// );
									} else {
										form[prop] = null;
										//console.log('血压submit为null, form=', form);
									}
								}
							},
							component: {
								name: 'slot-bloodPressure'
							}
						},
						{
							label: '脉搏(P)',
							prop: 'pulse',
							span: 6,
							component: {
								name: 'slot-pulse'
							}
						},
						{
							label: '身高(H)',
							prop: 'height',
							span: 6,
							component: {
								name: 'slot-height'
							}
						},
						{
							label: '体重(W)',
							prop: 'weight',
							span: 6,
							component: {
								name: 'slot-weight'
							}
						},
						{
							label: 'BMI指数',
							prop: 'bmi',
							span: 8,
							component: {
								name: 'el-input',
								props: {
									placeholder: 'BMI指数',
									style: 'width: 180px;',
									readonly: true,
									disabled: true
								}
							},
							// 自动计算BMI的hook
							hook: {
								bind(value, { form }) {
									// //console.log('BMI绑定 - 当前值:', value);
									// //console.log(
									// 	'BMI绑定 - 身高:',
									// 	form.height,
									// 	'体重:',
									// 	form.weight
									// );

									// 如果已经有值且身高体重没有变化，保留原值
									if (value && !isNaN(Number(value))) {
										return value;
									}

									// 调用通用的BMI计算函数
									return handleBMICalculation(form.height, form.weight);
								}
							}
						},
						{
							label: '腹部压痛点',
							prop: 'abdominalTenderness',
							span: 6,
							component: {
								name: 'cl-select',
								props: {
									placeholder: '请选择腹部压痛点',
									clearable: true,
									filterable: true,
									allowCreate: true,
									reserveKeyword: true,
									automaticDropdown: false,
									options: dict.get('body_abdomenache'),
									labelKey: 'name',
									valueKey: 'name',
									style: 'width: 180px;'
								}
							}
						},
						{
							label: '位置描述',
							prop: 'location',
							span: 6,
							component: {
								name: 'cl-select',
								props: {
									placeholder: '请选择腹部压痛点',
									clearable: true,
									filterable: true,
									allowCreate: true,
									reserveKeyword: true,
									automaticDropdown: false,
									options: dict.get('body_abdomenoisition'),
									labelKey: 'name',
									valueKey: 'name',
									style: 'width: 180px;'
								}
							}
						},
						{
							label: '肾区叩击痛',
							prop: 'renalAreaKnockingPain',
							span: 6,
							value: '无',
							component: {
								name: 'cl-select',
								props: {
									placeholder: '请选择肾区叩击痛',
									clearable: true,
									filterable: true,
									allowCreate: true,
									reserveKeyword: true,
									automaticDropdown: false,
									options: dict.get('body_kidneyache'),
									labelKey: 'name',
									valueKey: 'name',
									style: 'width: 180px;'
								}
							}
						},
						{
							label: '程度',
							prop: 'painIntensity',
							span: 6,
							component: {
								name: 'cl-select',
								props: {
									placeholder: '请选择程度',
									clearable: true,
									filterable: true,
									allowCreate: true,
									reserveKeyword: true,
									automaticDropdown: false,
									options: dict.get('body_kidneydegree'),
									labelKey: 'name',
									valueKey: 'name',
									style: 'width: 180px;'
								}
							}
						},
						{
							label: '其他体征',
							prop: 'otherSigns',
							span: 24,
							component: {
								name: 'el-input',
								props: {
									type: 'textarea',
									rows: 1,
									placeholder: '请输入其他体征',
									style: 'width: 960px; resize: none;'
								}
							}
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
					op: {
						// 设置操作按钮配置
						buttons: [
							'save', //保存
							// 自定义删除按钮，仅在 vitalId > 0 时显示
							{
								label: '删除',
								type: 'danger', // 设置为红色危险按钮
								hidden: vitalId.value <= 0, // 当 vitalId 不存在时隐藏
								onClick: async () => {
									try {
										// 确认对话框
										const confirmed = await ElMessageBox.confirm(
											'确定要删除这条记录吗？',
											'警告',
											{
												confirmButtonText: '确定',
												cancelButtonText: '取消',
												type: 'warning'
											}
										);

										if (confirmed === 'confirm') {
											// 执行删除操作
											await service.swl.vital.deleteById({
												id: vitalId.value
											});
											ElMessage.success('删除成功');

											// 清空表单 - 简化处理方式
											if (Form.value?.form) {
												// 重置关键字段，保留碎石号和流水号
												Form.value.setForm('swlNo', props.swlNo);
												Form.value.setForm(
													'serialNumber',
													props.serialNumber
												);

												// 为特殊组件提供初始对象结构
												Form.value.setForm('temperature', {
													intPart: '',
													decPart: ''
												});
												Form.value.setForm('bloodPressure', {
													systolic: '',
													diastolic: ''
												});

												// 清空其他数值字段
												Form.value.setForm('respiratoryRate', null);
												Form.value.setForm('pulse', null);
												Form.value.setForm('height', null);
												Form.value.setForm('weight', null);
												Form.value.setForm('bmi', null);
												Form.value.setForm('abdominalTenderness', null);
												Form.value.setForm('location', null);
												Form.value.setForm('renalAreaKnockingPain', null);
												Form.value.setForm('painIntensity', null);
												Form.value.setForm('otherSigns', null);
											}

											// 重置ID
											vitalId.value = 0;
										}
									} catch (error: any) {
										console.error('删除失败:', error);
										ElMessage.error(
											'删除失败：' + (error.message || '未知错误')
										);
									}
								}
							}
						]
					},
					on: {
						submit: async (data, { done }) => {
							//console.log('Form submitted:', data);
							//console.log('原始表单数据结构:', JSON.stringify(data, null, 2)); // 添加详细日志

							// 检查Form对象是否存在及是否存在对应字段
							//console.log('Form实例状态:', Form.value?.form ? '存在' : '不存在');
							if (Form.value?.form) {
								//console.log('Form中的体温数据:', Form.value.form.temperature);
								//console.log('Form中的血压数据:', Form.value.form.bloodPressure);
							}

							// 表单提交
							handleFormSubmit(data, done);
						}
					}
				},
				// 需要设置form不聚焦，否则会自动聚焦到第一个输入框
				[Plugins.Form.setFocus(' ')]
			);
		} else {
			console.error('Form实例未定义');
		}
	} catch (error) {
		console.error('初始化体征表单失败:', error);
		ElMessage.error('加载体征数据失败：' + ((error as Error).message || '未知错误'));
	}
});

// 表单提交处理函数
async function handleFormSubmit(data, done) {
	//console.log('提交前原始表单数据:', JSON.stringify(data));

	// BMI计算逻辑 - 如果有身高和体重就重新计算
	if (data.height && data.weight) {
		const orgBmi = data.bmi;
		data.bmi = handleBMICalculation(data.height, data.weight);
		// //console.log(
		// 	`提交前更新BMI: 原BMI=${orgBmi}, 身高=${data.height}, 体重=${data.weight}, 结果=${data.bmi}`
		// );
	}

	// 处理温度和血压字段，确保它们的值在提交前已经是最终格式
	// 这里使用三个函数来获取数据：
	// 1. 优先从Form实例获取
	// 2. 如果Form实例没有，从data对象获取
	// 3. 如果都没有，返回null

	// 处理体温数据
	const getTemperature = () => {
		// 首先尝试从Form实例获取直接设置的值
		if (
			Form.value?.form?.temperature !== undefined &&
			typeof Form.value.form.temperature !== 'object'
		) {
			const temp = Form.value.form.temperature;
			//console.log(`从Form实例获取体温数值: ${temp}`);
			return temp;
		}

		// 然后尝试从Form实例获取对象并合成
		if (Form.value?.form?.temperature && typeof Form.value.form.temperature === 'object') {
			const tempObj = Form.value.form.temperature;
			if (tempObj.intPart || tempObj.decPart) {
				const intPart = tempObj.intPart || '0';
				const decPart = tempObj.decPart || '0';
				const temp = parseFloat(`${intPart}.${decPart}`);
				//console.log(`从Form实例合成体温数值: ${temp}`);
				return temp;
			}
		}

		// 最后尝试从data对象获取
		if (data.temperature) {
			if (typeof data.temperature === 'object') {
				if (data.temperature.intPart || data.temperature.decPart) {
					const intPart = data.temperature.intPart || '0';
					const decPart = data.temperature.decPart || '0';
					const temp = parseFloat(`${intPart}.${decPart}`);
					//console.log(`从data对象合成体温数值: ${temp}`);
					return temp;
				}
			} else {
				//console.log(`从data对象获取体温数值: ${data.temperature}`);
				return data.temperature;
			}
		}

		//console.log(`无法获取有效的体温数据`);
		return null;
	};

	// 处理血压数据
	const getBloodPressure = () => {
		// 首先尝试从Form实例获取直接设置的值
		if (
			Form.value?.form?.bloodPressure !== undefined &&
			typeof Form.value.form.bloodPressure !== 'object'
		) {
			const bp = Form.value.form.bloodPressure;
			//console.log(`从Form实例获取血压字符串: ${bp}`);
			return bp;
		}

		// 然后尝试从Form实例获取对象并合成
		if (Form.value?.form?.bloodPressure && typeof Form.value.form.bloodPressure === 'object') {
			const bpObj = Form.value.form.bloodPressure;
			if (bpObj.systolic || bpObj.diastolic) {
				const systolic = bpObj.systolic || '0';
				const diastolic = bpObj.diastolic || '0';
				const bp = `${systolic}/${diastolic}`;
				//console.log(`从Form实例合成血压字符串: ${bp}`);
				return bp;
			}
		}

		// 最后尝试从data对象获取
		if (data.bloodPressure) {
			if (typeof data.bloodPressure === 'object') {
				if (data.bloodPressure.systolic || data.bloodPressure.diastolic) {
					const systolic = data.bloodPressure.systolic || '0';
					const diastolic = data.bloodPressure.diastolic || '0';
					const bp = `${systolic}/${diastolic}`;
					//console.log(`从data对象合成血压字符串: ${bp}`);
					return bp;
				}
			} else {
				//console.log(`从data对象获取血压字符串: ${data.bloodPressure}`);
				return data.bloodPressure;
			}
		}

		//console.log(`无法获取有效的血压数据`);
		return null;
	};

	// 设置最终的体温和血压值
	data.temperature = getTemperature();
	data.bloodPressure = getBloodPressure();

	//console.log('处理后的提交数据:', JSON.stringify(data));

	// 保存数据
	await save(data, done);
}

// 保存数据函数
async function save(saveData, done) {
	// 准备要保存的数据对象
	const params = {
		id: vitalId.value,
		swlNo: props.swlNo,
		serialNumber: props.serialNumber,
		temperature: saveData.temperature, //体温 - 确保是单一数值而非对象
		pulse: saveData.pulse, //脉搏
		respiratoryRate: saveData.respiratoryRate, //呼吸频率
		bloodPressure: saveData.bloodPressure, //血压 - 确保是字符串而非对象
		height: saveData.height, //身高
		weight: saveData.weight, //体重
		bmi: saveData.bmi, //BMI
		abdominalTenderness: saveData.abdominalTenderness, //腹部压痛点
		location: saveData.location, //位置描述
		renalAreaKnockingPain: saveData.renalAreaKnockingPain, //肾区叩击痛
		painIntensity: saveData.painIntensity, //程度
		otherSigns: saveData.otherSigns, //其他体征
		operator: saveData.operator || user.info?.name //录入人工号
	};

	// 最终数据验证 - 确保体温和血压是正确的格式
	//console.log('最终数据验证前:', JSON.stringify(params));

	// 1. 检查体温是否仍然是对象，如果是则转换为数值
	if (params.temperature && typeof params.temperature === 'object') {
		if (params.temperature.intPart || params.temperature.decPart) {
			const intPart = params.temperature.intPart || '0';
			const decPart = params.temperature.decPart || '0';
			params.temperature = parseFloat(`${intPart}.${decPart}`);
			//console.log(`最终提交前转换体温数据: ${params.temperature}`);
		} else {
			params.temperature = null;
		}
	}

	// 2. 检查血压是否仍然是对象，如果是则转换为字符串
	if (params.bloodPressure && typeof params.bloodPressure === 'object') {
		if (params.bloodPressure.systolic || params.bloodPressure.diastolic) {
			const systolic = params.bloodPressure.systolic || '0';
			const diastolic = params.bloodPressure.diastolic || '0';
			params.bloodPressure = `${systolic}/${diastolic}`;
			//console.log(`最终提交前转换血压数据: ${params.bloodPressure}`);
		} else {
			params.bloodPressure = null;
		}
	}

	//console.log('最终保存参数:', JSON.stringify(params));

	try {
		if (
			(params.id != undefined && Number(params.id) > 0) ||
			(vitalId.value != undefined && Number(vitalId.value) > 0)
		) {
			if (vitalId.value != undefined && Number(vitalId.value) > 0) {
				params.id = Number(vitalId.value);
			}
			//console.log('update-params:', params);
			const res = await cool.service.swl.vital.update(params);
		} else {
			//console.log('save-params:', params);
			const res = await cool.service.swl.vital.add(params);
			//保存后，获取id
			//console.log('res:', res);
			vitalId.value = res.id;
		}
		ElMessage.success('保存成功');
	} catch (error) {
		console.error('保存失败:', error);
		ElMessage.error('保存失败：' + (error as Error).message || '未知错误');
	} finally {
		done(); // 标记操作完成
	}
}
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

.scroll-container {
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
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
	.past-medical {
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

/* 体温输入框样式 */
.temperature-input {
	display: flex;
	align-items: center;

	.int-part {
		width: 85px;
	}

	.separator {
		margin: 0 2px;
		font-weight: bold;
	}

	.dec-part {
		width: 85px;
	}

	.unit {
		margin-left: 5px;
	}

	:deep(.el-input__inner) {
		text-align: center;
	}
}

/* 血压输入框样式 */
.blood-pressure-input {
	display: flex;
	align-items: center;

	.systolic-part {
		width: 85px;
	}

	.separator {
		margin: 0 2px;
		font-weight: bold;
	}

	.diastolic-part {
		width: 85px;
	}

	.unit {
		margin-left: 5px;
	}

	:deep(.el-input__inner) {
		text-align: center;
	}
}

/* 通用带单位输入框样式 */
.input-with-unit {
	display: flex;
	align-items: center;

	.value-part {
		width: 180px;
	}

	.unit {
		margin-left: 5px;
		white-space: nowrap;
	}

	:deep(.el-input-number__inner) {
		text-align: center;
	}
}

/* 全局设置表单项间距 */
:deep(.el-form-item) {
	margin-bottom: 10px !important; /* 调整各行之间的间距 */
}
</style>
