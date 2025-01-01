<template>
  <div 
    class="message"
    :class="{ 
      animating: message.animating,
      'fade-out': message.fadeOut
    }"
    :style="{ 
      left: message.x + 'px', 
      top: message.y + 'px',
      '--animation-duration': animationSpeed + 'ms'
    }"
  >
    M{{ message.content }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  },
  animationSpeed: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.message {
  position: absolute;
  width: 40px;
  height: 25px;
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 3px;
  color: #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 2;
  opacity: 1;
  transition: all var(--animation-duration) ease;
}

.message.fade-out {
  opacity: 0;
  transform: translateY(-20px);
}

.message.animating {
  transition: all var(--animation-duration) ease;
}
</style> 