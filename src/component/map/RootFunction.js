import Map from '@arcgis/core/Map'
import Print from '@arcgis/core/widgets/Print'
import MapView from '@arcgis/core/views/MapView'
import Locate from '@arcgis/core/widgets/Locate'
import Search from '@arcgis/core/widgets/Search'
import $ from 'jquery'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import TextSymbol from '@arcgis/core/symbols/TextSymbol'
import CIMSymbol from '@arcgis/core/symbols/CIMSymbol'
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'
import Polyline from '@arcgis/core/geometry/Polyline'
import Point from '@arcgis/core/geometry/Point'
import esriConfig from '@arcgis/core/config'
import marker3 from './../../image/icons8-plus-100.png'
import marker4 from './../../image/icons8-place-marker-80.png'
import { Const_Libs } from '../const/Const_Libs'

import {
  create_UUID,
  downloadFile,
  getCountString,
  getItemLocalStorage,
  getItemSessionStorage,
  isNumber,
  setItemSessionStorage
} from '../base/base'
import { BASE_COT } from '../const/Const_Obj'
import { Images } from '../const/Const_Images'
import { log } from 'util'
import { changeRootFolder } from '../reducer_action/BaseMapActionReducer'
esriConfig.apiKey =
  'AAPKd1c0b29161f34f41b53daf85636e59926tzbgZr3Cvwf2gzqx0j8fclreeQvvlZURxiIXZQD4CpHQrLn9xTgBsMy-UO4YYhI'

export var MAP = new Map({
  basemap: 'osm-streets-relief'
})

export var SIMPLE_MARKER_SYMBOL3 = {
  type: 'picture-marker',
  url: marker3,
  width: '35px',
  height: '35px'
}
export var SIMPLE_MARKER_SYMBOL4 = {
  type: 'picture-marker',
  url: marker4,
  width: '50px',
  height: '50px'
}
export var TEXT_SYMBOL = {
  type: 'text', // autocasts as new TextSymbol()
  color: 'white',
  haloColor: 'black',
  haloSize: '1px',
  text: 'You are here',
  xoffset: 3,
  yoffset: 3,
  backgroundColor: [255, 0, 0],
  font: {
    // autocasts as new Font()
    size: 12,
    family: 'Josefin Slab',
    weight: 'bold'
  }
}
// export var LINE_SYMBOL = {
//   type: 'simple-line', // autocasts as SimpleLineSymbol()
//   color: [226, 119, 40],
//   width: 4
// }
export var LINE_SYMBOL = new CIMSymbol({
  data: {
    type: 'CIMSymbolReference',
    symbol: {
      type: 'CIMLineSymbol',
      symbolLayers: [
        {
          // black 1px line symbol
          type: 'CIMSolidStroke',
          enable: true,
          width:
            getItemSessionStorage('size_duong') == null
              ? 4
              : getItemSessionStorage('size_duong'),
          color:
            getItemSessionStorage('color_duong') == null
              ? [0, 0, 0, 255]
              : getItemSessionStorage('color_duong')
        },
        {
          // arrow symbol
          type: 'CIMVectorMarker',
          enable: true,
          size: 10,
          markerPlacement: {
            type: 'CIMMarkerPlacementAtExtremities',
            angleToLine: true,
            offset: 5,
            offsetAlongLine: 5,
            placePerPart: true,
            extremityPlacement: 'JustEnd'
          },
          frame: {
            xmin: -10,
            ymin: -10,
            xmax: 10,
            ymax: 10
          },
          markerGraphics: [
            {
              type: 'CIMMarkerGraphic',
              geometry: {
                rings: [
                  [
                    [4.25, 1.31],
                    [0, 8.51],
                    [4.25, 15.66],
                    [12.75, 15.66],
                    [17, 8.51],
                    [12.75, 1.31],
                    [4.25, 1.31]
                  ]
                ]
              },
              symbol: {
                type: 'CIMPolygonSymbol',
                symbolLayers: [
                  {
                    type: 'CIMSolidFill',
                    enable: true,
                    color: [255, 0, 0, 255]
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  }
})
export var LINE_SYMBOL2 = {
  type: 'simple-line', // autocasts as SimpleLineSymbol()
  color: [255, 0, 0],
  width: 10
}
export var LINE_SYMBOL_Track = {
  type: 'simple-line', // autocasts as SimpleLineSymbol()
  color: [89, 172, 255],
  width: 5
}
export const CIM_Symboy = new CIMSymbol({
  data: {
    type: 'CIMSymbolReference',
    primitiveOverrides: [
      {
        type: 'CIMPrimitiveOverride',
        primitiveName: 'textGraphic',
        propertyName: 'TextString',
        valueExpressionInfo: {
          type: 'CIMExpressionInfo',
          title: 'Custom',
          expression: '$feature.text',
          returnType: 'Default'
        }
      }
    ],
    symbol: {
      type: 'CIMPointSymbol',
      symbolLayers: [
        {
          type: 'CIMVectorMarker',
          enable: true,
          size: 32,
          colorLocked: true,
          anchorPointUnits: 'Relative',
          frame: { xmin: -5, ymin: -5, xmax: 5, ymax: 5 },
          markerGraphics: [
            {
              type: 'CIMMarkerGraphic',
              primitiveName: 'textGraphic',
              geometry: { x: 0, y: 0 },
              symbol: {
                type: 'CIMTextSymbol',
                fontFamilyName: 'Arial',

                height: 4,
                horizontalAlignment: 'Center',
                // x y là vị trí hiển thị
                offsetX: 8,
                offsetY: 5,
                symbol: {
                  type: 'CIMPolygonSymbol',
                  symbolLayers: [
                    {
                      type: 'CIMSolidFill',
                      enable: true,
                      // set màu chữ
                      color: [33, 19, 13, 255]
                    }
                  ]
                },
                verticalAlignment: 'Center'
              },
              textString: ''
            }
          ],
          scaleSymbolsProportionally: true,
          respectFrame: true
        }
      ]
    }
  }
})
// export const CIM_Symboy_NEN = new CIMSymbol({
//   data: {
//     type: 'CIMSymbolReference',
//     primitiveOverrides: [
//       {
//         type: 'CIMPrimitiveOverride',
//         primitiveName: 'textGraphic',
//         propertyName: 'TextString',
//         valueExpressionInfo: {
//           type: 'CIMExpressionInfo',
//           title: 'Custom',
//           expression: '$feature.text',
//           returnType: 'Default'
//         }
//       }
//     ],
//     symbol: {
//       type: 'CIMPointSymbol',
//       symbolLayers: [
//         {
//           type: 'CIMVectorMarker',
//           enable: true,
//           size: 32,
//           colorLocked: true,
//           anchorPointUnits: 'Relative',
//           frame: { xmin: -5, ymin: -5, xmax: 5, ymax: 5 },
//           markerGraphics: [
//             {
//               type: 'CIMMarkerGraphic',
//               primitiveName: 'textGraphic',
//               geometry: { x: 0, y: 0 },
//               symbol: {
//                 type: 'CIMTextSymbol',
//                 fontFamilyName: 'Arial',
//                 height: 4,
//                 horizontalAlignment: 'Center',
//                 // x y là vị trí hiển thị
//                 offsetX: -4,
//                 offsetY: -5,
//                 symbol: {
//                   type: 'CIMPolygonSymbol',
//                   symbolLayers: [
//                     {
//                       type: 'CIMSolidFill',
//                       enable: true,
//                       // set màu chữ
//                       color: [33, 19, 13, 255]
//                     }
//                   ]
//                 },
//                 verticalAlignment: 'Center'
//               },
//               textString: ''
//             }
//           ],
//           scaleSymbolsProportionally: true,
//           respectFrame: true
//         },
//         {
//           type: 'CIMPictureMarker',
//           enable: true,
//           anchorPoint: {
//             x: 0,
//             y: 0
//           },
//           size: 20,
//           scaleX: 1,
//           tintColor: [255, 255, 255, 255],
//           url: 'https://maps.google.com/mapfiles/kml/pal4/icon61.png'
//         }
//       ]
//     }
//   }
// })
const createCIMSymbol = (url) => {
  return new CIMSymbol({
    data: {
      type: 'CIMSymbolReference',
      primitiveOverrides: [
        {
          type: 'CIMPrimitiveOverride',
          primitiveName: 'textGraphic',
          propertyName: 'TextString',
          valueExpressionInfo: {
            type: 'CIMExpressionInfo',
            title: 'Custom',
            expression: '$feature.text',
            returnType: 'Default'
          }
        }
      ],
      symbol: {
        type: 'CIMPointSymbol',
        symbolLayers: [
          {
            type: 'CIMVectorMarker',
            enable: true,
            size: 32,
            colorLocked: true,
            anchorPointUnits: 'Relative',
            frame: { xmin: -5, ymin: -5, xmax: 5, ymax: 5 },
            markerGraphics: [
              {
                type: 'CIMMarkerGraphic',
                primitiveName: 'textGraphic',
                geometry: { x: 0, y: 0 },
                symbol: {
                  type: 'CIMTextSymbol',
                  fontFamilyName: 'Arial',
                  height: 4,
                  horizontalAlignment: 'Center',
                  offsetX: -4,
                  offsetY: -5,
                  symbol: {
                    type: 'CIMPolygonSymbol',
                    symbolLayers: [
                      {
                        type: 'CIMSolidFill',
                        enable: true,
                        color: [33, 19, 13, 255]
                      }
                    ]
                  },
                  verticalAlignment: 'Center'
                },
                textString: ''
              }
            ],
            scaleSymbolsProportionally: true,
            respectFrame: true
          },
          {
            type: 'CIMPictureMarker',
            enable: true,
            anchorPoint: { x: 0, y: 0 },
            size: 20,
            scaleX: 1,
            tintColor: [255, 255, 255, 255],
            url: url // Sử dụng URL được truyền vào từ tham số của hàm
          }
        ]
      }
    }
  });
};

// Sử dụng hàm createCIMSymbol để tạo CIMSymbol với URL cụ thể
export const CIM_Symboy_NEN = createCIMSymbol('https://maps.google.com/mapfiles/kml/pal4/icon61.png');


export var VIEW = new MapView({
  center: [105.82972326668407, 20.992903563656817],
  container: 'viewDiv',
  map: MAP,
  zoom: 9,
  popup: {
    defaultPopupTemplateEnabled: false,
    dockEnabled: true,
    dockOptions: {
      buttonEnabled: false,
      breakpoint: false
    },
    autoOpenEnabled: false
  }
})
export var GRAPHIC_LAYER = new GraphicsLayer()
export var GRAPHIC_LAYER_NEN = new GraphicsLayer()

// Track coordinates to detect duplicates
let coordinateCache = {}

// Helper function to clear coordinate cache
const clearCoordinateCache = () => {
  coordinateCache = {}
}

// Helper function to generate a simple hash from string
const simpleHash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Helper function to get adjusted coordinates with offset for duplicates
const getAdjustedCoordinates = (lon, lat, uuid_cot = null, useOriginalCoords = false) => {
  const key = `${lon.toFixed(6)},${lat.toFixed(6)}`
  
  // If useOriginalCoords is true, don't apply offset (for existing points from KML)
  if (useOriginalCoords) {
    return {
      longitude: lon,
      latitude: lat,
      hasOffset: false
    }
  }
  
  // Track all points at this coordinate
  if (!coordinateCache[key]) {
    coordinateCache[key] = []
  }
  
  // Check if this specific point (by uuid) already has an offset
  if (uuid_cot) {
    const existingPoint = coordinateCache[key].find(p => p.uuid === uuid_cot)
    if (existingPoint) {
      // Return the same offset for this point
      return {
        longitude: existingPoint.longitude,
        latitude: existingPoint.latitude,
        hasOffset: existingPoint.hasOffset
      }
    }
  }
  
  // New point at this coordinate
  const count = coordinateCache[key].length
  const offsetDistance = 0.00025 // approximately 25 meters
  let angle
  
  if (uuid_cot) {
    // Use hash of uuid_cot to generate consistent angle
    const hash = simpleHash(uuid_cot)
    angle = (hash % 360) * (Math.PI / 180) // Convert to radians
  } else {
    // Fallback to count-based angle if no uuid
    angle = count * (Math.PI * 2 / 6) // Distribute points in a circle pattern
  }
  
  const offsetLon = Math.cos(angle) * offsetDistance
  const offsetLat = Math.sin(angle) * offsetDistance
  
  const adjustedCoords = {
    longitude: lon + offsetLon,
    latitude: lat + offsetLat,
    hasOffset: count > 0 // First point has no offset, others do
  }
  
  // Store this point's offset for consistency
  if (uuid_cot) {
    coordinateCache[key].push({
      uuid: uuid_cot,
      longitude: adjustedCoords.longitude,
      latitude: adjustedCoords.latitude,
      hasOffset: adjustedCoords.hasOffset
    })
  }
  
  return adjustedCoords
}

export const reRenderMap = list_root_folder_local => {
  /**
   * Hàm render lại cột và đường hiển thị trên map
   *
   * @param list_root_folder_local: danh sách đường và cột
   * @author XHieu
   */

  MAP.remove(GRAPHIC_LAYER)
  GRAPHIC_LAYER.graphics.items = []
  
  // Clear coordinate cache at the start of rendering
  clearCoordinateCache()
  // Helper function to render items recursively (supports nested folders)
  const renderItems = (items, parent_uuid_folder) => {
    items.forEach(item => {
      // Check if this is a nested folder
      if (item.type == 'folder' || (item.list_group_duong_va_cot && Array.isArray(item.list_group_duong_va_cot) && item.folder_name)) {
        // Recursively render nested folder
        if (item.active_folder) {
          renderItems(item.list_group_duong_va_cot, item.uuid_folder)
        }
      } else if (item.type == 'duong' || item.type == 'track') {
        // Vẽ ra các đường
        if (item.active_do_duong && item.list_do_duong && item.list_do_duong[0]) {
          for (let k = 0; k < item.list_do_duong[0].length; k++) {
            if (k < item.list_do_duong[0].length - 1) {
              addDuong(
                [
                  item.list_do_duong[0][k],
                  item.list_do_duong[0][k + 1]
                ],
                GRAPHIC_LAYER,
                MAP,
                item.uuid_duong,
                item.type
              )
            }
          }
        }
      } else if (item.type == 'cot') {
        // Vẽ ra các cột
        let itemPoint = {
          ...BASE_COT,
          ...item,
          active_cot: item.active_cot,
          coor: item.coor,
          name: item.name.trim(),
          type: 'cot',
          uuid_cot: item.uuid_cot,
          uuid_folder: parent_uuid_folder,
          src_icon: item.src_icon == null ? Images.IMG_PUSHPIN : item.src_icon
        }
        if (itemPoint.uuid_cot) {
          addCot(itemPoint, GRAPHIC_LAYER, MAP, parent_uuid_folder)
        }
      }
    })
  }

  list_root_folder_local.map(item_root => {
    if (item_root.active_folder) {
      let checkAllActiveCot = false
      let arr_cot = []
      
      // Render all items (including nested folders)
      renderItems(item_root.list_group_duong_va_cot, item_root.uuid_folder)
      
      // Collect points for line generation (only from current level)
      item_root.list_group_duong_va_cot.forEach(item_group_duong_va_cot => {
        if (item_group_duong_va_cot.type == 'cot') {
          arr_cot.push(item_group_duong_va_cot)
        }
      })
      // vẽ ra đường theo cột
      arr_cot = getLineFromPoint(arr_cot)
      // for (let i = 0; i < arr_cot.length - 1; i++) {
      //   addDuong(
      //     [arr_cot[i], arr_cot[i + 1]],
      //     GRAPHIC_LAYER,
      //     MAP,
      //     'dksldksd' + i
      //   )
      // }
      // end vẽ ra đường theo cột
      item_root.list_group_duong_va_cot.forEach(item_group_duong_va_cot => {
        // kiểm tra xem có cột nào bị ẩn k
        if (item_group_duong_va_cot.type == 'cot') {
          if (item_group_duong_va_cot.active_cot) {
            checkAllActiveCot = true
          }
        }
      })
      if (!checkAllActiveCot) {
        // trường hợp này là  đường đã bị ẩn, các cột hiển thị sẽ thay bằng các cột khác
        // và ít hơn theo số lượng yêu cầu
        item_root.list_cot_2.forEach((diem_dau_cuoi, index) => {
          const point = {
            type: 'point', // autocasts as new Polyline()
            longitude: diem_dau_cuoi[0],
            latitude: diem_dau_cuoi[1],
            uuid_cot: index
          }
          const pontGraphic = new Graphic({
            geometry: point,
            symbol: SIMPLE_MARKER_SYMBOL3,
            visible: true
          })
          GRAPHIC_LAYER.add(pontGraphic)
        })
      }
    }
  })
  
  MAP.add(GRAPHIC_LAYER)
}
export const reRenderNen = list_root_folder_local => {
  /**
   * Hàm render lại cột và đường hiển thị trên map, nhưng là ở layer nền
   *
   * @param list_root_folder_local: danh sách đường và cột
   * @author XHieu
   */

  MAP.remove(GRAPHIC_LAYER_NEN)
  GRAPHIC_LAYER_NEN.graphics.items = []
  
  // Clear coordinate cache at the start of rendering
  clearCoordinateCache()
  
  console.log('=== RENDER NEN DEBUG ===')
  console.log('List root folder:', list_root_folder_local)
  console.log('Number of folders:', list_root_folder_local ? list_root_folder_local.length : 0)
  
  // Đảm bảo GRAPHIC_LAYER_NEN được add vào map
  MAP.add(GRAPHIC_LAYER_NEN)
  
  list_root_folder_local.map(item_root => {
    if (item_root.active_folder) {
      console.log('Processing folder:', item_root.folder_name)
      console.log('Items in folder:', item_root.list_group_duong_va_cot ? item_root.list_group_duong_va_cot.length : 0)
      
      // Collect all items first (to separate lines and points)
      const collectItems = (items, parent_uuid, lines, points) => {
        items.forEach((item) => {
          // Check if this is a nested folder
          if (item.type == 'folder' || (item.list_group_duong_va_cot && Array.isArray(item.list_group_duong_va_cot) && item.folder_name)) {
            // Recursively collect items from nested folder
            collectItems(item.list_group_duong_va_cot, parent_uuid, lines, points)
          } else if (item.type == 'duong') {
            // Collect lines
            if (item.active_do_duong && item.list_do_duong) {
              lines.push({ item, parent_uuid })
            }
          } else if (item.type == 'cot') {
            // Collect points
            points.push({ item, parent_uuid })
          }
        })
      }
      
      // Render function - first render all lines, then all points
      const renderItems = (items, parent_uuid) => {
        console.log('renderItems called with', items.length, 'items')
        
        // Collect all lines and points separately
        const lines = []
        const points = []
        collectItems(items, parent_uuid, lines, points)
        
        // First, render all lines (so they appear below)
        lines.forEach(({ item, parent_uuid: uuid }) => {
          console.log('Rendering line:', item.name, 'with', item.list_do_duong.length, 'segments')
          item.list_do_duong.forEach(itemPolyline => {
            addDuong(
              itemPolyline,
              GRAPHIC_LAYER_NEN,
              MAP,
              item.uuid_duong || create_UUID()
            )
          })
        })
        
        // Then, render all points (so they appear on top)
        points.forEach(({ item, parent_uuid: uuid }) => {
          console.log('Rendering point:', item.name, 'at', item.coor)
          
          // Ensure coor is a valid array with numbers
          let coor = item.coor
          if (Array.isArray(coor) && coor.length >= 2) {
            // Convert to numbers if they're strings
            coor = [parseFloat(coor[0]), parseFloat(coor[1])]
            
            // Check if coordinates are valid
            if (!isNaN(coor[0]) && !isNaN(coor[1])) {
              let itemPoint = {
                ...BASE_COT,
                ...item,
                active_cot: item.active_cot !== undefined ? item.active_cot : true,
                coor: coor,
                name: item.name ? item.name.trim() : '',
                type: 'cot',
                uuid_cot: item.uuid_cot || create_UUID(),
                uuid_folder: uuid,
                src_icon: item.src_icon || Images.IMG_PUSHPIN
              }
              
              console.log('Adding point with valid coordinates:', coor)
              addCotNen(itemPoint, GRAPHIC_LAYER_NEN, MAP, uuid)
              console.log('Successfully added point to map')
            } else {
              console.log('Cannot add point - invalid coordinates:', coor)
            }
          } else {
            console.log('Cannot add point - coor is not valid array:', coor)
          }
        })
      }
      
      if (item_root.list_group_duong_va_cot && Array.isArray(item_root.list_group_duong_va_cot)) {
        renderItems(item_root.list_group_duong_va_cot, item_root.uuid_folder)
      }
    }
  })
  
  console.log('=== END RENDER NEN DEBUG ===')
}
export const reRenderViewMap = (
  list_root_folder,
  type_map = 'osm-streets-relief'
) => {
  /**
   * Render lai toan bo MAP
   *
   * @param list_root_folder: danh sách tọa độ các Đo Đường và cột
   * @param type_map: Kiểu bản đồ
   * @author XHieu
   */
  MAP.removeAll()
  MAP = new Map({
    basemap: type_map
  })
  VIEW = new MapView({
    center: [105.82972326668407, 20.992903563656817],
    container: 'viewDiv',
    map: MAP,
    zoom: 9
  })
  VIEW.ui.move('zoom', 'top-right')
  // widget tìm vị trí của người dùng
  const locate = new Locate({
    view: VIEW,
    useHeadingEnabled: false,
    goToOverride: function (view, options) {
      options.target.scale = 1500
      return view.goTo(options.target)
    }
  })
  //Add to the map
  VIEW.ui.add([locate], 'top-right')
  // widget tìm kiếm theo tên vị trí
  const search = new Search({
    //Add Search widget
    view: VIEW
  })
  VIEW.ui.add(search, 'top-left')
  reRenderMap(list_root_folder)
  reRenderNen(
    getItemSessionStorage('root_nen') == null
      ? []
      : getItemSessionStorage('root_nen')
  )
  let print = new Print({
    view: VIEW,
    // specify your own print service
    printServiceUrl:
      'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
    templateOptions: {
      title: 'Anh',
      copyright: 'POTECO',
      legendEnabled: false
    }
  })
  // Add widget to the top right corner of the view
  VIEW.ui.add(print, 'top-right')
  print.on('complete', function (results) {
    // The results are stored in the results object
    Const_Libs.TOAST.success('Đã tạo link thành công')
    downloadFile(results.link.url)
  })

  // $('.esri-ui-top-right').css({ top: '10vh' })
  VIEW.when(function () {
    // khi Map được load xong làm gì thì làm ở đây
  }).catch(function (err) {
    // Trường hợp bản đồ bị load lỗi sẽ thông báo ở đây
    Const_Libs.TOAST.error('Lỗi tải bản đồ. Nhấn F5 để tải lại trang')
  })
}
export const getToaDoDuong = list => {
  /**
   * Lọc ra danh sách tọa độ các Đo Đường
   *
   * @param list: danh sách tọa độ các Đo Đường
   * @author XHieu
   */
  let list_toa_do_duong = []
  console.log('=== getToaDoDuong DEBUG ===')
  console.log('Input list:', list)
  
  for (let i in list) {
    let item_duong = []
    let item_list_coor = list[i].trim().split(' ')
    console.log('Processing coordinates:', item_list_coor)
    
    item_list_coor.map(item_coor => {
      if (item_coor.trim() !== '') {
        let coords = item_coor.trim().split(',')
        if (coords.length >= 2) {
          item_duong.push([
            parseFloat(coords[0]),
            parseFloat(coords[1])
          ])
        }
      }
    })
    
    console.log('Processed coordinates:', item_duong)
    list_toa_do_duong.push(item_duong)
  }

  console.log('Final result:', list_toa_do_duong)
  console.log('=== END getToaDoDuong DEBUG ===')
  return list_toa_do_duong
}

export const addCot = (
  itemPoint,
  graphicsLayer_local,
  map_local,
  uuid_folder
) => {
  /**
   * Thêm cột vào map khi click vào map
   *
   * @param itemPoint: Thông tin của điểm cần add (vd: dọa độ, kiểu, hiển thị,,,)
   * @param graphicsLayer_local: GraphicLayer của Map
   * @param map_local: Map đang được render hiện tại
   * @author XHieu
   */
  // Get adjusted coordinates (with offset if duplicate)
  // Pass uuid_cot to ensure consistent offset for the same point
  // For existing points from KML in edit mode, use original coordinates (no offset)
  const adjustedCoords = getAdjustedCoordinates(
    itemPoint.coor[0], 
    itemPoint.coor[1],
    itemPoint.uuid_cot,
    true // Use original coordinates for existing points in edit mode
  )
  
  const point = {
    type: 'point', // autocasts as new Polyline()
    longitude: adjustedCoords.longitude,
    latitude: adjustedCoords.latitude
  }
  let marker_symbol = {
    type: 'picture-marker',
    url: itemPoint.src_icon,
    width: '30px',
    height: '30px'
  }
  if (itemPoint.src_icon !== Images.IMG_PUSHPIN) {
    marker_symbol.width = '50px'
    marker_symbol.height = '50px'
  }

  // Add visual indicator if this point has been offset (to show there are duplicates)
  if (adjustedCoords.hasOffset) {
    marker_symbol = {
      ...marker_symbol,
      width: (parseInt(marker_symbol.width) * 0.9) + 'px',
      height: (parseInt(marker_symbol.height) * 0.9) + 'px'
    }
  }

  const pontGraphic = new Graphic({
    geometry: point,
    symbol: marker_symbol,
    pre_symbol: marker_symbol,
    visible: itemPoint.active_cot,
    uuid_cot: itemPoint.uuid_cot,
    name: itemPoint.name,
    uuid_folder: uuid_folder,
    typee: 'point'
  })
  const pontGraphic2 = new Graphic({
    geometry: point,
    // symbol: marker_symbol,
    // pre_symbol: marker_symbol,
    symbol: CIM_Symboy,
    visible: itemPoint.active_cot,
    name: itemPoint.name,
    attributes: {
      text: `${itemPoint.name}${
        itemPoint.dia_diem == '' ? '' : `: ${itemPoint.dia_diem}`
      }${
        itemPoint.vat_tu.ma_vat_tu == '' ? '' : `, ${itemPoint.vat_tu.ma_vat_tu}`
      }${
        itemPoint.phu_kien.ma_phu_kien == ''
          ? ''
          : `, ${itemPoint.phu_kien.ma_phu_kien}`
      }`
    },
    typee: 'text'
  })
  graphicsLayer_local.add(pontGraphic)
  graphicsLayer_local.add(pontGraphic2)
  map_local.add(graphicsLayer_local)
}
export const addCotNen = (
  itemPoint,
  graphicsLayer_local,
  map_local,
  uuid_folder
) => {
  console.log('=== addCotNen called ===')
  console.log('Point:', itemPoint.name, 'Coords:', itemPoint.coor)
  
  // For points from KML, always use original coordinates (no offset)
  // This ensures points with same name and same position display correctly
  const adjustedCoords = getAdjustedCoordinates(
    itemPoint.coor[0], 
    itemPoint.coor[1],
    itemPoint.uuid_cot,
    true // Use original coordinates for KML points
  )
  
  const point = {
    type: 'point',
    longitude: adjustedCoords.longitude,
    latitude: adjustedCoords.latitude
  };

  console.log('Creating graphic with coordinates:', point);
  console.log('Point active:', itemPoint.active_cot);
  
  // Use the icon from itemPoint.src_icon instead of hard-coded SIMPLE_MARKER_SYMBOL3
  let marker_symbol = {
    type: 'picture-marker',
    url: itemPoint.src_icon || Images.IMG_PUSHPIN,
    width: '35px',
    height: '35px'
  };
  
  // Add visual indicator if this point has been offset (to show there are duplicates)
  if (adjustedCoords.hasOffset) {
    marker_symbol.width = (parseInt(marker_symbol.width) * 0.9) + 'px'
    marker_symbol.height = (parseInt(marker_symbol.height) * 0.9) + 'px'
  }
  
  // Tạo graphic cho icon
  const pontGraphic = new Graphic({
    geometry: point,
    symbol: marker_symbol,
    visible: itemPoint.active_cot !== undefined ? itemPoint.active_cot : true,
    uuid_cot: itemPoint.uuid_cot,
    name: itemPoint.name,
    uuid_folder: uuid_folder,
    attributes: {
      text: itemPoint.name
    },
    typee: 'point'
  });
  
  console.log('Graphic created with visible:', pontGraphic.visible)
  
  // Tạo graphic cho text label
  const textSymbol = {
    type: 'text',
    text: itemPoint.name || '',
    color: 'black',
    font: {
      size: 12,
      family: 'Josefin Slab',
      weight: 'bold'
    },
    haloColor: 'white',
    haloSize: '1px',
    xoffset: 3,
    yoffset: 3
  };
  
  const textGraphic = new Graphic({
    geometry: point,
    symbol: textSymbol,
    visible: itemPoint.active_cot !== undefined ? itemPoint.active_cot : true,
    uuid_cot: itemPoint.uuid_cot + '_text',
    name: itemPoint.name + '_text',
    uuid_folder: uuid_folder,
    attributes: {
      text: itemPoint.name
    },
    typee: 'text'
  });
  
  graphicsLayer_local.add(pontGraphic);
  graphicsLayer_local.add(textGraphic);
  
  console.log('Point and text added to layer')
  console.log('Layer has', graphicsLayer_local.graphics.length, 'graphics')
  console.log('Layer visible:', graphicsLayer_local.visible)
  console.log('Layer in map layers:', map_local.layers.toArray().filter(l => l === graphicsLayer_local).length > 0)
  console.log('=== END addCotNen ===')
};

export const addDuong = (
  itemPolyline,
  graphicsLayer_local,
  map_local,
  uuid_duong_local,
  type = 'duong'
) => {
  /**
   * Thêm cột vào map
   *
   * @param itemPolyline: Thông tin của điểm cần add (vd: tọa độ, kiểu, hiển thị,,,)
   * @param graphicsLayer_local: GraphicLayer của Map
   * @param map_local: Map đang được render hiện tại
   * @param type: "duong" or "track"
   * @author XHieu
   */
  const polyline = {
    type: 'polyline', // autocasts as new Polyline()
    paths: itemPolyline
  }
  const polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: LINE_SYMBOL,
    visible: true,
    uuid_duong: uuid_duong_local,
    typee: 'polyline'
  })
  if (type == 'track') {
    polylineGraphic.symbol = LINE_SYMBOL_Track
  }
  graphicsLayer_local.add(polylineGraphic)
  // Không cần add graphicsLayer_local vào map mỗi lần vì đã add ở đầu hàm reRenderNen
}
export const setZoomMap = (zoom = 9) => {
  /**
   * Sét lại độ zoom của map
   *
   * @param zoom: Giá trị phóng to mặc định 9
   * @author XHieu
   */
  VIEW.zoom = zoom
}
export const setCenterMap = (
  arr = [105.82972326668407, 20.992903563656817],
  zoom = 9
) => {
  /**
   * Sét lại tâm của map, nó sẽ bay đến vị trí hiển thị các cột và đường
   *
   * @param arr: Tọa độ cần bay đến, mặc định: [105.82972326668407, 20.992903563656817]
   * @author XHieu
   */
  VIEW.goTo({
    center: [parseFloat(arr[0]), parseFloat(arr[1])],
    zoom: zoom
  })
}
export const getLength = () => {
  return 0
}
export const findCotByUUidCot = (
  uuid_folder_local,
  list_root_folder_local,
  uuid_cot_local
) => {
  /**
   * Tìm kiếm cột theo uuid cột
   *
   * @param uuid_folder_local: uuid của folder chứa cột
   * @param list_root_folder_local: danh sách root folder
   * @param uuid_cot_local: uuid của cột
   * @author XHieu
   */
  let rs = BASE_COT
  list_root_folder_local.map(item_root => {
    if (item_root.uuid_folder == uuid_folder_local) {
      item_root.list_group_duong_va_cot.map(item_duong_cot => {
        if (
          item_duong_cot.type == 'cot' &&
          item_duong_cot.uuid_cot == uuid_cot_local
        ) {
          rs = {
            ...rs,
            ...item_duong_cot,
            uuid_folder: uuid_folder_local
          }
          return
        }
      })
      return
    }
  })
  return rs
}
export const getIndexCot = (
  uuid_folder_local,
  list_root_folder_local,
  uuid_cot_local
) => {
  let rs = 0
  list_root_folder_local.map((item_root, index) => {
    if (item_root.uuid_folder == uuid_folder_local) {
      item_root.list_group_duong_va_cot.map((item_duong_cot, index2) => {
        if (
          item_duong_cot.type == 'cot' &&
          item_duong_cot.uuid_cot == uuid_cot_local
        ) {
          rs = index2
          return
        }
      })
      return
    }
  })
  return rs
}
export const disabledAllForm = () => {
  $('.form-rj').removeClass('d-block').addClass('d-none')
}
export const degrees_to_radians = degrees => {
  // Convert degrees to radians
  var pi = Math.PI
  return degrees * (pi / 180)
}
export const radians_to_degrees = radians => {
  // Convert radians to degrees
  var pi = Math.PI
  return radians * (180 / pi)
}
export const arrayInsert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
]

export const getLineFromPoint = arr_point => {
  /**
   * lấy ra danh sách path đường từ danh sách cột
   *
   * @param arr_point: danh sách các cột
   * @author XHieu
   */
  let arr = []
  for (const i in arr_point) {
    if (arr_point[i].type === 'cot') {
      arr.push([arr_point[i].coor[0], arr_point[i].coor[1]])
    }
  }
  setItemSessionStorage('path_line_of_point', arr)
  return arr
}

export const findMidLatLong = (lst_starend, number) => {
  /**
   * lấy ra các tọa độ cột cần chèn vào giữa 2 cột
   *
   * @param lst_starend: danh sách 2 cột bắt đầu và kết thúc
   * @param number: Số lượng muốn chèn
   * @author XHieu
   */
  try {
    // lấy tọa độ điểm kết thúc trừ tọa độ điểm bắt đầu chia cho số cột muốn chia sẽ đc khoảng cách
    // lấy khoảng cách ý cộng với các cột
    let A = lst_starend[1] // point kết thúc
    let B = lst_starend[0] // point bắt đầu
    let xA = parseFloat(A.latitude)
    let yA = parseFloat(A.longitude)
    let xB = parseFloat(B.latitude)
    let yB = parseFloat(B.longitude)
    let x_khoang_cach = parseFloat(parseFloat(xA - xB) / parseFloat(number))
    let y_khoang_cach = parseFloat(parseFloat(yA - yB) / parseFloat(number))
    let arr = []
    for (let i = 1; i < number; i++) {
      // vì bỏ cột bắt đầu đi nên i start = 1
      arr.push({
        longitude: parseFloat(yB + parseFloat(y_khoang_cach * i)),
        latitude: parseFloat(xB + parseFloat(x_khoang_cach * i))
      })
    }
    return arr
  } catch (err) {
    console.log(err)
  }
}

export const projectPointOntoPolyline = (point, polylinePaths) => {
  /**
   * Chiếu điểm lên polyline gần nhất
   * @param point: điểm cần chiếu {longitude, latitude}
   * @param polylinePaths: danh sách các path của polyline
   * @returns điểm được chiếu {longitude, latitude}
   */
  try {
    const pointGeometry = new Point({
      longitude: point.longitude,
      latitude: point.latitude
    })

    // Tìm đoạn gần nhất và chiếu điểm lên
    let minDistance = Infinity
    let closestPoint = point

    for (let path of polylinePaths) {
      for (let i = 0; i < path.length - 1; i++) {
        const segment = new Polyline({
          paths: [
            [path[i], path[i + 1]]
          ]
        })

        // Tìm điểm gần nhất trên polyline
        const nearestPoint = geometryEngine.nearestVertex(segment, pointGeometry)
        if (nearestPoint) {
          const distance = geometryEngine.distance(nearestPoint.vertex, pointGeometry, 'meters')
          if (distance < minDistance) {
            minDistance = distance
            closestPoint = {
              longitude: nearestPoint.vertex.longitude,
              latitude: nearestPoint.vertex.latitude
            }
          }
        }
      }
    }

    return closestPoint
  } catch (err) {
    console.log('Error projecting point onto polyline:', err)
    return point // Trả về điểm gốc nếu có lỗi
  }
}

export const findNearestPolyline = (point1, point2, polylines) => {
  /**
   * Tìm polyline gần nhất với 2 điểm
   * @param point1: điểm đầu {longitude, latitude}
   * @param point2: điểm cuối {longitude, latitude}
   * @param polylines: danh sách các polyline
   * @returns polyline gần nhất hoặc null
   */
  try {
    let bestPolyline = null
    let minTotalDistance = Infinity

    for (let polyline of polylines) {
      if (!polyline.active_do_duong || !polyline.list_do_duong) continue

      let totalDistance = 0
      
      // Tính khoảng cách từ mỗi điểm đến polyline
      for (let point of [point1, point2]) {
        const distances = []
        for (let path of polyline.list_do_duong) {
          for (let i = 0; i < path.length - 1; i++) {
            const p1 = new Point({ longitude: path[i][0], latitude: path[i][1] })
            const p2 = new Point({ longitude: path[i + 1][0], latitude: path[i + 1][1] })
            const segment = new Polyline({ paths: [[path[i], path[i + 1]]] })
            const pointGeometry = new Point({ longitude: point.longitude, latitude: point.latitude })
            const distance = geometryEngine.distance(p1, pointGeometry, 'meters') + 
                           geometryEngine.distance(p2, pointGeometry, 'meters')
            distances.push(distance)
          }
        }
        if (distances.length > 0) {
          totalDistance += Math.min(...distances)
        }
      }

      if (totalDistance < minTotalDistance) {
        minTotalDistance = totalDistance
        bestPolyline = polyline
      }
    }

    return bestPolyline
  } catch (err) {
    console.log('Error finding nearest polyline:', err)
    return null
  }
}
export const getTenCotNoSTT = name_cot => {
  let name = name_cot.trim()
  let count = getCountString(name, '').split('').reverse().join('')
  let pos = count.length
  return name.slice(0, name.length - pos)
}
export const getSTTCot = name_cot => {
  let count = getCountString(name_cot.trim(), '').split('').reverse().join('')
  if (isNumber(count)) {
    count = parseInt(count) + 1
  }
  return count
}
export const updateSTTCot = (
  list_root_folder_local,
  uuid_folder_local,
  ten_cot_thay_doi = null
) => {
  /**
   * Update thứ tự cột
   * @param uuid_folder_local: id của folder chứa list cột
   * @param list_root_folder_local: dữ liệu đọc từ file kml
   * @param ten_cot_thay_doi: tên của cột (không bao gồm thứ tự của cột đấy)
   * @author XHieu
   */
  for (let i in list_root_folder_local) {
    if (list_root_folder_local[i].uuid_folder === uuid_folder_local) {
      let stt = 1
      for (let j in list_root_folder_local[i].list_group_duong_va_cot) {
        let currrent_cot = list_root_folder_local[i].list_group_duong_va_cot[j]
        if (currrent_cot.type == 'cot') {
          let name_cot = currrent_cot.name.trim()
          let name_cot_no_stt = getTenCotNoSTT(name_cot)
          if (name_cot.includes(ten_cot_thay_doi)) {
            list_root_folder_local[i].list_group_duong_va_cot[j].name =
              name_cot_no_stt + stt
            stt++
          }
        }
      }
      break
    }
  }
  return list_root_folder_local
}
export const updateSTTCotByStartNumber = (
  list_root_folder_local,
  uuid_folder_local,
  stt = 1,
  ten_cot_thay_doi = 'cot',
  uuid_cot_local
) => {
  /**
   * Update thứ tự cột theo số bắt đầu và tên cột
   * @param uuid_folder_local: id của folder chứa list cột
   * @param list_root_folder_local: dữ liệu đọc từ file kml
   * @param ten_cot_thay_doi: tên của cột (không bao gồm thứ tự của cột đấy)
   * @author XHieu
   */
  for (let i in list_root_folder_local) {
    if (list_root_folder_local[i].uuid_folder === uuid_folder_local) {
      for (let j in list_root_folder_local[i].list_group_duong_va_cot) {
        let currrent_cot = list_root_folder_local[i].list_group_duong_va_cot[j]
        if (currrent_cot.type == 'cot') {
          if (currrent_cot.uuid_cot == uuid_cot_local) {
            list_root_folder_local[i].list_group_duong_va_cot[j].name =
              ten_cot_thay_doi + stt
            break
          }
        }
      }
      break
    }
  }
  return list_root_folder_local
}
export const handleXoaNhieuCot_Common = (
  list_root_folder_local,
  uuid_folder_local = null,
  state_sua_nhieu_cot
) => {
  /**
       * Xóa thông tin của 1 cột
       *

       * @param cot: thông tin của cột
       * @param list_root_folder_local: dữ liệu đọc từ file kml
       * @author XHieu
       */

  let result = window.confirm(
    'Bạn có chắc muốn xóa cột này \nBạn sẽ không thể khôi phục lại sau khi xóa'
  )

  if (result == true) {
    console.log('xóa')
    for (let i in list_root_folder_local) {
      if (list_root_folder_local[i].uuid_folder === uuid_folder_local) {
        for (let x = 0; x < state_sua_nhieu_cot.length; x++) {
          let cot_bi_xoa = list_root_folder_local[
            i
          ].list_group_duong_va_cot.filter(
            item => item.uuid_cot == state_sua_nhieu_cot[x].uuid_cot
          )[0]
          list_root_folder_local[i].list_group_duong_va_cot =
            list_root_folder_local[i].list_group_duong_va_cot.filter(
              item => item.uuid_cot != state_sua_nhieu_cot[x].uuid_cot
            )
          list_root_folder_local = updateSTTCot(
            [...list_root_folder_local],
            uuid_folder_local,
            getTenCotNoSTT(cot_bi_xoa.name.trim())
          )
        }

        $('.active-control[data-attr="xoa_cot"]').removeClass('active-gray')
        $('.check-delete-cot').prop('checked', false)
        return list_root_folder_local
      }
    }
  }
}
export const updateImgPoint = (
  state_sua_nhieu_cot_local,
  list_root_folder_local
) => {
  /**
       * Update lại ảnh của point
       *

       * @param state_sua_nhieu_cot_local: state sửa cột bao gồm danh sách cột cần sửa, 
            chỉ áp dụng cho chức năng sửa xóa nhiều cột
       * @param list_root_folder_local: dữ liệu đọc từ file kml
       * @author XHieu
       */
  let url_img = SIMPLE_MARKER_SYMBOL4.url
  state_sua_nhieu_cot_local.map(item => {
    list_root_folder_local.map(item_root => {
      if (item_root && item_root.uuid_folder === item.uuid_folder) {
        item_root.list_group_duong_va_cot.map(item_duong_cot => {
          if (
            item_duong_cot &&
            item_duong_cot.type === 'cot' &&
            item_duong_cot.uuid_cot === item.uuid_cot
          ) {
            console.log('addd')
            item_duong_cot.pre_src_icon = item_duong_cot.src_icon
            item_duong_cot.src_icon = url_img
            return
          }
        })
        return
      }
    })
  })

  return list_root_folder_local
}

export const getIndexCotForManualInsert = (lon, lat, list_root_folder_local, current_uuid_folder_local) => {
  /**
   * Tìm index phù hợp để chèn cột giữa 2 cột gần nhất
   * 
   * @param lon: kinh độ điểm click
   * @param lat: vĩ độ điểm click
   * @param list_root_folder_local: danh sách folder
   * @param current_uuid_folder_local: uuid folder hiện tại
   * @returns index để chèn cột
   */
  
  if (!list_root_folder_local || list_root_folder_local.length === 0) {
    console.log('Không tìm thấy list_root_folder')
    return -1
  }
  
  if (!current_uuid_folder_local) {
    console.log('Không có current_uuid_folder')
    return -1
  }
  
  let bestIndex = -1
  let minDistance = Infinity
  
  console.log('Tìm folder:', current_uuid_folder_local)
  console.log('Trong', list_root_folder_local.length, 'folders')
  
  // Tìm folder hiện tại
  list_root_folder_local.forEach(folder => {
    if (folder.uuid_folder === current_uuid_folder_local) {
      console.log('Tìm thấy folder:', folder.folder_name)
      
      const cots = folder.list_group_duong_va_cot.filter(item => item.type === 'cot')
      console.log('Số cột trong folder:', cots.length)
      
      if (cots.length === 0) {
        console.log('Không có cột nào')
        return -1
      }
      
      // Tìm cột gần nhất với điểm click
      let distances = cots.map((cot) => {
        const index = folder.list_group_duong_va_cot.findIndex(i => i.uuid_cot === cot.uuid_cot)
        return {
          index: index,
          cot: cot,
          distance: Math.sqrt(
            Math.pow(cot.coor[0] - lon, 2) + 
            Math.pow(cot.coor[1] - lat, 2)
          )
        }
      })
      
      // Sắp xếp theo khoảng cách
      distances.sort((a, b) => a.distance - b.distance)
      
      console.log('Cột gần nhất:', distances[0].cot.name, 'Distance:', distances[0].distance)
      
      if (distances.length > 0) {
        bestIndex = distances[0].index
      }
    }
  })
  
  console.log('Best index:', bestIndex)
  return bestIndex
}
