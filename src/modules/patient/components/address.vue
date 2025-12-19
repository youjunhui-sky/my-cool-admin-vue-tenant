<!-- 
  地址选择组件
  当前用不到了。已合并到patient-base-info.vue中
  功能：
  1. 选择省份、城市、区县
  2. 支持搜索、清空
  3. 数据双向绑定与联动
-->
<template>
	<div class="address-select">
		<el-row :gutter="10">
			<!-- 省份选择 -->
			<el-col :span="8">
				<el-select
					v-model="province"
					filterable
					clearable
					placeholder="请选择省份"
					@change="handleProvinceChange"
					@focus="loadProvinces"
				>
					<el-option
						v-for="item in provinceOptions"
						:key="item.id"
						:label="item.name"
						:value="item.name"
					/>
				</el-select>
			</el-col>

			<!-- 城市选择 -->
			<el-col :span="8">
				<el-select
					v-model="city"
					filterable
					clearable
					placeholder="请选择城市"
					:disabled="!province"
					@change="handleCityChange"
					@focus="loadCities"
				>
					<el-option
						v-for="item in cityOptions"
						:key="item.id"
						:label="item.name"
						:value="item.name"
					/>
				</el-select>
			</el-col>

			<!-- 区县选择 -->
			<el-col :span="8">
				<el-select
					v-model="district"
					filterable
					clearable
					placeholder="请选择区/县"
					:disabled="!city"
					@change="handleDistrictChange"
					@focus="loadDistricts"
				>
					<el-option
						v-for="item in districtOptions"
						:key="item.id"
						:label="item.name"
						:value="item.name"
					/>
				</el-select>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
defineOptions({
	name: 'address-select'
});

import { ref, watch, onMounted } from 'vue';
import { useCool } from '/@/cool';

// 获取服务实例
const { service } = useCool();

// 定义组件属性
const props = defineProps({
	// 初始值
	modelValue: {
		type: Array as () => string[],
		default: () => []
	},
	// 省份值
	provinceValue: {
		type: String,
		default: ''
	},
	// 城市值
	cityValue: {
		type: String,
		default: ''
	},
	// 区县值
	districtValue: {
		type: String,
		default: ''
	}
});

// 定义事件
const emit = defineEmits([
	'update:modelValue',
	'update:provinceValue',
	'update:cityValue',
	'update:districtValue',
	'change'
]);

// 数据
const province = ref('');
const city = ref('');
const district = ref('');
const provinceOptions = ref<any[]>([]);
const cityOptions = ref<any[]>([]);
const districtOptions = ref<any[]>([]);

// 加载状态
const loadingProvinces = ref(false);
const loadingCities = ref(false);
const loadingDistricts = ref(false);

// 组件挂载时设置初始值
onMounted(() => {
	setInitialValues();
});

// 设置初始值
function setInitialValues() {
	// 直接设置中文值
	if (props.modelValue && props.modelValue.length > 0) {
		province.value = props.modelValue[0] || '';
		city.value = props.modelValue.length > 1 ? props.modelValue[1] : '';
		district.value = props.modelValue.length > 2 ? props.modelValue[2] : '';
	} else {
		province.value = props.provinceValue || '';
		city.value = props.cityValue || '';
		district.value = props.districtValue || '';
	}

	// 如果有初始值，加载相应的选项数据
	if (province.value) {
		loadProvinces();
		if (city.value) {
			loadCities();
			if (district.value) {
				loadDistricts();
			}
		}
	}
}

// 加载省份数据
async function loadProvinces() {
	if (loadingProvinces.value || provinceOptions.value.length > 0) return;

	loadingProvinces.value = true;
	try {
		const provinces = await service.dict.address.listProvince();
		provinceOptions.value = provinces || [];
	} catch (error) {
		console.error('加载省份数据失败:', error);
	} finally {
		loadingProvinces.value = false;
	}
}

// 加载城市数据
async function loadCities() {
	if (loadingCities.value || cityOptions.value.length > 0) return;
	if (!province.value) return;

	loadingCities.value = true;
	try {
		// 查找省份ID
		const provinceItem = provinceOptions.value.find(p => p.name === province.value);
		if (provinceItem) {
			const cities = await service.dict.address.listCity({ id: provinceItem.id });
			cityOptions.value = cities || [];
		}
	} catch (error) {
		console.error('加载城市数据失败:', error);
	} finally {
		loadingCities.value = false;
	}
}

// 加载区县数据
async function loadDistricts() {
	if (loadingDistricts.value || districtOptions.value.length > 0) return;
	if (!city.value) return;

	loadingDistricts.value = true;
	try {
		// 查找城市ID
		const cityItem = cityOptions.value.find(c => c.name === city.value);
		if (cityItem) {
			const districts = await service.dict.address.getAllDistricts({ id: cityItem.id });
			districtOptions.value = districts || [];
		}
	} catch (error) {
		console.error('加载区县数据失败:', error);
	} finally {
		loadingDistricts.value = false;
	}
}

// 处理省份变化
function handleProvinceChange(value: string) {
	// 如果没有值，清空城市和区县
	if (!value) {
		city.value = '';
		district.value = '';
		cityOptions.value = [];
		districtOptions.value = [];
	} else {
		// 清空城市和区县
		city.value = '';
		district.value = '';
		cityOptions.value = [];
		districtOptions.value = [];

		// 加载新的城市数据
		loadCities();
	}

	// 更新值
	updateValue();
}

// 处理城市变化
function handleCityChange(value: string) {
	// 如果没有值，清空区县
	if (!value) {
		district.value = '';
		districtOptions.value = [];
	} else {
		// 清空区县
		district.value = '';
		districtOptions.value = [];

		// 加载新的区县数据
		loadDistricts();
	}

	// 更新值
	updateValue();
}

// 处理区县变化
function handleDistrictChange() {
	updateValue();
}

// 更新值并触发事件
function updateValue() {
	// 构建结果数组，过滤掉空值
	const result = [province.value, city.value, district.value].filter(Boolean);

	// 触发v-model更新
	emit('update:modelValue', result);

	// 触发change事件
	emit('change', result);

	// 同时更新单独的值
	emit('update:provinceValue', province.value);
	emit('update:cityValue', city.value);
	emit('update:districtValue', district.value);
}

// 暴露选项数据，以便父组件可以访问
defineExpose({
	provinceOptions,
	cityOptions,
	districtOptions,
	province,
	city,
	district
});

// 监听modelValue变化
watch(
	() => props.modelValue,
	newVal => {
		if (!newVal || !Array.isArray(newVal)) return;

		// 只有当值不同时才更新，避免循环更新
		if (newVal[0] !== province.value) {
			province.value = newVal[0] || '';
			// 重置城市和区县选项
			cityOptions.value = [];
			districtOptions.value = [];
			// 加载城市数据
			if (province.value && provinceOptions.value.length > 0) {
				loadCities();
			}
		}

		if (newVal[1] !== city.value) {
			city.value = newVal[1] || '';
			// 重置区县选项
			districtOptions.value = [];
			// 加载区县数据
			if (city.value && cityOptions.value.length > 0) {
				loadDistricts();
			}
		}

		if (newVal[2] !== district.value) {
			district.value = newVal[2] || '';
		}
	},
	{ deep: true }
);

// 监听单独的值变化
watch(
	[() => props.provinceValue, () => props.cityValue, () => props.districtValue],
	([newProvince, newCity, newDistrict]) => {
		// 只在modelValue为空时才使用单独的值
		if (!props.modelValue || props.modelValue.length === 0) {
			// 只有当值不同时才更新，避免循环更新
			if (newProvince !== province.value) {
				province.value = newProvince || '';
			}

			if (newCity !== city.value) {
				city.value = newCity || '';
			}

			if (newDistrict !== district.value) {
				district.value = newDistrict || '';
			}
		}
	}
);
</script>

<style lang="scss" scoped>
.address-select {
	width: 100%;
}
</style>
