import $ from 'jquery'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStateRef from 'react-usestateref'
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
import { changeRootFolder } from '../../reducer_action/BaseMapActionReducer'

export const enableFormThemDuong = () => {
  $('.form-them-duong')
    .removeClass('d-none')
    .addClass('d-block')
}
export const disabledFormThemDuong = () => {
  $('.form-them-duong')
    .removeClass('d-block')
    .addClass('d-none')
}
export const FormThemDuong = props => {
  const {
    handleClickSaveDuong,
    paths_duong_ref,
    uuid_folder,
    set_paths_duong_ref,
    handleAddCoorToDuong
  } = props

  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)

  const handleSave = () => {
    /**
     * Lưu lại
     *
     * @param no
     * @author XHieu
     */
    handleClickSaveDuong()
  }
  const handleChange = e => {
    /**
     * SỰ kiện thay đổi các ô input
     *
     * @param e: event
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
  const deletePathPolyline = index => {
    /**
     * Xóa một path của đường
     *
     * @param index: vị trí của path ý
     * @author XHieu
     */
    let data_duong = { ...paths_duong_ref }
    let paths = [...data_duong.paths]
    paths.splice(index, 1)
    data_duong = { ...data_duong, paths: paths }
    set_paths_duong_ref({ ...data_duong })
    handleAddCoorToDuong()
    // handleClickSaveDuong()
  }
  const getLine = uuid_folder_local => {
    /**
     * lấy ra danh sách paths đường dựa vào các cột có sẵn
     *
     * @param uuid_folder_local: uuid của folder
     * @author XHieu
     */
    if (uuid_folder_local === '' || uuid_folder_local == null) {
      Const_Libs.TOAST.error('Bạn phải chọn folder trước.')
      return
    }
    let arr_cot = []
    let item_root = list_root_folder.filter(
      item => item.uuid_folder == uuid_folder_local
    )[0]
    if (item_root.length == 0) {
      Const_Libs.TOAST.success('Bạn phải thêm cột trước.')
      return
    }
    // Thu thập tất cả cột
    item_root.list_group_duong_va_cot.map(item_group_duong_va_cot => {
      if (item_group_duong_va_cot.type == 'cot') {
        arr_cot.push(item_group_duong_va_cot)
      }
    })
    
    // Tạo đường từ các cột
    arr_cot = getLineFromPoint(arr_cot)
    let data_duong = { ...paths_duong_ref }
    let arr = getItemSessionStorage('path_line_of_point')
    console.log(arr.length);
    
    data_duong = { ...data_duong, paths: getItemSessionStorage('path_line_of_point') }
    set_paths_duong_ref({ ...data_duong })
    
    // handleAddCoorToDuong sẽ xóa đường cũ và tạo lại đường mới
    handleAddCoorToDuong()
  }

  return (
    <aside className='position-absolute aside-form-duong d-none js-navbar-vertical-aside form-them-duong form-rj navbar navbar-vertical-aside navbar-vertical navbar-vertical-right navbar-expand-xl navbar-bordered navbar-vertical-aside-initialized'>
      <div className='navbar-vertical-container '>
        <div className='navbar-vertical-footer-offset position-relative h-100'>
          <button
            type='button'
            onClick={() => {
              disabledFormThemDuong()
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
                  Thông tin đường
                </a>
              </div>
              <div>
                <button
                  className='btn btn-primary fs-4 mr-2 show-desk '
                  onClick={() => getLine(uuid_folder)}
                >
                  Lấy tọa độ theo cột đã có
                </button>
                <button
                  className='btn btn-primary fs-4 mr-2 show-desk '
                  onClick={() => {
                    disabledFormThemDuong()
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
                    disabledFormThemDuong()
                  }}
                >
                  <i class='tio-clear tio-lg fs-2 mr-1'></i>
                  Đóng
                </button>
              </div>
            </div>
          </div>
          {/* body */}
          <div className='navbar-vertical-content row'>
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
            <div className='col-xs-12 col-md-4 col-lg-4 col-xl-4'>
              <ul
                class='list-unstyled text-left list-unstyled-py-3 text-dark mb-3 pl-3 mt-3'
                style={{ maxHeight: '100px', overflowY: 'auto' }}
              >
                <li class='py-0 text-left'>
                  <small class='card-subtitle fs-5'>Danh sách tọa độ:</small>
                </li>
                {paths_duong_ref.paths.map((item, index) => {
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
                            deletePathPolyline(index)
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

            {/* End Input */}
          </div>
          {/* END body */}
          {/* Footer*/}
          <div className='navbar-vertical-footer show-mobile'>
            <div className='col-auto py-1 pos'>
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
