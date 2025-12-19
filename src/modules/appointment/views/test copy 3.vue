<template>
	<div class="pdf-demo">
		<div class="pdf-print-wrapper">
			<user-info />
		</div>

		<el-button type="success" :loading="loading" @click="toPDF">生成PDF预览</el-button>

		<!-- PDF预览弹窗 -->
		<el-dialog
			v-model="pdfDialogVisible"
			title="PDF预览"
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
					height="500"
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
import { usePDF } from '../../../plugins/pdf/hooks';
import UserInfo from '../components/user-info.vue';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Printer, Download } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { toPDF as generatePDF } from '../../../plugins/pdf/utils';

const { loading } = usePDF();
const pdfDialogVisible = ref(false);
const pdfUrl = ref('');
const pdfBlob = ref<any>(null);

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

			// 增大字体，最小不低于14px，按比例放大1.2倍
			if (!isNaN(currentSizeValue)) {
				const newSize = Math.max(14, currentSizeValue * 1.5);
				htmlEl.style.fontSize = `${newSize}px`;

				// 适当增加行高，保持良好的可读性
				htmlEl.style.lineHeight = '1.8';
			}
		});

		// 参考原始plugins中的toPDF实现，保持样式一致但增大字体
		// 1. 先创建canvas，使用更高的scale值以获得更清晰的文字
		const canvas = await html2canvas(element as HTMLElement, {
			scale: 1.8, // 增大scale值，使文字更清晰
			useCORS: true,
			logging: false
		});

		// 恢复原始样式
		textElements.forEach((el, index) => {
			// 类型断言确保是HTMLElement
			const htmlEl = el as HTMLElement;
			htmlEl.style.cssText = originalStyles.get(index) || '';
		});

		// 2. 创建PDF实例，使用原始的参数
		const pdf = new JsPDF({
			orientation: 'p',
			unit: 'mm',
			format: 'a4'
		});

		// 3. 按照原始calculatePdfSize的逻辑处理图像
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

		// 类似原始实现，处理可能的多页情况
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

		// 4. 生成PDF Blob而不保存文件
		const pdfOutput = pdf.output('blob');

		// 5. 保存生成的Blob并创建URL
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
	link.download = `用户信息_${new Date().getTime()}.pdf`;
	link.click();

	ElMessage.success('PDF下载中');
}
</script>

<style lang="scss">
.pdf-demo {
	.pdf-print-wrapper {
		border: 1px solid red;
		border-radius: 5px;
		padding: 20px;
		margin-bottom: 10px;
	}

	.pdf-preview-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 500px;
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
