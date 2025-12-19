<template>
	<div class="province-city-select">
		<el-select
			v-model="provinceId"
			placeholder="请选择省份"
			filterable
			clearable
			:disabled="disabled"
			@change="handleProvinceChange"
			style="width: 120px; margin-right: 10px"
		>
			<el-option
				v-for="item in provinceList"
				:key="item.id"
				:label="item.name"
				:value="item.id"
			/>
		</el-select>
		<el-select
			v-model="cityId"
			placeholder="请选择城市"
			filterable
			clearable
			:disabled="disabled || !provinceId"
			@change="handleCityChange"
			style="width: 120px"
		>
			<el-option
				v-for="item in cityList"
				:key="item.id"
				:label="item.name"
				:value="item.id"
			/>
		</el-select>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useCool } from '/@/cool';

defineOptions({
	name: 'province-city-select'
});

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	// 用于禁用组件的模式
	mode: {
		type: String,
		default: 'add'
	}
});

const emit = defineEmits(['update:modelValue']);

const { service } = useCool();

// 省份和城市列表
const provinceList = ref<{ id: string | number; name: string }[]>([]);
const cityList = ref<{ id: string | number; name: string }[]>([]);

// 选中的省市ID和名称
const provinceId = ref<string | number>('');
const cityId = ref<string | number>('');
const provinceName = ref('');
const cityName = ref('');

// 计算属性：组件是否被禁用
const disabled = computed(() => props.mode === 'info');

// 加载省级列表
async function loadProvinceList() {
	try {
		const res = await service.dict.address.listProvince();
		provinceList.value = Array.isArray(res) ? res : res?.list || [];
	} catch (error) {
		console.error('加载省级列表出错:', error);
	}
}

// 加载市级列表
async function loadCityList(provinceId: string | number) {
	if (!provinceId) {
		cityList.value = [];
		return;
	}

	try {
		const res = await service.dict.address.listCity({ id: provinceId });
		cityList.value = Array.isArray(res) ? res : res?.list || [];
	} catch (error) {
		console.error('加载市级列表出错:', error);
	}
}

// 省份变更处理
async function handleProvinceChange(val: string | number) {
	if (!val) {
		// 清空省份时，同时清空城市
		cityId.value = '';
		cityName.value = '';
		cityList.value = [];
		updateModelValue();
		return;
	}

	// 更新省份名称
	const province = provinceList.value.find(item => item.id === val);
	provinceName.value = province ? province.name : '';

	// 加载对应的城市列表
	await loadCityList(val);

	// 清空已选城市
	cityId.value = '';
	cityName.value = '';

	// 更新v-model
	updateModelValue();
}

// 城市变更处理
function handleCityChange(val: string | number) {
	if (!val) {
		cityName.value = '';
		updateModelValue();
		return;
	}

	// 更新城市名称
	const city = cityList.value.find(item => item.id === val);
	cityName.value = city ? city.name : '';

	// 更新v-model
	updateModelValue();
}

// 更新v-model值
function updateModelValue() {
	let value = '';
	if (provinceName.value) {
		value = provinceName.value;
		if (cityName.value) {
			value += cityName.value;
		}
	}

	emit('update:modelValue', value);
}

// 从v-model解析省市信息
async function parseModelValue() {
	if (!props.modelValue) return;

	// 等待省份数据加载完成
	if (provinceList.value.length === 0) {
		await loadProvinceList();
	}

	// 尝试匹配省份
	for (const province of provinceList.value) {
		if (props.modelValue.includes(province.name)) {
			// 找到匹配的省份
			provinceId.value = province.id;
			provinceName.value = province.name;

			// 加载该省份的城市列表
			await loadCityList(province.id);

			// 尝试匹配城市
			for (const city of cityList.value) {
				if (props.modelValue.includes(city.name)) {
					cityId.value = city.id;
					cityName.value = city.name;
					break;
				}
			}

			break;
		}
	}
}

// 监听外部传入的值变化
watch(
	() => props.modelValue,
	newVal => {
		if (!newVal) {
			// 清空选中值
			provinceId.value = '';
			cityId.value = '';
			provinceName.value = '';
			cityName.value = '';
			return;
		}

		// 解析传入的值
		parseModelValue();
	},
	{ immediate: true }
);

// 组件挂载时加载省份数据
onMounted(async () => {
	await loadProvinceList();
	// 如果有初始值，尝试解析
	if (props.modelValue) {
		parseModelValue();
	}
});
</script>

<style lang="scss" scoped>
.province-city-select {
	display: flex;
	align-items: center;
}
</style>
