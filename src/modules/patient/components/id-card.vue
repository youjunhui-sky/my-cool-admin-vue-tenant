<template>
	<el-input v-model="idCard" :placeholder="placeholder" @blur="handleIdCardBlur" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { debounce } from 'lodash-es';
import dayjs from 'dayjs';
import { useCool } from '/@/cool';

// 组件名称
defineOptions({
	name: 'id-card-select'
});

const { service } = useCool();

// 定义props
const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: '请输入身份证号'
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
const emit = defineEmits([
	'update:modelValue',
	'birth-date-extracted',
	'address-extracted',
	'id-card-exists',
	'validate'
]);

// 内部状态
const idCard = ref('');
const idCardExists = ref(false);
const validating = ref(false);

// 监听属性变化
watch(
	() => props.modelValue,
	val => {
		idCard.value = val || '';
	},
	{ immediate: true }
);

// 监听内部值变化
watch(idCard, val => {
	emit('update:modelValue', val);
});

// 身份证格式校验
function isValidIdCard(idCard: string): boolean {
	return /(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
}

// 从身份证号提取生日（兼容15/18位）
function getBirthDateFromIdCard(idCard: string): string | null {
	if (!isValidIdCard(idCard)) return null;

	const len = idCard.length;
	// 统一提取成 8 位数字格式（YYYYMMDD）
	const birthStr =
		len === 15
			? `19${idCard.substr(6, 6)}` // 15位转19YYMMDD
			: idCard.substr(6, 8); // 18位直接取YYYYMMDD

	try {
		// 解析日期并格式化
		return dayjs(birthStr, 'YYYYMMDD').format('YYYY-MM-DD');
	} catch {
		return null;
	}
}

// 从身份证号提取地址信息
async function extractAddressFromIdCard(idCard: string) {
	if (!idCard || idCard.length < 6) return null;

	try {
		// 提取行政区划代码
		const provinceCode = parseInt(idCard.substring(0, 2));
		const cityCode = parseInt(idCard.substring(0, 4));
		const districtCode = parseInt(idCard.substring(0, 6));

		// 查询省份
		const provinces = await service.dict.address.listProvince();

		// 尝试匹配省份
		const provinceItem = provinces.find(p => {
			const code = p && typeof p === 'object' ? (p as any).code || (p as any).id : null;
			return code === provinceCode;
		});

		if (!provinceItem) return null;

		// 获取省份名称
		const provinceName = (provinceItem as any).name;
		let cityName = '';
		let districtName = '';

		// 查询城市
		const cities = await service.dict.address.listCity({ id: (provinceItem as any).id });

		// 尝试匹配城市
		const cityItem = cities.find(c => {
			const code = c && typeof c === 'object' ? (c as any).code || (c as any).id : null;
			return code === cityCode;
		});

		if (cityItem) {
			// 获取城市名称
			cityName = (cityItem as any).name;

			// 查询区县
			const districts = await service.dict.address.getAllDistricts({
				id: (cityItem as any).id
			});

			// 尝试匹配区县
			const districtItem = districts.find(d => {
				const code = d && typeof d === 'object' ? (d as any).code || (d as any).id : null;
				return code === districtCode;
			});

			if (districtItem) {
				// 获取区县名称
				districtName = (districtItem as any).name;
			}
		}

		// 返回提取的地址信息
		return {
			province: provinceName,
			city: cityName,
			district: districtName
		};
	} catch (error) {
		console.error('提取地址信息失败:', error);
		return null;
	}
}

// 验证身份证是否存在
async function validateIdCard(idCard: string, recordId?: number | string) {
	try {
		// 根据模式选择不同的验证方式
		let params;
		if (recordId) {
			params = { idCard: idCard.trim(), excludeId: recordId };
		} else {
			params = { idCard: idCard.trim() };
		}

		// 验证身份证是否存在
		const count = await service.patient.info.checkIdCard(params);
		return Number(count) > 0;
	} catch (error) {
		console.error('验证身份证号失败:', error);
		return false;
	}
}

// 处理身份证号失焦事件
const handleIdCardBlur = debounce(async () => {
	const value = idCard.value.trim();

	// 空值不处理
	if (!value) return;

	// 防止重复验证
	if (validating.value) return;
	validating.value = true;

	try {
		// 身份证格式校验
		if (!isValidIdCard(value)) {
			ElMessage.warning(`身份证号格式不正确，请检查`);
			idCardExists.value = false;
			emit('id-card-exists', false);
			emit('validate', false);
			return;
		}

		// 1. 提取生日信息
		const birthDate = getBirthDateFromIdCard(value);
		if (birthDate) {
			emit('birth-date-extracted', birthDate);
		}

		// 2. 提取地址信息
		const addressInfo = await extractAddressFromIdCard(value);
		if (addressInfo) {
			emit('address-extracted', addressInfo);
		}

		// 3. 验证身份证号是否存在
		const exists = await validateIdCard(value, props.recordId);
		idCardExists.value = exists;

		// 通知父组件
		emit('id-card-exists', exists);

		if (exists) {
			ElMessage.warning('身份证号已存在,请核查是否存在该患者');
		}
	} catch (error) {
		console.error('身份证号处理失败:', error);
		idCardExists.value = false;
		emit('id-card-exists', false);
	} finally {
		validating.value = false;
	}
}, 300);

// 导出组件方法
defineExpose({
	validate: () => {
		// 验证身份证格式和唯一性
		const value = idCard.value.trim();
		if (!value) return true; // 可以为空

		// 格式不正确
		if (!isValidIdCard(value)) return false;

		// 已存在的情况下，在最终保存时才阻止提交
		if (idCardExists.value) {
			ElMessage.error('身份证号已存在，不能重复添加患者记录');
			return false;
		}

		return true;
	},
	// 提取生日
	extractBirthDate: () => getBirthDateFromIdCard(idCard.value),
	// 提取地址
	extractAddress: () => extractAddressFromIdCard(idCard.value),
	// 重置验证状态
	reset: () => {
		idCardExists.value = false;
	}
});
</script>
