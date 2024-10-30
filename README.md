# 二手骑行交易市场
这是一个基于 UniApp 开发的二手骑行交易平台，后端使用express开发，用户可以注册、登录，发布、浏览、收藏、购买二手骑行商品，与卖（买）家沟通协商，并管理个人账户信息、订单、收货地址等。

## 功能

- **用户认证**
  - **登录**：用户可以使用手机号和密码进行登录。
  - **注册**：新用户可以创建账户，填写必要信息。


- **首页**
  - 显示热门商品和最新上架的闲置物品。
  - **搜索功能**：帮助用户快速找到感兴趣的商品。
  - **历史搜索记录**：用户可以查看历史搜索的信息

- **发布笔记**
  
  - 用户可以以发布**笔记**的形式，结合图片和文本信息，介绍自己想要出售的二手骑行商品，填写商品详情（如名称、价格、描述等）
  - 发布的笔记信息同步显示在个人中心页面
  
- **收藏笔记**

  - 用户可以收藏想进一步了解的二手骑行商品的笔记

  - **收藏**页面同步显示用户当前收藏的笔记

- **购买商品**

  - 与卖家协商达成一致后，买家可以下单购买商品
  - 订单信息同步显示在个人中心页面


- **聊天**
  - 买家可以在笔记详情页面与卖家发起会话，询问商品信息、商议价格等
  - **聊天**页面可以查看历史会话信息

- **个人中心**
  - 用户可以查看和编辑个人信息
  - 查看已购买（历史购买）的二手骑行物品订单信息
  - 收获地址管理
  - 查看已发布的、卖出的、买到的二手骑行商品

## 技术栈

- 前端：UniApp
- 后端：express
- 数据库：MySQL

## 快速开始
### 环境要求

- HBuilder X
- Python 3.x
- express
- MySQL

### 安装

#### 前端 (UniApp)

克隆仓库：
```bash
git clone https://github.com/RSL459/Second-hand-bike-trading-mall.git
进入项目目录：
```

使用HBuilder X运行微信开发者工具打开项目。

#### 后端（express）

后端搭建：https://blog.csdn.net/jsl123x/article/details/139031611

## 示例截图

### 登录页面

![image-20241030213011496](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241030213011496.png)

### 注册页面

![image-20241030213040069](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241030213040069.png)

### 首页

![image-20241029003456436](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029003456436.png)

#### 搜索页面

![image-20241029003529238](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029003529238.png)

#### 搜索详情页

![image-20241029003537335](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029003537335.png)

#### 笔记详情页

![image-20241029003634067](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029003634067.png)

### 发布笔记页面

![image-20241029003742279](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029003742279.png)



### 收藏页面

![image-20241029003714973](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029003714973.png)

### 购买页面

![image-20241029003854337](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029003854337.png)

### 消息页面

![image-20241029003803697](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029003803697.png)

### 个人中心

![image-20241029004004763](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029004004763.png)

#### 个人信息



#### 我发布的

![image-20241029004159812](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029004159812.png)

#### 我卖出的

![image-20241029004207508](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029004207508.png)

#### 我买到的

![image-20241029004216842](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029004216842.png)

#### 地址管理

![image-20241029004251047](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029004251047.png)

##### 新建/修改地址

![image-20241029004258968](C:\Users\legion\AppData\Roaming\Typora\typora-user-images\image-20241029004258968.png)

