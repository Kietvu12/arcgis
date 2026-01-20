import React, { useEffect } from 'react'
import $ from 'jquery'
import { useSelector } from 'react-redux'
import useStateRef from 'react-usestateref'
import {
  getTenCotNoSTT,
  updateSTTCot,
  updateSTTCotByStartNumber
} from '../../map/RootFunction'
import { useDispatch } from 'react-redux'
import { changeRootFolder, setStateSuaNhieuCot } from '../../reducer_action/BaseMapActionReducer'
import { Const_Libs } from '../../const/Const_Libs'
export const enableModalDanhSTTCot = () => {
  $('.modal-nhap-stt-cot')
    .removeClass('d-none')
    .addClass('d-block')
}
export const disabledModalDanhSTTCot = () => {
  $('.modal-nhap-stt-cot')
    .removeClass('d-block')
    .addClass('d-none')
}
export default function ModalDanhSTTCot () {
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const dispatch = useDispatch()

  const state_sua_nhieu_cot = useSelector(
    state => state.baseMap.state_sua_nhieu_cot
  )
  const [
    state_sua_nhieu_cot_ref,
    set_state_sua_nhieu_cot_ref,
    get_state_sua_nhieu_cot_ref
  ] = useStateRef(state_sua_nhieu_cot)
  const handleSubmit = async e => {
    e.preventDefault()
    let start = parseInt($('#startSTT_ModalDanhSTT').val())
    
    // Validate start number
    if (isNaN(start) || start < 1) {
      Const_Libs.TOAST.error('Số bắt đầu phải là số nguyên dương')
      return
    }
    
    let list_root_folder_local = list_root_folder
    let uuid_folder_local = get_state_sua_nhieu_cot_ref.current[0].uuid_folder
    const newPrefix = $('#kyHieuCot_ModalDanhSTT').val().toUpperCase().trim()
    
    for (let i in get_state_sua_nhieu_cot_ref.current) {
      list_root_folder_local = await updateSTTCotByStartNumber(
        [...list_root_folder_local],
        get_state_sua_nhieu_cot_ref.current[i].uuid_folder,
        start + parseInt(i), // Use start number plus index
        newPrefix,
        get_state_sua_nhieu_cot_ref.current[i].uuid_cot
      )
    }
    
    dispatch(changeRootFolder([...list_root_folder_local]))
    disabledModalDanhSTTCot()
    
    // Clear selections
    dispatch(setStateSuaNhieuCot([]))
    
    // Reset form
    $('#kyHieuCot_ModalDanhSTT').val('')
    $('#startSTT_ModalDanhSTT').val(1)
  }
  useEffect(() => {
    set_state_sua_nhieu_cot_ref([...state_sua_nhieu_cot])
  }, [state_sua_nhieu_cot])
  return (
    <div
      className='modal d-none form-rj modal-nhap-stt-cot'
      id='exampleModal'
      tabIndex={-1}
      role='dialog'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          {/* Header */}
          <div className='modal-header'>
            <p className='modal-title fs-3 text-dark' id='exampleModalLabel'>
              Sửa lại mã cột
            </p>
            <button
              type='button'
              className='btn btn-icon btn-sm btn-ghost-secondary'
              data-dismiss='modal'
              aria-label='Close'
              onClick={() => disabledModalDanhSTTCot()}
            >
              <i className='tio-clear tio-lg' aria-hidden='true' />
            </button>
          </div>
          {/* End Header */}
          {/* Body */}
          <div className='modal-body'>
            {/* Automatic Column Naming Section */}
            <div className='mb-4'>
              <p className='mb-3'><strong>Đánh tên cột tự động:</strong></p>
              <form
                className='js-validate d-flex align-items-center'
                onSubmit={event => {
                  handleSubmit(event)
                }}
              >
                <div className='form-group row mb-0 flex-grow-1'>
                  <label className='col-sm-3 col-form-label text-right mb-0'>Ký hiệu:</label>
                  <div className='col-sm-9'>
                    <input
                      type='text'
                      id='kyHieuCot_ModalDanhSTT'
                      className='form-control'
                      required
                    />
                  </div>
                </div>
                <div className='form-group row mb-0 flex-grow-1 mr-2'>
                  <label className='col-sm-3 col-form-label text-right mb-0'>Từ:</label>
                  <div className='col-sm-9'>
                    <input
                      type='number'
                      min={1}
                      id='startSTT_ModalDanhSTT'
                      className='form-control'
                      required
                      pattern='[0-9]+'
                    />
                  </div>
                </div>
                <button type='submit' className='btn btn-primary'>
                  OK
                </button>
              </form>
            </div>

            {/* Separator */}
            <hr className='my-4' />

            {/* Column List Section */}
            <div>
              <div className='d-flex border-bottom pb-2 mb-3'>
                <strong className='col-2'>STT</strong>
                <strong className='col-10'>Tên cột</strong>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {get_state_sua_nhieu_cot_ref.current && get_state_sua_nhieu_cot_ref.current.length > 0 ? (
                  get_state_sua_nhieu_cot_ref.current.map((cot, index) => (
                    <div key={cot.uuid_cot} className='d-flex py-2 border-bottom'>
                      <div className='col-2'>{index + 1}</div>
                      <div className='col-10'>{cot.name}</div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-4 text-muted'>
                    Chưa có cột nào được chọn
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* End Body */}
          
          {/* Footer */}
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary mr-2' onClick={() => disabledModalDanhSTTCot()}>
              Thoát
            </button>
            <button 
              type='button' 
              className='btn btn-primary' 
              onClick={(e) => {
                const form = document.querySelector('.modal-nhap-stt-cot form')
                if (form) {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
                  form.dispatchEvent(submitEvent)
                  if (submitEvent.defaultPrevented) {
                    e.preventDefault()
                  }
                }
              }}
            >
              Lưu
            </button>
          </div>
          {/* End Footer */}
        </div>
      </div>
    </div>
  )
}
