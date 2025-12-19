<!-- eslint-disable vue/valid-v-slot -->
<template>
	<div class="left-kidney-exam">
		<el-form label-width="auto" style="height: auto">
			<!-- 使用CSS Grid布局实现三列结构 -->
			<div class="exam-layout">
				<!-- 左侧列：结石数量 -->
				<div class="left-column">
					<el-form-item label="N" style="margin-bottom: 0">
						<cl-select
							:options="dict.get('image_num')"
							v-model="localData.leftKidneyStoneCount"
							style="width: 100%"
							label-key="name"
							value-key="name"
							check-strictly
							default-expand-all
						></cl-select>
					</el-form-item>
				</div>

				<!-- 中间列：结石详细数据 -->
				<div class="middle-column">
					<!-- 第一行 -->
					<div class="stone-row">
						<el-form-item label="S" style="margin-bottom: 3px; width: 48%">
							<div style="display: flex; align-items: center; width: 100%">
								<el-input
									v-model="localData.leftKidneyStone1Front"
									placeholder="请输入第一颗结石前框"
									style="flex: 1; min-width: auto; margin-right: 5px"
								></el-input>
								<span> * </span>
								<el-input
									v-model="localData.leftKidneyStone1Back"
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
								<cl-select
									:options="dict.get('image_klocition')"
									v-model="localData.leftKidneyStone1Location"
									label-key="name"
									value-key="name"
									check-strictly
									default-expand-all
									style="flex: 1.5; min-width: auto; margin-left: 5px"
								></cl-select>
							</div>
						</el-form-item>
					</div>

					<!-- 第二行 -->
					<div class="stone-row">
						<el-form-item label="S" style="margin-bottom: 0; width: 48%">
							<div style="display: flex; align-items: center; width: 100%">
								<el-input
									v-model="localData.leftKidneyStone2Front"
									placeholder="请输入第二颗结石前框"
									style="flex: 1; min-width: auto; margin-right: 5px"
								></el-input>
								<span> * </span>
								<el-input
									v-model="localData.leftKidneyStone2Back"
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
								<cl-select
									:options="dict.get('image_klocition')"
									v-model="localData.leftKidneyStone2Location"
									label-key="name"
									value-key="name"
									check-strictly
									default-expand-all
									style="flex: 1.5; min-width: auto; margin-left: 5px"
								></cl-select>
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
								min-width: 80px;
								width: 48%;
								margin-right: 5px;
								flex: 1;
							"
						>
							<cl-select
								:options="dict.get('image_kub')"
								v-model="localData.leftKidneyStoneShape"
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
							style="margin-bottom: 0; min-width: 80px; width: 48%; flex: 1"
						>
							<cl-select
								:options="dict.get('image_kubsize')"
								v-model="localData.leftKidneyStoneNature"
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

			<el-form-item label="并发症" style="margin-top: 10px">
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
import { defineComponent, PropType, reactive, watch, onMounted, computed } from 'vue';
import { useDict } from '/$/dict';

interface ExamData {
	type: string;
	data: Eps.SwlImagingExamEntity;
	localData: leftKidneyData;
}

interface leftKidneyData {
	leftKidneyStoneCount: string;
	leftKidneyStone1Front: number | undefined;
	leftKidneyStone1Back: number | undefined;
	leftKidneyStone1Area: number | undefined;
	leftKidneyStone1Location: string;
	leftKidneyStone2Front: number | undefined;
	leftKidneyStone2Back: number | undefined;
	leftKidneyStone2Area: number | undefined;
	leftKidneyStone2Location: string;
	leftKidneyStoneShape: string;
	leftKidneyStoneNature: string;
	complications: string[];
}

export default defineComponent({
	name: 'left-kidney-exam',
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
		// 字典
		const { dict } = useDict();
		const complicationOptions = [
			{ label: '轻度积水', value: 'mild' },
			{ label: '中度积水', value: 'moderate' },
			{ label: '肾功能损害', value: 'damage' },
			{ label: '肾小盏扩张', value: 'smallDilated' },
			{ label: '重度积水', value: 'severe' },
			{ label: '肾大盏扩张', value: 'largeDilated' },
			{ label: '肾萎缩', value: 'atrophy' }
		];

		// Local data specific to right kidney exam
		const localData = reactive<leftKidneyData>({
			leftKidneyStoneCount: '',
			leftKidneyStone1Front: undefined,
			leftKidneyStone1Back: undefined,
			leftKidneyStone1Area: undefined,
			leftKidneyStone1Location: '',
			leftKidneyStone2Front: undefined,
			leftKidneyStone2Back: undefined,
			leftKidneyStone2Area: undefined,
			leftKidneyStone2Location: '',
			leftKidneyStoneShape: '',
			leftKidneyStoneNature: '',
			complications: []
		});

		const handleComplicationChange = (val: string[]) => {
			//console.log('当前选中值:', val); // 调试输出
		};

		// Watch for changes in the data prop
		watch(
			() => props.data,
			newData => {
				//console.log('newData:' + JSON.stringify(newData));
				if (newData && newData.leftKidneyStoneCount) {
					localData.leftKidneyStoneCount = newData.leftKidneyStoneCount;
					localData.leftKidneyStone1Front = Number(newData.leftKidneyStone1Front || null);
					localData.leftKidneyStone1Back = Number(newData.leftKidneyStone1Back || null);
					localData.leftKidneyStone1Area = Number(newData.leftKidneyStone1Area || null);
					localData.leftKidneyStone1Location = newData.leftKidneyStone1Location;
					localData.leftKidneyStone2Front = Number(newData.leftKidneyStone2Front || null);
					localData.leftKidneyStone2Back = Number(newData.leftKidneyStone2Back || null);
					localData.leftKidneyStone2Area = Number(newData.leftKidneyStone2Area || null);
					localData.leftKidneyStone2Location = newData.leftKidneyStone2Location;
					localData.leftKidneyStoneShape = newData.leftKidneyStoneShape;
					localData.leftKidneyStoneNature = newData.leftKidneyStoneNature;
					const complications: string[] = [];
					if (newData.leftKidneyMildHydronephrosis === 1) {
						complications.push('mild');
					}
					if (newData.leftKidneyModerateHydronephrosis === 1) {
						complications.push('moderate');
					}
					if (newData.leftKidneyDysfunction === 1) {
						complications.push('damage');
					}
					if (newData.leftKidneyCalycealDilation === 1) {
						complications.push('smallDilated');
					}
					if (newData.leftKidneySevereHydronephrosis === 1) {
						complications.push('severe');
					}
					if (newData.leftKidneyMajorCalyxDilation === 1) {
						complications.push('largeDilated');
					}
					if (newData.leftKidneyAtrophy === 1) {
						complications.push('atrophy');
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
				emit('exam-form', newValue, 'left_kidney');

				// 2. 自动保存到本地存储
				// localStorage.setItem('kidney-form', JSON.stringify(newValue));

				// 3. 记录变更日志（高级示例）
				// const changes = diff(oldValue, newValue); // 需要引入类似 lodash 的差异比较库
				// //console.log('详细变更记录:', changes);
			},
			{ deep: true }
		);

		// Initialize data on component mount
		onMounted(() => {
			//输出props.data
			//console.log('props.data-leftKidney:' + JSON.stringify(props.data));
			if (props.data && props.data.leftKidneyStoneCount) {
				localData.leftKidneyStoneCount = props.data.leftKidneyStoneCount;
			}
		});

		// 计算第一颗结石面积
		const calculatedStone1Area = computed(() => {
			const front = Number(localData.leftKidneyStone1Front) || 0;
			const back = Number(localData.leftKidneyStone1Back) || 0;
			const area = front * back * 3.14 * 0.25;
			return area.toFixed(2);
		});

		// 计算第二颗结石面积
		const calculatedStone2Area = computed(() => {
			const front = Number(localData.leftKidneyStone2Front) || 0;
			const back = Number(localData.leftKidneyStone2Back) || 0;
			const area = front * back * 3.14 * 0.25;
			return area.toFixed(2);
		});

		// 监听计算结果并更新到localData
		watch(calculatedStone1Area, newValue => {
			localData.leftKidneyStone1Area = Number(newValue);
		});

		watch(calculatedStone2Area, newValue => {
			localData.leftKidneyStone2Area = Number(newValue);
		});

		return {
			dict, // 记得返回dict
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
.left-kidney-exam {
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
