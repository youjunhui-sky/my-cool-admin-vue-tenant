<!-- 页面顺序
	1.<template>
	2.<script>
		2.1 import
		2.2 base
		2.3 options
		2.4 crud
		2.5 table
		2.6 upsert
		2.7 自定义组件
		2.7 search
		2.8 function
	      2.8.1 基础函数
		  2.8.2 验证函数
		  2.8.3 事件函数
	 </script>
	3.<style>
  -->
<template>
	<cl-crud ref="Crud">
		<!-- 顶部操作栏 -->
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-search-key placeholder="请输入地址名称" />
			<!-- 地址解析按钮 -->
			<el-button @click="addressParse">地址解析</el-button>
		</cl-row>

		<!-- 数据表格 -->
		<cl-row>
			<cl-table ref="Table"></cl-table>
		</cl-row>

		<!-- 分页 -->
		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>
		<!-- <cl-upsert ref="Upsert" v-model="form" :items="items" :rules="rules" width="500px"> -->
		<!-- </cl-upsert> 
		 默认使用Upsert.value.form
		-->
		<cl-upsert ref="Upsert"></cl-upsert>
	</cl-crud>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useCool } from '/@/cool';
import { Plugins } from '/#/crud';
// 获取服务实例
const { service } = useCool();
/**
 * @description 地址类型选项
 */
const options = {
	type: [
		{ label: '省', value: 0, type: 'danger' },
		{ label: '市', value: 1, type: 'success' },
		{ label: '区县', value: 2, type: 'warning' }
	]
};
/**
 * @description 省市列表数据
 * 响应式数组
 */
// const provinceList = ref([]);
// const cityList = ref([]);
const provinceList = ref<{ id: string | number; name: string }[]>([]);
const cityList = ref<{ id: string | number; name: string }[]>([]);

/**
 * @description 表单验证规则
 * 响应式计算属性，根据表单类型添加不同的验证规则
 * 学习用对应:rules="rules"
 */
// const rules = computed(() => {
// 	const baseRules = {
// 		name: [{ required: false, message: '请输入名称', trigger: 'blur' }],
// 		code: [{ required: false, message: '请输入编码', trigger: 'blur' }],
// 		type: [{ required: false, message: '请选择类型', trigger: 'change' }]
// 	};

// 	// 根据类型添加不同的验证规则
// 	if (type === 1) {
// 		baseRules.province = [{ required: false, message: '请选择上级省', trigger: 'change' }];
// 	} else if (type === 2) {
// 		baseRules.province = [{ required: false, message: '请选择上级省', trigger: 'change' }];
// 		baseRules.city = [{ required: false, message: '请选择上级市', trigger: 'change' }];
// 	}

// 	return baseRules;
// });
// CRUD 配置
const Crud = useCrud(
	{
		service: service.dict.address,
		onRefresh(params, { render }) {
			service.dict.address.list(params).then(res => {
				render(res);
			});
		}
	},
	app => {
		app.refresh();
	}
);
// 表格配置
const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '编码', prop: 'code', width: 120 },
		{ label: '名称', prop: 'name', minWidth: 150 },
		{ label: '类型', prop: 'type', width: 100, dict: options.type },
		{ type: 'op', width: 160, buttons: ['edit', 'delete'] }
	],
	// 树形结构插件
	plugins: [
		Plugins.Table.toTree({
			lazy: true
		})
	]
});
// 表单配置
const Upsert = useUpsert({
	// 表单项配置
	items: [
		{
			prop: 'type',
			label: '行政级别',
			required: true,
			// 默认选中省
			value: 0,
			component: {
				name: 'el-radio-group',
				options: options.type,
				props: {
					// 类型变更处理
					onChange: onTypeChange
				}
			}
		},
		{
			prop: 'province',
			label: '上级省',
			// 如果类型为0，则不显示等同于v-if
			// 这样设置测试无效果
			//show: () => type === 0,
			// 隐藏条件hidden
			hidden({}) {
				// 当type为0时，隐藏
				return Upsert.value.form.type === 0;
			},
			required: true,
			component: {
				name: 'el-select',
				props: {
					placeholder: '请选择省级',
					filterable: true,
					onChange: onProvinceChange
				},
				options: computed(() =>
					provinceList.value.map(item => ({
						label: item.name,
						value: item.id
					}))
				)
			}
		},
		{
			prop: 'city',
			label: '上级市',
			// 如果类型为0，则不显示等同于v-if
			// 这样设置测试无效果
			// show: () => Upsert.value.form.type > 1,
			// 隐藏条件hidden
			hidden({}) {
				return Upsert.value?.form.type !== 2;
			},
			required: true,
			component: {
				name: 'el-select',
				props: {
					placeholder: '请选择市级',
					filterable: true
				},
				options: computed(() =>
					cityList.value?.map(item => ({
						label: item.name,
						value: item.id
					}))
				)
			}
		},
		{
			prop: 'code',
			label: '行政编码',
			required: true,
			component: {
				name: 'el-input',
				props: { placeholder: '请输入编码' }
			}
		},
		{
			prop: 'name',
			label: '行政名称',
			required: true,
			component: {
				name: 'el-input',
				props: { placeholder: '请输入名称' }
			}
		}
	],
	// 试用生命周期函数，表单打开后
	async onOpened(data) {
		//console.log('表单打开后, 数据:', data);
		try {
			// 编辑模式
			if (Upsert.value?.mode === 'update') {
				//如果是省
				if (data.type != undefined && Number(data.type) == 0) {
					// 回填数据
					Object.assign(Upsert.value.form, data);
					//console.log('省编辑模式, 回填的数据:', Upsert.value.form);
				}
				if (data.type != undefined && Number(data.type) == 1) {
					//再回填数据
					Object.assign(Upsert.value.form, data);
					//console.log('市编辑模式, 回填的数据:', Upsert.value.form);
					//给Upsert.value.form再加上province字段
					Upsert.value.form.province = data.parentId;
					//获取省的数据
					loadProvinceList();
				}
				if (data.type != undefined && Number(data.type) == 2) {
					//console.log('区县编辑模式, 回填的数据:', data);
					//回填数据,再补充form的值
					Object.assign(Upsert.value.form, data);
					//给Upsert.value.form再加上province和city字段
					Upsert.value.form.city = data.parentId;
					//通过city的父ID获取到省
					const province = await loadCity(Upsert.value.form.city);
					Upsert.value.form.province = province;
					//加载省列表
					loadProvinceList();
					//加载市列表
					loadCityList(province);
				}
			} else {
				// 新增模式，默认加载省份列表
				// 重置表单数据
				// resetFields()对整个表单进行重置
				Upsert?.value?.resetFields();
				loadProvinceList();
			}
		} catch (error) {
			console.error('表单打开后处理出错:', error);
			ElMessage.error('表单打开后处理出错');
		}
	},
	// //基础生命周期函数
	// // 表单打开后
	// onOpened(data) {
	// 	console.log('表单打开后, 数据:', data);
	// },

	// // 获取表单信息后
	// onInfo(data) {
	// 	console.log('获取表单信息后, 数据:', data);
	// },

	// // 表单关闭前
	// onClose() {
	// 	console.log('表单关闭前');
	// 	return true;
	// },

	// // 表单关闭后
	// onClosed() {
	// 	console.log('表单关闭后');
	// },

	// 表单提交前
	async onSubmit(data, { done, close, next }) {
		try {
			//console.log('表单提交前处理, 当前表单:', JSON.stringify(Upsert.value.form));

			// 根据表单类型确认parentId
			if (Upsert.value.form.type === 0) {
				// 省级不需要设置parentId
				Upsert.value.form.parentId = 0;
				//console.log('省级地址, 清空parentId');
			} else if (Upsert.value.form.type === 1) {
				// 市级需要设置province为parentId
				if (!Upsert.value.form.province) {
					console.error('市级地址但未选择上级省');
					ElMessage.error('请选择上级省');
					return false;
				}
				Upsert.value.form.parentId = Upsert.value.form.province;
				//console.log('市级地址, 设置parentId为省ID:', Upsert.value.form.parentId);
			} else if (Upsert.value.form.type === 2) {
				// 区县级需要设置city为parentId
				if (!Upsert.value.form.province || !Upsert.value.form.city) {
					ElMessage.error('请选择完整的上级区域');
					return false;
				}

				Upsert.value.form.parentId = Upsert.value.form.city;
				//console.log('区县级地址, 设置parentId为市ID:', Upsert.value.form.parentId);
			}
			//【调用next组装josn给后端，否则不会自动crud】
			next({
				id: Upsert.value.form.code,
				code: Upsert.value.form.code,
				name: Upsert.value.form.name,
				parentId: Upsert.value.form.parentId,
				type: Upsert.value.form.type,
				status: false
			});
			//done()
			done();
			//close()
			close();
			return true;
		} catch (error) {
			console.error('表单提交前处理出错:', error);
			ElMessage.error('表单提交前处理出错');
			return false;
		}
	}
});
// 搜索配置
const Search = useSearch({
	items: [
		{
			prop: 'name',
			component: {
				name: 'cl-input',
				props: {
					placeholder: '请输入名称',
					clearable: true
				}
			}
		}
	]
});
// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
/**
 * @description 加载省级列表
 */
async function loadProvinceList() {
	//console.log('加载省级列表');
	try {
		// 查询type=0的省级数据
		const res = await service.dict.address.listProvince({});
		//console.log('省级列表数据:', res);

		// 确保返回的数据是数组格式
		provinceList.value = Array.isArray(res) ? res : res?.list || [];

		//console.log('省级列表数据加载完成, 数量:', provinceList.value.length);
	} catch (error) {
		console.error('加载省级列表出错:', error);
		ElMessage.error('加载省级列表失败');
	}
}
/**
 * @description 查询市的上级省唯一
 * @param {Number} parentId 市级的parentId
 *
 */
async function loadCity(countyParentId) {
	try {
		const res = await service.dict.address.addressInfoService({ cityId: countyParentId });
		const province = res[0].parentId;
		return province;
	} catch (error) {
		console.error('加载省级列表出错:', error);
		ElMessage.error('加载省级列表失败');
	}
}
/**
 * @description 加载市级列表
 * @param {Number} provinceId 省级ID
 */
async function loadCityList(provinceId) {
	//console.log('加载市级列表, 省ID:', provinceId);

	try {
		// 查询parentId=provinceId的市级数据
		const res = await service.dict.address.listCity({ id: provinceId });
		//console.log('市级列表数据:', res);
		// 确保返回的数据是数组格式
		cityList.value = Array.isArray(res) ? res : res?.list || [];
	} catch (error) {
		console.error('加载市级列表出错:', error);
		ElMessage.error('加载市级列表失败');
	}
}
/**
 * @description 类型变更处理
 * @param {Number} val 类型值
 * 省级直接添加数据，不需要显示
 * 市级需要加载省级列表
 * 区县级需要加载省级列表和市级列表
 * 所以切换需要重置相关字段
 */
function onTypeChange(val) {
	//console.log('地址类型变更:', val);

	// 重置相关字段
	Upsert.value.form.province = undefined;
	Upsert.value.form.city = undefined;
	Upsert.value.form.parentId = undefined;
	Upsert.value.form.type = val;
	cityList.value = [];
	// 如果不是省级，加载省级列表
	if (val === 2) {
		loadProvinceList();
		loadCityList(Upsert.value.form.province);
	} else {
		loadProvinceList();
	}
}
/**
 * @description 省份变更处理
 * @param {Number} val 省份ID
 * 选了省时查询市的数据
 */
async function onProvinceChange(val) {
	//console.log('省份变更:', val);

	// 重置市级
	Upsert.value.form.city = undefined;

	// 只要选择了省份，就加载对应的市级列表
	if (val) {
		await loadCityList(val);
	} else {
		// 如果未选择省份，清空市级列表
		cityList.value = [];
	}
}
/**
 * @description 地址解析功能
 * 通过解析src\plugins\distpicker\data\pca.json
 * 将数据转换为树形结构
 * 并插入到数据库中
 */
async function addressParse() {
	//console.log('触发地址解析');

	try {
		ElMessageBox.confirm('确定要开始解析地址数据吗？', '提示', {
			type: 'warning'
		})
			.then(async () => {
				// 加载地址数据
				const pcaData = await import('/#/distpicker/data/pca.json');

				// 开始处理数据
				ElMessage.info('开始解析地址数据，请稍候...');
				let totalCount = 0;
				let successCount = 0;

				// 显示进度信息
				const startTime = Date.now();

				// 遍历省级数据
				for (const province of pcaData.default) {
					// 构建省级数据
					const provinceData = {
						id: province.code,
						code: province.code,
						name: province.name,
						parentId: 0, // 省级parentId为0
						type: 0
					};

					totalCount++;
					// 保存省级数据，忽略错误继续执行
					try {
						await service.dict.address.add(provinceData);
						successCount++;
						//console.log(`省级数据处理: ${province.name}`);
					} catch (error) {
						// 忽略错误，继续执行
						//console.log(`省级数据已存在: ${province.name}`);
					}

					// 如果有市级数据，继续处理
					if (province.children && province.children.length > 0) {
						for (const city of province.children) {
							// 构建市级数据
							const cityData = {
								id: city.code,
								code: city.code,
								name: city.name,
								parentId: province.code, // 市级parentId为省级code
								type: 1
							};

							totalCount++;
							// 保存市级数据，忽略错误继续执行
							try {
								await service.dict.address.add(cityData);
								successCount++;
								//console.log(`市级数据处理: ${city.name}`);
							} catch (error) {
								// 忽略错误，继续执行
								//console.log(`市级数据已存在: ${city.name}`);
							}

							// 如果有区县级数据，继续处理
							if (city.children && city.children.length > 0) {
								for (const district of city.children) {
									// 构建区县级数据
									const districtData = {
										id: district.code,
										code: district.code,
										name: district.name,
										parentId: city.code, // 区县级parentId为市级code
										type: 2
									};

									totalCount++;
									// 保存区县级数据，忽略错误继续执行
									try {
										await service.dict.address.add(districtData);
										successCount++;
									} catch (error) {
										// 忽略错误，继续执行
										//console.log(`区县数据已存在: ${district.name}`);
									}
								}
							}
						}
					}
				}

				const endTime = Date.now();
				const duration = ((endTime - startTime) / 1000).toFixed(2);

				ElMessage.success(`地址解析完成，共处理 ${totalCount} 条数据，耗时 ${duration} 秒`);
				// 刷新表格数据
				Crud.value?.refresh();
			})
			.catch(() => {
				//console.log('取消地址解析');
			});
	} catch (error) {
		console.error('地址解析出错:', error);
		ElMessage.error('地址解析失败');
	}
}
</script>
