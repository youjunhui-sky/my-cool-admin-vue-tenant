<template>
	<div class="scroll-container">
		<cl-crud ref="Crud">
			<cl-row>
				<cl-form ref="Form" inner></cl-form>
			</cl-row>
			<cl-row>
				<!-- 数据表格 -->
				<cl-table ref="Table" />
			</cl-row>
			<cl-row>
				<cl-flex1 />
				<!-- 分页控件 -->
				<cl-pagination style="height: 28px" />
			</cl-row>
		</cl-crud>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useTable, useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { onMounted, watch, ref, reactive } from 'vue';
import { Plugins } from '/#/crud';
import { ElMessageBox, ElMessage } from 'element-plus';

// 定义 props
const props = defineProps({
	itemCode: {
		type: String,
		required: true
	},
	itemName: {
		type: String,
		required: true
	}
});

// 标签映射
const options = reactive({
	gender: [
		{ label: '男', value: 1 },
		{ label: '女', value: 2 },
		{ label: '不限', value: 0 }
	]
});
// 使用 props
//console.log('Component mounted, received props:', props);
//console.log('itemCode prop type:', typeof props.itemCode);
//console.log('itemCode value:', props.itemCode);
//console.log('itemName value:', props.itemName);

// 监听 props 变化，以便重新加载数据
watch(
	() => props.itemCode,
	newValue => {
		//console.log('itemCode changed:', newValue);
		if (newValue) {
			Crud.value?.refresh();
		}
	}
);

const { service } = useCool();

// crud
const Crud = useCrud(
	{
		service: {
			// 包装原 service 方法，自动注入 itemCode
			...service.knowledge.reference,
			page: params => {
				//console.log('查询参数:', { ...params, itemCode: props.itemCode });
				return service.knowledge.reference.page({ ...params, itemCode: props.itemCode });
			},
			list: data => {
				//console.log('列表参数:', { ...data, itemCode: props.itemCode });
				return service.knowledge.reference.list({ ...data, itemCode: props.itemCode });
			},
			add: data => {
				data.itemCode = props.itemCode;
				data.itemName = props.itemName;
				return service.knowledge.reference.add(data);
			},
			update: data => {
				data.itemCode = props.itemCode;
				data.itemName = props.itemName;
				return service.knowledge.reference.update(data);
			},
			// 明确定义delete方法
			delete: ids => {
				//console.log('删除ID:', ids);
				return service.knowledge.reference.delete(ids);
			},
			// 自定义 info 方法，直接返回行数据，避免再次请求接口
			info: data => {
				return Promise.resolve(data);
			}
		}
	},
	app => {
		// 确保有 itemCode 才刷新数据
		if (props.itemCode) {
			//console.log('初始化刷新，使用itemCode:', props.itemCode);
			app.refresh();
		}
	}
);

// 表格配置
const Table = useTable({
	// 自动高度
	autoHeight: false,
	props: {
		rowStyle: { height: '28px' },
		cellStyle: { padding: '0' } // 减小内边距也有助于控制行高
	},
	columns: [
		{
			type: 'selection',
			width: 40
		},
		{
			label: '项目编码',
			prop: 'itemCode',
			showOverflowTooltip: true,
			width: 80
		},
		{
			label: '项目名称',
			prop: 'itemName',
			showOverflowTooltip: true,
			minWidth: 80
		},
		{
			label: '性别',
			prop: 'gender',
			minWidth: 30,
			dict: options.gender
		},
		{
			label: '年龄下限',
			prop: 'ageMin',
			minWidth: 30
		},
		{
			label: '年龄上限',
			prop: 'ageMax',
			minWidth: 30
		},
		{
			label: '年龄单位',
			prop: 'ageUnit',
			width: 40,
			//格式化年龄单位，0 岁 1 月 2 周 3 天 4 时
			formatter: row => {
				return row.ageUnit === 0
					? '岁'
					: row.ageUnit === 1
						? '月'
						: row.ageUnit === 2
							? '周'
							: row.ageUnit === 3
								? '天'
								: '时';
			}
		},
		{
			label: '参考值描述',
			prop: 'referenceText',
			showOverflowTooltip: true,
			width: 160
		},
		{
			label: '参考值下限',
			prop: 'referenceMin',
			showOverflowTooltip: true,
			width: 60
		},
		{
			label: '参考值上限',
			prop: 'referenceMax',
			showOverflowTooltip: true,
			width: 60
		},
		{
			label: '危急值下限',
			prop: 'criticalMin',
			showOverflowTooltip: true,
			hidden: true,
			width: 60
		},
		{
			label: '危急值上限',
			prop: 'criticalMax',
			showOverflowTooltip: true,
			hidden: true,
			width: 60
		},
		{
			type: 'op',
			width: 160,
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
							Form.value?.setForm(key, scope.row[key]);
						}
					}
				},
				{
					label: '删除',
					type: 'danger',
					onClick({ scope }) {
						//console.log('删除行数据:', scope.row);
						// 使用ElMessageBox确认删除
						ElMessageBox.confirm('确认删除该记录?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								// 调用删除API
								service.knowledge.reference
									.delete({ ids: [scope.row.id] })
									.then(() => {
										// 成功后刷新表格
										ElMessage.success('删除成功');
										Crud.value?.refresh();
									})
									.catch(err => {
										console.error('删除失败:', err);
										ElMessage.error('删除失败');
									});
							})
							.catch(() => {
								// 取消删除
								ElMessage.info('已取消删除');
							});
					}
				}
			]
		}
	]
});

// 新增、编辑配置
const Form = useForm();

// 用于控制参考值描述字段是否自动更新
const shouldAutoUpdateReferenceText = ref(true);

// 更新参考值描述的函数
function updateReferenceText() {
	// 确保表单已经初始化
	if (!Form.value) return;

	// 获取当前表单中的参考值上下限
	const min = Form.value.form.referenceMin;
	const max = Form.value.form.referenceMax;

	// 只有在shouldAutoUpdateReferenceText为true时才自动更新
	if (!shouldAutoUpdateReferenceText.value) return;

	// 根据业务规则更新参考值描述
	if (min && max) {
		// 上下限都有值
		Form.value.setForm('referenceText', `${min}~${max}`);
	} else if (min && !max) {
		// 只有下限有值
		Form.value.setForm('referenceText', `>${min}`);
	} else if (!min && max) {
		// 只有上限有值
		Form.value.setForm('referenceText', `<${max}`);
	} else {
		// 上下限都没有值，参考值描述保持不变或设为空
		// 此处保留用户输入，不做处理
	}
}

// 彻底重置表单，确保回到新增状态
function completeReset() {
	// 先调用普通重置
	Form.value?.reset();
	// 明确清除id字段
	Form.value?.setForm('id', undefined);
	// 使用clear方法清除表单内容
	Form.value?.clear();
	Form.value?.setForm('itemCode', props.itemCode);
	Form.value?.setForm('itemName', props.itemName);
	// 重置自动更新标志
	shouldAutoUpdateReferenceText.value = true;
}

// 处理数据加载后的逻辑
function handleFormDataReady(data) {
	// 如果是编辑模式，且已有参考值描述，则不自动更新
	if (data.referenceText) {
		shouldAutoUpdateReferenceText.value = false;
	} else {
		// 否则执行一次更新
		updateReferenceText();
	}
}

onMounted(() => {
	Form.value?.open(
		{
			title: '新增', // 设置为新增，以区分编辑操作
			width: '800px',
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
					label: '项目编码',
					prop: 'itemCode',
					value: props.itemCode,
					component: {
						name: 'el-input',
						props: {
							disabled: true,
							style: 'height: 28px;'
						}
					},
					col: { span: 8 }
				},
				{
					label: '项目名称',
					prop: 'itemName',
					value: props.itemName,
					component: {
						name: 'el-input',
						props: {
							disabled: true,
							style: 'height: 28px;'
						}
					},
					col: { span: 8 }
				},
				{
					prop: 'gender',
					label: '性别',
					component: {
						name: 'cl-select',
						props: {
							options: options.gender,
							checkStrictly: true
						}
					},
					col: { span: 8 }
				},
				{
					label: '年龄下限',
					prop: 'ageMin',
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;'
						}
					},
					col: { span: 4 }
				},
				{
					label: '年龄上限',
					prop: 'ageMax',
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;'
						}
					},
					col: { span: 4 }
				},
				{
					prop: 'ageUnit',
					label: '年龄单位',
					component: {
						name: 'el-radio-group',
						options: [
							{
								label: '岁',
								value: 0
							},
							{
								label: '月',
								value: 1
							},
							{
								label: '周',
								value: 2
							},
							{
								label: '天',
								value: 3
							},
							{
								label: '时',
								value: 4
							}
						],
						props: {
							style: 'height: 28px;'
						}
					},
					value: 0,
					col: { span: 16 }
				},
				{
					label: '参考值描述',
					prop: 'referenceText',
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;',
							// 当用户手动编辑时，停止自动更新
							onFocus() {
								shouldAutoUpdateReferenceText.value = false;
							},
							// 当输入框失去焦点且为空时，重新启用自动更新
							onBlur(e) {
								if (!e.target.value) {
									shouldAutoUpdateReferenceText.value = true;
									// 重新计算参考值描述
									updateReferenceText();
								}
							}
						}
					},
					col: { span: 8 }
				},
				{
					label: '参考值下限',
					prop: 'referenceMin',
					value: null,
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;',
							// 当参考值下限改变时，更新参考值描述
							onChange(val) {
								updateReferenceText();
							}
						}
					},
					col: { span: 4 }
				},
				{
					label: '参考值上限',
					prop: 'referenceMax',
					value: null,
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;',
							// 当参考值上限改变时，更新参考值描述
							onChange(val) {
								updateReferenceText();
							}
						}
					},
					col: { span: 4 }
				},
				{
					label: '危急值下限',
					prop: 'criticalMin',
					value: null,
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;'
						}
					},
					col: { span: 4 }
				},
				{
					label: '危急值上限',
					prop: 'criticalMax',
					value: null,
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;'
						}
					},
					col: { span: 4 }
				}
			],
			on: {
				// 表单打开事件
				open(data) {
					// 初始化自动更新标志
					shouldAutoUpdateReferenceText.value = true;

					// 处理已有数据
					handleFormDataReady(data);
				},
				submit: (data, { done }) => {
					// 确保项目编码和名称正确
					data.itemCode = props.itemCode;
					data.itemName = props.itemName;
					data.referenceMin = data.referenceMin === '' ? null : data.referenceMin;
					data.referenceMax = data.referenceMax === '' ? null : data.referenceMax;
					data.criticalMin = data.criticalMin === '' ? null : data.criticalMin;
					data.criticalMax = data.criticalMax === '' ? null : data.criticalMax;

					// 根据表单是否有ID字段判断是新增还是更新
					if (data.id) {
						// 更新操作
						service.knowledge.reference
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
						service.knowledge.reference
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

/* 全局设置表单项间距 */
:deep(.el-form-item) {
	margin-bottom: 10px !important; /* 调整各行之间的间距 */
}
</style>
