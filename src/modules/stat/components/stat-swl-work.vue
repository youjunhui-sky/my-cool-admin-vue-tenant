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
	item: string;
	total: number;
	per: number;
}

const props = defineProps({
	workData: {
		type: Array as PropType<any[]>,
		default: () => [] // 提供默认空数组
	}
});

const tableData = ref<ItemData[]>([]); // 初始化空数组，后续接收JSON数据

// 监听 props.curativeData 变化，确保数据更新时表格也更新
watch(
	() => props.workData,
	newVal => {
		tableData.value = [...newVal];
	},
	{ immediate: true, deep: true }
);

onMounted(() => {
	// 组件挂载时设置数据
	tableData.value = [...props.workData];
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
			label: '医生',
			prop: 'doctor',
			minWidth: 120
		},
		{
			label: '诊疗人次',
			prop: 'zlrc',
			minWidth: 100
		},
		{
			label: '超声人次',
			prop: 'csrc',
			minWidth: 100
		},
		{
			label: '成分人次',
			prop: 'cfrc',
			minWidth: 100
		},
		{
			label: '评估人次',
			prop: 'pgrc',
			minWidth: 100
		},
		{
			label: '诊疗收入',
			prop: 'zlsr',
			minWidth: 100
		},
		{
			label: '超声收入',
			prop: 'cssr',
			minWidth: 100
		},
		{
			label: '总收入',
			prop: 'zsr',
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
