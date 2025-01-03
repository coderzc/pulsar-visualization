<template>
  <div 
    class="consumer-group"
    :style="{ 
      right: '20px', 
      top: '80px',
      width: 'calc(25% - 40px)',
      height: 'calc(100% - 160px)'
    }"
  >
    <Consumer 
      v-for="consumer in consumers" 
      :key="consumer.id" 
      :consumer="consumer"
      :duration="duration"
    />
  </div>
</template>

<script setup>
import Consumer from './Consumer.vue'

defineProps({
  consumers: {
    type: Array,
    required: true
  },
  duration: {
    type: Number,
    default: 2000
  }
})
</script>

<style scoped>
.consumer-group {
  position: absolute;
  border: 2px dashed #FFB74D;
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 243, 224, 0.1);
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 