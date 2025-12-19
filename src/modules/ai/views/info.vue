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
				<!-- 自定义HTML内容显示插槽 -->
				<template #column-content="{ scope }">
					<html-content :content="scope.row.content" />
				</template>
				<template #column-question="{ scope }">
					<html-content :content="scope.row.question" />
				</template>
				<template #column-answer="{ scope }">
					<html-content :content="scope.row.answer" />
				</template>
				<template #column-checkContent="{ scope }">
					<html-content :content="scope.row.checkContent" />
				</template>
			</cl-table>
		</cl-row>
		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>
		<cl-upsert ref="Upsert">
			<template #slot-answer="{ scope }">
				<div
					v-html="scope.answer"
					style="
						border: 1px solid #e4e7ed;
						border-radius: 6px;
						padding: 12px;
						background: #fafbfc;
					"
				></div>
			</template>
			<template #slot-question="{ scope }">
				<div
					v-html="scope.question"
					style="
						border: 1px solid #e4e7ed;
						border-radius: 6px;
						padding: 12px;
						background: #fafbfc;
					"
				></div>
			</template>
			<template #slot-content="{ scope }">
				<div
					v-html="scope.content"
					style="
						border: 1px solid #e4e7ed;
						border-radius: 6px;
						padding: 12px;
						background: #fafbfc;
					"
				></div>
			</template>
			<template #slot-checkContent="{ scope }">
				<div
					v-html="scope.checkContent"
					style="
						border: 1px solid #e4e7ed;
						border-radius: 6px;
						padding: 12px;
						background: #fafbfc;
					"
				></div>
			</template>
		</cl-upsert>
	</cl-crud>

	<!-- 审核弹框 -->
	<el-dialog
		v-model="reviewDialogVisible"
		title="审核反馈"
		width="80%"
		:close-on-click-modal="false"
		destroy-on-close
	>
		<div class="review-dialog-content">
			<!-- 左侧内容 -->
			<div class="review-left">
				<!-- 问题区域 -->
				<div class="review-section">
					<div class="section-title">问题</div>
					<div class="section-content">
						<html-content :content="currentReviewData.question" />
					</div>
				</div>

				<!-- 答案区域 -->
				<div class="review-section">
					<div class="section-title">原始答案</div>
					<div class="section-content">
						<html-content :content="currentReviewData.answer" />
					</div>
				</div>

				<div class="review-section">
					<div class="section-title">修正答案</div>
					<div class="section-content">
						<html-content :content="currentReviewData.content" />
					</div>
				</div>
			</div>

			<!-- 右侧内容 -->
			<div class="review-right">
				<div class="section-title">反馈内容</div>
				<div class="section-content">
					<cl-editor-wang
						v-model="currentReviewData.checkContent"
						:readonly="true"
						height="400px"
					/>
				</div>
			</div>
		</div>

		<template #footer>
			<div class="review-footer">
				<el-button @click="reviewDialogVisible = false">取消</el-button>
				<el-button type="danger" @click="handleReview(false)">不通过</el-button>
				<el-button type="success" @click="handleReview(true)">通过</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ref, defineComponent, h, watch, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';

import { convertToHtml } from '/@/modules/helper/utils/markdown-converter';
import { useBase } from '/$/base';

const { service } = useCool();

const { user } = useBase();

// 自定义HTML内容组件
const HtmlContent = defineComponent({
	name: 'html-content',
	props: {
		content: {
			type: String,
			default: ''
		}
	},
	setup(props) {
		const htmlContent = ref('');

		// 异步转换HTML
		const convertContent = async () => {
			//console.log('props.content===' + props.content);
			if (props.content) {
				try {
					htmlContent.value = await convertToHtml(props.content);
				} catch (error) {
					console.error('HTML转换失败:', error);
					htmlContent.value = props.content.replace(/\n/g, '<br>');
				}
			}
		};

		// 监听content变化
		watch(() => props.content, convertContent, { immediate: true });

		return () =>
			h('div', {
				innerHTML: htmlContent.value,
				style: {
					maxHeight: '100px',
					overflow: 'auto',
					wordBreak: 'break-word'
				}
			});
	}
});

// CRUD配置
const Crud = useCrud(
	{
		service: service.ai.info
	},
	app => {
		app.refresh();
	}
);

// --- 数据字典 ---
const options = reactive({
	type: [
		{ label: '赞', value: 1, type: 'default' },
		{ label: '踩', value: 2, type: 'danger' },
		{ label: '反馈', value: 3, type: 'success' }
	],
	checkType: [
		{ label: '审核通过', value: 1, type: 'default' },
		{ label: '审核不通过', value: 2, type: 'danger' }
	]
});

// --- 审核相关变量 ---
const reviewDialogVisible = ref(false);
const currentReviewData = ref({
	question: '',
	answer: '',
	content: '',
	checkContent: '',
	id: null
});

// --- 审核相关函数 ---
function openReviewDialog(row: any) {
	currentReviewData.value = {
		question: row.question || '',
		answer: row.answer || '',
		content: row.content || '',
		checkContent: row.content || '',
		id: row.id
	};
	reviewDialogVisible.value = true;
}

async function handleReview(isApproved: boolean) {
	try {
		const reviewData = {
			id: currentReviewData.value.id,
			checkType: isApproved ? 1 : 2,
			checkTime: new Date(),
			checkUser: user.info?.name,
			checkContent: currentReviewData.value.checkContent
		};

		// 调用审核API
		await service.ai.info.update(reviewData);

		ElMessage.success(isApproved ? '审核通过' : '审核不通过');
		reviewDialogVisible.value = false;

		// 刷新表格数据
		Crud.value?.refresh();
	} catch (error) {
		console.error('审核失败:', error);
		ElMessage.error('审核失败，请重试');
	}
}

// 表格配置
const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{
			label: '问题',
			prop: 'question',
			minWidth: 180,
			showOverflowTooltip: true,
			tooltip: true
		},
		{
			label: '答案',
			prop: 'answer',
			minWidth: 180,
			showOverflowTooltip: true,
			tooltip: true
		},
		{
			label: '类型',
			prop: 'type',
			minWidth: 80,
			dict: options.type,
			dictColor: true
		},
		{
			label: '反馈内容',
			prop: 'content',
			minWidth: 180,
			showOverflowTooltip: true,
			tooltip: true
		},
		{ label: '提交时间', prop: 'submitTime', minWidth: 120 },
		{ label: '提交人', prop: 'submitUser', minWidth: 100 },
		{
			label: '审核内容',
			prop: 'checkContent',
			minWidth: 180,
			showOverflowTooltip: true,
			tooltip: true
		},
		{ label: '审核时间', prop: 'checkTime', minWidth: 120 },
		{ label: '审核人', prop: 'checkUser', minWidth: 100 },
		{
			label: '审核类型',
			prop: 'checkType',
			minWidth: 80,
			dict: options.checkType,
			dictColor: true
		},
		{
			type: 'op',
			width: 220,
			buttons({ scope }) {
				const buttons: any[] = ['info'];

				// 只有type为3时才显示审核按钮
				if (scope.row.type === 3 && scope.row.checkType == null) {
					buttons.push({
						label: '审核',
						type: 'success',
						onClick({ scope }) {
							openReviewDialog(scope.row);
						}
					});
				}

				return buttons;
			}
		}
	]
});

const Upsert = useUpsert({
	items: [
		{
			type: 'tabs',
			props: {
				type: 'card',
				labels: [
					{
						label: '基础信息',
						value: 'base'
					},
					{
						label: '审核信息',
						value: 'audit',
						hidden: ({ form }) => !form.checkUser
					}
				]
			}
		},
		{
			label: '问题',
			prop: 'question',
			group: 'base',
			component: { name: 'slot-question' },
			col: { span: 12 }
		},
		{
			label: '答案',
			prop: 'answer',
			group: 'base',
			component: { name: 'slot-answer' },
			col: { span: 12 }
		},
		{
			label: '反馈内容',
			prop: 'content',
			group: 'base',
			component: { name: 'slot-content' }
		},
		{
			label: '类型',
			prop: 'type',
			group: 'base',
			component: {
				name: 'cl-select',
				props: {
					options: options.type,
					checkStrictly: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '提交时间',
			prop: 'submitTime',
			group: 'base',
			component: {
				name: 'el-date-picker',
				props: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }
			},
			col: { span: 8 }
		},
		{
			label: '提交人',
			prop: 'submitUser',
			group: 'base',
			component: { name: 'el-input' },
			col: { span: 8 }
		},
		{
			label: '审核内容',
			prop: 'checkContent',
			group: 'audit',
			component: { name: 'slot-checkContent' }
		},
		{
			label: '审核类型',
			prop: 'checkType',
			group: 'audit',
			component: {
				name: 'cl-select',
				props: {
					options: options.checkType,
					checkStrictly: true
				}
			},
			col: { span: 8 }
		},
		{
			label: '审核时间',
			prop: 'checkTime',
			group: 'audit',
			component: {
				name: 'el-date-picker',
				props: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }
			},
			col: { span: 8 }
		},
		{
			label: '审核人',
			prop: 'checkUser',
			group: 'audit',
			component: { name: 'el-input' },
			col: { span: 8 }
		}
	]
});

// 搜索配置
const Search = useSearch({
	items: [
		{
			label: '问题',
			prop: 'question',
			component: { name: 'el-input', props: { clearable: true } }
		},
		{
			label: '答案',
			prop: 'answer',
			component: { name: 'el-input', props: { clearable: true } }
		},
		{
			label: '类型',
			prop: 'type',
			component: { name: 'cl-select', props: { options: options.type } }
		},
		{
			label: '提交人',
			prop: 'submitUser',
			component: { name: 'el-input', props: { clearable: true } }
		},
		{
			label: '审核人',
			prop: 'checkUser',
			component: { name: 'el-input', props: { clearable: true } }
		}
	]
});
</script>

<style lang="scss" scoped>
.review-dialog-content {
	display: flex;
	gap: 20px;
	height: 500px;

	.review-left {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.review-right {
		flex: 2;
		display: flex;
		flex-direction: column;
	}

	.review-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		border: 1px solid #e4e7ed;
		border-radius: 6px;
		overflow: hidden;

		.section-title {
			padding: 12px 16px;
			background-color: #f5f7fa;
			border-bottom: 1px solid #e4e7ed;
			font-weight: 600;
			color: #303133;
		}

		.section-content {
			flex: 1;
			padding: 16px;
			background-color: #fff;
		}
	}
}

.review-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}
</style>
