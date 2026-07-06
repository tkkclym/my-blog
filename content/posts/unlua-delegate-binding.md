---
title: "UnLua 委托绑定与事件监听机制"
date: "2026-06-25"
category: "架构学习"
tags: ["UnLua", "委托", "事件系统"]
excerpt: "Lua 端监听 C++ 动态多播委托，UMG 按钮事件的底层委托实现。"
published: true
---

lua端是能够监听C++端的广播的，之前没有注意，比如在gameState中的广播信息能够直接在lua端进行监听 

C++端声明和注册成员变量
```C++
声明动态委托类型
DECLARE_DYANMIC_MULTICAST_DELEGATE_TwoParams(FOnAtmosphereIDChanged,int32,AtmosphereID,int32,OldAtmosphereID);

定义委托实例对象，并通过UProperty暴露给蓝图。
BlueprintAssignable 意味着蓝图中可以绑定
BlueprintCallable 意味着蓝图中可以进行广播
UPROPERTY(BlueprintAssignable, BlueprintCallable)  
FOnAtmosphereIDChanged OnAtmosphereIDChanged;
```

```lua


	蓝图能干的事，unlua同样能够实现，所以unlua中能够绑定C++的动态委托。
	如下，某一个类的unlua文件中：
	function M:ReceiveBeginPlay()
		local gameState = UE.UGameplayStatics.GetGameState(self)
		if not ObjectValid(gameState) or not gameState.OnAtmosphereIDChanged then 
			  return
		end
	end
	然后就能够绑定C++侧的委托了
	gameState.OnAtmosphereIDChanged:Add(self,self.OnAtmosphereChanged) 这个回调函数就能够在此文件实现了
```

  `UnLua` 通过反射系统，自动把 `FOnAtmosphereIDChanged` 这种 `FProperty` 类型的成员导出到` Lua`，包装成带` :Add() / :Remove() `方法的对象
  
这个和我们的unlua中的系统是互补的关系：
![MsgEvent和C++中的动态委托对比](/images/MsgEvent和C++中的动态委托对比.png)

有以下两个问题：

- 同理UMG中的按钮等一些点击事件等Add是委托吗？
	- ```lua
	    function M:OnCreateUI(param)
		    self.Overridden.OnCreateUI(self, param)
		    self.Btn_Next.OnClicked:Add(self, self.OnBtnNextClick)
		    self.Btn_History.OnClicked:Add(self, self.OnBtnHistoryClick)
		    self.Btn_ClosePopup.OnClicked:Add(self, self.OnBtnClosePopupClick)
		    self.Btn_Auto.OnClicked:Add(self, self.OnBtnAutoClick)
	    end
	  ```

- 底层的Unlua吧Delegate变成Lua可调用的对象是怎么实现的呢？

## 问题1：

不要搞混，拿self.Btn_Next举例：

self.Btn_Next是面板**变量**  ， Slef.Btn_Next.OnClicked 是**事件**

self.Btn_Next在UMG图形界面设置为变量之后会被UE自动生成一个Uproperty
