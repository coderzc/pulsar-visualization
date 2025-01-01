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
  border: none;
  border-radius: 8px;
  padding: 8px;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 193, 7, 0.2));
  z-index: 0;
  box-shadow: 0 2px 12px rgba(255, 152, 0, 0.15);
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
  background: linear-gradient(135deg, #FF9800, #F57C00);
  border: none;
  border-radius: 6px;
  position: relative;
  margin: 0;
  padding: 6px 8px;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);
}

.broker-header {
  font-size: 12px;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.message-queue {
  display: flex;
  flex-direction: row;
  gap: 1px;
  min-height: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 4px;
  padding: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.queue-slot {
  width: 20px;
  height: 16px;
  border: 1px dashed rgba(255, 152, 0, 0.3);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #666;
  position: relative;
  background: white;
  transition: all 0.3s ease;
}

.queue-slot.filled {
  width: 20px;
  height: 16px;
  background: linear-gradient(135deg, #2196F3, #1976D2);
  border: none;
  border-radius: 3px;
  color: white;
  box-shadow: 0 1px 3px rgba(33, 150, 243, 0.3);
}

.queue-slot.next-to-consume::after {
  content: "↑";
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  color: #1976D2;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(25, 118, 210, 0.2);
}
</style> 