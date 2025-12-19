<template>
	<div class="card">
		<div class="card__container">
			<!-- 使用原生 el-table 组件替代 cl-table，以直接控制表格渲染 -->
			<el-table
				:data="tableData"
				style="width: 100%; margin-top: 10px"
				border
				stripe
				:max-height="450"
			>
				<!-- 固定列 - 序号 -->
				<el-table-column type="index" width="60" label="序号" />

				<!-- 固定列 - 结石成分 -->
				<el-table-column prop="component" label="结石成分" min-width="120" />

				<!-- 固定列 - 小计 -->
				<el-table-column prop="total" label="小计" min-width="100" />

				<el-table-column prop="nan" label="男" min-width="100" />

				<el-table-column prop="nv" label="女" min-width="100" />

				<el-table-column prop="totalLocation" label="所有部位" min-width="100" />

				<!-- 动态位置列 - 通过 v-for 渲染 -->
				<el-table-column
					v-for="location in dynamicLocationColumns"
					:key="location.prop"
					:prop="location.prop"
					:label="location.label"
					min-width="120"
				/>
			</el-table>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, reactive, ref, watch, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { service } from '/@/cool';
import { ElMessage } from 'element-plus';

const { t } = useI18n();

// 类型
const type = ref('day');

/**
 * 组件属性定义
 */
interface ItemData {
	component: string;
	total: number;
	age1: number;
	age2: number;
	age3: number;
	age4: number;
	age5: number;
	age6: number;
	age7: number;
	age8: number;
	age9: number;
	[key: string]: any; // 允许动态字段
}

/**
 * 列配置接口
 */
interface ColumnConfig {
	label: string;
	prop: string;
}

// 位置列配置（动态生成）
const dynamicLocationColumns = ref<ColumnConfig[]>([]);

const props = defineProps({
	locationData: {
		type: Array as PropType<any[]>,
		default: () => [] // 提供默认空数组
	}
});

const tableData = ref<ItemData[]>([]); // 初始化空数组，后续接收JSON数据

// 监听 props.locationData 变化，确保数据更新时表格也更新
watch(
	() => props.locationData,
	newVal => {
		tableData.value = [...newVal];
	},
	{ immediate: true, deep: true }
);

/**
 * 从后端获取表格列配置
 */
async function fetchColumnConfig() {
	try {
		// 测试数据 - 实际项目中替换为真实API调用
		// const res = [
		// 	{
		// 		location: '肾',
		// 		title: '肾'
		// 	},
		// 	{
		// 		location: '膀胱',
		// 		title: '膀胱'
		// 	},
		// 	{
		// 		location: '输尿管',
		// 		title: '输尿管'
		// 	}
		// ];

		const locationColumn = await service.stat.info.getComponentLocationStatColumn();

		//console.log('获取到的动态列配置:', locationColumn);

		if (locationColumn && Array.isArray(locationColumn)) {
			// 转换API返回的列为表格列配置
			const newDynamicColumns: ColumnConfig[] = locationColumn.map((item: any) => {
				return {
					label: item.stoneLocation || '未知',
					prop: item.stoneLocation
				};
			});

			// 更新位置列配置
			dynamicLocationColumns.value = newDynamicColumns;
			//console.log('更新后的位置列配置:', dynamicLocationColumns.value);

			// 首先设置初始数据
			tableData.value = [...props.locationData];
			// 更新表格数据，添加动态列对应的数据
			//updateTableData(res);
		}
	} catch (error) {
		console.error('获取表格列配置失败:', error);
	}
}

/**
 * 更新表格数据，为动态列添加数据
 */
function updateTableData(locations: any[]) {
	// 创建模拟数据或处理现有数据
	const updatedData = tableData.value.map(row => {
		const newRow = { ...row };

		// 为每个位置添加随机数据或实际数据
		locations.forEach(loc => {
			const propName = `location_${loc.location.toLowerCase().replace(/\s+/g, '_')}`;
			// 模拟数据 - 在实际项目中替换为实际数据
			newRow[propName] = Math.floor(Math.random() * 100);
		});

		return newRow;
	});

	// 更新表格数据
	tableData.value = updatedData;
	//console.log('更新后的表格数据:', tableData.value);
}

onMounted(async () => {
	// 获取动态列配置
	await fetchColumnConfig();
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
