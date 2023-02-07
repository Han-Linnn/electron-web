/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  // dev: {
  '/ajax': {
    target: 'https://ehire.51job.com/',
    changeOrigin: true,
    pathRewrite: {
      '^': '',
    },
  },
  '/api': {
    target: 'https://rd6.zhaopin.com/',
    changeOrigin: true,
    pathRewrite: {
      '^': '',
    },
  },
  '/v1': {
    target: 'http://192.168.1.89:5000/',
    changeOrigin: true,
    pathRewrite: {
      '^': '',
    },
  },
  '/zhilian': {
    target: 'http://192.168.1.89/zhilian/',
    changeOrigin: true,
    pathRewrite: {
      '^/zhilian': '',
    },
  },
  '/ejobedit': {
    target: 'https://lpt.liepin.com/',
    changeOrigin: true,
    pathRewrite: {
      '^': '',
    },
  },
  // },
  // test: {
  //   '/api/': {
  //     target: 'https://preview.pro.ant.design',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^': '',
  //     },
  //   },
  // },
  // pre: {
  //   '/api/': {
  //     target: 'your pre url',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^': '',
  //     },
  //   },
  // },
};
