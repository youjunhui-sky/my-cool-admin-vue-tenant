# 强制登录功能说明

## 功能概述

本系统已实现强制登录功能，确保每次访问系统时都需要重新登录，而不是自动登录到系统。这样可以提高安全性，防止用户绕过登录界面直接进入系统。

## 主要特性

### 1. 强制重新登录

- **每次访问登录页**：无论用户是否已登录，访问登录页面时都会清除所有缓存
- **路由守卫保护**：在路由守卫中检测到已登录用户访问登录页时，自动清除所有缓存
- **缓存完全清除**：清除用户信息、菜单信息、权限信息等所有相关缓存

### 2. 缓存清除机制

- **用户缓存**：token、refreshToken、userInfo等用户相关数据
- **菜单缓存**：菜单组、权限列表等菜单相关数据
- **系统缓存**：其他可能影响登录状态的缓存数据

### 3. 安全保护

- **防止自动登录**：确保用户每次都需要手动输入用户名和密码
- **清除过期数据**：自动清除过期的token和用户信息
- **强制重新验证**：每次登录都需要重新验证用户身份

## 技术实现

### 核心文件

- `src/cool/router/index.ts` - 路由守卫逻辑
- `src/modules/base/pages/login/index.vue` - 登录页面缓存清除
- `src/modules/base/store/user.ts` - 用户状态管理
- `src/modules/base/store/menu.ts` - 菜单状态管理
- `src/modules/base/utils/clear-cache.ts` - 缓存清除工具

### 路由守卫逻辑

```typescript
// 如果用户已登录
if (user.token) {
	if (to.path.includes('/login')) {
		// 每次访问登录页都清除用户信息，强制重新登录
		user.clear();
		console.log('路由守卫：检测到已登录用户访问登录页，已清除所有缓存');
		next();
		return;
	} else {
		process.add(to); // 添加路由进程
	}
} else {
	// 清除用户信息
	user.clear();

	// 如果路径不在忽略 Token 验证的列表中，重定向到登录页
	if (!config.ignore.token.some(ignorePath => to.path === ignorePath)) {
		next('/login');
		return;
	}
}
```

### 缓存清除函数

```typescript
/**
 * 清除所有系统缓存（包括用户、菜单、权限等）
 */
export function clearAllCache() {
	// 清除用户相关缓存
	clearUserCache();

	// 清除菜单相关缓存
	storage.remove('base.menuGroup');
	storage.remove('base.menuPerms');
	storage.remove('menu');
	storage.remove('perms');

	// 清除其他可能相关的缓存
	storage.remove('user');
	storage.remove('process');
	storage.remove('app');

	console.log('所有系统缓存已清除');
}
```

## 使用场景

### 1. 正常登录流程

1. 用户访问系统
2. 路由守卫检测到没有token，重定向到登录页
3. 登录页面自动清除所有缓存
4. 用户输入用户名和密码
5. 登录成功后跳转到首页

### 2. 已登录用户访问登录页

1. 已登录用户访问登录页
2. 路由守卫检测到有token，清除所有缓存
3. 用户需要重新输入用户名和密码
4. 登录成功后跳转到首页

### 3. 管理员清除缓存

1. 管理员在用户管理页面点击"清除缓存"按钮
2. 系统清除所有用户的缓存数据
3. 所有用户需要重新登录

## 缓存清除范围

### 用户相关缓存

- `token` - 用户访问令牌
- `refreshToken` - 刷新令牌
- `userInfo` - 用户信息
- `token_deadtime` - token过期时间
- `refreshToken_deadtime` - refreshToken过期时间
- `username` - 用户名
- `locale` - 语言设置

### 菜单相关缓存

- `base.menuGroup` - 菜单组数据
- `base.menuPerms` - 菜单权限数据
- `menu` - 菜单数据
- `perms` - 权限数据

### 系统相关缓存

- `user` - 用户状态
- `process` - 进程状态
- `app` - 应用状态

## 安全优势

### 1. 防止自动登录

- 每次访问系统都需要重新登录
- 防止用户绕过登录界面
- 确保用户身份验证的严格性

### 2. 清除过期数据

- 自动清除过期的token
- 防止使用过期数据进行自动登录
- 确保登录状态的有效性

### 3. 强制重新验证

- 每次登录都需要重新验证用户身份
- 提高系统的安全性
- 符合安全最佳实践

## 调试信息

系统会在控制台输出调试信息，帮助排查问题：

```
=== 路由守卫调试信息 ===
目标路径: /login
用户token: xxx
用户信息: xxx
token是否过期: false
refreshToken是否过期: false

路由守卫：检测到已登录用户访问登录页，已清除所有缓存
登录页面：已清除所有系统缓存数据
用户store：已清除所有用户缓存数据
菜单store：已清除所有菜单缓存数据
```

## 常见问题

### Q1: 为什么每次都要重新登录？

A1: 这是系统的安全设计，确保每次访问都需要重新验证用户身份，防止自动登录绕过安全机制。

### Q2: 如何禁用强制登录？

A2: 可以修改路由守卫逻辑，注释掉清除缓存的代码，但这样会降低系统安全性。

### Q3: 清除缓存会影响什么？

A3: 清除缓存会重置用户的登录状态、菜单信息、权限信息等，用户需要重新登录获取这些信息。

### Q4: 如何测试强制登录功能？

A4: 可以登录后直接访问 `/login` 页面，系统会自动清除缓存并强制重新登录。

## 更新日志

- **v1.0.0** (2024-01-01)
    - 实现强制登录功能
    - 修改路由守卫逻辑
    - 增强缓存清除机制
    - 添加调试信息输出
    - 完善用户和菜单状态管理
