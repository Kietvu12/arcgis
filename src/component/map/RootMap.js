import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  alertConfirm,
  create_UUID,
  getCountString,
  getItemSessionStorage,
  isNumber,
  setItemSessionStorage
} from '../base/base'
import $ from 'jquery'

import useStateRef from 'react-usestateref' // see this line

import {
  disabledFormThemCot,
  enableFormThemCot,
  FormThemCot
} from '../element/orther_element/FormThemCot'
import {
  enableFormsuaCot,
  FormSuaCot
} from '../element/orther_element/FormSuaCot'
import { BASE_COT, BASE_DUONG, CONTROLL } from '../const/Const_Obj'
import { ModalThemFolder } from './../element/modal/ModalThemFolder'
import { Const_Libs } from '../const/Const_Libs'
import {
  changeRootFolder,
  changeRootNen,
  setActiveControl,
  setControlXoaNhieuCot,
  setCotGocChenCot,
  setIndexChenCot,
  setScreenPoint,
  setStateSuaCot,
  setStateSuaNhieuCot,
  setStateThemCot
} from '../reducer_action/BaseMapActionReducer'
import { handleExportKML } from '../element/orther_element/ExportKML'
import { FormThemDuong } from '../element/orther_element/FormThemDuong'
import {
  disabledAllForm,
  findCotByUUidCot,
  findNearestPolyline,
  getIndexCot,
  getIndexCotForManualInsert,
  getSTTCot,
  getTenCotNoSTT,
  GRAPHIC_LAYER,
  handleXoaNhieuCot_Common,
  MAP,
  projectPointOntoPolyline,
  reRenderMap,
  reRenderNen,
  reRenderViewMap,
  setCenterMap,
  SIMPLE_MARKER_SYMBOL3,
  SIMPLE_MARKER_SYMBOL4,
  updateImgPoint,
  updateSTTCot,
  VIEW
} from './RootFunction'
import { FormSuaDuong } from '../element/orther_element/FormSuaDuong'
import { Images, IMAGES_COT_POTECO } from '../const/Const_Images'
import { ModalNhapSoLuongChenCot } from '../element/modal/ModalNhapSoLuongChenCot'
import {
  enableFormSuaNhieuCot,
  disabledFormSuaNhieuCot,
  FormSuaNhieuCot
} from '../element/orther_element/FormSuaNhieuCot'
import ModalDanhSTTCot from '../element/modal/ModalDanhSTTCot'
import { useUndoRedo } from '../undo/useUndoRedo'

const RootMap = props => {
  const dispatch = useDispatch()
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const list_root_nen = useSelector(state => state.baseMap.list_root_nen)
  
  // Undo/Redo functionality
  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo()
  
  // Watch for changes in list_root_folder and save state
  useEffect(() => {
    if (list_root_folder.length > 0) {
      // Save state whenever list_root_folder changes
      const timer = setTimeout(() => {
        saveState('Thay đổi dữ liệu')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [list_root_folder, saveState])
  
  const state_them_cot = useSelector(state => state.baseMap.state_them_cot)
  const state_sua_cot = useSelector(state => state.baseMap.state_sua_cot)
  const cot_goc_chen_cot = useSelector(state => state.baseMap.cot_goc_chen_cot)
  const state_sua_nhieu_cot = useSelector(
    state => state.baseMap.state_sua_nhieu_cot
  )

  const type_map = useSelector(state => state.baseMap.type_map)
  const screen_point = useSelector(state => state.baseMap.screen_point)
  const active_control = useSelector(state => state.baseMap.active_control)
  
  // Reset counter khi bắt đầu chế độ chèn cột thủ công
  useEffect(() => {
    if (active_control === 'chen_cot_thu_cong') {
      // Không reset counter ở đây, để giữ cho việc chèn tiếp
      // Chỉ reset khi chuyển sang mode khác
    } else {
      // Reset counter khi thoát chế độ chèn cột thủ công
      if (get_manualInsertCount_ref.current > 0) {
        set_manualInsertCount_ref(0)
      }
    }
  }, [active_control])
  var mapClick, mapDrag, mapOver
  const [
    check_save_duong_ref,
    set_check_save_duong_ref,
    get_check_save_duong_ref
  ] = useStateRef(true)
  const current_uuid_folder = useSelector(
    state => state.baseMap.current_uuid_folder
  )
  let index_chen_cot = useSelector(state => state.baseMap.index_chen_cot)

  const paths_duong = useSelector(state => state.baseMap.paths_duong)
  const [
    index_chen_cot_ref,
    set_index_chen_cot_ref,
    get_index_chen_cot_ref
  ] = useStateRef(index_chen_cot)
  const [
    list_root_folder_ref,
    set_list_root_folder_ref,
    get_list_root_folder_ref
  ] = useStateRef(list_root_folder)
  const [
    current_uuid_folder_ref,
    set_current_uuid_folder_ref,
    get_current_uuid_folder_ref
  ] = useStateRef(current_uuid_folder)

  const [
    state_them_cot_ref,
    set_state_them_cot_ref,
    get_state_them_cot_ref
  ] = useStateRef(state_them_cot)
  const [
    state_them_duong_ref,
    set_state_them_duong_ref,
    get_state_them_duong_ref
  ] = useStateRef(BASE_DUONG)
  const [
    paths_duong_ref,
    set_paths_duong_ref,
    get_paths_duong_ref
  ] = useStateRef(paths_duong)
  const [
    state_sua_cot_ref,
    set_state_sua_cot_ref,
    get_state_sua_cot_ref
  ] = useStateRef(state_sua_cot)
  const [
    state_sua_nhieu_cot_ref,
    set_state_sua_nhieu_cot_ref,
    get_state_sua_nhieu_cot_ref
  ] = useStateRef(state_sua_nhieu_cot)
  
  const [
    cot_goc_chen_cot_ref,
    set_cot_goc_chen_cot_ref,
    get_cot_goc_chen_cot_ref
  ] = useStateRef(cot_goc_chen_cot)
  
  // Ref để lưu số đếm cho tên cột khi chèn thủ công
  const [
    manualInsertCount_ref,
    set_manualInsertCount_ref,
    get_manualInsertCount_ref
  ] = useStateRef(0)

  const [
    active_control_ref,
    set_active_control_ref,
    get_active_control_ref
  ] = useStateRef(active_control)

  const styles = {
    mapDiv: {
      padding: 0,
      margin: 0,
      height: '100%',
      width: '100%'
    }
  }
  // FUNC HANDLE
  const mainEffect = () => {
    // $(window).bind('beforeunload', function (e) {
    //   e.preventDefault()

    //   return  alertConfirm("Bạn có chắc muốn reload lại trang k")

    // })
    $('#showModalThemCot').click(function () {
      $('.form-rj')
        .removeClass('d-block')
        .addClass('d-none')
      enableFormThemCot()
      dispatch(
        setActiveControl(
          get_active_control_ref.current == 'them_cot' ? 'them_cot' : 'them_cot'
        )
      )
    })
    $('#showModalSuaNhieuCot').click(function () {
      $('.form-rj')
        .removeClass('d-block')
        .addClass('d-none')
      
      const willEnable = get_active_control_ref.current != 'sua_nhieu_cot'
      
      if (willEnable) {
        enableFormSuaNhieuCot()
        dispatch(setControlXoaNhieuCot(true))
        dispatch(setActiveControl('sua_nhieu_cot'))
      } else {
        disabledFormSuaNhieuCot()
        dispatch(setControlXoaNhieuCot(false))
        dispatch(setActiveControl('default'))
        dispatch(setStateSuaNhieuCot([]))
      }
    })
    $('#showModalThemDuong').click(function () {
      $('.form-rj')
        .removeClass('d-block')
        .addClass('d-none')
      $('.form-them-duong').toggleClass('d-none')
      $('.form-them-duong').toggleClass('d-block')
      // console.log(check_save_duong);
      if (!get_check_save_duong_ref.current) {
        return
      }

      set_state_them_duong_ref(BASE_DUONG)
      let duong = {
        uuid_duong: create_UUID(),
        list_do_duong: [],
        active_do_duong: true,
        type: 'duong'
      }
      handleThemDuong(
        get_list_root_folder_ref.current,
        get_current_uuid_folder_ref.current,
        duong
      )
      set_paths_duong_ref({
        uuid_duong: duong.uuid_duong,
        paths: [],
        saved: false,
        changed: false
      })
      dispatch(setActiveControl('them_duong'))
      set_check_save_duong_ref(false)
    })
    $('.esri-print').addClass('d-none')
    $('.active-control').click(function () {
      $('.active-control').removeClass('active-gray')
      $(this).addClass('active-gray')
    })
    $('#exportKML').click(function () {
      handleExportKML(get_list_root_folder_ref.current)
    })
  }
  const handleMenuControl = value => {
    /**
     * Xử lý  sự kiện thêm cột khi chọn ở MenuControl
     *
     * @param No
     * @author XHieu
     */
    $('#menuControl').removeClass('d-block')
    $('#menuControl').addClass('d-none')
    dispatch(setActiveControl(value))
  }
  const handleThemDuong = (
    list_root_folder_local,
    uuid_folder_them_duong_local,
    duong
  ) => {
    /**
     * Xử lý thêm đường vào 1 folder
     * @param list_root_folder_local: danh sách đường và cột đọc ra từ kml
     * @param uuid_folder_them_duong_local: uuid của folder hiện
     * @param duong: thông tin của đường
     * @author XHieu
     */
    if (
      uuid_folder_them_duong_local == null ||
      uuid_folder_them_duong_local == ''
    ) {
      Const_Libs.TOAST.error(
        'Bạn phải chọn folder để thêm đường. Nếu chưa có hãy tạo mới.'
      )
    } else {
      list_root_folder_local.map(item_root => {
        if (item_root.uuid_folder == uuid_folder_them_duong_local) {
          item_root.list_group_duong_va_cot.push(duong)
          return 0
        }
      })
      dispatch(changeRootFolder([...list_root_folder_local]))
      reRenderMap([...list_root_folder_local])
    }
  }
  const handleRemoveLastDuong = (
    list_root_folder_local,
    uuid_folder_them_duong_local
  ) => {
    /**
     * Xử lý xóa Đo đường cuối cùng trong mảng
     *
     * @param no
     * @author XHieu
     */
    list_root_folder_local.map(item_root => {
      if (item_root.uuid_folder == uuid_folder_them_duong_local) {
        item_root.list_group_duong_va_cot.pop()
        return 0
      }
    })
    dispatch(changeRootFolder([...list_root_folder_local]))
    reRenderMap([...list_root_folder_local])
  }
  // Helper function to find insertion index recursively in nested folders
  const findIndexForManualInsertRecursive = (items, cotGoc, lon, lat, currentFolder = null) => {
    let indexCotGoc = -1
    let results = { index: -1, foundInFolder: null, items: null, indexCotGoc: -1 }

    items.forEach((item, index) => {
      // If this is a nested folder, search inside it recursively
      if (item.type === 'folder' || (item.folder_name && item.list_group_duong_va_cot && Array.isArray(item.list_group_duong_va_cot))) {
        // Check if column is in this nested folder
        const nestedResults = findIndexForManualInsertRecursive(
          item.list_group_duong_va_cot,
          cotGoc,
          lon,
          lat,
          item  // Pass current item as the folder context
        )

        if (nestedResults.index !== -1 && nestedResults.foundInFolder) {
          // Found in this nested folder
          results = nestedResults
          return
        }
      } else if (item.type === 'cot') {
        // Find index of source column
        if (item.uuid_cot === cotGoc.uuid_cot) {
          indexCotGoc = index
          console.log('Found source column at index:', index, 'in items array')
        }
      }
    })

    // If we found the source column in current items array, decide based on nearer neighbor
    if (indexCotGoc !== -1 && !results.foundInFolder) {
      // Find previous and next neighboring columns
      let prevIndex = -1
      let nextIndex = -1
      for (let i = indexCotGoc - 1; i >= 0; i--) {
        if (items[i] && items[i].type === 'cot') { prevIndex = i; break }
      }
      for (let i = indexCotGoc + 1; i < items.length; i++) {
        if (items[i] && items[i].type === 'cot') { nextIndex = i; break }
      }

      // Helper: squared distance point to segment AB
      const dist2PointToSegment = (px, py, ax, ay, bx, by) => {
        const abx = bx - ax
        const aby = by - ay
        const apx = px - ax
        const apy = py - ay
        const ab2 = abx * abx + aby * aby
        if (ab2 === 0) {
          // A and B are the same point
          const dx = px - ax
          const dy = py - ay
          return dx * dx + dy * dy
        }
        let t = (apx * abx + apy * aby) / ab2
        if (t < 0) t = 0
        if (t > 1) t = 1
        const cx = ax + t * abx
        const cy = ay + t * aby
        const dx = px - cx
        const dy = py - cy
        return dx * dx + dy * dy
      }

      // Compute direction from source towards click vs towards neighbors using angle (dot product)
      let useNext = false
      if (prevIndex === -1 && nextIndex !== -1) {
        useNext = true
      } else if (nextIndex === -1 && prevIndex !== -1) {
        useNext = false
      } else if (prevIndex !== -1 && nextIndex !== -1) {
        const p = { x: lon, y: lat }
        const prev = { x: items[prevIndex].coor[0], y: items[prevIndex].coor[1] }
        const src = { x: items[indexCotGoc].coor[0], y: items[indexCotGoc].coor[1] }
        const next = { x: items[nextIndex].coor[0], y: items[nextIndex].coor[1] }

        // Vectors from source
        const vSC = { x: p.x - src.x, y: p.y - src.y }
        const vSP = { x: prev.x - src.x, y: prev.y - src.y }
        const vSN = { x: next.x - src.x, y: next.y - src.y }

        const dot = (a, b) => a.x * b.x + a.y * b.y
        const len = v => Math.sqrt(v.x * v.x + v.y * v.y)
        const safeLen = v => {
          const l = len(v)
          return l === 0 ? 1 : l
        }
        const cosPrev = dot(vSC, vSP) / (safeLen(vSC) * safeLen(vSP))
        const cosNext = dot(vSC, vSN) / (safeLen(vSC) * safeLen(vSN))

        // Prefer the side with larger cosine (smaller angle)
        if (isFinite(cosPrev) && isFinite(cosNext)) {
          if (Math.abs(cosNext - cosPrev) > 1e-6) {
            useNext = cosNext > cosPrev
          } else {
            // Tie-breaker: fall back to distance-to-segment
            const dPrev2 = dist2PointToSegment(p.x, p.y, prev.x, prev.y, src.x, src.y)
            const dNext2 = dist2PointToSegment(p.x, p.y, src.x, src.y, next.x, next.y)
            useNext = dNext2 <= dPrev2
          }
        } else {
          // Fallback to distance-to-segment if cosine not reliable
          const dPrev2 = dist2PointToSegment(p.x, p.y, prev.x, prev.y, src.x, src.y)
          const dNext2 = dist2PointToSegment(p.x, p.y, src.x, src.y, next.x, next.y)
          useNext = dNext2 <= dPrev2
        }
      } else {
        // No neighbors, default insert after source
        results.index = indexCotGoc + 1
        results.indexCotGoc = indexCotGoc
        results.foundInFolder = currentFolder || null
        results.items = items
        console.log('No neighbors found. Insert after source at', results.index)
        return results
      }

      // Set insertion index between source and nearer neighbor
      if (useNext) {
        results.index = nextIndex
        console.log('Chọn cột đích là cột SAU gần nhất tại index:', nextIndex)
      } else {
        results.index = indexCotGoc // insert before source to be between prev and source
        console.log('Chọn cột đích là cột TRƯỚC gần nhất. Chèn trước cột gốc tại index:', indexCotGoc)
      }

      results.indexCotGoc = indexCotGoc
      results.foundInFolder = currentFolder || null  // Use current folder context
      results.items = items  // Store reference to items array
      console.log('Setting results - index:', results.index, 'in folder:', currentFolder?.folder_name || 'root')
    }

    return results
  }
  
  const findIndexForManualInsert = (cotGoc, lon, lat) => {
    // Tìm vị trí chèn dựa trên cột gốc và điểm click (hỗ trợ nested folders và nền bản đồ)
    console.log('findIndexForManualInsert - cotGoc:', cotGoc)
    
    if (!cotGoc || !cotGoc.uuid_folder) {
      console.error('Cột gốc không hợp lệ:', cotGoc)
      return { index: -1, foundInFolder: null, items: null, isInNenList: false, indexCotGoc: -1 }
    }
    
    // Search through all folders in list_root_folder
    console.log('Searching in list_root_folder...')
    for (let folder of get_list_root_folder_ref.current) {
      if (folder.uuid_folder === cotGoc.uuid_folder) {
        console.log('Found target root folder:', folder.folder_name)
        
        const results = findIndexForManualInsertRecursive(
          folder.list_group_duong_va_cot,
          cotGoc,
          lon,
          lat,
          folder  // Pass root folder as initial context
        )
        
        console.log('Search results:', results)
        
        if (results.index !== -1) {
          console.log('Insertion index found:', results.index, 'in folder:', results.foundInFolder?.folder_name || 'root')
          return { ...results, isInNenList: false }
        }
      }
      
      // Also search recursively in nested folders
      const nestedResults = findIndexInNestedFolder(folder.list_group_duong_va_cot, cotGoc, lon, lat, folder)
      if (nestedResults.index !== -1) {
        return { ...nestedResults, isInNenList: false }
      }
    }
    
    // Search in list_root_nen (nền bản đồ)
    console.log('Not found in root folders, searching in list_root_nen...')
    let list_root_nen = getItemSessionStorage('root_nen') || []
    
    for (let folder of list_root_nen) {
      if (folder.uuid_folder === cotGoc.uuid_folder) {
        console.log('Found target nen folder:', folder.folder_name)
        
        const results = findIndexForManualInsertRecursive(
          folder.list_group_duong_va_cot,
          cotGoc,
          lon,
          lat,
          folder
        )
        
        if (results.index !== -1) {
          console.log('Insertion index found in nen:', results.index)
          return { ...results, isInNenList: true }
        }
      }
      
      // Also search recursively in nested folders in nen
      const nestedResults = findIndexInNestedFolder(folder.list_group_duong_va_cot, cotGoc, lon, lat, folder)
      if (nestedResults.index !== -1) {
        return { ...nestedResults, isInNenList: true }
      }
    }
    
    console.log('Could not find insertion point')
    return { index: -1, foundInFolder: null, items: null, isInNenList: false, indexCotGoc: -1 }
  }
  
  // Helper function to search in nested folders
  const findIndexInNestedFolder = (items, cotGoc, lon, lat, parentFolder) => {
    if (!items || !Array.isArray(items)) {
      return { index: -1, foundInFolder: null, items: null, indexCotGoc: -1 }
    }
    
    for (let item of items) {
      // Check if this is a nested folder
      if (item.type === 'folder' || (item.folder_name && item.list_group_duong_va_cot && Array.isArray(item.list_group_duong_va_cot))) {
        if (item.uuid_folder === cotGoc.uuid_folder) {
          console.log('Found target nested folder:', item.folder_name)
          
          const results = findIndexForManualInsertRecursive(
            item.list_group_duong_va_cot,
            cotGoc,
            lon,
            lat,
            item
          )
          
          if (results.index !== -1) {
            return results
          }
        }
        
        // Continue searching deeper
        const deeperResults = findIndexInNestedFolder(item.list_group_duong_va_cot, cotGoc, lon, lat, item)
        if (deeperResults.index !== -1) {
          return deeperResults
        }
      }
    }
    
    return { index: -1, foundInFolder: null, items: null, indexCotGoc: -1 }
  }

  const handleThemCot = state_them_cot => {
    /**
     * Xử lý thêm thông tin của một cột
     *
     * @param no
     * @author XHieu
     */

    // Xử lý tên cột
    let name = state_them_cot.name.trim()
    
    // Với chèn thủ công, nếu tên đang rỗng thì tự sinh dựa trên vị trí chèn
    let cotGoc = cot_goc_chen_cot || state_sua_cot_ref.current
    
    // Check backward insertion FIRST for manual insertion mode
    if (get_active_control_ref.current === 'chen_cot_thu_cong') {
      const cotGocInfo = cotGoc
      const itemsArray = cotGocInfo?.itemsArray
      const insertionIndex = get_index_chen_cot_ref.current
      const indexCotGoc = cotGocInfo?.indexCotGoc
      
      // Reject backward insertion
      if (itemsArray && Array.isArray(itemsArray) && indexCotGoc != null && indexCotGoc >= 0 && insertionIndex != null && insertionIndex >= 0 && insertionIndex < indexCotGoc) {
        Const_Libs.TOAST.error('Bạn đang chèn ngược, vui lòng chèn đúng vị trí')
        console.log('Backward insertion detected, aborting')
        dispatch(
          setStateThemCot({
            ...get_state_them_cot_ref.current,
            action: false
          })
        )
        return
      }
    }
    
    if (get_active_control_ref.current === 'chen_cot_thu_cong' && (!name || name === '')) {
      try {
        const cotGocInfo = cotGoc
        const itemsArray = cotGocInfo?.itemsArray
        const insertionIndex = get_index_chen_cot_ref.current
        if (itemsArray && Array.isArray(itemsArray) && insertionIndex != null && insertionIndex >= 0) {
          // Tìm cột liền trước vị trí chèn để kế thừa thứ tự
          let prevIndex = insertionIndex - 1
          let prevCot = null
          for (let i = prevIndex; i >= 0; i--) {
            if (itemsArray[i] && itemsArray[i].type === 'cot') {
              prevCot = itemsArray[i]
              break
            }
          }
          // Nếu không có cột trước đó, fallback dùng cột gốc
          const baseCot = prevCot || cotGocInfo
          if (baseCot && baseCot.name) {
            let baseName = baseCot.name.trim()
            let baseNumStr = getCountString(baseName, '').split('').reverse().join('')
            let baseNum = isNumber(baseNumStr) ? parseInt(baseNumStr) : 0
            let pos = baseNumStr.length
            let prefix = baseName.slice(0, baseName.length - pos)
            name = prefix + (baseNum + 1)
          }
        }
      } catch (e) {
        // giữ name rỗng, sẽ được xử lý phía dưới nếu cần
      }
    }
    
    let count_display = getCountString(name, '')
      .split('')
      .reverse()
      .join('')
    let pos = count_display.length
    if (isNumber(count_display)) {
      count_display = parseInt(count_display) + 1
    }
    if (name == '') {
      // Trong chế độ chèn thủ công, cho phép auto đặt tên phía dưới, không bắt buộc nhập thủ công
      if (get_active_control_ref.current !== 'chen_cot_thu_cong') {
        Const_Libs.TOAST.error('Vui lòng nhập tên cột')
        dispatch(
          setStateThemCot({
            ...get_state_them_cot_ref.current,
            action: false
          })
        )
        return
      }
    }

    // Lấy thông tin cột gốc để áp dụng cho cột mới
    let cot_can_them = {
      ...get_state_them_cot_ref.current,
      uuid_cot: create_UUID(),
      name: name,
      coor: [
        get_state_them_cot_ref.current.coor[0],
        get_state_them_cot_ref.current.coor[1]
      ],
      active_cot: true,
      type: 'cot',
      uuid_folder: get_current_uuid_folder_ref.current,
      // Áp dụng thông tin từ cột gốc nếu có (cho chèn thủ công)
      ...(cotGoc && get_active_control_ref.current === 'chen_cot_thu_cong' ? {
        cot: cotGoc.cot,
        phu_kien: cotGoc.phu_kien,
        vat_tu: cotGoc.vat_tu,
        dia_diem: cotGoc.dia_diem,
        ly_trinh: cotGoc.ly_trinh,
        be_cap: cotGoc.be_cap,
        phu_kien_cap_ADSS: cotGoc.phu_kien_cap_ADSS,
        phu_kien_cap_AC: cotGoc.phu_kien_cap_AC,
        src_icon: cotGoc.src_icon || get_state_them_cot_ref.current.src_icon
      } : {
        src_icon:
          get_state_them_cot_ref.current.cot.ma_loai_cot == ''
            ? get_state_them_cot_ref.current.src_icon
            : IMAGES_COT_POTECO.filter(
                item =>
                  item.ma_cot == get_state_them_cot_ref.current.cot.ma_loai_cot
              )[0].src
      })
    }
    
    console.log('=== ADDING NEW POINT ===')
    console.log('Point data:', cot_can_them)
    console.log('Coordinates:', cot_can_them.coor)
    console.log('Target folder UUID:', get_current_uuid_folder_ref.current)

    if (get_current_uuid_folder_ref.current != '') {
      if (
        get_state_them_cot_ref.current.coor[0] != '' &&
        get_state_them_cot_ref.current.coor[1] != ''
      ) {
        // set lại state để tiếp tục thêm cột tiếp theo
        // Tính tên gợi ý cho lần kế tiếp
        let nextSuggestedName = ''
        if (get_active_control_ref.current == 'chen_cot_thu_cong') {
          // Dựa trên tên vừa chèn để đảm bảo đồng bộ với bản đồ
          const lastName = (cot_can_them.name || '').trim()
          const lastNumStr = getCountString(lastName, '').split('').reverse().join('')
          const posLast = lastNumStr.length
          const lastNum = isNumber(lastNumStr) ? parseInt(lastNumStr) : 0
          const prefix = lastName.slice(0, lastName.length - posLast)
          nextSuggestedName = prefix + (lastNum + 1)
        } else {
          // Logic cũ cho các chế độ khác
          nextSuggestedName =
            name == ''
              ? 'COT'
              : name.slice(0, name.length - pos) + '' + count_display
        }
        dispatch(
          setStateThemCot({
            ...BASE_COT,
            name: nextSuggestedName,
            coor: ['', ''],
            action: false,
            cot: cot_can_them.cot
          })
        )
        if (get_active_control_ref.current == 'chen_cot' || get_active_control_ref.current == 'chen_cot_thu_cong') {
          // chèn cột vào vị trí xác định (hỗ trợ nested folders)
          console.log('Chèn cột vào index:', get_index_chen_cot_ref.current)
          
          // Get target folder info if available
          const cotGocInfo = cot_goc_chen_cot || state_sua_cot_ref.current
          const targetFolder = cotGocInfo?.targetFolder || null
          const itemsArray = cotGocInfo?.itemsArray || null
          
          console.log('=== INSERTING COLUMN ===')
          console.log('Target folder:', targetFolder?.folder_name || 'root folder')
          console.log('Items array:', itemsArray)
          console.log('Insertion index:', get_index_chen_cot_ref.current)
          
          // Chèn cột vào vị trí đã tính toán
          if (itemsArray && Array.isArray(itemsArray) && get_index_chen_cot_ref.current >= 0) {
            // Tính toán tên giống như chèn theo số cột
            if (get_active_control_ref.current == 'chen_cot_thu_cong' && cotGocInfo) {
              // Nếu side panel đã gợi ý tên tiếp theo, dùng luôn để đồng bộ với người dùng
              if (name && name.length > 0) {
                cot_can_them.name = name
                console.log('Đặt tên theo side panel:', cot_can_them.name)
              } else {
                // Fallback: forward insertion only, lấy cột gốc làm base
                let baseCot = cotGocInfo
                let baseName = (baseCot?.name || '').trim()
                let baseNumStr = getCountString(baseName, '').split('').reverse().join('')
                let pos = baseNumStr.length
                let baseNum = isNumber(baseNumStr) ? parseInt(baseNumStr) : 0
                let prefix = baseName.slice(0, baseName.length - pos)
                
                // Forward: cột mới = baseNum + 1
                cot_can_them.name = prefix + (baseNum + 1)
                console.log('Đã đặt tên cột mới:', cot_can_them.name, '(dựa vào:', baseName, ', forward insertion)')
              }
              
              // Chiếu điểm lên polyline nếu có
              if (targetFolder) {
                const allPolylines = []
                if (targetFolder.list_group_duong_va_cot) {
                  targetFolder.list_group_duong_va_cot.forEach(item => {
                    if (item.type === 'duong' || item.type === 'track') {
                      allPolylines.push(item)
                    }
                  })
                }
                
                if (allPolylines.length > 0) {
                  const nearestPolyline = findNearestPolyline(
                    { longitude: cotGocInfo.coor[0], latitude: cotGocInfo.coor[1] },
                    { longitude: cot_can_them.coor[0], latitude: cot_can_them.coor[1] },
                    allPolylines
                  )
                  
                  if (nearestPolyline && nearestPolyline.list_do_duong) {
                    console.log('Tìm thấy polyline gần nhất:', nearestPolyline.name)
                    const projectedPoint = projectPointOntoPolyline(
                      { longitude: cot_can_them.coor[0], latitude: cot_can_them.coor[1] },
                      nearestPolyline.list_do_duong
                    )
                    cot_can_them.coor = [projectedPoint.longitude, projectedPoint.latitude]
                    console.log('Đã chiếu điểm lên polyline:', cot_can_them.coor)
                  }
                }
              }
            }
            else if (get_active_control_ref.current == 'chen_cot_thu_cong') {
              // Fallback đặt tên khi không có itemsArray (ví dụ: chưa kịp cache mảng)
              try {
                const insertionIndex = get_index_chen_cot_ref.current
                // Tìm folder theo uuid của cột gốc hoặc current folder
                let folderRef = null
                for (let f of list_root_folder) {
                  if (f.uuid_folder === (cotGocInfo?.uuid_folder || get_current_uuid_folder_ref.current)) {
                    folderRef = f
                    break
                  }
                }
                if (folderRef && folderRef.list_group_duong_va_cot) {
                  // Tìm cột liền trước index để lấy base name
                  let prevIndex = insertionIndex - 1
                  let prevCot = null
                  for (let i = prevIndex; i >= 0; i--) {
                    const it = folderRef.list_group_duong_va_cot[i]
                    if (it && it.type === 'cot') { prevCot = it; break }
                  }
                  const baseCot = prevCot || cotGocInfo
                  let baseName = (baseCot?.name || '').trim()
                  let baseNumStr = getCountString(baseName, '').split('').reverse().join('')
                  let pos = baseNumStr.length
                  let baseNum = isNumber(baseNumStr) ? parseInt(baseNumStr) : 0
                  let prefix = baseName.slice(0, baseName.length - pos)
                  cot_can_them.name = prefix + (baseNum + 1)
                  console.log('Fallback đặt tên cột mới:', cot_can_them.name, '(dựa vào:', baseName, ')')
                }
              } catch (e) {
                console.log('Fallback naming error:', e)
              }
            }
            
            // Chèn trực tiếp vào items array
            console.log('Inserting directly into items array at index:', get_index_chen_cot_ref.current)
            console.log('Array before insert:', itemsArray.length, 'items')
            
            try {
              // Insert vào vị trí index (trước cột đích gần nhất)
              const insertAt = get_index_chen_cot_ref.current
              itemsArray.splice(insertAt, 0, cot_can_them)
              // Không tự động tăng index. Lần click tiếp theo sẽ tính lại vị trí theo phía người dùng chọn.
              console.log('Array after insert:', itemsArray.length, 'items')
              
              // Apply tịnh tiến naming logic: forward only
              const newColInfoMatch = cot_can_them.name.match(/^(.+?)(\d+)$/)
              if (newColInfoMatch) {
                const prefix = newColInfoMatch[1]
                const newColNum = parseInt(newColInfoMatch[2])
                
                // Forward: start from after inserted column, increment all subsequent columns
                let currentNum = newColNum + 1
                for (let i = insertAt + 1; i < itemsArray.length; i++) {
                  const item = itemsArray[i]
                  if (item.type === 'cot') {
                    const numPrefixMatch = item.name.match(/^(.+?)(\d+)$/)
                    if (numPrefixMatch && numPrefixMatch[1] === prefix) {
                      // Stop if we hit a gap or different sequence
                      const itemNum = parseInt(numPrefixMatch[2])
                      if (itemNum - currentNum > 10) {
                        break
                      }
                      item.name = prefix + currentNum
                      currentNum++
                    }
                  }
                }
              }
              
              // Update the correct list based on isInNenList flag
              const isInNenList = cotGocInfo?.isInNenList || false
              
              if (isInNenList) {
                // Update list_root_nen
                console.log('Updating list_root_nen')
                let list_root_nen = getItemSessionStorage('root_nen') || []
                setItemSessionStorage('root_nen', list_root_nen)
                dispatch(changeRootNen([...list_root_nen]))
                reRenderNen([...list_root_nen])
              } else {
                // Update list_root_folder
                console.log('Updating list_root_folder')
                const updatedList = [...list_root_folder]
                dispatch(changeRootFolder(updatedList))
                reRenderMap(updatedList)
              }
              
              Const_Libs.TOAST.success('Chèn cột thành công')
            } catch (error) {
              console.error('Error inserting point:', error)
              Const_Libs.TOAST.error('Lỗi khi chèn cột: ' + error.message)
            }
          } else {
            console.log('Using fallback insertion method')
            // Fallback: Chèn vào root folder hoặc folder thường
            addNewCotToFolder(
              list_root_folder,
              get_current_uuid_folder_ref.current,
              cot_can_them,
              get_index_chen_cot_ref.current
            )
          }
          
          // Giữ lại chế độ chèn cột thủ công để có thể chèn tiếp
          // Không reset về 'them_cot' 
          // dispatch(setActiveControl('them_cot'))
          // Update cotGoc to newly inserted column (forward only)
          if (itemsArray && Array.isArray(itemsArray) && get_index_chen_cot_ref.current >= 0) {
            const insertedIndex = get_index_chen_cot_ref.current
            const insertedColumn = cot_can_them
            dispatch(setCotGocChenCot({ 
              ...insertedColumn, 
              targetFolder: cotGocInfo?.targetFolder,
              itemsArray: itemsArray,
              isInNenList: cotGocInfo?.isInNenList,
              indexCotGoc: insertedIndex
            }))
            console.log('Forward insertion: Updated cotGoc to newly inserted column at index:', insertedIndex)
          }
          console.log('Chèn cột thành công, giữ nguyên chế độ chèn để có thể chèn tiếp')
          return
        }
        // thêm cột vào cuối
        addNewCotToFolder(
          list_root_folder,
          get_current_uuid_folder_ref.current,
          cot_can_them
        )

        // Const_Libs.TOAST.success('Thêm cột thành công')
      } else {
        Const_Libs.TOAST.error('Vui lòng chọn vị trí trên bản đồ')
      }
    } else {
      Const_Libs.TOAST.error('Bạn phải chọn folder để thêm')
    }
  }
  const handleAddCoorToDuong = (
    list_root_folder_local,
    current_uuid_folder_local,
    paths_duong_local
  ) => {
    /**
     * Xử lý thêm 1 tọa độ vào đường sau khi click vào map
     *
     * @param no
     * @author XHieu
     */
    if (paths_duong_local.uuid_duong == '') {
      Const_Libs.TOAST.error('Vui lòng chọn chức năng trước khi click vào map')
    } else {
      list_root_folder_local.map(item_root => {
        if (item_root.uuid_folder == current_uuid_folder_local) {
          // Xóa tất cả các đường cũ trước khi cập nhật
          item_root.list_group_duong_va_cot = item_root.list_group_duong_va_cot.filter(item => 
            item.type !== 'duong'
          )
          
          // Thêm đường mới
          item_root.list_group_duong_va_cot.push({
            uuid_duong: paths_duong_local.uuid_duong,
            list_do_duong: [paths_duong_local.paths],
            active_do_duong: true,
            type: 'duong',
            uuid_folder: current_uuid_folder_local
          })
          
          return 0
        }
      })
      dispatch(changeRootFolder([...list_root_folder_local]))
      reRenderMap([...list_root_folder_local])
    }
  }
  // Helper function to find folder recursively in nested structure
  const findFolderByUuid = (folders, uuid_folder_local) => {
    console.log('Finding folder with UUID:', uuid_folder_local)
    console.log('Searching in folders:', folders.length)
    
    for (let folder of folders) {
      // Check if current folder matches
      if (folder.uuid_folder === uuid_folder_local) {
        console.log('Found matching folder:', folder.folder_name)
        return folder
      }
      // Check nested folders
      if (folder.list_group_duong_va_cot && Array.isArray(folder.list_group_duong_va_cot)) {
        for (let item of folder.list_group_duong_va_cot) {
          // Check if item has folder_name property (it's a folder)
          if (item.folder_name && item.list_group_duong_va_cot && Array.isArray(item.list_group_duong_va_cot)) {
            const found = findFolderByUuid([item], uuid_folder_local)
            if (found) return found
          }
        }
      }
    }
    console.log('Folder not found!')
    return null
  }

  // Helper function to insert point at specific index in nested structure
  const insertPointInFolderItems = (items, targetIndex, cotToInsert) => {
    let itemsArray = Array.isArray(items) ? items : []
    
    if (targetIndex >= 0 && targetIndex < itemsArray.length) {
      itemsArray.splice(targetIndex + 1, 0, cotToInsert)
    } else {
      // If index is beyond array length, just append
      itemsArray.push(cotToInsert)
    }
    
    return itemsArray
  }
  
  const addNewCotToFolder = (
    list_root_folder_local,
    uuid_folder_them_cot_local,
    cot,
    index = null,
    targetNestedFolder = null
  ) => {
    /**
     * Thêm mới một cột vào Folder đã chọn
     * Hỗ trợ cả nested folders
     *
     * @param list_root_folder_local: dữ liệu đọc được từ kml
     * @param uuid_folder_them_cot: uuid của folder định thêm cột
     * @param cot: dữ liệu của cột
     * @param index: vị trí chèn (cho chèn thủ công)
     * @param targetNestedFolder: folder chứa cột gốc (cho chèn thủ công vào nested folder)
     * @author XHieu
     */
    console.log('Adding point to folder:', uuid_folder_them_cot_local)
    
    // If we have a target nested folder (from manual insert), use it directly
    if (targetNestedFolder && index != null) {
      console.log('Inserting into nested folder:', targetNestedFolder.folder_name, 'at index:', index)
      
      // Find this folder in the structure and insert the point
      const insertIntoNestedFolder = (items) => {
        for (let item of items) {
          if (item.uuid_folder === targetNestedFolder.uuid_folder) {
            console.log('Found target nested folder to insert')
            item.list_group_duong_va_cot = insertPointInFolderItems(item.list_group_duong_va_cot, index, cot)
            console.log('Inserted point into nested folder. Now has', item.list_group_duong_va_cot.length, 'items')
            return true
          }
          // Recursively search nested folders
          if (item.type === 'folder' || (item.folder_name && item.list_group_duong_va_cot && Array.isArray(item.list_group_duong_va_cot))) {
            if (insertIntoNestedFolder(item.list_group_duong_va_cot)) {
              return true
            }
          }
        }
        return false
      }
      
      // Try to insert in main folders
      if (insertIntoNestedFolder(list_root_folder_local)) {
        dispatch(changeRootFolder([...list_root_folder_local]))
        reRenderMap([...list_root_folder_local])
        Const_Libs.TOAST.success('Chèn cột thành công')
        return
      }
      
      // Try in list_root_nen
      let list_root_nen = getItemSessionStorage('root_nen') || []
      if (insertIntoNestedFolder(list_root_nen)) {
        setItemSessionStorage('root_nen', list_root_nen)
        dispatch(changeRootNen([...list_root_nen]))
        reRenderNen([...list_root_nen])
        Const_Libs.TOAST.success('Chèn cột thành công')
        return
      }
      
      console.error('Could not find target nested folder to insert')
      Const_Libs.TOAST.error('Không tìm thấy folder để chèn điểm')
      return
    }
    
    // Normal add logic (for regular add, not manual insert)
    let targetFolder = findFolderByUuid(list_root_folder_local, uuid_folder_them_cot_local)
    let isInNenList = false
    
    let list_root_nen = getItemSessionStorage('root_nen') || []
    
    // If not found, check in list_root_nen
    if (!targetFolder) {
      targetFolder = findFolderByUuid(list_root_nen, uuid_folder_them_cot_local)
      isInNenList = !!targetFolder
      console.log('Also checked in list_root_nen, found:', isInNenList)
    }
    
    if (!targetFolder) {
      console.error('Folder not found with UUID:', uuid_folder_them_cot_local)
      console.log('Available folders in list_root_folder:', list_root_folder_local.length)
      Const_Libs.TOAST.error('Không tìm thấy folder để thêm điểm. Vui lòng chọn "Chỉnh sửa & Xuất KML" trước.')
      return
    }
    
    console.log('Found folder:', targetFolder.folder_name)
    
    // Ensure list_group_duong_va_cot exists
    if (!targetFolder.list_group_duong_va_cot) {
      targetFolder.list_group_duong_va_cot = []
    }
    
    if (index != null) {
      // TH này là chèn cột vào 1 vị trí
      targetFolder.list_group_duong_va_cot.splice(index + 1, 0, cot)
    } else {
      // TH này là thêm cột vào cuối
      targetFolder.list_group_duong_va_cot.push(cot)
    }
    
    console.log('Point added successfully to folder:', targetFolder.folder_name)
    
    // Update the correct list based on where folder was found
    if (isInNenList) {
      // Update list_root_nen - save the modified list back to sessionStorage
      console.log('Saving to list_root_nen. Folder now has', targetFolder.list_group_duong_va_cot.length, 'items')
      setItemSessionStorage('root_nen', list_root_nen)
      dispatch(changeRootNen([...list_root_nen]))
      console.log('Re-rendering NEN with', list_root_nen.length, 'folders')
      reRenderNen([...list_root_nen])
    } else {
      // Update list_root_folder
      console.log('Saving to list_root_folder. Folder now has', targetFolder.list_group_duong_va_cot.length, 'items')
      dispatch(changeRootFolder([...list_root_folder_local]))
      console.log('Re-rendering MAP with', list_root_folder_local.length, 'folders')
      reRenderMap([...list_root_folder_local])
    }
  }

  const handleXoaCot = (list_root_folder_local, uuid_folder_local = null) => {
    /**
         * Xóa thông tin của 1 cột
         *

         * @param cot: thông tin của cột
         * @param list_root_folder_local: dữ liệu đọc từ file kml
         * @author XHieu
         */
    if (!uuid_folder_local) {
      Const_Libs.TOAST.error('Vui lòng chọn folder trước.')
      return
    }
    let result = window.confirm(
      'Bạn có chắc muốn xóa cột này \nBạn sẽ không thể khôi phục lại sau khi xóa'
    )
    if (result == true) {
      console.log('xóa')
      for (let i in list_root_folder_local) {
        if (
          list_root_folder_local[i].uuid_folder ===
          get_state_sua_cot_ref.current.uuid_folder
        ) {
          let cot_bi_xoa = list_root_folder_local[
            i
          ].list_group_duong_va_cot.filter(
            item => item.uuid_cot === get_state_sua_cot_ref.current.uuid_cot
          )[0]

          list_root_folder_local[
            i
          ].list_group_duong_va_cot = list_root_folder_local[
            i
          ].list_group_duong_va_cot.filter(
            item => item.uuid_cot != get_state_sua_cot_ref.current.uuid_cot
          )

          set_active_control_ref('them_cot')
          // SET lại state thêm cột ở đây, vị trí lấy từ cột cuối
          let last_cot = [...list_root_folder_local[i].list_group_duong_va_cot]
            .filter(item => item.type == 'cot')
            .pop()
          last_cot = {
            ...last_cot,
            name:
              getTenCotNoSTT(last_cot.name.trim()) +
              '' +
              getSTTCot(last_cot.name.trim())
          }
          dispatch(setStateThemCot({ ...BASE_COT, ...last_cot, action: false }))
          // END SET lại state thêm cột ở đây, vị trí lấy từ cột cuối

          dispatch(setStateSuaCot(BASE_COT))
          dispatch(changeRootFolder([...list_root_folder_local]))
          disabledAllForm()
          // Cập nhật lại số thứ tự của cột
          list_root_folder_local = updateSTTCot(
            get_list_root_folder_ref.current,
            uuid_folder_local,
            getTenCotNoSTT(cot_bi_xoa.name.trim())
          )
          dispatch(changeRootFolder([...list_root_folder_local]))

          // END Cập nhật lại số thứ tự của cột
          break
        }
      }
      $('.active-control[data-attr="xoa_cot"]').removeClass('active-gray')
    }
  }
  // const handleXoaNhieuCot = (
  //   list_root_folder_local,
  //   uuid_folder_local = null
  // ) => {
  //   /**
  //        * Xóa thông tin của 1 cột
  //        *

  //        * @param cot: thông tin của cột
  //        * @param list_root_folder_local: dữ liệu đọc từ file kml
  //        * @author XHieu
  //        */

  //   let result = window.confirm(
  //     'Bạn có chắc muốn xóa cột này \nBạn sẽ không thể khôi phục lại sau khi xóa'
  //   )

  //   if (result == true) {
  //     console.log('xóa')
  //     for (let i in list_root_folder_local) {
  //       if (list_root_folder_local[i].uuid_folder === uuid_folder_local) {
  //         for (let x = 0; x < get_state_sua_nhieu_cot_ref.current.length; x++) {
  //           list_root_folder_local[
  //             i
  //           ].list_group_duong_va_cot = list_root_folder_local[
  //             i
  //           ].list_group_duong_va_cot.filter(
  //             item =>
  //               item.uuid_cot != get_state_sua_nhieu_cot_ref.current[x].uuid_cot
  //           )
  //         }
  //         set_active_control_ref('them_cot')
  //         let last_cot = [...list_root_folder_local[i].list_group_duong_va_cot]
  //           .filter(item => item.type == 'cot')
  //           .pop()

  //         last_cot = {
  //           ...last_cot,
  //           name:
  //             getTenCotNoSTT(last_cot.name.trim()) +
  //             '' +
  //             getSTTCot(last_cot.name.trim())
  //         }
  //         dispatch(setStateThemCot({ ...BASE_COT, ...last_cot, action: false }))
  //         dispatch(setStateSuaCot(BASE_COT))
  //         dispatch(changeRootFolder([...list_root_folder_local]))
  //         disabledAllForm()
  //         return
  //       }
  //     }
  //     $('.active-control[data-attr="xoa_cot"]').removeClass('active-gray')
  //   }
  // }
  const handleXoaNhieuCot = async (
    list_root_folder_local,
    uuid_folder_local = null
  ) => {
    /**
     * Xóa thông tin của 1 cột
     * @param cot: thông tin của cột
     * @param list_root_folder_local: dữ liệu đọc từ file kml
     * @author XHieu
     */
    if (get_state_sua_nhieu_cot_ref.current.length == 0) {
      Const_Libs.TOAST.error('Bạn phải chọn cột trước khi ấn nút xóa.')
      return
    }
    
    list_root_folder_local = await handleXoaNhieuCot_Common(
      list_root_folder_local,
      uuid_folder_local,
      get_state_sua_nhieu_cot_ref.current
    )
    dispatch(setStateSuaNhieuCot([]))
    dispatch(setStateThemCot({ ...BASE_COT, action: false }))
    dispatch(setStateSuaCot(BASE_COT))
    dispatch(changeRootFolder([...list_root_folder_local]))
    disabledAllForm()
  }

  //END FUNC HANDLE
  // FUNC RENDER HTML
  const menuControl = () => {
    return (
      <div
        id='menuControl'
        className='hs-unfold-content position-absolute d-none dropdown-unfold bg-white position-absolute dropdown-menu dropdown-menu-right navbar-dropdown-menu navbar-dropdown-account hs-unfold-content-initialized hs-unfold-css-animation animated'
        style={{
          width: '16rem',
          top: '0',
          zIndex: '1000',
          animationDuration: '300ms'
        }}
      >
        <a
          className='dropdown-item'
          onClick={() => handleMenuControl('them_cot')}
        >
          <span className='text-truncate pr-2' title='Profile & account'>
            Thêm cột
          </span>
        </a>
        <a
          className='dropdown-item'
          onClick={() => handleMenuControl('sua_cot')}
        >
          <span className='text-truncate pr-2' title='Settings'>
            Sửa cột
          </span>
        </a>
        <a className='dropdown-item'>
          <span className='text-truncate pr-2' title='Manage team'>
            Xóa cột
          </span>
        </a>
        <div className='dropdown-divider' />
        <a className='dropdown-item'>
          <span className='text-truncate pr-2' title='Sign out'>
            Thêm Đường
          </span>
        </a>
      </div>
    )
  }
  // END FUNC RENDER HTML

  //EVENT ON MAP
  const handleEventOnMap = () => {
    /**
     * Xử lý các sự kiện xảy ra trên map như là click, mouse move, ...
     *
     * @param No
     * @author XHieu
     */

    handleEventClickOnMap()
    handleEventMouseMoveOnMap()
    handleDragOnMap()
  }
  const handleEventMouseMoveOnMap = () => {
    /**
     * Gọi Hàm Xử lý các sự kiện di chuột xảy ra trên map
     * Có sử dụng func debounce() để hạn chế việc gọi mouse move không cần thiết
     * @param No
     * @author XHieu
     */
    console.log('kdkdkdk')
    VIEW.on('mouse-wheel', function (event) {
      // let lat = event.deltaY
      // let lon = event.deltaX
      // console.log(event);
      // console.log(VIEW.center);
      // console.log('current map center is x: ' + lat + ', y: ' + lon)
    })
    // VIEW.on('pointer-move', function (event) {
    //   VIEW.hitTest(event).then(function (response) {
    //     try {
    //       if (get_active_control_ref.current.toLowerCase() == 'default') {
    //         let list_graphic_layer = GRAPHIC_LAYER.graphics.items.filter(
    //           item => item.typee != 'text'
    //         )
    //         for (let k in list_graphic_layer) {
    //           let item = list_graphic_layer[k]
    //           if (
    //             response.results[0].graphic.typee == 'polyline' &&
    //             response.results[0].graphic.uuid_duong == item.uuid_duong
    //           ) {
    //             response.results[0].graphic.symbol.width = 10
    //           } else if (
    //             response.results[0].graphic.typee == 'point' &&
    //             response.results[0].graphic.uuid_cot == item.uuid_cot
    //           ) {
    //             response.results[0].graphic.symbol.width = '50px'
    //             response.results[0].graphic.symbol.height = '50px'
    //           } else {
    //             // nếu chỉ ra bên ngoài thì đổi lại ảnh như cũ
    //             if (item.geometry.type == 'point') {
    //               item.symbol.width = '30px'
    //               item.symbol.height = '30px'
    //             } else if (item.geometry.type == 'polyline') {
    //               item.symbol.width = 4
    //             }
    //             // console.log('Chỉ ra bên ngoài')
    //           }
    //         }
    //       }
    //     } catch (err) {
    //       console.log(err)
    //       console.log('Chỉ ra bên ngoài')
    //     }
    //   })
    // })
  }
  const handleEventClickOnMap = () => {
    /**
     * Xử lý các sự kiện click xảy ra trên map
     *
     * @param No
     * @author XHieu
     */
    mapClick = VIEW.on('click', function (event) {
      VIEW.hitTest(event).then(function (response) {
        // Get the coordinates of the click on the view
        let lat = event.mapPoint.latitude
        let lon = event.mapPoint.longitude
        let screen_point = {
          long: lon,
          lat: lat
        }
        dispatch(setScreenPoint({ ...screen_point }))
        let check = false // biến này check xem có click vào các đường hoặc cột không để thực hiện xử lý ở bên dưới
        //check xem click đúng vào đường hay cột đã vẽ hay chưa
        if (response.results[0] != null) {
          let graphic = response.results[0].graphic
          let list_graphic_layer = GRAPHIC_LAYER.graphics.items.filter(
            item => item.typee != 'text'
          )
          for (let k in list_graphic_layer) {
            let item = list_graphic_layer[k]
            if (
              item.geometry.type == 'point' &&
              get_active_control_ref.current != 'sua_nhieu_cot'
            ) {
              item.symbol = item.pre_symbol
            }
          }
          for (let k in list_graphic_layer) {
            let item = list_graphic_layer[k]
            if (
              response.results[0].graphic.typee == 'polyline' &&
              response.results[0].graphic.uuid_duong == item.uuid_duong
            ) {
              // console.log('click duong')
              response.results[0].graphic.symbol.width = 10
            } else if (
              response.results[0].graphic.typee == 'point' &&
              response.results[0].graphic.uuid_cot == item.uuid_cot
            ) {
              // console.log('click cột')
              response.results[0].graphic.symbol.width = '50px'
              response.results[0].graphic.symbol.height = '50px'
              if (get_active_control_ref.current != 'them_duong') {
                check = true // kiểm tra xem check vào trong cột hay check bên ngoài

                // Xử lý chọn cột đích cho modal chèn cột
                if (get_active_control_ref.current == 'select_cot_dich') {
                  console.log('Chọn cột đích từ map:', item.name, item.uuid_cot)
                  let cot = {
                    ...findCotByUUidCot(
                      item.uuid_folder,
                      get_list_root_folder_ref.current,
                      item.uuid_cot
                    ),
                    uuid_cot: item.uuid_cot,
                    name: item.name,
                    coor: [item.geometry.longitude, item.geometry.latitude],
                    active_cot: true,
                    type: 'cot',
                    uuid_folder: item.uuid_folder
                  }
                  dispatch(setStateSuaCot(cot))
                  console.log('Đã dispatch setStateSuaCot với cột:', cot.name)
                  return
                }

                if (get_active_control_ref.current == 'sua_nhieu_cot') {
                  let arr_cot_can_sua = get_state_sua_nhieu_cot_ref.current
                  if (graphic.symbol.url == SIMPLE_MARKER_SYMBOL4.url) {
                    graphic.symbol = item.pre_symbol
                    // TH này là TH click vào chính cột đó lần thứ 2, thì sẽ bỏ click đi trở về trạng thái chưa click
                    arr_cot_can_sua = arr_cot_can_sua.filter(
                      uuid_item_cot => uuid_item_cot.uuid_cot != item.uuid_cot
                    )
                  } else {
                    // chưa click thì thêm mới vào danh sách
                    arr_cot_can_sua.push({
                      ...findCotByUUidCot(
                        item.uuid_folder,
                        get_list_root_folder_ref.current,
                        item.uuid_cot
                      )
                    })
                    graphic.symbol = SIMPLE_MARKER_SYMBOL4 // đổi marker, k đc chuyển cái này đi chỗ khác
                  }
                  dispatch(setStateSuaNhieuCot([...arr_cot_can_sua]))
                  set_state_sua_nhieu_cot_ref([...arr_cot_can_sua])
                  enableFormSuaNhieuCot()
                  return
                }
                graphic.symbol = SIMPLE_MARKER_SYMBOL4 // đổi marker
                dispatch(setActiveControl('sua_1_cot'))
                $('.active-control').removeClass('active-gray')
                dispatch(
                  setIndexChenCot(
                    getIndexCot(
                      item.uuid_folder,
                      get_list_root_folder_ref.current,
                      item.uuid_cot
                    )
                  )
                )
                let cot = {
                  ...findCotByUUidCot(
                    item.uuid_folder,
                    get_list_root_folder_ref.current,
                    item.uuid_cot
                  ),
                  uuid_cot: item.uuid_cot,
                  name: item.name,
                  coor: [item.geometry.longitude, item.geometry.latitude],
                  active_cot: true,
                  type: 'cot',
                  uuid_folder: item.uuid_folder
                }

                dispatch(setStateSuaCot(cot))
                enableFormsuaCot()
                disabledFormThemCot()
              }
            } else {
              // nếu chỉ ra bên ngoài thì đổi lại ảnh như cũ
              if (item.geometry.type == 'point') {
                item.symbol.width = item.pre_symbol.width
                item.symbol.height = item.pre_symbol.height
              } else if (item.geometry.type == 'polyline') {
                item.symbol.width = 4
              }
              // console.log('Chỉ ra bên ngoài')
            }
          }
          if (!check) {
            console.log(get_active_control_ref.current)
            if (get_active_control_ref.current == 'them_cot') {
              disabledAllForm()
              enableFormThemCot()
              // enableFormThemCot()
              // action = true mới tiến hành thêm
              dispatch(
                setStateThemCot({
                  ...get_state_them_cot_ref.current,
                  coor: [lon, lat],
                  action: true
                })
              )
            } else if (get_active_control_ref.current == 'chen_cot') {
              dispatch(
                setStateThemCot({
                  ...get_state_them_cot_ref.current,
                  coor: [lon, lat],
                  action: true
                })
              )
            } else if (get_active_control_ref.current == 'chen_cot_thu_cong') {
              // Chèn cột thủ công - giống thêm cột nhưng chèn vào giữa
              console.log('=== DEBUG: Chèn cột thủ công ===')
              console.log('cot_goc_chen_cot:', cot_goc_chen_cot)
              console.log('cot_goc_chen_cot_ref.current:', get_cot_goc_chen_cot_ref.current)
              
              const cotGoc = get_cot_goc_chen_cot_ref.current || cot_goc_chen_cot
              
              if (!cotGoc || !cotGoc.uuid_folder) {
                console.error('Chưa chọn cột gốc để chèn', { cotGoc, cot_goc_chen_cot })
                Const_Libs.TOAST.error('Vui lòng chọn cột để chèn từ danh sách')
                return
              }
              
              console.log('Cột gốc:', cotGoc)
              console.log('Click tại:', lon, lat)
              
              // Luôn tính lại vị trí chèn theo click hiện tại để cho phép đổi phía giữa các lần chèn
              const insertionInfo = findIndexForManualInsert(cotGoc, lon, lat)

              if (insertionInfo.index === -1) {
                console.error('Không tìm thấy vị trí chèn')
                Const_Libs.TOAST.error('Không tìm thấy vị trí chèn hợp lệ')
                return
              }

              console.log('Insertion info:', insertionInfo)

              // Store insertion info including folder and items array reference
              set_index_chen_cot_ref(insertionInfo.index)
              dispatch(setCotGocChenCot({ 
                ...cotGoc, 
                targetFolder: insertionInfo.foundInFolder,
                itemsArray: insertionInfo.items,
                isInNenList: insertionInfo.isInNenList,  // Save flag to know which list to update
                indexCotGoc: insertionInfo.indexCotGoc   // Save index of source column
              }))
              console.log('Đã set index:', insertionInfo.index, 'in folder:', insertionInfo.foundInFolder?.folder_name)
              
              disabledAllForm()
              enableFormThemCot()
              
              dispatch(
                setStateThemCot({
                  ...get_state_them_cot_ref.current,
                  coor: [lon, lat],
                  action: true
                })
              )
              
              // Const_Libs.TOAST.success('Vui lòng nhập thông tin cột và nhấn Lưu')
            } else if (get_active_control_ref.current == 'them_duong') {
              let list = get_paths_duong_ref.current.paths
              list.push([lon, lat])
              set_paths_duong_ref({
                ...get_paths_duong_ref.current,
                paths: list,
                saved: false,
                changed: true
              })
              handleAddCoorToDuong(
                get_list_root_folder_ref.current,
                get_current_uuid_folder_ref.current,
                get_paths_duong_ref.current
              )
            } else if (get_active_control_ref.current == 'sua_nhieu_cotl') {
            }
          }
        }
      })
    })
  }
  const handleDragOnMap = () => {
    /**
     * Xử lý sự kiện drag trên bản đồ
     *
     * @param No
     * @author XHieu
     */

    let draggingGraphic
    let tempGraphic
    let uuid_cot
    let uuid_folder

    mapDrag = VIEW.on('drag', evt => {
      // if this is the starting of the drag, do a hitTest
      if (
        get_active_control_ref.current !== CONTROLL.THEM_COT &&
        get_active_control_ref.current !== CONTROLL.SUA_COT
      ) {
        // nếu mà nó không phải trạng thái thêm và sửa cột sẽ không thể di chuyển cột
        return
      }
      if (evt.action === 'start') {
        console.log('startt')
        VIEW.hitTest(evt).then(resp => {
          try {
            if (
              resp.results[0].graphic &&
              resp.results[0].graphic.geometry.type == 'point'
            ) {
              evt.stopPropagation()
              uuid_cot = resp.results[0].graphic.uuid_cot
              uuid_folder = resp.results[0].graphic.uuid_folder
              // if the hitTest returns a point graphic, set dragginGraphic
              draggingGraphic = resp.results[0].graphic
            }
          } catch (err) {}
        })
      } else if (evt.action === 'update') {
        // on drag update events, only continue if a draggingGraphic is set
        if (draggingGraphic) {
          evt.stopPropagation()

          // if there is a tempGraphic, remove it
          if (tempGraphic) {
            VIEW.graphics.remove(tempGraphic)
          } else {
            // if there is no tempGraphic, this is the first update event, so remove original graphic
            VIEW.graphics.remove(draggingGraphic)
          }
          // create new temp graphic and add it
          tempGraphic = draggingGraphic.clone()
          tempGraphic.geometry = VIEW.toMap(evt)
          VIEW.graphics.add(tempGraphic)
        }
      } else if (evt.action === 'end') {
        // console.log('end')
        // on drag end, continue only if there is a draggingGraphic

        if (draggingGraphic) {
          evt.stopPropagation()

          let screen_point = {
            long: tempGraphic.geometry.longitude,
            lat: tempGraphic.geometry.latitude
          }
          dispatch(setScreenPoint({ ...screen_point }))
          // rm temp
          if (tempGraphic) VIEW.graphics.remove(tempGraphic)
          // create new graphic based on original dragging graphic
          let newGraphic = draggingGraphic.clone()
          newGraphic.geometry = tempGraphic.geometry.clone()
          // add replacement graphic
          // VIEW.graphics.add(newGraphic)
          let { longitude, latitude } = newGraphic.geometry
          
          // Helper function to search for point recursively in nested folders
          const updatePointCoordinates = (items, target_uuid_folder, target_uuid_cot, newCoords) => {
            for (let item of items) {
              // Check if this is the target point
              if (item.type === 'cot' && item.uuid_cot === target_uuid_cot) {
                item.coor = newCoords
                return true
              }
              // Check if this is a nested folder
              if (item.type === 'folder' || (item.folder_name && item.list_group_duong_va_cot && Array.isArray(item.list_group_duong_va_cot))) {
                // Recurse into nested folder
                if (updatePointCoordinates(item.list_group_duong_va_cot, target_uuid_folder, target_uuid_cot, newCoords)) {
                  return true
                }
              }
            }
            return false
          }
          
          // Search through all folders and nested folders
          for (let item_root of get_list_root_folder_ref.current) {
            if (item_root && item_root.list_group_duong_va_cot) {
              updatePointCoordinates(item_root.list_group_duong_va_cot, uuid_folder, uuid_cot, [longitude, latitude])
            }
          }
          
          dispatch(changeRootFolder([...get_list_root_folder_ref.current]))
          // reset vars
          VIEW.graphics.remove(draggingGraphic)
          VIEW.graphics.remove(tempGraphic)
          draggingGraphic = null
          tempGraphic = null
          uuid_cot = null
          uuid_folder = null
        }
      }
    })
  }

  //END EVENT ON MAP
  useEffect(() => {
    console.log(type_map)
    // xóa hêt sự kiện trên map cũ
    if (mapClick != null) {
      mapClick.remove()
    }
    if (mapDrag != null) {
      mapDrag.remove()
    }
    reRenderViewMap(get_list_root_folder_ref.current, type_map)
    setCenterMap([screen_point.long, screen_point.lat], 15)
    // gọi gán lại sự kiện mới
    setTimeout(() => {
      handleEventOnMap()
    }, 1000)
  }, [type_map])
  useEffect(() => {
    set_index_chen_cot_ref(index_chen_cot)
  }, [index_chen_cot])
  useEffect(() => {
    set_paths_duong_ref(paths_duong)
  }, [paths_duong])
  useEffect(() => {
    console.log(active_control)
    set_active_control_ref(active_control)
    if (get_active_control_ref.current != 'sua_nhieu_cot') {
      if (get_state_sua_nhieu_cot_ref.current.length > 0) {
        // sang chế độ khác thì set lại marker về ban đầu
        get_list_root_folder_ref.current.map(item_root => {
          item_root.list_group_duong_va_cot.map(item_duong_cot => {
            if (item_duong_cot.type == 'cot') {
              item_duong_cot.src_icon =
                item_duong_cot.cot.ma_loai_cot == ''
                  ? Images.IMG_PUSHPIN
                  : IMAGES_COT_POTECO.filter(
                      item => item.ma_cot == item_duong_cot.cot.ma_loai_cot
                    )[0].src
            }
          })
        })
        dispatch(changeRootFolder([...get_list_root_folder_ref.current]))
      }

      dispatch(setControlXoaNhieuCot(false))
      dispatch(setStateSuaNhieuCot([]))
    }

    if (get_active_control_ref.current == 'them_cot') {
    } else if (get_active_control_ref.current == 'sua_1_cot') {
      // console.log('sửa 1 cột')
      $('.active-control').removeClass('active-gray')
      $('.active-control[data-attr="sua_1_cot"]').addClass('active-gray')
      $('.header-control').removeClass('active-gray')
    } else if (get_active_control_ref.current == 'them_duong') {
      $('.active-control').removeClass('active-gray')
      $('.active-control[data-attr="them_duong"]').addClass('active-gray')
      $('.header-control').removeClass('active-gray')
      $('.header-control[data-attr="them_duong"]').addClass('active-gray')
    } else if (get_active_control_ref.current == 'sua_nhieu_cot') {
      $('.header-control').removeClass('active-gray')
      $('.header-control[data-attr="sua_nhieu_cot"]').addClass('active-gray')
      dispatch(setStateSuaNhieuCot([]))
    } else {
      $('.active-control').removeClass('active-gray')
      $('.header-control').removeClass('active-gray')
    }
    MAP.removeAll()
    reRenderMap([...get_list_root_folder_ref.current])
    reRenderNen([...list_root_nen])
  }, [active_control])
  useEffect(() => {
    if (
      (!get_paths_duong_ref.current.saved &&
        get_paths_duong_ref.current.changed) ||
      !get_check_save_duong_ref.current
    ) {
      // saved = false và change = true hoặc checksave = false
      let rs = alertConfirm(
        'Bạn chưa lưu đường sau khi thêm.\nBạn có chắc chắn muốn lưu đường và tiếp tục không.'
      )
      // set trạng thái đã lưu
      set_check_save_duong_ref(true)
      if (!rs) {
        handleRemoveLastDuong(
          get_list_root_folder_ref.current,
          get_current_uuid_folder_ref.current
        )
      }
    }
    set_current_uuid_folder_ref(current_uuid_folder)
    $('.folder-root[id="' + current_uuid_folder + '"]').addClass('text-red')
    $('.menu-head > .hs-unfold > a').removeClass('active-gray')
    set_paths_duong_ref({
      uuid_duong: '',
      paths: [],
      saved: false,
      changed: false
    })
  }, [current_uuid_folder])

  useEffect(() => {
    set_state_sua_cot_ref(state_sua_cot)
    console.log('state_sua_cot_ref updated:', state_sua_cot)
  }, [state_sua_cot])
  
  useEffect(() => {
    set_cot_goc_chen_cot_ref(cot_goc_chen_cot)
    console.log('cot_goc_chen_cot_ref updated:', cot_goc_chen_cot)
    // Khi chọn lại cột gốc để chèn thủ công, reset tên gợi ý ở side panel cho đúng ngữ cảnh
    try {
      if (cot_goc_chen_cot && cot_goc_chen_cot.name && get_active_control_ref.current === 'chen_cot_thu_cong') {
        const baseName = cot_goc_chen_cot.name.trim()
        const numStr = getCountString(baseName, '').split('').reverse().join('')
        const pos = numStr.length
        const baseNum = isNumber(numStr) ? parseInt(numStr) : 0
        const prefix = baseName.slice(0, baseName.length - pos)
        const suggested = prefix + (baseNum + 1)
        dispatch(setStateThemCot({ ...BASE_COT, name: suggested, action: false }))
      }
    } catch (e) {}
  }, [cot_goc_chen_cot])

  useEffect(() => {
    set_state_sua_nhieu_cot_ref([...state_sua_nhieu_cot])
    if (state_sua_nhieu_cot.length > 0) {
      dispatch(
        changeRootFolder([
          ...updateImgPoint(
            [...state_sua_nhieu_cot],
            [...get_list_root_folder_ref.current]
          )
        ])
      )
    }
  }, [state_sua_nhieu_cot])

  useEffect(() => {
    set_state_them_cot_ref(state_them_cot)
    if (
      get_active_control_ref.current == 'them_cot' ||
      get_active_control_ref.current == 'chen_cot' ||
      get_active_control_ref.current == 'chen_cot_thu_cong'
    ) {
      $('.header-control').removeClass('active-gray')
      $('.header-control[data-attr="them_cot"]').addClass('active-gray')
      if (get_state_them_cot_ref.current.action != null) {
        if (get_state_them_cot_ref.current.action) {
          // console.log('thêm')
          console.log('=== CALLING handleThemCot ===')
          console.log('Active control:', get_active_control_ref.current)
          console.log('State them cot:', get_state_them_cot_ref.current)
          handleThemCot(get_state_them_cot_ref.current)
        }
      }
    }
  }, [state_them_cot])

  useEffect(() => {
    /**
     * Khi đường nào được active sẽ chạy vào đây để hiển thị lại trên map
     *
     * @param No
     * @author XHieu
     */
    MAP.removeAll()
    reRenderNen(list_root_nen)
    reRenderMap(list_root_folder)
    set_list_root_folder_ref(list_root_folder)
  }, [list_root_folder, list_root_nen])

  useEffect(() => {
    /**
     * Hàm khởi tạo component
     *
     * @param No
     * @author XHieu
     */
    let root =
      getItemSessionStorage('root_folder') == null
        ? []
        : getItemSessionStorage('root_folder')
    let root_nen =
      getItemSessionStorage('root_nen') == null
        ? []
        : getItemSessionStorage('root_nen')
    mainEffect()
    reRenderViewMap(root)
    reRenderNen(root_nen)
    dispatch(changeRootFolder([...root]))
    dispatch(changeRootNen([...root_nen]))
    set_list_root_folder_ref(root)

    // setTimeout(() => {
    //   handleEventOnMap()
    // }, 1000)
  }, [])

  return (
    <div className='view-map'>
      {/* MODAL THÊM DỰ ÁN MỚI */}
      {<ModalThemFolder />}
      {<ModalNhapSoLuongChenCot />}
      {<ModalDanhSTTCot />}
      {/* END MODAL THÊM DỰ ÁN MỚI */}
      {/* FORM Thêm Thông tin cột */}
      <FormThemCot />
      <FormSuaCot
        key='suaCot'
        onChangeActiveControl={set_active_control_ref}
        handleXoaCot={handleXoaCot}
      />
      <FormSuaNhieuCot
        key='suaNhieuCot'
        onChangeActiveControl={set_active_control_ref}
        handleXoaNhieuCot={handleXoaNhieuCot}
      />

      <FormThemDuong
        handleClickSaveDuong={() => {
          set_paths_duong_ref({
            ...get_paths_duong_ref.current,
            saved: false,
            changed: false
          })
          set_check_save_duong_ref(true)
          Const_Libs.TOAST.success('Thêm đường thành công')
          dispatch(setActiveControl('default'))
        }}
        paths_duong_ref={get_paths_duong_ref.current}
        uuid_folder={get_current_uuid_folder_ref.current}
        set_paths_duong_ref={data => {
          set_paths_duong_ref(data)
        }}
        handleAddCoorToDuong={() =>
          handleAddCoorToDuong(
            get_list_root_folder_ref.current,
            get_current_uuid_folder_ref.current,
            get_paths_duong_ref.current
          )
        }
      />
      <FormSuaDuong
        handleClickSaveDuong={() => {
          set_paths_duong_ref({
            ...get_paths_duong_ref.current,
            saved: false,
            changed: false
          })
          Const_Libs.TOAST.success('Sửa đường thành công')
          dispatch(setActiveControl('default'))
        }}
      />
      {/* END FORM Thêm Thông tin cột */}

      {menuControl()}
      <div id='viewDiv' className='col-12' style={styles.mapDiv}></div>
      <a
        className='edit-form bg-white  shadow-soft show-mobile'
        onClick={enableFormThemCot}
      >
        <img
          src='./template_admin/front-dashboard/assets/img/icons8-edit-64-mobile.png'
          className='w-100 h-100'
          alt=''
        />
      </a>
    </div>
  )
}
export default RootMap
