module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api/old': {
        target: 'https://olforum.sanguosha.com/',
        // target: 'https://preolforum.sanguosha.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api/old': '/',
        },
        secure: true,
      },
      '/api': {
        // target: 'https://olforum.sanguosha.com/',
        target: 'https://preolforum.sanguosha.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
        secure: true,
      },
    },
  },
}
