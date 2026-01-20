/**
 * Undo/Redo Manager for Map Operations
 * Manages history of operations like add/delete points, polylines, move positions
 */

class UndoManager {
  constructor() {
    this.history = []
    this.currentIndex = -1
    this.maxHistorySize = 50 // Limit history size to prevent memory issues
  }

  /**
   * Add a new state to history
   * @param {Object} state - The state to save
   * @param {string} operation - Description of the operation
   */
  saveState(state, operation = '') {
    // Remove any states after current index (when user made new changes after undo)
    this.history = this.history.slice(0, this.currentIndex + 1)
    
    // Add new state
    this.history.push({
      state: JSON.parse(JSON.stringify(state)), // Deep clone
      operation: operation,
      timestamp: Date.now()
    })
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    } else {
      this.currentIndex++
    }
    
    console.log(`UndoManager: Saved state for operation "${operation}"`)
  }

  /**
   * Undo the last operation
   * @returns {Object|null} Previous state or null if no undo available
   */
  undo() {
    if (this.canUndo()) {
      this.currentIndex--
      const state = this.history[this.currentIndex]
      console.log(`UndoManager: Undoing operation "${state.operation}"`)
      return state.state
    }
    return null
  }

  /**
   * Redo the next operation
   * @returns {Object|null} Next state or null if no redo available
   */
  redo() {
    if (this.canRedo()) {
      this.currentIndex++
      const state = this.history[this.currentIndex]
      console.log(`UndoManager: Redoing operation "${state.operation}"`)
      return state.state
    }
    return null
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    return this.currentIndex > 0
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1
  }

  /**
   * Get current state
   * @returns {Object|null}
   */
  getCurrentState() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex].state
    }
    return null
  }

  /**
   * Clear all history
   */
  clear() {
    this.history = []
    this.currentIndex = -1
    console.log('UndoManager: History cleared')
  }

  /**
   * Get history info for debugging
   * @returns {Object}
   */
  getHistoryInfo() {
    return {
      totalStates: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      operations: this.history.map(h => h.operation)
    }
  }
}

// Create singleton instance
const undoManager = new UndoManager()

export default undoManager
