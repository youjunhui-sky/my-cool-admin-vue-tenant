<template>
	<div :ref="setRefs('editor')" class="cl-editor-vditor" :class="{ disabled }">
		<div :id="editorId" class="vditor-container"></div>

		<!-- 文件空间 - 图片 -->
		<cl-upload-space
			v-if="isSpace"
			:ref="setRefs('image')"
			accept="image/*"
			:show-btn="false"
			@confirm="onFileConfirm"
		/>

		<!-- 直接上传 - 图片 -->
		<div v-else class="upload-inner">
			<cl-upload :ref="setRefs('image')" accept="image/*" @success="onFileConfirm" />
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'cl-editor-vditor'
});

import { onBeforeUnmount, onMounted, ref, shallowRef, watch, nextTick, type PropType } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useCool } from '/@/cool';
import { isArray } from 'lodash-es';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	modelValue: String,
	// 模式: wysiwyg(所见即所得), sv(分屏预览), ir(即时渲染)
	mode: {
		type: String as PropType<'wysiwyg' | 'sv' | 'ir'>,
		default: 'wysiwyg'
	},
	// 高度
	height: {
		type: [String, Number],
		default: 500
	},
	// 禁用
	disabled: Boolean,
	// 是否预览模式
	preview: Boolean,
	// 是否使用文件空间
	isSpace: {
		type: Boolean,
		default: false
	},
	// 占位符
	placeholder: {
		type: String,
		default: ''
	}
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);

const { refs, setRefs } = useCool();
const { t } = useI18n();

// 编辑器实例
const vditorInstance = shallowRef<Vditor | null>(null);

// 编辑器是否已完全初始化
const isEditorReady = ref(false);

// 编辑器ID（唯一标识）
const editorId = ref(`vditor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

// 临时存储插入函数
const temp: { insertFn: ((url: string, alt?: string, title?: string) => void) | null } = {
	insertFn: null
};

// 初始化编辑器
const initVditor = async () => {
	try {
		await nextTick();

		const container = document.getElementById(editorId.value);
		if (!container) {
			console.warn('Vditor container not found, retrying...');
			// 延迟重试
			setTimeout(() => {
				const retryContainer = document.getElementById(editorId.value);
				if (!retryContainer) {
					console.error('Vditor container not found after retry');
					return;
				}
			}, 100);
			return;
		}

		// 销毁旧实例
		if (vditorInstance.value) {
			try {
				vditorInstance.value.destroy();
			} catch (destroyError) {
				console.warn('Error destroying old vditor instance:', destroyError);
			}
			vditorInstance.value = null;
			isEditorReady.value = false; // 重置初始化状态
		}
	} catch (error) {
		console.error('Error in initVditor setup:', error);
		return;
	}

	// 计算高度
	let heightValue: number;
	if (typeof props.height === 'number') {
		heightValue = props.height;
	} else if (typeof props.height === 'string') {
		// 如果是字符串，尝试解析
		if (props.height.includes('px')) {
			heightValue = parseInt(props.height.replace('px', ''), 10);
		} else if (props.height.includes('vh')) {
			// 视口高度
			const vh = parseFloat(props.height.replace('vh', ''));
			heightValue = (window.innerHeight * vh) / 100;
		} else {
			// 尝试解析为数字
			const parsed = parseInt(props.height, 10);
			heightValue = isNaN(parsed) ? 500 : parsed;
		}
	} else {
		heightValue = 500; // 默认值
	}

	// 确保高度值有效
	if (isNaN(heightValue) || heightValue <= 0) {
		heightValue = 500;
	}

	// 创建 Vditor 实例
	vditorInstance.value = new Vditor(editorId.value, {
		height: heightValue,
		mode: props.mode as 'wysiwyg' | 'sv' | 'ir',
		placeholder: props.placeholder || t('请输入'),
		value: props.modelValue || '',
		upload: {
			accept: 'image/*',
			url: '', // 如果需要上传功能，可以配置上传地址
			linkToImgUrl: '', // 链接转图片
			handler: (files: File[]): string | Promise<string> | null => {
				// 处理文件上传
				if (props.isSpace) {
					// 使用文件空间
					temp.insertFn = (url: string, alt?: string, title?: string) => {
						if (vditorInstance.value) {
							vditorInstance.value.insertValue(
								`![${alt || ''}](${url}${title ? ` "${title}"` : ''})`
							);
						}
					};
					refs.image.open();
					return null; // 文件空间上传是异步的，返回 null
				} else {
					// 直接上传
					if (files.length > 0) {
						refs.image.upload(files[0]);
					}
					return null; // 直接上传也是异步的，返回 null
				}
			}
		},
		// 工具栏配置
		toolbar: [
			'headings',
			'bold',
			'italic',
			'strike',
			'|',
			'line',
			'quote',
			'list',
			'ordered-list',
			'check',
			'|',
			'code',
			'inline-code',
			'insert-before',
			'insert-after',
			'|',
			'link',
			'table',
			'|',
			'undo',
			'redo',
			'|',
			'upload',
			'|',
			'fullscreen',
			'edit-mode',
			'both',
			'preview',
			'outline',
			'code-theme',
			'content-theme'
		],
		// 事件监听
		after: () => {
			// 编辑器初始化完成后的回调
			try {
				isEditorReady.value = true;
				updateDisabled();
			} catch (error) {
				console.error('Error in vditor after callback:', error);
			}
		},
		// 输入事件
		input: (value: string) => {
			try {
				emit('update:modelValue', value);
				emit('change', value);
			} catch (error) {
				console.error('Error in vditor input event:', error);
			}
		},
		// 聚焦事件
		focus: (value: string) => {
			try {
				emit('focus', value);
			} catch (error) {
				console.error('Error in vditor focus event:', error);
			}
		},
		// 失焦事件
		blur: (value: string) => {
			try {
				emit('blur', value);
			} catch (error) {
				console.error('Error in vditor blur event:', error);
			}
		}
	});
};

// 更新禁用状态
const updateDisabled = () => {
	try {
		// 只有在编辑器完全初始化后才更新禁用状态
		if (vditorInstance.value && isEditorReady.value) {
			if (props.disabled || props.preview) {
				vditorInstance.value.disabled();
			} else {
				vditorInstance.value.enable();
			}
		}
	} catch (error) {
		console.error('Error updating disabled state:', error);
	}
};

// 文件选择回调
const onFileConfirm = (files: any[]) => {
	if (!isArray(files)) {
		files = [files];
	}

	if (files.length > 0 && temp.insertFn) {
		files.forEach(file => {
			if (file.url && temp.insertFn) {
				temp.insertFn(file.url, file.name, file.name);
			}
		});
		temp.insertFn = null;
	}
};

// 监听 modelValue 变化
watch(
	() => props.modelValue,
	val => {
		try {
			// 只有在编辑器完全初始化后才更新值
			if (vditorInstance.value && isEditorReady.value) {
				// 使用 nextTick 确保编辑器内部状态已准备好
				nextTick(() => {
					try {
						if (vditorInstance.value && isEditorReady.value) {
							const currentValue = vditorInstance.value.getValue();
							if (val !== currentValue) {
								vditorInstance.value.setValue(val || '');
							}
						}
					} catch (error) {
						console.error('Error updating vditor value in nextTick:', error);
					}
				});
			}
		} catch (error) {
			console.error('Error updating vditor value:', error);
		}
	}
);

// 监听禁用状态变化
watch(
	() => [props.disabled, props.preview],
	() => {
		try {
			updateDisabled();
		} catch (error) {
			console.error('Error updating vditor disabled state:', error);
		}
	}
);

// 监听高度变化
watch(
	() => props.height,
	() => {
		try {
			if (vditorInstance.value) {
				let heightValue: number;
				if (typeof props.height === 'number') {
					heightValue = props.height;
				} else if (typeof props.height === 'string') {
					if (props.height.includes('px')) {
						heightValue = parseInt(props.height.replace('px', ''), 10);
					} else if (props.height.includes('vh')) {
						const vh = parseFloat(props.height.replace('vh', ''));
						heightValue = (window.innerHeight * vh) / 100;
					} else {
						// 尝试解析为数字
						const parsed = parseInt(props.height, 10);
						heightValue = isNaN(parsed) ? 500 : parsed;
					}
				} else {
					heightValue = 500;
				}

				// 确保高度值有效
				if (isNaN(heightValue) || heightValue <= 0) {
					heightValue = 500;
				}

				// Vditor 没有 setHeight 方法，高度变化时需要重新初始化
				// 但为了避免频繁重新初始化，使用防抖机制
				// 直接重新初始化，因为高度变化通常不会很频繁
				initVditor();
			}
		} catch (error) {
			console.error('Error updating vditor height:', error);
		}
	}
);

// 监听模式变化
watch(
	() => props.mode,
	async () => {
		try {
			// 重新初始化编辑器以应用新模式
			await initVditor();
		} catch (error) {
			console.error('Error reinitializing vditor with new mode:', error);
		}
	}
);

// 组件挂载后初始化
onMounted(() => {
	initVditor();
});

// 组件卸载前销毁
onBeforeUnmount(() => {
	if (vditorInstance.value) {
		try {
			vditorInstance.value.destroy();
		} catch (error) {
			console.warn('Error destroying vditor on unmount:', error);
		}
		vditorInstance.value = null;
		isEditorReady.value = false;
	}
});

// 暴露方法
defineExpose({
	getValue: () => {
		if (vditorInstance.value && isEditorReady.value) {
			try {
				return vditorInstance.value.getValue() || '';
			} catch (error) {
				console.error('Error getting vditor value:', error);
				return '';
			}
		}
		return '';
	},
	setValue: (value: string) => {
		if (vditorInstance.value && isEditorReady.value) {
			try {
				vditorInstance.value.setValue(value);
			} catch (error) {
				console.error('Error setting vditor value:', error);
			}
		}
	},
	focus: () => {
		if (vditorInstance.value && isEditorReady.value) {
			try {
				vditorInstance.value.focus();
			} catch (error) {
				console.error('Error focusing vditor:', error);
			}
		}
	},
	blur: () => {
		if (vditorInstance.value && isEditorReady.value) {
			try {
				vditorInstance.value.blur();
			} catch (error) {
				console.error('Error blurring vditor:', error);
			}
		}
	},
	disabled: () => {
		if (vditorInstance.value && isEditorReady.value) {
			try {
				vditorInstance.value.disabled();
			} catch (error) {
				console.error('Error disabling vditor:', error);
			}
		}
	},
	enable: () => {
		if (vditorInstance.value && isEditorReady.value) {
			try {
				vditorInstance.value.enable();
			} catch (error) {
				console.error('Error enabling vditor:', error);
			}
		}
	},
	insertValue: (value: string) => {
		if (vditorInstance.value && isEditorReady.value) {
			try {
				vditorInstance.value.insertValue(value);
			} catch (error) {
				console.error('Error inserting value to vditor:', error);
			}
		}
	},
	setHeight: (height: number) => {
		// Vditor 没有 setHeight 方法，需要重新初始化
		if (vditorInstance.value) {
			initVditor();
		}
	},
	destroy: () => {
		if (vditorInstance.value) {
			try {
				vditorInstance.value.destroy();
			} catch (error) {
				console.warn('Error destroying vditor:', error);
			}
			vditorInstance.value = null;
			isEditorReady.value = false;
		}
	}
});
</script>

<style lang="scss" scoped>
.cl-editor-vditor {
	border: 1px solid var(--el-border-color);
	border-radius: 4px;
	box-sizing: border-box;
	line-height: normal;
	overflow: hidden;

	.vditor-container {
		width: 100%;
		height: 100%;
	}

	.upload-inner {
		visibility: hidden;
		position: absolute;
		left: 0;
		top: 0;
	}

	&.disabled {
		:deep(.vditor) {
			background-color: var(--el-disabled-bg-color);
			opacity: 0.6;
		}
	}

	// Vditor 样式覆盖
	:deep(.vditor) {
		border: none;
		border-radius: 0;
	}

	:deep(.vditor-toolbar) {
		border-bottom: 1px solid var(--el-border-color);
		background-color: var(--el-bg-color);
	}

	:deep(.vditor-content) {
		background-color: var(--el-bg-color);
	}

	:deep(.vditor-input) {
		background-color: var(--el-bg-color);
		color: var(--el-text-color-primary);
	}

	:deep(.vditor-preview) {
		background-color: var(--el-bg-color);
		color: var(--el-text-color-primary);
	}
}
</style>
