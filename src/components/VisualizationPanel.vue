<template>
  <div class="visualization-panel">
    <h1>消息流转可视化</h1>

    <div class="controls">
      <button @click="$emit('toggle-simulation')">
        {{ state.producerRunning ? '暂停' : '开始模拟' }}
      </button>
      <button @click="$emit('reset-simulation')">重置</button>
      <div class="speed-control">
        <label>动画速度:</label>
        <button @click="$emit('set-speed', 2000)">慢速</button>
        <button @click="$emit('set-speed', 1000)">正常</button>
        <button @click="$emit('set-speed', 500)">快速</button>
      </div>
    </div>

    <div class="visualization" id="pulsar-viz">
      <!-- 虚线 -->
      <div class="dashed-line" style="left: calc(15% + 40px)"></div>
      <div class="dashed-line" style="left: calc(70% + 40px)"></div>

      <!-- Producer -->
      <Producer 
        v-for="producer in components.producers"
        :key="producer.id"
        :producer="producer"
      />

      <!-- Broker -->
      <BrokerGroup 
        :brokers="components.brokers"
        :brokerSection="brokerSection"
        :currentConsumeIndex="currentConsumeIndex"
      />

      <!-- Consumer -->
      <Consumer 
        v-for="consumer in components.consumers"
        :key="consumer.id"
        :consumer="consumer"
        :consumerSection="consumerSection"
      />

      <!-- 动画中的消息 -->
      <AnimatingMessage 
        v-for="msg in animatingMessages"
        :key="msg.id"
        :message="msg"
        :animationSpeed="config.animationSpeed"
      />
    </div>
  </div>
</template>

<script setup>
import Producer from './Producer.vue'
import BrokerGroup from './BrokerGroup.vue'
import Consumer from './Consumer.vue'
import AnimatingMessage from './AnimatingMessage.vue'

defineProps({
  config: {
    type: Object,
    required: true
  },
  state: {
    type: Object,
    required: true
  },
  components: {
    type: Object,
    required: true
  },
  animatingMessages: {
    type: Array,
    required: true
  },
  currentConsumeIndex: {
    type: Number,
    required: true
  },
  brokerSection: {
    type: Number,
    required: true
  },
  consumerSection: {
    type: Number,
    required: true
  }
})

defineEmits(['toggle-simulation', 'reset-simulation', 'set-speed'])
</script>

<style scoped>
.visualization-panel {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 800px;
}

.visualization {
  /* width: 100%; */
  height: 500px;
  border: 1px solid #ddd;
  position: relative;
  overflow: hidden;
  background: #f8f9fa;
  padding: 20px;
  margin-top: 20px;
}

h1 {
  margin: 0 0 20px 0;
  font-size: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
  align-items: center;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.speed-control label {
  font-size: 14px;
  color: #666;
}

.dashed-line {
  position: absolute;
  width: 2px;
  height: 100%;
  border-right: 2px dashed #ddd;
  z-index: 0;
  top: 0;
}

button {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 14px;
}

button:hover {
  background: #2980b9;
}
</style> 