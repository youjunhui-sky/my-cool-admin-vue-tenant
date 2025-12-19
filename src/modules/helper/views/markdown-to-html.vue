<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-col :span="24">
				<div class="helper-page">
					<div class="page-header">
						<h1>辅助工具</h1>
						<p>Markdown转HTML工具</p>
					</div>
					<markdown-to-html-github />
				</div>
			</cl-col>
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" name="helper-markdown-to-html" setup>
// import MarkdownToHtml from '../components/markdown-to-html.vue';
import MarkdownToHtmlGithub from '../components/markdown-to-html-github.vue';
</script>

<style lang="scss" scoped>
.helper-page {
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	overflow: hidden;

	.page-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 30px;
		text-align: center;

		h1 {
			margin: 0 0 10px 0;
			font-size: 28px;
			font-weight: 300;
		}

		p {
			margin: 0;
			font-size: 16px;
			opacity: 0.9;
		}
	}
}
</style>
