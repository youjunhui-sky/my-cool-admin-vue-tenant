<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search ref="Search" :reset-btn="true" />
			<cl-export-btn :columns="Table?.columns" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<!-- 版本内容使用 cl-editor-vditor 显示 -->
				<template #column-version="{ scope }">
					<div class="version-content-cell">
						<cl-editor-vditor
							:model-value="scope.row.version"
							:disabled="true"
							:height="150"
							mode="wysiwyg"
						/>
					</div>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

// cl-search 搜索配置
const Search = useSearch({
	items: [
		{
			prop: 'keyword',
			component: {
				name: 'el-input',
				props: {
					placeholder: '搜索版本/版本号',
					clearable: true
				}
			}
		}
	]
});

// cl-table 表格配置
const Table = useTable({
	autoHeight: false,
	contextMenu: ['refresh'],
	columns: [
		{
			type: 'selection'
		},
		{
			label: '版本',
			prop: 'version',
			minWidth: 300,
			slot: true
		},
		{
			label: '版本号',
			prop: 'bh',
			minWidth: 120,
			showOverflowTooltip: true
		},
		{
			label: '发布时间',
			prop: 'publishTime',
			minWidth: 170,
			sortable: 'desc',
			formatter(row) {
				if (row.publishTime) {
					return new Date(row.publishTime).toLocaleDateString('zh-CN');
				}
				return '-';
			}
		},
		{
			label: '是否发布',
			prop: 'published',
			minWidth: 100,
			dict: [
				{ label: '已发布', value: true, type: 'success' },
				{ label: '未发布', value: false, type: 'info' }
			]
		},
		{
			type: 'op',
			buttons: ['edit', 'delete'],
			width: 160
		}
	]
});

// cl-upsert 新增/编辑配置
const Upsert = useUpsert({
	dialog: {
		width: '800px'
	},
	items: [
		{
			label: '版本号',
			prop: 'bh',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入版本号，如：1.0.0',
					clearable: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '发布时间',
			prop: 'publishTime',
			component: {
				name: 'el-date-picker',
				props: {
					type: 'date',
					placeholder: '请选择发布时间',
					valueFormat: 'YYYY-MM-DD',
					format: 'YYYY-MM-DD',
					clearable: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '是否发布',
			prop: 'published',
			value: false,
			component: {
				name: 'el-switch',
				props: {
					activeText: '已发布',
					inactiveText: '未发布'
				}
			},
			col: { span: 8 }
		},
		{
			label: '版本',
			prop: 'version',
			required: true,
			component: {
				name: 'cl-editor-vditor'
			},
			col: { span: 24 }
		}
	]
});

// cl-crud 配置
const Crud = useCrud(
	{
		service: service.version.info
	},
	app => {
		app.refresh();
	}
);
</script>

<style lang="scss" scoped>
.version-content-cell {
	:deep(.cl-editor-vditor) {
		opacity: 1 !important;

		.vditor {
			border: 1px solid var(--el-border-color);
			border-radius: 4px;
			opacity: 1 !important;
		}

		.vditor-toolbar {
			display: none; // 隐藏工具栏，因为只读模式
		}

		.vditor-content {
			padding: 8px;
			max-height: 150px;
			overflow-y: auto;
			color: #000000 !important; // 使用纯黑色
			background-color: #ffffff !important; // 确保背景是白色
			opacity: 1 !important;
			text-align: left !important; // 确保左对齐

			// WYSIWYG 模式下的内容区域
			.vditor-wysiwyg,
			.vditor-content__left,
			.vditor-content__right,
			.vditor-preview {
				color: #000000 !important;
				opacity: 1 !important;
				font-weight: 400 !important;
				text-align: left !important; // 确保左对齐

				// 覆盖所有可能的文字元素
				* {
					color: #000000 !important;
					opacity: 1 !important;
					font-weight: 400 !important;
					text-align: left !important; // 确保左对齐
				}

				p,
				div,
				span,
				li,
				td,
				th,
				h1,
				h2,
				h3,
				h4,
				h5,
				h6,
				strong,
				b,
				em,
				i,
				code,
				pre,
				blockquote,
				ul,
				ol,
				table,
				a {
					color: #000000 !important;
					opacity: 1 !important;
					font-weight: 400 !important;
					text-align: left !important; // 确保左对齐
				}

				// 链接使用深蓝色
				a {
					color: #0066cc !important;
				}

				// 粗体文字使用更粗的字体
				strong,
				b,
				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					font-weight: 600 !important;
				}
			}

			// 输入模式
			.vditor-input {
				color: #000000 !important;
				opacity: 1 !important;

				* {
					color: #000000 !important;
					opacity: 1 !important;
				}
			}

			// 确保所有文本内容颜色清晰
			* {
				color: #000000 !important;
				opacity: 1 !important;
				text-align: left !important; // 确保左对齐
			}

			// 确保所有文本元素使用深色
			p,
			div,
			span,
			li,
			td,
			th,
			h1,
			h2,
			h3,
			h4,
			h5,
			h6,
			strong,
			b,
			em,
			i,
			code,
			pre,
			blockquote {
				color: #000000 !important;
				opacity: 1 !important;
				text-align: left !important; // 确保左对齐
			}

			// 确保链接颜色也清晰可见
			a {
				color: #0066cc !important; // 使用深蓝色
			}

			// 表格内容
			table {
				color: #000000 !important;
				background-color: #ffffff !important;
				opacity: 1 !important;

				td,
				th {
					color: #000000 !important;
					background-color: #ffffff !important;
					opacity: 1 !important;
				}
			}

			// 列表内容
			ul,
			ol {
				color: #000000 !important;
				opacity: 1 !important;

				li {
					color: #000000 !important;
					opacity: 1 !important;
				}
			}

			// 代码块
			code,
			pre {
				color: #000000 !important;
				background-color: #f5f5f5 !important;
				opacity: 1 !important;
			}
		}
	}
}
</style>
