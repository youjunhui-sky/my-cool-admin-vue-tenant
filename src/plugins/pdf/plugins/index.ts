import type { PDFOptions } from "../types";
import { usePDF } from "../hooks";

interface Options extends PDFOptions {
	label?: string;
	type?: "success" | "danger" | "info" | "warning";
	text?: boolean;
}

export function setPDF(options: Options = {}): ClForm.Plugin {
	const { loading, toPrint } = usePDF();

	return ({ exposed }) => {
		const { label, text, type } = options;

		const btns = exposed.config.op.buttons as any[];

		if (btns) {
			if (!btns.find((e) => e.tag == "pdf")) {
				btns.push({
					tag: "pdf",
					label: label || "打印",
					props: {
						type,
						text,
						loading
					},
					onClick() {
						toPrint({
							...options,
							target: exposed.refs.form
						});
					}
				});
			}
		}
	};
}
