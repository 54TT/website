// next.config.js
module.exports = {
    reactStrictMode: false,
    distDir: 'build',
    compiler: {
        styledComponents: true,
    },
    images: {
      domains: ['localhost','dexscreener.com',"www.kindpng.com",'192.168.8.39','188.166.191.246'], // 在这里添加您希望允许加载图像的主机名
    },
    react: {
        useSuspense: false,
        wait: true,
        // 替代 getStorage 选项
        storage: true
    }
  }
