<template>
  <div 
    class="component consumer"
    :id="consumer.id"
    :style="{ 
      left: (consumer.x - consumerSection/2) + 'px', 
      top: consumer.y + 'px',
      width: (consumerSection - 40) + 'px' 
    }"
  >
    <div style="margin-bottom: 10px">{{ consumer.name }}</div>
    <div 
      class="message-queue" 
      :style="{ 
        width: (consumerSection - 80) + 'px', 
        justifyContent: 'flex-start', 
        overflow: 'hidden' 
      }"
    >
      <div 
        v-for="(msg, index) in consumer.queue"
        :key="index"
        class="queue-slot"
        :id="consumer.id + '-slot-' + index"
        :class="{ 'filled': msg !== null && msg.show }"
        style="margin: 0 2px"
      >
        <span v-if="msg !== null && msg.show">
          {{ msg !== null ? 'M' + msg.id : '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  consumer: {
    type: Object,
    required: true
  },
  consumerSection: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.component {
  position: absolute;
  padding: 8px 12px;
  background: linear-gradient(135deg, #9C27B0, #7B1FA2);
  border: none;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  color: white;
  box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
  z-index: 1;
  transition: all 0.3s ease;
}

.component:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4);
}

.consumer {
  background: #e3f2fd;
  border-color: #2196f3;
}

.message-queue {
  display: flex;
  flex-direction: row;
  gap: 2px;
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 4px;
  padding: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.queue-slot {
  width: 20px;
  height: 16px;
  border: 1px dashed rgba(156, 39, 176, 0.3);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #666;
  background: white;
  transition: all 0.3s ease;
}

.queue-slot.filled {
  background: linear-gradient(135deg, #E91E63, #C2185B);
  border: none;
  color: white;
  box-shadow: 0 1px 3px rgba(233, 30, 99, 0.3);
}
</style> 