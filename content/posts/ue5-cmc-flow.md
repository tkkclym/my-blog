---
title: "UE5 CMC（角色移动组件）流程学习"
date: "2026-04-10"
category: "架构学习"
tags: ["CMC", "网络同步", "UE5"]
excerpt: "深入分析 UE5 角色移动组件的 Tick 流程、服务端/客户端预测与网络同步机制。"
published: true
---

# CMC流程学习 



## 架构梳理

## TickComponent中流程梳理

首先在Tick的时候做了大量前置判断
-  判断是不是异步输入模拟，我们的项目是没有开异步输入模拟的，这个主要是为了优化性能`bUsingAsyncTick`
- 判断数据是否可用【此相关函数目前被注释了】判断是不是该跳过更新`if (!HasValidData() || ShouldSkipUpdate(DeltaTime)) {return }` 哪些需要跳过的，比如如果移动的组件未被渲染或无法移动，可能会跳过更新。
- 接着`Super::TickComponent` 这里对数据进行了重新检查  因为可能会破坏/使CharacterOwner或UpdatedComponent失效，因此我们需要重新检查。
- 接着是如果是异步输入将会有xxxx逻辑，不看了，我们项目没使用
- 对是否掉出世界进行判断，如果是则return
- 如果处于物理模拟，如布娃娃效果，则return 不进行tick移动
- 更新AvoidanceLockTimer 这个属性是 ：规避速度锁定的剩余时间
- 然后判断是哪端，这里用的比大小，因为enum也是数字嘛`if (CharacterOwner->GetLocalRole() > ROLE_SimulatedProxy)`
	- 这里就分了服务端和移动端:
	
切分为大章节学习:
### 服务端 


### 客户端


### 预测

预测的信息是存在了移动组件中
```C++
class FNetworkPredictionData_Client_Character* ClientPredictionData;  
class FNetworkPredictionData_Server_Character* ServerPredictionData;
```
其中有三个函数



服务端执行的代码流程 TickComponent ->ControlledCharacterMove 1684 -> 如果是模拟端或者客户端 ReplicateMoveToServer 
接着在这个**ReplicateMoveToServer函数**中就有分支了，为什么会有
```C++
if (bSendServerMove)  
{  
    SCOPE_CYCLE_COUNTER(STAT_CharacterMovementCallServerMove);  
    if (ShouldUsePackedMovementRPCs())  
    {       
	    CallServerMovePacked(NewMove, ClientData->PendingMove.Get(), OldMove.Get());  
    }    
    else  
    {  
	    CallServerMove(NewMove, OldMove.Get());  
    }}
```
而且进去CallServerMove函数中是在`!const FSavedMove_Character* const PendingMove = ClientData->PendingMove.Get()`的时候调用了`ServerMove`但是我看**ServerMove**也是被标记了**DEPRECATED**  

所以我就在想是不是CallServerMove分支已经被禁用了？实际上大部分情况走的都是`CallServerMovePacked(NewMove, ClientData->PendingMove.Get(), OldMove.Get());`呢？ **是的！**

現代标准流程确实是走的CallServerMovePacked，else分支知识为了兼容极其古老的遗留项目.
如图：
	![[CMC流程学习.png]]
那为什么要使用Packed呢？我们先来看看旧框架的痛点
RPC爆炸和参数僵化 ）CallServerMove时代，客户端向服务端发送移动请求的时候，为了处理各种复杂网络环境会有一大堆重载的RPC函数，。**这非常致命！** 


- RevertMove 回滚操作
	- 在PhysWalking 中有调用

- ROLE_SimulatedProxy玩家会在Tick中执行移动相关的Tick逻辑，主要是在SimulatedTick 函数中

- 此时我们仅对 本地玩家 walk状态进行讨论 
- 在执行到 PhysWalking的时候
	PerformMovement->StartNewPhysics -> PhysWalking
