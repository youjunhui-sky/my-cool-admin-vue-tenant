<template>
	<cl-view-group ref="ViewGroup">
		<template #left>
			<!-- 部门列表 -->
			<dept-list @refresh="refresh" @user-add="onUserAdd" />
		</template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<!-- 刷新按钮 -->
					<cl-refresh-btn />
					<!-- 新增按钮 -->
					<cl-add-btn />
					<!-- 批量删除按钮 -->
					<cl-multi-delete-btn />
					<!-- 用户转移 -->
					<el-button
						v-permission="service.base.sys.user.permission.move"
						type="success"
						:disabled="Table?.selection.length == 0"
						@click="toMove()"
					>
						{{ $t('转移') }}
					</el-button>
					<!-- 清除缓存按钮 -->
					<el-button type="warning" @click="clearCache">
						{{ $t('清除缓存') }}
					</el-button>
					<cl-flex1 />
					<cl-search-key :placeholder="$t('搜索用户名、姓名')" />
				</cl-row>

				<cl-row>
					<cl-table ref="Table">
						<!-- 单个转移 -->
						<template #slot-btn="{ scope }">
							<el-button
								v-permission="service.base.sys.user.permission.move"
								text
								@click="toMove(scope.row)"
							>
								{{ $t('转移') }}
							</el-button>
						</template>
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
					<cl-pagination />
				</cl-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert" />

				<!-- 移动 -->
				<user-move :ref="setRefs('userMove')" />
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'sys-user'
});

import { useTable, useUpsert, useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useBase } from '/$/base';
import DeptList from './components/dept-list.vue';
import UserMove from './components/user-move.vue';
import { useViewGroup } from '/@/plugins/view';
import { useI18n } from 'vue-i18n';
import { Plugins } from '/#/crud';
import { ElMessage } from 'element-plus';
import { passwordValidator } from '../../utils/password-validator';
import { clearUserCache, forceReLogin, clearAllCache } from '../../utils/clear-cache';
import { ElMessageBox } from 'element-plus';
import { encryptPassword } from '../../utils/md5';

const { service, refs, setRefs } = useCool();
const { t } = useI18n();

const { ViewGroup } = useViewGroup({
	title: t('用户列表')
});

// cl-crud
const Crud = useCrud({
	service: service.base.sys.user
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'headImg',
			label: t('头像'),
			component: {
				name: 'cl-avatar',
				props: {
					size: 32
				}
			}
		},
		{
			prop: 'username',
			label: t('用户名'),
			minWidth: 150
		},
		{
			prop: 'name',
			label: t('姓名'),
			minWidth: 120
		},
		{
			prop: 'nickName',
			label: t('昵称'),
			minWidth: 120
		},
		{
			prop: 'departmentName',
			label: t('部门名称'),
			minWidth: 120
		},
		{
			prop: 'roleName',
			label: t('角色'),
			headerAlign: 'center',
			minWidth: 160,
			dict: [],
			formatter(row) {
				return row.roleName?.split(',');
			}
		},
		{
			prop: 'status',
			label: t('状态'),
			minWidth: 100,
			component: {
				name: 'cl-switch'
			}
		},
		{
			prop: 'phone',
			label: t('手机号码'),
			minWidth: 120
		},
		{
			prop: 'remark',
			label: t('备注'),
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'createTime',
			label: t('创建时间'),
			sortable: 'desc',
			minWidth: 170
		},
		{
			type: 'op',
			buttons: ['slot-btn', 'edit', 'delete'],
			width: 270
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '800px'
	},

	items: [
		{
			prop: 'headImg',
			label: t('头像'),
			component: {
				name: 'cl-upload',
				props: {
					text: t('选择头像')
				}
			}
		},
		{
			prop: 'name',
			label: t('姓名'),
			span: 12,
			required: true,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'nickName',
			label: t('昵称'),
			required: true,
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'username',
			label: t('用户名'),
			required: true,
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		() => {
			return {
				prop: 'password',
				label: t('密码'),
				span: 12,
				required: Upsert.value?.mode == 'add',
				component: {
					name: 'el-input',
					props: {
						type: 'password',
						showPassword: true,
						autocomplete: 'new-password',
						maxlength: 128,
						onBlur: (event: any) => {
							const value = event.target.value;
							if (value) {
								const validation = passwordValidator.validate(value);
								if (!validation.isValid) {
									// 显示第一个错误信息
									ElMessage.error(validation.errors[0]);
								}
							}
						}
					}
				},
				rules: [
					{
						required: Upsert.value?.mode == 'add',
						message: t('请输入密码'),
						trigger: 'blur'
					},
					{
						validator: (rule: any, value: string, callback: any) => {
							if (!value) {
								callback();
								return;
							}

							const validation = passwordValidator.validate(value);
							if (!validation.isValid) {
								callback(new Error(validation.errors[0]));
								return;
							}

							callback();
						},
						trigger: 'blur'
					}
				]
			};
		},
		{
			prop: 'roleIdList',
			label: t('角色'),
			value: [],
			required: true,
			component: {
				name: 'el-select',
				options: [],
				props: {
					multiple: true,
					'multiple-limit': 3
				}
			}
		},
		{
			prop: 'phone',
			label: t('手机号码'),
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'email',
			label: t('邮箱'),
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'remark',
			label: t('备注'),
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 4
				}
			}
		},
		{
			prop: 'status',
			label: t('状态'),
			value: 1,
			component: {
				name: 'el-radio-group',
				options: [
					{
						label: t('启用'),
						value: 1
					},
					{
						label: t('禁用'),
						value: 0
					}
				]
			}
		}
	],

	onSubmit(data, { next }) {
		// 验证密码强度
		if (data.password) {
			const validation = passwordValidator.validate(data.password);
			if (!validation.isValid) {
				ElMessage.error(validation.errors[0]);
				return;
			}

			// 对密码进行MD5加密
			data.password = encryptPassword(data.password);
		}

		next({
			departmentId: ViewGroup.value?.selected?.id,
			...data
		});
	},

	async onOpen() {
		// 设置权限列表
		await loadRoleList();
	},

	async onOpened(data) {
		// 确保角色列表已加载（用于所有场景）
		// 当通过 rowAppend 新增时，onOpen 可能没有被调用，所以在这里确保调用
		// 检查角色列表是否已设置，如果没有则调用 loadRoleList
		const roleOptions = Upsert.value?.getOptions('roleIdList');
		if (!roleOptions || roleOptions.length === 0) {
			await loadRoleList();
		}
	}
});

// 刷新列表
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

/**
 * 加载角色列表
 */
async function loadRoleList() {
	const { service } = useCool();

	// 获取角色列表
	const res = await service.base.sys.role.list();
	Upsert.value?.setOptions(
		'roleIdList',
		res.map((e: any) => ({
			label: e.name,
			value: e.id
		}))
	);
}

// 新增成员
function onUserAdd({ id }: Eps.BaseSysDepartmentEntity) {
	Crud.value?.rowAppend({
		departmentId: id
	});
}

// 移动成员
async function toMove(item?: Eps.BaseSysDepartmentEntity) {
	let ids: number[] = [];

	if (item) {
		ids = [item.id!];
	} else {
		ids = Table.value?.selection.map(e => e.id) || [];
	}

	refs.userMove.open(ids);
}

// 清除缓存
function clearCache() {
	ElMessageBox.confirm(t('确定要清除缓存吗？'), t('提示'), {
		confirmButtonText: t('确定'),
		cancelButtonText: t('取消'),
		type: 'warning'
	}).then(() => {
		clearAllCache();
		ElMessage.success(t('缓存已清除'));
	});
}
</script>
