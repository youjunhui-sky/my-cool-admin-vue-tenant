<template>
	<div
		class="app-layout"
		:class="{
			'is-collapse': app.isFold,
			'is-full': app.isFull,
			'is-right-panel-open': !app.isRightPanelFold
		}"
	>
		<div class="app-layout__mask" @click="app.fold(true)"></div>

		<div class="app-layout__left">
			<slider />
		</div>

		<div
			class="app-layout__right"
			:class="{ 'is-resizing': isResizing }"
			:style="{ width: rightWidth }"
		>
			<topbar />
			<process />
			<views />
		</div>

		<!-- 可拖拽的分隔条 -->
		<div v-if="!app.isRightPanelFold" class="app-layout__resizer" @mousedown="startResize">
			<div class="app-layout__resizer-line"></div>
		</div>

		<div
			class="app-layout__panel"
			:class="{ 'is-resizing': isResizing }"
			:style="{ width: panelWidth }"
		>
			<right-panel />
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'app-layout'
});

import { useBase } from '/$/base';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Topbar from './components/topbar.vue';
import Slider from './components/slider.vue';
import process from './components/process.vue';
import Views from './components/views.vue';
import RightPanel from './components/right-panel.vue';

const { app } = useBase();

/**
 * 拖拽分隔条相关状态
 */
const panelWidthValue = ref(280); // 右侧面板宽度
const isResizing = ref(false);
const minPanelWidth = 200; // 最小宽度
const maxPanelWidth = 600; // 最大宽度

/**
 * 计算右侧内容区域宽度
 */
const rightWidth = computed(() => {
	// 当面板关闭时，右侧内容区域占满除左侧菜单外的全部空间
	if (app.isRightPanelFold) {
		if (app.isFull) {
			return '100%';
		}
		const leftWidth = app.isFold ? 67 : 255;
		return `calc(100% - ${leftWidth}px)`;
	}

	// 当面板打开时，右侧内容区域需要减去面板宽度和分隔条宽度
	const resizerWidth = 4; // 分隔条宽度

	if (app.isFull) {
		return `calc(100% - ${panelWidthValue.value}px - ${resizerWidth}px)`;
	}

	const leftWidth = app.isFold ? 67 : 255;
	return `calc(100% - ${leftWidth}px - ${panelWidthValue.value}px - ${resizerWidth}px)`;
});

/**
 * 计算右侧面板宽度
 */
const panelWidth = computed(() => {
	return !app.isRightPanelFold ? `${panelWidthValue.value}px` : '0';
});

/**
 * 开始拖拽调整大小
 */
function startResize(e: MouseEvent) {
	isResizing.value = true;

	const startX = e.clientX;
	const startWidth = panelWidthValue.value;

	function onMouseMove(e: MouseEvent) {
		if (!isResizing.value) return;

		// 计算新的宽度（从右向左拖拽时宽度增加）
		const deltaX = startX - e.clientX;
		const newWidth = Math.max(minPanelWidth, Math.min(maxPanelWidth, startWidth + deltaX));

		// 实时更新宽度，确保布局立即响应
		panelWidthValue.value = newWidth;

		// 防止拖拽过程中的性能问题
		e.preventDefault();
	}

	function onMouseUp() {
		isResizing.value = false;
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
	}

	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);
	document.body.style.cursor = 'col-resize';
	document.body.style.userSelect = 'none';
}

// 组件挂载时恢复保存的宽度
onMounted(() => {
	const savedWidth = localStorage.getItem('right-panel-width');
	if (savedWidth) {
		panelWidthValue.value = parseInt(savedWidth);
	}
});

// 监听宽度变化并保存到本地存储
import { watch } from 'vue';
watch(panelWidthValue, newWidth => {
	localStorage.setItem('right-panel-width', newWidth.toString());
});
</script>

<style lang="scss" scoped>
.app-global {
	position: absolute;
	left: 0;
	top: 0;
}

.app-layout {
	display: flex;
	background-color: var(--bg-color);
	height: 100%;
	width: 100%;
	overflow: hidden;

	&__left {
		overflow: hidden;
		height: 100%;
		width: 255px;
		transition: left 0.2s;
	}

	&__right {
		display: flex;
		flex-direction: column;
		height: 100%;
		flex-shrink: 0;
		transition: width 0.2s ease-in-out;

		&.is-resizing {
			transition: none; // 拖拽时禁用过渡动画，确保实时响应
		}
	}

	&__resizer {
		position: relative;
		width: 4px;
		height: 100%;
		cursor: col-resize;
		background-color: transparent;
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			.app-layout__resizer-line {
				background-color: var(--el-color-primary);
				opacity: 1;
			}
		}

		&-line {
			width: 2px;
			height: 60px;
			background-color: var(--el-border-color);
			border-radius: 1px;
			opacity: 0.5;
			transition: all 0.2s ease;
		}
	}

	&__panel {
		overflow: hidden;
		height: 100%;
		flex-shrink: 0;
		transition: width 0.2s ease-in-out;

		&.is-resizing {
			transition: none; // 拖拽时禁用过渡动画
		}
	}

	&__mask {
		position: fixed;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.5);
		height: 100%;
		width: 100%;
		z-index: 999;
	}

	@media only screen and (max-width: 768px) {
		.app-layout__left {
			position: absolute;
			left: 0;
			z-index: 9999;
			transition:
				transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
				box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
		}

		.app-layout__right {
			width: 100% !important;
		}

		.app-layout__resizer {
			display: none;
		}

		.app-layout__panel {
			position: absolute;
			right: 0;
			top: 0;
			z-index: 1000;
		}

		&.is-collapse {
			.app-layout__left {
				transform: translateX(-100%);
			}

			.app-layout__mask {
				display: none;
			}
		}

		&.is-right-panel-open {
			.app-layout__panel {
				width: 280px !important;
			}
		}
	}

	@media only screen and (min-width: 768px) {
		.app-layout__left,
		.app-layout__right,
		.app-layout__panel {
			transition: width 0.2s ease-in-out;
		}

		.app-layout__mask {
			display: none;
		}

		&.is-collapse {
			.app-layout__left {
				width: 67px;
			}
		}
	}

	&.is-full {
		.app-layout__left {
			width: 0;
		}

		:deep(.a-menu),
		:deep(.app-topbar) {
			padding: 0;
			height: 0;
			overflow: hidden;
		}
	}
}
</style>
