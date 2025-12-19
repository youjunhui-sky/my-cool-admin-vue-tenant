<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 搜索插件 -->
			<cl-search ref="Search" :reset-btn="true" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert">
			<template #slot-patient-questionnaire>
				<questionnaire-base-info
					:key="upsertId || 'new'"
					v-model="questionnaireInfo"
					:mode="upsertMode"
					:id="upsertId"
					:patient-no="currentPatientNo"
					ref="questionnaireInfoRef"
				/>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" setup>
import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { reactive, ref, watch, nextTick } from 'vue';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import QuestionnaireBaseInfo from '/@/modules/etiology/views/component/questionnaire-base-info.vue';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

defineOptions({
	name: 'questionnaire-info'
});

const { service } = useCool();

const questionnaireInfoRef = ref<{
	validate: () => { valid: boolean; message: string } | null;
	form?: any;
	assembleSubmitData: () => any;
} | null>(null);

// --- 状态管理 ---
// 问卷信息数据
function createEmptyQuestionnaireInfo() {
	return reactive<Record<string, any>>({});
}

// 问卷信息数据
let questionnaireInfo = createEmptyQuestionnaireInfo();

// 当前操作模式和ID
const upsertMode = ref('add');
const upsertId = ref(undefined);

// 当前档案号（传递给子组件）
const currentPatientNo = ref<string>('');

// --- 数据字典 ---
const options = reactive({
	gender: [
		{ label: '未知', value: 0, type: 'info' },
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' }
	]
});

/**
 * 根据身份证号码计算年龄
 * @param idCard 身份证号码
 * @returns 年龄或空字符串
 */
function calculateAge(idCard: string | undefined): string {
	if (!idCard) {
		return '';
	}

	// 15位或18位身份证号码
	const idCardStr = String(idCard).trim();
	if (idCardStr.length !== 15 && idCardStr.length !== 18) {
		return '';
	}

	try {
		let birthYear: number;
		let birthMonth: number;
		let birthDay: number;

		if (idCardStr.length === 18) {
			// 18位身份证：第7-10位为年份，11-12位为月份，13-14位为日期
			birthYear = parseInt(idCardStr.substring(6, 10));
			birthMonth = parseInt(idCardStr.substring(10, 12));
			birthDay = parseInt(idCardStr.substring(12, 14));
		} else {
			// 15位身份证：第7-8位为年份（19XX），9-10位为月份，11-12位为日期
			birthYear = 1900 + parseInt(idCardStr.substring(6, 8));
			birthMonth = parseInt(idCardStr.substring(8, 10));
			birthDay = parseInt(idCardStr.substring(10, 12));
		}

		const today = new Date();
		const currentYear = today.getFullYear();
		const currentMonth = today.getMonth() + 1;
		const currentDay = today.getDate();

		let age = currentYear - birthYear;

		// 如果还没过生日，年龄减1
		if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
			age--;
		}

		return age >= 0 ? String(age) : '';
	} catch (error) {
		console.error('计算年龄失败:', error);
		return '';
	}
}

// cl-crud 配置
const Crud = useCrud(
	{
		service: service.patient.questionnaire
	},
	app => {
		app.refresh({
			size: 20 // 默认每页显示20条
		});
	}
);

// cl-table 配置
const Table = useTable({
	columns: [
		{
			type: 'selection',
			minWidth: 40
		},
		{
			label: '档案号',
			prop: 'patientNo',
			minWidth: 80
		},
		{
			label: '姓名',
			prop: 'name',
			minWidth: 80
		},
		{ label: '性别', prop: 'gender', minWidth: 60, dict: options.gender },
		{
			label: '年龄',
			prop: 'age',
			minWidth: 80,
			formatter: (row: any) => {
				return calculateAge(row.idCard);
			}
		},
		{
			label: '问卷标题',
			prop: 'title',
			minWidth: 160
		},
		{
			label: '填报日期',
			prop: 'createTime',
			minWidth: 120,
			sortable: 'desc'
		},
		{
			type: 'op',
			label: '操作',
			width: 200,
			buttons: ['edit', 'delete']
		}
	]
});

// cl-upsert 配置
const Upsert = useUpsert({
	// 弹窗配置：固定高度，内容区域内部滚动
	dialog: {
		width: '80%',
		height: '70vh'
	},
	items: [
		{
			prop: 'questionnaireForm',
			component: {
				name: 'slot-patient-questionnaire'
			}
		},
		{
			prop: 'id',
			hidden: true
		}
	],
	onOpen() {
		// 打开表单前，获取当前模式和ID
		const mode = Upsert.value?.mode || 'add';
		const form = Upsert.value?.form || {};
		const id = form.id;
		const patientNo = form.patientNo;

		// 更新模式和ID
		upsertMode.value = mode;
		upsertId.value = id;
		currentPatientNo.value = patientNo || '';

		// 如果是新增模式，重置问卷信息数据
		if (mode === 'add') {
			questionnaireInfo = createEmptyQuestionnaireInfo();
		}
	},
	onInfo(data, { next, done }) {
		// 获取详情数据
		next(data)
			.then(info => {
				questionnaireInfo = createEmptyQuestionnaireInfo();

				// 更新模式和ID（这会触发组件重新创建，因为 key 变化）
				// 但此时 questionnaireInfo 已经包含完整数据
				upsertMode.value = 'update';
				upsertId.value = info.id;
				currentPatientNo.value = info.patientNo || '';
                
				// 等待组件重新创建后，再次确保数据同步
				nextTick(() => {
					// 再次确保数据同步（因为组件重新创建可能导致数据丢失）
					if (!questionnaireInfo.id || questionnaireInfo.id !== info.id) {
						Object.assign(questionnaireInfo, info);
					}

					console.log('问卷信息已更新=', {
						id: questionnaireInfo.id,
						patientNo: questionnaireInfo.patientNo,
						name: questionnaireInfo.name,
						keys: Object.keys(questionnaireInfo)
					});
				});

				// 返回数据，继续UI流程
				done(info);
			})
			.catch(error => {
				console.error('获取详情失败:', error);
				done(data);
			});
	},
	onOpened(data) {
		// 表单打开后，数据已加载完成
		// 在 onInfo 中已经处理了数据，这里作为备用确保数据正确
		if (Upsert.value?.mode === 'update' && data) {
			nextTick(() => {
				// 检查数据是否已正确设置，如果没有则设置
				if (!questionnaireInfo.id || questionnaireInfo.id !== data.id) {
					// 清空旧数据
					Object.keys(questionnaireInfo).forEach(key => {
						delete questionnaireInfo[key];
					});
					// 设置新数据
					Object.assign(questionnaireInfo, data);
				}
			});
		}
	},
	onSubmit(data, { next, done }) {
		// 检查组件引用是否存在
		if (!questionnaireInfoRef.value) {
			ElMessage.error('表单组件未初始化');
			done();
			return;
		}

		// 验证表单
		const validateResult = questionnaireInfoRef.value!.validate() as unknown;
		// validate 返回的是 Promise
		(validateResult as Promise<{ valid: boolean; message: string }>)
			.then(res => {
				if (!res.valid) {
					ElMessage.error(res.message || '请填写完整信息');
			done();
			return;
		}

		// 提交时，合并问卷信息数据
		// data 只包含 cl-upsert items 中配置的字段（如 id）
		// questionnaireInfo 包含插槽组件中的所有表单数据
				const assembleSubmitData = questionnaireInfoRef.value?.assembleSubmitData() || {};
				console.log('assembleSubmitData=', assembleSubmitData);
				next(assembleSubmitData);
			})
			.catch(() => {
				ElMessage.error('请填写完整信息');
				done();
			});
	}
});

// cl-search 配置
const Search = useSearch({
	items: [
		{
			label: '',
			prop: 'keyword',
			component: {
				name: 'el-input',
				props: {
					placeholder: '姓名/档案号',
					clearable: true
				}
			}
		},
		{
			label: '',
			prop: 'dateRange',
			value: [
				dayjs().subtract(6, 'day').format('YYYY-MM-DD'), // 7天前（包含今天，所以是6天前）
				dayjs().format('YYYY-MM-DD') // 今天
			],
			component: {
				name: 'el-date-picker',
				props: {
					type: 'daterange',
					startPlaceholder: '开始日期',
					endPlaceholder: '结束日期',
					valueFormat: 'YYYY-MM-DD',
					format: 'YYYY-MM-DD'
				}
			}
		}
	],
	onSearch: (data, { next }) => {
		// 处理搜索参数
		const params: any = {};

		// 处理关键字搜索（姓名或档案号）
		if (data.keyword) {
			//判断是否为数字
			if (isNaN(Number(data.keyword))) {
				params.name = data.keyword;
				params.patientNo = undefined; // 清空档案号参数
			} else {
				params.patientNo = data.keyword;
				params.name = undefined; // 清空姓名参数
			}
		} else {
			// 如果没有关键字，清空相关参数
			params.name = undefined;
			params.patientNo = undefined;
		}

		// 处理时间范围
		if (data.dateRange && Array.isArray(data.dateRange) && data.dateRange.length === 2) {
			params.fillDateStart = data.dateRange[0];
			params.fillDateEnd = data.dateRange[1];
		} else {
			// 如果没有时间范围，清空相关参数
			params.fillDateStart = undefined;
			params.fillDateEnd = undefined;
		}

		console.log('搜索参数111=', params);

		console.log('搜索参数222=', params);

		next(params);
	}
});
</script>

<style lang="scss" scoped></style>
