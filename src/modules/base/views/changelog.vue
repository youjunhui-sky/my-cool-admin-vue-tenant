<template>
	<div class="view-changelog">
		<el-scrollbar>
			<div class="p-[20px]">
				<div class="content-wrapper">
					<!-- Markdown 渲染 -->
					<div class="markdown-body" v-html="html"></div>

					<!-- 右侧版本索引 -->
					<div class="version-toc" v-if="versions.length">
						<div class="toc-title">{{ $t('版本说明') }}</div>
						<ul>
							<li v-for="(v, i) in versions" :key="i">
								<a href="javascript:void(0)" @click="scrollTo(v.id)">{{
									v.title
								}}</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</el-scrollbar>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'view-changelog'
});

import { ref, onMounted } from 'vue';
import { markdownToHTML } from '/$/helper/utils/markdown-converter-github';
import { useCool } from '/@/cool';
// 以原始文本方式引入 md
// Vite 支持 ?raw 导入纯文本

// @ts-ignore
import changelogMd from './changelog.md?raw';

const { service } = useCool();

const html = ref<string>('');
const versions = ref<{ title: string; id: string }[]>([]);

function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^\w\u4e00-\u9fa5]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function buildVersions(md: string) {
	const list: { title: string; id: string }[] = [];
	const reg = /^##\s+(.+?)$/gm;
	let m: RegExpExecArray | null;
	while ((m = reg.exec(md)) !== null) {
		const title = m[1].trim();
		const id = slugify(title);
		list.push({ title, id });
	}
	versions.value = list;
}

function injectHeadingIds(content: string) {
	if (!versions.value.length) return content;
	let i = 0;
	return content.replace(/<h2>([\s\S]*?)<\/h2>/g, (_match, p1) => {
		const v = versions.value[i++];
		if (!v) return `<h2>${p1}</h2>`;
		return `<h2 id="${v.id}">${p1}</h2>`;
	});
}

function scrollTo(id: string) {
	const el = document.getElementById(id);
	if (el) {
		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
}

onMounted(async () => {
	try {
		// 从后台获取版本列表
		const versionList = await service.version.info.list();

		// 只取 published 为 true 的数据
		const publishedVersions = (versionList || []).filter(
			(item: any) => item.published === true
		);

		// 按 bh 倒序排序
		const sortedVersions = publishedVersions.sort((a: any, b: any) => {
			const bhA = Number(a.bh) || 0;
			const bhB = Number(b.bh) || 0;
			return bhB - bhA; // 倒序
		});

		// 格式化日期为 YYYY-MM-DD
		const formatDate = (dateStr: string) => {
			if (!dateStr) return '';
			const date = new Date(dateStr);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		};

		// 合并所有版本的 version 字段，并添加标题
		const versionContents = sortedVersions
			.map((item: any) => {
				const bh = item.bh || '';
				const publishTime = formatDate(item.publishTime);
				const version = item.version || '';

				// 构建标题：v{bh} ({publishTime})
				const title = `## v${bh}${publishTime ? ` (${publishTime})` : ''}`;

				// 如果有版本内容，返回标题+内容；否则只返回标题
				return version.trim() ? `${title}\n\n${version}` : title;
			})
			.filter((content: string) => content.trim())
			.join('\n\n---\n\n');

		// 如果有版本数据，使用合并后的内容；否则使用默认的 changelog.md
		const md = versionContents || '暂无版本更新说明';
		if (md) {
			buildVersions(md);
			const raw = await markdownToHTML(md);
			html.value = injectHeadingIds(raw);
		}
	} catch (error) {
		console.error('获取版本数据失败:', error);
		// 失败时使用默认的 changelog.md
		const md = '';
		buildVersions(md);
		const raw = await markdownToHTML(md);
		html.value = injectHeadingIds(raw);
	}
});
</script>

<style lang="scss">
/* GitHub Markdown 样式 */
@import 'github-markdown-css/github-markdown.css';
</style>

<style lang="scss" scoped>
.view-changelog {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--el-bg-color);
	box-sizing: border-box;
	border-radius: 6px;
	overflow: hidden;

	:deep(.el-scrollbar) {
		height: 100%;

		.el-scrollbar__wrap {
			height: 100%;
		}
	}

	.content-wrapper {
		display: flex;
		gap: 20px;
		align-items: flex-start;
		max-width: 1200px;
		margin: 0;
	}

	.markdown-body {
		flex: 1;
		min-width: 0;
		padding: 20px;
		background-color: var(--el-bg-color-page);
		border: 1px solid var(--el-border-color-light);
		border-radius: 8px;
		text-align: left;

		:deep(*) {
			text-align: left;
		}
	}

	.version-toc {
		flex-shrink: 0;
		width: 220px;
		padding: 12px;
		background-color: var(--el-bg-color);
		border: 1px solid var(--el-border-color-light);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		position: sticky;
		top: 20px;

		.toc-title {
			font-size: 14px;
			font-weight: 600;
			margin-bottom: 8px;
			color: var(--el-text-color-primary);
		}

		ul {
			margin: 0;
			padding: 0;
			list-style: none;

			li {
				margin: 6px 0;

				a {
					color: var(--el-text-color-regular);
					text-decoration: none;
					transition: color 0.2s;
					font-size: 13px;
					display: block;

					&:hover {
						color: var(--el-color-primary);
						text-decoration: underline;
					}
				}
			}
		}
	}

	.title {
		margin-bottom: 20px;
		font-size: 18px;
		font-weight: bold;
		color: var(--el-text-color-primary);
	}
}
</style>
