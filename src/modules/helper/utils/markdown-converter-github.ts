import { marked } from 'marked';
import hljs from 'highlight.js';

// 配置 marked
marked.setOptions({
	highlight: (code: string, lang: string) => {
		const language = hljs.getLanguage(lang) ? lang : 'plaintext';
		return hljs.highlight(code, { language }).value;
	},
	pedantic: false,
	gfm: true, // 启用 GitHub Flavored Markdown
	breaks: false,
	sanitize: false,
	smartLists: true,
	smartypants: false
});

// 生成完整 HTML（带样式）
async function markdownToHTML(mdContent: string): Promise<string> {
	const htmlContent = await marked.parse(mdContent);
	//console.log('htmlContent:' + htmlContent);
	return htmlContent;
}

export { markdownToHTML };
