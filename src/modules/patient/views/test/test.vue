<template>
	<div class="lab-wrapper">
		<div>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<div class="scroll-container">
			<cl-row>
				<cl-form ref="Form" inner></cl-form>
			</cl-row>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, reactive } from 'vue';
import { useForm, useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { useBase } from '/@/modules/base';
import { Plugins } from '/#/crud';
const Form = useForm();
const cool = useCool();
const { service } = useCool();
const { dict } = useDict();
const { user } = useBase();

// 定义options
const options = reactive({
	itemType: [{ label: '检验', value: '10801' }],
	groupCode: [
		{ label: '血液生化', value: '10904' },
		{ label: '尿常规', value: '10902' },
		{ label: '尿沉渣', value: '10903' },
		{ label: '24H尿分析', value: '10901' },
		{ label: '血液常规', value: '10905' }
	],
	moduleCode: [{ label: 'SWL模块', value: '12701' }]
});

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
		console.log('swlNo changed:', newValue);
	}
);

watch(
	() => props.serialNumber,
	newValue => {
		console.log('serialNumber changed:', newValue);
	}
);

// crud
const Crud = useCrud(
	{
		service: {
			// 包装原 service 方法，自动注入 swlNo
			...service.swl.lab,
			page: params => service.swl.lab.page({ ...params, swlNo: props.swlNo }),
			list: data => service.swl.lab.list({ ...data, swlNo: props.swlNo }),
			add: data => {
				data.swlNo = props.swlNo;
				return service.swl.lab.add(data);
			},
			update: data => {
				data.swlNo = props.swlNo;
				return service.swl.lab.update(data);
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

// 获取实验室项目分组列表
function getLabItemList(params: any) {
	// 查询参数
	const queryParams = {
		itemType: '10801',
		groupCode: params.groupCode
		//moduleCode: '12701'
	};
	// 获取实验室项目分组列表
	service.swl.lab.list(queryParams).then(res => {
		console.log('获取到的项目列表:', res);
		if (res && res.length > 0) {
			// 根据groupCode分类存储项目
			if (params.groupCode === '10904') {
				// 血液生化
				labItems.bloodItems = res as LabItem[];
			} else if (params.groupCode === '10902') {
				// 尿常规
				labItems.urineItems = res as LabItem[];
			} else if (params.groupCode === '10903') {
				// 尿沉渣
				labItems.urineSedimentItems = res as LabItem[];
			} else if (params.groupCode === '10901') {
				// 24H尿分析
				labItems.urine24hItems = res as LabItem[];
			} else if (params.groupCode === '10905') {
				// 血液常规
				labItems.bloodRoutineItems = res as LabItem[];
			}
		}
	});
}

// 存储各分组的检验项目
interface LabItem {
	id?: string | number;
	itemCode?: string;
	itemName?: string;
	resultValue?: string | number;
	resultFlag?: string | number;
	unit?: string;
	referenceText?: string;
	groupCode?: string;
	[key: string]: any;
}

// 提交数据的类型定义
interface SubmitItem extends LabItem {
	swlNo: string;
	serialNumber: string;
}

const labItems = reactive<{
	bloodItems: LabItem[];
	urineItems: LabItem[];
	urineSedimentItems: LabItem[];
	urine24hItems: LabItem[];
	bloodRoutineItems: LabItem[];
}>({
	bloodItems: [], // 血液生化
	urineItems: [], // 尿常规
	urineSedimentItems: [], // 尿沉渣
	urine24hItems: [], // 24H尿分析
	bloodRoutineItems: [] // 血液常规
});

// 生命周期钩子中调用
onMounted(() => {
	// 加载各个分组的项目数据
	options.groupCode.forEach(group => {
		getLabItemList({ groupCode: group.value });
	});

	Form.value?.open(
		{
			title: '检验结果录入',
			props: {
				labelPosition: 'top',
				labelWidth: 'auto',
				inline: true,
				size: 'default'
			},
			op: {
				justify: 'flex-end',
				buttons: [
					'save',
					{
						label: '重置',
						onClick() {
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
					label: '流水号',
					prop: 'serialNumber',
					value: props.serialNumber,
					hidden: true,
					component: {
						name: 'el-input'
					}
				},
				// 血液生化
				{
					component: {
						name: 'cl-form-card',
						props: {
							label: '血液生化',
							value: 'blood',
							expand: true
						}
					},
					children: [
						// 表头行
						{
							label: '表头',
							hidden: labItems.bloodItems.length === 0,
							component: {
								name: 'cl-row'
							},
							children: [
								{
									label: '项目编码',
									prop: 'header_itemCode',
									span: 3,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '项目编码'
										}
									}
								},
								{
									label: '项目名称',
									prop: 'header_itemName',
									span: 3,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '项目名称'
										}
									}
								},
								{
									label: '检验结果',
									prop: 'header_resultValue',
									span: 3,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '检验结果'
										}
									}
								},
								{
									label: '结果标识',
									prop: 'header_resultFlag',
									span: 2,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '结果标识'
										}
									}
								},
								{
									label: '单位',
									prop: 'header_unit',
									span: 2,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '单位'
										}
									}
								},
								{
									label: '参考范围',
									prop: 'header_referenceText',
									span: 6,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '参考范围'
										}
									}
								}
							]
						},
						// 动态项目行 - 使用函数动态生成
						() => {
							// 返回动态生成的项目行数组
							return labItems.bloodItems.map((item, index) => {
								return {
									label: `血液生化项目${index + 1}`,
									prop: `bloodItem_${index}`,
									component: {
										name: 'cl-row'
									},
									children: [
										{
											label: '项目编码',
											prop: `blood_itemCode_${index}`,
											value: item.itemCode,
											span: 3,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.itemCode
												}
											}
										},
										{
											label: '项目名称',
											prop: `blood_itemName_${index}`,
											value: item.itemName,
											span: 3,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.itemName
												}
											}
										},
										{
											label: '检验结果',
											prop: `blood_resultValue_${index}`,
											span: 3,
											component: {
												name: 'el-input',
												props: {
													placeholder: '请输入检验结果'
												}
											}
										},
										{
											label: '结果标识',
											prop: `blood_resultFlag_${index}`,
											value: item.resultFlag,
											span: 2,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.resultFlag || '--'
												}
											}
										},
										{
											label: '单位',
											prop: `blood_unit_${index}`,
											value: item.unit,
											span: 2,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.unit || '--'
												}
											}
										},
										{
											label: '参考范围',
											prop: `blood_referenceText_${index}`,
											value: item.referenceText,
											span: 6,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.referenceText || '--'
												}
											}
										}
									]
								};
							});
						}
					]
				},
				// 尿常规
				{
					component: {
						name: 'cl-form-card',
						props: {
							label: '尿常规',
							expand: false
						}
					},
					children: [
						// 表头行
						{
							label: '表头',
							hidden: labItems.urineItems.length === 0,
							component: {
								name: 'cl-row'
							},
							children: [
								{
									label: '项目编码',
									prop: 'header_urine_itemCode',
									span: 3,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '项目编码'
										}
									}
								},
								{
									label: '项目名称',
									prop: 'header_urine_itemName',
									span: 3,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '项目名称'
										}
									}
								},
								{
									label: '检验结果',
									prop: 'header_urine_resultValue',
									span: 3,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '检验结果'
										}
									}
								},
								{
									label: '结果标识',
									prop: 'header_urine_resultFlag',
									span: 2,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '结果标识'
										}
									}
								},
								{
									label: '单位',
									prop: 'header_urine_unit',
									span: 2,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '单位'
										}
									}
								},
								{
									label: '参考范围',
									prop: 'header_urine_referenceText',
									span: 6,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '参考范围'
										}
									}
								}
							]
						},
						// 动态项目行
						() => {
							return labItems.urineItems.map((item, index) => {
								return {
									label: `尿常规项目${index + 1}`,
									prop: `urineItem_${index}`,
									component: {
										name: 'cl-row'
									},
									children: [
										{
											label: '项目编码',
											prop: `urine_itemCode_${index}`,
											value: item.itemCode,
											span: 3,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.itemCode
												}
											}
										},
										{
											label: '项目名称',
											prop: `urine_itemName_${index}`,
											value: item.itemName,
											span: 3,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.itemName
												}
											}
										},
										{
											label: '检验结果',
											prop: `urine_resultValue_${index}`,
											span: 3,
											component: {
												name: 'el-input',
												props: {
													placeholder: '请输入检验结果'
												}
											}
										},
										{
											label: '结果标识',
											prop: `urine_resultFlag_${index}`,
											value: item.resultFlag,
											span: 2,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.resultFlag || '--'
												}
											}
										},
										{
											label: '单位',
											prop: `urine_unit_${index}`,
											value: item.unit,
											span: 2,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.unit || '--'
												}
											}
										},
										{
											label: '参考范围',
											prop: `urine_referenceText_${index}`,
											value: item.referenceText,
											span: 6,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.referenceText || '--'
												}
											}
										}
									]
								};
							});
						}
					]
				},

				// 示例：尿沉渣项目组
				{
					component: {
						name: 'cl-form-card',
						props: {
							label: '尿沉渣',
							expand: false
						}
					},
					children: [
						// 表头行同上
						{
							label: '表头',
							hidden: labItems.urineSedimentItems.length === 0,
							component: {
								name: 'cl-row'
							},
							children: [
								// 与上方相同的表头配置
								{
									label: '项目编码',
									prop: 'header_sediment_itemCode',
									span: 3,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '项目编码'
										}
									}
								},
								// ...其他表头配置
								{
									label: '项目名称',
									prop: 'header_sediment_itemName',
									span: 3,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '项目名称'
										}
									}
								},
								{
									label: '检验结果',
									prop: 'header_sediment_resultValue',
									span: 3,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '检验结果'
										}
									}
								},
								{
									label: '结果标识',
									prop: 'header_sediment_resultFlag',
									span: 2,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '结果标识'
										}
									}
								},
								{
									label: '单位',
									prop: 'header_sediment_unit',
									span: 2,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '单位'
										}
									}
								},
								{
									label: '参考范围',
									prop: 'header_sediment_referenceText',
									span: 6,
									component: {
										name: 'el-text',
										props: {
											tag: 'b'
										},
										slot: {
											default: () => '参考范围'
										}
									}
								}
							]
						},
						// 动态项目行类似
						() => {
							return labItems.urineSedimentItems.map((item, index) => {
								// 与上方配置类似，只是prop名不同
								return {
									// 配置与上方示例类似，只需要将prop前缀改为sediment
									label: `尿沉渣项目${index + 1}`,
									prop: `sedimentItem_${index}`,
									component: {
										name: 'cl-row'
									},
									children: [
										{
											label: '项目编码',
											prop: `sediment_itemCode_${index}`,
											value: item.itemCode,
											span: 3,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.itemCode
												}
											}
										},
										{
											label: '项目名称',
											prop: `sediment_itemName_${index}`,
											value: item.itemName,
											span: 3,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.itemName
												}
											}
										},
										{
											label: '检验结果',
											prop: `sediment_resultValue_${index}`,
											span: 3,
											component: {
												name: 'el-input',
												props: {
													placeholder: '请输入检验结果'
												}
											}
										},
										{
											label: '结果标识',
											prop: `sediment_resultFlag_${index}`,
											value: item.resultFlag,
											span: 2,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.resultFlag || '--'
												}
											}
										},
										{
											label: '单位',
											prop: `sediment_unit_${index}`,
											value: item.unit,
											span: 2,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.unit || '--'
												}
											}
										},
										{
											label: '参考范围',
											prop: `sediment_referenceText_${index}`,
											value: item.referenceText,
											span: 6,
											component: {
												name: 'el-tag',
												props: {
													type: 'info',
													size: 'medium'
												},
												slot: {
													default: () => item.referenceText || '--'
												}
											}
										}
									]
								};
							});
						}
					]
				}
			],

			on: {
				submit: (data, { done }) => {
					// 在提交前，整理数据格式，将动态生成的表单项转换成后端需要的格式
					const submitData: SubmitItem[] = [];

					// 处理血液生化组
					labItems.bloodItems.forEach((item, index) => {
						const resultValue = data[`blood_resultValue_${index}`];
						if (resultValue) {
							// 只提交有填写结果的项目
							submitData.push({
								id: item.id,
								swlNo: props.swlNo,
								serialNumber: props.serialNumber,
								itemCode: item.itemCode,
								itemName: item.itemName,
								resultValue: resultValue,
								groupCode: '10904',
								unit: item.unit,
								referenceText: item.referenceText
							});
						}
					});

					// 处理尿常规组
					labItems.urineItems.forEach((item, index) => {
						const resultValue = data[`urine_resultValue_${index}`];
						if (resultValue) {
							submitData.push({
								id: item.id,
								swlNo: props.swlNo,
								serialNumber: props.serialNumber,
								itemCode: item.itemCode,
								itemName: item.itemName,
								resultValue: resultValue,
								groupCode: '10902',
								unit: item.unit,
								referenceText: item.referenceText
							});
						}
					});

					// 处理尿沉渣组
					labItems.urineSedimentItems.forEach((item, index) => {
						const resultValue = data[`sediment_resultValue_${index}`];
						if (resultValue) {
							submitData.push({
								id: item.id,
								swlNo: props.swlNo,
								serialNumber: props.serialNumber,
								itemCode: item.itemCode,
								itemName: item.itemName,
								resultValue: resultValue,
								groupCode: '10903', // 尿沉渣分组
								unit: item.unit,
								referenceText: item.referenceText
							});
						}
					});

					// 其余分组类似处理...

					// 批量提交
					if (submitData.length > 0) {
						// 使用批量保存方法，如果没有batchSave方法，使用常规的add或update方法
						const savePromises = submitData.map(item => {
							if (item.id) {
								return service.swl.lab.update(item);
							} else {
								return service.swl.lab.add(item);
							}
						});

						Promise.all(savePromises)
							.then(() => {
								// 关闭加载状态
								done();
								// 刷新表格
								Crud.value?.refresh();
								// 提交后重置表单
								completeReset();
							})
							.catch(err => {
								console.error('保存失败:', err);
								done();
							});
					} else {
						// 无数据提交
						done();
					}
				}
			}
		},
		// 需要设置form不聚焦，否则会自动聚焦到第一个输入框
		[Plugins.Form.setFocus(' ')]
	);
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
</script>

<style lang="scss" scoped>
.scroll-container {
	width: 100%;
	height: calc(100vh - 450px); // 考虑到 tab 头部、父容器边距和其他元素的高度
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
</style>
