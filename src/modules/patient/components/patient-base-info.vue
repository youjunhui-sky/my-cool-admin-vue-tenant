<!-- 
  患者基础信息验证组件 
  功能：
  1. 处理患者基本信息（身份证、出生日期、地址等）
  2. 提供表单验证
  3. 数据双向绑定与联动（身份证提取生日/地址）
-->
<template>
	<div class="patient-base-info">
		<!-- 基础信息表单 -->
		<el-form :model="form" label-position="top" class="cl-form">
			<!-- 第一行：身份证号、出生日期、手机号码 -->
			<el-row :gutter="15" class="form-row first-row">
				<el-col :span="8">
					<el-form-item label="身份证号" class="cl-form-item">
						<el-input
							v-model="form.idCard"
							placeholder="请输入身份证号"
							@blur="handleIdCardBlur"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="出生年月" class="cl-form-item">
						<el-date-picker
							v-model="form.birthDate"
							type="date"
							value-format="YYYY-MM-DD"
							placeholder="选择出生年月"
							style="width: 100%"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="手机号码" class="cl-form-item">
						<el-input
							v-model="form.mobile"
							placeholder="请输入手机号码"
							@blur="handleMobileBlur"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 第二行：籍贯省市区、籍贯详细地址 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="籍贯" class="cl-form-item">
						<div class="address-container">
							<el-select
								v-model="form.nativeProvince"
								filterable
								clearable
								placeholder="请选择省份"
								@change="handleNativeProvinceChange"
								@focus="() => loadProvinces('native')"
							>
								<el-option
									v-for="item in provinceOptions"
									:key="item.id"
									:label="item.name"
									:value="item.name"
								/>
							</el-select>
							<el-select
								v-model="form.nativeCity"
								filterable
								clearable
								placeholder="请选择城市"
								:disabled="!form.nativeProvince"
								@change="handleNativeCityChange"
								@focus="() => loadCities('native')"
							>
								<el-option
									v-for="item in nativeCityOptions"
									:key="item.id"
									:label="item.name"
									:value="item.name"
								/>
							</el-select>
							<el-select
								v-model="form.nativeDistrict"
								filterable
								clearable
								placeholder="请选择区/县"
								:disabled="!form.nativeCity"
								@change="handleNativeDistrictChange"
								@focus="() => loadDistricts('native')"
							>
								<el-option
									v-for="item in nativeDistrictOptions"
									:key="item.id"
									:label="item.name"
									:value="item.name"
								/>
							</el-select>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="籍贯详情" class="cl-form-item">
						<el-input v-model="form.nativeAddressDetail" placeholder="请输入籍贯详情" />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 第三行：现住址省市区、现住址详细地址 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="现住址" class="cl-form-item">
						<div class="address-container">
							<el-select
								v-model="form.currentProvince"
								filterable
								clearable
								placeholder="请选择省份"
								@change="handleCurrentProvinceChange"
								@focus="() => loadProvinces('current')"
							>
								<el-option
									v-for="item in provinceOptions"
									:key="item.id"
									:label="item.name"
									:value="item.name"
								/>
							</el-select>
							<el-select
								v-model="form.currentCity"
								filterable
								clearable
								placeholder="请选择城市"
								:disabled="!form.currentProvince"
								@change="handleCurrentCityChange"
								@focus="() => loadCities('current')"
							>
								<el-option
									v-for="item in currentCityOptions"
									:key="item.id"
									:label="item.name"
									:value="item.name"
								/>
							</el-select>
							<el-select
								v-model="form.currentDistrict"
								filterable
								clearable
								placeholder="请选择区/县"
								:disabled="!form.currentCity"
								@change="handleCurrentDistrictChange"
								@focus="() => loadDistricts('current')"
							>
								<el-option
									v-for="item in currentDistrictOptions"
									:key="item.id"
									:label="item.name"
									:value="item.name"
								/>
							</el-select>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="现住址详情" class="cl-form-item">
						<el-input
							v-model="form.currentAddressDetail"
							placeholder="请输入现住址详情"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
// --- 依赖导入 ---
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { debounce } from 'lodash-es';
import dayjs from 'dayjs';
import { useCool } from '/@/cool';

// 组件名称
defineOptions({
	name: 'patient-base-info'
});

// --- 基础设置 ---
const { service } = useCool();

// --- 组件属性定义 ---
const props = defineProps({
	// 绑定值
	modelValue: {
		type: Object,
		default: () => ({})
	},
	// 操作模式: add/update/info
	mode: {
		type: String,
		default: 'add'
	},
	// 记录ID
	id: {
		type: [Number, String],
		default: undefined
	}
});

// 组件事件
const emit = defineEmits(['update:modelValue', 'id-card-exists', 'mobile-exists', 'validate']);

// --- 状态管理 ---
// 表单数据
const form = reactive({
	idCard: '',
	birthDate: '',
	nativeProvince: '',
	nativeCity: '',
	nativeDistrict: '',
	currentProvince: '',
	currentCity: '',
	currentDistrict: '',
	mobile: '',
	nativeAddress: [] as string[],
	currentAddress: [] as string[],
	nativeAddressDetail: '',
	currentAddressDetail: ''
});

// 防止循环更新标记
const isUpdatingFromProps = ref(false);

// --- 地址数据 ---
// 地址选择相关数据
const provinceOptions = ref<any[]>([]);
const nativeCityOptions = ref<any[]>([]);
const nativeDistrictOptions = ref<any[]>([]);
const currentCityOptions = ref<any[]>([]);
const currentDistrictOptions = ref<any[]>([]);

// --- 验证状态 ---
const idCardExists = ref(false);
const mobileExists = ref(false);

// --- 常量 ---
const LAST_CURRENT_ADDRESS_KEY = 'last_current_address';

// --- 地址处理函数 ---
// 初始化省份数据
async function initProvinceOptions() {
	if (provinceOptions.value.length === 0) {
		try {
			const provinces = await service.dict.address.listProvince();
			provinceOptions.value = provinces || [];
		} catch (error) {
			console.error('初始化省份数据失败:', error);
		}
	}
}

// 处理地址数组 - 兼容数组和字符串格式
function processAddressArrays(data: any) {
	// 处理籍贯地址
	if (data.nativeAddress && Array.isArray(data.nativeAddress) && data.nativeAddress.length > 0) {
		form.nativeProvince = data.nativeAddress[0] || '';
		form.nativeCity = data.nativeAddress[1] || '';
		form.nativeDistrict = data.nativeAddress[2] || '';
	}
	// 字符串类型直接赋值给详细地址
	else if (data.nativeAddress && typeof data.nativeAddress === 'string') {
		form.nativeAddressDetail = data.nativeAddress;
	}

	// 处理现住址
	if (
		data.currentAddress &&
		Array.isArray(data.currentAddress) &&
		data.currentAddress.length > 0
	) {
		form.currentProvince = data.currentAddress[0] || '';
		form.currentCity = data.currentAddress[1] || '';
		form.currentDistrict = data.currentAddress[2] || '';
	}
	// 字符串类型直接赋值给详细地址
	else if (data.currentAddress && typeof data.currentAddress === 'string') {
		form.currentAddressDetail = data.currentAddress;
	}
}

// --- 数据监听 ---
// 监听modelValue变化，更新表单数据
watch(
	() => props.modelValue,
	async newVal => {
		if (newVal && Object.keys(newVal).length > 0) {
			// 避免重复处理，如果已经在更新过程中则直接返回
			if (isUpdatingFromProps.value) return;

			// 设置标记，防止重复更新
			isUpdatingFromProps.value = true;

			try {
				// 仅在开发环境打印详细日志
				if (import.meta.env.DEV) {
					//console.log('患者基础信息数据接收:', {
					// 	mode: props.mode,
					// 	id: props.id
					// });
				}

				// 确保省份数据已加载
				await initProvinceOptions();

				// 重置表单数据，避免旧数据干扰
				resetFormData();

				// 处理和更新表单数据
				await processAndUpdateForm(newVal);
			} finally {
				// 完成数据处理，重置标记
				isUpdatingFromProps.value = false;
			}
		}
	},
	{ immediate: true }
);

// 重置表单数据
function resetFormData() {
	Object.keys(form).forEach(key => {
		if (typeof form[key] !== 'function') {
			if (Array.isArray(form[key])) {
				form[key] = [];
			} else if (typeof form[key] === 'object' && form[key] !== null) {
				form[key] = {};
			} else {
				form[key] = '';
			}
		}
	});
}

// 处理和更新表单数据
async function processAndUpdateForm(data) {
	// 创建临时表单对象，避免直接修改触发递归更新
	const tempForm = {
		idCard: data.idCard || '',
		birthDate: data.birthDate || '',
		nativeProvince: data.nativeProvince || '',
		nativeCity: data.nativeCity || '',
		nativeDistrict: data.nativeDistrict || '',
		currentProvince: data.currentProvince || '',
		currentCity: data.currentCity || '',
		currentDistrict: data.currentDistrict || '',
		mobile: data.mobile || '',
		nativeAddressDetail: data.nativeAddressDetail || '',
		currentAddressDetail: data.currentAddressDetail || ''
	};

	// 处理地址数组格式
	processAddressArrays(data);

	// 一次性更新表单，减少触发watch次数
	Object.assign(form, tempForm);

	// 等待DOM更新
	await nextTick();

	// 加载地址选项数据
	await loadAddressOptions();
}

// 加载地址选项数据
async function loadAddressOptions() {
	// 加载籍贯地址选项
	if (form.nativeProvince) {
		await loadProvinces('native');
		if (form.nativeCity) {
			await loadCities('native');
			if (form.nativeDistrict) {
				await loadDistricts('native');
			}
		}
	}

	// 加载现住址选项
	if (form.currentProvince) {
		await loadProvinces('current');
		if (form.currentCity) {
			await loadCities('current');
			if (form.currentDistrict) {
				await loadDistricts('current');
			}
		}
	}
}

// 监听表单变化，更新modelValue - 使用防抖减少更新频率
const updateModelValue = debounce(newVal => {
	// 如果正在从props更新数据，不触发更新
	if (isUpdatingFromProps.value) return;

	// 创建新对象避免直接修改表单
	const updatedForm = { ...newVal };

	// 正确设置详细地址字段
	updatedForm.nativeAddress = form.nativeAddressDetail;
	updatedForm.currentAddress = form.currentAddressDetail;

	// 保存当前地址到本地存储
	if (form.currentProvince && form.currentCity) {
		saveCurrentAddress(form.currentProvince, form.currentCity);
	}

	// 仅在数据实际变化时才通知父组件
	emit('update:modelValue', updatedForm);
}, 300); // 增加防抖时间，降低更新频率

// 监听表单变化
watch(
	form,
	newVal => {
		updateModelValue(newVal);
	},
	{ deep: true }
);

// --- 生命周期钩子 ---
onMounted(async () => {
	// 初始化省份数据
	await initProvinceOptions();

	// 新增模式下，加载上次使用的地址 - 这个逻辑只在挂载时执行一次
	if (props.mode === 'add') {
		loadLastAddress();
	}
});

// 加载上次使用的地址
async function loadLastAddress() {
	const lastAddress = getLastCurrentAddress();
	if (lastAddress) {
		form.currentProvince = lastAddress.province;
		form.currentCity = lastAddress.city;

		// 使用Promise控制加载顺序
		await loadProvinces('current');
		await new Promise(resolve => setTimeout(resolve, 100));
		await loadCities('current');
	}
}

// --- 工具函数 ---
// 获取上次保存的现住址
function getLastCurrentAddress() {
	try {
		const savedAddress = localStorage.getItem(LAST_CURRENT_ADDRESS_KEY);
		return savedAddress ? JSON.parse(savedAddress) : null;
	} catch (error) {
		console.error('获取上次地址失败:', error);
		return null;
	}
}

// 保存现住址到本地存储
function saveCurrentAddress(province: string, city: string) {
	try {
		if (province && city) {
			localStorage.setItem(LAST_CURRENT_ADDRESS_KEY, JSON.stringify({ province, city }));
		}
	} catch (error) {
		console.error('保存地址失败:', error);
	}
}

// --- 验证函数 ---
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

		// 确保省份数据已加载
		await initProvinceOptions();

		// 尝试匹配省份
		const provinceItem = provinceOptions.value.find(p => {
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
		nativeCityOptions.value = cities || [];

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
			nativeDistrictOptions.value = districts || [];

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

// --- 事件处理函数 ---
// 处理身份证号失焦事件
const handleIdCardBlur = debounce(async () => {
	const value = form.idCard.trim();

	// 空值不处理
	if (!value) return;

	// 身份证格式校验
	if (!isValidIdCard(value)) {
		ElMessage.warning(`身份证号格式不正确，请检查`);
		idCardExists.value = false;
		emit('id-card-exists', false);
		return;
	}

	// 1. 提取生日信息
	const birthDate = getBirthDateFromIdCard(value);
	if (birthDate) {
		form.birthDate = birthDate;
	}

	// 2. 提取地址信息
	const addressInfo = await extractAddressFromIdCard(value);
	if (addressInfo) {
		const { province, city, district } = addressInfo;

		// 设置籍贯省市区
		form.nativeProvince = province || '';
		form.nativeCity = city || '';
		form.nativeDistrict = district || '';
	}

	// 3. 验证身份证号是否存在
	try {
		// 根据编辑/新增模式选择不同的验证方式
		let params;
		if (props.mode === 'update' && props.id) {
			params = { idCard: value, excludeId: props.id };
		} else {
			params = { idCard: value };
		}

		// 验证身份证号是否存在
		const count = await service.patient.info.checkIdCard(params);
		const exists = Number(count) > 0;

		// 更新状态并通知父组件
		idCardExists.value = exists;
		emit('id-card-exists', exists);

		if (exists) {
			ElMessage.warning('身份证号已存在,请核查是否存在该患者');
		}
	} catch (error) {
		console.error('验证身份证号失败:', error);
		idCardExists.value = false;
		emit('id-card-exists', false);
	}
}, 300);

// 验证手机号是否存在
async function validateMobile(mobile: string, currentId?: number | string) {
	try {
		// 不同模式下的验证参数
		if (props.mode === 'add') {
			// 新增模式
			const params = { mobile: mobile.trim() };
			return await service.patient.info.checkMobile(params);
		} else if (currentId) {
			// 编辑模式
			const params = {
				mobile: mobile.trim(),
				excludeId: currentId
			};
			return await service.patient.info.checkMobile(params);
		} else {
			// 默认验证
			const params = { mobile: mobile.trim() };
			return await service.patient.info.checkMobile(params);
		}
	} catch (error) {
		console.error('验证手机号失败:', error);
		return 0;
	}
}

// 处理手机号失焦事件
const handleMobileBlur = debounce(async () => {
	const value = form.mobile.trim();

	// 空值不处理
	if (!value) return;

	// 手机号格式校验
	if (!/^1[3456789]\d{9}$/.test(value)) {
		ElMessage.warning('手机号格式错误');
		return;
	}

	// 验证手机号是否存在
	const currentId = props.mode === 'update' ? props.id : undefined;
	const exist = await validateMobile(value, currentId);

	// 更新状态并通知父组件
	mobileExists.value = exist > 0;
	emit('mobile-exists', mobileExists.value);

	if (mobileExists.value) {
		ElMessage.warning('手机号已存在，请注意');
	}
}, 300);

// --- 地址选择处理 ---
// 加载省份数据
async function loadProvinces(type: 'native' | 'current') {
	// 确保省份数据已加载
	await initProvinceOptions();
}

// 加载城市数据
async function loadCities(type: 'native' | 'current') {
	const province = type === 'native' ? form.nativeProvince : form.currentProvince;
	if (!province) return;

	try {
		// 查找省份ID
		const provinceItem = provinceOptions.value.find(p => p.name === province);
		if (provinceItem) {
			const cities = await service.dict.address.listCity({ id: provinceItem.id });
			if (type === 'native') {
				nativeCityOptions.value = cities || [];
			} else {
				currentCityOptions.value = cities || [];
			}
		}
	} catch (error) {
		console.error('加载城市数据失败:', error);
	}
}

// 加载区县数据
async function loadDistricts(type: 'native' | 'current') {
	const city = type === 'native' ? form.nativeCity : form.currentCity;
	const cityOptions = type === 'native' ? nativeCityOptions.value : currentCityOptions.value;
	if (!city) return;

	try {
		// 查找城市ID
		const cityItem = cityOptions.find(c => c.name === city);
		if (cityItem) {
			const districts = await service.dict.address.getAllDistricts({ id: cityItem.id });
			if (type === 'native') {
				nativeDistrictOptions.value = districts || [];
			} else {
				currentDistrictOptions.value = districts || [];
			}
		}
	} catch (error) {
		console.error('加载区县数据失败:', error);
	}
}

// 籍贯地址变更处理
function handleNativeProvinceChange() {
	// 省份变更时重置市区
	form.nativeCity = '';
	form.nativeDistrict = '';
	nativeCityOptions.value = [];
	nativeDistrictOptions.value = [];

	if (form.nativeProvince) {
		loadCities('native');
	}
}

function handleNativeCityChange() {
	// 城市变更时重置区县
	form.nativeDistrict = '';
	nativeDistrictOptions.value = [];

	if (form.nativeCity) {
		loadDistricts('native');
	}
}

// 区县变更，无需特殊处理
function handleNativeDistrictChange() {}

// 现住址地址变更处理
function handleCurrentProvinceChange() {
	// 省份变更时重置市区
	form.currentCity = '';
	form.currentDistrict = '';
	currentCityOptions.value = [];
	currentDistrictOptions.value = [];

	if (form.currentProvince) {
		loadCities('current');
	}
}

function handleCurrentCityChange() {
	// 城市变更时重置区县
	form.currentDistrict = '';
	currentDistrictOptions.value = [];

	if (form.currentCity) {
		loadDistricts('current');
	}
}

// 区县变更，无需特殊处理
function handleCurrentDistrictChange() {}

// 验证表单
function validate() {
	// 当前实现只验证身份证和手机号的重复状态
	const isValid = !idCardExists.value && !mobileExists.value;
	emit('validate', isValid);
	return isValid;
}

// 导出组件方法，供父组件调用
defineExpose({
	form,
	validate,
	isIdCardExists: () => idCardExists.value,
	isMobileExists: () => mobileExists.value
});
</script>

<style lang="scss" scoped>
.patient-base-info {
	width: 100%;
	margin-top: -15px;

	:deep(.cl-form) {
		.form-row {
			margin-bottom: 8px;

			&.first-row {
				margin-bottom: 10px;
			}
		}

		.el-form-item {
			margin-bottom: 12px;

			.el-form-item__label {
				padding-bottom: 5px;
				font-size: 14px;
				line-height: 1.2;
				color: var(--el-text-color-regular);
			}
		}

		.el-row {
			margin-bottom: 0;
		}

		.address-container {
			display: flex;
			gap: 8px;

			.el-select {
				flex: 1;
			}
		}

		.el-select,
		.el-date-picker,
		.el-input {
			width: 100%;
		}
	}
}
</style>
