// next.config.js
module.exports = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    images: {
      domains: ['localhost','dexscreener.com'], // 在这里添加您希望允许加载图像的主机名
    },
    publicRuntimeConfig: {
        // 配置静态文件的根路径
        // assetPrefix:  NODE_ENV === 'production' ? '/public' : '',
    },
  }
  