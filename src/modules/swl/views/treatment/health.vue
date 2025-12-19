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
						<h1>中山大学附属第八医院（结石科）</h1>
						<div class="hospital-info">健康教育处方</div>
						<div class="qrcode-container">
							<img src="/qrcode.png" alt="医院二维码" class="qrcode-image" />
						</div>
					</div>

					<!-- 健康教育内容 -->
					<div class="education-content">
						<h2>冲击波碎石术后注意事项</h2>

						<div class="section">
							<ul>
								<li>
									<p class="indented-paragraph">
										1、每日均匀喝水2500ml以上(约每小时200ml)。保证每次尿的颜色是清的。
									</p>
								</li>
								<li>
									<p class="indented-paragraph">
										2、术后大部分患者可出现血尿，一般持续1~3次，肾脏结石碎石后或有凝血机制障碍者出血时间较长，若血尿持续不止，请即到医院复诊。
									</p>
								</li>
								<li>
									<p class="indented-paragraph">
										3.术后的排石过程中约5%的患者可出现肾绞痛，尤其是结石通过输尿管狭窄部位时。严重时需到医院接受治疗。术后当天疼痛加重应该及时复诊!
									</p>
								</li>
								<li>
									<p class="indented-paragraph">
										4、请你在术后过滤小便，收集碎石，晾干后复诊时带回进行结石成分分析(非常重要)。
									</p>
								</li>
								<li>
									<p class="indented-paragraph">
										5、术后一周内请注意休息，不能进行剧烈的运动(跳跃、奔跑、打球、爬山等)。第二周可逐渐增加运动量至正常。
									</p>
								</li>
								<li>
									<p class="indented-paragraph">
										6、肾下盏位于肾脏最低点，而肾脏的出口在上方，因此，肾下盏结石往往有结石残留。应该做倒立运动帮助结石排出。方法是:饮水200m以上，约20分钟后倒立，每日数次。可躺在沙发或床上，双脚放在墙上，双手支撑腰部抬高臀部。
									</p>
								</li>
							</ul>

							<!-- 健康指导图片 -->
							<div class="qrcode-centered">
								<img src="/health.png" alt="健康指导图" class="qrcode-image" />
							</div>

							<ul>
								<li>
									<p class="indented-paragraph">
										对于年龄较大或有高血压、心脏病等的患者做倒立时要量力而行。此外，右肾结石术后多取左侧卧位，左肾结石术后取右侧卧位亦有助于排石。
									</p>
								</li>
								<li>
									<p class="indented-paragraph">
										7、术后的复诊是必须的，一般术后2~3周到尿石病诊疗中心复诊。复查首选B超检查，请先饮水，胀尿时方可行B超检查，必要时需同时拍X光片。
									</p>
								</li>
							</ul>
						</div>
					</div>

					<!-- 签名区域 -->
					<div class="signature-area">
						<div class="signature-item">
							<span class="label">医生签名：</span>
							<span class="value">{{ user.info?.name || '' }}</span>
						</div>
					</div>

					<!-- 页脚 -->
					<div class="footer">
						<p>注：本处方仅供参考，具体治疗方案请遵医嘱</p>
					</div>
				</div>
			</div>

			<!-- PDF预览弹窗 -->
			<el-dialog
				v-model="pdfDialogVisible"
				title="结石健康教育处方预览"
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
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Printer, Download, Document } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import dayjs from 'dayjs';
import { useBase } from '/@/modules/base';

const { user } = useBase();

// 患者信息
const patientInfo = ref({
	name: '测试',
	gender: '男',
	age: 30,
	diagnosis: '肾结石'
});

// 医生信息
const doctorInfo = ref({
	name: '王医生'
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
			margin-bottom: 30px;
			border-bottom: 1px solid #ccc;
			padding-bottom: 15px;

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
