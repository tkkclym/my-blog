---
title: "UnLua 深入理解：元表、Proxy Table 与双端 GC"
date: "2026-06-29"
category: "架构学习"
tags: ["UnLua", "Lua", "元表", "GC", "ProxyTable"]
excerpt: "深度剖析 UnLua 中 setmetatable、__index、__newindex 机制，Lua VM 栈调用追踪与双端垃圾回收。"
published: true
---


从C++ 角度来讲，setmetatable 是什么功能
Camera中有一段这个：
```lua

	function g_Camera:AddConfig(Type,Config)
		Config = Config or {}
		setmetatable(Config,l_BaseConfig)
		l_BaseConfig.__index = l_BaseConfig 
		self.Configs[Type] = Config
	end
```
一个是`setmetatable(t, mt ) `  还有一个是`__index`
`mt`就相当于一个虚函数表
当 `t `中有找不到的`key`就去`mt`中寻找

- `setmetatable(t, mt ) `就是给 对象t绑定一个虚函数表。
- `__index`就是 继承自哪个类
``
注意：**setmetatable 只是登记关系**；`__index` 才是告诉 Lua "去哪找" 的导航。没有` __index`，元表就是个摆设

![unlua相关](/images/unlua相关.png)


## 错误写法：
![unlua相关-1](/images/unlua相关-1.png)
思路方向对了——你意识到了` __index` 要放在某个地方。**但是!!**
如果把`{__index = self.l_selfBaseCamera }` 放到local l_selfBaseCamera中有两个错误！
1. 这样放进去就相当于是是 l_selfBaseCamera 的第 4 个元素（l_selfBaseCamera[4]），是一个普普通通的值——跟元表机制没有任何关系。
2. ❌ self在顶层模块根本不存在
	```lua
	local l_selfBaseCamera - {
		...
		{ __index = self.l_selfBaseCamera } --self为nil
		}
		self 只有在用 : 调用函数时才有值。在模块最外层，self 就是 nil，self.l_selfBaseCamera 会直接报错：attempt to index a nil value。
		
		 而且退一步说，就算 self 存在，你也不能写 self.l_selfBaseCamera——因为 l_selfBaseCamera 是 local 的，不是 self 的字段。
	```




> 那派生类Config中的函数如果是其他逻辑，是不是意味着就直接用派生类的逻辑了，如果没有，就通过__index去元表中找函数
> 
  一句话：自己有就用自己，没有才去基类找。 跟 C++ 的**虚函数覆写**一个道理。**你彻底理解了。**

## 对Lua拦截的理解

 ❌错误想法：  拦截的意思就是更高优先级的处理，如果这里对某个变量做写操作了，如果蓝图中此变量也被写了，就会优先使用lua中的操作是吗

拦截的意思不是抢控制权，是中间人转发！
假如C++ Object内存中有一个int32 Health =100 

蓝图中修改Health = 44, lua中修改 Health =30 
他俩并不是各自拥有一块份数据，而是共享一个C++内存的对象。谁最后写的谁生效

而__index的作用是，**转发**
也就是我在Lua中写  widget.Health = 30 的时候，发生了什么呢？
- widget在lua中是一个代理表，在lua中没有“Health”这个值
- 然后触发__newindex(t, "Health", 30)
- unlua C++收到通知，把Widget对应的UObject的Health属性设置为 30 
- C++内存被修改
  `__newindex` 在这里的意思是："这个 Lua proxy table 自己没有 Health 字段，但我（元表）知道怎么把值写到 C++ 那边去"。它是个翻译官，不是裁判。

```lua
  对比一下：

  -- 普通 Lua 表（没有 __newindex）
  local t = {}
  t.x = 100     -- t 身上直接创建字段 x = 100

  -- UnLua proxy table（有 __newindex）
  local widget = GetWidget()     //proxy table
  widget.Health = 30             //__newindex 拦截！
                                //不会在 widget 身上创建 "Health" 字段
                                //而是转发到 C++：UObject->Health = 30
                               
如果不拦截，Health 就被写在 Lua proxy table 自己身上了，跟 C++ 那边完全断开，两边数据就不一致了。
```

## ⚠️注意：
在访问C++相关的引用的时候unlua返回的是已经包装好的proxy table
	我们在写的时候是 local w =self.MyButton ，但是unlua别后执行的是返回一个proxytable 也就是metatable已经设好了 `__index`是读C++反射，`__newindex` 是写C++反射  `__gc`是管理生命周期
这个就像什么呢，写C++的时候不用关心vtable是怎么构造的，如果是  obj->DoSomething();  // 虚函数调用，vtable 在背后工作， 你从来看不到 vtable，但知道它存在。
![unlua怎么和UE交互](/images/unlua怎么和UE交互.png)


## userdata  ，proxy table ,元表 三者有什么关系呢？

首先userdata是数据类型。 一块儿由lua管理生命周期的内存。

proxytable一般就是我们获取的C++的引用， widget.Health = 30我们访问的是Proxy Table 表面看就是普通的table
实际上里面是有userdata的，而元表是C++ UObject
- 元表拦截所有操作，通过`__index `，`__newindex` 等操作
	读操作， local helath = widget.Health是元表拦截之后完成的
	- ```
	__index    = function(t, k)   → 读 userdata 内的指针
         GetCppProp(t.__ud, k)   → 查 UClass 反射  
 end                          → 返回 C++ 值
	```
	写操作，widget.Health = 40  也是元表拦截之后完成的
	-  ```
 __newindex = function(t, k, v)    → 读 userdata 里的指针
    SetCppProp(t.__ud, k, v)     → 写 C++ 内存
 end              
	```
	
	![userdata元表proxytable之间的关系](/images/userdata元表proxytable之间的关系.png)
## 模拟lua虚拟机 **写** 操作追踪
	widget.Health = 30
1. Lua VM :  widget是什么？是Proxy table
2. Lua VM :  widget是什么自身有Health字段吗？-》没有
3. Lua VM :  widget有元表吗？ -》有
4. Lua VM :  元表有`__newindex`吗？ 有，是个function
5. Lua VM :  调用 `__newindex(widget,"health",30)`
6. Unlua C++  : fucntion ( t , k  ,v )
	1. `t.__ud` 取出 userdata 
	2. 把userdata转成UObject*
	3. 查取UClass反射 -> 找到Health对应的UProperty 
	4. 把30写进 C++内存： `*(int*)((uint8*)obj+property->Offset) = 30`
7. 结束
 ---
  为什么用 userdata 而不是直接在 table 里存指针？

  因为 UObject* 是一个 C++ 指针（8 字节的地址），Lua 不认识。你得把它包在一个 Lua 能操作的类型里

三者比喻一下就是 proxytable的__ud字段是Userdata  ,这个是桥梁。
proxytable是unlua端的门面
metatable 元表  是调度中心。


# 双端垃圾回收

unlua和ue都有垃圾回收，双GC具有生命周期协调处理
UE回收对象之后会解除lua引用，避免悬垂指针。
Lua GC 回收 proxy table 时仅解除引用，不销毁 C++ 对象。

| 场景                 | UnLua 的处理                              |
| ------------------ | -------------------------------------- |
| UObject 被 UE GC 销毁 | 注册生命周期回调，自动解除 Lua 引用，防止野指针             |
| Lua 侧对象被 GC        | 检查 C++ 侧是否存活，仅解除 Lua→C++ 引用，不销毁 C++ 对象 |
| 关卡切换               | 清理旧关卡 Lua 绑定，重新绑定新关卡对象                 |
| 手动 `Release()`     | 显式解除绑定，提前释放 Lua 对 C++ 的引用              |


# luaVM 栈是什么意思


❯ 假如是个调取函数的逻辑，C++端执行了之后会返回值，这个值会被压进lua栈吗？这个栈怎么理解
 对，返回值就是通过 Lua 栈传回来的。这个栈是 Lua 和 C++ 之间唯一的通信通道。
 > 那Lua 栈是什么？
 一个双向传送带，C++ 和 Lua 各自往上面放东西、取东西
:information_source: 关联文档：Lua栈动画演示.html



那是栈就意味着是单线程、为什么这样设计？
1. luaVM是单线程
2. unlua绑定在UE游戏线程上
	1. ![unlua相关-2](/images/unlua相关-2.png)
3. UObject::ProcessEvent 不是异步的
	1. ![unlua相关-3](/images/unlua相关-3.png)
频繁的 Lua ↔ C++ 跨语言调用有开销，每一次都要：
  4. 参数压栈 / 类型转换
  5. 反射查 UFunction
  6. ProcessEvent 执行
  7. 返回值从栈取回


lua调用C++函数和C++调用lua函数是在C:\Users\yinming.li\Desktop\ProjectAir_5.5.1\Plugins\UnLua\Source\UnLua\Private\ReflectionUtils\FunctionDesc.cpp中处理的
分别对应两个函数:CallUE 和CallLua
## int32 FFunctionDesc::CallUE

> 此函数是lua调用C++ 函数的必经之路

该函数内覆盖上文我们说的调用过程，
- 首先就是从`__ud`获取了 UObject指针，从函数获取指针'
	- 如果是**静态函数**，就不需要实例，所以就是从**CDO** （Class default Object) 获取指针的 `Object = Function->GetOuterUClass()->GetDefaultObject();`
	- 如果是非静态函数，也就是**实例函数**，从 Lua 栈位置 1 取出 `UObject*`：`Object = UnLua::GetUObject(L, 1, false);` 直接获取Object指针
	-   这就是我们之前说的——**Lua 栈位置 1 压的是 self（proxy table）**，UnLua 从这里取 UObject*。    【😮 原来说的就是这里，之前动画演示是lua压进栈的第一个是self】
	- ![LuaVM 自动把Obj作为第一个参数压入栈](/images/LuaVM 自动把Obj作为第一个参数压入栈.png)
- 接着就是一个简单的判断指针是否可用的逻辑，不可用就报错
- 对函数类型做分支处理，通过指针调用函数GetFunctionCallspace 对即将执行的函数做区分，判断该函数应当本地调用、远程调用，还是直接忽略调用。
	- 生成俩bool: bRemote 和 bLocal
- 接着执行**PreCall**   ，参数是 Buffer->Get();  此函数作用：PreCall → 参数从 Lua 栈搬到 C++
- **注意**这里会有一个拦截转发，判断函数是否被Overriden，如果是，则执行的是Lua中Overridden之后的逻辑
- 接着根据上面的bool判断是本地执行还是远程执行
	- 如果是**local** ,则直接调用UE的ProcessEvent函数`Object->UObject::ProcessEvent(FinalFunction, Params);`  我们反复讲的这一步——UE 的反射调用，在当前线程上同步执行。
	- 如果是**RPC**，则调用的是`Object->CallRemoteFunction(FinalFunction, Params, nullptr, nullptr);`
-  执行**PostCall** 返回UE函数执行之后的结果，然后压入lua栈
	- ```lua
  int32 NumReturnValues = PostCall(L, NumParams, FirstParamIndex, Params, CleanupFlags);
  return NumReturnValues;  // 告诉 Lua VM "我压了 N 个返回值"
  
   PostCall 负责两件事：
  - out 参数：Lua 侧传的引用类型参数，值被修改后，写回 Lua 对应的变量
  - 返回值：函数的 return 值拆解后 lua_push* 到 Lua 栈
	  ```

这就是lua端调用C++函数的逻辑。

