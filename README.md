## boomJS

@(boomJS)[v1.1]
### 一、简介
- 基于jquery
- 使用ES6语法

### 二、demo
#### 1、使用
    $([selector]).imgBoom(option);
#### 2、参数说明
- columns：分割列数，数字(defalut:8)
- row：分割行数，数字(defalut:8)
- isBlur： 是否使用模糊效果（分割太多会卡顿）(default: false)
- isBoom： 是否添加点击炸裂效果（会删除元素）(defalut: false)
- idCanvas: 是否启用canvas(default: true)
- direction: 爆炸起始方向('left','right','center')(default: 'center')
- duration：动画时长(default: 1000ms)
- spaceTime: 绑定一组图片时出现间隔时长(default: 1000ms)
#### 3、效果
![boomjs.gif](https://raw.githubusercontent.com/lastnigtic/presentationPIC/master/boomJs/0.gif)
    
