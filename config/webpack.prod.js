// 生产模式打包的文件
// 开发模式打包的文件
const path = require("path");
// eslint 插件
// const ESLintPlugin = require('eslint-webpack-plugin')

// 使用 Htmlwebpackplugin 插件自动引入js
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 将css 打包成为单独的css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// css 文件压缩
const cssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const { devtool } = require("./webpack.dev");
const { cachedDataVersionTag } = require("v8");

// 因为处理css样式的loader大量使用重复代码，使用方法减少代码使用
function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader,
    // 将 CSS 转化成 CommonJS 模块
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            [
              "postcss-preset-env",
              {
                // 其他选项
              },
            ],
          ],
        },
      },
    },
    // 将 Sass 编译成 CSS
    pre,
  ].filter(Boolean);
}

module.exports = {
  // 入口
  entry: "./src/main.js", // 相对路径
  output: {
    // 输出路径
    // __dirname node.js的变量， 代表当前文件的文件夹目录
    // 开发模式没有输出，可以不写
    path: path.resolve(__dirname, "../dist"), // 使用绝对路径
    // 输出的文件名称
    filename: "static/js/main.js",
    clean: true, // 每次打包都会清除上一次打包的内容
  },
  module: {
    rules: [
      {
        // 每个文件只能被一个loader配置处理
        oneOf: [
          // loader的配置
          // 处理css 文件资源
          {
            test: /\.css$/, // 检查文件类型 .css
            // 使用什么loader去处理， 特别注意的是loader执行的顺序是从右到左，从下到上

            // 使用loader只能使用一个loader
            // loader: 'css-loader',

            // use 可以使用多个loader
            // 代码重复
            use: getStyleLoader(),
            //[
            // MiniCssExtractPlugin.loader, // 提取css成单独文件
            // "style-loader", // 将js中的css通过创建style标签添加到 html 文件中（动态创建style标签添加到html中，让css文件生效）
            // "css-loader", // 将css资源编译成为 commonjs 的模块到js中（将css打包到js中）
            // {
            //   loader: "postcss-loader",
            //   options: {
            //     postcssOptions: {
            //       plugins: [
            //         [
            //           "postcss-preset-env",
            //           {
            //             // 其他选项
            //           },
            //         ],
            //       ],
            //     },
            //   },
            // },
            //],
          },

          // 处理less 文件资源
          {
            test: /\.less$/,
            use: getStyleLoader("less-loader"),
            //   [
            //   MiniCssExtractPlugin.loader, // 提取css成单独文件
            //   // compiles Less to CSS
            //   // "style-loader",
            //   "css-loader",
            //   {
            //     loader: "postcss-loader", // 兼容性处理
            //     options: {
            //       postcssOptions: {
            //         plugins: [
            //           [
            //             "postcss-preset-env",
            //             {
            //               // 其他选项
            //             },
            //           ],
            //         ],
            //       },
            //     },
            //   },
            //   "less-loader", // 将less文件编译成为 css文件
            // ],
          },

          // 处理 scss 资源
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoader("sass-loader"),
            //   [
            //   MiniCssExtractPlugin.loader, // 提取css成单独文件
            //   // 将 JS 字符串生成为 style 节点
            //   // "style-loader",
            //   // 将 CSS 转化成 CommonJS 模块
            //   "css-loader",
            //   {
            //     loader: "postcss-loader",
            //     options: {
            //       postcssOptions: {
            //         plugins: [
            //           [
            //             "postcss-preset-env",
            //             {
            //               // 其他选项
            //             },
            //           ],
            //         ],
            //       },
            //     },
            //   },
            //   // 将 Sass 编译成 CSS
            //   "sass-loader",
            // ],
          },

          // 处理stylus 资源
          {
            test: /\.styl$/,
            use: getStyleLoader("stylus-loader"),
            // [
            //   MiniCssExtractPlugin.loader, // 提取css成单独文件
            //   // 将 JS 字符串生成为 style 节点
            //   // "style-loader",
            //   // 将 CSS 转化成 CommonJS 模块
            //   "css-loader",
            //   {
            //     loader: "postcss-loader",
            //     options: {
            //       postcssOptions: {
            //         plugins: [
            //           [
            //             "postcss-preset-env",
            //             {
            //               // 其他选项
            //             },
            //           ],
            //         ],
            //       },
            //     },
            //   },
            //   // 将 stylus 编译成 CSS
            //   "stylus-loader",
            // ],
          },

          // 配置资源文件目录
          // 处理图片资源
          {
            test: /\.(png|jpe?g|gif|svg|webp|gif)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                // 小于 10kb 的图片转 base64 文件格式
                // 优点: 减少请求数量
                // 缺点： 文件的体积会变大
                maxSize: 10 * 1024, // 10kb
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
                // presets: ["@babel/preset-env"],
                // plugins: ["@babel/plugin-proposal-object-rest-spread"],
                cacheDirectory: true,  // 开启babel缓存
                cacheCompression: false, // 关闭缓存文件的压缩
              },
            },
          },
        ],
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

    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }), // 提取css成单独文件

    // css 文件压缩
    new cssMinimizerWebpackPlugin(),
  ],

  mode: "production",
  devtool: "source-map",
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
  1. css 文件处理(打包成为单独的 css 文件)
    在之前的处理中， css文件被打包到 js 文件中， 当加载js文件时，会创建一个style标签来生成样式
    并且，在这种形势下加载css， 可能会导致闪屏的现象
    所以， 需要处理成单独的 css 文件，通过 link标签加载性能更好

    处理 ： 
      1. 下载插件
        npm i mini-css-extract-plugin -D

  2. css 文件兼容性处理
    1. 下载插件
      npm install postcss postcss-loader postcss-preset-env -D

      配置css 文件兼容性处理，需要将postcss配置在 css-loader之前处理
      配置 css 兼容性处理需要做到什么程度，需要package.json中在browserslist中配置

  3. css 文件压缩
    1. 下载插件
      npm install css-minimizer-webpack-plugin -D

    html文件以及js文件会自动压缩不需要额外的配置
*/

/*
  高级开发
    1. SourceMap（源代码映射）
    SourceMap(源代码映射) 是一个用来生成源代码与构建后代码的映射文件方案
    他会生成一个xxx.map文件， 里面包含源代码和构建后代码每一行每一列的映射关系。在构建后代码出错了，就会
    通过xxx.map文件，从构建后代码出错位置找到映射后源代码出错位置，从而让浏览器提示源代码文件出错位置，
    帮助我们更快的找到错误根源

    在实际开发过程中，只需要关注两种模式
      1. 开发模式中： cheap-source-map
        优点： 打包编译速度快， 只包含行映射
        缺点： 没有列映射
      2. 生产模式中： source-map
        优点：包含行/列映射
        缺点：打包编译速度慢


    2. 提升打包构建速度
      HotModuleReplacement
      css样式因为存在style-loader,所以可以实现热更新，不需要重新刷新页面，只会单独重新打包css文件
      js 还是需要重新打包，可以通过设置去实现热更新替换功能
      if(module.hot){
        modeule.hot.accept('文件地址'， () => {
          一旦这个模块发生变化就会调用这个函数
          })
      }
      他只能一个监听一个模块，如果需要监听所有的模块，需要写所有的文件

    3. oneOf
      将配置都放在oneOf数组中，一个文件只会处理一个配置

    4. include/exclude
      include 只处理包含 XXX 的文件
      exclude 排除 xxx 文件

    5. cache 缓存
      每次打包时 js 文件都要经过Eslint检查和 Babel编译，速度比较慢
      我们可以缓存之前的Eslint检查和Babel编译结果，这样打包时速度就会更快

    6. 多进程
    

*/
