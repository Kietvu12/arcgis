import React, { useEffect } from 'react'
import $ from 'jquery'

import {
  changeRootFolder,
  changeTypeMap,
  setCurrentUUidFolder
} from '../../reducer_action/BaseMapActionReducer'
import { useDispatch, useSelector } from 'react-redux'
import { create_UUID, debounce, throttle, getItemSessionStorage } from '../../base/base'
import {
  getToaDoDuong,
  reRenderViewMap,
  setCenterMap,
  setZoomMap
} from '../../map/RootFunction'
import { Images, IMAGES_COT_POTECO } from '../../const/Const_Images'
import { RootFolder } from '../aside_menu_element/RootFolder'

export const getHtmlMenuDuongCot = list_root_folder => {
  return (
    <div id='menu_folder_kml'>
      {list_root_folder.map((item_root, index) => {
        return (
          <RootFolder
            key={index}
            data_root_folder={item_root}
            style={{}}
            check_nen={false}
          ></RootFolder>
        )
      })}
    </div>
  )
}
export const getHtmlMenuNen = list_root_nen => {
  return (
    <div
      id='menu_folder_nen'
      style={{ color: '#0052ea' }}
      title='Đây là nền bản đồ'
    >
      {list_root_nen.map((item_root, index) => {
        return (
          <RootFolder
            key={index}
            data_root_folder={item_root}
            style={{ color: '#0052ea' }}
            check_nen={true}
          ></RootFolder>
        )
      })}
    </div>
  )
}
export const getObjectFromKML = (
  path_folder,
  xml,
  list_group_duong_cot,
  uuid_folder = null
) => {
  /**
   * GET ra các đối tượng đường và cột từ dữ liệu kml đọc được
   *
   * @param path_folder: Đường dẫn của thư mục hiện tại
   * @param xml: Data đọc được từ file kml
   * @param list_group_duong_cot: mảng đường và cột, mặc định []
   * @author XHieu
   */
  let folder = '> Folder'
  let placemark = '> Placemark'
  path_folder += folder

  if ($(xml).find(path_folder + folder).length > 0) {
    $(xml)
      .find(path_folder + folder)
      .each(function () {
        let root_folder = {
          folder_name: $(this).find('> name').text().trim(),
          active_folder: true,
          uuid_folder: uuid_folder == null ? create_UUID() : uuid_folder,
          list_group_duong_va_cot: [],
          list_cot_2: []
        }
        list_group_duong_cot.push(root_folder)
        return getObjectFromKML(
          path_folder,
          $(this),
          list_group_duong_cot[list_group_duong_cot.length - 1]
            .list_group_duong_va_cot,
          root_folder.uuid_folder
        )
      })
  }

  if (
    $(xml)
      .find(path_folder + '>name')
      .text()
      .trim()
      .substring(0, 2)
      .includes('T_')
  ) {
    console.log(
      $(xml)
        .find(path_folder + '>name')
        .text()
        .trim()
        .substring(0, 2)
    )
    $(xml)
      .find(path_folder + placemark)
      .each(function () {
        if (
          $(this).find('name').text().trim().toLowerCase() == 'đo đường' &&
          $(this).find('coorTrack').text().trim() == ''
        ) {
          let group_duong = {
            uuid_duong: create_UUID(),
            list_do_duong: [], // danh sách tọa độ của đường
            active_do_duong: true,
            type: 'duong',
            name: 'Đo đường'
          }
          getCoorDoDuong($(this), group_duong.list_do_duong)
          group_duong.list_do_duong = getToaDoDuong(group_duong.list_do_duong)
          list_group_duong_cot.push(group_duong)
        } else if (
          $(this).find('name').text().trim().toLowerCase() != 'đo đường' &&
          $(this).find('coorTrack').text().trim() != ''
        ) {
          let duong_track = {
            uuid_duong: create_UUID(),
            list_do_duong: [], // danh sách tọa độ của đường
            active_do_duong: true,
            type: 'track',
            name: $(this).find('name').text().trim()
          }
          let list = []
          $(this).find('coorTrack').each((index,item) => {
            list.push([
              item.textContent.trim().split(" ")[0],
              item.textContent.trim().split(" ")[1]
            ])
          });
          duong_track.list_do_duong = [list]
          list_group_duong_cot.push(duong_track)
        } else {
          let cot = getCoorCot($(this), uuid_folder)
          if (cot != null) {
            list_group_duong_cot.push(cot)
          }
        }
      })
  }
}
export const getLineTrack = (xml, arr) => {
  /**
   * Lọc các tọa độ của đo đương
   *
   * @param No
   * @author XHieu
   */
  arr.push(xml.find('LineString > coordinates').text())
}
export const getCoorDoDuong = (xml, arr) => {
  /**
   * Lọc các tọa độ của đo đương
   *
   * @param No
   * @author XHieu
   */
  arr.push(xml.find('LineString > coordinates').text())
}
export const getCoorCot = (xml, uuid_folder) => {
  /**
   * Lọc các tọa độ của cột
   *
   * @param No
   * @author XHieu
   */

  let text = xml.find('Point > coordinates').text().trim()
  console.log('=== getCoorCot DEBUG ===')
  console.log('Point coordinates text:', text)
  
  if (
    text.split(',')[0] != '' &&
    text.split(',')[0] != null &&
    text.split(',')[1] != '' &&
    text.split(',')[1] != null
  ) {
    let cot = {
      uuid_cot: create_UUID(),
      name: xml.find('name').text().trim(),
      coor: [parseFloat(text.split(',')[0]), parseFloat(text.split(',')[1])],
      active_cot: true,
      uuid_folder: uuid_folder,
      type: 'cot',
      icon_type: xml.find('styleUrl').text().trim(),
      dia_diem:
        xml.find('diachi') == null ? false : xml.find('diachi').text().trim(),
      src_icon:
        xml.find('LoaiCot > chungloai').text().trim() == ''
          ? Images.IMG_PUSHPIN
          : IMAGES_COT_POTECO.filter(
              item =>
                item.ma_cot == xml.find('LoaiCot > chungloai').text().trim()
            )[0].src,
      check_ly_trinh:
        xml.find('lytrinh').text().trim() == ''
          ? false
          : xml.find('lytrinh').text().trim(),
      ly_trinh:
        xml.find('lytrinh') == null ? '' : xml.find('lytrinh').text().trim(),
      x2_phu_kien_cot:
        xml.find('nhandoiphukien').text().trim() == ''
          ? false
          : xml.find('nhandoiphukien').text().trim(),
      dat_bien_bao:
        xml.find('bienbao').text().trim() == ''
          ? false
          : xml.find('bienbao').text().trim(),
      be_cap: {
        ten:
          xml.find('BeCap') == null
            ? ''
            : xml.find('BeCap > ten').text().trim(),
        hien_trang_bc:
          xml.find('BeCap') == null
            ? ''
            : xml.find('BeCap > hientrang').text().trim(),
        ma_loai_be:
          xml.find('BeCap') == null
            ? ''
            : xml
                .find('BeCap > ten') // đã bị thay đổi thành tên -> k đc sửa cái này
                .text()
                .trim()
      },
      cot: {
        hien_trang_c:
          xml.find('LoaiCot') == null
            ? ''
            : xml.find('LoaiCot > hientrangcot').text().trim(),
        ma_loai_cot:
          xml.find('LoaiCot') == null
            ? ''
            : xml.find('LoaiCot > chungloai').text().trim(),
        chieu_cao:
          xml.find('LoaiCot') == null
            ? ''
            : xml.find('LoaiCot > chieucaocot').text().trim()
      },
      vat_tu: {
        hien_trang_vt:
          xml.find('VatTu') == null
            ? ''
            : xml.find('VatTu > hientrangvattu').text().trim(),
        ma_vat_tu:
          xml.find('VatTu') == null
            ? ''
            : xml.find('VatTu > ten').text().trim(),
        chung_loai_odf:
          xml.find('VatTu') == null
            ? ''
            : xml.find('VatTu > chungloai2').text().trim(),
        chung_loai_spillter:
          xml.find('VatTu') == null
            ? ''
            : xml.find('VatTu > chungloai1').text().trim()
      },
      phu_kien: {
        ma_phu_kien:
          xml.find('PhuKien') == null
            ? ''
            : xml.find('PhuKien > ten').text().trim()
      },
      phu_kien_cap_ADSS: {
        treo_neo:
          xml.find('ADSS') == null
            ? ''
            : xml.find('ADSS > TreoNeo').text().trim(),
        U_D_J:
          xml.find('ADSS') == null ? '' : xml.find('ADSS > UDJ').text().trim(),
        G0_C1:
          xml.find('ADSS') == null ? '' : xml.find('ADSS > Gong').text().trim(),
        chung_loai_ADSS:
          xml.find('ADSS') == null
            ? ''
            : xml.find('ADSS > ChungLoai').text().trim()
      },
      phu_kien_cap_AC: {
        treo_ham:
          xml.find('AC') == null ? '' : xml.find('AC > TreoHam').text().trim(),
        de_U: xml.find('AC') == null ? '' : xml.find('AC > UD').text().trim(),
        dai_AC:
          xml.find('AC') == null ? '' : xml.find('AC > DAI').text().trim(),
        chung_loai_AC:
          xml.find('AC') == null ? '' : xml.find('AC > ChungLoai').text().trim()
      }
    }
    debounce(setZoomMap(12), 100)
    debounce(
      setCenterMap([text.split(',')[0], text.trim().split(',')[1]], 14),
      500
    )
    console.log('Created cot object:', cot)
    console.log('=== END getCoorCot DEBUG ===')
    return cot
  }
  console.log('Invalid coordinates, returning null')
  console.log('=== END getCoorCot DEBUG ===')
  return null
}
export default function Aside () {
  const dispatch = useDispatch()
  const list_root_folder = useSelector(state => state.baseMap.list_root_folder)
  const list_root_nen = useSelector(state => state.baseMap.list_root_nen)
  const previous_list_root_folder = useSelector(state => state.baseMap.previous_list_root_folder)

  const type_Map_List = useSelector(state => state.typeMapList)
  const state_them_cot = useSelector(state => state.baseMap.state_them_cot)

  // FUNC HANDLE
  const mainEffect = () => {
    /**
     * Gọi tất cả hiệu ứng chính sử dụng trong Aside
     *
     * @param No
     * @author XHieu
     */
    $('.close-aside-menu').click(function () {
      $('.aside-menu').toggleClass('show-aside')
    })
    $('.js-navbar-vertical-aside-toggle-invoker').click(() => {
      $('.navbar-vertical-aside').toggleClass(
        'navbar-vertical-aside-initialized'
      )
    })
    document.querySelectorAll('.drop-zone__input').forEach(inputElement => {
      const dropZoneElement = inputElement.closest('.drop-zone')

      dropZoneElement.addEventListener('click', e => {
        inputElement.click()
      })

      inputElement.addEventListener('change', e => {
        if (inputElement.files.length) {
          handleKml(dropZoneElement, inputElement.files[0], e)
        }
      })

      dropZoneElement.addEventListener('dragover', e => {
        e.preventDefault()
        dropZoneElement.classList.add('drop-zone--over')
      })
      ;['dragleave', 'dragend'].forEach(type => {
        dropZoneElement.addEventListener(type, e => {
          dropZoneElement.classList.remove('drop-zone--over')
        })
      })

      dropZoneElement.addEventListener('drop', e => {
        e.preventDefault()

        if (e.dataTransfer.files.length) {
          inputElement.files = e.dataTransfer.files
          handleKml(dropZoneElement, e.dataTransfer.files[0])
          e.dataTransfer.files[0] = ''
        }

        dropZoneElement.classList.remove('drop-zone--over')
      })
    })
    $('.closeModel').click(function () {
      $(this).parent().parent().parent().parent().removeClass('d-block')
      $(this).parent().parent().parent().parent().addClass('fade')
    })
    $('#importFileKml').click(function () {
      $('#updatePlanModal').addClass('d-block')
      $('#updatePlanModal').removeClass('fade')
    })
    $('#showModalChangeTypeMap').click(function () {
      $('#modelChangeTypeMap').addClass('d-block')
      $('#modelChangeTypeMap').removeClass('fade')
    })
  }
  const handleKml = (dropZoneElement, file, event) => {
    /**
     * Xử lý khi click hoặc kéo thả vào vùng kéo thả file
     * Sẽ lấy dữ liệu từ file KML đọc vào để xử lý hiển thị ra thông tin
     * @param No
     * @author XHieu
     */
    let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb')

    // First time - remove the prompt
    if (dropZoneElement.querySelector('.drop-zone__prompt')) {
      dropZoneElement.querySelector('.drop-zone__prompt').remove()
    }

    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
      thumbnailElement = document.createElement('div')
      thumbnailElement.classList.add('drop-zone__thumb')
      dropZoneElement.appendChild(thumbnailElement)
    }

    thumbnailElement.dataset.label = file.name

    // Show thumbnail for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`
      }
    } else {
      var fileReader = new FileReader()
      fileReader.onload = function () {
        var data = fileReader.result
        data = data.toString().replaceAll('gx:coord','coorTrack')
        console.log(data);
        let xmlDoc = $.parseXML(data)
        let xml = $(xmlDoc)
        let list_root_folder = getItemSessionStorage('root_folder') == null ? [] : getItemSessionStorage('root_folder')
        $(xml)
          .find('Document > Folder')
          .each(function () {
            let root_folder = {
              folder_name: $(this).find(' > name').text().trim(),
              uuid_folder: create_UUID(),
              active_folder: true,
              list_group_duong_va_cot: [],
              list_cot_2: []
            }
            getObjectFromKML(
              'Document',
              $(this),
              root_folder.list_group_duong_va_cot,
              root_folder.uuid_folder
            )
            list_root_folder.push(root_folder)
          })
        let arr = []
        list_root_folder = removeFolderNotT_([...list_root_folder], arr)
        dispatch(changeRootFolder([...list_root_folder]))
        if (list_root_folder.length > 0) {
          dispatch(setCurrentUUidFolder(list_root_folder[0].uuid_folder))
          $(
            '.folder-root[id="' + list_root_folder[0].uuid_folder + '"]'
          ).addClass('text-red')
        }

        $('#updatePlanModal').removeClass('d-block')
        $('#updatePlanModal').addClass('fade')
      }
      fileReader.readAsText($('#fileInputKml').prop('files')[0])
    }
  }
  const removeFolderNotT_ = (list_root_folder, arr) => {
    /**
     * Xử lý xóa hết những root folder mà không có ký tự T_
     * @param list_root_folder: danh sách folder vừa đọc ở file kml ra
     * @param arr: mảng để chứa những root folder có name chứa T_
     * @author XHieu
     */
    for (let i = 0; i < list_root_folder.length; i++) {
      if (list_root_folder[i].folder_name == null) {
        continue
      }
      if (list_root_folder[i].folder_name.substring(0, 2).includes('T_')) {
        arr.push(list_root_folder[i])
      } else {
        // gọi đệ quy
        removeFolderNotT_(list_root_folder[i].list_group_duong_va_cot, arr)
      }
    }
    return arr
  }

  const handleChangeTypeMap = (type_map = 'osm-standard') => {
    /**
     * Thay đổi kiểu bản đồ, mặc định là kiểu arcgis-topographic
     *
     * @param type_map: kiểu bản đồ
     * @author XHieu
     */
    dispatch(changeTypeMap(type_map))
  }


  // END FUNC HANDLE

  //   FUNC RENDER HTML

  const renderListMenu = () => {
    /**
     * Render ra danh sách menu ban đầu trong Aside
     *
     * @param No
     * @author XHieu
     */
    return (
      <ul className='navbar-nav navbar-nav-lg nav-tabs'>
        <li className='nav-item'>
          <small className='nav-subtitle' title='Pages'>
            Danh sách KML
          </small>
          <small className='tio-more-horizontal nav-subtitle-replacer' />
        </li>
        {getHtmlMenuNen(list_root_nen)}
        {getHtmlMenuDuongCot(list_root_folder)}
        {/* End Pages */}
      </ul>
    )
  }
  const modelImportFile = () => {
    /**
     * Render ra model để import file KML vào xử lý
     *
     * @param No
     * @author XHieu
     */

    return (
      <div
        className='modal'
        id='updatePlanModal'
        tabIndex={-1}
        role='dialog'
        aria-labelledby='updatePlanModalTitle'
        aria-modal='true'
      >
        <div
          className='modal-dialog modal-dialog-centered modal-xs'
          role='document'
        >
          <div className='modal-content'>
            {/* Header */}
            <div className='modal-header'>
              <h2 id='updatePlanModalTitle' className='modal-title'>
                IMPORT FILE
              </h2>
              <button
                type='button'
                className='btn btn-icon btn-sm btn-ghost-secondary closeModel'
                data-dismiss='modal'
                aria-label='Close'
              >
                <i className='tio-clear tio-lg' />
              </button>
            </div>
            {/* End Header */}
            {/* Body */}
            <div className='modal-body'>
              {/* Pricing */}
              <div className='row mb-4'>
                <div className='drop-zone col-12'>
                  <span className='drop-zone__prompt'>
                    Kéo thả vào đây hoặc chọn file.
                  </span>
                  <input
                    type='file'
                    accept='.kml'
                    name='myFile'
                    id='fileInputKml'
                    className='drop-zone__input'
                  />
                </div>
              </div>
              {/* End Pricing */}

              <div className='d-flex justify-content-center justify-content-sm-end'></div>
            </div>
            {/* End Body */}
          </div>
        </div>
      </div>
    )
  }

  const modelChangeTypeMap = () => {
    return (
      <div
        className='modal d-none'
        id='modelChangeTypeMap'
        tabIndex={-1}
        aria-labelledby='shareWithPeopleModalTitle'
        style={{ display: 'block', paddingRight: '17px' }}
        aria-modal='true'
        role='dialog'
      >
        <div className='modal-dialog modal-dialog-centered' role='document'>
          <form className='modal-content'>
            {/* Header */}
            <div className='modal-header'>
              <h3 id='shareWithPeopleModalTitle' className='modal-title'>
                Thay đổi kiểu bản đồ
              </h3>
              <button
                type='button'
                className='btn btn-icon btn-sm btn-ghost-secondary closeModel'
                data-dismiss='modal'
                aria-label='Close'
              >
                <i className='tio-clear tio-lg' />
              </button>
            </div>
            {/* End Header */}
            {/* Body */}
            <div className='modal-body'>
              <ul className='pt-1  pl-0 row'>
                {type_Map_List.map(item => {
                  return (
                    <li
                      className='mb-2 col-4 pointer'
                      style={{ listStyle: 'none' }}
                    >
                      <div className='border pr-1 pl-1 pt-1 pb-2'>
                        <div className='align-items-center '>
                          <img
                            className='border rounder shadow-sm'
                            width={'100%'}
                            height={'100px'}
                            src={item.image}
                            alt=''
                          ></img>
                          <p
                            className='ms-2 mb-1 mt-1 bold text-center '
                            style={{ fontSize: '16px' }}
                          >
                            {item.name_type}
                          </p>
                        </div>
                        <div className='d-flex justify-content-center align-items-center'>
                          <input
                            type={'radio'}
                            name='typeMap'
                            onClick={() => {
                              handleChangeTypeMap(item.type)
                            }}
                            className=' shadow-sm'
                          ></input>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            {/* End Body */}
            {/* Footer */}
            <div className='modal-footer justify-content-start'>
              <div className='row align-items-center flex-grow-1 mx-n2'>
                <div className='col-12 mb-2 mb-sm-0'>
                  <p className='modal-footer-text'>
                    Hãy chọn chế độ hiển thị phù hợp theo nhu cầu của bạn. Việc
                    thay đổi này sẽ{' '}
                    <strong>không ảnh hưởng đến dữ liệu đang có của bạn</strong>
                  </p>
                </div>
              </div>
            </div>
            {/* End Footer */}
          </form>
        </div>
      </div>
    )
  }
  useEffect(() => {
    /**
     * Hàm khởi tạo component
     *
     * @param No
     * @author XHieu
     */
    mainEffect()
  }, [])
  useEffect(() => {
    /**
     * Sau khi list_group_duong_va_cot trong Store của Redux bị thay đổi giá trị sẽ chạy vào đây để render html
     *
     * @param No
     * @author XHieu
     */
    // handleMenuDuongCot(list_root_folder)
  }, [list_root_folder])

  //   END FUNC RENDER HTML
  return (
    <aside
      id='aside'  style={{marginBottom:'10px'}}
      className='js-navbar-vertical-aside aside-menu navbar navbar-vertical-aside navbar-vertical navbar-vertical-fixed navbar-expand-xl navbar-bordered default navbar-vertical-aside-initialized'
    >
      {modelImportFile()}
      {modelChangeTypeMap()}
      <div className='navbar-vertical-container'>
        <div className='navbar-vertical-footer-offset' style={{paddingBottom:'0px'}}>
          <div
            className='navbar-brand-wrapper justify-content-between mt-2 mb-2'
            style={{ overflow: 'unset', borderBottom: '1px solid #0000003b' }}
          >
            {/* Logo */}
            <a className='navbar-brand d-flex mb-2' href='' aria-label='Front'>
			{/*<img
                className='navbar-brand-logo'
                style={{ height: '100%', width: '50px', minWidth: '50px' }}
                src={Images.LOGO}
                alt='Logo'
              />
              <img
                className='navbar-brand-logo-mini'
                src={Images.LOGO}
                alt='Logo'
			/>*/}
              <div className='ml-3 d-flex align-items-center'>
                <p className='mb-0 fs-5 text-wrap text-dark'>
                  PHẦN MỀM THIẾT KẾ TUYẾN CÁP{' '}
                </p>
                {/* <p className='mb-0 fs-6 text-wrap text-dark'>
                  BƯU CHÍNH VIỄN THÔNG{' '}
                </p> */}
                {/* <p className='mb-0 fs-6 text-dark'>
                  <strong>PHẦN MỀM THIẾT KẾ TUYẾN CÁP</strong>
                </p> */}
              </div>
            </a>
            {/* End Logo */}
            {/* Navbar Vertical Toggle */}
            <button
              type='button'
              className='js-navbar-vertical-aside-toggle-invoker close-aside-menu navbar-vertical-aside-toggle btn btn-icon btn-xs btn-ghost-dark'
            >
              <i className='tio-clear tio-lg' />
            </button>
            {/* End Navbar Vertical Toggle */}
          </div>
          {/* Content */}
          <div className='navbar-vertical-content'>{renderListMenu()}</div>
          {/* End Content */}
        </div>
      </div>
    </aside>
  )
}
