const path = require("path");

module.exports = {
  // 入口
  entry: "./src/main.js", // 相对路径
  output: {
    // 输出路径
    // __dirname node.js的变量， 代表当前文件的文件夹目录
    path: path.resolve(__dirname, "dist"), // 使用绝对路径
    // 输出的文件名称
    filename: "main.js",
    clean: true, // 每次打包都会清除上一次打包的内容
  },
  module: {
    rules: [
      // loader的配置
      // 处理css 文件资源
      {
        test: /\.css$/, // 检查文件类型 .css
        // 使用什么loader去处理， 特别注意的是loader执行的顺序是从右到左，从下到上

        // 使用loader只能使用一个loader
        // loader: 'css-loader',

        // use 可以使用多个loader
        use: [
          "style-loader", // 将js中的css通过创建style标签添加到 html 文件中（动态创建style标签添加到html中，让css文件生效）
          "css-loader", // 将css资源编译成为 commonjs 的模块到js中（将css打包到js中）
        ],
      },

      // 处理less 文件资源
      {
        test: /\.less$/,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader", // 将less文件编译成为 css文件
        ],
      },

      // 处理 scss 资源
      {
        test: /\.s[ac]ss$/,
        use: [
          // 将 JS 字符串生成为 style 节点
          "style-loader",
          // 将 CSS 转化成 CommonJS 模块
          "css-loader",
          // 将 Sass 编译成 CSS
          "sass-loader",
        ],
      },

      // 处理stylus 资源
      {
        test: /\.styl$/,
        use: [
          // 将 JS 字符串生成为 style 节点
          "style-loader",
          // 将 CSS 转化成 CommonJS 模块
          "css-loader",
          // 将 stylus 编译成 CSS
          "stylus-loader",
        ],
      },

      // 配置资源文件目录
      // 处理图片资源
      {
        test: /\.(png|jpe?g|gif|svg|webp|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            // 小于 28kb 的图片转 base64 文件格式
            // 优点: 减少请求数量
            // 缺点： 文件的体积会变大
            maxSize: 30 * 1024, // 28kb
          },
        },
        // 输出图片类型文件到自定目录
        // hash:10 代表hash值只取10位
        generator: {
          filename: "static/images/[hash:10][ext][query]",
        },
      },
      // 处理字体资源
      {
        test: /\.(woff2?|ttf)$/,
        // asset/resource 表示只会原封不动的输出，不会转换成为 base64 文件格式
        type: "asset/resource",
        // 输出图片类型文件到自定目录
        // hash:10 代表hash值只取10位
        generator: {
          filename: "static/font/[hash:10][ext][query]",
        },
      },
      // 处理其他资源
      {
        test: /\.(map3|map4|avi)$/,
        // asset/resource 表示只会原封不动的输出，不会转换成为 base64 文件格式
        type: "asset/resource",
        // 输出图片类型文件到自定目录
        // hash:10 代表hash值只取10位
        generator: {
          filename: "static/media/[hash:10][ext][query]",
        },
      },
    ],
  },
  plugins: [],
  mode: "development",
};

/*
 1. 处理样式资源
    webpack 本身是不能识别样式资源的， 所以我们需要借助 Loader去帮助Webpack来解析样式资源
    
  2. 处理图片资源
    在webpack4 中， 处理图片资源需要使用 file-loader 以及 url-loader
      file-loader 会将图片资源编译成为 webpack 可以识别的资源
      url-loader 在 file-loader 的基础上多了将小于一定大小文件的图片资源转换成为 base64 格式的数据
    在 webpack5 中已经将两个loader内置到了 webpack 中， 我们只需要简单配置即可处理图片资源
*/
