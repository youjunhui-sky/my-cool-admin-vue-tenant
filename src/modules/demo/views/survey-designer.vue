<template>
	<div class="designer">
		<div class="designer-sidebar">
			<el-button type="primary" @click="addQuestion" style="width: 100%; margin-bottom: 12px"
				>添加题目</el-button
			>
			<draggable
				v-model="questions"
				handle=".drag-handle"
				item-key="id"
				animation="200"
				@end="onDragEnd"
			>
				<template #item="{ element, index }">
					<div
						@click="editQuestion(index)"
						:class="['designer-question-item', { active: index === editingIndex }]"
					>
						<span class="drag-handle">☰</span>
						<span>{{ element.number }}. {{ element.title || '未命名题目' }}</span>
						<el-button
							@click.stop="copyQuestion(index)"
							:icon="DocumentCopy"
							circle
							size="small"
							title="复制题目"
							style="margin-left: auto"
						/>
						<el-button
							@click.stop="moveUp(index)"
							:icon="ArrowUp"
							circle
							size="small"
							title="上移"
							:disabled="index === 0"
							style="margin-left: 4px"
						/>
						<el-button
							@click.stop="moveDown(index)"
							:icon="ArrowDown"
							circle
							size="small"
							title="下移"
							:disabled="index === questions.length - 1"
							style="margin-left: 4px"
						/>
					</div>
				</template>
			</draggable>
		</div>
		<div class="designer-main">
			<el-form v-if="editingQuestion" label-width="90px" style="max-width: 420px">
				<el-form-item label="题目编号">
					<el-input
						v-model="editingQuestion.number"
						maxlength="10"
						placeholder="如1、A、Q1等"
					/>
				</el-form-item>
				<el-form-item label="题型">
					<el-select v-model="editingQuestion.type">
						<el-option label="单选题" value="single" />
						<el-option label="多选题" value="multiple" />
						<el-option label="数字填空" value="number" />
						<el-option label="小文本填空" value="text" />
						<el-option label="大文本填空" value="textarea" />
					</el-select>
				</el-form-item>
				<el-form-item label="题目标题">
					<el-input v-model="editingQuestion.title" />
				</el-form-item>
				<el-form-item label="必填">
					<el-switch v-model="editingQuestion.required" />
				</el-form-item>
				<el-form-item
					v-if="editingQuestion.type === 'single' || editingQuestion.type === 'multiple'"
					label="选项"
				>
					<div
						v-for="(opt, i) in editingQuestion.options"
						:key="i"
						style="display: flex; align-items: center; margin-bottom: 6px"
					>
						<el-input v-model="editingQuestion.options[i]" style="width: 80%" />
						<el-button :icon="Delete" @click="removeOption(i)" circle size="small" />
					</div>
					<el-button @click="addOption" size="small">添加选项</el-button>
				</el-form-item>
				<el-form-item
					v-if="editingQuestion.type === 'single' && editingQuestion.options.length"
					label="跳转逻辑"
				>
					<div
						v-for="opt in editingQuestion.options"
						:key="opt"
						style="margin-bottom: 6px"
					>
						<span>{{ opt }} → </span>
						<el-select
							v-model="editingQuestion.jump[opt]"
							placeholder="顺序"
							clearable
							style="width: 120px"
						>
							<el-option
								v-for="q in filteredQuestions"
								:key="q.id"
								:label="
									questions.findIndex(qq => qq.id === q.id) + 1 + '. ' + q.title
								"
								:value="questions.findIndex(qq => qq.id === q.id)"
							/>
							<el-option label="结束" value="end" />
						</el-select>
						<span v-if="!editingQuestion.jump[opt]">顺序</span>
						<span v-else-if="editingQuestion.jump[opt] === 'end'">结束</span>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="saveQuestion">保存题目</el-button>
					<el-button @click="deleteQuestion" type="danger" v-if="questions.length > 1"
						>删除题目</el-button
					>
				</el-form-item>
			</el-form>
			<div v-else style="padding: 40px; text-align: center; color: #aaa">
				<div v-if="questions.length === 0">请点击左侧“添加题目”开始设计问卷</div>
				<div v-else>请选择左侧题目或添加新题</div>
			</div>
		</div>
		<div class="designer-preview">
			<div class="preview-actions">
				<el-button type="primary" @click="showPreview = true" size="small" plain
					>预览问卷</el-button
				>
				<el-button type="success" @click="exportConfig" size="small" plain
					>导出配置</el-button
				>
				<el-upload
					:show-file-list="false"
					accept=".json"
					:before-upload="beforeImportConfig"
				>
					<el-button type="warning" size="small" plain>导入配置</el-button>
				</el-upload>
			</div>
			<div v-if="questions.length === 0" style="color: #aaa; padding: 24px 0">
				暂无题目，添加后可实时预览
			</div>
			<pre
				v-else
				style="
					background: #f8f8f8;
					padding: 12px 8px 8px 8px;
					border-radius: 6px;
					max-height: 320px;
					overflow: auto;
				"
				>{{ questions }}</pre
			>
			<el-dialog
				v-model="showPreview"
				title="问卷预览"
				width="600px"
				:close-on-click-modal="false"
			>
				<el-form v-if="questions.length > 0" label-width="100px">
					<div v-for="q in questions" :key="q.id" class="preview-question-block">
						<div class="preview-question-title">
							<span class="q-index">{{ q.number }}.</span>
							<span class="q-label">{{ q.title || '未命名题目' }}</span>
							<span class="q-type">【{{ typeLabel(q) }}】</span>
							<span v-if="q.required" class="q-required">*</span>
						</div>
						<el-form-item>
							<!-- 单选题 -->
							<el-radio-group v-if="q.type === 'single'" disabled>
								<el-radio v-for="opt in q.options" :key="opt" :label="opt">{{
									opt
								}}</el-radio>
							</el-radio-group>
							<!-- 多选题 -->
							<el-checkbox-group v-else-if="q.type === 'multiple'" disabled>
								<el-checkbox v-for="opt in q.options" :key="opt" :label="opt">{{
									opt
								}}</el-checkbox>
							</el-checkbox-group>
							<!-- 数字填空 -->
							<el-input
								v-else-if="q.type === 'number'"
								:placeholder="q.placeholder || '请输入数字'"
								type="number"
								disabled
								class="text-input"
							/>
							<!-- 小文本填空 -->
							<el-input
								v-else-if="q.type === 'text'"
								:placeholder="q.placeholder || '请输入内容'"
								type="text"
								disabled
								class="text-input"
							/>
							<!-- 大文本填空 -->
							<el-input
								v-else-if="q.type === 'textarea'"
								:placeholder="q.placeholder || '请输入内容'"
								type="textarea"
								:rows="4"
								disabled
								class="text-input"
							/>
						</el-form-item>
					</div>
				</el-form>
				<div v-else style="color: #aaa; padding: 32px; text-align: center">暂无题目</div>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import draggable from 'vuedraggable';
import { DocumentCopy, ArrowUp, ArrowDown, Delete } from '@element-plus/icons-vue';

interface Question {
	id: string;
	type: 'single' | 'multiple' | 'number' | 'text' | 'textarea';
	title: string;
	options: string[];
	required: boolean;
	jump: { [option: string]: number | 'end' };
	number: string; // 题目编号字段，字符型
	placeholder?: string;
}

function createDefaultQuestion(num?: string): Question {
	return {
		id: Math.random().toString(36).slice(2),
		type: 'single',
		title: '',
		options: ['选项1', '选项2'],
		required: false,
		jump: {},
		number: num || '',
		placeholder: ''
	};
}

const questions = ref<Question[]>([]);
const editingIndex = ref(0);
const editingQuestion = ref<Question | null>(null);
const showPreview = ref(false);

const filteredQuestions = computed(() => {
	if (!editingQuestion.value) return [];
	// 只允许跳到当前题目之后的题目
	const idx = questions.value.findIndex(q => q.id === editingQuestion.value!.id);
	return questions.value.filter((q, i) => i > idx);
});

watch(editingIndex, idx => {
	editingQuestion.value =
		idx !== null && questions.value.length > 0 && questions.value[idx]
			? JSON.parse(JSON.stringify(questions.value[idx]))
			: null;
});

function addQuestion() {
	let nextNum = '';
	if (questions.value.length > 0) {
		// 自动递增编号（如A、B、C...或1、2、3...）
		const last = questions.value[questions.value.length - 1].number;
		if (/^\d+$/.test(last)) {
			nextNum = (parseInt(last) + 1).toString();
		} else if (/^[A-Z]$/.test(last)) {
			nextNum = String.fromCharCode(last.charCodeAt(0) + 1);
		} else {
			nextNum = '';
		}
	} else {
		nextNum = '1';
	}
	questions.value.push(createDefaultQuestion(nextNum));
	editingIndex.value = questions.value.length - 1;
	editingQuestion.value = JSON.parse(JSON.stringify(questions.value[editingIndex.value]));
}
function editQuestion(idx: number) {
	editingIndex.value = idx;
}
function saveQuestion() {
	if (!editingQuestion.value) return;
	questions.value[editingIndex.value] = JSON.parse(JSON.stringify(editingQuestion.value));
	ElMessage.success('题目已保存');
}
function deleteQuestion() {
	if (questions.value.length <= 1) return;
	questions.value.splice(editingIndex.value, 1);
	editingIndex.value = Math.max(0, editingIndex.value - 1);
}
function addOption() {
	if (editingQuestion.value) editingQuestion.value.options.push('新选项');
}
function removeOption(i: number) {
	if (editingQuestion.value) editingQuestion.value.options.splice(i, 1);
}
function preview() {
	ElMessage.info('可在右侧实时预览JSON结构，或导出配置用于问卷页面');
}
function exportConfig() {
	const data = JSON.stringify(questions.value, null, 2);
	const blob = new Blob([data], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'survey-config.json';
	a.click();
	URL.revokeObjectURL(url);
}

function typeLabel(q: Question) {
	if (q.type === 'single') return '单选题';
	if (q.type === 'multiple') return '多选题';
	if (q.type === 'text') return '小文本填空';
	if (q.type === 'textarea') return '大文本填空';
	if (q.type === 'number') return '数字填空';
	return '';
}

function copyQuestion(idx: number) {
	const orig = questions.value[idx];
	// 深拷贝并生成新 id
	const newQ = JSON.parse(JSON.stringify(orig));
	newQ.id = Math.random().toString(36).slice(2);
	// 编号自动+1或加后缀
	if (/^\d+$/.test(orig.number)) {
		newQ.number = (parseInt(orig.number) + 1).toString();
	} else if (/^[A-Z]$/.test(orig.number)) {
		newQ.number = String.fromCharCode(orig.number.charCodeAt(0) + 1);
	} else {
		newQ.number = orig.number + '_copy';
	}
	// 插入到当前题目下方
	questions.value.splice(idx + 1, 0, newQ);
	editingIndex.value = idx + 1;
	editingQuestion.value = JSON.parse(JSON.stringify(newQ));
}

function moveUp(idx: number) {
	if (idx > 0) {
		const arr = questions.value;
		[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
		if (editingIndex.value === idx) editingIndex.value = idx - 1;
		else if (editingIndex.value === idx - 1) editingIndex.value = idx;
	}
}
function moveDown(idx: number) {
	if (idx < questions.value.length - 1) {
		const arr = questions.value;
		[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
		if (editingIndex.value === idx) editingIndex.value = idx + 1;
		else if (editingIndex.value === idx + 1) editingIndex.value = idx;
	}
}

function onDragEnd(evt: any) {
	// 拖拽后保持当前编辑题目高亮和同步
	if (editingQuestion.value) {
		const idx = questions.value.findIndex(q => q.id === editingQuestion.value!.id);
		if (idx !== -1) {
			editingIndex.value = idx;
			editingQuestion.value = JSON.parse(JSON.stringify(questions.value[idx]));
		} else {
			editingIndex.value = 0;
			editingQuestion.value =
				questions.value.length > 0 ? JSON.parse(JSON.stringify(questions.value[0])) : null;
		}
	}
}

function beforeImportConfig(file: File) {
	const reader = new FileReader();
	reader.onload = e => {
		try {
			const data = JSON.parse(e.target?.result as string);
			if (Array.isArray(data) && data.every(q => q.id && q.type && q.title)) {
				questions.value = data;
				editingIndex.value = 0;
				editingQuestion.value =
					questions.value.length > 0
						? JSON.parse(JSON.stringify(questions.value[0]))
						: null;
				ElMessage.success('导入成功');
			} else {
				ElMessage.error('配置格式不正确');
			}
		} catch {
			ElMessage.error('解析失败，请检查文件内容');
		}
	};
	reader.readAsText(file);
	return false; // 阻止 el-upload 默认上传
}
</script>

<style scoped>
.designer {
	display: flex;
	max-width: 1200px;
	margin: 40px auto;
	background: #fff;
	border-radius: 10px;
	box-shadow: 0 2px 16px 0 #e6e6e6;
	min-height: 600px;
}
.designer-sidebar {
	width: 300px;
	border-right: 1px solid #f0f0f0;
	padding: 24px 12px 24px 12px;
	background: #fafbfc;
}
.designer-question-item {
	padding: 8px 10px;
	border-radius: 6px;
	margin-bottom: 6px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
	transition: background 0.2s;
}
.designer-question-item.active {
	background: #e6f7ff;
	color: #409eff;
}
.drag-handle {
	cursor: grab;
	color: #bbb;
	font-size: 16px;
	transition: color 0.2s;
}
.drag-handle:hover {
	color: #409eff;
	cursor: grabbing;
}
.designer-main {
	flex: 1;
	padding: 32px 32px 32px 32px;
	min-width: 400px;
}
.designer-preview {
	width: 300px;
	border-left: 1px solid #f0f0f0;
	padding: 24px 16px 24px 16px;
	background: #fafbfc;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}
.designer-preview .preview-actions {
	display: flex;
	gap: 12px;
	margin-bottom: 16px;
	width: 100%;
}
.preview-question-block {
	margin-bottom: 24px;
	padding: 18px 12px 12px 12px;
	border-radius: 8px;
	background: #f8f9fa;
	border: 1px solid #f0f0f0;
}
.preview-question-title {
	font-size: 15px;
	font-weight: 500;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	gap: 8px;
}
.q-index {
	color: #409eff;
	font-weight: bold;
}
.q-type {
	color: #999;
	font-size: 13px;
	margin-left: 8px;
}
.q-required {
	color: #f56c6c;
	font-size: 18px;
	margin-left: 4px;
}
.text-input {
	width: 100%;
}
.designer-preview pre {
	white-space: pre-wrap;
	word-break: break-all;
	box-sizing: border-box;
	width: 100%;
}
</style>
