import { storage } from '/@/cool/utils';

/**
 * 清除所有用户相关的缓存数据
 */
export function clearUserCache() {
	// 清除token相关数据
	storage.remove('token');
	storage.remove('refreshToken');
	storage.remove('userInfo');
	storage.remove('token_deadtime');
	storage.remove('refreshToken_deadtime');

	// 清除其他可能相关的数据
	storage.remove('username');
	storage.remove('locale');

	//console.log('用户缓存已清除');
}

/**
 * 检查并清除过期的缓存
 */
export function clearExpiredCache() {
	const keys = ['token', 'refreshToken'];

	keys.forEach(key => {
		if (storage.isExpired(key)) {
			storage.remove(key);
			storage.remove(`${key}_deadtime`);
			//console.log(`${key} 已过期，已清除`);
		}
	});
}

/**
 * 强制重新登录
 */
export function forceReLogin() {
	clearUserCache();
	window.location.href = '/login';
}

/**
 * 清除所有系统缓存（包括用户、菜单、权限等）
 */
export function clearAllCache() {
	// 清除用户相关缓存
	clearUserCache();

	// 清除菜单相关缓存
	storage.remove('base.menuGroup');
	storage.remove('base.menuPerms');
	storage.remove('menu');
	storage.remove('perms');

	// 清除其他可能相关的缓存
	storage.remove('user');
	storage.remove('process');
	storage.remove('app');

	// 清除localStorage中的所有相关数据
	const keysToRemove = [
		'token',
		'refreshToken',
		'userInfo',
		'token_deadtime',
		'refreshToken_deadtime',
		'username',
		'locale',
		'base.menuGroup',
		'base.menuPerms',
		'menu',
		'perms',
		'user',
		'process',
		'app'
	];

	keysToRemove.forEach(key => {
		storage.remove(key);
	});

	//console.log('所有系统缓存已清除');
}

/**
 * 强制所有用户重新登录
 */
export function forceAllUsersReLogin() {
	clearAllCache();
	window.location.href = '/login';
}
