import { ref, reactive, computed } from 'vue'

export function useMessageSimulation(config) {
  // 状态定义
  const state = reactive({
    producerRunning: false,
    consumerRunning: false,
    messageCount: 0,
    consumeCount: 0,
    currentConsumeIndex: 0,
    firstMessageProcessed: false,
    isProcessing: false
  })

  const components = reactive({
    producers: [],
    brokers: [],
    consumers: []
  })

  const animatingMessages = ref([])
  let messageId = 0

  // 定时器
  let producerInterval = null
  let consumerInterval = null
  let processInterval = null

  // 方法定义
  function initializeComponents() {
    const queueSize = 12
    const centerY = 200
    const padding = 5

    const producerSection = config.totalWidth * 0.2
    const brokerSection = config.totalWidth * 0.8
    const consumerSection = config.totalWidth * 0.2

    const producerStart = padding
    const brokerStart = producerSection + padding
    const consumerStart = brokerStart + brokerSection

    const producerX = producerStart + (producerSection / 2) - 60
    const brokerX = brokerStart + (brokerSection / 2) - 100
    const consumerX = consumerStart + (consumerSection / 2) - 100

    components.producers.length = 0
    components.brokers.length = 0
    components.consumers.length = 0

    components.producers.push({
      id: 'producer1',
      x: producerX,
      y: centerY,
      name: 'Producer'
    })

    components.brokers.push({
      id: 'broker0',
      x: brokerX,
      y: centerY,
      name: 'Broker',
      queue: Array(queueSize).fill(null)
    })

    components.consumers.push({
      id: 'consumer1',
      x: consumerX,
      y: centerY,
      name: 'Consumer',
      queue: Array(6).fill(null),
      queueOffset: 0,
      isSliding: false
    })
  }

  function addAnimatingMessage(msg) {
    messageId++
    animatingMessages.value.push({
      id: messageId,
      ...msg
    })
    return messageId
  }

  function removeAnimatingMessage(id) {
    const index = animatingMessages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      animatingMessages.value.splice(index, 1)
    }
  }

  function simulateMessageFlow() {
    if (!state.producerRunning) return

    state.messageCount++
    const currentMessage = {
      id: state.messageCount,
      show: false
    }
    
    const producer = components.producers[0]
    const broker = components.brokers[0]

    let nextSlot = broker.queue.findIndex(slot => slot === null)
    const isFull = nextSlot === -1

    if (!isFull) {
      broker.queue[nextSlot] = currentMessage
      
      const targetSlot = document.getElementById(`${broker.id}-slot-${nextSlot}`)
      const targetRect = targetSlot.getBoundingClientRect()
      const vizRect = document.getElementById('pulsar-viz').getBoundingClientRect()
      const targetX = targetRect.left - vizRect.left
      const targetY = targetRect.top - vizRect.top

      const msgId = addAnimatingMessage({
        content: currentMessage.id,
        type: 'message',
        x: producer.x + 150,
        y: producer.y + 15,
        targetX,
        targetY,
        animating: false
      })

      setTimeout(() => {
        const msgIndex = animatingMessages.value.findIndex(msg => msg.id === msgId)
        if (msgIndex !== -1) {
          animatingMessages.value[msgIndex].animating = true
          animatingMessages.value[msgIndex].x = targetX
          animatingMessages.value[msgIndex].y = targetY
        }
      }, 50)

      setTimeout(() => {
        removeAnimatingMessage(msgId)
        setTimeout(() => {
          broker.queue[nextSlot].show = true
        }, 50)
      }, config.animationSpeed + 100)
    }
  }

  function consumeMessage() {
    if (!state.consumerRunning || state.isProcessing) return

    const broker = components.brokers[0]
    const consumer = components.consumers[0]

    if (state.currentConsumeIndex >= broker.queue.length || 
        broker.queue[state.currentConsumeIndex] === null ||
        !broker.queue[state.currentConsumeIndex].show) return

    let nextSlot = consumer.queue.findIndex(slot => slot === null)
    if (nextSlot === -1) return

    state.isProcessing = true

    const currentMessage = {
      id: broker.queue[state.currentConsumeIndex].id,
      show: false
    }

    const sourceSlot = document.getElementById(`${broker.id}-slot-${state.currentConsumeIndex}`)
    const targetSlot = document.getElementById(`${consumer.id}-slot-${nextSlot}`)
    const sourceRect = sourceSlot.getBoundingClientRect()
    const targetRect = targetSlot.getBoundingClientRect()
    const vizRect = document.getElementById('pulsar-viz').getBoundingClientRect()
    const sourceX = sourceRect.left - vizRect.left
    const sourceY = sourceRect.top - vizRect.top
    const targetX = targetRect.left - vizRect.left
    const targetY = targetRect.top - vizRect.top

    consumer.queue[nextSlot] = currentMessage
    state.currentConsumeIndex++
    
    const msgId = addAnimatingMessage({
      content: currentMessage.id,
      type: 'message',
      x: sourceX,
      y: sourceY,
      targetX,
      targetY,
      animating: false
    })

    setTimeout(() => {
      const msgIndex = animatingMessages.value.findIndex(msg => msg.id === msgId)
      if (msgIndex !== -1) {
        animatingMessages.value[msgIndex].animating = true
        animatingMessages.value[msgIndex].x = targetX
        animatingMessages.value[msgIndex].y = targetY
      }
    }, 50)

    setTimeout(() => {
      removeAnimatingMessage(msgId)
      setTimeout(() => {
        if (consumer.queue[nextSlot] !== null) {
          consumer.queue[nextSlot].show = true
        }
        state.isProcessing = false
      }, 50)
    }, config.animationSpeed + 100)
  }

  function processMessage() {
    if (!state.consumerRunning || state.isProcessing) return

    const consumer = components.consumers[0]
    const processMessageIndex = consumer.queue.findIndex(msg => msg !== null && msg.show)
    if (processMessageIndex === -1) return

    state.isProcessing = true

    if (!state.firstMessageProcessed) {
      state.firstMessageProcessed = true
      setTimeout(() => {
        processMessageAnimation(consumer, processMessageIndex)
      }, 1000)
      return
    }

    processMessageAnimation(consumer, processMessageIndex)
  }

  function processMessageAnimation(consumer, processMessageIndex) {
    const targetSlot = document.getElementById(`${consumer.id}-slot-${processMessageIndex}`)
    const targetRect = targetSlot.getBoundingClientRect()
    const vizRect = document.getElementById('pulsar-viz').getBoundingClientRect()
    const startX = targetRect.left - vizRect.left
    const startY = targetRect.top - vizRect.top

    const msgId = addAnimatingMessage({
      content: consumer.queue[processMessageIndex].id,
      type: 'message',
      x: startX,
      y: startY,
      targetX: startX,
      targetY: startY - 20,
      animating: false
    })

    setTimeout(() => {
      const msgIndex = animatingMessages.value.findIndex(msg => msg.id === msgId)
      if (msgIndex !== -1) {
        consumer.queue[processMessageIndex].show = false
        animatingMessages.value[msgIndex].animating = true
        animatingMessages.value[msgIndex].fadeOut = true
      }
    }, 50)

    setTimeout(() => {
      removeAnimatingMessage(msgId)
      const newQueue = [...consumer.queue]
      newQueue.splice(processMessageIndex, 1)
      newQueue.push(null)
      consumer.queue = newQueue
      state.isProcessing = false
    }, config.animationSpeed + 100)
  }

  function startSimulation() {
    state.producerRunning = true
    state.consumerRunning = true
    producerInterval = setInterval(simulateMessageFlow, config.produceInterval)
    consumerInterval = setInterval(consumeMessage, 1000)
    processInterval = setInterval(processMessage, config.processInterval)
  }

  function pauseSimulation() {
    state.producerRunning = false
    state.consumerRunning = false
    clearInterval(producerInterval)
    clearInterval(consumerInterval)
    clearInterval(processInterval)
  }

  function resetSimulation() {
    pauseSimulation()
    state.messageCount = 0
    state.consumeCount = 0
    state.currentConsumeIndex = 0
    state.firstMessageProcessed = false
    state.isAnimating = false
    animatingMessages.value = []
    initializeComponents()
    messageId = 0
  }

  function setSpeed(speed) {
    config.animationSpeed = speed
  }

  function applyConfig() {
    resetSimulation()
  }

  function toggleSimulation() {
    if (state.producerRunning) {
      pauseSimulation()
    } else {
      startSimulation()
    }
  }

  // 初始化
  initializeComponents()

  return {
    state,
    components,
    animatingMessages,
    currentConsumeIndex: computed(() => state.currentConsumeIndex),
    brokerSection: computed(() => config.totalWidth * 0.5),
    consumerSection: computed(() => config.totalWidth * 0.3),
    toggleSimulation,
    resetSimulation,
    setSpeed,
    applyConfig
  }
} 