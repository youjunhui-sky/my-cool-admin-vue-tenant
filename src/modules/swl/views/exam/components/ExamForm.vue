<template>
	<div class="exam-form">
		<!-- Dynamic component based on exam type -->
		<component
			:is="getExamComponent"
			:exam-data="examData"
			:data="examData.data"
			@exam-form="handleChildExamForm"
		></component>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import LeftUreterExam from './LeftUreterExam.vue';
import LeftKidneyExam from './LeftKidneyExam.vue';
import RightKidneyExam from './RightKidneyExam.vue';
import RightUreterExam from './RightUreterExam.vue';
import BladderExam from './BladderExam.vue';
import UrethraExam from './UrethraExam.vue';

interface ExamData {
	type: string;
	data: Eps.SwlImagingExamEntity;
}

export default defineComponent({
	name: 'exam-form',
	components: {
		LeftUreterExam,
		LeftKidneyExam,
		RightKidneyExam,
		RightUreterExam,
		BladderExam,
		UrethraExam
	},
	props: {
		examData: {
			type: Object as PropType<ExamData>,
			required: true,
			data: {
				type: Object as PropType<Eps.SwlImagingExamEntity>,
				required: false
			}
		}
	},
	setup(props, { emit }) {
		// Compute the component to use based on exam type
		const getExamComponent = computed(() => {
			switch (props.examData.type) {
				case 'left_ureter':
					return LeftUreterExam;
				case 'left_kidney':
					return LeftKidneyExam;
				case 'right_kidney':
					return RightKidneyExam;
				case 'right_ureter':
					return RightUreterExam;
				case 'bladder':
					return BladderExam;
				case 'urethra':
					return UrethraExam;
				default:
					return null;
			}
		});

		// 新增：处理子组件提交的数据
		const handleChildExamForm = (data: any, organType: string) => {
			// 可以在这里进行数据验证
			//console.log(`examForm.vue收到 ${organType} 数据：`, data);

			// 将数据继续传递给上层组件（可选）
			emit('exam-form', data, organType); // 继续向上冒泡
		};

		return {
			getExamComponent,
			handleChildExamForm
		};
	}
});
</script>

<style lang="scss" scoped>
.exam-form {
	width: 100%;
}
</style>
