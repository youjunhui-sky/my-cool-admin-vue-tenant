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
		<!-- 顶部工具栏 -->
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 搜索插件 -->
			<cl-search ref="Search" :reset-btn="true" />
			<!-- 导入导出功能 -->
			<cl-import-btn template="/用户导入模版.xlsx" :on-submit="onImpSubmit" />
			<cl-export-btn :columns="Table?.columns" />
		</cl-row>

		<!-- 表格主体 -->
		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<!-- 分页 -->
		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 表单组件 -->
		<cl-upsert ref="Upsert">
			<!-- 患者基础信息组件插槽 -->
			<template #slot-patient-base-info>
				<patient-base-info
					:key="upsertId || 'new'"
					v-model="patientInfo"
					:mode="upsertMode"
					:id="upsertId"
					@id-card-exists="onIdCardExists"
					@mobile-exists="onMobileExists"
					ref="baseInfoRef"
				/>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" setup>
// --- 依赖导入 ---
import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { reactive, ref, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useDict } from '/$/dict';
import PatientBaseInfo from '/@/modules/patient/components/patient-base-info.vue';
import dayjs from 'dayjs';
import { extname } from '/@/cool/utils';

// --- 基础设置 ---
const { service } = useCool();
const { dict } = useDict();

// --- 状态管理 ---
// 患者基础信息组件引用
const baseInfoRef = ref<{ validate: () => boolean; form?: any } | null>(null);

// 患者信息数据 - 创建响应式对象
function createEmptyPatientInfo() {
	return reactive<Record<string, any>>({});
}

// 患者信息数据
let patientInfo = createEmptyPatientInfo();

// 当前操作模式和ID
const upsertMode = ref('add');
const upsertId = ref(undefined);

// 验证状态
const idCardExists = ref(false);
const mobileExists = ref(false);

// 常量定义
const LAST_CURRENT_ADDRESS_KEY = 'last_current_address';

// --- 数据字典 ---
const options = reactive({
	gender: [
		{ label: '未知', value: 0, type: 'default' },
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' }
	]
});

// --- CRUD配置 ---
// 主CRUD配置
const Crud = useCrud(
	{
		service: service.patient.info
	},
	app => {
		app.refresh();
	}
);

// 表格配置
const Table = useTable({
	//表格行高调整，先关闭自动高度
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' } // 减小内边距也有助于控制行高
	},
	columns: [
		{
			type: 'selection',
			minWidth: 40
		},
		{
			prop: 'patientNo',
			label: '档案号',
			fixed: true, // 固定选择列
			minWidth: 120
		},
		{
			prop: 'name',
			label: '姓名',
			minWidth: 120,
			fixed: true, // 固定选择列
			dangerouslyUseHTMLString: true, // 允许渲染HTML
			// 搜索高亮
			formatter: (row, column, value) => {
				const searchKey = Search.value?.keyword;
				if (searchKey) {
					return value.replace(
						new RegExp(searchKey, 'gi'),
						match => `<span style="color: #409EFF;font-weight:500">${match}</span>`
					);
				}
				return value;
			}
		},
		{ label: '性别', prop: 'gender', minWidth: 60, dict: options.gender },
		{
			prop: 'idCard',
			label: '身份证号',
			minWidth: 180
		},
		{
			prop: 'birthDate',
			label: '出生年月',
			minWidth: 100,
			formatter: (row: any) => {
				return row.birthDate?.split(' ')[0] || '';
			}
		},
		{
			label: '现住址',
			minWidth: 160,
			showOverflowTooltip: true,
			formatter: (row: any) =>
				`${row.currentProvince || ''}${row.currentCity || ''}${row.currentDistrict || ''}`
		},
		{
			label: '联系方式',
			minWidth: 120,
			formatter: (row: any) => row.mobile || row.telephone
		},
		{
			prop: 'occupation',
			label: '职业',
			showOverflowTooltip: true,
			minWidth: 120
		},
		{
			prop: 'lastVisit',
			label: '最近就诊',
			minWidth: 120,
			showOverflowTooltip: true
		},
		{
			prop: 'registerDate',
			label: '登记日期',
			minWidth: 120,
			showOverflowTooltip: true,
			sortable: 'desc'
		},
		{
			type: 'op',
			minWidth: 160,
			buttons: ['edit', 'delete']
		}
	]
});

// 编辑表单配置
const Upsert = useUpsert({
	dialog: {
		width: '800px'
	},
	// 打开表单前钩子
	onOpen() {
		// 获取当前模式和ID
		const mode = Upsert.value?.mode || 'add';
		const form = Upsert.value?.form || {};
		const id = form.id;

		// 更新模式和ID
		upsertMode.value = mode;
		upsertId.value = id;

		// 重置验证状态
		idCardExists.value = false;
		mobileExists.value = false;

		// 如果是新增模式，创建全新的患者信息对象
		if (mode === 'add') {
			patientInfo = createEmptyPatientInfo();
		}

		//console.log('表单已打开:', { mode, id });
	},

	// 详情数据处理钩子
	onInfo(data, { next, done }) {
		//console.log('正在获取患者详情:', data);

		// 创建全新的患者信息对象
		patientInfo = createEmptyPatientInfo();

		// 获取详情数据
		next(data)
			.then(info => {
				//console.log('获取到患者详情:', info);

				// 更新模式和ID
				upsertMode.value = 'update';
				upsertId.value = info.id;

				// 确保DOM更新后再设置数据
				nextTick(() => {
					// 更新患者信息
					Object.assign(patientInfo, info);
				});

				// 返回数据，继续UI流程
				done(info);
			})
			.catch(error => {
				console.error('获取详情失败:', error);
				done(data);
			});
	},

	// 表单项配置
	items: [
		{
			prop: 'name',
			label: '姓名',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入姓名'
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'gender',
			label: '性别',
			component: {
				name: 'cl-select',
				props: {
					options: options.gender,
					labelKey: 'label',
					valueKey: 'value',
					checkStrictly: true,
					defaultExpandAll: true
				}
			},
			value: 1,
			col: { span: 8 }
		},
		{
			label: '登记日期',
			prop: 'registerDate',
			component: {
				name: 'el-date-picker',
				props: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' }
			},
			required: true,
			value: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			hook: {
				bind(value) {
					if (!value) {
						return dayjs().format('YYYY-MM-DD HH:mm:ss');
					}
					return value;
				}
			},
			col: { span: 8 }
		},
		// 患者基础信息组件
		{
			component: {
				name: 'slot-patient-base-info'
			}
		},
		{
			prop: 'telephone',
			label: '固定电话',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入固定电话'
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'zipCode',
			label: '邮编',
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入邮编'
				}
			},
			col: { span: 8 }
		},
		{
			prop: 'occupation',
			label: '职业',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请输入职业',
					tree: true,
					options: dict.get('duty'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			},
			col: { span: 8 }
		}
	],

	// 提交处理钩子
	async onSubmit(data, { next, done }) {
		try {
			//console.log('准备提交表单数据:', { formData: data, patientInfo });

			// 检查患者基础信息的有效性
			const baseInfoValid = baseInfoRef.value?.validate?.() || true;

			// 身份证重复检查 - 仅在新增模式下
			if (upsertMode.value === 'add' && idCardExists.value) {
				ElMessage.error('身份证号已存在，无法提交！请检查后重试');
				done();
				return;
			}

			// 缓存现住址信息
			if (data.currentProvince && data.currentCity) {
				saveCurrentAddress(data.currentProvince, data.currentCity);
			}

			// 从子组件获取最新数据
			if (baseInfoRef.value) {
				const baseFormData = (baseInfoRef.value as any).form;

				if (baseFormData) {
					// 同步详细地址字段
					(patientInfo as any).nativeAddress = baseFormData.nativeAddressDetail;
					(patientInfo as any).currentAddress = baseFormData.currentAddressDetail;
				}
			}

			// 合并数据
			const mergedData = {
				...data,
				...patientInfo
			};

			// 确保地址字段格式正确
			if (Array.isArray(mergedData.nativeAddress)) {
				mergedData.nativeAddress = mergedData.nativeAddressDetail || '';
			}

			if (Array.isArray(mergedData.currentAddress)) {
				mergedData.currentAddress = mergedData.currentAddressDetail || '';
			}

			// 清理空值
			const cleanData = Object.entries(mergedData).reduce((acc, [key, value]) => {
				// 跳过无效值
				if (
					value === undefined ||
					value === null ||
					value === '' ||
					(typeof value === 'object' &&
						!Array.isArray(value) &&
						Object.keys(value).length === 0) ||
					(Array.isArray(value) && value.length === 0)
				) {
					return acc;
				}

				acc[key] = value;
				return acc;
			}, {});

			// 提交数据
			const result = await next(cleanData);

			// 刷新表格并重置状态
			refresh({ _t: new Date().getTime() });
			patientInfo = createEmptyPatientInfo();

			// 完成操作
			done();
			ElMessage.success(upsertMode.value === 'add' ? '添加成功' : '更新成功');
		} catch (error: any) {
			ElMessage.error(error.message || '提交失败');
			done();
		}
	}
});

// --- 搜索配置 ---
const Search = useSearch({
	items: [
		{
			prop: 'keyword',
			component: {
				name: 'el-input',
				props: {
					placeholder: '姓名/档案号',
					clearable: true,
					onChange(val: string) {
						refresh({
							keyword: val,
							page: 1
						});
					}
				}
			}
		},
		{
			prop: 'registerDate',
			component: {
				name: 'el-date-picker',
				props: {
					type: 'daterange',
					startPlaceholder: '开始日期',
					endPlaceholder: '结束日期',
					valueFormat: 'YYYY-MM-DD',
					clearable: true,
					style: 'width: 240px'
				}
			}
		}
	]
});

// --- 数据监听 ---
// 监听表单变化，同步到patientInfo
watch(
	() => Upsert.value?.form,
	newVal => {
		if (newVal && Object.keys(newVal).length > 0 && Upsert.value?.mode === 'update') {
			//console.log('表单数据变化:', newVal);
			Object.assign(patientInfo, newVal);
		}
	},
	{ deep: true }
);

// 监听表格数据变化
watch(
	() => Table.value?.data,
	newVal => {
		if (newVal && Array.isArray(newVal)) {
			//console.log('表格数据已更新，共', newVal.length, '条记录');
		}
	},
	{ deep: true }
);

// --- 工具函数 ---
// 刷新表格数据
function refresh(params?: any) {
	//console.log('刷新表格数据:', params);
	Crud.value?.refresh(params);
}

// 获取上次保存的现住址
function getLastCurrentAddress() {
	try {
		const savedAddress = localStorage.getItem(LAST_CURRENT_ADDRESS_KEY);
		return savedAddress ? JSON.parse(savedAddress) : null;
	} catch (error) {
		console.error('获取地址失败:', error);
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

// --- 事件处理 ---
// 处理身份证号存在事件
function onIdCardExists(exists: boolean) {
	idCardExists.value = exists;
}

// 处理手机号存在事件
function onMobileExists(exists: boolean) {
	mobileExists.value = exists;
}

// 处理导入事件
async function onImpSubmit(data: { list: any[]; file: File }, { done, close }: any) {
	try {
		// 获取excel数据文件扩展名
		const ext = extname(data.file.name);
		//console.log('导入文件:', data.file.name, ext);

		// 总数据量
		const total = data.list.length;
		if (total === 0) {
			ElMessage.warning('导入的数据为空');
			done();
			return;
		}

		// 成功和失败计数
		let successCount = 0;
		let failCount = 0;

		// 逐行处理导入数据
		for (let i = 0; i < total; i++) {
			const rawItem = data.list[i];
			//console.log('原始导入数据:', rawItem);

			try {
				// 映射字段 - 将Excel中的中文字段映射为系统字段
				const mappedItem: any = {
					// 基础字段映射
					name: rawItem['姓名'],

					// 性别转换: 男->1, 女->2, 其他->0
					gender: rawItem['性别'] === '男' ? 1 : rawItem['性别'] === '女' ? 2 : 0,

					// 身份证号 - 处理可能的不同命名
					idCard: rawItem['身份证号']
				};

				// 处理就诊日期 - 支持多种可能的字段名
				const possibleDateFields = ['就诊日期', '登记日期', '挂号日期', '录入日期'];
				let dateFound = false;

				for (const fieldName of possibleDateFields) {
					if (rawItem[fieldName] && rawItem[fieldName] !== '') {
						mappedItem.registerDate = rawItem[fieldName];
						dateFound = true;
						//console.log(`找到日期字段 "${fieldName}": ${rawItem[fieldName]}`);
						break;
					}
				}

				// 如果没有找到任何日期字段，才使用当前日期
				if (!dateFound) {
					mappedItem.registerDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
					//console.log('未找到日期字段，使用当前日期');
				}

				// 处理其他可能存在的字段
				if (rawItem['手机号(文本格式)'] || rawItem['手机号']) {
					mappedItem.mobile = rawItem['手机号(文本格式)'] || rawItem['手机号'];
				}

				if (rawItem['出生日期'] && typeof rawItem['出生日期'] === 'string') {
					mappedItem.birthDate = rawItem['出生日期'].split(' ')[0];
				}

				// 数据清理 - 过滤掉无效值
				const cleanData = Object.entries(mappedItem).reduce((acc, [key, value]) => {
					// 跳过无效值
					if (
						value === undefined ||
						value === null ||
						value === '' ||
						(typeof value === 'object' &&
							!Array.isArray(value) &&
							Object.keys(value).length === 0) ||
						(Array.isArray(value) && value.length === 0)
					) {
						return acc;
					}

					acc[key] = value;
					return acc;
				}, {});

				//console.log('处理后的导入数据:', cleanData);

				// 使用service的add方法添加记录
				await service.patient.info.add(cleanData);
				successCount++;

				// 每10条更新一次提示
				if (successCount % 10 === 0 || successCount === total) {
					ElMessage.info(`正在导入: ${successCount}/${total}`);
				}
			} catch (err: any) {
				console.error('导入行数据失败:', rawItem, err);
				failCount++;
			}
		}

		// 完成导入
		ElMessage.success(`导入完成: 成功${successCount}条，失败${failCount}条`);

		// 刷新页面数据
		refresh({ _t: new Date().getTime() });

		// 关闭弹窗
		close();
	} catch (err: any) {
		console.error('导入过程发生错误:', err);
		ElMessage.error(`导入失败: ${err.message || '未知错误'}`);
		done();
	}
}

// 组件注册
defineOptions({
	name: 'patient-info'
});
</script>

<style lang="scss" scoped>
/* 新增滚动容器样式 */
.scroll-container {
	width: 100%;
	max-height: 90vh; /* 根据视口高度自动计算 */
	overflow-y: auto; /* 开启垂直滚动 */
	padding: 15px;

	/* 滚动条美化 */
	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		background: #c0c4cc;
		border-radius: 3px;
	}
}
</style>
