<template>
	<div class="questionnaire-base-info">
		<!-- 问卷标题 -->
		<div class="questionnaire-title" v-if="questionnaireTitle">
			<h3>{{ questionnaireTitle }}</h3>
			<p v-if="questionnaireDescription" class="questionnaire-description">
				{{ questionnaireDescription }}
			</p>
		</div>

		<!-- 基础信息表单 -->
		<el-form
			ref="formRef"
			:model="form"
			label-position="top"
			label-width="120px"
			class="cl-form"
		>
			<!-- 档案号 -->
			<el-row :gutter="15" class="form-row first-row">
				<el-col :span="12">
					<el-form-item
						label="档案号"
						prop="patientNo"
						class="cl-form-item"
						:rules="[
							{
								required: true,
								message: '请输入档案号',
								trigger: 'blur'
							},
							{
								validator: validatePatientNo,
								trigger: 'blur'
							}
						]"
					>
						<el-input
							v-model="form.patientNo"
							placeholder="请输入档案号"
							:disabled="isPatientNoDisabled"
							@blur="handlePatientNoBlur"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 题目列表 -->
			<el-row :gutter="15" class="form-row" v-if="visibleQuestions.length > 0">
				<el-col
					:span="8"
					v-for="question in visibleQuestions"
					:key="question.bh || question.id"
					v-show="isQuestionVisible(question)"
					class="question-item"
				>
					<el-card class="question-card" shadow="hover">
						<el-form-item
							:label="`${question.bh || ''}. ${question.title}`"
							:prop="`question_${question.bh || question.id}`"
							class="cl-form-item"
							:rules="
								question.required
									? [
											{
												required: true,
												message: `请填写${question.title}`,
												trigger: 'blur'
											}
										]
									: []
							"
						>
							<template #label>
								<div class="question-label">
									<span class="question-title-text">
										{{ `${question.bh || ''}. ${question.title}` }}
									</span>

									<el-tag effect="plain" size="small" class="question-type-tag">
										{{
											question.type === 'single'
												? '单选题'
												: question.type === 'multiple'
													? '多选题'
													: '填写题'
										}}
									</el-tag>
								</div>
							</template>
							<!-- 单选题 -->
							<el-radio-group
								v-if="question.type === 'single'"
								v-model="form[`question_${question.bh || question.id}`]"
								:disabled="mode === 'info'"
								@change="handleAnswerChange(question, $event)"
							>
								<div
									v-for="option in question.options"
									:key="option.option || option.content"
									:class="[
										'radio-option-item',
										isLongOptionLabel(option) ? 'option-item--long' : '',
										isVeryLongOptionLabel(option) ? 'option-item--xlong' : '',
										isXXLongOptionLabel(option) ? 'option-item--xxlong' : ''
									]"
								>
									<el-radio :value="option.option || option.content">
										{{ option.content }}
									</el-radio>
									<!-- 如果选项 other 为 true，始终显示输入框 -->
									<el-input
										v-if="option.other"
										v-model="
											form[
												`question_${question.bh || question.id}_other_${option.option || option.content}`
											]
										"
										@input="handleOtherInputChange(question, option, $event)"
										:placeholder="`请输入`"
										:disabled="mode === 'info'"
										class="option-other-input"
									/>
								</div>
							</el-radio-group>

							<!-- 多选题 -->
							<el-checkbox-group
								v-else-if="question.type === 'multiple'"
								v-model="form[`question_${question.bh || question.id}`]"
								:disabled="mode === 'info'"
								@change="handleAnswerChange(question, $event)"
							>
								<div
									v-for="option in question.options"
									:key="option.option || option.content"
									:class="[
										'checkbox-option-item',
										isLongOptionLabel(option) ? 'option-item--long' : '',
										isVeryLongOptionLabel(option) ? 'option-item--xlong' : '',
										isXXLongOptionLabel(option) ? 'option-item--xxlong' : ''
									]"
								>
									<el-checkbox :value="option.option || option.content">
										{{ option.content }}
									</el-checkbox>
									<!-- 如果选项 other 为 true，始终显示输入框 -->
									<el-input
										v-if="option.other"
										v-model="
											form[
												`question_${question.bh || question.id}_other_${option.option || option.content}`
											]
										"
										@input="handleOtherInputChange(question, option, $event)"
										:placeholder="`请输入`"
										:disabled="mode === 'info'"
										class="option-other-input"
									/>
								</div>
							</el-checkbox-group>

							<!-- 数字填空题 -->
							<el-input-number
								v-else-if="question.type === 'number'"
								v-model="form[`question_${question.bh || question.id}`]"
								:placeholder="question.placeholder || '请输入数字'"
								:disabled="mode === 'info'"
								style="width: 100%"
								@change="handleAnswerChange(question, $event)"
							/>

							<!-- 小填空题 -->
							<el-input
								v-else-if="question.type === 'text'"
								v-model="form[`question_${question.bh || question.id}`]"
								:placeholder="question.placeholder || '请输入'"
								:disabled="mode === 'info'"
								@blur="handleAnswerChange(question, $event)"
							/>

							<!-- 大填空题 -->
							<el-input
								v-else-if="question.type === 'textarea'"
								v-model="form[`question_${question.bh || question.id}`]"
								type="textarea"
								:rows="4"
								:placeholder="question.placeholder || '请输入'"
								:disabled="mode === 'info'"
								@blur="handleAnswerChange(question, $event)"
							/>

							<!-- 年月 -->
							<el-date-picker
								v-else-if="question.type === 'year-month'"
								v-model="form[`question_${question.bh || question.id}`]"
								type="month"
								value-format="YYYY-MM"
								placeholder="选择年月"
								style="width: 100%"
								:disabled="mode === 'info'"
								@change="handleAnswerChange(question, $event)"
							/>

							<!-- 年月日 -->
							<el-date-picker
								v-else-if="question.type === 'date'"
								v-model="form[`question_${question.bh || question.id}`]"
								type="date"
								value-format="YYYY-MM-DD"
								placeholder="选择日期"
								style="width: 100%"
								:disabled="mode === 'info'"
								@change="handleAnswerChange(question, $event)"
							/>

							<!-- 年月日时分秒 -->
							<el-date-picker
								v-else-if="question.type === 'datetime'"
								v-model="form[`question_${question.bh || question.id}`]"
								type="datetime"
								value-format="YYYY-MM-DD HH:mm:ss"
								placeholder="选择日期时间"
								style="width: 100%"
								:disabled="mode === 'info'"
								@change="handleAnswerChange(question, $event)"
							/>
						</el-form-item>
					</el-card>
				</el-col>
			</el-row>

			<!-- 加载状态 -->
			<div v-if="loading" class="loading-container">
				<el-skeleton :rows="5" animated />
			</div>

			<!-- 无数据提示 -->
			<div v-if="!loading && questions.length === 0" class="empty-container">
				<el-empty description="暂无题目" />
			</div>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
// --- 依赖导入 ---
import { ref, reactive, watch, computed, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useCool } from '/@/cool';

/**
 * 组件名称
 */
defineOptions({
	name: 'questionnaire-base-info'
});

// --- 基础设置 ---
const { service } = useCool();

// --- 组件属性定义 ---
const props = defineProps({
	// 绑定值
	modelValue: {
		type: Object,
		default: () => ({})
	},
	// 操作模式: add/update/info
	mode: {
		type: String,
		default: 'add'
	},
	// 记录ID
	id: {
		type: [Number, String],
		default: undefined
	},
	// 问卷ID（新增时使用）
	questionnaireId: {
		type: [Number, String],
		default: undefined
	},
	// 父组件传入的档案号（用于外部控制 patientNo）
	patientNo: {
		type: String,
		default: ''
	}
});

// 组件事件
const emit = defineEmits(['update:modelValue', 'validate']);

// 表单引用
const formRef = ref<any>(null);

// --- 状态管理 ---
const loading = ref(false);
/**
 * 问卷标题
 */
const questionnaireTitle = ref('');
/**
 * 问卷描述
 */
const questionnaireDescription = ref('');
/**
 * 问卷题目列表（包含题目配置、跳转规则等）
 */
const questions = ref<any[]>([]);

/**
 * 问卷ID
 */
const questionnaireIdValue = ref<number | string | undefined>(undefined);

// 表单数据
const form = reactive<Record<string, any>>({
	patientNo: ''
});

// 档案号验证状态
const patientNoValid = ref(false);
const patientNoValidating = ref(false);

// 可见题目集合（用于跳转逻辑）
const visibleQuestionSet = ref<Set<string>>(new Set());

/**
 * 计算可见题目列表（已排序）
 */
const visibleQuestions = computed(() => {
	return questions.value
		.filter(q => isQuestionVisible(q))
		.sort((a, b) => {
			// 按 sort 字段排序
			const sortA = a.sort || 0;
			const sortB = b.sort || 0;
			return sortA - sortB;
		});
});

/**
 * 判断题目是否可见
 */
function isQuestionVisible(question: any): boolean {
	const bh = String(question.bh || question.id);
	if (!bh) return true;

	// 如果已经在可见集合中，直接返回true
	return visibleQuestionSet.value.has(bh);
}

/**
 * 处理答案变化：
 * - 同步清理未选中选项的 other 输入值
 * - 对带 jump 的单选题，触发跳转可见性计算
 *
 * @param {any} question 当前题目配置
 * @param {any} value    当前题目的答案值
 */
function handleAnswerChange(question: any, value: any) {
	const fieldName = `question_${question.bh || question.id}`;

	// 1. 清理未选中选项的 other 输入值
	if (Array.isArray(question.options) && question.options.length > 0) {
		question.options.forEach((opt: any) => {
			if (!opt?.other) return;

			const optValue = opt.option || opt.content;
			const otherFieldName = `question_${question.bh || question.id}_other_${optValue}`;

			let selected = false;

			if (question.type === 'single') {
				selected = form[fieldName] === optValue;
			} else if (question.type === 'multiple') {
				selected =
					Array.isArray(form[fieldName]) && (form[fieldName] as any[]).includes(optValue);
			}

			// 未选中则清空对应的 other 输入值
			if (
				!selected &&
				form[otherFieldName] !== undefined &&
				form[otherFieldName] !== null &&
				form[otherFieldName] !== ''
			) {
				form[otherFieldName] = '';
			}
		});
	}

	// 2. 只有带跳转配置的单选题才参与跳转可见性计算
	if (question.type !== 'single' || !question.jump) {
		return;
	}

	recalculateVisibleQuestions();
}

/**
 * 判断选项内容是否较长，用于微调选项之间的间距
 *
 * @param {any} option 选项配置
 * @returns {boolean} 是否为长文本选项
 */
function isLongOptionLabel(option: any): boolean {
	const text = String(option?.content ?? '').trim();
	console.log(text + '--文本长度' + text.length);
	// 根据实际显示效果调整阈值，这里简单按字符长度判断
	return text.length > 20 && text.length <= 40;
}

/**
 * 判断选项内容是否为“超长文本”，用于进一步增加选项间距
 *
 * @param {any} option 选项配置
 * @returns {boolean} 是否为超长文本选项
 */
function isVeryLongOptionLabel(option: any): boolean {
	const text = String(option?.content ?? '').trim();
	return text.length > 40 && text.length <= 60;
}

/**
 * 判断选项内容是否为“超长文本”，用于进一步增加选项间距
 *
 * @param {any} option 选项配置
 * @returns {boolean} 是否为超长文本选项
 */
function isXXLongOptionLabel(option: any): boolean {
	const text = String(option?.content ?? '').trim();
	return text.length > 60;
}

/**
 * 处理 other 输入框内容变化：
 * - 有值时：自动选中对应的选项
 * - 无值时：自动取消对应选项的选中
 *
 * @param {any} question 当前题目配置
 * @param {any} option   当前选项配置
 * @param {any} value    other 输入框的值
 */
function handleOtherInputChange(question: any, option: any, value: any) {
	const fieldName = `question_${question.bh || question.id}`;
	const optionValue = option.option || option.content;

	// 空值时：取消选中当前 other 选项
	if (value === undefined || value === null || value === '') {
		// 单选：如果当前选中的是该选项，则清空
		if (question.type === 'single') {
			if (form[fieldName] === optionValue) {
				form[fieldName] = undefined;
				// 触发一次答案变更逻辑，保证跳转规则生效
				handleAnswerChange(question, undefined);
			}
			return;
		}

		// 多选：从已选数组中移除该选项
		if (question.type === 'multiple') {
			if (Array.isArray(form[fieldName])) {
				const arr = form[fieldName] as any[];
				const idx = arr.indexOf(optionValue);
				if (idx > -1) {
					arr.splice(idx, 1);
				}
			}
		}

		return;
	}

	// 单选题：输入 other 文本时，自动将当前选项设为选中
	if (question.type === 'single') {
		if (form[fieldName] !== optionValue) {
			form[fieldName] = optionValue;
			// 触发一次答案变更逻辑，保证跳转规则生效
			handleAnswerChange(question, optionValue);
		}
		return;
	}

	// 多选题：输入 other 文本时，自动将当前选项加入已选列表
	if (question.type === 'multiple') {
		if (!Array.isArray(form[fieldName])) {
			form[fieldName] = [];
		}

		const arr = form[fieldName] as any[];
		if (!arr.includes(optionValue)) {
			arr.push(optionValue);
		}
	}
}

/**
 * 重新计算所有题目的可见性
 *
 * 规则说明：
 * 1. 默认：所有题目都加载，并且默认全部可见
 * 2. 对于每一道带 jump 的单选题：
 *    - 如果当前没有答案（'', undefined, null）：
 *      -> 对该题的每一个「非 end 的跳转目标」target，
 *         隐藏「当前题目 与 target 之间」的所有题目
 *         （即：当前题目到各个候选跳转点之间的问题，默认都隐藏）
 *    - 如果当前有答案，且该答案命中某个跳转 target：
 *      -> 如果 target === 'end'：隐藏当前题目之后的所有题目
 *      -> 否则：隐藏「当前题目 与 target 之间」的所有题目
 *    - 如果当前有答案，但未命中任何跳转配置：
 *      -> 不再隐藏题目，按题目顺序正常展示，视为走「默认路径」
 */
function recalculateVisibleQuestions() {
	// 先根据当前题目顺序（通常按照 sort 排序）建立一个索引映射，
	// 这样 bh 即使是非数字字符串，也能通过“位置”来判断前后关系
	const bhIndexMap = new Map<string, number>();
	questions.value.forEach((q, index) => {
		const key = String(q.bh || q.id);
		if (key) {
			bhIndexMap.set(key, index);
		}
	});

	// 1. 默认全部可见
	visibleQuestionSet.value.clear();
	questions.value.forEach(q => {
		const qBh = String(q.bh || q.id);
		if (qBh) {
			visibleQuestionSet.value.add(qBh);
		}
	});

	// 辅助函数：按“题目在列表中的顺序”隐藏两题之间（不含端点）的所有题目
	const hideBetween = (fromBh: string, toBh: string) => {
		const fromIndex = bhIndexMap.get(fromBh);
		const toIndex = bhIndexMap.get(toBh);
		if (fromIndex === undefined || toIndex === undefined) return;

		const min = Math.min(fromIndex, toIndex);
		const max = Math.max(fromIndex, toIndex);

		questions.value.forEach((q2, idx) => {
			if (idx > min && idx < max) {
				const key = String(q2.bh || q2.id);
				if (key) {
					visibleQuestionSet.value.delete(key);
				}
			}
		});
	};

	// 2. 按当前答案和 jump 配置，逐题应用隐藏规则
	questions.value.forEach(q => {
		if (q.type !== 'single' || !q.jump) return;

		const currentBhStr = String(q.bh || q.id);
		const currentIndex = bhIndexMap.get(currentBhStr);
		if (currentIndex === undefined) return;

		// 解析 jump 配置
		let jump: any = q.jump;
		if (typeof jump === 'string') {
			try {
				jump = JSON.parse(jump);
			} catch {
				jump = {};
			}
		}
		if (!jump || typeof jump !== 'object') return;

		// 当前题答案
		const fieldName = `question_${q.bh || q.id}`;
		const answer = form[fieldName];

		// 2.1 无答案：默认隐藏「当前题目到所有非 end 跳转目标之间」的题目，
		//             且如果存在 target === 'end'，则隐藏当前题目之后的所有题目
		if (answer === undefined || answer === null || answer === '') {
			// 先处理跳转到具体题号的情况
			Object.values(jump).forEach((target: any) => {
				if (!target || target === 'end') return;
				const targetBhStr = String(target);
				hideBetween(currentBhStr, targetBhStr);
			});

			// 如果存在跳转到 end 的配置，默认隐藏当前题目之后的所有题目
			const hasEndJump = Object.values(jump).some(v => v === 'end');
			if (hasEndJump) {
				questions.value.forEach((q2, idx) => {
					if (idx > currentIndex) {
						const key = String(q2.bh || q2.id);
						if (key) {
							visibleQuestionSet.value.delete(key);
						}
					}
				});
			}
			return;
		}

		// 2.2 有答案：按命中情况处理
		const answerStr = String(answer);
		const target = jump[answerStr];

		// 未命中任何跳转：按默认顺序展示，不做隐藏
		if (!target) {
			return;
		}

		// 命中跳转到 end：隐藏当前题目之后的所有题目
		if (target === 'end') {
			questions.value.forEach((q2, idx) => {
				if (idx > currentIndex) {
					const key = String(q2.bh || q2.id);
					if (key) {
						visibleQuestionSet.value.delete(key);
					}
				}
			});
			return;
		}

		// 命中跳转到具体题目：隐藏当前题目与目标题目之间的所有题目
		const targetBhStr = String(target);
		hideBetween(currentBhStr, targetBhStr);
	});

	// 3. 清除所有已被隐藏题目的答案值
	questions.value.forEach(q => {
		const qBh = String(q.bh || q.id);
		if (!qBh) return;

		// 不在可见集合中的题目视为隐藏
		if (!visibleQuestionSet.value.has(qBh)) {
			const fieldName = `question_${qBh}`;
			if (fieldName in form) {
				delete form[fieldName];
			}
		}
	});
}

/**
 * 验证档案号
 */
function validatePatientNo(rule: any, value: string, callback: (error?: Error) => void) {
	if (!value) {
		callback(new Error('请输入档案号'));
		return;
	}

	if (patientNoValidating.value) {
		callback();
		return;
	}

	patientNoValidating.value = true;
	service.patient.info
		.getByPatientNo({ patientNo: value })
		.then(res => {
			if (res) {
				patientNoValid.value = true;
				callback();
			} else {
				patientNoValid.value = false;
				callback(new Error('请输入正确的档案号'));
			}
		})
		.catch(error => {
			patientNoValid.value = false;
			callback(new Error('患者信息获取失败'));
		})
		.finally(() => {
			patientNoValidating.value = false;
		});
}

// 档案号是否禁用：详情 / 修改模式，或者父组件显式传入 patientNo 时
const isPatientNoDisabled = computed(() => {
	return props.mode === 'info' || props.mode === 'update' || !!props.patientNo;
});

/**
 * 处理档案号失焦
 */
async function handlePatientNoBlur() {
	if (!form.patientNo) return;

	try {
		const res = await service.patient.info.getByPatientNo({
			patientNo: form.patientNo
		});
		if (res) {
			patientNoValid.value = true;
		} else {
			patientNoValid.value = false;
			ElMessage.error('请输入正确的档案号');
		}
	} catch (error) {
		patientNoValid.value = false;
		ElMessage.error('患者信息获取失败');
	}
}

/**
 * 加载问卷题目（新增模式）
 */
async function loadQuestionsForAdd() {
	loading.value = true;
	try {
		// 尝试使用 questionsWithOptions 方法，如果不存在则使用 list 方法
		const response: any = await service.questionnaire.questionnaire.questionsWithOptions();
		// 处理返回数据
		if (response) {
			console.log('response', response);
			// 如果返回的是对象，包含 title 和 questions
			questionnaireTitle.value = response.title;
			questionnaireDescription.value = response.description || '';
			questions.value = response.questions || [];
			questionnaireIdValue.value = response.id || props.questionnaireId;
			// 初始化可见题目（根据当前答案和跳转规则统一计算）
			recalculateVisibleQuestions();
		}
	} catch (error) {
		console.error('加载问卷题目失败:', error);
		ElMessage.error('加载问卷题目失败');
		questions.value = [];
	} finally {
		loading.value = false;
	}
}

/**
 * 加载问卷答案（修改/详情模式）
 */
async function loadQuestionsForUpdate() {
	// 没有 id 时不加载，避免新增模式误调
	if (!props.id) {
		return;
	}

	loading.value = true;
	try {
		const response = await service.patient.questionnaire.getQuestionnaireAnswerById({
			id: props.id
		});

		if (response) {
			questionnaireTitle.value = response.title || '';
			questionnaireDescription.value = response.description || '';
			questions.value = response.questions || [];

			// 设置档案号（不可修改）
			if (response.patientNo) {
				form.patientNo = response.patientNo;
			}

			// 设置答案
			questions.value.forEach((question: any) => {
				const fieldName = `question_${question.bh || question.id}`;
				if (question.value !== undefined && question.value !== null) {
					// 处理不同类型的答案
					if (question.type === 'multiple' && typeof question.value === 'string') {
						// 多选题可能是逗号分隔的字符串
						form[fieldName] = question.value.split(',').map((v: string) => v.trim());
					} else if (question.type === 'number') {
						// 数字题：后端可能返回的是字符串，需要转为 number
						const numVal =
							typeof question.value === 'number'
								? question.value
								: Number(question.value);
						form[fieldName] = Number.isNaN(numVal) ? null : numVal;
					} else {
						form[fieldName] = question.value;
					}

					// 处理 other 值的回显
					if (question.other) {
						// 如果 other 是对象（多选题），遍历设置每个选项的 other 值
						if (typeof question.other === 'object' && !Array.isArray(question.other)) {
							Object.keys(question.other).forEach((optionValue: string) => {
								const otherFieldName = `question_${question.bh || question.id}_other_${optionValue}`;
								form[otherFieldName] = question.other[optionValue];
							});
						} else if (typeof question.other === 'string') {
							// 如果 other 是字符串（单选题），设置当前选中选项的 other 值
							const currentValue = form[fieldName];
							if (currentValue) {
								const otherFieldName = `question_${question.bh || question.id}_other_${currentValue}`;
								form[otherFieldName] = question.other;
							}
						}
					}
				}
			});

			// 根据当前答案和跳转规则初始化可见题目
			recalculateVisibleQuestions();
		}
	} catch (error) {
		console.error('加载问卷答案失败:', error);
		ElMessage.error('加载问卷答案失败');
		questions.value = [];
	} finally {
		loading.value = false;
	}
}

/**
 * 组装提交数据
 */
function assembleSubmitData() {
	const answers: any[] = [];

	questions.value.forEach((question: any) => {
		const fieldName = `question_${question.bh || question.id}`;
		const value = form[fieldName];

		if (value !== undefined && value !== null && value !== '') {
			const bh = question.bh || question.id;

			// 处理不同类型的答案
			if (question.type === 'multiple' && Array.isArray(value)) {
				// 多选题：一个题目一条记录，value 和 option 都是数组
				const valueArr: any[] = [];
				const optionArr: any[] = [];
				const otherObj: Record<string, string> = {};

				value.forEach((val: any) => {
					valueArr.push(val);
					const opt = question.options?.find((o: any) => (o.option || o.content) === val);
					optionArr.push(opt?.content || val);

					// 如果该选项有 other 属性且为 true，查找对应的 other 输入值
					if (opt?.other) {
						const otherFieldName = `question_${bh}_other_${val}`;
						const otherValue = form[otherFieldName];
						if (otherValue !== undefined && otherValue !== null && otherValue !== '') {
							otherObj[val] = String(otherValue);
						}
					}
				});

				const answerItem: any = {
					bh: String(bh),
					value: valueArr,
					option: optionArr
				};

				// 如果有 other 值，添加到答案中
				if (Object.keys(otherObj).length > 0) {
					answerItem.other = otherObj;
				}

				answers.push(answerItem);
			} else {
				// 单选题或其他类型
				const option = question.options?.find(
					(opt: any) => (opt.option || opt.content) === value
				);

				const answerItem: any = {
					bh: String(bh),
					value: String(value),
					option: option?.content || String(value)
				};

				// 如果该选项有 other 属性且为 true，查找对应的 other 输入值
				if (option?.other) {
					const otherFieldName = `question_${bh}_other_${value}`;
					const otherValue = form[otherFieldName];
					if (otherValue !== undefined && otherValue !== null && otherValue !== '') {
						answerItem.other = String(otherValue);
					}
				}

				answers.push(answerItem);
			}
		}
	});

	return {
		id: props.id,
		patientNo: form.patientNo,
		questionnaireId: questionnaireIdValue.value || props.questionnaireId,
		questionNr: {
			answers: answers
		}
	};
}

/**
 * 验证表单
 */
function validate() {
	return new Promise((resolve, reject) => {
		if (!formRef.value) {
			reject({ valid: false, message: '表单未初始化' });
			return;
		}

		// 验证档案号
		if (!form.patientNo) {
			reject({ valid: false, message: '请输入档案号' });
			return;
		}

		if (!patientNoValid.value && props.mode === 'add') {
			reject({ valid: false, message: '请输入正确的档案号' });
			return;
		}

		// 验证表单
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				resolve({ valid: true, message: '' });
			} else {
				reject({ valid: false, message: '请填写完整信息' });
			}
		});
	});
}

// --- 数据监听 ---
watch(
	() => props.mode,
	async newMode => {
		if (newMode === 'add') {
			// 重置表单
			Object.keys(form).forEach(key => {
				if (key !== 'patientNo') {
					delete form[key];
				}
			});
			form.patientNo = '';
			patientNoValid.value = false;
			// 加载题目
			await loadQuestionsForAdd();
		} else if (newMode === 'update' || newMode === 'info') {
			// 加载答案
			await loadQuestionsForUpdate();
		}
	},
	{ immediate: true }
);

watch(
	() => props.id,
	async newId => {
		if (newId && (props.mode === 'update' || props.mode === 'info')) {
			await loadQuestionsForUpdate();
		}
	}
);

// 监听父组件传入的 patientNo，自动同步到内部表单
watch(
	() => props.patientNo,
	newVal => {
		if (newVal) {
			form.patientNo = newVal;
			// 外部传入的档案号默认视为已验证通过，避免重复校验
			patientNoValid.value = true;
		}
	},
	{ immediate: true }
);

watch(
	() => props.questionnaireId,
	async newId => {
		if (newId && props.mode === 'add') {
			await loadQuestionsForAdd();
		}
	}
);

// 监听表单变化，更新modelValue
watch(
	form,
	newVal => {
		const submitData = assembleSubmitData();
		emit('update:modelValue', submitData);
	},
	{ deep: true }
);

// --- 生命周期钩子 ---
onMounted(async () => {
	// 初始加载逻辑由对 props.mode / props.id / props.questionnaireId 的 watch（immediate）统一处理
});

// 导出组件方法，供父组件调用
defineExpose({
	form,
	validate,
	assembleSubmitData
});
</script>

<style lang="scss" scoped>
.questionnaire-base-info {
	width: 100%;
	margin-top: -15px;

	.questionnaire-title {
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid var(--el-border-color-light);

		h3 {
			margin: 0 0 8px 0;
			font-size: 18px;
			font-weight: 600;
			color: var(--el-text-color-primary);
		}

		.questionnaire-description {
			margin: 0;
			font-size: 14px;
			color: var(--el-text-color-regular);
		}
	}

	.loading-container,
	.empty-container {
		padding: 40px 0;
		text-align: center;
	}

	:deep(.cl-form) {
		.form-row {
			margin-bottom: 12px;

			&.first-row {
				/* 档案号与题目列表之间增加间距，避免错误提示被遮挡 */
				margin-bottom: 20px;
			}
		}

		.el-form-item {
			/* 增大单个表单项底部间距，让校验错误提示有足够空间完全展示 */
			margin-bottom: 20px;

			.el-form-item__label {
				padding-bottom: 5px;
				font-size: 14px;
				line-height: 1.4;
				color: var(--el-text-color-regular);
				/* 题目文字过长时自动换行 */
				white-space: normal;
				word-break: break-word;
			}
		}

		.el-row {
			margin-bottom: 0;
		}

		.el-select,
		.el-date-picker,
		.el-input,
		.el-input-number {
			width: 100%;
		}

		.el-radio-group,
		.el-checkbox-group {
			display: flex;
			flex-direction: column; /* 改为纵向布局，确保每个选项占一行 */
			gap: 10px;
			/* 单选、多选整体使用文字基线对齐，保持选项与输入框在一条水平线上 */
			align-items: stretch; /* 拉伸子元素以填满宽度 */
		}

		.el-radio,
		.el-checkbox {
			/* 单选、多选统一垂直对齐和外边距 */
			align-items: flex-start;
			margin-right: 8px;
			margin-bottom: 8px;

			/* 统一图标与文字之间的间距，以及换行规则 */
			.el-radio__label,
			.el-checkbox__label {
				padding-left: 6px; /* 覆盖 element-plus 默认值，保证单选、多选间距一致 */
				white-space: normal;
				word-break: break-word;
				line-height: 1.4; /* 统一文字与文字之间的行间距（单选、多选一致） */
				margin-top: -3px;
			}
		}

		.radio-option-item,
		.checkbox-option-item {
			width: 100%;
			margin-bottom: 8px;
			display: flex;
			/* 使用文字基线对齐，让“其他”和输入框的文字更在一条水平线上 */
			align-items: baseline;
			/* 默认允许换行，避免长文本时与其他选项重叠 */
			flex-wrap: wrap;

			&:last-child {
				margin-bottom: 0;
			}
		}
		// 长文本选项：增大选项之间的间距，避免多行文字看起来太拥挤
		.option-item--long {
			margin-bottom: 3px;
		}

		// 超长文本选项：按容器宽度的 25% 作为底部间距，进一步拉开与下一项的距离
		.option-item--xlong {
			margin-bottom: 4%;
		}

		// 超长文本选项：按容器宽度的 25% 作为底部间距，进一步拉开与下一项的距离
		.option-item--xxlong {
			margin-bottom: 10%;
		}

		/* 默认「其他」输入框宽度：单选、多选共用 */
		.option-other-input {
			flex: 0 0 auto;
			width: 30%;
			min-width: 30%;
			max-width: 30%;
			margin-left: 8px;
			flex-shrink: 0; /* 不被压缩 */
		}

		/* 长文本选项：让输入框换行到下一行，避免遮挡文字 */
		.radio-option-item.option-item--long .option-other-input,
		.checkbox-option-item.option-item--long .option-other-input,
		.radio-option-item.option-item--xlong .option-other-input,
		.checkbox-option-item.option-item--xlong .option-other-input,
		.radio-option-item.option-item--xxlong .option-other-input,
		.checkbox-option-item.option-item--xxlong .option-other-input {
			width: 60%;
			min-width: 60%;
			max-width: 60%;
			/* 左侧缩进一点，让输入框在文字下方对齐，而不是顶到最左边的圆点下方 */
			margin-left: 26px;
			margin-top: 4px;
		}

		.question-item {
			margin-bottom: 4px;

			.question-card {
				height: 100%;
				transition: all 0.3s;

				&:hover {
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
				}

				:deep(.el-card__body) {
					padding: 20px;
				}
			}

			.question-label {
				display: inline-flex;
				align-items: center;
				gap: 8px;
			}

			.question-type-tag {
				flex-shrink: 0;
			}

			.question-title-text {
				white-space: normal;
				word-break: break-word;
			}

			.required-mark {
				color: var(--el-color-danger);
				margin-left: 4px;
			}
		}

		.question-hidden {
			display: none !important;
		}
	}
}
</style>
