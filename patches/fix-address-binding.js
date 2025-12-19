/**
 * 地址数据绑定修复补丁
 *
 * 这个文件提供了修复籍贯和现住址省市区级联选择器数据绑定的补丁函数
 */

/**
 * 修复地址数据绑定的钩子函数
 *
 * @param {any} value 原始值
 * @param {Object} options 钩子选项
 * @param {Object} options.form 表单对象
 * @param {String} addressType 地址类型，'native'(籍贯) 或 'current'(现住址)
 * @returns {Array} 处理后的地址数组
 */
export function fixAddressBindHook(value, { form }, addressType = 'current') {
	console.log(`修复${addressType === 'native' ? '籍贯' : '现住址'}地址数据:`, { value });

	// 如果value已经是数组且有值，直接返回
	if (Array.isArray(value) && value.length > 0) {
		console.log('已有数组数据，直接使用:', value);
		return value;
	}

	// 根据地址类型决定使用哪组字段
	let province, city, district;

	if (addressType === 'native') {
		province = form.nativeProvince;
		city = form.nativeCity;
		district = form.nativeDistrict;
	} else {
		province = form.currentProvince;
		city = form.currentCity;
		district = form.currentDistrict;
	}

	// 过滤掉空值
	const result = [province, city, district].filter(Boolean);
	console.log('构建地址数组:', result);

	return result;
}

/**
 * 修复处理提交数据的钩子函数
 *
 * @param {Array} value 地址数组
 * @param {Object} options 钩子选项
 * @param {Object} options.form 表单对象
 * @param {String} options.prop 属性名
 * @param {String} addressType 地址类型，'native'(籍贯) 或 'current'(现住址)
 */
export function fixAddressSubmitHook(value, { form, prop }, addressType = 'current') {
	// 解构地址数组
	const [province, city, district] = value || [];

	// 根据地址类型设置不同字段
	if (addressType === 'native') {
		form.nativeProvince = province;
		form.nativeCity = city;
		form.nativeDistrict = district;
	} else {
		form.currentProvince = province;
		form.currentCity = city;
		form.currentDistrict = district;
	}

	// 删除临时绑定的数组属性
	form[prop] = undefined;
}
