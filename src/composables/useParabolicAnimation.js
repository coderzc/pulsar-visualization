import { ref } from 'vue'

export const CURVE_TYPE = {
  NONE: 'none',
  UP: 'up',
  DOWN: 'down'
}

export function useParabolicAnimation(config = { duration: 2000 }) {
  const animatingItems = ref([])
  
  function addAnimatingItem(item) {
    const id = item.id
    let startTime = Date.now()
    const duration = item.duration || config.duration
    let lastUpdateTime = startTime

    if (item.onAnimationStart) {
      item.onAnimationStart()
    }

    function updatePosition() {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // 每 50ms 更新一次目标位置
      if (currentTime - lastUpdateTime >= 50 && item.getTarget) {
        lastUpdateTime = currentTime
        // 使用传入的函数计算目标位置
        const target = item.getTarget()
        if (target) {
          // console.log(`[${item.id}] Updating target:`, {
          //   oldTargetX: item.targetX,
          //   oldTargetY: item.targetY,
          //   newTargetX: target.x,
          //   newTargetY: target.y
          // })
          item.targetX = target.x
          item.targetY = target.y
        }
      }

      const x = calculateX(item.startX, item.targetX, progress)
      const y = calculateY(item.startX, item.targetX, item.startY, item.targetY, progress, item.curve)

      // console.log(`[${item.id}] Animation frame:`, {
      //   progress,
      //   currentX: x,
      //   currentY: y,
      //   startX: item.startX,
      //   startY: item.startY,
      //   targetX: item.targetX,
        // targetY: item.targetY,
        // elapsedTime,
      //   duration
      //  })

      animatingItems.value = animatingItems.value.map(i => {
        if (i.id === id) {
          return { ...i, x, y }
        }
        return i
      })

      if (progress < 1) {
        requestAnimationFrame(updatePosition)
      } else {
        // console.log(`[${item.id}] Animation complete`)
        if (item.onAnimationEnd) {
          item.onAnimationEnd()
        }
        removeAnimatingItem(id)
      }
    }

    animatingItems.value.push({
      ...item,
      x: item.startX,
      y: item.startY,
    })

    requestAnimationFrame(updatePosition)
    return id
  }
  
  function removeAnimatingItem(id) {
    animatingItems.value = animatingItems.value.filter(item => item.id !== id)
  }
  
  // 计算 X 坐标
  function calculateX(startX, targetX, progress) {
    return startX + (targetX - startX) * progress
  }

  // 计算 Y 坐标（带抛物线效果）
  function calculateY(startX, targetX, startY, targetY, progress, curve) {
    const linearY = startY + (targetY - startY) * progress
    
    if (curve === CURVE_TYPE.NONE) return linearY
    
    // 抛物线效果
    const midX = (startX + targetX) / 2
    const currentX = calculateX(startX, targetX, progress)
    const offset = curve === CURVE_TYPE.UP ? -100 : 100
    const parabolicY = -4 * offset * (currentX - startX) * (currentX - targetX) / Math.pow(targetX - startX, 2)
    
    return linearY + parabolicY
  }

  return {
    animatingItems,
    addAnimatingItem,
    removeAnimatingItem
  }
} 