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
import { onMounted, watch } from 'vue';
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
			...service.knowledge.result,
			page: params => {
				//console.log('查询参数:', { ...params, itemCode: props.itemCode });
				return service.knowledge.result.page({ ...params, itemCode: props.itemCode });
			},
			list: data => {
				//console.log('列表参数:', { ...data, itemCode: props.itemCode });
				return service.knowledge.result.list({ ...data, itemCode: props.itemCode });
			},
			add: data => {
				data.itemCode = props.itemCode;
				data.itemName = props.itemName;
				return service.knowledge.result.add(data);
			},
			update: data => {
				data.itemCode = props.itemCode;
				data.itemName = props.itemName;
				return service.knowledge.result.update(data);
			},
			// 明确定义delete方法
			delete: ids => {
				//console.log('删除ID:', ids);
				return service.knowledge.result.delete(ids);
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
			label: '序号',
			prop: 'displayOrder',
			minWidth: 40
		},
		{
			label: '结果值',
			prop: 'resultValue',
			minWidth: 60
		},
		{
			label: '结果标识',
			prop: 'resultCode',
			minWidth: 40
		},
		{
			label: '助记词',
			prop: 'mnemonic',
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
								service.knowledge.result
									.delete({ ids: [scope.row.id] })
									.then(() => {
										// 成功后刷新表格
										ElMessage.success('删除成功');
										Crud.value?.refresh();
									})
									.catch(err => {
										console.error('删除失败:', err);
										ElMessage.error('删除失败：' + (err.message || '未知错误'));
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
					label: '序号',
					prop: 'displayOrder',
					component: {
						name: 'el-input-number',
						props: {
							min: 0,
							max: 999999,
							style: 'height: 28px;'
						}
					},
					col: { span: 8 }
				},
				{
					label: '结果值',
					prop: 'resultValue',
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;'
						}
					},
					col: { span: 8 }
				},
				{
					label: '结果标识',
					prop: 'resultCode',
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;'
						}
					},
					col: { span: 8 }
				},
				{
					label: '助记词',
					prop: 'mnemonic',
					component: {
						name: 'el-input',
						props: {
							style: 'height: 28px;'
						}
					},
					col: { span: 8 }
				}
			],
			on: {
				submit: (data, { done }) => {
					// 确保项目编码和名称正确
					data.itemCode = props.itemCode;
					data.itemName = props.itemName;

					// 根据表单是否有ID字段判断是新增还是更新
					if (data.id) {
						// 更新操作
						service.knowledge.result
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
						service.knowledge.result
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
