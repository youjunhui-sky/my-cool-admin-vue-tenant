# 登录问题解决方案

## 问题描述

有时候系统不经过登录界面就直接进入系统，这是由于以下原因导致的：

1. **Token 持久化存储**：系统将登录token存储在本地存储中
2. **Token 未过期**：即使刷新页面，token仍然有效
3. **路由守卫逻辑**：系统检测到有效token时自动跳转到首页

## 解决方案

### 方案一：登录页面自动清除缓存（已实现）

在登录页面添加了自动清除缓存的功能：

```typescript
// 页面加载时清除可能存在的旧数据
onMounted(() => {
	// 清除可能存在的旧token和用户信息
	storage.remove('token');
	storage.remove('refreshToken');
	storage.remove('userInfo');
	storage.remove('token_deadtime');
	storage.remove('refreshToken_deadtime');
});
```

### 方案二：增强路由守卫验证（已实现）

修改了路由守卫逻辑，增加了更严格的验证：

```typescript
// 如果用户已登录
if (user.token) {
	if (to.path.includes('/login')) {
		// 如果在登录页且 Token 未过期，重定向到首页
		if (!storage.isExpired('token')) {
			// 增加额外的验证：检查用户信息是否存在
			if (user.info) {
				next('/');
				return;
			} else {
				// 如果token存在但用户信息不存在，清除token并留在登录页
				user.clear();
			}
		} else {
			// token已过期，清除用户信息
			user.clear();
		}
	}
}
```

### 方案三：调试信息（已实现）

在路由守卫中添加了调试信息，帮助排查问题：

```typescript
// 添加调试信息
console.log('=== 路由守卫调试信息 ===');
console.log('目标路径:', to.path);
console.log('用户token:', user.token);
console.log('用户信息:', user.info);
console.log('token是否过期:', storage.isExpired('token'));
console.log('refreshToken是否过期:', storage.isExpired('refreshToken'));
```

### 方案四：清除缓存工具（已实现）

创建了清除缓存的工具函数：

```typescript
// src/modules/base/utils/clear-cache.ts
export function clearUserCache() {
	storage.remove('token');
	storage.remove('refreshToken');
	storage.remove('userInfo');
	storage.remove('token_deadtime');
	storage.remove('refreshToken_deadtime');
	storage.remove('username');
	storage.remove('locale');
}

export function forceReLogin() {
	clearUserCache();
	window.location.href = '/login';
}
```

### 方案五：用户管理页面清除缓存功能（已实现）

在用户管理页面添加了清除缓存按钮，管理员可以强制清除所有用户缓存。

## 使用方法

### 1. 开发环境调试

打开浏览器开发者工具，查看控制台输出的调试信息：

```
=== 路由守卫调试信息 ===
目标路径: /login
用户token: xxx
用户信息: xxx
token是否过期: false
refreshToken是否过期: false
```

### 2. 手动清除缓存

在浏览器控制台执行：

```javascript
// 清除所有用户相关缓存
localStorage.clear();
sessionStorage.clear();
```

### 3. 管理员清除缓存

在用户管理页面点击"清除缓存"按钮，会强制所有用户重新登录。

### 4. 强制重新登录

在浏览器控制台执行：

```javascript
// 导入清除缓存函数
import { forceReLogin } from '/src/modules/base/utils/clear-cache';
forceReLogin();
```

## 预防措施

### 1. 定期清除缓存

建议定期清除用户缓存，特别是在以下情况：

- 系统更新后
- 安全策略变更后
- 用户反馈登录问题时

### 2. 监控登录状态

可以通过以下方式监控登录状态：

```typescript
// 检查用户登录状态
function checkLoginStatus() {
	const token = storage.get('token');
	const userInfo = storage.get('userInfo');
	const isTokenExpired = storage.isExpired('token');

	console.log('登录状态检查:', {
		hasToken: !!token,
		hasUserInfo: !!userInfo,
		isTokenExpired,
		shouldReLogin: !token || !userInfo || isTokenExpired
	});
}
```

### 3. 设置合理的Token过期时间

在系统配置中设置合理的token过期时间：

```typescript
// 建议设置
const TOKEN_EXPIRE_TIME = 2 * 60 * 60; // 2小时
const REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60; // 7天
```

## 常见问题

### Q1: 为什么有时候会直接进入系统？

A1: 这是因为本地存储中还有有效的token和用户信息。系统检测到有效token时会自动跳转到首页。

### Q2: 如何强制用户重新登录？

A2: 可以通过以下方式：

1. 在用户管理页面点击"清除缓存"按钮
2. 在浏览器控制台执行 `localStorage.clear()`
3. 使用提供的 `forceReLogin()` 函数

### Q3: 如何调试登录问题？

A3: 查看浏览器控制台的调试信息，了解：

- 当前token状态
- 用户信息状态
- token是否过期
- 路由跳转逻辑

### Q4: 如何防止用户绕过登录？

A4: 已实现的解决方案包括：

1. 登录页面自动清除旧缓存
2. 增强的路由守卫验证
3. 严格的token和用户信息检查
4. 管理员清除缓存功能

## 技术细节

### Token 存储机制

系统使用 `store` 库进行本地存储：

```typescript
// 存储token
storage.set('token', token, expireTime);

// 检查是否过期
storage.isExpired('token');

// 清除token
storage.remove('token');
```

### 路由守卫逻辑

```typescript
router.beforeEach(async (to, from, next) => {
	// 1. 检查用户token
	if (user.token) {
		// 2. 如果在登录页且token有效，跳转首页
		if (to.path.includes('/login') && !storage.isExpired('token')) {
			if (user.info) {
				next('/');
				return;
			}
		}
	} else {
		// 3. 没有token，跳转登录页
		user.clear();
		if (!config.ignore.token.some(ignorePath => to.path === ignorePath)) {
			next('/login');
			return;
		}
	}

	next();
});
```

## 更新日志

- **v1.0.0** (2024-01-01)
    - 实现登录页面自动清除缓存
    - 增强路由守卫验证逻辑
    - 添加调试信息输出
    - 创建清除缓存工具函数
    - 在用户管理页面添加清除缓存功能
