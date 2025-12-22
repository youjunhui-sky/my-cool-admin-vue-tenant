declare namespace Eps {
	interface AiRagFeedbackEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 问题
		 */
		question?: string;

		/**
		 * 答案
		 */
		answer?: string;

		/**
		 * 类型
		 */
		type?: smallint;

		/**
		 * 内容
		 */
		content?: string;

		/**
		 * 提交时间
		 */
		submitTime?: timestamp;

		/**
		 * 提交人
		 */
		submitUser?: string;

		/**
		 * 审核内容
		 */
		checkContent?: string;

		/**
		 * 审核时间
		 */
		checkTime?: timestamp;

		/**
		 * 审核人
		 */
		checkUser?: string;

		/**
		 * 审核类型
		 */
		checkType?: smallint;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface AppointmentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 预约号
		 */
		appointmentNo?: string;

		/**
		 * 年龄
		 */
		age?: string;

		/**
		 * 预约科室
		 */
		department?: string;

		/**
		 * 预约医生
		 */
		doctor?: string;

		/**
		 * 预约日期
		 */
		appointmentDate?: Date;

		/**
		 * 时间段(如09:00-10:00)
		 */
		timeSlot?: string;

		/**
		 * 状态 0-未接诊 1-已接诊
		 */
		status?: smallint;

		/**
		 * 就诊类型 1-SWL 2-代谢评估
		 */
		visitType?: smallint;

		/**
		 * SWL序列 0-原序列 1-新序列
		 */
		swlSequence?: smallint;

		/**
		 * 结石位置描述
		 */
		stoneLocation?: string;

		/**
		 * 诊疗内容摘要
		 */
		treatmentContent?: string;

		/**
		 * 操作人
		 */
		operator?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 删除时间
		 */
		deletedAt?: timestamp;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysDepartmentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 机构名称
		 */
		name?: string;

		/**
		 * 上级部门ID
		 */
		parentId?: number;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 是否机构 0-否 1-是
		 */
		isMain?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysLogEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 行为
		 */
		action?: string;

		/**
		 * ip
		 */
		ip?: string;

		/**
		 * 参数
		 */
		params?: json;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysMenuEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父菜单ID
		 */
		parentId?: number;

		/**
		 * 菜单名称
		 */
		name?: string;

		/**
		 * 菜单地址
		 */
		router?: string;

		/**
		 * 权限标识
		 */
		perms?: string;

		/**
		 * 类型 0-目录 1-菜单 2-按钮
		 */
		type?: number;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 视图地址
		 */
		viewPath?: string;

		/**
		 * 路由缓存
		 */
		keepAlive?: boolean;

		/**
		 * 是否显示
		 */
		isShow?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysParamEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 键
		 */
		keyName?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 数据类型 0-字符串 1-富文本 2-文件
		 */
		dataType?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysRoleEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 角色标签
		 */
		label?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 数据权限是否关联上下级
		 */
		relevance?: boolean;

		/**
		 * 菜单权限
		 */
		menuIdList?: json;

		/**
		 * 部门权限
		 */
		departmentIdList?: json;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysUserEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门ID
		 */
		departmentId?: number;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 密码版本, 作用是改完密码，让原来的token失效
		 */
		passwordV?: number;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 头像
		 */
		headImg?: string;

		/**
		 * 手机
		 */
		phone?: string;

		/**
		 * 邮箱
		 */
		email?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * socketId
		 */
		socketId?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoGoodsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 描述
		 */
		description?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 分类
		 */
		type?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 示例图
		 */
		exampleImages?: json;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 昵称
		 */
		userName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictAddressEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 地址编码
		 */
		code?: number;

		/**
		 * 地址名称
		 */
		name?: string;

		/**
		 * 父级ID
		 */
		parentId?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 类型 0-省 1-市 2-区
		 */
		type?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类型ID
		 */
		typeId?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 值
		 */
		value?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 父ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 标识
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface StoneComponentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 分析次数
		 */
		analysisCount?: integer;

		/**
		 * 分析日期
		 */
		analysisDate?: Date;

		/**
		 * 身高(cm)
		 */
		height?: float;

		/**
		 * 体重(kg)
		 */
		weight?: float;

		/**
		 * BMI
		 */
		bmi?: float;

		/**
		 * 结石位置描述
		 */
		stoneLocation?: string;

		/**
		 * 分析方法-字典near_analyse2
		 */
		analysisMethod?: string;

		/**
		 * 成分一-字典near_compose
		 */
		component1?: string;

		/**
		 * 成分一占比(%)
		 */
		component1Percent?: float;

		/**
		 * 成分二-字典near_compose
		 */
		component2?: string;

		/**
		 * 成分二占比(%)
		 */
		component2Percent?: float;

		/**
		 * 成分三-字典near_compose
		 */
		component3?: string;

		/**
		 * 成分三占比(%)
		 */
		component3Percent?: float;

		/**
		 * 成分四-字典near_compose
		 */
		component4?: string;

		/**
		 * 成分四占比(%)
		 */
		component4Percent?: float;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 登记人
		 */
		operator?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 年龄
		 */
		age?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MuaInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 评估次数
		 */
		assessmentCount?: integer;

		/**
		 * 门诊号
		 */
		outpatientNo?: string;

		/**
		 * 住院号
		 */
		inpatientNo?: string;

		/**
		 * 病床号
		 */
		bedNo?: string;

		/**
		 * 就诊科室
		 */
		department?: string;

		/**
		 * 年龄
		 */
		age?: string;

		/**
		 * 评估日期
		 */
		assessmentDate?: Date;

		/**
		 * 身高(cm)
		 */
		height?: float;

		/**
		 * 体重(kg)
		 */
		weight?: float;

		/**
		 * BMI指数
		 */
		bmi?: float;

		/**
		 * 结石病史
		 */
		stoneHistory?: string;

		/**
		 * 家族史
		 */
		familyHistory?: string;

		/**
		 * 其他病史
		 */
		otherHistory?: string;

		/**
		 * 是否超声 0-否 1-是
		 */
		hasUltrasound?: smallint;

		/**
		 * 是否KUB 0-否 1-是
		 */
		hasKUB?: smallint;

		/**
		 * 是否CT 0-否 1-是
		 */
		hasCT?: smallint;

		/**
		 * 是否MRI 0-否 1-是
		 */
		hasMRI?: smallint;

		/**
		 * 是否CTU 0-否 1-是
		 */
		hasCTU?: smallint;

		/**
		 * 是否IVU 0-否 1-是
		 */
		hasIVU?: smallint;

		/**
		 * 影像诊断
		 */
		imageDiagnosis?: string;

		/**
		 * 解剖异常-字典metabolic-anatomical
		 */
		anatomicalAbnormal?: string;

		/**
		 * 评估医生
		 */
		doctor?: string;

		/**
		 * 填表人
		 */
		operator?: string;

		/**
		 * CT值
		 */
		ctValue?: float;

		/**
		 * 字典--image_kub
		 */
		kub?: string;

		/**
		 * 结石成分--字典stone-comp
		 */
		stoneComp?: string;

		/**
		 * 其他结石成分
		 */
		otherStoneComp?: string;

		/**
		 * 成分一-字典near_compose
		 */
		component1?: string;

		/**
		 * 成分一占比(%)
		 */
		component1Percent?: float;

		/**
		 * 成分二-字典near_compose
		 */
		component2?: string;

		/**
		 * 成分二占比(%)
		 */
		component2Percent?: float;

		/**
		 * 成分三-字典near_compose
		 */
		component3?: string;

		/**
		 * 成分三占比(%)
		 */
		component3Percent?: float;

		/**
		 * 成分四-字典near_compose
		 */
		component4?: string;

		/**
		 * 成分四占比(%)
		 */
		component4Percent?: float;

		/**
		 * 结石位置描述
		 */
		stoneLocation?: string;

		/**
		 * 分析方法-字典near_analyse2
		 */
		analysisMethod?: string;

		/**
		 * 分析日期
		 */
		analysisDate?: Date;

		/**
		 * 删除时间
		 */
		deletedAt?: timestamp;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MuaContentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 评估次数
		 */
		assessmentCount?: integer;

		/**
		 * 评估类型
		 */
		assessmentType?: string;

		/**
		 * 评估结果
		 */
		assessmentResult?: string;

		/**
		 * 诊疗建议
		 */
		treatmentSuggestion?: string;

		/**
		 * 治疗防治建议
		 */
		guideSuggestion?: string;

		/**
		 * AI治疗防治建议
		 */
		aiGuideSuggestion?: string;

		/**
		 * 评估医生
		 */
		doctor?: string;

		/**
		 * 填表人
		 */
		operator?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MuaItemsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 评估次数
		 */
		assessmentCount?: integer;

		/**
		 * 评估类型
		 */
		assessmentType?: string;

		/**
		 * 项目类型
		 */
		itemType?: integer;

		/**
		 * 项目分组编码
		 */
		groupCode?: string;

		/**
		 * 项目分组名称
		 */
		groupName?: string;

		/**
		 * 项目编码
		 */
		itemCode?: string;

		/**
		 * 项目名称
		 */
		itemName?: string;

		/**
		 * 项目结果值
		 */
		resultValue?: string;

		/**
		 * 结果判断
		 */
		resultJudgment?: string;

		/**
		 * 结果标志
		 */
		resultFlag?: integer;

		/**
		 * 单位
		 */
		unit?: string;

		/**
		 * 检查时间
		 */
		testTime?: timestamp;

		/**
		 * 序号
		 */
		seq?: integer;

		/**
		 * 参考值
		 */
		referenceRange?: string;

		/**
		 * 参考值最小值
		 */
		referenceMin?: float;

		/**
		 * 参考值最大值
		 */
		referenceMax?: float;

		/**
		 * 报告号
		 */
		reportNo?: string;

		/**
		 * 尿类型
		 */
		urineType?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlRegisterEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 就诊科室
		 */
		department?: string;

		/**
		 * 就诊日期
		 */
		visitDate?: timestamp;

		/**
		 * 门诊号
		 */
		outpatientNo?: string;

		/**
		 * 住院号
		 */
		inpatientNo?: string;

		/**
		 * 病床号
		 */
		bedNo?: string;

		/**
		 * 年龄
		 */
		age?: string;

		/**
		 * 序列号
		 */
		sequenceNo?: integer;

		/**
		 * 期数
		 */
		episode?: integer;

		/**
		 * 身高(cm)
		 */
		height?: float;

		/**
		 * 体重(kg)
		 */
		weight?: float;

		/**
		 * BMI指数
		 */
		bmi?: float;

		/**
		 * 特殊病情/禁忌症
		 */
		specialCondition?: string;

		/**
		 * 接诊医生
		 */
		doctor?: string;

		/**
		 * 删除时间
		 */
		deletedAt?: timestamp;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlTreatmentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 序列号
		 */
		sequenceNo?: integer;

		/**
		 * 治疗期数
		 */
		episode?: integer;

		/**
		 * 术前诊断
		 */
		preopDiagnosis?: string;

		/**
		 * 部位一位置(左/右)
		 */
		position1?: string;

		/**
		 * 部位一具体位置-字典medical_curepart2
		 */
		location1?: string;

		/**
		 * 治疗深度(cm)
		 */
		depth1?: string;

		/**
		 * 结石前框大小(mm)
		 */
		stoneSizeFront1?: number;

		/**
		 * 结石后框大小(mm)
		 */
		stoneSizeBack1?: number;

		/**
		 * 结石表面积(mm²)
		 */
		stoneArea1?: number;

		/**
		 * 部位二位置(左/右)
		 */
		position2?: string;

		/**
		 * 部位二具体位置-字典medical_curepart2
		 */
		location2?: string;

		/**
		 * 治疗深度(cm)
		 */
		depth2?: string;

		/**
		 * 结石前框大小(mm)
		 */
		stoneSizeFront2?: number;

		/**
		 * 结石后框大小(mm)
		 */
		stoneSizeBack2?: number;

		/**
		 * 结石表面积(mm²)
		 */
		stoneArea2?: number;

		/**
		 * 受治疗结石数目
		 */
		stoneCount?: integer;

		/**
		 * 术前辅助治疗-字典medical_fzzl
		 */
		preopTherapy?: string;

		/**
		 * 术前准备措施-字典medical_pre
		 */
		preopPreparation?: string;

		/**
		 * 支架管类型-字典medical_bracket
		 */
		stentType?: string;

		/**
		 * 主要机型-字典medical_machine1
		 */
		machine1?: string;

		/**
		 * 辅助机型-字典medical_machine2
		 */
		machine2?: string;

		/**
		 * 治疗体位-字典medical_post)
		 */
		bodyPosition?: string;

		/**
		 * 定位方式-字典medical_locatemeth)
		 */
		targetingMethod?: string;

		/**
		 * 治疗电压(kV)
		 */
		voltage?: string;

		/**
		 * 冲击次数-字典medical_striketimes
		 */
		shockwaveCount?: string;

		/**
		 * 透视KV值
		 */
		fluoroscopyKV?: string;

		/**
		 * 脉冲频率(次/分)
		 */
		pulseRate?: string;

		/**
		 * 结石反应-字典medical_feedback
		 */
		stoneResponse?: string;

		/**
		 * MA值
		 */
		maValue?: string;

		/**
		 * 无不良反应 0-否 1-是
		 */
		noAdverseReaction?: smallint;

		/**
		 * 皮肤渗血/瘀斑 0-无 1-有
		 */
		hasSkinBleeding?: smallint;

		/**
		 * 恶心呕吐 0-无 1-有
		 */
		hasNausea?: smallint;

		/**
		 * 放射痛 0-无 1-有
		 */
		hasRadiationPain?: smallint;

		/**
		 * 其他不良反应 0-无 1-有
		 */
		otherAdverseReaction?: smallint;

		/**
		 * 疼痛指数-字典medical_tengtong
		 */
		painScore?: string;

		/**
		 * 术前影像路径
		 */
		preopImages?: string;

		/**
		 * 术后影像路径
		 */
		postopImages?: string;

		/**
		 * 术中处理措施
		 */
		intraopManagement?: string;

		/**
		 * 主治医生
		 */
		doctor?: string;

		/**
		 * 治疗费用
		 */
		treatmentCost?: number;

		/**
		 * 治疗开始时间
		 */
		treatmentTime?: Date;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlCurativeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 随访日期
		 */
		followupDate?: Date;

		/**
		 * 术后天数
		 */
		postopDays?: integer;

		/**
		 * 末期肉眼血尿-字典near_hematuria
		 */
		grossHematuria?: string;

		/**
		 * 发热 0-无 1-有
		 */
		fever?: smallint;

		/**
		 * 恶心 0-无 1-有
		 */
		nausea?: smallint;

		/**
		 * 呕吐 0-无 1-有
		 */
		vomiting?: smallint;

		/**
		 * 皮肤渗血或瘀斑 0-无 1-有
		 */
		skinEcchymosis?: smallint;

		/**
		 * 肾包膜下血肿 0-无 1-有
		 */
		subcapsularHematoma?: smallint;

		/**
		 * 肾出血 0-无 1-有
		 */
		renalHemorrhage?: smallint;

		/**
		 * 感染 0-无 1-有
		 */
		infection?: smallint;

		/**
		 * 肾绞痛 0-无 1-有
		 */
		renalColic?: smallint;

		/**
		 * 肾衰 0-无 1-有
		 */
		renalFailure?: smallint;

		/**
		 * 腰腹痛程度-字典near_lumbago
		 */
		flankPainLevel?: string;

		/**
		 * 石街类型-字典near_syndromesx
		 */
		steinstrasseType?: string;

		/**
		 * 石街长度(cm)
		 */
		steinstrasseLength?: float;

		/**
		 * 排石时间(天)
		 */
		stonePassDays?: string;

		/**
		 * 排石量评估-字典near_eductionsum
		 */
		stoneOutputLevel?: string;

		/**
		 * 内科辅助治疗-字典near_assistcure1
		 */
		medicalTherapy?: string;

		/**
		 * SWL前治疗性辅助-字典near_SWLassistcuring
		 */
		preSWLTherapy?: string;

		/**
		 * SWL后治疗性辅助-字典near_SWLassistcured
		 */
		postSWLTherapy?: string;

		/**
		 * SWL后补助性辅助-字典near_SWLAfterAssistcure
		 */
		postSWLSupport?: string;

		/**
		 * 结石成分一-字典near_compose
		 */
		component1?: string;

		/**
		 * 成分一百分比
		 */
		component1Percent?: float;

		/**
		 * 结石成分二-字典near_compose
		 */
		component2?: string;

		/**
		 * 成分二百分比
		 */
		component2Percent?: float;

		/**
		 * 结石成分三-字典near_compose
		 */
		component3?: string;

		/**
		 * 成分三百分比
		 */
		component3Percent?: float;

		/**
		 * 结石成分四-字典near_compose
		 */
		component4?: string;

		/**
		 * 成分四百分比
		 */
		component4Percent?: float;

		/**
		 * 术后抗生素使用 0-无 1-有
		 */
		antibioticsUsed?: smallint;

		/**
		 * 抗生素说明
		 */
		antibioticsNote?: string;

		/**
		 * 成分分析方法-字典near_analyse2
		 */
		analysisMethod?: string;

		/**
		 * 疗效评定-字典near_result
		 */
		effectiveness?: string;

		/**
		 * 无石 0-否 1-是
		 */
		curativeParamStoneFree?: smallint;

		/**
		 * 初震参数 0-否 1-是
		 */
		curativeParamInitialShock?: smallint;

		/**
		 * 复震参数  0-否 1-是
		 */
		curativeParamRepeatShock?: smallint;

		/**
		 * SWL前辅助治疗参数  0-否 1-是
		 */
		curativeParamPreSWL?: smallint;

		/**
		 * SWL后治疗性辅助参数  0-否 1-是
		 */
		curativeParamPostSWLTherapy?: smallint;

		/**
		 * SWL后补助性辅助参数  0-否 1-是
		 */
		curativeParamPostSWLSupport?: smallint;

		/**
		 * 痛风 0-无 1-有
		 */
		metabolicGout?: smallint;

		/**
		 * 肾小管中毒 0-无 1-有
		 */
		metabolicRTA?: smallint;

		/**
		 * 低磷血症 0-无 1-有
		 */
		metabolicHypophosphatemia?: smallint;

		/**
		 * 高草酸尿 0-无 1-有
		 */
		metabolicHyperoxaluria?: smallint;

		/**
		 * 甲旁亢 0-无 1-有
		 */
		metabolicHyperparathyroidism?: smallint;

		/**
		 * 高钠尿 0-无 1-有
		 */
		metabolicHypernatriuria?: smallint;

		/**
		 * 碱性尿 0-无 1-有
		 */
		metabolicAlkalineUrine?: smallint;

		/**
		 * 高钙尿 0-无 1-有
		 */
		metabolicHypercalciuria?: smallint;

		/**
		 * 低镁尿 0-无 1-有
		 */
		metabolicHypomagnesuria?: smallint;

		/**
		 * 高尿酸尿 0-无 1-有
		 */
		metabolicHyperuricosuria?: smallint;

		/**
		 * 低枸橼酸尿 0-无 1-有
		 */
		metabolicHypocitraturia?: smallint;

		/**
		 * 胱氨酸尿 0-无 1-有
		 */
		metabolicCystinuria?: smallint;

		/**
		 * 不明确 0-无 1-有
		 */
		metabolicUnknown?: smallint;

		/**
		 * 海绵肾 0-无 1-有
		 */
		localSpongeKidney?: smallint;

		/**
		 * 马蹄肾 0-无 1-有
		 */
		localHorseshoeKidney?: smallint;

		/**
		 * 肾囊肿 0-无 1-有
		 */
		localRenalCyst?: smallint;

		/**
		 * 重复肾 0-无 1-有
		 */
		localDuplexKidney?: smallint;

		/**
		 * BPH 0-无 1-有
		 */
		localBPH?: smallint;

		/**
		 * UPJ狭窄 0-无 1-有
		 */
		localUPJStricture?: smallint;

		/**
		 * 多囊肾 0-无 1-有
		 */
		localPolycysticKidney?: smallint;

		/**
		 * 尿道狭窄 0-无 1-有
		 */
		localUrethralStricture?: smallint;

		/**
		 * 尿道异物 0-无 1-有
		 */
		localUrethralForeignBody?: smallint;

		/**
		 * 输尿管狭窄 0-无 1-有
		 */
		localUreteralStricture?: smallint;

		/**
		 * 异位肾 0-无 1-有
		 */
		localEctopicKidney?: smallint;

		/**
		 * 膀胱憩室 0-无 1-有
		 */
		localBladderDiverticulum?: smallint;

		/**
		 * 神经源性膀胱 0-无 1-有
		 */
		localNeurogenicBladder?: smallint;

		/**
		 * 肾盏憩室 0-无 1-有
		 */
		localCalycealDiverticulum?: smallint;

		/**
		 * 输尿管囊肿 0-无 1-有
		 */
		localUreterocele?: smallint;

		/**
		 * 其他 0-无 1-有
		 */
		localOther?: smallint;

		/**
		 * B超结果描述
		 */
		usFinding?: string;

		/**
		 * KUB结果描述
		 */
		kubFinding?: string;

		/**
		 * 其他检查结果
		 */
		otherFinding?: string;

		/**
		 * 随访医生
		 */
		physician?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlCurrentHistoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 症状 0-无 1-有
		 */
		hasSymptom?: smallint;

		/**
		 * 病程(天)
		 */
		diseaseDuration?: integer;

		/**
		 * 主诉
		 */
		chiefComplaint?: string;

		/**
		 * 发热 0-无 1-有
		 */
		hasFever?: smallint;

		/**
		 * 呕吐 0-无 1-有
		 */
		hasVomit?: smallint;

		/**
		 * 恶心 0-无 1-有
		 */
		hasNausea?: smallint;

		/**
		 * 尿频 0-无 1-有
		 */
		hasFrequentUrination?: smallint;

		/**
		 * 尿急 0-无 1-有
		 */
		hasUrgentUrination?: smallint;

		/**
		 * 尿痛 0-无 1-有
		 */
		hasDysuria?: smallint;

		/**
		 * 下腹放射痛 0-无 1-有
		 */
		hasLowerAbdominalPain?: smallint;

		/**
		 * 肾绞痛部位-字典current_sjtpark
		 */
		renalColicLocation?: string;

		/**
		 * 肾绞痛特征-字典current_sjtlook
		 */
		renalColicCharacter?: string;

		/**
		 * 肾绞痛发作次数-字典current_sjttime
		 */
		renalColicCount?: string;

		/**
		 * 慢性腰痛-字典current_mxyt
		 */
		hasChronicBackache?: string;

		/**
		 * 血尿-字典current_xuen
		 */
		hasHematuria?: string;

		/**
		 * 排尿困难-字典current_painkn
		 */
		difficultyUrinating?: string;

		/**
		 * 治疗方式-字典current_curemothed
		 */
		treatment?: string;

		/**
		 * 治疗经过
		 */
		treatmentProcess?: string;

		/**
		 * 其他症状
		 */
		otherSymptoms?: string;

		/**
		 * 录入人
		 */
		operator?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlDiagnosisEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 诊断结论
		 */
		diagnosisCode?: string;

		/**
		 * 治疗方案
		 */
		treatmentPlan?: string;

		/**
		 * 诊断医生
		 */
		doctor?: string;

		/**
		 * 临床诊断时间
		 */
		diagnosisTime?: timestamp;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlImagingExamEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 是否超声 0-否 1-是
		 */
		hasUltrasound?: smallint;

		/**
		 * 是否KUB 0-否 1-是
		 */
		hasKUB?: smallint;

		/**
		 * 是否IVU 0-否 1-是
		 */
		hasIVU?: smallint;

		/**
		 * 是否CT 0-否 1-是
		 */
		hasCT?: smallint;

		/**
		 * 是否MRI 0-否 1-是
		 */
		hasMRI?: smallint;

		/**
		 * 是否CTU 0-否 1-是
		 */
		hasCTU?: smallint;

		/**
		 * CT值
		 */
		ctValue?: float;

		/**
		 * 左肾结石数量-字典image_num
		 */
		leftKidneyStoneCount?: string;

		/**
		 * 左肾第一颗结石前框(mm)
		 */
		leftKidneyStone1Front?: float;

		/**
		 * 左肾第一颗结石后框(mm)
		 */
		leftKidneyStone1Back?: float;

		/**
		 * 左肾第一颗结石表面积(mm²)
		 */
		leftKidneyStone1Area?: float;

		/**
		 * 左肾第一颗结石位置-字典image_klocition
		 */
		leftKidneyStone1Location?: string;

		/**
		 * 左肾第二颗结石前框(mm)
		 */
		leftKidneyStone2Front?: float;

		/**
		 * 左肾第二颗结石后框(mm)
		 */
		leftKidneyStone2Back?: float;

		/**
		 * 左肾第二颗结石表面积(mm²)
		 */
		leftKidneyStone2Area?: float;

		/**
		 * 左肾第二颗结石位置-字典image_klocition
		 */
		leftKidneyStone2Location?: string;

		/**
		 * 左肾结石形状-字典image_kub
		 */
		leftKidneyStoneShape?: string;

		/**
		 * 左肾结石性质-字典image_kubsize
		 */
		leftKidneyStoneNature?: string;

		/**
		 * 是否左肾轻度积水 0-否 1-是
		 */
		leftKidneyMildHydronephrosis?: smallint;

		/**
		 * 是否左肾中度积水 0-否 1-是
		 */
		leftKidneyModerateHydronephrosis?: smallint;

		/**
		 * 是否左肾肾功能损害 0-否 1-是
		 */
		leftKidneyDysfunction?: smallint;

		/**
		 * 是否左肾肾小盏扩张 0-否 1-是
		 */
		leftKidneyCalycealDilation?: smallint;

		/**
		 * 是否左肾重度积水 0-否 1-是
		 */
		leftKidneySevereHydronephrosis?: smallint;

		/**
		 * 是否左肾肾大盏扩张 0-否 1-是
		 */
		leftKidneyMajorCalyxDilation?: smallint;

		/**
		 * 是否左肾肾萎缩 0-否 1-是
		 */
		leftKidneyAtrophy?: smallint;

		/**
		 * 右肾结石数量-字典image_num
		 */
		rightKidneyStoneCount?: string;

		/**
		 * 右肾第一颗结石前框(mm)
		 */
		rightKidneyStone1Front?: float;

		/**
		 * 右肾第一颗结石后框(mm)
		 */
		rightKidneyStone1Back?: float;

		/**
		 * 右肾第一颗结石表面积(mm²)
		 */
		rightKidneyStone1Area?: float;

		/**
		 * 右肾第一颗结石位置-字典image_position
		 */
		rightKidneyStone1Location?: string;

		/**
		 * 右肾第二颗结石前框(mm)
		 */
		rightKidneyStone2Front?: float;

		/**
		 * 右肾第二颗结石后框(mm)
		 */
		rightKidneyStone2Back?: float;

		/**
		 * 右肾第二颗结石表面积(mm²)
		 */
		rightKidneyStone2Area?: float;

		/**
		 * 右肾第二颗结石位置-字典image_position
		 */
		rightKidneyStone2Location?: string;

		/**
		 * 右肾结石形状-字典image_kub
		 */
		rightKidneyStoneShape?: string;

		/**
		 * 右肾结石性质-字典image_kubsize
		 */
		rightKidneyStoneNature?: string;

		/**
		 * 是否右肾轻度积水 0-否 1-是
		 */
		rightKidneyMildHydronephrosis?: smallint;

		/**
		 * 是否右肾中度积水 0-否 1-是
		 */
		rightKidneyModerateHydronephrosis?: smallint;

		/**
		 * 是否右肾肾功能损害 0-否 1-是
		 */
		rightKidneyDysfunction?: smallint;

		/**
		 * 是否右肾肾小盏扩张 0-否 1-是
		 */
		rightKidneyCalycealDilation?: smallint;

		/**
		 * 是否右肾重度积水 0-否 1-是
		 */
		rightKidneySevereHydronephrosis?: smallint;

		/**
		 * 是否右肾肾大盏扩张 0-否 1-是
		 */
		rightKidneyMajorCalyxDilation?: smallint;

		/**
		 * 是否右肾肾萎缩 0-否 1-是
		 */
		rightKidneyAtrophy?: smallint;

		/**
		 * 左输尿管结石数量-字典image_num
		 */
		leftUreterStoneCount?: string;

		/**
		 * 左输尿管第一颗结石前框(mm)
		 */
		leftUreterStone1Front?: float;

		/**
		 * 左输尿管第一颗结石后框(mm)
		 */
		leftUreterStone1Back?: float;

		/**
		 * 左输尿管第一颗结石表面积(mm²)
		 */
		leftUreterStone1Area?: float;

		/**
		 * 左输尿管第一颗结石位置-字典image_ulocition
		 */
		leftUreterStone1Location?: string;

		/**
		 * 左输尿管第二颗结石前框(mm)
		 */
		leftUreterStone2Front?: float;

		/**
		 * 左输尿管第二颗结石后框(mm)
		 */
		leftUreterStone2Back?: float;

		/**
		 * 左输尿管第二颗结石表面积(mm²)
		 */
		leftUreterStone2Area?: float;

		/**
		 * 左输尿管第二颗结石位置-字典image_ulocition
		 */
		leftUreterStone2Location?: string;

		/**
		 * 左输尿管结石形状-字典image_kub
		 */
		leftUreterStoneShape?: string;

		/**
		 * 左输尿管结石性质-字典image_kubsize
		 */
		leftUreterStoneNature?: string;

		/**
		 * 是否左输尿管轻度积水 0-否 1-是
		 */
		leftUreterMildHydronephrosis?: smallint;

		/**
		 * 是否左输尿管中度积水 0-否 1-是
		 */
		leftUreterModerateHydronephrosis?: smallint;

		/**
		 * 是否左输尿管肾功能损害 0-否 1-是
		 */
		leftUreterDysfunction?: smallint;

		/**
		 * 是否左输尿管重度积水 0-否 1-是
		 */
		leftUreterSevereHydronephrosis?: smallint;

		/**
		 * 是否左输尿管肾萎缩 0-否 1-是
		 */
		leftUreterAtrophy?: smallint;

		/**
		 * 右输尿管结石数量-字典image_num
		 */
		rightUreterStoneCount?: string;

		/**
		 * 右输尿管第一颗结石前框(mm)
		 */
		rightUreterStone1Front?: float;

		/**
		 * 右输尿管第一颗结石后框(mm)
		 */
		rightUreterStone1Back?: float;

		/**
		 * 右输尿管第一颗结石表面积(mm²)
		 */
		rightUreterStone1Area?: float;

		/**
		 * 右输尿管第一颗结石位置-字典image_ulocition
		 */
		rightUreterStone1Location?: string;

		/**
		 * 右输尿管第二颗结石前框(mm)
		 */
		rightUreterStone2Front?: float;

		/**
		 * 右输尿管第二颗结石后框(mm)
		 */
		rightUreterStone2Back?: float;

		/**
		 * 右输尿管第二颗结石表面积(mm²)
		 */
		rightUreterStone2Area?: float;

		/**
		 * 右输尿管第二颗结石位置-字典image_ulocition
		 */
		rightUreterStone2Location?: string;

		/**
		 * 右输尿管结石形状-字典image_kub
		 */
		rightUreterStoneShape?: string;

		/**
		 * 右输尿管结石性质-字典image_kubsize
		 */
		rightUreterStoneNature?: string;

		/**
		 * 是否右输尿管轻度积水 0-否 1-是
		 */
		rightUreterMildHydronephrosis?: smallint;

		/**
		 * 是否右输尿管中度积水 0-否 1-是
		 */
		rightUreterModerateHydronephrosis?: smallint;

		/**
		 * 是否右输尿管肾功能损害 0-否 1-是
		 */
		rightUreterDysfunction?: smallint;

		/**
		 * 是否右输尿管重度积水 0-否 1-是
		 */
		rightUreterSevereHydronephrosis?: smallint;

		/**
		 * 是否右输尿管肾萎缩 0-否 1-是
		 */
		rightUreterAtrophy?: smallint;

		/**
		 * 膀胱结石数量-字典image_num
		 */
		bladderStoneCount?: string;

		/**
		 * 膀胱第一颗结石前框(mm)
		 */
		bladderStone1Front?: float;

		/**
		 * 膀胱第一颗结石后框(mm)
		 */
		bladderStone1Back?: float;

		/**
		 * 膀胱第一颗结石表面积(mm²)
		 */
		bladderStone1Area?: float;

		/**
		 * 膀胱第一颗结石位置
		 */
		bladderStone1Location?: string;

		/**
		 * 膀胱第二颗结石前框(mm)
		 */
		bladderStone2Front?: float;

		/**
		 * 膀胱第二颗结石后框(mm)
		 */
		bladderStone2Back?: float;

		/**
		 * 膀胱第二颗结石表面积(mm²)
		 */
		bladderStone2Area?: float;

		/**
		 * 膀胱第二颗结石位置
		 */
		bladderStone2Location?: string;

		/**
		 * 膀胱结石形状-字典image_kub
		 */
		bladderStoneShape?: string;

		/**
		 * 膀胱结石性质-字典image_kubsize
		 */
		bladderStoneNature?: string;

		/**
		 * 是否膀胱尿潴留 0-否 1-是
		 */
		bladderUrinaryRetention?: smallint;

		/**
		 * 尿道结石数量-字典image_num
		 */
		urethraStoneCount?: string;

		/**
		 * 尿道第一颗结石前框(mm)
		 */
		urethraStone1Front?: float;

		/**
		 * 尿道第一颗结石后框(mm)
		 */
		urethraStone1Back?: float;

		/**
		 * 尿道第一颗结石表面积(mm²)
		 */
		urethraStone1Area?: float;

		/**
		 * 尿道第一颗结石位置-字典image_utlocition
		 */
		urethraStone1Location?: string;

		/**
		 * 尿道第二颗结石前框(mm)
		 */
		urethraStone2Front?: float;

		/**
		 * 尿道第二颗结石后框(mm)
		 */
		urethraStone2Back?: float;

		/**
		 * 尿道第二颗结石表面积(mm²)
		 */
		urethraStone2Area?: float;

		/**
		 * 尿道第二颗结石位置-字典image_utlocition
		 */
		urethraStone2Location?: string;

		/**
		 * 尿道结石形状-字典image_kub
		 */
		urethraStoneShape?: string;

		/**
		 * 尿道结石性质-字典image_kubsize
		 */
		urethraStoneNature?: string;

		/**
		 * 是否尿道尿潴留 0-否 1-是
		 */
		urethraUrinaryRetention?: smallint;

		/**
		 * 并发症多囊肾 0-无 1-有
		 */
		complicationPolycysticKidney?: smallint;

		/**
		 * 并发症重复肾 0-无 1-有
		 */
		complicationDuplexKidney?: smallint;

		/**
		 * 并发症马蹄肾 0-无 1-有
		 */
		complicationHorseshoeKidney?: smallint;

		/**
		 * 并发症输尿管狭窄 0-无 1-有
		 */
		complicationUreteralStricture?: smallint;

		/**
		 * 并发症尿道狭窄 0-无 1-有
		 */
		complicationUrethralStricture?: smallint;

		/**
		 * 并发症膀胱憩室 0-无 1-有
		 */
		complicationBladderDiverticulum?: smallint;

		/**
		 * 并发症海绵肾 0-无 1-有
		 */
		complicationMedullarySpongeKidney?: smallint;

		/**
		 * 并发症肾囊肿 0-无 1-有
		 */
		complicationRenalCyst?: smallint;

		/**
		 * 并发症异位肾 0-无 1-有
		 */
		complicationEctopicKidney?: smallint;

		/**
		 * 并发症神经源性膀胱 0-无 1-有
		 */
		complicationNeurogenicBladder?: smallint;

		/**
		 * 并发症输尿管囊肿 0-无 1-有
		 */
		complicationUreterocele?: smallint;

		/**
		 * 并发症尿道异物 0-无 1-有
		 */
		complicationUrethralForeignBody?: smallint;

		/**
		 * 并发症肾脏憩室 0-无 1-有
		 */
		complicationRenalDiverticulum?: smallint;

		/**
		 * 并发症UPJ狭窄 0-无 1-有
		 */
		complicationUPJStricture?: smallint;

		/**
		 * 并发症BPH 0-无 1-有
		 */
		complicationBPH?: smallint;

		/**
		 * 并发症尿道憩室 0-无 1-有
		 */
		complicationUrethralDiverticulum?: smallint;

		/**
		 * 是否并发症其他 0-否 1-是
		 */
		hasOtherComplications?: smallint;

		/**
		 * 并发症其他描述
		 */
		otherComplicationsDesc?: string;

		/**
		 * 登记人
		 */
		registrar?: string;

		/**
		 * 登记时间
		 */
		registerTime?: Date;

		/**
		 * 影像地址
		 */
		imageUrls?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BusFamilyHistoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 家族成员-字典family_people
		 */
		familyMember?: string;

		/**
		 * 尿石病史-0,无 1,有
		 */
		urolithiasisHistory?: smallint;

		/**
		 * 其他病史-字典family_othersick
		 */
		otherDiseases?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 录入人
		 */
		operator?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlFutureFollowupEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 随访次数
		 */
		followupCount?: integer;

		/**
		 * 随访日期
		 */
		followupDate?: Date;

		/**
		 * 末次SWL术后时间
		 */
		lastSWLMonths?: integer;

		/**
		 * 总SWL治疗次数
		 */
		totalSWLTimes?: integer;

		/**
		 * 已治疗结石-字典future_swlcure
		 */
		treatedStones?: string;

		/**
		 * 未治疗结石-字典future_nonecure
		 */
		untreatedStones?: string;

		/**
		 * 基础血压(格式:120/80)
		 */
		baselineBP?: string;

		/**
		 * 血压变化-字典future_bp
		 */
		bpChange?: string;

		/**
		 * 轻度肾萎缩 0-无 1-有
		 */
		mildAtrophy?: smallint;

		/**
		 * 中度肾萎缩 0-无 1-有
		 */
		moderateAtrophy?: smallint;

		/**
		 * 重度肾萎缩 0-无 1-有
		 */
		severeAtrophy?: smallint;

		/**
		 * 肾周积液 0-无 1-有
		 */
		perirenalFluid?: smallint;

		/**
		 * 肾功能丧失 0-无 1-有
		 */
		renalFunctionLoss?: smallint;

		/**
		 * 集合系统狭窄 0-无 1-有
		 */
		collectingSystemStricture?: smallint;

		/**
		 * 输尿管狭窄 0-无 1-有
		 */
		ureteralStricture?: smallint;

		/**
		 * 肾功能损害 0-无 1-有
		 */
		renalImpairment?: smallint;

		/**
		 * 复发性尿路感染 0-无 1-有
		 */
		recurrentUTI?: smallint;

		/**
		 * 儿童生长发育障碍 0-无 1-有
		 */
		growthDisorder?: smallint;

		/**
		 * 生活习惯-字典future_lifthabit)
		 */
		liveHabitChange?: string;

		/**
		 * 饮水量变化-字典future_waterchg)
		 */
		waterHabitChange?: string;

		/**
		 * 每日饮水量(ml/d)
		 */
		dailyWaterIntake?: integer;

		/**
		 * 职业是否改变 0-无 1-有
		 */
		occupationalChange?: smallint;

		/**
		 * 职业风险暴露-字典future_dutyrisk)
		 */
		occupationalRisk?: string;

		/**
		 * 血液异常指标
		 */
		bloodAbnormalities?: string;

		/**
		 * 尿液异常指标
		 */
		urineAbnormalities?: string;

		/**
		 * IVU检查结果
		 */
		ivuFinding?: string;

		/**
		 * ECT检查结果
		 */
		ectFinding?: string;

		/**
		 * B超检查结果
		 */
		usFinding?: string;

		/**
		 * KUB检查结果
		 */
		kubFinding?: string;

		/**
		 * 其他检查结果
		 */
		otherFinding?: string;

		/**
		 * 随访医生
		 */
		physician?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlLabResultDetailEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 检验类型编码(关联检验类型字典labTestType)
		 */
		testTypeCode?: string;

		/**
		 * 检验分组编码(关联检验分组labTestGroup)
		 */
		groupCode?: string;

		/**
		 * 检验项目编码(关联检验项目labTestItem)
		 */
		itemCode?: string;

		/**
		 * 检验结果值
		 */
		resultValue?: string;

		/**
		 * 定性结果
		 */
		qualitativeResult?: string;

		/**
		 * 单位
		 */
		unit?: string;

		/**
		 * 检查时间
		 */
		testTime?: timestamp;

		/**
		 * 结果标识:0-正常 1-异常
		 */
		resultFlag?: smallint;

		/**
		 * 录入人
		 */
		operator?: string;

		/**
		 * 参考值
		 */
		referenceRange?: string;

		/**
		 * 参考值最小值
		 */
		referenceMin?: float;

		/**
		 * 参考值最大值
		 */
		referenceMax?: float;

		/**
		 * 报告单号
		 */
		reportNo?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BusMenstrualMarriageHistoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 初潮年龄(岁)-字典female_menarche
		 */
		menarcheAge?: string;

		/**
		 * 周期(天)-字典female_cycle
		 */
		menstrualCycle?: string;

		/**
		 * 经期(天)-字典female_menstrual
		 */
		menstrualPeriod?: string;

		/**
		 * 婚姻状况-marriage
		 */
		maritalStatus?: string;

		/**
		 * 生育次数-字典female_procreate
		 */
		parity?: string;

		/**
		 * 流产次数-字典female_misbirth
		 */
		abortion?: string;

		/**
		 * 是否绝经 0-否 1-是
		 */
		menopause?: smallint;

		/**
		 * 末次月经年月
		 */
		lastMenstrualDate?: Date;

		/**
		 * 录入人
		 */
		operator?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlNearFollowupEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 序列号
		 */
		sequenceNo?: integer;

		/**
		 * 治疗期数
		 */
		episode?: integer;

		/**
		 * 随访次数
		 */
		followupCount?: integer;

		/**
		 * 随访日期
		 */
		followupDate?: Date;

		/**
		 * 术后天数
		 */
		postopDays?: integer;

		/**
		 * 末期肉眼血尿-字典near_hematuria
		 */
		grossHematuria?: string;

		/**
		 * 发热 0-无 1-有
		 */
		fever?: smallint;

		/**
		 * 恶心 0-无 1-有
		 */
		nausea?: smallint;

		/**
		 * 呕吐 0-无 1-有
		 */
		vomiting?: smallint;

		/**
		 * 皮肤渗血或瘀斑 0-无 1-有
		 */
		skinEcchymosis?: smallint;

		/**
		 * 肾包膜下血肿 0-无 1-有
		 */
		subcapsularHematoma?: smallint;

		/**
		 * 肾出血 0-无 1-有
		 */
		renalHemorrhage?: smallint;

		/**
		 * 感染 0-无 1-有
		 */
		infection?: smallint;

		/**
		 * 肾绞痛 0-无 1-有
		 */
		renalColic?: smallint;

		/**
		 * 肾衰 0-无 1-有
		 */
		renalFailure?: smallint;

		/**
		 * 腰腹痛程度-字典near_lumbago
		 */
		flankPainLevel?: string;

		/**
		 * 石街类型-字典near_syndromesx
		 */
		steinstrasseType?: string;

		/**
		 * 石街长度(cm)
		 */
		steinstrasseLength?: float;

		/**
		 * 排石时间(天)
		 */
		stonePassDays?: string;

		/**
		 * 排石量评估-字典near_eductionsum
		 */
		stoneOutputLevel?: string;

		/**
		 * 内科辅助治疗-字典near_assistcure1
		 */
		medicalTherapy?: string;

		/**
		 * SWL前治疗性辅助-字典near_SWLassistcuring
		 */
		preSWLTherapy?: string;

		/**
		 * SWL后治疗性辅助-字典near_SWLassistcuring
		 */
		postSWLTherapy?: string;

		/**
		 * SWL后补助性辅助-字典near_SWLAfterAssistcure
		 */
		postSWLSupport?: string;

		/**
		 * 结石成分一-字典near_compose
		 */
		component1?: string;

		/**
		 * 成分一百分比
		 */
		component1Percent?: float;

		/**
		 * 结石成分二-字典near_compose
		 */
		component2?: string;

		/**
		 * 成分二百分比
		 */
		component2Percent?: float;

		/**
		 * 结石成分三-字典near_compose
		 */
		component3?: string;

		/**
		 * 成分三百分比
		 */
		component3Percent?: float;

		/**
		 * 结石成分四-字典near_compose
		 */
		component4?: string;

		/**
		 * 成分四百分比
		 */
		component4Percent?: float;

		/**
		 * 术后抗生素使用 0-无 1-有
		 */
		antibioticsUsed?: smallint;

		/**
		 * 抗生素说明
		 */
		antibioticsNote?: string;

		/**
		 * 成分分析方法-字典near_analyse2
		 */
		analysisMethod?: string;

		/**
		 * 疗效评定-字典near_result
		 */
		effectiveness?: string;

		/**
		 * B超结果描述
		 */
		usFinding?: string;

		/**
		 * KUB结果描述
		 */
		kubFinding?: string;

		/**
		 * 其他检查结果
		 */
		otherFinding?: string;

		/**
		 * 随访医生
		 */
		physician?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BusPastMedicalHistoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 病名-字典past_sickname
		 */
		diseaseName?: string;

		/**
		 * 诊断年月(YYYY-MM)
		 */
		diagnosisDate?: string;

		/**
		 * 治疗方式-字典past_curestatus
		 */
		treatment?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 录入人
		 */
		operator?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BusPastStoneHistoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 诊断年月(YYYY-MM)
		 */
		diagnosisDate?: string;

		/**
		 * 诊断-字典lithiasis_diagnose
		 */
		diagnosis?: string;

		/**
		 * 治疗过程-字典lithiasis_process
		 */
		treatmentProcess?: string;

		/**
		 * 疗效-字典lithiasis_cureresult
		 */
		curativeEffect?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 录入人
		 */
		operator?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BusPersonalHistoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 出生地
		 */
		birthplace?: string;

		/**
		 * 居住地
		 */
		residence?: string;

		/**
		 * 起始居住年月
		 */
		startResidenceDate?: string;

		/**
		 * 录入人
		 */
		operator?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SwlVitalSignsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 体温(℃)
		 */
		temperature?: float;

		/**
		 * 脉搏(次/分)
		 */
		pulse?: integer;

		/**
		 * 呼吸频率(次/分)
		 */
		respiratoryRate?: integer;

		/**
		 * 血压(mmHg)
		 */
		bloodPressure?: string;

		/**
		 * 身高(cm)
		 */
		height?: float;

		/**
		 * 体重(kg)
		 */
		weight?: float;

		/**
		 * BMI指数
		 */
		bmi?: float;

		/**
		 * 腹部压痛点-字典body_abdomenache
		 */
		abdominalTenderness?: string;

		/**
		 * 位置-字典body_abdomenoisition
		 */
		location?: string;

		/**
		 * 肾区叩击痛-字典body_kidneyache
		 */
		renalAreaKnockingPain?: string;

		/**
		 * 程度-字典body_kidneydegree
		 */
		painIntensity?: string;

		/**
		 * 其他体征
		 */
		otherSigns?: string;

		/**
		 * 录入人
		 */
		operator?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ImgExamEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 超声号
		 */
		ultrasoundNo?: string;

		/**
		 * 患者姓名
		 */
		name?: string;

		/**
		 * 性别
		 */
		gender?: number;

		/**
		 * 年龄
		 */
		age?: string;

		/**
		 * 就诊科室
		 */
		department?: string;

		/**
		 * 收费金额
		 */
		fee?: number;

		/**
		 * 检查所见
		 */
		findings?: string;

		/**
		 * 超声提示
		 */
		ultrasoundNote?: string;

		/**
		 * 录入医生
		 */
		doctor?: string;

		/**
		 * 检查日期
		 */
		examDate?: timestamp;

		/**
		 * 影像文件路径1
		 */
		image2?: string;

		/**
		 * 影像文件路径3
		 */
		image3?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface VPatientInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号(门诊、住院)
		 */
		patientNo?: string;

		/**
		 * 流水号(门诊、住院)
		 */
		patientId?: string;

		/**
		 * 就诊类型(1门诊、2住院)
		 */
		visitType?: number;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 身份证号
		 */
		idCard?: string;

		/**
		 * 性别 0-未知 1-男 2-女
		 */
		gender?: number;

		/**
		 * 出生日期
		 */
		birthDate?: Date;

		/**
		 * 籍贯省（XX省XX市XX县XX）
		 */
		native?: string;

		/**
		 * 现住址（XX省XX市XX县XX）
		 */
		current?: string;

		/**
		 * 手机号码
		 */
		mobile?: string;

		/**
		 * 职业-字典key:duty
		 */
		occupation?: string;

		/**
		 * 床号
		 */
		bedNo?: string;

		/**
		 * 就诊时间/入院时间
		 */
		visitTime?: Date;

		/**
		 * 院区
		 */
		hospital?: string;

		/**
		 * 就诊号
		 */
		visitNo?: string;

		/**
		 * 科室
		 */
		department?: string;

		/**
		 * 科室编码
		 */
		departcode?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DiagnosticRuleGroupEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 诊断编码
		 */
		diagnosticCode?: string;

		/**
		 * 组名
		 */
		groupName?: string;

		/**
		 * 组号
		 */
		groupNo?: number;

		/**
		 * 组关系
		 */
		groupRelation?: number;

		/**
		 * 组序号
		 */
		seq?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DiagnosticEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 诊断编码
		 */
		diagnosticCode?: string;

		/**
		 * 诊断名称
		 */
		diagnosticName?: string;

		/**
		 * 诊断类型
		 */
		diagnosticType?: number;

		/**
		 * 诊断分类
		 */
		diagnosticGroup?: string;

		/**
		 * 拼音码
		 */
		pinyinCode?: string;

		/**
		 * 鉴别次数（暂定0-不鉴别，1-鉴别一次，2-鉴别两次，3-鉴别两次以上）
		 */
		distinguishCount?: number;

		/**
		 * 鉴别规则关系
		 */
		distinguishRelation?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 是否禁用
		 */
		isDisabled?: smallint;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 排除诊断编码
		 */
		excludeDiagnosticCode?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DiagnosticRecommendationsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 诊断编码
		 */
		diagnosticCode?: string;

		/**
		 * 防治建议名称（字典-etiology_recomm）
		 */
		recommendationsName?: string;

		/**
		 * 建议内容
		 */
		recommendationsContent?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DiagnosticRuleEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 诊断编码
		 */
		diagnosticCode?: string;

		/**
		 * 项目类型
		 */
		itemType?: integer;

		/**
		 * 项目分组
		 */
		groupCode?: number;

		/**
		 * 组名称
		 */
		groupName?: string;

		/**
		 * 项目编码
		 */
		itemCode?: string;

		/**
		 * 项目名称
		 */
		itemName?: string;

		/**
		 * 下限
		 */
		minValue?: number;

		/**
		 * 上限
		 */
		maxValue?: number;

		/**
		 * 固定值
		 */
		fixedValue?: string;

		/**
		 * 关系
		 */
		relation?: number;

		/**
		 * 样本类型
		 */
		sampleType?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 组号
		 */
		groupNo?: number;

		/**
		 * 尿类型
		 */
		urineType?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ExamTemplateEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 项目编码
		 */
		templateCode?: string;

		/**
		 * 模板名称
		 */
		templateName?: string;

		/**
		 * 检查所见
		 */
		examFindings?: string;

		/**
		 * 检查提示
		 */
		examTips?: string;

		/**
		 * 显示排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SystemItemHisdzEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 项目分组编码(关联字典item_group)
		 */
		groupCode?: number;

		/**
		 * 是否停用 0-启用 1-停用
		 */
		groupName?: string;

		/**
		 * 项目编码
		 */
		itemCode?: string;

		/**
		 * 项目名称
		 */
		itemName?: string;

		/**
		 * 项目编码
		 */
		hisItemCode?: string;

		/**
		 * 项目名称
		 */
		hisItemName?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SystemItemCsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 分组编码
		 */
		groupCode?: string;

		/**
		 * 分组名称
		 */
		groupName?: string;

		/**
		 * 所属模块(关联字典sys_module),多个用“,”隔开
		 */
		moduleCode?: string;

		/**
		 * 次数
		 */
		cs?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SystemItemEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 项目编码
		 */
		itemCode?: string;

		/**
		 * 项目名称
		 */
		itemName?: string;

		/**
		 * 项目类型(字典item_type)
		 */
		itemType?: number;

		/**
		 * 项目分组编码(关联字典item_group)
		 */
		groupCode?: number;

		/**
		 * 拼音码
		 */
		pinyinCode?: string;

		/**
		 * 标准价格
		 */
		price?: number;

		/**
		 * 成本价格
		 */
		cost?: number;

		/**
		 * 单位
		 */
		unit?: string;

		/**
		 * 排序号
		 */
		sort?: number;

		/**
		 * 备注说明
		 */
		remark?: string;

		/**
		 * 是否指标值 0-否 1-是
		 */
		isIndicator?: smallint;

		/**
		 * 是否停用 0-启用 1-停用
		 */
		isDisabled?: smallint;

		/**
		 * 所属模块(关联字典sys_module),多个用“,”隔开
		 */
		moduleCode?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ItemReferenceEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 项目编码
		 */
		itemCode?: string;

		/**
		 * 性别 0-不限 1-男 2-女
		 */
		gender?: smallint;

		/**
		 * 年龄下限
		 */
		ageMin?: number;

		/**
		 * 年龄上限
		 */
		ageMax?: number;

		/**
		 * 年龄单位 0-岁 1-月 2-周 3-天 4-时
		 */
		ageUnit?: smallint;

		/**
		 * 参考值描述
		 */
		referenceText?: string;

		/**
		 * 参考值下限
		 */
		referenceMin?: number;

		/**
		 * 参考值上限
		 */
		referenceMax?: number;

		/**
		 * 危急值下限
		 */
		criticalMin?: number;

		/**
		 * 危急值上限
		 */
		criticalMax?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ItemCommonResultEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 项目编码(关联tsys_item_set.item_code)
		 */
		itemCode?: string;

		/**
		 * 结果取值
		 */
		resultValue?: string;

		/**
		 * 结果展示序号
		 */
		displayOrder?: number;

		/**
		 * 结果标识（唯一代码）
		 */
		resultCode?: string;

		/**
		 * 助记词（拼音首字母）
		 */
		mnemonic?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface KnowledgeTemplateDetailEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 模板编号
		 */
		templateCode?: string;

		/**
		 * 模板类型(冗余存储，关联主表类型)
		 */
		templateType?: string;

		/**
		 * 项目编码(关联tsys_item_set.item_code)
		 */
		itemCode?: string;

		/**
		 * 项目名称(冗余存储)
		 */
		itemName?: string;

		/**
		 * 药品剂量
		 */
		drugDosage?: number;

		/**
		 * 药品单位
		 */
		drugUnit?: string;

		/**
		 * 药品用法(关联字典drug_usage)
		 */
		drugUsage?: string;

		/**
		 * 使用天数
		 */
		days?: number;

		/**
		 * 检查所见
		 */
		examFindings?: string;

		/**
		 * 检查提示
		 */
		examTips?: string;

		/**
		 * 显示排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface KnowledgeTemplateMainEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 模板编号
		 */
		templateCode?: string;

		/**
		 * 模板名称
		 */
		templateName?: string;

		/**
		 * 模板类型(关联字典template_type)
		 */
		templateType?: string;

		/**
		 * 模板权限 0-私有 1-公开
		 */
		accessLevel?: smallint;

		/**
		 * 模板分类(关联字典template_category)
		 */
		category?: string;

		/**
		 * 创建人
		 */
		creator?: string;

		/**
		 * 是否作废 0-有效 1-作废
		 */
		isInvalid?: smallint;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MachineMaintainEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 设备类型
		 */
		machineType?: string;

		/**
		 * 设备编号
		 */
		machineNo?: string;

		/**
		 * 维护科目
		 */
		maintainType?: string;

		/**
		 * 维修日期
		 */
		repairDate?: Date;

		/**
		 * 维护费用(元)
		 */
		maintainCost?: number;

		/**
		 * 登记人
		 */
		operator?: string;

		/**
		 * 登记日期
		 */
		registerDate?: timestamp;

		/**
		 * 备注说明
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface HistoryQuestionnaireEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 患者档案号，关联 tbus_patient_info.patientNo，唯一标识患者
		 */
		patientNo?: string;

		/**
		 * 在本地居住年限
		 */
		localResidenceYears?: string;

		/**
		 * 职业类型（如教师、医生、工人等）
		 */
		occupationType?: string;

		/**
		 * 身高（单位：厘米）
		 */
		height?: string;

		/**
		 * 体重（单位：千克）
		 */
		weight?: string;

		/**
		 * 每日饮水量（单位：毫升）
		 */
		dailyFluidIntake?: string;

		/**
		 * 每日饮水杯数
		 */
		fluidCupCount?: string;

		/**
		 * 饮用水类型（数组，如自来水、矿泉水、纯净水等）
		 */
		drinkingWaterTypes?: jsonb;

		/**
		 * 其他饮用水类型的具体说明
		 */
		otherDrinkingWaterType?: string;

		/**
		 * 是否饮茶（是/否）
		 */
		isDrinkTea?: string;

		/**
		 * 每日饮茶量（单位：毫升）
		 */
		dailyTeaIntake?: string;

		/**
		 * 茶叶类型（数组，如绿茶、红茶、乌龙茶等）
		 */
		teaTypes?: jsonb;

		/**
		 * 茶叶浓度（如淡茶、浓茶等）
		 */
		teaStrength?: string;

		/**
		 * 茶叶量（如3-5g、6-10g等）
		 */
		teaAmount?: string;

		/**
		 * 是否喝咖啡（是/否）
		 */
		isDrinkCoffee?: string;

		/**
		 * 主食种类（如米饭、面条、馒头等）
		 */
		mainFoods?: jsonb;

		/**
		 * 每日主食量
		 */
		dailyMainFoodAmount?: string;

		/**
		 * 常吃蔬菜种类
		 */
		vegetables?: jsonb;

		/**
		 * 其他常吃蔬菜的具体说明
		 */
		otherVegetables?: string;

		/**
		 * 每日蔬菜量（单位：克）
		 */
		dailyVegetableAmount?: string;

		/**
		 * 每日蔬菜量（单位：碗）
		 */
		dailyVegetableAmountBowl?: string;

		/**
		 * 每日蔬菜碗数
		 */
		dailyVegetableBowls?: string;

		/**
		 * 常吃肉类种类（如猪肉、牛肉、鸡肉等）
		 */
		meats?: jsonb;

		/**
		 * 每日肉类量（单位：克）
		 */
		dailyMeatAmount?: string;

		/**
		 * 常见鱼类种类（如草鱼、鲫鱼、鲤鱼等）
		 */
		commonFish?: jsonb;

		/**
		 * 其他常见鱼类的具体说明
		 */
		otherCommonFish?: string;

		/**
		 * 每日鱼类量（单位：克）
		 */
		dailyFishAmount?: string;

		/**
		 * 海鲜食用频率（如每周几次）
		 */
		seafoodFrequency?: string;

		/**
		 * 每周食物频率统计
		 */
		weeklyFoodFrequency?: string;

		/**
		 * 常吃贝类类型（如牡蛎、扇贝等）
		 */
		shellfishTypes?: jsonb;

		/**
		 * 每日鸡蛋摄入量
		 */
		dailyEggAmount?: string;

		/**
		 * 每周鸡蛋摄入量
		 */
		weeklyEggAmount?: string;

		/**
		 * 每日乳制品摄入量
		 */
		dairyIntake?: string;

		/**
		 * 每周乳制品摄入量
		 */
		weeklyDairyIntake?: string;

		/**
		 * 食物口味偏好（如偏咸、偏甜、偏辣等）
		 */
		foodTaste?: string;

		/**
		 * 是否食用腌制食品（是/否）
		 */
		eatPickledFood?: string;

		/**
		 * 腌制食品食用频率（如每周几次）
		 */
		pickledFoodFrequency?: string;

		/**
		 * 动物内脏食用频率（如每周几次）
		 */
		animalVisceraFrequency?: string;

		/**
		 * 是否饮酒（是/否）
		 */
		drinkAlcohol?: string;

		/**
		 * 每日饮酒频率
		 */
		alcoholFrequencyDaily?: string;

		/**
		 * 每周饮酒频率
		 */
		alcoholFrequencyWeekly?: string;

		/**
		 * 每月饮酒频率
		 */
		alcoholFrequencyMonthly?: string;

		/**
		 * 饮酒年限
		 */
		alcoholYears?: string;

		/**
		 * 酒类类型（如白酒、啤酒、红酒等）
		 */
		alcoholTypes?: string;

		/**
		 * 其他酒类类型的具体说明
		 */
		otherAlcoholTypes?: string;

		/**
		 * 每日锻炼时长（单位：小时）
		 */
		exerciseHoursDaily?: number;

		/**
		 * 每周锻炼时长（单位：小时）
		 */
		exerciseHoursWeekly?: number;

		/**
		 * 锻炼强度（如轻度、中度、高强度等）
		 */
		exerciseIntensity?: string;

		/**
		 * 是否不锻炼（是/否）
		 */
		noExercise?: string;

		/**
		 * 排便情况（如正常、便秘、腹泻等）
		 */
		bowelMovement?: string;

		/**
		 * 血型（如A、B、O、AB型等）
		 */
		bloodType?: string;

		/**
		 * 家族结石病史（数组，记录有结石病史的亲属关系）
		 */
		familyStoneHistory?: jsonb;

		/**
		 * 高血压家族史（数组，记录有高血压的亲属关系）
		 */
		hypertensionFamilyHistory?: jsonb;

		/**
		 * 其他遗传疾病的具体说明
		 */
		otherGeneticDiseases?: string;

		/**
		 * 是否有高血压病史（是/否）
		 */
		hasHypertension?: string;

		/**
		 * 高血压病史年限
		 */
		hypertensionYears?: string;

		/**
		 * 是否有糖尿病病史（是/否）
		 */
		hasDiabetes?: string;

		/**
		 * 糖尿病病史年限
		 */
		diabetesYears?: string;

		/**
		 * 是否有高血脂病史（是/否）
		 */
		hasHyperlipidemia?: string;

		/**
		 * 高血脂病史年限
		 */
		hyperlipidemiaYears?: string;

		/**
		 * 是否有冠心病病史（是/否）
		 */
		hasCoronaryDisease?: string;

		/**
		 * 冠心病病史年限
		 */
		coronaryDiseaseYears?: string;

		/**
		 * 是否有痛风病史（是/否）
		 */
		hasGout?: string;

		/**
		 * 痛风病史年限
		 */
		goutYears?: string;

		/**
		 * 是否有相关治疗史（是/否）
		 */
		hasTreatmentHistory?: string;

		/**
		 * 是否有甲状腺疾病（是/否）
		 */
		hasThyroidDisease?: string;

		/**
		 * 甲状腺疾病病史年限
		 */
		thyroidDiseaseYears?: string;

		/**
		 * 其他疾病（数组，记录其他疾病类型）
		 */
		otherDiseases?: jsonb;

		/**
		 * 其他疾病的详细描述和说明
		 */
		otherDiseasesDescription?: string;

		/**
		 * 维生素C服用情况（是否服用及剂量）
		 */
		vitaminC?: string;

		/**
		 * 钙片服用情况（是否服用及剂量）
		 */
		calciumTablets?: string;

		/**
		 * 维生素D服用情况（是否服用及剂量）
		 */
		vitaminD?: string;

		/**
		 * 镁剂服用情况（是否服用及剂量）
		 */
		magnesium?: string;

		/**
		 * 降压药物（数组，记录服用的降压药物种类）
		 */
		antihypertensiveDrugs?: jsonb;

		/**
		 * 降尿酸药物（数组，记录服用的降尿酸药物种类）
		 */
		antiUricAcidDrugs?: jsonb;

		/**
		 * 其他药物（数组，记录服用的其他药物种类）
		 */
		otherMedications?: jsonb;

		/**
		 * 首次结石发病年龄
		 */
		firstOnsetAge?: string;

		/**
		 * 结石总病程（单位：年）
		 */
		totalDiseaseYears?: string;

		/**
		 * 首次发病季节（春夏秋冬）
		 */
		firstOnsetSeason?: string;

		/**
		 * 体外冲击波碎石术次数
		 */
		extracorporealShockWaveLithotripsy?: string;

		/**
		 * 输尿管镜手术次数
		 */
		ureteroscopy?: string;

		/**
		 * 经皮肾镜取石术次数
		 */
		percutaneousNephrolithotomy?: string;

		/**
		 * 软性输尿管镜手术次数
		 */
		flexibleUreteroscopy?: string;

		/**
		 * 腹腔镜手术次数
		 */
		laparoscopy?: string;

		/**
		 * 开放手术次数
		 */
		openSurgery?: string;

		/**
		 * 最近一次治疗方式的具体说明
		 */
		latestTreatment?: string;

		/**
		 * 最近一次治疗时间（格式：YYYY-MM-DD）
		 */
		latestTreatmentTime?: string;

		/**
		 * 是否还残留结石（是/否）
		 */
		hasResidualStones?: string;

		/**
		 * 是否有自然排石经历（是/否）
		 */
		hasNaturalStoneExpulsion?: string;

		/**
		 * 自然排石次数
		 */
		stoneExpulsionCount?: string;

		/**
		 * 结石成分分析结果
		 */
		stoneComposition1?: string;

		/**
		 * 结石成分检查日期（格式：YYYY-MM-DD）
		 */
		stoneCheckDate1?: string;

		/**
		 * 结石成分分析结果
		 */
		stoneComposition2?: string;

		/**
		 * 结石成分检查日期（格式：YYYY-MM-DD）
		 */
		stoneCheckDate2?: string;

		/**
		 * 结石成分分析结果
		 */
		stoneComposition3?: string;

		/**
		 * 结石成分检查日期（格式：YYYY-MM-DD）
		 */
		stoneCheckDate3?: string;

		/**
		 * 结石成分分析结果
		 */
		stoneComposition4?: string;

		/**
		 * 结石成分检查日期（格式：YYYY-MM-DD）
		 */
		stoneCheckDate4?: string;

		/**
		 * 填报日期（格式：YYYY-MM-DD）
		 */
		fillDate?: string;

		/**
		 * 记录状态（1：已填报，2：已审核，3：已删除）
		 */
		status?: string;

		/**
		 * 备注信息，用于记录特殊情况或说明
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 身份证号
		 */
		idCard?: string;

		/**
		 * 性别 0-未知 1-男 2-女
		 */
		gender?: number;

		/**
		 * 手机号码
		 */
		mobile?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PatientInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 身份证号
		 */
		idCard?: string;

		/**
		 * 性别 0-未知 1-男 2-女
		 */
		gender?: number;

		/**
		 * 出生日期
		 */
		birthDate?: Date;

		/**
		 * 籍贯省-表tsys_address
		 */
		nativeProvince?: string;

		/**
		 * 籍贯市-表tsys_address
		 */
		nativeCity?: string;

		/**
		 * 籍贯区-表tsys_address
		 */
		nativeDistrict?: string;

		/**
		 * 籍贯详细地址
		 */
		nativeAddress?: string;

		/**
		 * 邮编
		 */
		zipCode?: string;

		/**
		 * 现住址省-表tsys_address
		 */
		currentProvince?: string;

		/**
		 * 现住址市-表tsys_address
		 */
		currentCity?: string;

		/**
		 * 现住址区-表tsys_address
		 */
		currentDistrict?: string;

		/**
		 * 现住址详细地址
		 */
		currentAddress?: string;

		/**
		 * 固定电话
		 */
		telephone?: string;

		/**
		 * 手机号码
		 */
		mobile?: string;

		/**
		 * 职业-字典key:duty
		 */
		occupation?: string;

		/**
		 * 最近就诊时间
		 */
		lastVisit?: Date;

		/**
		 * 登记日期
		 */
		registerDate?: Date;

		/**
		 * 删除时间
		 */
		deletedAt?: timestamp;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PatientQuestionnaireEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 问卷ID
		 */
		questionnaireId?: number;

		/**
		 * 提交时间
		 */
		submitTime?: timestamp;

		/**
		 * 问卷内容
		 */
		questionNr?: json;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 身份证号
		 */
		idCard?: string;

		/**
		 * 性别 0-未知 1-男 2-女
		 */
		gender?: number;

		/**
		 * 手机号码
		 */
		mobile?: string;

		/**
		 * 问卷标题
		 */
		title?: string;

		/**
		 * 问卷描述
		 */
		description?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PluginInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 简介
		 */
		description?: string;

		/**
		 * Key名
		 */
		keyName?: string;

		/**
		 * Hook
		 */
		hook?: string;

		/**
		 * 描述
		 */
		readme?: string;

		/**
		 * 版本
		 */
		version?: string;

		/**
		 * Logo(base64)
		 */
		logo?: string;

		/**
		 * 作者
		 */
		author?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * 内容
		 */
		content?: json;

		/**
		 * ts内容
		 */
		tsContent?: json;

		/**
		 * 插件的plugin.json
		 */
		pluginJson?: json;

		/**
		 * 配置
		 */
		config?: json;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface AnswerEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 答卷ID
		 */
		answerSheetId?: number;

		/**
		 * 问题ID
		 */
		questionId?: number;

		/**
		 * 选项ID
		 */
		optionId?: number;

		/**
		 * 填空题答案内容
		 */
		content?: string;

		/**
		 * 得分
		 */
		score?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface AnswerSheetEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 问卷ID
		 */
		questionnaireId?: number;

		/**
		 * 答题人ID
		 */
		userId?: number;

		/**
		 * 提交时间
		 */
		submitTime?: timestamp;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface OptionEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 所属问卷ID
		 */
		questionnaireId?: number;

		/**
		 * 所属问题ID
		 */
		questionId?: number;

		/**
		 * 选项内容
		 */
		content?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 选项分值
		 */
		score?: number;

		/**
		 * 编号
		 */
		bh?: string;

		/**
		 * 其他
		 */
		other?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface QuestionEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 所属问卷ID
		 */
		questionnaireId?: number;

		/**
		 * 问题标题
		 */
		title?: string;

		/**
		 * 问题类型
		 */
		type?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 是否必填
		 */
		required?: boolean;

		/**
		 * 跳转逻辑
		 */
		jump?: string;

		/**
		 * 编号
		 */
		bh?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface QuestionnaireEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 问卷标题
		 */
		title?: string;

		/**
		 * 问卷描述
		 */
		description?: string;

		/**
		 * 创建人ID
		 */
		creatorId?: number;

		/**
		 * 是否发布
		 */
		published?: boolean;

		/**
		 * 删除时间
		 */
		deletedAt?: timestamp;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RecycleDataEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 表
		 */
		entityInfo?: json;

		/**
		 * 操作人
		 */
		userId?: number;

		/**
		 * 被删除的数据
		 */
		data?: json;

		/**
		 * 请求的接口
		 */
		url?: string;

		/**
		 * 请求参数
		 */
		params?: json;

		/**
		 * 删除数据条数
		 */
		count?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		userName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SecondExampleEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 描述
		 */
		description?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 地址
		 */
		url?: string;

		/**
		 * 类型
		 */
		type?: string;

		/**
		 * 分类ID
		 */
		classifyId?: number;

		/**
		 * 文件id
		 */
		fileId?: string;

		/**
		 * 文件名
		 */
		name?: string;

		/**
		 * 文件大小
		 */
		size?: number;

		/**
		 * 文档版本
		 */
		version?: number;

		/**
		 * 文件位置
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类别名称
		 */
		name?: string;

		/**
		 * 父分类ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TaskInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 任务ID
		 */
		jobId?: string;

		/**
		 * 任务配置
		 */
		repeatConf?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * cron
		 */
		cron?: string;

		/**
		 * 最大执行次数 不传为无限次
		 */
		limit?: number;

		/**
		 * 每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效
		 */
		every?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-停止 1-运行
		 */
		status?: number;

		/**
		 * 开始时间
		 */
		startDate?: Date;

		/**
		 * 结束时间
		 */
		endDate?: Date;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 执行的service实例ID
		 */
		service?: string;

		/**
		 * 状态 0-系统 1-用户
		 */
		type?: number;

		/**
		 * 下一次执行时间
		 */
		nextRunTime?: Date;

		/**
		 * 状态 0-cron 1-时间间隔
		 */
		taskType?: number;

		/**
		 * undefined
		 */
		lastExecuteTime?: Date;

		/**
		 * undefined
		 */
		lockExpireTime?: Date;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UrsRegisterEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 碎石号
		 */
		ursNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 就诊科室
		 */
		department?: string;

		/**
		 * 就诊日期
		 */
		visitDate?: timestamp;

		/**
		 * 门诊号
		 */
		outpatientNo?: string;

		/**
		 * 住院号
		 */
		inpatientNo?: string;

		/**
		 * 病床号
		 */
		bedNo?: string;

		/**
		 * 年龄
		 */
		age?: string;

		/**
		 * 序列号
		 */
		sequenceNo?: integer;

		/**
		 * 期数
		 */
		episode?: integer;

		/**
		 * 身高(cm)
		 */
		height?: float;

		/**
		 * 体重(kg)
		 */
		weight?: float;

		/**
		 * BMI指数
		 */
		bmi?: float;

		/**
		 * 特殊病情/禁忌症
		 */
		specialCondition?: string;

		/**
		 * 接诊医生
		 */
		doctor?: string;

		/**
		 * 类型 1真实SWL 2虚拟SWL
		 */
		type?: integer;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserAddressEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 联系人
		 */
		contact?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 省
		 */
		province?: string;

		/**
		 * 市
		 */
		city?: string;

		/**
		 * 区
		 */
		district?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 是否默认
		 */
		isDefault?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 登录唯一ID
		 */
		unionid?: string;

		/**
		 * 头像
		 */
		avatarUrl?: string;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 性别
		 */
		gender?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 登录方式
		 */
		loginType?: number;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 介绍
		 */
		description?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SysVersionEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 版本
		 */
		version?: string;

		/**
		 * 版本号
		 */
		bh?: string;

		/**
		 * 发布日期
		 */
		publishTime?: Date;

		/**
		 * 是否发布
		 */
		published?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface VibrationInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 档案号
		 */
		patientNo?: string;

		/**
		 * 碎石号
		 */
		swlNo?: string;

		/**
		 * 流水号
		 */
		serialNumber?: string;

		/**
		 * 就诊科室
		 */
		department?: string;

		/**
		 * 就诊日期
		 */
		visitDate?: timestamp;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	type json = any;

	interface AiInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AiRagFeedbackEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AiRagFeedbackEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: AiRagFeedbackEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface AppointmentInfo {
		/**
		 * getTodayAppointment
		 */
		getTodayAppointment(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AppointmentEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AppointmentEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: AppointmentEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			getTodayAppointment: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			getTodayAppointment: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface BaseCoding {
		/**
		 * 获取模块目录结构
		 */
		getModuleTree(data?: any): Promise<any>;

		/**
		 * 创建代码
		 */
		createCode(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { getModuleTree: string; createCode: string };

		/**
		 * 权限状态
		 */
		_permission: { getModuleTree: boolean; createCode: boolean };

		request: Service["request"];
	}

	interface BaseComm {
		/**
		 * 修改个人信息
		 */
		personUpdate(data?: any): Promise<any>;

		/**
		 * 文件上传模式
		 */
		uploadMode(data?: any): Promise<any>;

		/**
		 * 权限与菜单
		 */
		permmenu(data?: any): Promise<any>;

		/**
		 * 编程
		 */
		program(data?: any): Promise<any>;

		/**
		 * 个人信息
		 */
		person(data?: any): Promise<any>;

		/**
		 * 文件上传
		 */
		upload(data?: any): Promise<any>;

		/**
		 * 退出
		 */
		logout(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			personUpdate: string;
			uploadMode: string;
			permmenu: string;
			program: string;
			person: string;
			upload: string;
			logout: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			personUpdate: boolean;
			uploadMode: boolean;
			permmenu: boolean;
			program: boolean;
			person: boolean;
			upload: boolean;
			logout: boolean;
		};

		request: Service["request"];
	}

	interface BaseDbHealth {
		/**
		 * trigger
		 */
		trigger(data?: any): Promise<any>;

		/**
		 * status
		 */
		status(data?: any): Promise<any>;

		/**
		 * check
		 */
		check(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { trigger: string; status: string; check: string; info: string };

		/**
		 * 权限状态
		 */
		_permission: { trigger: boolean; status: boolean; check: boolean; info: boolean };

		request: Service["request"];
	}

	interface BaseOpen {
		/**
		 * 刷新token
		 */
		refreshToken(data?: any): Promise<any>;

		/**
		 * 验证码
		 */
		captcha(data?: any): Promise<any>;

		/**
		 * 登录
		 */
		login(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 实体信息与路径
		 */
		eps(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			refreshToken: string;
			captcha: string;
			login: string;
			html: string;
			eps: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			refreshToken: boolean;
			captcha: boolean;
			login: boolean;
			html: boolean;
			eps: boolean;
		};

		request: Service["request"];
	}

	interface BaseSysDepartment {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 排序
		 */
		order(data?: any): Promise<any>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysDepartmentEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysDepartmentEntity[];
			[key: string]: any;
		}>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysDepartmentEntity>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			order: string;
			list: string;
			page: string;
			info: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			order: boolean;
			list: boolean;
			page: boolean;
			info: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface BaseSysLog {
		/**
		 * 日志保存时间
		 */
		setKeep(data?: any): Promise<any>;

		/**
		 * 获得日志保存时间
		 */
		getKeep(data?: any): Promise<any>;

		/**
		 * 清理
		 */
		clear(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysLogEntity[];
			[key: string]: any;
		}>;

		/**
		 * 权限标识
		 */
		permission: { setKeep: string; getKeep: string; clear: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { setKeep: boolean; getKeep: boolean; clear: boolean; page: boolean };

		request: Service["request"];
	}

	interface BaseSysMenu {
		/**
		 * 创建代码
		 */
		create(data?: any): Promise<any>;

		/**
		 * 导出
		 */
		export(data?: any): Promise<any>;

		/**
		 * 导入
		 */
		import(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 解析
		 */
		parse(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysMenuEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysMenuEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysMenuEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			create: string;
			export: string;
			import: string;
			delete: string;
			update: string;
			parse: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			create: boolean;
			export: boolean;
			import: boolean;
			delete: boolean;
			update: boolean;
			parse: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface BaseSysParam {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 获得参数值
		 */
		data(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysParamEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysParamEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			html: string;
			data: string;
			info: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			html: boolean;
			data: boolean;
			info: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface BaseSysRole {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysRoleEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysRoleEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysRoleEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface BaseSysUser {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 移动部门
		 */
		move(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysUserEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysUserEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysUserEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			move: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			move: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface DemoGoods {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DemoGoodsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DemoGoodsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DemoGoodsEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface DemoTenant {
		/**
		 * 局部不使用多租户
		 */
		noTenant(data?: any): Promise<any>;

		/**
		 * 不使用多租户
		 */
		noUse(data?: any): Promise<any>;

		/**
		 * use
		 */
		use(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { noTenant: string; noUse: string; use: string };

		/**
		 * 权限状态
		 */
		_permission: { noTenant: boolean; noUse: boolean; use: boolean };

		request: Service["request"];
	}

	interface DictAddress {
		/**
		 * addressInfoService
		 */
		addressInfoService(data?: any): Promise<any>;

		/**
		 * getAllDistricts
		 */
		getAllDistricts(data?: any): Promise<any>;

		/**
		 * listProvince
		 */
		listProvince(data?: any): Promise<any>;

		/**
		 * checkCache
		 */
		checkCache(data?: any): Promise<any>;

		/**
		 * listCity
		 */
		listCity(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictAddressEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictAddressEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DictAddressEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			addressInfoService: string;
			getAllDistricts: string;
			listProvince: string;
			checkCache: string;
			listCity: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			addressInfoService: boolean;
			getAllDistricts: boolean;
			listProvince: boolean;
			checkCache: boolean;
			listCity: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface DictInfo {
		/**
		 * 通过id获取字典name
		 */
		getName(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得所有字典类型
		 */
		types(data?: any): Promise<any>;

		/**
		 * 获得字典数据
		 */
		data(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DictInfoEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			getName: string;
			delete: string;
			update: string;
			types: string;
			data: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			getName: boolean;
			delete: boolean;
			update: boolean;
			types: boolean;
			data: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface DictType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DictTypeEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface EtiologyComponent {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<StoneComponentEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<StoneComponentEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: StoneComponentEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface EtiologyInfo {
		/**
		 * selectMuaPatient
		 */
		selectMuaPatient(data?: any): Promise<any>;

		/**
		 * findBySwlNo
		 */
		findBySwlNo(data?: any): Promise<any>;

		/**
		 * findById
		 */
		findById(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MuaInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MuaInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: MuaInfoEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			selectMuaPatient: string;
			findBySwlNo: string;
			findById: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			selectMuaPatient: boolean;
			findBySwlNo: boolean;
			findById: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface EtiologyMua {
		/**
		 * getMuaContent
		 */
		getMuaContent(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MuaContentEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MuaContentEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: MuaContentEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			getMuaContent: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			getMuaContent: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface EtiologyMuaItems {
		/**
		 * updateMuaItemsUrineType
		 */
		updateMuaItemsUrineType(data?: any): Promise<any>;

		/**
		 * updateMuaItemsTestTime
		 */
		updateMuaItemsTestTime(data?: any): Promise<any>;

		/**
		 * updateMuaResultOrder
		 */
		updateMuaResultOrder(data?: any): Promise<any>;

		/**
		 * toMuaDataAnalysis
		 */
		toMuaDataAnalysis(data?: any): Promise<any>;

		/**
		 * deleteMuaAnalysis
		 */
		deleteMuaAnalysis(data?: any): Promise<any>;

		/**
		 * getDiagnosticList
		 */
		getDiagnosticList(data?: any): Promise<any>;

		/**
		 * getHisReportMain
		 */
		getHisReportMain(data?: any): Promise<any>;

		/**
		 * getMuaTreatment
		 */
		getMuaTreatment(data?: any): Promise<any>;

		/**
		 * queryModuleCode
		 */
		queryModuleCode(data?: any): Promise<any>;

		/**
		 * getMuaAnalysis
		 */
		getMuaAnalysis(data?: any): Promise<any>;

		/**
		 * updateMuaOrder
		 */
		updateMuaOrder(data?: any): Promise<any>;

		/**
		 * getHisReportMx
		 */
		getHisReportMx(data?: any): Promise<any>;

		/**
		 * toMuaAnalysis
		 */
		toMuaAnalysis(data?: any): Promise<any>;

		/**
		 * componentList
		 */
		componentList(data?: any): Promise<any>;

		/**
		 * getMuaResult
		 */
		getMuaResult(data?: any): Promise<any>;

		/**
		 * unBindHisLab
		 */
		unBindHisLab(data?: any): Promise<any>;

		/**
		 * toMuaResult
		 */
		toMuaResult(data?: any): Promise<any>;

		/**
		 * getMuaGuide
		 */
		getMuaGuide(data?: any): Promise<any>;

		/**
		 * bindHisLab
		 */
		bindHisLab(data?: any): Promise<any>;

		/**
		 * queryRag
		 */
		queryRag(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MuaItemsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MuaItemsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: MuaItemsEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateMuaItemsUrineType: string;
			updateMuaItemsTestTime: string;
			updateMuaResultOrder: string;
			toMuaDataAnalysis: string;
			deleteMuaAnalysis: string;
			getDiagnosticList: string;
			getHisReportMain: string;
			getMuaTreatment: string;
			queryModuleCode: string;
			getMuaAnalysis: string;
			updateMuaOrder: string;
			getHisReportMx: string;
			toMuaAnalysis: string;
			componentList: string;
			getMuaResult: string;
			unBindHisLab: string;
			toMuaResult: string;
			getMuaGuide: string;
			bindHisLab: string;
			queryRag: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateMuaItemsUrineType: boolean;
			updateMuaItemsTestTime: boolean;
			updateMuaResultOrder: boolean;
			toMuaDataAnalysis: boolean;
			deleteMuaAnalysis: boolean;
			getDiagnosticList: boolean;
			getHisReportMain: boolean;
			getMuaTreatment: boolean;
			queryModuleCode: boolean;
			getMuaAnalysis: boolean;
			updateMuaOrder: boolean;
			getHisReportMx: boolean;
			toMuaAnalysis: boolean;
			componentList: boolean;
			getMuaResult: boolean;
			unBindHisLab: boolean;
			toMuaResult: boolean;
			getMuaGuide: boolean;
			bindHisLab: boolean;
			queryRag: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlInfo {
		/**
		 * generateSerialNumber
		 */
		generateSerialNumber(data?: any): Promise<any>;

		/**
		 * convertToRealSwlNo
		 */
		convertToRealSwlNo(data?: any): Promise<any>;

		/**
		 * selectSwlPatient
		 */
		selectSwlPatient(data?: any): Promise<any>;

		/**
		 * findSwlRegister
		 */
		findSwlRegister(data?: any): Promise<any>;

		/**
		 * generateSwlNo
		 */
		generateSwlNo(data?: any): Promise<any>;

		/**
		 * findPatient
		 */
		findPatient(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlRegisterEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlRegisterEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlRegisterEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			generateSerialNumber: string;
			convertToRealSwlNo: string;
			selectSwlPatient: string;
			findSwlRegister: string;
			generateSwlNo: string;
			findPatient: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			generateSerialNumber: boolean;
			convertToRealSwlNo: boolean;
			selectSwlPatient: boolean;
			findSwlRegister: boolean;
			generateSwlNo: boolean;
			findPatient: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlTreatment {
		/**
		 * findBySwlNo
		 */
		findBySwlNo(data?: any): Promise<any>;

		/**
		 * agestats
		 */
		agestats(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlTreatmentEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlTreatmentEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlTreatmentEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			findBySwlNo: string;
			agestats: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			findBySwlNo: boolean;
			agestats: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlCurative {
		/**
		 * findBySwlNo
		 */
		findBySwlNo(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlCurativeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlCurativeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlCurativeEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			findBySwlNo: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			findBySwlNo: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlCurrent {
		/**
		 * findBySwlNo
		 */
		findBySwlNo(data?: any): Promise<any>;

		/**
		 * deleteById
		 */
		deleteById(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlCurrentHistoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlCurrentHistoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlCurrentHistoryEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			findBySwlNo: string;
			deleteById: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			findBySwlNo: boolean;
			deleteById: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlDiagnosis {
		/**
		 * findDiagnosisBySwlno
		 */
		findDiagnosisBySwlno(data?: any): Promise<any>;

		/**
		 * toLczd
		 */
		toLczd(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlDiagnosisEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlDiagnosisEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlDiagnosisEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			findDiagnosisBySwlno: string;
			toLczd: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			findDiagnosisBySwlno: boolean;
			toLczd: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlExam {
		/**
		 * findExamBySwlno
		 */
		findExamBySwlno(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlImagingExamEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlImagingExamEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlImagingExamEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			findExamBySwlno: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			findExamBySwlno: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlFamily {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BusFamilyHistoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BusFamilyHistoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BusFamilyHistoryEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlFuture {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlFutureFollowupEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlFutureFollowupEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlFutureFollowupEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlLab {
		/**
		 * findItemCommonResult
		 */
		findItemCommonResult(data?: any): Promise<any>;

		/**
		 * saveLabData
		 */
		saveLabData(data?: any): Promise<any>;

		/**
		 * getLabData
		 */
		getLabData(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * types
		 */
		types(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlLabResultDetailEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlLabResultDetailEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlLabResultDetailEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			findItemCommonResult: string;
			saveLabData: string;
			getLabData: string;
			delete: string;
			update: string;
			types: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			findItemCommonResult: boolean;
			saveLabData: boolean;
			getLabData: boolean;
			delete: boolean;
			update: boolean;
			types: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlMenstrual {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BusMenstrualMarriageHistoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BusMenstrualMarriageHistoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BusMenstrualMarriageHistoryEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlNear {
		/**
		 * findCsBySwlNo
		 */
		findCsBySwlNo(data?: any): Promise<any>;

		/**
		 * findQsBySwlNo
		 */
		findQsBySwlNo(data?: any): Promise<any>;

		/**
		 * findBySwlNo
		 */
		findBySwlNo(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlNearFollowupEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlNearFollowupEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlNearFollowupEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			findCsBySwlNo: string;
			findQsBySwlNo: string;
			findBySwlNo: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			findCsBySwlNo: boolean;
			findQsBySwlNo: boolean;
			findBySwlNo: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlPastmedical {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BusPastMedicalHistoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BusPastMedicalHistoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BusPastMedicalHistoryEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlPaststone {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BusPastStoneHistoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BusPastStoneHistoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BusPastStoneHistoryEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlPersonal {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BusPersonalHistoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BusPersonalHistoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BusPersonalHistoryEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SwlVital {
		/**
		 * deleteById
		 */
		deleteById(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SwlVitalSignsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SwlVitalSignsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SwlVitalSignsEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			deleteById: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			deleteById: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface ImgexamInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ImgExamEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ImgExamEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: ImgExamEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface InterfaceVpatient {
		/**
		 * getTodayRegister
		 */
		getTodayRegister(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<VPatientInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<VPatientInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: VPatientInfoEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			getTodayRegister: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			getTodayRegister: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeDiagnosticGroup {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DiagnosticRuleGroupEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DiagnosticRuleGroupEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DiagnosticRuleGroupEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeDiagnosticInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DiagnosticEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DiagnosticEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DiagnosticEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeDiagnosticRecommendations {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DiagnosticRecommendationsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DiagnosticRecommendationsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DiagnosticRecommendationsEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeDiagnosticRule {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DiagnosticRuleEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DiagnosticRuleEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DiagnosticRuleEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeExam {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ExamTemplateEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ExamTemplateEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: ExamTemplateEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeHisdz {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SystemItemHisdzEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SystemItemHisdzEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SystemItemHisdzEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeItemcs {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SystemItemCsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SystemItemCsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SystemItemCsEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeItems {
		/**
		 * findGroup
		 */
		findGroup(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SystemItemEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SystemItemEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SystemItemEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			findGroup: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			findGroup: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeReference {
		/**
		 * itemReference
		 */
		itemReference(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ItemReferenceEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ItemReferenceEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: ItemReferenceEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			itemReference: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			itemReference: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeResult {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ItemCommonResultEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ItemCommonResultEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: ItemCommonResultEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeTempdetail {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<KnowledgeTemplateDetailEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<KnowledgeTemplateDetailEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: KnowledgeTemplateDetailEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface KnowledgeTempmain {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<KnowledgeTemplateMainEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<KnowledgeTemplateMainEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: KnowledgeTemplateMainEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface MachineInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MachineMaintainEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MachineMaintainEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: MachineMaintainEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface PatientHistoryQuestionnaire {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<HistoryQuestionnaireEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: HistoryQuestionnaireEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; info: string; page: string; add: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface PatientInfo {
		/**
		 * patientInfoService
		 */
		patientInfoService(data?: any): Promise<any>;

		/**
		 * generateCaseNumber
		 */
		generateCaseNumber(data?: any): Promise<any>;

		/**
		 * getByPatientNo
		 */
		getByPatientNo(data?: any): Promise<any>;

		/**
		 * getStatistics
		 */
		getStatistics(data?: any): Promise<any>;

		/**
		 * checkIdCard
		 */
		checkIdCard(data?: any): Promise<any>;

		/**
		 * checkMobile
		 */
		checkMobile(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PatientInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PatientInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: PatientInfoEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			patientInfoService: string;
			generateCaseNumber: string;
			getByPatientNo: string;
			getStatistics: string;
			checkIdCard: string;
			checkMobile: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			patientInfoService: boolean;
			generateCaseNumber: boolean;
			getByPatientNo: boolean;
			getStatistics: boolean;
			checkIdCard: boolean;
			checkMobile: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface PatientQuestionnaire {
		/**
		 * getQuestionnaireAnswerById
		 */
		getQuestionnaireAnswerById(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PatientQuestionnaireEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PatientQuestionnaireEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: PatientQuestionnaireEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			getQuestionnaireAnswerById: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			getQuestionnaireAnswerById: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface PluginInfo {
		/**
		 * 安装插件
		 */
		install(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PluginInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: PluginInfoEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			install: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			install: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface QuestionnaireAnswer {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AnswerEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AnswerEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: AnswerEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface QuestionnaireAnswerSheet {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AnswerSheetEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AnswerSheetEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: AnswerSheetEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface QuestionnaireOption {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<OptionEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<OptionEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: OptionEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface QuestionnaireQuestion {
		/**
		 * updateSortById
		 */
		updateSortById(data?: any): Promise<any>;

		/**
		 * saveQuestions
		 */
		saveQuestions(data?: any): Promise<any>;

		/**
		 * deleteById
		 */
		deleteById(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<QuestionEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<QuestionEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: QuestionEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			updateSortById: string;
			saveQuestions: string;
			deleteById: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			updateSortById: boolean;
			saveQuestions: boolean;
			deleteById: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface QuestionnaireQuestionnaire {
		/**
		 * questionsWithOptions
		 */
		questionsWithOptions(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<QuestionnaireEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<QuestionnaireEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: QuestionnaireEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			questionsWithOptions: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			questionsWithOptions: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface RecycleData {
		/**
		 * 恢复数据
		 */
		restore(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RecycleDataEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: RecycleDataEntity[];
			[key: string]: any;
		}>;

		/**
		 * 权限标识
		 */
		permission: { restore: string; info: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { restore: boolean; info: boolean; page: boolean };

		request: Service["request"];
	}

	interface SecondExample {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SecondExampleEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SecondExampleEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SecondExampleEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SpaceInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SpaceInfoEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface SpaceType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SpaceTypeEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface StatInfo {
		/**
		 * getComponentLocationStatColumn
		 */
		getComponentLocationStatColumn(data?: any): Promise<any>;

		/**
		 * getTreatmentLocationStatColumn
		 */
		getTreatmentLocationStatColumn(data?: any): Promise<any>;

		/**
		 * getComponentLocationStat
		 */
		getComponentLocationStat(data?: any): Promise<any>;

		/**
		 * getTreatmentLocationStat
		 */
		getTreatmentLocationStat(data?: any): Promise<any>;

		/**
		 * getComponentPercentStat
		 */
		getComponentPercentStat(data?: any): Promise<any>;

		/**
		 * getComponentWeightStat
		 */
		getComponentWeightStat(data?: any): Promise<any>;

		/**
		 * getComponentAgeStat
		 */
		getComponentAgeStat(data?: any): Promise<any>;

		/**
		 * getTreatmentAgeStat
		 */
		getTreatmentAgeStat(data?: any): Promise<any>;

		/**
		 * getComponentStat
		 */
		getComponentStat(data?: any): Promise<any>;

		/**
		 * getCurativeStat
		 */
		getCurativeStat(data?: any): Promise<any>;

		/**
		 * getSwlWorkStat
		 */
		getSwlWorkStat(data?: any): Promise<any>;

		/**
		 * getSwlAllStat
		 */
		getSwlAllStat(data?: any): Promise<any>;

		/**
		 * getSwlStat
		 */
		getSwlStat(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			getComponentLocationStatColumn: string;
			getTreatmentLocationStatColumn: string;
			getComponentLocationStat: string;
			getTreatmentLocationStat: string;
			getComponentPercentStat: string;
			getComponentWeightStat: string;
			getComponentAgeStat: string;
			getTreatmentAgeStat: string;
			getComponentStat: string;
			getCurativeStat: string;
			getSwlWorkStat: string;
			getSwlAllStat: string;
			getSwlStat: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			getComponentLocationStatColumn: boolean;
			getTreatmentLocationStatColumn: boolean;
			getComponentLocationStat: boolean;
			getTreatmentLocationStat: boolean;
			getComponentPercentStat: boolean;
			getComponentWeightStat: boolean;
			getComponentAgeStat: boolean;
			getTreatmentAgeStat: boolean;
			getComponentStat: boolean;
			getCurativeStat: boolean;
			getSwlWorkStat: boolean;
			getSwlAllStat: boolean;
			getSwlStat: boolean;
		};

		request: Service["request"];
	}

	interface TaskInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 开始
		 */
		start(data?: any): Promise<any>;

		/**
		 * 执行一次
		 */
		once(data?: any): Promise<any>;

		/**
		 * 停止
		 */
		stop(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TaskInfoEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: TaskInfoEntity[];
			[key: string]: any;
		}>;

		/**
		 * 日志
		 */
		log(data?: any): Promise<any>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			start: string;
			once: string;
			stop: string;
			info: string;
			page: string;
			log: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			start: boolean;
			once: boolean;
			stop: boolean;
			info: boolean;
			page: boolean;
			log: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface UrsInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UrsRegisterEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UrsRegisterEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: UrsRegisterEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface UserAddress {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserAddressEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserAddressEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: UserAddressEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface UserInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: UserInfoEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface VersionInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SysVersionEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SysVersionEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SysVersionEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	interface VibrationInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<VibrationInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<VibrationInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: VibrationInfoEntity[];
			[key: string]: any;
		}>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Service["request"];
	}

	type Service = {
		/**
		 * 基础请求
		 */
		request(options?: {
			url: string;
			method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
			data?: any;
			params?: any;
			headers?: {
				authorization?: string;
				[key: string]: any;
			};
			timeout?: number;
			proxy?: boolean;
			[key: string]: any;
		}): Promise<any>;

		ai: { info: AiInfo };
		appointment: { info: AppointmentInfo };
		base: {
			coding: BaseCoding;
			comm: BaseComm;
			dbHealth: BaseDbHealth;
			open: BaseOpen;
			sys: {
				department: BaseSysDepartment;
				log: BaseSysLog;
				menu: BaseSysMenu;
				param: BaseSysParam;
				role: BaseSysRole;
				user: BaseSysUser;
			};
		};
		demo: { goods: DemoGoods; tenant: DemoTenant };
		dict: { address: DictAddress; info: DictInfo; type: DictType };
		etiology: {
			component: EtiologyComponent;
			info: EtiologyInfo;
			mua: EtiologyMua;
			muaItems: EtiologyMuaItems;
		};
		swl: {
			info: SwlInfo;
			treatment: SwlTreatment;
			curative: SwlCurative;
			current: SwlCurrent;
			diagnosis: SwlDiagnosis;
			exam: SwlExam;
			family: SwlFamily;
			future: SwlFuture;
			lab: SwlLab;
			menstrual: SwlMenstrual;
			near: SwlNear;
			pastmedical: SwlPastmedical;
			paststone: SwlPaststone;
			personal: SwlPersonal;
			vital: SwlVital;
		};
		imgexam: { info: ImgexamInfo };
		interface: { vpatient: InterfaceVpatient };
		knowledge: {
			diagnostic: {
				group: KnowledgeDiagnosticGroup;
				info: KnowledgeDiagnosticInfo;
				recommendations: KnowledgeDiagnosticRecommendations;
				rule: KnowledgeDiagnosticRule;
			};
			exam: KnowledgeExam;
			hisdz: KnowledgeHisdz;
			itemcs: KnowledgeItemcs;
			items: KnowledgeItems;
			reference: KnowledgeReference;
			result: KnowledgeResult;
			tempdetail: KnowledgeTempdetail;
			tempmain: KnowledgeTempmain;
		};
		machine: { info: MachineInfo };
		patient: {
			historyQuestionnaire: PatientHistoryQuestionnaire;
			info: PatientInfo;
			questionnaire: PatientQuestionnaire;
		};
		plugin: { info: PluginInfo };
		questionnaire: {
			answer: QuestionnaireAnswer;
			answerSheet: QuestionnaireAnswerSheet;
			option: QuestionnaireOption;
			question: QuestionnaireQuestion;
			questionnaire: QuestionnaireQuestionnaire;
		};
		recycle: { data: RecycleData };
		second: { example: SecondExample };
		space: { info: SpaceInfo; type: SpaceType };
		stat: { info: StatInfo };
		task: { info: TaskInfo };
		urs: { info: UrsInfo };
		user: { address: UserAddress; info: UserInfo };
		version: { info: VersionInfo };
		vibration: { info: VibrationInfo };
	};

	type DictKey =
		| "natives"
		| "sex"
		| "education"
		| "health_status"
		| "marriage"
		| "position"
		| "majorin"
		| "polity"
		| "compose_location"
		| "compose_mothed"
		| "near_compose"
		| "family_people"
		| "family_othersick"
		| "lithiasis_diagnose"
		| "lithiasis_process"
		| "lithiasis_cureresult"
		| "female_menarche"
		| "female_cycle"
		| "female_menstrual"
		| "female_procreate"
		| "female_misbirth"
		| "current_sjtpark"
		| "current_sjttime"
		| "current_mxyt"
		| "current_sjtlook"
		| "current_xuen"
		| "current_painkn"
		| "current_curemothed"
		| "body_t"
		| "body_abdomenache"
		| "body_abdomenoisition"
		| "body_kidneyache"
		| "body_kidneydegree"
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| "image_kub"
		| "image_kubsize"
		| "image_num"
		| "image_klocition"
		| "image_ulocition"
		| "image_utlocition"
		| "medical_curepart1"
		| "medical_curepart2"
		| "medical_fzzl"
		| "medical_pre"
		| "medical_bracket"
		| "medical_post"
		| "medical_locatemeth"
		| "medical_striketimes"
		| "medical_feedback"
		| "medical_tengtong"
		| "medical_machine1"
		| "medical_machine2"
		| "near_hematuria"
		| "near_lumbago"
		| "near_syndromesx"
		| "near_eductionsum"
		| "near_assistcure1"
		| "near_SWLassistcuring"
		| "near_SWLassistcured"
		| "near_SWLAfterAssistcure"
		| "near_avidininfect"
		| ""
		| "near_analyse2"
		| "near_result"
		| "future_swlcure"
		| "future_nonecure"
		| "future_bp"
		| "future_lifthabit"
		| "future_waterchg"
		| "future_dutychg"
		| "future_dutyrisk"
		| ""
		| ""
		| ""
		| ""
		| "duty"
		| "item_type"
		| "item_group"
		| "past_sickname"
		| "past_curestatus"
		| ""
		| "metabolic-anatomical"
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| "sys_module"
		| ""
		| "appointment_time"
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| ""
		| "itemtype"
		| ""
		| "etiology_recomm"
		| "patient_info"
		| "past_history"
		| "lithiasis_history"
		| "personal_history"
		| "female_history"
		| "current_history"
		| "body_check"
		| "lisresult_list"
		| "image_check"
		| "diagnose"
		| "medical_card"
		| "near_visit"
		| "curative_visit"
		| "future_visit"
		| "physicsvibration"
		| "pvnearvisit"
		| "compose_regiest"
		| "common_data"
		| "appointment_record"
		| "form_type"
		| "labTestType"
		| "labTestGroup"
		| "labTestItem"
		| "treatmentPlan"
		| "machineType"
		| "maintainType"
		| "ct_near_compose";
}
