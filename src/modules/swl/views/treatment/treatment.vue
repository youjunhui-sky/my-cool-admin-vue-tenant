<template>
	<cl-crud ref="Crud">
		<p hidden>id: {{ swlId }}</p>
		<p hidden>swlNo: {{ swlNo }}</p>
		<p hidden>serialNumber: {{ serialNumber }}</p>
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex>
				<el-button type="primary" @click="handlePrintHealth">打印健康教育处方</el-button>
			</cl-flex>
			<cl-flex>
				<el-button type="primary" @click="handlePrintTreatment">打印治疗记录</el-button>
			</cl-flex>

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
						<el-descriptions border :column="5" class="treatment-descriptions">
							<el-descriptions-item label="部位一">
								<span
									v-if="
										scope.row.position1 === '0' ||
										scope.row.position1 === 0 ||
										scope.row.position1 === '左'
									"
									>左</span
								>
								<span
									v-if="
										scope.row.position1 === '1' ||
										scope.row.position1 === 1 ||
										scope.row.position1 === '右'
									"
									>右</span
								>
							</el-descriptions-item>
							<el-descriptions-item label="位置">
								{{ scope.row.location1 }}
							</el-descriptions-item>
							<el-descriptions-item label="治疗深度">
								{{ scope.row.depth1 }}
							</el-descriptions-item>
							<el-descriptions-item label="大小">
								{{ scope.row.stoneSizeFront1
								}}{{
									scope.row.stoneSizeFront1 && scope.row.stoneSizeBack1
										? ' X '
										: ' '
								}}{{ scope.row.stoneSizeBack1 }}
							</el-descriptions-item>
							<el-descriptions-item label="表面积">
								{{ scope.row.stoneArea1 }}
							</el-descriptions-item>
							<el-descriptions-item label="部位二">
								<span
									v-if="
										scope.row.position2 === '0' ||
										scope.row.position2 === 0 ||
										scope.row.position2 === '左'
									"
									>左</span
								>
								<span
									v-if="
										scope.row.position2 === '1' ||
										scope.row.position2 === 1 ||
										scope.row.position2 === '右'
									"
									>右</span
								>
							</el-descriptions-item>
							<el-descriptions-item label="位置">
								{{ scope.row.location2 }}
							</el-descriptions-item>
							<el-descriptions-item label="治疗深度">
								{{ scope.row.depth2 }}
							</el-descriptions-item>
							<el-descriptions-item label="大小">
								{{ scope.row.stoneSizeFront2
								}}{{
									scope.row.stoneSizeFront2 && scope.row.stoneSizeBack2
										? ' X '
										: ' '
								}}{{ scope.row.stoneSizeBack2 }}
							</el-descriptions-item>
							<el-descriptions-item label="表面积">
								{{ scope.row.stoneArea2 }}
							</el-descriptions-item>
							<el-descriptions-item label="受治疗结石数目">
								{{ scope.row.stoneCount }}
							</el-descriptions-item>
							<el-descriptions-item label="术前辅助治疗">
								{{ scope.row.preopTherapy }}
							</el-descriptions-item>
							<el-descriptions-item label="术前准备措施">
								{{ scope.row.preopPreparation }}
							</el-descriptions-item>
							<el-descriptions-item label="支架管类型">
								{{ scope.row.stentType }}
							</el-descriptions-item>
							<el-descriptions-item label="主要机型">
								{{ scope.row.machine1 }}
							</el-descriptions-item>
							<el-descriptions-item label="辅助机型">
								{{ scope.row.machine2 }}
							</el-descriptions-item>
							<el-descriptions-item label="治疗体位">
								{{ scope.row.bodyPosition }}
							</el-descriptions-item>
							<el-descriptions-item label="定位方式">
								{{ scope.row.targetingMethod }}
							</el-descriptions-item>
							<el-descriptions-item label="电压">
								{{ scope.row.voltage }}
							</el-descriptions-item>
							<el-descriptions-item label="冲击次数">
								{{ scope.row.shockwaveCount }}
							</el-descriptions-item>
							<el-descriptions-item label="透视K值">
								{{ scope.row.fluoroscopyKV }}
							</el-descriptions-item>
							<el-descriptions-item label="脉冲频率">
								{{ scope.row.pulseRate }}
							</el-descriptions-item>
							<el-descriptions-item label="结石反应">
								{{ scope.row.stoneResponse }}
							</el-descriptions-item>
							<el-descriptions-item label="Ma值">
								{{ scope.row.maValue }}
							</el-descriptions-item>
							<el-descriptions-item label="不良反应">
								<el-tag
									v-if="
										scope.row.noAdverseReaction === '0' ||
										scope.row.noAdverseReaction === 0
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="皮肤渗血或瘀斑">
								<el-tag
									v-if="
										scope.row.hasSkinBleeding === '1' ||
										scope.row.hasSkinBleeding === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="恶心呕吐">
								<el-tag
									v-if="scope.row.hasNausea === '1' || scope.row.hasNausea === 1"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="放射痛">
								<el-tag
									v-if="
										scope.row.hasRadiationPain === '1' ||
										scope.row.hasRadiationPain === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="其他不良反应">
								<el-tag
									v-if="
										scope.row.otherAdverseReaction === '1' ||
										scope.row.otherAdverseReaction === 1
									"
									type="danger"
									>有</el-tag
								>
								<el-tag v-else type="success">无</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="疼痛指数">
								{{ scope.row.painScore }}
							</el-descriptions-item>
							<el-descriptions-item label="术中处理措施">
								{{ scope.row.intraopManagement }}
							</el-descriptions-item>
							<el-descriptions-item label="主治医生">
								{{ scope.row.doctor }}
							</el-descriptions-item>
							<el-descriptions-item label="治疗费用">
								{{ scope.row.treatmentCost }}
							</el-descriptions-item>
							<el-descriptions-item label="治疗时间">
								{{ scope.row.treatmentTime }}
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
				<doctor-select v-model="scope.doctor" />
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script setup lang="ts">
import { useCrud, useUpsert, useTable } from '@cool-vue/crud';
import { router, useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plugins } from '/#/crud';
import { useBase } from '/@/modules/base';
import { onMounted, reactive, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { usePatient } from '/@/modules/patient';
import { host } from '/@/config';

// 导入URL工具函数
import { formatImageUrl, cleanImageUrlForSubmit } from '/@/modules/base/utils/url';
// 组件设置
const cool = useCool();
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

// 页面数据和状态
const pageData = reactive({
	loading: false,
	hasRecords: false,
	maxEpisode: 0
});

// 静态配置和选项
const options = reactive({
	position: [
		{ label: '左', value: 0, type: 'default' },
		{ label: '右', value: 1, type: 'success' }
	],
	gender: [
		{ label: '男', value: 1, type: 'success' },
		{ label: '女', value: 2, type: 'danger' },
		{ label: '未知', value: 0, type: 'default' }
	]
});

// 不良反应选项
const blfyOptions = [
	{ label: '无', value: 'noAdverseReaction' },
	{ label: '皮肤渗血或瘀斑', value: 'hasSkinBleeding' },
	{ label: '恶心', value: 'hasNausea' },
	{ label: '放射痛', value: 'hasRadiationPain' },
	{ label: '其他', value: 'otherAdverseReaction' }
];

// 格式化不良反应数据
const formatAdverseReactions = (data: any) => {
	const reactions: string[] = [];
	if (data && typeof data === 'object') {
		if (Number(data.noAdverseReaction) === 1) reactions.push('noAdverseReaction');
		if (Number(data.hasSkinBleeding) === 1) reactions.push('hasSkinBleeding');
		if (Number(data.hasNausea) === 1) reactions.push('hasNausea');
		if (Number(data.hasRadiationPain) === 1) reactions.push('hasRadiationPain');
		if (Number(data.otherAdverseReaction) === 1) reactions.push('otherAdverseReaction');
	}
	return reactions;
};

/**
 * 第一步：crud配置
 * page:后端重写page方法，用于查询治疗记录，需包含SWL登记信息
 * info:后端重写info方法，用于查询治疗记录详情，需包含SWL登记信息
 */
const Crud = useCrud(
	{
		service: service.swl.treatment
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
 * 第二步：填写治疗记录的前置信息：
 * 查询病人SWL登记信息，用于新增时初始化治疗记录form
 */
const patientSwlInfo = reactive({
	swlId: '', // swlId
	swlNo: '', // 碎石号
	serialNumber: '', // 就诊流水号
	name: '', // 姓名
	gender: '', // 性别
	age: '', // 年龄
	sequenceNo: 1, // 序列号
	episode: 1, // 期数
	nativeProvince: '', // 籍贯省
	nativeCity: '', // 籍贯市
	currentProvince: '', // 现住址省
	currentCity: '', // 现住址市
	height: '', // 身高
	weight: '', // 体重
	bmi: '', // BMI
	visitDate: '', // 就诊日期
	outpatientNo: '', // 门诊号
	inpatientNo: '', // 住院号
	bedNo: '' // 床号
});

// 查询病人SWL登记信息
const querySwl = async () => {
	try {
		const params = { id: swlId };
		const data = await service.swl.info.info(params);
		if (data) {
			////console.log('查询到患者基本信息:', data);
			// 将查询到的数据赋值给患者信息对象
			Object.assign(patientSwlInfo, data);
			return data;
		}
		return null;
	} catch (error) {
		console.error('获取患者信息失败', error);
		// 错误时也使用空格确保内容显示
		Object.assign(patientSwlInfo, {
			swlId: ' ',
			swlNo: ' ',
			serialNumber: ' ',
			name: ' ',
			gender: ' ',
			age: ' ',
			sequenceNo: 1,
			episode: 1,
			visitDate: ' ',
			outpatientNo: ' ',
			inpatientNo: ' ',
			bedNo: ' '
		});
	}
};

/**
 * 第三步：页面初始化
 * url参数：swlNo,serialNumber有值时，table初始化该患者治疗记录
 * 无url参数时，table初始化所有患者治疗记录
 */
const initPage = async () => {
	pageData.loading = true;

	try {
		// 查询患者基本信息
		if (swlId) {
			await querySwl();
		}

		// 如果有swlNo和serialNumber，检查是否有记录
		if (swlNo && serialNumber) {
			try {
				const records = await service.swl.treatment.page({
					swlNo,
					serialNumber,
					page: 1,
					size: 999
				});

				if (records && records.list && records.list.length > 0) {
					pageData.hasRecords = true;
					const maxEpisode = records.list.reduce((max, item) => {
						const episodeNum = parseInt(item.episode) || 0;
						return episodeNum > max ? episodeNum : max;
					}, 0);
					pageData.maxEpisode = maxEpisode;
					// 使用统一的刷新参数
					Crud.value?.refresh(buildRefreshParams());
				} else {
					pageData.hasRecords = false;
					ElMessageBox.confirm('是否新增新的治疗记录？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
						.then(() => {
							Crud.value?.rowAdd();
						})
						.catch(() => {
							// 使用统一的刷新参数
							Crud.value?.refresh(buildRefreshParams());
						});
				}
			} catch (error) {
				console.error('查询治疗记录失败', error);
				ElMessage.error('查询治疗记录失败');
				pageData.hasRecords = false;
				// 使用统一的刷新参数
				Crud.value?.refresh(buildRefreshParams());
			}
		} else {
			// 使用统一的刷新参数
			Crud.value?.refresh(buildRefreshParams());
		}
	} catch (error) {
		console.error('页面初始化失败', error);
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
			fixed: true, // 固定选择列
			minWidth: 60
		},
		{
			label: '碎石号',
			prop: 'swlNo',
			fixed: true, // 固定选择列
			minWidth: 100
		},
		{
			label: '就诊流水号',
			prop: 'serialNumber',
			hidden: true,
			minWidth: 100
		},
		{
			label: '姓名',
			prop: 'name',
			fixed: true, // 固定选择列
			minWidth: 80
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
			label: '序列号',
			prop: 'sequenceNo',
			minWidth: 60
		},
		{
			label: '期数',
			prop: 'episode',
			minWidth: 50
		},
		{
			label: '术前诊断',
			prop: 'preopDiagnosis',
			showOverflowTooltip: true,
			//鼠标悬停显示
			tooltip: true,
			minWidth: 260
		},
		{
			label: '就诊日期',
			prop: 'visitDate',
			formatter: (row: any) => {
				return row.visitDate?.split(' ')[0] || '';
			},
			minWidth: 100
		},
		{
			label: '治疗日期',
			prop: 'treatmentTime',
			formatter: (row: any) => {
				return row.treatmentTime?.split(' ')[0] || '';
			},
			showOverflowTooltip: true,
			minWidth: 100
		},
		{
			label: '门诊号',
			prop: 'outpatientNo',
			showOverflowTooltip: true,
			minWidth: 100
		},
		{
			label: '住院号',
			prop: 'inpatientNo',
			showOverflowTooltip: true,
			minWidth: 100
		},
		{
			label: '床号',
			prop: 'bedNo',
			minWidth: 50
		},
		{
			label: '医生',
			prop: 'doctor',
			minWidth: 80
		},
		{
			label: '治疗费用',
			prop: 'treatmentCost',
			minWidth: 80
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
 * url参数：swlNo,serialNumber有值时，新增模式，当前最大期数+1
 * 无url参数时，新增模式，获取勾选患者治疗记录，当前最大期数+1
 */
/**
 * 获取诊断信息并设置到术前诊断字段
 */
const getDiagnosis = async () => {
	try {
		// 获取当前表单数据
		const form = Upsert.value?.form;
		if (!form) {
			ElMessage.error('表单数据未初始化');
			return;
		}

		// 获取swlNo和serialNumber
		const currentSwlNo = form.swlNo;
		const currentSerialNumber = form.serialNumber;

		if (!currentSwlNo || !currentSerialNumber) {
			ElMessage.error('缺少患者信息，请先保存基本信息');
			return;
		}

		// 调用诊断服务获取诊断信息
		const params = {
			swlNo: currentSwlNo,
			serialNumber: currentSerialNumber
		};

		const diagnosisData = await service.swl.diagnosis.findDiagnosisBySwlno(params);

		if (diagnosisData && diagnosisData.diagnosisCode) {
			// 将诊断信息设置到术前诊断字段
			form.preopDiagnosis = diagnosisData.diagnosisCode;
			ElMessage.success('诊断信息获取成功');
		} else {
			ElMessage.warning('未找到该患者的诊断信息');
		}
	} catch (error: any) {
		console.error('获取诊断信息失败:', error);
		ElMessage.error('获取诊断信息失败: ' + (error.message || '未知错误'));
	}
};

const Upsert = useUpsert({
	dialog: {
		width: '70%',
		top: '2%',
		padding: '10px 30px 10px 30px'
	},
	async onOpen() {
		// 如果框架渲染延迟，用 MutationObserver 监听
		const observer = new MutationObserver(() => {
			const items = document.querySelectorAll('.el-form-item--label-top');
			items.forEach(item => ((item as HTMLElement).style.marginBottom = '10px'));
		});
		observer.observe(document.body, { subtree: true, childList: true });

		// 新增模式下预填数据
		if (Upsert.value?.mode === 'add') {
			try {
				let currentSwlNo = '';
				let currentSerialNumber = '';
				let selection: any[] = [];

				// 确定当前使用的 swlNo 和 serialNumber
				if (swlNo && serialNumber) {
					currentSwlNo = swlNo as string;
					currentSerialNumber = serialNumber as string;
				} else {
					// 如果没有URL参数，检查表格选中行
					selection = Table.value?.getSelectionRows() || [];
					if (selection.length === 1) {
						currentSwlNo = selection[0].swlNo as string;
						currentSerialNumber = selection[0].serialNumber as string;
					}
				}

				// 如果有 swlNo 和 serialNumber，查询最大期数
				if (currentSwlNo && currentSerialNumber) {
					const records = await service.swl.treatment.page({
						swlNo: currentSwlNo,
						serialNumber: currentSerialNumber,
						page: 1,
						size: 999
					});

					// 计算最大期数
					let maxEpisode = 0;
					if (records && records.list && records.list.length > 0) {
						maxEpisode = records.list.reduce((max, item) => {
							const episodeNum = parseInt(item.episode) || 0;
							return episodeNum > max ? episodeNum : max;
						}, 0);
					}

					// 设置表单数据
					if (Upsert.value?.form) {
						const defaultData = {
							swlNo: currentSwlNo,
							serialNumber: currentSerialNumber,
							name: patientSwlInfo.name || selection?.[0]?.name,
							gender: patientSwlInfo.gender || selection?.[0]?.gender,
							age: patientSwlInfo.age || selection?.[0]?.age,
							sequenceNo: patientSwlInfo.sequenceNo || selection?.[0]?.sequenceNo,
							episode: maxEpisode + 1,
							visitDate: patientSwlInfo.visitDate || selection?.[0]?.visitDate,
							outpatientNo:
								patientSwlInfo.outpatientNo || selection?.[0]?.outpatientNo,
							inpatientNo: patientSwlInfo.inpatientNo || selection?.[0]?.inpatientNo,
							bedNo: patientSwlInfo.bedNo || selection?.[0]?.bedNo,
							treatmentTime: dayjs().format('YYYY-MM-DD'),
							doctor: user.info?.name,
							treatmentCost: 665
						};

						Object.assign(Upsert.value.form, defaultData);
					}
				}
			} catch (error) {
				console.error('获取最大期数失败', error);
				ElMessage.error('获取期数信息失败');
			}
		}

		// 设置默认费用值
		if (Upsert.value?.form) {
			Upsert.value.form.treatmentCost = await getDefaultFee('treatmentCost');
		}
	},

	// 表单打开后，初始化计算
	onOpened(data) {
		// 打印日志
		//console.log('表单已打开，模式:', Upsert.value?.mode, '数据:', data);

		// 判断当前模式
		if (Upsert.value?.mode === 'update' || Upsert.value?.mode === 'info') {
			// 编辑或查看模式：优先使用已有的值，仅在没有值的情况下计算
			// 结石1区域面积
			if (!data.stoneArea1 && data.stoneSizeFront1 && data.stoneSizeBack1) {
				updateStoneArea1(data);
			}

			// 结石2区域面积
			if (!data.stoneArea2 && data.stoneSizeFront2 && data.stoneSizeBack2) {
				updateStoneArea2(data);
			}
			// 处理不良反应数据，用于多选框显示
			data.blfyOptions = formatAdverseReactions(data);
			//console.log('编辑模式：初始化不良反应选项', data.blfyOptions);
		} else if (Upsert.value?.mode === 'add') {
			// 新增模式：初始化一些默认值
			data.treatmentCost = data.treatmentCost || 665; // 默认治疗费用

			// 直接计算面积
			updateStoneArea1(data);
			updateStoneArea2(data);

			// 新增模式下，确保blfyOptions为空数组
			data.blfyOptions = [];
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
		// 处理不良反应数据 - 从多选框数组转为单独的字段
		const blfyOptions = data.blfyOptions || [];
		const blfyData = {
			noAdverseReaction: blfyOptions.includes('noAdverseReaction') ? 1 : 0,
			hasSkinBleeding: blfyOptions.includes('hasSkinBleeding') ? 1 : 0,
			hasNausea: blfyOptions.includes('hasNausea') ? 1 : 0,
			hasRadiationPain: blfyOptions.includes('hasRadiationPain') ? 1 : 0,
			otherAdverseReaction: blfyOptions.includes('otherAdverseReaction') ? 1 : 0
		};

		// 如果有任何其他不良反应被选中，确保"无不良反应"为0
		if (
			blfyData.hasSkinBleeding === 1 ||
			blfyData.hasNausea === 1 ||
			blfyData.hasRadiationPain === 1 ||
			blfyData.otherAdverseReaction === 1
		) {
			blfyData.noAdverseReaction = 0;
		}

		// 创建最终提交的数据对象 - 合并原数据和不良反应数据
		const submitData = {
			...data,
			...blfyData,
			//确保id，swlNo，serialNumber，sequenceNo，episode有值
			id: data.id,
			swlNo: data.swlNo,
			serialNumber: data.serialNumber,
			sequenceNo: data.sequenceNo,
			episode: data.episode
		};

		// 删除多选数组，避免后端存储问题
		delete submitData.blfyOptions;

		// 继续正常提交流程
		next(submitData);
	},

	// 表单关闭后钩子
	onClosed() {
		//console.log('表单已关闭');
		// 使用统一的刷新参数
		Crud.value?.refresh(buildRefreshParams());
	},

	plugins: [Plugins.Form.setFocus('')],

	items: [
		// 隐藏id,upsert不能使用hidden,否则会获取不到id【重点】
		// {
		// 	label: 'id',
		// 	prop: 'id',
		// 	component: {
		// 		name: 'el-input',
		// 		props: {
		// 			disabled: true
		// 		}
		// 	}
		// },
		// {
		// 	label: '就诊流水号',
		// 	prop: 'serialNumber',
		// 	span: 4,
		// 	hidden: true,
		// 	component: {
		// 		name: 'el-input',
		// 		props: {
		// 			clearable: true,
		// 			placeholder: '请输入就诊流水号',
		// 			disabled: true
		// 		}
		// 	}
		// },
		{
			label: '碎石号:',
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
			label: '门诊号',
			prop: 'outpatientNo',
			span: 4,
			hidden: true,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '住院号',
			prop: 'inpatientNo',
			span: 4,
			hidden: true,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '床号',
			prop: 'bedNo',
			span: 4,
			hidden: true,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '就诊日期',
			prop: 'visitDate',
			span: 4,
			hidden: true,
			component: {
				name: 'el-date-picker',
				props: {
					type: 'datetime',
					valueFormat: 'YYYY-MM-DD HH:mm:ss'
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
					min: 1,
					disabled: true,
					readonly: true
				}
			}
		},
		{
			label: '期数',
			prop: 'episode',
			span: 4,
			component: {
				name: 'el-input-number',
				props: {
					min: 1
				}
			}
		},
		{
			label: '术前诊断',
			prop: 'preopDiagnosis',
			span: 20,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 2
				}
			}
		},
		{
			label: '',
			prop: 'findingsBtn',
			col: { span: 4 },
			component: {
				name: 'el-button',
				props: {
					type: 'primary',
					onClick: getDiagnosis
				},
				slots: {
					default: () => '获取诊断'
				}
			}
		},
		// 治疗部位一
		{
			label: '治疗部位一',
			prop: 'position1',
			span: 4,
			component: {
				name: 'el-radio-group',
				options: options.position,
				props: {
					clearable: true
				}
			},
			// 添加钩子处理值的类型转换
			hook: {
				bind(value) {
					// 如果值是"左","右"，转换为数字
					if (value === '左' || value === '右') {
						return value === '左' ? 0 : 1;
					}
					// 如果值是字符串，转换为数字
					return value !== undefined && value !== null ? Number(value) : value;
				}
			}
		},
		{
			label: '',
			prop: 'location1',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请输入位置',
					options: dict.get('medical_curepart2'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '治疗深度',
			prop: 'depth1',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				},
				slots: {
					append: () => {
						return 'cm';
					}
				}
			}
		},
		{
			label: '结石大小',
			prop: 'stoneSizeFront1',
			span: 3,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					onChange(val) {
						// 使用公共函数更新面积
						updateStoneArea1(Upsert.value?.form);
					}
				}
			}
		},
		{
			label: '',
			prop: 'multiply1', // 这个字段不需要实际存储数据
			span: 1,
			flex: true, // 不填充满
			component: {
				name: 'el-text',
				props: {
					style: 'text-align: center; margin: 0 15px; font-size: 16px;'
				},
				slots: {
					default: () => {
						return 'X';
					}
				}
			}
		},
		{
			label: '',
			prop: 'stoneSizeBack1',
			span: 3,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					onChange(val) {
						// 使用公共函数更新面积
						updateStoneArea1(Upsert.value?.form);
					}
				}
			}
		},
		{
			label: '',
			prop: 'multiply1', // 这个字段不需要实际存储数据
			span: 1,
			flex: true, // 不填充满
			component: {
				name: 'el-text',
				props: {
					style: 'text-align: center; margin: 0 15px; font-size: 16px;'
				},
				slots: {
					default: () => {
						return 'S';
					}
				}
			}
		},
		{
			label: '',
			prop: 'stoneArea1',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		// 治疗部位二
		{
			label: '治疗部位二',
			prop: 'position2',
			span: 4,
			component: {
				name: 'el-radio-group',
				options: options.position,
				props: {
					clearable: true
				}
			},
			// 添加钩子处理值的类型转换
			hook: {
				bind(value) {
					// 如果值是字符串，转换为数字
					return value !== undefined && value !== null ? Number(value) : value;
				}
			}
		},
		{
			label: ' ',
			prop: 'location2',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请输入位置',
					options: dict.get('medical_curepart2'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '治疗深度',
			prop: 'depth2',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				},
				slots: {
					append: () => {
						return 'cm';
					}
				}
			}
		},
		{
			label: '结石大小',
			prop: 'stoneSizeFront2',
			span: 3,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					onChange(val) {
						// 使用公共函数更新面积
						updateStoneArea2(Upsert.value?.form);
					}
				}
			}
		},
		{
			label: '',
			prop: 'multiply1', // 这个字段不需要实际存储数据
			span: 1,
			flex: true, // 不填充满
			component: {
				name: 'el-text',
				props: {
					style: 'text-align: center; margin: 0 15px; font-size: 16px;'
				},
				slots: {
					default: () => {
						return 'X';
					}
				}
			}
		},
		{
			label: '',
			prop: 'stoneSizeBack2',
			span: 3,
			component: {
				name: 'el-input',
				props: {
					clearable: true,
					onChange(val) {
						// 使用公共函数更新面积
						updateStoneArea2(Upsert.value?.form);
					}
				}
			}
		},
		{
			label: '',
			prop: 'multiply1', // 这个字段不需要实际存储数据
			span: 1,
			flex: true, // 不填充满
			component: {
				name: 'el-text',
				props: {
					style: 'text-align: center; margin: 0 15px; font-size: 16px;'
				},
				slots: {
					default: () => {
						return 'S';
					}
				}
			}
		},
		{
			label: '',
			prop: 'stoneArea2',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '受治结石数目',
			prop: 'stoneCount',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '术前辅助治疗',
			prop: 'preopTherapy',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择术前辅助治疗',
					options: dict.get('medical_fzzl'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					allowCreate: true
				}
			}
		},
		{
			label: '术前准备',
			prop: 'preopPreparation',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择术前准备',
					options: dict.get('medical_pre'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					allowCreate: true
				}
			}
		},
		{
			label: '支架管',
			prop: 'stentType',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择支架管',
					options: dict.get('medical_bracket'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					allowCreate: true
				}
			}
		},
		{
			label: '机型',
			prop: 'machine1',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择机型',
					options: dict.get('medical_machine1'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: ' ',
			prop: 'machine2',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择机型',
					options: dict.get('medical_machine2'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '体位',
			prop: 'bodyPosition',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择体位',
					options: dict.get('medical_post'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '定位方式',
			prop: 'targetingMethod',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择定位方式',
					options: dict.get('medical_locatemeth'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '治疗电压',
			prop: 'voltage',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '冲击次数',
			prop: 'shockwaveCount',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择冲击次数',
					options: dict.get('medical_striketimes'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true,
					// 允许创建
					allowCreate: true
				}
			}
		},
		{
			label: '透视KV',
			prop: 'fluoroscopyKV',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '脉冲频率',
			prop: 'pulseRate',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				},
				slots: {
					append: () => {
						return '次/分';
					}
				}
			}
		},
		{
			label: '结石对冲击波反应',
			prop: 'stoneResponse',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择结石对冲击波反应',
					options: dict.get('medical_feedback'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: 'MA',
			prop: 'maValue',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '术中不良反应',
			prop: 'blfyOptions',
			span: 12,
			component: {
				name: 'el-checkbox-group',
				options: blfyOptions,
				props: {
					onChange(val) {
						//console.log('不良反应选择变更:', val);
						// 获取表单对象
						const form = Upsert.value?.form;
						if (!form) return;

						// 当包含"无"选项时，清除其他所有选项
						if (val.includes('noAdverseReaction')) {
							form.blfyOptions = ['noAdverseReaction'];
						}
						// 当包含其他选项时，移除"无"选项
						else if (val.length > 0 && val.includes('noAdverseReaction') === false) {
							// 如果选择了其他选项但仍包含"无"，则移除"无"
							const index = form.blfyOptions.indexOf('noAdverseReaction');
							if (index > -1) {
								form.blfyOptions.splice(index, 1);
							}
						}
					}
				}
			}
		},
		{
			label: '疼痛指数',
			prop: 'painScore',
			span: 4,
			component: {
				name: 'cl-select',
				props: {
					placeholder: '请选择疼痛指数',
					options: dict.get('medical_tengtong'),
					labelKey: 'name',
					valueKey: 'name',
					checkStrictly: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: '术中处理',
			prop: 'intraopManagement',
			span: 12,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 2
				}
			}
		},
		{
			label: '术前图像名称',
			prop: 'preopImages',
			span: 4,
			component: {
				name: 'cl-upload',
				props: {
					isSpace: true,
					size: [60, 60],
					// 是否显示上传按钮
					showUpload: true,
					// 是否显示删除按钮
					showDelete: true,
					// 是否显示预览按钮
					showPreview: true
				}
			},
			hook: {
				bind(value) {
					//console.log('image1 hook bind, 原始value:', value);
					// 使用公共方法处理图片URL
					return formatImageUrl(value);
				},
				submit(value) {
					//console.log('image1 hook submit:', value);
					// 使用公共方法处理图片URL提交
					return cleanImageUrlForSubmit(value);
				}
			}
		},
		{
			label: '术后图像名称',
			prop: 'postopImages',
			span: 5,
			component: {
				name: 'cl-upload',
				props: {
					isSpace: true,
					size: [60, 60],
					// 是否显示上传按钮
					showUpload: true,
					// 是否显示删除按钮
					showDelete: true,
					// 是否显示预览按钮
					showPreview: true
				}
			},
			hook: {
				bind(value) {
					//console.log('image1 hook bind, 原始value:', value);
					// 使用公共方法处理图片URL
					return formatImageUrl(value);
				},
				submit(value) {
					//console.log('image1 hook submit:', value);
					// 使用公共方法处理图片URL提交
					return cleanImageUrlForSubmit(value);
				}
			}
		},
		{
			label: '医生',
			prop: 'doctor',
			span: 4,
			value: user.info?.name,
			component: {
				name: 'slot-doctor'
			}
		},
		{
			label: '费用',
			prop: 'treatmentCost',
			span: 4,
			component: {
				name: 'el-input',
				props: {
					clearable: true
				}
			}
		},
		{
			label: '治疗时间',
			prop: 'treatmentTime',
			span: 4,
			value: dayjs().format('YYYY-MM-DD'),
			component: {
				name: 'el-date-picker',
				props: {
					type: 'date',
					valueFormat: 'YYYY-MM-DD'
				}
			}
		}
	]
});

async function getDefaultFee(key) {
	const res = await service.base.sys.param.data({
		key: key
	});
	//console.log('res:', res);
	return res;
}

// 打印功能
const handlePrint = () => {
	ElMessage.info('打印功能尚未实现');
};

// 打印健康教育处方
const handlePrintHealth = () => {
	// 利用路由跳转，config.ts中定义的SQBLDetail路由
	router.push({
		path: '/swl/treatment/health'
	});
};

// 打印治疗记录
const handlePrintTreatment = () => {
	// 利用路由跳转，config.ts中定义的SQBLDetail路由
	//取到勾选的行
	const selectedRows = Table.value?.getSelectionRows();
	if (selectedRows.length === 0) {
		ElMessage.error('请选择要打印的治疗记录');
		return;
	}
	router.push({
		path: '/swl/treatment/record',
		query: {
			id: selectedRows[0].id
		}
	});
};
// 格式化性别
function formatGender(gender) {
	if (gender === undefined || gender === null) return ' ';
	const genderMap = {
		'0': '未知',
		'1': '男',
		'2': '女'
	};
	return genderMap[gender] || gender;
}

// 计算结石面积
function calculateStoneArea(front, back) {
	const frontValue = parseFloat(front);
	const backValue = parseFloat(back);

	if (!isNaN(frontValue) && !isNaN(backValue)) {
		return (frontValue * backValue * 3.14 * 0.25).toFixed(2);
	}
	return '';
}

// 更新结石1区域面积
function updateStoneArea1(form) {
	if (form && form.stoneSizeFront1 && form.stoneSizeBack1) {
		form.stoneArea1 = calculateStoneArea(form.stoneSizeFront1, form.stoneSizeBack1);
	}
}

// 更新结石2区域面积
function updateStoneArea2(form) {
	if (form && form.stoneSizeFront2 && form.stoneSizeBack2) {
		form.stoneArea2 = calculateStoneArea(form.stoneSizeFront2, form.stoneSizeBack2);
	}
}
</script>

<style lang="scss" scoped>
/* el-descriptions样式 */
.treatment-descriptions {
	:deep(.el-descriptions__label) {
		text-align: left !important;
		width: 130px !important;
	}

	:deep(.el-descriptions-item__container) {
		text-align: left !important;
	}

	:deep(.el-descriptions-item__content) {
		text-align: left !important;
	}
}
</style>
