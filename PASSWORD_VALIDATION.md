# 密码验证功能说明

## 功能概述

本系统实现了符合最新互联网安全要求的密码验证功能，基于NIST、OWASP等国际安全标准，确保用户密码的安全性。

## 主要特性

### 1. 密码强度验证

- **长度要求**：最少8个字符，最多128个字符
- **字符类型要求**：
    - 至少一个大写字母 (A-Z)
    - 至少一个小写字母 (a-z)
    - 至少一个数字 (0-9)
    - 至少一个特殊字符 (!@#$%^&\*()\_+-=[]{}|;:,.<>?)

### 2. 安全防护

- **常见弱密码检测**：防止使用常见弱密码（如123456、password等）
- **连续字符检测**：防止使用连续字符（如123、abc等）
- **重复字符检测**：防止使用重复字符（如aaa、111等）

### 3. 用户体验

- **失去焦点验证**：密码框失去焦点后才显示验证结果
- **错误提示**：一次显示一行错误信息
- **简洁界面**：不显示密码强度等级，只显示错误提示

## 技术实现

### 核心文件

- `src/modules/base/utils/password-validator.ts` - 密码验证核心逻辑
- `src/modules/base/components/password-strength-indicator.vue` - 密码错误提示组件

### 验证规则

```typescript
const DEFAULT_PASSWORD_REQUIREMENTS = {
	minLength: 8,
	maxLength: 128,
	requireUppercase: true,
	requireLowercase: true,
	requireNumbers: true,
	requireSpecialChars: true,
	preventCommonPasswords: true,
	preventSequentialChars: true,
	preventRepeatedChars: true
};
```

## 使用场景

### 1. 登录页面

- 位置：`src/modules/base/pages/login/index.vue`
- 功能：登录时验证密码强度
- 特点：失去焦点后显示错误提示

### 2. 用户管理

- 位置：`src/modules/base/views/user/index.vue`
- 功能：新增/编辑用户时验证密码
- 特点：失去焦点后显示错误提示

### 3. 个人中心

- 位置：`src/modules/base/views/info.vue`
- 功能：修改个人密码时验证
- 特点：失去焦点后显示错误提示

### 4. 测试页面

- 位置：`src/modules/base/pages/password-test/index.vue`
- 功能：密码验证功能测试
- 访问：`/password-test`

## 验证行为

### 触发时机

- 密码框失去焦点时触发验证
- 不进行实时验证，避免干扰用户输入

### 显示方式

- 只在有错误时显示提示
- 一次显示一行错误信息
- 不显示密码强度等级和分数

### 错误提示示例

- "密码长度至少需要8个字符"
- "密码必须包含至少一个大写字母"
- "密码必须包含至少一个数字"
- "密码必须包含至少一个特殊字符"
- "密码不能包含连续字符"
- "密码不能包含重复字符"
- "密码过于简单，请使用更复杂的密码"

## 安全标准

### 符合的国际标准

1. **NIST SP 800-63B**：美国国家标准与技术研究院密码指南
2. **OWASP**：开放Web应用程序安全项目
3. **ISO 27001**：信息安全管理体系
4. **GDPR**：通用数据保护条例

### 安全特性

- ✅ 防止暴力破解
- ✅ 防止字典攻击
- ✅ 防止常见密码攻击
- ✅ 防止模式攻击
- ✅ 支持密码复杂度要求

## 配置说明

### 自定义验证规则

```typescript
import { PasswordValidator, DEFAULT_PASSWORD_REQUIREMENTS } from './utils/password-validator';

// 自定义验证规则
const customValidator = new PasswordValidator({
	minLength: 10,
	requireSpecialChars: false,
	preventCommonPasswords: true
});
```

### 国际化支持

- 中文：`src/modules/base/locales/zh-cn.json`
- 英文：`src/modules/base/locales/en.json`

## 测试用例

### 弱密码示例

- `123456` - 只有数字
- `password` - 常见弱密码
- `abc123` - 缺少大写和特殊字符

### 强密码示例

- `Password123!` - 符合所有要求
- `MySecurePass123!@#` - 高复杂度密码

## 部署说明

1. **开发环境**：功能已集成到现有页面中
2. **生产环境**：无需额外配置，直接使用
3. **测试**：访问 `/password-test` 页面进行功能测试

## 维护说明

### 更新弱密码列表

在 `password-validator.ts` 中更新 `COMMON_PASSWORDS` 数组

### 调整验证规则

修改 `DEFAULT_PASSWORD_REQUIREMENTS` 对象

### 添加新的验证逻辑

在 `PasswordValidator.validate()` 方法中添加新的验证规则

## 注意事项

1. **性能考虑**：验证逻辑已优化，只在失去焦点时触发
2. **兼容性**：支持所有现代浏览器
3. **可扩展性**：模块化设计，易于扩展和维护
4. **安全性**：所有验证都在前端进行，后端仍需进行相应验证
5. **用户体验**：简洁的错误提示，不干扰用户输入

## 更新日志

- **v1.1.0** (2024-01-01)
    - 优化用户体验，改为失去焦点时验证
    - 移除密码强度显示，只显示错误提示
    - 简化界面，一次显示一行错误信息
    - 更新所有相关页面的验证行为

- **v1.0.0** (2024-01-01)
    - 初始版本发布
    - 实现基础密码验证功能
    - 添加密码强度指示器
    - 支持国际化
    - 集成到登录、用户管理、个人中心页面
