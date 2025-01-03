import { ref, reactive, computed } from 'vue'
import { useParabolicAnimation, CURVE_TYPE } from './useParabolicAnimation'

export function useMessageSimulation(config) {
    const { animatingItems: animatingAcks, addAnimatingItem: addAnimatingAck, removeAnimatingItem: removeAnimatingAck } = useParabolicAnimation({ duration: config.animationSpeed })
    const { animatingItems: animatingMessages, addAnimatingItem: addAnimatingMessage, removeAnimatingItem: removeAnimatingMessage } = useParabolicAnimation({ duration: config.animationSpeed })

    // 状态定义
    const state = reactive({
        producerRunning: false,
        consumerRunning: false,
        messageCount: 0,
        consumeCount: 0,
        isProcessing: false,
    })

    const components = reactive({
        producers: [],
        brokers: [],
        consumers: []
    })

    let messageId = 0

    // 定时器
    let producerInterval = null
    let consumerInterval = null
    let processInterval = null

    // 添加一个变量来记录上次处理的时间
    let lastProcessTime = 0

    // 方法定义
    function initializeComponents() {
        const brokerQueueSize = 16
        const consumerQueueSize = 6
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
            queue: Array(brokerQueueSize).fill(null),
            readIndex: 0
        })

        components.consumers.push({
            id: 'consumer1',
            x: consumerX,
            y: centerY,
            duration: config.animationSpeed,
            name: 'Consumer',
            queue: Array(consumerQueueSize).fill(null)  // 使用 queue 来保持一致性
        })
    }

    function simulateMessageFlow() {
        if (!state.producerRunning) return

        const currentMessage = {
            id: state.messageCount,
            show: false,
            fadeOut: false
        }

        const producer = components.producers[0]
        const broker = components.brokers[0]

        let nextSlot = broker.queue.findIndex(msg => msg == null)
        const isFull = nextSlot === -1

        if (!isFull) {
            broker.queue[nextSlot] = currentMessage

            const targetSlot = document.getElementById(`${broker.id}-slot-${nextSlot}`)
            const targetRect = targetSlot.getBoundingClientRect()
            const vizRect = document.getElementById('pulsar-viz').getBoundingClientRect()
            const targetX = targetRect.left - vizRect.left - 1
            const targetY = targetRect.top - vizRect.top - 1

            const msgId = addAnimatingMessage({
                id: `msg-${state.messageCount}`,
                content: currentMessage.id,
                type: 'message',
                startX: producer.x + 150,
                startY: producer.y + 15,
                targetX,
                targetY,
                curve: CURVE_TYPE.UP,
                getTarget: () => {
                    const targetSlot = document.getElementById(`${broker.id}-slot-${nextSlot}`)
                    if (targetSlot) {
                        const targetRect = targetSlot.getBoundingClientRect()
                        const vizRect = document.getElementById('pulsar-viz').getBoundingClientRect()
                        return {
                            x: targetRect.left - vizRect.left - 1,
                            y: targetRect.top - vizRect.top - 1
                        }
                    }
                    return null
                },
                onAnimationEnd: () => {
                    broker.queue[nextSlot].show = true
                }
            })

            state.messageCount++
        }
    }

    function consumeMessage() {
        if (!state.consumerRunning) return

        const broker = components.brokers[0]
        const consumer = components.consumers[0]

        if (broker.readIndex >= broker.queue.length ||
            broker.queue[broker.readIndex] === null ||
            !broker.queue[broker.readIndex].show) return

        const currentMessage = {
            id: broker.queue[broker.readIndex].id,
            show: false,
            fadeOut: false
        }

        if (checkAndSendMessageToConsumer(currentMessage, broker, consumer, broker.readIndex)) {
            broker.readIndex++
        }
    }

    function checkAndSendMessageToConsumer(currentMessage, broker, consumer, readIndex) {
        // 检查槽位是否有空位
        let nextSlotIndex = consumer.queue.findIndex(msg => msg == null)
        const isFull = nextSlotIndex === -1
        if (isFull) return false

        consumer.queue[nextSlotIndex] = currentMessage

        const sourceSlot = document.getElementById(`${broker.id}-slot-${readIndex}`)
        const targetSlot = document.getElementById(`${consumer.id}-slot-${nextSlotIndex}`)
        const sourceRect = sourceSlot.getBoundingClientRect()
        const targetRect = targetSlot.getBoundingClientRect()
        const vizRect = document.getElementById('pulsar-viz').getBoundingClientRect()
        const sourceX = sourceRect.left - vizRect.left - 1
        const sourceY = sourceRect.top - vizRect.top - 1
        const targetX = targetRect.left - vizRect.left - 1
        const targetY = targetRect.top - vizRect.top - 1

        console.log("sendMessage:", currentMessage)

        addAnimatingMessage({
            id: `msg-${currentMessage.id}-consume`,
            content: currentMessage.id,
            type: 'message',
            startX: sourceX,
            startY: sourceY,
            targetX,
            targetY,
            curve: CURVE_TYPE.UP,
            duration: config.animationSpeed,
            getTarget: () => {
                let targetSlotIndex = consumer.queue.findIndex(msg => msg.id == currentMessage.id)
                const targetSlot = document.getElementById(`${consumer.id}-slot-${targetSlotIndex}`)
                if (targetSlot) {
                    const targetRect = targetSlot.getBoundingClientRect()
                    const vizRect = document.getElementById('pulsar-viz').getBoundingClientRect()
                    return {
                        x: targetRect.left - vizRect.left - 1,
                        y: targetRect.top - vizRect.top - 1
                    }
                }
                return null
            },
            onAnimationEnd: () => {
                console.log("receiveMessage:", currentMessage)
                let targetSlotIndex = consumer.queue.findIndex(msg => msg.id == currentMessage.id)
                consumer.queue[targetSlotIndex].show = true
            }
        })

        return true
    }

    function processMessage() {
        if (!state.consumerRunning) return

        const consumer = components.consumers[0]

        state.isProcessing = true
        const messageIndex = consumer.queue.findIndex(msg => msg != null && msg.show && !msg.fadeOut)
        if (messageIndex === -1) {
            state.isProcessing = false
            return
        }

        const message = consumer.queue[messageIndex]
        console.log("processMessag:", message)

        consumer.queue[messageIndex].fadeOut = true

        setTimeout(() => {
            consumer.queue.push(null)
            consumer.queue.shift()
            state.isProcessing = false
        }, config.animationSpeed +200)
        
        const vizRect = document.getElementById('pulsar-viz').getBoundingClientRect()
        const consumerSlot = document.getElementById(`${consumer.id}-slot-${messageIndex}`)
        const consumerRect = consumerSlot.getBoundingClientRect()
        const startX = consumerRect.left - vizRect.left - 1
        const startY = consumerRect.top - vizRect.top - 1

        // 创建 ACK 消息
        const broker = components.brokers[0]
        const messageId = message.id
        const brokerMessageIndex = broker.queue.findIndex(msg => msg && msg.id === messageId)

        const brokerSlot = document.getElementById(`${broker.id}-slot-${brokerMessageIndex}`)
        const brokerRect = brokerSlot.getBoundingClientRect()
        const brokerX = brokerRect.left - vizRect.left - 1
        const brokerY = brokerRect.top - vizRect.top - 1

        addAnimatingAck({
            id: `ack-${messageId}`,
            messageId,
            startX: startX + 15,
            startY: startY + 35,
            targetX: brokerX,
            targetY: brokerY,
            curve: CURVE_TYPE.DOWN,
            duration: config.animationSpeed,
            getTarget: () => {
                const brokerSlot = document.getElementById(`${broker.id}-slot-${brokerMessageIndex}`)
                if (brokerSlot) {
                    const brokerRect = brokerSlot.getBoundingClientRect()
                    const vizRect = document.getElementById('pulsar-viz').getBoundingClientRect()
                    return {
                        x: brokerRect.left - vizRect.left - 1,
                        y: brokerRect.top - vizRect.top - 1
                    }
                }
                return null
            },
            onAnimationEnd: () => {
                const msg = broker.queue[brokerMessageIndex]
                if (msg) {
                    msg.acknowledged = true
                    broker.queue.push(null)
                }
            }
        })
    }

    function startSimulation() {
        state.producerRunning = true
        state.consumerRunning = true
        producerInterval = setInterval(simulateMessageFlow, config.produceInterval)
        consumerInterval = setInterval(consumeMessage, 500)

        let lastProcessTime = Date.now()
        processInterval = setInterval(() => {
            const now = Date.now()
            if (!state.isProcessing) {
                if (now - lastProcessTime >= config.processInterval) {
                    processMessage()
                    lastProcessTime = now
                }
            }
        }, 100)  // 每 100ms 检查一次状态
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
        state.isProcessing = false
        state.isAnimating = false
        
        // 清空动画队列
        animatingMessages.value = []
        animatingAcks.value = []
        
        // 重置所有组件状态
        components.producers.forEach(producer => {
            producer.isProducing = false
        })
        
        components.brokers.forEach(broker => {
            broker.readIndex = 0
            broker.queue = Array(broker.queue.length).fill(null)
        })
        
        components.consumers.forEach(consumer => {
            consumer.queue = Array(consumer.queue.length).fill(null)
        })

        messageId = 0
        lastProcessTime = 0
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
        animatingAcks,
        brokerSection: computed(() => config.totalWidth * 0.8),
        consumerSection: computed(() => config.totalWidth * 0.2),
        toggleSimulation,
        resetSimulation,
        setSpeed,
        applyConfig
    }
} 