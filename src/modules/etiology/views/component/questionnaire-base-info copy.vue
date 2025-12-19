<!-- 
  历史问卷基础信息组件 
  功能：
  1. 处理历史问卷信息（HistoryQuestionnaireEntity）
  2. 提供表单展示和编辑
  3. 数据双向绑定
  根据 index.vue 调整字段和组件类型
-->
<template>
	<div class="questionnaire-base-info">
		<!-- 基础信息表单 -->
		<el-form ref="formRef" :model="form" label-position="top" class="cl-form">
			<!-- 基本信息 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="4">
					<el-form-item label="档案号" class="cl-form-item">
						<el-input
							v-model="form.patientNo"
							placeholder="请输入档案号"
							:disabled="mode === 'info' || mode === 'update'"
							@blur="handlePatientNoBlur"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="4" v-if="mode !== 'add'">
					<el-form-item label="填报日期" class="cl-form-item">
						<el-date-picker
							v-model="form.fillDate"
							type="date"
							value-format="YYYY-MM-DD"
							placeholder="选择填报日期"
							style="width: 100%"
							:disabled="mode === 'info' || mode === 'update'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="本市居住时间" class="cl-form-item">
						<el-date-picker
							v-model="form.localResidenceYears"
							type="year"
							value-format="YYYY"
							placeholder="选择年份"
							style="width: 100%"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="职业类别" class="cl-form-item">
						<el-select
							v-model="form.occupationType"
							placeholder="请选择"
							style="width: 100%"
							:disabled="mode === 'info'"
						>
							<el-option label="室外工作" value="室外工作" />
							<el-option label="办公室" value="办公室" />
							<el-option label="工业" value="工业" />
							<el-option label="农林" value="农林" />
							<el-option label="运输" value="运输" />
							<el-option label="其他 (学生、退休)" value="其他 (学生、退休)" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="身高" class="cl-form-item">
						<el-input
							v-model="form.height"
							type="number"
							placeholder="单位：cm"
							:disabled="mode === 'info'"
							@input="handleHeightChange"
						>
							<template #append>cm</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="体重" class="cl-form-item">
						<el-input
							v-model="form.weight"
							type="number"
							placeholder="单位：kg"
							:disabled="mode === 'info'"
							@input="handleWeightInput"
						>
							<template #append>kg</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 饮水相关 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item
						label="液体摄入："
						class="cl-form-item"
						style="font-size: 14px; color: #999; font-weight: bold"
					></el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item
						label="每天摄入液体量(包括水、茶、饮料、汤等液体)"
						class="cl-form-item"
					>
						<el-space>
							<el-input
								v-model="form.dailyFluidIntake"
								type="number"
								placeholder="单位ml"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.fluidCupCount || '0') > 0
								"
								@focus="form.fluidCupCount = ''"
							>
								<template #append>ml</template>
							</el-input>
							<span>或相当于一次性杯</span>
							<el-input
								v-model="form.fluidCupCount"
								type="number"
								placeholder="杯数"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.dailyFluidIntake || '0') > 0
								"
								@focus="form.dailyFluidIntake = ''"
							>
								<template #append>杯</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="饮水类型" class="cl-form-item">
						<el-checkbox-group
							v-model="form.drinkingWaterTypes"
							:disabled="mode === 'info'"
						>
							<el-checkbox value="矿泉水">矿泉水</el-checkbox>
							<el-checkbox value="纯净水">纯净水</el-checkbox>
							<el-checkbox value="自来水">自来水</el-checkbox>
							<el-checkbox value="汽水">汽水</el-checkbox>
							<el-checkbox value="果汁">果汁</el-checkbox>
							<el-checkbox value="奶茶">奶茶</el-checkbox>
							<el-checkbox value="其他">其他</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col
					:span="8"
					v-if="form.drinkingWaterTypes && form.drinkingWaterTypes.includes('其他')"
				>
					<el-form-item label="其他饮水类型" class="cl-form-item">
						<el-input
							v-model="form.otherDrinkingWaterType"
							placeholder="请说明"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 饮茶相关 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item label="是否饮茶" class="cl-form-item">
						<el-radio-group v-model="form.isDrinkTea" :disabled="mode === 'info'">
							<el-radio value="否">否</el-radio>
							<el-radio value="每天以茶代水">每天以茶代水</el-radio>
							<el-radio value="饮茶饮水量各占一半">饮茶饮水量各占一半</el-radio>
							<el-radio value="茶量是饮水量的1/3">茶量是饮水量的1/3</el-radio>
							<el-radio value="偶尔(多日1次)">偶尔(多日1次)</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="24" v-if="form.isDrinkTea && form.isDrinkTea !== '否'">
					<el-form-item label="饮茶种类" class="cl-form-item">
						<el-checkbox-group v-model="form.teaTypes" :disabled="mode === 'info'">
							<el-checkbox value="绿茶"
								>绿茶（龙井、碧螺春、黄山毛峰、六安瓜片、都匀毛尖、信阳毛尖、庐山云雾、太平猴魁、恩施玉露）</el-checkbox
							>
							<el-checkbox value="红茶"
								>红茶（祁门红茶、正山小种、滇红（云南红茶）、英红九号、紫金萱）</el-checkbox
							>
							<el-checkbox value="乌龙茶"
								>乌龙茶（安溪铁观音、大红袍、凤凰单丛、冻顶乌龙、肉桂、水仙、大红袍等）</el-checkbox
							>
							<el-checkbox value="黑茶"
								>黑茶（云南普洱茶、广西六堡茶、雅安藏茶、安化黑茶）</el-checkbox
							>
							<el-checkbox value="白茶"
								>白茶（白毫银针、白牡丹、福鼎白茶等）</el-checkbox
							>
							<el-checkbox value="黄茶"
								>黄茶（君山银针、蒙顶黄芽、霍山黄芽等）</el-checkbox
							>
							<el-checkbox value="花茶"
								>花茶（茉莉花茶、珠兰花茶、玫瑰花茶等）</el-checkbox
							>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="4" v-if="form.isDrinkTea && form.isDrinkTea !== '否'">
					<el-form-item label="每天摄入茶量" class="cl-form-item">
						<el-input
							v-model="form.dailyTeaIntake"
							type="number"
							placeholder="一次性纸杯约为200ml"
							:disabled="mode === 'info'"
						>
							<template #append>ml</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="form.isDrinkTea && form.isDrinkTea !== '否'">
					<el-form-item label="饮茶习惯" class="cl-form-item">
						<el-radio-group v-model="form.teaStrength" :disabled="mode === 'info'">
							<el-radio value="浓茶">浓茶</el-radio>
							<el-radio value="适中">适中</el-radio>
							<el-radio value="淡茶">淡茶</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="form.isDrinkTea && form.isDrinkTea !== '否'">
					<el-form-item label="茶叶量" class="cl-form-item">
						<el-radio-group v-model="form.teaAmount" :disabled="mode === 'info'">
							<el-radio value="3-5g">3-5g</el-radio>
							<el-radio value="6-10g">6-10g</el-radio>
							<el-radio value="10g以上">10g以上</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 咖啡饮用情况 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item label="是否喝咖啡(100-150ml/杯)" class="cl-form-item">
						<el-radio-group v-model="form.isDrinkCoffee" :disabled="mode === 'info'">
							<el-radio value="否">否</el-radio>
							<el-radio value="1-2杯/月">1-2杯/月</el-radio>
							<el-radio value="1-2杯/周">1-2杯/周</el-radio>
							<el-radio value="1杯/天">1杯/天</el-radio>
							<el-radio value="每天2杯以上">每天2杯以上</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 饮食习惯 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item
						label="饮食习惯："
						class="cl-form-item"
						style="font-size: 14px; color: #999; font-weight: bold"
					></el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="主食" class="cl-form-item">
						<el-checkbox-group v-model="form.mainFoods" :disabled="mode === 'info'">
							<el-checkbox value="米饭">米饭</el-checkbox>
							<el-checkbox value="面食">面食</el-checkbox>
							<el-checkbox value="杂粮">杂粮</el-checkbox>
							<el-checkbox value="薯类">薯类</el-checkbox>
							<el-checkbox value="豆类">豆类</el-checkbox>
							<el-checkbox value="少食主食">少食主食</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="每天主食总量" class="cl-form-item">
						<el-input
							v-model="form.dailyMainFoodAmount"
							placeholder="数量"
							:disabled="mode === 'info'"
						>
							<template #append>小碗（常用饭碗）</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row"> </el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="16">
					<el-form-item label="蔬菜" class="cl-form-item">
						<el-checkbox-group
							v-model="form.vegetables"
							@change="handleVegetablesChange"
							:disabled="mode === 'info'"
						>
							<el-checkbox value="菠菜">菠菜</el-checkbox>
							<el-checkbox value="甜菜">甜菜</el-checkbox>
							<el-checkbox value="苋菜">苋菜</el-checkbox>
							<el-checkbox value="白菜">白菜</el-checkbox>
							<el-checkbox value="菜心">菜心</el-checkbox>
							<el-checkbox value="介兰">介兰</el-checkbox>
							<el-checkbox value="其它叶类蔬菜">其它叶类蔬菜</el-checkbox>
							<el-checkbox value="瓜类">瓜类</el-checkbox>
							<el-checkbox value="其他蔬菜">其他蔬菜</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="每天蔬菜总量" class="cl-form-item">
						<el-space>
							<el-input
								v-model="form.dailyVegetableAmount"
								type="number"
								placeholder="数量"
								style="width: 70%"
								:disabled="
									mode === 'info' ||
									parseInt(form.dailyVegetableAmountBowl || '0') > 0
								"
								@focus="form.dailyVegetableAmountBowl = ''"
							>
								<template #append>两</template>
							</el-input>
							<span>或</span>
							<el-input
								v-model="form.dailyVegetableAmountBowl"
								type="number"
								placeholder="数量"
								style="width: 70%"
								:disabled="
									mode === 'info' ||
									parseInt(form.dailyVegetableAmount || '0') > 0
								"
								@focus="form.dailyVegetableAmount = ''"
							>
								<template #append>碗（常用饭碗）</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="form.vegetables.includes('其他蔬菜')">
					<el-form-item label="其他蔬菜" class="cl-form-item">
						<el-input
							v-model="form.otherVegetables"
							placeholder="请说明"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="肉类" class="cl-form-item">
						<el-checkbox-group
							v-model="form.meats"
							:disabled="mode === 'info'"
							@change="handleMeatsChange"
						>
							<el-checkbox value="畜肉(猪、牛、羊)">畜肉(猪、牛、羊)</el-checkbox>
							<el-checkbox value="禽肉(鸡、鸭)">禽肉(鸡、鸭)</el-checkbox>
							<el-checkbox value="动物内脏">动物内脏</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="每天肉类总量" class="cl-form-item">
						<el-input
							v-model="form.dailyMeatAmount"
							type="number"
							placeholder="数量"
							:disabled="mode === 'info'"
						>
							<template #append>两</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4" v-if="form.meats.includes('动物内脏')">
					<el-form-item label="内脏食用频次" class="cl-form-item">
						<el-input
							v-model="form.animalVisceraFrequency"
							type="number"
							placeholder="数量"
							:disabled="mode === 'info'"
						>
							<template #append>次/周</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="鱼类(常吃的鱼类)" class="cl-form-item">
						<el-checkbox-group
							v-model="form.commonFish"
							:disabled="mode === 'info'"
							@change="handleCommonFishChange"
						>
							<el-checkbox value="皖鱼">皖鱼</el-checkbox>
							<el-checkbox value="鱼">鱼</el-checkbox>
							<el-checkbox value="沙丁鱼">沙丁鱼</el-checkbox>
							<el-checkbox value="鲈鱼">鲈鱼</el-checkbox>
							<el-checkbox value="三文鱼">三文鱼</el-checkbox>
							<el-checkbox value="其他">其他</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="每天鱼类总量" class="cl-form-item">
						<el-input
							v-model="form.dailyFishAmount"
							type="number"
							placeholder="数量"
							:disabled="mode === 'info'"
						>
							<template #append>两</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="form.commonFish.includes('其他')">
					<el-form-item label="其他鱼类" class="cl-form-item">
						<el-input
							v-model="form.otherCommonFish"
							placeholder="请输入"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="贝壳类海鲜" class="cl-form-item">
						<el-space>
							<el-input
								v-model="form.seafoodFrequency"
								type="number"
								placeholder="数量"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.weeklyFoodFrequency || '0') > 0
								"
								@focus="form.weeklyFoodFrequency = ''"
							>
								<template #append>次/周</template>
							</el-input>
							<span>或</span>
							<el-input
								v-model="form.weeklyFoodFrequency"
								type="number"
								placeholder="数量"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.seafoodFrequency || '0') > 0
								"
								@focus="form.seafoodFrequency = ''"
							>
								<template #append>两/周</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col
					:span="8"
					v-if="
						parseInt(form.seafoodFrequency || '0') > 0 ||
						parseInt(form.weeklyFoodFrequency || '0') > 0
					"
				>
					<el-form-item label="常吃的贝壳" class="cl-form-item">
						<el-checkbox-group
							v-model="form.shellfishTypes"
							:disabled="mode === 'info'"
						>
							<el-checkbox value="牡蛎(生蚝)">牡蛎(生蚝)</el-checkbox>
							<el-checkbox value="扇贝">扇贝</el-checkbox>
							<el-checkbox value="花甲">花甲</el-checkbox>
							<el-checkbox value="鲍鱼">鲍鱼</el-checkbox>
							<el-checkbox value="其他">其他</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="鸡蛋" class="cl-form-item">
						<el-space>
							<el-input
								v-model="form.dailyEggAmount"
								placeholder="数量"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.weeklyEggAmount || '0') > 0
								"
								@focus="form.weeklyEggAmount = ''"
							>
								<template #append>个/天</template>
							</el-input>
							<span>或</span>
							<el-input
								v-model="form.weeklyEggAmount"
								placeholder="数量"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.dailyEggAmount || '0') > 0
								"
								@focus="form.dailyEggAmount = ''"
							>
								<template #append>个/周</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="乳制品(牛奶或酸奶)" class="cl-form-item">
						<el-radio-group v-model="form.dairyIntake" :disabled="mode === 'info'">
							<el-radio value="1杯/天" @click="form.weeklyDairyIntake = ''"
								>1杯/天</el-radio
							>
							<el-radio value="2杯/天" @click="form.weeklyDairyIntake = ''"
								>2杯/天</el-radio
							>
							<el-radio value="杯/周">杯/周</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="4" v-if="form.dairyIntake === '杯/周'">
					<el-form-item label="每周杯数" class="cl-form-item">
						<el-input
							v-model="form.weeklyDairyIntake"
							placeholder="数量"
							:disabled="mode === 'info'"
						>
							<template #append>杯/周</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="饮食口味" class="cl-form-item">
						<el-radio-group v-model="form.foodTaste" :disabled="mode === 'info'">
							<el-radio value="清淡">清淡</el-radio>
							<el-radio value="一般">一般</el-radio>
							<el-radio value="偏咸">偏咸</el-radio>
							<el-radio value="甜">甜</el-radio>
							<el-radio value="辣">辣</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="是否食用腌制食品" class="cl-form-item">
						<el-radio-group v-model="form.eatPickledFood" :disabled="mode === 'info'">
							<el-radio value="否">否</el-radio>
							<el-radio value="有">有如咸蛋、咸菜、腊肉腌肉、腌鱼等</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="4" v-if="form.eatPickledFood === '有'">
					<el-form-item label="食用频率" class="cl-form-item">
						<el-input
							v-model="form.pickledFoodFrequency"
							placeholder="数量"
							:disabled="mode === 'info'"
						>
							<template #append>次/周</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 饮酒情况 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="4">
					<el-form-item label="是否饮酒" class="cl-form-item">
						<el-radio-group
							v-model="form.drinkAlcohol"
							:disabled="mode === 'info'"
							@change="handleDrinkAlcoholChange"
						>
							<el-radio value="否">否</el-radio>
							<el-radio value="有">有</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="16" v-if="form.drinkAlcohol === '有'">
					<el-form-item label="饮酒频率" class="cl-form-item">
						<el-space>
							<el-input
								v-model="form.alcoholFrequencyDaily"
								type="number"
								placeholder="数量"
								style="width: 30%"
								:disabled="
									mode === 'info' ||
									parseInt(form.alcoholFrequencyWeekly || '0') > 0 ||
									parseInt(form.alcoholFrequencyMonthly || '0') > 0
								"
								@focus="
									form.alcoholFrequencyWeekly = '';
									form.alcoholFrequencyMonthly = '';
								"
							>
								<template #append>两/天</template>
							</el-input>
							<span>或</span>
							<el-input
								v-model="form.alcoholFrequencyWeekly"
								type="number"
								placeholder="数量"
								style="width: 30%"
								:disabled="
									mode === 'info' ||
									parseInt(form.alcoholFrequencyDaily || '0') > 0 ||
									parseInt(form.alcoholFrequencyMonthly || '0') > 0
								"
								@focus="
									form.alcoholFrequencyDaily = '';
									form.alcoholFrequencyMonthly = '';
								"
							>
								<template #append>两/周</template>
							</el-input>
							<span>或</span>
							<el-input
								v-model="form.alcoholFrequencyMonthly"
								type="number"
								placeholder="数量"
								style="width: 30%"
								:disabled="
									mode === 'info' ||
									parseInt(form.alcoholFrequencyDaily || '0') > 0 ||
									parseInt(form.alcoholFrequencyWeekly || '0') > 0
								"
								@focus="
									form.alcoholFrequencyDaily = '';
									form.alcoholFrequencyWeekly = '';
								"
							>
								<template #append>两/月</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="4" v-if="form.drinkAlcohol === '有'">
					<el-form-item label="饮酒年限" class="cl-form-item">
						<el-input
							v-model="form.alcoholYears"
							type="number"
							placeholder="数量"
							:disabled="mode === 'info'"
						>
							<template #append>年</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" v-if="form.drinkAlcohol === '有'">
					<el-form-item label="饮酒种类" class="cl-form-item">
						<el-radio-group v-model="form.alcoholTypes" :disabled="mode === 'info'">
							<el-radio value="白酒">白酒</el-radio>
							<el-radio value="啤酒">啤酒</el-radio>
							<el-radio value="红酒">红酒</el-radio>
							<el-radio value="黄酒">黄酒</el-radio>
							<el-radio value="洋酒">洋酒</el-radio>
							<el-radio value="其他">其他</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="8" v-if="form.alcoholTypes === '其他' && form.drinkAlcohol === '有'">
					<el-form-item label="其他酒类" class="cl-form-item">
						<el-input
							v-model="form.otherAlcoholTypes"
							placeholder="请说明"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 锻炼情况 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="4">
					<el-form-item label="是否有锻炼" class="cl-form-item">
						<el-radio-group v-model="form.noExercise" :disabled="mode === 'info'">
							<el-radio value="是">是</el-radio>
							<el-radio value="否">否</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12" v-if="form.noExercise === '是'">
					<el-form-item label="锻炼时间" class="cl-form-item">
						<el-space>
							<el-input
								v-model="form.exerciseHoursDaily"
								type="number"
								placeholder="数量"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.exerciseHoursWeekly || '0') > 0
								"
								@focus="form.exerciseHoursWeekly = ''"
							>
								<template #append>小时/天</template>
							</el-input>
							<span>或</span>
							<el-input
								v-model="form.exerciseHoursWeekly"
								type="number"
								placeholder="数量"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.exerciseHoursDaily || '0') > 0
								"
								@focus="form.exerciseHoursDaily = ''"
							>
								<template #append>小时/周</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="form.noExercise === '是'">
					<el-form-item label="锻炼程度" class="cl-form-item">
						<el-radio-group
							v-model="form.exerciseIntensity"
							:disabled="mode === 'info'"
						>
							<el-radio value="无汗">无汗</el-radio>
							<el-radio value="微汗">微汗</el-radio>
							<el-radio value="滴汗">滴汗</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 大便情况 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item
						label="病史资料："
						class="cl-form-item"
						style="font-size: 14px; color: #999; font-weight: bold"
					></el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="大便情况" class="cl-form-item">
						<el-radio-group v-model="form.bowelMovement" :disabled="mode === 'info'">
							<el-radio value="正常(1-2次/天)">正常(1-2次/天)</el-radio>
							<el-radio value="便秘(少于3次/周)">便秘(少于3次/周)</el-radio>
							<el-radio value="腹泻(多于3次/天)">腹泻(多于3次/天)</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="血型" class="cl-form-item">
						<el-radio-group v-model="form.bloodType" :disabled="mode === 'info'">
							<el-radio value="A型">A型</el-radio>
							<el-radio value="B型">B型</el-radio>
							<el-radio value="O型">O型</el-radio>
							<el-radio value="AB型">AB型</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 家族病史 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="家族结石病史" class="cl-form-item">
						<el-checkbox-group
							v-model="form.familyStoneHistory"
							:disabled="mode === 'info'"
							@change="handleFamilyStoneHistoryChange"
						>
							<el-checkbox value="父">父</el-checkbox>
							<el-checkbox value="母">母</el-checkbox>
							<el-checkbox value="祖父母">祖父母</el-checkbox>
							<el-checkbox value="外祖父母">外祖父母</el-checkbox>
							<el-checkbox value="兄弟姐妹">兄弟姐妹</el-checkbox>
							<el-checkbox value="子女">子女</el-checkbox>
							<el-checkbox value="无">无</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="高血压家族史" class="cl-form-item">
						<el-checkbox-group
							v-model="form.hypertensionFamilyHistory"
							:disabled="mode === 'info'"
							@change="handleHypertensionFamilyHistoryChange"
						>
							<el-checkbox value="父">父</el-checkbox>
							<el-checkbox value="母">母</el-checkbox>
							<el-checkbox value="无">无</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="其它遗传疾病史" class="cl-form-item">
						<el-input
							v-model="form.otherGeneticDiseases"
							placeholder="请说明"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 既往病史 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item
						label="既往病史："
						class="cl-form-item"
						style="font-size: 14px; color: #999; font-weight: bold"
					></el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="15" class="form-row">
				<el-col :span="8">
					<el-form-item label="高血压" class="cl-form-item">
						<el-space>
							<el-switch
								v-model="form.hasHypertension"
								:active-value="'有'"
								:inactive-value="''"
								:disabled="mode === 'info'"
								@change="
									() => {
										if (form.hasHypertension !== '有')
											form.hypertensionYears = '';
									}
								"
							/>
							<el-input
								v-if="form.hasHypertension === '有'"
								v-model="form.hypertensionYears"
								type="number"
								placeholder="数量"
								style="width: 70%"
								:disabled="mode === 'info'"
							>
								<template #append>年</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="糖尿病" class="cl-form-item">
						<el-space>
							<el-switch
								v-model="form.hasDiabetes"
								:active-value="'有'"
								:inactive-value="''"
								:disabled="mode === 'info'"
								@change="
									() => {
										if (form.hasDiabetes !== '有') form.diabetesYears = '';
									}
								"
							/>
							<el-input
								v-if="form.hasDiabetes === '有'"
								v-model="form.diabetesYears"
								type="number"
								placeholder="数量"
								style="width: 70%"
								:disabled="mode === 'info'"
							>
								<template #append>年</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="高脂血症" class="cl-form-item">
						<el-space>
							<el-switch
								v-model="form.hasHyperlipidemia"
								:active-value="'有'"
								:inactive-value="''"
								:disabled="mode === 'info'"
								@change="
									() => {
										if (form.hasHyperlipidemia !== '有')
											form.hyperlipidemiaYears = '';
									}
								"
							/>
							<el-input
								v-if="form.hasHyperlipidemia === '有'"
								v-model="form.hyperlipidemiaYears"
								type="number"
								placeholder="数量"
								style="width: 70%"
								:disabled="mode === 'info'"
							>
								<template #append>年</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="8">
					<el-form-item label="冠心病" class="cl-form-item">
						<el-space>
							<el-switch
								v-model="form.hasCoronaryDisease"
								:active-value="'有'"
								:inactive-value="''"
								:disabled="mode === 'info'"
								@change="
									() => {
										if (form.hasCoronaryDisease !== '有')
											form.coronaryDiseaseYears = '';
									}
								"
							/>
							<el-input
								v-if="form.hasCoronaryDisease === '有'"
								v-model="form.coronaryDiseaseYears"
								type="number"
								placeholder="数量"
								style="width: 70%"
								:disabled="mode === 'info'"
							>
								<template #append>年</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="痛风(高尿酸)" class="cl-form-item">
						<el-space>
							<el-switch
								v-model="form.hasGout"
								:active-value="'有'"
								:inactive-value="''"
								:disabled="mode === 'info'"
								@change="
									() => {
										if (form.hasGout !== '有') form.goutYears = '';
									}
								"
							/>
							<el-input
								v-if="form.hasGout === '有'"
								v-model="form.goutYears"
								type="number"
								placeholder="数量"
								style="width: 200px"
								:disabled="mode === 'info'"
							>
								<template #append>年</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="甲状旁腺功能亢进" class="cl-form-item">
						<el-switch
							v-model="form.hasThyroidDisease"
							:active-value="'有'"
							:inactive-value="''"
							:disabled="mode === 'info'"
							@change="
								() => {
									if (form.hasThyroidDisease !== '有')
										form.thyroidDiseaseYears = '';
								}
							"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="4" v-if="form.hasThyroidDisease === '有'">
					<el-form-item label="手术时间" class="cl-form-item">
						<el-date-picker
							v-model="form.thyroidDiseaseYears"
							type="year"
							value-format="YYYY"
							placeholder="选择年份"
							style="width: 100%"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="20">
					<el-form-item label="其他疾病" class="cl-form-item">
						<el-checkbox-group v-model="form.otherDiseases" :disabled="mode === 'info'">
							<el-checkbox value="骨质疏松">骨质疏松</el-checkbox>
							<el-checkbox value="反复泌尿系感染">反复泌尿系感染</el-checkbox>
							<el-checkbox value="神经源性膀胱">神经源性膀胱</el-checkbox>
							<el-checkbox value="肌无力">肌无力</el-checkbox>
							<el-checkbox value="干燥综合征">干燥综合征</el-checkbox>
							<el-checkbox value="结节病">结节病</el-checkbox>
							<el-checkbox value="胃肠道疾病">胃肠道疾病</el-checkbox>
							<el-checkbox value="曾接受过减肥手术">曾接受过减肥手术</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="其他疾病说明" class="cl-form-item">
						<el-input
							v-model="form.otherDiseasesDescription"
							placeholder="请说明"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 日常服用药品 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item
						label="日常服用药品："
						class="cl-form-item"
						style="font-size: 14px; color: #999; font-weight: bold"
					></el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="15" class="form-row">
				<el-col :span="6">
					<el-form-item label="维生素C" class="cl-form-item">
						<el-input
							v-model="form.vitaminC"
							type="number"
							placeholder="mg/天"
							:disabled="mode === 'info'"
						>
							<template #append>mg/天</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="钙片" class="cl-form-item">
						<el-input
							v-model="form.calciumTablets"
							type="number"
							placeholder="mg/天"
							:disabled="mode === 'info'"
						>
							<template #append>mg/天</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="VitD" class="cl-form-item">
						<el-input
							v-model="form.vitaminD"
							type="number"
							placeholder="天"
							:disabled="mode === 'info'"
						>
							<template #append>/天</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="镁剂" class="cl-form-item">
						<el-input
							v-model="form.magnesium"
							type="number"
							placeholder="天"
							:disabled="mode === 'info'"
						>
							<template #append>/天</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="8">
					<el-form-item label="降压药物名称" class="cl-form-item">
						<el-checkbox-group
							v-model="form.antihypertensiveDrugs"
							:disabled="mode === 'info'"
						>
							<el-checkbox value="洛沙坦">洛沙坦</el-checkbox>
							<el-checkbox value="厄贝沙坦">厄贝沙坦</el-checkbox>
							<el-checkbox value="替米沙坦或等沙坦类降压药"
								>替米沙坦或等沙坦类降压药</el-checkbox
							>
							<el-checkbox value="其它降压药">其它降压药</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="降尿酸药物" class="cl-form-item">
						<el-checkbox-group
							v-model="form.antiUricAcidDrugs"
							:disabled="mode === 'info'"
						>
							<el-checkbox value="苯溴马隆">苯溴马隆</el-checkbox>
							<el-checkbox value="非布司他">非布司他</el-checkbox>
							<el-checkbox value="别嘌呤醇">别嘌呤醇</el-checkbox>
							<el-checkbox value="托吡酯(抗癫痫药)">托吡酯(抗癫痫药)</el-checkbox>
							<el-checkbox value="口苯妥英钠(抗癫痫药)"
								>口苯妥英钠(抗癫痫药)</el-checkbox
							>
							<el-checkbox value="乙酰唑胺(青光眼用药)"
								>乙酰唑胺(青光眼用药)</el-checkbox
							>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="近期有无使用下列药物" class="cl-form-item">
						<el-checkbox-group
							v-model="form.otherMedications"
							:disabled="mode === 'info'"
						>
							<el-checkbox value="头孢曲松">头孢曲松</el-checkbox>
							<el-checkbox value="磺胺类抗生素">磺胺类抗生素</el-checkbox>
							<el-checkbox value="氟喹诺酮类">氟喹诺酮类</el-checkbox>
							<el-checkbox value="阿莫西林">阿莫西林</el-checkbox>
							<el-checkbox value="茚地那韦">茚地那韦</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 既往结石病史 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item
						label="既往结石病史："
						class="cl-form-item"
						style="font-size: 14px; color: #999; font-weight: bold"
					></el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="15" class="form-row">
				<el-col :span="12">
					<el-form-item label="初次发病年龄" class="cl-form-item">
						<el-space>
							<el-input
								v-model="form.firstOnsetAge"
								type="number"
								placeholder="数量"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.totalDiseaseYears || '0') > 0
								"
								@focus="form.totalDiseaseYears = ''"
							>
								<template #append>岁</template>
							</el-input>
							<span>或总共</span>
							<el-input
								v-model="form.totalDiseaseYears"
								type="number"
								placeholder="数量"
								style="width: 50%"
								:disabled="
									mode === 'info' || parseInt(form.firstOnsetAge || '0') > 0
								"
								@focus="form.firstOnsetAge = ''"
							>
								<template #append>年</template>
							</el-input>
						</el-space>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="初次发病季节" class="cl-form-item">
						<el-radio-group v-model="form.firstOnsetSeason" :disabled="mode === 'info'">
							<el-radio value="春季">春季</el-radio>
							<el-radio value="夏季">夏季</el-radio>
							<el-radio value="秋季">秋季</el-radio>
							<el-radio value="冬季">冬季</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item label="既往治疗史" class="cl-form-item">
						<el-radio-group
							v-model="form.hasTreatmentHistory"
							:disabled="mode === 'info'"
							@change="handleTreatmentHistoryChange"
						>
							<el-radio value="有">有</el-radio>
							<el-radio value="无">无</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<template v-if="form.hasTreatmentHistory === '有'">
				<el-row :gutter="15" class="form-row">
					<el-col :span="4">
						<el-form-item label="体外碎石" class="cl-form-item">
							<el-input
								v-model="form.extracorporealShockWaveLithotripsy"
								type="number"
								placeholder="数量"
								:disabled="mode === 'info'"
							>
								<template #append>次</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="输尿管镜" class="cl-form-item">
							<el-input
								v-model="form.ureteroscopy"
								type="number"
								placeholder="数量"
								:disabled="mode === 'info'"
							>
								<template #append>次</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="经皮肾镜" class="cl-form-item">
							<el-input
								v-model="form.percutaneousNephrolithotomy"
								type="number"
								placeholder="数量"
								:disabled="mode === 'info'"
							>
								<template #append>次</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="输尿管软镜" class="cl-form-item">
							<el-input
								v-model="form.flexibleUreteroscopy"
								type="number"
								placeholder="数量"
								:disabled="mode === 'info'"
							>
								<template #append>次</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="腹腔镜" class="cl-form-item">
							<el-input
								v-model="form.laparoscopy"
								type="number"
								placeholder="数量"
								:disabled="mode === 'info'"
							>
								<template #append>次</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="开放手术" class="cl-form-item">
							<el-input
								v-model="form.openSurgery"
								type="number"
								placeholder="数量"
								:disabled="mode === 'info'"
							>
								<template #append>次</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="15" class="form-row">
					<el-col :span="4">
						<el-form-item label="最近一次治疗方式" class="cl-form-item">
							<el-input
								v-model="form.latestTreatment"
								placeholder="请输入"
								:disabled="mode === 'info'"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="最近一次治疗时间" class="cl-form-item">
							<el-date-picker
								v-model="form.latestTreatmentTime"
								type="date"
								value-format="YYYY-MM-DD"
								placeholder="选择日期"
								style="width: 100%"
								:disabled="mode === 'info'"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否还残留结石" class="cl-form-item">
							<el-radio-group
								v-model="form.hasResidualStones"
								:disabled="mode === 'info'"
							>
								<el-radio value="是">是</el-radio>
								<el-radio value="否">否</el-radio>
								<el-radio value="不清楚">不清楚</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="自然排石史" class="cl-form-item">
							<el-radio-group
								v-model="form.hasNaturalStoneExpulsion"
								:disabled="mode === 'info'"
							>
								<el-radio value="有">有</el-radio>
								<el-radio value="无">无</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col
						:span="4"
						v-if="
							form.hasNaturalStoneExpulsion === '有' &&
							form.hasTreatmentHistory === '有'
						"
					>
						<el-form-item label="自排次数" class="cl-form-item">
							<el-input
								v-model="form.stoneExpulsionCount"
								type="number"
								placeholder="数量"
								:disabled="mode === 'info'"
							>
								<template #append>次</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</template>

			<el-row :gutter="15" class="form-row">
				<el-col :span="6">
					<el-form-item label="结石成分" class="cl-form-item">
						<el-select
							v-model="form.stoneComposition1"
							placeholder="请选择"
							style="width: 100%"
							:disabled="mode === 'info'"
						>
							<el-option
								v-for="item in nearComposeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="检查时间" class="cl-form-item">
						<el-date-picker
							v-model="form.stoneCheckDate1"
							type="month"
							value-format="YYYY-MM"
							placeholder="选择年月"
							style="width: 100%"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="结石成分" class="cl-form-item">
						<el-select
							v-model="form.stoneComposition2"
							placeholder="请选择"
							style="width: 100%"
							:disabled="mode === 'info'"
						>
							<el-option
								v-for="item in nearComposeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="检查时间" class="cl-form-item">
						<el-date-picker
							v-model="form.stoneCheckDate2"
							type="month"
							value-format="YYYY-MM"
							placeholder="选择年月"
							style="width: 100%"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="结石成分" class="cl-form-item">
						<el-select
							v-model="form.stoneComposition3"
							placeholder="请选择"
							:disabled="mode === 'info'"
						>
							<el-option
								v-for="item in nearComposeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="检查时间" class="cl-form-item">
						<el-date-picker
							v-model="form.stoneCheckDate3"
							type="month"
							value-format="YYYY-MM"
							placeholder="选择年月"
							style="width: 100%"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="结石成分" class="cl-form-item">
						<el-select
							v-model="form.stoneComposition4"
							placeholder="请选择"
							:disabled="mode === 'info'"
						>
							<el-option
								v-for="item in nearComposeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="检查时间" class="cl-form-item">
						<el-date-picker
							v-model="form.stoneCheckDate4"
							type="month"
							value-format="YYYY-MM"
							placeholder="选择年月"
							style="width: 100%"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 备注 -->
			<el-row :gutter="15" class="form-row">
				<el-col :span="24">
					<el-form-item label="备注" class="cl-form-item">
						<el-input
							v-model="form.remark"
							type="textarea"
							:rows="3"
							placeholder="请输入备注信息"
							:disabled="mode === 'info'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
// --- 依赖导入 ---
import { ref, reactive, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { debounce } from 'lodash-es';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';

// 组件名称
defineOptions({
	name: 'questionnaire-base-info'
});

// --- 基础设置 ---
const { service } = useCool();
const { dict } = useDict();

// 字典选项计算属性
const nearComposeOptions = computed<Array<{ label: string; value: any }>>(() => {
	const options = dict.get('near_compose');
	if (Array.isArray(options)) {
		const opts = options.map((item: any) => {
			return { value: String(item.name), label: String(item.name) };
		});
		return opts;
	}
	// 如果是 ComputedRef，获取其值
	if (options && typeof options === 'object' && 'value' in options) {
		const value = (options as any).value;
		const opts = value.map((item: any) => {
			return { value: String(item.name), label: String(item.name) };
		});
		return opts;
	}
	return [];
});

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
const emit = defineEmits(['update:modelValue', 'validate']);

// 表单引用
const formRef = ref<any>(null);

const isValid = ref({ valid: true, message: '' });

// --- 状态管理 ---
// 表单数据
const form = reactive<Record<string, any>>({
	id: '',
	patientNo: '',
	name: '',
	fillDate: '',
	localResidenceYears: '',
	occupationType: '',
	height: '',
	weight: '',
	dailyFluidIntake: '',
	fluidCupCount: '',
	drinkingWaterTypes: [] as string[],
	otherDrinkingWaterType: '',
	isDrinkTea: '',
	dailyTeaIntake: '',
	teaTypes: [] as string[],
	teaStrength: '',
	teaAmount: '',
	isDrinkCoffee: '',
	mainFoods: [] as string[],
	dailyMainFoodAmount: '',
	vegetables: [] as string[],
	otherVegetables: '',
	dailyVegetableAmount: '',
	dailyVegetableAmountBowl: '',
	dailyVegetableBowls: '',
	meats: [] as string[],
	dailyMeatAmount: '',
	commonFish: [] as string[],
	otherCommonFish: '',
	dailyFishAmount: '',
	seafoodFrequency: '',
	weeklyFoodFrequency: '',
	shellfishTypes: [] as string[],
	dailyEggAmount: '',
	weeklyEggAmount: '',
	dairyIntake: '',
	weeklyDairyIntake: '',
	foodTaste: '',
	eatPickledFood: '',
	pickledFoodFrequency: '',
	animalVisceraFrequency: '',
	drinkAlcohol: '',
	alcoholFrequencyDaily: '',
	alcoholFrequencyWeekly: '',
	alcoholFrequencyMonthly: '',
	alcoholYears: '',
	alcoholTypes: '',
	otherAlcoholTypes: '',
	exerciseHoursDaily: '',
	exerciseHoursWeekly: '',
	exerciseIntensity: '',
	noExercise: '',
	bowelMovement: '',
	bloodType: '',
	familyStoneHistory: [] as string[],
	hypertensionFamilyHistory: [] as string[],
	otherGeneticDiseases: '',
	hasHypertension: '',
	hypertensionYears: '',
	hasDiabetes: '',
	diabetesYears: '',
	hasHyperlipidemia: '',
	hyperlipidemiaYears: '',
	hasCoronaryDisease: '',
	coronaryDiseaseYears: '',
	hasGout: '',
	goutYears: '',
	hasTreatmentHistory: '',
	hasThyroidDisease: '',
	thyroidDiseaseYears: '',
	otherDiseases: [] as string[],
	otherDiseasesDescription: '',
	vitaminC: '',
	calciumTablets: '',
	vitaminD: '',
	magnesium: '',
	antihypertensiveDrugs: [] as string[],
	antiUricAcidDrugs: [] as string[],
	otherMedications: [] as string[],
	firstOnsetAge: '',
	totalDiseaseYears: '',
	firstOnsetSeason: '',
	extracorporealShockWaveLithotripsy: '',
	ureteroscopy: '',
	percutaneousNephrolithotomy: '',
	flexibleUreteroscopy: '',
	laparoscopy: '',
	openSurgery: '',
	latestTreatment: '',
	latestTreatmentTime: '',
	hasResidualStones: '',
	hasNaturalStoneExpulsion: '',
	stoneExpulsionCount: '',
	stoneComposition1: '',
	stoneCheckDate1: '',
	stoneComposition2: '',
	stoneCheckDate2: '',
	stoneComposition3: '',
	stoneCheckDate3: '',
	stoneComposition4: '',
	stoneCheckDate4: '',
	remark: ''
});

// 防止循环更新标记
const isUpdatingFromProps = ref(false);

// --- 数据处理函数 ---

/**
 * 处理档案号变化
 */
function handlePatientNoBlur() {
	console.log('档案号变化=' + form.patientNo);
	service.patient.info
		.getByPatientNo({ patientNo: form.patientNo })
		.then(res => {
			if (res) {
				isValid.value.valid = true;
				isValid.value.message = '';
			} else {
				isValid.value.valid = false;
				isValid.value.message = '请输入正确的档案号';
				ElMessage.error('请输入正确的档案号');
				console.log('isValid=', isValid.value);
				return false;
			}
		})
		.catch(err => {
			console.log('患者信息获取失败=', err);
			isValid.value.valid = false;
			isValid.value.message = '患者信息获取失败';
			ElMessage.error('患者信息获取失败');
			return false;
		});
}
/**
 * 处理身高变化
 */
function handleHeightChange(value: any) {
	const strValue = String(value);
	const filteredValue = strValue.replace(/[^0-9]/g, '');
	if (filteredValue !== form.height) {
		form.height = filteredValue;
	}
}

/**
 * 处理体重变化
 */
function handleWeightInput(value: any) {
	const strValue = String(value);
	const filteredValue = strValue.replace(/[^0-9]/g, '');
	if (filteredValue !== form.weight) {
		form.weight = filteredValue;
	}
}

/**
 * 处理蔬菜选择变化
 */
function handleVegetablesChange() {
	if (!form.vegetables.includes('其他蔬菜')) {
		form.otherVegetables = '';
	}
}

/**
 * 处理肉类选择变化
 */
function handleMeatsChange() {
	// 如果选择的肉类中不包含"动物内脏"，则清空内脏食用频次
	if (!form.meats.includes('动物内脏')) {
		form.animalVisceraFrequency = '';
	}
}

/**
 * 处理鱼类选择变化
 */
function handleCommonFishChange() {
	// 如果选择的鱼类中不包含"其他"，则清空其他鱼类输入
	if (!form.commonFish.includes('其他')) {
		form.otherCommonFish = '';
	}
}

/**
 * 处理饮酒变化
 */
function handleDrinkAlcoholChange() {
	if (form.drinkAlcohol !== '有') {
		form.alcoholFrequencyDaily = '';
		form.alcoholFrequencyWeekly = '';
		form.alcoholFrequencyMonthly = '';
		form.alcoholYears = '';
		form.alcoholTypes = '';
		form.otherAlcoholTypes = '';
	}
}

/**
 * 处理家族结石病史变化
 */
function handleFamilyStoneHistoryChange() {
	if (form.familyStoneHistory.includes('无')) {
		form.familyStoneHistory = ['无'];
	} else if (form.familyStoneHistory.length > 0 && form.familyStoneHistory.includes('无')) {
		form.familyStoneHistory = form.familyStoneHistory.filter((item: string) => item !== '无');
	}
}

/**
 * 处理高血压家族史变化
 */
function handleHypertensionFamilyHistoryChange() {
	if (form.hypertensionFamilyHistory.includes('无')) {
		form.hypertensionFamilyHistory = ['无'];
	} else {
		const index = form.hypertensionFamilyHistory.indexOf('无');
		if (index > -1) {
			form.hypertensionFamilyHistory.splice(index, 1);
		}
	}
}

/**
 * 处理治疗史变化
 */
function handleTreatmentHistoryChange() {
	if (form.hasTreatmentHistory === '无') {
		form.extracorporealShockWaveLithotripsy = '';
		form.ureteroscopy = '';
		form.percutaneousNephrolithotomy = '';
		form.flexibleUreteroscopy = '';
		form.laparoscopy = '';
		form.openSurgery = '';
		form.latestTreatment = '';
		form.latestTreatmentTime = '';
		form.hasResidualStones = '';
		form.hasNaturalStoneExpulsion = '';
		form.stoneExpulsionCount = '';
	}
}

// --- 数据监听 ---
// 监听 mode 和 id 变化，如果是新增模式则清空所有数据
watch(
	[() => props.mode, () => props.id],
	([newMode, newId]) => {
		// 如果是新增模式（mode === 'add' 或 id 为 undefined），清空所有数据
		if (newMode === 'add' || newId === undefined) {
			// 设置标记，防止触发更新
			isUpdatingFromProps.value = true;

			try {
				// 重置表单数据
				resetFormData();
			} finally {
				// 延迟重置标记，确保清空操作完成
				nextTick(() => {
					isUpdatingFromProps.value = false;
				});
			}
		}
	},
	{ immediate: true }
);

// 监听modelValue变化，更新表单数据
watch(
	() => props.modelValue,
	async newVal => {
		// 如果是新增模式，不处理 modelValue 的变化
		if (props.mode === 'add') {
			return;
		}

		if (newVal && Object.keys(newVal).length > 0) {
			// 避免重复处理
			if (isUpdatingFromProps.value) return;

			// 设置标记，防止重复更新
			isUpdatingFromProps.value = true;

			try {
				// 如果数据中没有 id，说明数据可能还没有完全更新，等待一下
				console.log('newVal.id=', newVal.id);
				console.log('props.id=', props.id);
				if (!newVal.id && props.id) {
					console.log('数据中缺少 id，等待数据更新...');
					// 延迟一下，等待数据更新
					await nextTick();
					// 如果还是没有 id，直接返回，等待下次更新
					if (!newVal.id && props.id) {
						console.log('数据仍未更新，跳过本次更新');
						return;
					}
				}

				// 重置表单数据
				resetFormData();

				// 更新表单数据
				Object.keys(form).forEach(key => {
					if (newVal[key] !== undefined && newVal[key] !== null) {
						// 处理数组类型
						if (Array.isArray(form[key]) && !Array.isArray(newVal[key])) {
							// 如果后端返回的是字符串，需要转换为数组
							if (typeof newVal[key] === 'string') {
								try {
									form[key] = JSON.parse(newVal[key]);
								} catch {
									form[key] = newVal[key] ? [newVal[key]] : [];
								}
							} else {
								form[key] = [];
							}
						} else {
							form[key] = newVal[key];
						}
					}
				});
			} finally {
				// 完成数据处理，重置标记
				isUpdatingFromProps.value = false;
			}
		}
	},
	{ immediate: true, deep: true }
);

// 重置表单数据
function resetFormData() {
	Object.keys(form).forEach(key => {
		// 特殊字段的默认值
		if (key === 'noExercise') {
			form[key] = '';
		} else if (typeof form[key] === 'number') {
			form[key] = '';
		} else if (Array.isArray(form[key])) {
			form[key] = [];
		} else if (typeof form[key] === 'object' && form[key] !== null) {
			form[key] = '';
		} else {
			form[key] = '';
		}
	});
}

// 监听表单变化，更新modelValue - 使用防抖减少更新频率
const updateModelValue = debounce(newVal => {
	// 如果正在从props更新数据，不触发更新
	if (isUpdatingFromProps.value) return;

	// 创建新对象避免直接修改表单
	const updatedForm = { ...newVal };

	// 仅在数据实际变化时才通知父组件
	emit('update:modelValue', updatedForm);
}, 300);

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
	// 组件挂载时的初始化逻辑
});

// 组件销毁前清理
onBeforeUnmount(() => {
	// 清理表单引用，避免 Element Plus 在销毁时计算 label width 出现 NaN
	if (formRef.value) {
		try {
			formRef.value.clearValidate();
		} catch (e) {
			// 忽略清理错误
		}
	}
});

// 验证表单
function validate() {
	// 基础验证逻辑
	if (form.patientNo === '') {
		isValid.value.valid = false;
		isValid.value.message = '请输入档案号';
		emit('validate', isValid.value);
		return isValid;
	}

	emit('validate', isValid.value);
	console.log('表单验证结果=', isValid.value);
	return isValid;
}

// 导出组件方法，供父组件调用
defineExpose({
	form,
	validate
});
</script>

<style lang="scss" scoped>
.questionnaire-base-info {
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

		.el-select,
		.el-date-picker,
		.el-input,
		.el-input-number {
			width: 100%;
		}

		.el-radio-group,
		.el-checkbox-group {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
		}

		.el-radio,
		.el-checkbox {
			margin-right: 20px;
			margin-bottom: 8px;
		}
	}
}
</style>
