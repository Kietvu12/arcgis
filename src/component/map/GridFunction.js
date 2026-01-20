import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic'
import Polygon from '@arcgis/core/geometry/Polygon'
import Polyline from '@arcgis/core/geometry/Polyline'
import Point from '@arcgis/core/geometry/Point'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import TextSymbol from '@arcgis/core/symbols/TextSymbol'
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'
import * as elevationService from '@arcgis/core/rest/elevationService'
import { MAP, VIEW } from './RootFunction'

// GraphicsLayer cho lưới
export let GRID_LAYER = null
let isDrawingGrid = false
let clickHandler = null
let startPoint = null
let tempRectangle = null
let startPointGraphic = null
let endPointGraphic = null

// Khởi tạo GraphicsLayer cho lưới
export const initGridLayer = () => {
  if (!GRID_LAYER) {
    GRID_LAYER = new GraphicsLayer()
    MAP.add(GRID_LAYER)
  }
  return GRID_LAYER
}

// Xóa lưới hiện tại
export const clearGrid = () => {
  if (GRID_LAYER) {
    GRID_LAYER.removeAll()
  }
}

// Bắt đầu vẽ lưới
export const startDrawingGrid = (onComplete) => {
  if (isDrawingGrid) {
    stopDrawingGrid()
  }

  initGridLayer()
  clearGrid()
  
  isDrawingGrid = true
  startPoint = null
  tempRectangle = null

  // Tạo symbol cho rectangle tạm thời
  const fillSymbol = {
    type: 'simple-fill',
    color: [0, 0, 255, 0.1],
    outline: {
      color: [0, 0, 255, 0.7],
      width: 2
    }
  }

  // Symbol cho điểm bắt đầu (màu xanh)
  const startPointSymbol = new SimpleMarkerSymbol({
    style: 'circle',
    color: [0, 255, 0, 0.8],
    size: 12,
    outline: {
      color: [255, 255, 255, 1],
      width: 2
    }
  })

  // Symbol cho điểm kết thúc (màu đỏ)
  const endPointSymbol = new SimpleMarkerSymbol({
    style: 'circle',
    color: [255, 0, 0, 0.8],
    size: 12,
    outline: {
      color: [255, 255, 255, 1],
      width: 2
    }
  })

  // Lắng nghe click event để vẽ rectangle
  clickHandler = VIEW.on('click', (event) => {
    // Kiểm tra mapPoint có tồn tại không
    if (!event || !event.mapPoint) {
      console.error('Invalid click event or mapPoint')
      return
    }

    const mapPoint = event.mapPoint

    if (!startPoint) {
      // Click đầu tiên - lưu điểm bắt đầu và hiển thị marker
      startPoint = mapPoint
      VIEW.cursor = 'crosshair'
      
      // Xóa điểm cũ nếu có
      if (startPointGraphic) {
        GRID_LAYER.remove(startPointGraphic)
      }
      
      // Hiển thị điểm bắt đầu
      const startPointGeometry = new Point({
        longitude: startPoint.longitude,
        latitude: startPoint.latitude,
        spatialReference: startPoint.spatialReference
      })

      startPointGraphic = new Graphic({
        geometry: startPointGeometry,
        symbol: startPointSymbol
      })

      GRID_LAYER.add(startPointGraphic)
      
      console.log('Điểm bắt đầu:', startPoint.longitude, startPoint.latitude)
    } else {
      // Click thứ hai - tạo rectangle và lưới
      const endPoint = mapPoint
      
      // Hiển thị điểm kết thúc
      if (endPointGraphic) {
        GRID_LAYER.remove(endPointGraphic)
      }
      
      const endPointGeometry = new Point({
        longitude: endPoint.longitude,
        latitude: endPoint.latitude,
        spatialReference: endPoint.spatialReference
      })

      endPointGraphic = new Graphic({
        geometry: endPointGeometry,
        symbol: endPointSymbol
      })

      GRID_LAYER.add(endPointGraphic)
      
      console.log('Điểm kết thúc:', endPoint.longitude, endPoint.latitude)
      
      // Tạo polygon rectangle
      const minX = Math.min(startPoint.longitude, endPoint.longitude)
      const maxX = Math.max(startPoint.longitude, endPoint.longitude)
      const minY = Math.min(startPoint.latitude, endPoint.latitude)
      const maxY = Math.max(startPoint.latitude, endPoint.latitude)
      
      const rectangleGeometry = new Polygon({
        rings: [[
          [minX, minY],
          [maxX, minY],
          [maxX, maxY],
          [minX, maxY],
          [minX, minY]
        ]],
        spatialReference: startPoint.spatialReference
      })

      // Xóa rectangle tạm thời
      if (tempRectangle) {
        GRID_LAYER.remove(tempRectangle)
        tempRectangle = null
      }

      // Tạo lưới từ rectangle
      createGridFromExtent(rectangleGeometry, onComplete)
      stopDrawingGrid()
    }
  })

  // Lắng nghe pointer-move để vẽ rectangle tạm thời
  const moveHandler = VIEW.on('pointer-move', (event) => {
    if (startPoint && event && event.mapPoint) {
      const currentPoint = event.mapPoint
      
      // Xóa rectangle cũ
      if (tempRectangle) {
        GRID_LAYER.remove(tempRectangle)
      }

      // Tạo rectangle mới
      const minX = Math.min(startPoint.longitude, currentPoint.longitude)
      const maxX = Math.max(startPoint.longitude, currentPoint.longitude)
      const minY = Math.min(startPoint.latitude, currentPoint.latitude)
      const maxY = Math.max(startPoint.latitude, currentPoint.latitude)
      
      const rectangleGeometry = new Polygon({
        rings: [[
          [minX, minY],
          [maxX, minY],
          [maxX, maxY],
          [minX, maxY],
          [minX, minY]
        ]],
        spatialReference: startPoint.spatialReference
      })

      tempRectangle = new Graphic({
        geometry: rectangleGeometry,
        symbol: fillSymbol
      })

      GRID_LAYER.add(tempRectangle)
    }
  })

  // Lưu moveHandler để có thể remove sau
  clickHandler.moveHandler = moveHandler

  return clickHandler
}

// Dừng vẽ lưới
export const stopDrawingGrid = () => {
  if (clickHandler) {
    clickHandler.remove()
    if (clickHandler.moveHandler) {
      clickHandler.moveHandler.remove()
    }
    clickHandler = null
  }
  
  if (tempRectangle) {
    if (GRID_LAYER) {
      GRID_LAYER.remove(tempRectangle)
    }
    tempRectangle = null
  }

  // Xóa các điểm marker
  if (startPointGraphic && GRID_LAYER) {
    GRID_LAYER.remove(startPointGraphic)
    startPointGraphic = null
  }

  if (endPointGraphic && GRID_LAYER) {
    GRID_LAYER.remove(endPointGraphic)
    endPointGraphic = null
  }
  
  startPoint = null
  VIEW.cursor = 'default'
  isDrawingGrid = false
}

// Tạo lưới từ extent (hình chữ nhật)
export const createGridFromExtent = async (extentGeometry, onComplete) => {
  if (!extentGeometry || extentGeometry.type !== 'polygon') {
    console.error('Invalid extent geometry')
    return
  }

  // Lấy thông tin từ người dùng về số hàng và cột
  const rows = parseInt(window.prompt('Nhập số hàng của lưới:', '10')) || 10
  const cols = parseInt(window.prompt('Nhập số cột của lưới:', '10')) || 10

  if (rows <= 0 || cols <= 0) {
    window.alert('Số hàng và số cột phải lớn hơn 0')
    return
  }

  // Lấy tọa độ của extent
  const rings = extentGeometry.rings[0]
  const minX = Math.min(...rings.map(p => p[0]))
  const maxX = Math.max(...rings.map(p => p[0]))
  const minY = Math.min(...rings.map(p => p[1]))
  const maxY = Math.max(...rings.map(p => p[1]))

  const width = maxX - minX
  const height = maxY - minY
  const cellWidth = width / cols
  const cellHeight = height / rows

  // Tạo các điểm lưới
  const gridPoints = []
  const gridLines = []

  // Tạo các đường lưới dọc
  for (let i = 0; i <= cols; i++) {
    const x = minX + (i * cellWidth)
    const path = [
      [x, minY],
      [x, maxY]
    ]
    gridLines.push(path)
  }

  // Tạo các đường lưới ngang
  for (let i = 0; i <= rows; i++) {
    const y = minY + (i * cellHeight)
    const path = [
      [minX, y],
      [maxX, y]
    ]
    gridLines.push(path)
  }

  // Vẽ các đường lưới
  const lineSymbol = new SimpleLineSymbol({
    color: [0, 0, 255, 0.5],
    width: 2,
    style: 'solid'
  })

  gridLines.forEach((path, index) => {
    const polyline = new Polyline({
      paths: [path],
      spatialReference: extentGeometry.spatialReference
    })

    const lineGraphic = new Graphic({
      geometry: polyline,
      symbol: lineSymbol
    })

    GRID_LAYER.add(lineGraphic)
  })

  // Tạo tất cả các điểm lưới (bao gồm cả điểm trên cạnh)
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const x = minX + (col * cellWidth)
      const y = minY + (row * cellHeight)
      
      gridPoints.push({
        x,
        y,
        row,
        col,
        isCorner: (row === 0 || row === rows) && (col === 0 || col === cols),
        isEdge: (row === 0 || row === rows || col === 0 || col === cols) && !((row === 0 || row === rows) && (col === 0 || col === cols)),
        isInner: row > 0 && row < rows && col > 0 && col < cols
      })
    }
  }

  // Vẽ các điểm lưới
  const pointSymbol = new SimpleMarkerSymbol({
    style: 'circle',
    color: [255, 0, 0, 0.8],
    size: 8,
    outline: {
      color: [255, 255, 255, 1],
      width: 1
    }
  })

  // Lấy tọa độ cao độ cho tất cả các điểm
  const coordinatesWithElevation = await getElevationForPoints(gridPoints, extentGeometry.spatialReference)

  // Vẽ các điểm và lưu tọa độ
  coordinatesWithElevation.forEach((point, index) => {
    const pointGeometry = new Point({
      longitude: point.x,
      latitude: point.y,
      spatialReference: extentGeometry.spatialReference
    })

    const pointGraphic = new Graphic({
      geometry: pointGeometry,
      symbol: pointSymbol
    })

    // Thêm label cho điểm
    const labelSymbol = new TextSymbol({
      color: 'black',
      text: `${point.row},${point.col}`,
      font: {
        size: 10,
        family: 'Arial'
      },
      haloColor: 'white',
      haloSize: 1
    })

    const labelPoint = new Point({
      longitude: point.x,
      latitude: point.y + (cellHeight * 0.02), // Offset label lên trên một chút
      spatialReference: extentGeometry.spatialReference
    })

    const labelGraphic = new Graphic({
      geometry: labelPoint,
      symbol: labelSymbol
    })

    GRID_LAYER.add(pointGraphic)
    GRID_LAYER.add(labelGraphic)
  })

  // Gọi callback với dữ liệu tọa độ
  if (onComplete) {
    onComplete(coordinatesWithElevation)
  }

  return coordinatesWithElevation
}

// Lấy cao độ cho các điểm sử dụng nhiều phương pháp
export const getElevationForPoints = async (points, spatialReference) => {
  try {
    console.log(`Querying elevation for ${points.length} points...`)
    console.log('Spatial reference:', spatialReference)
    
    const allPointsWithElevation = []
    
    // Chia points thành các batch để query
    const batchSize = 100
    const batches = []
    for (let i = 0; i < points.length; i += batchSize) {
      batches.push(points.slice(i, i + batchSize))
    }

    // Thử nhiều phương pháp để lấy elevation
    for (const batch of batches) {
      let batchProcessed = false
      
      // Phương pháp 1: Thử VIEW.ground.queryElevation (ArcGIS built-in)
      if (!batchProcessed && VIEW && VIEW.ground && VIEW.ground.queryElevation) {
        try {
          console.log('Trying VIEW.ground.queryElevation for batch of', batch.length, 'points')
          
          const pointGeometries = batch.map(point => new Point({
            x: point.x,
            y: point.y,
            spatialReference: spatialReference || VIEW.spatialReference
          }))
          
          const result = await VIEW.ground.queryElevation(pointGeometries, {
            returnSampleInfo: false
          })
          
          console.log('VIEW.ground.queryElevation result:', result)
          
          if (result && result.geometries && Array.isArray(result.geometries)) {
            batch.forEach((point, index) => {
              const geometry = result.geometries[index]
              let elevation = 0
              
              if (geometry && geometry.z !== undefined && geometry.z !== null) {
                elevation = parseFloat(geometry.z)
              } else if (geometry && geometry.hasZ && geometry.z !== undefined) {
                elevation = parseFloat(geometry.z)
              }
              
              allPointsWithElevation.push({
                ...point,
                longitude: point.x,
                latitude: point.y,
                elevation: elevation
              })
            })
            batchProcessed = true
            console.log('Successfully got elevation from VIEW.ground.queryElevation')
          }
        } catch (err) {
          console.warn('VIEW.ground.queryElevation error:', err)
        }
      }

      // Phương pháp 2: Thử Open Elevation API
      if (!batchProcessed) {
        try {
          const locations = batch.map(point => ({
            latitude: point.y,
            longitude: point.x
          }))

          console.log('Trying Open Elevation API for batch of', batch.length, 'points')
          console.log('Sample locations:', locations.slice(0, 3))
          
          const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              locations: locations
            })
          })

          console.log('Open Elevation API response status:', response.status, response.statusText)

          if (response.ok) {
            const data = await response.json()
            console.log('Open Elevation API response data:', data)
            console.log('Response results count:', data.results ? data.results.length : 0)
            console.log('Expected batch count:', batch.length)
            
            if (data.results && Array.isArray(data.results) && data.results.length === batch.length) {
              batch.forEach((point, index) => {
                const result = data.results[index]
                console.log(`Point ${index + 1} result:`, result)
                
                const elevation = result && result.elevation !== undefined && result.elevation !== null
                  ? parseFloat(result.elevation) 
                  : 0
                
                console.log(`Point ${index + 1} elevation:`, elevation)
                
                allPointsWithElevation.push({
                  ...point,
                  longitude: point.x,
                  latitude: point.y,
                  elevation: elevation
                })
              })
              batchProcessed = true
              console.log('Successfully got elevation from Open Elevation API')
            } else {
              console.warn('Open Elevation API response format mismatch:', {
                hasResults: !!data.results,
                resultsLength: data.results ? data.results.length : 0,
                expectedLength: batch.length
              })
            }
          } else {
            const errorText = await response.text()
            console.warn('Open Elevation API failed:', response.status, errorText)
          }
        } catch (err) {
          console.warn('Open Elevation API error:', err)
          console.warn('Error details:', err.message, err.stack)
        }
      }

      // Phương pháp 2: Thử 3D Elevation API (alternative)
      if (!batchProcessed) {
        try {
          console.log('Trying 3D Elevation API for batch of', batch.length, 'points')
          
          // Sử dụng elevation-api.io
          const locations = batch.map(point => `${point.y},${point.x}`).join('|')
          const response = await fetch(`https://api.elevation-api.com/api/v1/lookup?locations=${encodeURIComponent(locations)}`)
          
          if (response.ok) {
            const data = await response.json()
            console.log('3D Elevation API response:', data)
            
            if (data.results && Array.isArray(data.results)) {
              batch.forEach((point, index) => {
                const result = data.results[index]
                const elevation = result && result.elevation !== undefined && result.elevation !== null
                  ? parseFloat(result.elevation) 
                  : 0
                
                allPointsWithElevation.push({
                  ...point,
                  longitude: point.x,
                  latitude: point.y,
                  elevation: elevation
                })
              })
              batchProcessed = true
              console.log('Successfully got elevation from 3D Elevation API')
            }
          }
        } catch (err) {
          console.warn('3D Elevation API error:', err)
        }
      }

      // Phương pháp 3: Thử ArcGIS JS API ElevationService
      if (!batchProcessed) {
        try {
          console.log('Trying ArcGIS JS API ElevationService for batch of', batch.length, 'points')
          
          const elevationServiceUrl = 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
          
          // Tạo Point geometries cho ArcGIS
          const pointGeometries = batch.map(point => new Point({
            x: point.x,
            y: point.y,
            spatialReference: spatialReference || { wkid: 4326 }
          }))
          
          // Sử dụng queryElevation từ elevationService
          const result = await elevationService.queryElevation(elevationServiceUrl, {
            geometries: pointGeometries,
            returnSampleInfo: false
          })
          
          console.log('ArcGIS ElevationService result:', result)
          
          if (result.geometries && Array.isArray(result.geometries)) {
            batch.forEach((point, index) => {
              const geometry = result.geometries[index]
              let elevation = 0
              
              if (geometry && geometry.z !== undefined && geometry.z !== null) {
                elevation = parseFloat(geometry.z)
              } else if (geometry && geometry.hasZ && geometry.z !== undefined) {
                elevation = parseFloat(geometry.z)
              }
              
              allPointsWithElevation.push({
                ...point,
                longitude: point.x,
                latitude: point.y,
                elevation: elevation
              })
            })
            batchProcessed = true
            console.log('Successfully got elevation from ArcGIS JS API ElevationService')
          }
        } catch (err) {
          console.warn('ArcGIS JS API ElevationService error:', err)
        }
      }

      // Phương pháp 4: Thử ArcGIS REST API trực tiếp với identify
      if (!batchProcessed) {
        try {
          console.log('Trying ArcGIS REST API identify for batch of', batch.length, 'points')
          
          const elevationServiceUrl = 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
          
          // Query từng điểm một
          const batchResults = await Promise.all(
            batch.map(async (point, index) => {
              try {
                const identifyUrl = `${elevationServiceUrl}/identify`
                const params = new URLSearchParams({
                  f: 'json',
                  geometry: JSON.stringify({
                    x: point.x,
                    y: point.y,
                    spatialReference: spatialReference || { wkid: 4326 }
                  }),
                  geometryType: 'esriGeometryPoint',
                  returnCatalogItems: 'false',
                  returnGeometry: 'false'
                })
                
                const response = await fetch(identifyUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: params
                })

                if (response.ok) {
                  const data = await response.json()
                  console.log(`Point ${index + 1} identify response:`, data)
                  
                  let elevation = 0
                  if (data.value !== undefined && data.value !== null) {
                    elevation = parseFloat(data.value)
                  } else if (data.results && data.results.length > 0 && data.results[0].value !== undefined) {
                    elevation = parseFloat(data.results[0].value)
                  }
                  
                  return {
                    ...point,
                    longitude: point.x,
                    latitude: point.y,
                    elevation: elevation
                  }
                } else {
                  const errorText = await response.text()
                  console.warn(`Point ${index + 1} identify failed:`, response.status, errorText)
                }
              } catch (err) {
                console.warn(`Error querying elevation for point ${index + 1}:`, err)
              }
              
              return {
                ...point,
                longitude: point.x,
                latitude: point.y,
                elevation: 0
              }
            })
          )
          
          allPointsWithElevation.push(...batchResults)
          batchProcessed = true
        } catch (err) {
          console.error('ArcGIS REST API error:', err)
        }
      }

      // Nếu tất cả đều fail, set elevation = 0
      if (!batchProcessed) {
        console.warn('All elevation services failed, setting elevation to 0')
        batch.forEach((point) => {
          allPointsWithElevation.push({
            ...point,
            longitude: point.x,
            latitude: point.y,
            elevation: 0
          })
        })
      }
    }

    // Log kết quả
    const nonZeroElevations = allPointsWithElevation.filter(p => p.elevation !== 0).length
    console.log('Elevation query completed:', {
      total: allPointsWithElevation.length,
      withElevation: nonZeroElevations,
      withoutElevation: allPointsWithElevation.length - nonZeroElevations,
      sample: allPointsWithElevation.slice(0, 5).map(p => ({ 
        lon: p.longitude.toFixed(6), 
        lat: p.latitude.toFixed(6), 
        elev: p.elevation 
      }))
    })

    return allPointsWithElevation
  } catch (error) {
    console.error('Error getting elevation:', error)
    // Trả về points với elevation = 0 nếu có lỗi
    return points.map(point => ({
      ...point,
      longitude: point.x,
      latitude: point.y,
      elevation: 0
    }))
  }
}

// Xuất tọa độ ra file CSV hoặc hiển thị
export const exportGridCoordinates = (coordinates) => {
  // Tạo CSV content
  let csvContent = 'STT,Row,Col,Kinh độ,Vĩ độ,Cao độ,Loại điểm\n'
  
  coordinates.forEach((coord, index) => {
    const type = coord.isCorner ? 'Góc' : coord.isEdge ? 'Cạnh' : 'Trong lưới'
    csvContent += `${index + 1},${coord.row},${coord.col},${coord.longitude},${coord.latitude},${coord.elevation},${type}\n`
  })

  // Tạo và download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `grid_coordinates_${new Date().getTime()}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Hiển thị thông báo
  window.alert(`Đã xuất ${coordinates.length} điểm lưới ra file CSV`)
}
