<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search ref="Search" :reset-btn="true" />
		</cl-row>

		<el-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</el-row>

		<el-row>
			<!-- 分页组件 -->
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		<!-- 新增/编辑表单 -->
		<cl-upsert ref="Upsert" v-bind="Upsert">
			<template #slot-description="{ scope }">
				<el-input
					v-model="scope.form.description"
					type="textarea"
					:rows="3"
					placeholder="请输入问卷描述"
				/>
			</template>
		</cl-upsert>

		<!-- 问卷设计器弹窗 -->
		<el-dialog
			v-model="designerVisible"
			title="问卷设计器"
			width="80%"
			:close-on-click-modal="false"
			:destroy-on-close="true"
			class="designer-dialog"
		>
			<!-- 问卷信息展示 -->
			<div v-if="currentQuestionnaireInfo" class="questionnaire-info-bar">
				<span><b>标题：</b>{{ currentQuestionnaireInfo.title }}</span>
				<span style="margin-left: 24px"
					><b>描述：</b>{{ currentQuestionnaireInfo.description }}</span
				>
			</div>
			<survey-designer
				v-if="designerVisible"
				:questionnaire-id="currentQuestionnaireId"
				@save="onDesignerSave"
			/>
		</el-dialog>

		<!-- 问卷预览弹窗 -->
		<el-dialog
			v-model="previewVisible"
			title="问卷预览"
			width="80%"
			:close-on-click-modal="false"
		>
			<!-- 问卷信息展示 -->
			<div v-if="currentQuestionnaireInfo" class="questionnaire-info-bar">
				<span><b>标题：</b>{{ currentQuestionnaireInfo.title }}</span>
				<span style="margin-left: 24px"
					><b>描述：</b>{{ currentQuestionnaireInfo.description }}</span
				>
			</div>
			<survey v-if="previewVisible" :questions="previewQuestions" :readonly="true" />
		</el-dialog>

		<!-- 答案查看弹窗 -->
		<el-dialog
			v-model="answersVisible"
			title="问卷答案"
			width="80%"
			:close-on-click-modal="false"
		>
			<div v-if="answersVisible" class="questionnaire-answers">
				<div v-if="answersLoading" class="loading">
					<el-icon class="is-loading"><Loading /></el-icon>
					加载中...
				</div>
				<div v-else-if="answersData.length === 0" class="empty">暂无答案数据</div>
				<div v-else class="answers-list">
					<div
						v-for="(answer, index) in answersData"
						:key="answer.id"
						class="answer-item"
					>
						<div class="answer-header">
							<span class="answer-index">第{{ index + 1 }}份答案</span>
							<span class="answer-time">{{ formatDate(answer.createTime) }}</span>
						</div>
						<div class="answer-content">
							<div
								v-for="question in questionsData"
								:key="question.id"
								class="question-answer"
							>
								<div class="question-title">
									{{ question.title }}
								</div>
								<div class="answer-value">
									{{ getAnswerValue(answer, question.id) }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>

		<!-- 问卷预览对话框 -->
		<preview-dialog v-model="showPreview" :questions="questions" />
	</cl-crud>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useCrud, useTable, useSearch, useUpsert } from '@cool-vue/crud';
import dayjs from 'dayjs';
import { useCool } from '/@/cool';
const { service } = useCool();

// 引入组件
import SurveyDesigner from '/@/modules/questionnaire/components/survey-designer.vue';
import Survey from '/@/modules/questionnaire/components/survey.vue';
import PreviewDialog from '/@/modules/questionnaire/components/preview-dialog.vue';

// 格式化日期函数
const formatDate = (dateString: string) => {
	if (!dateString) return '';
	return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
};

const Search = useSearch({
	items: [
		{
			// 搜索关键字keyword传给后台papg
			prop: 'keyword',
			component: {
				name: 'el-input',
				props: {
					placeholder: '问卷标题/问卷描述',
					clearable: true,
					// 值改变的时候刷新列表
					onChange(val: string) {
						refresh({
							keyword: val,
							page: 1
						});
					}
				}
			}
		}
	]
});

/**
 * 刷新列表
 */
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// CRUD 配置
const Crud = useCrud(
	{
		service: service.questionnaire.questionnaire,

		// 删除前的检查
		onDelete(selection, { next }) {
			// 检查是否有已发布的问卷
			const publishedQuestionnaires = selection.filter(item => item.published);

			if (publishedQuestionnaires.length > 0) {
				const publishedTitles = publishedQuestionnaires.map(item => item.title).join('、');
				ElMessage.warning(
					`以下问卷已发布，不能删除：${publishedTitles}。请先取消发布后再删除。`
				);
				return;
			}

			// 继续删除操作
			next({
				ids: selection.map(e => e.id)
			});
		}
	},
	app => {
		app.refresh();
	}
);

// 表格配置
const Table = useTable({
	autoHeight: false,
	contextMenu: ['refresh'],
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'title',
			label: '问卷标题',
			minWidth: 100
		},
		{
			prop: 'description',
			label: '问卷描述',
			minWidth: 150,
			'show-overflow-tooltip': true
		},
		{
			prop: 'published',
			label: '发布状态',
			width: 100,
			formatter(row) {
				return row.published ? '已发布' : '未发布';
			}
		},
		{
			type: 'op',
			width: 400,
			minWidth: 300,
			buttons({ scope }) {
				const buttons = [
					{
						label: '预览',
						type: 'primary',
						onClick() {
							previewQuestionnaire(scope.row);
						}
					}
				];

				// 只有未发布的问卷才显示编辑、设计和删除按钮
				if (!scope.row.published) {
					buttons.push('edit');
					// 添加设计按钮
					buttons.push({
						label: '设计',
						type: 'info',
						onClick() {
							openDesigner(scope.row);
						}
					});
					// 添加发布按钮
					buttons.push({
						label: '发布',
						type: 'success',
						onClick() {
							togglePublish(scope.row);
						}
					});
					// 只有未发布的问卷才显示删除按钮
					buttons.push('delete');
				} else {
					// 已发布的问卷显示取消发布按钮
					buttons.push({
						label: '取消发布',
						type: 'warning',
						onClick() {
							togglePublish(scope.row);
						}
					});
				}

				return buttons;
			}
		}
	]
});

// 表单配置
const Upsert = useUpsert({
	items: [
		{
			prop: 'title',
			label: '问卷标题',
			required: true,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入问卷标题'
				}
			}
		},
		{
			prop: 'description',
			label: '问卷描述',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3,
					placeholder: '请输入问卷描述'
				}
			}
		},
		{
			prop: 'published',
			label: '发布状态',
			component: {
				name: 'el-switch',
				props: {
					'active-text': '已发布',
					'inactive-text': '未发布'
				}
			}
		}
	],

	// 打开表单时的钩子
	onOpen(data) {
		// 如果是编辑模式且问卷已发布，则阻止编辑
		if (Upsert.value?.mode === 'update' && data.published) {
			ElMessage.warning('已发布的问卷不能编辑');
			Upsert.value?.close();
			return;
		}
	}
});

// 状态管理
const designerVisible = ref(false);
const previewVisible = ref(false);
const answersVisible = ref(false);
const showPreview = ref(false);
const currentQuestionnaireId = ref<number | null>(null);
const currentQuestionnaireInfo = ref<any>(null); // 新增
const previewQuestions = ref<any[]>([]);
const questions = ref<any[]>([]);

// 答案相关状态
const answersLoading = ref(false);
const answersData = ref<any[]>([]);
const questionsData = ref<any[]>([]);

/**
 * 预览问卷
 */
async function previewQuestionnaire(row: any) {
	try {
		// 设置当前问卷信息
		currentQuestionnaireInfo.value = row;

		// 获取问卷的题目配置
		const response = await service.questionnaire.question.list({
			questionnaireId: row.id
		});

		if (response && response.length > 0) {
			// 转换后端数据格式为前端Question格式
			questions.value = response.map((item: any) => ({
				id: item.id?.toString() || Math.random().toString(36).slice(2),
				type: item.type || 'single',
				title: item.title || '',
				// 保持options为对象数组格式，适配新的预览弹框
				options: Array.isArray(item.options)
					? item.options.map((opt: any) =>
							typeof opt === 'string'
								? { bh: 'A', content: opt, score: null, other: false }
								: {
										bh: opt.bh || 'A',
										content: opt.content || opt.bh || '选项',
										score: opt.score || null,
										other: opt.other || false
									}
						)
					: [],
				required: item.required || false,
				bh: item.bh || '',
				placeholder: item.placeholder || ''
			}));
			showPreview.value = true;
		} else {
			// 如果没有题目数据，显示提示
			questions.value = [];
			showPreview.value = true;
			ElMessage.info('该问卷暂无题目');
		}
	} catch (error) {
		console.error('获取问卷配置失败:', error);
		ElMessage.warning('接口不可用');
	}
}

/**
 * 切换发布状态
 */
async function togglePublish(row: any) {
	try {
		const action = row.published ? '取消发布' : '发布';
		await ElMessageBox.confirm(`确定要${action}该问卷吗？`, '提示', {
			type: 'warning'
		});

		// 调用更新接口
		await service.questionnaire.questionnaire.update({
			id: row.id,
			published: !row.published
		});

		ElMessage.success(`${action}成功`);
		Crud.value?.refresh();
	} catch (error) {
		if (error !== 'cancel') {
			console.error('切换发布状态失败:', error);
			ElMessage.error('操作失败');
		}
	}
}

/**
 * 获取答案值
 */
const getAnswerValue = (answer: any, questionId: string) => {
	const answerData = answer.answers || {};
	const value = answerData[questionId];

	if (Array.isArray(value)) {
		return value.join(', ');
	}

	return value || '未填写';
};

/**
 * 加载答案数据
 */
const loadAnswersData = async () => {
	if (!currentQuestionnaireId.value) return;

	answersLoading.value = true;
	try {
		// 这里需要调用后端接口获取问卷答案数据
		// 暂时使用模拟数据
		questionsData.value = [
			{
				id: 'q1',
				title: '你喜欢的颜色？',
				type: 'single'
			},
			{
				id: 'q2',
				title: '你会的编程语言？',
				type: 'multiple'
			}
		];

		answersData.value = [
			{
				id: 1,
				createTime: '2024-01-15 10:30:00',
				answers: {
					q1: '红色',
					q2: ['JavaScript', 'Python']
				}
			},
			{
				id: 2,
				createTime: '2024-01-15 11:20:00',
				answers: {
					q1: '蓝色',
					q2: ['Java']
				}
			}
		];
	} catch (error) {
		ElMessage.error('加载答案数据失败');
	} finally {
		answersLoading.value = false;
	}
};

/**
 * 查看答案
 */
async function viewAnswers(row: any) {
	currentQuestionnaireId.value = row.id;
	answersVisible.value = true;
	await loadAnswersData();
}

/**
 * 设计器保存回调
 * @param questions 题目数组，由 survey-designer 组件 emit 传递
 */
async function onDesignerSave(questions: any[]) {
	designerVisible.value = false;
	// 这里可以将 questions 发送到后端或做其它处理
	//console.log('收到问卷题目信息:', questions);

	// TODO: 调用保存接口，如
	// const params = questions;
	// await service.questionnaire.question.save(params); // 使用正确的service方法
	// 或者暂时注释掉，只显示成功消息
	service.questionnaire.question.saveQuestions(questions);
	ElMessage.success('问卷保存成功');
	Crud.value?.refresh();
}

/**
 * 打开问卷设计器
 */
function openDesigner(row: any) {
	currentQuestionnaireId.value = row.id;
	currentQuestionnaireInfo.value = row; // 保存当前问卷信息
	designerVisible.value = true;
}

/**
 * 编辑问卷
 */
function editQuestionnaire(row: any) {
	currentQuestionnaireId.value = row.id;
	designerVisible.value = true;
}
</script>

<style scoped>
.el-button-group {
	.el-button {
		margin-right: 8px;
	}
}

/* 答案查看样式 */
.questionnaire-answers {
	padding: 20px;
}

.loading {
	text-align: center;
	padding: 40px;
	color: #999;
}

.empty {
	text-align: center;
	padding: 40px;
	color: #999;
}

.answers-list {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.answer-item {
	border: 1px solid #e4e7ed;
	border-radius: 8px;
	padding: 16px;
	background: #fafafa;
}

.answer-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	padding-bottom: 8px;
	border-bottom: 1px solid #e4e7ed;
}

.answer-index {
	font-weight: bold;
	color: #409eff;
}

.answer-time {
	color: #999;
	font-size: 14px;
}

.answer-content {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.question-answer {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 8px 0;
}

.question-title {
	font-weight: 500;
	color: #333;
	flex: 1;
	margin-right: 16px;
}

.answer-value {
	color: #666;
	max-width: 300px;
	word-break: break-all;
}

.questionnaire-info-bar {
	margin-bottom: 16px;
	font-size: 16px;
	color: #333;
}

/* 问卷设计器弹框样式 */
:deep(.designer-dialog) {
	.el-dialog {
		height: 80vh !important;
		max-height: 80vh !important;
		display: flex;
		flex-direction: column;
		margin: 0 !important;
		position: fixed !important;
		top: 10vh !important;
		left: 50% !important;
		transform: translateX(-50%) !important;
		margin-top: 0 !important;
	}
	.el-dialog__header {
		flex-shrink: 0;
	}
	.el-dialog__body {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		padding: 20px;
		min-height: 0;
	}
}
</style>

<style>
/* 全局样式：问卷设计器弹框 - 因为 dialog 是 append-to-body 的 */
body .designer-dialog {
	height: 80vh !important;
	max-height: 80vh !important;
	margin: 0 !important;
	position: fixed !important;
	top: 10vh !important;
	left: 50% !important;
	transform: translateX(-50%) !important;
	display: flex !important;
	flex-direction: column !important;
}

body .designer-dialog .el-dialog__header {
	flex-shrink: 0;
}

body .designer-dialog .el-dialog__body {
	flex: 1;
	overflow: auto;
	display: flex;
	flex-direction: column;
	padding: 20px;
	min-height: 0;
}
</style>
