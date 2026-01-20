import $ from 'jquery'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStateRef from 'react-usestateref'
import { create_UUID } from '../../base/base'
import { Const_Libs } from '../../const/Const_Libs'
import { BASE_COT } from '../../const/Const_Obj'
import {
  changeRootFolder,
  setCurrentUUidFolder,
  setStateSuaCot,
  setStateThemCot
} from '../../reducer_action/BaseMapActionReducer'

export const enableModalThemFolder= () => {
  $('.modal-them-folder')
    .removeClass('d-none')
    .addClass('d-block')
}
export const disabledModalThemFolder = () => {
  $('.modal-them-folder')
    .removeClass('d-block')
    .addClass('d-none')
}
export const ModalThemFolder = () => {
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const dispatch = useDispatch()

  const handleSubmit = event => {
    /**
     * Thêm mới folder tuyến
     *
     * @param No
     * @author XHieu
     */
    event.preventDefault()
    let folder = {
      folder_name: `T_${$('#nameFolder').val()}`,
      uuid_folder: create_UUID(),
      active_folder: true,
      list_group_duong_va_cot: [],
      list_cot_2: []
    }
    let list = [...list_root_folder]
    list.push(folder)
    dispatch(changeRootFolder(list))
    disabledModalThemFolder()
    if (list.length > 0) {
      dispatch(setCurrentUUidFolder(list[list.length - 1].uuid_folder))
      $('.folder-root').removeClass('text-red')
      $(
        '.folder-root[id="' + list[list.length - 1].uuid_folder + '"]'
      ).addClass('text-red')
    }
    dispatch(setStateSuaCot({ ...BASE_COT }))
    dispatch(setStateThemCot({ ...BASE_COT }))
  }

  return (
    <div
      className='modal d-none form-rj modal-them-folder'
      id='exampleModal'
      tabIndex={-1}
      role='dialog'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          {/* Header */}
          <div className='modal-header'>
            <p className='modal-title fs-3 text-dark' id='exampleModalLabel'>
              Thêm Dự Án
            </p>
            <button
              type='button'
              className='btn btn-icon btn-sm btn-ghost-secondary'
              data-dismiss='modal'
              aria-label='Close'
              onClick={() => disabledModalThemFolder()}
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
              {/* Input */}
              <div className='form-group row'>
                <label
                  htmlFor='nameLabel'
                  className='col-sm-3 fs-5 col-form-label input-label'
                >
                  Tên dự án
                </label>
                <div className='col-sm-9 js-form-message'>
                  <input
                    type='text'
                    className='form-control'
                    id='nameFolder'
                    placeholder='Nhập tên tự án'
                    required
                    data-msg='Please enter your name.'
                  />
                </div>
              </div>
              <button type='submit' className='btn btn-primary'>
                Thêm mới
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
