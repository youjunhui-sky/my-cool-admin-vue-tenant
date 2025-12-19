<template>
  <div class="alternating-timeline">
    <div class="timeline-container">
      <div class="timeline-line"></div>
      <div class="timeline-items">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="timeline-item"
          :class="{ 'item-top': index % 2 === 0, 'item-bottom': index % 2 === 1 }"
        >
          <div class="timeline-content">
            <div class="timeline-dot"></div>
            <div class="timeline-text">
              <div class="timeline-title">{{ item.title }}</div>
              <div class="timeline-time">{{ item.timestamp }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface TimelineItem {
  title: string;
  timestamp: string;
}

defineProps<{
  items: TimelineItem[];
}>();
</script>

<style lang="scss" scoped>
.alternating-timeline {
  padding: 20px 10px;
  
  .timeline-container {
    position: relative;
    min-height: 150px;
  }

  .timeline-line {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    background-color: #e4e7ed;
    transform: translateY(-50%);
  }

  .timeline-items {
    position: relative;
    display: flex;
    justify-content: space-around;
  }

  .timeline-item {
    position: relative;
    width: 120px;
    
    .timeline-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .timeline-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #409eff;
      border: 2px solid #fff;
      box-shadow: 0 0 0 2px #409eff;
      z-index: 1;
    }

    .timeline-text {
      position: absolute;
      width: 120px;
      text-align: center;
      
      .timeline-title {
        font-weight: bold;
        margin-bottom: 4px;
      }
      
      .timeline-time {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .item-top {
    .timeline-dot {
      margin-top: 40px;
    }
    
    .timeline-text {
      bottom: calc(100% - 15px);
    }
  }

  .item-bottom {
    .timeline-dot {
      margin-bottom: 60px;
    }
    
    .timeline-text {
      top: calc(100% + 5px);
    }
  }
}
</style> 