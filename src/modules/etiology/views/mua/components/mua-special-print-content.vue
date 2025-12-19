<template>
	<!-- 隐藏的打印内容区域 -->
	<div
		ref="printContentRef"
		class="hidden-print-content"
		style="position: absolute; left: -9999px; top: -9999px"
	>
		<!-- 第一页：前言 -->
		<div class="a4-page">
			<div class="page-indicator">第 1 页</div>
			<!-- 页眉 -->
			<div class="page-header">
				<div class="header-left">
					<img src="/hospital1.png" alt="医院logo" class="header-logo" />
				</div>
				<div class="header-right">
					<div class="header-text">
						<div class="header-text-line1">中国尿石联盟华南基地</div>
						<div class="header-text-line2">泌尿系结石病因诊断及防治中心</div>
					</div>
					<div class="header-icon-container">
						<img src="/hospital2.png" alt="医疗图标" class="header-icon" />
					</div>
				</div>
			</div>
			<div class="pdf-print-wrapper">
				<div class="prescription-content">
					<!-- 标题 -->
					<div class="prescription-header">
						<h1>泌尿系结石</h1>
						<h1>代谢（病因）评估报告</h1>
					</div>

					<!-- 前言 -->
					<div class="preface">
						<p>
							<strong>前言：</strong
							>代谢评估技术是通过病史、影像检查、血液尿液分析、结石成分分析等，综合评估泌尿结石患者的代谢异常，诊断泌尿系结石病因的技术。
						</p>
						<p>
							研究表明：泌尿系结石是一种终生性疾病，5年复发率高达50%，10年高达50%，严重影响患者的身体健康。
						</p>
						<p>
							代谢评估可明确约95%患者的结石病因，针对病因进行个体化的防治（饮食疗法和药物疗法等），可使结石复发率降低至10%~15%。代谢评估每年应进行1-2次，调整预防方案并评估预防的有效性。
						</p>
					</div>
				</div>
			</div>
			<!-- 页脚 -->
			<div class="page-footer">
				<div class="footer-content">
					<span
						>地址：深圳市深南中路3025号中山大学附属第八医院2号楼3楼
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 电话：0755-83980763</span
					>
				</div>
			</div>
		</div>

		<!-- 第二页：基本信息 -->
		<div class="a4-page">
			<div class="page-indicator">第 2 页</div>
			<!-- 页眉 -->
			<div class="page-header">
				<div class="header-left">
					<img src="/hospital1.png" alt="医院logo" class="header-logo" />
				</div>
				<div class="header-right">
					<div class="header-text">
						<div class="header-text-line1">中国尿石联盟华南基地</div>
						<div class="header-text-line2">泌尿系结石病因诊断及防治中心</div>
					</div>
					<div class="header-icon-container">
						<img src="/hospital2.png" alt="医疗图标" class="header-icon" />
					</div>
				</div>
			</div>
			<div class="pdf-print-wrapper">
				<div class="prescription-content">
					<!-- 患者基本信息 -->
					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">评估号：</span>
								<span class="value">{{ info.swlNo || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">评估级别：</span>
								<span class="value">特殊评估</span>
							</div>
							<div class="info-item">
								<span class="label">评估日期：</span>
								<span class="value">{{
									formatDate(info.assessmentDate) || ''
								}}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">姓名：</span>
								<span class="value">{{ info.name || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">性别：</span>
								<span class="value">{{ formatGender(info.gender) || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">评估次数：</span>
								<span class="value">{{ info.assessmentCount || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">年龄：</span>
								<span class="value">{{ info.age || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">出生日期：</span>
								<span class="value">{{ formatDate(info.birthDate) || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">电话：</span>
								<span class="value">{{ info.mobile || '' }}</span>
							</div>
						</div>
					</div>

					<hr class="content-divider" />

					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">身高：</span>
								<span class="value">{{ info.height || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">体重：</span>
								<span class="value">{{ info.weight || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">BMI：</span>
								<span class="value">{{ info.bmi || '' }}</span>
							</div>
						</div>
					</div>

					<hr class="content-divider" />

					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">结石病史：</span>
								<span class="value">{{ info.stoneHistory || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">其他病史：</span>
								<span class="value">{{ info.otherHistory || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">家族史：</span>
								<span class="value">{{ info.familyHistory || '' }}</span>
							</div>
						</div>
					</div>
					<hr class="content-divider" />
					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">检查方法：</span>
								<span class="value">{{ formatCheckMethod(info) || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">KUB：</span>
								<span class="value">{{ info.kub || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">CT值：</span>
								<span class="value">{{ info.ctValue || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">影像诊断：</span>
								<span class="value">{{ info.imageDiagnosis || '' }}</span>
							</div>
						</div>
					</div>

					<hr class="content-divider" />
					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">双能源预判结石成分：</span>
								<span class="value">{{ info.stoneComp || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">其他：</span>
								<span class="value">{{ info.otherStoneComp || '' }}</span>
							</div>
						</div>
					</div>
					<hr class="content-divider" />
					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">分析日期：</span>
								<span class="value">{{ formatDate(info.analysisDate) || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">分析方法：</span>
								<span class="value">{{ info.analysisMethod || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">结石位置：</span>
								<span class="value">{{ info.stoneLocation || '' }}</span>
							</div>
						</div>
					</div>
					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">结石成分：</span>
								<span class="value">{{ formatComp(info) || '' }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 页脚 -->
			<div class="page-footer">
				<div class="footer-content">
					<span
						>地址：深圳市深南中路3025号中山大学附属第八医院2号楼3楼
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 电话：0755-83980763</span
					>
				</div>
			</div>
		</div>

		<!-- 第三页：血液生化图表、尿常规 -->
		<div class="a4-page">
			<div class="page-indicator">第 3 页</div>
			<!-- 页眉 -->
			<div class="page-header">
				<div class="header-left">
					<img src="/hospital1.png" alt="医院logo" class="header-logo" />
				</div>
				<div class="header-right">
					<div class="header-text">
						<div class="header-text-line1">中国尿石联盟华南基地</div>
						<div class="header-text-line2">泌尿系结石病因诊断及防治中心</div>
					</div>
					<div class="header-icon-container">
						<img src="/hospital2.png" alt="医疗图标" class="header-icon" />
					</div>
				</div>
			</div>
			<div class="pdf-print-wrapper">
				<div class="prescription-content page-three-content">
					<!-- 特殊评估表格 -->
					<div class="special-assessment-section">
						<table class="special-assessment-table">
							<thead>
								<tr>
									<th colspan="11" class="table-title">特殊评估</th>
								</tr>
								<tr>
									<th>类别</th>
									<th>项目</th>
									<th>结果</th>
									<th>参考范围</th>
									<th>检测时间</th>
									<th>类别</th>
									<th colspan="2">项目</th>
									<th>结果</th>
									<th>参考范围</th>
									<th>检测时间</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(item, index) in specialAssessmentData.items"
									:key="index"
								>
									<td v-if="index === 0" class="category-cell" rowspan="6">
										血气分析
									</td>
									<td v-if="index === 0" rowspan="2">
										{{ item.leftItem.name }}
									</td>
									<td v-else-if="index > 1">{{ item.leftItem.name }}</td>
									<td v-if="index === 0" rowspan="2">
										{{ item.leftItem.resultValue }}
									</td>
									<td v-else-if="index > 1">
										{{ item.leftItem.resultValue }}
									</td>
									<td v-if="index === 0" rowspan="2">
										{{ item.leftItem.referenceRange }}
									</td>
									<td v-else-if="index > 1">
										{{ item.leftItem.referenceRange }}
									</td>
									<td v-if="index === 0" rowspan="6">
										{{ item.leftItem.testTime }}
									</td>
									<td
										v-if="index === 0"
										class="category-cell text-red"
										rowspan="6"
									>
										特殊试验
									</td>
									<td v-if="index === 0" rowspan="2">
										{{ item.rightItem.name }}
									</td>
									<td v-if="index === 0" rowspan="1">
										{{ item.rightItem.subName }}
									</td>
									<td v-if="index === 1" rowspan="1">
										{{ item.rightItem.subName }}
									</td>
									<td v-else-if="index > 1" colspan="2">
										{{ item.rightItem.name }}
									</td>
									<td>{{ item.rightItem.resultValue }}</td>
									<td>{{ item.rightItem.referenceRange }}</td>
									<td>{{ item.rightItem.testTime }}</td>
								</tr>
								<tr>
									<td class="category-cell" colspan="2">基因检测</td>
									<td colspan="8">
										{{ specialAssessmentData.geneTest.resultValue }}
									</td>
									<td>{{ specialAssessmentData.geneTest.testTime }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<!-- 页脚 -->
			<div class="page-footer">
				<div class="footer-content">
					<span
						>地址：深圳市深南中路3025号中山大学附属第八医院2号楼3楼
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 电话：0755-83980763</span
					>
				</div>
			</div>
		</div>

		<!-- 第四页：评估结果 -->
		<div class="a4-page">
			<div class="page-indicator">第 4 页</div>
			<!-- 页眉 -->
			<div class="page-header">
				<div class="header-left">
					<img src="/hospital1.png" alt="医院logo" class="header-logo" />
				</div>
				<div class="header-right">
					<div class="header-text">
						<div class="header-text-line1">中国尿石联盟华南基地</div>
						<div class="header-text-line2">泌尿系结石病因诊断及防治中心</div>
					</div>
					<div class="header-icon-container">
						<img src="/hospital2.png" alt="医疗图标" class="header-icon" />
					</div>
				</div>
			</div>
			<div class="pdf-print-wrapper">
				<div class="prescription-content">
					<!-- 评估结果和防治建议表格 -->
					<div class="assessment-result-section">
						<table class="assessment-result-table">
							<!-- 隐藏的列定义，确保8列布局 -->
							<colgroup>
								<col style="width: 12.5%" />
								<col style="width: 12.5%" />
								<col style="width: 12.5%" />
								<col style="width: 12.5%" />
								<col style="width: 12.5%" />
								<col style="width: 12.5%" />
								<col style="width: 12.5%" />
								<col style="width: 12.5%" />
							</colgroup>
							<tbody>
								<tr>
									<td class="result-label">评估结果</td>
									<td class="result-content" colspan="7">
										{{ info.assessmentResult || '' }}
									</td>
								</tr>
								<tr>
									<td class="suggestion-label">防治建议</td>
									<td class="suggestion-content" colspan="7">
										<!-- HTML渲染区域 -->
										<div
											v-if="
												info.guideSuggestion &&
												info.guideSuggestion.trim().startsWith('<')
											"
											v-html="info.guideSuggestion"
											class="html-rendered-content"
										></div>
										<!-- 纯文本显示区域 -->
										<span v-else>{{ info.guideSuggestion || '' }}</span>
									</td>
								</tr>
								<tr>
									<td class="signature-row">填表人</td>
									<td class="signature-row">
										<span class="signature-value">{{
											info.operator || ''
										}}</span>
									</td>
									<td class="signature-row">日期</td>
									<td class="signature-row">
										<span class="signature-value">{{
											formatDate(info.assessmentDate)
										}}</span>
									</td>
									<td class="signature-row">报告医师</td>
									<td class="signature-row">
										<span class="signature-value">{{ info.doctor || '' }}</span>
									</td>
									<td class="signature-row">日期</td>
									<td class="signature-row">
										<span class="signature-value">{{
											formatDate(info.assessmentDate)
										}}</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<!-- 页脚 -->
			<div class="page-footer">
				<div class="footer-content">
					<span
						>地址：深圳市深南中路3025号中山大学附属第八医院2号楼3楼
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 电话：0755-83980763</span
					>
				</div>
			</div>
		</div>

		<!-- 第五页：中心介绍 -->
		<div class="a4-page">
			<div class="page-indicator">第 5 页</div>
			<!-- 页眉 -->
			<div class="page-header">
				<div class="header-left">
					<img src="/hospital1.png" alt="医院logo" class="header-logo" />
				</div>
				<div class="header-right">
					<div class="header-text">
						<div class="header-text-line1">中国尿石联盟华南基地</div>
						<div class="header-text-line2">泌尿系结石病因诊断及防治中心</div>
					</div>
					<div class="header-icon-container">
						<img src="/hospital2.png" alt="医疗图标" class="header-icon" />
					</div>
				</div>
			</div>
			<div class="pdf-print-wrapper">
				<div class="prescription-content">
					<!-- 标题 -->
					<div class="center-title">
						<h1>中国尿石联盟华南基地泌尿系结石病因诊断及防治中心</h1>
					</div>

					<!-- 中心介绍 -->
					<div class="center-introduction">
						<p>
							本中心于2019年成立，设在中山大学附属第八医院，由
							碎石中心两名医师负责泌尿系结石病因门诊的诊疗工作。
							可通过中山大学附属第八医院公众号以及160平台预约。
						</p>
					</div>

					<!-- 医师介绍 -->
					<div class="doctors-section">
						<div class="doctor-info">
							<div class="doctor-photo">
								<img src="/doctor1.png" alt="张东方主任医师" />
							</div>
							<div class="doctor-name">张东方主任医师</div>
						</div>
						<div class="doctor-info">
							<div class="doctor-photo">
								<img src="/doctor2.png" alt="孙璇博士" />
							</div>
							<div class="doctor-name">孙璇博士</div>
						</div>
					</div>

					<!-- 二维码 -->
					<div class="qrcode-section">
						<div class="doctor-info">
							<div class="doctor-photo">
								<img
									src="/qrcode1.png"
									alt="关注深圳冲击波碎石研究所，可联系我们"
								/>
							</div>
							<div class="doctor-name">关注深圳冲击波碎石研究所，可联系我们</div>
						</div>
						<div class="doctor-info">
							<div class="doctor-photo">
								<img
									src="/qrcode2.png"
									alt="关注中山大学附属第八医院，可预约就诊"
								/>
							</div>
							<div class="doctor-name">关注中山大学附属第八医院，可预约就诊</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 页脚 -->
			<div class="page-footer">
				<div class="footer-content">
					<span
						>地址：深圳市深南中路3025号中山大学附属第八医院2号楼3楼
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 电话：0755-83980763</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated, nextTick, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Printer, Download, Document } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { useCool } from '/@/cool';
import MuaLabForm from './mua-lab-form.vue'; // 导入实验室检查结果组件

import { markdownToHTML } from '/@/modules/helper/utils/markdown-converter-github';

const { service } = useCool();
const route = useRoute();

/**
 * 打印内容组件
 * @description 用于生成PDF打印的隐藏内容区域
 */
defineOptions({
	name: 'print-content'
});

// 定义 props
const props = defineProps({
	swlNo: {
		type: String,
		default: ''
	},
	patientNo: {
		type: String,
		default: ''
	},
	serialNumber: {
		type: String,
		default: ''
	},
	assessmentCount: {
		type: String,
		default: ''
	}
});

// 组件挂载状态标志
const isMounted = ref(false);
// 取消标志，用于防止组件卸载后的异步操作
let isCancelled = false;

// 在组件挂载时加载数据
onMounted(() => {
	isMounted.value = true;
	isCancelled = false;
	// 使用 nextTick 确保组件完全挂载后再加载数据
	nextTick(async () => {
		if (isMounted.value && !isCancelled) {
			await loadinfo();
			if (isMounted.value && !isCancelled) {
				await loadLabResults(); // loadLabResults现在会自动调用数据提取函数
			}
		}
	});
});

// 组件卸载时清理
onUnmounted(() => {
	isMounted.value = false;
	isCancelled = true;
});

// keep-alive 失活时标记取消
onDeactivated(() => {
	isMounted.value = false;
	isCancelled = true;
});

// 当关键入参变化时刷新，避免使用旧数据
watch(
	() => [props.swlNo, props.serialNumber, props.assessmentCount],
	async () => {
		if (!isMounted.value) return;
		isCancelled = false;
		await loadinfo();
		if (isMounted.value && !isCancelled) {
			await loadLabResults();
		}
	}
);

// 实验室检查结果
const labResults = ref<any[]>([]);

// 特殊评估数据
const specialAssessmentData = ref({
	testDate: '', // 检测时间
	items: [
		{
			leftItem: {
				category: '血气分析',
				name: 'PH',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			},
			rightItem: {
				category: '特殊试验',
				name: '1克钙负荷试验',
				subName: 'Uca(空腹)',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			}
		},
		{
			leftItem: {
				category: '',
				name: '',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			},
			rightItem: {
				category: '',
				name: '',
				subName: 'Uca(负荷)',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			}
		},
		{
			leftItem: {
				category: '',
				name: 'PO2',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			},
			rightItem: {
				category: '',
				name: '嘌呤类利尿负荷试验',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			}
		},
		{
			leftItem: {
				category: '',
				name: 'PCO2',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			},
			rightItem: {
				category: '',
				name: '皮质醇抑制试验',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			}
		},
		{
			leftItem: {
				category: '',
				name: 'HCO3',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			},
			rightItem: {
				category: '',
				name: '氯化铵试验',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			}
		},
		{
			leftItem: {
				category: '',
				name: 'BE',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			},
			rightItem: {
				category: '',
				name: '速尿+氯氨可的松试验',
				resultValue: '',
				referenceRange: '',
				testTime: ''
			}
		}
	],
	geneTest: {
		name: '基因检测',
		resultValue: '',
		testTime: ''
	}
});

// 患者信息
const info = ref({
	patientNo: '',
	name: '',
	gender: '',
	age: '',
	birthDate: '',
	mobile: '',
	swlNo: '',
	assessmentCount: '',
	assessmentType: '',
	assessmentTimes: '',
	height: '',
	weight: '',
	bmi: '',
	anatomicalAbnormal: '',
	stoneHistory: '',
	otherHistory: '',
	familyHistory: '',
	hasUltrasound: '',
	hasCt: '',
	hasMri: '',
	hasKub: '',
	hasIVU: '',
	hasCTU: '',
	ctValue: '',
	kub: '',
	imageDiagnosis: '',
	operator: '',
	doctor: '',
	assessmentDate: '',
	guideSuggestion: '',
	assessmentResult: '',
	component1: '',
	component1Percent: '',
	component2: '',
	component2Percent: '',
	component3: '',
	component3Percent: '',
	component4: '',
	component4Percent: '',
	analysisMethod: '',
	stoneLocation: '',
	stoneComp: '',
	otherStoneComp: '',
	analysisDate: ''
});

// 加载实验室检查结果
const loadLabResults = async () => {
	try {
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: 'mua',
			type: 'list', //分组
			assessmentCount: props.assessmentCount
		};
		const data = await service.swl.lab.list(params);

		// 处理数据，仅保留异常结果或重要指标
		if (data && data.length > 0) {
			// 直接使用data数组，因为它已经是SwlLabResultDetailEntity[]类型
			labResults.value = data;
			//console.log('labResults:', labResults.value);

			// 提取特殊评估数据
			extractSpecialAssessmentData(labResults.value);
		}
	} catch (error) {
		console.error('加载实验室检查结果失败:', error);
	}
};

/**
 * 从实验室检查结果中提取特殊评估数据
 * @param labData 实验室检查结果数组
 */
const extractSpecialAssessmentData = (labData: any[]) => {
	try {
		//console.log('extractSpecialAssessmentData - 输入数据:', labData);

		// 检查数据是否为数组
		if (!Array.isArray(labData)) {
			console.warn('extractSpecialAssessmentData - 输入数据不是数组:', typeof labData);
			return;
		}

		// 处理特殊评估项目
		labData.forEach(item => {
			if (!item || !item.itemCode) return;

			switch (item.itemCode) {
				case 'xqfx_sjd': // 血气分析 - PH
					specialAssessmentData.value.items[0].leftItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[0].leftItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[0].leftItem.testTime = item.testTime || '';
					break;
				case 'xqfx_yfy': // 血气分析 - PO2
					specialAssessmentData.value.items[2].leftItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[2].leftItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[2].leftItem.testTime = item.testTime || '';
					break;
				case 'xqfx_erftfy': // 血气分析 - PCO2
					specialAssessmentData.value.items[3].leftItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[3].leftItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[3].leftItem.testTime = item.testTime || '';
					break;
				case 'xqfx_sjtsqg': // 血气分析 - HCO3-
					specialAssessmentData.value.items[4].leftItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[4].leftItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[4].leftItem.testTime = item.testTime || '';
					break;
				case 'xqfx_qxsyj': // 血气分析 - BE
					specialAssessmentData.value.items[5].leftItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[5].leftItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[5].leftItem.testTime = item.testTime || '';
					break;
				case 'gfh_uca': // 1克钙负荷试验 - Uca(空腹)
					specialAssessmentData.value.items[0].rightItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[0].rightItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[0].rightItem.testTime = item.testTime || '';
					break;
				case 'gfh_uca1': // 1克钙负荷试验 - Uca(负荷)
					specialAssessmentData.value.items[1].rightItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[1].rightItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[1].rightItem.testTime = item.testTime || '';
					break;
				case 'sqllnfhsy': // 噻嗪类利尿负荷试验
					specialAssessmentData.value.items[2].rightItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[2].rightItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[2].rightItem.testTime = item.testTime || '';
					break;
				case 'pzcyzsy': // 皮质醇抑制试验
					specialAssessmentData.value.items[3].rightItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[3].rightItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[3].rightItem.testTime = item.testTime || '';
					break;
				case 'lhafhsy': // 氯化铵试验
					specialAssessmentData.value.items[4].rightItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[4].rightItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[4].rightItem.testTime = item.testTime || '';
					break;
				case 'ns_fqkds': // 速尿+氟氢可的松试验
					specialAssessmentData.value.items[5].rightItem.resultValue =
						item.resultValue || '';
					specialAssessmentData.value.items[5].rightItem.referenceRange =
						item.referenceRange || '';
					specialAssessmentData.value.items[5].rightItem.testTime = item.testTime || '';
					break;
				case 'jyjc': // 基因检测
					specialAssessmentData.value.geneTest.resultValue = item.resultValue || '';
					specialAssessmentData.value.geneTest.testTime = item.testTime || '';
					break;
				default:
					// 如果有其他项目，可以在这里添加
					break;
			}
		});

		//console.log('extractSpecialAssessmentData - 处理完成');
	} catch (error) {
		console.error('提取特殊评估数据失败:', error);
	}
};

// 格式化日期
const formatDate = (dateString: string) => {
	if (!dateString) return '';
	return dayjs(dateString).format('YYYY-MM-DD');
};

const formatGender = (gender: string) => {
	if (!gender) return '';
	return Number(gender) == 1 ? '男' : '女';
};

//结石成分
const formatComp = (info: any) => {
	if (!info) return '';
	if (Number(info.component1Percent) > 0) {
		let resultValue =
			Number(info.component1Percent) > 0
				? info.component1 + info.component1Percent + '%;'
				: '';
		resultValue +=
			Number(info.component2Percent) > 0
				? info.component2 + info.component2Percent + '%;'
				: '';
		resultValue +=
			Number(info.component3Percent) > 0
				? info.component3 + info.component3Percent + '%;'
				: '';
		resultValue +=
			Number(info.component4Percent) > 0
				? info.component4 + info.component4Percent + '%;'
				: '';
		return resultValue;
	}
	return '';
};

const formatCheckMethod = (info: any) => {
	if (!info) return '';
	let resultValue = '';
	if (Number(info.hasUltrasound) == 1) {
		resultValue += '超声' + ',';
	}
	if (Number(info.hasKub) == 1) {
		resultValue += 'KUB' + ',';
	}
	if (Number(info.hasCt) == 1) {
		resultValue += 'CT' + ',';
	}
	if (Number(info.hasMri) == 1) {
		resultValue += 'MRI' + ',';
	}
	if (Number(info.hasCTU) == 1) {
		resultValue += 'CTU' + ',';
	}
	if (Number(info.hasIVU) == 1) {
		resultValue += 'IVU' + ',';
	}

	if (resultValue.endsWith(',')) {
		resultValue = resultValue.slice(0, -1);
	}
	return resultValue;
};

// 格式化评估类型
const formatAssessmentType = (type: string) => {
	if (!type) return '';

	const typeMap: Record<string, string> = {
		mua1: '简化评估',
		mua2: '全面评估',
		mua3: '特殊评估'
	};

	return typeMap[type] || type;
};

// 加载患者信息
const loadinfo = async () => {
	// 检查组件是否已卸载或已取消
	if (!isMounted.value || isCancelled) return;

	//console.log('loadinfo', props.patientNo);
	try {
		if (props.patientNo) {
			const params = {
				swlNo: props.swlNo,
				serialNumber: props.serialNumber,
				assessmentType: 'mua3',
				assessmentCount: props.assessmentCount
			};
			// 使用正确的service路径获取患者信息
			const data = await service.etiology.info.findBySwlNo(params);

			// 再次检查组件是否已卸载或已取消
			if (!isMounted.value || isCancelled) return;

			if (data) {
				info.value.patientNo = data.patientNo || '';
				info.value.name = data.name || '';
				info.value.gender = data.gender || '';
				info.value.age = data.age || '';
				info.value.birthDate = data.birthDate || '';
				info.value.mobile = data.mobile || '';
				info.value.swlNo = data.swlNo || '';
				info.value.assessmentCount = data.assessmentCount || '';
				info.value.assessmentType = data.assessmentType || '';
				info.value.assessmentTimes = data.assessmentTimes || '';
				info.value.height = data.height || '';
				info.value.weight = data.weight || '';
				info.value.bmi = data.bmi || '';
				info.value.anatomicalAbnormal = data.anatomicalAbnormal || '';
				info.value.stoneHistory = data.stoneHistory || '';
				info.value.otherHistory = data.otherHistory || '';
				info.value.familyHistory = data.familyHistory || '';
				info.value.hasUltrasound = data.hasUltrasound || '';
				info.value.hasCt = data.hasCt || '';
				info.value.hasMri = data.hasMri || '';
				info.value.hasKub = data.hasKub || '';
				info.value.hasIVU = data.hasIVU || '';
				info.value.hasCTU = data.hasCTU || '';
				info.value.ctValue = data.ctValue || '';
				info.value.kub = data.kub || '';
				info.value.imageDiagnosis = data.imageDiagnosis || '';
				info.value.operator = data.operator || '';
				info.value.doctor = data.doctor || '';
				info.value.assessmentDate = data.assessmentDate || '';
				if (data.aiGuideSuggestion != null && data.aiGuideSuggestion != '') {
					info.value.guideSuggestion = await markdownToHTML(data.aiGuideSuggestion);
				} else {
					info.value.guideSuggestion = data.aiGuideSuggestion || '';
				}
				info.value.assessmentResult = data.assessmentResult || '';
				info.value.component1 = data.component1 || '';
				info.value.component1Percent = data.component1Percent || '';
				info.value.component2 = data.component2 || '';
				info.value.component2Percent = data.component2Percent || '';
				info.value.component3 = data.component3 || '';
				info.value.component3Percent = data.component3Percent || '';
				info.value.component4 = data.component4 || '';
				info.value.component4Percent = data.component4Percent || '';
				info.value.analysisMethod = data.analysisMethod || '';
				info.value.stoneLocation = data.stoneLocation || '';
				info.value.stoneComp = data.stoneComp || '';
				info.value.otherStoneComp = data.otherStoneComp || '';
				info.value.analysisDate = data.analysisDate || '';
			}
		}
	} catch (error) {
		// 检查组件是否已卸载或已取消
		if (!isMounted.value || isCancelled) return;
		console.error('加载患者信息失败:', error);
	}
};

// 暴露 printContentRef 给父组件使用
const printContentRef = ref<HTMLElement>();

// 暴露给父组件
defineExpose({
	printContentRef
});
</script>

<style lang="scss" scoped>
// HTML内容渲染样式已在本组件内定义

// 隐藏打印内容样式
.hidden-print-content {
	// A4页面
	.a4-page {
		width: 210mm;
		height: 297mm;
		background-color: white;
		border: 1px solid #ddd;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		// 页码指示器
		.page-indicator {
			position: absolute;
			right: 5mm;
			bottom: 5mm;
			padding: 3px 8px;
			background-color: rgba(0, 0, 0, 0.05);
			border-radius: 4px;
			font-size: 12px;
			color: #909399;
			z-index: 10;
		}

		// 页眉样式
		.page-header {
			width: 100%;
			height: 15mm;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 15mm;
			border-bottom: 1px solid #e4e7ed;
			background-color: #fafafa;
			flex-shrink: 0;

			.header-left {
				display: flex;
				align-items: center;

				.header-logo {
					height: 16mm;
					width: auto;
					max-width: 50mm;
					object-fit: contain;
				}
			}

			.header-right {
				display: flex;
				align-items: center;
				gap: 8px;

				.header-text {
					font-weight: bold;
					color: #303133;
					text-align: center;
					line-height: 1.2;

					.header-text-line1 {
						font-size: 16px;
						margin-bottom: 2px;
					}

					.header-text-line2 {
						font-size: 14px;
					}
				}

				.header-icon-container {
					display: flex;
					align-items: center;
				}

				.header-icon {
					height: 14mm;
					width: auto;
					max-width: 35mm;
					object-fit: contain;
				}
			}
		}

		// 页脚样式
		.page-footer {
			width: 100%;
			height: 12mm;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0;
			border-top: 1px solid #e4e7ed;
			background-color: #fafafa;
			flex-shrink: 0;
			margin-top: auto;

			.footer-content {
				width: 100%;
				text-align: center;
				font-size: 12px;
				color: #666666;
				line-height: 1.4;
				display: flex;
				justify-content: center;
				align-items: center;

				span {
					display: inline-block;
					text-align: center;
					white-space: nowrap;
				}
			}
		}

		// 调整PDF打印区域，为页眉页脚留出空间
		.pdf-print-wrapper {
			flex: 1;
			overflow: hidden;
			padding: 5mm 0;
		}

		// 第三页特殊样式，控制内容高度避免页脚被推到下一页
		.page-three-content {
			max-height: calc(297mm - 15mm - 12mm - 15mm); // A4高度 - 页眉 - 页脚 - 更多内边距
			overflow: hidden;

			.content-divider {
				margin: 8px 0 10px 0; // 进一步减少分隔线间距
			}

			.urine-routine-section {
				margin-bottom: 5px; // 进一步减少底部间距

				.urine-routine-table {
					margin-bottom: 0px; // 移除表格底部间距
					font-size: 12px; // 减小字体

					thead th {
						padding: 4px 2px; // 减少表头内边距
						height: 25px;
						line-height: 1.1;
					}

					tbody td {
						padding: 3px 2px; // 进一步减少单元格内边距
						height: 24px; // 进一步减少行高
						min-height: 24px;
						line-height: 1.1;
						font-size: 11px;
					}
				}
			}
		}
	}

	// PDF打印区域
	.pdf-print-wrapper {
		background-color: white;
		padding: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		overflow: hidden;

		// 改进表格样式，确保PDF中的表格内容完整显示
		:deep(.el-table) {
			// 设置表格行高，防止内容被截断
			.el-table__row {
				height: auto;
				line-height: normal;

				td {
					padding: 8px 4px !important; // 增加padding确保内容不紧贴边缘
					vertical-align: middle !important;
					text-align: center !important; // 添加水平居中
					height: auto !important;
					line-height: 1.2 !important;
					max-height: none !important;
					white-space: normal !important;
				}
			}

			// 表头样式优化
			.el-table__header-wrapper {
				th {
					padding: 8px 4px !important; // 增加padding确保表头内容不紧贴边缘
					height: auto !important;
					line-height: 1.2 !important;
					vertical-align: middle !important;
					text-align: center !important; // 添加水平居中
				}
			}

			// 防止表格缩进导致的内容截断
			.cell {
				white-space: normal !important;
				word-break: break-word !important;
				line-height: 1.2 !important;
				padding-top: 5px !important;
				padding-bottom: 5px !important;
				text-align: center !important; // 添加水平居中
				display: flex !important;
				justify-content: center !important; // 水平居中
				align-items: center !important; // 垂直居中
			}

			// 修复单元格溢出问题
			.el-table__body-wrapper {
				overflow: visible !important;

				.el-table__body {
					width: 100% !important;
				}
			}
		}
	}

	.prescription-content {
		padding: 10mm 10mm;

		// 标题区域
		.prescription-header {
			text-align: center;
			margin-bottom: 20px;

			h1 {
				font-size: 24px;
				font-weight: bold;
				margin-bottom: 8px;
			}

			.hospital-info {
				font-size: 16px;
			}
		}

		// 前言
		.preface {
			margin-top: 280px; // 增加前言前的空白，相当于10行
			margin-bottom: 20px;
			padding: 15px;
			background-color: #f9f9f9;
			border-left: 4px solid #409eff;
			border-radius: 4px;

			p {
				margin: 0 0 15px 0;
				line-height: 1.6;
				text-align: justify;
				text-indent: 0;
				font-size: 18px; // 从14px增加到18px，加大两个号
				color: #303133;

				&:last-child {
					margin-bottom: 0;
				}

				strong {
					color: #409eff;
					font-weight: bold;
				}
			}
		}

		// 患者信息
		.patient-info {
			// margin-bottom: 30px;
			// border-bottom: 1px solid #ccc;
			// padding-bottom: 15px;

			.info-row {
				display: flex;
				margin-bottom: 10px;
			}

			.info-item {
				flex: 1;
				display: flex;

				.label {
					font-weight: bold;
					min-width: 60px;
				}

				.value {
					flex: 1;
				}
			}

			.date-item {
				min-width: 200px;
			}
		}

		.content-divider {
			border: 0;
			height: 1px;
			background-color: #ddd;
			margin: 15px 0 20px 0;
		}

		// 特殊评估表格
		.special-assessment-section {
			margin-bottom: 20px;

			.special-assessment-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #000;
				font-size: 16px;

				thead {
					th {
						border: 1px solid #000;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						background-color: #f5f7fa;
						font-weight: bold;

						&.table-title {
							font-weight: bold;
							font-size: 18px;
							background-color: #e8f4f8;
						}
					}
				}

				tbody {
					td {
						border: 1px solid #000;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						height: 35px;
						min-height: 35px;

						&.category-cell {
							font-weight: bold;
							color: #d04648;
							background-color: #fafafa;
						}

						&.text-red {
							color: #d04648;
							font-weight: bold;
						}
					}
				}

				// 确保表格在打印时样式正确
				@media print {
					border: 2px solid #000 !important;

					th,
					td {
						border: 1px solid #000 !important;
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}
				}
			}
		}

		// 尿常规及沉渣项目表格
		.urine-routine-section {
			margin-bottom: 20px;

			.urine-routine-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #000;
				font-size: 18px;
				margin-bottom: 10px;

				thead {
					th {
						border: 1px solid #000;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						background-color: #f5f7fa;
						font-weight: bold;

						&.table-title {
							font-weight: bold;
							font-size: 20px;
							background-color: #e8f4f8;
						}
					}
				}

				tbody {
					td {
						border: 1px solid #000;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						height: 35px;
						min-height: 35px;

						&.item-name {
							font-weight: 500;
							background-color: #fafafa;
							text-align: left;
							padding-left: 8px;
						}
					}
				}

				// 确保表格在打印时样式正确
				@media print {
					border: 2px solid #000 !important;

					th,
					td {
						border: 1px solid #000 !important;
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}
				}
			}

			.urine-culture-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #000;
				font-size: 14px;

				tbody {
					td {
						border: 1px solid #000;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						height: 35px;
						min-height: 35px;

						&.culture-label,
						&.stone-label {
							font-weight: 500;
							background-color: #fafafa;
							width: 30%;
						}

						&.culture-result,
						&.stone-result {
							width: 40%;
						}

						&.test-time-label,
						&.test-time-value {
							width: 30%;
						}
					}
				}

				// 确保表格在打印时样式正确
				@media print {
					border: 2px solid #000 !important;

					td {
						border: 1px solid #000 !important;
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}
				}
			}
		}

		// 实验室检查结果区域
		.lab-results-section {
			margin-bottom: 20px;

			.lab-results-simple {
				width: 100%;

				.lab-result-item {
					margin-bottom: 15px;
				}

				.lab-group-title {
					background-color: #f0f2f5;
					padding: 8px 12px;
					margin-bottom: 5px;
					font-weight: bold;
					font-size: 14px;
					color: #303133;
					border-left: 3px solid #409eff;
				}

				.print-lab-form {
					// 自定义在打印模式下的MuaLabForm样式
					border: 1px solid #e4e7ed;
					border-radius: 4px;
					padding: 10px;
					background-color: #fafafa;
					box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

					// 覆盖MuaLabForm中的部分样式以适应打印
					:deep(.cl-crud) {
						padding: 0 !important;
					}

					:deep(.el-table) {
						--el-table-header-bg-color: #f5f7fa;

						.el-table__header-wrapper {
							th {
								background-color: #f5f7fa;
								font-weight: bold;
								color: #303133;
								padding: 5px 8px !important;
								height: auto !important;
								line-height: 1.2 !important;
								vertical-align: middle !important;
								text-align: center !important; // 添加水平居中
							}
						}

						.el-table__row {
							td {
								padding: 8px !important; // 统一padding确保文字居中
								vertical-align: middle !important;
								height: auto !important;
								line-height: 1.2 !important;
								text-align: center !important; // 添加水平居中
							}
						}

						// 修复单元格内容对齐
						.cell {
							white-space: normal !important;
							word-break: break-word !important;
							line-height: 1.2 !important;
							padding: 0 !important; // 移除padding避免文字下移
							text-align: center !important; // 添加水平居中
							display: flex !important;
							justify-content: center !important; // 水平居中
							align-items: center !important; // 垂直居中
							height: 100% !important; // 确保高度填满单元格
						}

						// 处理异常值显示
						.abnormal-row {
							color: #f56c6c;
							font-weight: 500;
						}

						.result-abnormal {
							color: #f56c6c;
							font-weight: bold;
						}
					}
				}

				.no-results {
					width: 100%;
					text-align: center;
					padding: 20px;
					color: #909399;
					font-style: italic;
					background-color: #f5f7fa;
					border-radius: 4px;
				}
			}
		}

		// 教育内容
		.education-content {
			h2 {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
				text-align: center;
			}

			.section {
				margin-bottom: 20px;

				h3 {
					font-size: 16px;
					font-weight: bold;
					margin-bottom: 10px;
				}

				p {
					margin-bottom: 10px;
					text-indent: 2em;
					line-height: 1.6;
				}

				ul {
					padding-left: 2em;

					li {
						margin-bottom: 8px;
						line-height: 1.6;
					}
				}
			}
		}

		// 签名区域
		.signature-area {
			display: flex;
			justify-content: space-between;
			margin-top: 40px;

			.signature-item {
				display: flex;
				min-width: 200px;

				.label {
					font-weight: bold;
				}
			}
		}

		// 页脚
		.footer {
			margin-top: 40px;
			text-align: center;
			font-size: 12px;
			color: #666;
		}

		// 第三页样式
		.center-title {
			text-align: center;
			margin-bottom: 40px;
			padding-top: 20px;

			h1 {
				font-size: 22px;
				font-weight: bold;
				color: #303133;
				line-height: 1.4;
				margin: 0;
			}
		}

		.center-introduction {
			text-align: left;
			margin-bottom: 60px;
			padding: 0 20px;

			p {
				font-size: 16px;
				line-height: 1.8;
				color: #303133;
				margin: 0;
				text-indent: 2em; /* 添加首行缩进，2em约等于两个字符的宽度 */
			}
		}

		.doctors-section {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 80px;
			padding: 0 40px;
			gap: 60px;

			.doctor-info {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;

				.doctor-photo {
					margin-bottom: 20px;

					img {
						width: 40mm;
						height: auto;
						max-height: 60mm;
						object-fit: cover;
						border-radius: 8px;
						box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
					}
				}

				.doctor-name {
					font-size: 18px;
					font-weight: bold;
					color: #303133;
					margin-top: 10px;
				}
			}
		}

		// 二维码区域样式
		.qrcode-section {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 60px;
			padding: 0 40px;
			gap: 60px;

			.doctor-info {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;

				.doctor-photo {
					margin-bottom: 15px;

					img {
						width: 35mm;
						height: auto;
						max-height: 35mm;
						object-fit: contain;
						border-radius: 8px;
						box-shadow: none;
					}
				}

				.doctor-name {
					font-size: 14px;
					font-weight: 500;
					color: #303133;
					text-align: center;
					line-height: 1.4;
					max-width: 120px;
					word-wrap: break-word;
				}
			}
		}
	}

	// 原始内容区域（隐藏）
	.original-content {
		display: none;
	}

	// PDF预览容器
	.pdf-preview-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 600px;
		max-height: 80vh; // 限制最大高度
		overflow-y: auto; // 添加垂直滚动
		background-color: #f5f5f5;

		iframe {
			background-color: white;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			width: 100%; // 确保iframe宽度适应容器
			height: 80vh; // 设置高度为视窗高度的80%
		}

		.pdf-loading {
			font-size: 18px;
			color: #909399;
		}

		// 自定义滚动条样式，与主容器保持一致
		&::-webkit-scrollbar {
			width: 8px;
		}

		&::-webkit-scrollbar-track {
			background: #f1f1f1;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-thumb {
			background: #888;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #555;
		}
	}

	.dialog-footer {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	// 页面分隔标记样式
	.page-break-marker {
		height: 1px;
		margin: 0;
		padding: 0;
		page-break-after: always;
		visibility: hidden;
	}
}

// 媒体查询，确保在小屏设备上仍然可以看到内容
@media (max-width: 768px) {
	.a4-page {
		width: 100% !important;
		height: auto !important;
		min-height: 297mm;
	}
}

// 评估结果和防治建议表格
.assessment-result-section {
	margin-bottom: 20px;

	.assessment-result-table {
		width: 100%;
		border-collapse: collapse;
		border: 2px solid #d0d0d0;
		font-size: 16px;
		table-layout: fixed;

		// 列定义
		colgroup col {
			width: 12.5%;
		}

		tbody {
			td {
				border: 1px solid #d0d0d0;
				padding: 10px 8px;
				vertical-align: middle;
				min-height: 40px;

				&.result-label {
					font-weight: bold;
					background-color: #f5f7fa;
					width: 12.5%;
					text-align: center;
				}

				&.result-content {
					text-align: center;
					padding-left: 12px;
					width: 87.5%;
				}

				&.suggestion-label {
					font-weight: bold;
					background-color: #f5f7fa;
					width: 12.5%;
					text-align: center;
				}

				&.suggestion-content {
					text-align: left;
					padding-left: 12px;
					width: 87.5%;
					min-height: 60px;
					max-height: 200px; // 限制最大高度
					overflow: hidden; // 超出部分隐藏
					//white-space: pre-wrap; // 确保能正确显示换行符

					// 确保HTML渲染内容也左对齐
					// .html-rendered-content {
					// 	text-align: left;
					// 	width: 100%;
					// 	max-height: 180px; // 为HTML内容设置最大高度
					// 	overflow: hidden;

					// 	* {
					// 		text-align: left !important;
					// 	}
					// }
				}

				&.signature-row {
					width: 12.5%;
					text-align: center;
					background-color: #fafafa;
					padding: 8px 4px;

					.signature-value {
						font-size: 14px;
						color: #303133;
						min-height: 20px;
						padding-bottom: 2px;
						min-width: 80px;
						text-align: center;
						display: inline-block;
					}
				}
			}
		}

		// 确保表格在打印时样式正确
		@media print {
			border: 2px solid #d0d0d0 !important;
			table-layout: fixed !important;

			colgroup col {
				width: 12.5% !important;
			}

			td {
				border: 1px solid #d0d0d0 !important;
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
			}
		}
	}
}

// 实验室检查结果区域
.lab-results-section {
	margin-bottom: 20px;

	.lab-results-simple {
		width: 100%;

		.lab-result-item {
			margin-bottom: 15px;
		}

		.lab-group-title {
			background-color: #f0f2f5;
			padding: 8px 12px;
			margin-bottom: 5px;
			font-weight: bold;
			font-size: 14px;
			color: #303133;
			border-left: 3px solid #409eff;
		}

		.print-lab-form {
			// 自定义在打印模式下的MuaLabForm样式
			border: 1px solid #e4e7ed;
			border-radius: 4px;
			padding: 10px;
			background-color: #fafafa;
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

			// 覆盖MuaLabForm中的部分样式以适应打印
			:deep(.cl-crud) {
				padding: 0 !important;
			}

			:deep(.el-table) {
				--el-table-header-bg-color: #f5f7fa;

				.el-table__header-wrapper {
					th {
						background-color: #f5f7fa;
						font-weight: bold;
						color: #303133;
						padding: 8px !important; // 统一padding确保表头文字居中
						height: auto !important;
						line-height: 1.2 !important;
						vertical-align: middle !important;
						text-align: center !important; // 添加水平居中
					}
				}

				.el-table__row {
					td {
						padding: 8px !important; // 统一padding确保文字居中
						vertical-align: middle !important;
						height: auto !important;
						line-height: 1.2 !important;
						text-align: center !important; // 添加水平居中
					}
				}

				// 修复单元格内容对齐
				.cell {
					white-space: normal !important;
					word-break: break-word !important;
					line-height: 1.2 !important;
					padding: 0 !important; // 移除padding避免文字下移
					text-align: center !important; // 添加水平居中
					display: flex !important;
					justify-content: center !important; // 水平居中
					align-items: center !important; // 垂直居中
					height: 100% !important; // 确保高度填满单元格
				}

				// 处理异常值显示
				.abnormal-row {
					color: #f56c6c;
					font-weight: 500;
				}

				.result-abnormal {
					color: #f56c6c;
					font-weight: bold;
				}
			}
		}

		.no-results {
			width: 100%;
			text-align: center;
			padding: 20px;
			color: #909399;
			font-style: italic;
			background-color: #f5f7fa;
			border-radius: 4px;
		}
	}
}

// 教育内容
.education-content {
	h2 {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 20px;
		text-align: center;
	}

	.section {
		margin-bottom: 20px;

		h3 {
			font-size: 16px;
			font-weight: bold;
			margin-bottom: 10px;
		}

		p {
			margin-bottom: 10px;
			text-indent: 2em;
			line-height: 1.6;
		}

		ul {
			padding-left: 2em;

			li {
				margin-bottom: 8px;
				line-height: 1.6;
			}
		}
	}
}

// 签名区域
.signature-area {
	display: flex;
	justify-content: space-between;
	margin-top: 40px;

	.signature-item {
		display: flex;
		min-width: 200px;

		.label {
			font-weight: bold;
		}
	}
}

// 页脚
.footer {
	margin-top: 40px;
	text-align: center;
	font-size: 12px;
	color: #666;
}

// HTML内容渲染样式
.html-rendered-content {
	// 确保HTML内容正确渲染
	:deep(h1) {
		font-size: 24px;
		font-weight: bold;
		margin: 16px 0 12px 0;
		color: #303133;
		line-height: 1.4;
		text-align: left;
	}

	:deep(h2) {
		font-size: 20px;
		font-weight: bold;
		margin: 14px 0 10px 0;
		color: #303133;
		line-height: 1.4;
		text-align: left;
	}

	:deep(h3) {
		font-size: 18px;
		font-weight: bold;
		margin: 12px 0 8px 0;
		color: #303133;
		line-height: 1.4;
		text-align: left;
	}

	:deep(h4) {
		font-size: 16px;
		font-weight: bold;
		margin: 10px 0 6px 0;
		color: #303133;
		line-height: 1.4;
		text-align: left;
	}

	:deep(h5) {
		font-size: 14px;
		font-weight: bold;
		margin: 8px 0 4px 0;
		color: #303133;
		line-height: 1.4;
		text-align: left;
	}

	:deep(h6) {
		font-size: 12px;
		font-weight: bold;
		margin: 6px 0 2px 0;
		color: #303133;
		line-height: 1.4;
		text-align: left;
	}

	:deep(p) {
		margin: 8px 0;
		line-height: 1.6;
		color: #303133;
		text-align: left;
	}

	:deep(ul),
	:deep(ol) {
		margin: 8px 0;
		padding-left: 20px;
		line-height: 1.6;
		color: #303133;
	}

	:deep(li) {
		margin: 4px 0;
		line-height: 1.6;
		color: #303133;
	}

	:deep(strong),
	:deep(b) {
		font-weight: bold;
		color: #303133;
	}

	:deep(em),
	:deep(i) {
		font-style: italic;
		color: #303133;
	}

	:deep(code) {
		background-color: #f5f7fa;
		padding: 2px 4px;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
		color: #e6a23c;
	}

	:deep(blockquote) {
		border-left: 4px solid #409eff;
		margin: 12px 0;
		padding: 8px 16px;
		background-color: #f5f7fa;
		color: #606266;
	}

	:deep(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 12px 0;
		border: 1px solid #e4e7ed;

		th,
		td {
			border: 1px solid #e4e7ed;
			padding: 8px 12px;
			text-align: left;
			vertical-align: top;
		}

		th {
			background-color: #f5f7fa;
			font-weight: bold;
			color: #303133;
		}

		td {
			color: #303133;
		}
	}

	:deep(a) {
		color: #409eff;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	:deep(img) {
		max-width: 100%;
		height: auto;
		margin: 8px 0;
	}

	:deep(hr) {
		border: none;
		border-top: 1px solid #e4e7ed;
		margin: 16px 0;
	}

	// 确保在打印时样式正确
	@media print {
		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			color: #000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		p,
		li,
		strong,
		em,
		code,
		blockquote,
		table,
		a {
			color: #000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		table {
			border: 1px solid #000 !important;

			th,
			td {
				border: 1px solid #000 !important;
			}
		}
	}
}
</style>
