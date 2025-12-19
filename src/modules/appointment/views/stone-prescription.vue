<template>
	<div class="stone-prescription">
		<!-- PDF内容区域 -->
		<div class="pdf-print-wrapper">
			<div class="prescription-content">
				<!-- 标题 -->
				<div class="prescription-header">
					<h1>结石健康教育处方</h1>
					<div class="hospital-info">泌尿外科 门诊</div>
				</div>

				<!-- 患者基本信息 -->
				<div class="patient-info">
					<div class="info-row">
						<div class="info-item">
							<span class="label">姓名：</span>
							<span class="value">{{ patientInfo.name || '____________' }}</span>
						</div>
						<div class="info-item">
							<span class="label">性别：</span>
							<span class="value">{{ patientInfo.gender || '____________' }}</span>
						</div>
						<div class="info-item">
							<span class="label">年龄：</span>
							<span class="value">{{ patientInfo.age || '____________' }}</span>
						</div>
					</div>
					<div class="info-row">
						<div class="info-item">
							<span class="label">诊断：</span>
							<span class="value">{{ patientInfo.diagnosis || '____________' }}</span>
						</div>
						<div class="info-item date-item">
							<span class="label">日期：</span>
							<span class="value">{{ currentDate }}</span>
						</div>
					</div>
				</div>

				<!-- 健康教育内容 -->
				<div class="education-content">
					<h2>结石健康教育内容</h2>

					<div class="section">
						<h3>1. 疾病认知</h3>
						<p>
							泌尿系结石是指在肾脏、输尿管、膀胱等泌尿系统形成的固体结晶体。常见原因包括水分摄入不足、饮食不当、代谢异常、感染等。临床表现主要为腰痛、血尿、排尿异常等。
						</p>
					</div>

					<div class="section">
						<h3>2. 饮食指导</h3>
						<ul>
							<li>
								<strong>多饮水：</strong>每日饮水量2000-3000ml，保持尿量2000ml以上。
							</li>
							<li><strong>限制盐分：</strong>减少高盐食物摄入，每日食盐不超过6g。</li>
							<li>
								<strong>低蛋白饮食：</strong>控制动物蛋白摄入，特别是红肉、海鲜等。
							</li>
							<li>
								<strong>适量钙质：</strong
								>保持正常钙摄入(800-1000mg/日)，避免钙补充剂。
							</li>
							<li>
								<strong>草酸控制：</strong
								>减少高草酸食物(如菠菜、甜菜、茶、巧克力等)。
							</li>
							<li>
								<strong>柑橘类水果：</strong
								>适量食用柠檬、橙子等，有助于预防尿酸结石。
							</li>
						</ul>
					</div>

					<div class="section">
						<h3>3. 生活方式</h3>
						<ul>
							<li><strong>规律作息：</strong>保持充足睡眠，避免过度疲劳。</li>
							<li>
								<strong>适当运动：</strong>每周进行3-5次有氧运动，每次30分钟以上。
							</li>
							<li><strong>避免久坐：</strong>长时间工作应每小时起身活动5-10分钟。</li>
							<li><strong>体重管理：</strong>保持健康体重，肥胖者应适当减重。</li>
						</ul>
					</div>

					<div class="section">
						<h3>4. 用药指导</h3>
						<p>按医嘱服用药物，不要自行停药或调整剂量。常用药物可能包括：</p>
						<ul>
							<li><strong>碱化尿液药物：</strong>如枸橼酸钾、碳酸氢钠等。</li>
							<li><strong>利尿剂：</strong>如羟氯噻嗪等。</li>
							<li><strong>解痉药：</strong>缓解输尿管痉挛。</li>
							<li><strong>抗生素：</strong>治疗合并尿路感染。</li>
						</ul>
					</div>

					<div class="section">
						<h3>5. 复诊随访</h3>
						<p>
							定期复查尿常规、尿培养、B超或CT等，评估结石情况。定期监测24小时尿代谢物，以指导预防措施。
						</p>
						<p><strong>建议复诊时间：</strong>{{ followUpDate }}</p>
					</div>
				</div>

				<!-- 签名区域 -->
				<div class="signature-area">
					<div class="signature-item">
						<span class="label">医生签名：</span>
						<span class="value">{{ doctorInfo.name || '____________' }}</span>
					</div>
					<div class="signature-item">
						<span class="label">患者签名：</span>
						<span class="value">____________</span>
					</div>
				</div>

				<!-- 页脚 -->
				<div class="footer">
					<p>注：本处方仅供参考，具体治疗方案请遵医嘱</p>
				</div>
			</div>
		</div>

		<!-- 操作按钮 -->
		<div class="action-buttons">
			<el-form :model="patientInfo" label-width="80px" class="patient-form">
				<el-form-item label="姓名">
					<el-input v-model="patientInfo.name" />
				</el-form-item>
				<el-form-item label="性别">
					<el-select v-model="patientInfo.gender" placeholder="请选择">
						<el-option label="男" value="男" />
						<el-option label="女" value="女" />
					</el-select>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="patientInfo.age" :min="1" :max="120" />
				</el-form-item>
				<el-form-item label="诊断">
					<el-input v-model="patientInfo.diagnosis" />
				</el-form-item>
			</el-form>

			<el-button type="primary" :loading="loading" @click="toPDF">生成处方PDF</el-button>
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
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="pdfDialogVisible = false">关闭</el-button>
					<el-button type="primary" @click="printPDF">
						<el-icon><printer /></el-icon> 打印
					</el-button>
					<el-button type="success" @click="downloadPDF">
						<el-icon><download /></el-icon> 下载
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Printer, Download } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import dayjs from 'dayjs';

// 患者信息
const patientInfo = ref({
	name: '',
	gender: '',
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

		// 临时添加样式，增大字体大小
		const originalStyles = new Map();
		const textElements = element.querySelectorAll(
			'p, span, div, h1, h2, h3, h4, h5, h6, td, th, li'
		);
		textElements.forEach((el, index) => {
			// 类型断言确保是HTMLElement
			const htmlEl = el as HTMLElement;

			// 保存原来的样式
			originalStyles.set(index, htmlEl.style.cssText);

			// 获取当前字体大小
			const currentSize = window.getComputedStyle(htmlEl).fontSize;
			const currentSizeValue = parseFloat(currentSize);

			// 增大字体，最小不低于14px，按比例放大1.5倍
			if (!isNaN(currentSizeValue)) {
				const newSize = Math.max(14, currentSizeValue * 1.5);
				htmlEl.style.fontSize = `${newSize}px`;

				// 适当增加行高，保持良好的可读性
				htmlEl.style.lineHeight = '1.8';
			}
		});

		// 创建canvas，使用高scale值以获得清晰的文字
		const canvas = await html2canvas(element as HTMLElement, {
			scale: 1.8, // 高清晰度
			useCORS: true,
			logging: false
		});

		// 恢复原始样式
		textElements.forEach((el, index) => {
			// 类型断言确保是HTMLElement
			const htmlEl = el as HTMLElement;
			htmlEl.style.cssText = originalStyles.get(index) || '';
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

// 直接调用打印功能
function printPDF() {
	if (!pdfUrl.value) {
		ElMessage.warning('PDF尚未生成');
		return;
	}

	// 创建隐藏的iframe来打印PDF
	const printFrame = document.createElement('iframe');
	printFrame.style.display = 'none'; // 隐藏iframe
	printFrame.src = pdfUrl.value;
	document.body.appendChild(printFrame);

	// 加载完成后调用打印
	printFrame.onload = () => {
		try {
			// 添加空检查
			if (printFrame.contentWindow) {
				printFrame.contentWindow.print();

				// 打印对话框关闭后移除iframe
				setTimeout(() => {
					document.body.removeChild(printFrame);
				}, 1000);
			} else {
				throw new Error('打印窗口不可用');
			}
		} catch (error) {
			console.error('打印失败:', error);
			document.body.removeChild(printFrame);
			ElMessage.error(
				'打印失败: ' + (error instanceof Error ? error.message : String(error))
			);
		}
	};
}

// 下载PDF
function downloadPDF() {
	if (!pdfUrl.value) {
		ElMessage.warning('PDF尚未生成');
		return;
	}

	// 创建下载链接
	const link = document.createElement('a');
	link.href = pdfUrl.value;
	link.download = `结石健康教育处方_${patientInfo.value.name || '未命名'}_${dayjs().format('YYYYMMDD')}.pdf`;
	link.click();

	ElMessage.success('PDF下载中');
}
</script>

<style lang="scss">
.stone-prescription {
	padding: 20px;

	// PDF打印区域
	.pdf-print-wrapper {
		background-color: white;
		border: 1px solid #ddd;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		margin-bottom: 20px;
		padding: 0;
		width: 210mm; // A4宽度
		min-height: 297mm; // A4高度
	}

	.prescription-content {
		padding: 20mm 15mm;

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
			margin-top: 40px;
			text-align: center;
			font-size: 12px;
			color: #666;
		}
	}

	// 操作区域
	.action-buttons {
		margin-top: 20px;

		.patient-form {
			max-width: 600px;
			margin-bottom: 20px;
		}
	}

	// PDF预览容器
	.pdf-preview-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 600px;
		background-color: #f5f5f5;

		iframe {
			background-color: white;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		}

		.pdf-loading {
			font-size: 18px;
			color: #909399;
		}
	}

	.dialog-footer {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}
}
</style>
