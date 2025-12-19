<template>
	<div class="app-right-panel" :class="{ 'is-collapse': app.isRightPanelFold }">
		<div class="app-right-panel__header">
			<div class="app-right-panel__title">
				<el-button
					v-if="!app.isRightPanelFold"
					type="primary"
					size="small"
					@click="startNewSession"
					class="new-session-btn"
				>
					<el-icon class="btn-icon">
						<plus />
					</el-icon>
					开启新会话
				</el-button>
			</div>
			<div class="app-right-panel__toggle" @click="app.foldRightPanel()">
				<cl-svg name="right" v-if="app.isRightPanelFold" />
				<cl-svg name="left" v-else />
			</div>
		</div>

		<div class="app-right-panel__content" v-if="!app.isRightPanelFold">
			<!-- 聊天主体区域 -->
			<div class="chat-container">
				<!-- 中央图标和标题 - 只在没有消息时显示 -->
				<div class="chat-welcome" v-if="messages.length === 0">
					<div class="chat-icon">
						<div class="icon-grid">
							<div class="grid-item"></div>
							<div class="grid-item"></div>
							<div class="grid-item"></div>
							<div class="grid-item"></div>
						</div>
					</div>
					<div class="chat-title">AI智库</div>
				</div>

				<!-- 聊天消息区域 - 当有消息时占据整个空间 -->
				<div class="chat-messages" ref="messagesContainer" v-if="messages.length > 0">
					<el-scrollbar>
						<div class="messages-list">
							<div
								v-for="(message, index) in messages"
								:key="index"
								class="message-item"
								:class="{ 'is-user': message.isUser }"
							>
								<div class="message-content">
									<div class="message-text" v-html="message.text"></div>
									<span v-if="typingMessageIndex === index" class="typing-cursor"
										>|</span
									>

									<!-- AI回复的数据源信息 -->
									<div
										v-if="!message.isUser && message.source"
										class="message-source"
									>
										<div class="source-info">
											<el-icon class="source-icon">
												<document />
											</el-icon>
											<span class="source-text"
												>数据来源：{{ message.source }}</span
											>
										</div>

										<!-- 支持文档展开 -->
										<div
											v-if="message.supports && message.supports.length > 0"
											class="supports-section"
										>
											<el-collapse>
												<el-collapse-item
													name="supports"
													title="查看详细参考资料"
												>
													<div
														v-for="(support, idx) in message.supports"
														:key="idx"
														class="support-item"
													>
														<div class="support-header">
															<span class="support-source">{{
																support.source
															}}</span>
															<span
																v-if="support.rerank_score"
																class="support-score"
															>
																相关度:
																{{
																	Math.round(
																		support.rerank_score * 10
																	) / 10
																}}
															</span>
														</div>
														<div class="support-text">
															{{ support.text }}
														</div>
													</div>
												</el-collapse-item>
											</el-collapse>
										</div>
									</div>

									<!-- AI回复的操作按钮 -->
									<div
										v-if="!message.isUser && !message.isTyping"
										class="message-actions"
									>
										<div class="action-buttons">
											<el-tooltip content="复制" placement="top">
												<el-button
													size="small"
													text
													@click="
														copyMessage(
															message.fullText || message.text
														)
													"
													class="action-btn"
												>
													<img src="/copy.png" width="20" height="20" />
												</el-button>
											</el-tooltip>

											<el-tooltip content="重新生成" placement="top">
												<el-button
													size="small"
													text
													@click="regenerateMessage(index)"
													class="action-btn"
												>
													<img
														src="/continue.png"
														width="20"
														height="20"
													/>
												</el-button>
											</el-tooltip>

											<el-tooltip content="赞" placement="top">
												<el-button
													size="small"
													text
													@click="likeMessage(index)"
													class="action-btn"
													:class="{ active: message.liked }"
												>
													<img src="/zan.png" width="20" height="20" />
												</el-button>
											</el-tooltip>

											<el-tooltip content="踩" placement="top">
												<el-button
													size="small"
													text
													@click="dislikeMessage(index)"
													class="action-btn"
													:class="{ active: message.disliked }"
												>
													<img src="/cai.png" width="20" height="20" />
												</el-button>
											</el-tooltip>

											<el-tooltip content="编辑您的答案" placement="top">
												<el-button
													size="small"
													text
													@click="editMessage(index)"
													class="action-btn edit-btn"
												>
													<img src="/edit.png" width="20" height="20" />
												</el-button>
											</el-tooltip>

											<el-tooltip content="复制为Markdown" placement="top">
												<el-button
													size="small"
													text
													@click="
														copyAsMarkdown(
															message.fullText || message.text,
															message.markdown
														)
													"
													class="action-btn"
												>
													<img src="/copy.png" width="20" height="20" />
												</el-button>
											</el-tooltip>

											<el-tooltip content="导出" placement="top">
												<el-button
													size="small"
													text
													@click="exportMessage(message)"
													class="action-btn"
												>
													<img src="/export.png" width="20" height="20" />
												</el-button>
											</el-tooltip>
										</div>
									</div>

									<div class="message-time">{{ message.time }}</div>
								</div>
							</div>
						</div>
					</el-scrollbar>
				</div>
			</div>

			<!-- 底部输入区域 -->
			<div class="chat-input-container">
				<div class="chat-input-wrapper">
					<div class="input-box" @click="focusInput">
						<div class="input-prefix">
							<cl-svg name="folder" class="folder-icon" />
						</div>
						<el-input
							ref="inputRef"
							v-model="inputMessage"
							placeholder="请输入你的问题，支持对工作内容进行对话"
							@keyup.enter="sendMessage"
							class="message-input"
							:rows="1"
							type="textarea"
							resize="none"
							:autosize="{ minRows: 1, maxRows: 4 }"
							:disabled="isLoading"
						/>
						<div class="input-suffix">
							<cl-svg name="microphone" class="mic-icon" @click="toggleVoiceInput" />
							<div
								class="send-button"
								@click="sendMessage"
								:class="{ active: inputMessage.trim(), loading: isLoading }"
								:disabled="isLoading"
							>
								<cl-svg v-if="!isLoading" name="send" />
								<el-icon v-else class="is-loading">
									<loading />
								</el-icon>
							</div>
						</div>
					</div>
				</div>
				<div class="input-tips">与智能助手，开启对话交流，助你解答问题，协助你完成任务</div>
			</div>
		</div>
	</div>

	<!-- 编辑对话框 -->
	<el-dialog
		v-model="editDialogVisible"
		title="编辑回答"
		width="80%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		destroy-on-close
		class="edit-dialog"
	>
		<div class="edit-dialog-content">
			<!-- 显示原始问题 -->
			<div class="edit-question-section">
				<div class="edit-section-title">原始问题：</div>
				<div class="edit-question-text">{{ currentEditQuestion }}</div>
			</div>

			<!-- 显示原始答案 -->
			<div class="edit-answer-section">
				<div class="edit-section-title">原始答案：</div>
				<div class="edit-answer-text" v-html="currentEditAnswer"></div>
			</div>

			<!-- 编辑区域 -->
			<div class="edit-content-section">
				<div class="edit-section-title">编辑答案：</div>
				<cl-editor-wang v-model="currentEditContent" height="300px" />
			</div>
		</div>
		<template #footer>
			<el-button @click="editDialogVisible = false">取消</el-button>
			<el-button type="primary" @click="saveEditContent">确定</el-button>
		</template>
	</el-dialog>

	<!-- 将Dialog改为Popover -->
	<teleport to="body">
		<div
			v-if="feedbackDialogVisible"
			class="feedback-popover"
			:style="{
				position: 'absolute',
				left: `${feedbackPosition.x}px`,
				top: `${feedbackPosition.y + 8}px`,
				zIndex: 2000
			}"
		>
			<div class="feedback-content">
				<div class="feedback-title">
					{{
						feedbackType === 'like'
							? '你感到满意的主要原因是？（可多选）'
							: '你感到不满意的主要原因是？（可多选）'
					}}
				</div>
				<div class="feedback-options">
					<el-button
						v-for="(option, index) in feedbackType === 'like'
							? feedbackOptionsLike
							: feedbackOptionsDislike"
						:key="index"
						:class="{ selected: selectedFeedback.includes(option) }"
						@click="toggleFeedbackOption(option)"
					>
						{{ option }}
					</el-button>
				</div>
				<div class="feedback-footer">
					<el-button @click="cancelFeedback">取消</el-button>
					<el-button type="primary" @click="submitFeedback">提交</el-button>
				</div>
			</div>
		</div>
	</teleport>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'app-right-panel'
});

import { useBase } from '/$/base';
import { useCool } from '/@/cool';
import { ElMessage } from 'element-plus';
import {
	Loading,
	Document,
	CopyDocument,
	Refresh,
	GoodsFilled,
	CircleCloseFilled,
	Download,
	Plus,
	Edit // 添加Edit图标
} from '@element-plus/icons-vue';
import { ref, nextTick, reactive, onMounted, onBeforeUnmount, watch } from 'vue';

import { markdownToHTML } from '/@/modules/helper/utils/markdown-converter-github';

// 在script setup的开头，其他ref声明附近添加
const feedbackPosition = reactive({
	x: 0,
	y: 0
});

const { app, user } = useBase();
const { router, mitt, service } = useCool();

// 组件已通过 import 导入，可直接在模板中使用

// 消息类型定义
interface ChatMessage {
	text: string;
	time: string;
	isUser: boolean;
	source?: string;
	supports?: Array<{
		source: string;
		text: string;
		rerank_score?: number;
	}>;
	liked?: boolean;
	disliked?: boolean;
	isTyping?: boolean;
	fullText?: string;
	feedback?: string[]; // 修改为字符串数组类型
	markdown?: string; // 新增字段
}

// 聊天相关状态
const inputMessage = ref('');
const messages = ref<ChatMessage[]>([]);
const messagesContainer = ref<HTMLElement>();
const inputRef = ref();
const isLoading = ref(false);

/**
 * 聚焦输入框
 */
function focusInput() {
	nextTick(() => {
		inputRef.value?.focus();
	});
}

/**
 * 发送消息
 * 调用后台智能知识库API获取AI回复
 *
 * API: service.etiology.muaItems.queryRag({ question: string })
 * 返回格式: {
 *   answer: string,
 *   main_source: string,
 *   success: boolean,
 *   supports: Array<{ source: string, text: string, rerank_score?: number }>
 * }
 */
async function sendMessage() {
	if (!inputMessage.value?.trim() || isLoading.value) return;

	const userMessage = reactive({
		text: inputMessage.value,
		time: new Date().toLocaleTimeString(),
		isUser: true
	});

	messages.value.push(userMessage);
	const currentInput = inputMessage.value;
	inputMessage.value = '';

	// 滚动到底部
	await nextTick();
	scrollToBottom();

	// 添加加载状态
	isLoading.value = true;

	// 添加AI正在回复的占位消息
	const loadingMessage = reactive({
		text: 'AI正在思考中...',
		time: new Date().toLocaleTimeString(),
		isUser: false,
		isTyping: true // 添加isTyping属性，确保不显示操作按钮
	});
	messages.value.push(loadingMessage);
	await nextTick();
	scrollToBottom();

	try {
		// 调用后台API - 智能知识库查询
		const response = await service.etiology.muaItems.queryRag({
			question: currentInput
		});

		// 移除加载消息
		messages.value.pop();

		// 解析API响应并添加AI回复消息
		if (response.success) {
			const aiMessage = reactive({
				text: '',
				time: new Date().toLocaleTimeString(),
				isUser: false,
				source: response.main_source || '',
				supports: response.supports || [],
				isTyping: true,
				fullText: '',
				markdown: '' // 新增字段
			});

			// 先添加空的AI消息
			messages.value.push(aiMessage);
			await nextTick();
			scrollToBottom();

			// 关闭输入状态，但保持加载状态到打字完成
			// 使用打字机效果显示AI回复
			const fullAnswer = response.answer || '抱歉，我暂时无法回答这个问题。';
			aiMessage.markdown = fullAnswer; // 存原始 markdown
			//此处调用markdown工具
			const html = await markdownToHTML(fullAnswer);
			//console.log('准备开始打字机效果，AI回复:', html);
			await typewriterEffect(aiMessage, html);

			// 打字完成后重置加载状态
			isLoading.value = false;
		} else {
			const errorMessage = reactive({
				text: '',
				time: new Date().toLocaleTimeString(),
				isUser: false,
				isTyping: true, // 确保在打字机效果期间不显示操作按钮
				fullText: ''
			});

			messages.value.push(errorMessage);
			await nextTick();

			const errorText = '抱歉，处理您的问题时出现错误，请重新提问。';
			//console.log('准备开始打字机效果，错误消息:', errorText);
			await typewriterEffect(errorMessage, errorText);

			// 打字完成后重置加载状态
			isLoading.value = false;
		}
	} catch (error) {
		// 移除加载消息
		messages.value.pop();

		// 添加错误消息
		const errorMessage = reactive({
			text: '',
			time: new Date().toLocaleTimeString(),
			isUser: false,
			isTyping: true, // 确保在打字机效果期间不显示操作按钮
			fullText: ''
		});

		messages.value.push(errorMessage);
		await nextTick();

		const errorText = '抱歉，服务暂时不可用，请稍后再试。';
		//console.log('准备开始打字机效果，异常错误消息:', errorText);
		await typewriterEffect(errorMessage, errorText);

		// 打字完成后重置加载状态
		isLoading.value = false;

		console.error('发送消息失败:', error);
		ElMessage.error('发送消息失败，请稍后再试');
	} finally {
		await nextTick();
		scrollToBottom();
	}
}

/**
 * 开启新会话（清屏）
 */
function startNewSession() {
	messages.value = [];
	inputMessage.value = '';
	isLoading.value = false;
	ElMessage.success('已开启新会话');
}

/**
 * 切换语音输入
 */
function toggleVoiceInput() {
	ElMessage.info('语音输入功能待实现');
}

/**
 * 滚动到底部
 */
function scrollToBottom() {
	if (messagesContainer.value) {
		const scrollbar = messagesContainer.value.querySelector('.el-scrollbar__wrap');
		if (scrollbar) {
			scrollbar.scrollTop = scrollbar.scrollHeight;
		}
	}
}

// 在script setup中添加
const typingMessageIndex = ref<number | null>(null);

/**
 * 打字机效果显示文本
 */
async function typewriterEffect(message: any, fullText: string, speed: number = 30) {
	//console.log('开始打字机效果:', fullText.substring(0, 50) + '...');

	return new Promise<void>(resolve => {
		if (!fullText || fullText.length === 0) {
			//console.log('文本为空，直接完成');
			message.isTyping = false;
			resolve();
			return;
		}

		let currentIndex = 0;
		message.text = '';
		message.isTyping = true;
		message.fullText = fullText;

		// 找到当前消息的索引
		typingMessageIndex.value = messages.value.findIndex(m => m === message);

		function typeNextChar() {
			if (currentIndex < fullText.length) {
				const char = fullText[currentIndex];
				message.text = fullText.substring(0, currentIndex + 1);
				currentIndex++;

				// 每隔几个字符滚动一次
				if (currentIndex % 8 === 0) {
					nextTick(() => {
						scrollToBottom();
					});
				}

				// 根据字符类型设置不同的延迟
				let delay = speed;
				if (/[<>]/.test(char)) {
					// HTML标签快速显示
					delay = 0;
				} else if (/[\u4e00-\u9fff]/.test(char)) {
					// 中文字符
					delay = speed + 20;
				} else if (/[.!?。！？]/.test(char)) {
					// 标点符号稍慢
					delay = speed + 150;
				} else if (char === '\n') {
					// 换行符稍慢
					delay = speed + 80;
				}

				setTimeout(typeNextChar, delay);
			} else {
				// 打字完成
				//console.log('打字机效果完成');
				message.isTyping = false;
				typingMessageIndex.value = null;
				nextTick(() => {
					scrollToBottom();
					resolve();
				});
			}
		}

		// 开始打字
		setTimeout(typeNextChar, 100); // 稍微延迟开始，确保DOM更新
	});
}

/**
 * 复制消息内容
 */
function copyMessage(text: string) {
	// 去除 HTML 标签，保留纯文本
	const plainText = text
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");

	if (navigator.clipboard) {
		navigator.clipboard
			.writeText(plainText)
			.then(() => {
				ElMessage.success('复制成功');
			})
			.catch(() => {
				ElMessage.error('复制失败');
			});
	} else {
		const textarea = document.createElement('textarea');
		textarea.value = plainText;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
		ElMessage.success('复制成功');
	}
}

/**
 * 重新生成消息
 */
function regenerateMessage(messageIndex: number) {
	const message = messages.value[messageIndex];
	if (message.isUser) return;

	// 找到对应的用户消息
	const userMessageIndex = messageIndex - 1;
	const userMessage = messages.value[userMessageIndex];

	if (userMessage && userMessage.isUser) {
		// 移除当前AI回复
		messages.value.splice(messageIndex, 1);

		// 重新发送用户消息
		inputMessage.value = userMessage.text;
		sendMessage();
	}
}

/**
 * 点赞反馈相关
 */
const feedbackDialogVisible = ref(false);
const feedbackType = ref<'like' | 'dislike'>('like'); // 新增类型
const feedbackOptionsLike = [
	'图片有美感',
	'图片内容合理',
	'与要求一致',
	'图片清晰',
	'是我想要的风格',
	'其他'
];
const feedbackOptionsDislike = [
	'与要求不一致',
	'图片内容不合理',
	'图片不清晰',
	'图片缺乏美感',
	'不是我想要的风格',
	'其他'
];
const selectedFeedback = ref<string[]>([]);
const currentLikedMessageIndex = ref<number | null>(null);

/**
 * 点赞消息
 */
function likeMessage(messageIndex: number) {
	const message = messages.value[messageIndex];
	if (message.isUser) return;

	// 如果已经点赞，则取消点赞
	if (message.liked) {
		message.liked = false;
		return;
	}

	// 如果点踩了，先取消点踩
	if (message.disliked) {
		message.disliked = false;
	}

	// 记录当前操作的消息索引
	currentLikedMessageIndex.value = messageIndex;
	feedbackType.value = 'like';

	// 获取点赞按钮元素并计算位置
	nextTick(() => {
		const likeButton = document.querySelector(
			`.message-item:nth-child(${messageIndex + 1}) .action-btn:nth-child(3)`
		);
		if (likeButton) {
			const rect = likeButton.getBoundingClientRect();
			feedbackPosition.x = rect.left;
			feedbackPosition.y = rect.bottom + window.scrollY;

			// 检测弹框是否会超出底部边界
			adjustFeedbackPosition();
		}

		// 显示反馈弹窗
		selectedFeedback.value = [];
		feedbackDialogVisible.value = true;
	});
}

/**
 * 点踩消息
 */
function dislikeMessage(messageIndex: number) {
	const message = messages.value[messageIndex];
	if (message.isUser) return;

	// 切换点踩状态
	message.disliked = !message.disliked;
	if (message.disliked) {
		message.liked = false;
		// 弹出不满意反馈弹窗
		currentLikedMessageIndex.value = messageIndex;
		feedbackType.value = 'dislike';
		nextTick(() => {
			const dislikeButton = document.querySelector(
				`.message-item:nth-child(${messageIndex + 1}) .action-btn:nth-child(4)`
			);
			if (dislikeButton) {
				const rect = dislikeButton.getBoundingClientRect();
				feedbackPosition.x = rect.left;
				feedbackPosition.y = rect.bottom + window.scrollY;

				// 检测弹框是否会超出底部边界
				adjustFeedbackPosition();
			}
			selectedFeedback.value = [];
			feedbackDialogVisible.value = true;
		});
	} else {
		ElMessage.info('感谢您的反馈，我们会继续改进');
	}
}

/**
 * 调整反馈弹框位置，确保不超出视窗边界
 */
function adjustFeedbackPosition() {
	nextTick(() => {
		const feedbackPopover = document.querySelector('.feedback-popover') as HTMLElement;
		if (!feedbackPopover) return;

		const rect = feedbackPopover.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const popoverWidth = rect.width;
		const popoverHeight = rect.height;
		const margin = 20;

		// 如果弹框底部超出视窗，则向上调整
		if (rect.bottom > viewportHeight) {
			const overflow = rect.bottom - viewportHeight;
			feedbackPosition.y -= overflow + margin;
		}

		// 如果弹框顶部超出视窗，则向下调整
		if (rect.top < 0) {
			feedbackPosition.y += Math.abs(rect.top) + margin;
		}

		// 直接限制x最大最小值，防止超出左右边界
		const maxX = viewportWidth - popoverWidth - margin;
		if (feedbackPosition.x > maxX) {
			feedbackPosition.x = maxX;
		}
		if (feedbackPosition.x < margin) {
			feedbackPosition.x = margin;
		}
	});
}

/**
 * 切换反馈选项
 */
function toggleFeedbackOption(option: string) {
	const index = selectedFeedback.value.indexOf(option);
	if (index === -1) {
		selectedFeedback.value.push(option);
	} else {
		selectedFeedback.value.splice(index, 1);
	}
}

/**
 * 取消反馈
 */
function cancelFeedback() {
	feedbackDialogVisible.value = false;
	selectedFeedback.value = [];
	currentLikedMessageIndex.value = null;
}

/**
 * 提交反馈
 */
async function submitFeedback() {
	const type = feedbackType.value === 'like' ? 1 : 2;
	if (currentLikedMessageIndex.value !== null) {
		const message = messages.value[currentLikedMessageIndex.value];
		if (feedbackType.value === 'like') {
			message.liked = true;
			message.feedback = selectedFeedback.value;
		} else {
			message.disliked = true;
			message.feedback = selectedFeedback.value;
		}

		// 获取当前问题和答案
		let question = '';
		let answer = '';

		// 找到当前AI消息对应的用户问题
		if (currentLikedMessageIndex.value > 0) {
			// AI消息的前一条应该是用户消息
			const userMessage = messages.value[currentLikedMessageIndex.value - 1];
			if (userMessage && userMessage.isUser) {
				question = userMessage.text;
			}
		}

		// 获取AI的答案
		answer = message.fullText || message.text;

		// 这里可以添加将反馈发送到后端的逻辑
		// console.log('提交反馈:', {
		// 	messageId: currentLikedMessageIndex.value,
		// 	feedback: selectedFeedback.value,
		// 	type: feedbackType.value,
		// 	question: question,
		// 	answer: answer
		// });

		const params = {
			question: question,
			answer: answer,
			type: type,
			content: selectedFeedback.value.join(','),
			submitTime: new Date(),
			submitUser: user.info?.name
		};

		// 可以在这里调用后端API保存反馈
		await service.ai.info.add(params);

		ElMessage.success('感谢您的反馈');
	}

	feedbackDialogVisible.value = false;
	selectedFeedback.value = [];
	currentLikedMessageIndex.value = null;
}

// 在script setup中添加编辑相关的变量和方法
const editDialogVisible = ref(false);
const currentEditContent = ref('');
const currentEditQuestion = ref('');
const currentEditAnswer = ref('');
const currentEditMessageIndex = ref<number | null>(null);

/**
 * 编辑消息
 */
function editMessage(messageIndex: number) {
	const message = messages.value[messageIndex];
	if (message.isUser) return;

	// 获取当前问题和答案
	let question = '';
	let answer = '';

	// 找到当前AI消息对应的用户问题
	if (messageIndex > 0) {
		// AI消息的前一条应该是用户消息
		const userMessage = messages.value[messageIndex - 1];
		if (userMessage && userMessage.isUser) {
			question = userMessage.text;
		}
	}

	// 获取AI的答案
	answer = message.fullText || message.text;

	// 设置编辑对话框的数据
	currentEditQuestion.value = question;
	currentEditAnswer.value = answer;
	currentEditContent.value = answer; // 编辑内容默认为答案
	currentEditMessageIndex.value = messageIndex;

	// console.log('编辑消息:', {
	// 	messageIndex: messageIndex,
	// 	question: question,
	// 	answer: answer
	// });

	editDialogVisible.value = true;
}

/**
 * 保存编辑内容
 */
async function saveEditContent() {
	if (currentEditMessageIndex.value !== null) {
		const message = messages.value[currentEditMessageIndex.value];

		// 更新消息内容
		//message.text = currentEditContent.value;
		//message.fullText = currentEditContent.value;

		// console.log('保存编辑内容:', {
		// 	messageIndex: currentEditMessageIndex.value,
		// 	originalAnswer: currentEditAnswer.value,
		// 	newAnswer: currentEditContent.value
		// });

		try {
			const params = {
				question: currentEditQuestion.value,
				answer: currentEditAnswer.value,
				type: 3,
				content: currentEditContent.value,
				submitTime: new Date(),
				submitUser: user.info?.name
			};

			await service.ai.info.add(params);
			ElMessage.success('编辑已保存并提交反馈');
		} catch (error) {
			console.error('保存编辑内容时出错:', error);
			ElMessage.error('保存失败，请重试');
			return;
		}

		editDialogVisible.value = false;
		// 清空编辑数据
		currentEditQuestion.value = '';
		currentEditAnswer.value = '';
		currentEditContent.value = '';
		currentEditMessageIndex.value = null;
	}
}

/**
 * 复制为Markdown格式
 */
function copyAsMarkdown(text: string, markdown?: string) {
	const markdownText = markdown || text.replace(/\n/g, '\n\n');
	copyMessage(markdownText);
	ElMessage.success('已复制为Markdown格式');
}

/**
 * 导出消息
 */
function exportMessage(message: ChatMessage) {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const filename = `ai-chat-${timestamp}.txt`;

	let content = `AI回复 - ${message.time}\n\n`;
	content += message.fullText || message.text;

	if (message.source) {
		content += `\n\n数据来源: ${message.source}`;
	}

	if (message.supports && message.supports.length > 0) {
		content += '\n\n参考资料:\n';
		message.supports.forEach((support, index) => {
			content += `${index + 1}. ${support.source}\n`;
			content += `   ${support.text}\n`;
			if (support.rerank_score) {
				content += `   相关度: ${Math.round(support.rerank_score * 10) / 10}\n`;
			}
			content += '\n';
		});
	}

	const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);

	ElMessage.success('导出成功');
}

// 反馈弹窗外部点击关闭逻辑
let feedbackPopoverEl: HTMLElement | null = null;

function handleClickOutsideFeedback(event: MouseEvent) {
	if (!feedbackDialogVisible.value) return;
	if (!feedbackPopoverEl) {
		feedbackPopoverEl = document.querySelector('.feedback-popover');
	}
	if (feedbackPopoverEl && !feedbackPopoverEl.contains(event.target as Node)) {
		feedbackDialogVisible.value = false;
		selectedFeedback.value = [];
		currentLikedMessageIndex.value = null;
	}
}

watch(feedbackDialogVisible, visible => {
	if (visible) {
		nextTick(() => {
			feedbackPopoverEl = document.querySelector('.feedback-popover');
			document.addEventListener('mousedown', handleClickOutsideFeedback);
		});
	} else {
		document.removeEventListener('mousedown', handleClickOutsideFeedback);
		feedbackPopoverEl = null;
	}
});

onBeforeUnmount(() => {
	document.removeEventListener('mousedown', handleClickOutsideFeedback);
});
</script>

<style lang="scss" scoped>
.app-right-panel {
	position: relative;
	height: 100%;
	width: 100%;
	background-color: #f5f5f7;
	border-left: 1px solid var(--el-border-color-extra-light);
	transition: width 0.2s ease-in-out;
	display: flex;
	flex-direction: column;

	&.is-collapse {
		width: 100%;
	}

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 46px;
		padding: 0 15px;
		border-bottom: 1px solid var(--el-border-color-extra-light);
		background-color: #fff;
	}

	&__title {
		font-size: 14px;
		font-weight: 500;
		color: #2c3e50;
		white-space: nowrap;
		overflow: hidden;
		flex: 1;
		display: flex;
		align-items: center;

		:deep(.new-session-btn) {
			border-radius: 8px !important;
			font-size: 12px !important;
			padding: 4px 12px !important;
			height: 28px !important;
			background: linear-gradient(135deg, #4285f4 0%, #34a853 100%) !important;
			border: none !important;
			transition: all 0.3s ease !important;
			box-shadow: 0 2px 4px rgba(66, 133, 244, 0.2) !important;

			&:hover {
				transform: translateY(-1px) !important;
				box-shadow: 0 4px 8px rgba(66, 133, 244, 0.3) !important;
				background: linear-gradient(135deg, #4285f4 0%, #34a853 100%) !important;
			}

			&:active {
				transform: translateY(0) !important;
			}

			.btn-icon {
				margin-right: 4px !important;
				font-size: 14px !important;
			}
		}
	}

	&__toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 4px;
		cursor: pointer;
		color: var(--el-text-color-regular);
		transition: all 0.2s;

		&:hover {
			background-color: var(--el-fill-color-light);
			color: var(--el-text-color-primary);
		}

		.cl-svg {
			font-size: 14px;
		}
	}

	&__content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.chat-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative; // 添加相对定位，确保子元素定位正确
		min-height: 0; // 确保能够正确收缩
	}

	.chat-welcome {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%; // 当没有消息时占据整个高度
		flex-shrink: 0;
		padding: 20px;
		min-height: 120px;
		transition: all 0.3s ease; // 添加过渡效果
		opacity: 1; // 确保可见性
		transform: scale(1); // 确保正常大小

		// 当有消息时隐藏
		&:has(+ .chat-messages) {
			opacity: 0;
			transform: scale(0.95);
			pointer-events: none; // 禁用交互
		}
	}

	.edit-dialog-content {
		.edit-question-section,
		.edit-answer-section,
		.edit-content-section {
			margin-bottom: 20px;

			.edit-section-title {
				font-weight: 600;
				color: #2c3e50;
				margin-bottom: 8px;
				font-size: 14px;
			}
		}

		.edit-question-text {
			background-color: #f8f9fa;
			padding: 12px;
			border-radius: 6px;
			border-left: 4px solid #4285f4;
			font-size: 14px;
			line-height: 1.5;
			color: #2c3e50;
		}

		.edit-answer-text {
			background-color: #f8f9fa;
			padding: 12px;
			border-radius: 6px;
			border-left: 4px solid #34a853;
			font-size: 14px;
			line-height: 1.5;
			color: #2c3e50;
			max-height: 200px;
			overflow-y: auto;
		}
	}

	.chat-icon {
		margin-bottom: 16px;
	}

	.icon-grid {
		width: clamp(48px, 15vw, 80px); // 响应式尺寸，根据视口宽度调整
		height: clamp(48px, 15vw, 80px);
		background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
		border-radius: 12px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 6px;
		padding: 12px;
		box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
	}

	.grid-item {
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 4px;
	}

	.chat-title {
		font-size: 18px;
		font-weight: 500;
		color: #2c3e50;
		text-align: center;
	}

	.chat-messages {
		flex: 1;
		overflow: hidden;
		padding: 0 clamp(12px, 3vw, 20px);
		display: flex;
		flex-direction: column;
		min-height: 0; // 确保flex子元素能够正确收缩
		transition: all 0.3s ease; // 添加过渡效果
		opacity: 1; // 确保可见性
		position: relative; // 添加相对定位

		:deep(.el-scrollbar) {
			height: 100%;

			.el-scrollbar__wrap {
				height: 100%;
				overflow-x: hidden; // 隐藏水平滚动条
			}
		}

		// 当没有消息时隐藏
		&:empty {
			opacity: 0;
		}
	}

	.messages-list {
		padding: 16px 0;
		flex: 1; // 让消息列表占据剩余空间
		display: flex;
		flex-direction: column;
		gap: 16px; // 使用gap替代margin-bottom，更现代的布局方式
		min-height: 0; // 确保能够正确收缩
		overflow-y: auto; // 确保能够滚动
	}

	.message-item {
		display: flex;
		// 移除margin-bottom，因为使用了gap
		width: 100%; // 确保占据全宽
		flex-shrink: 0; // 防止被压缩

		&.is-user {
			justify-content: flex-end;

			.message-content {
				background-color: #4285f4;
				color: white;
				margin-left: 40px;
				max-width: 85%; // 用户消息保持原来的宽度
				width: auto; // 用户消息不强制占满全宽
			}
		}

		&:not(.is-user) {
			justify-content: flex-start;

			.message-content {
				background-color: white;
				color: #2c3e50;
				margin-right: 40px;
				width: 100%; // AI消息占满整个横向空间
				max-width: 100%; // AI消息占满整个横向空间
			}
		}
	}

	.message-content {
		// 宽度由具体的消息类型决定，这里不设置通用宽度
		padding: 12px 16px;
		border-radius: 18px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		word-break: break-word; // 确保长文本正确换行
		flex-shrink: 0; // 防止被压缩
		position: relative; // 添加相对定位
		box-sizing: border-box; // 确保padding不会影响总宽度
	}

	.message-text {
		font-size: 14px;
		line-height: 1.4;
		word-wrap: break-word;
		word-break: break-word; // 确保长单词也能正确换行
		overflow-wrap: break-word; // 现代浏览器的换行属性
		// 宽度由父容器决定，这里不强制设置

		:deep(p) {
			margin: 0.5em 0;
		}

		:deep(pre) {
			background-color: #f6f8fa;
			border-radius: 6px;
			padding: 16px;
			overflow: auto;
			margin: 0.5em 0;
			// 宽度由父容器决定，这里不强制设置
		}

		:deep(code) {
			font-family: monospace;
			background-color: rgba(175, 184, 193, 0.2);
			padding: 0.2em 0.4em;
			border-radius: 6px;
			font-size: 85%;
		}

		:deep(pre code) {
			background-color: transparent;
			padding: 0;
		}

		:deep(ul),
		:deep(ol) {
			padding-left: 2em;
			margin: 0.5em 0;
		}

		:deep(blockquote) {
			margin: 0.5em 0;
			padding-left: 1em;
			border-left: 4px solid #dfe2e5;
			color: #6a737d;
		}
	}

	.typing-cursor {
		display: inline-block;
		margin-left: 2px;
		animation: blink 1s infinite;
		font-weight: bold;
		color: currentColor;
		position: relative;
		top: -1em;
		height: 0;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	.message-time {
		font-size: 11px;
		opacity: 0.7;
		margin-top: 4px;
		// 宽度由具体的消息类型决定，这里不强制设置
		text-align: inherit; // 继承父元素的对齐方式
	}

	// 数据源信息样式
	.message-source {
		//margin-top: 12px;
		//padding-top: 8px;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		// 宽度由具体的消息类型决定，这里不强制设置

		.source-info {
			display: flex;
			align-items: center;
			gap: 6px;
			margin-bottom: 8px;
			font-size: 12px;
			opacity: 0.8;
			// 宽度由具体的消息类型决定，这里不强制设置

			.source-icon {
				font-size: 14px;
				flex-shrink: 0; // 防止图标被压缩
			}

			.source-text {
				font-weight: 500;
				flex: 1; // 占据剩余空间
			}
		}

		.supports-section {
			margin-top: 8px;
			// 宽度由具体的消息类型决定，这里不强制设置

			:deep(.el-collapse) {
				border: none;
				background: transparent;
				// 宽度由具体的消息类型决定，这里不强制设置

				.el-collapse-item__header {
					background: transparent;
					border: none;
					color: inherit;
					font-size: 12px;
					padding: 6px 0;
					opacity: 0.8;
					font-weight: 500;
					// 宽度由具体的消息类型决定，这里不强制设置

					&:hover {
						background: rgba(255, 255, 255, 0.1);
					}
				}

				.el-collapse-item__content {
					background: transparent;
					border: none;
					padding: 8px 0;
					// 宽度由具体的消息类型决定，这里不强制设置
				}

				.el-collapse-item__arrow {
					color: inherit;
				}
			}
		}

		.support-item {
			background: rgba(255, 255, 255, 0.1);
			border-radius: 6px;
			padding: 8px;
			margin-bottom: 8px;
			// 宽度由具体的消息类型决定，这里不强制设置
			box-sizing: border-box; // 确保padding不会影响总宽度

			&:last-child {
				margin-bottom: 0;
			}

			.support-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 6px;
				// 宽度由具体的消息类型决定，这里不强制设置

				.support-source {
					font-size: 11px;
					font-weight: 500;
					opacity: 0.9;
					flex: 1; // 占据剩余空间
				}

				.support-score {
					font-size: 10px;
					background: rgba(255, 255, 255, 0.2);
					padding: 2px 6px;
					border-radius: 10px;
					opacity: 0.8;
					flex-shrink: 0; // 防止被压缩
				}
			}

			.support-text {
				font-size: 11px;
				line-height: 1.4;
				opacity: 0.85;
				white-space: pre-wrap;
				// 宽度由具体的消息类型决定，这里不强制设置
				word-wrap: break-word; // 确保长文本正确换行
			}
		}
	}

	// 用户消息中不显示数据源
	.message-item.is-user .message-source {
		display: none;
	}

	// 消息操作按钮样式
	.message-actions {
		margin-top: 8px;
		opacity: 1;
		transition: all 0.2s ease;
		// 宽度由具体的消息类型决定，这里不强制设置
	}

	.action-buttons {
		display: flex;
		gap: 4px;
		align-items: center;
		// 对齐方式由具体的消息类型决定，这里不强制设置
		flex-wrap: wrap; // 允许按钮换行
	}

	.action-btn {
		padding: 4px 6px !important;
		font-size: 12px !important;
		color: rgba(255, 255, 255, 0.7) !important;
		border: none !important;
		background: transparent !important;
		transition: all 0.2s ease;
		border-radius: 4px !important;
		min-height: 24px !important;
		height: 24px !important;

		&:hover {
			color: rgba(255, 255, 255, 0.9) !important;
			background: rgba(255, 255, 255, 0.1) !important;
		}

		&.active {
			color: #4285f4 !important;
			background: rgba(66, 133, 244, 0.1) !important;
		}

		.el-icon {
			font-size: 12px !important;
		}
	}

	// 用户消息中的操作按钮（深色背景）
	.message-item.is-user .action-btn {
		color: rgba(255, 255, 255, 0.7) !important;

		&:hover {
			color: rgba(255, 255, 255, 0.9) !important;
			background: rgba(255, 255, 255, 0.1) !important;
		}

		&.active {
			color: #87ceeb !important;
			background: rgba(135, 206, 235, 0.2) !important;
		}
	}

	// 用户消息中的其他元素保持原来的宽度
	.message-item.is-user .message-source,
	.message-item.is-user .message-time {
		width: auto; // 不强制占满全宽
	}

	// 用户消息中的操作按钮容器右对齐
	.message-item.is-user .action-buttons {
		justify-content: flex-end; // 用户消息的操作按钮右对齐
	}

	// 用户消息中的操作按钮样式调整
	.message-item.is-user .message-actions {
		width: auto; // 用户消息的操作按钮区域不强制占满全宽
	}

	// AI消息中的操作按钮（浅色背景）
	.message-item:not(.is-user) .action-btn {
		color: rgba(44, 62, 80, 0.6) !important;

		&:hover {
			color: rgba(44, 62, 80, 0.8) !important;
			background: rgba(44, 62, 80, 0.05) !important;
		}

		&.active {
			color: #4285f4 !important;
			background: rgba(66, 133, 244, 0.1) !important;
		}
	}

	// AI消息中的操作按钮容器左对齐
	.message-item:not(.is-user) .action-buttons {
		justify-content: flex-start; // AI消息的操作按钮左对齐
	}

	.chat-input-container {
		padding: clamp(12px, 3vw, 20px); // 响应式内边距
		background-color: #fff;
		border-top: 1px solid var(--el-border-color-extra-light);
		flex-shrink: 0; // 防止被压缩
	}

	.chat-input-wrapper {
		margin-bottom: 8px;
	}

	.input-box {
		display: flex;
		align-items: center; // 改为center，确保垂直居中对齐
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 20px;
		padding: 8px 12px;
		transition: all 0.2s;
		cursor: text;
		min-height: 40px; // 设置最小高度，确保一致性

		&:focus-within:not(:has(.message-input[disabled])) {
			border-color: #4285f4;
			box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
		}

		&:hover:not(:has(.message-input[disabled])) {
			border-color: #ced4da;
		}

		&:has(.message-input[disabled]) {
			background-color: #f5f5f5;
			cursor: not-allowed;
			opacity: 0.7;
		}
	}

	.input-prefix {
		display: flex;
		align-items: center;
		margin-right: 8px;
	}

	.folder-icon {
		font-size: 18px;
		color: #6c757d;
		cursor: pointer;

		&:hover {
			color: #4285f4;
		}
	}

	.message-input {
		flex: 1;
		border: none;
		background: transparent;
		display: flex;
		align-items: center;

		:deep(.el-textarea__inner) {
			border: none !important;
			background: transparent !important;
			box-shadow: none !important;
			resize: none !important;
			padding: 2px 0 !important; // 轻微的上下内边距
			margin: 0 !important;
			font-size: 14px !important;
			line-height: 20px !important; // 固定行高，确保一致性
			color: #2c3e50 !important;
			min-height: 20px !important; // 与行高一致
			overflow: hidden !important;

			&:focus {
				box-shadow: none !important;
				border-color: transparent !important;
			}

			&::placeholder {
				color: #9ca3af !important;
				font-size: 14px !important;
				line-height: 20px !important; // 与正文行高一致
			}
		}
	}

	.input-suffix {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: 8px;
	}

	.mic-icon {
		font-size: 18px;
		color: #6c757d;
		cursor: pointer;

		&:hover {
			color: #4285f4;
		}
	}

	.send-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: #e9ecef;
		cursor: pointer;
		transition: all 0.2s;

		&.active {
			background-color: #4285f4;
			color: white;
		}

		&.loading {
			background-color: #4285f4;
			color: white;
			cursor: not-allowed;
		}

		&:hover:not(.loading) {
			background-color: #4285f4;
			color: white;
		}

		.cl-svg {
			font-size: 14px;
		}

		.el-icon {
			font-size: 14px;
		}
	}

	.input-tips {
		font-size: 12px;
		color: #6c757d;
		text-align: center;
		line-height: 1.4;
	}

	// 折叠状态下的样式
	&.is-collapse {
		.app-right-panel__header {
			padding: 0;
			justify-content: center;
		}

		.app-right-panel__toggle {
			margin: 0;
		}
	}
}

// 基于面板宽度的自适应样式
.app-right-panel {
	// 当面板较窄时（< 300px）
	&:has(.app-right-panel__content) {
		container-type: inline-size;
	}
}

@container (max-width: 300px) {
	.chat-welcome {
		padding: 20px 12px !important;
	}

	.icon-grid {
		width: 40px !important;
		height: 40px !important;
	}

	.chat-title {
		font-size: 16px !important;
	}

	.message-content {
		max-width: 100% !important;
		padding: 8px 12px !important;
	}

	.input-box {
		padding: 6px 10px !important;
		min-height: 36px !important; // 窄面板时的最小高度
	}
}

@container (min-width: 400px) {
	.chat-welcome {
		padding: 50px 24px !important;
	}

	.icon-grid {
		width: 80px !important;
		height: 80px !important;
	}

	.chat-title {
		font-size: 20px !important;
	}

	.message-content {
		max-width: 100% !important;
		padding: 14px 18px !important;
	}

	.input-box {
		padding: 10px 16px !important;
		min-height: 44px !important; // 宽面板时的最小高度
	}
}

// 响应式设计
@media only screen and (max-width: 768px) {
	.app-right-panel {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1000;
		box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);

		&.is-collapse {
			transform: translateX(100%);
		}
	}
}

// 修改反馈弹窗样式为Popover样式
.feedback-popover {
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	width: 300px;

	&::before {
		content: '';
		position: absolute;
		top: -8px;
		left: 20px;
		border-style: solid;
		border-width: 0 8px 8px 8px;
		border-color: transparent transparent white transparent;
	}

	.feedback-content {
		padding: 16px;
	}

	.feedback-title {
		font-size: 14px;
		font-weight: 500;
		color: #333;
		margin-bottom: 12px;
	}

	.feedback-options {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 16px;

		.el-button {
			margin: 0;
			border-radius: 16px;
			font-size: 13px;
			padding: 6px 12px;
			height: auto;
			border: 1px solid #e0e0e0;

			&.selected {
				background-color: #e6f4ff;
				border-color: #1890ff;
				color: #1890ff;
			}
		}
	}

	.feedback-footer {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		padding-top: 12px;
		border-top: 1px solid #f0f0f0;

		.el-button {
			padding: 6px 12px;
			font-size: 13px;
		}
	}
}

// 删除旧的dialog和popover样式
:deep(.feedback-dialog),
:deep(.feedback-popover) {
	display: none;
}

// 在style部分添加编辑对话框的样式
:deep(.edit-dialog) {
	.el-dialog__body {
		padding: 20px;
		min-height: 400px;
	}

	.cl-editor-wang {
		height: 100%;
		min-height: 300px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;

		.w-e-text-container {
			min-height: 250px;
		}
	}
}

// 编辑按钮特殊样式
.message-item:not(.is-user) .action-btn.edit-btn {
	&:hover {
		color: #409eff !important;
		background: rgba(64, 158, 255, 0.1) !important;
	}
}
</style>
