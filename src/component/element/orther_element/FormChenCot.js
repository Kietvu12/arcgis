import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import $ from 'jquery'
import { enableModalNhapSoLuongChenCot } from '../modal/ModalNhapSoLuongChenCot'
import { Images } from '../../const/Const_Images'
import { setActiveControl, setCotGocChenCot } from '../../reducer_action/BaseMapActionReducer'
import { Const_Libs } from '../../const/Const_Libs'
import useStateRef from 'react-usestateref'

export const enableFormChenCot = () => {
  $('.form-chen-cot-dropdown').removeClass('d-none').addClass('d-block')
}

export const disabledFormChenCot = () => {
  $('.form-chen-cot-dropdown').removeClass('d-block').addClass('d-none')
}

export const FormChenCot = () => {
  const dispatch = useDispatch()
  const state_sua_cot = useSelector(state => state.baseMap.state_sua_cot)
  const cot_goc_chen_cot = useSelector(state => state.baseMap.cot_goc_chen_cot)
  const [showDropdown, setShowDropdown] = useState(false)
  
  // Sử dụng ref để lưu giá trị cột gốc
  const [cot_goc_ref, set_cot_goc_ref, get_cot_goc_ref] = useStateRef(cot_goc_chen_cot)
  
  useEffect(() => {
    if (state_sua_cot && state_sua_cot.uuid_cot && state_sua_cot.uuid_folder) {
      // Lưu cột hiện tại vào ref khi nó có giá trị hợp lệ
      set_cot_goc_ref(state_sua_cot)
      console.log('Lưu cột gốc vào ref:', state_sua_cot)
    }
  }, [state_sua_cot, set_cot_goc_ref])

  const handleToggleDropdown = (e) => {
    e.stopPropagation()
    setShowDropdown(!showDropdown)
  }

  const handleManualInsert = (e) => {
    e.stopPropagation()
    
    const cotGocDeChen = get_cot_goc_ref.current
    
    console.log('Chọn chèn thủ công - cot_goc_ref:', cotGocDeChen)
    console.log('state_sua_cot:', state_sua_cot)
    console.log('cot_goc_chen_cot:', cot_goc_chen_cot)
    
    // Kiểm tra xem đã chọn cột chưa
    if (!cotGocDeChen || !cotGocDeChen.uuid_cot || !cotGocDeChen.uuid_folder) {
      console.error('Chưa chọn cột để chèn:', cotGocDeChen)
      Const_Libs.TOAST.error('Vui lòng chọn cột trước khi chèn')
      setShowDropdown(false)
      return
    }
    
    console.log('Chọn chèn thủ công với cột:', cotGocDeChen)
    
    // Lưu cột gốc vào state để dùng khi click trên map
    dispatch(setCotGocChenCot(cotGocDeChen))
    
    // Đặt trạng thái để click trên map thêm cột
    dispatch(setActiveControl('chen_cot_thu_cong'))
    setShowDropdown(false)
    // Gọi hàm xử lý click trên map để thêm cột
    // Cần implement logic tìm vị trí chèn trong danh sách
  }

  const handleAutoInsert = (e) => {
    e.stopPropagation()
    // Hiển thị popup chọn đầu/cuối và nhập số cột
    enableModalNhapSoLuongChenCot()
    setShowDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false)
    }
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDropdown])

  return (
    <div className='hs-unfold mr-2 position-relative'>
      <a
        data-attr='chen_cot'
        className='js-hs-unfold-invoker btn btn-icon btn-ghost-secondary rounded-circle active-control'
        onClick={handleToggleDropdown}
      >
        <img
          src={Images.IMG_CHEN_COT}
          className='avatar avatar-xs avatar-4by3'
          alt='Chèn cột'
          style={{ width: '25px', height: '25px' }}
        />
      </a>

      {/* Dropdown Menu */}
      {showDropdown && (
      <div 
        className='dropdown-menu show' 
        style={{ 
          display: 'block',
          position: 'absolute',
          top: '100%', 
          right: '0',
          left: 'auto',
          minWidth: '200px',
          zIndex: 9999,
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: '4px',
          padding: '4px 0',
          marginTop: '4px'
        }}
      >
        <a 
          className='dropdown-item pointer'
          onClick={handleAutoInsert}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          <i className='tio-number mr-2'></i>
          Chèn theo số cột
        </a>
        <a 
          className='dropdown-item pointer'
          onClick={handleManualInsert}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          <i className='tio-poi-outlined mr-2'></i>
          Chèn cột thủ công
        </a>
      </div>
      )}
    </div>
  )
}

