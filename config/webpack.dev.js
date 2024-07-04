// 开发模式打包的文件
const path = require("path");
// eslint 插件
// const ESLintPlugin = require('eslint-webpack-plugin')

// 使用 Htmlwebpackplugin 插件自动引入js
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 将css 打包成为单独的css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // 入口
  entry: "./src/main.js", // 相对路径
  output: {
    // 输出路径
    // __dirname node.js的变量， 代表当前文件的文件夹目录
    // 开发模式没有输出，可以不写
    path: undefined, // 使用绝对路径
    // 输出的文件名称
    filename: "static/js/main.js",
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
          MiniCssExtractPlugin.loader, // 提取css成单独文件
          // "style-loader", // 将js中的css通过创建style标签添加到 html 文件中（动态创建style标签添加到html中，让css文件生效）
          "css-loader", // 将css资源编译成为 commonjs 的模块到js中（将css打包到js中）
        ],
      },

      // 处理less 文件资源
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, // 提取css成单独文件
          // compiles Less to CSS
          // "style-loader",
          "css-loader",
          "less-loader", // 将less文件编译成为 css文件
        ],
      },

      // 处理 scss 资源
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader, // 提取css成单独文件
          // 将 JS 字符串生成为 style 节点
          // "style-loader",
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
          MiniCssExtractPlugin.loader, // 提取css成单独文件
          // 将 JS 字符串生成为 style 节点
          // "style-loader",
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

      {
        test: /\.?js$/,
        exclude: /(node_modules)/, // 排除 node-model 文件不处理
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            // plugins: ["@babel/plugin-proposal-object-rest-spread"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 以 public/index.html 文件为模板创建新的 html 文件
      // 新的文件有两个特点： 1. 结构和原来一致， 2. 会自动引入打包的输出资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // new ESLintPlugin({
    //   // 监测那些文件
    //   context: path.resolve(__dirname, 'src')
    // }),

    // 配置完成, 将 style.loader 替换成为  MiniCssExtractPlugin.loader后，还需要在plugins中使用
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css'
    }), // 提取css成单独文件
  ],

  // 开发服务器： 不会输出资源， 在内存种编译打包
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口
    // open: true, // 是否自动打开浏览器
  },
  mode: "development",
};

/*
 1. 处理样式资源
    webpack 本身是不能识别样式资源的， 所以我们需要借助 Loader去帮助Webpack来解析样式资源
    
  2. 处理图片等其他资源文件
    在webpack4 中， 处理图片资源需要使用 file-loader 以及 url-loader
      file-loader 会将图片资源编译成为 webpack 可以识别的资源
      url-loader 在 file-loader 的基础上多了将小于一定大小文件的图片资源转换成为 base64 格式的数据
    在 webpack5 中已经将两个loader内置到了 webpack 中， 我们只需要简单配置即可处理图片资源
  
  3. 处理js资源
    babel: 主要用于将es6语法编写的代码转换为向后兼容的javascript语法，以便能够运行在当前和旧版本的浏览器或其他环境中
  
  4. 开发服务器 自动化打包
    每次写完代码需要手动输入指令才能编译代码，安装自动化插件，让插件监听代码的变化自动打包
    npm install webpack-dev-server -D
  
*/

/*
  1. css 文件处理
    在之前的处理中， css文件被打包到 js 文件中， 当加载js文件时，会创建一个style标签来生成样式
    并且，在这种形势下加载css， 可能会导致闪屏的现象
    所以， 需要处理成单独的 css 文件，通过 link标签加载性能更好

    处理 ： 
      1. 下载插件
        npm i mini-css-extract-plugin -D

*/ 