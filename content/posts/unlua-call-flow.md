---
title: "UnLua 函数调用链路剖析"
date: "2026-06-30"
category: "架构学习"
tags: ["UnLua", "Lua", "调用链"]
excerpt: "从 Lua 端调用到 C++ ProcessEvent 的完整链路，包含闭包概念。"
published: true
---

# 函数调用链路

相关的html路径为：
:information_source: 关联文档：UnLua函数调用链路剖析.html

找到缓存函数到Map中的函数：
	此函数在ClassDesc中就是类的描述文件，class还有一个注册文件呢叫classregister
	
> ClassRegistry文件和classdesc在职责和功能上有什么不同？

这个需要区分一下，先明了文件职责：
- 注册字段并不是ClassRegister的事，这个要清楚，注意名称和实际用途，他的职责只有两个Find和Register

![unlua 调用函数流程](/images/unlua 调用函数流程.png)



# Lua闭包概念理解
