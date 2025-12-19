import { type jsPDFOptions } from "jspdf";
import { type Options as h2cOptions } from "html2canvas";

export declare interface PDFOptions {
	filename?: string;
	target?: Element | null;
	width?: string;
	pdfOptions?: jsPDFOptions;
	h2cOptions?: h2cOptions;
}
