module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://olforum.sanguosha.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        },
        secure: true
      },
    },
  },
}