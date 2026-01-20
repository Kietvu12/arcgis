import $ from 'jquery'
import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import useStateRef from 'react-usestateref'
import { create_UUID, getCountString, isNumber } from '../../base/base'
import { Const_Libs } from '../../const/Const_Libs'
import { changeRootFolder, setActiveControl, setStateSuaCot } from '../../reducer_action/BaseMapActionReducer'
import {
  arrayInsert,
  findCotByUUidCot,
  findMidLatLong,
  reRenderMap,
  projectPointOntoPolyline,
  findNearestPolyline
} from '../../map/RootFunction'
import { BASE_COT } from '../../const/Const_Obj'
export const enableModalNhapSoLuongChenCot = () => {
  $('.modal-nhap-so-luong-cot').removeClass('d-none').addClass('d-block')
}
export const disabledModalNhapSoLuongChenCot = () => {
  $('.modal-nhap-so-luong-cot').removeClass('d-block').addClass('d-none')
}
export const ModalNhapSoLuongChenCot = () => {
  const dispatch = useDispatch()
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const state_sua_cot = useSelector(state => state.baseMap.state_sua_cot)
  const [state_sua_cot_ref, set_state_sua_cot_ref, get_state_sua_cot_ref] =
    useStateRef(state_sua_cot)
  const [cotDau, setCotDau] = useState(null)
  const [cotCuoi, setCotCuoi] = useState(null)
  const [isSelectingStart, setIsSelectingStart] = useState(false)
  const [isSelectingEnd, setIsSelectingEnd] = useState(false)
  const [showDropdownDau, setShowDropdownDau] = useState(false)
  const [showDropdownCuoi, setShowDropdownCuoi] = useState(false)
  const [isSelectingFromMap, setIsSelectingFromMap] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [originalCot, setOriginalCot, getOriginalCot] = useStateRef(null) // Lưu cột gốc để so sánh
  
  // Helper function to find folder containing a cot
  const findFolderContainingCotForFilter = (folders, cotUuid) => {
    for (let folder of folders) {
      if (folder.list_group_duong_va_cot && Array.isArray(folder.list_group_duong_va_cot)) {
        for (let item of folder.list_group_duong_va_cot) {
          if (item.type === 'cot' && item.uuid_cot === cotUuid) {
            return folder
          } else if (item.type === 'folder') {
            const result = findFolderContainingCotForFilter([item], cotUuid)
            if (result) return result
          }
        }
      }
    }
    return null
  }
  
  // Helper function to get all cots from a specific folder (including nested folders if needed)
  const getCotsFromFolder = (folder) => {
    if (!folder || !folder.list_group_duong_va_cot) return []
    
    return folder.list_group_duong_va_cot
      .filter(item => item.type === 'cot')
      .map(item => item)
  }
  
  // Lấy cột để hiển thị - nếu đã chọn cotDau thì chỉ lấy cột cùng folder
  const listCot = useMemo(() => {
    console.log('=== listCot useMemo called ===')
    console.log('cotDau:', cotDau)
    console.log('list_root_folder:', list_root_folder)
    
    if (!list_root_folder || list_root_folder.length === 0) {
      console.log('No list_root_folder')
      return []
    }
    
    // Nếu đã chọn cotDau, chỉ lấy cột trong cùng folder với cotDau
    if (cotDau && cotDau.uuid_cot) {
      console.log('cotDau đã chọn, tìm folder chứa cotDau...')
      const targetFolder = findFolderContainingCotForFilter(list_root_folder, cotDau.uuid_cot)
      
      if (targetFolder) {
        console.log('Found folder chứa cotDau:', targetFolder.folder_name)
        const cots = getCotsFromFolder(targetFolder)
        console.log('✓ Found', cots.length, 'cột trong folder', targetFolder.folder_name)
        return cots
      } else {
        console.log('Không tìm thấy folder chứa cotDau, lấy tất cả cột')
      }
    }
    
    // Nếu chưa chọn cotDau hoặc không tìm thấy folder, lấy tất cả cột
    console.log('Lấy tất cả cột từ tất cả folder')
    let allCots = []
    list_root_folder.forEach(folder => {
      if (folder.list_group_duong_va_cot && Array.isArray(folder.list_group_duong_va_cot)) {
        folder.list_group_duong_va_cot.forEach(item => {
          if (item.type === 'cot') {
            allCots.push(item)
          } else if (item.type === 'folder') {
            const nestedCots = item.list_group_duong_va_cot.filter(cot => cot.type === 'cot')
            allCots = allCots.concat(nestedCots)
          }
        })
      }
    })
    
    console.log('✓ Found total', allCots.length, 'cột from all folders')
    return allCots
  }, [list_root_folder, cotDau])
  
  // Xử lý chọn cột từ map
  useEffect(() => {
    if (isSelectingFromMap && !cotCuoi) {
      // Lưu cột đầu (cotDau) để so sánh, không phải state_sua_cot
      if (cotDau && cotDau.uuid_cot) {
        setOriginalCot(cotDau)
        console.log('Lưu cột đầu để so sánh:', cotDau.name)
      }
      
      // Đặt chế độ chọn cột từ map
      dispatch(setActiveControl('select_cot_dich'))
      console.log('Đã set active_control = select_cot_dich, vui lòng click vào cột trên bản đồ')
      
      // Visual feedback - đổi cursor thành pointer
      document.body.style.cursor = 'crosshair'
      document.getElementById('mapContainer')?.style.setProperty('cursor', 'crosshair')
    } else if (!isSelectingFromMap) {
      // Reset cursor
      document.body.style.cursor = ''
      document.getElementById('mapContainer')?.style.setProperty('cursor', 'default')
    }
  }, [isSelectingFromMap, dispatch, cotCuoi, cotDau, setOriginalCot])
  const handleSubmit = event => {
    event.preventDefault()
    if (!cotDau || !cotCuoi) {
      Const_Libs.TOAST.error('Vui lòng chọn cột đầu và cột cuối')
      return
    }
    
    const soLuong = parseInt($('#soLuongChenCot').val())
    if (soLuong < 1) {
      Const_Libs.TOAST.error('Số lượng cột phải lớn hơn 0')
      return
    }
    
    handleChenCotBetweenPoints(
      list_root_folder,
      cotDau,
      cotCuoi,
      cotDau.uuid_folder,
      soLuong
    )
    Const_Libs.TOAST.success('Chèn cột thành công.')
    disabledModalNhapSoLuongChenCot()
    setCotDau(null)
    setCotCuoi(null)
  }
  // Helper function to get all cots in order from all folders (including nested)
  const getAllCotsInOrderFromFolders = (folders) => {
    let allCots = []
    
    const traverse = (folder) => {
      if (folder.list_group_duong_va_cot && Array.isArray(folder.list_group_duong_va_cot)) {
        folder.list_group_duong_va_cot.forEach(item => {
          if (item.type === 'cot') {
            allCots.push(item)
          } else if (item.type === 'folder') {
            traverse(item)
          }
        })
      }
    }
    
    folders.forEach(folder => {
      traverse(folder)
    })
    
    return allCots
  }

    const handleChenCotBetweenPoints = (
    list_root_folder_local,
    cotDau_local,
    cotCuoi_local,
    uuid_folder_local,
    so_luong_chen_cot_local
  ) => {
    /**
     * Xử lý chèn cột giữa 2 cột đã chọn
     * @param cotDau_local - cột đầu tiên
     * @param cotCuoi_local - cột cuối cùng  
     * @param uuid_folder_local - id của folder
     * @param so_luong_chen_cot_local - số lượng cột muốn chèn
     */
    
    console.log('Debug chèn cột:')
    console.log('cotDau_local:', cotDau_local)
    console.log('cotCuoi_local:', cotCuoi_local)
    
    // Helper function to find folder containing a cot and its index in that folder
    const findFolderAndIndexForCot = (folders, cotUuid) => {
      const traverse = (folder) => {
        if (folder.list_group_duong_va_cot && Array.isArray(folder.list_group_duong_va_cot)) {
          for (let index = 0; index < folder.list_group_duong_va_cot.length; index++) {
            const item = folder.list_group_duong_va_cot[index]
            
            if (item.type === 'cot' && item.uuid_cot === cotUuid) {
              return { folder, index }
            } else if (item.type === 'folder') {
              const result = traverse(item)
              if (result) return result
            }
          }
        }
        return null
      }
      
      for (let folder of folders) {
        const result = traverse(folder)
        if (result) return result
      }
      
      return null
    }
    
    // Helper function to check if two columns are consecutive in the list (by position, not by name)
    const areColumnsConsecutiveInList = (index1, index2) => {
      // Check if they are consecutive positions in the list
      return Math.abs(index1 - index2) === 1
    }
    
    // Tìm folder và index cho cột đầu và cột cuối
    const dauInfo = findFolderAndIndexForCot(list_root_folder_local, cotDau_local.uuid_cot)
    const cuoiInfo = findFolderAndIndexForCot(list_root_folder_local, cotCuoi_local.uuid_cot)
    
    console.log('=== DEBUG CHÈN CỘT ===')
    console.log('cotDau_local:', {
      name: cotDau_local.name,
      uuid_cot: cotDau_local.uuid_cot,
      uuid_folder: cotDau_local.uuid_folder
    })
    console.log('cotCuoi_local:', {
      name: cotCuoi_local.name,
      uuid_cot: cotCuoi_local.uuid_cot,
      uuid_folder: cotCuoi_local.uuid_folder
    })
    console.log('dauInfo:', dauInfo ? {
      folder_name: dauInfo.folder.folder_name,
      folder_uuid: dauInfo.folder.uuid_folder,
      index: dauInfo.index
    } : 'NOT FOUND')
    console.log('cuoiInfo:', cuoiInfo ? {
      folder_name: cuoiInfo.folder.folder_name,
      folder_uuid: cuoiInfo.folder.uuid_folder,
      index: cuoiInfo.index
    } : 'NOT FOUND')
    
    if (!dauInfo || !cuoiInfo) {
      Const_Libs.TOAST.error('Không tìm thấy cột trong cấu trúc folder')
      return
    }
    
    // Kiểm tra cả hai cột có cùng folder không
    console.log('Comparing folders:', {
      dau_folder_name: dauInfo.folder.folder_name,
      dau_uuid: dauInfo.folder.uuid_folder,
      cuoi_folder_name: cuoiInfo.folder.folder_name,
      cuoi_uuid: cuoiInfo.folder.uuid_folder,
      same_uuid: dauInfo.folder.uuid_folder === cuoiInfo.folder.uuid_folder,
      same_ref: dauInfo.folder === cuoiInfo.folder
    })
    
    // Kiểm tra reference để chắc chắn
    if (dauInfo.folder !== cuoiInfo.folder && dauInfo.folder.uuid_folder !== cuoiInfo.folder.uuid_folder) {
      console.error('Các cột không cùng folder!')
      console.error('Dau folder:', dauInfo.folder.folder_name, dauInfo.folder.uuid_folder)
      console.error('Cuoi folder:', cuoiInfo.folder.folder_name, cuoiInfo.folder.uuid_folder)
      Const_Libs.TOAST.error('Cột đầu và cột cuối phải cùng trong một folder. Dau: ' + dauInfo.folder.folder_name + ', Cuoi: ' + cuoiInfo.folder.folder_name)
      return
    }
    
    console.log('✓ Cả hai cột đều trong cùng folder')
    
    const indexDau = dauInfo.index
    const indexCuoi = cuoiInfo.index
    const targetFolder = dauInfo.folder
    
    console.log('Final indexDau:', indexDau, 'indexCuoi:', indexCuoi, 'in folder:', targetFolder.folder_name)
    
    if (indexDau === -1 || indexCuoi === -1) {
      Const_Libs.TOAST.error('Không tìm thấy vị trí chèn. indexDau: ' + indexDau + ', indexCuoi: ' + indexCuoi)
      return
    }
    
    // Xác định hướng chèn: true nếu chèn từ trước qua sau, false nếu chèn ngược lại
    const isForward = indexDau < indexCuoi
    
    console.log('Adjusted indexes - indexDau:', indexDau, 'indexCuoi:', indexCuoi)
    console.log('Insert direction - isForward:', isForward)
    
    // Tính toán tọa độ các cột cần chèn
    // Luôn tính từ cotDau đến cotCuoi để đảm bảo tính toán chính xác
    const arr_coor = [
      {
        longitude: parseFloat(cotDau_local.coor[0]),
        latitude: parseFloat(cotDau_local.coor[1])
      },
      {
        longitude: parseFloat(cotCuoi_local.coor[0]),
        latitude: parseFloat(cotCuoi_local.coor[1])
      }
    ]
    
    // findMidLatLong có loop i=1; i<number nên sẽ trả về (number-1) điểm
    // Muốn chèn n cột thì phải truyền n+1
    let rs_list_cot_chen = findMidLatLong(arr_coor, so_luong_chen_cot_local + 1)
    
    // Tìm polyline gần nhất nếu có
    const allPolylines = []
    const getPolylinesFromFolder = (folder) => {
      if (folder.list_group_duong_va_cot) {
        folder.list_group_duong_va_cot.forEach(item => {
          if (item.type === 'duong' || item.type === 'track') {
            allPolylines.push(item)
          }
        })
      }
    }
    getPolylinesFromFolder(targetFolder)
    
    // Nếu có polyline, chiếu các điểm lên polyline
    if (allPolylines.length > 0) {
      const nearestPolyline = findNearestPolyline(
        arr_coor[0],
        arr_coor[1],
        allPolylines
      )
      
      if (nearestPolyline && nearestPolyline.list_do_duong) {
        console.log('Tìm thấy polyline gần nhất:', nearestPolyline.name)
        // Chiếu từng điểm lên polyline
        rs_list_cot_chen = rs_list_cot_chen.map(point => {
          return projectPointOntoPolyline(point, nearestPolyline.list_do_duong)
        })
      }
    }
    
    // Nếu chèn ngược (backward), cần đảo ngược thứ tự các điểm SAU KHI chiếu lên polyline
    if (!isForward) {
      rs_list_cot_chen = rs_list_cot_chen.reverse()
    }
    
    // Chèn các cột vào giữa trong targetFolder
    if (isForward) {
      // Chèn từ trước qua sau (C1 -> C2): C1 - C2 - C3 - C4 - C5
      // Chèn các cột với tên tạm thời, sẽ được cập nhật sau
      for (let i = 0; i < rs_list_cot_chen.length; i++) {
        const newCot = {
          ...BASE_COT,
          ...cotDau_local,
          coor: [
            rs_list_cot_chen[i].longitude,
            rs_list_cot_chen[i].latitude
          ],
          uuid_cot: create_UUID(),
          name: 'TEMP_' + i,  // Tên tạm thời
          active_cot: true,
          type: 'cot',
          uuid_folder: targetFolder.uuid_folder
        }
        
        targetFolder.list_group_duong_va_cot = arrayInsert(
          targetFolder.list_group_duong_va_cot,
          indexDau + 1 + i,
          newCot
        )
      }
    } else {
      // Chèn ngược (C7 -> C46): C46 - C47 - C48 - C49 - C7
      // Chèn các cột với tên tạm thời, sẽ được cập nhật sau
      for (let i = 0; i < rs_list_cot_chen.length; i++) {
        const newCot = {
          ...BASE_COT,
          ...cotCuoi_local,
          coor: [
            rs_list_cot_chen[i].longitude,
            rs_list_cot_chen[i].latitude
          ],
          uuid_cot: create_UUID(),
          name: 'TEMP_' + i,  // Tên tạm thời
          active_cot: true,
          type: 'cot',
          uuid_folder: targetFolder.uuid_folder
        }
        
        targetFolder.list_group_duong_va_cot = arrayInsert(
          targetFolder.list_group_duong_va_cot,
          indexCuoi + 1 + i,
          newCot
        )
      }
    }
    
    // Kiểm tra xem có cần tịnh tiến số thứ tự các cột hay không
    const isConsecutive = areColumnsConsecutiveInList(indexDau, indexCuoi)
    
    if (isConsecutive) {
      // Nếu 2 cột liền mạch, tịnh tiến các cột bên phía chứa cotDau
      const updateColumnNames = (cotDau, cotCuoi, folder, indexDauParam, indexCuoiParam) => {
        // Extract number and prefix from column name (e.g., "C1" -> prefix="C", num=1)
        const getNumberAndPrefix = (name) => {
          const match = name.match(/^(.+?)(\d+)$/)
          if (!match) return null
          return { prefix: match[1], num: parseInt(match[2]) }
        }
        
        const cotDauInfo = getNumberAndPrefix(cotDau.name)
        
        if (!cotDauInfo) {
          return
        }
        
        // Xác định hướng: forward nếu indexDau < indexCuoi
        const isForwardByIndex = indexDauParam < indexCuoiParam
        const prefix = cotDauInfo.prefix
        let baseNum = cotDauInfo.num
        
        if (isForwardByIndex) {
          // Forward: C1 -> C2 chèn 3 cột -> C1 C2 C3 C4 C5
          // Bắt đầu từ sau cotDau (indexDauParam + 1), đánh số tuần tự từ cotDau.num + 1
          let currentNum = baseNum + 1
          for (let i = indexDauParam + 1; i < folder.list_group_duong_va_cot.length; i++) {
            const item = folder.list_group_duong_va_cot[i]
            if (item.type === 'cot') {
              const numPrefix = getNumberAndPrefix(item.name)
              // Update both existing columns with numbers and temp columns
              if (item.name && item.name.startsWith('TEMP_')) {
                // Update temp columns
                item.name = prefix + currentNum
                currentNum++
              } else if (numPrefix && numPrefix.prefix === prefix) {
                // Check if this column is expected or if we've hit a gap
                // Expected: currentNum, next: currentNum + 1, etc.
                const expectedNum = currentNum
                const actualNum = numPrefix.num
                
                // If we hit a column that's not part of the expected sequence, stop
                // Stop if actualNum is significantly larger than expectedNum
                // This catches cases like C46 followed by C9 (DL7, DL8, then C9 sequence)
                // Don't stop if actualNum < expectedNum (this is normal for consecutive updates)
                if (actualNum - expectedNum > 10) {
                  // Likely hit a different sequence, stop updating
                  break
                }
                
                item.name = prefix + currentNum
                currentNum++
              }
            }
          }
        } else {
          // Backward: C5 -> C4 chèn 2 cột -> C1 C2 C3 C4 C5 C6 C7
          // Lấy số từ cotCuoi làm base, bắt đầu từ sau indexCuoi
          const cotCuoiInfo = getNumberAndPrefix(cotCuoi.name)
          if (!cotCuoiInfo || cotCuoiInfo.prefix !== prefix) {
            return
          }
          let currentNum = cotCuoiInfo.num + 1  // Bắt đầu từ sau cotCuoi
          const startIndex = indexCuoiParam + 1  // Bắt đầu ngay sau cotCuoi
          for (let i = startIndex; i < folder.list_group_duong_va_cot.length; i++) {
            const item = folder.list_group_duong_va_cot[i]
            if (item.type === 'cot') {
              const numPrefix = getNumberAndPrefix(item.name)
              // Update both existing columns with numbers and temp columns
              if (item.name && item.name.startsWith('TEMP_')) {
                // Update temp columns
                item.name = prefix + currentNum
                currentNum++
              } else if (numPrefix && numPrefix.prefix === prefix) {
                // Check if this column is expected or if we've hit a gap
                const expectedNum = currentNum
                const actualNum = numPrefix.num
                
                // If we hit a column that's not part of the expected sequence, stop
                // Stop if actualNum is significantly larger than expectedNum
                if (actualNum - expectedNum > 10) {
                  // Likely hit a different sequence, stop updating
                  break
                }
                
                item.name = prefix + currentNum
                currentNum++
              }
            }
          }
        }
      }
      
      updateColumnNames(cotDau_local, cotCuoi_local, targetFolder, indexDau, indexCuoi)
    }
    
    dispatch(changeRootFolder([...list_root_folder_local]))
    reRenderMap([...list_root_folder_local])
  }

  const handleChenCot = (
    list_root_folder_local,
    item,
    uuid_folder_local,
    so_luong_chen_cot_local
  ) => {
    /**
     * Xử lý chèn cột
     * @param item - là cái cột mà mình định chèn
     * @param uuid_folder_local - id của folder
     * @author XHieu
     */

    let name = item.name.trim()
    let count = getCountString(name, '').split('').reverse().join('')
    let pos = count.length
    if (isNumber(count)) {
      count = parseInt(count) + 1
    }
    let arr_coor = []
    let index_local = 0
    // lấy ra điểm đầu và điểm cuối để chèn các cột vào giữa
    let check_last_cot = false
    list_root_folder_local.map(item_root => {
      if (item_root.uuid_folder == uuid_folder_local) {
        for (let i = 0; i < item_root.list_group_duong_va_cot.length; i++) {
          let item_duong_cot = item_root.list_group_duong_va_cot[i]
          if (
            item_duong_cot.type == 'cot' &&
            item_duong_cot.uuid_cot == item.uuid_cot
          ) {
            index_local = i

            if (index_local == item_root.list_group_duong_va_cot.length - 1) {
              Const_Libs.TOAST.error(
                'Vị trí cần chèn không hợp lệ. Bạn không thể chèn dưới cột cuối cùng'
              )
              check_last_cot = true
              return
            }
            arr_coor.push({
              longitude: parseFloat(item_duong_cot.coor[0]),
              latitude: parseFloat(item_duong_cot.coor[1])
            })
            arr_coor.push({
              longitude: parseFloat(
                item_root.list_group_duong_va_cot[i + 1].coor[0]
              ),
              latitude: parseFloat(
                item_root.list_group_duong_va_cot[i + 1].coor[1]
              )
            })
            return
          }
        }
        return
      }
    })
    if (check_last_cot) {
      // nếu mà chọn cột cuối để chèn thì ngắt luôn
      // vì không biết được cột kết thúc
      return
    }
    // lấy ra danh sách tọa độ của các cột cần chèn
    // findMidLatLong có loop i=1; i<number nên sẽ trả về (number-1) điểm
    // Muốn chèn n cột thì phải truyền n+1
    let rs_list_cot_chen = findMidLatLong(arr_coor, so_luong_chen_cot_local + 1)
    // lấy ra thông tin cột
    let cot = {
      ...findCotByUUidCot(
        uuid_folder_local,
        list_root_folder_local,
        item.uuid_cot
      ),
      active_cot: true,
      type: 'cot',
      uuid_folder: uuid_folder_local,
      action: false
    }
    // tiến hành chèn số cột vào vị trí index_local
    for (let i = 0; i < list_root_folder_local.length; i++) {
      if (list_root_folder_local[i].uuid_folder == uuid_folder_local) {
        for (let j = 0; j < rs_list_cot_chen.length; j++) {
          // chèn vào vị trí index_local+1
          list_root_folder_local[i].list_group_duong_va_cot = arrayInsert(
            list_root_folder_local[i].list_group_duong_va_cot,
            index_local + 1,
            {
              ...BASE_COT,
              cot: cot.cot,
              src_icon: cot.src_icon,
              coor: [
                rs_list_cot_chen[j].longitude,
                rs_list_cot_chen[j].latitude
              ],
              uuid_cot: create_UUID(),
              name: name.slice(0, name.length - pos) + '' + count,
              active_cot: true,
              type: 'cot',
              uuid_folder: uuid_folder_local,
              action: false
            }
          )
          index_local++
          count++
        }
      }
    }
    // Không tịnh tiến số thứ tự của các cột cũ - giữ nguyên tên cột cũ
    dispatch(changeRootFolder([...list_root_folder_local]))

    // enableFormThemCot()
    // disabledFormsuaCot()
    // dispatch(setStateThemCot({ ...cot }))
    $('.active-control').removeClass('active-gray')
    $('.check-delete-cot').prop('checked', false)
    // dispatch(setStateSuaCot({ ...BASE_COT }))
    // dispatch(setActiveControl('chen_cot'))
  }
  const active_control = useSelector(state => state.baseMap.active_control)
  
  useEffect(() => {
    set_state_sua_cot_ref(state_sua_cot)
    // Set cột được chọn làm cột đầu mặc định
    if (state_sua_cot && state_sua_cot.type === 'cot' && !cotDau) {
      setCotDau(state_sua_cot)
      
      // Tự động tìm và set cột đích là cột ngay sau cột đầu
      if (list_root_folder && list_root_folder.length > 0) {
        const folder = findFolderContainingCotForFilter(list_root_folder, state_sua_cot.uuid_cot)
        if (folder && folder.list_group_duong_va_cot) {
          // Tìm index của cột đầu trong folder
          let cotDauIndex = -1
          for (let i = 0; i < folder.list_group_duong_va_cot.length; i++) {
            const item = folder.list_group_duong_va_cot[i]
            if (item.type === 'cot' && item.uuid_cot === state_sua_cot.uuid_cot) {
              cotDauIndex = i
              break
            }
          }
          
        // Tìm cột tiếp theo sau cột đầu; nếu không có, chọn cột trước đó
        let picked = false
        if (cotDauIndex !== -1 && cotDauIndex < folder.list_group_duong_va_cot.length - 1) {
          for (let i = cotDauIndex + 1; i < folder.list_group_duong_va_cot.length; i++) {
            const item = folder.list_group_duong_va_cot[i]
            if (item.type === 'cot') {
              setCotCuoi(item)
              picked = true
              console.log('Tự động chọn cột cuối (sau):', item.name)
              break
            }
          }
        }
        if (!picked && cotDauIndex > 0) {
          for (let i = cotDauIndex - 1; i >= 0; i--) {
            const item = folder.list_group_duong_va_cot[i]
            if (item.type === 'cot') {
              setCotCuoi(item)
              picked = true
              console.log('Tự động chọn cột cuối (trước):', item.name)
              break
            }
          }
        }
        }
      }
    }
  }, [state_sua_cot])
  
  // Xử lý khi chọn cột từ map
  useEffect(() => {
    console.log('=== useEffect: Chọn cột từ map ===')
    console.log('isSelectingFromMap:', isSelectingFromMap)
    console.log('state_sua_cot:', state_sua_cot)
    console.log('cotCuoi:', cotCuoi)
    
    // Khi đang trong chế độ chọn từ map và có state_sua_cot mới
    if (!isSelectingFromMap) {
      console.log('Không trong chế độ chọn từ map, bỏ qua')
      return
    }
    
    if (!state_sua_cot || !state_sua_cot.uuid_cot || state_sua_cot.type !== 'cot') {
      console.log('state_sua_cot không hợp lệ')
      return
    }
    
    const originalCotValue = getOriginalCot.current
    
    console.log('=== Nhận được cột từ map khi đang select ===')
    console.log('Cột được click:', state_sua_cot.name, state_sua_cot.uuid_cot)
    console.log('Cột đầu (originalCot):', originalCotValue?.name, originalCotValue?.uuid_cot)
    console.log('cotDau:', cotDau?.name, cotDau?.uuid_cot)
    
    // Chỉ xử lý nếu cột mới khác với cột đầu (cotDau)
    const cotDauToCompare = originalCotValue || cotDau
    if (cotDauToCompare && state_sua_cot.uuid_cot === cotDauToCompare.uuid_cot) {
      console.log('Bỏ qua - đây là cột đầu, chưa có click vào cột mới')
      Const_Libs.TOAST('Vui lòng chọn cột cuối khác với cột đầu')
      return
    }
    
    // Chỉ update nếu chưa có cotCuoi hoặc cotCuoi khác với state_sua_cot
    if (!cotCuoi || cotCuoi.uuid_cot !== state_sua_cot.uuid_cot) {
      console.log('Setting cotCuoi to:', state_sua_cot.name)
      setCotCuoi(state_sua_cot)
      setIsSelectingFromMap(false)
      setOriginalCot(null) // Reset
      // Reset cursor
      document.body.style.cursor = ''
      document.getElementById('mapContainer')?.style.setProperty('cursor', 'default')
      // Reset active_control
      dispatch(setActiveControl(''))
      Const_Libs.TOAST.success('Đã chọn cột cuối: ' + state_sua_cot.name)
    } else {
      console.log('cotCuoi đã được set trước đó với cùng UUID')
    }
  }, [state_sua_cot, isSelectingFromMap, cotCuoi, cotDau, dispatch, getOriginalCot])
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdownDau(false)
      setShowDropdownCuoi(false)
    }
    if (showDropdownDau || showDropdownCuoi) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDropdownDau, showDropdownCuoi])
  
  // Handle modal drag
  const handleMouseDown = (e) => {
    if (e.target.closest('.modal-header')) {
      setIsDragging(true)
      const modal = e.currentTarget.closest('.modal-dialog')
      if (modal) {
        const rect = modal.getBoundingClientRect()
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }
  }
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const modal = document.querySelector('.modal-nhap-so-luong-cot .modal-dialog')
        if (modal) {
          modal.style.position = 'fixed'
          modal.style.left = `${e.clientX - dragOffset.x}px`
          modal.style.top = `${e.clientY - dragOffset.y}px`
        }
      }
    }
    
    const handleMouseUp = () => {
      setIsDragging(false)
    }
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])
  return (
    <div
      className='modal d-none form-rj modal-nhap-so-luong-cot'
      id='exampleModal'
      tabIndex={-1}
      role='dialog'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
      style={{ pointerEvents: 'none' }}
    >
      <div 
        className='modal-dialog' 
        role='document'
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'default', pointerEvents: 'auto' }}
      >
        <div className='modal-content'>
          {/* Header - Drag handler */}
          <div className='modal-header' style={{ cursor: 'grab', userSelect: 'none' }}>
            <p className='modal-title fs-3 text-dark' id='exampleModalLabel'>
              Chèn cột theo số lượng
            </p>
            <button
              type='button'
              className='btn btn-icon btn-sm btn-ghost-secondary'
              data-dismiss='modal'
              aria-label='Close'
               onClick={() => {
                 disabledModalNhapSoLuongChenCot()
                 setCotDau(null)
                 setCotCuoi(null)
                 setIsSelectingFromMap(false)
                 setOriginalCot(null) // Reset original cot
                 dispatch(setActiveControl(''))
                 // Reset cursor
                 document.body.style.cursor = ''
                 document.getElementById('mapContainer')?.style.setProperty('cursor', 'default')
               }}
            >
              <i className='tio-clear tio-lg' aria-hidden='true' />
            </button>
          </div>
          {/* End Header */}
          {/* Body */}
          <div className='modal-body'>
            {/*  Form */}
            <form
              className='js-validate'
              onSubmit={event => {
                handleSubmit(event)
              }}
            >
              {/* Chọn cột đầu */}
              <div className='form-group row mb-3'>
                <label className='col-sm-4 fs-5 col-form-label input-label'>
                  Cột đầu tiên
                </label>
                <div className='col-sm-8 position-relative'>
                  <button 
                    type='button'
                    className='btn btn-outline-primary w-100 text-left'
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDropdownDau(!showDropdownDau)
                      setShowDropdownCuoi(false)
                    }}
                  >
                    {cotDau ? cotDau.name : 'Chọn cột đầu'}
                    <i className='tio-chevron-down float-right'></i>
                  </button>
                  
                  {showDropdownDau && (
                    <div 
                      className='dropdown-menu show'
                      style={{
                        display: 'block',
                        position: 'absolute',
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 10000
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {listCot.map(cot => (
                        <a
                          key={cot.uuid_cot}
                          className='dropdown-item'
                          onClick={() => {
                            setCotDau(cot)
                            setShowDropdownDau(false)
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {cot.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chọn cột cuối */}
              <div className='form-group row mb-3'>
                <label className='col-sm-4 fs-5 col-form-label input-label'>
                  Cột cuối cùng
                </label>
                <div className='col-sm-8 position-relative'>
                  <button 
                    type='button'
                    className='btn btn-outline-primary w-100 text-left'
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDropdownCuoi(!showDropdownCuoi)
                      setShowDropdownDau(false)
                    }}
                  >
                    {cotCuoi ? cotCuoi.name : 'Chọn cột cuối'}
                    <i className='tio-chevron-down float-right'></i>
                  </button>
                  
                  {showDropdownCuoi && (
                    <div 
                      className='dropdown-menu show'
                      style={{
                        display: 'block',
                        position: 'absolute',
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 10000
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Option to select from map */}
                      <a
                        className='dropdown-item'
                        onClick={() => {
                          setShowDropdownCuoi(false)
                          setIsSelectingFromMap(true)
                          Const_Libs.TOAST('Vui lòng click vào cột trên bản đồ để chọn cột cuối')
                        }}
                        style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                      >
                        <i className='tio-map mr-2'></i>
                        Chọn từ bản đồ
                      </a>
                      <hr style={{ margin: '4px 0' }} />
                      {/* List of columns */}
                      {listCot.map(cot => (
                        <a
                          key={cot.uuid_cot}
                          className='dropdown-item'
                          onClick={() => {
                            setCotCuoi(cot)
                            setShowDropdownCuoi(false)
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {cot.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Input số lượng */}
              <div className='form-group row mb-3'>
                <label
                  htmlFor='nameLabel'
                  className='col-sm-4 fs-5 col-form-label input-label'
                >
                  Số lượng cột
                </label>
                <div className='col-sm-8 js-form-message'>
                  <input
                    type='number'
                    title='Số lượng phải > 0'
                    min={1}
                    className='form-control'
                    id='soLuongChenCot'
                    placeholder='Nhập số lượng cột muốn chèn'
                    required
                  />
                </div>
              </div>

              <button 
                type='submit' 
                className='btn btn-primary'
                disabled={!cotDau || !cotCuoi}
              >
                Chèn cột
              </button>
            </form>
            {/* End Form */}
          </div>
          {/* End Body */}
        </div>
      </div>
    </div>
  )
}
