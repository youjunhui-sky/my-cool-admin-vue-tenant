<template>
	<el-input v-model="mobile" placeholder="请输入手机号码" @blur="handleMobileBlur" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { debounce } from 'lodash-es';
import { useCool } from '/@/cool';

// 组件名称
defineOptions({
	name: 'mobile-select'
});

const { service } = useCool();

// 定义props
const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	// 当前编辑记录ID（用于编辑模式下排除自身）
	recordId: {
		type: [Number, String],
		default: undefined
	},
	// 模式：add/update/view
	mode: {
		type: String,
		default: 'add'
	}
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'exists', 'validate']);

// 内部状态
const mobile = ref('');
const mobileExists = ref(false);
const validating = ref(false);

// 监听属性变化
watch(
	() => props.modelValue,
	val => {
		mobile.value = val || '';
	},
	{ immediate: true }
);

// 监听内部值变化
watch(mobile, val => {
	emit('update:modelValue', val);
});

// 验证手机号格式
function isValidMobile(value: string): boolean {
	return /^1[3456789]\d{9}$/.test(value);
}

// 验证手机号是否存在
async function validateMobile(mobile: string, recordId?: number | string) {
	try {
		let params;
		// 不论模式，只要有recordId就排除
		if (recordId) {
			params = {
				mobile: mobile.trim(),
				excludeId: recordId
			};
		} else {
			params = { mobile: mobile.trim() };
		}

		// 调用后端API验证
		const count = await service.patient.info.checkMobile(params);
		return Number(count) > 0;
	} catch (error) {
		console.error('验证手机号失败:', error);
		return false;
	}
}

// 处理手机号失焦事件
const handleMobileBlur = debounce(async () => {
	const value = mobile.value.trim();

	// 空值不处理
	if (!value) return;

	// 防止重复验证
	if (validating.value) return;
	validating.value = true;

	try {
		// 格式校验
		if (!isValidMobile(value)) {
			ElMessage.warning('手机号格式错误');
			emit('validate', false);
			return;
		}

		// 验证是否存在，暂时不验证
		const exists = false;
		//const exists = await validateMobile(value, props.recordId);
		//mobileExists.value = exists;

		// 通知父组件验证结果
		emit('exists', exists);
		emit('validate', !exists);

		// 存在则提示
		if (exists) {
			ElMessage.warning('手机号已存在，请注意');
		}
	} catch (error) {
		console.error('手机号验证失败:', error);
	} finally {
		validating.value = false;
	}
}, 300);

// 导出组件方法
defineExpose({
	validate: () => {
		// 验证手机号格式和唯一性
		const value = mobile.value.trim();
		if (!value) return true; // 可以为空

		// 格式不正确
		if (!isValidMobile(value)) return false;

		// 已存在
		return !mobileExists.value;
	},
	// 重置验证状态
	reset: () => {
		mobileExists.value = false;
	}
});
</script>
