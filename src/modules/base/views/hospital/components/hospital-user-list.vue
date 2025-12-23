<template>
	<cl-crud ref="Crud">
		<cl-row>
			<div class="table-title">
				<h3>管理员用户</h3>
			</div>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
/**
 * 机构用户列表组件
 */
defineOptions({
	name: 'hospital-user-list'
});

import { useTable, useUpsert, useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';
import { ElMessage } from 'element-plus';
import { passwordValidator } from '../../../utils/password-validator';
import { encryptPassword } from '../../../utils/md5';

const { t } = useI18n();
const { service } = useCool();

const props = defineProps<{
	selectedHospitalId?: number;
}>();

// cl-crud for users
const Crud = useCrud(
	{
		service: service.base.sys.user,
		onRefresh(params, { next }) {
			// 如果选中了机构，则根据机构ID过滤用户
			if (props.selectedHospitalId) {
				next({
					...params,
					tenantId: props.selectedHospitalId,
					isMain: 1
				});
			} else {
				next({
					...params,
					isMain: 1
				});
			}
		}
	},
	app => {
		// 初始不刷新，等待选择机构后再刷新
	}
);

// cl-table for users
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
			prop: 'phone',
			label: t('手机号码'),
			minWidth: 120
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
			prop: 'createTime',
			label: t('创建时间'),
			sortable: 'desc',
			minWidth: 170
		},
		{
			type: 'op'
		}
	]
});

// cl-upsert for users
const Upsert = useUpsert({
	dialog: {
		width: '800px'
	},
	items: [
		{
			prop: 'username',
			label: t('用户名'),
			span: 12,
			required: true,
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
			span: 12,
			component: {
				name: 'el-input'
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
			prop: 'status',
			label: t('状态'),
			span: 12,
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
		},
		{
			prop: 'remark',
			label: t('备注'),
			span: 24,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 4
				}
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

		// 如果选中了机构，自动关联到该机构
		next({
			...data,
			tenantId: props.selectedHospitalId || data.tenantId,
			isMain: 1
		});
	}
});

// 监听机构选择变化，刷新用户列表
watch(
	() => props.selectedHospitalId,
	(hospitalId, oldHospitalId) => {
		// 只有当 hospitalId 存在且发生变化时才刷新
		if (hospitalId !== undefined && hospitalId !== null && hospitalId !== oldHospitalId) {
			Crud.value?.refresh({
				page: 1,
				tenantId: hospitalId,
				isMain: 1
			});
		}
	}
);

// 暴露方法供父组件调用
defineExpose({
	Crud,
	Table,
	Upsert
});
</script>
