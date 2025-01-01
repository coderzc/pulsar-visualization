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
  padding: 12px 20px;
  background: white;
  border: 2px solid #3498db;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.consumer {
  background: #e3f2fd;
  border-color: #2196f3;
}

.message-queue {
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin: 10px 0;
  min-height: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
}

.queue-slot {
  width: 40px;
  height: 25px;
  border: 1px dashed #ccc;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  position: relative;
  background: white;
  margin: 0 1px;
}

.queue-slot.filled {
  width: 40px;
  height: 25px;
  background: #e3f2fd;
  border-radius: 3px;
  color: #1976d2;
  transition: opacity 0.3s ease;
}
</style> 