/**
 * 密码验证工具类
 * 符合最新互联网安全要求
 */

export interface PasswordValidationResult {
	isValid: boolean;
	errors: string[];
	strength: 'weak' | 'medium' | 'strong' | 'very-strong';
	score: number; // 0-100
}

export interface PasswordRequirements {
	minLength: number;
	maxLength: number;
	requireUppercase: boolean;
	requireLowercase: boolean;
	requireNumbers: boolean;
	requireSpecialChars: boolean;
	preventCommonPasswords: boolean;
	preventSequentialChars: boolean;
	preventRepeatedChars: boolean;
}

// 默认密码要求（符合NIST、OWASP等最新标准）
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
	minLength: 8,
	maxLength: 128,
	requireUppercase: true,
	requireLowercase: true,
	requireNumbers: true,
	requireSpecialChars: true,
	preventCommonPasswords: true,
	preventSequentialChars: true,
	preventRepeatedChars: true
};

// 常见弱密码列表
const COMMON_PASSWORDS = [
	'password',
	'123456',
	'123456789',
	'qwerty',
	'abc123',
	'password123',
	'admin',
	'admin123',
	'root',
	'root123',
	'user',
	'user123',
	'letmein',
	'welcome',
	'login',
	'monkey',
	'dragon',
	'master',
	'hello',
	'freedom',
	'whatever',
	'qazwsx',
	'trustno1',
	'jordan',
	'harley',
	'ranger',
	'iwantu',
	'jennifer',
	'hunter',
	'buster',
	'thomas',
	'tigger',
	'robert',
	'soccer',
	'batman',
	'test',
	'pass',
	'killer',
	'hockey',
	'george',
	'charlie',
	'andrew',
	'michelle',
	'love',
	'sunshine',
	'jessica',
	'asshole',
	'696969',
	'pepper',
	'daniel',
	'access',
	'1234567',
	'maggie',
	'654321',
	'pussy',
	'diamond',
	'falcon',
	'coffee',
	'buckeye',
	'000000',
	'hammer',
	'silver',
	'222222',
	'88888888',
	'anthony',
	'justin',
	'test123',
	'bailey',
	'1q2w3e4r',
	'united',
	'yankees',
	'lover',
	'secret',
	'dick',
	'testtest',
	'mister',
	'jordan23',
	'eagle1',
	'shelby',
	'madison',
	'austin',
	'steelers',
	'jordan1',
	'michael',
	'cooper',
	'harrison',
	'marvin',
	'curtis',
	'oliver',
	'richard',
	'jasper',
	'andrew1',
	'lucas',
	'theodore',
	'jackson',
	'logan',
	'olivia',
	'quinn',
	'madison1',
	'north',
	'south',
	'east',
	'west',
	'password1',
	'password2',
	'password3',
	'password4',
	'password5'
];

// 特殊字符集合
const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export class PasswordValidator {
	private requirements: PasswordRequirements;

	constructor(requirements: Partial<PasswordRequirements> = {}) {
		this.requirements = { ...DEFAULT_PASSWORD_REQUIREMENTS, ...requirements };
	}

	/**
	 * 验证密码强度
	 */
	validate(password: string): PasswordValidationResult {
		const errors: string[] = [];
		let score = 0;

		// 基本长度检查
		if (password.length < this.requirements.minLength) {
			errors.push(`密码长度至少需要${this.requirements.minLength}个字符`);
		} else {
			score += 10;
		}

		if (password.length > this.requirements.maxLength) {
			errors.push(`密码长度不能超过${this.requirements.maxLength}个字符`);
		}

		// 字符类型检查
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasNumbers = /\d/.test(password);
		//const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
		const hasSpecialChars = /[@#%&*]/.test(password);

		if (this.requirements.requireUppercase && !hasUppercase) {
			errors.push('密码必须包含至少一个大写字母');
		} else if (hasUppercase) {
			score += 10;
		}

		if (this.requirements.requireLowercase && !hasLowercase) {
			errors.push('密码必须包含至少一个小写字母');
		} else if (hasLowercase) {
			score += 10;
		}

		if (this.requirements.requireNumbers && !hasNumbers) {
			errors.push('密码必须包含至少一个数字');
		} else if (hasNumbers) {
			score += 10;
		}

		if (this.requirements.requireSpecialChars && !hasSpecialChars) {
			errors.push('密码必须包含至少一个特殊字符,包含@#%&*');
		} else if (hasSpecialChars) {
			score += 15;
		}

		// 长度奖励
		if (password.length >= 12) {
			score += 10;
		} else if (password.length >= 10) {
			score += 5;
		}

		// 字符多样性奖励
		const uniqueChars = new Set(password).size;
		if (uniqueChars >= password.length * 0.8) {
			score += 10;
		}

		// 防止常见密码
		// if (this.requirements.preventCommonPasswords) {
		// 	const lowerPassword = password.toLowerCase();
		// 	if (COMMON_PASSWORDS.includes(lowerPassword)) {
		// 		errors.push('密码过于简单，请使用更复杂的密码');
		// 		score -= 20;
		// 	}
		// }

		// 防止连续字符
		// if (this.requirements.preventSequentialChars) {
		// 	const sequentialPatterns = [
		// 		'123',
		// 		'234',
		// 		'345',
		// 		'456',
		// 		'567',
		// 		'678',
		// 		'789',
		// 		'abc',
		// 		'bcd',
		// 		'cde',
		// 		'def',
		// 		'efg',
		// 		'fgh',
		// 		'ghi',
		// 		'qwe',
		// 		'wer',
		// 		'ert',
		// 		'rty',
		// 		'tyu',
		// 		'yui',
		// 		'uio'
		// 	];

		// 	const lowerPassword = password.toLowerCase();
		// 	for (const pattern of sequentialPatterns) {
		// 		if (lowerPassword.includes(pattern)) {
		// 			errors.push('密码不能包含连续字符');
		// 			score -= 10;
		// 			break;
		// 		}
		// 	}
		// }

		// 防止重复字符
		// if (this.requirements.preventRepeatedChars) {
		// 	for (let i = 0; i < password.length - 2; i++) {
		// 		if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
		// 			errors.push('密码不能包含重复字符');
		// 			score -= 10;
		// 			break;
		// 		}
		// 	}
		// }

		// 计算强度等级
		let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
		if (score >= 80) {
			strength = 'very-strong';
		} else if (score >= 60) {
			strength = 'strong';
		} else if (score >= 40) {
			strength = 'medium';
		} else {
			strength = 'weak';
		}

		// 确保分数在0-100范围内
		score = Math.max(0, Math.min(100, score));

		return {
			isValid: errors.length === 0,
			errors,
			strength,
			score
		};
	}

	/**
	 * 获取密码强度建议
	 */
	getStrengthSuggestion(strength: string): string {
		switch (strength) {
			case 'very-strong':
				return '密码强度非常高，安全性很好';
			case 'strong':
				return '密码强度高，建议继续使用';
			case 'medium':
				return '密码强度中等，建议增加复杂度';
			case 'weak':
				return '密码强度较弱，建议重新设置';
			default:
				return '请设置符合要求的密码';
		}
	}

	/**
	 * 生成密码建议
	 */
	generatePasswordSuggestion(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
		let password = '';

		// 确保包含所有必需字符类型
		password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // 大写
		password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // 小写
		password += '0123456789'[Math.floor(Math.random() * 10)]; // 数字
		password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // 特殊字符

		// 添加随机字符
		for (let i = 4; i < 12; i++) {
			password += chars[Math.floor(Math.random() * chars.length)];
		}

		// 打乱字符顺序
		return password
			.split('')
			.sort(() => Math.random() - 0.5)
			.join('');
	}
}

// 导出默认实例
export const passwordValidator = new PasswordValidator();
