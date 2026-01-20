export const thayDoiToaDo = basemap => {
  return {
    type: 'CHANGE_LOCATION',
    lat: basemap.lat,
    lon: basemap.lon
  }
}
export const changeRootFolder = e => {
  return {
    type: 'CHANGE_ROOT_FOLDER',
    list_root_folder: e
  }
}
export const changeRootNen = e => {
  return {
    type: 'CHANGE_ROOT_NEN',
    list_root_nen: e
  }
}
export const setStateThemCot = e => {
  return {
    type: 'SET_STATE_THEM_COT',
    state_them_cot: e
  }
}
export const setStateSuaCot = e => {
  return {
    type: 'SET_STATE_SUA_COT',
    state_sua_cot: e
  }
}
export const setCurrentUUidFolder = e => {
  return {
    type: 'SET_CURRENT_UUID_FOLDER',
    current_uuid_folder: e
  }
}
export const setCurrentColorDuong = e => {
  return {
    type: 'SET_CURRENT_COLOR_DUONG',
    current_color_duong: e
  }
}
export const setCurrentSizeDuong = e => {
  return {
    type: 'SET_CURRENT_SIZE_DUONG',
    current_size_duong: e
  }
}
export const setStateSuaDuong = e => {
  return {
    type: 'SET_STATE_SUA_DUONG',
    state_sua_duong: e
  }
}
export const setActiveControl = e => {
  return {
    type: 'SET_ACTIVE_CONTROL',
    active_control: e
  }
}
export const setPathsDuong = e => {
  return {
    type: 'SET_PATHS_DUONG',
    paths_duong: e
  }
}
export const setIndexChenCot = e => {
  return {
    type: 'SET_INDEX_CHEN_COT',
    index_chen_cot: e
  }
}
export const setCotGocChenCot = e => {
  return {
    type: 'SET_COT_GOC_CHEN_COT',
    cot_goc_chen_cot: e
  }
}
export const setScreenPoint = e => {
  return {
    type: 'SET_SCREEN_POINT',
    screen_point: e
  }
}
export const changeTypeMap = e => {
  return {
    type: 'CHANGE_TYPE_MAP',
    type_map: e
  }
}
export const setStateSuaNhieuCot = e => {
  return {
    type: 'SET_STATE_SUA_NHIEU_COT',
    state_sua_nhieu_cot: e
  }
}
export const setControlXoaNhieuCot = e => {
  return {
    type: 'SET_CONTROL_XOA_NHIEU_COT',
    control_xoa_nhieu_cot: e
  }
}

