/**
 * Markdown转HTML工具函数
 */

/**
 * 将Markdown文本转换为HTML
 * @param markdownText Markdown格式的文本
 * @returns HTML格式的文本
 */
export function convertMarkdownToHtml(markdownText: string): string {
	if (!markdownText || !markdownText.trim()) {
		return '';
	}

	let html = markdownText;

	// 转换标题
	html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
	html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
	html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

	// 转换水平线
	html = html.replace(/^---$/gim, '<hr>');

	// 转换加粗文本
	html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

	// 转换斜体文本
	html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

	// 转换无序列表（以 • 开头）
	html = html.replace(/^• (.*$)/gim, '<li>$1</li>');

	// 转换有序列表（以数字开头）
	html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>');

	// 转换缩进列表项（以 - 开头且有缩进）
	html = html.replace(/^\s+- (.*$)/gim, '<li style="margin-left: 20px;">$1</li>');

	// 包装连续的li标签为ul
	html = html.replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/gs, match => {
		return '<ul>' + match + '</ul>';
	});

	// 转换段落（连续的非空行）
	const lines = html.split('\n');
	const processedLines: string[] = [];
	let currentParagraph = '';

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// 跳过已经处理的HTML标签行
		if (line.match(/^<(h[1-6]|hr|ul|li|\/ul)/)) {
			if (currentParagraph) {
				processedLines.push(`<p>${currentParagraph}</p>`);
				currentParagraph = '';
			}
			processedLines.push(lines[i]);
			continue;
		}

		// 空行处理
		if (line === '') {
			if (currentParagraph) {
				processedLines.push(`<p>${currentParagraph}</p>`);
				currentParagraph = '';
			}
			continue;
		}

		// 累积段落内容
		if (currentParagraph) {
			currentParagraph += ' ' + line;
		} else {
			currentParagraph = line;
		}
	}

	// 处理最后的段落
	if (currentParagraph) {
		processedLines.push(`<p>${currentParagraph}</p>`);
	}

	html = processedLines.join('\n');

	// 清理多余的空行
	html = html.replace(/\n\s*\n/g, '\n');

	return html;
}

/**
 * 异步版本的Markdown转HTML函数
 * @param markdownText Markdown格式的文本
 * @returns Promise<string> HTML格式的文本
 */
export async function convertToHtml(markdownText: string): Promise<string> {
	return convertMarkdownToHtml(markdownText);
}
