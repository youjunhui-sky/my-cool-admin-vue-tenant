<template>
	<div class="current-history-wrapper">
		<!-- 添加滚动容器 -->
		<p hidden>swlNo: {{ swlNo }}</p>
		<p hidden>serialNumber: {{ serialNumber }}</p>
		<div class="scroll-container">
			<cl-row>
				<cl-form ref="Form" inner></cl-form>
			</cl-row>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref } from 'vue';
import { useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plugins } from '/#/crud';
import { useBase } from '/@/modules/base';

const Form = useForm();
const cool = useCool();
const { user } = useBase();
const { dict } = useDict();
const { service } = useCool();

// 定义 props
const props = defineProps({
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

// 根据碎石号查询查询当前病史
const currentId = ref(0);

// 页面加载
onMounted(async () => {
	//console.log('获取现病史数据swlNo:' + props.swlNo);
	//console.log('获取现病史数据serialNumber:' + props.serialNumber);

	const params = { swlNo: props.swlNo, serialNumber: props.serialNumber };
	// 查询数据
	try {
		const data: any = await service.swl.current.list(params);
		//console.log('获取现病史数据data:' + JSON.stringify(data));

		// 判断数据格式并正确处理
		let currentData: any = null;

		// 判断是否有数据，同时处理数组和对象两种情况
		if (Array.isArray(data)) {
			// 是数组则取第一条
			if (data.length > 0) {
				currentData = data[0];
				currentId.value = currentData.id || 0;
			}
		} else if (data && typeof data === 'object') {
			// 是单个对象
			if ('id' in data) {
				currentData = data;
				currentId.value = data.id || 0;
			}
		}

		//console.log('处理后的currentData:', currentData);
		//console.log('设置currentId:', currentId.value);

		// 判断是否有数据
		const hasData = !!currentData;

		// 准备表单数据
		const formData = hasData
			? currentData
			: {
					swlNo: props.swlNo,
					serialNumber: props.serialNumber,
					operator: user.info?.name,
					// 设置默认值
					hasSymptom: 0,
					diseaseDuration: 1,
					hasFever: 0,
					hasVomit: 0,
					hasNausea: 0,
					hasFrequentUrination: 0,
					hasUrgentUrination: 0,
					hasDysuria: 0,
					hasLowerAbdominalPain: 0,
					renalColicLocation: '无',
					hasChronicBackache: '无',
					hasHematuria: '无',
					difficultyUrinating: '无',
					treatment: '无'
				};

		//console.log('表单数据formData:', formData);

		if (Form.value) {
			// 延迟一下以确保DOM完全渲染
			setTimeout(() => {
				Form.value?.open(
					{
						title: hasData ? '现病史(已有记录)' : '现病史(新录入)',
						form: formData,
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
										disabled: true // 禁用输入框
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
										disabled: true // 禁用输入框
									}
								}
							},
							{
								label: '症状:',
								prop: 'hasSymptom',
								props: {
									labelPosition: 'top'
								},
								span: 4,
								component: {
									name: 'el-switch',
									props: {
										activeText: '有',
										inactiveText: '无',
										activeValue: 1,
										inactiveValue: 0,
										defaultValue: 0 // 默认值
									}
								}
							},
							{
								label: '病程(天):',
								prop: 'diseaseDuration',
								props: {
									labelPosition: 'top'
								},
								value: 1,
								span: 5,
								component: {
									name: 'el-input-number',
									props: {
										min: 0,
										style: 'width: 120px;'
									}
								}
							},
							{
								label: '发热:',
								prop: 'hasFever',
								props: {
									labelPosition: 'top'
								},
								span: 2,
								component: {
									name: 'el-switch',
									props: {
										activeValue: 1,
										inactiveValue: 0
									}
								}
							},
							{
								label: '呕吐:',
								prop: 'hasVomit',
								props: {
									labelPosition: 'top'
								},
								span: 2,
								component: {
									name: 'el-switch',
									props: {
										activeValue: 1,
										inactiveValue: 0
									}
								}
							},
							{
								label: '恶心:',
								prop: 'hasNausea',
								props: {
									labelPosition: 'top'
								},
								span: 2,
								component: {
									name: 'el-switch',
									props: {
										activeValue: 1,
										inactiveValue: 0
									}
								}
							},
							{
								label: '尿频:',
								prop: 'hasFrequentUrination',
								props: {
									labelPosition: 'top'
								},
								span: 2,
								component: {
									name: 'el-switch',
									props: {
										activeValue: 1,
										inactiveValue: 0
									}
								}
							},
							{
								label: '尿急:',
								prop: 'hasUrgentUrination',
								props: {
									labelPosition: 'top'
								},
								span: 2,
								component: {
									name: 'el-switch',
									props: {
										activeValue: 1,
										inactiveValue: 0
									}
								}
							},
							{
								label: '尿痛:',
								prop: 'hasDysuria',
								props: {
									labelPosition: 'top'
								},
								span: 2,
								component: {
									name: 'el-switch',
									props: {
										activeValue: 1,
										inactiveValue: 0
									}
								}
							},
							{
								label: '下腹放射痛:',
								prop: 'hasLowerAbdominalPain',
								props: {
									labelPosition: 'top'
								},
								span: 3,
								component: {
									name: 'el-switch',
									props: {
										activeValue: 1,
										inactiveValue: 0
									}
								}
							},
							{
								label: '主诉:',
								prop: 'chiefComplaint',
								props: {
									labelPosition: 'top'
								},
								span: 24,
								component: {
									name: 'el-input',
									props: {
										type: 'textarea',
										rows: 2
									}
								}
							},
							{
								label: '肾绞痛部位:',
								prop: 'renalColicLocation',
								props: {
									labelPosition: 'top'
								},
								value: '无',
								span: 4,
								component: {
									name: 'cl-select',
									props: {
										placeholder: '请输入',
										clearable: true,
										filterable: true,
										allowCreate: true,
										reserveKeyword: true,
										automaticDropdown: false,
										options: dict.get('current_sjtpark'),
										labelKey: 'name',
										valueKey: 'name',
										checkStrictly: true,
										defaultExpandAll: true,
										style: 'width: 160px;'
									}
								}
							},
							{
								label: '肾绞痛特征:',
								prop: 'renalColicCharacter',
								props: {
									labelPosition: 'top'
								},
								span: 4,
								component: {
									name: 'cl-select',
									props: {
										placeholder: '请输入',
										clearable: true,
										filterable: true,
										allowCreate: true,
										reserveKeyword: true,
										automaticDropdown: false,
										options: dict.get('current_sjtlook'),
										labelKey: 'name',
										valueKey: 'name'
									}
								}
							},
							{
								label: '发作次数:',
								prop: 'renalColicCount',
								props: {
									labelPosition: 'top'
								},
								span: 4,
								component: {
									name: 'cl-select',
									props: {
										placeholder: '请输入',
										clearable: true,
										filterable: true,
										allowCreate: true,
										reserveKeyword: true,
										automaticDropdown: false,
										options: dict.get('current_sjttime'),
										labelKey: 'name',
										valueKey: 'name'
									}
								}
							},
							{
								label: '慢性腰痛:',
								prop: 'hasChronicBackache',
								value: '无',
								props: {
									labelPosition: 'top'
								},
								span: 4,
								component: {
									name: 'cl-select',
									props: {
										placeholder: '请输入',
										clearable: true,
										filterable: true,
										allowCreate: true,
										reserveKeyword: true,
										automaticDropdown: false,
										options: dict.get('current_mxyt'),
										labelKey: 'name',
										valueKey: 'name'
									}
								}
							},
							{
								label: '血尿:',
								prop: 'hasHematuria',
								value: '无',
								props: {
									labelPosition: 'top'
								},
								span: 4,
								component: {
									name: 'cl-select',
									props: {
										placeholder: '请输入',
										clearable: true,
										filterable: true,
										allowCreate: true,
										reserveKeyword: true,
										automaticDropdown: false,
										options: dict.get('current_xuen'),
										labelKey: 'name',
										valueKey: 'name'
									}
								}
							},
							{
								label: '排尿困难:',
								prop: 'difficultyUrinating',
								value: '无',
								props: {
									labelPosition: 'top'
								},
								span: 4,
								component: {
									name: 'cl-select',
									props: {
										placeholder: '请输入',
										clearable: true,
										filterable: true,
										allowCreate: true,
										reserveKeyword: true,
										automaticDropdown: false,
										options: dict.get('current_painkn'),
										labelKey: 'name',
										valueKey: 'name'
									}
								}
							},
							{
								label: '治疗方式:',
								prop: 'treatment',
								value: '无',
								props: {
									labelPosition: 'top'
								},
								span: 24,
								component: {
									name: 'cl-select',
									props: {
										placeholder: '请输入',
										clearable: true,
										filterable: true,
										allowCreate: true,
										reserveKeyword: true,
										automaticDropdown: false,
										options: dict.get('current_curemothed'),
										labelKey: 'name',
										valueKey: 'name',
										style: 'width: 480px;'
									}
								}
							},
							{
								label: '治疗经过:',
								prop: 'treatmentProcess',
								props: {
									labelPosition: 'top'
								},
								span: 12,
								component: {
									name: 'el-input',
									props: {
										type: 'textarea',
										rows: 2
									}
								}
							},
							{
								label: '其他症状:',
								prop: 'otherSymptoms',
								props: {
									labelPosition: 'top'
								},
								span: 12,
								component: {
									name: 'el-input',
									props: {
										type: 'textarea',
										rows: 2
									}
								}
							},
							{
								label: '录入人工号',
								prop: 'operator',
								props: {
									labelPosition: 'top'
								},
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
								'save', // 保存按钮
								// 自定义删除按钮，仅在 currentId > 0 时显示
								{
									label: '删除',
									type: 'danger', // 设置为红色危险按钮
									hidden: currentId.value <= 0, // 当 currentId 不存在时隐藏
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
												await service.swl.current.deleteById({
													id: currentId.value
												});
												ElMessage.success('删除成功');

												// 清空表单
												Form.value?.clear();
												currentId.value = 0;
											}
										} catch (error: any) {
											console.error('删除失败:', error);
											ElMessage.error(
												'删除失败：' + (error.message || '未知错误')
											);
										}
									}
								}
							],
							saveButtonText: '保存' // 可选：自定义提交按钮文本
							//justify: 'center' // 设置按钮居中显示
						},
						on: {
							// open: () => {
							// 	initForm();
							// },

							submit: async (data, { done }) => {
								//console.log('Form submitted:', data);
								//console.log('Form stoneNumber:', data.stoneNumber);
								// 准备要保存的数据对象，将data中的数据赋值给saveData
								const saveData = {
									id: currentId.value,
									swlNo: props.swlNo,
									serialNumber: props.serialNumber,
									chiefComplaint: data.chiefComplaint, //主诉
									hasSymptom: data.hasSymptom, //是否有症状
									diseaseDuration: data.diseaseDuration, //病程
									hasFever: data.hasFever, //发热
									hasNausea: data.hasNausea, //恶心
									hasVomit: data.hasVomit, //呕吐
									hasFrequentUrination: data.hasFrequentUrination, //尿频
									hasUrgentUrination: data.hasUrgentUrination, //尿急
									hasDysuria: data.hasDysuria, //尿痛
									hasLowerAbdominalPain: data.hasLowerAbdominalPain, //下腹放射痛
									renalColicLocation: data.renalColicLocation, //肾绞痛部位
									renalColicCharacter: data.renalColicCharacter, //肾绞痛特征
									renalColicCount: data.renalColicCount, //肾绞痛发作次数
									hasChronicBackache: data.hasChronicBackache, //慢性腰痛
									hasHematuria: data.hasHematuria, //血尿
									difficultyUrinating: data.difficultyUrinating, //排尿困难
									treatment: data.treatment, //治疗方式
									treatmentProcess: data.treatmentProcess, //治疗经过
									otherSymptoms: data.otherSymptoms //其他症状
								};

								try {
									if (
										(saveData.id != undefined && Number(saveData.id) > 0) ||
										(currentId.value != undefined &&
											Number(currentId.value) > 0)
									) {
										const params = { ...saveData };
										if (saveData.id != undefined) {
											params.id = Number(saveData.id);
										}
										//console.log('currentId.value:', currentId.value);
										if (
											currentId.value != undefined &&
											Number(currentId.value) > 0
										) {
											params.id = Number(currentId.value);
										}
										//输出params
										//console.log('update-params:', params);
										const res = await cool.service.swl.current.update(params);
									} else {
										const params = { ...saveData };
										//输出params
										//console.log('save-params:', params);
										const res = await cool.service.swl.current.add(params);
										//保存后，获取id
										//输出res
										//console.log('res:', res);
										saveData.id = res.id;
										currentId.value = res.id;
									}
									ElMessage.success('保存成功');
								} catch (error) {
									console.error('保存失败:', error);
									ElMessage.error(
										'保存失败：' + (error as Error).message || '未知错误'
									);
								} finally {
									done(); // 无论成功或失败，都调用 done() 关闭加载状态
								}
							}
						}
					},
					// 需要设置form不聚焦，否则会自动聚焦到第一个输入框
					[Plugins.Form.setFocus(' ')]
				);
			});
		} else {
			console.error('Form is not defined');
		}
	} catch (error) {
		console.error('Failed to load data:', error);
	}
});
</script>
<style lang="scss" scoped>
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
	.scroll-container {
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

/* 全局设置表单项间距 */
:deep(.el-form-item) {
	margin-bottom: 10px !important; /* 调整各行之间的间距 */
}
</style>
