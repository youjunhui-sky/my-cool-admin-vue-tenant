<template>
	<div class="view-my">
		<el-scrollbar>
			<div class="p-[20px]">
				<div class="title">{{ $t('基本信息') }}</div>

				<el-form label-width="100px" :model="form" :disabled="loading" label-position="top">
					<el-form-item :label="$t('头像')">
						<cl-upload v-model="form.headImg" />
					</el-form-item>

					<el-form-item :label="$t('昵称')">
						<el-input
							v-model="form.nickName"
							:placeholder="$t('请填写昵称')"
							clearable
						/>
					</el-form-item>

					<el-form-item :label="$t('原密码')">
						<el-input
							v-model="form.oldPassword"
							type="password"
							:placeholder="$t('请填写原密码')"
							clearable
							maxlength="128"
						/>
					</el-form-item>

					<el-form-item :label="$t('新密码')">
						<el-input
							v-model="form.password"
							type="password"
							:placeholder="$t('请填写新密码')"
							clearable
							maxlength="128"
							show-password
							@blur="onPasswordBlur"
						/>

						<!-- 密码强度指示器 - 只在失去焦点且有错误时显示 -->
						<password-strength-indicator
							v-if="showPasswordErrors && passwordErrors.length > 0"
							:password="form.password"
							:show-errors="true"
							:show-suggestion="false"
						/>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" :disabled="loading" @click="save">{{
							$t('保存修改')
						}}</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-scrollbar>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'my-info'
});

import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useBase } from '/$/base';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import PasswordStrengthIndicator from '../components/password-strength-indicator.vue';
import { passwordValidator } from '../utils/password-validator';
import { encryptPassword } from '../utils/md5';

const { t } = useI18n();
const { service } = useCool();
const { user } = useBase();

// 保存状态
const loading = ref(false);

// 密码错误状态
const showPasswordErrors = ref(false);
const passwordErrors = ref<string[]>([]);

// 表单数据
const form = reactive({
	headImg: '',
	nickName: '',
	password: '',
	oldPassword: ''
});

// 密码失去焦点时验证
function onPasswordBlur() {
	if (form.password) {
		const validation = passwordValidator.validate(form.password);
		if (!validation.isValid) {
			passwordErrors.value = validation.errors;
			showPasswordErrors.value = true;
		} else {
			passwordErrors.value = [];
			showPasswordErrors.value = false;
		}
	}
}

// 保存
async function save() {
	loading.value = true;

	// 验证新密码强度
	if (form.password) {
		const validation = passwordValidator.validate(form.password);
		if (!validation.isValid) {
			ElMessage.error(validation.errors[0]);
			loading.value = false;
			return;
		}

		// 对密码进行MD5加密
		form.password = encryptPassword(form.password);
	}

	// 对原密码进行MD5加密
	if (form.oldPassword) {
		form.oldPassword = encryptPassword(form.oldPassword);
	}

	await service.base.comm
		.personUpdate(form)
		.then(() => {
			form.password = '';
			form.oldPassword = '';

			ElMessage.success(t('修改成功'));
			user.get();
		})
		.catch(err => {
			ElMessage.error(err.message);
		});

	loading.value = false;
}

onMounted(() => {
	// 获取用户信息
	user.get().then((res: any) => {
		form.headImg = res.headImg || '';
		form.nickName = res.nickName || '';
	});
});
</script>

<style lang="scss" scoped>
.view-my {
	background-color: var(--el-bg-color);
	height: 100%;
	box-sizing: border-box;
	border-radius: 6px;

	.el-form {
		width: 400px;
		max-width: 100%;
	}

	.title {
		margin-bottom: 30px;
		font-size: 15px;
		font-weight: bold;
	}
}
</style>
