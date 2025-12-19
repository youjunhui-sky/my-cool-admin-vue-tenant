import JsPDF from 'jspdf';

/**
 * 创建PDF预览URL
 * @param blob PDF Blob对象
 * @returns PDF预览URL
 */
export function createPdfPreviewUrl(blob: Blob): string {
	return URL.createObjectURL(blob);
}

/**
 * 释放PDF预览URL
 * @param url 需要释放的URL
 */
export function releasePdfPreviewUrl(url: string): void {
	URL.revokeObjectURL(url);
}

/**
 * 使用最基本的方法生成PDF
 * 直接创建PDF并添加文本，不使用任何可能导致错误的函数
 * @returns Promise<Blob> 返回PDF文件的Blob对象
 */
export async function generatePDF(): Promise<Blob> {
	try {
		// 创建一个新的PDF文档，使用A4尺寸（210mm x 297mm）
		const pdf = new JsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4'
		});

		// 第一页：基础信息
		pdf.setFontSize(20);
		pdf.text('泌尿结石科（结石病因评估表）', 105, 20, { align: 'center' });

		pdf.setFontSize(12);
		pdf.text('此PDF由系统生成', 105, 30, { align: 'center' });
		pdf.text('请使用【打印】功能获取完整报告', 105, 40, { align: 'center' });

		// 添加第二页
		pdf.addPage();

		// 第二页：提示内容
		pdf.setFontSize(16);
		pdf.text('由于技术原因，PDF预览功能暂时受限', 105, 100, { align: 'center' });
		pdf.text('请直接使用浏览器的打印功能获取报告', 105, 120, { align: 'center' });

		// 返回PDF Blob对象
		return pdf.output('blob');
	} catch (error) {
		console.error('PDF生成失败:', error);
		throw error;
	}
}
