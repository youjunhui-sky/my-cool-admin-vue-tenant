<template>
	<div class="card">
		<div class="card__container">
			<cl-crud ref="Crud" padding="0">
				<cl-table ref="Table" :data="tableData" />
			</cl-crud>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useTable } from '@cool-vue/crud';
import { onMounted, PropType, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { service } from '/@/cool';

const { t } = useI18n();

// 类型
const type = ref('day');

// const Crud = useCrud(
// 	{
// 		service: service.etiology.component.getWeightStat
// 	},
// 	app => {
// 		app.refresh();
// 	}
// );

/**
 * 组件属性定义
 */
interface ItemData {
	age: string;
	total: number;
	nan: number;
	nv: number;
}

const props = defineProps({
	ageData: {
		type: Array as PropType<ItemData[]>,
		default: () => [] // 提供默认空数组
	}
});

const tableData = ref<ItemData[]>([]); // 初始化空数组，后续接收JSON数据

// 监听 props.ageData 变化，确保数据更新时表格也更新
watch(
	() => props.ageData,
	newVal => {
		tableData.value = [...newVal];
	},
	{ immediate: true, deep: true }
);

onMounted(() => {
	// 组件挂载时设置数据
	tableData.value = [...props.ageData];
});

const Table = useTable({
	autoHeight: false,
	contextMenu: ['order-asc', 'order-desc'],
	columns: [
		{
			label: '序号',
			type: 'index',
			width: 60
		},
		{
			label: '年龄',
			prop: 'age',
			minWidth: 120
		},
		{
			label: '男',
			prop: 'nan',
			minWidth: 100
		},
		{
			label: '女',
			prop: 'nv',
			minWidth: 100
		},
		{
			label: '总人次',
			prop: 'total',
			minWidth: 100
		}
	]
});
</script>

<style lang="scss" scoped>
.card {
	padding-bottom: 20px;
}

.loading-placeholder {
	padding: 40px 0;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
