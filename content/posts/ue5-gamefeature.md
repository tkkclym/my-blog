---
title: "UE5 GameFeature 框架学习笔记"
date: "2026-04-14"
category: "架构学习"
tags: ["GameFeature", "模块化", "资源管理"]
excerpt: "GameFeature 的加载策略、Policy 管理、资源异步加载与 GFD/GFA 核心概念。"
published: true
---



# GameFeature学习 
# 启动Game Feature的做法：

1. 插件中开启Game Features，开启Modular Gameplay 插件

2. 添加插件，根据使用的是Cpp还是blueprint选择创建哪个插件，注意不要将生成的GameFeature路径离开原本的..\GameFeatures
![GameFeature学习](/images/GameFeature学习.png)

3. 进入项目设置中搜索AssetManager，检查下是否项目中有能够搜索GameFeatureData的设置，如果没有需要手动添加.为什么需要确保这边AssetManager有GameFeatureData主资产类型呢？因为 ：**GameFeature强依赖于资产管理器的资源探测 ，然后加载释放对应的资产**

创建完成之后就可以对数据资产进行配置使用。

# 大致重点



* 配置大部分都是配置的组件

* 对目标Actor配置组件的话，需要提前进行**注册监听**，这样才能够在Active一种游戏类型的时候成功触发对应的Action配置。  如果对Actor不想一个个绑定的话，可以在一个Actor基类中绑定处理然后用其子类 或者ModularGameplay中有定义的一个ModularGameplayActors  ，其中就实现了绑定，直接继承父类使用即可。

  *

    ![GameFeature学习-1](/images/GameFeature学习-1.png)

* 激活GameFeature：

  * 代码Api触发 [<span style="color: rgb(36,91,219); background-color: inherit">GameFeaturesSubsystem</span>](https://zhida.zhihu.com/search?content_id=192616582\&content_type=Article\&match_order=1\&q=GameFeaturesSubsystem\&zhida_source=entity)提供的C++ API

  * 编辑器按钮触发

  * 命令行触发



## GameFeature相关的一些关键类和结构

* GameFeature缩写 GF。代表一个GameFeature插件

* UGameFeatureData缩写GFD, 纯数据资产配置，一个插件里面一个，作用：描述GF要做的动作和需要的数据资产

* UGameFeatureAction缩写GFA, 单个动作。引擎内已经预设了几个Action，我们可以拓展使用，预设的用的较多的就是添加组件，添加数据注册等
	![GameFeature学习-2](/images/GameFeature学习-2.png)

* UGameFeatureSubsystem缩写 GFS, GF框架的管理类，全局的API都在这里

* UGameFrameworkComponentManger缩写 GFCM，支撑addComponent Action作用的管理类，记录为Actor添加了哪些Component 以便GameFeature卸载的时候移除掉。

* UGameFeaturePluginStateMachine  GFSM  就是个状态机嘛。记录每个GF（GameFeature）的状态，来管理自身的加载或者卸载逻辑。

# 简易理解

### 最初初始化

框架的核心管理类是GameFeatureSubsystem，其继承自EngineSubsystem，这就意味着其是跟随引擎进行启动关闭的，这在Runtime时候不会有什么影响，但是在Editor模式要注意GF状态也是生效的，所以最好还是通过游戏中的动态加载激活卸载等操作.

* 初始化的时候UGameFeaturesSubsystem::Initialize中进行创建了<span style="color: inherit; background-color: rgba(183,237,177,0.8)">GameSpecificPolicies </span>，这个就是用于处理加载策略的

* 同时初始化的时候也注册了很多编辑器的控制台命令，但是这些对当前阶段的我并不重要

创建不同的GF，每个GF中都有一个和该GF同名的GFD , 每个GFD描述了该GF激活的时候要执行的GFA以及对应的资产。

* GF激活的时候会出 执行 Action::OnGameFeatureActivating()

* GF取消激活的时候 执行  Action:: OnGameFeatureDeactivating()



>**注意：GF状态在编辑器模式下依然存续，因此可能会<span style="color: rgb(216,57,49); background-color: inherit">跨游戏</span>依然存在，要记得自己取消激活状态。

### 创建GF加载策略

#### 问题汇总1

> 那GF的加载策略是如何管理的？怎么确定哪些GF应该激活，哪些应该禁用，客户端和服务器是否都要加载或者单独加载？哎，这边管理的使用GameFeatureSubsystem进行管理，其中创建一个Pllicy策略对象进行控制 。 那加载就是加载到内存中？还是哪里呢？

刚下我们说的GameSpecificPolicies ，他默认会加载所有的GF;以当我们想要实现一些加载策略的时候就需要自己重载，比如通过游戏版本进行filter，过时版本的GF全都禁用等，

* 那GF筛选逻辑写在哪里？Init的过滤器中

* 但是要是想要配置的话，要先在**项目设置**里配置上Additional Plugin Metadata Keys，才能把**uplugin文件**里的自定义键识别解析到PluginDetails.AdditionalMetadata里
* 所以如果我在uplugin文件中写的有游戏版本号、tag、或者有其他配置的枚举值，就可以在项目设置中进行选择，后开始筛选

#### 回答【问题汇总1】

1. <u>那GF的加载策略是如何管理的？</u>
	`UGameFeatureSubsystem` 是GF管理的核心入口，所有的GF激活禁用加载都将通过这里完成，这里持有一个Policy对象。
2. <u>怎么确定哪些GF应该激活，哪些应该禁用，客户端和服务器是否都要加载或者单独加载？</u>
	1. 就是由policy对象决定了，它的核心作用就是加载规则的决策者。至于决定什么需要自定义继承自 `UGameFeaturePolicy` 的子类
	      1. **哪些 GF 应该被激活 / 禁用**：通过过滤 GF 的标签（Tag）、优先级、加载阶段等条件判断。
	      2. **客户端 / 服务器是否分别加载**：明确 GF 是仅客户端、仅服务器，还是双端加载。可以通过`IsRunningOnClient()`/`IsRunningOnServer()` 接口，进一步过滤不同端的 GF 加载（如服务器端仅激活战斗相关 GF）。
	      3. **加载时机**：比如启动时加载、关卡加载后加载、按需加载（如进入战斗时加载战斗相关 GF）。
	   2. 其实GF本身也支持配置加载范围，比如GF 资产的 `Settings` 中，可设置 `Supported Targets`（支持的目标端）：
	      * `Client Only`：仅客户端加载（如 UI、特效相关 GF）。
	      * `Server Only`：仅服务器加载（如战斗逻辑、数据校验相关 GF）。
	      * `Client and Server`：双端加载（如通用配置、核心逻辑 GF）
3. <u>那加载就是加载到内存中？还是哪里呢？</u>
	   1. 不仅仅是简单的加载到内存，而是分阶段的资源注册和实例化
	      1. 元数据加载到内存
	      2. 资源加载。激活GF的时候会加载相关的资源，蓝图，材质，音效，
		   **代码/蓝图**： 加载到内存中并注册到引擎的类系统中
		   **纹理/材质/模型**:加载到显存（客户端），供渲染使用；服务端无渲染，仅加载逻辑相关资源到内存
		   **模块注册**：GF关联的模块/插件会被加载到内存并初始化。生命周期与 GF 绑定（GF 禁用时，可卸载未被其他 GF 依赖的模块）。
		   **持久化**：GF 加载后默认驻留内存，直到被显式禁用 / 卸载，或引擎退出；**也可通过 Policy 配置** “按需卸载”（如离开战斗后卸载战斗 GF 释放内存）。



#### 问题汇总2：

> 激活时加载关联资源那是异步的还是同步加载呢？如果美术资源过大会不会导致卡顿，其底层如何实现的？还是说也是又自定义的Policy控制加载美术资源的方式？

这里就有显示出来AssetManger的优势了，GF 加载美术资源的底层依赖虚幻的 `UAssetManager`（资源管理器）和 `FStreamableManager`（流式加载管理器） ，使用这个默认异步加载。



#### 回答【问题汇总2】

GF 激活时加载关联资源**并非单一的同步或异步**，而是分 “核心逻辑资源” 和 “美术资源” 两类处理，默认规则如下：

1. **核心逻辑资源（代码 / 蓝图 / 配置）**：默认**同步加载**

   * 这类资源是 GF 功能运行的基础（如战斗逻辑蓝图、技能配置表），体积小、加载快，同步加载能保证 GF 激活后功能立即可用，不会有逻辑断点。

2. **美术资源（纹理 / 模型 / 音效 / 动画）**：默认**异步加载**

   * 虚幻引擎对大体积美术资源有内置的异步加载机制，GF 激活时会将这类资源加入 “异步加载队列”，后台加载完成后再注册到 GF 中，避免主线程阻塞。

### 加载解析GF.uplugin

原文大钊的源码已经和5.6有出入了，但是还是能借鉴的，起码最后确实是通过ProcessGameFeaturePlugin然后调用到了LoadBuiltInGameFeaturePlugin

