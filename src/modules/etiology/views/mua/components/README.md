# PrintContent 组件

## 组件描述

`PrintContent` 是一个用于生成PDF打印的隐藏内容区域组件，专门为泌尿系结石代谢评估报告设计。

## 功能特性

- 支持两页A4格式的打印内容
- 第一页：前言和基本信息
- 第二页：患者信息、评估结果和防治建议
- 响应式设计，支持动态数据绑定
- 隐藏式渲染，不影响页面布局

## 使用方法

### 1. 导入组件

```vue
import PrintContent from './components/print-content.vue';
```

### 2. 在模板中使用

```vue
<template>
	<PrintContent
		ref="printContentRef"
		:swl-no="props.swlNo"
		:patient-no="props.patientNo"
		:assessment-count="props.assessmentCount"
		:diagnostic-data="tableData2"
		:ai-guide-suggestion="content.aiGuideSuggestion"
	/>
</template>
```

### 3. Props 参数

| 参数名            | 类型          | 默认值 | 说明             |
| ----------------- | ------------- | ------ | ---------------- |
| swlNo             | String        | ''     | 评估号           |
| patientNo         | String        | ''     | 患者编号         |
| assessmentCount   | Number/String | ''     | 评估次数         |
| diagnosticData    | Array         | []     | 诊断数据数组     |
| aiGuideSuggestion | String        | ''     | AI生成的防治建议 |

### 4. 获取组件引用

```vue
<script setup>
const printContentRef = ref();

// 通过 ref 访问组件的 printContentRef
const getPrintContent = () => {
	return printContentRef.value?.printContentRef;
};
</script>
```

## 样式说明

组件使用 SCSS 编写，包含以下主要样式：

- `.hidden-print-content`: 隐藏打印内容容器
- `.a4-page`: A4页面样式
- `.page-header`: 页眉样式
- `.page-footer`: 页脚样式
- `.prescription-content`: 处方内容样式

## 注意事项

1. 组件默认设置为隐藏状态（`position: absolute; left: -9999px; top: -9999px`）
2. 组件内部使用 `defineExpose` 暴露 `printContentRef` 给父组件
3. 样式文件引用了 `../html-content-styles.scss`，确保该文件存在
4. 组件支持 HTML 内容渲染，使用 `v-html` 指令

## 示例代码

完整的使用示例请参考 `muaSimplify.vue` 文件中的实现。
