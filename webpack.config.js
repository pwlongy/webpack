const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'static/js/main.js',
    clean: true, // 每次打包都会清除上一次打包的内容
  },
  module: {
    rules: [
      // 处理css文件格式
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader'
        ],
      },
      // 处理less文件格式
      {
        test: /\.less$/,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      // 处理scss文件格式
      {
        test: /\.s[ac]ss$/,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
      // 处理 styl 文件格式
      {
        test: /\.styl$/,
        loader: 'stylus-loader', // 将 Stylus 文件编译为 CSS
      },


      // 配置资源文件目录
      // 处理图片资源
      {
        test: /\.(png|jpe?g|gif|svg|webp|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            // 小于 28kb 的图片转 base64 文件格式
            // 优点: 减少请求数量
            // 缺点： 文件的体积会变大
            maxSize: 30 * 1024 // 28kb
          }
        },
        // 输出图片类型文件到自定目录
        // hash:10 代表hash值只取10位
        generator: {
          filename: 'static/images/[hash:10][ext][query]'
        }
      },
      // 处理字体资源
      {
        test: /\.(woff2?|ttf)$/,
        // asset/resource 表示只会原封不动的输出，不会转换成为 base64 文件格式
        type: 'asset/resource',
        // 输出图片类型文件到自定目录
        // hash:10 代表hash值只取10位
        generator: {
          filename: 'static/font/[hash:10][ext][query]'
        }
      },
      // 处理其他资源
      {
        test: /\.(map3|map4|avi)$/,
        // asset/resource 表示只会原封不动的输出，不会转换成为 base64 文件格式
        type: 'asset/resource',
        // 输出图片类型文件到自定目录
        // hash:10 代表hash值只取10位
        generator: {
          filename: 'static/media/[hash:10][ext][query]'
        }
      },
    ],
  },
  plugins: [

  ],
  mode: 'development'
}

/*
  2. 处理图片资源
    在webpack4 中， 处理图片资源需要使用 file-loader 以及 url-loader
      file-loader 会将图片资源编译成为 webpack 可以识别的资源
      url-loader 在 file-loader 的基础上多了将小于一定大小文件的图片资源转换成为 base64 格式的数据
    在 webpack5 中已经将两个loader内置到了 webpack 中， 我们只需要简单配置即可处理图片资源
*/ 