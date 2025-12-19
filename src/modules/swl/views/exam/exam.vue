<template>
	<div class="exam-wrapper">
		<div hidden>{{ examId }}</div>
		<div>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<!-- 新增外层滚动容器 -->
		<div class="scroll-container">
			<!-- 将检查项目和CT值放在同一行 -->
			<div class="form-row">
				<el-form-item label="检查项目：" class="check-item">
					<el-checkbox-group v-model="localData.ct">
						<el-checkbox
							v-for="option in ctOptions"
							:key="option.value"
							:label="option.label"
							:value="option.value"
						>
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>

				<el-form-item label="CT值：" class="ct-value-item">
					<el-input
						placeholder="请输入CT值"
						v-model="localData.ctValue"
						style="width: 80px"
					></el-input>
				</el-form-item>
			</div>

			<!-- 调整检查部位与检查项目左对齐 -->
			<div class="exam-container">
				<div class="select-area">
					<el-form-item label="检查部位：" style="margin-bottom: 0">
						<el-select
							v-model="selectedExamType"
							placeholder="请选择检查部位"
							@change="addExamCard"
							clearable
							style="width: 200px"
						>
							<el-option
								v-for="item in examOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</div>

				<!-- 使用el-collapse替换原先的卡片布局 -->
				<el-collapse
					v-model="activeCollapseNames"
					class="exam-collapse"
					@change="handleCollapseChange"
				>
					<el-collapse-item
						v-for="(exam, index) in examCards"
						:key="exam.id"
						:name="exam.id"
						class="custom-collapse-item"
					>
						<template #title>
							<div
								class="collapse-title"
								style="display: flex; align-items: center; width: 100%"
							>
								<span class="label"># {{ exam.label }} 检查结果</span>
								<delete-button
									:index="index"
									:label="exam.label"
									@delete="removeExamCard"
								/>
							</div>
						</template>

						<template #extra>
							<!-- 移除这里的按钮 -->
						</template>

						<div class="exam-content">
							<p>{{ getExamDescription(exam.type) }}</p>
							<exam-form
								:examData="{
									type: exam.type,
									data: exam.data || ({} as Eps.SwlImagingExamEntity)
								}"
								:key="`exam-form-${exam.id}`"
								@exam-form="handleChildExamForm"
							/>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>

			<el-form-item label="合并症：" style="margin-top: 20px">
				<div class="complications-container">
					<el-checkbox-group
						v-model="localData.complications"
						class="complications-group"
					>
						<el-checkbox
							v-for="option in complicationOptions"
							:key="option.value"
							:label="option.label"
							:value="option.value"
							class="complication-item"
						>
						</el-checkbox>
					</el-checkbox-group>

					<div class="other-complications">
						<el-checkbox-group v-model="localData.qtComplications">
							<el-checkbox
								v-for="option in qtComplicationOptions"
								:key="option.value"
								:label="option.label"
								:value="option.value"
							>
							</el-checkbox>
						</el-checkbox-group>

						<el-input
							placeholder="请输入并发症其他描述"
							v-model="localData.otherComplicationsDesc"
							style="width: 300px"
						></el-input>
					</div>
				</div>
			</el-form-item>
			<div style="text-align: center">
				<el-button type="primary" size="large" @click.stop="saveExam"> 保存 </el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCool } from '/@/cool';
import { ElMessage } from 'element-plus';
import type { CollapseModelValue } from 'element-plus';
import ExamForm from './components/ExamForm.vue';
import DeleteButton from './components/DeleteButton.vue';

const cool = useCool();

// 定义 props
const props = defineProps({
	swlNo: {
		type: String,
		required: true
	},
	serialNumber: {
		type: String,
		required: true
	},
	patientSwlInfo: {
		type: Object,
		required: true
	}
});

//console.log('props=================:', props);

// Add localData ref that will be populated from backend data
const localData = ref({
	ctValue: null,
	hasOtherComplications: 0,
	otherComplicationsDesc: '',
	complications: [] as string[],
	ct: [] as string[],
	qtComplications: [] as string[],
	examId: 0
});

const complicationOptions = [
	{ label: '多囊肾', value: 'polycystic_kidney' },
	{ label: '重复肾', value: 'duplicate_kidney' },
	{ label: '马蹄肾', value: 'horseshoe_kidney' },
	{ label: '输尿管狭窄', value: 'ureteral_stenosis' },
	{ label: '尿道狭窄', value: 'urethral_stenosis' },
	{ label: '膀胱憩室', value: 'bladder_diverticulum' },
	{ label: '海绵肾', value: 'spongy_kidney' },
	{ label: '肾囊肿', value: 'renal_cyst' },
	{ label: '异位肾', value: 'ectopic_kidney' },
	{ label: '神经源性膀胱', value: 'neurogenic_bladder' },
	{ label: '输尿管囊肿', value: 'ureteral_diverticulum' },
	{ label: '尿道异物', value: 'urethral_foreign_body' },
	{ label: '肾脏憩室', value: 'renal_diverticulum' },
	{ label: 'UPJ狭窄', value: 'upj_stenosis' },
	{ label: 'BPH', value: 'bph' },
	{ label: '尿道憩室', value: 'urethral_diverticulum' }
];
const qtComplicationOptions = [{ label: '其他', value: 'otherComplicationsDesc' }];
const ctOptions = [
	{ label: '超声', value: 'cs' },
	{ label: 'KUB', value: 'kub' },
	{ label: 'IVU', value: 'ivu' },
	{ label: 'CT平扫', value: 'ct' },
	{ label: 'CTU', value: 'ctu' },
	{ label: 'MRI', value: 'mri' }
];
// 检查部位选项
const examOptions = ref([
	{ label: '左肾', value: 'left_kidney' },
	{ label: '右肾', value: 'right_kidney' },
	{ label: '左输尿管', value: 'left_ureter' },
	{ label: '右输尿管', value: 'right_ureter' },
	{ label: '膀胱', value: 'bladder' },
	{ label: '尿道', value: 'urethra' }
]);

// 当前选择的检查部位
const selectedExamType = ref('');

// 已添加的检查卡片
const examCards = ref<
	Array<{
		id: number;
		type: string;
		label: string;
		isExpanded: boolean;
		data?: Eps.SwlImagingExamEntity;
		localData?: any;
	}>
>([]);

// 用于生成唯一ID
let idCounter = 0;

const examId = ref('');

// 折叠面板活动项数组
const activeCollapseNames = ref<(string | number)[]>([]);

// 获取检查描述
const getExamDescription = (type: string) => {
	switch (type) {
		default:
			return '';
	}
};

// 处理折叠面板变化
const handleCollapseChange = (val: CollapseModelValue) => {
	// 确保activeCollapseNames是数组类型
	if (Array.isArray(val)) {
		activeCollapseNames.value = val as (string | number)[];
	} else {
		// 如果是单个值，转为数组
		activeCollapseNames.value = val ? [val] : [];
	}

	// 更新examCards中的isExpanded状态
	examCards.value.forEach(card => {
		card.isExpanded = activeCollapseNames.value.includes(card.id);
	});
};

// 获取检查部位的显示名称
const getExamTypeLabel = (type: string) => {
	const option = examOptions.value.find(item => item.value === type);
	return option ? option.label : '';
};

// 添加检查卡片
const addExamCard = (type = selectedExamType.value, data?: Eps.SwlImagingExamEntity) => {
	if (!type) return;

	// 检查是否已经添加过该部位
	const exists = examCards.value.some(card => card.type === type);
	if (exists) {
		if (type === selectedExamType.value) {
			ElMessage.warning(`${getExamTypeLabel(type)}检查已添加`);
			selectedExamType.value = '';
		}
		return;
	}

	// 创建新卡片ID
	const newCardId = ++idCounter;

	// 添加新的检查卡片
	examCards.value.push({
		id: newCardId,
		type: type,
		label: getExamTypeLabel(type),
		isExpanded: true,
		data: data
	});

	// 将新卡片添加到活动项列表中，使其默认展开
	activeCollapseNames.value.push(newCardId);

	// 清空选择框
	if (type === selectedExamType.value) {
		selectedExamType.value = '';
	}
};

// 新增：处理子组件提交的数据
const handleChildExamForm = (data: any, organType: string) => {
	// 可以在这里进行数据验证
	//console.log(`exam.vue收到 ${organType} 数据：`, data);
	//将data数据赋值给examCards.value中对应部位的data
	const examCard = examCards.value.find(card => card.type === organType);
	if (examCard) {
		examCard.localData = data;
	}
};

// 初始化检查卡片，根据后台数据自动添加左肾检查
const initExamCards = async () => {
	try {
		// 获取后台数据
		const params = { swlNo: props.swlNo, serialNumber: props.serialNumber };
		//const params = { id: 1 };
		const data = await cool.service.swl.exam.findExamBySwlno(params);
		//console.log('data:' + data);

		// 将后台数据填充到localData中
		if (data) {
			const complicationsData: string[] = [];
			if (data.complicationPolycysticKidney === 1) {
				//complicationPolycysticKidney是否多囊肾 0-否 1-是
				complicationsData.push('polycystic_kidney');
			}
			if (data.complicationDuplexKidney === 1) {
				//complicationDuplicateKidney是否重复肾 0-否 1-是
				complicationsData.push('duplicate_kidney');
			}
			if (data.complicationHorseshoeKidney === 1) {
				//complicationHorseshoeKidney是否马蹄肾 0-否 1-是
				complicationsData.push('horseshoe_kidney');
			}

			if (data.complicationUreteralStricture === 1) {
				//complicationUreteralStenosis是否输尿管狭窄 0-否 1-是
				complicationsData.push('ureteral_stenosis');
			}
			if (data.complicationUrethralStricture === 1) {
				//complicationUrethralStenosis是否尿道狭窄 0-否 1-是
				complicationsData.push('urethral_stenosis');
			}
			if (data.complicationBladderDiverticulum === 1) {
				//complicationBladderDiverticulum是否膀胱憩室 0-否 1-是
				complicationsData.push('bladder_diverticulum');
			}
			if (data.complicationMedullarySpongeKidney === 1) {
				//complicationMedullarySpongeKidney是否海绵肾 0-否 1-是
				complicationsData.push('spongy_kidney');
			}
			if (data.complicationRenalCyst === 1) {
				//complicationRenalCyst是否肾囊肿 0-否 1-是
				complicationsData.push('renal_cyst');
			}
			if (data.complicationEctopicKidney === 1) {
				//complicationEctopicKidney是否异位肾 0-否 1-是
				complicationsData.push('ectopic_kidney');
			}
			if (data.complicationNeurogenicBladder === 1) {
				//complicationNeurogenicBladder是否神经源性膀胱 0-否 1-是
				complicationsData.push('neurogenic_bladder');
			}
			if (data.complicationUreterocele === 1) {
				//complicationUreterocele是否输尿管囊肿 0-否 1-是
				complicationsData.push('ureteral_diverticulum');
			}
			if (data.complicationUrethralForeignBody === 1) {
				//complicationUrethralForeignBody是否尿道异物 0-否 1-是
				complicationsData.push('urethral_foreign_body');
			}
			if (data.complicationRenalDiverticulum === 1) {
				//complicationRenalDiverticulum是否肾脏憩室 0-否 1-是
				complicationsData.push('renal_diverticulum');
			}
			if (data.complicationUPJStricture === 1) {
				//complicationUPJStricture是否UPJ狭窄 0-否 1-是
				complicationsData.push('upj_stenosis');
			}
			if (data.complicationBPH === 1) {
				//complicationBPH是否BPH 0-否 1-是
				complicationsData.push('bph');
			}
			if (data.complicationUrethralDiverticulum === 1) {
				//complicationUrethralDiverticulum是否尿道憩室 0-否 1-是
				complicationsData.push('urethral_diverticulum');
			}

			const ctData: string[] = [];
			if (data.hasUltrasound === 1) {
				//hasUltrasound是否超声 0-否 1-是
				ctData.push('cs');
			}
			if (data.hasKUB === 1) {
				//hasKUB是否KUB 0-否 1-是
				ctData.push('kub');
			}
			if (data.hasIVU === 1) {
				//hasIVU是否IVU 0-否 1-是
				ctData.push('ivu');
			}
			if (data.hasMRI === 1) {
				//hasMRI是否MRI 0-否 1-是
				ctData.push('mri');
			}
			if (data.hasCT === 1) {
				//hasCT是否CT 0-否 1-是
				ctData.push('ct');
			}
			if (data.hasCTU === 1) {
				//hasCTU是否CTU 0-否 1-是
				ctData.push('ctu');
			}

			const qtComplicationsData: string[] = [];
			if (data.hasOtherComplications === 1) {
				//hasOtherComplications是否其他并发症 0-否 1-是
				qtComplicationsData.push('hasOtherComplications');
			}

			localData.value = {
				ctValue: data.ctValue || null,
				hasOtherComplications: data.hasOtherComplications || 0,
				otherComplicationsDesc: data.otherComplicationsDesc || '',
				complications: complicationsData,
				ct: ctData,
				qtComplications: qtComplicationsData,
				examId: data.id
			};
		}

		// 如果leftKidneyStoneCount有值，自动添加左肾检查卡片
		if (
			data &&
			data.leftKidneyStoneCount !== undefined &&
			Number(data.leftKidneyStoneCount) > 0
		) {
			addExamCard('left_kidney', data);
		}
		if (
			data &&
			data.rightKidneyStoneCount !== undefined &&
			Number(data.rightKidneyStoneCount) > 0
		) {
			addExamCard('right_kidney', data);
		}
		if (
			data &&
			data.leftUreterStoneCount !== undefined &&
			Number(data.leftUreterStoneCount) > 0
		) {
			addExamCard('left_ureter', data);
		}
		if (
			data &&
			data.rightUreterStoneCount !== undefined &&
			Number(data.rightUreterStoneCount) > 0
		) {
			addExamCard('right_ureter', data);
		}
		if (data && data.bladderStoneCount !== undefined && Number(data.bladderStoneCount) > 0) {
			addExamCard('bladder', data);
		}
		if (data && data.urethraStoneCount !== undefined && Number(data.urethraStoneCount) > 0) {
			addExamCard('urethra', data);
		}
	} catch (error) {
		console.error('获取exam数据失败:', error);
	}
};

// 组件挂载时初始化数据
onMounted(() => {
	initExamCards();
});

/**
 * 保存检查数据前，确保获取最新的表单数据
 */
const saveExam = async () => {
	try {
		// 准备要保存的数据对象
		const saveData = {
			id: localData.value.examId,
			// CT相关字段
			hasUltrasound: localData.value.ct.includes('cs') ? 1 : 0,
			hasKUB: localData.value.ct.includes('kub') ? 1 : 0,
			hasIVU: localData.value.ct.includes('ivu') ? 1 : 0,
			hasMRI: localData.value.ct.includes('mri') ? 1 : 0,
			hasCT: localData.value.ct.includes('ct') ? 1 : 0,
			hasCTU: localData.value.ct.includes('ctu') ? 1 : 0,
			ctValue: localData.value.ctValue,

			// 并发症相关字段
			complicationPolycysticKidney: localData.value.complications.includes(
				'polycystic_kidney'
			)
				? 1
				: 0,
			complicationDuplexKidney: localData.value.complications.includes('duplicate_kidney')
				? 1
				: 0,
			complicationHorseshoeKidney: localData.value.complications.includes('horseshoe_kidney')
				? 1
				: 0,
			complicationUreteralStricture: localData.value.complications.includes(
				'ureteral_stenosis'
			)
				? 1
				: 0,
			complicationUrethralStricture: localData.value.complications.includes(
				'urethral_stenosis'
			)
				? 1
				: 0,
			complicationBladderDiverticulum: localData.value.complications.includes(
				'bladder_diverticulum'
			)
				? 1
				: 0,
			complicationMedullarySpongeKidney: localData.value.complications.includes(
				'spongy_kidney'
			)
				? 1
				: 0,
			complicationRenalCyst: localData.value.complications.includes('renal_cyst') ? 1 : 0,
			complicationEctopicKidney: localData.value.complications.includes('ectopic_kidney')
				? 1
				: 0,
			complicationNeurogenicBladder: localData.value.complications.includes(
				'neurogenic_bladder'
			)
				? 1
				: 0,
			complicationUreterocele: localData.value.complications.includes('ureteral_diverticulum')
				? 1
				: 0,
			complicationUrethralForeignBody: localData.value.complications.includes(
				'urethral_foreign_body'
			)
				? 1
				: 0,
			complicationRenalDiverticulum: localData.value.complications.includes(
				'renal_diverticulum'
			)
				? 1
				: 0,
			complicationUPJStricture: localData.value.complications.includes('upj_stenosis')
				? 1
				: 0,
			complicationBPH: localData.value.complications.includes('bph') ? 1 : 0,
			complicationUrethralDiverticulum: localData.value.complications.includes(
				'urethral_diverticulum'
			)
				? 1
				: 0,

			// 其他并发症
			hasOtherComplications: localData.value.qtComplications.includes('hasOtherComplications')
				? 1
				: 0,
			otherComplicationsDesc: localData.value.otherComplicationsDesc || '',

			// 左肾相关字段
			leftKidneyStoneCount: 0,
			leftKidneyStone1Location: '',
			leftKidneyStone1Front: 0,
			leftKidneyStone1Back: 0,
			leftKidneyStone1Area: 0,
			leftKidneyStone2Location: '',
			leftKidneyStone2Front: 0,
			leftKidneyStone2Back: 0,
			leftKidneyStone2Area: 0,
			leftKidneyStoneShape: '',
			leftKidneyStoneNature: '',
			leftKidneyMildHydronephrosis: 0,
			leftKidneyModerateHydronephrosis: 0,
			leftKidneyDysfunction: 0,
			leftKidneyCalycealDilation: 0,
			leftKidneySevereHydronephrosis: 0,
			leftKidneyMajorCalyxDilation: 0,
			leftKidneyAtrophy: 0,

			// 右肾相关字段
			rightKidneyStoneCount: 0,
			rightKidneyStone1Location: '',
			rightKidneyStone1Front: 0,
			rightKidneyStone1Back: 0,
			rightKidneyStone1Area: 0,
			rightKidneyStone2Location: '',
			rightKidneyStone2Front: 0,
			rightKidneyStone2Back: 0,
			rightKidneyStone2Area: 0,
			rightKidneyStoneShape: '',
			rightKidneyStoneNature: '',
			rightKidneyMildHydronephrosis: 0,
			rightKidneyModerateHydronephrosis: 0,
			rightKidneyDysfunction: 0,
			rightKidneyCalycealDilation: 0,
			rightKidneySevereHydronephrosis: 0,
			rightKidneyMajorCalyxDilation: 0,
			rightKidneyAtrophy: 0,

			// 左输尿管相关字段
			leftUreterStoneCount: 0,
			leftUreterStone1Location: '',
			leftUreterStone1Front: 0,
			leftUreterStone1Back: 0,
			leftUreterStone1Area: 0,
			leftUreterStone2Location: '',
			leftUreterStone2Front: 0,
			leftUreterStone2Back: 0,
			leftUreterStone2Area: 0,
			leftUreterStoneShape: '',
			leftUreterStoneNature: '',
			leftUreterMildHydronephrosis: 0,
			leftUreterModerateHydronephrosis: 0,
			leftUreterDysfunction: 0,
			leftUreterSevereHydronephrosis: 0,
			leftUreterAtrophy: 0,

			// 右输尿管相关字段
			rightUreterStoneCount: 0,
			rightUreterStone1Location: '',
			rightUreterStone1Front: 0,
			rightUreterStone1Back: 0,
			rightUreterStone1Area: 0,
			rightUreterStone2Location: '',
			rightUreterStone2Front: 0,
			rightUreterStone2Back: 0,
			rightUreterStone2Area: 0,
			rightUreterStoneShape: '',
			rightUreterStoneNature: '',
			rightUreterMildHydronephrosis: 0,
			rightUreterModerateHydronephrosis: 0,
			rightUreterDysfunction: 0,
			rightUreterSevereHydronephrosis: 0,
			rightUreterMajorCalyxDilation: 0,
			rightUreterAtrophy: 0,

			// 膀胱相关字段
			bladderStoneCount: 0,
			bladderStone1Location: '',
			bladderStone1Front: 0,
			bladderStone1Back: 0,
			bladderStone1Area: 0,
			bladderStone2Location: '',
			bladderStone2Front: 0,
			bladderStone2Back: 0,
			bladderStone2Area: 0,
			bladderStoneShape: '',
			bladderStoneNature: '',
			bladderUrinaryRetention: 0,

			// 尿道相关字段
			urethraStoneCount: 0,
			urethraStone1Location: '',
			urethraStone1Front: 0,
			urethraStone1Back: 0,
			urethraStone1Area: 0,
			urethraStone2Location: '',
			urethraStone2Front: 0,
			urethraStone2Back: 0,
			urethraStone2Area: 0,
			urethraStoneShape: '',
			urethraStoneNature: '',
			urethraUrinaryRetention: 0,
			swlNo: props.swlNo,
			serialNumber: props.serialNumber
		};

		// 处理检查卡片数据
		examCards.value.forEach(card => {
			//console.log(`处理${card.type}卡片数据:`, card.localData);
			switch (card.type) {
				case 'left_kidney':
					// 获取左肾检查表单数据
					const leftKidneyData = card.localData;
					//输出leftKidneyData
					//console.log('leftKidneyData保存:', JSON.stringify(leftKidneyData));

					if (leftKidneyData) {
						saveData.leftKidneyStoneCount = leftKidneyData.leftKidneyStoneCount; //左肾结石数量
						saveData.leftKidneyStone1Location = leftKidneyData.leftKidneyStone1Location; //左肾第一颗结石位置
						saveData.leftKidneyStone1Front = leftKidneyData.leftKidneyStone1Front; //左肾第一颗结石前框(mm)
						saveData.leftKidneyStone1Back = leftKidneyData.leftKidneyStone1Back; //左肾第一颗结石后框(mm)
						saveData.leftKidneyStone1Area = leftKidneyData.leftKidneyStone1Area; //左肾第一颗结石表面积(mm²)
						saveData.leftKidneyStone2Location = leftKidneyData.leftKidneyStone2Location; //左肾第二颗结石位置
						saveData.leftKidneyStone2Front = leftKidneyData.leftKidneyStone2Front; //左肾第二颗结石前框(mm)
						saveData.leftKidneyStone2Back = leftKidneyData.leftKidneyStone2Back; //左肾第二颗结石后框(mm)
						saveData.leftKidneyStone2Area = leftKidneyData.leftKidneyStone2Area; //左肾第二颗结石表面积(mm²)

						saveData.leftKidneyStoneShape = leftKidneyData.leftKidneyStoneShape; //左肾结石形状
						saveData.leftKidneyStoneNature = leftKidneyData.leftKidneyStoneNature; //左肾结石性质

						// 处理并发症
						saveData.leftKidneyMildHydronephrosis =
							leftKidneyData.complications &&
							leftKidneyData.complications.includes('mild')
								? 1
								: 0;
						saveData.leftKidneyModerateHydronephrosis =
							leftKidneyData.complications &&
							leftKidneyData.complications.includes('moderate')
								? 1
								: 0;
						saveData.leftKidneyDysfunction =
							leftKidneyData.complications &&
							leftKidneyData.complications.includes('damage')
								? 1
								: 0;
						saveData.leftKidneyCalycealDilation =
							leftKidneyData.complications &&
							leftKidneyData.complications.includes('smallDilated')
								? 1
								: 0;
						saveData.leftKidneySevereHydronephrosis =
							leftKidneyData.complications &&
							leftKidneyData.complications.includes('severe')
								? 1
								: 0;
						saveData.leftKidneyMajorCalyxDilation =
							leftKidneyData.complications &&
							leftKidneyData.complications.includes('largeDilated')
								? 1
								: 0;
						saveData.leftKidneyAtrophy =
							leftKidneyData.complications &&
							leftKidneyData.complications.includes('atrophy')
								? 1
								: 0;
					}
					break;
				case 'right_kidney':
					const rightKidneyData = card.localData;
					if (rightKidneyData) {
						saveData.rightKidneyStoneCount = rightKidneyData.rightKidneyStoneCount;
						saveData.rightKidneyStone1Location =
							rightKidneyData.rightKidneyStone1Location;
						saveData.rightKidneyStone1Front = rightKidneyData.rightKidneyStone1Front;
						saveData.rightKidneyStone1Back = rightKidneyData.rightKidneyStone1Back;
						saveData.rightKidneyStone1Area = rightKidneyData.rightKidneyStone1Area;
						saveData.rightKidneyStone2Location =
							rightKidneyData.rightKidneyStone2Location;
						saveData.rightKidneyStone2Front = rightKidneyData.rightKidneyStone2Front;
						saveData.rightKidneyStone2Back = rightKidneyData.rightKidneyStone2Back;
						saveData.rightKidneyStone2Area = rightKidneyData.rightKidneyStone2Area;

						saveData.rightKidneyStoneShape = rightKidneyData.rightKidneyStoneShape;
						saveData.rightKidneyStoneNature = rightKidneyData.rightKidneyStoneNature;

						// 处理并发症
						saveData.rightKidneyMildHydronephrosis =
							rightKidneyData.complications.includes('mild') ? 1 : 0;
						saveData.rightKidneyModerateHydronephrosis =
							rightKidneyData.complications.includes('moderate') ? 1 : 0;
						saveData.rightKidneyDysfunction = rightKidneyData.complications.includes(
							'damage'
						)
							? 1
							: 0;
						saveData.rightKidneyCalycealDilation =
							rightKidneyData.complications.includes('smallDilated') ? 1 : 0;
						saveData.rightKidneySevereHydronephrosis =
							rightKidneyData.complications.includes('severe') ? 1 : 0;
						saveData.rightKidneyMajorCalyxDilation =
							rightKidneyData.complications.includes('largeDilated') ? 1 : 0;
						saveData.rightKidneyAtrophy = rightKidneyData.complications.includes(
							'atrophy'
						)
							? 1
							: 0;
					}
					break;
				case 'left_ureter':
					const leftUreterData = card.localData;
					if (leftUreterData) {
						saveData.leftUreterStoneCount = leftUreterData.leftUreterStoneCount;
						saveData.leftUreterStone1Location = leftUreterData.leftUreterStone1Location;
						saveData.leftUreterStone1Front = leftUreterData.leftUreterStone1Front;
						saveData.leftUreterStone1Back = leftUreterData.leftUreterStone1Back;
						saveData.leftUreterStone1Area = leftUreterData.leftUreterStone1Area;
						saveData.leftUreterStone2Location = leftUreterData.leftUreterStone2Location;
						saveData.leftUreterStone2Front = leftUreterData.leftUreterStone2Front;
						saveData.leftUreterStone2Back = leftUreterData.leftUreterStone2Back;
						saveData.leftUreterStone2Area = leftUreterData.leftUreterStone2Area;

						saveData.leftUreterStoneShape = leftUreterData.leftUreterStoneShape;
						saveData.leftUreterStoneNature = leftUreterData.leftUreterStoneNature;

						// 处理并发症
						saveData.leftUreterMildHydronephrosis =
							leftUreterData.complications.includes('mild') ? 1 : 0;
						saveData.leftUreterModerateHydronephrosis =
							leftUreterData.complications.includes('moderate') ? 1 : 0;
						saveData.leftUreterDysfunction = leftUreterData.complications.includes(
							'damage'
						)
							? 1
							: 0;
						saveData.leftUreterSevereHydronephrosis =
							leftUreterData.complications.includes('severe') ? 1 : 0;
						saveData.leftUreterAtrophy = leftUreterData.complications.includes(
							'atrophy'
						)
							? 1
							: 0;
					}
					break;
				case 'right_ureter':
					const rightUreterData = card.localData;
					if (rightUreterData) {
						saveData.rightUreterStoneCount = rightUreterData.rightUreterStoneCount;
						saveData.rightUreterStone1Location =
							rightUreterData.rightUreterStone1Location;
						saveData.rightUreterStone1Front = rightUreterData.rightUreterStone1Front;
						saveData.rightUreterStone1Back = rightUreterData.rightUreterStone1Back;
						saveData.rightUreterStone1Area = rightUreterData.rightUreterStone1Area;
						saveData.rightUreterStone2Location =
							rightUreterData.rightUreterStone2Location;
						saveData.rightUreterStone2Front = rightUreterData.rightUreterStone2Front;
						saveData.rightUreterStone2Back = rightUreterData.rightUreterStone2Back;
						saveData.rightUreterStone2Area = rightUreterData.rightUreterStone2Area;

						saveData.rightUreterStoneShape = rightUreterData.rightUreterStoneShape;
						saveData.rightUreterStoneNature = rightUreterData.rightUreterStoneNature;

						// 处理并发症
						saveData.rightUreterMildHydronephrosis =
							rightUreterData.complications.includes('mild') ? 1 : 0;
						saveData.rightUreterModerateHydronephrosis =
							rightUreterData.complications.includes('moderate') ? 1 : 0;
						saveData.rightUreterDysfunction = rightUreterData.complications.includes(
							'damage'
						)
							? 1
							: 0;
						saveData.rightUreterSevereHydronephrosis =
							rightUreterData.complications.includes('severe') ? 1 : 0;
						saveData.rightUreterMajorCalyxDilation =
							rightUreterData.complications.includes('largeDilated') ? 1 : 0;
						saveData.rightUreterAtrophy = rightUreterData.complications.includes(
							'atrophy'
						)
							? 1
							: 0;
					}
					break;
				case 'bladder':
					const bladderData = card.localData;
					if (bladderData) {
						saveData.bladderStoneCount = bladderData.bladderStoneCount;
						saveData.bladderStone1Location = bladderData.bladderStone1Location;
						saveData.bladderStone1Front = bladderData.bladderStone1Front;
						saveData.bladderStone1Back = bladderData.bladderStone1Back;
						saveData.bladderStone1Area = bladderData.bladderStone1Area;
						saveData.bladderStone2Location = bladderData.bladderStone2Location;
						saveData.bladderStone2Front = bladderData.bladderStone2Front;
						saveData.bladderStone2Back = bladderData.bladderStone2Back;
						saveData.bladderStone2Area = bladderData.bladderStone2Area;

						saveData.bladderStoneShape = bladderData.bladderStoneShape;
						saveData.bladderStoneNature = bladderData.bladderStoneNature;

						saveData.bladderUrinaryRetention = bladderData.complications.includes(
							'urinaryRetention'
						)
							? 1
							: 0;
					}
					break;
				case 'urethra':
					const urethraData = card.localData;
					if (urethraData) {
						saveData.urethraStoneCount = urethraData.urethraStoneCount;
						saveData.urethraStone1Location = urethraData.urethraStone1Location;
						saveData.urethraStone1Front = urethraData.urethraStone1Front;
						saveData.urethraStone1Back = urethraData.urethraStone1Back;
						saveData.urethraStone1Area = urethraData.urethraStone1Area;
						saveData.urethraStone2Location = urethraData.urethraStone2Location;
						saveData.urethraStone2Front = urethraData.urethraStone2Front;
						saveData.urethraStone2Back = urethraData.urethraStone2Back;
						saveData.urethraStone2Area = urethraData.urethraStone2Area;

						saveData.urethraStoneShape = urethraData.urethraStoneShape;
						saveData.urethraStoneNature = urethraData.urethraStoneNature;

						saveData.urethraUrinaryRetention = urethraData.complications.includes(
							'urinaryRetention'
						)
							? 1
							: 0;
					}
					break;
			}
		});

		saveData.swlNo = props.swlNo;
		saveData.serialNumber = props.serialNumber;
		// 调用后台保存方法
		//console.log('saveData.id :', saveData.id);
		//console.log('examId.value:', examId.value);
		if (saveData.id != undefined || (examId.value != undefined && Number(examId.value) != 0)) {
			const params = { ...saveData };
			if (saveData.id != undefined) {
				params.id = Number(saveData.id);
			}
			if (examId.value != undefined && Number(examId.value) != 0) {
				params.id = Number(examId.value);
			}
			//输出params
			//console.log('update-params:', params);
			const res = await cool.service.swl.exam.update(params);
		} else {
			const params = { ...saveData };
			//输出params
			//console.log('save-params:', params);
			const res = await cool.service.swl.exam.add(params);
			//保存后，获取id
			//输出res
			//console.log('res:', res);
			saveData.id = res.id;
			//给examId赋值
			examId.value = res.id;
		}

		ElMessage.success('保存成功');
	} catch (error: any) {
		console.error('保存失败:', error);
		ElMessage.error('保存失败: ' + (error.message || '未知错误'));
	}
};

// 移除检查卡片
const removeExamCard = (index: number) => {
	// 从组件中已处理确认弹窗，此处直接执行删除操作
	const cardId = examCards.value[index].id;
	// 从卡片列表中移除
	examCards.value.splice(index, 1);
	// 从活动项列表中移除
	const idIndex = activeCollapseNames.value.indexOf(cardId);
	if (idIndex > -1) {
		activeCollapseNames.value.splice(idIndex, 1);
	}
};

const toggleExpand = (index: number) => {
	examCards.value[index].isExpanded = !examCards.value[index].isExpanded;
};

// 处理展开状态变化
const handleExpandChange = (index: number, expanded: boolean) => {
	examCards.value[index].isExpanded = expanded;
};
</script>

<style lang="scss" scoped>
/* 新增滚动容器样式 */
.scroll-container {
	width: 100%;
	height: calc(100vh - 200px); // 考虑到 tab 头部、父容器边距和其他元素的高度
	max-height: 70vh;
	min-height: 300px;
	overflow-y: auto !important;
	overflow-x: auto !important;
	padding: 15px;
	position: relative;
	display: block;
	box-sizing: border-box;
	z-index: 1; // 确保滚动条在最上层

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

	// 确保内容宽度超出容器以启用横向滚动
	.content {
		width: 100%; // 示例宽度，确保超出容器
	}
}

/* 添加检查项目和CT值的行样式 */
.form-row {
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
}

.check-item {
	margin-right: 20px;
	margin-bottom: 0;
}

.ct-value-item {
	margin-bottom: 0;
}

/* 合并症样式 */
.complications-container {
	width: 800px;
	display: flex;
	flex-direction: column;
}

.complications-group {
	display: flex;
	flex-wrap: wrap;
}

.complication-item {
	margin-right: 15px;
	margin-bottom: 10px;
}

.other-complications {
	display: flex;
	align-items: center;
	margin-top: 10px;
	gap: 10px;
}

.exam-container {
	margin-top: 20px;
	height: auto; /* 移除原固定高度 */
	overflow-y: visible; /* 移除原滚动设置 */

	.select-area {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
	}

	/* 新增 el-collapse 相关样式 */
	.exam-collapse {
		margin-top: 15px;
		border-radius: 4px;
		overflow: hidden;

		:deep(.el-collapse-item) {
			margin-bottom: 10px;
			border: 1px solid #e4e7ed;
			border-radius: 4px;
			box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.05);
			overflow: hidden;

			.el-collapse-item__header {
				background-color: #f5f7fa;
				border-bottom: 1px solid #e4e7ed;
				padding: 0 20px;
				font-weight: bold;
				height: 40px;
				line-height: 40px;
				position: relative; /* 添加相对定位 */
			}

			.el-collapse-item__content {
				padding: 15px;
			}

			/* 将折叠箭头放到右边 */
			.el-collapse-item__arrow {
				margin: 0 0 0 auto;
				order: 2;
			}
		}

		.collapse-title {
			display: flex;
			align-items: center;
			width: 100%;

			.label {
				font-size: 14px;
				font-weight: bold;
				color: #303133;
			}
		}
	}
}

.exam-content {
	padding: 5px 0;
}

.inline-group {
	display: flex;
	align-items: center;
	gap: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
	.scroll-container {
		padding: 10px;
	}

	.form-row {
		flex-direction: column;
		align-items: flex-start;
	}

	.el-input,
	.el-select {
		width: 100% !important;
	}

	.inline-group {
		flex-direction: column;
		align-items: flex-start;
	}

	.complications-container {
		width: 100%;
	}

	.other-complications {
		flex-direction: column;
		align-items: flex-start;
	}

	.exam-container {
		.exam-collapse {
			:deep(.el-collapse-item) {
				.el-collapse-item__header {
					height: auto;
					padding: 10px;
					line-height: 1.5;
				}
			}
		}
	}
}

/* 自定义折叠面板样式 */
.custom-collapse-item {
	:deep(.el-collapse-item__header) {
		padding-right: 20px !important; /* 减少右边距 */
	}
}
</style>
