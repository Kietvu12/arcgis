import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import undoManager from './UndoManager'
import { changeRootFolder, changeRootNen } from '../reducer_action/BaseMapActionReducer'

/**
 * Custom hook for undo/redo functionality
 */
export const useUndoRedo = () => {
  const dispatch = useDispatch()
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const list_root_nen = useSelector(state => state.baseMap.list_root_nen)

  /**
   * Save current state to history
   * @param {string} operation - Description of the operation
   */
  const saveState = useCallback((operation) => {
    const currentState = {
      list_root_folder: [...list_root_folder],
      list_root_nen: [...list_root_nen]
    }
    undoManager.saveState(currentState, operation)
  }, [list_root_folder, list_root_nen])

  /**
   * Undo last operation
   */
  const undo = useCallback(() => {
    const previousState = undoManager.undo()
    if (previousState) {
      console.log('Undo: Restoring state', previousState)
      dispatch(changeRootFolder([...previousState.list_root_folder]))
      dispatch(changeRootNen([...previousState.list_root_nen]))
      return true
    }
    console.log('Undo: No previous state available')
    return false
  }, [dispatch])

  /**
   * Redo next operation
   */
  const redo = useCallback(() => {
    const nextState = undoManager.redo()
    if (nextState) {
      dispatch(changeRootFolder([...nextState.list_root_folder]))
      dispatch(changeRootNen([...nextState.list_root_nen]))
      return true
    }
    return false
  }, [dispatch])

  /**
   * Check if undo is available
   */
  const canUndo = useCallback(() => {
    return undoManager.canUndo()
  }, [])

  /**
   * Check if redo is available
   */
  const canRedo = useCallback(() => {
    return undoManager.canRedo()
  }, [])

  /**
   * Clear history
   */
  const clearHistory = useCallback(() => {
    undoManager.clear()
  }, [])

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl+Z (undo) or Ctrl+Y (redo)
      if (event.ctrlKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault()
          if (canUndo()) {
            undo()
          }
        } else if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault()
          if (canRedo()) {
            redo()
          }
        }
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [undo, redo, canUndo, canRedo])

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory
  }
}

export default useUndoRedo
