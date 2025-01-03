<template>
  <div 
    class="ack"
    :style="{
      left: `${x}px`,
      top: `${y}px`
    }"
  >A{{ messageId }}</div>
</template>

<script setup>
defineProps({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1000
  },
  messageId: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.ack {
  position: absolute;
  width: 24px;
  height: 24px;
  background: #4ca64f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  z-index: 1000;
  margin-left: -12px;
  margin-top: -12px;
}
</style> 