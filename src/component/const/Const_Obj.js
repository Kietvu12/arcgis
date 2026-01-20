import { create_UUID } from '../base/base'
import { Images } from './Const_Images'

export const BASE_COT = {
  name: '',
  coor: ['', ''],
  uuid_folder: '',
  action: false,
  dia_diem: '',
  src_icon: Images.IMG_PUSHPIN,
  pre_src_icon:'',
  ly_trinh: "",
  check_ly_trinh: false,
  x2_phu_kien_cot: false,
  dat_bien_bao: false,
  be_cap: {
    ten:'',
    hien_trang_bc: '',
    ma_loai_be: ''
  },
  cot: {
    hien_trang_c: '',
    ma_loai_cot: '',
    chieu_cao: ''
  },
  vat_tu: {
    hien_trang_vt: '',
    ma_vat_tu: '',
    chung_loai_odf: '',
    chung_loai_spillter: ''
  },
  phu_kien: {
    ma_phu_kien: ''
  },
  phu_kien_cap_ADSS: {
    treo_neo: '',
    U_D_J: '',
    G0_C1: '',
    chung_loai_ADSS: ''
  },
  phu_kien_cap_AC: {
    treo_ham: '',
    de_U: '',
    dai_AC: '',
    chung_loai_AC: ''
  }
}
export const BASE_DUONG = {
  uuid_duong: create_UUID(),
  list_do_duong: [[]], // danh sách tọa độ của đường
  active_do_duong: true,
  type: 'duong',
  uuid_folder:''
}
export const CONTROLL = {
  THEM_COT:'them_cot',
  SUA_COT:'sua_1_cot',
  THEM_DUONG:'them_duong',
  SUA_DUONG:'sua_duong'
}