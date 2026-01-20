import { setItemSessionStorage } from '../base/base'
import { BASE_COT, BASE_DUONG } from '../const/Const_Obj'

const initialState = {
  type_map: 'osm-streets-relief',
  lat: '20.992903563656817',
  lon: '105.82972326668407',
  list_root_folder: [],
  previous_list_root_folder:[],
  list_root_nen: [],
  user: {},
  current_uuid_folder: '',
  state_them_cot: BASE_COT,
  state_sua_cot: BASE_COT,
  state_sua_nhieu_cot: [],
  state_them_duong: BASE_DUONG,
  state_sua_duong: BASE_DUONG,
  current_color_duong: '',
  current_size_duong: '',
  active_control: 'default',
  paths_duong: {
    uuid_duong: '',
    paths: [],
    saved: false,
    changed: false
  },
  index_chen_cot: 0,
  cot_goc_chen_cot: null,
  screen_point: {
    long: '105.82972326668407',
    lat: '20.992903563656817'
  },
  control_xoa_nhieu_cot: false
}
const BaseMapReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_LOCATION': {
      return state
    }
    case 'CHANGE_ROOT_FOLDER': {
      state.previous_list_root_folder = [...state.list_root_folder]
      // ĐÂY LÀ DANH SÁCH CÁC ĐIỂM VỪA ĐỌC ĐƯỢC TỪ FILE
      setItemSessionStorage('root_folder', action.list_root_folder)
      return {
        ...state,
        list_root_folder: action.list_root_folder
      }
    }
    case 'CHANGE_ROOT_NEN': {
      // ĐÂY LÀ DANH SÁCH CÁC ĐIỂM NỀN CŨNG LẤY TỪ FILE KML
      setItemSessionStorage('root_nen', action.list_root_nen)
      return {
        ...state,
        list_root_nen: action.list_root_nen
      }
    }
    case 'SET_STATE_THEM_COT': {
      return {
        ...state,
        state_them_cot: action.state_them_cot
      }
    }
    case 'SET_STATE_SUA_COT': {
      return {
        ...state,
        state_sua_cot: action.state_sua_cot
      }
    }
    case 'SET_CURRENT_UUID_FOLDER': {
      return {
        ...state,
        current_uuid_folder: action.current_uuid_folder
      }
    }
    case 'SET_CURRENT_COLOR_DUONG': {
      return {
        ...state,
        current_color_duong: action.current_color_duong
      }
    }

    case 'SET_CURRENT_SIZE_DUONG': {
      return {
        ...state,
        current_size_duong: action.current_size_duong
      }
    }
    case 'SET_STATE_SUA_DUONG': {
      return {
        ...state,
        state_sua_duong: action.state_sua_duong
      }
    }
    case 'SET_ACTIVE_CONTROL': {
      return {
        ...state,
        active_control: action.active_control
      }
    }
    case 'SET_PATHS_DUONG': {
      return {
        ...state,
        paths_duong: action.paths_duong
      }
    }
    case 'SET_INDEX_CHEN_COT': {
      return {
        ...state,
        index_chen_cot: action.index_chen_cot
      }
    }
    case 'SET_COT_GOC_CHEN_COT': {
      return {
        ...state,
        cot_goc_chen_cot: action.cot_goc_chen_cot
      }
    }
    case 'SET_SCREEN_POINT': {
      return {
        ...state,
        screen_point: action.screen_point
      }
    }
    case 'CHANGE_TYPE_MAP': {
      return {
        ...state,
        type_map: action.type_map
      }
    }
    case 'SET_STATE_SUA_NHIEU_COT': {
      return {
        ...state,
        state_sua_nhieu_cot: action.state_sua_nhieu_cot
      }
    }
    case 'SET_CONTROL_XOA_NHIEU_COT': {
      return {
        ...state,
        control_xoa_nhieu_cot: action.control_xoa_nhieu_cot
      }
    }
    
    default: {
      return state
    }
  }
}
export default BaseMapReducer
