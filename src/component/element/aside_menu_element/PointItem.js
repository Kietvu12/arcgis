import { useEffect } from 'react'
import $ from 'jquery'
import { useUndoRedo } from '../../undo/useUndoRedo'
import {
  changeRootFolder,
  setActiveControl,
  setIndexChenCot,
  setStateSuaCot,
  setStateSuaNhieuCot,
  setStateThemCot
} from '../../reducer_action/BaseMapActionReducer'
import {
  disabledAllForm,
  findCotByUUidCot,
  getSTTCot,
  getTenCotNoSTT,
  reRenderMap,
  setCenterMap,
  updateSTTCot
} from '../../map/RootFunction'
import { enableFormsuaCot } from '../../element/orther_element/FormSuaCot'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Const_Libs } from '../../const/Const_Libs'
import { Images } from '../../const/Const_Images'
import { enableFormThemCot } from '../orther_element/FormThemCot'
import { getCountString, isNumber } from '../../base/base'
import { BASE_COT } from '../../const/Const_Obj'
import useStateRef from 'react-usestateref'
import { log } from 'util'
export const handleActiveCot = (
  list_root_folder_local,
  data_uuid_cot,
  value
) => {
  /**
   * Xử lý hiển thị đường
   *
   * @param list_root_folder: danh sách các cột và đường
   * @param data_uuid_cot: uuid của cột
   * @param value: giá trị muốn thay đổi (bool)
   * @author XHieu
   */
  list_root_folder_local.map(item_root => {
    if (item_root != null) {
      item_root.list_group_duong_va_cot.map((itemGroupDuongVaCot, index) => {
        if (itemGroupDuongVaCot.uuid_cot == data_uuid_cot) {
          itemGroupDuongVaCot.active_cot = value
          return 0
        }
        if (itemGroupDuongVaCot.folder_name != null) {
          handleActiveCot([itemGroupDuongVaCot], data_uuid_cot, value)
        }
      })
    }
  })
}
export const PointItem = props => {
  const { data_point, index: index_point, uuid_folder, key, allCotsInFolder, lastSelectedIndex, setLastSelectedIndex, getLastSelectedIndex } = props
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const control_xoa_nhieu_cot = useSelector(
    state => state.baseMap.control_xoa_nhieu_cot
  )
  const state_sua_nhieu_cot = useSelector(
    state => state.baseMap.state_sua_nhieu_cot
  )
  const [
    state_sua_nhieu_cot_ref,
    set_state_sua_nhieu_cot_ref,
    get_state_sua_nhieu_cot_ref
  ] = useStateRef(state_sua_nhieu_cot)

  const dispatch = useDispatch()
  
  // Undo/Redo functionality
  const { saveState } = useUndoRedo()
  const editPointItemm = (item, uuid_folder_local, index) => {
    /**
     * Xử lý sửa cột
     * @param item - là cái cột mà mình định sửa
     * @param uuid_folder_local - id của folder
     * @author XHieu
     */
    disabledAllForm()
    let cot = {
      ...findCotByUUidCot(uuid_folder_local, list_root_folder, item.uuid_cot),
      uuid_cot: item.uuid_cot,
      name: item.name,
      coor: [item.coor[0], item.coor[1]],
      active_cot: true,
      type: 'cot',
      uuid_folder: uuid_folder_local
    }
    dispatch(setStateSuaCot(cot))
    enableFormsuaCot()
    dispatch(setIndexChenCot(index))
  }
  const deletePointItem = (
    list_root_folder_local,
    uuid_folder_local,
    uuid_cot
  ) => {
    /**
     * Xử lý xóa cột
     * @param list_root_folder_local - array: là danh sách đường và cột sau khi đã đọc từ file kml
     * @param uuid_folder - id của folder
     * @param uuid_cot - id của cột
     * @author XHieu
     */

    list_root_folder_local.map(item_root => {
      if (item_root != null) {
        if (item_root.uuid_folder == uuid_folder_local) {
          let list = [...item_root.list_group_duong_va_cot]
          let cot_bi_xoa = list.filter(item => item.uuid_cot === uuid_cot)[0]
          item_root.list_group_duong_va_cot = list.filter(
            item => item.uuid_cot != uuid_cot
          )
          let last_cot = [...item_root.list_group_duong_va_cot]
            .filter(item => item.type == 'cot')
            .pop()
          Const_Libs.TOAST.success('Xóa cột thành công.')
          // TH cột bị xóa không phải là cột cuối cùng thì
          // giá trị tên cột tiếp theo định thêm tăng lên
          last_cot = {
            ...last_cot,
            name:
              getTenCotNoSTT(last_cot.name.trim()) +
              '' +
              getSTTCot(last_cot.name.trim())
          }
          disabledAllForm()
          list_root_folder_local = updateSTTCot(
            list_root_folder_local,
            uuid_folder_local,
            getTenCotNoSTT(cot_bi_xoa.name.trim())
          )
          dispatch(changeRootFolder([...list_root_folder_local]))
          dispatch(setStateThemCot({ ...BASE_COT, ...last_cot, action: false }))
          return
        }
      }
    })
  }
  const chonCotDeXoa = (
    list_root_folder_local,
    uuid_folder_local,
    uuid_cot
  ) => {
    list_root_folder_local.map(item_root => {
      if (item_root != null) {
        if (item_root.uuid_folder == uuid_folder_local) {
          let arr_cot_can_sua = [...get_state_sua_nhieu_cot_ref.current]
          console.log(arr_cot_can_sua)
          let cot_bi_xoa = item_root.list_group_duong_va_cot.filter(
            item => item.uuid_cot === uuid_cot
          )[0]

          // Check if already selected to avoid duplicates
          if (!arr_cot_can_sua.find(c => c.uuid_cot === cot_bi_xoa.uuid_cot)) {
            arr_cot_can_sua.push(cot_bi_xoa)
            dispatch(setStateSuaNhieuCot([...arr_cot_can_sua]))
          }
        }
      }
    })
  }
  useEffect(() => {
    set_state_sua_nhieu_cot_ref([...state_sua_nhieu_cot])
    state_sua_nhieu_cot.map(item => {
      $('.check-delete-cot[data-uuid=' + item.uuid_cot + ']').prop(
        'checked',
        true
      )
    })
  }, [state_sua_nhieu_cot])

  useEffect(() => {
    // click để ẩn hiện từng cột
    $('.check-item-cot').click(function () {
      handleActiveCot(
        list_root_folder,
        $(this).attr('data-uuid'),
        $(this).prop('checked')
      )

      dispatch(changeRootFolder([...list_root_folder]))
      reRenderMap([...list_root_folder])
    })
  }, [])
  const handleDragStart = (e) => {
    try {
      e.dataTransfer.effectAllowed = 'move'
      const payload = JSON.stringify({
        type: 'cot',
        uuid_cot: data_point.uuid_cot,
        uuid_folder: uuid_folder
      })
      e.dataTransfer.setData('application/json', payload)
    } catch (err) {}
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    // optional visual cue
    e.currentTarget.classList.add('bg-light')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-light')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-light')
    let data
    try {
      data = JSON.parse(e.dataTransfer.getData('application/json') || '{}')
    } catch (err) { data = {} }
    if (!data || data.type !== 'cot' || !data.uuid_cot) return
    // Only allow reordering within the same folder for simplicity
    if (data.uuid_folder !== uuid_folder) return

    const folders = [...list_root_folder]
    for (let f of folders) {
      if (f.uuid_folder === uuid_folder && Array.isArray(f.list_group_duong_va_cot)) {
        const items = f.list_group_duong_va_cot
        const sourceIndex = items.findIndex(it => it.type === 'cot' && it.uuid_cot === data.uuid_cot)
        const targetIndex = items.findIndex(it => it.type === 'cot' && it.uuid_cot === data_point.uuid_cot)
        if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) break
        const [moved] = items.splice(sourceIndex, 1)
        const insertAt = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
        items.splice(insertAt, 0, moved)
        dispatch(changeRootFolder([...folders]))
        reRenderMap([...folders])
        Const_Libs.TOAST.success('Đã sắp xếp lại cột')
        saveState('Sắp xếp lại cột')
        break
      }
    }
  }

  return (
    <li
      className='nav-item d-flex justify-content-between align-items-center p-1'
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <a
        className='nav-link w-100 pr-1 pl-2 pointer d-flex align-items-center'
        title={data_point.name}
      >
        <div
          className={
            !control_xoa_nhieu_cot
              ? 'd-flex align-items-center'
              : 'd-none align-items-center'
          }
        >
          <input
            type='checkbox'
            defaultChecked={data_point.active_cot}
            className='check-item-cot'
            data-uuid={data_point.uuid_cot}
            id={'alertsCheckbox' + index_point}
          />
          <label
            className
            data-uuid={data_point.uuid_cot}
            htmlFor={'alertsCheckbox' + index_point}
          />
        </div>
        <div
          className={
            control_xoa_nhieu_cot
              ? 'd-flex align-items-center'
              : 'd-none align-items-center'
          }
        >
          <input
            type='checkbox'
            defaultChecked={false}
            className='check-delete-cot'
            data-uuid={data_point.uuid_cot}
            onChange={e => {
              console.log(e.target.checked)
              const isShiftPressed = e.nativeEvent.shiftKey
              const currentIndex = index_point
              const lastIndex = getLastSelectedIndex.current
              
              if (e.target.checked == true) {
                if (isShiftPressed && lastIndex >= 0 && allCotsInFolder && allCotsInFolder.length > 0) {
                  // Range selection: select all items between lastIndex and currentIndex
                  console.log('Shift-click: selecting range from', lastIndex, 'to', currentIndex)
                  const startIndex = Math.min(lastIndex, currentIndex)
                  const endIndex = Math.max(lastIndex, currentIndex)
                  let arr_cot_can_sua = [...get_state_sua_nhieu_cot_ref.current]
                  
                  for (let i = startIndex; i <= endIndex; i++) {
                    const cot = allCotsInFolder[i]
                    if (cot && !arr_cot_can_sua.find(c => c.uuid_cot === cot.uuid_cot)) {
                      arr_cot_can_sua.push(cot)
                    }
                  }
                  
                  // Update checkboxes for all selected items
                  arr_cot_can_sua.forEach(cot => {
                    $(`.check-delete-cot[data-uuid=${cot.uuid_cot}]`).prop('checked', true)
                  })
                  
                  dispatch(setStateSuaNhieuCot([...arr_cot_can_sua]))
                  setLastSelectedIndex(currentIndex)
                } else {
                  // Single selection
                  chonCotDeXoa(
                    [...list_root_folder],
                    uuid_folder,
                    data_point.uuid_cot
                  )
                  setLastSelectedIndex(currentIndex)
                }
              } else {
                // Uncheck: remove from selected list
                let arr_cot_can_sua = get_state_sua_nhieu_cot_ref.current.filter(
                  item => item.uuid_cot !== data_point.uuid_cot
                )
                dispatch(setStateSuaNhieuCot([...arr_cot_can_sua]))
              }
            }}
            id={'checkBoxDeleteCot' + index_point}
          />
          <label
            className
            data-uuid={data_point.uuid_cot}
            htmlFor={'checkBoxDeleteCot' + index_point}
          />
        </div>
        <i className='tio-poi-outlined nav-icon' />
        <span
          onClick={() => {
            setCenterMap(
              [parseFloat(data_point.coor[0]), parseFloat(data_point.coor[1])],
              19
            )
          }}
          className='text-truncate click-item-cot'
          data-uuid={data_point.uuid_cot}
          data-coor={data_point.coor[0] + ',' + data_point.coor[1]}
        >
          {data_point.name}
        </span>
      </a>
      <div className='d-flex'>
        <div className='dropdown'>
          <i
            className='tio-more-vertical tio-xl mr-2 nav-icon '
            id='dropdownPoint'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
          />
          <div
            className='dropdown-menu'
            aria-labelledby='dropdownPoint'
            style={{ right: '0px', left: 'auto' }}
          >
            <a
              className='dropdown-item pointer'
              onClick={() => {
                editPointItemm(data_point, uuid_folder, index_point)
              }}
            >
              <img
                class='avatar avatar-xs avatar-4by3 mr-2'
                style={{ width: '20px', height: '20px' }}
                src={Images.IMG_WRENCH}
                alt='Image Description'
              />{' '}
              Sửa
            </a>
            <a
              className='dropdown-item pointer'
              onClick={() => {
                deletePointItem(
                  [...list_root_folder],
                  uuid_folder,
                  data_point.uuid_cot
                )
              }}
            >
              <img
                class='avatar avatar-xs avatar-4by3 mr-2'
                style={{ width: '20px', height: '20px' }}
                src={Images.IMG_XOA_COT}
                alt='Image Description'
              />{' '}
              Xóa
            </a>
          </div>
        </div>
      </div>
    </li>
  )
}
