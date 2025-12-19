<template>
	<div class="pdf-demo">
		<el-button @click="open">打开表单</el-button>

		<cl-form ref="Form">
			<template #slot-content>
				<user-info />
			</template>
		</cl-form>
	</div>
</template>

<script setup lang="ts">
import { useForm } from "@cool-vue/crud";
import { setPDF } from "../plugins";
import UserInfo from "./components/user-info.vue";

const Form = useForm();

function open() {
	Form.value?.open(
		{
			title: "用户信息",

			items: [
				{
					component: {
						name: "slot-content"
					}
				}
			]
		},
		[
			setPDF({
				label: "打印",
				type: "warning",
				text: false
			})
		]
	);
}
</script>
