import $ from 'jquery'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { log } from 'util'
import {
  getItemSessionStorage,
  getRGBColor,
  rgbToHex,
  setItemSessionStorage
} from '../../base/base'

import { Images } from '../../const/Const_Images'
import { Const_Libs } from '../../const/Const_Libs'
import {
  getLineFromPoint,
  LINE_SYMBOL,
  reRenderMap
} from '../../map/RootFunction'
import {
  changeRootFolder,
  setPathsDuong,
  setStateSuaDuong
} from '../../reducer_action/BaseMapActionReducer'

export const disabledFormSuaDuong = () => {
  $('.form-sua-duong').removeClass('d-block').addClass('d-none')
}
export const enableFormSuaDuong = () => {
  $('.form-sua-duong').addClass('d-block').removeClass('d-none')
}
export const FormSuaDuong = props => {
  const { handleClickSaveDuong } = props
  const dispatch = useDispatch()
  const state_sua_duong = useSelector(state => state.baseMap.state_sua_duong)
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const current_uuid_folder = useSelector(
    state => state.baseMap.current_uuid_folder
  )
  const paths_duong = useSelector(state => state.baseMap.paths_duong)

  const handleChange = e => {
    /**
     * Sự kiện thay đổi input
     * @param no
     * @author XHieu
     */
    if (e.target.name == 'color_duong') {
      setItemSessionStorage('color_duong', getRGBColor(e.target.value))
      LINE_SYMBOL.data.symbol.symbolLayers[0].color = getRGBColor(
        e.target.value
      )
    }
    if (e.target.name == 'size_duong') {
      setItemSessionStorage('size_duong', e.target.value)
      LINE_SYMBOL.data.symbol.symbolLayers[0].width = e.target.value
    }
  }
  const handleSave = () => {
    handleClickSaveDuong()
  }
  const deletePathPolyline = (
    list_root_folder_local,
    uuid_folder_local,
    uuid_duong_local,
    index
  ) => {
    /**
     * Xóa một path trong đường
     * @param list_root_folder_local - array: là danh sách đường và cột sau khi đã đọc từ file kml
     * @param uuid_folder_local - id của folder
     * @param uuid_duong_local - id của đường
     * @param index - vị trí của path cần xóa đó
     * @author XHieu
     */
    list_root_folder_local.map(item_root => {
      if (item_root != null) {
        if (item_root.uuid_folder == uuid_folder_local) {
          item_root.list_group_duong_va_cot.map(item_duong_va_cot => {
            if (
              item_duong_va_cot.uuid_duong == uuid_duong_local &&
              (item_duong_va_cot.type == 'duong' ||
                item_duong_va_cot.type == 'track')
            ) {
              console.log(item_duong_va_cot.list_do_duong[0])
              let paths = [...item_duong_va_cot.list_do_duong[0]]
              paths.splice(index, 1)
              item_duong_va_cot.list_do_duong[0] = paths
              dispatch(setStateSuaDuong({ ...item_duong_va_cot }))
              dispatch(
                setPathsDuong({
                  ...paths_duong,
                  paths: paths,
                  saved: false
                })
              )
              return
            }
          })
          return
        }
      }
    })

    dispatch(changeRootFolder([...list_root_folder_local]))
    reRenderMap([...list_root_folder_local])
  }
  const getLine = (
    list_root_folder_local,
    uuid_folder_local,
    uuid_duong_local
  ) => {
    /**
     * 
     * @author XHieu
     */
    if (uuid_folder_local === '' || uuid_folder_local == null) {
      Const_Libs.TOAST.error('Bạn phải chọn folder trước.')
      return
    }
    let arr_cot = []
    let item_root = list_root_folder_local.filter(
      item => item.uuid_folder == uuid_folder_local
    )[0]
    console.log(item_root)
    item_root.list_group_duong_va_cot.map(item_group_duong_va_cot => {
      if (item_group_duong_va_cot.type == 'cot') {
        arr_cot.push(item_group_duong_va_cot)
      }
    })
    arr_cot = getLineFromPoint(arr_cot)

    list_root_folder_local.map(item_root => {
      if (item_root != null) {
        if (item_root.uuid_folder == uuid_folder_local) {
          item_root.list_group_duong_va_cot.map(item_duong_va_cot => {
            if (
              item_duong_va_cot.uuid_duong == uuid_duong_local &&
              (item_duong_va_cot.type == 'duong' ||
                item_duong_va_cot.type == 'track')
            ) {
              item_duong_va_cot.list_do_duong[0] =
                getItemSessionStorage('path_line_of_point')
              dispatch(setStateSuaDuong({ ...item_duong_va_cot }))
              dispatch(
                setPathsDuong({
                  ...paths_duong,
                  paths: getItemSessionStorage('path_line_of_point'),
                  saved: false
                })
              )
              return
            }
          })
          return
        }
      }
    })

    dispatch(changeRootFolder([...list_root_folder_local]))
    reRenderMap([...list_root_folder_local])
  }
  useEffect(() => {}, [state_sua_duong])
  return (
    <aside className=' position-absolute aside-form-duong js-navbar-vertical-aside form-sua-duong d-none form-rj navbar navbar-vertical-aside navbar-vertical navbar-vertical-right navbar-expand-xl navbar-bordered navbar-vertical-aside-initialized'>
      <div className='navbar-vertical-container '>
        <div className='navbar-vertical-footer-offset position-relative h-100'>
          <button
            type='button'
            onClick={() => {
              disabledFormSuaDuong()
            }}
            style={{ right: '5px', top: '10px', zIndex: '103' }}
            className='btn btn-icon btn-sm btn-ghost-secondary  position-absolute show-mobile'
          >
            <i class='tio-clear tio-lg'></i>
          </button>

          <div
            className='navbar-brand-wrapper justify-content-between mt-2 mb- col-12 pr-0 w-100 d-flex '
            style={{ overflow: 'unset', borderBottom: '1px solid #0000003b' }}
          >
            <div className='row justify-content-between align-items-center col-12 p-0'>
              <div className='col-auto py-1'>
                <a className='font-size-sm text-body fs-3 fw-500'>
                  Sửa thông tin đường
                </a>
              </div>
              <div>
                <button
                  className='btn btn-primary fs-4 mr-2 show-desk '
                  onClick={() =>
                    getLine(
                      list_root_folder,
                      current_uuid_folder,
                      state_sua_duong.uuid_duong
                    )
                  }
                >
                  Lấy tọa độ theo cột đã có
                </button>
                <button
                  className='btn btn-primary fs-4 mr-2 show-desk'
                  onClick={() => {
                    disabledFormSuaDuong()
                    handleSave()
                  }}
                >
                  <img
                    src={Images.IMG_SAVE}
                    className='avatar avatar-xs avatar-4by3 mr-2'
                    alt='Lưu lại'
                    style={{ width: '20px', height: '20px' }}
                  />
                  Lưu lại
                </button>
                <button
                  className='btn btn-primary fs-4  show-desk '
                  onClick={() => {
                    disabledFormSuaDuong()
                  }}
                >
                  <i class='tio-clear tio-lg fs-2 mr-1'></i>
                  Đóng
                </button>
              </div>
            </div>
          </div>
          {/* body */}
          <div className='navbar-vertical-content pt-2 row'>
            {/* Input */}
            <div className='col-xs-12 col-md-8 col-lg-8 col-xl-8 row m-0 p-2'>
              <div className='col-xs-12 col-md-4 col-lg-4 col-xl-4 mr-0 ml-0 mb-2  form-group '>
                <label
                  htmlFor='emailLabel'
                  className=' text-nowrap  text-left fs-4 col-form-label input-label'
                >
                  Tên đường
                </label>

                <input
                  type='text'
                  className='form-control fs-5'
                  disabled
                  defaultValue={'Đo Đường'}
                  placeholder='Tên'
                />
              </div>
              <div className='col-xs-12 col-md-4 col-lg-4 col-xl-4  mr-0 ml-0 mb-2  form-group '>
                <label
                  htmlFor='emailLabel'
                  className=' text-nowrap  text-left fs-4 col-form-label input-label'
                >
                  Màu
                </label>

                <input
                  type='color'
                  name='color_duong'
                  defaultValue={
                    getItemSessionStorage('color_duong') == null
                      ? rgbToHex([255, 0, 0])
                      : rgbToHex(getItemSessionStorage('color_duong'))
                  }
                  className='form-control fs-5'
                  placeholder='Chọn màu'
                  onChange={handleChange}
                />
              </div>
              <div className='col-xs-12 col-md-4 col-lg-4 col-xl-4  mr-0 ml-0 mb-2  form-group '>
                <label
                  htmlFor='emailLabel'
                  className='text-nowrap  text-left fs-4 col-form-label input-label'
                >
                  Độ đậm
                </label>

                <input
                  type='number'
                  min={2}
                  defaultValue={
                    getItemSessionStorage('size_duong') == null
                      ? 4
                      : getItemSessionStorage('size_duong')
                  }
                  max={10}
                  name='size_duong'
                  className='form-control fs-5'
                  placeholder='Chọn độ đậm'
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* End Input */}
            <div className='col-xs-12 col-md-4 col-lg-4 col-xl-4'>
              <ul
                class='list-unstyled text-left list-unstyled-py-3 text-dark mb-3 pl-3 mt-3'
                style={{ maxHeight: '100px', overflowY: 'auto' }}
              >
                <li class='py-0 text-left'>
                  <small class='card-subtitle fs-5'>Danh sách tọa độ:</small>
                </li>
                {state_sua_duong.list_do_duong[0] == null
                  ? ''
                  : state_sua_duong.list_do_duong[0].map((item, index) => {
                      return (
                        <li className='d-flex justify-content-between pr-2'>
                          <div className=''>
                            <i className='tio-poi-outlined mr-2'></i>
                            Điểm {index + 1}
                          </div>
                          <div class=''>
                            <button
                              type='button'
                              class='btn btn-xs btn-white'
                              onClick={() => {
                                deletePathPolyline(
                                  list_root_folder,
                                  current_uuid_folder,
                                  state_sua_duong.uuid_duong,
                                  index
                                )
                              }}
                            >
                              <i class='tio-clear icon-xs mr-1'></i>Delete
                            </button>
                          </div>
                        </li>
                      )
                    })}
              </ul>
            </div>
          </div>
          {/* END body */}
          {/* Footer*/}
          <div className='navbar-vertical-footer  w-100 show-mobile'>
            <div className='col-auto py-1'>
              <button
                className='btn btn-primary fs-4 w-100'
                onClick={() => handleSave()}
              >
                <img
                  src={Images.IMG_SAVE}
                  className='avatar avatar-xs avatar-4by3 mr-2'
                  alt='Lưu lại'
                  style={{ width: '20px', height: '20px' }}
                />
                Lưu lại
              </button>
            </div>
          </div>
          {/* End Footer*/}
        </div>
      </div>
    </aside>
  )
}
