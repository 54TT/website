// next.config.js
// "next-offline": "^5.0.5",
module.exports = {
    reactStrictMode: false,
    distDir: 'build',
    compiler: {
        styledComponents: true,
    },
    images: {
        domains: ['localhost','dexscreener.com',"www.kindpng.com",'192.168.8.39','188.166.191.246'], // 在这里添加您希望允许加载图像的主机名
    },
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: 'http://188.166.191.246:8080/:path*', // 将请求代理到目标服务器
    //         },
    //     ];
    // },
}
