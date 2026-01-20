import useStateRef from 'react-usestateref' // see this line
import $ from 'jquery'
import { toast } from 'https://cdn.skypack.dev/wc-toast'
import { useDispatch, useSelector } from 'react-redux'

import {
  CHIEU_CAO_COT,
  LOAI_COT_CS,
  LOAI_COT_TM,
  VAT_TU_CS,
  VAT_TU_TM,
  CHUNG_LOAI_ODF,
  CHUNG_LOAI_SPILLTER,
  BE_CAP_TM,
  BE_CAP_CS,
  HIEN_TRANG,
  PHU_KIEN,
  TREO_NEO,
  U_D_J,
  G0_C1,
  CHUNG_LOAI_CAP,
  TREO_HAM,
  DE_U,
  DAI_AC
} from '../../const/Const_Infor'
import { setStateThemCot } from '../../reducer_action/BaseMapActionReducer'
import { useEffect } from 'react'
import { isBuffer } from 'util'

export const enableFormThemCot = () => {
  $('.form-them-cot')
    .removeClass('d-none')
    .addClass('d-block')
}
export const disabledFormThemCot = () => {
  $('.form-them-cot')
    .removeClass('d-block')
    .addClass('d-none')
}
export const FormThemCot = props => {
  const dispatch = useDispatch()
  const state_them_cot = useSelector(state => state.baseMap.state_them_cot)
  const [
    state_them_cot_ref,
    set_state_them_cot_ref,
    get_state_them_cot_ref
  ] = useStateRef(state_them_cot)
  const [cot_ref, set_cot_ref, get_cot_ref] = useStateRef({
    hien_trang_c: '',
    ma_loai_cot: '',
    chieu_cao: ''
  })
  const [vat_tu_ref, set_vat_tu_ref, get_vat_tu_ref] = useStateRef({
    hien_trang_vt: '',
    ma_vat_tu: '',
    chung_loai_odf: '',
    chung_loai_spillter: ''
  })
  const [phu_kien_ref, set_phu_kien_ref, get_phu_kien_ref] = useStateRef({
    ma_phu_kien: ''
  })
  const [be_cap_ref, set_be_cap_ref, get_be_cap_ref] = useStateRef({
    hien_trang_bc: '',
    ma_loai_be: ''
  })
  const [
    phu_kien_cap_ADSS_ref,
    set_phu_kien_cap_ADSS_ref,
    get_phu_kien_cap_ADSS_ref
  ] = useStateRef({
    treo_neo: '',
    U_D_J: '',
    G0_C1: '',
    chung_loai_ADSS: ''
  })
  const [
    phu_kien_cap_AC_ref,
    set_phu_kien_cap_AC_ref,
    get_phu_kien_cap_AC_ref
  ] = useStateRef({
    treo_ham: '',
    de_U: '',
    dai_AC: '',
    chung_loai_AC: ''
  })
  // HANDLE
  const handleChangeBeCap = e => {
    set_be_cap_ref({
      ...get_be_cap_ref.current,
      [e.target.name]: e.target.value
    })
    dispatch(
      setStateThemCot({
        ...get_state_them_cot_ref.current,
        be_cap: get_be_cap_ref.current
      })
    )
  }
  const handleChangeCot = e => {
    set_cot_ref({
      ...get_cot_ref.current,
      [e.target.name]: e.target.value
    })
    set_vat_tu_ref({
      ...get_vat_tu_ref.current,
      hien_trang_vt: get_cot_ref.current.hien_trang_c
    })
    dispatch(
      setStateThemCot({
        ...get_state_them_cot_ref.current,
        cot: get_cot_ref.current
      })
    )
  }
  const handleChangeVatTu = e => {
    set_vat_tu_ref({
      ...get_vat_tu_ref.current,
      [e.target.name]: e.target.value
    })
    dispatch(
      setStateThemCot({
        ...get_state_them_cot_ref.current,
        vat_tu: get_vat_tu_ref.current
      })
    )
  }
  const handleChangePhuKien = e => {
    set_phu_kien_ref({
      ...get_phu_kien_ref.current,
      [e.target.name]: e.target.value
    })
    dispatch(
      setStateThemCot({
        ...get_state_them_cot_ref.current,
        phu_kien: get_phu_kien_ref.current
      })
    )
  }

  const handleChangeCurrentCot = e => {
    /**
     * Bắt các giá trị bị thay đổi trong thẻ input của cột hiện tại đang được hiển thị
     *
     * @param No
     * @author XHieu
     */

    // Allow normal case input for column name
    // if (e.target.name == 'name') {
    //   e.target.value = e.target.value.toString().toUpperCase()
    // }
    if (
      e.target.name == 'check_ly_trinh' ||
      e.target.name == 'x2_phu_kien_cot' ||
      e.target.name == 'dat_bien_bao'
    ) {
      e.target.value = JSON.parse(e.target.value) == true ? false : true
    }

    set_state_them_cot_ref({
      ...get_state_them_cot_ref.current,
      [e.target.name]: e.target.value
    })

    dispatch(
      setStateThemCot({
        ...get_state_them_cot_ref.current,
        [e.target.name]: e.target.value
      })
    )
  }
  const handleChangePhuKienADSS = e => {
    set_phu_kien_cap_ADSS_ref({
      ...get_phu_kien_cap_ADSS_ref.current,
      [e.target.name]: e.target.value
    })
    dispatch(
      setStateThemCot({
        ...get_state_them_cot_ref.current,
        phu_kien_cap_ADSS: get_phu_kien_cap_ADSS_ref.current
      })
    )
  }
  const handleChangePhuKienAC = e => {
    set_phu_kien_cap_AC_ref({
      ...get_phu_kien_cap_AC_ref.current,
      [e.target.name]: e.target.value
    })
    dispatch(
      setStateThemCot({
        ...get_state_them_cot_ref.current,
        phu_kien_cap_AC: get_phu_kien_cap_AC_ref.current
      })
    )
  }
  // END HANDLE
  // CLEAR
  const clearCot = () => {
    set_cot_ref({
      hien_trang_c: '',
      ma_loai_cot: '',
      chieu_cao: ''
    })
  }
  const clearVatTu = () => {
    set_vat_tu_ref({
      hien_trang_vt: '',
      ma_vat_tu: '',
      chung_loai_odf: '',
      chung_loai_spillter: ''
    })
  }
  const clearBeCap = () => {
    set_be_cap_ref({
      hien_trang_bc: '',
      ma_loai_be: ''
    })
  }
  const clearPhuKien = () => {
    set_phu_kien_ref({
      ma_phu_kien: ''
    })
  }
  const clearPhuKienADSS = () => {
    set_phu_kien_cap_ADSS_ref({
      treo_neo: '',
      U_D_J: '',
      G0_C1: '',
      chung_loai_ADSS: ''
    })
    dispatch(
      setStateThemCot({
        ...get_state_them_cot_ref.current,
        phu_kien_cap_ADSS: get_phu_kien_cap_ADSS_ref.current
      })
    )
  }
  const clearPhuKienAC = () => {
    set_phu_kien_cap_AC_ref({
      treo_ham: '',
      de_U: '',
      dai_AC: '',
      chung_loai_AC: ''
    })
    dispatch(
      setStateThemCot({
        ...get_state_them_cot_ref.current,
        phu_kien_cap_AC: get_phu_kien_cap_AC_ref.current
      })
    )
  }
  // END CLEAR
  // HTML
  const htmlLoaiCot = () => {
    if (get_cot_ref.current.hien_trang_c == 'tm') {
      return (
        <select
          class='form-control fs-3'
          value={
            get_cot_ref.current.ma_loai_cot != null
              ? get_cot_ref.current.ma_loai_cot
              : ''
          }
          name='ma_loai_cot'
          onChange={handleChangeCot}
        >
          {LOAI_COT_TM.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            )
          })}
        </select>
      )
    }
    return (
      <select
        class='form-control fs-3'
        value={
          get_cot_ref.current.ma_loai_cot != null
            ? get_cot_ref.current.ma_loai_cot
            : ''
        }
        name='ma_loai_cot'
        onChange={handleChangeCot}
      >
        {LOAI_COT_CS.map((item, index) => {
          return (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </select>
    )
  }
  const htmlVatTu = () => {
    if (get_vat_tu_ref.current.hien_trang_vt == 'tm') {
      return (
        <select
          class='form-control fs-3'
          value={
            get_vat_tu_ref.current.ma_vat_tu != null
              ? get_vat_tu_ref.current.ma_vat_tu
              : 'tm'
          }
          name='ma_vat_tu'
          onChange={handleChangeVatTu}
        >
          {VAT_TU_TM.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            )
          })}
        </select>
      )
    }
    return (
      <select
        class='form-control fs-3'
        value={
          get_vat_tu_ref.current.ma_vat_tu != null
            ? get_vat_tu_ref.current.ma_vat_tu
            : ''
        }
        name='ma_vat_tu'
        onChange={handleChangeVatTu}
      >
        {VAT_TU_CS.map((item, index) => {
          return (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </select>
    )
  }
  const htmlBeCap = () => {
    if (get_be_cap_ref.current.hien_trang_bc == 'tm') {
      return (
        <select
          class='form-control fs-3'
          value={
            get_be_cap_ref.current.ma_loai_be != null
              ? get_be_cap_ref.current.ma_loai_be
              : ''
          }
          name='ma_loai_be'
          onChange={handleChangeBeCap}
        >
          {BE_CAP_TM.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            )
          })}
        </select>
      )
    }
    return (
      <select
        class='form-control fs-3'
        value={
          get_be_cap_ref.current.ma_loai_be != null
            ? get_be_cap_ref.current.ma_loai_be
            : ''
        }
        name='ma_loai_be'
        onChange={handleChangeBeCap}
      >
        {BE_CAP_CS.map((item, index) => {
          return (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </select>
    )
  }
  useEffect(() => {
    set_state_them_cot_ref(state_them_cot)
    set_cot_ref(state_them_cot.cot)
    set_vat_tu_ref(state_them_cot.vat_tu)
    set_phu_kien_ref(state_them_cot.phu_kien)
    set_be_cap_ref(state_them_cot.be_cap)
    set_phu_kien_cap_AC_ref(state_them_cot.phu_kien_cap_AC)
    set_phu_kien_cap_ADSS_ref(state_them_cot.phu_kien_cap_ADSS)
  }, [state_them_cot])
  // End HTML
  return (
    <aside className='js-navbar-vertical-aside form-them-cot d-none form-rj navbar navbar-vertical-aside navbar-vertical navbar-vertical-right navbar-expand-xl navbar-bordered navbar-vertical-aside-initialized'>
      <div className='navbar-vertical-container '>
        <div className='navbar-vertical-footer-offset position-relative h-100'>
          <button
            type='button'
            onClick={() => {
              disabledFormThemCot()
            }}
            style={{ right: '5px', top: '10px', zIndex: '103' }}
            className='btn btn-icon btn-sm btn-ghost-secondary  position-absolute'
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
                  Thông tin cột
                </a>
              </div>
            </div>
          </div>
          {/* body */}
          <div className='navbar-vertical-content pt-2'>
            {/* Input */}
            <div className='row p-0 mr-0 ml-0 mb-2  form-group'>
              <label
                htmlFor='emailLabel'
                className='col-sm-6 text-nowrap text-left fs-4 col-form-label input-label'
              >
                Tên cột
              </label>
              <div className='col-sm-6'>
                <input
                  type='email'
                  id='tenCot'
                  className='form-control fs-5'
                  name='name'
                  required
                  value={
                    get_state_them_cot_ref.current.name != null
                      ? get_state_them_cot_ref.current.name
                      : ''
                  }
                  onChange={handleChangeCurrentCot}
                  placeholder='Tên cột'
                />
              </div>
            </div>
            <div className='row p-0 mr-0 ml-0 mb-2  form-group '>
              <label
                htmlFor='emailLabel'
                className='col-sm-6 text-nowrap  text-left fs-4 col-form-label input-label'
              >
                Địa điểm
              </label>
              <div className='col-sm-6'>
                <input
                  type='text'
                  className='form-control fs-5'
                  name='dia_diem'
                  value={
                    get_state_them_cot_ref.current.dia_diem != null
                      ? get_state_them_cot_ref.current.dia_diem
                      : ''
                  }
                  onChange={handleChangeCurrentCot}
                  placeholder='Địa điểm'
                />
              </div>
            </div>
            <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
              <label
                htmlFor='emailLabel'
                className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
              >
                Kinh độ
              </label>
              <div className='col-sm-6'>
                <input
                  type='text'
                  className='form-control fs-5'
                  name='longtitude'
                  disabled
                  placeholder='Kinh độ'
                  value={
                    get_state_them_cot_ref.current.coor != null
                      ? get_state_them_cot_ref.current.coor[0]
                      : ''
                  }
                />
              </div>
            </div>
            <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
              <label
                htmlFor='emailLabel'
                className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
              >
                Vỹ độ
              </label>
              <div className='col-sm-6'>
                <input
                  type='text'
                  className='form-control fs-5'
                  name='latitude'
                  disabled
                  placeholder='Vỹ độ'
                  value={
                    get_state_them_cot_ref.current.coor != null
                      ? get_state_them_cot_ref.current.coor[1]
                      : ''
                  }
                />
              </div>
            </div>
            <div className='row p-0 mr-0 ml-0 mb-2 form-group d-flex no-wrap'>
              <label
                htmlFor='emailLabel'
                className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
              >
                View lý trình
              </label>
              <div className='col-sm-6 d-flex align-items-center'>
                <label className='toggle-switch' htmlFor='check_ly_trinh'>
                  <input
                    id='check_ly_trinh'
                    onChange={handleChangeCurrentCot}
                    name='check_ly_trinh'
                    type='checkbox'
                    className='toggle-switch-input'
                    placeholder='View lý trình'
                    value={
                      get_state_them_cot_ref.current.check_ly_trinh != null
                        ? JSON.parse(
                            get_state_them_cot_ref.current.check_ly_trinh
                          )
                        : false
                    }
                    checked={JSON.parse(
                      get_state_them_cot_ref.current.check_ly_trinh
                    )}
                  />
                  <span className='toggle-switch-label'>
                    <span className='toggle-switch-indicator' />
                  </span>
                </label>
              </div>
            </div>
            <div
              className={`row p-0 mr-0 ml-0 mb-2 form-group ${
                JSON.parse(get_state_them_cot_ref.current.check_ly_trinh) ==
                false
                  ? 'd-none'
                  : ''
              }`}
            >
              <label
                htmlFor='emailLabel'
                className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
              >
                Lý trình
              </label>

              <div className='col-sm-6'>
                <input
                  type='text'
                  className='form-control fs-5'
                  name='ly_trinh'
                  value={
                    get_state_them_cot_ref.current.ly_trinh != null
                      ? get_state_them_cot_ref.current.ly_trinh
                      : ''
                  }
                  onChange={handleChangeCurrentCot}
                  placeholder='Lý trình'
                />
              </div>
            </div>
            <div className='row p-0 mr-0 ml-0 mb-2 form-group  d-flex no-wrap'>
              <label
                htmlFor='emailLabel'
                className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
              >
                X2 phụ kiện cột
              </label>
              <div className='col-sm-6 d-flex align-items-center'>
                <label className='toggle-switch' htmlFor='x2_pk_cot'>
                  <input
                    id='x2_pk_cot'
                    onChange={handleChangeCurrentCot}
                    name='x2_phu_kien_cot'
                    type='checkbox'
                    className='toggle-switch-input'
                    placeholder='X2 phụ kiện cột'
                    value={
                      get_state_them_cot_ref.current.x2_phu_kien_cot != null
                        ? JSON.parse(
                            get_state_them_cot_ref.current.x2_phu_kien_cot
                          )
                        : false
                    }
                    checked={JSON.parse(
                      get_state_them_cot_ref.current.x2_phu_kien_cot
                    )}
                  />
                  <span className='toggle-switch-label'>
                    <span className='toggle-switch-indicator' />
                  </span>
                </label>
              </div>
            </div>
            <div className='row p-0 mr-0 ml-0 mb-2 form-group  d-flex no-wrap'>
              <label
                htmlFor='emailLabel'
                className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
              >
                Đặt biển báo
              </label>
              <div className='col-sm-6 d-flex align-items-center'>
                <label className='toggle-switch' htmlFor='dat_bien_bao'>
                  <input
                    id='dat_bien_bao'
                    onChange={handleChangeCurrentCot}
                    name='dat_bien_bao'
                    type='checkbox'
                    className='toggle-switch-input'
                    placeholder='Đặt biển báo'
                    value={
                      get_state_them_cot_ref.current.dat_bien_bao != null
                        ? JSON.parse(
                            get_state_them_cot_ref.current.dat_bien_bao
                          )
                        : false
                    }
                    checked={JSON.parse(
                      get_state_them_cot_ref.current.dat_bien_bao
                    )}
                  />
                  <span className='toggle-switch-label'>
                    <span className='toggle-switch-indicator' />
                  </span>
                </label>
              </div>
            </div>
            <div className='accordion' id='accordionExample'>
              <div className='card' id='heading2'>
                <div className='d-flex'>
                  <div className='card-header card-btn btn-block fs-3 bold collapsed'>
                    <div className='d-flex align-items-center  justify-content-between w-100'>
                      <span className='mr-4 fs-3'>Cột</span>
                      <button
                        type='button'
                        class='btn btn-outline-primary pt-1 pb-1 pr-2 pl-2 mr-2'
                        onClick={() => {
                          clearCot()
                        }}
                      >
                        <i className='tio-autorenew tio-lg mr-1' />
                        Clear
                      </button>
                    </div>
                    <div
                      className='card-btn-toggle btn-ghost-secondary rounded-circle d-flex align-items-center justify-content-center'
                      data-toggle='collapse'
                      data-target='#collapse2'
                      aria-expanded='false'
                      aria-controls='collapse2'
                      style={{ width: '35px', height: '35px' }}
                    >
                      <span className='card-btn-toggle-default '>
                        <i className='tio-add' />
                      </span>
                      <span className='card-btn-toggle-active'>
                        <i className='tio-remove' />
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  id='collapse2'
                  className='collapse'
                  aria-labelledby='heading2'
                  data-parent='#accordionExample'
                >
                  <div className='card-body'>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Hiện trạng
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_cot_ref.current.hien_trang_c != null
                              ? get_cot_ref.current.hien_trang_c
                              : ''
                          }
                          name='hien_trang_c'
                          onChange={handleChangeCot}
                        >
                          {HIEN_TRANG.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Loại cột
                      </label>
                      <div className='col-sm-6'>{htmlLoaiCot()}</div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Chiều cao
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_cot_ref.current.chieu_cao != null
                              ? get_cot_ref.current.chieu_cao
                              : ''
                          }
                          name='chieu_cao'
                          onChange={handleChangeCot}
                        >
                          {CHIEU_CAO_COT.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card' id='heading3'>
                <div className='d-flex'>
                  <div className='card-header card-btn btn-block fs-3 bold collapsed'>
                    <div className='d-flex align-items-center justify-content-between w-100'>
                      <span className='mr-4 fs-3'>Vật tư</span>
                      <button
                        type='button'
                        class='btn btn-outline-primary pt-1 pb-1 pr-2 pl-2 mr-2'
                        onClick={() => {
                          clearVatTu()
                        }}
                      >
                        <i className='tio-autorenew tio-lg mr-1' />
                        Clear
                      </button>
                    </div>
                    <div
                      className='card-btn-toggle btn-ghost-secondary rounded-circle d-flex align-items-center justify-content-center'
                      data-toggle='collapse'
                      data-target='#collapse3'
                      aria-expanded='false'
                      aria-controls='collapse3'
                      style={{ width: '35px', height: '35px' }}
                    >
                      <span className='card-btn-toggle-default '>
                        <i className='tio-add' />
                      </span>
                      <span className='card-btn-toggle-active'>
                        <i className='tio-remove' />
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id='collapse3'
                  className='collapse '
                  aria-labelledby='heading3'
                  data-parent='#accordionExample'
                >
                  <div className='card-body'>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Hiện trạng
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_vat_tu_ref.current.hien_trang_vt != null
                              ? get_vat_tu_ref.current.hien_trang_vt
                              : ''
                          }
                          name='hien_trang_vt'
                          onChange={handleChangeVatTu}
                        >
                          {HIEN_TRANG.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Vật tư
                      </label>
                      <div className='col-sm-6'>{htmlVatTu()}</div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Chủng loại odf
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_vat_tu_ref.current.chung_loai_odf != null
                              ? get_vat_tu_ref.current.chung_loai_odf
                              : ''
                          }
                          name='chung_loai_odf'
                          onChange={handleChangeVatTu}
                        >
                          {CHUNG_LOAI_ODF.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Chủng loại spillter
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_vat_tu_ref.current.chung_loai_spillter != null
                              ? get_vat_tu_ref.current.chung_loai_spillter
                              : ''
                          }
                          name='chung_loai_spillter'
                          onChange={handleChangeVatTu}
                        >
                          {CHUNG_LOAI_SPILLTER.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card' id='heading4'>
                <div className='d-flex'>
                  <div className='card-header card-btn btn-block fs-3 bold collapsed'>
                    <div className='d-flex align-items-center justify-content-between w-100'>
                      <span className='mr-4 fs-3'>Bể cáp</span>
                      <button
                        type='button'
                        class='btn btn-outline-primary pt-1 pb-1 pr-2 pl-2 mr-2'
                        onClick={() => {
                          clearBeCap()
                        }}
                      >
                        <i className='tio-autorenew tio-lg mr-1' />
                        Clear
                      </button>
                    </div>
                    <div
                      className='card-btn-toggle btn-ghost-secondary rounded-circle d-flex align-items-center justify-content-center'
                      data-toggle='collapse'
                      data-target='#collapse4'
                      aria-expanded='false'
                      aria-controls='collapse4'
                      style={{ width: '35px', height: '35px' }}
                    >
                      <span className='card-btn-toggle-default '>
                        <i className='tio-add' />
                      </span>
                      <span className='card-btn-toggle-active'>
                        <i className='tio-remove' />
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id='collapse4'
                  className='collapse '
                  aria-labelledby='heading4'
                  data-parent='#accordionExample'
                >
                  <div className='card-body'>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Hiện trạng
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_be_cap_ref.current.hien_trang_bc != null
                              ? get_be_cap_ref.current.hien_trang_bc
                              : 'tm'
                          }
                          name='hien_trang_bc'
                          onChange={handleChangeBeCap}
                        >
                          {HIEN_TRANG.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>

                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Loại bể
                      </label>
                      <div className='col-sm-6'>{htmlBeCap()}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card' id='heading5'>
                <div className='d-flex'>
                  <div className='card-header card-btn btn-block fs-3 bold collapsed'>
                    <div className='d-flex align-items-center justify-content-between w-100'>
                      <span className='mr-4 fs-3'>Phụ kiện</span>
                      <button
                        type='button'
                        class='btn btn-outline-primary pt-1 pb-1 pr-2 pl-2 mr-2'
                        onClick={() => {
                          clearPhuKien()
                        }}
                      >
                        <i className='tio-autorenew tio-lg mr-1' />
                        Clear
                      </button>
                    </div>
                    <div
                      className='card-btn-toggle btn-ghost-secondary rounded-circle d-flex align-items-center justify-content-center'
                      data-toggle='collapse'
                      data-target='#collapse5'
                      aria-expanded='false'
                      aria-controls='collapse5'
                      style={{ width: '35px', height: '35px' }}
                    >
                      <span className='card-btn-toggle-default '>
                        <i className='tio-add' />
                      </span>
                      <span className='card-btn-toggle-active'>
                        <i className='tio-remove' />
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id='collapse5'
                  className='collapse '
                  aria-labelledby='heading5'
                  data-parent='#accordionExample'
                >
                  <div className='card-body'>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Phụ kiện
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_phu_kien_ref.current.ma_phu_kien != null
                              ? get_phu_kien_ref.current.ma_phu_kien
                              : ''
                          }
                          name='ma_phu_kien'
                          onChange={handleChangePhuKien}
                        >
                          {PHU_KIEN.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card' id='heading6'>
                <div className='d-flex'>
                  <div className='card-header card-btn btn-block fs-3 bold collapsed'>
                    <div className='d-flex align-items-center  justify-content-between w-100'>
                      <span className='mr-4 fs-3'>Phụ kiện cáp ADSS</span>
                      <button
                        type='button'
                        class='btn btn-outline-primary pt-1 pb-1 pr-2 pl-2 mr-2'
                        onClick={clearPhuKienADSS}
                      >
                        <i className='tio-autorenew tio-lg mr-1' />
                        Clear
                      </button>
                    </div>
                    <div
                      className='card-btn-toggle btn-ghost-secondary rounded-circle d-flex align-items-center justify-content-center'
                      data-toggle='collapse'
                      data-target='#collapse6'
                      aria-expanded='false'
                      aria-controls='collapse6'
                      style={{ width: '35px', height: '35px' }}
                    >
                      <span className='card-btn-toggle-default '>
                        <i className='tio-add' />
                      </span>
                      <span className='card-btn-toggle-active'>
                        <i className='tio-remove' />
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id='collapse6'
                  className='collapse '
                  aria-labelledby='heading6'
                  data-parent='#accordionExample'
                >
                  <div className='card-body'>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Treo néo
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_phu_kien_cap_ADSS_ref.current.treo_neo != null
                              ? get_phu_kien_cap_ADSS_ref.current.treo_neo
                              : ''
                          }
                          name='treo_neo'
                          onChange={handleChangePhuKienADSS}
                        >
                          {TREO_NEO.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        U/D/J
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_phu_kien_cap_ADSS_ref.current.U_D_J != null
                              ? get_phu_kien_cap_ADSS_ref.current.U_D_J
                              : ''
                          }
                          name='U_D_J'
                          onChange={handleChangePhuKienADSS}
                        >
                          {U_D_J.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        G0/C1
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_phu_kien_cap_ADSS_ref.current.G0_C1 != null
                              ? get_phu_kien_cap_ADSS_ref.current.G0_C1
                              : ''
                          }
                          name='G0_C1'
                          onChange={handleChangePhuKienADSS}
                        >
                          {G0_C1.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Chủng loại
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_phu_kien_cap_ADSS_ref.current.chung_loai_ADSS !=
                            null
                              ? get_phu_kien_cap_ADSS_ref.current
                                  .chung_loai_ADSS
                              : ''
                          }
                          name='chung_loai_ADSS'
                          onChange={handleChangePhuKienADSS}
                        >
                          {CHUNG_LOAI_CAP.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card' id='heading7'>
                <div className='d-flex'>
                  <div className='card-header card-btn btn-block fs-3 bold collapsed'>
                    <div className='d-flex align-items-center  justify-content-between w-100'>
                      <span className='mr-4 fs-3'>Phụ kiện cáp AC</span>
                      <button
                        type='button'
                        class='btn btn-outline-primary pt-1 pb-1 pr-2 pl-2 mr-2'
                        onClick={clearPhuKienAC}
                      >
                        <i className='tio-autorenew tio-lg mr-1' />
                        Clear
                      </button>
                    </div>
                    <div
                      className='card-btn-toggle btn-ghost-secondary rounded-circle d-flex align-items-center justify-content-center'
                      data-toggle='collapse'
                      data-target='#collapse7'
                      aria-expanded='false'
                      aria-controls='collapse7'
                      style={{ width: '35px', height: '35px' }}
                    >
                      <span className='card-btn-toggle-default '>
                        <i className='tio-add' />
                      </span>
                      <span className='card-btn-toggle-active'>
                        <i className='tio-remove' />
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id='collapse7'
                  className='collapse '
                  aria-labelledby='heading7'
                  data-parent='#accordionExample'
                >
                  <div className='card-body'>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Treo hãm
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_phu_kien_cap_AC_ref.current.treo_ham != null
                              ? get_phu_kien_cap_AC_ref.current.treo_ham
                              : ''
                          }
                          name='treo_ham'
                          onChange={handleChangePhuKienAC}
                        >
                          {TREO_HAM.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Đế U
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_phu_kien_cap_AC_ref.current.de_U != null
                              ? get_phu_kien_cap_AC_ref.current.de_U
                              : ''
                          }
                          name='de_U'
                          onChange={handleChangePhuKienAC}
                        >
                          {DE_U.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Đai
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_phu_kien_cap_AC_ref.current.dai_AC != null
                              ? get_phu_kien_cap_AC_ref.current.dai_AC
                              : ''
                          }
                          name='dai_AC'
                          onChange={handleChangePhuKienAC}
                        >
                          {DAI_AC.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='row p-0 mr-0 ml-0 mb-2 form-group '>
                      <label
                        htmlFor='emailLabel'
                        className='col-sm-6 text-left text-nowrap fs-4 col-form-label input-label'
                      >
                        Chủng loại
                      </label>
                      <div className='col-sm-6'>
                        <select
                          class='form-control fs-3'
                          value={
                            get_phu_kien_cap_AC_ref.current.chung_loai_AC !=
                            null
                              ? get_phu_kien_cap_AC_ref.current.chung_loai_AC
                              : ''
                          }
                          name='chung_loai_AC'
                          onChange={handleChangePhuKienAC}
                        >
                          {CHUNG_LOAI_CAP.map((item, index) => {
                            return (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Input */}
          </div>
          {/* END body */}
        </div>
      </div>
    </aside>
  )
}
