<template>
	<div class="curative-wrapper">
		<p hidden>id: {{ swlId }}</p>
		<p hidden>swlNo: {{ swlNo }}</p>
		<p hidden>serialNumber: {{ serialNumber }}</p>
		<p hidden>sequenceNo: {{ sequenceNo }}</p>
		<p hidden>episode: {{ episode }}</p>
		<div class="scroll-container">
			<!-- <div class="curative-info"> -->
			<div class="tech-content">
				<cl-row>
					<cl-form ref="Form" inner>
						<!-- 添加医生选择器插槽 -->
						<template #slot-doctor="{ scope }">
							<component :is="DoctorSelect" v-model="scope.doctor" />
						</template>
					</cl-form>
				</cl-row>
			</div>
			<!-- </div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { useBase } from '/@/modules/base';
import { ElMessage } from 'element-plus';
import { Plugins } from '/#/crud';
import { ref, onMounted, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { usePatient } from '/@/modules/patient';
import dayjs from 'dayjs';
const Form = useForm();
const cool = useCool();
const { dict } = useDict();
const { user } = useBase();
const { service } = useCool();
const route = useRoute();

const {
	// 医生选择组件
	DoctorSelect
} = usePatient().components;

// 获取路由参数
const swlId = route.query.id;
const swlNo = route.query.swlNo;
const serialNumber = route.query.serialNumber;
const sequenceNo = route.query.sequenceNo;
const episode = route.query.episode;
// 定义治疗ID引用
const curativeId = ref(0);

// 其他症状选项
const qtzzOptions = [
	{ label: '发热', value: 'fever' },
	{ label: '恶心', value: 'nausea' },
	{ label: '呕吐', value: 'vomiting' },
	{ label: '皮肤渗血或瘀斑', value: 'skinEcchymosis' }
];

// 并发症选项
const bfzOptions = [
	{ label: '肾包膜下血肿', value: 'subcapsularHematoma' },
	{ label: '肾出血', value: 'renalHemorrhage' },
	{ label: '感染', value: 'infection' },
	{ label: '肾绞痛', value: 'renalColic' },
	{ label: '肾衰', value: 'renalFailure' }
];

// 疗效评定参数选项
const lxpdcsOptions = [
	{ label: '无石', value: 'curativeParamStoneFree' },
	{ label: '初震', value: 'curativeParamInitialShock' },
	{ label: '复震', value: 'curativeParamRepeatShock' },
	{ label: 'SWL前辅助治疗', value: 'curativeParamPreSWL' },
	{ label: 'SWL后治疗性辅助治疗', value: 'curativeParamPostSWLTherapy' },
	{ label: 'SWL后补助性辅助治疗', value: 'curativeParamPostSWLSupport' }
];

// 代谢因素选项
const dxysOptions = [
	{ label: '痛风', value: 'metabolicGout' },
	{ label: '肾小管中毒', value: 'metabolicRTA' },
	{ label: '低磷血症', value: 'metabolicHypophosphatemia' },
	{ label: '高草酸尿', value: 'metabolicHyperoxaluria' },
	{ label: '甲旁亢', value: 'metabolicHyperparathyroidism' },
	{ label: '高钠尿', value: 'metabolicHypernatriuria' },
	{ label: '碱性尿', value: 'metabolicAlkalineUrine' },
	{ label: '高钙尿', value: 'metabolicHypercalciuria' },
	{ label: '低镁尿', value: 'metabolicHypomagnesuria' },
	{ label: '高尿酸尿', value: 'metabolicHyperuricosuria' },
	{ label: '低枸橼酸尿', value: 'metabolicHypocitraturia' },
	{ label: '胱氨酸尿', value: 'metabolicCystinuria' },
	{ label: '不明确', value: 'metabolicUnknown' }
];

// 局部因素选项
const jbysOptions = [
	{ label: '海绵肾', value: 'localSpongeKidney' },
	{ label: '马蹄肾', value: 'localHorseshoeKidney' },
	{ label: '肾囊肿', value: 'localRenalCyst' },
	{ label: '重复肾', value: 'localDuplexKidney' },
	{ label: 'BPH', value: 'localBPH' },
	{ label: 'UPJ狭窄', value: 'localUPJStricture' },
	{ label: '多囊肾', value: 'localPolycysticKidney' },
	{ label: '尿道狭窄', value: 'localUrethralStricture' },
	{ label: '尿道异物', value: 'localUrethralForeignBody' },
	{ label: '输尿管狭窄', value: 'localUreteralStricture' },
	{ label: '异位肾', value: 'localEctopicKidney' },
	{ label: '膀胱憩室', value: 'localBladderDiverticulum' },
	{ label: '神经源性膀胱', value: 'localNeurogenicBladder' },
	{ label: '肾盏憩室', value: 'localCalycealDiverticulum' },
	{ label: '输尿管囊肿', value: 'localUreterocele' },
	{ label: '其他', value: 'localOther' }
];

// 其他选项组
const options = reactive({
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	]
});

/**
 * 第一步：填写疗效评定的前置信息：
 * 查询病人SWL登记信息
 * 查询病人SWL治疗信息
 * 针对该序列做综合疗效评定
 * 暂定逻辑：
 * 1. 查询的治疗记录为返回的最新一期记录
 * 2. 结石成分也取得最新一期记录
 */
const patientSwlInfo = reactive({
	swlId: swlId, // swlId
	swlNo: swlNo, // 碎石号
	serialNumber: serialNumber, // 就诊流水号
	sequenceNo: Number(sequenceNo), // 序列号
	episode: Number(episode), // 期数
	name: '', // 姓名
	gender: '', // 性别
	age: '', // 年龄
	outpatientNo: '', // 门诊号
	inpatientNo: '', // 住院号
	bedNo: '', // 床号
	height: '', // 身高
	weight: '', // 体重
	bmi: '', // BMI
	treatmentTime: '', // 治疗日期
	component1: '', // 结石成分一
	component1Percent: '', // 成分一百分比
	component2: '', // 结石成分二
	component2Percent: '', // 成分二百分比
	component3: '', // 结石成分三
	component3Percent: '', // 成分三百分比
	component4: '', // 结石成分四
	component4Percent: '' // 成分四百分比
});

// 查询病人SWL信息和SWL治疗信息
const querySwlTreatment = async () => {
	try {
		const params = { id: swlId };
		const swlData = await service.swl.info.info(params);
		// treatmentData可能为对象数组，需要取第一个
		const treatmentDataList = await service.swl.treatment.page({
			swlNo: swlNo,
			serialNumber: serialNumber,
			sequenceNo: Number(sequenceNo),
			page: 1,
			size: 999
		});
		const treatmentData = treatmentDataList?.list?.[0];
		// componentData可能为对象数组，需要取第一个
		const componentDataList = await service.etiology.component.page({
			swlNo: swlNo,
			serialNumber: serialNumber,
			page: 1,
			size: 999
		});
		const componentData = componentDataList?.list?.[0];

		// console.log(
		// 	'查询到患者基本信息aaaaaaaaaaaaaaaaaaaa:',
		// 	swlData,
		// 	treatmentData,
		// 	componentData
		// );
		// 必须保持swlData、treatmentData有值，componentData有值时合并，无值时使用空对象
		// 重复字段，以swlData为准,因此要在最后合并
		if (swlData && treatmentData) {
			// 基础数据合并
			const mergedData = {
				...treatmentData,
				// componentData有值时合并，无值时使用空对象
				...(componentData || {}),
				...swlData
			};

			// 将查询到的数据赋值给患者信息对象
			Object.assign(patientSwlInfo, {
				...mergedData,
				swlId: swlData.id
			});

			//console.log('查询到患者基本信息bbbbbbbbbbbbbbbbbbb:', patientSwlInfo);
			return mergedData;
		} else {
			return null;
		}
	} catch (error) {
		console.error('获取患者信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(patientSwlInfo, {
			swlId: swlId,
			swlNo: swlNo,
			serialNumber: serialNumber,
			sequenceNo: Number(sequenceNo),
			episode: Number(episode),
			followupCount: 1,
			name: ' ',
			gender: ' ',
			age: ' ',
			outpatientNo: ' ',
			inpatientNo: ' ',
			bedNo: ' ',
			treatmentTime: ' ',
			component1: ' ',
			component1Percent: ' ',
			component2: ' ',
			component2Percent: ' ',
			component3: ' ',
			component3Percent: ' ',
			component4: ' ',
			component4Percent: ' '
		});
	}
};

/**
 * 第三步：初始化疗效评定表单数据
 */
const initCurative = async () => {
	try {
		const params = { swlNo: swlNo, serialNumber: serialNumber };
		const data = await service.swl.curative.findBySwlNo(params);

		if (data && data.swlNo) {
			curativeId.value = data.id || 0;

			// 处理checkbox组数据
			const checkboxData = formatCheckboxOptions(data);

			// 合并数据
			const formData = {
				...data,
				...checkboxData
			};

			// 打开表单并填充数据
			openForm(formData);
		} else {
			// 如果没有记录，查询患者基本信息
			await querySwlTreatment();
			// 初始化新记录
			openForm({
				swlNo: swlNo,
				serialNumber: serialNumber,
				name: patientSwlInfo.name,
				gender: patientSwlInfo.gender,
				age: patientSwlInfo.age,
				treatmentTime: patientSwlInfo.treatmentTime,
				component1: patientSwlInfo.component1,
				component1Percent: patientSwlInfo.component1Percent,
				component2: patientSwlInfo.component2,
				component2Percent: patientSwlInfo.component2Percent,
				component3: patientSwlInfo.component3,
				component3Percent: patientSwlInfo.component3Percent,
				component4: patientSwlInfo.component4,
				component4Percent: patientSwlInfo.component4Percent,
				followupDate: dayjs().format('YYYY-MM-DD'),
				// 术后天数为治疗日期到随访日期的天数
				postopDays: dayjs().diff(dayjs(patientSwlInfo.treatmentTime), 'day')
			});
		}
	} catch (error: any) {
		console.error('获取患者信息失败', error);
		ElMessage.error('获取患者信息失败: ' + (error.message || '未知错误'));
		// 错误时也使用空格确保内容显示
		Object.assign(patientSwlInfo, {
			id: ' ',
			swlNo: ' ',
			name: ' ',
			gender: ' ',
			age: ' ',
			treatmentTime: ' ',
			component1: ' ',
			component1Percent: ' ',
			component2: ' ',
			component2Percent: ' ',
			component3: ' ',
			component3Percent: ' ',
			episode: ' '
		});
	}
};

// 格式化checkbox组数据
const formatCheckboxOptions = (data: any) => {
	// 其他症状
	const qtzzData: string[] = [];
	if (Number(data.fever) === 1) qtzzData.push('fever');
	if (Number(data.nausea) === 1) qtzzData.push('nausea');
	if (Number(data.vomiting) === 1) qtzzData.push('vomiting');
	if (Number(data.skinEcchymosis) === 1) qtzzData.push('skinEcchymosis');

	// 并发症
	const bfzData: string[] = [];
	if (Number(data.subcapsularHematoma) === 1) bfzData.push('subcapsularHematoma');
	if (Number(data.renalHemorrhage) === 1) bfzData.push('renalHemorrhage');
	if (Number(data.infection) === 1) bfzData.push('infection');
	if (Number(data.renalColic) === 1) bfzData.push('renalColic');
	if (Number(data.renalFailure) === 1) bfzData.push('renalFailure');

	// 疗效评定参数
	const lxpdcsData: string[] = [];
	if (Number(data.curativeParamStoneFree) === 1) lxpdcsData.push('curativeParamStoneFree');
	if (Number(data.curativeParamInitialShock) === 1) lxpdcsData.push('curativeParamInitialShock');
	if (Number(data.curativeParamRepeatShock) === 1) lxpdcsData.push('curativeParamRepeatShock');
	if (Number(data.curativeParamPreSWL) === 1) lxpdcsData.push('curativeParamPreSWL');
	if (Number(data.curativeParamPostSWLTherapy) === 1)
		lxpdcsData.push('curativeParamPostSWLTherapy');
	if (Number(data.curativeParamPostSWLSupport) === 1)
		lxpdcsData.push('curativeParamPostSWLSupport');

	// 代谢因素
	const dxysData: string[] = [];
	if (Number(data.metabolicGout) === 1) dxysData.push('metabolicGout');
	if (Number(data.metabolicRTA) === 1) dxysData.push('metabolicRTA');
	if (Number(data.metabolicHypophosphatemia) === 1) dxysData.push('metabolicHypophosphatemia');
	if (Number(data.metabolicHyperoxaluria) === 1) dxysData.push('metabolicHyperoxaluria');
	if (Number(data.metabolicHyperparathyroidism) === 1)
		dxysData.push('metabolicHyperparathyroidism');
	if (Number(data.metabolicHypernatriuria) === 1) dxysData.push('metabolicHypernatriuria');
	if (Number(data.metabolicAlkalineUrine) === 1) dxysData.push('metabolicAlkalineUrine');
	if (Number(data.metabolicHypercalciuria) === 1) dxysData.push('metabolicHypercalciuria');
	if (Number(data.metabolicHypomagnesuria) === 1) dxysData.push('metabolicHypomagnesuria');
	if (Number(data.metabolicHyperuricosuria) === 1) dxysData.push('metabolicHyperuricosuria');
	if (Number(data.metabolicHypocitraturia) === 1) dxysData.push('metabolicHypocitraturia');
	if (Number(data.metabolicCystinuria) === 1) dxysData.push('metabolicCystinuria');
	if (Number(data.metabolicUnknown) === 1) dxysData.push('metabolicUnknown');

	// 局部因素
	const jbysData: string[] = [];
	if (Number(data.localSpongeKidney) === 1) jbysData.push('localSpongeKidney');
	if (Number(data.localHorseshoeKidney) === 1) jbysData.push('localHorseshoeKidney');
	if (Number(data.localRenalCyst) === 1) jbysData.push('localRenalCyst');
	if (Number(data.localDuplexKidney) === 1) jbysData.push('localDuplexKidney');
	if (Number(data.localBPH) === 1) jbysData.push('localBPH');
	if (Number(data.localUPJStricture) === 1) jbysData.push('localUPJStricture');
	if (Number(data.localPolycysticKidney) === 1) jbysData.push('localPolycysticKidney');
	if (Number(data.localUrethralStricture) === 1) jbysData.push('localUrethralStricture');
	if (Number(data.localUrethralForeignBody) === 1) jbysData.push('localUrethralForeignBody');
	if (Number(data.localUreteralStricture) === 1) jbysData.push('localUreteralStricture');
	if (Number(data.localEctopicKidney) === 1) jbysData.push('localEctopicKidney');
	if (Number(data.localBladderDiverticulum) === 1) jbysData.push('localBladderDiverticulum');
	if (Number(data.localNeurogenicBladder) === 1) jbysData.push('localNeurogenicBladder');
	if (Number(data.localCalycealDiverticulum) === 1) jbysData.push('localCalycealDiverticulum');
	if (Number(data.localUreterocele) === 1) jbysData.push('localUreterocele');
	if (Number(data.localOther) === 1) jbysData.push('localOther');

	return {
		qtzzOptions: qtzzData,
		bfzOptions: bfzData,
		lxpdcsOptions: lxpdcsData,
		dxysOptions: dxysData,
		jbysOptions: jbysData
	};
};

// 打开表单并填充数据
const openForm = (data: any) => {
	if (data.id) {
		curativeId.value = data.id;
	}
	data.name = data.name;
	data.gender = data.gender;
	data.age = data.age;
	data.treatmentTime = data.treatmentTime;
	data.followupDate = data.followupDate;
	data.postopDays = data.postopDays;

	Form.value?.open({
		title: '碎石治疗随访记录',
		form: data,
		items: [
			{
				label: 'id',
				prop: 'id',
				hidden: true,
				component: {
					name: 'el-input',
					props: { disabled: true }
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
						disabled: true
					}
				}
			},
			{
				label: '碎石号',
				prop: 'swlNo',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						clearable: true,
						disabled: true
					}
				}
			},
			{
				label: '姓名',
				prop: 'name',
				span: 4,
				component: {
					name: 'el-input',
					props: { clearable: true, disabled: true }
				}
			},
			{
				label: '性别',
				prop: 'gender',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						options: options.gender,
						checkStrictly: true
					}
				}
			},
			{
				label: '年龄',
				prop: 'age',
				span: 4,
				component: {
					name: 'el-input',
					props: { clearable: true, disabled: true }
				}
			},
			{
				label: '治疗日期',
				prop: 'treatmentTime',
				span: 4,
				component: {
					name: 'el-date-picker',
					props: {
						type: 'date',
						valueFormat: 'YYYY-MM-DD',
						disabled: true
					}
				}
			},
			{
				label: '随访日期',
				prop: 'followupDate',
				span: 4,
				value: dayjs().format('YYYY-MM-DD HH:mm:ss'),
				component: {
					name: 'el-date-picker',
					props: {
						type: 'date',
						valueFormat: 'YYYY-MM-DD'
					}
				}
			},
			{
				label: '术后天数',
				prop: 'postopDays',
				span: 4,
				component: {
					name: 'el-input-number',
					slots: {
						append: () => {
							return '天';
						}
					}
				}
			},
			{
				label: '末期肉眼血尿',
				prop: 'grossHematuria',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择末期肉眼血尿',
						options: dict.get('near_hematuria'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '其他症状',
				prop: 'qtzzOptions',
				span: 8,
				component: {
					name: 'el-checkbox-group',
					options: qtzzOptions
				}
			},
			{
				label: '并发症',
				prop: 'bfzOptions',
				span: 8,
				component: {
					name: 'el-checkbox-group',
					options: bfzOptions
				}
			},
			{
				label: '腰腹痛',
				prop: 'flankPainLevel',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择腰腹痛程度',
						options: dict.get('near_lumbago'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '石街类型',
				prop: 'steinstrasseType',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择石街类型',
						options: dict.get('near_syndromesx'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '石街长度',
				prop: 'steinstrasseLength',
				span: 4,
				component: {
					name: 'el-input',
					props: { clearable: true }
				}
			},
			{
				label: '排石时间',
				prop: 'stonePassDays',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						placeholder: '请输入排石时间'
					}
				}
			},
			{
				label: '排石量',
				prop: 'stoneOutputLevel',
				span: 4,
				name: 'cl-select',
				props: {
					placeholder: '请选择排石量',
					options: dict.get('near_eductionsum'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			},
			{
				label: '内科辅助治疗',
				prop: 'medicalTherapy',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择内科辅助治疗',
						options: dict.get('near_assistcure1'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true,
						allowCreate: true
					}
				}
			},
			{
				label: 'SWL前治疗性辅助治疗',
				prop: 'preSWLTherapy',
				span: 8,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择SWL前治疗性辅助治疗',
						options: dict.get('near_SWLassistcuring'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true,
						allowCreate: true
					}
				}
			},
			{
				label: 'SWL后治疗性辅助治疗',
				prop: 'postSWLTherapy',
				span: 8,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择SWL后治疗性辅助治疗',
						options: dict.get('near_SWLassistcuring'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true,
						allowCreate: true
					}
				}
			},
			{
				label: 'SWL后补助性辅助治疗',
				prop: 'postSWLSupport',
				span: 8,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择SWL后补助性辅助治疗',
						options: dict.get('near_SWLAfterAssistcure'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true,
						allowCreate: true
					}
				}
			},
			{
				label: '结石成分(1)',
				prop: 'component1',
				span: 3,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择成分',
						options: dict.get('near_compose'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '',
				prop: 'component1Percent',
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
							return '%';
						}
					}
				}
			},
			{
				label: '(2)',
				prop: 'component2',
				span: 3,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择成分',
						options: dict.get('near_compose'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '',
				prop: 'component2Percent',
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
							return '%';
						}
					}
				}
			},
			{
				label: '(3)',
				prop: 'component3',
				span: 3,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择成分',
						options: dict.get('near_compose'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '',
				prop: 'component3Percent',
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
							return '%';
						}
					}
				}
			},
			{
				label: '(4)',
				prop: 'component4',
				span: 3,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择成分',
						options: dict.get('near_compose'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '',
				prop: 'component4Percent',
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
							return '%';
						}
					}
				}
			},
			{
				label: '术后抗生素使用',
				prop: 'antibioticsUsed',
				span: 3,
				component: {
					name: 'cl-switch',
					props: {
						activeText: '有',
						inactiveText: '无',
						activeValue: 1,
						inactiveValue: 0
					}
				}
			},
			{
				label: '抗生素备注',
				prop: 'antibioticsNote',
				span: 6,
				component: {
					name: 'el-input',
					props: { clearable: true }
				}
			},
			{
				label: '成分分析方法',
				prop: 'analysisMethod',
				span: 6,
				value: '红外光谱法',
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择成分分析方法',
						options: dict.get('near_analyse2'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
				}
			},
			{
				label: '疗效',
				prop: 'effectiveness',
				span: 6,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择疗效',
						options: dict.get('near_result'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true,
						required: true
					}
				}
			},
			{
				label: '医生',
				prop: 'physician',
				value: user.info?.name,
				span: 3,
				component: {
					name: 'slot-doctor'
				}
			},
			{
				label: '超声检查结果',
				prop: 'usFinding',
				span: 8,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 3
					}
				}
			},
			{
				label: 'KUB检查结果',
				prop: 'kubFinding',
				span: 8,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 3
					}
				}
			},
			{
				label: '其他检查结果',
				prop: 'otherFinding',
				span: 8,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 3
					}
				}
			},
			{
				label: '疗效评定参数',
				prop: 'lxpdcsOptions',
				span: 24,
				component: {
					name: 'el-checkbox-group',
					options: lxpdcsOptions
				}
			},
			{
				label: '代谢因素',
				prop: 'dxysOptions',
				span: 24,
				component: {
					name: 'el-checkbox-group',
					options: dxysOptions
				}
			},
			{
				label: '局部因素',
				prop: 'jbysOptions',
				span: 24,
				component: {
					name: 'el-checkbox-group',
					options: jbysOptions
				}
			}
		],
		plugins: [Plugins.Form.setFocus('')],
		op: {
			// 默认靠右布局
			justify: 'center',
			buttons: [
				{
					label: '保存',
					type: 'primary',
					onClick: () => Form.value?.submit()
				},
				{
					label: '清空',
					onClick: clearData
				}
			]
		},
		on: {
			submit: async (data, { done }) => {
				handleSubmit(data);
				done();
			}
		}
	});
};

/**
 * 第三步：处理表单数据提交
 */
const handleSubmit = async (data: any) => {
	try {
		// 准备要保存的数据对象
		const saveData = {
			id: curativeId.value,
			swlNo: swlNo,
			serialNumber: serialNumber,
			followupDate: data.followupDate,
			postopDays: data.postopDays,
			grossHematuria: data.grossHematuria,
			flankPainLevel: data.flankPainLevel,
			steinstrasseType: data.steinstrasseType,
			steinstrasseLength: data.steinstrasseLength,
			stonePassDays: data.stonePassDays,
			stoneOutputLevel: data.stoneOutputLevel,
			medicalTherapy: data.medicalTherapy,
			preSWLTherapy: data.preSWLTherapy,
			postSWLTherapy: data.postSWLTherapy,
			postSWLSupport: data.postSWLSupport,
			component1: data.component1,
			component1Percent: data.component1Percent ? Number(data.component1Percent) : null,
			component2: data.component2,
			component2Percent: data.component2Percent ? Number(data.component2Percent) : null,
			component3: data.component3,
			component3Percent: data.component3Percent ? Number(data.component3Percent) : null,
			component4: data.component4,
			component4Percent: data.component4Percent ? Number(data.component4Percent) : null,
			antibioticsUsed: data.antibioticsUsed,
			antibioticsNote: data.antibioticsNote,
			analysisMethod: data.analysisMethod,
			effectiveness: data.effectiveness,
			usFinding: data.usFinding,
			kubFinding: data.kubFinding,
			otherFinding: data.otherFinding,

			// 处理checkbox组数据
			fever: data.qtzzOptions?.includes('fever') ? 1 : 0,
			nausea: data.qtzzOptions?.includes('nausea') ? 1 : 0,
			vomiting: data.qtzzOptions?.includes('vomiting') ? 1 : 0,
			skinEcchymosis: data.qtzzOptions?.includes('skinEcchymosis') ? 1 : 0,

			// 并发症
			subcapsularHematoma: data.bfzOptions?.includes('subcapsularHematoma') ? 1 : 0,
			renalHemorrhage: data.bfzOptions?.includes('renalHemorrhage') ? 1 : 0,
			infection: data.bfzOptions?.includes('infection') ? 1 : 0,
			renalColic: data.bfzOptions?.includes('renalColic') ? 1 : 0,
			renalFailure: data.bfzOptions?.includes('renalFailure') ? 1 : 0,

			// 疗效评定参数
			curativeParamStoneFree: data.lxpdcsOptions?.includes('curativeParamStoneFree') ? 1 : 0,
			curativeParamInitialShock: data.lxpdcsOptions?.includes('curativeParamInitialShock')
				? 1
				: 0,
			curativeParamRepeatShock: data.lxpdcsOptions?.includes('curativeParamRepeatShock')
				? 1
				: 0,
			curativeParamPreSWL: data.lxpdcsOptions?.includes('curativeParamPreSWL') ? 1 : 0,
			curativeParamPostSWLTherapy: data.lxpdcsOptions?.includes('curativeParamPostSWLTherapy')
				? 1
				: 0,
			curativeParamPostSWLSupport: data.lxpdcsOptions?.includes('curativeParamPostSWLSupport')
				? 1
				: 0,

			// 代谢因素
			metabolicGout: data.dxysOptions?.includes('metabolicGout') ? 1 : 0,
			metabolicRTA: data.dxysOptions?.includes('metabolicRTA') ? 1 : 0,
			metabolicHypophosphatemia: data.dxysOptions?.includes('metabolicHypophosphatemia')
				? 1
				: 0,
			metabolicHyperoxaluria: data.dxysOptions?.includes('metabolicHyperoxaluria') ? 1 : 0,
			metabolicHyperparathyroidism: data.dxysOptions?.includes('metabolicHyperparathyroidism')
				? 1
				: 0,
			metabolicHypernatriuria: data.dxysOptions?.includes('metabolicHypernatriuria') ? 1 : 0,
			metabolicAlkalineUrine: data.dxysOptions?.includes('metabolicAlkalineUrine') ? 1 : 0,
			metabolicHypercalciuria: data.dxysOptions?.includes('metabolicHypercalciuria') ? 1 : 0,
			metabolicHypomagnesuria: data.dxysOptions?.includes('metabolicHypomagnesuria') ? 1 : 0,
			metabolicHyperuricosuria: data.dxysOptions?.includes('metabolicHyperuricosuria')
				? 1
				: 0,
			metabolicHypocitraturia: data.dxysOptions?.includes('metabolicHypocitraturia') ? 1 : 0,
			metabolicCystinuria: data.dxysOptions?.includes('metabolicCystinuria') ? 1 : 0,
			metabolicUnknown: data.dxysOptions?.includes('metabolicUnknown') ? 1 : 0,

			// 局部因素
			localSpongeKidney: data.jbysOptions?.includes('localSpongeKidney') ? 1 : 0,
			localHorseshoeKidney: data.jbysOptions?.includes('localHorseshoeKidney') ? 1 : 0,
			localRenalCyst: data.jbysOptions?.includes('localRenalCyst') ? 1 : 0,
			localDuplexKidney: data.jbysOptions?.includes('localDuplexKidney') ? 1 : 0,
			localBPH: data.jbysOptions?.includes('localBPH') ? 1 : 0,
			localUPJStricture: data.jbysOptions?.includes('localUPJStricture') ? 1 : 0,
			localPolycysticKidney: data.jbysOptions?.includes('localPolycysticKidney') ? 1 : 0,
			localUrethralStricture: data.jbysOptions?.includes('localUrethralStricture') ? 1 : 0,
			localUrethralForeignBody: data.jbysOptions?.includes('localUrethralForeignBody')
				? 1
				: 0,
			localUreteralStricture: data.jbysOptions?.includes('localUreteralStricture') ? 1 : 0,
			localEctopicKidney: data.jbysOptions?.includes('localEctopicKidney') ? 1 : 0,
			localBladderDiverticulum: data.jbysOptions?.includes('localBladderDiverticulum')
				? 1
				: 0,
			localNeurogenicBladder: data.jbysOptions?.includes('localNeurogenicBladder') ? 1 : 0,
			localCalycealDiverticulum: data.jbysOptions?.includes('localCalycealDiverticulum')
				? 1
				: 0,
			localUreterocele: data.jbysOptions?.includes('localUreterocele') ? 1 : 0,
			localOther: data.jbysOptions?.includes('localOther') ? 1 : 0
		};

		service.swl.curative.add(saveData);

		ElMessage.success('保存成功');

		return true;
	} catch (error: any) {
		console.error('保存失败:', error);
		ElMessage.error('保存失败: ' + (error.message || '未知错误'));
		return false;
	}
};

onMounted(() => {
	initCurative();
});

// 清空数据
const clearData = async () => {
	curativeId.value = 0;
	// 清空评定记录，保留患者基本信息
	await querySwlTreatment();
	openForm({
		id: curativeId.value,
		swlNo: swlNo,
		serialNumber: serialNumber,
		name: patientSwlInfo.name,
		gender: patientSwlInfo.gender,
		age: patientSwlInfo.age,
		treatmentTime: patientSwlInfo.treatmentTime,
		component1: patientSwlInfo.component1,
		component1Percent: patientSwlInfo.component1Percent,
		component2: patientSwlInfo.component2,
		component2Percent: patientSwlInfo.component2Percent,
		component3: patientSwlInfo.component3,
		component3Percent: patientSwlInfo.component3Percent,
		component4: patientSwlInfo.component4,
		component4Percent: patientSwlInfo.component4Percent,
		followupDate: dayjs().format('YYYY-MM-DD'),
		// 术后天数为治疗日期到随访日期的天数
		postopDays: dayjs().diff(dayjs(patientSwlInfo.treatmentTime), 'day')
	});
};
</script>

<style lang="scss" scoped>
.curative-info {
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
</style>
