import { fileURLToPath, URL } from 'node:url';
import { ConfigEnv, UserConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import compression from 'vite-plugin-compression';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import { visualizer } from 'rollup-plugin-visualizer';
import { proxy } from './src/config/proxy';
import { cool } from '@cool-vue/vite-plugin';
import { readFileSync } from 'node:fs';

function toPath(dir: string) {
	return fileURLToPath(new URL(dir, import.meta.url));
}

/**
 * 处理 ?raw 导入的插件
 * 确保 Markdown 等文件可以通过 ?raw 查询参数作为原始文本导入
 */
function rawPlugin(): Plugin {
	return {
		name: 'vite-plugin-raw',
		enforce: 'pre',
		load(id) {
			if (id.includes('?raw')) {
				const filePath = id.split('?')[0];
				try {
					const content = readFileSync(filePath, 'utf-8');
					return `export default ${JSON.stringify(content)}`;
				} catch (error) {
					console.warn(`Failed to load raw file: ${filePath}`, error);
					return null;
				}
			}
			return null;
		}
	};
}

// https://vitejs.dev/config
export default ({ mode }: ConfigEnv): UserConfig => {
	const isDev = mode === 'development';

	return {
		plugins: [
			rawPlugin(),
			vue(),
			compression(),
			vueJsx(),
			// vueDevTools(),
			cool({
				type: 'admin',
				proxy,
				eps: {
					enable: true,
					mapping: [
						{
							type: 'number',
							test: ['double precision']
						}
					]
				},
				demo: mode == 'demo' // 是否开启演示模式
			}),
			// visualizer({
			// 	open: false,
			// 	gzipSize: true,
			// 	brotliSize: true
			// }),
			VueI18nPlugin({
				include: [toPath('./src/{modules,plugins}/**/locales/**')]
			})
		],
		base: '/',
		server: {
			port: 9000,
			proxy,
			hmr: {
				overlay: true
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					charset: false,
					api: 'modern-compiler'
				}
			}
		},
		resolve: {
			alias: {
				'/@': toPath('./src'),
				'/$': toPath('./src/modules'),
				'/#': toPath('./src/plugins'),
				'/~': toPath('./packages')
			}
		},
		esbuild: {
			drop: isDev ? [] : ['console', 'debugger']
		},
		assetsInclude: ['**/*.md'],
		build: {
			minify: 'esbuild',
			// terserOptions: {
			// 	compress: {
			// 		drop_console: true,
			// 		drop_debugger: true
			// 	}
			// },
			sourcemap: isDev,
			rollupOptions: {
				output: {
					chunkFileNames: 'static/js/[name]-[hash].js',
					entryFileNames: 'static/js/[name]-[hash].js',
					assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
					manualChunks(id) {
						if (id.includes('node_modules')) {
							if (!['@cool-vue/crud'].find(e => id.includes(e))) {
								if (id.includes('prettier')) {
									return;
								}

								return id
									.toString()
									.split('node_modules/')[1]
									.replace('.pnpm/', '')
									.split('/')[0];
							} else {
								return 'comm';
							}
						}
					}
				}
			}
		}
	};
};
