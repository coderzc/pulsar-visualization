<template>
  <div 
    class="component producer"
    :id="producer.id"
    :style="{ 
      left: producer.x + 'px', 
      top: producer.y + 'px' 
    }"
  >
    {{ producer.name }}
  </div>
</template>

<script setup>
defineProps({
  producer: {
    type: Object,
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

.producer {
  background: #e8f5e9;
  border-color: #4caf50;
  width: 120px;
}
</style> 