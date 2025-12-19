import { nextTick } from "vue";
import { sleep } from "/@/cool/utils";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { isString, merge } from "lodash-es";
import { ElMessage } from "element-plus";
import type { PDFOptions } from "../types";

export async function toPDF({
	filename,
	target,
	width = "1000px",
	pdfOptions,
	h2cOptions
}: PDFOptions) {
	return new Promise(async (resolve, reject) => {
		const pdf = new jsPDF(
			merge(
				{
					orientation: "p",
					unit: "mm",
					format: "a4"
				},
				pdfOptions
			)
		);

		// 目标元素
		const a = isString(target) ? document.querySelector(target!) : target;

		if (!a) {
			return reject("[PDF] Invalid target");
		}

		// 克隆元素
		const b = a.cloneNode(true) as HTMLElement;

		// 设置样式
		if (width) {
			b.style.width = width;
		}

		b.style.position = "fixed";
		b.style.top = "0";
		b.style.left = "10000%";
		b.style.zIndex = "9999";
		b.className += " pdf-wrapper";

		document.body.appendChild(b);

		await nextTick();
		await sleep(1000);

		html2canvas(b, merge({ scale: 1.2 }, h2cOptions)).then(function (canvas) {
			const url = canvas.toDataURL();

			try {
				const img = new Image();

				img.src = url;

				img.onload = () => {
					// 图片的大小
					const imgWidth = pdf.internal.pageSize.width;
					const imgHeight = (img.height * imgWidth) / img.width;

					// pdf的大小
					const pageHeight = pdf.internal.pageSize.height;
					const pageWidth = pdf.internal.pageSize.width;

					let startY = 0;

					while (startY < imgHeight) {
						const remainingHeight = imgHeight - startY;
						const height = Math.min(remainingHeight, pageHeight);

						pdf.addImage(
							url,
							"JPEG",
							0,
							-startY,
							pageWidth,
							imgHeight,
							undefined,
							"NONE"
						);

						startY += height;

						if (startY < imgHeight) {
							pdf.addPage();
						}
					}

					pdf.save(`${filename || "demo"}.pdf`);
					b.remove();

					resolve(pdf);
				};
			} catch (err) {
				ElMessage.error("导出PDF异常");
				console.error("[pdf]", err);
				reject(err);
			}
		});
	});
}
