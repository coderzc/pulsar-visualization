<template>
  <div 
    class="broker-group"
    :style="{ 
      left: 'calc(20% + 20px)', 
      top: '80px',
      width: 'calc(50%)',
      height: 'calc(100% - 160px)'
    }"
  >
    <Broker
      v-for="broker in brokers" 
      :key="broker.id"
      :broker="broker"
    />
  </div>
</template>

<script setup>
import Broker from './Broker.vue'

defineProps({
  brokers: {
    type: Array,
    required: true
  },
  brokerSection: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.broker-group {
  position: absolute;
  border: 2px dashed #81C784;
  border-radius: 8px;
  padding: 10px;
  background: rgba(232, 245, 233, 0.1);
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 