<template>
	<cl-crud ref="Crud">
		<p hidden>id: {{ swlId }}</p>
		<p hidden>swlNo: {{ swlNo }}</p>
		<p hidden>serialNumber: {{ serialNumber }}</p>
		<p hidden>sequenceNo: {{ sequenceNo }}</p>
		<p hidden>episode: {{ episode }}</p>
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 重置按钮-->
			<cl-search-key placeholder="姓名、碎石号" />
		</cl-row>

		<cl-row>
			<!-- 表格 -->
			<cl-table ref="Table">
				<!-- 展开信息 -->
				<template #column-detail="{ scope }">
					<div style="padding: 0 10px">
						<el-descriptions border :column="4" class="future-descriptions">
							<el-descriptions-item label="末次SWL术后天数">
								{{ scope.row.lastSWLMonths }}
							</el-descriptions-item>
							<el-descriptions-item label="总SWL治疗次数">
								{{ scope.row.totalSWLCount }}
							</el-descriptions-item>
							<el-descriptions-item label="SWL治疗结石">
								{{ scope.row.treatedStones }}
							</el-descriptions-item>
							<el-descriptions-item label="未治疗结石">
								{{ scope.row.untreatedStones }}
							</el-descriptions-item>
							<el-descriptions-item label="BP">
								{{ scope.row.baselineBP }}
							</el-descriptions-item>
							<el-descriptions-item label="BP变化">
								{{ scope.row.bpChange }}
							</el-descriptions-item>
							<el-descriptions-item label="轻度肾萎缩">
								<el-tag
									v-if="
										scope.row.mildAtrophy === '1' || scope.row.mildAtrophy === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="中度肾萎缩">
								<el-tag
									v-if="
										scope.row.moderateAtrophy === '1' ||
										scope.row.moderateAtrophy === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="重度肾萎缩">
								<el-tag
									v-if="
										scope.row.severeAtrophy === '1' ||
										scope.row.severeAtrophy === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="肾周积液">
								<el-tag
									v-if="
										scope.row.perirenalFluid === '1' ||
										scope.row.perirenalFluid === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="肾功能丧失">
								<el-tag
									v-if="
										scope.row.renalFunctionLoss === '1' ||
										scope.row.renalFunctionLoss === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="集合系统狭窄">
								<el-tag
									v-if="
										scope.row.collectingSystemStricture === '1' ||
										scope.row.collectingSystemStricture === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="输尿管狭窄">
								<el-tag
									v-if="
										scope.row.ureteralStricture === '1' ||
										scope.row.ureteralStricture === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="肾功能损害">
								<el-tag
									v-if="
										scope.row.renalImpairment === '1' ||
										scope.row.renalImpairment === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="复发性尿路感染">
								<el-tag
									v-if="
										scope.row.recurrentUTI === '1' ||
										scope.row.recurrentUTI === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="儿童生长发育障碍">
								<el-tag
									v-if="
										scope.row.growthDisorder === '1' ||
										scope.row.growthDisorder === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="生活习惯">
								{{ scope.row.liveHabitChange }}
							</el-descriptions-item>
							<el-descriptions-item label="饮水量变化">
								{{ scope.row.waterHabitChange }}
							</el-descriptions-item>
							<el-descriptions-item label="每日饮水量(ml/d)">
								{{ scope.row.dailyWaterIntake }}
							</el-descriptions-item>
							<el-descriptions-item label="职业是否改变">
								{{ scope.row.occupationalChange }}
							</el-descriptions-item>
							<el-descriptions-item label="职业风险暴露">
								{{ scope.row.occupationalRisk }}
							</el-descriptions-item>
							<el-descriptions-item label="血液异常指标">
								{{ scope.row.bloodAbnormalities }}
							</el-descriptions-item>
							<el-descriptions-item label="尿液异常指标">
								{{ scope.row.urineAbnormalities }}
							</el-descriptions-item>
							<el-descriptions-item label="IVU检查结果">
								{{ scope.row.ivuFinding }}
							</el-descriptions-item>
							<el-descriptions-item label="ECT检查结果">
								{{ scope.row.ectFinding }}
							</el-descriptions-item>
							<el-descriptions-item label="B超检查结果">
								{{ scope.row.usFinding }}
							</el-descriptions-item>
							<el-descriptions-item label="KUB检查结果">
								{{ scope.row.kubFinding }}
							</el-descriptions-item>
							<el-descriptions-item label="其他检查结果">
								{{ scope.row.otherFinding }}
							</el-descriptions-item>
							<el-descriptions-item label="随访医生">
								{{ scope.row.physician }}
							</el-descriptions-item>
						</el-descriptions>
					</div>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />

			<!-- 分页 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert">
			<!-- 添加医生选择器插槽 -->
			<template #slot-doctor="{ scope }">
				<doctor-select v-model="scope.physician" />
			</template>
			<!-- 血压输入框插槽 -->
			<template #slot-bloodPressure="{ scope }">
				<div class="blood-pressure-input">
					<el-input
						v-model="scope.baselineBP.systolic"
						class="systolic-part"
						placeholder="收缩压"
						type="number"
						:min="60"
						:max="220"
						@change="
							val => {
								//console.log('血压收缩压更新：', scope.baselineBP);
								// 确保直接更新Form实例的值
								if (Upsert.value?.form) {
									const systolic = scope.baselineBP.systolic || '0';
									const diastolic = scope.baselineBP.diastolic || '0';
									const bpValue = `${systolic}/${diastolic}`;
									// 使用setForm方法直接更新Form实例的bloodPressure值
									Upsert.value.setForm('baselineBP', bpValue);
									//console.log('直接更新Form血压值:', bpValue);
								}
							}
						"
					/>
					<span class="separator">/</span>
					<el-input
						v-model="scope.baselineBP.diastolic"
						class="diastolic-part"
						placeholder="舒张压"
						type="number"
						:min="40"
						:max="140"
						@change="
							val => {
								//console.log('血压舒张压更新：', scope.baselineBP);
								// 确保直接更新Form实例的值
								if (Upsert.value?.form) {
									const systolic = scope.baselineBP.systolic || '0';
									const diastolic = scope.baselineBP.diastolic || '0';
									const bpValue = `${systolic}/${diastolic}`;
									// 使用setForm方法直接更新Form实例的bloodPressure值
									Upsert.value.setForm('baselineBP', bpValue);
									//console.log('直接更新Form血压值:', bpValue);
								}
							}
						"
					/>
					<span class="unit">mmHg</span>
				</div>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script setup lang="ts">
import { useCrud, useUpsert, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useBase } from '/@/modules/base';
import { onMounted, reactive, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { Plugins } from '/#/crud';
import { usePatient } from '/@/modules/patient';

// 组件设置
const { user } = useBase();
const { dict } = useDict();
const { service } = useCool();
const route = useRoute();
// 引入医生选择器组件
const { DoctorSelect } = usePatient();

// 获取路由参数
const swlId = route.query.id;
const swlNo = route.query.swlNo;
const serialNumber = route.query.serialNumber;
const sequenceNo = route.query.sequenceNo;
const episode = route.query.episode;
// 页面数据和状态
const pageData = reactive({
	loading: false,
	hasRecords: false,
	maxEpisode: 0,
	maxFollowupCount: 0
});

// 静态配置和选项
const options = reactive({
	gender: [
		{ label: '未知', value: 0, type: 'default' },
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' }
	]
});

// 远期并发症选项
const bfzOptions = [
	{ label: '轻度肾萎缩', value: 'mildAtrophy' },
	{ label: '中度肾萎缩', value: 'moderateAtrophy' },
	{ label: '重度肾萎缩', value: 'severeAtrophy' },
	{ label: '肾周积液', value: 'perirenalFluid' },
	{ label: '肾功能丧失', value: 'renalFunctionLoss' },
	{ label: '集合系统狭窄', value: 'collectingSystemStricture' },
	{ label: '输尿管狭窄', value: 'ureteralStricture' },
	{ label: '肾功能损害', value: 'renalImpairment' },
	{ label: '复发性尿路感染', value: 'recurrentUTI' },
	{ label: '儿童生长发育障碍', value: 'growthDisorder' }
];

// 格式化远期并发症数据
const formatBfz = (data: any) => {
	const reactions: string[] = [];
	if (data && typeof data === 'object') {
		if (Number(data.mildAtrophy) === 1) reactions.push('mildAtrophy');
		if (Number(data.moderateAtrophy) === 1) reactions.push('moderateAtrophy');
		if (Number(data.severeAtrophy) === 1) reactions.push('severeAtrophy');
		if (Number(data.perirenalFluid) === 1) reactions.push('perirenalFluid');
		if (Number(data.renalFunctionLoss) === 1) reactions.push('renalFunctionLoss');
		if (Number(data.collectingSystemStricture) === 1)
			reactions.push('collectingSystemStricture');
		if (Number(data.ureteralStricture) === 1) reactions.push('ureteralStricture');
		if (Number(data.renalImpairment) === 1) reactions.push('renalImpairment');
		if (Number(data.recurrentUTI) === 1) reactions.push('recurrentUTI');
		if (Number(data.growthDisorder) === 1) reactions.push('growthDisorder');
	}
	return reactions;
};

/**
 * 第一步：crud配置
 * page:后端重写page方法，用于查询近期随访记录，需包含SWL登记信息和SWL治疗信息
 * info:后端重写info方法，用于查询近期随访记录详情，需包含SWL登记信息、SWL治疗信息
 */
const Crud = useCrud(
	{
		service: service.swl.future
	},
	app => {
		// 初始化时不主动刷新，由initPage方法控制刷新逻辑
	}
);

// 创建统一的刷新参数构建函数
const buildRefreshParams = () => {
	return swlNo && serialNumber ? { swlNo, serialNumber } : {};
};

/**
 * 第二步：填写远期随访的前置信息：
 * 查询病人SWL登记信息
 * 查询病人SWL治疗信息
 */
const patientSwlInfo = reactive({
	swlId: swlId, // swlId
	swlNo: swlNo, // 碎石号
	serialNumber: serialNumber, // 就诊流水号
	sequenceNo: Number(sequenceNo), // 序列号
	episode: Number(episode), // 期数
	name: '', // 姓名
	gender: '', // 性别
	age: '', // 年龄
	outpatientNo: '', // 门诊号
	inpatientNo: '', // 住院号
	bedNo: '', // 床号
	height: '', // 身高
	weight: '', // 体重
	bmi: '', // BMI
	treatmentTime: '' // 治疗日期
});

// 查询病人SWL信息和SWL治疗信息
const querySwlTreatment = async () => {
	try {
		const params = { id: swlId };
		const swlData = await service.swl.info.info(params);
		// treatmentData可能为对象数组，需要取第一个
		const treatmentDataList = await service.swl.treatment.page({
			swlNo: swlNo,
			serialNumber: serialNumber,
			sequenceNo: Number(sequenceNo),
			page: 1,
			size: 999
		});
		const treatmentData = treatmentDataList?.list?.[0];
		// componentData可能为对象数组，需要取第一个
		const componentDataList = await service.etiology.component.page({
			swlNo: swlNo,
			serialNumber: serialNumber,
			page: 1,
			size: 999
		});
		const componentData = componentDataList?.list?.[0];

		// //console.log(
		// 	'查询到患者基本信息aaaaaaaaaaaaaaaaaaaa:',
		// 	swlData,
		// 	treatmentData,
		// 	componentData
		// );
		// 必须保持swlData、treatmentData有值，componentData有值时合并，无值时使用空对象
		// 重复字段，以swlData为准,因此要在最后合并
		if (swlData && treatmentData) {
			// 基础数据合并
			const mergedData = {
				...treatmentData,
				// componentData有值时合并，无值时使用空对象
				...(componentData || {}),
				...swlData
			};

			// 将查询到的数据赋值给患者信息对象
			Object.assign(patientSwlInfo, {
				...mergedData,
				swlId: swlData.id
			});

			//console.log('查询到患者基本信息bbbbbbbbbbbbbbbbbbb:', patientSwlInfo);
			return mergedData;
		} else {
			return null;
		}
	} catch (error) {
		console.error('获取患者信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(patientSwlInfo, {
			swlId: swlId,
			swlNo: swlNo,
			serialNumber: serialNumber,
			sequenceNo: Number(sequenceNo),
			episode: Number(episode),
			followupCount: 1,
			name: ' ',
			gender: ' ',
			age: ' ',
			outpatientNo: ' ',
			inpatientNo: ' ',
			bedNo: ' ',
			treatmentTime: ' '
		});
	}
};

/**
 * 第三步：页面初始化
 * url参数：swlNo,serialNumber有值时，table初始化该患者近期随访记录
 * 无url参数时，table初始化所有患者近期随访记录
 */
const initPage = async () => {
	pageData.loading = true;

	try {
		// 查询患者基本信息
		if (swlId) {
			await querySwlTreatment();
		}

		// 如果有swlNo和serialNumber，检查是否有记录
		if (swlNo && serialNumber) {
			try {
				const records = await service.swl.future.page({
					swlNo: swlNo as string,
					serialNumber: serialNumber as string,
					sequenceNo: Number(sequenceNo),
					page: 1,
					size: 999
				});

				if (records && records.list && records.list.length > 0) {
					pageData.hasRecords = true;

					// 找出最大次数
					const maxFollowupCount = records.list.reduce((max, item) => {
						const followupCount = parseInt(item.followupCount) || 0;
						return followupCount > max ? followupCount : max;
					}, 0);

					pageData.maxFollowupCount = maxFollowupCount;
					// 刷新表格数据
					Crud.value?.refresh(buildRefreshParams());
				} else {
					pageData.hasRecords = false;

					// 询问用户是否要新增远期随访记录
					ElMessageBox.confirm('是否新增新的远期随访记录？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
						.then(() => {
							// 用户确认，打开新增表单
							Crud.value?.rowAdd();
						})
						.catch(() => {
							// 用户取消，显示空表格
							Crud.value?.refresh(buildRefreshParams());
						});
				}
			} catch (error) {
				ElMessage.error('查询远期随访记录失败');
				pageData.hasRecords = false;
				Crud.value?.refresh(buildRefreshParams()); // 仍然刷新表格显示空数据
			}
		} else {
			// 没有swlNo和serialNumber，直接刷新表格
			Crud.value?.refresh(buildRefreshParams());
		}
	} catch (error) {
		ElMessage.error('页面初始化失败');
	} finally {
		pageData.loading = false;
	}
};

// 使用nextTick包装初始化函数，确保组件已经渲染
const safeInit = () => {
	nextTick(() => {
		initPage();
	});
};

// 在mounted钩子中使用setTimeout避免生命周期问题
onMounted(() => {
	setTimeout(safeInit, 0);
});

// 表格配置
const Table = useTable({
	props: {
		rowStyle: { height: '38px' },
		cellStyle: { padding: '0' }
	},
	columns: [
		{
			type: 'selection',
			minWidth: 40
		},
		// 展开列
		{
			label: '展开',
			type: 'expand',
			prop: 'detail',
			minWidth: 60
		},
		{
			label: '碎石号',
			prop: 'swlNo',
			minWidth: 120
		},
		// {
		// 	label: '就诊流水号',
		// 	prop: 'serialNumber',
		// 	width: 100
		// },
		{
			label: '姓名',
			prop: 'name',
			minWidth: 100
		},
		{
			label: '性别',
			prop: 'gender',
			minWidth: 60,
			dict: options.gender
		},
		{
			label: '年龄',
			prop: 'age',
			minWidth: 60
		},
		{
			label: '次数',
			prop: 'followupCount',
			minWidth: 60
		},
		{
			label: '治疗日期',
			prop: 'treatmentTime',
			showOverflowTooltip: true,
			tooltipEffect: 'dark',
			formatter: (row: any) => {
				return row.treatmentTime?.split(' ')[0] || '';
			},
			minWidth: 120
		},
		{
			label: '随访日期',
			prop: 'followupDate',
			showOverflowTooltip: true,
			tooltipEffect: 'dark',
			formatter: (row: any) => {
				return row.followupDate?.split(' ')[0] || '';
			},
			minWidth: 120
		},
		{
			label: '末次SWL术后天数',
			prop: 'lastSWLMonths',
			minWidth: 100
		},
		{
			label: '总SWL治疗次数',
			prop: 'totalSWLCount',
			minWidth: 100
		},
		{
			label: '随访医生',
			prop: 'physician',
			minWidth: 100
		},
		{
			type: 'op',
			minWidth: 160,
			buttons: ['edit', 'delete']
		}
	]
});

/**
 * 第四步：新增、编辑、查看表单配置
 * url参数：swlNo,serialNumber有值时，新增模式，当前最大随访次数+1
 * 无url参数时，新增模式，获取勾选患者近期随访记录，当前最大随访次数+1
 * 同时，如果该患者有结石成分记录，获取结石成分数据
 */
const Upsert = useUpsert({
	dialog: {
		width: '70%',
		// 顶部距离
		top: '2%',
		// 内边距
		padding: '10px 30px 10px 30px'
	},

	// 在表单打开前执行
	async onOpen() {
		// 如果框架渲染延迟，用 MutationObserver 监听
		// const observer = new MutationObserver(() => {
		// 	const items = document.querySelectorAll('.el-form-item--label-top');
		// 	items.forEach(item => ((item as HTMLElement).style.marginBottom = '10px'));
		// });
		// observer.observe(document.body, { subtree: true, childList: true });
		// 判断当前表单的操作模式
		if (Upsert.value?.mode === 'add') {
			try {
				let currentSwlNo = swlNo;
				let currentSerialNumber = serialNumber;
				let currentSequenceNo = Number(sequenceNo);
				let currentEpisode = Number(episode);
				let selection: any[] = [];
				// 如果URL中包含swlNo和serialNumber
				if (swlNo && serialNumber) {
					currentSwlNo = swlNo as string;
					currentSerialNumber = serialNumber as string;
					currentSequenceNo = Number(sequenceNo);
					currentEpisode = Number(episode);
				} else {
					// 如果没有URL参数，检查表格选中行
					selection = Table.value?.getSelectionRows() || [];
					if (selection.length === 1) {
						currentSwlNo = selection[0].swlNo as string;
						currentSerialNumber = selection[0].serialNumber as string;
						currentSequenceNo = Number(selection[0].sequenceNo);
						currentEpisode = Number(selection[0].episode);
					}
				}

				// 如果有swlNo和serialNumber，查询最大次数
				if (currentSwlNo && currentSerialNumber) {
					const records = await service.swl.future.page({
						swlNo: currentSwlNo,
						serialNumber: currentSerialNumber,
						sequenceNo: currentSequenceNo,
						episode: currentEpisode,
						page: 1,
						size: 999
					});

					let maxFollowupCount = 0;
					if (records && records.list && records.list.length > 0) {
						// 找出最大次数
						maxFollowupCount = records.list.reduce((max, item) => {
							const followupCount = parseInt(item.followupCount) || 0;
							return followupCount > max ? followupCount : max;
						}, 0);
					}

					// 初始化表单数据
					if (Upsert.value?.form) {
						const defaulData = {
							swlNo: currentSwlNo,
							serialNumber: currentSerialNumber,
							sequenceNo: currentSequenceNo,
							episode: currentEpisode,
							followupCount: maxFollowupCount + 1,
							name: patientSwlInfo.name || selection[0]?.name,
							gender: patientSwlInfo.gender || selection[0]?.gender,
							age: patientSwlInfo.age || selection[0]?.age,
							outpatientNo: patientSwlInfo.outpatientNo || selection[0]?.outpatientNo,
							inpatientNo: patientSwlInfo.inpatientNo || selection[0]?.inpatientNo,
							bedNo: patientSwlInfo.bedNo || selection[0]?.bedNo,
							treatmentTime:
								patientSwlInfo.treatmentTime || selection[0]?.treatmentTime,
							followupDate: dayjs().format('YYYY-MM-DD'),
							// 术后天数为治疗日期到随访日期的天数
							lastSWLMonths: dayjs().diff(dayjs(patientSwlInfo.treatmentTime), 'day')
						};
						Object.assign(Upsert.value.form, defaulData);
					}
				}
			} catch (error) {
				ElMessage.error('获取次数信息失败');
			}
		}
	},

	// 表单打开后，初始化计算
	onOpened(data) {
		// 打印日志
		//console.log('表单已打开，模式:', Upsert.value?.mode, '数据:', data);

		// 判断当前模式
		if (Upsert.value?.mode === 'update' || Upsert.value?.mode === 'info') {
			// 处理远期并发症数据，用于多选框显示
			data.bfzOptions = formatBfz(data);
		} else if (Upsert.value?.mode === 'add') {
			// 新增模式下，确保远期并发症数据为空数组
			data.bfzOptions = [];
		}
	},

	// 表单提交钩子
	onSubmit(data, { next, done, close }) {
		//console.log('提交数据开始。。。。。。。。。。。。。。。。。。。：', data.id);

		// 确保编辑时id存在
		if (Upsert.value?.mode === 'update' && !data.id) {
			ElMessage.error('无法更新记录：缺少ID');
			done();
			return;
		}

		// 处理血压数据
		const getBloodPressure = () => {
			// 首先尝试从Upsert实例获取直接设置的值
			if (
				Upsert.value?.form?.baselineBP !== undefined &&
				typeof Upsert.value.form.baselineBP !== 'object'
			) {
				const bp = Upsert.value.form.baselineBP;
				//console.log(`从Upsert实例获取血压字符串: ${bp}`);
				return bp;
			}

			// 然后尝试从Upsert实例获取对象并合成
			if (
				Upsert.value?.form?.baselineBP &&
				typeof Upsert.value.form.baselineBP === 'object'
			) {
				const bpObj = Upsert.value.form.baselineBP;
				if (bpObj.systolic || bpObj.diastolic) {
					const systolic = bpObj.systolic || '0';
					const diastolic = bpObj.diastolic || '0';
					const bp = `${systolic}/${diastolic}`;
					//console.log(`从Upsert实例合成血压字符串: ${bp}`);
					return bp;
				}
			}

			// 最后尝试从data对象获取
			if (data.baselineBP) {
				if (typeof data.baselineBP === 'object') {
					if (data.baselineBP.systolic || data.baselineBP.diastolic) {
						const systolic = data.baselineBP.systolic || '0';
						const diastolic = data.baselineBP.diastolic || '0';
						const bp = `${systolic}/${diastolic}`;
						//console.log(`从data对象合成血压字符串: ${bp}`);
						return bp;
					}
				} else {
					//console.log(`从data对象获取血压字符串: ${data.baselineBP}`);
					return data.baselineBP;
				}
			}

			//console.log(`无法获取有效的血压数据`);
			return null;
		};

		// 设置最终的血压值
		data.baselineBP = getBloodPressure();

		// 处理远期并发症数据 - 从多选框数组转为单独的字段
		const bfzOptions = data.bfzOptions || [];
		const bfzData = {
			mildAtrophy: bfzOptions.includes('mildAtrophy') ? 1 : 0,
			moderateAtrophy: bfzOptions.includes('moderateAtrophy') ? 1 : 0,
			severeAtrophy: bfzOptions.includes('severeAtrophy') ? 1 : 0,
			perirenalFluid: bfzOptions.includes('perirenalFluid') ? 1 : 0,
			renalFunctionLoss: bfzOptions.includes('renalFunctionLoss') ? 1 : 0,
			collectingSystemStricture: bfzOptions.includes('collectingSystemStricture') ? 1 : 0,
			ureteralStricture: bfzOptions.includes('ureteralStricture') ? 1 : 0,
			renalImpairment: bfzOptions.includes('renalImpairment') ? 1 : 0,
			recurrentUTI: bfzOptions.includes('recurrentUTI') ? 1 : 0,
			growthDisorder: bfzOptions.includes('growthDisorder') ? 1 : 0
		};

		// 创建最终提交的数据对象 - 合并原数据和不良反应数据
		const submitData = {
			...data,
			...bfzData,
			//确保id，swlNo，serialNumber，sequenceNo，episode有值
			id: data.id,
			swlNo: data.swlNo,
			serialNumber: data.serialNumber,
			followupCount: data.followupCount
		};

		// 删除多选数组，避免后端存储问题
		delete submitData.bfzOptions;

		// 最终数据验证 - 确保血压是正确的格式
		//console.log('最终数据验证前:', JSON.stringify(submitData));

		// 检查血压是否仍然是对象，如果是则转换为字符串
		if (submitData.baselineBP && typeof submitData.baselineBP === 'object') {
			if (submitData.baselineBP.systolic || submitData.baselineBP.diastolic) {
				const systolic = submitData.baselineBP.systolic || '0';
				const diastolic = submitData.baselineBP.diastolic || '0';
				submitData.baselineBP = `${systolic}/${diastolic}`;
				//console.log(`最终提交前转换血压数据: ${submitData.baselineBP}`);
			} else {
				submitData.baselineBP = null;
			}
		}

		//console.log('最终保存参数:', JSON.stringify(submitData));

		// 继续正常提交流程
		next(submitData);
	},

	// 表单关闭后钩子
	onClosed() {
		//console.log('表单已关闭');
		// 刷新表格数据
		Crud.value?.refresh(buildRefreshParams());
	},

	plugins: [Plugins.Form.setFocus('')],

	items: [
		{
			label: '碎石号',
			prop: 'swlNo',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					disabled: true,
					readonly: true
				}
			}
		},
		{
			label: '姓名',
			prop: 'name',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '性别',
			prop: 'gender',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					options: options.gender,
					checkStrictly: true
				}
			}
		},
		{
			label: '年龄',
			prop: 'age',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '序列号',
			prop: 'sequenceNo',
			span: 4,
			component: {
				name: 'el-input-number',
				props: {
					disabled: true,
					readonly: true,
					min: 1
				}
			}
		},
		{
			label: '次数',
			prop: 'followupCount',
			span: 4,
			component: {
				name: 'el-input-number',
				props: {
					min: 1
				}
			}
		},
		{
			label: '治疗时间',
			prop: 'treatmentTime',
			span: 4,
			component: {
				name: 'el-date-picker',
				props: {
					type: 'date',
					disabled: true,
					readonly: true,
					valueFormat: 'YYYY-MM-DD'
				}
			}
		},
		{
			label: '随访日期',
			prop: 'followupDate',
			span: 4,
			value: dayjs().format('YYYY-MM-DD'),
			component: {
				name: 'el-date-picker',
				props: {
					type: 'date',
					valueFormat: 'YYYY-MM-DD'
				}
			}
		},
		{
			label: '末次SWL术后天数',
			prop: 'lastSWLMonths',
			span: 4,
			component: {
				name: 'el-input-number',
				slots: {
					append: () => {
						return '天';
					}
				}
			}
		},
		{
			label: '总SWL治疗次数',
			prop: 'totalSWLTimes',
			span: 4,
			component: {
				name: 'el-input-number',
				props: {
					placeholder: '请选择总SWL治疗次数',
					min: 1
				}
			}
		},
		{
			label: '已治疗结石',
			prop: 'treatedStones',
			span: 4,
			value: '无',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择已治疗结石',
					options: dict.get('future_swlcure'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '未治疗结石',
			prop: 'untreatedStones',
			span: 4,
			value: '无',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择已治疗结石',
					options: dict.get('future_nonecure'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '远期并发症',
			prop: 'bfzOptions',
			span: 24,
			component: {
				name: 'el-checkbox-group',
				options: bfzOptions
			}
		},
		{
			label: '基础血压',
			prop: 'baselineBP',
			span: 4,
			hook: {
				bind(value) {
					// 读取时拆分为收缩压和舒张压
					//console.log('血压bind前: 原始值=', value, typeof value);
					if (!value) {
						//console.log('血压bind: 值为空，返回空对象');
						return { systolic: '', diastolic: '' };
					}
					const parts = String(value).split('/');
					const result = {
						systolic: parts[0] || '',
						diastolic: parts[1] || ''
					};
					//console.log('血压bind后: ', value, ' -> ', result);
					return result;
				},
				submit(value, { form, prop }) {
					// 提交时合并收缩压和舒张压
					//console.log('血压submit前: ', value, typeof value);
					if (value && (value.systolic || value.diastolic)) {
						const systolic = value.systolic || '0';
						const diastolic = value.diastolic || '0';
						form[prop] = `${systolic}/${diastolic}`;
						//console.log('血压submit后: form[prop]=', form[prop], 'form=', form);
					} else {
						form[prop] = null;
						//console.log('血压submit为null, form=', form);
					}
				}
			},
			component: {
				name: 'slot-bloodPressure'
			}
		},
		{
			label: '血压变化',
			prop: 'bpChange',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择已治疗结石',
					options: dict.get('future_bp'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '生活习惯',
			prop: 'liveHabitChange',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择生活习惯',
					options: dict.get('future_lifthabit'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '饮水量变化',
			prop: 'waterHabitChange',
			span: 3,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择饮水量变化',
					options: dict.get('future_waterchg'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '每日饮水量(ml/d)',
			prop: 'dailyWaterIntake',
			span: 3,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入每日饮水量(ml/d)'
				}
			}
		},
		{
			label: '职业是否改变',
			prop: 'occupationalChange',
			span: 3,
			component: {
				name: 'cl-switch',
				props: {
					activeText: '有',
					inactiveText: '无',
					activeValue: 1,
					inactiveValue: 0
				}
			}
		},
		{
			label: '职业风险暴露',
			prop: 'occupationalRisk',
			span: 3,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择职业风险暴露',
					options: dict.get('future_dutyrisk'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '血液异常指标',
			prop: 'bloodAbnormalities',
			span: 8,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入血液异常指标'
				}
			}
		},
		{
			label: '尿液异常指标',
			prop: 'urineAbnormalities',
			span: 8,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入尿液异常指标'
				}
			}
		},
		{
			label: 'IVU检查结果',
			prop: 'ivuFinding',
			span: 8,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入IVU检查结果'
				}
			}
		},
		{
			label: 'ECT检查结果',
			prop: 'ectFinding',
			span: 8,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入ECT检查结果'
				}
			}
		},
		{
			label: '超声检查结果',
			prop: 'usFinding',
			span: 8,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入超声检查结果'
				}
			}
		},
		{
			label: 'KUB检查结果',
			prop: 'kubFinding',
			span: 8,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入KUB检查结果'
				}
			}
		},
		{
			label: '其他检查结果',
			prop: 'otherFinding',
			span: 20,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入其他检查结果'
				}
			}
		},
		{
			label: '随访医生',
			prop: 'physician',
			value: user.info?.name,
			span: 4,
			component: {
				name: 'slot-doctor'
			}
		}
	]
});
</script>

<style lang="scss" scoped>
.future-info {
	padding: 20px;
	background-color: #f8fafc;
	background-image:
		radial-gradient(circle at 10% 10%, rgba(224, 242, 254, 0.8), transparent 30%),
		radial-gradient(circle at 90% 90%, rgba(186, 230, 253, 0.4), transparent 40%);
	border-radius: 15px;
	box-shadow: 0 12px 30px rgba(32, 160, 255, 0.12);
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(90deg, rgba(32, 160, 255, 0.8), rgba(29, 233, 182, 0.8));
		background-size: 200% 100%;
		animation: gradientFlow 5s infinite linear;
	}

	.tech-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3px;
		padding-bottom: 3px;
		border-bottom: 1px solid rgba(32, 160, 255, 0.25);
		position: relative;

		.tech-title-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: nowrap;
			width: 100%; // 确保占满整行

			.tech-title {
				font-size: 22px;
				font-weight: 600;
				color: #0a58ca;
				text-shadow: 0 0 10px rgba(32, 160, 255, 0.2);
				white-space: nowrap;
				flex-shrink: 0; // 防止标题被压缩
				letter-spacing: 0.5px;
				position: relative;
				padding-left: 15px;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 5px;
					height: 80%;
					background: linear-gradient(
						to bottom,
						rgba(32, 160, 255, 0.8),
						rgba(29, 233, 182, 0.8)
					);
					border-radius: 2px;
				}

				.blink {
					animation: blink 1.2s infinite;
					font-weight: normal;
					color: rgba(32, 160, 255, 0.9);
				}
			}

			.model-info {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-end;
				font-size: 18px;
				color: #6c757d;
				font-family: 'Courier New', monospace;
				margin-left: auto;
				padding-left: 20px;
				flex-grow: 1; // 允许信息区域在有空间时扩展
				text-align: right; // 确保文本靠右对齐

				span {
					margin-left: 18px;
					padding: 2px 5px;
					white-space: nowrap;
					display: inline-block;
					position: relative;
					font-weight: bold;
					font-style: italic;
					color: #0d1a26;
					transition: all 0.3s ease;
					cursor: default; // 显示提示鼠标样式

					// 去掉原有的背景和边框
					background: transparent;
					border: none;

					// 添加虚线分隔
					&:not(:first-child)::before {
						content: '';
						position: absolute;
						left: 5px; // 稍微调整虚线位置
						top: 25%;
						height: 50%;
						width: 1px;
						border-left: 1px dashed rgba(32, 160, 255, 0.4);
					}

					&:hover {
						color: rgba(32, 160, 255, 1);
						transform: translateY(-1px);
					}

					&:empty::after {
						content: ' ';
						display: inline-block;
						width: 1px;
					}
				}
			}
		}

		&::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: -1px;
			width: 50px;
			height: 3px;
			background: linear-gradient(90deg, rgba(32, 160, 255, 0.8), rgba(29, 233, 182, 0.8));
		}
	}

	.tech-patient-info {
		padding: 8px 5px 10px;
		margin-bottom: 5px;
		background: rgba(240, 248, 255, 0.9);
		border: 1px solid rgba(32, 160, 255, 0.3);
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(32, 160, 255, 0.2);
		position: relative;
		z-index: 2;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background:
				radial-gradient(circle at 10% 20%, rgba(32, 160, 255, 0.1), transparent 30%),
				radial-gradient(circle at 90% 80%, rgba(29, 233, 182, 0.05), transparent 30%),
				linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
			pointer-events: none;
			z-index: -1;
		}
		.patient-info {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-end;
			font-size: 18px;
			color: #6c757d;
			font-family: 'Courier New', monospace;
			margin-left: auto;
			padding-left: 20px;
			flex-grow: 1; // 允许信息区域在有空间时扩展
			text-align: right; // 确保文本靠右对齐

			span {
				margin-left: 18px;
				padding: 2px 5px;
				white-space: nowrap;
				display: inline-block;
				position: relative;
				font-weight: bold;
				font-style: italic;
				color: #0d1a26;
				transition: all 0.3s ease;
				cursor: default; // 显示提示鼠标样式

				// 去掉原有的背景和边框
				background: transparent;
				border: none;

				// 添加虚线分隔
				&:not(:first-child)::before {
					content: '';
					position: absolute;
					left: 5px; // 稍微调整虚线位置
					top: 25%;
					height: 50%;
					width: 1px;
					border-left: 1px dashed rgba(32, 160, 255, 0.4);
				}

				&:hover {
					color: rgba(32, 160, 255, 1);
					transform: translateY(-1px);
				}

				&:empty::after {
					content: ' ';
					display: inline-block;
					width: 1px;
				}
			}
		}
	}
}

.tech-content {
	position: relative;
	//background-color: #f8fafc;
	//透明背景
	background-color: transparent;
	background-image:
		linear-gradient(125deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 40%),
		radial-gradient(circle at 5% 95%, rgba(32, 160, 255, 0.1), transparent 20%);
	// 增加内容内边距
	padding: 10px;
	// 增加内容圆角
	border-radius: 12px;
	// 增加内容阴影
	box-shadow: 0 10px 25px rgba(32, 160, 255, 0.12);
	// 增加内容最小高度
	min-height: 600px;
	// 增加内容边框
	border: 1px solid rgba(32, 160, 255, 0.25);
	// 增加内容过渡
	transition: all 0.3s ease;
	// 增加内容溢出隐藏
	overflow: hidden;
	// 增加内容顶部间距
	margin-top: 0px;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		background: linear-gradient(90deg, rgba(32, 160, 255, 0.8), rgba(29, 233, 182, 0.8));
		opacity: 0.8;
	}

	// &::after {
	// 	content: '';
	// 	position: absolute;
	// 	width: 100%;
	// 	height: 2px;
	// 	background-color: rgba(32, 160, 255, 0.1);
	// 	left: 0;
	// 	top: 50%;
	// 	animation: scanning 4s ease-in-out infinite;
	// 	pointer-events: none;
	// 	background-image: linear-gradient(
	// 		90deg,
	// 		transparent,
	// 		rgba(32, 160, 255, 0.5),
	// 		rgba(29, 233, 182, 0.5),
	// 		transparent
	// 	);
	// }
}

.scroll-container {
	width: 100%;
	height: 100%;
	max-height: 90vh;
	min-height: 300px;
	overflow-y: auto !important;
	overflow-x: auto !important;
	padding: 15px;
	position: relative;
	display: block;
	box-sizing: border-box;
	z-index: 1;

	&::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	&::-webkit-scrollbar-track {
		background-color: #f1f1f1;
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #c1c1c1;
		border-radius: 4px;
		transition: all 0.2s ease;

		&:hover {
			background-color: #a8a8a8;
		}
	}

	:deep(.cl-form) {
		width: 100%;
		min-width: 100%;
		overflow: visible;
	}
}

@media screen and (max-width: 768px) {
	.scroll-container {
		padding: 10px;
		max-height: 55vh;
	}
}

/* 全局设置表单项间距 */
:deep(.el-form-item) {
	margin-bottom: 10px !important; /* 调整各行之间的间距 */
}

// 设置下拉框高度
:deep(.el-select__wrapper) {
	height: 28px !important;
	min-height: 28px !important;
}

:deep(.el-select__wrapper.is-filterable) {
	height: 28px !important;
	min-height: 28px !important;

	// 设置内部输入框
	input.el-select__input {
		height: 26px !important;
		line-height: 26px !important;
	}
}
:deep(.el-select__wrapper.is-filterable .el-tooltip__trigger) {
	height: 28px !important;
	min-height: 28px !important;
}

.future-descriptions {
	:deep(.el-descriptions__cell) {
		// 确保单元格宽度平均分配
		width: 25% !important;
	}

	:deep(.el-descriptions__item) {
		// 设置弹性布局基础值
		flex: 1 1 25% !important;
		// 设置最小和最大宽度确保4列布局
		min-width: 25% !important;
		max-width: 25% !important;
	}

	:deep(.el-descriptions__label) {
		text-align: left !important;
		// 如果需要固定标签宽度，可以设置
		min-width: 150px !important;
		width: auto !important;
	}

	:deep(.el-descriptions__content) {
		// 确保内容区域填充剩余空间
		flex: 1;
		text-align: left !important;
	}

	// 确保容器使用正确的弹性布局
	:deep(.el-descriptions__body) {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	// 确保行容器正确换行
	:deep(.el-descriptions__row) {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}
}

/* 血压输入框样式 */
.blood-pressure-input {
	display: flex;
	align-items: center;

	.systolic-part {
		width: 85px;
	}

	.separator {
		margin: 0 2px;
		font-weight: bold;
	}

	.diastolic-part {
		width: 85px;
	}

	.unit {
		margin-left: 5px;
	}

	:deep(.el-input__inner) {
		text-align: center;
	}
}
</style>
