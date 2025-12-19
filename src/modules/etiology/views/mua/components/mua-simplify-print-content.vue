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
								<span class="value">简化评估</span>
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
					<!-- 血液生化检查表格 -->
					<div class="blood-chemistry-section">
						<table class="blood-chemistry-table">
							<thead>
								<tr>
									<th colspan="8" class="table-title">
										血液生化 &nbsp;&nbsp;&nbsp;&nbsp;
										{{ bloodChemistryData.testDate }}
									</th>
								</tr>
								<tr>
									<th>项目</th>
									<th>结果</th>
									<th>参考范围</th>
									<th>单位</th>
									<th>项目</th>
									<th>结果</th>
									<th>参考范围</th>
									<th>单位</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in bloodChemistryData.items" :key="index">
									<td>
										{{ item.leftItem.name }}
									</td>
									<td
										:class="{
											'abnormal-result': item.leftItem.resultFlag === '1'
										}"
									>
										{{ item.leftItem.resultValue }}
									</td>
									<td>
										{{ item.leftItem.referenceRange }}
									</td>
									<td>
										{{ item.leftItem.unit }}
									</td>
									<td>
										{{ item.rightItem.name }}
									</td>
									<td
										:class="{
											'abnormal-result': item.rightItem.resultFlag === '1'
										}"
									>
										{{ item.rightItem.resultValue }}
									</td>
									<td>
										{{ item.rightItem.referenceRange }}
									</td>
									<td>
										{{ item.rightItem.unit }}
									</td>
								</tr>
								<tr
									v-for="(item, index) in bloodChemistryData.itemsLast"
									:key="index"
								>
									<td>{{ item.name }}</td>
									<td>{{ item.resultValue }}</td>
									<td colspan="5">{{ item.referenceRange }}</td>
									<td>{{ item.unit }}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- 空三行 -->
					<div class="empty-line">&nbsp;</div>
					<div class="empty-line">&nbsp;</div>
					<div class="empty-line">&nbsp;</div>

					<!-- 尿常规及沉渣项目表格 -->
					<div class="urine-routine-section">
						<table class="urine-routine-table">
							<thead>
								<tr>
									<th colspan="7" class="table-title">
										尿常规及沉渣项目 &nbsp;&nbsp;&nbsp;&nbsp;
										{{ urineRoutineData.testDate }}
									</th>
								</tr>
								<tr>
									<th>项目</th>
									<th>结果</th>
									<th>待查</th>
									<th>待查</th>
									<th>待查</th>
									<th>参考范围</th>
									<th>单位</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in urineRoutineData.items" :key="index">
									<td class="item-name">
										{{ item.name }}
									</td>
									<td>{{ item.resultValue }}</td>
									<td>/</td>
									<td>/</td>
									<td>/</td>
									<td>
										{{ item.referenceRange }}
									</td>
									<td>{{ item.unit }}</td>
								</tr>
								<tr
									v-for="(item, index) in urineRoutineData.itemsLast"
									:key="index"
								>
									<td class="culture-label">{{ item.name }}</td>
									<td class="culture-result" colspan="5">
										{{ item.resultValue }}
									</td>
									<td class="test-time-label">{{ item.testDate }}</td>
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
import { service } from '/@/cool';
import dayjs from 'dayjs';

import { markdownToHTML } from '/@/modules/helper/utils/markdown-converter-github';

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

// keep-alive 场景下再次激活时刷新数据
onActivated(() => {
	isMounted.value = true;
	isCancelled = false;
	nextTick(async () => {
		if (isMounted.value && !isCancelled) {
			await loadinfo();
			if (isMounted.value && !isCancelled) {
				await loadLabResults();
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

// 血液生化检查数据
const bloodChemistryData = ref({
	testDate: '', // 检测时间
	itemsLast: [
		{
			name: '羟基维生素D',
			resultValue: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		}
	],
	items: [
		{
			leftItem: {
				name: '钾',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			},
			rightItem: {
				name: '尿酸',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			}
		},
		{
			leftItem: {
				name: '钠',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			},
			rightItem: {
				name: '肌酐',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			}
		},
		{
			leftItem: {
				name: '氯',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			},
			rightItem: {
				name: 'PTH',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			}
		},
		{
			leftItem: {
				name: '钙',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			},
			rightItem: {
				name: 'AKP',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			}
		},
		{
			leftItem: {
				name: '磷',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			},
			rightItem: {
				name: 'CO₂CP',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			}
		},
		{
			leftItem: {
				name: '镁',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			},
			rightItem: {
				name: '降钙素',
				resultValue: '',
				referenceRange: '',
				unit: '',
				resultFlag: ''
			}
		}
	]
});

// 尿常规及沉渣项目数据
const urineRoutineData = ref({
	testDate: '',
	itemsLast: [
		{
			name: '尿培养',
			resultValue: '',
			testDate: ''
		},
		{
			name: '结石成分(红外)',
			resultValue: '',
			testDate: ''
		}
	],
	items: [
		{
			name: '尿PH',
			resultValue: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		},
		{
			name: '尿比重',
			resultValue: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		},
		{
			name: '亚硝酸盐试验',
			resultValue: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		},
		{
			name: '无定形磷酸盐结晶(UD AMORF)',
			resultValue: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		},
		{
			name: '尿酸结晶(UD Crystal)',
			resultValue: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		},
		{
			name: '草酸钙结晶 (CAOX)',
			resultValue: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		},
		{
			name: '磷酸铵镁结晶(TPO4)',
			resultValue: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		},
		{
			name: '未分类结晶(UNCX)',
			resultValue: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		}
	]
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

	//console.log('loadinfo=========================', props.patientNo);
	try {
		if (props.patientNo) {
			const params = {
				swlNo: props.swlNo,
				serialNumber: props.serialNumber,
				assessmentType: 'mua1',
				assessmentCount: props.assessmentCount,
				// 防浏览器/中间层缓存
				t: Date.now()
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

// 加载实验室检查结果
const loadLabResults = async () => {
	// 检查组件是否已卸载或已取消
	if (!isMounted.value || isCancelled) return;

	try {
		const params = {
			swlNo: props.swlNo,
			serialNumber: props.serialNumber,
			moduleCode: 'mua',
			type: 'list', //分组
			assessmentCount: props.assessmentCount,
			// 防浏览器/中间层缓存
			t: Date.now()
		};
		const data = await service.swl.lab.list(params);

		// 检查组件是否已卸载或已取消
		if (!isMounted.value || isCancelled) return;

		// 处理数据，仅保留异常结果或重要指标
		if (data && data.length > 0) {
			// 直接使用data数组，因为它已经是SwlLabResultDetailEntity[]类型
			labResults.value = data;
			//console.log('labResults:', labResults.value);

			// 加载完实验室数据后，提取血液生化和尿常规数据
			extractBloodChemistryData(labResults.value);
			extractUrineRoutineData(labResults.value);
		}
	} catch (error) {
		// 检查组件是否已卸载或已取消
		if (!isMounted.value || isCancelled) return;
		console.error('加载实验室检查结果失败:', error);
	}
};

/**
 * 从实验室检查结果中提取血液生化数据
 * @param labData 实验室检查结果数组
 */
const extractBloodChemistryData = (labData: any[]) => {
	// 检查组件是否已卸载或已取消
	if (!isMounted.value || isCancelled) return;

	try {
		//console.log('extractBloodChemistryData - 输入数据:', labData);

		// 检查数据是否为数组
		if (!Array.isArray(labData)) {
			console.warn('extractBloodChemistryData - 输入数据不是数组:', typeof labData);
			return;
		}

		//取groupCode为10904的项目，取testTime最大的值，testTime是时间格式，需要转换为日期格式
		const groupCode10904 = labData.filter(item => item.groupCode === 10904);
		//循环groupCode10904，取testTime最大的值，testTime是时间格式，需要转换为日期格式
		let max10904TestTime = '';
		for (const item of groupCode10904) {
			if (item.testTime != null && item.testTime != '' && item.testTime > max10904TestTime) {
				max10904TestTime = item.testTime;
			}
		}
		if (max10904TestTime) {
			bloodChemistryData.value.testDate = dayjs(max10904TestTime).format('YYYY-MM-DD');
		}

		// 处理血液生化检查项目
		labData.forEach(item => {
			if (!item || !item.itemCode) return;

			switch (item.itemCode) {
				case 'xsh_xj': // 钾
					bloodChemistryData.value.items[0].leftItem.resultValue = item.resultValue || '';
					bloodChemistryData.value.items[0].leftItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[0].leftItem.unit = item.unit || '';
					bloodChemistryData.value.items[0].leftItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_xns': // 尿酸
					bloodChemistryData.value.items[0].rightItem.resultValue =
						item.resultValue || '';
					bloodChemistryData.value.items[0].rightItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[0].rightItem.unit = item.unit || '';
					bloodChemistryData.value.items[0].rightItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_xn': // 钠
					bloodChemistryData.value.items[1].leftItem.resultValue = item.resultValue || '';
					bloodChemistryData.value.items[1].leftItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[1].leftItem.unit = item.unit || '';
					bloodChemistryData.value.items[1].leftItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_xjg': // 肌酐
					bloodChemistryData.value.items[1].rightItem.resultValue =
						item.resultValue || '';
					bloodChemistryData.value.items[1].rightItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[1].rightItem.unit = item.unit || '';
					bloodChemistryData.value.items[1].rightItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_xl': // 氯
					bloodChemistryData.value.items[2].leftItem.resultValue = item.resultValue || '';
					bloodChemistryData.value.items[2].leftItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[2].leftItem.unit = item.unit || '';
					bloodChemistryData.value.items[2].leftItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_jzpxs': // PTH
					bloodChemistryData.value.items[2].rightItem.resultValue =
						item.resultValue || '';
					bloodChemistryData.value.items[2].rightItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[2].rightItem.unit = item.unit || '';
					bloodChemistryData.value.items[2].rightItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_xg': // 钙
					bloodChemistryData.value.items[3].leftItem.resultValue = item.resultValue || '';
					bloodChemistryData.value.items[3].leftItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[3].leftItem.unit = item.unit || '';
					bloodChemistryData.value.items[3].leftItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_jxlsm': // ALP
					bloodChemistryData.value.items[3].rightItem.resultValue =
						item.resultValue || '';
					bloodChemistryData.value.items[3].rightItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[3].rightItem.unit = item.unit || '';
					bloodChemistryData.value.items[3].rightItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_xlin': // 磷
					bloodChemistryData.value.items[4].leftItem.resultValue = item.resultValue || '';
					bloodChemistryData.value.items[4].leftItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[4].leftItem.unit = item.unit || '';
					bloodChemistryData.value.items[4].leftItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_co2cp': // CO₂CP
					bloodChemistryData.value.items[4].rightItem.resultValue =
						item.resultValue || '';
					bloodChemistryData.value.items[4].rightItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[4].rightItem.unit = item.unit || '';
					bloodChemistryData.value.items[4].rightItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_xm': // 镁
					bloodChemistryData.value.items[5].leftItem.resultValue = item.resultValue || '';
					bloodChemistryData.value.items[5].leftItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[5].leftItem.unit = item.unit || '';
					bloodChemistryData.value.items[5].leftItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_tsqy': // 降钙素
					bloodChemistryData.value.items[5].rightItem.resultValue =
						item.resultValue || '';
					bloodChemistryData.value.items[5].rightItem.referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.items[5].rightItem.unit = item.unit || '';
					bloodChemistryData.value.items[5].rightItem.resultFlag = item.resultFlag || '';
					break;
				case 'xsh_eqwss': // 羟基维生素D
					bloodChemistryData.value.itemsLast[0].resultValue = item.resultValue || '';
					bloodChemistryData.value.itemsLast[0].referenceRange =
						item.referenceRange || '';
					bloodChemistryData.value.itemsLast[0].unit = item.unit || '';
					bloodChemistryData.value.itemsLast[0].resultFlag = item.resultFlag || '';
					break;
			}
		});

		//console.log('extractBloodChemistryData - 处理完成');
	} catch (error) {
		// 检查组件是否已卸载或已取消
		if (!isMounted.value || isCancelled) return;
		console.error('提取血液生化检查数据失败:', error);
	}
};

/**
 * 从实验室检查结果中提取尿常规数据
 * @param labData 实验室检查结果数组
 */
const extractUrineRoutineData = async (labData: any[]) => {
	// 检查组件是否已卸载或已取消
	if (!isMounted.value || isCancelled) return;

	try {
		//console.log('extractUrineRoutineData - 输入数据:', labData);

		// 检查数据是否为数组
		if (!Array.isArray(labData)) {
			console.warn('extractUrineRoutineData - 输入数据不是数组:', typeof labData);
			return;
		}

		//取groupCode为10902的项目，取testTime最大的值，testTime是时间格式，需要转换为日期格式
		const groupCode10902 = labData.filter(item => item.groupCode === 10902);
		//console.log('groupCode10902:', groupCode10902);
		//循环groupCode10902，取testTime最大的值，testTime是时间格式，需要转换为日期格式
		let max10902TestTime = '';
		for (const item of groupCode10902) {
			if (item.testTime != null && item.testTime != '' && item.testTime > max10902TestTime) {
				max10902TestTime = item.testTime;
			}
		}
		if (max10902TestTime) {
			urineRoutineData.value.testDate = dayjs(max10902TestTime).format('YYYY-MM-DD');
		}

		// 处理尿常规检查项目
		labData.forEach(item => {
			if (!item || !item.itemCode) return;

			// 根据itemCode匹配对应的尿常规项目
			// 这里需要根据实际的itemCode来匹配
			// 目前先使用模拟数据，可以根据实际API返回的数据结构来调整
			// 处理血液生化检查项目

			switch (item.itemCode) {
				case 'ncg_phz': // 尿PH
					urineRoutineData.value.items[0].resultValue = item.resultValue || '';
					urineRoutineData.value.items[0].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[0].unit = item.unit || '';
					urineRoutineData.value.items[0].resultFlag = item.resultFlag || '';
					break;
				case 'ncg_sg': // 尿比重
					urineRoutineData.value.items[1].resultValue = item.resultValue || '';
					urineRoutineData.value.items[1].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[1].unit = item.unit || '';
					urineRoutineData.value.items[1].resultFlag = item.resultFlag || '';
					break;
				case 'ncg_yxsy': // 亚硝酸盐试验
					urineRoutineData.value.items[2].resultValue = item.resultValue || '';
					urineRoutineData.value.items[2].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[2].unit = item.unit || '';
					urineRoutineData.value.items[2].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_wdxlsy': // 无定形磷酸盐结晶
					urineRoutineData.value.items[3].resultValue = item.resultValue || '';
					urineRoutineData.value.items[3].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[3].unit = item.unit || '';
					urineRoutineData.value.items[3].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_nsjj': // 尿酸结晶
					urineRoutineData.value.items[4].resultValue = item.resultValue || '';
					urineRoutineData.value.items[4].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[4].unit = item.unit || '';
					urineRoutineData.value.items[4].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_csg': // 草酸钙结晶
					urineRoutineData.value.items[5].resultValue = item.resultValue || '';
					urineRoutineData.value.items[5].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[5].unit = item.unit || '';
					urineRoutineData.value.items[5].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_lsam': // 磷酸铵镁结晶
					urineRoutineData.value.items[6].resultValue = item.resultValue || '';
					urineRoutineData.value.items[6].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[6].unit = item.unit || '';
					urineRoutineData.value.items[6].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_wfljj': // 未分类结晶
					urineRoutineData.value.items[7].resultValue = item.resultValue || '';
					urineRoutineData.value.items[7].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[7].unit = item.unit || '';
					urineRoutineData.value.items[7].resultFlag = item.resultFlag || '';
					break;
				case 'nfx_npy': //尿培养
					urineRoutineData.value.itemsLast[0].resultValue = item.resultValue || '';
					urineRoutineData.value.itemsLast[0].testDate = item.testDate || '';
					break;
			}
		});

		if (Number(info.value.component1Percent) > 0) {
			let resultValue =
				Number(info.value.component1Percent) > 0
					? info.value.component1 + info.value.component1Percent + '%;'
					: '';
			resultValue +=
				Number(info.value.component2Percent) > 0
					? info.value.component2 + info.value.component2Percent + '%;'
					: '';
			resultValue +=
				Number(info.value.component3Percent) > 0
					? info.value.component3 + info.value.component3Percent + '%;'
					: '';
			resultValue +=
				Number(info.value.component4Percent) > 0
					? info.value.component4 + info.value.component4Percent + '%;'
					: '';
			urineRoutineData.value.itemsLast[1].resultValue = resultValue;
			urineRoutineData.value.itemsLast[1].testDate = info.value.analysisDate || '';
		}
		//console.log('extractUrineRoutineData - 处理完成');
	} catch (error) {
		// 检查组件是否已卸载或已取消
		if (!isMounted.value || isCancelled) return;
		console.error('提取尿常规检查数据失败:', error);
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
	.a4-page {
		width: 210mm;
		height: 297mm;
		background-color: white;
		border: 1px solid #ddd;
		box-shadow: none;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		// 页码指示器
		.page-indicator {
			position: absolute;
			bottom: 5mm;
			right: 5mm;
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
			height: 20mm;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 3mm 15mm 0 15mm;
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
			max-height: calc(297mm - 20mm - 12mm - 15mm); // A4高度 - 页眉 - 页脚 - 更多内边距
			overflow: hidden;

			// 空行样式
			.empty-line {
				height: 20px;
				line-height: 20px;
				margin: 0;
				padding: 0;
			}

			.blood-chemistry-section {
				margin-bottom: 10px; // 进一步减少底部间距

				.blood-chemistry-table {
					margin-bottom: 10px; // 进一步减少表格底部间距
					font-size: 16px; // 保持16px字体
					border: 2px solid #d0d0d0; // 更淡的边框
					table-layout: auto !important; // 强制使用自适应布局

					thead th {
						padding: 4px 2px; // 减少表头内边距
						height: 25px;
						line-height: 1.1;
						border: 1px solid #d0d0d0; // 更淡的边框
						white-space: nowrap; // 防止表头换行

						&:first-child,
						&:nth-child(5) {
							min-width: 80px; // 项目列最小宽度
						}
					}

					tbody td {
						padding: 4px 2px; // 进一步减少单元格内边距
						height: 25px; // 进一步减少行高
						min-height: 25px;
						line-height: 1.1;
						font-size: 16px;
						border: 1px solid #d0d0d0; // 更淡的边框

						&:first-child,
						&:nth-child(5) {
							text-align: left !important;
							padding-left: 6px;
							white-space: nowrap;
							min-width: 80px;
						}
					}
				}
			}

			.content-divider {
				margin: 8px 0 10px 0; // 进一步减少分隔线间距
			}

			.urine-routine-section {
				margin-bottom: 5px; // 进一步减少底部间距

				.urine-routine-table {
					margin-bottom: 0px; // 移除表格底部间距
					font-size: 16px; // 保持16px字体
					border: 2px solid #d0d0d0; // 更淡的边框
					table-layout: auto !important; // 强制使用自适应布局

					thead th {
						padding: 4px 2px; // 减少表头内边距
						height: 25px;
						line-height: 1.1;
						border: 1px solid #d0d0d0; // 更淡的边框
						white-space: nowrap; // 防止表头换行

						&:first-child {
							min-width: 120px; // 项目列最小宽度
						}

						&:nth-child(6) {
							min-width: 80px; // 参考范围列最小宽度
						}
					}

					tbody td {
						padding: 3px 2px; // 进一步减少单元格内边距
						height: 24px; // 进一步减少行高
						min-height: 24px;
						line-height: 1.1;
						font-size: 16px;
						border: 1px solid #d0d0d0; // 更淡的边框

						&.item-name {
							text-align: left !important;
							padding-left: 6px;
							white-space: nowrap;
							min-width: 120px;
						}

						&:nth-child(6) {
							min-width: 80px;
						}
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
		padding: 0mm 10mm;

		// 标题区域
		.prescription-header {
			text-align: center;
			margin-bottom: 20px;

			h1 {
				font-size: 30px;
				font-weight: bold;
				margin-bottom: 8px;

				&:first-child {
					margin-bottom: 25px;
				}
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

		// 空行样式
		.empty-line {
			height: 20px;
			line-height: 20px;
			margin: 0;
			padding: 0;
			color: transparent;
		}

		// 血液生化检查表格
		.blood-chemistry-section {
			margin-bottom: 20px;

			.blood-chemistry-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #d0d0d0;
				font-size: 16px;
				table-layout: auto; // 改为自适应布局

				thead {
					th {
						border: 1px solid #d0d0d0;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						background-color: #f5f7fa;
						font-weight: bold;
						white-space: nowrap; // 防止表头换行

						&.table-title {
							font-weight: bold;
							font-size: 20px;
							background-color: #e8f4f8;
						}

						&:first-child,
						&:nth-child(5) {
							min-width: 80px; // 项目列最小宽度
						}
					}
				}

				tbody {
					td {
						border: 1px solid #d0d0d0;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						height: 35px;
						min-height: 35px;

						&:first-child {
							font-weight: 500;
							background-color: #fafafa;
							text-align: left; // 项目名称左对齐
							padding-left: 8px;
							white-space: nowrap; // 防止项目名称换行
							min-width: 80px;
						}

						&:nth-child(5) {
							font-weight: 500;
							background-color: #fafafa;
							text-align: left; // 项目名称左对齐
							padding-left: 8px;
							white-space: nowrap; // 防止项目名称换行
							min-width: 80px;
						}

						&.abnormal-result {
							color: #f56c6c;
							font-weight: bold;
							background-color: #fef0f0;
						}
					}
				}

				// 确保表格在打印时样式正确
				@media print {
					border: 2px solid #d0d0d0 !important;
					table-layout: auto !important;

					th,
					td {
						border: 1px solid #d0d0d0 !important;
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}

					th:first-child,
					th:nth-child(5),
					td:first-child,
					td:nth-child(5) {
						min-width: 80px !important;
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
				border: 2px solid #d0d0d0;
				font-size: 16px;
				margin-bottom: 10px;
				table-layout: auto; // 改为自适应布局

				thead {
					th {
						border: 1px solid #d0d0d0;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						background-color: #f5f7fa;
						font-weight: bold;
						white-space: nowrap; // 防止表头换行

						&.table-title {
							font-weight: bold;
							font-size: 20px;
							background-color: #e8f4f8;
						}

						&:first-child {
							min-width: 120px; // 项目列最小宽度，因为尿常规项目名称较长
						}

						&:nth-child(6) {
							min-width: 80px; // 参考范围列最小宽度
						}
					}
				}

				tbody {
					td {
						border: 1px solid #d0d0d0;
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
							font-size: 16px;
							white-space: nowrap; // 防止项目名称换行
							min-width: 120px; // 项目列最小宽度
						}

						&:nth-child(6) {
							min-width: 80px; // 参考范围列
						}
					}
				}

				// 确保表格在打印时样式正确
				@media print {
					border: 2px solid #d0d0d0 !important;
					table-layout: auto !important;

					th,
					td {
						border: 1px solid #d0d0d0 !important;
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}

					th:first-child,
					td.item-name {
						min-width: 120px !important;
					}

					th:nth-child(6),
					td:nth-child(6) {
						min-width: 80px !important;
					}
				}
			}

			.urine-culture-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #d0d0d0;
				font-size: 16px;

				tbody {
					td {
						border: 1px solid #d0d0d0;
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
					border: 2px solid #d0d0d0 !important;

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
					box-shadow: none;

					// 覆盖MuaLabForm中的部分样式以适应打印
					:deep(.cl-crud) {
						padding: 0 !important;
					}

					:deep(.el-table) {
						--el-table-header-bg-color: #f5f7fa;
						--el-table-border-color: #d0d0d0;

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
								border: 1px solid #d0d0d0 !important;
							}
						}

						.el-table__row {
							td {
								padding: 8px !important; // 统一padding确保文字居中
								vertical-align: middle !important;
								height: auto !important;
								line-height: 1.2 !important;
								text-align: center !important; // 添加水平居中
								border: 1px solid #d0d0d0 !important;
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
						box-shadow: none;
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
	.originalcontent {
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
			box-shadow: none;
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
					text-align: left;
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
					max-height: 300px;
					overflow: hidden;
					//white-space: pre-wrap; // 确保能正确显示换行符
					line-height: 1.2; // 设置紧凑的行高
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

				&[colspan='7'] {
					width: 87.5% !important;
				}
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
			box-shadow: none;

			// 覆盖MuaLabForm中的部分样式以适应打印
			:deep(.cl-crud) {
				padding: 0 !important;
			}

			:deep(.el-table) {
				--el-table-header-bg-color: #f5f7fa;
				--el-table-border-color: #d0d0d0;

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
						border: 1px solid #d0d0d0 !important;
					}
				}

				.el-table__row {
					td {
						padding: 8px !important; // 统一padding确保文字居中
						vertical-align: middle !important;
						height: auto !important;
						line-height: 1.2 !important;
						text-align: center !important; // 添加水平居中
						border: 1px solid #d0d0d0 !important;
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
