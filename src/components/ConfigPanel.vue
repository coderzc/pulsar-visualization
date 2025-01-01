<template>
  <div class="config-panel">
    <h1>Pulsar 配置</h1>

    <div class="config-group">
      <label>生产速度 (ms):</label>
      <input 
        type="number" 
        v-model="config.produceInterval" 
        min="500" 
        max="5000" 
        step="100"
      >
    </div>

    <div class="config-group">
      <label>处理速度 (ms):</label>
      <input 
        type="number" 
        v-model="config.processInterval" 
        min="500" 
        max="5000" 
        step="100"
      >
    </div>

    <button @click="$emit('apply-config')">应用配置</button>

    <div class="description">
      <h3>关于 Apache Pulsar</h3>
      <p>Pulsar 是一个分布式消息和流平台。在这个简化的模型中：</p>
      <ul>
        <li>Producer 产生消息</li>
        <li>Broker 负责消息的存储和转发</li>
        <li>Consumer 消费消息</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  config: {
    type: Object,
    required: true
  }
})

defineEmits(['apply-config'])
</script>

<style scoped>
.config-panel {
  flex: 0 0 280px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.config-group {
  margin-bottom: 15px;
}

.config-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.config-group input[type="number"] {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
}

.description {
  margin-top: 25px;
  font-size: 14px;
}

.description h3 {
  font-size: 18px;
  margin: 15px 0;
}

.description ul {
  padding-left: 25px;
  margin: 10px 0;
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