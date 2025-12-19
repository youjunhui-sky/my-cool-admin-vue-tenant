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
						<el-descriptions border :column="4" class="near-descriptions">
							<el-descriptions-item label="末期肉眼血尿">
								{{ scope.row.grossHematuria }}
							</el-descriptions-item>
							<el-descriptions-item label="是否发热">
								<el-tag
									v-if="scope.row.hasFever === '1' || scope.row.hasFever === 1"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="是否恶心">
								<el-tag
									v-if="scope.row.hasNausea === '1' || scope.row.hasNausea === 1"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="是否呕吐">
								<el-tag
									v-if="
										scope.row.hasVomiting === '1' || scope.row.hasVomiting === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="是否皮肤渗血或瘀斑">
								<el-tag
									v-if="
										scope.row.hasSkinEcchymosis === '1' ||
										scope.row.hasSkinEcchymosis === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="肾包膜下血肿">
								<el-tag
									v-if="
										scope.row.hasSubcapsularHematoma === '1' ||
										scope.row.hasSubcapsularHematoma === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="肾出血">
								<el-tag
									v-if="
										scope.row.hasRenalHemorrhage === '1' ||
										scope.row.hasRenalHemorrhage === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="感染">
								<el-tag
									v-if="
										scope.row.hasInfection === '1' ||
										scope.row.hasInfection === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="肾绞痛">
								<el-tag
									v-if="
										scope.row.hasRenalColic === '1' ||
										scope.row.hasRenalColic === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="肾衰">
								<el-tag
									v-if="
										scope.row.hasRenalFailure === '1' ||
										scope.row.hasRenalFailure === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="腰腹痛程度">
								{{ scope.row.flankPainLevel }}
							</el-descriptions-item>
							<el-descriptions-item label="石街类型">
								{{ scope.row.steinstrasseType }}
							</el-descriptions-item>
							<el-descriptions-item label="石街长度(cm)">
								{{ scope.row.steinstrasseLength }}
							</el-descriptions-item>
							<el-descriptions-item label="排石时间(天)">
								{{ scope.row.stonePassDays }}
							</el-descriptions-item>
							<el-descriptions-item label="排石量评估">
								{{ scope.row.stoneOutputLevel }}
							</el-descriptions-item>
							<el-descriptions-item label="内科辅助治疗">
								{{ scope.row.medicalTherapy }}
							</el-descriptions-item>
							<el-descriptions-item label="SWL前治疗性辅助">
								{{ scope.row.preSWLTherapy }}
							</el-descriptions-item>
							<el-descriptions-item label="SWL后治疗性辅助">
								{{ scope.row.postSWLTherapy }}
							</el-descriptions-item>
							<el-descriptions-item label="SWL后补助性辅助">
								{{ scope.row.postSWLSupport }}
							</el-descriptions-item>
							<el-descriptions-item label="成分分析方法">
								{{ scope.row.analysisMethod }}
							</el-descriptions-item>
							<el-descriptions-item label="结石成分一">
								{{ scope.row.component1 }}
							</el-descriptions-item>
							<el-descriptions-item label="成分一百分比">
								{{ scope.row.component1Percent }}
							</el-descriptions-item>
							<el-descriptions-item label="结石成分二">
								{{ scope.row.component2 }}
							</el-descriptions-item>
							<el-descriptions-item label="成分二百分比">
								{{ scope.row.component2Percent }}
							</el-descriptions-item>
							<el-descriptions-item label="结石成分三">
								{{ scope.row.component3 }}
							</el-descriptions-item>
							<el-descriptions-item label="成分三百分比">
								{{ scope.row.component3Percent }}
							</el-descriptions-item>
							<el-descriptions-item label="结石成分四">
								{{ scope.row.component4 }}
							</el-descriptions-item>
							<el-descriptions-item label="成分四百分比">
								{{ scope.row.component4Percent }}
							</el-descriptions-item>
							<el-descriptions-item label="术后抗生素使用">
								<el-tag
									v-if="
										scope.row.antibioticsUsed === '1' ||
										scope.row.antibioticsUsed === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="抗生素说明">
								{{ scope.row.antibioticsNote }}
							</el-descriptions-item>
							<el-descriptions-item label="疗效评定">
								{{ scope.row.effectiveness }}
							</el-descriptions-item>
							<el-descriptions-item label="B超结果描述">
								{{ scope.row.usFinding }}
							</el-descriptions-item>
							<el-descriptions-item label="KUB结果描述">
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

// 其他症状选项
const qtzzOptions = [
	{ label: '发热', value: 'fever' },
	{ label: '恶心', value: 'nausea' },
	{ label: '呕吐', value: 'vomiting' },
	{ label: '皮肤渗血或瘀斑', value: 'skinEcchymosis' }
];

// 并发症选项
const bfzOptions = [
	{ label: '肾包膜下血肿', value: 'subcapsularHematoma' },
	{ label: '肾出血', value: 'renalHemorrhage' },
	{ label: '感染', value: 'infection' },
	{ label: '肾绞痛', value: 'renalColic' },
	{ label: '肾衰', value: 'renalFailure' }
];

// 格式化其他症状数据
const formatQtzz = (data: any) => {
	const reactions: string[] = [];
	if (data && typeof data === 'object') {
		if (Number(data.fever) === 1) reactions.push('fever');
		if (Number(data.nausea) === 1) reactions.push('nausea');
		if (Number(data.vomiting) === 1) reactions.push('vomiting');
		if (Number(data.skinEcchymosis) === 1) reactions.push('skinEcchymosis');
	}
	return reactions;
};

// 格式化并发症数据
const formatBfz = (data: any) => {
	const reactions: string[] = [];
	if (data && typeof data === 'object') {
		if (Number(data.subcapsularHematoma) === 1) reactions.push('subcapsularHematoma');
		if (Number(data.renalHemorrhage) === 1) reactions.push('renalHemorrhage');
		if (Number(data.infection) === 1) reactions.push('infection');
		if (Number(data.renalColic) === 1) reactions.push('renalColic');
		if (Number(data.renalFailure) === 1) reactions.push('renalFailure');
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
		service: service.swl.near
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
 * 第二步：填写近期随访的前置信息：
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
	treatmentTime: '', // 治疗日期
	component1: '', // 结石成分一
	component1Percent: '', // 成分一百分比
	component2: '', // 结石成分二
	component2Percent: '', // 成分二百分比
	component3: '', // 结石成分三
	component3Percent: '', // 成分三百分比
	component4: '', // 结石成分四
	component4Percent: '' // 成分四百分比
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

		// ////console.log(
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

			////console.log('查询到患者基本信息bbbbbbbbbbbbbbbbbbb:', patientSwlInfo);
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
			treatmentTime: ' ',
			component1: ' ',
			component1Percent: ' ',
			component2: ' ',
			component2Percent: ' ',
			component3: ' ',
			component3Percent: ' ',
			component4: ' ',
			component4Percent: ' '
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
				const records = await service.swl.near.page({
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

					// 询问用户是否要新增近期随访记录
					ElMessageBox.confirm('是否新增新的近期随访记录？', '提示', {
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
				ElMessage.error('查询近期随访记录失败');
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
			minWidth: 100,
			value: patientSwlInfo.name
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
			label: '序号',
			prop: 'sequenceNo',
			minWidth: 60
		},
		{
			label: '期数',
			prop: 'episode',
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
			label: '术后天数',
			prop: 'postopDays',
			minWidth: 100
		},
		{
			label: '门诊号',
			prop: 'outpatientNo',
			minWidth: 100
		},
		{
			label: '住院号',
			prop: 'hospitalNo',
			minWidth: 100
		},
		{
			label: '床号',
			prop: 'bedNo',
			minWidth: 60
		},
		{
			label: '疗效评定',
			prop: 'effectAssessment',
			minWidth: 120
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
		const observer = new MutationObserver(() => {
			const items = document.querySelectorAll('.el-form-item--label-top');
			items.forEach(item => ((item as HTMLElement).style.marginBottom = '10px'));
		});
		observer.observe(document.body, { subtree: true, childList: true });
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
					const records = await service.swl.near.page({
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
							component1: patientSwlInfo.component1 || selection[0]?.component1,
							component1Percent:
								patientSwlInfo.component1Percent || selection[0]?.component1Percent,
							component2: patientSwlInfo.component2 || selection[0]?.component2,
							component2Percent:
								patientSwlInfo.component2Percent || selection[0]?.component2Percent,
							component3: patientSwlInfo.component3 || selection[0]?.component3,
							component3Percent:
								patientSwlInfo.component3Percent || selection[0]?.component3Percent,
							component4: patientSwlInfo.component4 || selection[0]?.component4,
							component4Percent:
								patientSwlInfo.component4Percent || selection[0]?.component4Percent,
							followupDate: dayjs().format('YYYY-MM-DD'),
							// 术后天数为治疗日期到随访日期的天数
							postopDays: dayjs().diff(dayjs(patientSwlInfo.treatmentTime), 'day')
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
		////console.log('表单已打开，模式:', Upsert.value?.mode, '数据:', data);

		// 判断当前模式
		if (Upsert.value?.mode === 'update' || Upsert.value?.mode === 'info') {
			// 处理其他症状数据，用于多选框显示
			data.qtzzOptions = formatQtzz(data);

			// 处理并发症数据，用于多选框显示
			data.bfzOptions = formatBfz(data);
		} else if (Upsert.value?.mode === 'add') {
			// 新增模式下，确保其他症状和并发症数据为空数组
			data.qtzzOptions = [];
			data.bfzOptions = [];
		}
	},

	// 提交表单钩子
	onSubmit(data, { next, done, close }) {
		//console.log('提交数据开始。。。。。。。。。。。。。。。。。。。：', data.id);

		// 确保编辑时id存在
		if (Upsert.value?.mode === 'update' && !data.id) {
			ElMessage.error('无法更新记录：缺少ID');
			done();
			return;
		}
		// 处理其他症状数据 - 从多选框数组转为单独的字段
		const qtzzOptions = data.qtzzOptions || [];
		const qtzzData = {
			fever: qtzzOptions.includes('fever') ? 1 : 0,
			nausea: qtzzOptions.includes('nausea') ? 1 : 0,
			vomiting: qtzzOptions.includes('vomiting') ? 1 : 0,
			skinEcchymosis: qtzzOptions.includes('skinEcchymosis') ? 1 : 0
		};

		// 处理并发症数据 - 从多选框数组转为单独的字段
		const bfzOptions = data.bfzOptions || [];
		const bfzData = {
			subcapsularHematoma: bfzOptions.includes('subcapsularHematoma') ? 1 : 0,
			renalHemorrhage: bfzOptions.includes('renalHemorrhage') ? 1 : 0,
			infection: bfzOptions.includes('infection') ? 1 : 0,
			renalColic: bfzOptions.includes('renalColic') ? 1 : 0,
			renalFailure: bfzOptions.includes('renalFailure') ? 1 : 0
		};
		// 创建最终提交的数据对象 - 合并原数据和不良反应数据
		const submitData = {
			...data,
			...qtzzData,
			...bfzData,
			//确保id，swlNo，serialNumber，sequenceNo，episode有值
			id: data.id,
			swlNo: data.swlNo,
			serialNumber: data.serialNumber,
			sequenceNo: data.sequenceNo,
			episode: data.episode,
			followupCount: data.followupCount
		};

		// 删除多选数组，避免后端存储问题
		delete submitData.qtzzOptions;
		delete submitData.bfzOptions;
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
			span: 3,
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
			span: 3,
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
			label: '期数',
			prop: 'episode',
			span: 3,
			component: {
				name: 'el-input-number',
				props: {
					min: 1
				}
			}
		},
		{
			label: '次数',
			prop: 'followupCount',
			span: 3,
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
			label: '术后天数',
			prop: 'postopDays',
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
			label: '末期肉眼血尿',
			prop: 'grossHematuria',
			span: 6,
			value: '无',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择末期肉眼血尿',
					options: dict.get('near_hematuria'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '腰腹痛',
			prop: 'flankPainLevel',
			span: 6,
			value: '无',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择腰腹痛程度',
					options: dict.get('near_lumbago'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '其他症状',
			prop: 'qtzzOptions',
			span: 12,
			component: {
				name: 'el-checkbox-group',
				options: qtzzOptions
			}
		},
		{
			label: '并发症',
			prop: 'bfzOptions',
			span: 12,
			component: {
				name: 'el-checkbox-group',
				options: bfzOptions
			}
		},
		{
			label: '石街类型',
			prop: 'steinstrasseType',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择石街类型',
					options: dict.get('near_syndromesx'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '石街长度',
			prop: 'steinstrasseLength',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					style: {
						height: '28px',
						//上边距，有效
						marginTop: '0px',
						//下边距，有效
						marginBottom: '0px'
					}
				}
			}
		},
		{
			label: '排石时间',
			prop: 'stonePassDays',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					placeholder: '请输入排石时间',
					style: {
						height: '28px',
						//上边距，有效
						marginTop: '0px',
						//下边距，有效
						marginBottom: '0px'
					}
				}
			}
		},
		{
			label: '排石量',
			prop: 'stoneOutputLevel',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择排石量',
					options: dict.get('near_eductionsum'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					allowCreate: true
				}
			}
		},
		{
			label: '内科辅助治疗',
			prop: 'medicalTherapy',
			span: 8,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择内科辅助治疗',
					options: dict.get('near_assistcure1'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					allowCreate: true
				}
			}
		},
		{
			label: 'SWL前治疗性辅助治疗',
			prop: 'preSWLTherapy',
			span: 8,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择SWL前治疗性辅助治疗',
					options: dict.get('near_SWLassistcuring'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					allowCreate: true
				}
			}
		},
		{
			label: 'SWL后治疗性辅助治疗',
			prop: 'postSWLTherapy',
			span: 8,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择SWL后治疗性辅助治疗',
					options: dict.get('near_SWLassistcuring'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					allowCreate: true
				}
			}
		},
		{
			label: 'SWL后补助性辅助治疗',
			prop: 'postSWLSupport',
			span: 8,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择SWL后补助性辅助治疗',
					options: dict.get('near_SWLAfterAssistcure'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					allowCreate: true
				}
			}
		},
		{
			label: '结石成分(1)',
			prop: 'component1',
			span: 3,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择成分',
					options: dict.get('near_compose'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '',
			prop: 'component1Percent',
			span: 3,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					style: {
						height: '28px',
						//上边距，有效
						marginTop: '0px',
						//下边距，有效
						marginBottom: '0px'
					}
				},
				slots: {
					append: () => {
						return '%';
					}
				}
			}
		},
		{
			label: '(2)',
			prop: 'component2',
			span: 3,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择成分',
					options: dict.get('near_compose'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '',
			prop: 'component2Percent',
			span: 3,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					style: {
						height: '28px',
						//上边距，有效
						marginTop: '0px',
						//下边距，有效
						marginBottom: '0px'
					}
				},
				slots: {
					append: () => {
						return '%';
					}
				}
			}
		},
		{
			label: '(3)',
			prop: 'component3',
			span: 3,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择成分',
					options: dict.get('near_compose'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '',
			prop: 'component3Percent',
			span: 3,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					style: {
						height: '28px',
						//上边距，有效
						marginTop: '0px',
						//下边距，有效
						marginBottom: '0px'
					}
				},
				slots: {
					append: () => {
						return '%';
					}
				}
			}
		},
		{
			label: '(4)',
			prop: 'component4',
			span: 3,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择成分',
					options: dict.get('near_compose'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '',
			prop: 'component4Percent',
			span: 3,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					style: {
						height: '28px',
						//上边距，有效
						marginTop: '0px',
						//下边距，有效
						marginBottom: '0px'
					}
				},
				slots: {
					append: () => {
						return '%';
					}
				}
			}
		},
		{
			label: '术后抗生素使用',
			prop: 'antibioticsUsed',
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
			label: '抗生素备注',
			prop: 'antibioticsNote',
			span: 9,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					style: {
						height: '28px',
						//上边距，有效
						marginTop: '0px',
						//下边距，有效
						marginBottom: '0px'
					}
				}
			}
		},
		{
			label: '成分分析方法',
			prop: 'analysisMethod',
			span: 6,
			value: '红外光谱法',
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择成分分析方法',
					options: dict.get('near_analyse2'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '疗效',
			prop: 'effectiveness',
			span: 6,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择疗效',
					options: dict.get('near_result'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					required: true
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
					type: 'textarea',
					rows: 3
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
					type: 'textarea',
					rows: 3
				}
			}
		},
		{
			label: '其他检查结果',
			prop: 'otherFinding',
			span: 8,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3
				}
			}
		}
	]
});

// 打印功能
const handlePrint = () => {
	ElMessage.info('打印功能尚未实现');
};

// 打印健康教育处方
const handlePrintHealth = () => {
	ElMessage.info('打印健康教育处方功能尚未实现');
};
</script>

<style lang="scss" scoped>
.near-info {
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

.near-descriptions {
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
</style>
