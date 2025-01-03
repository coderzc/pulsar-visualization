<template>
  <div 
    class="component producer"
    :id="producer.id"
  >
    <div style="margin-bottom: 10px">{{ producer.name }}</div>
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
.producer {
  background: #E3F2FD;
  border: 2px solid #64B5F6;
  border-radius: 6px;
  position: relative;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  color: #1976D2;
  width: calc(100% - 30px);
  text-align: center;
}
</style> 