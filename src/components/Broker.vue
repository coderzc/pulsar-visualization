<template>
  <div class="component broker" :id="broker.id">
    {{ broker.name }}
    <div class="message-queue" :style="{
      width: 'calc(100% - 10px)'
    }">
      <div class="queue-container" :style="{
        transform: hasAcknowledged ? `translateX(${-36 * moveOffset}px)` : 'none',
        width: hasAcknowledged ? `calc(100% + ${36 * moveOffset}px)` : '100%',
        transition: 'all 0.3s ease'
      }">
        <div v-for="(msg, index) in broker.queue" :key="index" class="queue-slot" :id="broker.id + '-slot-' + index"
          :class="{
            'next-to-consume': index === broker.readIndex,
            'filled': msg != null && msg.show,
            'acknowledged': msg && msg.acknowledged
          }" style="margin: 0 1px">
          <span v-if="msg != null && msg.show">
            {{ msg != null ? 'M' + msg.id : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

const props = defineProps({
  broker: {
    type: Object,
    required: true
  }
})

const moveOffset = ref(0)

// 监听队列和 readIndex 的变化
watch(
  () => [props.broker.queue.map(msg => msg?.acknowledged), props.broker.readIndex],
  () => {
    setTimeout(() => {
      let ackIndex = props.broker.queue.findIndex(msg => msg != null &&!msg.acknowledged) - 1 
      if (ackIndex > 0 ) {
        moveOffset.value = ackIndex;
      }
    }, 500)
  },
  { deep: true, immediate: true }
)

const hasAcknowledged = computed(() => moveOffset.value > 0)
</script>

<style scoped>
.broker {
  background: #E8F5E9;
  border: 2px solid #4CAF50;
  border-radius: 6px;
  position: relative;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  color: #2E7D32;
  width: calc(100% - 30px);
}

.message-queue {
  display: flex;
  flex-direction: row;
  gap: 2px;
  margin: 5px 0 40px 0;
  height: 40px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
}

.queue-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
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
  margin: 0;
  flex-shrink: 0;
}

.queue-slot.filled {
  background: #FFF3E0;
  border: 1px solid #FFE0B2;
  border-radius: 3px;
  color: #E65100;
  transition: opacity 0.3s ease;
}

.queue-slot.filled.acknowledged {
  background: #9E9E9E;
  border-color: #757575;
  color: white;
  opacity: 0.7;
}

.queue-slot.next-to-consume::after {
  content: "↑";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: #FB8C00;
  font-size: 16px;
  font-weight: bold;
}
</style>