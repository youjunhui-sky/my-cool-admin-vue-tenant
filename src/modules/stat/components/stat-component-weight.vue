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
	component: string;
	total: number;
	weight1: number;
	weight2: number;
	weight3: number;
	weight4: number;
	weight5: number;
	weight6: number;
	weight7: number;
}

const props = defineProps({
	weightData: {
		type: Array as PropType<ItemData[]>,
		default: () => [] // 提供默认空数组
	}
});

const tableData = ref<ItemData[]>([]); // 初始化空数组，后续接收JSON数据

// 监听 props.weightData 变化，确保数据更新时表格也更新
watch(
	() => props.weightData,
	newVal => {
		tableData.value = [...newVal];
	},
	{ immediate: true, deep: true }
);

onMounted(() => {
	// 组件挂载时设置数据
	tableData.value = [...props.weightData];
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
			label: '结石成分',
			prop: 'component',
			minWidth: 120
		},
		{
			label: '小计',
			prop: 'total',
			minWidth: 100
		},
		{
			label: '0-20kg',
			prop: 'weight1',
			minWidth: 100
		},
		{
			label: '21-40kg',
			prop: 'weight2',
			minWidth: 100
		},
		{
			label: '41-60kg',
			prop: 'weight3',
			minWidth: 120
		},
		{
			label: '61-80kg',
			prop: 'weight4',
			minWidth: 120
		},
		{
			label: '81-100kg',
			prop: 'weight5',
			minWidth: 120
		},
		{
			label: '101-120kg',
			prop: 'weight6',
			minWidth: 120
		},
		{
			label: '121kg以上',
			prop: 'weight7',
			minWidth: 120
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
