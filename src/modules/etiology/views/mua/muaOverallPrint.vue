<template>
	<div class="stone-prescription-container">
		<!-- 固定在顶部的操作按钮区域 -->
		<div class="fixed-action-buttons">
			<el-button type="primary" :loading="loading" @click="toPDF" size="large">
				<el-icon><document /></el-icon>
				PDF预览
			</el-button>
			<!-- <el-button type="success" @click="printDirectly" size="large">
				<el-icon><printer /></el-icon>
				直接打印
			</el-button> -->
		</div>

		<div class="stone-prescription">
			<!-- PDF内容区域 -->
			<div class="a4-pages-container">
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
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
										<span class="value">{{
											formatGender(info.gender) || ''
										}}</span>
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
										<span class="value">{{
											formatDate(info.birthDate) || ''
										}}</span>
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
										<span class="value">{{
											formatCheckMethod(info) || ''
										}}</span>
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
										<span class="value">{{
											formatDate(info.analysisDate) || ''
										}}</span>
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
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
										<tr
											v-for="(item, index) in bloodChemistryData.items"
											:key="index"
										>
											<td>
												{{ item.leftItem.name }}
											</td>
											<td
												:class="{
													'abnormal-result':
														item.leftItem.resultFlag === '1'
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
													'abnormal-result':
														item.rightItem.resultFlag === '1'
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
											<th colspan="7" class="table-title">
												尿常规及沉渣项目
											</th>
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
										<tr
											v-for="(item, index) in urineRoutineData.items"
											:key="index"
										>
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
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
										<tr
											v-for="(item, index) in urineAnalysisData.items"
											:key="index"
										>
											<td class="item-name">
												{{ item.leftItem.name }}
											</td>
											<td
												:class="{
													'abnormal-result':
														item.leftItem.resultFlag1 === '1'
												}"
											>
												{{ item.leftItem.resultValue1 }}
											</td>
											<td
												:class="{
													'abnormal-result':
														item.leftItem.resultFlag2 === '1'
												}"
											>
												{{ item.leftItem.resultValue2 }}
											</td>
											<td
												:class="{
													'abnormal-result':
														item.leftItem.resultFlag3 === '1'
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
													'abnormal-result':
														item.rightItem.resultFlag1 === '1'
												}"
											>
												{{ item.rightItem.resultValue1 }}
											</td>
											<td
												:class="{
													'abnormal-result':
														item.rightItem.resultFlag2 === '1'
												}"
											>
												{{ item.rightItem.resultValue2 }}
											</td>
											<td
												:class="{
													'abnormal-result':
														item.rightItem.resultFlag3 === '1'
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
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
											<td
												class="suggestion-content"
												colspan="7"
												style="white-space: pre-wrap"
											>
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
												<span class="signature-value">{{
													info.doctor || ''
												}}</span>
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
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
									<div class="doctor-name">
										关注深圳冲击波碎石研究所，可联系我们
									</div>
								</div>
								<div class="doctor-info">
									<div class="doctor-photo">
										<img
											src="/qrcode2.png"
											alt="关注中山大学附属第八医院，可预约就诊"
										/>
									</div>
									<div class="doctor-name">
										关注中山大学附属第八医院，可预约就诊
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
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 电话：0755-83980763</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- PDF预览弹窗 -->
		<el-dialog
			v-model="pdfDialogVisible"
			title="预览"
			:width="'80%'"
			:before-close="handleClose"
			destroy-on-close
		>
			<div class="pdf-preview-container">
				<iframe
					v-if="pdfUrl"
					:src="pdfUrl"
					frameborder="0"
					width="100%"
					height="600"
				></iframe>
				<div v-else class="pdf-loading">PDF 生成中...</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Printer, Download, Document } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { useCool } from '/@/cool';
import MuaLabForm from './mua-lab-form.vue'; // 导入实验室检查结果组件
import { generatePDF, createPdfPreviewUrl, releasePdfPreviewUrl } from '../../utils/pdfUtils'; // 导入PDF工具类
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

const { service } = useCool();
const route = useRoute();

// 获取URL参数
const swlNo = route.query.swlNo as string;
const serialNumber = route.query.serialNumber as string;
const patientNo = route.query.patientNo as string;
const assessmentCount = route.query.assessmentCount as string;
const moduleCode = 'mua2'; // 全面评估

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
	ultrasound: '',
	ct: '',
	ctValue: '',
	mri: '',
	kub: '',
	ivu: '',
	ctu: '',
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

// 加载患者信息
const loadinfo = async () => {
	try {
		if (patientNo) {
			const params = {
				swlNo,
				serialNumber,
				assessmentType: moduleCode,
				assessmentCount
			};
			// 使用正确的service路径获取患者信息
			const data = await service.etiology.info.findBySwlNo(params);
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
				info.value.ultrasound = Number(data.hasUltrasound) === 1 ? '是' : '';
				info.value.ct = data.ctValue || '';
				info.value.mri = Number(data.hasMRI) === 1 ? '是' : '';
				info.value.kub = Number(data.hasKUB) === 1 ? '是' : '';
				info.value.ivu = Number(data.hasIVU) === 1 ? '是' : '';
				info.value.ctu = Number(data.hasCTU) === 1 ? '是' : '';
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
			}
		}
	} catch (error) {
		console.error('加载患者信息失败:', error);
	}
};

// 加载实验室检查结果
const loadLabResults = async () => {
	try {
		const params = {
			swlNo,
			serialNumber,
			moduleCode,
			type: 'list', //分组
			assessmentCount
		};
		const data = await service.swl.lab.list(params);

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
		console.error('提取血液生化检查数据失败:', error);
	}
};

/**
 * 从实验室检查结果中提取尿常规数据
 * @param labData 实验室检查结果数组
 */
const extractUrineRoutineData = async (labData: any[]) => {
	try {
		//console.log('extractUrineRoutineData - 输入数据:', labData);

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
				bottom: '8%',
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
				bottom: '4%',
				style: {
					text: '顶部数字：各指标的最大刻度值',
					fontSize: 14,
					fill: '#333',
					textAlign: 'left'
				}
			},
			// 图表说明文字 - 底部数字说明
			{
				type: 'text',
				left: '10%',
				bottom: '0%',
				style: {
					text: '底部数字：各指标的最小刻度值',
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

/**
 * 检测第五页表格高度并自动调整防治建议字体大小
 */
const adjustTableHeight = () => {
	// 等待DOM渲染完成
	setTimeout(() => {
		try {
			// 查找第五页（评估结果页面）
			const assessmentPage = document.querySelector('.a4-page:nth-child(5)');
			if (!assessmentPage) return;

			// 获取A4页面的可用高度 (297mm - 页眉20mm - 页脚12mm - 内边距)
			const availableHeight = 297 - 20 - 12 - 20; // 约245mm
			const pixelRatio = 3.77953; // 1mm ≈ 3.77953px
			const availableHeightPx = availableHeight * pixelRatio;

			// 查找评估结果表格
			const assessmentTable = assessmentPage.querySelector(
				'.assessment-result-table'
			) as HTMLElement;
			if (!assessmentTable) return;

			// 获取表格实际高度
			const tableHeight = assessmentTable.scrollHeight;

			//console.log('第五页表格检测:', {
			// 	可用高度: availableHeightPx + 'px',
			// 	表格实际高度: tableHeight + 'px',
			// 	是否超出: tableHeight > availableHeightPx
			// });

			// 如果表格高度超出页面可用高度，则缩小防治建议的字体
			if (tableHeight > availableHeightPx) {
				const suggestionCells = assessmentTable.querySelectorAll('.suggestion-content');
				let currentFontSize = 14; // 当前默认字体大小
				const minFontSize = 10; // 最小字体大小

				// 逐步缩小字体直到表格适合页面或达到最小字体
				while (
					currentFontSize >= minFontSize &&
					assessmentTable.scrollHeight > availableHeightPx
				) {
					currentFontSize -= 0.5;

					suggestionCells.forEach(cell => {
						(cell as HTMLElement).style.fontSize = currentFontSize + 'px';
						(cell as HTMLElement).style.lineHeight = '1.3';
					});

					// 强制重排
					const _ = assessmentTable.offsetHeight;
				}

				//console.log('防治建议字体已调整为:', currentFontSize + 'px');

				// 如果仍然超出且已达到最小字体，则调整行高和间距
				if (
					assessmentTable.scrollHeight > availableHeightPx &&
					currentFontSize <= minFontSize
				) {
					suggestionCells.forEach(cell => {
						(cell as HTMLElement).style.lineHeight = '1.2';
						(cell as HTMLElement).style.padding = '6px 8px';
					});

					// 调整表格整体行高
					const allTableCells = assessmentTable.querySelectorAll('td');
					allTableCells.forEach(cell => {
						(cell as HTMLElement).style.padding = '6px 8px';
					});

					//console.log('已调整表格间距以适应页面高度');
				}
			}
		} catch (error) {
			console.warn('表格高度调整失败:', error);
		}
	}, 1000); // 延迟1秒确保数据加载完成
};

// 在组件挂载时加载数据
onMounted(async () => {
	await loadinfo();
	await loadLabResults(); // loadLabResults现在会自动调用数据提取函数

	// 调整表格高度
	adjustTableHeight();
});

// PDF生成状态
const loading = ref(false);
const pdfDialogVisible = ref(false);
const pdfUrl = ref('');
const pdfBlob = ref<any>(null);

// 当前日期和推荐复诊日期
const currentDate = computed(() => {
	return dayjs().format('YYYY年MM月DD日');
});

const followUpDate = computed(() => {
	return dayjs().add(1, 'month').format('YYYY年MM月DD日');
});

// 关闭对话框时清理资源
function handleClose() {
	pdfDialogVisible.value = false;
	// 释放 Blob URL
	if (pdfUrl.value) {
		releasePdfPreviewUrl(pdfUrl.value);
		pdfUrl.value = '';
	}
}

// 生成PDF并在弹窗中显示
async function toPDF() {
	loading.value = true;
	pdfDialogVisible.value = true;

	try {
		//console.log('开始生成PDF...');

		// 决定是否需要分页
		const needPagination = labResults.value && labResults.value.length > 2;
		//console.log('是否需要分页:', needPagination);

		// 创建PDF实例
		const pdf = new JsPDF({
			orientation: 'p',
			unit: 'mm',
			format: 'a4'
		});
		//console.log('PDF实例创建成功');

		// 定义Canvas配置，提高渲染质量和文字对齐
		const canvasOptions = {
			scale: 2, // 提高分辨率
			useCORS: true,
			logging: false,
			letterRendering: true, // 提高文字渲染质量
			allowTaint: true,
			backgroundColor: '#ffffff',
			// 解决文字下移和截断问题
			onclone: clonedDoc => {
				try {
					// 找到所有表格单元格，调整内部文字垂直对齐
					const tableCells = clonedDoc.querySelectorAll('td, th');
					tableCells.forEach(cell => {
						cell.style.verticalAlign = 'top';
						cell.style.textAlign = 'center';
						cell.style.lineHeight = '1.2';
						cell.style.height = 'auto';
						cell.style.minHeight = '30px';

						// 为th和td设置不同的padding
						if (cell.tagName.toLowerCase() === 'th') {
							cell.style.padding = '0px 4px 16px 4px'; // th的上padding继续减少到1px，让文字更靠上
						} else {
							cell.style.padding = '2px 4px 14px 4px'; // td的上padding从6px减少到3px，让文字更靠上
						}
					});

					// 特殊处理建议内容单元格，确保左对齐
					const suggestionCells = clonedDoc.querySelectorAll('.suggestion-content');
					suggestionCells.forEach(cell => {
						cell.style.setProperty('text-align', 'left', 'important');
						cell.style.setProperty('padding-left', '12px', 'important');
						cell.style.setProperty('white-space', 'pre-wrap', 'important');
						cell.style.setProperty('justify-content', 'flex-start', 'important');
						cell.style.setProperty('align-items', 'flex-start', 'important');
						cell.style.setProperty('display', 'block', 'important');
					});

					// 特殊处理assessment-result-table中的colspan单元格宽度
					const assessmentTables = clonedDoc.querySelectorAll('.assessment-result-table');
					assessmentTables.forEach(table => {
						// 设置表格为固定布局
						table.style.setProperty('table-layout', 'fixed', 'important');
						table.style.setProperty('width', '100%', 'important');

						// 强制设置colgroup列宽
						const colElements = table.querySelectorAll('col');
						colElements.forEach(col => {
							col.style.setProperty('width', '12.5%', 'important');
						});

						// 处理colspan=7的单元格（评估结果和防治建议内容列）
						const colspan7Cells = table.querySelectorAll('td[colspan="7"]');
						colspan7Cells.forEach(cell => {
							cell.style.setProperty('width', '87.5%', 'important'); // 7/8 = 87.5%
							cell.style.setProperty('min-width', '87.5%', 'important');
							cell.style.setProperty('max-width', '87.5%', 'important');
							cell.style.setProperty('display', 'table-cell', 'important');
						});

						// 处理标签列
						const labelCells = table.querySelectorAll(
							'.result-label, .suggestion-label'
						);
						labelCells.forEach(cell => {
							cell.style.setProperty('width', '12.5%', 'important');
							cell.style.setProperty('min-width', '12.5%', 'important');
							cell.style.setProperty('max-width', '12.5%', 'important');
							cell.style.setProperty('text-align', 'center', 'important');
							cell.style.setProperty('display', 'table-cell', 'important');
						});

						// 确保内容列正确显示
						const contentCells = table.querySelectorAll(
							'.result-content, .suggestion-content'
						);
						contentCells.forEach(cell => {
							cell.style.setProperty('width', '87.5%', 'important');
							cell.style.setProperty('min-width', '87.5%', 'important');
							cell.style.setProperty('max-width', '87.5%', 'important');
							cell.style.setProperty('display', 'table-cell', 'important');
							if (cell.classList.contains('suggestion-content')) {
								cell.style.setProperty('text-align', 'left', 'important');
								cell.style.setProperty('padding-left', '12px', 'important');
								cell.style.setProperty('white-space', 'pre-wrap', 'important');
							}
						});

						// 处理签名行的单元格
						const signatureCells = table.querySelectorAll('.signature-row');
						signatureCells.forEach(cell => {
							cell.style.setProperty('width', '12.5%', 'important');
							cell.style.setProperty('min-width', '12.5%', 'important');
							cell.style.setProperty('max-width', '12.5%', 'important');
							cell.style.setProperty('display', 'table-cell', 'important');
							cell.style.setProperty('text-align', 'center', 'important');
						});
					});

					// 确保表格布局和colspan属性正确处理
					const allTables = clonedDoc.querySelectorAll('table');
					allTables.forEach(table => {
						// 检查是否是血液生化表格或尿常规表格，如果是则使用auto布局
						if (
							table.classList.contains('blood-chemistry-table') ||
							table.classList.contains('urine-routine-table')
						) {
							table.style.setProperty('table-layout', 'auto', 'important');
						} else {
							table.style.setProperty('table-layout', 'fixed', 'important');
						}
						table.style.setProperty('width', '100%', 'important');
						table.style.setProperty('border-collapse', 'collapse', 'important');
					});

					// 调整表格样式
					const printTables = clonedDoc.querySelectorAll('table');
					printTables.forEach(table => {
						// 检查是否是血液生化表格或尿常规表格，如果是则使用auto布局
						if (
							table.classList.contains('blood-chemistry-table') ||
							table.classList.contains('urine-routine-table')
						) {
							table.style.tableLayout = 'auto';
						} else {
							table.style.tableLayout = 'fixed';
						}
						table.style.width = '100%';
						table.style.borderCollapse = 'collapse';
					});

					// 确保表格内的所有单元格内容居中
					const tableCellContents = clonedDoc.querySelectorAll('.cell');
					tableCellContents.forEach(cell => {
						cell.style.textAlign = 'center';
						cell.style.display = 'flex';
						cell.style.alignItems = 'center';
						cell.style.justifyContent = 'center';
						cell.style.lineHeight = '1.2';
						cell.style.padding = '0'; // 移除.cell的padding避免重复
						cell.style.height = '100%';
					});

					// 确保内容高度正确
					const labResultsElements = clonedDoc.querySelectorAll('.lab-results-section');
					labResultsElements.forEach(el => {
						el.style.height = 'auto';
						el.style.overflow = 'visible';
					});

					// 检测并调整第五页表格的防治建议字体大小
					const clonedAssessmentTable = clonedDoc.querySelector(
						'.assessment-result-table'
					) as HTMLElement;
					if (clonedAssessmentTable) {
						// A4页面高度约为1122px (297mm * 3.77953)
						const maxTableHeight = 900; // 留出页眉页脚和边距的空间

						if (clonedAssessmentTable.scrollHeight > maxTableHeight) {
							const suggestionCells =
								clonedAssessmentTable.querySelectorAll('.suggestion-content');
							let fontSize = 14;
							const minFontSize = 10;

							while (
								fontSize >= minFontSize &&
								clonedAssessmentTable.scrollHeight > maxTableHeight
							) {
								fontSize -= 0.5;
								suggestionCells.forEach(cell => {
									(cell as HTMLElement).style.setProperty(
										'font-size',
										fontSize + 'px',
										'important'
									);
									(cell as HTMLElement).style.setProperty(
										'line-height',
										'1.3',
										'important'
									);
								});
								// 强制重排
								const _ = clonedAssessmentTable.offsetHeight;
							}

							// 如果仍然超出，进一步调整间距
							if (
								clonedAssessmentTable.scrollHeight > maxTableHeight &&
								fontSize <= minFontSize
							) {
								suggestionCells.forEach(cell => {
									(cell as HTMLElement).style.setProperty(
										'line-height',
										'1.2',
										'important'
									);
									(cell as HTMLElement).style.setProperty(
										'padding',
										'6px 8px',
										'important'
									);
								});

								const allCells = clonedAssessmentTable.querySelectorAll('td');
								allCells.forEach(cell => {
									(cell as HTMLElement).style.setProperty(
										'padding',
										'6px 8px',
										'important'
									);
								});
							}
						}
					}
				} catch (cloneError) {
					console.warn('Clone处理过程中出现错误:', cloneError);
				}
			}
		};

		// 获取所有页面 - 修复选择器，使用正确的页面结构
		const allPages = document.querySelectorAll('.a4-pages-container .a4-page');
		const pdfWidth = pdf.internal.pageSize.getWidth();

		//console.log('找到页面数量:', allPages.length);
		//console.log('PDF宽度:', pdfWidth);

		if (allPages.length === 0) {
			throw new Error('未找到可打印的页面内容');
		}

		for (let i = 0; i < allPages.length; i++) {
			const pageElement = allPages[i];
			//console.log(`开始处理第${i + 1}页...`);

			if (!pageElement) {
				console.warn(`未找到第${i + 1}页元素`);
				continue;
			}

			// 如果不是第一页，添加新页
			if (i > 0) {
				pdf.addPage();
				//console.log(`添加新页: 第${i + 1}页`);
			}

			try {
				// 渲染当前页 - 渲染整个页面而不是只渲染wrapper
				//console.log(`开始渲染第${i + 1}页canvas...`);
				const pageCanvas = await html2canvas(pageElement as HTMLElement, canvasOptions);
				//console.log(
				// 	`第${i + 1}页canvas渲染完成, 尺寸:`,
				// 	pageCanvas.width,
				// 	'x',
				// 	pageCanvas.height
				// );

				// 当前页的图像数据
				const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0);
				//console.log(`第${i + 1}页图像数据生成完成`);

				// 计算图像在PDF中的宽度和高度
				const pageImgWidth = pdfWidth;
				const pageImgHeight = (pageCanvas.height * pageImgWidth) / pageCanvas.width;
				//console.log(`第${i + 1}页PDF尺寸:`, pageImgWidth, 'x', pageImgHeight);

				// 添加当前页内容到PDF
				pdf.addImage(pageImgData, 'JPEG', 0, 0, pageImgWidth, pageImgHeight);
				//console.log(`第${i + 1}页添加到PDF完成`);
			} catch (pageError: unknown) {
				console.error(`第${i + 1}页处理失败:`, pageError);
				const errorMessage =
					pageError instanceof Error ? pageError.message : String(pageError);
				throw new Error(`第${i + 1}页处理失败: ${errorMessage}`);
			}
		}

		// 生成PDF Blob
		//console.log('开始生成PDF Blob...');
		const pdfOutput = pdf.output('blob');
		//console.log('PDF Blob生成完成, 大小:', pdfOutput.size, 'bytes');

		// 保存生成的Blob并创建URL
		pdfBlob.value = pdfOutput;
		pdfUrl.value = URL.createObjectURL(pdfOutput);
		//console.log('PDF URL创建完成:', pdfUrl.value);

		ElMessage.success('PDF已生成');
	} catch (error) {
		console.error('PDF生成失败:', error);
		ElMessage.error('PDF生成失败: ' + (error instanceof Error ? error.message : String(error)));
	} finally {
		loading.value = false;
	}
}

/**
 * 直接使用浏览器打印功能
 * 本页面显示什么样的，该方法在frame中就显示什么样的
 *
 * @description 该方法创建一个隐藏的iframe，将当前页面的完整内容复制到iframe中，
 * 并将所有图表转换为图片，确保打印时显示的内容与原页面完全一致
 */
async function printDirectly() {
	try {
		// 查找可打印的内容区域
		const stonePrescription = document.querySelector('.stone-prescription');
		if (!stonePrescription) {
			throw new Error('找不到可打印的内容');
		}

		ElMessage.info('正在准备打印，请稍候...');

		// 创建一个用于打印的iframe
		const printIframe = document.createElement('iframe');
		printIframe.style.position = 'fixed';
		printIframe.style.top = '-9999px';
		printIframe.style.left = '-9999px';
		printIframe.style.width = '210mm';
		printIframe.style.height = '297mm';
		printIframe.style.border = 'none';
		printIframe.name = 'print-iframe';
		printIframe.id = 'print-iframe';
		document.body.appendChild(printIframe);

		// 设置一个超时器，如果60秒内没有完成打印，则移除iframe
		const timeoutId = setTimeout(() => {
			if (document.body.contains(printIframe)) {
				document.body.removeChild(printIframe);
			}
		}, 60000);

		// 监听从iframe发来的消息
		const messageHandler = (event: MessageEvent) => {
			if (event.data === 'print-finished') {
				window.removeEventListener('message', messageHandler);
				if (document.body.contains(printIframe)) {
					document.body.removeChild(printIframe);
				}
				clearTimeout(timeoutId);
			}
		};
		window.addEventListener('message', messageHandler);

		// 确保iframe已加载完成
		if (printIframe.contentWindow) {
			const iframeDoc = printIframe.contentWindow.document;
			iframeDoc.open();

			// 等待页面完全渲染，确保所有元素都已加载
			await new Promise(resolve => setTimeout(resolve, 800));

			// 处理图表转换为图片 - 扩展选择器以覆盖更多图表类型
			const chartElements = stonePrescription.querySelectorAll(
				'.urine-chart, v-chart, [class*="chart"], .echarts-container, [id*="chart"]'
			);
			//console.log('找到的图表元素数量:', chartElements.length);

			const chartImages: { element: Element; dataUrl: string }[] = [];

			// 等待图表渲染完成，然后将所有图表转换为图片
			await new Promise(resolve => setTimeout(resolve, 1000));

			for (const chartElement of chartElements) {
				try {
					let echartsInstance = null;
					let dataUrl = '';

					// 方法1: 从 Vue 组件实例获取
					const vueInstance = (chartElement as any).__vueParentComponent;
					if (vueInstance?.exposed?.chart) {
						echartsInstance = vueInstance.exposed.chart;
					}

					// 方法2: 从 DOM 元素获取 ECharts 实例
					if (!echartsInstance) {
						const canvas = chartElement.querySelector('canvas');
						if (canvas) {
							echartsInstance = (canvas as any).__echarts_instance__;

							if (!echartsInstance && (window as any).echarts) {
								echartsInstance = (window as any).echarts.getInstanceByDom(canvas);
							}
						}
					}

					// 方法3: 使用 chartOption 重新创建图表实例
					if (!echartsInstance && chartOption?.value) {
						try {
							const tempCanvas = document.createElement('canvas');
							tempCanvas.width = 800;
							tempCanvas.height = 400;
							tempCanvas.style.position = 'absolute';
							tempCanvas.style.left = '-9999px';
							tempCanvas.style.top = '-9999px';
							document.body.appendChild(tempCanvas);

							if ((window as any).echarts) {
								const tempInstance = (window as any).echarts.init(tempCanvas);
								tempInstance.setOption(chartOption.value);
								tempInstance.resize();
								await new Promise(resolve => setTimeout(resolve, 1000));

								dataUrl = tempInstance.getDataURL({
									type: 'png',
									pixelRatio: 2,
									backgroundColor: '#fff'
								});

								tempInstance.dispose();
								document.body.removeChild(tempCanvas);

								chartImages.push({ element: chartElement, dataUrl });
								//console.log('通过重新创建实例获取图表成功');
								continue;
							}
						} catch (error) {
							console.error('重新创建图表实例失败:', error);
						}
					}

					// 方法4: 从现有实例获取图片
					if (echartsInstance && typeof (echartsInstance as any).resize === 'function') {
						(echartsInstance as any).resize();
						await new Promise(resolve => setTimeout(resolve, 300));

						if (typeof (echartsInstance as any).getDataURL === 'function') {
							dataUrl = (echartsInstance as any).getDataURL({
								type: 'png',
								pixelRatio: 2,
								backgroundColor: '#fff'
							});
						}
						chartImages.push({ element: chartElement, dataUrl });
						//console.log('从现有实例获取图表成功');
					} else {
						// 备用方案：创建占位图表
						const placeholderDataUrl = await createStaticChartImage();
						chartImages.push({ element: chartElement, dataUrl: placeholderDataUrl });
						//console.log('使用占位图表');
					}
				} catch (error) {
					console.warn('图表转换为图片失败:', error);
					const placeholderDataUrl = await createStaticChartImage();
					chartImages.push({ element: chartElement, dataUrl: placeholderDataUrl });
				}
			}

			// 克隆HTML内容以确保完整性
			let htmlContent = stonePrescription.outerHTML;

			// 替换图表元素为图片
			if (chartImages.length > 0) {
				//console.log('开始替换图表，共', chartImages.length, '个图表');
				chartImages.forEach(({ element, dataUrl }, index) => {
					const chartHtml = `<img src="${dataUrl}" style="width: 100%; height: 500px; border: 1px solid #c8c8c8; border-radius: 4px; display: block;" alt="24小时尿液检测指标分析图表" />`;

					// 多种替换策略
					let replaced = false;

					// 策略1: 替换urine-chart class的div
					const urineChartRegex =
						/<div[^>]*class="[^"]*urine-chart[^"]*"[^>]*>[\s\S]*?<\/div>/g;
					if (htmlContent.match(urineChartRegex)) {
						htmlContent = htmlContent.replace(urineChartRegex, chartHtml);
						replaced = true;
					}

					// 策略2: 替换v-chart标签
					if (!replaced) {
						const vchartRegex = /<v-chart[^>]*>[\s\S]*?<\/v-chart>/g;
						if (htmlContent.match(vchartRegex)) {
							htmlContent = htmlContent.replace(vchartRegex, chartHtml);
							replaced = true;
						}
					}

					// 策略3: 替换图表容器
					if (!replaced) {
						const chartSectionRegex =
							/<div[^>]*class="[^"]*urine-analysis-chart-section[^"]*"[^>]*>[\s\S]*?<\/div>/g;
						if (htmlContent.match(chartSectionRegex)) {
							htmlContent = htmlContent.replace(
								/<div([^>]*class="[^"]*urine-analysis-chart-section[^"]*"[^>]*)>([\s\S]*?)<\/div>/g,
								`<div$1><div class="chart-title" style="font-size: 16px; font-weight: bold; margin-bottom: 10px; text-align: center;">24小时尿液检测指标分析图表</div>${chartHtml}</div>`
							);
							replaced = true;
						}
					}

					// 策略4: 替换任何包含chart的元素
					if (!replaced) {
						const anyChartRegex =
							/<[^>]*class="[^"]*chart[^"]*"[^>]*>[\s\S]*?<\/[^>]*>/g;
						if (htmlContent.match(anyChartRegex)) {
							htmlContent = htmlContent.replace(anyChartRegex, chartHtml);
							replaced = true;
						}
					}

					//console.log(`第${index + 1}个图表替换: ${replaced ? '成功' : '失败'}`);
				});
			} else {
				console.warn('没有找到图表元素，尝试插入占位图表');

				// 插入占位图表
				const placeholderChart = `
					<div class="urine-analysis-chart-section" style="margin-top: 10px; margin-bottom: 20px; page-break-inside: avoid;">
						<div class="chart-title" style="font-size: 16px; font-weight: bold; margin-bottom: 10px; text-align: center;">
							24小时尿液检测指标分析图表
						</div>
						<div style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
							<div style="text-align: center; color: #666;">
								<div style="font-size: 24px; margin-bottom: 10px;">📊</div>
								<div style="font-size: 18px;">24小时尿液检测指标分析图表</div>
								<div style="font-size: 14px; margin-top: 5px; color: #999;">图表数据准备中...</div>
							</div>
						</div>
					</div>
				`;

				// 查找图表区域位置并替换或插入
				const chartSectionRegex =
					/<div[^>]*class="[^"]*urine-analysis-chart-section[^"]*"[^>]*>[\s\S]*?<\/div>/g;
				if (htmlContent.match(chartSectionRegex)) {
					htmlContent = htmlContent.replace(chartSectionRegex, placeholderChart);
					//console.log('已插入占位图表到现有图表区域');
				} else {
					// 如果找不到合适的位置，插入到24小时尿检表格后面
					const urineTableRegex =
						/(<table[^>]*class="[^"]*urine-analysis-table[^"]*"[^>]*>[\s\S]*?<\/table>)/g;
					if (htmlContent.match(urineTableRegex)) {
						htmlContent = htmlContent.replace(
							urineTableRegex,
							`$1\n${placeholderChart}`
						);
						//console.log('已插入占位图表到尿检表格后');
					} else {
						// 如果连表格都找不到，就插入到第三页内容末尾
						const pageThreeRegex =
							/(<div[^>]*class="[^"]*page-three-content[^"]*"[^>]*>[\s\S]*?)(<\/div>)/g;
						htmlContent = htmlContent.replace(
							pageThreeRegex,
							`$1${placeholderChart}$2`
						);
						//console.log('已插入占位图表到第三页末尾');
					}
				}
			}

			// 确保页脚内容正确显示
			htmlContent = htmlContent.replace(
				/<div class="footer-content">[\s\S]*?<\/div>/g,
				'<div class="footer-content"><span>地址：深圳市深南中路3025号中山大学附属第八医院2号楼3楼　　电话：0755-83980763</span></div>'
			);

			// 移除操作按钮（打印时不需要显示）
			htmlContent = htmlContent.replace(
				/<div[^>]*class="[^"]*fixed-action-buttons[^"]*"[^>]*>[\s\S]*?<\/div>/g,
				''
			);

			// 构建完整的HTML文档，包含所有必要的样式和脚本
			const fullHtmlContent =
				'<!DOCTYPE html>' +
				'<html lang="zh-CN">' +
				'<head>' +
				'<meta charset="UTF-8">' +
				'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
				'<title>泌尿系结石代谢评估报告 - 打印</title>' +
				'<style>' +
				'@page { size: A4 portrait; margin: 0mm; }' +
				'body { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 0; font-size: 14px; line-height: 1.4; color: #000; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
				'.stone-prescription { padding: 0; margin: 0; }' +
				'.a4-pages-container { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 0; margin-bottom: 0; }' +
				'.a4-page { page-break-after: always; position: relative; box-sizing: border-box; width: 210mm; min-height: 297mm; overflow: hidden; background-color: white; box-shadow: none; display: flex; flex-direction: column; }' +
				'.a4-page:last-child { page-break-after: auto; }' +
				'.page-header { width: 100%; height: 15mm; display: flex; justify-content: space-between; align-items: center; padding: 0 15mm; border-bottom: 1px solid #e4e7ed; background-color: #fafafa; flex-shrink: 0; }' +
				'.header-left { display: flex; align-items: center; }' +
				'.header-logo { height: 16mm; width: auto; max-width: 50mm; object-fit: contain; display: block; }' +
				'.header-right { display: flex; align-items: center; gap: 8px; margin-right: 20mm; }' +
				'.header-text { font-weight: bold; color: #303133; text-align: center; line-height: 1.2; }' +
				'.header-text-line1 { font-size: 16px; margin-bottom: 2px; }' +
				'.header-text-line2 { font-size: 14px; }' +
				'.header-icon-container { display: flex; align-items: center; }' +
				'.header-icon { height: 14mm; width: auto; max-width: 35mm; object-fit: contain; display: block; }' +
				'img { max-width: 100%; height: auto; display: block; }' +
				'.page-footer { width: 100%; height: 12mm; display: flex !important; justify-content: center !important; align-items: center !important; padding: 0 !important; border-top: 1px solid #e4e7ed; background-color: #fafafa; flex-shrink: 0; margin-top: auto; }' +
				'.footer-content { width: 100% !important; text-align: center !important; font-size: 12px; color: #666666; line-height: 1.4; display: flex !important; justify-content: center !important; align-items: center !important; }' +
				'.footer-content span { display: inline-block !important; text-align: center !important; white-space: nowrap !important; }' +
				'.pdf-print-wrapper { flex: 1; overflow: hidden; padding: 5mm 0; }' +
				'.prescription-content { padding: 10mm 10mm; }' +
				'.prescription-header { text-align: center; margin-bottom: 20px; }' +
				'.prescription-header h1 { font-size: 24px; font-weight: bold; margin-bottom: 8px; }' +
				'.preface { margin-top: 280px; margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #409eff; border-radius: 4px; }' +
				'.preface p { margin: 0 0 15px 0; line-height: 1.6; text-align: justify; text-indent: 0; font-size: 18px; color: #303133; }' +
				'.preface p:last-child { margin-bottom: 0; }' +
				'.preface strong { color: #409eff; font-weight: bold; }' +
				'.patient-info { margin-bottom: 15px; }' +
				'.info-row { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; margin-bottom: 10px; width: 100%; }' +
				'.info-item { flex: 1 !important; min-width: 0; display: flex !important; flex-direction: row !important; align-items: center !important; }' +
				'.info-item .label { font-weight: bold; min-width: 60px; padding-right: 5px; white-space: nowrap; }' +
				'.info-item .value { flex: 1; word-break: break-word; }' +
				'.content-divider { border: 0; height: 1px; background-color: #ddd; margin: 15px 0 20px 0; }' +
				'table { width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; }' +
				'table, th, td { border: 1px solid #d0d0d0; }' +
				'th, td { padding: 0; text-align: center !important; vertical-align: middle !important; line-height: 1.2; display: table-cell; }' +
				'.blood-chemistry-section { margin-bottom: 20px; }' +
				'.blood-chemistry-table { width: 100%; border-collapse: collapse; border: 2px solid #d0d0d0; font-size: 16px; margin-bottom: 20px; }' +
				'.blood-chemistry-table th { border: 1px solid #d0d0d0; padding: 0; text-align: center; vertical-align: middle; background-color: #f5f7fa; font-weight: bold; height: 40px; }' +
				'.blood-chemistry-table .table-title { font-weight: bold; font-size: 20px; background-color: #e8f4f8; }' +
				'.blood-chemistry-table td { border: 1px solid #d0d0d0; padding: 0 3px; text-align: center; vertical-align: middle; height: 30px; line-height: 30px; }' +
				'.blood-chemistry-table td:first-child, .blood-chemistry-table td:nth-child(5) { font-weight: 500; background-color: #fafafa; }' +
				'.blood-chemistry-table .abnormal-result { color: #f56c6c; font-weight: bold; background-color: #fef0f0; }' +
				'.urine-routine-section { margin-bottom: 20px; }' +
				'.urine-routine-table { width: 100%; border-collapse: collapse; border: 2px solid #d0d0d0; font-size: 16px; margin-bottom: 10px; }' +
				'.urine-routine-table th { border: 1px solid #d0d0d0; padding: 0; text-align: center; vertical-align: middle; background-color: #f5f7fa; font-weight: bold; height: 40px; line-height: 40px; }' +
				'.urine-routine-table .table-title { font-weight: bold; font-size: 20px; background-color: #e8f4f8; }' +
				'.urine-routine-table td { border: 1px solid #d0d0d0; padding: 0 3px; text-align: center; vertical-align: middle; height: 30px; line-height: 30px; }' +
				'.urine-routine-table .item-name { font-weight: 500; background-color: #fafafa; text-align: left; padding-left: 8px; }' +
				'.assessment-result-section { margin-bottom: 20px; }' +
				'.assessment-result-table { width: 100%; border-collapse: collapse; border: 2px solid #d0d0d0; font-size: 14px; }' +
				'.assessment-result-table td { border: 1px solid #d0d0d0; padding: 6px 6px 8px 6px; vertical-align: middle; min-height: 32px; }' +
				'.assessment-result-table .result-label { font-weight: bold; background-color: #f5f7fa; width: 25%; text-align: center; }' +
				'.assessment-result-table .result-content { text-align: left; padding-left: 12px; width: 75%; }' +
				'.assessment-result-table .suggestion-label { font-weight: bold; background-color: #f5f7fa; width: 25%; text-align: center; }' +
				'.assessment-result-table .suggestion-content { text-align: left; padding-left: 12px; width: 75%; min-height: 48px; }' +
				'.assessment-result-table .signature-row { width: 12.5%; text-align: center; background-color: #fafafa; padding: 6px 3px; }' +
				'.center-title { text-align: center; margin-bottom: 40px; padding-top: 20px; }' +
				'.center-title h1 { font-size: 22px; font-weight: bold; color: #303133; line-height: 1.4; margin: 0; }' +
				'.center-introduction { text-align: left; margin-bottom: 60px; padding: 0 20px; }' +
				'.center-introduction p { font-size: 16px; line-height: 1.8; color: #303133; margin: 0; text-indent: 2em; }' +
				'.doctors-section { display: flex; justify-content: center; align-items: center; margin-top: 80px; padding: 0 40px; gap: 60px; }' +
				'.doctor-info { display: flex; flex-direction: column; align-items: center; text-align: center; }' +
				'.doctor-photo { margin-bottom: 20px; }' +
				'.doctor-photo img { width: 40mm; height: auto; max-height: 60mm; object-fit: cover; border-radius: 8px; box-shadow: none; }' +
				'.page-three-content { overflow: visible; }' +
				'.page-three-content .urine-analysis-section { margin-bottom: 10px; }' +
				'.page-three-content .urine-analysis-table { width: 100%; border-collapse: collapse; border: 2px solid #d0d0d0; font-size: 16px; margin-bottom: 10px; }' +
				'.page-three-content .urine-analysis-table th { border: 1px solid #d0d0d0; padding: 0 2px; text-align: center; vertical-align: middle; background-color: #f5f7fa; font-weight: bold; height: 25px; line-height: 25px; }' +
				'.page-three-content .urine-analysis-table .table-title { font-weight: bold; font-size: 14px; background-color: #e8f4f8; }' +
				'.page-three-content .urine-analysis-table td { border: 1px solid #d0d0d0; padding: 0 2px; text-align: center; vertical-align: middle; height: 25px; line-height: 25px; font-size: 16px; }' +
				'.page-three-content .urine-analysis-table .item-name { font-weight: 500; background-color: #fafafa; text-align: left; padding-left: 6px; }' +
				'.page-three-content .urine-analysis-table .abnormal-result { color: #f56c6c; font-weight: bold; background-color: #fef0f0; }' +
				'.page-three-content .blood-chemistry-section { margin-bottom: 10px; }' +
				'.page-three-content .blood-chemistry-table { margin-bottom: 10px; font-size: 16px; }' +
				'.page-three-content .blood-chemistry-table thead th { padding: 0 2px; height: 25px; line-height: 25px; }' +
				'.page-three-content .blood-chemistry-table tbody td { padding: 0 2px; height: 25px; line-height: 25px; font-size: 16px; }' +
				'.page-three-content .content-divider { margin: 8px 0 10px 0; }' +
				'.page-three-content .empty-line { height: 20px; line-height: 20px; margin: 0; padding: 0; }' +
				'.page-three-content .urine-routine-section { margin-bottom: 5px; }' +
				'.page-three-content .urine-routine-table { margin-bottom: 0px; font-size: 16px; }' +
				'.page-three-content .urine-routine-table thead th { padding: 0 2px; height: 25px; line-height: 25px; }' +
				'.page-three-content .urine-routine-table tbody td { padding: 0 2px; height: 24px; line-height: 24px; font-size: 16px; }' +
				'.urine-analysis-chart-section { margin-top: 10px; margin-bottom: 20px; page-break-inside: avoid; }' +
				'.urine-analysis-chart-section .chart-title { font-size: 16px; font-weight: bold; margin-bottom: 20px; text-align: center; color: #333; }' +
				'.urine-analysis-chart-section .urine-chart { width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px; }' +
				'.urine-analysis-chart-section canvas { max-width: 100%; height: auto; }' +
				'.urine-analysis-chart-section img { max-width: 100%; height: auto; display: block; }' +
				'.chart-description { margin-top: 5px; padding: 10px; background-color: #f8f9fa; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 12px; line-height: 1.5; text-align: center; }' +
				'.chart-description-title { font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #333; }' +
				'.chart-description-item { margin-bottom: 4px; display: flex; align-items: flex-start; justify-content: center; }' +
				'.chart-description-item .blue-circle { color: #2B5A8A; font-weight: bold; margin-right: 8px; flex-shrink: 0; }' +
				'.chart-description-item .red-circle { color: #e74c3c; font-weight: bold; margin-right: 8px; flex-shrink: 0; }' +
				'.chart-description-item .risk-text { color: #333; font-weight: bold; }' +
				'.urine-chart { width: 100% !important; height: 100% !important; }' +
				'div[style*="border: 1px solid #c8c8c8"] { border: 1px solid #c8c8c8 !important; }' +
				'.doctor-name { font-size: 18px; font-weight: bold; color: #303133; margin-top: 10px; }' +
				'.page-indicator { display: none; }' +
				'@media print { .stone-prescription { padding: 0; } .a4-page { margin: 0; box-shadow: none; } th, td { text-align: center !important; vertical-align: middle !important; padding: 0 3px !important; display: table-cell !important; } th { line-height: 40px !important; } td { line-height: 30px !important; } .info-row { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; } .info-item { flex: 1 !important; display: flex !important; } }' +
				'</style>' +
				'<script>' +
				'document.addEventListener("DOMContentLoaded", function() {' +
				'//console.log("iframe DOM loaded");' +
				'const infoRows = document.querySelectorAll(".info-row");' +
				'infoRows.forEach(row => {' +
				'row.style.display = "flex";' +
				'row.style.flexDirection = "row";' +
				'row.style.flexWrap = "nowrap";' +
				'});' +
				'const infoItems = document.querySelectorAll(".info-item");' +
				'infoItems.forEach(item => {' +
				'item.style.flex = "1";' +
				'item.style.display = "flex";' +
				'item.style.flexDirection = "row";' +
				'item.style.alignItems = "center";' +
				'});' +
				'const tableCells = document.querySelectorAll("td, th");' +
				'tableCells.forEach(cell => {' +
				'cell.style.textAlign = "center";' +
				'cell.style.verticalAlign = "middle";' +
				'});' +
				// 检测并调整第五页表格的防治建议字体大小
				'setTimeout(function() {' +
				'try {' +
				'const assessmentTable = document.querySelector(".assessment-result-table");' +
				'if (assessmentTable) {' +
				'const maxTableHeight = 900;' +
				'if (assessmentTable.scrollHeight > maxTableHeight) {' +
				'const suggestionCells = assessmentTable.querySelectorAll(".suggestion-content");' +
				'let fontSize = 14;' +
				'const minFontSize = 10;' +
				'while (fontSize >= minFontSize && assessmentTable.scrollHeight > maxTableHeight) {' +
				'fontSize -= 0.5;' +
				'suggestionCells.forEach(function(cell) {' +
				'cell.style.fontSize = fontSize + "px";' +
				'cell.style.lineHeight = "1.3";' +
				'});' +
				'assessmentTable.offsetHeight;' +
				'}' +
				'if (assessmentTable.scrollHeight > maxTableHeight && fontSize <= minFontSize) {' +
				'suggestionCells.forEach(function(cell) {' +
				'cell.style.lineHeight = "1.2";' +
				'cell.style.padding = "6px 8px";' +
				'});' +
				'const allCells = assessmentTable.querySelectorAll("td");' +
				'allCells.forEach(function(cell) {' +
				'cell.style.padding = "6px 8px";' +
				'});' +
				'}' +
				'//console.log("防治建议字体已调整为:", fontSize + "px");' +
				'}' +
				'}' +
				'} catch (error) {' +
				'console.warn("表格高度调整失败:", error);' +
				'}' +
				'}, 500);' +
				'//console.log("打印页面初始化完成");' +
				'});' +
				'<\/script>' +
				'</head>' +
				"<body onload=\"setTimeout(function(){window.print(); setTimeout(function(){window.parent.postMessage('print-finished', '*')}, 1000);}, 500);\">" +
				htmlContent +
				'</body>' +
				'</html>';

			iframeDoc.write(fullHtmlContent);
			iframeDoc.close();
		} else {
			throw new Error('无法访问iframe内容窗口');
		}
	} catch (error: unknown) {
		console.error('打印失败', error);
		ElMessage.error(`打印失败: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * 创建静态图表图片
 * 当无法获取ECharts实例时，使用chartOption数据创建静态图表
 */
async function createStaticChartImage(): Promise<string> {
	//console.log('开始创建静态图表图片...');

	try {
		// 如果有chartOption数据，使用它创建图表
		if (chartOption.value && (window as any).echarts) {
			//console.log('使用 chartOption 创建静态图表', chartOption.value);

			const tempCanvas = document.createElement('canvas');
			tempCanvas.width = 800;
			tempCanvas.height = 400;

			// 将canvas添加到DOM中以确保正确渲染
			tempCanvas.style.position = 'absolute';
			tempCanvas.style.left = '-9999px';
			tempCanvas.style.top = '-9999px';
			document.body.appendChild(tempCanvas);

			const tempInstance = (window as any).echarts.init(tempCanvas);
			tempInstance.setOption(chartOption.value);

			// 强制重绘并等待渲染完成
			tempInstance.resize();
			await new Promise(resolve => setTimeout(resolve, 1000));

			// 获取图片数据
			const dataUrl = tempInstance.getDataURL({
				type: 'png',
				pixelRatio: 2,
				backgroundColor: '#fff'
			});

			// 清理
			tempInstance.dispose();
			document.body.removeChild(tempCanvas);

			//console.log('静态图表创建成功', dataUrl.substring(0, 50) + '...');
			return dataUrl;
		} else {
			console.warn('chartOption 为空或 ECharts 未加载:', {
				hasChartOption: !!chartOption.value,
				hasEcharts: !!(window as any).echarts
			});
		}
	} catch (error) {
		console.warn('创建静态图表失败:', error);
	}

	// 备用方案：创建一个占位图片
	const placeholderSvg = `
		<svg xmlns="http://www.w3.org/2000/svg" width="800" height="350" viewBox="0 0 800 350">
			<rect width="800" height="350" fill="#f5f5f5" stroke="#ddd"/>
			<text x="400" y="160" text-anchor="middle" font-family="Arial" font-size="24" fill="#666">
				24小时尿液检测指标分析图表
			</text>
			<text x="400" y="190" text-anchor="middle" font-family="Arial" font-size="16" fill="#999">
				图表数据准备中...
			</text>
		</svg>
	`;

	// 使用 encodeURIComponent 替代 btoa 来处理包含中文的字符串
	return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(placeholderSvg);
}

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

// 判断检查结果是否异常
const isAbnormalResult = (result: string, reference: string) => {
	if (!result || !reference) return false;

	const numResult = parseFloat(result);
	if (isNaN(numResult)) return false;

	// 处理不同格式的参考范围
	if (reference.includes('-')) {
		// 范围格式：如 "3.5-5.1"
		const [min, max] = reference.split('-').map(val => parseFloat(val.trim()));
		return numResult < min || numResult > max;
	} else if (reference.startsWith('<')) {
		// 小于格式：如 "<11.5"
		const maxVal = parseFloat(reference.substring(1));
		return numResult >= maxVal;
	} else if (reference.startsWith('>')) {
		// 大于格式：如 ">15"
		const minVal = parseFloat(reference.substring(1));
		return numResult <= minVal;
	}

	return false;
};
</script>

<style lang="scss">
.stone-prescription-container {
	height: calc(100vh - 100px); // 考虑到 tab 头部、父容器边距和其他元素的高度
	overflow-y: auto;
	padding: 0;
	margin: 0;
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: #f0f2f5; // 添加一个轻微的背景色

	/* 自定义滚动条样式 */
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

	// 媒体查询，针对小屏幕设备
	@media (max-width: 768px) {
		height: 100%;
		min-height: 100vh;

		.pdf-print-wrapper {
			width: 100% !important;
			margin: 0 auto !important;
		}
	}
}

/* 固定在顶部的操作按钮样式 */
.fixed-action-buttons {
	position: sticky;
	top: 0;
	z-index: 100;
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 15px 0;
	background-color: #f0f2f5;
	box-shadow: none;
	margin-bottom: 5px;

	.el-button {
		min-width: 180px;
		font-weight: bold;
		padding: 12px 25px;
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		box-shadow: none;
		transition: all 0.3s;

		&:hover {
			transform: translateY(-2px);
			box-shadow: none;
		}
	}

	@media (max-width: 768px) {
		padding: 10px 0;

		.el-button {
			min-width: 160px;
			padding: 10px 20px;
			font-size: 14px;
		}
	}
}

.stone-prescription {
	padding: 20px;
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 5px; /* 增加与顶部按钮的距离 */

	// A4页面容器
	.a4-pages-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
		margin-bottom: 40px;
	}

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
					padding-left: 12px;
					width: 75%;
					min-height: 60px;
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
</style>
