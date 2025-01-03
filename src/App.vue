<template>
  <div class="container">
    <ConfigPanel 
      :config="config"
      @apply-config="applyConfig"
    />
    <VisualizationPanel 
      :config="config"
      :state="state"
      :components="components"
      :animatingMessages="animatingMessages"
      :animatingAcks="animatingAcks"
      :brokerSection="brokerSection"
      :consumerSection="consumerSection"
      @toggle-simulation="toggleSimulation"
      @reset-simulation="resetSimulation"
      @set-speed="setSpeed"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import ConfigPanel from './components/ConfigPanel.vue'
import VisualizationPanel from './components/VisualizationPanel.vue'
import { useMessageSimulation } from './composables/useMessageSimulation'

// 状态定义
const config = reactive({
  produceInterval: 1000,
  processInterval: 2000,
  animationSpeed: 2000,
  totalWidth: 1200
})

const {
  state,
  components,
  animatingMessages,
  animatingAcks,
  brokerSection,
  consumerSection,
  toggleSimulation,
  resetSimulation,
  setSpeed,
  applyConfig
} = useMessageSimulation(config)
</script>

<style>
@import './assets/styles/main.css';

.container {
  display: flex;
  width: 100%;
  margin: 20px auto;
  gap: 20px;
  padding: 0 20px;
}
</style>
