<template>
  <div class="component consumer" :id="consumer.id">
    <div style="margin-bottom: 10px">{{ consumer.name }}</div>
    <div class="message-queue" :style="{
      width: 'calc(100% - 10px)',
      overflow: 'hidden'
    }">
      <div class="queue-container" 
        :key="resetKey"
        :style="{
          transform: `translateX(${-36 * moveOffset}px)`,
          transition: moveOffset > 0 ? `transform var(--fade-duration) ease` : 'none'
        }">
        <div v-for="(msg, index) in consumer.queue" :key="index" class="queue-slot" :id="consumer.id + '-slot-' + index"
          :class="{ 
            'filled': msg != null && msg.show,
            'fade-out': msg?.fadeOut,
            'reset-position': msg?.resetPosition
          }"
          :style="{
            margin: '0 2px',
            '--fade-duration': duration + 'ms'
          }"
          @transitionend="onTransitionEnd(msg)">
          <span v-if="msg != null && msg.show">
            {{ 'M' + msg.id }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  consumer: {
    type: Object,
    required: true
  },
  duration: {
    type: Number,
    default: 2000
  }
})

const moveOffset = ref(0)
const resetKey = ref(0)

// 监听队列长度变化
watch(() => props.consumer.queue.length, (newLen, oldLen) => {
  // 只在队列长度减少时（shift操作）触发动画
  if (newLen < oldLen && moveOffset.value === 0) {
    moveOffset.value = 1
  }
}, { flush: 'post' })

// 监听队列内容变化，用于重置
watch(() => props.consumer.queue, (newQueue) => {
  // 如果队列全是 null，说明是重置操作
  if (newQueue.every(item => item === null)) {
    moveOffset.value = 0
    // 强制重新渲染容器
    resetKey.value++
  }
}, { deep: true })

function onTransitionEnd(msg) {
  if (msg?.fadeOut) {
    msg.resetPosition = true
    moveOffset.value = 0
  }
}
</script>

<style scoped>
.consumer {
  background: #FFF3E0;
  border: 2px solid #FFA726;
  border-radius: 6px;
  position: relative;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  color: #E65100;
  width: calc(100% - 30px);
}

.message-queue {
  display: flex;
  flex-direction: row;
  gap: 2px;
  margin: 5px 0 0 0;
  height: 40px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.queue-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.queue-slot {
  width: 32px;
  height: 24px;
  border: 1px dashed #ccc;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  position: relative;
  background: white;
  flex-shrink: 0;
  transform: translateX(0);
  transition: transform var(--fade-duration) ease;
}

.queue-slot.filled {
  background: #FFF3E0;
  border: 1px solid #FFE0B2;
  border-radius: 3px;
  color: #E65100;
}

.queue-slot.fade-out {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity var(--fade-duration) ease, transform var(--fade-duration) ease;
}

.queue-slot.reset-position {
  transform: translateX(0);
  transition: none;
}
</style>
