import {count , sum} from './js/index'

// 编译css、 less 、scss 、stul等央视文件
import './css/reset.css'
import './css/index.less'
import "./css/index.scss"
import './css/index.css'
import './image/123.jpg'

import './font/fonts/iconfont.css'

import {sumCount} from './js/math'
let countNum = sumCount(1,2,3,4,5)
console.log(countNum)

console.log(count(1, 2))
console.log(sum(1, 2, 3))