import React, { useEffect } from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux'
import { useUndoRedo } from '../../undo/useUndoRedo'
import {
  changeRootFolder,
  setActiveControl,
  setPathsDuong,
  setStateSuaDuong
} from '../../reducer_action/BaseMapActionReducer'
import { disabledAllForm, reRenderMap, setCenterMap } from '../../map/RootFunction'
import {
  disabledFormThemDuong,
  enableFormThemDuong
} from '../orther_element/FormThemDuong'
import { enableFormSuaDuong } from '../orther_element/FormSuaDuong'
import { disabledFormsuaCot } from '../orther_element/FormSuaCot'
import { Images } from '../../const/Const_Images'

export const handleActiveDuong = (
  list_root_folder_local,
  data_uuid_duong,
  value
) => {
  /**
   * Xử lý hiển thị đường
   *
   * @param list_root_folder: danh sách các cột và đường
   * @param data_uuid_duong: uuid của đường
   * @param value: giá trị muốn thay đổi (bool)
   * @author XHieu
   */
  list_root_folder_local.map(item_root => {
    if (item_root != null) {
      item_root.list_group_duong_va_cot.map((itemGroupDuongVaCot, index) => {
        if (itemGroupDuongVaCot.uuid_duong == data_uuid_duong) {
          itemGroupDuongVaCot.active_do_duong = value
          return 0
        }
        if (itemGroupDuongVaCot.folder_name != null) {
          handleActiveDuong([itemGroupDuongVaCot], data_uuid_duong, value)
        }
      })
    }
  })
}
export const PolylineItem = props => {
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const dispatch = useDispatch()
  
  // Undo/Redo functionality
  const { saveState } = useUndoRedo()

  const { data_polyline, index, uuid_folder } = props
  const editPolyLineItem = (
    list_root_folder_local,
    uuid_folder_local,
    uuid_duong_local
  ) => {
    disabledAllForm()
    enableFormSuaDuong()
    dispatch(setActiveControl('them_duong'))
    list_root_folder_local.map(item_root => {
      if (item_root != null) {
        if (item_root.uuid_folder == uuid_folder_local) {
          item_root.list_group_duong_va_cot.map(item_duong_va_cot => {
            if (
              item_duong_va_cot.uuid_duong == uuid_duong_local &&
            (item_duong_va_cot.type == 'duong' || item_duong_va_cot.type == 'track')
            ) {
              console.log(item_duong_va_cot)
              dispatch(setStateSuaDuong({ ...item_duong_va_cot }))
              dispatch(
                setPathsDuong({
                  uuid_duong: uuid_duong_local,
                  paths:
                    item_duong_va_cot.list_do_duong[0] == null
                      ? []
                      : item_duong_va_cot.list_do_duong[0],
                  saved: false
                })
              )
            }
          })
          return
        }
      }
    })
  }
  const deletePolylineItem = (
    list_root_folder_local,
    uuid_folder_local,
    uuid_duong_local
  ) => {
    list_root_folder_local.map(item_root => {
      if (item_root != null) {
        if (item_root.uuid_folder == uuid_folder_local) {
          item_root.list_group_duong_va_cot = item_root.list_group_duong_va_cot.filter(
            item => item.uuid_duong != uuid_duong_local
          )
          return
        }
      }
    })
    dispatch(changeRootFolder([...list_root_folder_local]))
    reRenderMap([...list_root_folder_local])
    disabledFormThemDuong()
  }
  useEffect(() => {
    // click để ẩn hiện từng đo đương
    $('.check-item-duong').click(function () {
      handleActiveDuong(
        list_root_folder,
        $(this).attr('data-uuid'),
        $(this).prop('checked')
      )
      dispatch(changeRootFolder([...list_root_folder]))
      reRenderMap([...list_root_folder])
    })
  }, [])
  return (
    <li className='nav-item d-flex justify-content-between align-items-center  p-1'>
      <a className='nav-link pl-2 w-100' title='Đo đường'>
        <div className='d-flex align-items-center'>
          <input
            type='checkbox'
            className='check-item-duong'
            defaultChecked={data_polyline.active_do_duong}
            data-uuid={data_polyline.uuid_duong}
            id={'alertsCheckbox' + index}
          />
          <label
            data-uuid={data_polyline.uuid_duong}
            htmlFor={'alertsCheckbox' + index}
          />
        </div>
        <i className='tio-node-multiple-outlined nav-icon' />
        <span 
          onClick={() => {
            if (data_polyline.list_do_duong && data_polyline.list_do_duong.length > 0) {
              const coordsArray = data_polyline.list_do_duong[0];
              if (coordsArray && coordsArray.length > 0) {
                // Get the middle point of the polyline
                const midIndex = Math.floor(coordsArray.length / 2);
                const midPoint = coordsArray[midIndex];
                if (midPoint && midPoint.length >= 2) {
                  setCenterMap(
                    [parseFloat(midPoint[0]), parseFloat(midPoint[1])],
                    19
                  );
                }
              }
            }
          }}
          className='text-danger bold click-item-duong'
          data-uuid={data_polyline.uuid_duong}
        >
          <strong>{data_polyline.name}</strong>
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
                editPolyLineItem(
                  list_root_folder,
                  uuid_folder,
                  data_polyline.uuid_duong
                )
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
                deletePolylineItem(
                  list_root_folder,
                  uuid_folder,
                  data_polyline.uuid_duong
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
