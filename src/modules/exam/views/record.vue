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
						<h1>泌尿系结石超声（定位、随访）记录</h1>
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
								<span class="label">超声号：</span>
								<span class="value">{{ recordInfo.ultrasoundNo || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">档案号：</span>
								<span class="value">{{ recordInfo.patientNo || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">科室：</span>
								<span class="value">{{ recordInfo.department || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">床号：</span>
								<span class="value">{{ recordInfo.bedNo || '' }}</span>
							</div>
						</div>
					</div>

					<hr class="content-divider" />

					<div class="patient-info">
						<div
							class="images-container"
							:class="{
								'single-image': imageCount === 1,
								'double-image': imageCount === 2,
								'triple-image': imageCount === 3
							}"
						>
							<div class="image-section" v-if="recordInfo.image1">
								<div class="image-wrapper">
									<img
										:src="formatImageUrl(recordInfo.image1)"
										class="medical-image"
										@click="previewImage(recordInfo.image1)"
									/>
								</div>
							</div>

							<div class="image-section" v-if="recordInfo.image2">
								<div class="image-wrapper">
									<img
										:src="formatImageUrl(recordInfo.image2)"
										class="medical-image"
										@click="previewImage(recordInfo.image2)"
									/>
								</div>
							</div>

							<div class="image-section" v-if="recordInfo.image3">
								<div class="image-wrapper">
									<img
										:src="formatImageUrl(recordInfo.image3)"
										class="medical-image"
										@click="previewImage(recordInfo.image3)"
									/>
								</div>
							</div>
						</div>
					</div>

					<hr class="content-divider" />
					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">超声所见：</span>
								<span class="value">{{ recordInfo.findings || '' }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-item"></div>
						</div>
						<div class="info-row">
							<div class="info-item">
								<span class="label">超声提示：</span>
								<span class="value">{{ recordInfo.ultrasoundNote || '' }}</span>
							</div>
						</div>
					</div>

					<hr class="content-divider" />
					<div class="patient-info">
						<div class="info-row">
							<div class="info-item">
								<span class="label">检查医师：</span>
								<span class="value">{{ recordInfo.doctor || '' }}</span>
							</div>
							<div class="info-item">
								<span class="label">检查日期：</span>
								<span class="value">{{ recordInfo.examDate || '' }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- PDF预览弹窗 -->
			<el-dialog
				v-model="pdfDialogVisible"
				title="B超报告预览"
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

// 计算图片数量
const imageCount = computed(() => {
	let count = 0;
	if (recordInfo.value.image1) count++;
	if (recordInfo.value.image2) count++;
	if (recordInfo.value.image3) count++;
	return count;
});

// 在组件挂载时加载数据
onMounted(() => {
	loadinfo();
});

const recordInfo = ref({
	patientNo: '',
	ultrasoundNo: '',
	name: '',
	gender: '',
	age: '',
	outpatientNo: '',
	inpatientNo: '',
	bedNo: '',
	department: '',
	fee: '',
	findings: '',
	ultrasoundNote: '',
	doctor: '',
	examDate: '',
	image1: '',
	image2: '',
	image3: ''
});

const loadinfo = async () => {
	try {
		//console.log('id:', id);
		const res = await service.imgexam.info.info({ id: id });
		//console.log('res:', res);
		if (res) {
			recordInfo.value.patientNo = res.patientNo || '';
			recordInfo.value.ultrasoundNo = res.ultrasoundNo || '';
			recordInfo.value.name = res.name || '';
			recordInfo.value.gender = Number(res.gender) === 1 ? '男' : '女';
			recordInfo.value.age = res.age || '';
			recordInfo.value.department = res.department || '';
			recordInfo.value.fee = Number(res.fee) > 0 ? res.fee + '元' : '';
			recordInfo.value.findings = res.findings || '';
			recordInfo.value.ultrasoundNote = res.ultrasoundNote || '';
			recordInfo.value.doctor = res.doctor || '';
			recordInfo.value.examDate =
				res.examDate !== null ? dayjs(res.examDate).format('YYYY-MM-DD') : '';
			recordInfo.value.image1 = res.image1 || '';
			recordInfo.value.image2 = res.image2 || '';
			recordInfo.value.image3 = res.image3 || '';
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
			justify-content: space-between;
			width: 100%;

			// 处理不同数量图片的布局
			&.single-image {
				.image-section {
					width: 100%;
					max-width: 100%;
				}
			}

			&.double-image {
				.image-section {
					width: calc(50% - 10px);
					max-width: calc(50% - 10px);
					min-width: auto;
				}
			}

			&.triple-image {
				.image-section {
					width: calc(33.33% - 14px);
					max-width: calc(33.33% - 14px);
					min-width: auto;
				}
			}

			.image-section {
				flex: none;
				margin-bottom: 15px;
				display: flex;
				flex-direction: column;
				align-items: center;

				.image-title {
					font-size: 16px;
					font-weight: bold;
					margin-bottom: 10px;
					text-align: center;
					width: 100%;
				}

				.image-wrapper {
					display: flex;
					justify-content: center;
					align-items: center;
					border: 1px solid #eee;
					padding: 5px;
					background-color: #f9f9f9;
					width: 100%;
					height: 220px;

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

			// 媒体查询，针对小屏幕设备
			@media (max-width: 768px) {
				flex-direction: column;

				&.single-image,
				&.double-image,
				&.triple-image {
					.image-section {
						width: 100%;
						max-width: 100%;
					}
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
