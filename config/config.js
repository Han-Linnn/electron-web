import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
import proxy from './proxy';
// const { REACT_APP_ENV } = process.env;
export default defineConfig({
  history: { type: 'hash' },
  hash: true,
  antd: {
    // dark: true, // 暗色风格
    // compact: true, // 紧凑模式
  },
  dva: {
    hmr: true,
  },
  outputPath: './dist/renderer',
  publicPath: './',
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  proxy: proxy,
  manifest: {
    basePath: '/',
  },
  headScripts: [{ src: './renderer.js' }],
});
