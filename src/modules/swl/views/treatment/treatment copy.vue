<template>
	<div class="treatment-wrapper">
		<div hidden>{{ treatmentId }}</div>
		<p hidden>id: {{ id }}</p>
		<p hidden>swlNo: {{ swlNo }}</p>
		<p hidden>serialNumber: {{ serialNumber }}</p>
		<div class="scroll-container">
			<div class="treatment-info">
				<!-- 标题 -->
				<div class="tech-header">
					<div class="tech-title-container">
						<div class="tech-title">
							智能泌尿系结石诊疗管理系统<span class="blink">_</span>
						</div>
						<div class="model-info">
							<span title="模型">Model.{{ 'SWL治疗记录' }}</span>
						</div>
					</div>
				</div>
				<!-- 患者信息栏 -->
				<div class="tech-patient-info">
					<div class="patient-info">
						<span title="碎石号">No.{{ swlNo || ' ' }}</span>
						<span title="姓名">N.{{ patientSwlInfo.name || ' ' }}</span>
						<span title="性别">G.{{ formatGender(patientSwlInfo.gender) || ' ' }}</span>
						<span title="年龄">A.{{ patientSwlInfo.age || ' ' }}</span>
						<span title="序列号">SN.{{ patientSwlInfo.sequenceNo || ' ' }}</span>
					</div>
				</div>
				<div class="tech-content">
					<cl-row>
						<cl-form ref="Form" inner>
							<!-- 期数插槽 -->
							<template #slot-episode="{ scope }">
								<el-select
									v-model="scope.episode"
									placeholder="请选择期数"
									:options="episodeOptions"
									@click="handleEpisodeClick"
									@change="qsChange"
									style="height: 28px"
								>
									<el-option
										v-for="item in episodeOptions"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</template>
							<!-- 添加医生选择器插槽 -->
							<template #slot-doctor="{ scope }">
								<doctor-select v-model="scope.doctor" />
							</template>
						</cl-form>
					</cl-row>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { Plugins } from '/#/crud';
import { useBase } from '/@/modules/base';
import { ref, onMounted, watch, reactive, defineExpose, nextTick, h } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { usePatient } from '/@/modules/patient';
// 组件设置
const Form = useForm();
const cool = useCool();
const { user } = useBase();
const { dict } = useDict();
const { service } = useCool();
const route = useRoute();

// 引入医生选择器组件
import DoctorSelect from '/@/modules/patient/components/doctor.vue';

// 获取路由参数
const id = route.query.id;
const swlNo = route.query.swlNo;
const serialNumber = route.query.serialNumber;

// 定义治疗ID引用
const treatmentId = ref(0);
// 存储期数选项
const episodeOptions = ref([{ label: '1', value: 1 }]);
// 表单是否已修改但未保存
const formChanged = ref(false);

// 静态配置和选项
const options = reactive({
	position: [
		{ label: '左', value: 0, type: 'default' },
		{ label: '右', value: 1, type: 'success' }
	]
});

// 不良反应选项
const blfyOptions = [
	{ label: '无', value: 'noAdverseReaction' },
	{ label: '皮肤渗血或瘀斑', value: 'hasSkinBleeding' },
	{ label: '恶心', value: 'hasNausea' },
	{ label: '放射痛', value: 'hasRadiationPain' },
	{ label: '其他', value: 'otherAdverseReaction' }
];

// 格式化不良反应数据
const formatAdverseReactions = (data: any) => {
	const reactions: string[] = [];
	if (data && typeof data === 'object') {
		if (Number(data.noAdverseReaction) === 1) reactions.push('noAdverseReaction');
		if (Number(data.hasSkinBleeding) === 1) reactions.push('hasSkinBleeding');
		if (Number(data.hasNausea) === 1) reactions.push('hasNausea');
		if (Number(data.hasRadiationPain) === 1) reactions.push('hasRadiationPain');
		if (Number(data.otherAdverseReaction) === 1) reactions.push('otherAdverseReaction');
	}
	return reactions;
};
// 添加患者信息对象
const patientSwlInfo = reactive({
	id: '', // 患者ID
	swlNo: '', // 碎石号
	name: '', // 姓名
	gender: '', // 性别
	age: '', // 年龄
	sequenceNo: '', // 序列号
	episode: '', // 期数
	nativeProvince: '', // 籍贯省
	nativeCity: '', // 籍贯市
	currentProvince: '', // 现住址省
	currentCity: '', // 现住址市
	height: '', // 身高
	weight: '', // 体重
	bmi: '' // BMI
});

// 查询病人基本信息
const querySwl = async () => {
	try {
		const params = { id: id };
		const data = await service.swl.info.info(params);

		if (data) {
			// 不再使用setForm，而是直接返回数据，后续在合并时使用
			//console.log('查询到患者基本信息:', data);
			// 将查询到的数据赋值给患者信息对象
			Object.assign(patientSwlInfo, data);
			return data;
		}
		return null;
	} catch (error) {
		console.error('获取患者信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(patientSwlInfo, {
			id: ' ',
			swlNo: ' ',
			name: ' ',
			gender: ' ',
			age: ' ',
			sequenceNo: ' ',
			episode: ' '
		});
	}
};

// 打开表单并填充数据
const openForm = (data: any) => {
	if (!data) {
		console.error('打开表单时数据为空');
		ElMessage.warning('表单数据为空，可能影响显示');
		data = {};
	}

	//console.log('打开表单时的数据:', data);

	if (data.id) {
		treatmentId.value = data.id;
	}
	// 处理不良反应选项
	if (data) {
		data.blfyOptions = formatAdverseReactions(data);
	}

	// 确保episodeOptions数据格式正确并保存到ref中
	if (data.qsOptions) {
		if (Array.isArray(data.qsOptions) && data.qsOptions.length > 0) {
			// 检查格式，确保是{label, value}格式
			if (!data.qsOptions[0].hasOwnProperty('label')) {
				episodeOptions.value = data.qsOptions.map((item: any) => ({
					label: String(item),
					value: item
				}));
			} else {
				episodeOptions.value = data.qsOptions.map((item: any) => ({
					label: String(item.label),
					value: item.value
				}));
			}
		}
	}

	// 重置表单变更状态
	formChanged.value = false;

	Form.value?.open({
		title: '碎石治疗记录',
		props: {
			labelPosition: 'top'
		},
		form: data,
		items: [
			{
				label: 'id',
				prop: 'id',
				hidden: true,
				component: {
					name: 'el-input',
					props: {
						disabled: true,
						// 样式
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '就诊流水号',
				prop: 'serialNumber',
				span: 4,
				hidden: true,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						placeholder: '请输入就诊流水号',
						disabled: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '碎石号:',
				prop: 'swlNo',
				span: 4,
				hidden: true,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						disabled: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '姓名',
				prop: 'name',
				span: 4,
				hidden: true,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '性别',
				prop: 'gender',
				span: 4,
				hidden: true,
				component: {
					name: 'el-radio-group',
					options: [
						{ label: '男', value: 1 },
						{ label: '女', value: 2 },
						{ label: '未知', value: 0 }
					],
					props: {
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '年龄',
				prop: 'age',
				span: 4,
				hidden: true,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '门诊号',
				prop: 'outpatientNo',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '住院号',
				prop: 'inpatientNo',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '床号',
				prop: 'bedNo',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '就诊日期',
				prop: 'visitDate',
				span: 4,
				component: {
					name: 'el-date-picker',
					props: {
						type: 'datetime',
						valueFormat: 'YYYY-MM-DD HH:mm:ss',
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '序列号',
				prop: 'sequenceNo',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						disabled: true,
						readonly: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '期数',
				prop: 'episode',
				span: 4,
				component: {
					name: 'slot-episode'
				}
			},
			{
				label: '术前诊断',
				prop: 'preopDiagnosis',
				span: 24,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 2,
						style: {
							width: '66.5%'
						}
					},
					slots: {
						append: () => {
							return h(
								'el-button',
								{
									type: 'primary',
									onClick: getDiagnosis
								},
								'选择'
							);
						}
					}
				}
			},
			// 治疗部位一
			{
				label: '治疗部位一',
				prop: 'position1',
				span: 3,
				component: {
					name: 'el-radio-group',
					options: options.position,
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '',
				prop: 'location1',
				span: 3,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请输入位置',
						options: dict.get('medical_curepart2'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '治疗深度',
				prop: 'depth1',
				span: 3,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					},
					slots: {
						append: () => {
							return 'cm';
						}
					}
				}
			},
			{
				label: '结石大小',
				prop: 'stoneSizeFront1',
				span: 2,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '',
				prop: 'multiply1', // 这个字段不需要实际存储数据
				span: 1,
				flex: true, // 不填充满
				component: {
					name: 'el-text',
					props: {
						style: 'text-align: center; margin: 0 15px; font-size: 16px;'
					},
					slots: {
						default: () => {
							return 'X';
						}
					}
				}
			},
			{
				label: '',
				prop: 'stoneSizeBack1',
				span: 2,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '',
				prop: 'multiply1', // 这个字段不需要实际存储数据
				span: 1,
				flex: true, // 不填充满
				component: {
					name: 'el-text',
					props: {
						style: 'text-align: center; margin: 0 15px; font-size: 16px;'
					},
					slots: {
						default: () => {
							return 'S';
						}
					}
				}
			},
			{
				label: '',
				prop: 'stoneArea1',
				span: 9,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px',
							width: '180px'
						}
					}
				}
			},
			// 治疗部位二
			{
				label: '治疗部位二',
				prop: 'position2',
				span: 3,
				component: {
					name: 'el-radio-group',
					options: options.position,
					props: {
						clearable: true
					}
				}
			},
			{
				label: ' ',
				prop: 'location2',
				span: 3,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请输入位置',
						tree: true,
						options: dict.get('medical_curepart2'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '治疗深度',
				prop: 'depth2',
				span: 3,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					},
					slots: {
						append: () => {
							return 'cm';
						}
					}
				}
			},
			{
				label: '结石大小',
				prop: 'stoneSizeFront2',
				span: 2,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '',
				prop: 'multiply1', // 这个字段不需要实际存储数据
				span: 1,
				flex: true, // 不填充满
				component: {
					name: 'el-text',
					props: {
						style: 'text-align: center; margin: 0 15px; font-size: 16px;'
					},
					slots: {
						default: () => {
							return 'X';
						}
					}
				}
			},
			{
				label: '',
				prop: 'stoneSizeBack2',
				span: 2,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '',
				prop: 'multiply1', // 这个字段不需要实际存储数据
				span: 1,
				flex: true, // 不填充满
				component: {
					name: 'el-text',
					props: {
						style: 'text-align: center; margin: 0 15px; font-size: 16px;'
					},
					slots: {
						default: () => {
							return 'S';
						}
					}
				}
			},
			{
				label: '',
				prop: 'stoneArea2',
				span: 9,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px',
							width: '180px'
						}
					}
				}
			},
			{
				label: '受治结石数目',
				prop: 'stoneCount',
				span: 3,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '术前辅助治疗',
				prop: 'preopTherapy',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择术前辅助治疗',
						tree: true,
						options: dict.get('medical_fzzl'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '术前准备',
				prop: 'preopPreparation',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择术前准备',
						tree: true,
						options: dict.get('medical_pre'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '支架管',
				prop: 'stentType',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择支架管',
						tree: true,
						options: dict.get('medical_bracket'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '机型',
				prop: 'machine1',
				span: 2,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择机型',
						tree: true,
						options: dict.get('medical_machine1'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: ' ',
				prop: 'machine2',
				span: 2,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择机型',
						tree: true,
						options: dict.get('medical_machine2'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '体位',
				prop: 'bodyPosition',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择体位',
						tree: true,
						options: dict.get('medical_post'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '定位方式',
				prop: 'targetingMethod',
				span: 3,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择定位方式',
						tree: true,
						options: dict.get('medical_locatemeth'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '治疗电压',
				prop: 'voltage',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '冲击次数',
				prop: 'shockwaveCount',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择冲击次数',
						tree: true,
						options: dict.get('medical_striketimes'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '透视KV',
				prop: 'fluoroscopyKV',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '脉冲频率',
				prop: 'pulseRate',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					},
					slots: {
						append: () => {
							return '次/分';
						}
					}
				}
			},
			{
				label: '结石对冲击波反应',
				prop: 'stoneResponse',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择结石对冲击波反应',
						tree: true,
						options: dict.get('medical_feedback'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: 'MA',
				prop: 'maValue',
				span: 3,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '术中不良反应',
				prop: 'blfyOptions',
				span: 8,
				component: {
					name: 'el-checkbox-group',
					options: blfyOptions,
					props: {
						style: {
							height: '28px',
							//上边距，有效
							marginTop: '0px',
							//下边距，有效
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '疼痛指数',
				prop: 'painScore',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择疼痛指数',
						tree: true,
						options: dict.get('medical_tengtong'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '术中处理',
				prop: 'intraopManagement',
				span: 11,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 2
					}
				}
			},
			{
				label: '术前图像名称',
				prop: 'preopImages',
				span: 4,
				component: {
					name: 'cl-upload',
					props: {
						isSpace: true,
						size: [60, 60],
						// 是否显示上传按钮
						showUpload: true,
						// 是否显示删除按钮
						showDelete: true,
						// 是否显示预览按钮
						showPreview: true
					}
				}
			},
			{
				label: '术后图像名称',
				prop: 'postopImages',
				span: 4,
				component: {
					name: 'cl-upload',
					props: {
						isSpace: true,
						size: [60, 60],
						// 是否显示上传按钮
						showUpload: true,
						// 是否显示删除按钮
						showDelete: true,
						// 是否显示预览按钮
						showPreview: true
					}
				}
			},
			{
				label: '医生',
				prop: 'physician',
				span: 6,
				value: user.info?.name,
				component: {
					name: 'slot-doctor'
				}
			},
			{
				label: '费用',
				prop: 'treatmentCost',
				span: 5,
				value: 665,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						// 样式
						style: {
							lineHeight: '25px',
							height: '28px',
							//行间距
							rowGap: '0px'
						}
					}
				}
			},
			{
				label: '治疗时间',
				prop: 'treatmentTime',
				span: 4,
				value: dayjs().format('YYYY-MM-DD'),
				component: {
					name: 'el-date-picker',
					props: {
						type: 'date',
						valueFormat: 'YYYY-MM-DD',
						// 样式
						style: {
							lineHeight: '25px',
							height: '28px',
							//行间距
							rowGap: '0px'
						}
					}
				}
			}
		],
		plugins: [Plugins.Form.setFocus('')],
		op: {
			// 默认居中布局
			justify: 'center',
			buttons: [
				{
					label: '保存',
					type: 'primary',
					onClick: handleSubmit
				},
				{
					label: '删除',
					type: 'danger',
					onClick: handleDelete
				},
				{
					label: '清空',
					onClick: clearData
				},
				{
					label: '新增期号',
					onClick: newTreatment
				},
				{
					label: '打印',
					onClick: handlePrint
				},
				{
					label: '打印健康教育处方',
					onClick: handlePrintHealth
				}
			]
		},
		on: {
			open() {
				//console.log('表单打开，期数选项数据:', episodeOptions.value);
				// 使用setOptions方法正确设置下拉选项
				Form.value?.setOptions('episode', episodeOptions.value);

				// 使用不同的方式获取表单数据
				//console.log('表单打开时的form实例:', Form.value);
				//console.log('表单打开时的数据方式1:', Form.value?.form);
				//console.log(
				// 	'表单打开时的数据方式2:',
				// 	Form.value?.getForm ? Form.value.getForm() : '方法不存在'
				// );

				// 确保数据被正确设置，延长等待时间
				setTimeout(() => {
					//console.log('表单打开后500ms的数据:', Form.value?.form);
					// 尝试使用Form实例的其他方法
					const formMethods = Object.keys(Form.value || {}).filter(
						key => typeof Form.value[key] === 'function'
					);
					//console.log('Form实例可用方法:', formMethods);

					// 设置表单值变更监听
					if (Form.value?.form) {
						// 监听表单变更
						const originalFormData = JSON.stringify(Form.value.form);
						const checkFormChanged = () => {
							if (Form.value?.form) {
								const currentFormData = JSON.stringify(Form.value.form);
								formChanged.value = originalFormData !== currentFormData;
								//console.log('表单已变更:', formChanged.value);
							}
						};

						// 添加事件监听
						const formElement = document.querySelector('.cl-form form');
						if (formElement) {
							formElement.addEventListener('input', checkFormChanged);
							formElement.addEventListener('change', checkFormChanged);
						}
					}
				}, 500);
			},
			submit: handleSubmit
		}
	});
};

// 获取诊断
const getDiagnosis = () => {
	//console.log('获取诊断');
};

// 创建变量存储当前选择的期号
const qsValue = ref(1);
// 创建变量存储当前表单正在编辑的期号，用于切换取消时回退
const currentEditingEpisode = ref(1);

// 处理期号下拉框点击事件
const handleEpisodeClick = async () => {
	//console.log('点击期号下拉框11111111111111111111');
	// 检查表单是否有未保存的更改，如果有则自动保存
	if (formChanged.value) {
		try {
			//console.log('表单有变更，点击期号下拉框时自动保存');
			// 自动保存，不弹出确认框
			await handleSubmit();
		} catch (error) {
			console.error('自动保存失败:', error);
			ElMessage.error('自动保存失败');
		}
	}
};

// 期数选择变更处理 - 精简逻辑，只处理切换和加载
const qsChange = async (selectedValue?: number | Event): Promise<void> => {
	// 如果提供了值，则使用提供的值，否则使用当前选择的值
	let value: number;

	if (selectedValue === undefined) {
		value = qsValue.value;
	} else if (typeof selectedValue === 'number') {
		value = selectedValue;
	} else {
		// 如果是事件对象，使用当前选择的值
		value = qsValue.value;
		//console.log('使用当前选择的值:', value);
	}

	// 保存目标期号值 - 这是用户想要切换到的期号
	const targetEpisode = value;
	//console.log('目标切换的期号:', targetEpisode);

	try {
		// 查询该期号的记录
		const params = {
			swlNo: swlNo,
			serialNumber: serialNumber,
			episode: targetEpisode
		};

		//console.log('查询期号记录，参数:', params);

		// 查询该期号数据
		const data = await service.swl.treatment.findBySwlNo(params);

		if (data) {
			//console.log('查询到期号记录:', data);

			// 查询患者信息
			const patientInfo = await querySwl();
			let patientData = {};

			if (patientInfo) {
				patientData = {
					name: patientInfo.name,
					gender: patientInfo.gender,
					age: patientInfo.age,
					outpatientNo: patientInfo.outpatientNo,
					inpatientNo: patientInfo.inpatientNo,
					bedNo: patientInfo.bedNo
				};
				//console.log('查询到患者信息:', patientData);
			}

			// 合并数据并打开表单
			openForm({
				...patientData,
				...data,
				qsOptions: episodeOptions.value
			});

			// 更新治疗记录ID
			if (data.id) {
				treatmentId.value = data.id;
				//console.log('更新治疗记录ID:', treatmentId.value);
			}

			// 重置表单变更状态
			formChanged.value = false;

			// 更新当前编辑的期号值
			currentEditingEpisode.value = targetEpisode;
		} else {
			console.warn('未查询到期号记录');
			// 加载空表单但保留期号信息
			const patientInfo = await querySwl();
			openForm({
				...(patientInfo || {}),
				swlNo: swlNo,
				serialNumber: serialNumber,
				episode: targetEpisode,
				qsOptions: episodeOptions.value
			});

			// 更新当前编辑的期号值
			currentEditingEpisode.value = targetEpisode;

			// 重置治疗ID
			treatmentId.value = 0;
		}
	} catch (error) {
		console.error('切换期号失败:', error);
		ElMessage.error('切换期号失败');
	}
};

// 创建新期号
const newTreatment = async () => {
	if (!Form.value) {
		ElMessage.warning('表单未初始化');
		return;
	}

	// 获取当前表单数据
	const formData = Form.value.form || {};

	try {
		Loading.open('创建新期号...');

		// 查询所有期号
		const result = await service.swl.treatment.findBySwlNo({
			swlNo: formData.swlNo,
			serialNumber: formData.serialNumber
		});

		if (!result?.qsOptions || !Array.isArray(result.qsOptions)) {
			episodeOptions.value = [{ label: '1', value: 1 }];
		} else {
			// 更新期号选项列表
			episodeOptions.value = result.qsOptions.map(item => ({
				label: String(item),
				value: Number(item)
			}));
		}

		// 找出最大期数
		let maxEpisode = 0;
		episodeOptions.value.forEach(item => {
			if (item.value > maxEpisode) {
				maxEpisode = item.value;
			}
		});

		// 新期号 = 最大期号 + 1
		const newEpisode = maxEpisode + 1;

		// 保存要保留的字段
		const {
			name,
			gender,
			age,
			inpatientNo,
			outpatientNo,
			bedNo,
			sequenceNo,
			swlNo,
			serialNumber,
			visitDate
		} = formData;

		// 清空表单ID
		treatmentId.value = 0;

		// 添加新期号到选项
		episodeOptions.value = [
			...episodeOptions.value,
			{
				label: String(newEpisode),
				value: newEpisode
			}
		];

		// 打开新表单
		openForm({
			name,
			gender,
			age,
			inpatientNo,
			outpatientNo,
			bedNo,
			sequenceNo,
			swlNo,
			serialNumber,
			episode: newEpisode,
			qsOptions: episodeOptions.value,
			visitDate
		});

		// 确保表单的episode字段正确设置并自动保存新记录
		nextTick(async () => {
			if (Form.value) {
				Form.value.setForm('episode', newEpisode);
				currentEditingEpisode.value = newEpisode;

				// 新增功能：自动保存新期号记录
				try {
					//console.log('自动保存新创建的期号记录');
					await handleSubmit();
				} catch (err) {
					console.error('自动保存新期号记录失败:', err);
					ElMessage.warning('新期号创建成功，但自动保存失败，请手动保存');
				}
			}
		});

		Loading.close();
		ElMessage.success(`已创建第${newEpisode}期治疗表单`);
	} catch (error) {
		Loading.close();
		console.error('创建新期号失败:', error);
		ElMessage.error('创建新期号失败: ' + (error as any)?.message || '未知错误');
	}
};

// 提交表单
const handleSubmit = async () => {
	if (!Form.value) {
		ElMessage.error('表单未初始化');
		return false;
	}

	try {
		// 验证表单
		let isValid = true;
		if (Form.value.validate) {
			try {
				await new Promise((resolve, reject) => {
					Form.value.validate((valid: boolean, invalidFields: any) => {
						if (valid) {
							resolve(true);
						} else {
							isValid = false;
							reject(new Error('表单验证失败'));
						}
					});
				});
			} catch (error) {
				ElMessage.error('请填写必填项');
				return false;
			}
		}

		if (!isValid) {
			ElMessage.error('表单验证失败');
			return false;
		}

		// 获取表单数据
		const formData = Form.value.form || {};

		if (!formData.swlNo) {
			ElMessage.error('序列号不能为空');
			return false;
		}

		Loading.open('保存中...');

		// 检查是否存在相同的记录
		const params = {
			swlNo: formData.swlNo,
			serialNumber: formData.serialNumber,
			episode: formData.episode
		};

		const existingRecord = await service.swl.treatment.findBySwlNo(params);

		// 整理不良反应数据，从多选转为单独字段
		const blfyOptions = formData.blfyOptions || [];
		const blfyData = {
			noAdverseReaction: blfyOptions.includes('noAdverseReaction') ? 1 : 0,
			hasSkinBleeding: blfyOptions.includes('hasSkinBleeding') ? 1 : 0,
			hasNausea: blfyOptions.includes('hasNausea') ? 1 : 0,
			hasRadiationPain: blfyOptions.includes('hasRadiationPain') ? 1 : 0,
			otherAdverseReaction: blfyOptions.includes('otherAdverseReaction') ? 1 : 0
		};

		// 准备保存的数据
		const saveData = {
			...formData,
			...blfyData
		};

		// 删除多选数据，避免后端保存错误
		delete saveData.blfyOptions;

		let res;
		if (existingRecord?.id) {
			// 更新现有记录
			//console.log('更新记录:', existingRecord.id);
			res = await service.swl.treatment.update({
				...saveData,
				id: existingRecord.id
			});
			ElMessage.success('更新记录成功');
			treatmentId.value = existingRecord.id;
		} else {
			// 添加新记录
			//console.log('添加新记录');
			res = await service.swl.treatment.add(saveData);
			ElMessage.success('添加记录成功');

			// 更新treatmentId以便继续编辑
			if (res?.id) {
				treatmentId.value = res.id;
			}
		}

		// 重置表单变更状态
		formChanged.value = false;

		// 更新表单数据以便继续编辑
		if (res) {
			// 更新现有数据
			await getTreatmentList();
		}

		Loading.close();
		return true;
	} catch (e) {
		Loading.close();
		console.error('保存失败:', e);
		ElMessage.error('保存失败: ' + (e as any)?.message || '未知错误');
		return false;
	}
};

// 删除功能
const handleDelete = async () => {
	if (!Form.value) {
		ElMessage.error('表单未初始化');
		return;
	}

	// 获取当前表单数据
	const formData = Form.value.form || {};
	const currentEpisode = formData.episode;

	// 判断是否已保存状态（有ID）
	const hasSaved = formData.id || treatmentId.value > 0;

	if (!hasSaved) {
		ElMessage.warning('请先保存当前期号');
		return;
	}

	try {
		// 获取所有期号
		const allEpisodes = await service.swl.treatment.findBySwlNo({
			swlNo: formData.swlNo,
			serialNumber: formData.serialNumber
		});

		if (!allEpisodes?.qsOptions || !Array.isArray(allEpisodes.qsOptions)) {
			ElMessage.error('获取期号数据失败');
			return;
		}

		// 计算最大期号
		const episodes = allEpisodes.qsOptions.map(item => Number(item));
		const maxEpisode = Math.max(...episodes);

		// 判断是否为最大期号
		if (Number(currentEpisode) !== maxEpisode) {
			ElMessage.warning('只能删除最新期号');
			return;
		}

		// 确认删除
		await ElMessageBox.confirm('确定要删除当前期号记录吗？', '删除确认', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		});

		Loading.open('删除中...');

		// 执行删除
		await service.swl.treatment.delete({ ids: [formData.id || treatmentId.value] });
		ElMessage.success('删除成功');

		// 获取删除后的最新数据
		const updatedEpisodes = await service.swl.treatment.findBySwlNo({
			swlNo: formData.swlNo,
			serialNumber: formData.serialNumber
		});

		if (
			updatedEpisodes?.qsOptions &&
			Array.isArray(updatedEpisodes.qsOptions) &&
			updatedEpisodes.qsOptions.length > 0
		) {
			// 更新期号选项
			episodeOptions.value = updatedEpisodes.qsOptions.map(item => ({
				label: String(item),
				value: item
			}));

			// 获取更新后的最大期号
			const newEpisodes = updatedEpisodes.qsOptions.map(item => Number(item));
			const newMaxEpisode = Math.max(...newEpisodes);

			// 加载最大期号的数据
			const latestRecord = await service.swl.treatment.findBySwlNo({
				swlNo: formData.swlNo,
				serialNumber: formData.serialNumber,
				episode: newMaxEpisode
			});

			// 查询患者基础信息
			const patientInfo = await querySwl();

			// 打开表单
			if (latestRecord) {
				openForm({
					...(patientInfo || {}),
					...latestRecord,
					qsOptions: episodeOptions.value
				});
			} else {
				// 如果没有记录，初始化新表单
				openForm({
					...(patientInfo || {}),
					swlNo: formData.swlNo,
					serialNumber: formData.serialNumber,
					episode: 1,
					qsOptions: episodeOptions.value
				});
			}
		} else {
			// 如果删除后没有记录，则初始化一个新表单
			const patientInfo = await querySwl();

			episodeOptions.value = [{ label: '1', value: 1 }];

			openForm({
				...(patientInfo || {}),
				swlNo: formData.swlNo,
				serialNumber: formData.serialNumber,
				episode: 1,
				qsOptions: episodeOptions.value
			});
		}

		Loading.close();
	} catch (error) {
		if (error !== 'cancel') {
			console.error('删除失败:', error);
			ElMessage.error('删除失败: ' + (error as any)?.message || '未知错误');
		}
		Loading.close();
	}
};

// 清空功能
const clearData = async () => {
	// 获取当前表单数据
	const formData = Form.value.form || {};

	try {
		await ElMessageBox.confirm('确定要清空当前数据吗？', '清空确认', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		});

		// 提取需要保留的患者信息
		const patientInfo = {
			name: formData.name,
			gender: formData.gender,
			age: formData.age,
			outpatientNo: formData.outpatientNo,
			inpatientNo: formData.inpatientNo,
			bedNo: formData.bedNo,
			sequenceNo: formData.sequenceNo,
			swlNo: formData.swlNo,
			serialNumber: formData.serialNumber,
			episode: formData.episode,
			qsOptions: formData.qsOptions,
			visitDate: formData.visitDate
		};

		//console.log('清空数据data', JSON.stringify(patientInfo));

		// 重置表单并设置患者信息,下面方法是还原数据到初始状态
		//Form.value.resetFields();

		Form.value.clear();

		Form.value.setForm('name', patientInfo.name);
		Form.value.setForm('gender', patientInfo.gender);
		Form.value.setForm('age', patientInfo.age);
		Form.value.setForm('outpatientNo', patientInfo.outpatientNo);
		Form.value.setForm('inpatientNo', patientInfo.inpatientNo);
		Form.value.setForm('bedNo', patientInfo.bedNo);
		Form.value.setForm('sequenceNo', patientInfo.sequenceNo);
		Form.value.setForm('swlNo', patientInfo.swlNo);
		Form.value.setForm('serialNumber', patientInfo.serialNumber);
		Form.value.setForm('episode', patientInfo.episode);
		Form.value.setForm('qsOptions', patientInfo.qsOptions);
		Form.value.setForm('visitDate', patientInfo.visitDate);
		ElMessage.success('数据已清空');
	} catch (error) {
		if (error !== 'cancel') {
			console.error('清空失败:', error);
		}
	}
};

// 打印功能
const handlePrint = () => {
	ElMessage.info('打印功能尚未实现');
};

// 打印健康教育处方
const handlePrintHealth = () => {
	ElMessage.info('打印健康教育处方功能尚未实现');
};

// 初始化表单数据
const initTreatment = async () => {
	try {
		//console.log('开始初始化治疗记录表单...');

		// 先查询患者基本信息
		const patientInfo = await querySwl();
		let patientData = {}; // 存储患者基本信息

		if (patientInfo) {
			//console.log('获取到患者基本信息', patientInfo);
			// 提取关键患者信息
			patientData = {
				name: patientInfo.name,
				gender: patientInfo.gender,
				age: patientInfo.age,
				outpatientNo: patientInfo.outpatientNo,
				inpatientNo: patientInfo.inpatientNo,
				bedNo: patientInfo.bedNo,
				visitDate: patientInfo.visitDate
				// 添加其他所需的患者基本字段
			};
		} else {
			console.warn('未能获取到患者基本信息');
		}

		//console.log('查询治疗记录参数:', { swlNo, serialNumber });
		// 查询该患者的碎石治疗记录
		const params = { swlNo: swlNo, serialNumber: serialNumber };
		const result = await service.swl.treatment.findBySwlNo(params);
		//console.log('查询治疗记录结果:', result);

		// 检查是否有qsOptions属性
		if (result && result.qsOptions && Array.isArray(result.qsOptions)) {
			// 获取所有期数
			const episodes = result.qsOptions.map(item => Number(item));
			//console.log('获取到的期数列表:', episodes);

			if (episodes.length > 0) {
				// 设置期数选项
				episodeOptions.value = episodes.map(item => ({
					label: String(item),
					value: item
				}));

				// 获取最大期数
				const maxEpisode = Math.max(...episodes);
				//console.log('找到最大期数:', maxEpisode);

				// 查询最大期数的记录
				const latestRecordParams = {
					swlNo: swlNo,
					serialNumber: serialNumber,
					episode: maxEpisode
				};
				const latestRecord = await service.swl.treatment.findBySwlNo(latestRecordParams);

				if (latestRecord) {
					//console.log('获取到最大期数记录:', latestRecord);
					// 合并患者信息和治疗记录
					const fullData = {
						...patientData, // 患者基本信息
						...latestRecord, // 治疗记录信息
						qsOptions: episodeOptions.value
					};

					openForm(fullData);
					return;
				}
			}
		} else {
			console.warn('未找到期数信息或格式不正确');
		}

		// 如果没有治疗记录或出现问题，初始化新记录
		//console.log('初始化新记录');
		episodeOptions.value = [{ label: '1', value: 1 }];
		openForm({
			...patientData, // 患者基本信息
			swlNo: swlNo,
			serialNumber: serialNumber,
			episode: 1,
			sequenceNo: 1,
			qsOptions: episodeOptions.value,
			visitDate: dayjs().format('YYYY-MM-DD')
		});
	} catch (error) {
		console.error('初始化治疗记录失败:', error);
		ElMessage.error('初始化治疗记录失败');

		// 即使出错也尝试打开一个空表单
		openForm({
			swlNo: swlNo,
			serialNumber: serialNumber,
			episode: 1,
			sequenceNo: 1,
			qsOptions: [{ label: '1', value: 1 }],
			visitDate: dayjs().format('YYYY-MM-DD')
		});
	}
};

// 使用nextTick包装初始化函数，确保组件已经渲染
const safeInit = () => {
	nextTick(() => {
		initTreatment();
	});
};

// 在mounted钩子中使用setTimeout避免生命周期问题
onMounted(() => {
	setTimeout(safeInit, 0);
});

// 向父组件暴露方法
defineExpose({
	initTreatment,
	openForm,
	clearData,
	newTreatment
});

// 创建Loading实例
const Loading = {
	instance: null as any,
	open(text = 'Loading...') {
		this.instance = ElLoading.service({
			lock: true,
			text,
			background: 'rgba(0, 0, 0, 0.7)'
		});
	},
	close() {
		if (this.instance) {
			this.instance.close();
			this.instance = null;
		}
	}
};

// 获取治疗记录列表
const getTreatmentList = async () => {
	if (!swlNo || !serialNumber) {
		console.warn('体外碎石序列号或者序号为空，无法获取记录');
		return;
	}

	try {
		const params = {
			swlNo: swlNo,
			serialNumber: serialNumber
		};

		const result = await service.swl.treatment.findBySwlNo(params);
		//console.log('获取治疗记录列表:', result);

		if (result && result.qsOptions && Array.isArray(result.qsOptions)) {
			// 更新期号选项
			episodeOptions.value = result.qsOptions.map(item => ({
				label: String(item),
				value: item
			}));
		} else {
			console.warn('获取期号选项失败，使用默认选项');
			episodeOptions.value = [{ label: '1', value: 1 }];
		}

		return result;
	} catch (error) {
		console.error('获取治疗记录列表失败:', error);
		ElMessage.error('获取治疗记录列表失败');
		return null;
	}
};

// 格式化性别
function formatGender(gender) {
	if (gender === undefined || gender === null) return ' ';
	const genderMap = {
		'0': '未知',
		'1': '男',
		'2': '女'
	};
	return genderMap[gender] || gender;
}
</script>

<style lang="scss" scoped>
.treatment-info {
	padding: 20px;
	background-color: #f8fafc;
	background-image:
		radial-gradient(circle at 10% 10%, rgba(224, 242, 254, 0.8), transparent 30%),
		radial-gradient(circle at 90% 90%, rgba(186, 230, 253, 0.4), transparent 40%);
	border-radius: 15px;
	box-shadow: 0 12px 30px rgba(32, 160, 255, 0.12);
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(90deg, rgba(32, 160, 255, 0.8), rgba(29, 233, 182, 0.8));
		background-size: 200% 100%;
		animation: gradientFlow 5s infinite linear;
	}

	.tech-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3px;
		padding-bottom: 3px;
		border-bottom: 1px solid rgba(32, 160, 255, 0.25);
		position: relative;

		.tech-title-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: nowrap;
			width: 100%; // 确保占满整行

			.tech-title {
				font-size: 22px;
				font-weight: 600;
				color: #0a58ca;
				text-shadow: 0 0 10px rgba(32, 160, 255, 0.2);
				white-space: nowrap;
				flex-shrink: 0; // 防止标题被压缩
				letter-spacing: 0.5px;
				position: relative;
				padding-left: 15px;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 5px;
					height: 80%;
					background: linear-gradient(
						to bottom,
						rgba(32, 160, 255, 0.8),
						rgba(29, 233, 182, 0.8)
					);
					border-radius: 2px;
				}

				.blink {
					animation: blink 1.2s infinite;
					font-weight: normal;
					color: rgba(32, 160, 255, 0.9);
				}
			}

			.model-info {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-end;
				font-size: 18px;
				color: #6c757d;
				font-family: 'Courier New', monospace;
				margin-left: auto;
				padding-left: 20px;
				flex-grow: 1; // 允许信息区域在有空间时扩展
				text-align: right; // 确保文本靠右对齐

				span {
					margin-left: 18px;
					padding: 2px 5px;
					white-space: nowrap;
					display: inline-block;
					position: relative;
					font-weight: bold;
					font-style: italic;
					color: #0d1a26;
					transition: all 0.3s ease;
					cursor: default; // 显示提示鼠标样式

					// 去掉原有的背景和边框
					background: transparent;
					border: none;

					// 添加虚线分隔
					&:not(:first-child)::before {
						content: '';
						position: absolute;
						left: 5px; // 稍微调整虚线位置
						top: 25%;
						height: 50%;
						width: 1px;
						border-left: 1px dashed rgba(32, 160, 255, 0.4);
					}

					&:hover {
						color: rgba(32, 160, 255, 1);
						transform: translateY(-1px);
					}

					&:empty::after {
						content: ' ';
						display: inline-block;
						width: 1px;
					}
				}
			}
		}

		&::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: -1px;
			width: 50px;
			height: 3px;
			background: linear-gradient(90deg, rgba(32, 160, 255, 0.8), rgba(29, 233, 182, 0.8));
		}
	}

	.tech-patient-info {
		padding: 8px 5px 10px;
		margin-bottom: 5px;
		background: rgba(240, 248, 255, 0.9);
		border: 1px solid rgba(32, 160, 255, 0.3);
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(32, 160, 255, 0.2);
		position: relative;
		z-index: 2;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background:
				radial-gradient(circle at 10% 20%, rgba(32, 160, 255, 0.1), transparent 30%),
				radial-gradient(circle at 90% 80%, rgba(29, 233, 182, 0.05), transparent 30%),
				linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
			pointer-events: none;
			z-index: -1;
		}
		.patient-info {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-end;
			font-size: 18px;
			color: #6c757d;
			font-family: 'Courier New', monospace;
			margin-left: auto;
			padding-left: 20px;
			flex-grow: 1; // 允许信息区域在有空间时扩展
			text-align: right; // 确保文本靠右对齐

			span {
				margin-left: 18px;
				padding: 2px 5px;
				white-space: nowrap;
				display: inline-block;
				position: relative;
				font-weight: bold;
				font-style: italic;
				color: #0d1a26;
				transition: all 0.3s ease;
				cursor: default; // 显示提示鼠标样式

				// 去掉原有的背景和边框
				background: transparent;
				border: none;

				// 添加虚线分隔
				&:not(:first-child)::before {
					content: '';
					position: absolute;
					left: 5px; // 稍微调整虚线位置
					top: 25%;
					height: 50%;
					width: 1px;
					border-left: 1px dashed rgba(32, 160, 255, 0.4);
				}

				&:hover {
					color: rgba(32, 160, 255, 1);
					transform: translateY(-1px);
				}

				&:empty::after {
					content: ' ';
					display: inline-block;
					width: 1px;
				}
			}
		}
	}
}

.tech-content {
	position: relative;
	//background-color: #f8fafc;
	//透明背景
	background-color: transparent;
	background-image:
		linear-gradient(125deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 40%),
		radial-gradient(circle at 5% 95%, rgba(32, 160, 255, 0.1), transparent 20%);
	// 增加内容内边距
	padding: 10px;
	// 增加内容圆角
	border-radius: 12px;
	// 增加内容阴影
	box-shadow: 0 10px 25px rgba(32, 160, 255, 0.12);
	// 增加内容最小高度
	min-height: 600px;
	// 增加内容边框
	border: 1px solid rgba(32, 160, 255, 0.25);
	// 增加内容过渡
	transition: all 0.3s ease;
	// 增加内容溢出隐藏
	overflow: hidden;
	// 增加内容顶部间距
	margin-top: 0px;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		background: linear-gradient(90deg, rgba(32, 160, 255, 0.8), rgba(29, 233, 182, 0.8));
		opacity: 0.8;
	}

	// &::after {
	// 	content: '';
	// 	position: absolute;
	// 	width: 100%;
	// 	height: 2px;
	// 	background-color: rgba(32, 160, 255, 0.1);
	// 	left: 0;
	// 	top: 50%;
	// 	animation: scanning 4s ease-in-out infinite;
	// 	pointer-events: none;
	// 	background-image: linear-gradient(
	// 		90deg,
	// 		transparent,
	// 		rgba(32, 160, 255, 0.5),
	// 		rgba(29, 233, 182, 0.5),
	// 		transparent
	// 	);
	// }
}

.scroll-container {
	width: 100%;
	height: 100%;
	max-height: 90vh;
	min-height: 300px;
	overflow-y: auto !important;
	overflow-x: auto !important;
	padding: 15px;
	position: relative;
	display: block;
	box-sizing: border-box;
	z-index: 1;

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

	:deep(.cl-form) {
		width: 100%;
		min-width: 100%;
		overflow: visible;
	}
}

@media screen and (max-width: 768px) {
	.scroll-container {
		padding: 10px;
		max-height: 55vh;
	}
}

/* 全局设置表单项间距 */
:deep(.el-form-item) {
	margin-bottom: 10px !important; /* 调整各行之间的间距 */
}

// 设置下拉框高度
:deep(.el-select__wrapper) {
	height: 28px !important;
	min-height: 28px !important;
}

:deep(.el-select__wrapper.is-filterable) {
	height: 28px !important;
	min-height: 28px !important;

	// 设置内部输入框
	input.el-select__input {
		height: 26px !important;
		line-height: 26px !important;
	}
}
</style>
