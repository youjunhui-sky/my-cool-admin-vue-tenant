<template>
	<div class="lab-wrapper">
		<div>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<div class="scroll-container">
			<div class="lab-collapse-container">
				<el-collapse
					v-model="activeNames"
					class="lab-collapse"
					@change="handleCollapseChange"
				>
					<el-collapse-item
						v-for="(a, ai) in list"
						:key="ai"
						:title="a.title"
						:name="a.title"
					>
						<div v-for="(b, bi) in a.children" :key="bi" class="group">
							<el-row :gutter="10">
								<el-col
									v-for="(c, ci) in b.children"
									:key="ci"
									:xs="24"
									:sm="24"
									:md="24"
									:lg="24"
								>
									<component :is="renderComponent(c)" />
								</el-col>
							</el-row>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onActivated, onMounted, h, markRaw, computed } from 'vue';
import { useCool } from '/@/cool';
import type { CollapseModelValue } from 'element-plus';
import { type Component } from 'vue';
import LabForm from './components/lab-form.vue';

const { route, router } = useCool();
const active = ref();
//const contentRef = ref();

// 定义响应式数据
const list = ref<any[]>([]);
//const loading = ref(false);
const error = ref<string | null>(null);

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

// 用于 el-collapse 的展开项名称数组，默认全部展开
const activeNames = ref<string[]>([]);

// 计算属性，返回所有折叠面板的标题数组，用于默认全部展开
const setAllActive = () => {
	if (list.value && list.value.length > 0) {
		//activeNames.value = list.value.map(item => item.title);
		activeNames.value = [list.value[0].title];
	}
};
const cool = useCool();

// 从后端获取数据
const fetchData = async () => {
	try {
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: 'swl' //SWL
		};
		const response = await cool.service.swl.lab.list(params);
		//console.log('response', response);
		// 转换数据格式
		list.value = response.map(item => ({
			title: item.groupName,
			children: Array.from({ length: 1 }, () => ({
				label: item.groupName,
				children: Array.from({ length: 1 }, () => ({
					component: markRaw(componentMap['blood']),
					props: {
						itemData: item.children,
						swlNo: props.swlNo,
						serialNumber: props.serialNumber
					}
				}))
			}))
		}));
		// 设置默认全部展开
		setAllActive();
	} catch (err) {
		error.value = '数据加载失败，请稍后重试';
		console.error('API Error:', err);
	}
};

// 动态组件渲染时传递数据
const renderComponent = (component: any) => {
	return h(component.component, {
		...component.props
	});
};

// 折叠面板变化处理
function handleCollapseChange(val: CollapseModelValue) {
	if (Array.isArray(val) && val.length > 0) {
		router.replace({
			query: {
				key: val[val.length - 1]
			}
		});
	} else if (typeof val === 'string' || typeof val === 'number') {
		router.replace({
			query: {
				key: val.toString()
			}
		});
	}
}

// 将后端返回的 type 映射到前端组件
const componentMap: Record<string, Component> = {
	blood: markRaw(LabForm) // 血常规组件
};

// 生命周期钩子中调用
onMounted(() => {
	fetchData();
});

onActivated(() => {
	const { key } = route.query;
	active.value = (key || '尿常规') as string;

	// 确保激活状态与路由参数同步
	if (key && !activeNames.value.includes(key as string)) {
		activeNames.value.push(key as string);
	}
});
</script>

<style lang="scss" scoped>
.lab-wrapper {
	min-height: 100%;
	overflow-y: auto;
	position: relative;
	//background-color: var(--el-bg-color);
	background-color: transparent; // 改为透明背景
	display: flex;
	flex-direction: column;
}

.lab-collapse-container {
	padding: 10px;
	margin-bottom: 10px; /* 增加底部间距 */
	flex: 1;
}

.lab-collapse-container .lab-collapse {
	width: 100%;

	:deep(.el-collapse-item__header) {
		font-size: 16px;
		height: 30px;
		font-weight: bold;
		background-color: #f5f7fa;
		//background-color: transparent; // 改为透明背景
		padding: 0 16px;
		border-radius: 4px;
		margin-bottom: 2px;
	}

	:deep(.el-collapse-item__wrap) {
		background-color: transparent; // 改为透明背景
	}

	:deep(.el-collapse-item__content) {
		padding: 0px 0px;
	}

	:deep(.el-collapse-item) {
		margin-bottom: 10px;
	}
}

.group {
	margin-bottom: 10px;

	.group-title {
		margin-bottom: 15px;
		font-size: 15px;
		font-weight: bold;
		color: #606266;
		border-left: 3px solid #409eff;
		padding-left: 10px;
	}
}

.scroll-container {
	width: 100%;
	height: calc(100vh - 200px); // 考虑到 tab 头部、父容器边距和其他元素的高度
	max-height: 70vh;
	min-height: 300px;
	overflow-y: auto !important;
	overflow-x: auto !important;
	padding: 0px;
	position: relative;
	display: block;
	box-sizing: border-box;
	z-index: 1; // 确保滚动条在最上层
	//background-color: transparent; // 改为透明背景

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
	.scroll-container {
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
