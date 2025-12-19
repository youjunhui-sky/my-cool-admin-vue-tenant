<template>
	<div class="family-history-wrapper">
		<div>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<div class="family-history">
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
					<cl-pagination />
				</cl-row>
			</cl-crud>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useTable, useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { onMounted, reactive, watch } from 'vue';
import { useDict } from '/$/dict';
import { useBase } from '/@/modules/base';
import { Plugins } from '/#/crud';
import { ElMessage } from 'element-plus';
const { dict } = useDict();
const { user } = useBase();

// --- 数据字典 ---
const options = reactive({
	urolithiasisHistory: [
		{ label: '无', value: 0, type: 'success' },
		{ label: '有', value: 1, type: 'warning' }
	]
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
			...service.swl.family,
			page: params => service.swl.family.page({ ...params, swlNo: props.swlNo }),
			list: data => service.swl.family.list({ ...data, swlNo: props.swlNo }),
			add: data => {
				data.swlNo = props.swlNo;
				return service.swl.family.add(data);
			},
			update: data => {
				data.swlNo = props.swlNo;
				return service.swl.family.update(data);
			}
			// 自定义 info 方法，直接返回行数据，避免再次请求接口
			// info: data => {
			// 	return Promise.resolve(data);
			// }
		}
	},
	app => {
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
			label: '家族成员',
			prop: 'familyMember',
			width: 150
		},
		{
			label: '结石病史',
			prop: 'urolithiasisHistory',
			dict: options.urolithiasisHistory,
			width: 100
		},
		{
			label: '其他病史',
			prop: 'otherDiseases',
			width: 200
		},
		{
			label: '备注',
			prop: 'remark',
			width: 240
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
							Form.value?.setForm(key, scope.row[key]);
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

onMounted(() => {
	Form.value?.open(
		{
			title: '新增', // 设置为新增，以区分编辑操作
			width: '1000px',
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
					label: '家族成员',
					prop: 'familyMember',
					component: {
						name: 'cl-select',
						props: {
							placeholder: '请选择家族成员',
							clearable: true,
							filterable: true,
							allowCreate: true,
							reserveKeyword: true,
							automaticDropdown: false,
							options: dict.get('family_people'),
							labelKey: 'name',
							valueKey: 'name',
							checkStrictly: true,
							defaultExpandAll: true,
							style: 'width: 230px;'
						}
					},
					span: 6
				},
				{
					label: '结石病史',
					prop: 'urolithiasisHistory',
					component: {
						name: 'el-switch',
						props: {
							activeText: '有',
							activeValue: 1,
							inactiveText: '无',
							inactiveValue: 0
						}
					},
					value: 0,
					span: 3
				},
				{
					label: '其他病史',
					prop: 'otherDiseases',
					component: {
						name: 'cl-select',
						props: {
							placeholder: '请选择家族成员',
							clearable: true,
							filterable: true,
							allowCreate: true,
							reserveKeyword: true,
							automaticDropdown: false,
							options: dict.get('family_othersick'),
							labelKey: 'name',
							valueKey: 'name',
							checkStrictly: true,
							defaultExpandAll: true,
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
							style: 'width: 400px;'
						}
					},
					span: 9
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

			on: {
				submit: (data, { done }) => {
					// 根据表单是否有ID字段判断是新增还是更新
					if (data.id) {
						// 更新操作
						service.swl.family
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
						service.swl.family
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

.family-history {
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
		/* background-color: #fff; */
		background-color: transparent; // 改为透明背景
	}
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
	.family-history {
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
