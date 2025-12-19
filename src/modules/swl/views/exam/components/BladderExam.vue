<!-- eslint-disable vue/valid-v-slot -->
<template>
	<div class="bladder-exam">
		<el-form label-width="auto" style="height: auto">
			<!-- 使用CSS Grid布局实现三列结构 -->
			<div class="exam-layout">
				<!-- 左侧列：结石数量 -->
				<div class="left-column">
					<el-form-item label="N" style="margin-bottom: 0">
						<cl-select
							:options="dict.get('image_num')"
							v-model="localData.bladderStoneCount"
							style="width: 100%"
							label-key="name"
							value-key="name"
							check-strictly
							default-expand-all
						>
						</cl-select>
					</el-form-item>
				</div>

				<!-- 中间列：结石详细数据 -->
				<div class="middle-column">
					<!-- 第一行 -->
					<div class="stone-row">
						<el-form-item label="S" style="margin-bottom: 3px; width: 48%">
							<div style="display: flex; align-items: center; width: 100%">
								<el-input
									v-model="localData.bladderStone1Front"
									placeholder="请输入第一颗结石前框"
									style="flex: 1; min-width: auto; margin-right: 5px"
								></el-input>
								<span> * </span>
								<el-input
									v-model="localData.bladderStone1Back"
									placeholder="请输入第一颗结石后框"
									style="flex: 1; min-width: auto; margin-left: 5px"
								></el-input>
							</div>
						</el-form-item>

						<el-form-item label="SA" style="margin-bottom: 3px; width: 48%">
							<div style="display: flex; align-items: center; width: 100%">
								<el-input
									:model-value="calculatedStone1Area"
									placeholder="请输入第一颗结石表面积"
									style="flex: 1; min-width: auto; margin-right: 5px"
									readonly
									disabled
								></el-input>
								<span> L </span>
								<el-input
									v-model="localData.bladderStone1Location"
									value="膀胱"
									style="flex: 1.5; min-width: auto; margin-left: 5px"
								></el-input>
							</div>
						</el-form-item>
					</div>

					<!-- 第二行 -->
					<div class="stone-row">
						<el-form-item label="S" style="margin-bottom: 0; width: 48%">
							<div style="display: flex; align-items: center; width: 100%">
								<el-input
									v-model="localData.bladderStone2Front"
									placeholder="请输入第二颗结石前框"
									style="flex: 1; min-width: auto; margin-right: 5px"
								></el-input>
								<span> * </span>
								<el-input
									v-model="localData.bladderStone2Back"
									placeholder="请输入第二颗结石后框"
									style="flex: 1; min-width: auto; margin-left: 5px"
								></el-input>
							</div>
						</el-form-item>

						<el-form-item label="SA" style="margin-bottom: 0; width: 48%">
							<div style="display: flex; align-items: center; width: 100%">
								<el-input
									:model-value="calculatedStone2Area"
									placeholder="请输入第二颗结石表面积"
									style="flex: 1; min-width: auto; margin-right: 5px"
									readonly
									disabled
								></el-input>
								<span> L </span>
								<el-input
									v-model="localData.bladderStone2Location"
									value="膀胱"
									style="flex: 1.5; min-width: auto; margin-left: 5px"
								></el-input>
							</div>
						</el-form-item>
					</div>
				</div>

				<!-- 右侧列：结石形状和性质 -->
				<div class="right-column">
					<div class="stone-properties" style="width: 100%">
						<el-form-item
							label="KUB形状"
							label-width="auto"
							style="
								margin-bottom: 0;
								min-width: auto;
								width: 48%;
								margin-right: 5px;
								flex: 1;
							"
						>
							<cl-select
								:options="dict.get('image_kub')"
								v-model="localData.bladderStoneShape"
								label-key="name"
								value-key="name"
								check-strictly
								default-expand-all
								style="width: 100%"
							></cl-select>
						</el-form-item>

						<el-form-item
							label="结石性质"
							label-width="auto"
							style="margin-bottom: 0; min-width: auto; width: 48%; flex: 1"
						>
							<cl-select
								:options="dict.get('image_kubsize')"
								v-model="localData.bladderStoneNature"
								label-key="name"
								value-key="name"
								check-strictly
								default-expand-all
								style="width: 100%"
							></cl-select>
						</el-form-item>
					</div>
				</div>
			</div>

			<el-form-item label="并发症" style="margin-top: 5px">
				<el-checkbox-group
					v-model="localData.complications"
					@change="handleComplicationChange"
				>
					<el-checkbox
						v-for="option in complicationOptions"
						:key="option.value"
						:label="option.label"
						:value="option.value"
					>
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch, ref, onMounted, computed } from 'vue';
import { useDict } from '/$/dict';

interface ExamData {
	result: string;
	doctor: string;
	examDate: string;
	type: string;
	data: Eps.SwlImagingExamEntity;
}

interface bladderData {
	bladderStoneCount: string;
	bladderStone1Front: number | undefined;
	bladderStone1Back: number | undefined;
	bladderStone1Area: number | undefined;
	bladderStone1Location: string;
	bladderStone2Front: number | undefined;
	bladderStone2Back: number | undefined;
	bladderStone2Area: number | undefined;
	bladderStone2Location: string;
	bladderStoneShape: string;
	bladderStoneNature: string;
	complications: string[];
}

export default defineComponent({
	name: 'bladder-exam',
	props: {
		examData: {
			type: Object as PropType<ExamData>,
			required: true,
			data: {
				type: Object as PropType<Eps.SwlImagingExamEntity>,
				required: false
			}
		},
		data: {
			type: Object,
			default: () => ({})
		}
	},
	setup(props, { emit }) {
		const { dict } = useDict();

		const complicationOptions = [
			{ label: '膀胱炎症', value: 'inflammation' },
			{ label: '膀胱刺激症状', value: 'irritation' },
			{ label: '膀胱梗阻', value: 'obstruction' },
			{ label: '尿急尿痛', value: 'painful' }
		];

		// Local data specific to bladder exam
		const localData = reactive<bladderData>({
			bladderStoneCount: '',
			bladderStone1Front: undefined,
			bladderStone1Back: undefined,
			bladderStone1Area: undefined,
			bladderStone1Location: '',
			bladderStone2Front: undefined,
			bladderStone2Back: undefined,
			bladderStone2Area: undefined,
			bladderStone2Location: '',
			bladderStoneShape: '',
			bladderStoneNature: '',
			complications: []
		});

		const handleComplicationChange = (val: string[]) => {
			//console.log('当前选中值:', val); // 调试输出
		};

		// Watch for changes in the data prop
		watch(
			() => props.data,
			newData => {
				if (newData && newData.bladderStoneCount !== undefined) {
					localData.bladderStoneCount = newData.bladderStoneCount;
					localData.bladderStone1Front = Number(newData.bladderStone1Front || null);
					localData.bladderStone1Back = Number(newData.bladderStone1Back || null);
					localData.bladderStone1Area = Number(newData.bladderStone1Area || null);
					localData.bladderStone1Location = newData.bladderStone1Location;
					localData.bladderStone2Front = Number(newData.bladderStone2Front || null);
					localData.bladderStone2Back = Number(newData.bladderStone2Back || null);
					localData.bladderStone2Area = Number(newData.bladderStone2Area || null);
					localData.bladderStone2Location = newData.bladderStone2Location;
					localData.bladderStoneShape = newData.bladderStoneShape;
					localData.bladderStoneNature = newData.bladderStoneNature;
					const complications: string[] = [];
					if (newData.bladderInflammation === 1) {
						complications.push('inflammation');
					}
					if (newData.bladderIrritation === 1) {
						complications.push('irritation');
					}
					if (newData.bladderObstruction === 1) {
						complications.push('obstruction');
					}
					if (newData.bladderPainful === 1) {
						complications.push('painful');
					}
					localData.complications = complications;
				}
			},
			{ immediate: true, deep: true }
		);

		// 新增：监听所有表单字段变化
		watch(
			() => ({ ...localData }), // 创建新对象触发深度监听
			newValue => {
				//console.log('【表单变更追踪】', JSON.parse(JSON.stringify(newValue)));

				// 这里可以添加以下任意一种记录方式：

				// 1. 发送给父组件（推荐）
				emit('exam-form', newValue, 'bladder');

				// 2. 自动保存到本地存储
				// localStorage.setItem('bladder-form', JSON.stringify(newValue));

				// 3. 记录变更日志（高级示例）
				// const changes = diff(oldValue, newValue); // 需要引入类似 lodash 的差异比较库
				// console.log('详细变更记录:', changes);
			},
			{ deep: true }
		);

		// Initialize data on component mount
		onMounted(() => {
			if (props.data && props.data.bladderStoneCount) {
				localData.bladderStoneCount = props.data.bladderStoneCount;
			}
		});

		// 计算第一颗结石面积
		const calculatedStone1Area = computed(() => {
			const front = Number(localData.bladderStone1Front) || 0;
			const back = Number(localData.bladderStone1Back) || 0;
			const area = front * back * 3.14 * 0.25;
			return area.toFixed(2);
		});

		// 计算第二颗结石面积
		const calculatedStone2Area = computed(() => {
			const front = Number(localData.bladderStone2Front) || 0;
			const back = Number(localData.bladderStone2Back) || 0;
			const area = front * back * 3.14 * 0.25;
			return area.toFixed(2);
		});

		// 监听计算结果并更新到localData
		watch(calculatedStone1Area, newValue => {
			localData.bladderStone1Area = Number(newValue);
		});

		watch(calculatedStone2Area, newValue => {
			localData.bladderStone2Area = Number(newValue);
		});

		return {
			dict,
			localData,
			complicationOptions,
			handleComplicationChange,
			calculatedStone1Area,
			calculatedStone2Area
		};
	}
});
</script>

<style lang="scss" scoped>
.bladder-exam {
	padding: 5px;
	border: 1px solid #ebeef5;
	border-radius: 4px;
	margin-bottom: 5px;
	background-color: #f9fafc;

	h3 {
		margin-top: 0;
		margin-bottom: 5px;
		color: #409eff;
		font-weight: 500;
	}

	.exam-layout {
		display: grid;
		grid-template-columns: minmax(150px, 180px) minmax(300px, 1fr) minmax(300px, 1fr);
		gap: 5px;
		margin-bottom: 5px;
		overflow-x: auto; /* 添加水平滚动条以确保在空间不足时可以查看所有内容 */
		min-width: 100%; /* 设置最小宽度以确保基本布局完整性 */

		.left-column {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border-right: 1px dashed #dcdfe6;
			padding: 5px;
			height: 100%;
			min-height: 120px;
		}

		.middle-column {
			display: flex;
			flex-direction: column;
			gap: 5px;
			border-right: 1px dashed #dcdfe6;
			padding: 5px;
		}

		.right-column {
			display: flex;
			justify-content: left;
			align-items: left;
			padding: 5px;
		}

		.stone-row {
			display: flex;
			align-items: center;
			gap: 5px;
			padding: 5px;
			border: 1px solid #ebeef5;
			border-radius: 4px;
			background-color: transparent;
		}

		.stone-properties {
			/* 外层容器控制布局 */
			display: flex;
			/* 外层容器控制布局方向 */
			flex-direction: row;
			/* 外层容器控制布局对齐方式 */
			justify-content: center;
			/* 外层容器控制布局对齐方式 */
			align-items: center;
		}
	}
}
</style>
