<template>
  <div 
    class="message"
    :class="{ 
      'acknowledged': acknowledged
    }"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
      opacity: `${opacity}`
    }"
  >M{{ content }}</div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  content: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1000
  },
  opacity: {
    type: Number,
    default: 1
  },
  acknowledged: {
    type: Boolean,
    default: false
  }
})

</script>

<style scoped>
.message {
  position: absolute;
  width: 32px;
  height: 24px;
  background: #FFF3E0;
  border: 1px solid #FFE0B2;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #E65100;
  z-index: 1;
}

.message.acknowledged {
  background: #9E9E9E;
  border-color: #757575;
  color: white;
  opacity: 0.7;
}
</style> 