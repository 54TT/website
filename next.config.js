// next.config.js
// "next-offline": "^5.0.5",
module.exports = {
    reactStrictMode: false,
    compiler: {
        styledComponents: true,
    },
    server: {
        port: 80, // 指定新的端口号
    },
    images: {
        domains: ['localhost','dexscreener.com',"www.kindpng.com",'192.168.8.39','188.166.191.246'], // 在这里添加您希望允许加载图像的主机名
    },
    distDir: 'build',

}
