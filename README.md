# GodGuide

#### 特别鸣谢
- 感谢「黝黑蜗壳」提供的GodGuide引导框架的TypeScript版本

#### 注意事项
- master分支为js版本
- typescript分支为ts版本
- 在两个版本之间切换时请关闭Creator
- 修改自动引导失效的BUG

因为两个分支中的资源文件名相同，uuid不同，如遇到到资源出错请删除temp/library目录，重新打开Creator进行编译

#### 介绍
Cocos Creator 新手引导框架，支持浏览器自动引导，流程录制与回放，可实现自动化测试！

#### 使用说明

1. 演示工程为Creator 2.3.2版本
2. 引导框架兼容 2.x.x 所有版本，低版本工程UI会有错乱请自行调整
3. 引导相关代码在assets/GodGuide目录下
4. Task1.js 、Task2.js 为引导任务配置

#### 微信公众号
![Cocos Creator 项目：如何较为优雅地实现新手引导? ](https://gitee.com/ShawnZhang2019/GodGuide/raw/master/creator-star.png)
#### GitChat

![Cocos Creator 项目：如何较为优雅地实现新手引导? ](https://gitee.com/ShawnZhang2019/GodGuide/raw/master/gitchat.jpg)

#### 更新说明
1. 增加typescript分支为ts版本
2. 在浏览器、原生环境、微信小游戏上实现节点点击模拟，完成引导任务的自动执行
3. 修复在2.3.2版本上的兼容问题