/**
 * 实验室结果分析工具
 * 提供检测结果值与参考范围比较的通用方法
 */

/**
 * 检测结果接口定义
 */
export interface LabResultItem {
	id?: number;
	resultValue: string;
	qualitativeResult: string;
	resultFlag: number;
	resultValue1: string;
	qualitativeResult1: string;
	resultFlag1: number;
	resultValue2: string;
	qualitativeResult2: string;
	resultFlag2: number;
	resultValue3: string;
	qualitativeResult3: string;
	resultFlag3: number;
	resultValue4: string;
	qualitativeResult4: string;
	resultFlag4: number;
	resultValue5: string;
	qualitativeResult5: string;
	resultFlag5: number;
	referenceRange?: string;
	referenceMin: number;
	referenceMax: number;
	[key: string]: any; // 允许其他属性
}

/**
 * 分析结果值，判断是否在参考范围内
 * 分析规则:
 * 1. 如果是数字，与参考的最小值和最大值比较
 * 2. 如果是文本，判断是否包含 "阳" "阴" 等关键字
 * @param row 结果数据行
 * @param newValue 新的结果值
 * @returns 更新后的结果对象
 */
export function analyzeResultValue(row: LabResultItem, newValue: string): LabResultItem {
	if (newValue == null || newValue == '') {
		row.resultValue = '';
		row.qualitativeResult = '';
		row.resultFlag = 0; //0正常  1异常
		return row;
	}

	// 复制行数据，避免副作用
	const updatedRow = { ...row };

	// 先清除异常标记
	updatedRow.qualitativeResult = '';
	updatedRow.resultFlag = 0; //0正常  1异常

	// 确保有新值，且是一个有效的数字
	if (newValue && !isNaN(Number(newValue))) {
		//此处转化为空也变成了0，需要注意
		const resultValue = Number(newValue);
		const referenceMin = Number(updatedRow.referenceMin);
		const referenceMax = Number(updatedRow.referenceMax);

		// 记录日志，便于调试
		//console.log(`数值比较: 值=${resultValue}, 最小=${referenceMin}, 最大=${referenceMax}`);

		// 确保参考范围有效后再进行比较
		if (!isNaN(referenceMin) && !isNaN(referenceMax) && referenceMin > 0 && referenceMax > 0) {
			if (resultValue > referenceMax && referenceMax > 0) {
				//console.log('结果高于正常范围');
				updatedRow.qualitativeResult = '↑';
				updatedRow.resultFlag = 1;
			} else if (resultValue < referenceMin && referenceMin > 0) {
				//console.log('结果低于正常范围');
				updatedRow.qualitativeResult = '↓';
				updatedRow.resultFlag = 1;
			} else {
				//console.log('结果在正常范围内');
				updatedRow.qualitativeResult = ''; // 在正常范围内，清除异常标记
			}
		} else if (!isNaN(referenceMin) && referenceMin > 0 && referenceMax == 0) {
			if (resultValue < referenceMin) {
				//console.log('结果低于正常范围');
				updatedRow.qualitativeResult = '↓';
				updatedRow.resultFlag = 1;
			}
		} else if (!isNaN(referenceMax) && referenceMax > 0 && referenceMin == 0) {
			if (resultValue > referenceMax) {
				//console.log('结果高于正常范围');
				updatedRow.qualitativeResult = '↑';
				updatedRow.resultFlag = 1;
			}
		} else {
			// 可以在这里添加参考范围字符串解析逻辑
			handleReferenceRangeString(updatedRow, resultValue);
		}
	} else {
		// 如果不是数字，进行字符串比较
		const resultValue = newValue;

		//console.log(`字符串比较: 值=${resultValue}, 参考范围=${updatedRow.referenceRange}`);

		if (updatedRow.referenceRange != null && updatedRow.referenceRange !== '') {
			if (updatedRow.referenceRange.includes('阳') && resultValue.includes('阴')) {
				updatedRow.qualitativeResult = '↑';
				updatedRow.resultFlag = 1;
			} else if (updatedRow.referenceRange.includes('阴') && resultValue.includes('阳')) {
				updatedRow.qualitativeResult = '↓';
				updatedRow.resultFlag = 1;
			} else if (resultValue.includes('+')) {
				updatedRow.qualitativeResult = '↓';
				updatedRow.resultFlag = 1;
			}
		} else {
			if (resultValue.includes('+')) {
				updatedRow.qualitativeResult = '↓';
				updatedRow.resultFlag = 1;
			} else {
				updatedRow.qualitativeResult = '';
			}
		}
	}

	// 保留新结果值
	updatedRow.resultValue = newValue;

	return updatedRow;
}

/**
 * 分析结果值，判断是否在参考范围内
 * 分析规则:
 * 1. 如果是数字，与参考的最小值和最大值比较
 * 2. 如果是文本，判断是否包含 "阳" "阴" 等关键字
 * @param row 结果数据行
 * @param newValue 新的结果值
 * @returns 更新后的结果对象
 */
export function analyzeResultValueMany(
	row: LabResultItem,
	newValue: string,
	index: number
): LabResultItem {
	if (newValue == null || newValue == '') {
		row[`resultValue${index}`] = '';
		row[`qualitativeResult${index}`] = '';
		row[`resultFlag${index}`] = 0; //0正常  1异常
		return row;
	}

	// 复制行数据，避免副作用
	const updatedRow = { ...row };

	// 先清除异常标记
	updatedRow[`qualitativeResult${index}`] = '';
	updatedRow[`resultFlag${index}`] = 0; //0正常  1异常

	// 确保有新值，且是一个有效的数字
	if (newValue && !isNaN(Number(newValue))) {
		//此处转化为空也变成了0，需要注意
		const resultValue = Number(newValue);
		const referenceMin = Number(updatedRow.referenceMin);
		const referenceMax = Number(updatedRow.referenceMax);

		// 记录日志，便于调试
		//console.log(`数值比较: 值=${resultValue}, 最小=${referenceMin}, 最大=${referenceMax}`);

		// 确保参考范围有效后再进行比较
		if (
			!isNaN(referenceMin) &&
			!isNaN(referenceMax) &&
			referenceMin != 0 &&
			referenceMax != 0
		) {
			if (resultValue > referenceMax && referenceMax != 0) {
				//console.log('结果高于正常范围');
				updatedRow[`qualitativeResult${index}`] = '↑';
				updatedRow[`resultFlag${index}`] = 1;
			} else if (resultValue < referenceMin && referenceMin != 0) {
				//console.log('结果低于正常范围');
				updatedRow[`qualitativeResult${index}`] = '↓';
				updatedRow[`resultFlag${index}`] = 1;
			} else {
				//console.log('结果在正常范围内');
				updatedRow[`qualitativeResult${index}`] = ''; // 在正常范围内，清除异常标记
			}
		} else if (!isNaN(referenceMin) && referenceMin != 0 && referenceMax == 0) {
			if (resultValue < referenceMin) {
				//console.log('结果低于正常范围');
				updatedRow[`qualitativeResult${index}`] = '↓';
				updatedRow[`resultFlag${index}`] = 1;
			}
		} else if (!isNaN(referenceMax) && referenceMax != 0 && referenceMin == 0) {
			if (resultValue > referenceMax) {
				//console.log('结果高于正常范围');
				updatedRow[`qualitativeResult${index}`] = '↑';
				updatedRow[`resultFlag${index}`] = 1;
			}
		} else {
			// 可以在这里添加参考范围字符串解析逻辑
			handleReferenceRangeStringMany(updatedRow, resultValue, index);
		}
	} else {
		// 如果不是数字，进行字符串比较
		const resultValue = newValue;

		//console.log(`字符串比较: 值=${resultValue}, 参考范围=${updatedRow.referenceRange}`);

		if (updatedRow.referenceRange != null && updatedRow.referenceRange !== '') {
			if (updatedRow.referenceRange.includes('阳') && resultValue.includes('阴')) {
				updatedRow[`qualitativeResult${index}`] = '↑';
				updatedRow[`resultFlag${index}`] = 1;
			} else if (updatedRow.referenceRange.includes('阴') && resultValue.includes('阳')) {
				updatedRow[`qualitativeResult${index}`] = '↓';
				updatedRow[`resultFlag${index}`] = 1;
			} else if (resultValue.includes('+')) {
				updatedRow[`qualitativeResult${index}`] = '↓';
				updatedRow[`resultFlag${index}`] = 1;
			}
		} else {
			if (resultValue.includes('+')) {
				updatedRow[`qualitativeResult${index}`] = '↓';
				updatedRow[`resultFlag${index}`] = 1;
			} else {
				updatedRow[`qualitativeResult${index}`] = '';
			}
		}
	}

	// 保留新结果值
	updatedRow[`resultValue${index}`] = newValue;

	return updatedRow;
}

/**
 * 处理文本形式的参考范围
 * @param row 结果行数据
 * @param resultValue 结果值(数值类型)
 */
function handleReferenceRangeString(row: LabResultItem, resultValue: number): void {
	// 检查引用范围是否包含数字范围，例如 "3.5-5.5"
	// 修改正则表达式以支持负数
	const rangeRegex = /(-?\d+\.?\d*)\s*[-~]\s*(-?\d+\.?\d*)/;
	const match = row.referenceRange?.match(rangeRegex);

	if (match && match.length >= 3) {
		const min = Number(match[1]);
		const max = Number(match[2]);

		//console.log(`从字符串解析范围: 最小=${min}, 最大=${max}`);

		if (!isNaN(min) && !isNaN(max)) {
			if (resultValue > max) {
				row.qualitativeResult = '↑';
			} else if (resultValue < min) {
				row.qualitativeResult = '↓';
			} else {
				row.qualitativeResult = '';
			}
		}
	} else {
		// 无法解析范围，清除异常标记
		row.qualitativeResult = '';
	}
}

/**
 * 处理文本形式的参考范围
 * @param row 结果行数据
 * @param resultValue 结果值(数值类型)
 */
function handleReferenceRangeStringMany(
	row: LabResultItem,
	resultValue: number,
	index: number
): void {
	// 检查引用范围是否包含数字范围，例如 "3.5-5.5"
	const rangeRegex = /(\d+\.?\d*)\s*[-~]\s*(\d+\.?\d*)/;
	const match = row.referenceRange?.match(rangeRegex);

	if (match && match.length >= 3) {
		const min = Number(match[1]);
		const max = Number(match[2]);

		//console.log(`从字符串解析范围: 最小=${min}, 最大=${max}`);

		if (!isNaN(min) && !isNaN(max)) {
			if (resultValue > max) {
				row[`qualitativeResult${index}`] = '↑';
			} else if (resultValue < min) {
				row[`qualitativeResult${index}`] = '↓';
			} else {
				row[`qualitativeResult${index}`] = '';
			}
		}
	} else {
		// 无法解析范围，清除异常标记
		row[`qualitativeResult${index}`] = '';
	}
}
