/**
 * MD5加密工具
 * 使用crypto-js库进行MD5加密
 */

import CryptoJS from 'crypto-js';

/**
 * MD5加密函数
 * @param message 需要加密的字符串
 * @returns 返回32位小写MD5哈希值
 */
export function md5(message: string): string {
	return CryptoJS.MD5(message).toString();
}

/**
 * 对密码进行MD5加密
 * @param password 原始密码
 * @returns MD5加密后的密码
 */
export function encryptPassword(password: string): string {
	return md5(password);
}

/**
 * 验证密码
 * @param inputPassword 输入的密码
 * @param encryptedPassword 加密后的密码
 * @returns 是否匹配
 */
export function verifyPassword(inputPassword: string, encryptedPassword: string): boolean {
	return md5(inputPassword) === encryptedPassword;
}
