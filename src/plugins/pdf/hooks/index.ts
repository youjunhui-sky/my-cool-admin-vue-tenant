import { ref } from "vue";
import { toPDF } from "../utils";
import type { PDFOptions } from "../types";

export function usePDF() {
	const loading = ref(false);

	async function toPrint(options: PDFOptions) {
		loading.value = true;

		try {
			await toPDF(options);
		} catch (err) {
			console.error(err);
		}

		loading.value = false;
	}

	return {
		loading,
		toPrint
	};
}
