<template>
	<div class="app-topbar">
		<div class="cl-comm__icon mr-[10px]" @click="app.fold()">
			<cl-svg name="fold" v-if="app.isFold" />
			<cl-svg name="expand" v-else />
		</div>

		<!-- 路由导航 -->
		<a-menu v-if="app.info.menu.isGroup" />
		<route-nav v-else />

		<div class="flex1"></div>

		<!-- 版本说明按钮 -->
		<div class="cl-comm__icon mr-[20px] version-btn" @click="router.push('/base/changelog')">
			<el-text size="small">{{ t('版本说明') }}</el-text>
		</div>

		<!-- 右侧面板切换按钮 -->
		<div class="cl-comm__icon mr-[10px]" @click="app.foldRightPanel()">
			<template v-if="app.isRightPanelFold">
				<!-- 展开状态 - AI极速编码样式 -->
				<div class="ai-toggle-btn">
					<div class="t1">AI智能</div>
					<div class="t2">Smart</div>
				</div>
			</template>
			<template v-else>
				<div class="ai-toggle-btn">
					<div class="t1">AI智能(折叠)</div>
					<div class="t2">Smart(折叠)</div>
				</div>
			</template>
		</div>

		<!-- 工具栏 -->
		<ul class="app-topbar__tools">
			<li v-for="(item, index) in toolbarComponents" :key="index">
				<component :is="item.component" />
			</li>
		</ul>

		<!-- 用户信息 -->
		<template v-if="user.info">
			<el-dropdown
				hide-on-click
				popper-class="app-topbar__user-popper"
				:popper-options="{}"
				@command="onCommand"
			>
				<div class="app-topbar__user">
					<el-text class="mr-[10px]">{{ user.info.nickName }}</el-text>
					<cl-avatar :size="26" :src="user.info.headImg" />
				</div>

				<template #dropdown>
					<div class="user">
						<cl-avatar :size="34" :src="user.info.headImg" />

						<div class="det">
							<el-text size="small" tag="p">{{ user.info.nickName }}</el-text>
							<el-text size="small" type="info">{{ user.info.email }}</el-text>
						</div>
					</div>

					<el-dropdown-menu>
						<el-dropdown-item command="my">
							<cl-svg name="my" />
							<span>{{ t('个人中心') }}</span>
						</el-dropdown-item>
						<el-dropdown-item command="version">
							<cl-svg name="my" />
							<span>{{ t('版本说明') }}</span>
						</el-dropdown-item>
						<el-dropdown-item command="exit">
							<cl-svg name="exit" />
							<span>{{ t('退出登录') }}</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</template>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'app-topbar'
});

import { computed, markRaw, onMounted, reactive } from 'vue';
import { isFunction, orderBy } from 'lodash-es';
import { useBase } from '/$/base';
import { module, useCool } from '/@/cool';
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import RouteNav from './route-nav.vue';
import AMenu from './amenu.vue';

const { router, service, browser } = useCool();
const { user, app } = useBase();
const { t } = useI18n();

// 命令事件
async function onCommand(name: string) {
	switch (name) {
		case 'my':
			router.push('/my/info');
			break;
		case 'version':
			router.push('/base/changelog');
			break;
		case 'exit':
			ElMessageBox.confirm(t('确定退出登录吗？'), t('提示'), {
				type: 'warning'
			})
				.then(async () => {
					await service.base.comm.logout();
					user.logout();
				})
				.catch(() => null);
			break;
	}
}

// 工具栏
const toolbar = reactive({
	list: [] as any[],

	async init() {
		const arr = orderBy(
			module.list.filter(e => e.enable !== false && !!e.toolbar).map(e => e.toolbar),
			'order'
		);

		this.list = await Promise.all(
			arr
				.filter(e => e?.component)
				.map(async e => {
					if (e) {
						const c = await (isFunction(e.component) ? e.component() : e.component);

						return {
							...e,
							component: markRaw(c.default || c)
						};
					}
				})
		);
	}
});

// 工具栏组件
const toolbarComponents = computed(() => {
	return toolbar.list.filter(e => {
		if (browser.isMini) {
			return e?.h5 ?? true;
		}

		return e?.pc ?? true;
	});
});

onMounted(() => {
	toolbar.init();
});
</script>

<style lang="scss" scoped>
.app-topbar {
	display: flex;
	align-items: center;
	height: 46px;
	padding: 0 10px;
	background-color: var(--el-bg-color);
	border-bottom: 1px solid var(--el-border-color-extra-light);
	box-sizing: border-box;
	transition: height 0.2s ease-in-out;

	/* 新增横向滚动 */
	overflow-x: auto; /* 允许横向滚动 */
	white-space: nowrap; /* 防止子元素换行 */

	.flex1 {
		flex: 1;
	}

	&__tools {
		display: flex;
		margin-right: 10px;

		& > li {
			display: flex;
			justify-content: center;
			align-items: center;
			list-style: none;
			height: 45px;
			cursor: pointer;
			margin-left: 10px;
		}
	}

	&__user {
		display: flex;
		align-items: center;
		outline: none;
		cursor: pointer;
		white-space: nowrap;
		padding: 5px 5px 5px 10px;
		border-radius: 6px;

		&:hover {
			background-color: var(--el-fill-color-light);
		}
	}

	:deep(.cl-comm__icon) {
		&:hover {
			border-color: var(--el-color-primary);
			background-color: transparent;
		}

		// 版本说明按钮自适应宽度
		&.version-btn {
			width: auto;
			min-width: 80px;
			padding: 0 10px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 6px;
		}

		// AI智能按钮容器需要自适应宽度
		&:has(.ai-toggle-btn) {
			width: auto;
			min-width: 100px;
		}

		// AI智能按钮样式
		.ai-toggle-btn {
			position: relative;
			overflow: hidden;
			width: 100px;
			height: 34px;
			padding: 0 12px;
			display: flex;
			align-items: center;
			justify-content: center;

			.t1,
			.t2 {
				display: flex;
				align-items: center;
				justify-content: center;
				transition: top 0.5s;
				letter-spacing: 1px;
				position: absolute;
				width: 100%;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #868686 20%);
				background-position: 0;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				animation: shine 3s infinite linear;
				animation-fill-mode: forwards;
				-webkit-text-size-adjust: none;
				font-size: 12px;
				line-height: 1;
				white-space: nowrap;
			}

			.t2 {
				top: 150%;
			}

			&:hover {
				.t1 {
					top: -100%;
				}

				.t2 {
					top: 50%;
				}
			}
		}
	}
}
</style>

<style lang="scss">
.app-topbar__user-popper {
	.el-dropdown-menu__item {
		padding: 6px 12px;
		font-size: 12px;
	}

	.user {
		display: flex;
		align-items: center;
		padding: 10px 10px;
		width: 200px;
		border-bottom: 1px solid var(--el-color-info-light-9);

		.det {
			margin-left: 10px;
			flex: 1;
			font-size: 12px;
		}
	}

	.cl-svg {
		margin-right: 8px;
		font-size: 16px;
	}
}

// AI按钮发光动画
@keyframes shine {
	0% {
		background-position: 0;
	}
	100% {
		background-position: 100px;
	}
}
</style>
