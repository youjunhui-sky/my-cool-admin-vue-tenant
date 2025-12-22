<template>
	<div class="hospital-layout">
		<!-- 左侧面板：机构列表 -->
		<div class="left-panel">
			<hospital-list @row-click="onRowClick" />
		</div>

		<!-- 右侧面板：用户列表和角色列表 -->
		<div class="right-panel">
			<!-- 上方：用户列表 -->
			<div class="top-section">
				<hospital-user-list :selected-hospital-id="selectedHospitalId" />
			</div>

			<!-- 下方：角色列表 -->
			<div class="bottom-section">
				<hospital-role-list :selected-hospital-id="selectedHospitalId" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
/**
 * 医院/机构管理页面
 * 对应 BaseSysDepartmentEntity 实体
 */
defineOptions({
	name: 'sys-hospital'
});

import { ref } from 'vue';
import HospitalList from './hospital/components/hospital-list.vue';
import HospitalUserList from './hospital/components/hospital-user-list.vue';
import HospitalRoleList from './hospital/components/hospital-role-list.vue';

// 选中的机构ID
const selectedHospitalId = ref<number>();

/**
 * 机构表格行点击事件
 * 更新选中的机构ID并刷新右侧用户列表
 */
function onRowClick(row: Eps.BaseSysDepartmentEntity) {
	// 更新选中的机构ID
	selectedHospitalId.value = row.tenantId;
}
</script>

<style lang="scss" scoped>
.hospital-layout {
	display: flex;
	height: 100%;
	gap: 16px;

	.left-panel {
		width: 50%;
		min-width: 0;
		background: var(--el-bg-color);
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.right-panel {
		width: 50%;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;

		.top-section,
		.bottom-section {
			flex: 1;
			background: var(--el-bg-color);
			border-radius: 8px;
			padding: 16px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: column;
			min-height: 0;

			// 确保 cl-crud 占满空间
			:deep(.cl-crud) {
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			// 确保表格区域占满剩余空间
			:deep(.cl-row:nth-child(2)) {
				flex: 1;
				display: flex;
				flex-direction: column;
				min-height: 0;
			}

			// 确保 cl-table 占满空间
			:deep(.cl-table) {
				height: 100%;
				flex: 1;
			}
		}
	}
}

// 响应式设计
@media (max-width: 1200px) {
	.hospital-layout {
		flex-direction: column;

		.left-panel,
		.right-panel {
			width: 100%;
		}

		.right-panel {
			flex-direction: row;

			.top-section,
			.bottom-section {
				flex: 1;
			}
		}
	}
}

@media (max-width: 768px) {
	.hospital-layout {
		.right-panel {
			flex-direction: column;
		}
	}
}
</style>
