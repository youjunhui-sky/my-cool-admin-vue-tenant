<template>
	<div class="stone-prescription-container">
		<!-- 固定在顶部的操作按钮区域 -->
		<div class="fixed-action-buttons">
			<el-button type="primary" :loading="loading" @click="toPDF" size="large">
				<el-icon><document /></el-icon>
				打印预览
			</el-button>
		</div>

		<!-- 主内容区域 -->
		<div class="stone-prescription">
			<!-- PDF内容区域 -->
			<div class="pdf-print-wrapper">
				<div class="prescription-content">
					<!-- 标题 -->
					<div class="prescription-header">
						<h1>泌尿结石科碎石中心</h1>
						<h1>体外冲击波碎石（SWL)治疗记录</h1>
					</div>

					<!-- 患者基本信息 -->
					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">姓名：</span>
								<span class="value">{{ recordInfo.name || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">性别：</span>
								<span class="value">{{ recordInfo.gender || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">年龄：</span>
								<span class="value">{{ recordInfo.age || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">门诊号/住院号：</span>
								<span class="value">{{
									recordInfo.outpatientNo || recordInfo.inpatientNo
								}}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">碎石号：</span>
								<span class="value">{{ recordInfo.swlNo || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">序列号：</span>
								<span class="value">{{ recordInfo.sequenceNo || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">期号：</span>
								<span class="value">{{ recordInfo.episode || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">床号：</span>
								<span class="value">{{ recordInfo.bedNo || '' }}</span>
							</div>
						</div>
					</div>

					<hr class="content-divider" />

					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">诊断：</span>
								<span class="value">{{ recordInfo.preopDiagnosis || '' }}</span>
							</div>
						</div>
					</div>

					<div class="patient-info"><div class="info-row"></div></div>

					<hr class="content-divider" />

					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">治疗方案：</span>
								<span class="value">{{ recordInfo.preopTherapy || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">支架管：</span>
								<span class="value">{{ recordInfo.stentType || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">术前准备：</span>
								<span class="value">{{ recordInfo.preopPreparation || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">治疗结石数：</span>
								<span class="value">{{ recordInfo.stoneCount || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">治疗部位一：</span>
								<span class="value">{{ recordInfo.position1 || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">治疗部位二：</span>
								<span class="value">{{ recordInfo.position2 || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">机型：</span>
								<span class="value"
									>{{ recordInfo.machine1 || '' }}+{{
										recordInfo.machine2 || ''
									}}</span
								>
							</div>
							<div class="info-item">
								<span class="label">部位一结石大小：</span>
								<span class="value"
									>{{ recordInfo.stoneSizeFront1 || '' }}*{{
										recordInfo.stoneSizeBack1 || ''
									}}</span
								>
							</div>
							<div class="info-item">
								<span class="label">部位二结石大小：</span>
								<span class="value"
									>{{ recordInfo.stoneSizeFront2 || '' }}*{{
										recordInfo.stoneSizeBack2 || ''
									}}</span
								>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">定位方式：</span>
								<span class="value">{{ recordInfo.targetingMethod || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">部位一治疗深度：</span>
								<span class="value">{{ recordInfo.depth1 || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">部位二治疗深度：</span>
								<span class="value">{{ recordInfo.depth2 || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">透视KV：</span>
								<span class="value">{{ recordInfo.fluoroscopyKV || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">透视MA：</span>
								<span class="value">{{ recordInfo.maValue || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">电压（级能）：</span>
								<span class="value">{{ recordInfo.voltage || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">脉冲频率：</span>
								<span class="value">{{ recordInfo.pulseRate || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">冲击次数：</span>
								<span class="value">{{ recordInfo.shockwaveCount || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">治疗体位：</span>
								<span class="value">{{ recordInfo.bodyPosition || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">结石对冲击波反应：</span>
								<span class="value">{{ recordInfo.stoneResponse || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">术中不良反应：</span>
								<span class="value">{{ recordInfo.noAdverseReaction || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">疼痛指数：</span>
								<span class="value">{{ recordInfo.painScore || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">术中处理：</span>
								<span class="value">{{ recordInfo.intraopManagement || '' }}</span>
							</div>
						</div>
					</div>
					<hr class="content-divider" />

					<div class="patient-info">
						<!-- 手术图片 - 术前图片和术后图片 -->
						<div class="images-container">
							<div class="image-section" v-if="recordInfo.preopImages">
								<div class="image-wrapper">
									<img
										:src="formatImageUrl(recordInfo.preopImages)"
										alt="术前图片"
										class="medical-image"
										@click="previewImage(recordInfo.preopImages)"
									/>
								</div>
							</div>

							<div class="image-section" v-if="recordInfo.postopImages">
								<div class="image-wrapper">
									<img
										:src="formatImageUrl(recordInfo.postopImages)"
										alt="术后图片"
										class="medical-image"
										@click="previewImage(recordInfo.postopImages)"
									/>
								</div>
							</div>
						</div>
					</div>

					<hr class="content-divider" />
					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">治疗医师：</span>
								<span class="value">{{ recordInfo.doctor || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">治疗日期：</span>
								<span class="value">{{ recordInfo.treatmentTime || '' }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- PDF预览弹窗 -->
			<el-dialog
				v-model="pdfDialogVisible"
				title="治疗记录预览"
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

			<!-- 图片预览组件 -->
			<component
				:is="ImageViewer"
				v-if="imageViewerVisible"
				:url-list="urlList"
				:initial-index="0"
				@close="imageViewerVisible = false"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { ElImageViewer as ImageViewer } from 'element-plus';
import { Printer, Download, Document } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import dayjs from 'dayjs';
import { useBase } from '/@/modules/base';
import { useRoute } from 'vue-router';
import { service } from '/@/cool';

// 导入URL工具函数
import { formatImageUrl } from '/@/modules/base/utils/url';

const { user } = useBase();

const route = useRoute();

// 获取URL参数
const id = route.query.id as string;
//console.log('id=============:', id);

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

// 图片预览相关
const imageViewerVisible = ref(false);
const currentImageUrl = ref('');
const urlList = ref<string[]>([]);

// 在组件挂载时加载数据
onMounted(() => {
	loadinfo();
});

const recordInfo = ref({
	name: '',
	gender: '',
	age: '',
	outpatientNo: '',
	inpatientNo: '',
	bedNo: '',
	swlNo: '',
	serialNumber: '',
	sequenceNo: '',
	episode: '',
	preopDiagnosis: '',
	position1: '',
	location1: '',
	depth1: '',
	stoneSizeFront1: '',
	stoneSizeBack1: '',
	stoneArea1: '',
	position2: '',
	location2: '',
	depth2: '',
	stoneSizeFront2: '',
	stoneSizeBack2: '',
	stoneArea2: '',
	stoneCount: '',
	preopTherapy: '',
	preopPreparation: '',
	stentType: '',
	machine1: '',
	machine2: '',
	bodyPosition: '',
	targetingMethod: '',
	voltage: '',
	shockwaveCount: '',
	fluoroscopyKV: '',
	pulseRate: '',
	stoneResponse: '',
	maValue: '',
	noAdverseReaction: '',
	hasSkinBleeding: '',
	hasNausea: '',
	hasRadiationPain: '',
	otherAdverseReaction: '',
	painScore: '',
	preopImages: '',
	postopImages: '',
	intraopManagement: '',
	doctor: '',
	treatmentCost: '',
	treatmentTime: ''
});

const loadinfo = async () => {
	try {
		//console.log('id:', id);
		const res = await service.swl.treatment.info({ id: id });
		//console.log('res:', res);
		if (res) {
			recordInfo.value.name = res.name || '';
			recordInfo.value.gender = Number(res.gender) === 1 ? '男' : '女';
			recordInfo.value.age = res.age || '';
			recordInfo.value.swlNo = res.swlNo || '';
			recordInfo.value.outpatientNo = res.outpatientNo || '';
			recordInfo.value.inpatientNo = res.inpatientNo || '';
			recordInfo.value.bedNo = res.bedNo || '';
			recordInfo.value.serialNumber = res.serialNumber || '';
			recordInfo.value.sequenceNo = res.sequenceNo || '';
			recordInfo.value.episode = res.episode || '';
			recordInfo.value.preopDiagnosis = res.preopDiagnosis || '';
			recordInfo.value.position1 = res.position1 || '';
			recordInfo.value.location1 = res.location1 || '';
			recordInfo.value.depth1 = res.depth1 || '';
			recordInfo.value.stoneSizeFront1 =
				Number(res.stoneSizeFront1) > 0 ? res.stoneSizeFront1 + '' : '';
			recordInfo.value.stoneSizeBack1 =
				Number(res.stoneSizeBack1) > 0 ? res.stoneSizeBack1 + '' : '';
			recordInfo.value.stoneArea1 = Number(res.stoneArea1) > 0 ? res.stoneArea1 + '' : '';
			recordInfo.value.position2 = res.position2 || '';
			recordInfo.value.location2 = res.location2 || '';
			recordInfo.value.depth2 = res.depth2 || '';
			recordInfo.value.stoneSizeFront2 =
				Number(res.stoneSizeFront2) > 0 ? res.stoneSizeFront2 + '' : '';
			recordInfo.value.stoneSizeBack2 =
				Number(res.stoneSizeBack2) > 0 ? res.stoneSizeBack2 + '' : '';
			recordInfo.value.stoneArea2 = Number(res.stoneArea2) > 0 ? res.stoneArea2 + '' : '';
			recordInfo.value.stoneCount = res.stoneCount || '';
			recordInfo.value.preopTherapy = res.preopTherapy || '';
			recordInfo.value.preopPreparation = res.preopPreparation || '';
			recordInfo.value.stentType = res.stentType || '';
			recordInfo.value.machine1 = res.machine1 || '';
			recordInfo.value.machine2 = res.machine2 || '';
			recordInfo.value.bodyPosition = res.bodyPosition || '';
			recordInfo.value.targetingMethod = res.targetingMethod || '';
			recordInfo.value.voltage = res.voltage || '';
			recordInfo.value.shockwaveCount = res.shockwaveCount || '';
			recordInfo.value.fluoroscopyKV = res.fluoroscopyKV || '';
			recordInfo.value.pulseRate = res.pulseRate || '';
			recordInfo.value.stoneResponse = res.stoneResponse || '';
			recordInfo.value.maValue = res.maValue || '';

			let noAdverseReaction = '';
			if (Number(res.noAdverseReaction) === 0) {
				if (Number(res.hasSkinBleeding) === 1) {
					noAdverseReaction += '皮肤渗血/瘀斑;';
				}
				if (Number(res.hasNausea) === 1) {
					noAdverseReaction += '恶心呕吐;';
				}
				if (Number(res.hasRadiationPain) === 1) {
					noAdverseReaction += '放射痛;';
				}
				if (Number(res.otherAdverseReaction) === 1) {
					noAdverseReaction += '其他;';
				}
			} else {
				noAdverseReaction = '无';
			}
			recordInfo.value.noAdverseReaction = noAdverseReaction;
			recordInfo.value.painScore = res.painScore || '';
			recordInfo.value.preopImages = res.preopImages || '';
			recordInfo.value.postopImages = res.postopImages || '';
			recordInfo.value.intraopManagement = res.intraopManagement || '';
			recordInfo.value.doctor = res.doctor || '';
			recordInfo.value.treatmentCost =
				Number(res.treatmentCost) > 0 ? res.treatmentCost + '元' : '';
			recordInfo.value.treatmentTime =
				res.treatmentTime !== null ? dayjs(res.treatmentTime).format('YYYY-MM-DD') : '';
		}
	} catch (error) {
		console.error('加载数据失败:', error);
		ElMessage.error(
			'加载数据失败: ' + (error instanceof Error ? error.message : String(error))
		);
	}
};

// 关闭对话框时清理资源
function handleClose() {
	pdfDialogVisible.value = false;
	// 释放 Blob URL
	if (pdfUrl.value) {
		URL.revokeObjectURL(pdfUrl.value);
		pdfUrl.value = '';
	}
}

// 生成PDF并在弹窗中显示
async function toPDF() {
	loading.value = true;
	pdfDialogVisible.value = true;

	try {
		// 先获取目标元素
		const element = document.querySelector('.pdf-print-wrapper');
		if (!element) {
			throw new Error('未找到要打印的元素');
		}

		// 创建canvas，使用高scale值以获得清晰的文字
		const canvas = await html2canvas(element as HTMLElement, {
			scale: 1.5, // 高清晰度
			useCORS: true,
			logging: false
		});

		// 创建PDF实例
		const pdf = new JsPDF({
			orientation: 'p',
			unit: 'mm',
			format: 'a4'
		});

		// 处理图像
		const url = canvas.toDataURL('JPEG', 1.0);

		// 获取PDF页面尺寸
		const imgWidth = pdf.internal.pageSize.getWidth();
		const imgHeight = (canvas.height * imgWidth) / canvas.width;

		// 创建临时图像计算尺寸
		const img = new Image();
		img.src = url;

		// 确保图像加载完成后再添加到PDF
		await new Promise(resolve => {
			img.onload = resolve;
		});

		// 处理可能的多页情况
		let startY = 0;
		const pageHeight = pdf.internal.pageSize.getHeight();

		while (startY < imgHeight) {
			// 计算当前页应绘制的高度
			const remainingHeight = imgHeight - startY;
			const height = Math.min(remainingHeight, pageHeight);

			// 添加图像
			pdf.addImage(url, 'JPEG', 0, -startY, imgWidth, imgHeight, undefined, 'NONE');

			startY += height;

			// 如果还有内容，添加新页
			if (startY < imgHeight) {
				pdf.addPage();
			}
		}

		// 生成PDF Blob而不保存文件
		const pdfOutput = pdf.output('blob');

		// 保存生成的Blob并创建URL
		pdfBlob.value = pdfOutput;
		pdfUrl.value = URL.createObjectURL(pdfOutput);

		ElMessage.success('PDF已生成');
	} catch (error) {
		console.error('PDF生成失败:', error);
		ElMessage.error('PDF生成失败: ' + (error instanceof Error ? error.message : String(error)));
	} finally {
		loading.value = false;
	}
}

// 图片预览功能
function previewImage(url: string) {
	if (!url) return;
	currentImageUrl.value = url;
	urlList.value = [url]; // 设置URL列表
	imageViewerVisible.value = true;
}
</script>

<style lang="scss">
.stone-prescription-container {
	height: 100vh;
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

	// PDF打印区域
	.pdf-print-wrapper {
		background-color: white;
		border: 1px solid #ddd;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
		margin-bottom: 20px;
		padding: 0;
		width: 210mm;
		min-height: 297mm;
		max-width: 100%;
	}

	.prescription-content {
		padding: 5mm 5mm;

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

			.qrcode-container {
				display: flex;
				justify-content: center;
				margin: 15px 0;

				.qrcode-image {
					width: 120px;
					height: 120px;
					object-fit: contain;
				}
			}
		}

		// 健康指导图片的居中样式
		.qrcode-centered {
			width: 100% !important;
			text-align: center !important;
			display: flex !important;
			justify-content: center !important;
			margin: 20px auto !important;
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
			margin-top: 10px;
			text-align: center;
			font-size: 12px;
			color: #666;
		}

		// 图片容器样式
		.images-container {
			display: flex;
			flex-wrap: wrap;
			gap: 20px;
			margin: 15px 0;
			justify-content: center;

			.image-section {
				flex: 1;
				min-width: 250px;
				max-width: 45%;
				margin-bottom: 15px;

				.image-title {
					font-size: 16px;
					font-weight: bold;
					margin-bottom: 10px;
					text-align: center;
				}

				.image-wrapper {
					display: flex;
					justify-content: center;
					align-items: center;
					border: 1px solid #eee;
					padding: 5px;
					background-color: #f9f9f9;

					.medical-image {
						max-width: 100%;
						max-height: 200px;
						object-fit: contain;
						cursor: pointer;
						transition: transform 0.3s ease;

						&:hover {
							transform: scale(1.02);
							box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
						}
					}
				}
			}

			@media (max-width: 768px) {
				flex-direction: column;

				.image-section {
					max-width: 100%;
				}
			}
		}
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
}
</style>
