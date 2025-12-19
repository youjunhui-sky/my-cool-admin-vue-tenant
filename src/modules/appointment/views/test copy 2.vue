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

const { loading, toPrint } = usePDF();
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
	// 显示对话框
	pdfDialogVisible.value = true;

	// 延迟执行，确保对话框已显示
	setTimeout(async () => {
		try {
			// 先获取元素并进行非空检查
			const element = document.querySelector('.pdf-print-wrapper');
			if (!element) {
				throw new Error('未找到要打印的元素');
			}

			// 使用html2canvas捕获元素，加上类型断言
			const canvas = await html2canvas(element as HTMLElement, {
				scale: 2, // 提高清晰度
				useCORS: true, // 允许加载跨域图片
				logging: false // 禁用日志
			});

			// 创建A4尺寸的PDF
			// A4纸的尺寸是210×297毫米，转换为pt (1mm = 2.83pt) 约为595×842pt
			const pdf = new JsPDF({
				orientation: 'portrait', // 纵向
				unit: 'pt', // 单位使用点
				format: 'a4' // 使用A4格式
			});

			// 获取A4页面的宽度和高度
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			// 将canvas转为图像数据
			const imgData = canvas.toDataURL('image/jpeg', 1.0);

			// 计算图像缩放比例，保持宽高比
			// 我们需要确保图像适合A4页面宽度
			const ratio = canvas.width / canvas.height;

			let imgWidth = pdfWidth;
			let imgHeight = imgWidth / ratio;

			// 如果高度超过A4页面高度，则按高度缩放
			if (imgHeight > pdfHeight) {
				imgHeight = pdfHeight - 40; // 留出一些边距
				imgWidth = imgHeight * ratio;
			}

			// 计算居中位置
			const x = (pdfWidth - imgWidth) / 2;
			const y = 20; // 顶部留出一些空间

			// 添加图像到PDF，居中放置
			pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);

			// 如果内容太长，可能需要分页
			if (imgHeight > pdfHeight) {
				// 计算需要的页数
				const pageCount = Math.ceil(imgHeight / pdfHeight);

				// 从第二页开始添加剩余内容
				for (let i = 1; i < pageCount; i++) {
					pdf.addPage();
					// 调整y坐标来显示下一部分图像
					pdf.addImage(imgData, 'JPEG', x, -(pdfHeight * i) + y, imgWidth, imgHeight);
				}
			}

			// 生成PDF Blob
			const pdfOutput = pdf.output('blob');

			// 保存生成的Blob并创建URL
			pdfBlob.value = pdfOutput;
			pdfUrl.value = URL.createObjectURL(pdfOutput);

			// 提示用户
			ElMessage.success('PDF已生成，适配A4纸尺寸');
		} catch (error) {
			console.error('PDF生成失败:', error);
			ElMessage.error(
				'PDF生成失败: ' + (error instanceof Error ? error.message : String(error))
			);
		}
	}, 300);
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
