<template>
	<div>
		<!-- 右上角触发按钮 -->
		<el-button class="trigger-btn" type="primary" size="small" @click="togglePanel">
			{{ isPanelActive ? '关闭面板' : '调试面板' }}
		</el-button>

		<!-- 右侧面板 -->
		<div v-show="isPanelActive" class="devtools-panel" :style="{ width: panelWidth + 'px' }">
			<!-- 面板头部 -->
			<div class="panel-header">
				<span class="title">调试工具</span>
				<el-icon class="close-btn" @click="togglePanel"><close /></el-icon>
			</div>

			<!-- 拖拽条 -->
			<div class="drag-handle" @mousedown="startDrag"></div>

			<!-- 标签页内容 -->
			<el-tabs v-model="activeTab">
				<el-tab-pane label="控制台" name="console">
					<div class="console-content">
						<p>调试信息输出区</p>
					</div>
				</el-tab-pane>
				<el-tab-pane label="元素" name="elements">
					<div class="elements-content">
						<p>DOM结构查看区</p>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Close } from '@element-plus/icons-vue';

// 响应式状态
const isPanelActive = ref(false);
const panelWidth = ref(300);
const activeTab = ref('console');
const isDragging = ref(false);
let startX = 0;
let startWidth = 0;

// 切换面板显示
const togglePanel = () => {
	isPanelActive.value = !isPanelActive.value;
};

// 拖拽逻辑
const startDrag = (e: MouseEvent) => {
	isDragging.value = true;
	startX = e.clientX;
	startWidth = panelWidth.value;
	document.addEventListener('mousemove', onDrag);
	document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
	if (isDragging.value) {
		const deltaX = e.clientX - startX;
		panelWidth.value = Math.min(Math.max(200, startWidth - deltaX), 600);
	}
};

const stopDrag = () => {
	isDragging.value = false;
	document.removeEventListener('mousemove', onDrag);
	document.removeEventListener('mouseup', stopDrag);
};
</script>

<style scoped>
/* 触发按钮样式 */
.trigger-btn {
	position: fixed;
	top: 20px;
	right: 20px;
	z-index: 10000;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 右侧面板容器 */
.devtools-panel {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	background: #fff;
	border-left: 1px solid #ebeef5;
	box-shadow: -2px 0 12px rgba(0, 0, 0, 0.1);
	z-index: 9999;
}

/* 面板头部 */
.panel-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px;
	border-bottom: 1px solid #ebeef5;
}

.title {
	font-weight: 500;
	color: #303133;
}

.close-btn {
	cursor: pointer;
	padding: 4px;
	border-radius: 4px;
	transition: all 0.3s;

	&:hover {
		background: #f5f7fa;
		color: #409eff;
	}
}

/* 拖拽条样式 */
.drag-handle {
	position: absolute;
	left: -4px;
	top: 0;
	bottom: 0;
	width: 8px;
	cursor: ew-resize;
	z-index: 1;

	&:hover {
		background: rgba(64, 158, 255, 0.2);
	}
}

/* 内容区域 */
.el-tabs {
	height: calc(100% - 48px);
}

:deep(.el-tabs__content) {
	height: calc(100% - 55px);
}

.console-content,
.elements-content {
	height: 100%;
	padding: 12px;
	overflow: auto;
}
</style>
