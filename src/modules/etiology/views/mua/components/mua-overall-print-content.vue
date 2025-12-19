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
								<span class="value">全面评估</span>
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
									<th colspan="7" class="table-title">尿常规及沉渣项目</th>
								</tr>
								<tr>
									<th>项目</th>
									<th>
										{{ urineRoutineData.itemsTestDate[0].testDate }}
									</th>
									<th>
										{{ urineRoutineData.itemsTestDate[1].testDate }}
									</th>
									<th>
										{{ urineRoutineData.itemsTestDate[2].testDate }}
									</th>
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
									<td>{{ item.resultValue1 }}</td>
									<td>{{ item.resultValue2 }}</td>
									<td>{{ item.resultValue3 }}</td>
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

		<!-- 第四页：24小时尿分析 -->
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
				<div class="prescription-content page-four-content">
					<!-- 24小时尿液检测表格 -->
					<div class="urine-analysis-section">
						<table class="urine-analysis-table">
							<thead>
								<tr>
									<th colspan="12" class="table-title">24小时尿液检测</th>
								</tr>
								<tr>
									<th>项目</th>
									<th>
										{{ urineAnalysisData.itemsTestDate[0].testDate }}
									</th>
									<th>
										{{ urineAnalysisData.itemsTestDate[1].testDate }}
									</th>
									<th>
										{{ urineAnalysisData.itemsTestDate[2].testDate }}
									</th>
									<th>参考范围</th>
									<th>单位</th>
									<th>项目</th>
									<th>
										{{ urineAnalysisData.itemsTestDate[0].testDate }}
									</th>
									<th>
										{{ urineAnalysisData.itemsTestDate[1].testDate }}
									</th>
									<th>
										{{ urineAnalysisData.itemsTestDate[2].testDate }}
									</th>
									<th>参考范围</th>
									<th>单位</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in urineAnalysisData.items" :key="index">
									<td class="item-name">
										{{ item.leftItem.name }}
									</td>
									<td
										:class="{
											'abnormal-result': item.leftItem.resultFlag1 === '1'
										}"
									>
										{{ item.leftItem.resultValue1 }}
									</td>
									<td
										:class="{
											'abnormal-result': item.leftItem.resultFlag2 === '1'
										}"
									>
										{{ item.leftItem.resultValue2 }}
									</td>
									<td
										:class="{
											'abnormal-result': item.leftItem.resultFlag3 === '1'
										}"
									>
										{{ item.leftItem.resultValue3 }}
									</td>
									<td>
										{{ item.leftItem.referenceRange }}
									</td>
									<td>
										{{ item.leftItem.unit }}
									</td>
									<td class="item-name">
										{{ item.rightItem.name }}
									</td>
									<td
										:class="{
											'abnormal-result': item.rightItem.resultFlag1 === '1'
										}"
									>
										{{ item.rightItem.resultValue1 }}
									</td>
									<td
										:class="{
											'abnormal-result': item.rightItem.resultFlag2 === '1'
										}"
									>
										{{ item.rightItem.resultValue2 }}
									</td>
									<td
										:class="{
											'abnormal-result': item.rightItem.resultFlag3 === '1'
										}"
									>
										{{ item.rightItem.resultValue3 }}
									</td>
									<td>
										{{ item.rightItem.referenceRange }}
									</td>
									<td>
										{{ item.rightItem.unit }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="urine-analysis-chart-section">
						<div
							v-if="chartOption"
							style="
								width: 100%;
								height: 500px;
								margin-bottom: 20px;
								border: 1px solid #c8c8c8;
								border-radius: 4px;
								overflow: hidden;
							"
						>
							<v-chart class="urine-chart" :option="chartOption" />
						</div>
						<div v-else style="padding: 20px; text-align: center; color: #999">
							图表加载中...
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

		<!-- 第五页：评估结果 -->
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

		<!-- 第六页：中心介绍 -->
		<div class="a4-page">
			<div class="page-indicator">第 6 页</div>
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
import {
	ref,
	onMounted,
	onUnmounted,
	onActivated,
	onDeactivated,
	nextTick,
	watch,
	computed
} from 'vue';
import { service } from '/@/cool';
import { ElMessage } from 'element-plus';
import { Printer, Download, Document } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { useCool } from '/@/cool';
import MuaLabForm from './mua-lab-form.vue'; // 导入实验室检查结果组件
import VChart from 'vue-echarts'; // 导入图表组件
import { use } from 'echarts/core';
import { LineChart, ScatterChart } from 'echarts/charts';
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	GridComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { markdownToHTML } from '/@/modules/helper/utils/markdown-converter-github';

// 注册必要的组件
use([
	LineChart,
	ScatterChart,
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	GridComponent,
	CanvasRenderer
]);

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

// 24小时尿液检测数据
const urineAnalysisData = ref({
	itemsTestDate: [
		{
			testDate: '待查'
		},
		{
			testDate: '待查'
		},
		{
			testDate: '待查'
		}
	],
	items: [
		{
			leftItem: {
				name: '尿量',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			},
			rightItem: {
				name: '尿尿酸(URIC)',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			}
		},
		{
			leftItem: {
				name: '尿钾(K)',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			},
			rightItem: {
				name: '硫酸盐',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			}
		},
		{
			leftItem: {
				name: '尿钠(Na)',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			},
			rightItem: {
				name: '尿草酸',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			}
		},
		{
			leftItem: {
				name: '尿钙(Ca)',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			},
			rightItem: {
				name: '枸橼酸',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			}
		},
		{
			leftItem: {
				name: '尿镁(Mg)',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			},
			rightItem: {
				name: '胱氨酸',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			}
		},
		{
			leftItem: {
				name: '尿磷(P)',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			},
			rightItem: {
				name: '尿肌酐(Cr)',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			}
		},
		{
			leftItem: {
				name: '尿铵(NH)',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			},
			rightItem: {
				name: '',
				resultValue1: '',
				resultValue2: '',
				resultValue3: '',
				referenceRange: '',
				unit: '',
				resultFlag1: '',
				resultFlag2: '',
				resultFlag3: ''
			}
		}
	]
});

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
	itemsTestDate: [
		{
			testDate: '待查'
		},
		{
			testDate: '待查'
		},
		{
			testDate: '待查'
		}
	],
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
			resultValue1: '',
			resultValue2: '',
			resultValue3: '',
			referenceRange: '',
			unit: '',
			resultFlag1: '',
			resultFlag2: '',
			resultFlag3: ''
		},
		{
			name: '尿比重',
			resultValue1: '',
			resultValue2: '',
			resultValue3: '',
			referenceRange: '',
			unit: '',
			resultFlag1: '',
			resultFlag2: '',
			resultFlag3: ''
		},
		{
			name: '亚硝酸盐试验',
			resultValue1: '',
			resultValue2: '',
			resultValue3: '',
			referenceRange: '',
			unit: '',
			resultFlag1: '',
			resultFlag2: '',
			resultFlag3: ''
		},
		{
			name: '无定形磷酸盐结晶(UD AMORF)',
			resultValue1: '',
			resultValue2: '',
			resultValue3: '',
			referenceRange: '',
			unit: '',
			resultFlag1: '',
			resultFlag2: '',
			resultFlag3: ''
		},
		{
			name: '尿酸结晶(UD Crystal)',
			resultValue1: '',
			resultValue2: '',
			resultValue3: '',
			referenceRange: '',
			unit: '',
			resultFlag: ''
		},
		{
			name: '草酸钙结晶 (CAOX)',
			resultValue1: '',
			resultValue2: '',
			resultValue3: '',
			referenceRange: '',
			unit: '',
			resultFlag1: '',
			resultFlag2: '',
			resultFlag3: ''
		},
		{
			name: '磷酸铵镁结晶(TPO4)',
			resultValue1: '',
			resultValue2: '',
			resultValue3: '',
			referenceRange: '',
			unit: '',
			resultFlag1: '',
			resultFlag2: '',
			resultFlag3: ''
		},
		{
			name: '未分类结晶(UNCX)',
			resultValue1: '',
			resultValue2: '',
			resultValue3: '',
			referenceRange: '',
			unit: '',
			resultFlag1: '',
			resultFlag2: '',
			resultFlag3: ''
		}
	]
});

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
			assessmentCount: props.assessmentCount
		};
		const data = await service.swl.lab.list(params);

		// 检查组件是否已卸载或已取消
		if (!isMounted.value || isCancelled) return;

		// 处理数据，仅保留异常结果或重要指标
		if (data && data.length > 0) {
			// 直接使用data数组，因为它已经是SwlLabResultDetailEntity[]类型
			labResults.value = data;
			////console.log('labResults:', labResults.value);

			// 加载完实验室数据后，提取血液生化、24小时尿液检测和尿常规数据
			extractBloodChemistryData(labResults.value);
			extractUrineAnalysisData(labResults.value);
			extractUrineRoutineData(labResults.value);
			loadChartData(labResults.value); // 加载图表数据的actualValue
		}
	} catch (error) {
		// 检查组件是否已卸载或已取消
		if (!isMounted.value || isCancelled) return;
		console.error('加载实验室检查结果失败:', error);
	}
};

/**
 * 加载图表数据的actualValue
 */
const loadChartData = async (labResults: any[]) => {
	try {
		if (labResults && labResults.length > 0) {
			// 根据itemCode映射更新图表数据的actualValue
			labResults.forEach(item => {
				if (!item || !item.itemCode || !item.resultValue) return;
				console.info('item:', item);
				// 将字符串结果值转换为数字
				const numericValue = parseFloat(item.resultValue);
				console.info('numericValue:', numericValue);
				if (isNaN(numericValue)) return;

				// 找到对应的图表数据项并更新actualValue
				const chartIndex = chartData.value.findIndex(chartItem => {
					switch (item.itemCode) {
						case 'xsh_jzpxs': // PTH
							return chartItem.code === 'xsh_jzpxs';
						case 'xsh_xns': // 血尿酸
							return chartItem.code === 'xsh_xns';
						case 'xsh_xg': // 血钙
							return chartItem.code === 'xsh_xg';
						case 'xsh_xlin': // 血磷
							return chartItem.code === 'xsh_xlin';
						case 'xsh_xj': // 血钾
							return chartItem.code === 'xsh_xj';
						case 'xsh_co2cp': // CO2CP
							return chartItem.code === 'xsh_co2cp';
						case 'nfx_ng': // 尿钙
							return chartItem.code === 'nfx_ng';
						case 'nfx_ncs': // 草酸
							return chartItem.code === 'nfx_ncs';
						case 'nfx_nm': // 尿镁
							return chartItem.code === 'nfx_nm';
						case 'nfx_nns': // 尿尿酸
							return chartItem.code === 'nfx_nns';
						case 'nfx_nj': // 尿钾
							return chartItem.code === 'nfx_nj';
						case 'nfx_nlin': // 尿磷
							return chartItem.code === 'nfx_nlin';
						case 'nfx_ngys': // 构橼酸
							return chartItem.code === 'nfx_ngys';
						case 'nfx_nl': // 尿量
							return chartItem.code === 'nfx_nl';
						case 'ncg_phz': // PH
							return chartItem.code === 'ncg_phz';
						default:
							return false;
					}
				});

				if (chartIndex !== -1) {
					// 如果已有数据，添加到数组中；否则创建新数组
					if (chartData.value[chartIndex].actualValue.length === 0) {
						chartData.value[chartIndex].actualValue = [numericValue];
					} else {
						chartData.value[chartIndex].actualValue.push(numericValue);
					}
				}
			});

			////console.log('图表数据已更新:', chartData.value);
		}
	} catch (error) {
		console.error('加载图表数据失败:', error);
	}
};

/**
 * 从实验室检查结果中提取血液生化数据
 * @param labData 实验室检查结果数组
 */
const extractBloodChemistryData = (labData: any[]) => {
	try {
		////console.log('extractBloodChemistryData - 输入数据:', labData);

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

		////console.log('extractBloodChemistryData - 处理完成');
	} catch (error) {
		console.error('提取血液生化检查数据失败:', error);
	}
};

/**
 * 从实验室检查结果中提取尿常规数据
 * @param labData 实验室检查结果数组
 */
const extractUrineRoutineData = async (labData: any[]) => {
	try {
		////console.log('extractUrineRoutineData - 输入数据:', labData);

		// 检查数据是否为数组
		if (!Array.isArray(labData)) {
			console.warn('extractUrineRoutineData - 输入数据不是数组:', typeof labData);
			return;
		}

		//取groupCode为10902的项目，取testTime最大的值，testTime是时间格式，需要转换为日期格式
		const groupCode10902Seq1 = labData.filter(
			item => item.groupCode === 10902 && item.seq === 1
		);
		const groupCode10902Seq2 = labData.filter(
			item => item.groupCode === 10902 && item.seq === 2
		);
		const groupCode10902Seq3 = labData.filter(
			item => item.groupCode === 10902 && item.seq === 3
		);
		//console.log('groupCode10902Seq1:', groupCode10902Seq1);
		//console.log('groupCode10902Seq2:', groupCode10902Seq2);
		//console.log('groupCode10902Seq3:', groupCode10902Seq3);
		//循环groupCode10902，取testTime最大的值，testTime是时间格式，需要转换为日期格式
		let max10902TestTimeSeq1 = '';
		let max10902TestTimeSeq2 = '';
		let max10902TestTimeSeq3 = '';
		for (const item of groupCode10902Seq1) {
			if (
				item.testTime != null &&
				item.testTime != '' &&
				item.testTime > max10902TestTimeSeq1
			) {
				max10902TestTimeSeq1 = item.testTime;
			}
		}
		for (const item of groupCode10902Seq2) {
			if (
				item.testTime != null &&
				item.testTime != '' &&
				item.testTime > max10902TestTimeSeq2
			) {
				max10902TestTimeSeq2 = item.testTime;
			}
		}
		for (const item of groupCode10902Seq3) {
			if (
				item.testTime != null &&
				item.testTime != '' &&
				item.testTime > max10902TestTimeSeq3
			) {
				max10902TestTimeSeq3 = item.testTime;
			}
		}
		if (max10902TestTimeSeq1) {
			urineRoutineData.value.itemsTestDate[0].testDate =
				dayjs(max10902TestTimeSeq1).format('YYYY-MM-DD');
		}
		if (max10902TestTimeSeq2) {
			urineRoutineData.value.itemsTestDate[1].testDate =
				dayjs(max10902TestTimeSeq2).format('YYYY-MM-DD');
		}
		if (max10902TestTimeSeq3) {
			urineRoutineData.value.itemsTestDate[2].testDate =
				dayjs(max10902TestTimeSeq3).format('YYYY-MM-DD');
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
					if (item.seq == 1) {
						urineRoutineData.value.items[0].resultValue1 = item.resultValue || '';
						urineRoutineData.value.items[0].resultFlag1 = item.resultFlag || '';
					} else if (item.seq == 2) {
						urineRoutineData.value.items[0].resultValue2 = item.resultValue || '';
					} else if (item.seq == 3) {
						urineRoutineData.value.items[0].resultValue3 = item.resultValue || '';
					}
					urineRoutineData.value.items[0].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[0].unit = item.unit || '';
					break;
				case 'ncg_sg': // 尿比重
					if (item.seq == 1) {
						urineRoutineData.value.items[1].resultValue1 = item.resultValue || '';
					} else if (item.seq == 2) {
						urineRoutineData.value.items[1].resultValue2 = item.resultValue || '';
					} else if (item.seq == 3) {
						urineRoutineData.value.items[1].resultValue3 = item.resultValue || '';
					}
					urineRoutineData.value.items[1].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[1].unit = item.unit || '';
					urineRoutineData.value.items[1].resultFlag = item.resultFlag || '';
					break;
				case 'ncg_yxsy': // 亚硝酸盐试验
					if (item.seq == 1) {
						urineRoutineData.value.items[2].resultValue1 = item.resultValue || '';
					} else if (item.seq == 2) {
						urineRoutineData.value.items[2].resultValue2 = item.resultValue || '';
					} else if (item.seq == 3) {
						urineRoutineData.value.items[2].resultValue3 = item.resultValue || '';
					}
					urineRoutineData.value.items[2].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[2].unit = item.unit || '';
					urineRoutineData.value.items[2].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_wdxlsy': // 无定形磷酸盐结晶
					if (item.seq == 1) {
						urineRoutineData.value.items[3].resultValue1 = item.resultValue || '';
					} else if (item.seq == 2) {
						urineRoutineData.value.items[3].resultValue2 = item.resultValue || '';
					} else if (item.seq == 3) {
						urineRoutineData.value.items[3].resultValue3 = item.resultValue || '';
					}
					urineRoutineData.value.items[3].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[3].unit = item.unit || '';
					urineRoutineData.value.items[3].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_nsjj': // 尿酸结晶
					if (item.seq == 1) {
						urineRoutineData.value.items[4].resultValue1 = item.resultValue || '';
					} else if (item.seq == 2) {
						urineRoutineData.value.items[4].resultValue2 = item.resultValue || '';
					} else if (item.seq == 3) {
						urineRoutineData.value.items[4].resultValue3 = item.resultValue || '';
					}
					urineRoutineData.value.items[4].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[4].unit = item.unit || '';
					urineRoutineData.value.items[4].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_csg': // 草酸钙结晶
					if (item.seq == 1) {
						urineRoutineData.value.items[5].resultValue1 = item.resultValue || '';
					} else if (item.seq == 2) {
						urineRoutineData.value.items[5].resultValue2 = item.resultValue || '';
					} else if (item.seq == 3) {
						urineRoutineData.value.items[5].resultValue3 = item.resultValue || '';
					}
					urineRoutineData.value.items[5].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[5].unit = item.unit || '';
					urineRoutineData.value.items[5].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_lsam': // 磷酸铵镁结晶
					if (item.seq == 1) {
						urineRoutineData.value.items[6].resultValue1 = item.resultValue || '';
					} else if (item.seq == 2) {
						urineRoutineData.value.items[6].resultValue2 = item.resultValue || '';
					} else if (item.seq == 3) {
						urineRoutineData.value.items[6].resultValue3 = item.resultValue || '';
					}
					urineRoutineData.value.items[6].referenceRange = item.referenceRange || '';
					urineRoutineData.value.items[6].unit = item.unit || '';
					urineRoutineData.value.items[6].resultFlag = item.resultFlag || '';
					break;
				case 'ncz_wfljj': // 未分类结晶
					if (item.seq == 1) {
						urineRoutineData.value.items[7].resultValue1 = item.resultValue || '';
					} else if (item.seq == 2) {
						urineRoutineData.value.items[7].resultValue2 = item.resultValue || '';
					} else if (item.seq == 3) {
						urineRoutineData.value.items[7].resultValue3 = item.resultValue || '';
					}
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
		console.error('提取尿常规检查数据失败:', error);
	}
};

/**
 * 从实验室检查结果中提取24小时尿液检测数据
 * @param labData 实验室检查结果数组
 */
const extractUrineAnalysisData = (labData: any[]) => {
	try {
		//console.log('extractUrineAnalysisData - 输入数据:', labData);

		// 检查数据是否为数组
		if (!Array.isArray(labData)) {
			console.warn('extractUrineAnalysisData - 输入数据不是数组:', typeof labData);
			return;
		}

		//取groupCode为10901的项目，取testTime最大的值，testTime是时间格式，需要转换为日期格式
		const groupCode10901Seq1 = labData.filter(
			item => item.groupCode === 10901 && item.seq === 1
		);
		const groupCode10901Seq2 = labData.filter(
			item => item.groupCode === 10901 && item.seq === 2
		);
		const groupCode10901Seq3 = labData.filter(
			item => item.groupCode === 10901 && item.seq === 3
		);
		//console.log('groupCode10901Seq1:', groupCode10901Seq1);
		//console.log('groupCode10901Seq2:', groupCode10901Seq2);
		//console.log('groupCode10901Seq3:', groupCode10901Seq3);
		//循环groupCode10901，取testTime最大的值，testTime是时间格式，需要转换为日期格式
		let max10901TestTimeSeq1 = '';
		let max10901TestTimeSeq2 = '';
		let max10901TestTimeSeq3 = '';
		for (const item of groupCode10901Seq1) {
			if (
				item.testTime != null &&
				item.testTime != '' &&
				item.testTime > max10901TestTimeSeq1
			) {
				max10901TestTimeSeq1 = item.testTime;
			}
		}
		for (const item of groupCode10901Seq2) {
			if (
				item.testTime != null &&
				item.testTime != '' &&
				item.testTime > max10901TestTimeSeq2
			) {
				max10901TestTimeSeq2 = item.testTime;
			}
		}
		for (const item of groupCode10901Seq3) {
			if (
				item.testTime != null &&
				item.testTime != '' &&
				item.testTime > max10901TestTimeSeq3
			) {
				max10901TestTimeSeq3 = item.testTime;
			}
		}
		if (max10901TestTimeSeq1) {
			urineAnalysisData.value.itemsTestDate[0].testDate =
				dayjs(max10901TestTimeSeq1).format('YYYY-MM-DD');
		}
		if (max10901TestTimeSeq2) {
			urineAnalysisData.value.itemsTestDate[1].testDate =
				dayjs(max10901TestTimeSeq2).format('YYYY-MM-DD');
		}
		if (max10901TestTimeSeq3) {
			urineAnalysisData.value.itemsTestDate[2].testDate =
				dayjs(max10901TestTimeSeq3).format('YYYY-MM-DD');
		}

		// 处理24小时尿液检测项目
		labData.forEach(item => {
			if (!item || !item.itemCode) return;

			switch (item.itemCode) {
				case 'nfx_nl': // 24小时尿量
					if (item.seq == 1) {
						urineAnalysisData.value.items[0].leftItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[0].leftItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[0].leftItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[0].leftItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[0].leftItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[0].leftItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[0].leftItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[0].leftItem.unit = item.unit || '';
					break;
				case 'nfx_nj': // 24小时尿钾
					if (item.seq == 1) {
						urineAnalysisData.value.items[1].leftItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[1].leftItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[1].leftItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[1].leftItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[1].leftItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[1].leftItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[1].leftItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[1].leftItem.unit = item.unit || '';
					break;
				case 'nfx_nn': // 尿钠(Na)
					if (item.seq == 1) {
						urineAnalysisData.value.items[2].leftItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[2].leftItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[2].leftItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[2].leftItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[2].leftItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[2].leftItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[2].leftItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[2].leftItem.unit = item.unit || '';
					break;
				case 'nfx_ng': // 尿钙(Ca)
					if (item.seq == 1) {
						urineAnalysisData.value.items[3].leftItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[3].leftItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[3].leftItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[3].leftItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[3].leftItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[3].leftItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[3].leftItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[3].leftItem.unit = item.unit || '';
					break;
				case 'nfx_nm': // 尿镁(Mg)
					if (item.seq == 1) {
						urineAnalysisData.value.items[4].leftItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[4].leftItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[4].leftItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[4].leftItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[4].leftItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[4].leftItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[4].leftItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[4].leftItem.unit = item.unit || '';
					break;
				case 'nfx_nlin': // 尿磷(P)
					if (item.seq == 1) {
						urineAnalysisData.value.items[5].leftItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[5].leftItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[5].leftItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[5].leftItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[5].leftItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[5].leftItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[5].leftItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[5].leftItem.unit = item.unit || '';
					break;
				case 'nfx_ag': // 尿铵(NH)
					if (item.seq == 1) {
						urineAnalysisData.value.items[6].leftItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[6].leftItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[6].leftItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[6].leftItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[6].leftItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[6].leftItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[6].leftItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[6].leftItem.unit = item.unit || '';
					break;
				case 'nfx_nns': // 尿尿酸(URIC)
					if (item.seq == 1) {
						urineAnalysisData.value.items[0].rightItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[0].rightItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[0].rightItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[0].rightItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[0].rightItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[0].rightItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[0].rightItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[0].rightItem.unit = item.unit || '';
					break;
				case 'nfx_nliu': // 硫酸盐
					if (item.seq == 1) {
						urineAnalysisData.value.items[1].rightItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[1].rightItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[1].rightItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[1].rightItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[1].rightItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[1].rightItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[1].rightItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[1].rightItem.unit = item.unit || '';
					break;
				case 'nfx_ncs': // 尿草酸
					if (item.seq == 1) {
						urineAnalysisData.value.items[2].rightItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[2].rightItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[2].rightItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[2].rightItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[2].rightItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[2].rightItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[2].rightItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[2].rightItem.unit = item.unit || '';
					break;
				case 'nfx_ngys': // 枸橼酸
					if (item.seq == 1) {
						urineAnalysisData.value.items[3].rightItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[3].rightItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[3].rightItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[3].rightItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[3].rightItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[3].rightItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[3].rightItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[3].rightItem.unit = item.unit || '';
					break;
				case 'nfx_nm': // 胱氨酸
					if (item.seq == 1) {
						urineAnalysisData.value.items[4].rightItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[4].rightItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[4].rightItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[4].rightItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[4].rightItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[4].rightItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[4].rightItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[4].rightItem.unit = item.unit || '';
					break;
				case 'nfx_njg': // 尿肌酐(Cr）
					if (item.seq == 1) {
						urineAnalysisData.value.items[5].rightItem.resultValue1 =
							item.resultValue || '';
						urineAnalysisData.value.items[5].rightItem.resultFlag1 =
							item.resultFlag || '';
					} else if (item.seq == 2) {
						urineAnalysisData.value.items[5].rightItem.resultValue2 =
							item.resultValue || '';
						urineAnalysisData.value.items[5].rightItem.resultFlag2 =
							item.resultFlag || '';
					} else if (item.seq == 3) {
						urineAnalysisData.value.items[5].rightItem.resultValue3 =
							item.resultValue || '';
						urineAnalysisData.value.items[5].rightItem.resultFlag3 =
							item.resultFlag || '';
					}
					urineAnalysisData.value.items[5].rightItem.referenceRange =
						item.referenceRange || '';
					urineAnalysisData.value.items[5].rightItem.unit = item.unit || '';
					break;
			}
		});

		//console.log('extractUrineAnalysisData - 处理完成');
	} catch (error) {
		console.error('提取24小时尿液检测数据失败:', error);
	}
};

/**
 * 检测指标数据类型
 */
interface TestIndicatorData {
	/** 指标代码 */
	code: string;
	/** 指标名称 */
	name: string;
	/** 实际值 - 支持单个值或多个值数组 */
	actualValue: number[];
	/** 参考值 - 支持单个值或多个值数组 */
	referenceValue: number[];
	/** 参考值范围 */
	referenceRange: [number, number];
	/** 最小刻度值 */
	minScale: number;
	/** 最大刻度值 */
	maxScale: number;
	/** 单位 */
	unit?: string;
	/** 是否反向 */
	reverse?: boolean;
}

/**
 * 图表数据
 */
const chartData = ref<TestIndicatorData[]>([
	{
		code: 'xsh_jzpxs',
		name: 'PTH',
		actualValue: [], // 将通过API获取
		referenceValue: [65],
		referenceRange: [15, 65],
		minScale: 0,
		maxScale: 600,
		unit: 'pg/mL'
	},
	{
		code: 'xsh_xns',
		name: '血尿酸',
		actualValue: [], // 将通过API获取
		referenceValue: [428],
		referenceRange: [150, 420],
		minScale: 200,
		maxScale: 800,
		unit: 'μmol/L'
	},
	{
		code: 'xsh_xg',
		name: '血钙',
		actualValue: [], // 将通过API获取
		referenceValue: [2.7],
		referenceRange: [2.25, 2.75],
		minScale: 0,
		maxScale: 5,
		unit: 'mmol/L'
	},
	{
		code: 'xsh_xlin',
		name: '血磷',
		actualValue: [], // 将通过API获取
		referenceValue: [0.83],
		referenceRange: [0.81, 1.45],
		minScale: 0,
		maxScale: 2,
		unit: 'mmol/L',
		reverse: true
	},
	{
		code: 'xsh_xj',
		name: '血钾',
		actualValue: [], // 将通过API获取
		referenceValue: [3.5],
		referenceRange: [3.5, 5.3],
		minScale: 2,
		maxScale: 6,
		unit: 'mmol/L',
		reverse: true
	},
	{
		code: 'xsh_co2cp',
		name: 'CO2CP',
		actualValue: [], // 将通过API获取
		referenceValue: [20, 30],
		referenceRange: [22, 29],
		minScale: 15,
		maxScale: 40,
		unit: 'mmol/L',
		reverse: true
	},
	{
		code: 'nfx_ng',
		name: '尿钙',
		actualValue: [], // 将通过API获取
		referenceValue: [5],
		referenceRange: [2.5, 7.5],
		minScale: 0,
		maxScale: 25,
		unit: 'mmol/24h'
	},
	{
		code: 'nfx_ncs',
		name: '草酸',
		actualValue: [], // 将通过API获取
		referenceValue: [40],
		referenceRange: [10, 40],
		minScale: 0,
		maxScale: 200,
		unit: 'μmol/24h'
	},
	{
		code: 'nfx_nm',
		name: '尿镁',
		actualValue: [], // 将通过API获取
		referenceValue: [3],
		referenceRange: [3, 5],
		minScale: 0,
		maxScale: 5,
		unit: 'mmol/24h',
		reverse: true
	},
	{
		code: 'nfx_nns',
		name: '尿尿酸',
		actualValue: [], // 将通过API获取
		referenceValue: [4000],
		referenceRange: [1500, 4500],
		minScale: 500,
		maxScale: 8000,
		unit: 'μmol/24h'
	},
	{
		code: 'nfx_nj',
		name: '尿钾',
		actualValue: [], // 将通过API获取
		referenceValue: [900],
		referenceRange: [25, 125],
		minScale: 100,
		maxScale: 1500,
		unit: 'mmol/24h'
	},
	{
		code: 'nfx_nlin',
		name: '尿磷',
		actualValue: [], // 将通过API获取
		referenceValue: [48],
		referenceRange: [13, 42],
		minScale: 10,
		maxScale: 70,
		unit: 'mmol/24h'
	},
	{
		code: 'nfx_ngys',
		name: '构橼酸',
		actualValue: [], // 将通过API获取
		referenceValue: [320],
		referenceRange: [320, 1000],
		minScale: 0,
		maxScale: 1000,
		unit: 'mg/24h',
		reverse: true
	},
	{
		code: 'nfx_nl',
		name: '尿量',
		actualValue: [], // 将通过API获取
		referenceValue: [1500],
		referenceRange: [800, 2500],
		minScale: 0,
		maxScale: 5000,
		unit: 'mL/24h',
		reverse: true
	},
	{
		code: 'ncg_phz',
		name: 'PH',
		actualValue: [], // 将通过API获取
		referenceValue: [5.5, 7],
		referenceRange: [5.5, 7.5],
		minScale: 4,
		maxScale: 9,
		unit: '',
		reverse: true
	}
]);

/**
 * 图表配置选项
 */
const chartOption = computed(() => {
	const indicators = chartData.value;
	const numIndicators = indicators.length;

	// 生成X轴类别数据
	const categories = indicators.map(item => item.name);

	// 计算垂直位置（从上到下，0-10的范围内）- 只取第一个参考值用于连线
	const getVerticalPosition = indicators.map((item, index) => {
		const valueRange = (item.maxScale - item.minScale) / 10;
		const firstReferenceValue = Array.isArray(item.referenceValue)
			? item.referenceValue[0]
			: item.referenceValue;
		let valueRatio = (firstReferenceValue - item.minScale) / valueRange;

		if (item.reverse) {
			valueRatio = 10 - valueRatio;
		}

		return [index, valueRatio];
	});

	// 蓝色连线数据（参考线）
	const blueLineData = getVerticalPosition.map((point, index) => {
		const indicator = indicators[index];
		// 在CO2CP之后插入断点，断开与尿钙的连线
		if (indicator.name === 'CO2CP') {
			// CO2CP点正常显示
			return point;
		} else if (indicator.name === '尿钙') {
			// 在尿钙之前插入null值断开连线，然后再显示尿钙点
			return point;
		}
		return point;
	});

	// 为了断开CO2CP和尿钙之间的连线，需要重新构建数据
	const processedBlueLineData: any[] = [];
	getVerticalPosition.forEach((point, index) => {
		const indicator = indicators[index];
		processedBlueLineData.push(point);

		// 在CO2CP之后插入断点
		if (indicator.name === 'CO2CP') {
			processedBlueLineData.push([index + 0.5, null]); // 插入断点
		}
	});

	const finalBlueLineData = processedBlueLineData;

	// 生成所有蓝色参考点（包括多个参考值）
	const allBluePoints = indicators.flatMap((item, index) => {
		const valueRange = (item.maxScale - item.minScale) / 10;
		const referenceValues = Array.isArray(item.referenceValue)
			? item.referenceValue
			: [item.referenceValue];

		return referenceValues.map((refValue, refIndex) => {
			let valueRatio = (refValue - item.minScale) / valueRange;

			if (item.reverse) {
				valueRatio = 10 - valueRatio;
			}

			// 蓝色点显示在垂直虚线上
			// 垂直虚线在每个指标的中心位置，对应x坐标为index
			const xPosition = index;

			return [xPosition, valueRatio, refValue, item]; // x坐标对应垂直分割线位置
		});
	});

	// 红色数据点 - 按照比例显示每个指标的实际值
	const redPoints = indicators.flatMap((item, index) => {
		const valueRange = (item.maxScale - item.minScale) / 10;

		// 处理单个值或多个值的情况
		const actualValues = Array.isArray(item.actualValue)
			? item.actualValue
			: [item.actualValue];

		return actualValues.map(actualValue => {
			let valueRatio = (actualValue - item.minScale) / valueRange;

			if (item.reverse) {
				valueRatio = 10 - valueRatio;
			}

			// 限制在图表范围内：超出最大值显示在最上方，低于最小值显示在最下方
			valueRatio = Math.max(0, Math.min(10, valueRatio));

			return [index, valueRatio, actualValue, item]; // 添加原始值和指标信息用于tooltip
		});
	});

	return {
		grid: {
			left: '10%',
			right: '10%',
			bottom: '25%',
			top: '15%',
			containLabel: false
		},
		xAxis: {
			type: 'category',
			data: categories,
			position: 'top',
			boundaryGap: true,
			axisTick: {
				show: false
			},
			axisLabel: {
				show: true,
				interval: 0,
				rotate: 0,
				fontSize: 12,
				color: '#333',
				margin: 30,
				verticalAlign: 'bottom'
			},
			axisLine: {
				show: false
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#c8c8c8',
					width: 1,
					type: 'dashed'
				}
			},
			// 添加额外的分割线配置，确保垂直线显示在正确位置
			splitArea: {
				show: false
			}
		},
		yAxis: {
			type: 'value',
			min: 0,
			max: 10,
			interval: 1, // 每1个单位一条横线，10等分显示
			show: true,
			axisLine: {
				show: true, // 显示Y轴轴线，确保左侧边框显示
				lineStyle: {
					color: '#c8c8c8',
					width: 1
				}
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: false
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#c8c8c8',
					width: 1,
					type: 'dashed'
				}
			}
		},
		series: [
			// 蓝色折线（只连接第一个参考值点）
			{
				name: '参考线',
				type: 'line',
				data: finalBlueLineData,
				lineStyle: {
					color: '#7BB3F0',
					width: 2
				},
				symbol: 'none', // 隐藏线上的点，因为用散点系列显示
				itemStyle: {
					color: '#7BB3F0'
				},
				showSymbol: false,
				smooth: false,
				label: {
					show: false // 隐藏蓝色参考线上的标签
				}
			},
			// 蓝色参考点（显示所有参考值点）
			{
				name: '参考值',
				type: 'scatter',
				data: allBluePoints,
				symbol: 'circle',
				symbolSize: 6,
				itemStyle: {
					color: '#7BB3F0'
				},
				label: {
					show: false // 隐藏标签
				}
			},
			// 检测值数据点（根据与参考线的位置关系确定颜色）
			{
				name: '检测值',
				type: 'scatter',
				data: redPoints,
				symbol: 'circle',
				symbolSize: 6,
				itemStyle: {
					color: function (params: any) {
						const [xIndex, yPosition] = params.data;

						// 获取该指标对应的参考线Y坐标
						const referenceLinePoint = getVerticalPosition[xIndex];
						const referenceY = referenceLinePoint ? referenceLinePoint[1] : 5; // 默认中位值

						// 如果检测值位于参考线以下（Y坐标更大），显示红色；否则显示深蓝色
						return yPosition > referenceY ? '#E74C3C' : '#2B5A8A';
					}
				},
				label: {
					show: true,
					position: 'right',
					offset: [3, 0],
					formatter: function (params: any) {
						const actualValue = params.data[2]; // 从数据中获取原始值
						const indicator = params.data[3]; // 从数据中获取指标信息

						// 特殊处理尿铵显示为 <900
						if (indicator.name === '尿铵' && actualValue === 900) {
							return '<900';
						}
						return actualValue.toString();
					},
					textStyle: {
						color: function (params: any) {
							const [xIndex, yPosition] = params.data;

							// 获取该指标对应的参考线Y坐标
							const referenceLinePoint = getVerticalPosition[xIndex];
							const referenceY = referenceLinePoint ? referenceLinePoint[1] : 5;

							// 标签颜色与点的颜色保持一致
							return yPosition >= referenceY ? '#E74C3C' : '#2B5A8A';
						},
						fontSize: 12,
						fontWeight: 'bold'
					}
				}
			}
		],
		// 显示每个指标的刻度值
		graphic: [
			// 底部水平边框线
			{
				type: 'line',
				left: '10%',
				right: '10%',
				bottom: '25%',
				shape: {
					x1: 0,
					y1: 0,
					x2: '100%',
					y2: 0
				},
				style: {
					stroke: '#c8c8c8',
					lineWidth: 1
				}
			},
			// 顶部水平边框线
			{
				type: 'line',
				left: '10%',
				right: '10%',
				top: '15%',
				shape: {
					x1: 0,
					y1: 0,
					x2: '100%',
					y2: 0
				},
				style: {
					stroke: '#c8c8c8',
					lineWidth: 1
				}
			},
			// 右侧垂直边框线
			{
				type: 'line',
				right: '10%',
				top: '15%',
				bottom: '25%',
				shape: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: '100%'
				},
				style: {
					stroke: '#c8c8c8',
					lineWidth: 1
				}
			},
			// 垂直虚线
			...indicators.map((item, index) => {
				// 计算每个类别在boundaryGap=true时的精确位置
				const categoryWidth = 80 / numIndicators;
				const left = 10 + categoryWidth * (index + 0.5);
				return {
					type: 'line',
					left: `${left}%`,
					top: '15%',
					bottom: '25%',
					shape: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: '100%'
					},
					style: {
						stroke: '#c8c8c8',
						lineWidth: 1,
						lineDash: [5, 5]
					}
				};
			}),
			// 顶部数值
			...indicators.map((item, index) => {
				// 计算每个类别在boundaryGap=true时的精确位置
				const categoryWidth = 80 / numIndicators;
				const left = 10 + categoryWidth * (index + 0.3);
				return {
					type: 'text',
					left: `${left}%`,
					top: '11%',
					style: {
						// 血磷是反向刻度，顶部显示minScale；其他指标顶部显示maxScale
						text: item.reverse ? item.minScale.toString() : item.maxScale.toString(),
						fontSize: 12,
						fill: '#333',
						textAlign: 'center'
					}
				};
			}),
			// 底部数值
			...indicators.map((item, index) => {
				// 计算每个类别在boundaryGap=true时的精确位置
				const categoryWidth = 80 / numIndicators;
				const left = 10 + categoryWidth * (index + 0.3);
				return {
					type: 'text',
					left: `${left}%`,
					bottom: '20%',
					style: {
						// 血磷是反向刻度，底部显示maxScale；其他指标底部显示minScale
						text: item.reverse ? item.maxScale.toString() : item.minScale.toString(),
						fontSize: 12,
						fill: '#333',
						textAlign: 'center'
					}
				};
			}),
			// 图表说明标题
			{
				type: 'text',
				left: '10%',
				bottom: '17%',
				style: {
					text: '',
					fontSize: 16,
					fill: '#333',
					textAlign: 'left',
					fontWeight: 'bold'
				}
			},
			// 图表说明文字 - 蓝色线条说明
			{
				type: 'text',
				left: '10%',
				bottom: '12%',
				style: {
					text: '● 蓝色线条：风险分界线，线条上面为成石高风险区（CO2CP\\尿PH下面蓝点以下也是异常区）',
					fontSize: 14,
					fill: '#7BB3F0',
					textAlign: 'left'
				}
			},
			// 图表说明文字 - 红色数据点说明
			{
				type: 'text',
				left: '10%',
				bottom: '7%',
				style: {
					text: '● 红色数据点：实际检测值',
					fontSize: 14,
					fill: '#E74C3C',
					textAlign: 'left'
				}
			},
			// 图表说明文字 - 顶部数字说明
			{
				type: 'text',
				left: '10%',
				bottom: '2%',
				style: {
					text: '顶部数字：各指标的最大刻度值  底部数字：各指标的最小刻度值',
					fontSize: 14,
					fill: '#333',
					textAlign: 'left'
				}
			}
		],
		tooltip: {
			trigger: 'item',
			formatter: function (params: any) {
				// 从数据中获取原始值和指标信息
				if (params.seriesName === '检测值') {
					const actualValue = params.data[2];
					const indicator = params.data[3];

					return `
						<div style="padding: 10px; font-size: 14px;">
							<div style="font-weight: bold; margin-bottom: 8px; color: #333;">${indicator.name}</div>
							<div style="margin-bottom: 5px;">
								<span style="color: #E74C3C;">●</span>
								检测值: <strong>${actualValue}${indicator.unit || ''}</strong>
							</div>
							<div style="margin-bottom: 5px;">
								参考范围: ${indicator.referenceRange[0]} - ${indicator.referenceRange[1]}${indicator.unit || ''}
							</div>
						</div>
					`;
				} else if (params.seriesName === '参考值') {
					// 蓝色参考点的tooltip
					const referenceValue = params.data[2];
					const indicator = params.data[3];

					return `
						<div style="padding: 10px; font-size: 14px;">
							<div style="font-weight: bold; margin-bottom: 8px; color: #333;">${indicator.name}</div>
							<div style="margin-bottom: 5px;">
								<span style="color: #4A90E2;">●</span>
								参考值: <strong>${referenceValue}${indicator.unit || ''}</strong>
							</div>
							<div style="margin-bottom: 5px;">
								参考范围: ${indicator.referenceRange[0]} - ${indicator.referenceRange[1]}${indicator.unit || ''}
							</div>
							<div style="color: #666;">
								最大刻度: ${indicator.maxScale}${indicator.unit || ''}
							</div>
						</div>
					`;
				} else {
					// 参考线的tooltip
					const indicator = indicators[params.dataIndex];
					const firstReferenceValue = Array.isArray(indicator.referenceValue)
						? indicator.referenceValue[0]
						: indicator.referenceValue;
					return `
						<div style="padding: 10px; font-size: 14px;">
							<div style="font-weight: bold; margin-bottom: 8px; color: #333;">${indicator.name}</div>
							<div style="margin-bottom: 5px;">
								<span style="color: #4A90E2;">●</span>
								参考值: <strong>${firstReferenceValue}${indicator.unit || ''}</strong>
							</div>
							<div style="margin-bottom: 5px;">
								参考范围: ${indicator.referenceRange[0]} - ${indicator.referenceRange[1]}${indicator.unit || ''}
							</div>
							<div style="color: #666;">
								最大刻度: ${indicator.maxScale}${indicator.unit || ''}
							</div>
						</div>
					`;
				}
			}
		}
	};
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

	//console.log('loadinfo', props.patientNo);
	try {
		if (props.patientNo) {
			const params = {
				swlNo: props.swlNo,
				serialNumber: props.serialNumber,
				assessmentType: 'mua2',
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
	// A4页面
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

			// 空行样式
			.empty-line {
				height: 20px;
				line-height: 20px;
				margin: 0;
				padding: 0;
			}

			.urine-analysis-section {
				margin-bottom: 10px; // 减少底部间距

				.urine-analysis-table {
					margin-bottom: 10px; // 减少表格底部间距
					font-size: 12px; // 减小字体

					thead th {
						padding: 4px 2px; // 减少表头内边距
						height: 25px;
						line-height: 1.1;
					}

					tbody td {
						padding: 4px 2px; // 减少单元格内边距
						height: 25px; // 减少行高
						min-height: 25px;
						line-height: 1.1;
						font-size: 12px;
					}
				}
			}

			.blood-chemistry-section {
				margin-bottom: 10px; // 进一步减少底部间距

				.blood-chemistry-table {
					margin-bottom: 10px; // 进一步减少表格底部间距
					font-size: 12px; // 减小字体

					thead th {
						padding: 4px 2px; // 减少表头内边距
						height: 25px;
						line-height: 1.1;
					}

					tbody td {
						padding: 4px 2px; // 进一步减少单元格内边距
						height: 25px; // 进一步减少行高
						min-height: 25px;
						line-height: 1.1;
						font-size: 12px;
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

		// 第四页特殊样式，控制24小时尿分析页面的内容高度
		.page-four-content {
			max-height: calc(297mm - 15mm - 12mm - 15mm); // A4高度 - 页眉 - 页脚 - 内边距
			overflow: hidden;
			display: flex;
			flex-direction: column;

			.urine-analysis-section {
				margin-bottom: 10px;
				flex-shrink: 0;

				.urine-analysis-table {
					margin-bottom: 10px;
					font-size: 12px;

					thead th {
						padding: 3px 2px;
						height: 24px;
						line-height: 1.1;
						font-size: 11px;
					}

					tbody td {
						padding: 3px 2px;
						height: 24px;
						min-height: 24px;
						line-height: 1.1;
						font-size: 11px;
					}
				}
			}

			.urine-analysis-chart-section {
				flex: 1;
				min-height: 250px;
				max-height: 500px;
				overflow: hidden;

				.urine-chart {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	// 24小时尿液检测图表样式
	.urine-analysis-chart-section {
		margin-top: 10px;
		margin-bottom: 20px;
		page-break-inside: avoid; // 防止图表跨页分割

		.chart-title {
			font-size: 16px;
			font-weight: bold;
			margin-bottom: 20px;
			text-align: center;
			color: #333;
		}

		.urine-chart {
			width: 100%;
			height: 500px;
			border: 1px solid #ddd;
			border-radius: 4px;
		}
	}

	// 图表说明样式 - 独立样式
	.chart-description {
		margin-top: 15px;
		padding: 10px;
		background-color: #f8f9fa;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		font-size: 12px;
		line-height: 1.5;
		text-align: center;

		.chart-description-title {
			font-weight: bold;
			font-size: 14px;
			margin-bottom: 8px;
			color: #333;
		}

		.chart-description-item {
			margin-bottom: 4px;
			display: flex;
			align-items: flex-start;
			justify-content: center;

			.blue-circle {
				color: #2b5a8a;
				font-weight: bold;
				margin-right: 8px;
				flex-shrink: 0;
			}

			.red-circle {
				color: #e74c3c;
				font-weight: bold;
				margin-right: 8px;
				flex-shrink: 0;
			}

			.risk-text {
				color: #333;
				font-weight: bold;
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

		// 24小时尿液检测表格
		.urine-analysis-section {
			margin-bottom: 20px;

			.urine-analysis-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #d0d0d0;
				font-size: 16px;
				margin-bottom: 20px;

				thead {
					th {
						border: 1px solid #d0d0d0;
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

					th,
					td {
						border: 1px solid #d0d0d0 !important;
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}
				}
			}
		}

		// 血液生化检查表格
		.blood-chemistry-section {
			margin-bottom: 20px;

			.blood-chemistry-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #d0d0d0;
				font-size: 16px !important;

				thead {
					th {
						border: 1px solid #d0d0d0;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						background-color: #f5f7fa;
						font-weight: bold;
						font-size: 16px !important;

						&.table-title {
							font-weight: bold;
							font-size: 20px !important;
							background-color: #e8f4f8;
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
						font-size: 16px !important;

						&:first-child {
							font-weight: 500;
							background-color: #fafafa;
						}

						&:nth-child(5) {
							font-weight: 500;
							background-color: #fafafa;
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
					font-size: 16px !important;

					th,
					td {
						border: 1px solid #d0d0d0 !important;
						font-size: 16px !important;
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
				border: 2px solid #d0d0d0;
				font-size: 16px !important;
				margin-bottom: 10px;

				thead {
					th {
						border: 1px solid #d0d0d0;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						background-color: #f5f7fa;
						font-weight: bold;
						font-size: 16px !important;

						&.table-title {
							font-weight: bold;
							font-size: 20px !important;
							background-color: #e8f4f8;
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
						font-size: 16px !important;

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
					border: 2px solid #d0d0d0 !important;
					font-size: 16px !important;

					th,
					td {
						border: 1px solid #d0d0d0 !important;
						font-size: 16px !important;
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}
				}
			}

			.urine-culture-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #d0d0d0;
				font-size: 16px !important;

				tbody {
					td {
						border: 1px solid #d0d0d0;
						padding: 8px 4px;
						text-align: center;
						vertical-align: middle;
						height: 35px;
						min-height: 35px;
						font-size: 16px !important;

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
					font-size: 16px !important;

					td {
						border: 1px solid #d0d0d0 !important;
						font-size: 16px !important;
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
		font-size: 14px;

		tbody {
			td {
				border: 1px solid #d0d0d0;
				padding: 10px 8px;
				vertical-align: middle;
				min-height: 40px;

				&.result-label {
					font-weight: bold;
					background-color: #f5f7fa;
					width: 25%;
					text-align: center;
				}

				&.result-content {
					text-align: left;
					padding-left: 12px;
					width: 75%;
				}

				&.suggestion-label {
					font-weight: bold;
					background-color: #f5f7fa;
					width: 25%;
					text-align: center;
				}

				&.suggestion-content {
					text-align: left;
					padding: 8px 12px; // 减少上下padding，从默认的较大值调整为8px
					width: 75%;
					min-height: 60px;
					max-height: 300px;
					overflow: hidden;
					//white-space: pre-wrap; // 确保能正确显示换行符
					line-height: 1.1; // 进一步减少行高，从1.2调整为1.1
				}

				&.signature-row {
					width: 12.5%;
					text-align: center;
					background-color: #fafafa;
					padding: 8px 4px;

					.signature-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 5px;

						.signature-label {
							font-weight: bold;
							font-size: 12px;
							color: #666;
						}

						.signature-value {
							font-size: 14px;
							color: #303133;
							min-height: 20px;
							border-bottom: 1px solid #ddd;
							padding-bottom: 2px;
							min-width: 80px;
							text-align: center;
						}
					}
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
			box-shadow: none;

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

/* 二维码区域样式 */
.qrcode-section {
	display: flex !important;
	justify-content: center !important;
	align-items: center !important;
	margin-top: 60px;
	padding: 0 40px;
	gap: 60px;
}

.qrcode-section .doctor-info {
	display: flex !important;
	flex-direction: column !important;
	align-items: center !important;
	text-align: center !important;
}

.qrcode-section .doctor-photo {
	margin-bottom: 15px;
}

.qrcode-section .doctor-photo img {
	width: 35mm;
	height: auto;
	max-height: 35mm;
	object-fit: contain;
	border-radius: 8px;
	box-shadow: none;
}

.qrcode-section .doctor-name {
	font-size: 14px !important;
	font-weight: 500;
	color: #303133;
	text-align: center !important;
	line-height: 1.4;
	max-width: 120px;
	word-wrap: break-word;
	white-space: normal;
}

/* 打印时的样式 */
@media print {
	.qrcode-section {
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
		margin-top: 60px;
		padding: 0 40px;
		gap: 60px;
		page-break-inside: avoid;
	}

	.qrcode-section .doctor-info {
		display: flex !important;
		flex-direction: column !important;
		align-items: center !important;
		text-align: center !important;
	}

	.qrcode-section .doctor-photo {
		margin-bottom: 15px;
	}

	.qrcode-section .doctor-photo img {
		width: 35mm;
		height: auto;
		max-height: 35mm;
		object-fit: contain;
		border-radius: 8px;
		box-shadow: none;
	}

	.qrcode-section .doctor-name {
		font-size: 14px !important;
		font-weight: 500;
		color: #303133;
		text-align: center !important;
		line-height: 1.4;
		max-width: 120px;
		word-wrap: break-word;
		white-space: normal;
	}
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
