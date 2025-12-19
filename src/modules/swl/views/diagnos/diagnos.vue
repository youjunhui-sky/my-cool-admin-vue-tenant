<template>
	<div class="diagnos-wrapper">
		<div hidden>{{ diagnosisId }}</div>
		<div>
			<p hidden>swlNo: {{ swlNo }}</p>
			<p hidden>serialNumber: {{ serialNumber }}</p>
		</div>
		<div class="scroll-container">
			<el-form-item label="" label-width="0px" style="display: flex; align-items: center">
				<el-input
					type="textarea"
					:rows="5"
					v-model="formData.diagnosisCode"
					placeholder="请输入临床诊断结果"
					style="flex: 1; margin-right: 50px"
				/>
				<el-button type="primary" size="large" @click.stop="generateDiagnosis">
					诊断建议
				</el-button>
			</el-form-item>

			<el-form-item label="选择治疗方案" label-width="120px" style="margin-top: 20px">
				<el-checkbox-group v-model="formData.treatmentPlan">
					<el-checkbox
						v-for="option in treatmentPlanOptions"
						:key="option.label"
						:value="option.value || option.label"
						:label="option.label"
					>
						{{ option.label }}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>

			<el-form-item
				label=""
				label-width="0px"
				style="
					margin-top: 50px;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
				"
			>
				<el-button
					style="margin-left: 800px"
					type="primary"
					size="large"
					@click.stop="saveDiagnosis"
					>保存</el-button
				>
			</el-form-item>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { ElMessage, ElRow, ElCol } from 'element-plus';

const Form = useForm();
const cool = useCool();
const { dict } = useDict();
const { service } = useCool();

// 定义 props
const props = defineProps({
	swlNo: {
		type: String,
		required: true
	},
	serialNumber: {
		type: String,
		required: true
	}
});

const diagnosisId = ref(0);

const formData = ref({
	diagnosisCode: '',
	treatmentPlan: [], // 修改为数组，用于复选框绑定
	diagnosisId: 0
});

const treatmentPlanOptions = dict.get('treatmentPlan');
//console.log('Treatment Plan Options:', treatmentPlanOptions);

const generateDiagnosis = async () => {
	const params = {
		swlNo: props.swlNo,
		serialNumber: props.serialNumber
	};
	const res = await cool.service.swl.diagnosis.toLczd(params);
	//console.log('res:', res);
	let zd = '';
	if (res && res.length > 0) {
		for (let i = 0; i < res.length; i++) {
			zd += i + 1 + '.' + res[i].lczd + '\n';
		}
	}
	formData.value.diagnosisCode = zd;
};

onMounted(() => {
	initDiagnos();
});

const saveDiagnosis = async () => {
	try {
		// 准备要保存的数据对象
		const saveData = {
			id: formData.value.diagnosisId,
			diagnosisCode: formData.value.diagnosisCode,
			treatmentPlan: formData.value.treatmentPlan.join(','), // 将数组转为字符串保存
			swlNo: props.swlNo,
			serialNumber: props.serialNumber
		};
		// 调用后台保存方法
		//console.log('saveData.id :', saveData.id);
		//console.log('diagnosisId.value:', diagnosisId.value);
		if (
			(saveData.id != undefined && Number(saveData.id) > 0) ||
			(diagnosisId.value != undefined && Number(diagnosisId.value) > 0)
		) {
			const params = { ...saveData };
			if (saveData.id != undefined) {
				params.id = Number(saveData.id);
			}
			//console.log('diagnosisId.value:', diagnosisId.value);
			if (diagnosisId.value != undefined && Number(diagnosisId.value) > 0) {
				params.id = Number(diagnosisId.value);
			}
			//输出params
			//console.log('update-params:', params);
			const res = await cool.service.swl.diagnosis.update(params);
		} else {
			const params = { ...saveData };
			//输出params
			//console.log('save-params:', params);
			const res = await cool.service.swl.diagnosis.add(params);
			//保存后，获取id
			//输出res
			//console.log('res:', res);
			saveData.id = res.id;
			//给examId赋值
			diagnosisId.value = res.id;
		}

		ElMessage.success('保存成功');
	} catch (error: any) {
		console.error('保存失败:', error);
		ElMessage.error('保存失败: ' + (error.message || '未知错误'));
	}
};

const initDiagnos = async () => {
	try {
		// 获取后台数据
		const params = { swlNo: props.swlNo, serialNumber: props.serialNumber };
		//const params = { id: 1 };
		const data = await cool.service.swl.diagnosis.findDiagnosisBySwlno(params);
		//console.log('data:' + data);
		// 将后台数据填充到localData中
		if (data) {
			diagnosisId.value = data.id;
			formData.value.diagnosisCode = data.diagnosisCode;

			// 处理治疗方案数据，将字符串转为数组
			if (data.treatmentPlan) {
				formData.value.treatmentPlan = data.treatmentPlan.split(',');
			} else {
				formData.value.treatmentPlan = [];
			}
		}
	} catch (error) {
		console.error('Failed to load lab info:', error);
	}
};
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
	font-weight: bold;
}

/* 新增滚动容器样式 */
.scroll-container {
	width: 100%;
	max-height: 80vh; /* 根据视口高度自动计算 */
	overflow-y: auto; /* 开启垂直滚动 */
	padding: 15px;

	/* 滚动条美化 */
	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		background: #c0c4cc;
		border-radius: 3px;
	}
}
.scroll-container .el-form-item {
	margin: 0;
	padding: 0;
	width: 100%;
}
</style>
