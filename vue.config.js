const vueConfig = {
    devServer: {
        // development server port 8000
        port: 8080,
        // proxy: 'http://9.134.54.24:8282',
        proxy: {
            '/api': {
                target: 'https://localhost/',
                pathRewrite: {
                    '^/api': '/ai',
                },
                ws: true,
                changeOrigin: true,
            },
        },
    }
};

module.exports = vueConfig;