<template>
	<div class="near-wrapper">
		<div hidden>{{ nearId }}</div>
		<p hidden>id: {{ id }}</p>
		<p hidden>swlNo: {{ swlNo }}</p>
		<p hidden>serialNumber: {{ serialNumber }}</p>
		<p hidden>sequenceNo: {{ sequenceNo }}</p>
		<p hidden>episode: {{ episode }}</p>
		<div class="scroll-container">
			<div class="near-info">
				<!-- 标题 -->
				<div class="tech-header">
					<div class="tech-title-container">
						<div class="tech-title">
							智能泌尿系结石诊疗管理系统<span class="blink">_</span>
						</div>
						<div class="model-info">
							<span title="模型">Model.{{ '近期随访' }}</span>
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
							<!-- 次数插槽 -->
							<template #slot-followupCount="{ scope }">
								<el-select
									v-model="scope.followupCount"
									placeholder="请选择次数"
									:options="followupCountOptions"
									@click="handleFollowupCountClick"
									@change="handleFollowupCountChange"
									style="height: 28px"
								>
									<el-option
										v-for="item in followupCountOptions"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
									</el-option>
								</el-select>
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
import { ref, onMounted, watch, reactive, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';

const Form = useForm();
const cool = useCool();
const { dict } = useDict();
const { service } = useCool();
const route = useRoute();

// 获取路由参数
const id = route.query.id;
const swlNo = route.query.swlNo;
const serialNumber = route.query.serialNumber;
const sequenceNo = route.query.sequenceNo;
const episode = route.query.episode;

// 定义近期随访ID引用
const nearId = ref(0);
// 期数选项
const episodeOptions = ref([{ label: '1', value: 1 }]);
// 次数选项
const followupCountOptions = ref([{ label: '1', value: 1 }]);
// 创建变量存储当前选择的期号
const qsValue = ref(1);
// 创建变量存储当前选择的次数
const csValue = ref(1);
// 创建变量存储当前表单正在编辑的期号，用于切换取消时回退
const currentEditingEpisode = ref(1);
// 创建变量存储当前表单正在编辑的次数，用于切换取消时回退
const currentEditingFollowupCount = ref(1);
// 表单是否已修改但未保存
const formChanged = ref(false);

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

// 格式化其他症状数据
const formatQtzz = (data: any) => {
	const reactions: string[] = [];
	if (data && typeof data === 'object') {
		if (Number(data.fever) === 1) reactions.push('fever');
		if (Number(data.nausea) === 1) reactions.push('nausea');
		if (Number(data.vomiting) === 1) reactions.push('vomiting');
		if (Number(data.skinEcchymosis) === 1) reactions.push('skinEcchymosis');
	}
	return reactions;
};

// 格式化并发症数据
const formatBfz = (data: any) => {
	const reactions: string[] = [];
	if (data && typeof data === 'object') {
		if (Number(data.subcapsularHematoma) === 1) reactions.push('subcapsularHematoma');
		if (Number(data.renalHemorrhage) === 1) reactions.push('renalHemorrhage');
		if (Number(data.infection) === 1) reactions.push('infection');
		if (Number(data.renalColic) === 1) reactions.push('renalColic');
		if (Number(data.renalFailure) === 1) reactions.push('renalFailure');
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

// 添加治疗信息对象
const treatmentInfo = reactive({
	treatmentTime: '', // 治疗时间
	episode: '', // 治疗期数
	qsOptions: [] as { label: number; value: number }[] // 期数选项
});

// 查询病人基本信息
const querySwl = async () => {
	try {
		const params = { id: id };
		const data = await service.swl.info.info(params);

		if (data) {
			// 不再使用setForm，而是直接返回数据，后续在合并时使用
			////console.log('查询到患者基本信息:', data);
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

// 查询病人治疗信息
const queryTreatment = async () => {
	try {
		const params = { swlNo: swlNo, serialNumber: serialNumber };
		const data = await service.swl.treatment.findBySwlNo(params);

		if (data) {
			// 不再使用setForm，而是直接返回数据，后续在合并时使用
			//console.log('查询到患者治疗信息:', data);
			// 将查询到的数据赋值给患者信息对象
			Object.assign(treatmentInfo, data);
			return data;
		}
		return null;
	} catch (error) {
		console.error('获取患者治疗信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(treatmentInfo, {
			treatmentTime: ' ',
			episode: ' ',
			qsOptions: []
		});
	}
};

// 定义表单数据对象
const formData = ref({
	nearId: 0,
	name: '', //姓名
	gender: '', //性别
	age: '', //年龄
	treatmentTime: '', //治疗时间
	swlNo: swlNo, //碎石号
	serialNumber: serialNumber, //流水号
	sequenceNo: sequenceNo, //序列号
	episode: episode, //治疗期数
	qsOptions: [] as { label: number; value: number }[], //期数选项
	csOptions: [] as { label: number; value: number }[], //次数选项
	followupCount: null as number | null, //随访次数
	followupDate: null as string | null, //随访日期
	postopDays: null as number | null, //术后天数
	grossHematuria: null as string | null, //末期肉眼血尿
	qtzzOptions: [] as string[], //其他症状
	bfzOptions: [] as string[], //并发症
	flankPainLevel: null as number | null, //患侧疼痛程度
	steinstrasseType: null as string | null, //石街类型
	steinstrasseLength: null as number | null, //石街长度
	stonePassDays: null as number | null, //排石时间
	stoneOutputLevel: null as number | null, //排石量
	medicalTherapy: null as string | null, //内科辅助治疗
	preSWLTherapy: null as string | null, //SWL前治疗性辅助治疗
	postSWLTherapy: null as string | null, //SWL后治疗性辅助治疗
	postSWLSupport: null as string | null, //SWL后补助性辅助治疗
	component1: null as string | null, //结石成分一
	component1Percent: null as number | null, //成分一百分比
	component2: null as string | null, //结石成分二
	component2Percent: null as number | null, //成分二百分比
	component3: null as string | null, //结石成分三
	component3Percent: null as number | null, //成分三百分比
	component4: null as string | null, //结石成分四
	component4Percent: null as number | null, //成分四百分比
	antibioticsUsed: null as string | null, //术后抗生素的使用
	antibioticsNote: null as string | null, //术后抗生素的使用备注
	analysisMethod: null as string | null, //成分分析方法
	effectiveness: null as string | null, //疗效
	usFinding: null as string | null, //B超
	kubFinding: null as string | null, //KUB
	otherFinding: null as string | null, //其他
	physician: null as string | null //医生
});

// 切换次数时的查询
const queryFollowup = async (params: any) => {
	try {
		const data = await service.swl.near.findQsBySwlNo(params);

		if (data) {
			// 不再使用setForm，而是直接返回数据，后续在合并时使用
			//console.log('查询到患者基本信息:', data);
			// 将查询到的数据赋值给患者信息对象
			Object.assign(formData, data);
			return data;
		}
		return null;
	} catch (error) {
		console.error('获取患者信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(formData, {
			id: ' ',
			swlNo: ' ',
			name: ' ',
			gender: ' ',
			age: ' ',
			sequenceNo: ' ',
			episode: ' ',
			treatmentTime: ' '
		});
	}
};

// 切换期数时的查询
const queryEpisode = async (params: any) => {
	try {
		const data = await service.swl.near.findCsBySwlNo(params);

		if (data) {
			// 不再使用setForm，而是直接返回数据，后续在合并时使用
			//console.log('查询到患者基本信息:', data);
			// 将查询到的数据赋值给患者信息对象
			Object.assign(formData, data);
			return data;
		}
		return null;
	} catch (error) {
		console.error('获取患者信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(formData, {
			id: ' ',
			swlNo: ' ',
			name: ' ',
			gender: ' ',
			age: ' ',
			sequenceNo: ' ',
			episode: ' ',
			treatmentTime: ' '
		});
	}
};

// 期数选择变更处理
const handleEpisodeChange = async (selectedValue?: number | Event): Promise<void> => {
	//console.log('期数选择变更处理11111111111111111111');
	// 如果提供了值，则使用提供的值，否则使用当前选择的值
	let value: number;

	if (selectedValue === undefined) {
		value = qsValue.value;
	} else if (typeof selectedValue === 'number') {
		value = selectedValue;
	} else {
		// 处理事件对象情况
		value = qsValue.value;
	}

	// 保存目标期数值
	const targetEpisode = value;
	//console.log('目标切换的期数:', targetEpisode);

	try {
		// 查询该期数的记录
		const params = {
			swlNo: swlNo,
			serialNumber: serialNumber,
			episode: targetEpisode
		};

		//console.log('查询期数记录，参数:', params);

		// 查询该期数数据
		const data = await queryEpisode(params);

		if (data) {
			//console.log('查询到期数记录:', data);
		}
	} catch (error) {
		console.error('切换期数失败:', error);
		ElMessage.error('切换期数失败');
	}
};

// 处理次数下拉框点击事件
const handleFollowupCountClick = async () => {
	//console.log('点击次数下拉框11111111111111111111');
	// 检查表单是否有未保存的更改，如果有则自动保存
	if (formChanged.value) {
		try {
			//console.log('表单有变更，点击次数下拉框时自动保存');
			// 自动保存，不弹出确认框
			await handleSubmit();
		} catch (error) {
			console.error('自动保存失败:', error);
			ElMessage.error('自动保存失败');
		}
	}
};

// 次数选择变更处理
const handleFollowupCountChange = async (selectedValue?: number | Event): Promise<void> => {
	// 如果提供了值，则使用提供的值，否则使用当前选择的值
	let value: number;

	if (selectedValue === undefined) {
		value = csValue.value;
	} else if (typeof selectedValue === 'number') {
		value = selectedValue;
	} else {
		// 如果是事件对象，使用当前选择的值
		value = csValue.value;
		//console.log('使用当前选择的值:', value);
	}

	// 保存目标次数值 - 这是用户想要切换到的次数
	const targetFollowupCount = value;
	//console.log('目标切换的次数:', targetFollowupCount);

	try {
		// 查询该次数的记录
		const params = {
			swlNo: swlNo,
			serialNumber: serialNumber,
			episode: episode,
			followupCount: targetFollowupCount
		};

		//console.log('查询次数记录，参数:', params);

		// 查询该次数数据
		const data = await queryFollowup(params);

		if (data) {
			//console.log('查询到次数记录:', data);

			// 查询患者治疗信息
			const patientInfo = await querySwl();
			let patientData = {};

			if (patientInfo) {
				patientData = {
					name: patientInfo.name,
					gender: patientInfo.gender,
					age: patientInfo.age
				};
				//console.log('查询到患者信息:', patientData);
			}

			// 合并数据并打开表单
			openForm({
				...patientData,
				...data,
				qsOptions: episodeOptions.value,
				csOptions: followupCountOptions.value
			});

			// 更新治疗记录ID
			if (data.id) {
				nearId.value = data.id;
				//console.log('更新治疗记录ID:', nearId.value);
			}

			// 重置表单变更状态
			formChanged.value = false;

			// 更新当前编辑的次数值
			currentEditingFollowupCount.value = targetFollowupCount;
		} else {
			console.warn('未查询到次数记录');
			// 加载空表单但保留次数信息
			const patientInfo = await querySwl();
			openForm({
				...(patientInfo || {}),
				swlNo: swlNo,
				serialNumber: serialNumber,
				episode: episode,
				followupCount: targetFollowupCount,
				qsOptions: episodeOptions.value,
				csOptions: followupCountOptions.value
			});

			// 更新当前编辑的次数值
			currentEditingFollowupCount.value = targetFollowupCount;

			// 重置治疗ID
			nearId.value = 0;
		}
	} catch (error) {
		console.error('切换次数失败:', error);
		ElMessage.error('切换次数失败');
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
			qsOptions: formData.qsOptions
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

		ElMessage.success('数据已清空');
	} catch (error) {
		if (error !== 'cancel') {
			console.error('清空失败:', error);
		}
	}
};

// 处理次数变更
// const handleFollowupCountChange = () => {
// 	// 可以在此处根据followupCount做一些操作
// 	//console.log('随访次数变更');
// };

// 处理表单提交
const handleSubmit = async () => {
	if (!Form.value) {
		ElMessage.error('表单未初始化');
		return false;
	}
	try {
		// 获取表单数据
		const formData = Form.value.form || {};

		if (
			!formData.swlNo ||
			!formData.serialNumber ||
			!formData.sequenceNo ||
			!formData.episode
		) {
			ElMessage.error('请验证必要信息是否正确，如碎石号、流水号、序列号、期数');
			return false;
		}

		// 检查是否存在相同的记录
		const params = {
			swlNo: formData.swlNo,
			serialNumber: formData.serialNumber,
			episode: formData.episode,
			followupCount: formData.followupCount
		};

		const existingRecord = await queryFollowup(params);

		// 整理其他症状和并发症
		const qtzzOptions = formData.qtzzOptions || [];
		const bfzOptions = formData.bfzOptions || [];

		const qtzzData = {
			fever: qtzzOptions.includes('fever') ? 1 : 0,
			nausea: qtzzOptions.includes('nausea') ? 1 : 0,
			vomiting: qtzzOptions.includes('vomiting') ? 1 : 0,
			skinEcchymosis: qtzzOptions.includes('skinEcchymosis') ? 1 : 0
		};

		const bfzData = {
			subcapsularHematoma: bfzOptions.includes('subcapsularHematoma') ? 1 : 0,
			renalHemorrhage: bfzOptions.includes('renalHemorrhage') ? 1 : 0,
			infection: bfzOptions.includes('infection') ? 1 : 0,
			renalColic: bfzOptions.includes('renalColic') ? 1 : 0,
			renalFailure: bfzOptions.includes('renalFailure') ? 1 : 0
		};
		// 准备要保存的数据对象
		// const saveData = {
		// 			id: nearId.value, //id
		// 			swlNo: swlNo, //碎石号
		// 			serialNumber: serialNumber, //流水号
		// 			sequenceNo: sequenceNo, //序列号
		// 			episode: data.episode, //期数
		// 			followupCount: data.followupCount, //随访次数
		// 			followupDate: data.followupDate, //随访日期
		// 			postopDays: data.postopDays, //术后天数
		// 			grossHematuria: data.grossHematuria, //末期肉眼血尿
		// 			qtzzOptions: data.qtzzOptions, //其他症状
		// 			bfzOptions: data.bfzOptions, //并发症
		// 			flankPainLevel: data.flankPainLevel, //腰腹痛程度
		// 			steinstrasseType: data.steinstrasseType, //石街类型
		// 			steinstrasseLength: data.steinstrasseLength, //石街长度
		// 			stonePassDays: data.stonePassDays, //排石时间
		// 			stoneOutputLevel: data.stoneOutputLevel, //排出量评估
		// 			medicalTherapy: data.medicalTherapy, //内科辅助治疗
		// 			preSWLTherapy: data.preSWLTherapy, //SWL前治疗性辅助治疗
		// 			postSWLTherapy: data.postSWLTherapy, //SWL后治疗性辅助治疗
		// 			postSWLSupport: data.postSWLSupport, //SWL后补助性辅助治疗
		// 			component1: data.component1, //结石成分一
		// 			component1Percent: data.component1Percent, //成分一百分比
		// 			component2: data.component2, //结石成分二
		// 			component2Percent: data.component2Percent, //成分二百分比
		// 			component3: data.component3, //结石成分三
		// 			component3Percent: data.component3Percent, //成分三百分比
		// 			component4: data.component4, //结石成分四
		// 			antibioticsUsed: data.antibioticsUsed, //术后抗生素的使用
		// 			antibioticsNote: data.antibioticsNote, //术后抗生素的使用备注
		// 			analysisMethod: data.analysisMethod, //成分分析方法
		// 			effectiveness: data.effectiveness, //疗效
		// 			usFinding: data.usFinding, //B超检查
		// 			kubFinding: data.kubFinding, //KUB检查
		// 			otherFinding: data.otherFinding, //其他检查
		// 			physician: data.physician //医生
		// 		};

		// 准备保存的数据
		const saveData = {
			...formData,
			...qtzzData,
			...bfzData
		};

		// 删除多选数据，避免后端保存错误
		delete saveData.qtzzOptions;
		delete saveData.bfzOptions;

		let res;
		if (existingRecord?.id) {
			// 更新现有记录
			//console.log('更新记录:', existingRecord.id);
			res = await service.swl.near.update(saveData);
			ElMessage.success('更新记录成功');
		} else {
			// 添加新记录
			//console.log('添加新记录');
			res = await service.swl.near.add(saveData);
			ElMessage.success('添加记录成功');

			// 更新nearId以便继续编辑
			if (res?.id) {
				nearId.value = res.id;
			}
		}

		// 重置表单变更状态
		formChanged.value = false;

		// 更新表单数据以便继续编辑
		if (res) {
			// 更新现有数据
			const params = {
				swlNo: formData.swlNo,
				serialNumber: formData.serialNumber,
				episode: formData.episode
			};
			await queryEpisode(params);
		}

		Loading.close();
		return true;
	} catch (error: any) {
		Loading.close();
		console.error('保存失败:', error);
		ElMessage.error('保存失败: ' + (error.message || '未知错误'));
		return false;
	}
};

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

// 删除功能
const handleDelete = async () => {
	if (!Form.value) {
		ElMessage.error('表单未初始化');
		return;
	}

	// 获取当前表单数据
	const formData = Form.value.form || {};
	const currentFollowupCount = formData.followupCount;

	// 判断是否已保存状态（有ID）
	const hasSaved = formData.id || nearId.value > 0;

	if (!hasSaved) {
		ElMessage.warning('请先保存当前次数记录');
		return;
	}

	try {
		// 获取所有次数
		const allFollowupCount = await service.swl.near.findBySwlNo({
			swlNo: formData.swlNo,
			serialNumber: formData.serialNumber
		});

		if (!allFollowupCount?.csOptions || !Array.isArray(allFollowupCount.csOptions)) {
			ElMessage.error('获取次数数据失败');
			return;
		}

		// 计算最大次数
		const followupCounts = allFollowupCount.csOptions.map(item => Number(item));
		const maxFollowupCount = Math.max(...followupCounts);

		// 判断是否为最大次数
		if (Number(currentFollowupCount) !== maxFollowupCount) {
			ElMessage.warning('只能删除最新次数记录');
			return;
		}

		// 确认删除
		await ElMessageBox.confirm('确定要删除当前次数记录吗？', '删除确认', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		});

		Loading.open('删除中...');

		// 执行删除
		await service.swl.near.delete({ ids: [formData.id || nearId.value] });
		ElMessage.success('删除成功');

		// 获取删除后的最新数据
		const updatedFollowupCount = await service.swl.near.findBySwlNo({
			swlNo: formData.swlNo,
			serialNumber: formData.serialNumber
		});

		if (
			updatedFollowupCount?.csOptions &&
			Array.isArray(updatedFollowupCount.csOptions) &&
			updatedFollowupCount.csOptions.length > 0
		) {
			// 更新期号选项
			followupCountOptions.value = updatedFollowupCount.csOptions.map(item => ({
				label: String(item),
				value: item
			}));

			// 获取更新后的最大次数
			const newFollowupCounts = updatedFollowupCount.csOptions.map(item => Number(item));
			const newMaxFollowupCount = Math.max(...newFollowupCounts);

			// 加载最大次数的数据
			const latestRecord = await service.swl.near.findBySwlNo({
				swlNo: formData.swlNo,
				serialNumber: formData.serialNumber,
				followupCount: newMaxFollowupCount
			});

			// 查询患者基础信息
			const patientInfo = await querySwl();

			// 打开表单
			if (latestRecord) {
				openForm({
					...(patientInfo || {}),
					...latestRecord,
					qsOptions: episodeOptions.value,
					csOptions: followupCountOptions.value
				});
			} else {
				// 如果没有记录，初始化新表单
				openForm({
					...(patientInfo || {}),
					swlNo: formData.swlNo,
					serialNumber: formData.serialNumber,
					episode: formData.episode,
					followupCount: newMaxFollowupCount,
					qsOptions: episodeOptions.value,
					csOptions: followupCountOptions.value
				});
			}
		} else {
			// 如果删除后没有记录，则初始化一个新表单
			const patientInfo = await querySwl();
			followupCountOptions.value = [{ label: '1', value: 1 }];

			openForm({
				...(patientInfo || {}),
				swlNo: formData.swlNo,
				serialNumber: formData.serialNumber,
				episode: formData.episode,
				followupCount: 1,
				qsOptions: episodeOptions.value,
				csOptions: followupCountOptions.value
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

// 初始化表单数据
const initNear = async () => {
	try {
		const params = { swlNo: swlNo, serialNumber: serialNumber };
		const data = await service.swl.near.findBySwlNo(params);
		if (data && data.swlNo) {
			nearId.value = data.id || 0;
			//console.log('初始化表单数据', data);
			episodeOptions.value = data.qsOptions.map((item: any) => ({
				label: String(item),
				value: item
			}));
			followupCountOptions.value = data.csOptions.map((item: any) => ({
				label: String(item),
				value: item
			}));
			// 打开表单并填充数据
			openForm(data);
		} else {
			// 如果没有记录,就获取SWL治疗记录，获取到期数
			if (treatmentInfo && treatmentInfo.episode) {
				//console.log('没有near记录，有SWL治疗记录', treatmentInfo);
				//如果有记录，将qsOptions数组赋值给episodeOptions
				episodeOptions.value = treatmentInfo.qsOptions.map((item: any) => ({
					label: String(item),
					value: item
				}));
				// 初始化新记录
				openForm({
					swlNo: swlNo,
					serialNumber: serialNumber,
					sequenceNo: sequenceNo,
					episode: treatmentInfo.episode,
					episodeOptions: episodeOptions.value,
					followupCount: 1,
					treatmentTime: treatmentInfo.treatmentTime
				});
			} else {
				// 如果没有SWL治疗记录，则弹框提示用户
				ElMessage.warning('患者没有有效的治疗记录');
			}
		}
	} catch (error) {
		console.error('Failed to load near follow-up info:', error);
	}
};

// 新增次数
const newNear = async () => {
	const formData = Form.value.form || {};

	try {
		Loading.open('新增次数中...');
		// 查询所有次数
		const result = await queryEpisode({
			swlNo: formData.swlNo,
			serialNumber: formData.serialNumber,
			episode: formData.episode
		});

		if (!result?.csOptions || !Array.isArray(result.csOptions)) {
			followupCountOptions.value = [{ label: '1', value: 1 }];
		} else {
			// 更新次数选项列表
			followupCountOptions.value = result.csOptions.map(item => ({
				label: String(item),
				value: Number(item)
			}));
		}

		let maxValue = 0;
		//遍历followupCountOptions，取出最大值
		followupCountOptions.value.forEach((item: any) => {
			if (item.value > maxValue) {
				maxValue = item.value;
			}
		});

		const newFollowupCount = maxValue + 1;

		//保存要保留的字段
		const { name, gender, age, sequenceNo, episode, treatmentTime, visitDate } = formData;
		// 清空表单ID
		nearId.value = 0;
		// 添加新次数到选项
		followupCountOptions.value = [
			...followupCountOptions.value,
			{
				label: String(newFollowupCount),
				value: newFollowupCount
			}
		];
		//打开表单
		openForm({
			name,
			gender,
			age,
			swlNo,
			serialNumber,
			sequenceNo,
			episode,
			treatmentTime,
			visitDate,
			followupCount: newFollowupCount,
			followupCountOptions: followupCountOptions.value,
			episodeOptions: episodeOptions.value
		});

		//确保表单的followupCount字段正确设置并自动保存新记录
		nextTick(async () => {
			if (Form.value) {
				Form.value.setForm('followupCount', newFollowupCount);
			}

			//自动保存新次数记录
			try {
				//console.log('自动保存新次数记录');
				await handleSubmit();
			} catch (err) {
				console.error('自动保存新次数记录失败:', err);
				ElMessage.warning('新次数创建成功，但自动保存失败，请手动保存');
			}
		});

		Loading.close();
		ElMessage.success(`已创建第${newFollowupCount}次随访记录`);
	} catch (error) {
		Loading.close();
		console.error('创建新次数失败:', error);
		ElMessage.error('创建新次数失败: ' + (error as any)?.message || '未知错误');
	}
};

// 打开表单并填充数据
const openForm = (data: any) => {
	if (data.id) {
		nearId.value = data.id;
	}

	Form.value?.open({
		title: '近期随访记录',
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
				label: '治疗时间',
				prop: 'treatmentTime',
				span: 4,
				component: {
					name: 'el-date-picker',
					props: {
						disabled: true,
						readonly: true,
						valueFormat: 'YYYY-MM-DD',
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
				label: '随访日期',
				prop: 'followupDate',
				span: 4,
				value: dayjs().format('YYYY-MM-DD'),
				component: {
					name: 'el-date-picker',
					props: {
						type: 'date',
						valueFormat: 'YYYY-MM-DD',
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
				label: '术后天数',
				prop: 'postopDays',
				span: 4,
				component: {
					name: 'el-input',
					props: {
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
							return '天';
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
					name: 'cl-select',
					props: {
						placeholder: '请选择期数',
						options: episodeOptions.value,
						onChange: handleEpisodeChange
					}
				}
			},
			{
				label: '次数',
				prop: 'followupCount',
				span: 4,
				component: {
					name: 'slot-followupCount'
				}
			},
			{
				label: '末期肉眼血尿',
				prop: 'grossHematuria',
				span: 4,
				value: '无',
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
				span: 12,
				component: {
					name: 'el-checkbox-group',
					options: bfzOptions
				}
			},
			{
				label: '腰腹痛',
				prop: 'flankPainLevel',
				span: 4,
				value: '无',
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
				label: '排石时间',
				prop: 'stonePassDays',
				span: 4,
				component: {
					name: 'el-input',
					props: {
						placeholder: '请输入排石时间',
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
				label: '排石量',
				prop: 'stoneOutputLevel',
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择排石量',
						options: dict.get('near_eductionsum'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
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
						defaultExpandAll: true
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
						defaultExpandAll: true
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
						defaultExpandAll: true
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
						defaultExpandAll: true
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
							marginBottom: '0px'
						}
					}
				}
			},
			{
				label: '成分分析方法',
				prop: 'analysisMethod',
				span: 4,
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
				span: 4,
				component: {
					name: 'cl-select',
					props: {
						placeholder: '请选择疗效',
						options: dict.get('near_result'),
						labelKey: 'name',
						valueKey: 'name',
						checkStrictly: true,
						defaultExpandAll: true
					}
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
					label: '新增次数',
					onClick: newNear
				}
			]
		},
		on: {
			submit: handleSubmit
		}
	});
};

onMounted(() => {
	querySwl(); // 查询患者登记信息
	queryTreatment(); // 查询患者治疗信息
	initNear(); // 初始化页面
});

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
.near-info {
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
