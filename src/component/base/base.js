import $ from 'jquery'

var url = window.location.href.split('/')
// let URL_HTTP = url[0] + "/" + "/" + url[2] + "/" + url[3] + "/"
// if (url[3].length == 0) {
//     URL_HTTP = url[0] + "/" + "/" + url[2] + "/" + url[4] + "/"
// }
export const URL_HTTP = window.location.origin + '/'
console.log(URL_HTTP);
// const URL_HTTP = 'https://spec.edu.vn/etool/'
const TOKENHEADER_VALUE = getCookie('Authorization')
const URL_API_GET = URL_HTTP + 'api/v1/private-get/'
const URL_API_EDIT = URL_HTTP + 'api/v1/private-edit/'
$(function () {})
export function downloadFile (file) {
  const element = document.createElement('a')
  element.setAttribute('href', file)
  element.setAttribute('download', 'jdjdj')
  element.setAttribute('target', '_blank')
  // element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
export function isNumber (n) {
  /**
   * Kiểm tra string chuyền vào có phải là số hay không
   *
   * @param n : string
   * @author XHieu
   */
  return /^-?\d+$/.test(n)
}
export function getRGBColor (ev) {
  /**
   * Lấy ra mã màu dạng rgb
   * @param ev : giá trị màu từ input type color
   * @author XHieu
   */
  const color = ev
  const r = parseInt(color.substr(1, 2), 16)
  const g = parseInt(color.substr(3, 2), 16)
  const b = parseInt(color.substr(5, 2), 16)
  return [r, g, b,255]
}
export function rgbToHex(arr) {
  return "#" + ((1 << 24) + (arr[0] << 16) + (arr[1] << 8) + arr[2]).toString(16).slice(1);
}

export const alertConfirm = title => {
  // alertConfirm
  return window.confirm(title)
}

export const getCountString = (str, A = '') => {
  /**
   * lấy ra số ở cuối của string
   * input: hieu1234 -> output: 1234
   * @param str : string
   * @author XHieu
   */
  if (isNumber(str.slice(str.length - 1, str.length))) {
    A += str.slice(str.length - 1, str.length)
    return getCountString(str.slice(0, str.length - 1), A)
  }
  return A
}
export function debounce (func, delay) {
  /**
   * debounce trong js, lên gg xem tài liệu nhé
   * Mục đích hạn chế xử lý sự thay đổi của input
   * @param func : function
   * @param delay : thời gian chờ trước khi xử lý
   * @author XHieu
   */
  let timeout
  return function executedFunc (...args) {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, delay)
  }
}
export function throttle (callback, limit) {
  /**
   * tương tự debounce trong js, lên gg xem tài liệu nhé
   * Mục đích hạn chế số lượng sử lý thay đổi của input trong 1 khoảng time
   * @param callback : funcition
   * @param limit : số lần sử lý
   * @author XHieu
   */
  var waiting = false // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!waiting) {
      // If we're not waiting
      callback.apply(this, arguments) // Execute users function
      waiting = true // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        waiting = false // And allow future invocations
      }, limit)
    }
  }
}
export function create_UUID () {
  /**
   * Create UUID thôi
   *
   * @param no
   * @author XHieu
   */
  var temp_url = URL.createObjectURL(new Blob())
  var uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url)
  return uuid.substr(uuid.lastIndexOf('/') + 1)
}
export function nonAccentVietnamese (str) {
  /**
   * Chuyển ký tự tiếng việt sang tiếng Anh
   *
   * @param str: string
   * @author XHieu
   */
  str = str.toLowerCase()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
  return str
}

// get cookie
export function getCookie (name) {
  try {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) {
      return match[2]
    } else {
      return ''
    }
  } catch (e) {
    return ''
  }
}

//copy to clipboard
export function copyToClipboard (id) {
  console.log(id)
  let copyText = document.getElementById(id)
  console.log(copyText)
  copyText.select()
  copyText.setSelectionRange(0, 99999)
  navigator.clipboard
    .writeText(copyText.value)
    .then(() => {
      alertSuccess('Đã coppy vào clipboard')
    })
    .catch(error => {
      alert(`Copy failed!`)
    })
}

/*Đăng xuất ra khỏi tk*/
export function logOut () {
  document.cookie = `Authorization=${TOKENHEADER_VALUE};max-age=` + 0
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  localStorage.clear()
  sessionStorage.clear()
  window.location.href = 'login'
}

/*notify để custom alert */
//alert notify
//***************alter
export function alertSuccess (text, time = 1000) {
  $.notify(
    {
      icon: 'far fa-check-circle',
      message: text
    },
    {
      delay: time,
      offset: { x: 15, y: 15 },
      type: 'success',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      z_index: 1031000000000
    }
  )
}

export function alertInfo (text, time = 1000) {
  $.notify(
    {
      icon: 'fas fa-info-circle',
      message: text
    },
    {
      delay: time,
      offset: { x: 15, y: 15 },
      type: 'info',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      z_index: 1031000000000
    }
  )
}

export function alertWarning (text, time = 1000) {
  $.notify(
    {
      icon: 'fas fa-exclamation',
      message: text
    },
    {
      delay: time,
      offset: { x: 55, y: 15 },
      type: 'warning',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      z_index: 1031
    }
  )
}

export function alertDanger (text, time = 1000) {
  $.notify(
    {
      icon: 'fas fa-exclamation-triangle',
      message: text
    },
    {
      timer: 1000,
      delay: time,
      offset: { x: 15, y: 15 },
      type: 'danger',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      z_index: 1031000000000
    }
  )
}

/*get data*/
export async function ajaxCallGet (url) {
  let rs = null
  if (url.includes('?')) url = url.concat('&token=' + TOKENHEADER_VALUE)
  else url = url.concat('?token=' + TOKENHEADER_VALUE)
  await $.ajax({
    type: 'GET',
    dataType: 'json',
    url: URL_API_GET + url,
    timeout: 10000,
    success: function (result) {
      rs = result
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown)
    }
  })
  return rs
}

/*upload file, image....*/
export async function ajaxCallUploadFile (url, file) {
  let data
  if (url.includes('?')) url = url.concat('&token=' + TOKENHEADER_VALUE)
  else url = url.concat('?token=' + TOKENHEADER_VALUE)
  await $.ajax({
    type: 'POST',
    url: 'https://spec.edu.vn/qlbh/api/v1/private-edit/' + url,
    data: file,
    cache: false,
    contentType: false,
    enctype: 'multipart/form-data',
    processData: false,
    success: function (result) {
      data = result.data
    },
    error: function (err) {
      console.log(err)
    }
  })
  return data
}

/*post data*/
export async function ajaxCallPost (url, dataUser) {
  let rs = null
  await $.ajax({
    type: 'POST',
    data: JSON.stringify(dataUser),
    url: URL_API_EDIT + url,
    timeout: 30000,
    contentType: 'application/json',
    success: function (result) {
      rs = result
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown)
    }
  })
  return rs
}

/*put data*/
export async function ajaxCallPut (url, dataUser) {
  let rs = null
  if (url.includes('?')) url = url.concat('&token=' + TOKENHEADER_VALUE)
  else url = url.concat('?token=' + TOKENHEADER_VALUE)
  await $.ajax({
    type: 'PUT',
    data: JSON.stringify(dataUser),
    url: URL_API_EDIT + url,
    timeout: 30000,
    contentType: 'application/json',
    success: function (result) {
      rs = result
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown)
    }
  })
  return rs
}

/*set key-val để lưu vào local storage*/
export function setItemLocalStorage (key, val) {
  localStorage.setItem(key, JSON.stringify(val))
} /*get key-val để lưu vào local storage*/
export function getItemLocalStorage (key) {
  return JSON.parse(localStorage.getItem(key))
}

/*set key-val để lưu vào local storage*/
export function setItemSessionStorage (key, val) {
  sessionStorage.setItem(key, JSON.stringify(val))
} /*get key-val để lưu vào local storage*/
export function getItemSessionStorage (key) {
  return JSON.parse(sessionStorage.getItem(key))
}

//format input type number
export function formatNumber (nStr, decSeperate, groupSeperate) {
  try {
    nStr += ''
    let x = nStr.split(decSeperate)
    let x1 = x[0]
    let x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + groupSeperate + '$2')
    }
    return x1 + x2
  } catch (e) {
    console.log(e)
    return nStr
  }
}

// trả ngày của tháng và năm
export function daysInMonth (year, month) {
  return new Date(year, month, 0).getDate()
}

//format input type number
export function formatFees (nStr, decSeperate, groupSeperate) {
  try {
    nStr += ''
    let arr = nStr.split(decSeperate)
    if (arr.length > 0) {
      // nếu phần chuỗi sau dính dấu "," nó sẽ cắt bỏ đi rồi mới gán
      arr = arr.toString().replaceAll(',', '')
      nStr = arr
    }
    nStr += ''
    let x = nStr.split(decSeperate)
    let x1 = x[0]
    let x2 = x.length > 1 ? ',' + x[1] : ''
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + groupSeperate + '$2')
    }
    return x1 + x2
  } catch (e) {
    console.log(e)
    return nStr
  }
}
