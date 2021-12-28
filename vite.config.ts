import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
//node version 14+
// import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({

	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@assets': resolve(__dirname, 'src/assets'),
			'@components': resolve(__dirname, 'src/components'),
		},
	},
	server: {
		fs: {
			strict: false,
		},
		port: 3000,
		proxy: {
			"/api": {
				target: 'http://api.test.travel.lecent.cn/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '/')
			},
		}
	},

	plugins: [
		vue(),
		vueJsx(),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/lib/index.ts'),
			name: 'QTransfer',
			fileName: (format) => `q-transfer.${format}.js`
		},
		minify: 'terser',
		terserOptions: {
			compress: {
				//生产环境时移除console
				drop_console: true,
				drop_debugger: true,
			},
		},
		cssCodeSplit: true,
		rollupOptions: {
			// 确保外部化处理那些你不想打包进库的依赖
			external: ['vue', 'element-plus'],
			output: {
				// 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
				globals: {
					vue: 'Vue',
					'ElementPlus': 'ElementPlus'
				}
			}
		}
	},
});

