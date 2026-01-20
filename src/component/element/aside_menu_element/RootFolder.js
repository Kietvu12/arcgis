import { handleActiveCot, PointItem } from './PointItem'
import { handleActiveDuong, PolylineItem } from './PolylineItem'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {
  changeRootFolder,
  changeRootNen,
  setActiveControl,
  setCurrentUUidFolder,
  setStateSuaCot,
  setStateSuaNhieuCot,
  setStateThemCot
} from '../../reducer_action/BaseMapActionReducer'
import {
  disabledAllForm,
  getSTTCot,
  getTenCotNoSTT,
  handleXoaNhieuCot_Common,
  reRenderMap,
  reRenderNen,
  updateSTTCot
} from '../../map/RootFunction'
import useStateRef from 'react-usestateref'
import { Images } from '../../const/Const_Images'
import { BASE_COT } from '../../const/Const_Obj'
import { Const_Libs } from '../../const/Const_Libs'
import { enableModalDanhSTTCot } from '../modal/ModalDanhSTTCot'
import { getItemSessionStorage } from '../../base/base'
export const handleActiveFolder = (
  list_root_folder_local,
  data_uuid_folder,
  value
) => {
  /**
   * Xử lý hiển thị các đường và cột trong 1 folder
   *
   * @param list_root_folder: danh sách các cột và đường
   * @param data_uuid_duong: uuid của folder
   * @param value: giá trị muốn thay đổi (bool)
   * @author XHieu
   */
  list_root_folder_local.map(item_root => {
    if (item_root != null) {
      if (item_root.uuid_folder == data_uuid_folder) {
        item_root.active_folder = value
        item_root.list_group_duong_va_cot.map(item => {
          if (item.uuid_cot != null) {
            handleActiveCot(list_root_folder_local, item.uuid_cot, value)
          }
          if (item.uuid_duong != null) {
            handleActiveDuong(list_root_folder_local, item.uuid_duong, value)
          }
        })
        return 0
      }
      if (item_root.list_group_duong_va_cot.length > 0) {
        item_root.list_group_duong_va_cot.map(itemGroupDuongVaCot => {
          if (itemGroupDuongVaCot.folder_name != null) {
            handleActiveFolder([itemGroupDuongVaCot], data_uuid_folder, value)
          }
        })
      }
    }
  })
}
export const RootFolder = props => {
  const { data_root_folder, check_nen, style, lastSelectedIndex: propLastSelectedIndex, setLastSelectedIndex: propSetLastSelectedIndex, getLastSelectedIndex: propGetLastSelectedIndex } = props
  const dispatch = useDispatch()
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const list_root_nen = useSelector(state => state.baseMap.list_root_nen)
  const state_them_cot = useSelector(state => state.baseMap.state_them_cot)
  const current_uuid_folder = useSelector(
    state => state.baseMap.current_uuid_folder
  )
  const control_xoa_nhieu_cot = useSelector(
    state => state.baseMap.control_xoa_nhieu_cot
  )
  const [
    so_cot_displayed,
    set_so_cot_displayed,
    get_so_cot_displayed
  ] = useStateRef(10)
  const state_sua_nhieu_cot = useSelector(
    state => state.baseMap.state_sua_nhieu_cot
  )
  const [
    state_sua_nhieu_cot_ref,
    set_state_sua_nhieu_cot_ref,
    get_state_sua_nhieu_cot_ref
  ] = useStateRef(state_sua_nhieu_cot)
  
  // Keep track of last selected column index for range selection
  // Use props if available (for nested folders), otherwise create local state
  const localState = useStateRef(-1)
  const lastSelectedIndex = propLastSelectedIndex !== undefined ? propLastSelectedIndex : localState[0]
  const setLastSelectedIndex = propSetLastSelectedIndex || localState[1]
  const getLastSelectedIndex = propGetLastSelectedIndex || localState[2]
  const handleActiveAllDuong = (
    list_root_folder_local,
    data_uuid_folder,
    value
  ) => {
    /**
     * Xử lý bật tắt tất cả các đường trên bản đồ trong folder mà mình click
     * @param list_root_folder_local - array: là danh sách đường và cột sau khi đã đọc từ file kml
     * @param data_uuid_folder - id của folder
     * @author XHieu
     */
    list_root_folder_local.map(item_root => {
      if (item_root != null) {
        if (item_root.uuid_folder == data_uuid_folder) {
          item_root.list_group_duong_va_cot.map(item => {
            if (item.type == 'duong') {
              handleActiveDuong(list_root_folder, item.uuid_duong, value)
            }
          })
          return 0
        }
        if (item_root.list_group_duong_va_cot.length > 0) {
          item_root.list_group_duong_va_cot.map(itemGroupDuongVaCot => {
            if (itemGroupDuongVaCot.folder_name != null) {
              handleActiveAllDuong(
                [itemGroupDuongVaCot],
                data_uuid_folder,
                value
              )
            }
          })
        }
      }
    })
  }
  const handleActiveAllCot = (
    list_root_folder_local,
    data_uuid_folder,
    value
  ) => {
    /**
     * Xử lý bật tắt tất cả các cột trên bản đồ trong folder mà mình click
     * @param list_root_folder_local - array: là danh sách đường và cột sau khi đã đọc từ file kml
     * @param data_uuid_folder - id của folder
     * @author XHieu
     */
    list_root_folder_local.map(item_root => {
      if (item_root != null) {
        if (item_root.uuid_folder == data_uuid_folder) {
          item_root.list_group_duong_va_cot.map(item => {
            if (item.type == 'cot') {
              handleActiveCot(list_root_folder, item.uuid_cot, value)
            }
          })
          return 0
        }
        if (item_root.list_group_duong_va_cot.length > 0) {
          item_root.list_group_duong_va_cot.map(itemGroupDuongVaCot => {
            if (itemGroupDuongVaCot.folder_name != null) {
              handleActiveAllCot([itemGroupDuongVaCot], data_uuid_folder, value)
            }
          })
        }
      }
    })
  }
  const getAmountCotCuaDuong = (list_root_folder_local, uuid_folder_local) => {
    /**
     * Lấy ra danh sách cột để hiện thị ở trạng thái khi cột bị tắt sẽ hiển thị ra các dấu +
     * Được khởi tạo ở hàm renderMenuDuongCot()
     * @param list_root_folder_local - array: là danh sách đường và cột sau khi đã đọc từ file kml
     * @param data_uuid_folder - id của folder
     * @author XHieu
     */

    list_root_folder_local.map(item_root => {
      if (item_root.uuid_folder == uuid_folder_local) {
        item_root.list_cot_2 = []
        let list_cot = item_root.list_group_duong_va_cot.filter(
          item => item.type == 'cot'
        )

        for (
          let i = 1;
          i < list_cot.length;
          i = i + parseInt(get_so_cot_displayed.current) - 1
        ) {
          let item_duong_cot = list_cot[i - 1]
          if (item_duong_cot.type == 'cot') {
            item_root.list_cot_2.push(item_duong_cot.coor)
          }
        }

        item_root.list_cot_2.push(list_cot[list_cot.length - 1].coor)
      }
    })
  }
  const deleteRootFolder = (list_root_folder_local, uuid_folder_local) => {
    let list = [...list_root_folder_local].filter(
      item => item.uuid_folder != uuid_folder_local
    )
    if (check_nen) {
      // xóa folder nền
      dispatch(changeRootNen([...list]))
    } else {
      dispatch(changeRootFolder([...list]))
    }
  }
  const clickFolderRoot = function (id, event) {
    console.log('clickFolderRoot called with UUID:', id)
    console.log('Looking in list_root_folder with', list_root_folder.length, 'items')
    console.log('Current folder data:', data_root_folder.folder_name)
    
    let element = $('#' + id)
    
    if (element.length === 0) {
      console.error('Could not find element with id:', id)
      return
    }
    
    // Check if this is a nested folder by searching in all folders' list_group_duong_va_cot
    let isNestedFolder = false
    for (let folder of list_root_folder) {
      if (folder.list_group_duong_va_cot && Array.isArray(folder.list_group_duong_va_cot)) {
        const found = folder.list_group_duong_va_cot.find(item => 
          item.uuid_folder === id && item.folder_name
        )
        if (found) {
          isNestedFolder = true
          break
        }
      }
    }
    
    console.log('Is nested folder:', isNestedFolder)
    
    if (isNestedFolder) {
      // This is a nested folder - just expand its submenu if closed, don't close other folders
      const submenu = element
        .parent()
        .parent()
        .parent()
        .children('.js-navbar-vertical-aside-submenu')
        
      if (submenu.length > 0 && !submenu.is(':visible')) {
        submenu.slideDown()
      }
    } else {
      // This is a top-level folder - close other folders and toggle this one
      let list = list_root_folder.filter(item => item.uuid_folder != id)
      
      list.map(item => {
        const otherElement = $('#' + item.uuid_folder)
        if (otherElement.length > 0) {
          otherElement
            .parent()
            .parent()
            .parent()
            .children('.js-navbar-vertical-aside-submenu')
            .slideUp()
        }
      })
      
      // Toggle this folder
      const submenu = element
        .parent()
        .parent()
        .parent()
        .children('.js-navbar-vertical-aside-submenu')
        
      if (submenu.length > 0) {
        submenu.slideToggle()
      }
    }
    
    $('.folder-root').removeClass('text-red')
    element.addClass('text-red')
    dispatch(setCurrentUUidFolder(id))
    dispatch(
      setStateThemCot({
        ...BASE_COT,
        lon: '',
        lat: '',
        uuid_folder: element.attr('id'),
        action: false
      })
    )
    
    console.log('Set current UUID folder to:', id)
  }

  const handleXoaNhieuCot = async (
    list_root_folder_local,
    uuid_folder_local = null
  ) => {
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
  useEffect(() => {
    set_state_sua_nhieu_cot_ref([...state_sua_nhieu_cot])
  }, [state_sua_nhieu_cot])
  useEffect(() => {
    $('.check-delete-cot').prop('checked', false)
  }, [control_xoa_nhieu_cot])
  useEffect(() => {
    // click để ẩn hiện cả folder
    $('.check-folder').click(function (event) {
      if (check_nen) {
        handleActiveFolder(
          list_root_nen,
          $(this).attr('data-uuid'),
          $(this).prop('checked')
        )
        dispatch(changeRootNen([...list_root_nen]))
      } else {
        handleActiveFolder(
          list_root_folder,
          $(this).attr('data-uuid'),
          $(this).prop('checked')
        )
        dispatch(changeRootFolder([...list_root_folder]))
      }
      $(this)
        .parent()
        .parent()
        .parent()
        .children()
        .children()
        .children()
        .children()
        .children('.check-item-duong')
        .prop('checked', $(this).prop('checked'))
      $(this)
        .parent()
        .parent()
        .parent()
        .children()
        .children()
        .children()
        .children()
        .children('.check-item-cot')
        .prop('checked', $(this).prop('checked'))
    })
    // click ẩn hiện tất cả đường
    $('.enable-all-duong').click(function () {
      handleActiveAllDuong(
        list_root_folder,
        $(this).attr('data-uuid-folder'),
        $(this).prop('checked')
      )
      dispatch(changeRootFolder([...list_root_folder]))
      $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children()
        .children()
        .children()
        .children('.check-item-duong')
        .prop('checked', $(this).prop('checked'))
    })
    // click ẩn hiện tất cả cột
    $('.enanble-all-cot').click(async function () {
      handleActiveAllCot(
        list_root_folder,
        $(this).attr('data-uuid-folder'),
        $(this).prop('checked')
      )
      getAmountCotCuaDuong(list_root_folder, $(this).attr('data-uuid-folder'))
      dispatch(changeRootFolder([...list_root_folder]))
      $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children()
        .children()
        .children()
        .children('.check-item-cot')
        .prop('checked', $(this).prop('checked'))
      if (!$(this).prop('checked')) {
        $(this)
          .parent()
          .parent()
          .children('.so-cot-display')
          .addClass('d-inline')
          .removeClass('d-none')
      } else {
        $(this)
          .parent()
          .parent()
          .children('.so-cot-display')
          .removeClass('d-inline')
          .addClass('d-none')
      }
    })
    // thay đổi số cột được hiển thị
    $('.so-cot-display').change(function () {
      set_so_cot_displayed($(this).val())
      getAmountCotCuaDuong(list_root_folder, $(this).attr('data-uuid-folder'))
      dispatch(changeRootFolder([...list_root_folder]))
      reRenderMap([...list_root_folder])
      // console.log('length: ' + list[0].length)
    })
  }, [])
  return (
    <li className='navbar-vertical-aside-has-menu position-relative pl-4 p-2  pointer'>
      <div className='d-flex w-100 justify-content-between align-items-center'>
        <div className='d-flex justify-content-between align-items-center'>
          <input
            className=' check-folder'
            type='checkbox'
            defaultChecked={data_root_folder.active_folder}
            data-uuid={data_root_folder.uuid_folder}
          />
          <a
            className='js-navbar-vertical-aside-menu-link pl-2 nav-link folder-root'
            title={data_root_folder.folder_name}
            style={style}
            onClick={function (event) {
              if (!check_nen) {
                clickFolderRoot(data_root_folder.uuid_folder, event)
              } else {
                // For background (nen) folders, just toggle
                $('#' + data_root_folder.uuid_folder)
                  .parent()
                  .parent()
                  .parent()
                  .children('.js-navbar-vertical-aside-submenu')
                  .slideToggle()
              }
            }}
            id={data_root_folder.uuid_folder}
          >
            <i className='tio-folder tio-xl mr-2 nav-icon' />
            <span className='navbar-vertical-aside-mini-mode-hidden-elements text-truncate'>
              {data_root_folder.folder_name}
            </span>
          </a>
        </div>
        <div className={!control_xoa_nhieu_cot ? 'dropdown' : 'd-none'}>
          <i
            className='tio-more-vertical tio-xl mr-2 nav-icon dropdown-toggle'
            id='dropdownMenuButton'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
          />
          <div
            className='dropdown-menu'
            aria-labelledby='dropdownMenuButton'
            style={{ right: '0px', left: 'auto' }}
          >
            <a
              title='Sau khi xóa folder này bạn sẽ không thể khôi phục lại dữ liệu.'
              className='dropdown-item pointer'
              onClick={() => {
                if (check_nen) {
                  deleteRootFolder(list_root_nen, data_root_folder.uuid_folder)
                } else {
                  deleteRootFolder(
                    list_root_folder,
                    data_root_folder.uuid_folder
                  )
                }
              }}
            >
              Xóa folder
            </a>
            {check_nen && (
              <>
                <a
                  title='Chỉnh sửa và xuất KML'
                  className='dropdown-item pointer'
                  onClick={() => {
                    // copy toàn bộ nền sang editable và hiển thị nút xuất
                    try {
                      const cloned = JSON.parse(JSON.stringify(list_root_nen))
                      dispatch(require('../../reducer_action/BaseMapActionReducer').changeRootFolder(cloned))
                      dispatch(require('../../reducer_action/BaseMapActionReducer').changeRootNen([]))
                      // đặt folder hiện hành đúng folder vừa chọn
                      dispatch(setCurrentUUidFolder(data_root_folder.uuid_folder))
                    } catch (e) {
                      console.error('Enable edit from dropdown failed', e)
                    }
                  }}
                >
                  Chỉnh sửa & Xuất KML
                </a>
              </>
            )}
            {!check_nen && list_root_nen.length === 0 && (
              <>
                <a
                  title='Hủy chỉnh sửa và quay lại trạng thái ban đầu'
                  className='dropdown-item pointer'
                  onClick={() => {
                    // Hủy chế độ chỉnh sửa và khôi phục trạng thái trước đó
                    try {
                      // Khôi phục lại dữ liệu nền từ list_root_folder hiện tại
                      const currentData = [...list_root_folder]
                      if (currentData && currentData.length > 0) {
                        // Khôi phục lại dữ liệu nền
                        dispatch(require('../../reducer_action/BaseMapActionReducer').changeRootNen([...currentData]))
                        // Xóa dữ liệu chỉnh sửa
                        dispatch(require('../../reducer_action/BaseMapActionReducer').changeRootFolder([]))
                      } else {
                        // Nếu không có dữ liệu, chỉ xóa dữ liệu chỉnh sửa
                        dispatch(require('../../reducer_action/BaseMapActionReducer').changeRootFolder([]))
                      }
                    } catch (e) {
                      console.error('Cancel edit from dropdown failed', e)
                    }
                  }}
                >
                  <i className='tio-clear mr-2' />
                  Hủy
                </a>
                <a
                  title='Lưu và xuất KML'
                  className='dropdown-item pointer'
                  onClick={() => {
                    // Xuất KML
                    $('#exportKML').trigger('click')
                  }}
                >
                  <i className='tio-download mr-2' />
                  Lưu & Xuất KML
                </a>
              </>
            )}
          </div>
        </div>
        <div className={control_xoa_nhieu_cot ? 'd-flex' : 'd-none'}>
          <a
            className='btn btn-icon btn-ghost-secondary rounded-circle'
            title='Đánh tên cột tự động'
            onClick={() => {
              enableModalDanhSTTCot()
            }}
          >
            <img
              class='avatar avatar-xs avatar-4by3'
              style={{ width: '25px', height: '25px' }}
              src={Images.IMG_INCREASE}
              alt='Image Description'
            />
          </a>
          <a
            className='btn btn-icon btn-ghost-secondary rounded-circle'
            title='Xóa nhiều cột'
            onClick={() => {
              handleXoaNhieuCot(list_root_folder, data_root_folder.uuid_folder)
            }}
          >
            <img
              class='avatar avatar-xs avatar-4by3'
              style={{ width: '25px', height: '25px' }}
              src={Images.IMG_XOA_COT}
              alt='Image Description'
            />
          </a>
        </div>
      </div>
      <ul className='js-navbar-vertical-aside-submenu nav nav-sub'>
        <li className='d-flex mb-2'>
          <div className='col-6 d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
              <input
                type='checkbox'
                className=' enable-all-duong'
                defaultChecked={true}
                data-type='duong'
                id={'duong' + data_root_folder.uuid_folder}
                data-uuid-folder={data_root_folder.uuid_folder}
              />
              <label
                className='ml-2 mb-0'
                htmlFor={'duong' + data_root_folder.uuid_folder}
              >
                Đường
              </label>
            </div>
          </div>
          <div className=' col-6 d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center d-flex align-items-center '>
              <input
                type='checkbox'
                className='enanble-all-cot'
                defaultChecked={true}
                data-type='cot'
                id={'cot1' + data_root_folder.uuid_folder}
                data-uuid-folder={data_root_folder.uuid_folder}
              />
              <label
                className='ml-2 mb-0'
                htmlFor={'cot1' + data_root_folder.uuid_folder}
              >
                Cột.
              </label>
            </div>
            <input
              min={10}
              max={100}
              data-uuid-folder={data_root_folder.uuid_folder}
              style={{ width: '40px', height: '25px' }}
              className='form-control so-cot-display d-none'
              type='number'
              defaultValue={10}
              step={1}
            />
          </div>
        </li>
        {/* html */}
        {data_root_folder.list_group_duong_va_cot.map(
          (itemGroupDuongVaCot, index) => {
            if (itemGroupDuongVaCot.type == 'duong' || itemGroupDuongVaCot.type == 'track') {
              return (
                <PolylineItem
                  key={index}
                  data_polyline={itemGroupDuongVaCot}
                  index={index}
                  uuid_folder={data_root_folder.uuid_folder}
                />
              )
            } else if (itemGroupDuongVaCot.type == 'cot') {
              // Get only cots from this folder for range selection
              const allCotsInFolder = data_root_folder.list_group_duong_va_cot.filter(item => item.type === 'cot')
              // Calculate the index of this cot in the allCotsInFolder array
              const cotIndexInCotsList = allCotsInFolder.findIndex(cot => cot.uuid_cot === itemGroupDuongVaCot.uuid_cot)
              return (
                <PointItem
                  key={index}
                  data_point={itemGroupDuongVaCot}
                  index={cotIndexInCotsList}
                  uuid_folder={data_root_folder.uuid_folder}
                  allCotsInFolder={allCotsInFolder}
                  lastSelectedIndex={lastSelectedIndex}
                  setLastSelectedIndex={setLastSelectedIndex}
                  getLastSelectedIndex={getLastSelectedIndex}
                />
              )
            } else if (itemGroupDuongVaCot.type == 'folder' || itemGroupDuongVaCot.folder_name) {
              // Pass down lastSelectedIndex props to nested folders
              return (
                <RootFolder
                  key={index}
                  data_root_folder={itemGroupDuongVaCot}
                  style={{}}
                  check_nen={check_nen}
                  lastSelectedIndex={lastSelectedIndex}
                  setLastSelectedIndex={setLastSelectedIndex}
                  getLastSelectedIndex={getLastSelectedIndex}
                ></RootFolder>
              )
            }
            return null
          }
        )}
      </ul>
    </li>
  )
}
