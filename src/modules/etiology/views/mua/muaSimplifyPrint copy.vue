<template>
	<div class="stone-prescription-container">
		<!-- 固定在顶部的操作按钮区域 -->
		<div class="fixed-action-buttons">
			<el-button type="primary" :loading="loading" @click="toPDF" size="large">
				<el-icon><document /></el-icon>
				PDF预览
			</el-button>
			<el-button type="success" @click="printDirectly" size="large">
				<el-icon><printer /></el-icon>
				直接打印
			</el-button>
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
									>代谢评估技术是通过病史、影像检查、血液尿液分析、结石成分分析等，综合评估泌尿结石患者的代谢异常，诊断泌尿系结石病因的技术。研究表明：泌尿系结石是一种终生性疾病，5年复发率高达50%，10年高达50%，严重影响患者的身体健康。代谢评估可明确约95%患者的结石病因，针对病因进行个体化的防治（饮食疗法和药物疗法等），可使结石复发率降低至10%~15%。代谢评估每年应进行1-2次，调整预防方案并评估预防的有效性。
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
										<span class="value">{{ info.patientNo || '' }}</span>
									</div>
									<div class="info-item">
										<span class="label">评估级别：</span>
										<span class="value">简化评估</span>
									</div>
									<div class="info-item">
										<span class="label">评估次数：</span>
										<span class="value">{{ info.assessmentCount || '' }}</span>
									</div>
									<div class="info-item">
										<span class="label">电话：</span>
										<span class="value">{{ info.mobile || '' }}</span>
									</div>
								</div>
								<div class="info-row">
									<div class="info-item">
										<span class="label">姓名：</span>
										<span class="value">{{ info.name || '' }}</span>
									</div>
									<div class="info-item">
										<span class="label">性别：</span>
										<span class="value">{{ info.gender || '' }}</span>
									</div>
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
									<div class="info-item">
										<span class="label"></span>
										<span class="value"></span>
									</div>
								</div>
							</div>

							<hr class="content-divider" />

							<div class="patient-info">
								<div class="info-row">
									<div class="info-item">
										<span class="label">其他病史：</span>
										<span class="value">{{ info.otherHistory || '' }}</span>
									</div>
									<div class="info-item">
										<span class="label">家族史：</span>
										<span class="value">{{ info.familyHistory || '' }}</span>
									</div>
								</div>
								<div class="info-row">
									<div class="info-item">
										<span class="label">结石病史：</span>
										<span class="value">{{ info.stoneHistory || '' }}</span>
									</div>
								</div>
							</div>
							<hr class="content-divider" />
							<div class="patient-info">
								<div class="info-row">
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
												血液生化 &nbsp;&nbsp;&nbsp;&nbsp; 检测时间：{{
													bloodChemistryData.testDate ||
													formatDate(info.assessmentDate)
												}}
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

							<hr class="content-divider" />

							<!-- 尿常规及沉渣项目表格 -->
							<div class="urine-routine-section">
								<table class="urine-routine-table">
									<thead>
										<tr>
											<th colspan="4" class="table-title">
												尿常规及沉渣项目
											</th>
										</tr>
										<tr>
											<th>项目</th>
											<th>结果</th>
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
											<td>{{ item.resultValue }}</td>
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
											<td class="culture-result" colspan="2">
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

				<!-- 第四页：评估结果 -->
				<div class="a4-page" v-if="info.assessmentResult || info.treatmentSuggestion">
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
									<tbody>
										<tr>
											<td class="result-label" colspan="2">评估结果</td>
											<td class="result-content" colspan="6">
												{{ info.assessmentResult || '' }}
											</td>
										</tr>
										<tr>
											<td class="suggestion-label" colspan="2">防治建议</td>
											<td class="suggestion-content" colspan="6">
												{{ info.treatmentSuggestion || '' }}
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

		<!-- 原始的PDF内容区域，用于生成PDF，但在界面上隐藏 -->
		<div class="original-content" style="display: none">
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
								>代谢评估技术是通过病史、影像检查、血液尿液分析、结石成分分析等，综合评估泌尿结石患者的代谢异常，诊断泌尿系结石病因的技术。研究表明：泌尿系结石是一种终生性疾病，5年复发率高达50%，10年高达50%，严重影响患者的身体健康。代谢评估可明确约95%患者的结石病因，针对病因进行个体化的防治（饮食疗法和药物疗法等），可使结石复发率降低至10%~15%。代谢评估每年应进行1-2次，调整预防方案并评估预防的有效性。
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
									<span class="value">{{ info.patientNo || '' }}</span>
								</div>
								<div class="info-item">
									<span class="label">评估级别：</span>
									<span class="value">简化评估</span>
								</div>
								<div class="info-item">
									<span class="label">评估次数：</span>
									<span class="value">{{ info.assessmentCount || '' }}</span>
								</div>
								<div class="info-item">
									<span class="label">电话：</span>
									<span class="value">{{ info.mobile || '' }}</span>
								</div>
							</div>
							<div class="info-row">
								<div class="info-item">
									<span class="label">姓名：</span>
									<span class="value">{{ info.name || '' }}</span>
								</div>
								<div class="info-item">
									<span class="label">性别：</span>
									<span class="value">{{ info.gender || '' }}</span>
								</div>
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
								<div class="info-item">
									<span class="label"></span>
									<span class="value"></span>
								</div>
							</div>
						</div>

						<hr class="content-divider" />

						<div class="patient-info">
							<div class="info-row">
								<div class="info-item">
									<span class="label">其他病史：</span>
									<span class="value">{{ info.otherHistory || '' }}</span>
								</div>
								<div class="info-item">
									<span class="label">家族史：</span>
									<span class="value">{{ info.familyHistory || '' }}</span>
								</div>
							</div>
							<div class="info-row">
								<div class="info-item">
									<span class="label">结石病史：</span>
									<span class="value">{{ info.stoneHistory || '' }}</span>
								</div>
							</div>
						</div>
						<hr class="content-divider" />
						<div class="patient-info">
							<div class="info-row">
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
											血液生化 &nbsp;&nbsp;&nbsp;&nbsp; 检测时间：{{
												bloodChemistryData.testDate ||
												formatDate(info.assessmentDate)
											}}
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
										<td
											:class="{
												'abnormal-result': item.resultFlag === '1'
											}"
										>
											{{ item.resultValue }}
										</td>
										<td colspan="5">{{ item.referenceRange }}</td>
										<td>{{ item.unit }}</td>
									</tr>
								</tbody>
							</table>
						</div>

						<hr class="content-divider" />

						<!-- 尿常规及沉渣项目表格 -->
						<div class="urine-routine-section">
							<table class="urine-routine-table">
								<thead>
									<tr>
										<th colspan="4" class="table-title">尿常规及沉渣项目</th>
									</tr>
									<tr>
										<th>项目</th>
										<th>结果</th>
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
										<td
											:class="{
												'abnormal-result': item.resultFlag === '1'
											}"
										>
											{{ item.resultValue }}
										</td>
										<td>{{ item.referenceRange }}</td>
										<td>{{ item.unit }}</td>
									</tr>
									<tr
										v-for="(item, index) in urineRoutineData.itemsLast"
										:key="index"
									>
										<td class="culture-label">{{ item.name }}</td>
										<td class="culture-result" colspan="2">
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
								<tbody>
									<tr>
										<td class="result-label" colspan="2">评估结果</td>
										<td class="result-content" colspan="6">
											{{ info.assessmentResult || '' }}
										</td>
									</tr>
									<tr>
										<td class="suggestion-label" colspan="2">防治建议</td>
										<td class="suggestion-content" colspan="6">
											{{ info.treatmentSuggestion || '' }}
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

const { service } = useCool();
const route = useRoute();

// 获取URL参数
const swlNo = route.query.swlNo as string;
const serialNumber = route.query.serialNumber as string;
const patientNo = route.query.patientNo as string;
const assessmentCount = route.query.assessmentCount as string;
const moduleCode = 'mua1'; // 简化评估

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
	treatmentSuggestion: '',
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
				info.value.treatmentSuggestion = data.treatmentSuggestion || '';
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
			console.log('labResults:', labResults.value);

			// 加载完实验室数据后，提取血液生化和尿常规数据
			extractBloodChemistryData(labResults.value);
			extractUrineRoutineData(labResults.value);
		}
	} catch (error) {
		console.error('加载实验室检查结果失败:', error);
	}
};

/**
 * 从实验室检查结果中提取血液生化数据
 * @param labData 实验室检查结果数组
 */
const extractBloodChemistryData = (labData: any[]) => {
	try {
		console.log('extractBloodChemistryData - 输入数据:', labData);

		// 检查数据是否为数组
		if (!Array.isArray(labData)) {
			console.warn('extractBloodChemistryData - 输入数据不是数组:', typeof labData);
			return;
		}

		// 示例：设置检测时间
		if (info.value.assessmentDate) {
			bloodChemistryData.value.testDate = formatDate(info.value.assessmentDate);
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

		console.log('extractBloodChemistryData - 处理完成');
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
		console.log('extractUrineRoutineData - 输入数据:', labData);

		// 检查数据是否为数组
		if (!Array.isArray(labData)) {
			console.warn('extractUrineRoutineData - 输入数据不是数组:', typeof labData);
			return;
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

		if (info.value.component1Percent > 0) {
			let resultValue =
				info.value.component1Percent > 0
					? info.value.component1 + info.value.component1Percent + '%;'
					: '';
			resultValue +=
				info.value.component2Percent > 0
					? info.value.component2 + info.value.component2Percent + '%;'
					: '';
			resultValue +=
				info.value.component3Percent > 0
					? info.value.component3 + info.value.component3Percent + '%;'
					: '';
			resultValue +=
				info.value.component4Percent > 0
					? info.value.component4 + info.value.component4Percent + '%;'
					: '';
			urineRoutineData.value.itemsLast[1].resultValue = resultValue;
			urineRoutineData.value.itemsLast[1].testDate = info.value.analysisDate || '';
		}
		console.log('extractUrineRoutineData - 处理完成');
	} catch (error) {
		console.error('提取尿常规检查数据失败:', error);
	}
};

// 在组件挂载时加载数据
onMounted(async () => {
	await loadinfo();
	await loadLabResults(); // loadLabResults现在会自动调用数据提取函数
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
		console.log('开始生成PDF...');

		// 决定是否需要分页
		const needPagination = labResults.value && labResults.value.length > 2;
		console.log('是否需要分页:', needPagination);

		// 创建PDF实例
		const pdf = new JsPDF({
			orientation: 'p',
			unit: 'mm',
			format: 'a4'
		});
		console.log('PDF实例创建成功');

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
						cell.style.verticalAlign = 'middle';
						cell.style.textAlign = 'center';
						cell.style.lineHeight = '1.2';
						cell.style.padding = '8px 4px'; // 增加padding确保文字不贴边
						cell.style.height = 'auto';
						cell.style.minHeight = '30px';
					});

					// 调整表格样式
					const tables = clonedDoc.querySelectorAll('table');
					tables.forEach(table => {
						table.style.tableLayout = 'fixed';
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
				} catch (cloneError) {
					console.warn('Clone处理过程中出现错误:', cloneError);
				}
			}
		};

		// 获取所有页面 - 修复选择器，使用正确的页面结构
		const allPages = document.querySelectorAll('.a4-pages-container .a4-page');
		const pdfWidth = pdf.internal.pageSize.getWidth();

		console.log('找到页面数量:', allPages.length);
		console.log('PDF宽度:', pdfWidth);

		if (allPages.length === 0) {
			throw new Error('未找到可打印的页面内容');
		}

		for (let i = 0; i < allPages.length; i++) {
			const pageElement = allPages[i];
			console.log(`开始处理第${i + 1}页...`);

			if (!pageElement) {
				console.warn(`未找到第${i + 1}页元素`);
				continue;
			}

			// 如果不是第一页，添加新页
			if (i > 0) {
				pdf.addPage();
				console.log(`添加新页: 第${i + 1}页`);
			}

			try {
				// 渲染当前页 - 渲染整个页面而不是只渲染wrapper
				console.log(`开始渲染第${i + 1}页canvas...`);
				const pageCanvas = await html2canvas(pageElement as HTMLElement, canvasOptions);
				console.log(
					`第${i + 1}页canvas渲染完成, 尺寸:`,
					pageCanvas.width,
					'x',
					pageCanvas.height
				);

				// 当前页的图像数据
				const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0);
				console.log(`第${i + 1}页图像数据生成完成`);

				// 计算图像在PDF中的宽度和高度
				const pageImgWidth = pdfWidth;
				const pageImgHeight = (pageCanvas.height * pageImgWidth) / pageCanvas.width;
				console.log(`第${i + 1}页PDF尺寸:`, pageImgWidth, 'x', pageImgHeight);

				// 添加当前页内容到PDF
				pdf.addImage(pageImgData, 'JPEG', 0, 0, pageImgWidth, pageImgHeight);
				console.log(`第${i + 1}页添加到PDF完成`);
			} catch (pageError: unknown) {
				console.error(`第${i + 1}页处理失败:`, pageError);
				const errorMessage =
					pageError instanceof Error ? pageError.message : String(pageError);
				throw new Error(`第${i + 1}页处理失败: ${errorMessage}`);
			}
		}

		// 生成PDF Blob
		console.log('开始生成PDF Blob...');
		const pdfOutput = pdf.output('blob');
		console.log('PDF Blob生成完成, 大小:', pdfOutput.size, 'bytes');

		// 保存生成的Blob并创建URL
		pdfBlob.value = pdfOutput;
		pdfUrl.value = URL.createObjectURL(pdfOutput);
		console.log('PDF URL创建完成:', pdfUrl.value);

		ElMessage.success('PDF已生成');
	} catch (error) {
		console.error('PDF生成失败:', error);
		ElMessage.error('PDF生成失败: ' + (error instanceof Error ? error.message : String(error)));
	} finally {
		loading.value = false;
	}
}

// 直接使用浏览器打印功能
async function printDirectly() {
	try {
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

			// 获取HTML内容
			let htmlContent = stonePrescription.innerHTML;

			// 完全替换footer-content的内容，确保居中显示
			htmlContent = htmlContent.replace(
				/<div class="footer-content">[\s\S]*?<\/div>/g,
				'<div class="footer-content"><span>地址：深圳市深南中路3025号中山大学附属第八医院2号楼3楼　　电话：0755-83980763</span></div>'
			);

			// 使用字符串拼接，避免嵌套模板字符串的问题
			const fullHtmlContent =
				'<!DOCTYPE html>' +
				'<html>' +
				'<head>' +
				'<title>病因评估表打印</title>' +
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
				'.footer-content span { text-align: center !important; white-space: nowrap !important; }' +
				'.pdf-print-wrapper { flex: 1; overflow: hidden; padding: 5mm 0; }' +
				'.prescription-content { padding: 10mm 10mm; }' +
				'.prescription-header { text-align: center; margin-bottom: 20px; }' +
				'.prescription-header h1 { font-size: 24px; font-weight: bold; margin-bottom: 8px; }' +
				'.preface { margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #409eff; border-radius: 4px; }' +
				'.preface p { margin: 0; line-height: 1.6; text-align: justify; text-indent: 0; font-size: 18px; color: #303133; }' +
				'.preface strong { color: #409eff; font-weight: bold; }' +
				'.patient-info { margin-bottom: 15px; }' +
				'.info-row { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; margin-bottom: 10px; width: 100%; }' +
				'.info-item { flex: 1 !important; min-width: 0; display: flex !important; flex-direction: row !important; align-items: center !important; }' +
				'.info-item .label { font-weight: bold; min-width: 60px; padding-right: 5px; white-space: nowrap; }' +
				'.info-item .value { flex: 1; word-break: break-word; }' +
				'.content-divider { border: 0; height: 1px; background-color: #ddd; margin: 15px 0 20px 0; }' +
				'table { width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; }' +
				'table, th, td { border: 1px solid #000; }' +
				'th, td { padding: 5px; text-align: center !important; vertical-align: middle !important; line-height: 1.2; }' +
				'.blood-chemistry-section { margin-bottom: 20px; }' +
				'.blood-chemistry-table { width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 18px; margin-bottom: 20px; }' +
				'.blood-chemistry-table th { border: 1px solid #000; padding: 8px 4px; text-align: center; vertical-align: middle; background-color: #f5f7fa; font-weight: bold; }' +
				'.blood-chemistry-table .table-title { font-weight: bold; font-size: 20px; background-color: #e8f4f8; }' +
				'.blood-chemistry-table td { border: 1px solid #000; padding: 6px 3px; text-align: center; vertical-align: middle; height: 28px; min-height: 28px; }' +
				'.blood-chemistry-table td:first-child, .blood-chemistry-table td:nth-child(5) { font-weight: 500; background-color: #fafafa; }' +
				'.blood-chemistry-table .abnormal-result { color: #f56c6c; font-weight: bold; background-color: #fef0f0; }' +
				'.urine-routine-section { margin-bottom: 20px; }' +
				'.urine-routine-table { width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 18px; margin-bottom: 10px; }' +
				'.urine-routine-table th { border: 1px solid #000; padding: 6px 3px; text-align: center; vertical-align: middle; background-color: #f5f7fa; font-weight: bold; }' +
				'.urine-routine-table .table-title { font-weight: bold; font-size: 20px; background-color: #e8f4f8; }' +
				'.urine-routine-table td { border: 1px solid #000; padding: 6px 3px; text-align: center; vertical-align: middle; height: 28px; min-height: 28px; }' +
				'.urine-routine-table .item-name { font-weight: 500; background-color: #fafafa; text-align: left; padding-left: 8px; }' +
				'.assessment-result-section { margin-bottom: 20px; }' +
				'.assessment-result-table { width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 14px; }' +
				'.assessment-result-table td { border: 1px solid #000; padding: 8px 6px; vertical-align: middle; min-height: 32px; }' +
				'.assessment-result-table .result-label { font-weight: bold; background-color: #f5f7fa; width: 25%; text-align: center; }' +
				'.assessment-result-table .result-content { text-align: left; padding-left: 12px; width: 75%; }' +
				'.assessment-result-table .suggestion-label { font-weight: bold; background-color: #f5f7fa; width: 25%; text-align: center; }' +
				'.assessment-result-table .suggestion-content { text-align: left; padding-left: 12px; width: 75%; min-height: 48px; }' +
				'.assessment-result-table .signature-row { width: 12.5%; text-align: center; background-color: #fafafa; padding: 6px 3px; }' +
				'.center-title { text-align: center; margin-bottom: 40px; padding-top: 20px; }' +
				'.center-title h1 { font-size: 22px; font-weight: bold; color: #303133; line-height: 1.4; margin: 0; }' +
				'.center-introduction { text-align: center; margin-bottom: 60px; padding: 0 20px; }' +
				'.center-introduction p { font-size: 16px; line-height: 1.8; color: #303133; margin: 0; text-indent: 0; }' +
				'.doctors-section { display: flex; justify-content: center; align-items: center; margin-top: 80px; padding: 0 40px; gap: 60px; }' +
				'.doctor-info { display: flex; flex-direction: column; align-items: center; text-align: center; }' +
				'.doctor-photo { margin-bottom: 20px; }' +
				'.doctor-photo img { width: 40mm; height: auto; max-height: 60mm; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }' +
				'.page-three-content { max-height: calc(297mm - 15mm - 12mm - 15mm); overflow: hidden; }' +
				'.page-three-content .blood-chemistry-section { margin-bottom: 10px; }' +
				'.page-three-content .blood-chemistry-table { margin-bottom: 10px; font-size: 12px; }' +
				'.page-three-content .blood-chemistry-table thead th { padding: 4px 2px; height: 25px; line-height: 1.1; }' +
				'.page-three-content .blood-chemistry-table tbody td { padding: 4px 2px; height: 25px; min-height: 25px; line-height: 1.1; font-size: 12px; }' +
				'.page-three-content .content-divider { margin: 8px 0 10px 0; }' +
				'.page-three-content .urine-routine-section { margin-bottom: 5px; }' +
				'.page-three-content .urine-routine-table { margin-bottom: 0px; font-size: 12px; }' +
				'.page-three-content .urine-routine-table thead th { padding: 4px 2px; height: 25px; line-height: 1.1; }' +
				'.page-three-content .urine-routine-table tbody td { padding: 3px 2px; height: 24px; min-height: 24px; line-height: 1.1; font-size: 11px; }' +
				'.doctor-name { font-size: 18px; font-weight: bold; color: #303133; margin-top: 10px; }' +
				'.page-indicator { display: none; }' +
				'@media print { .stone-prescription { padding: 0; } .a4-page { margin: 0; box-shadow: none; } th, td { text-align: center !important; vertical-align: middle !important; } .info-row { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; } .info-item { flex: 1 !important; display: flex !important; } }' +
				'</style>' +
				'<script>' +
				'document.addEventListener("DOMContentLoaded", function() {' +
				'console.log("iframe DOM loaded");' +
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
				// 图片已经使用原始路径，无需特殊处理
				'console.log("直接打印模式，使用原始图片路径");' +
				'});' +
				'<\/script>' +
				'</head>' +
				"<body onload=\"window.print(); setTimeout(function(){window.parent.postMessage('print-finished', '*')}, 1000);\">" +
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

// 格式化日期
const formatDate = (dateString: string) => {
	if (!dateString) return '';
	return dayjs(dateString).format('YYYY-MM-DD');
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
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
		box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
		transition: all 0.3s;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
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
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		// 页码指示器
		.page-indicator {
			position: absolute;
			top: 5mm;
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
			padding: 0 15mm;
			border-top: 1px solid #e4e7ed;
			background-color: #fafafa;
			flex-shrink: 0;
			margin-top: auto;

			.footer-content {
				text-align: center;
				font-size: 12px;
				color: #666666;
				line-height: 1.4;

				span {
					display: inline-block;
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
			margin-bottom: 20px;
			padding: 15px;
			background-color: #f9f9f9;
			border-left: 4px solid #409eff;
			border-radius: 4px;

			p {
				margin: 0;
				line-height: 1.6;
				text-align: justify;
				text-indent: 0;
				font-size: 18px; // 从14px增加到18px，加大两个号
				color: #303133;

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

		// 血液生化检查表格
		.blood-chemistry-section {
			margin-bottom: 20px;

			.blood-chemistry-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #000;
				font-size: 18px;

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
			text-align: center;
			margin-bottom: 60px;
			padding: 0 20px;

			p {
				font-size: 16px;
				line-height: 1.8;
				color: #303133;
				margin: 0;
				text-indent: 0;
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
		border: 2px solid #000;
		font-size: 14px;

		tbody {
			td {
				border: 1px solid #000;
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
</style>
