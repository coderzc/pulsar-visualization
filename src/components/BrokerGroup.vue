<template>
  <div 
    class="broker-group"
    :style="{ 
      left: (brokers[0].x - brokerSection/2) + 'px', 
      top: (brokers[0].y - 50) + 'px', 
      width: brokerSection + 'px', 
      height: '140px' 
    }"
  >
    <div 
      v-for="broker in brokers"
      :key="broker.id"
      class="component broker"
      :id="broker.id"
      :style="{ width: (brokerSection - 60) + 'px' }"
    >
      {{ broker.name }}
      <div 
        class="message-queue" 
        :style="{ 
          width: (brokerSection - 100) + 'px', 
          justifyContent: 'flex-end' 
        }"
      >
        <div 
          v-for="(msg, index) in [...broker.queue].reverse()"
          :key="index"
          class="queue-slot"
          :id="broker.id + '-slot-' + (broker.queue.length - 1 - index)"
          :class="{ 
            'next-to-consume': (broker.queue.length - 1 - index) === currentConsumeIndex && msg !== null && msg.show,
            'filled': msg !== null && msg.show
          }"
          style="margin: 0 2px"
        >
          <span v-if="msg !== null && msg.show">
            {{ msg !== null ? 'M' + msg.id : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  brokers: {
    type: Array,
    required: true
  },
  brokerSection: {
    type: Number,
    required: true
  },
  currentConsumeIndex: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.broker-group {
  position: absolute;
  border: 2px solid #ff9800;
  border-radius: 8px;
  padding: 15px;
  background: rgba(255, 248, 225, 0.5);
  z-index: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

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

.broker {
  background: #fff8e1;
  border-color: #ff9800;
  position: relative;
  margin: 10px 0;
  left: auto;
  top: auto;
  transform: none;
  width: 100%;
  padding: 12px 15px;
}

.message-queue {
  display: flex;
  flex-direction: row;
  gap: 2px;
  margin: 8px 0 0 0;
  min-height: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px;
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

.queue-slot.next-to-consume::after {
  content: "↑";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: #2196f3;
  font-size: 16px;
  font-weight: bold;
}
</style> 