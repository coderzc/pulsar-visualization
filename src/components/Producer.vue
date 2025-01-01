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
  padding: 8px 12px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border: none;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  color: white;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  z-index: 1;
  transition: all 0.3s ease;
}

.component:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.producer {
  background: #e8f5e9;
  border-color: #4caf50;
  width: 120px;
}
</style> 