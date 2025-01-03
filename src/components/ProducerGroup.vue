<template>
  <div 
    class="producer-group"
    :style="{ 
      left: '20px', 
      top: '80px',
      width: 'calc(20% - 40px)',
      height: 'calc(100% - 160px)'
    }"
  >
    <Producer
      v-for="producer in producers" 
      :key="producer.id"
      :producer="producer"
    />
  </div>
</template>

<script setup>
import Producer from './Producer.vue'

defineProps({
  producers: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.producer-group {
  position: absolute;
  border: 2px dashed #64B5F6;
  border-radius: 8px;
  padding: 10px;
  background: rgba(227, 242, 253, 0.1);
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 