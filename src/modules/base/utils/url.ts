/**
 * URL工具函数
 */

/**
 * 获取当前浏览器的URL和端口
 * @returns 当前完整的主机URL，格式为 protocol://hostname:port
 */
export const getCurrentHost = (): string => {
	// 获取当前浏览器URL的协议、主机名和端口
	const { protocol, hostname, port } = window.location;
	// 组合成完整的URL前缀
	return `${protocol}//${hostname}${port ? ':' + port : ''}`;
};

/**
 * 处理图片URL，为相对路径添加主机前缀
 * @param value 原始图片路径
 * @returns 处理后的完整URL
 */
export const formatImageUrl = (value: string): string => {
	if (!value) {
		return '';
	}

	// 如果已经是绝对URL，直接返回
	if (value.startsWith('http')) {
		return value;
	}

	const currentHost = getCurrentHost();

	// 添加upload路径如果需要
	if (!value.includes('upload')) {
		return `${currentHost}/upload/${value}`;
	}

	// 处理其他相对路径
	return `${currentHost}${value.startsWith('/') ? '' : '/'}${value}`;
};

/**
 * 处理图片URL用于提交，移除主机前缀
 * @param value 完整的图片URL
 * @returns 处理后的相对路径
 */
export const cleanImageUrlForSubmit = (value: string): string => {
	if (!value || typeof value !== 'string' || !value.startsWith('http')) {
		return value;
	}

	try {
		const url = new URL(value);
		// 获取路径部分
		const path = url.pathname;

		// 移除/upload/前缀
		if (path.includes('/upload/')) {
			return path.replace('/upload/', '');
		}

		// 返回不带前缀的路径
		return path.startsWith('/') ? path.substring(1) : path;
	} catch (e) {
		console.error('URL解析错误:', e);
		return value;
	}
};
