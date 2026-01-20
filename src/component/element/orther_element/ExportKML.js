import $ from 'jquery'

export const handleExportKML = list_root_folder_local => {
  console.log(list_root_folder_local)
  let doc = $.parseXML(
    `<?xml version="1.0" encoding="utf-8"?>
        <kml xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns="http://www.opengis.net/kml/2.2">
            <Document>
            <name>
			PROJECT POTECO
		</name>
    <StyleMap id="multiTrack33">
    <Pair>
      <key>normal</key>
      <styleUrl>#multiTrack_n6</styleUrl>
    </Pair>
    <Pair>
      <key>highlight</key>
      <styleUrl>#multiTrack_h6</styleUrl>
    </Pair>
  </StyleMap>
  <Style id="multiTrack_h6">
    <IconStyle>
      <scale>1.2</scale>
      <Icon>
        <href>https://earth.google.com/images/kml-icons/track-directional/track-0.png</href>
      </Icon>
    </IconStyle>
    <LineStyle>
      <width>8</width>
      <color>99ffac59</color>
    </LineStyle>
  </Style>
  <Style id="multiTrack_n6">
    <IconStyle>
      <scale>1.2</scale>
      <Icon>
        <href>https://earth.google.com/images/kml-icons/track-directional/track-0.png</href>
      </Icon>
    </IconStyle>
    <LineStyle>
      <width>6</width>
      <color>99ffac59</color>
    </LineStyle>
  </Style>
  <Style id="line-w2">
    <LineStyle>
      <width>1</width>
      <color>ff2dc0fb</color>
    </LineStyle>
  </Style>
  <Style id="s_ylw-pushpin">
    <IconStyle>
      <scale>1.1</scale>
      <color>ff02c8f1</color>
      <Icon>
        <href>http://maps.google.com/mapfiles/kml/paddle/A.png</href>
      </Icon>
    </IconStyle>
  </Style>
  <Style id="s_ylw-pushpin_hl">
    <IconStyle>
      <scale>1.3</scale>
      <color>ff02c8f1</color>
      <Icon>
        <href>http://maps.google.com/mapfiles/kml/paddle/A.png</href>
      </Icon>
    </IconStyle>
  </Style>
  <StyleMap id="m_ylw-pushpin">
    <Pair>
      <key>normal</key>
      <styleUrl>#s_ylw-pushpin</styleUrl>
    </Pair>
    <Pair>
      <key>highlight</key>
      <styleUrl>#s_ylw-pushpin_hl</styleUrl>
    </Pair>
  </StyleMap>
            </Document>
        </kml>
        `
  )
  let jsonList = list_root_folder_local
  let root_xml = doc.getElementsByTagName('kml')[0]
  var xml = doc.getElementsByTagName('Document')[0]
  for (let i in jsonList) {
    let root_folder = createRootFolder(jsonList[i].folder_name, doc)
    let list_group_duong_va_cot = jsonList[i].list_group_duong_va_cot
    for (let j in list_group_duong_va_cot) {
      if (list_group_duong_va_cot[j].type == 'cot') {
        let placemark_cot = createPlaceMark_COT(list_group_duong_va_cot[j], doc)
        root_folder.appendChild(placemark_cot)
      } else if (list_group_duong_va_cot[j].type == 'track') {
        // let placemark_duong_track = createPlaceMark_Track(
        //   list_group_duong_va_cot[j],
        //   doc
        // )
        // root_folder.appendChild(placemark_duong_track)
      } else {
        let placemark_duong = createPlaceMark_DUONG(
          list_group_duong_va_cot[j],
          doc
        )
        root_folder.appendChild(placemark_duong)
      }
    }
    xml.appendChild(root_folder)
  }
  root_xml.appendChild(xml)
  var filename = 'file.kml'
  var pom = document.createElement('a')
  var bb = new Blob(
    ['<?xml version="1.0" encoding="utf-8"?>' + root_xml.outerHTML],
    { type: 'text/plain' }
  )
  pom.setAttribute('href', window.URL.createObjectURL(bb))
  pom.setAttribute('download', filename)
  pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':')
  pom.draggable = true
  pom.classList.add('dragout')
  pom.click()

  console.log(root_xml)
}
const createRootFolder = (name, doc) => {
  let folder = doc.createElement('Folder')
  let name_folder = doc.createElement('name')
  $(name_folder).text(name)
  folder.appendChild(name_folder)
  return folder
}
const createPlaceMark_COT = (json, doc) => {
  let placemark = doc.createElement('Placemark')
  // name
  let name_placemark = doc.createElement('name')
  $(name_placemark).text(json['name'])
  placemark.appendChild(name_placemark)
  // địa chỉ
  let dia_chỉ = doc.createElement('diachi')
  $(dia_chỉ).text(json['dia_diem'] == null ? '' : json['dia_diem'])
  placemark.appendChild(dia_chỉ)
  // lý trình
  let ly_trinh = doc.createElement('lytrinh')
  $(ly_trinh).text(json['ly_trinh'] == null ? '' : json['ly_trinh'])
  placemark.appendChild(ly_trinh)
  // x2 phụ kiệt cột
  let x2_phu_kien_cot = doc.createElement('nhandoiphukien')
  $(x2_phu_kien_cot).text(
    json['x2_phu_kien_cot'] == null ? '' : json['x2_phu_kien_cot']
  )
  placemark.appendChild(x2_phu_kien_cot)
  // đặt biển bảo
  let dat_bien_bao = doc.createElement('bienbao')
  $(dat_bien_bao).text(json['dat_bien_bao'] == null ? '' : json['dat_bien_bao'])
  placemark.appendChild(dat_bien_bao)
  // style url
  let style_url = doc.createElement('styleUrl')
  $(style_url).text('#m_ylw-pushpin')
  placemark.appendChild(style_url)
  // point
  let point = doc.createElement('Point')
  let coordinates = doc.createElement('coordinates')
  $(coordinates).text(
    json['coor'] == null ? '0,0,0' : json['coor'].toString() + ',0'
  )
  point.appendChild(coordinates)
  placemark.appendChild(point)
  // end point
  // loai cot
  let loat_cot = doc.createElement('LoaiCot')
  let hien_trang_cot = doc.createElement('hientrangcot')
  $(hien_trang_cot).text(json['cot'] == null ? '' : json['cot']['hien_trang_c'])
  let chieu_cao_cot = doc.createElement('chieucaocot')
  $(chieu_cao_cot).text(json['cot'] == null ? '' : json['cot']['chieu_cao'])
  let chung_loai = doc.createElement('chungloai')
  $(chung_loai).text(json['cot'] == null ? '' : json['cot']['ma_loai_cot'])
  loat_cot.appendChild(chieu_cao_cot)
  loat_cot.appendChild(chung_loai)
  loat_cot.appendChild(hien_trang_cot)
  placemark.appendChild(loat_cot)
  // end loai cot
  // vat tu
  let vat_tu = doc.createElement('VatTu')
  let ten_vat_tu = doc.createElement('ten')
  $(ten_vat_tu).text(json['vat_tu'] == null ? '' : json['vat_tu']['ma_vat_tu'])
  let chung_loai_vt_1 = doc.createElement('chungloai1')
  $(chung_loai_vt_1).text(
    json['vat_tu'] == null ? '' : json['vat_tu']['chung_loai_spillter']
  )
  let chung_loai_vt_2 = doc.createElement('chungloai2')
  $(chung_loai_vt_2).text(
    json['vat_tu'] == null ? '' : json['vat_tu']['chung_loai_odf']
  )
  let hien_trang_vat_tu = doc.createElement('hientrangvattu')
  $(hien_trang_vat_tu).text(
    json['vat_tu'] == null ? '' : json['vat_tu']['hien_trang_vt']
  )
  vat_tu.appendChild(ten_vat_tu)
  vat_tu.appendChild(hien_trang_vat_tu)
  vat_tu.appendChild(chung_loai_vt_1)
  vat_tu.appendChild(chung_loai_vt_2)
  placemark.appendChild(vat_tu)
  // end vat tu
  // be cap
  let be_cap = doc.createElement('BeCap')
  let ten_bc = doc.createElement('ten')
  // lấy luôn tên bể là mã loại bể -> cấm sửa :))
  $(ten_bc).text(json['be_cap'] == null ? '' : json['be_cap']['ma_loai_be'])
  let chung_loai_bc_1 = doc.createElement('chungloai1')
  $(chung_loai_bc_1).text(json['be_cap'] == null ? '' : '')
  let chung_loai_bc_2 = doc.createElement('chungloai2')
  $(chung_loai_bc_2).text(json['be_cap'] == null ? '' : '')
  let hien_trang_bc = doc.createElement('hientrang')
  $(hien_trang_bc).text(
    json['be_cap'] == null ? '' : json['be_cap']['hien_trang_bc']
  )
  let ma_loai_be = doc.createElement('maloaibe')
  $(ma_loai_be).text(json['be_cap'] == null ? '' : json['be_cap']['ma_loai_be'])
  be_cap.appendChild(ten_bc)
  be_cap.appendChild(hien_trang_bc)
  be_cap.appendChild(ma_loai_be)
  be_cap.appendChild(chung_loai_bc_1)
  be_cap.appendChild(chung_loai_bc_2)
  placemark.appendChild(be_cap)
  // end be cap
  // phu kien
  let phu_kien = doc.createElement('PhuKien')
  let ten_phu_kien = doc.createElement('ten')
  $(ten_phu_kien).text(json[''] == null ? '' : json[''])
  let chung_loai_pk_1 = doc.createElement('chungloai1')
  $(chung_loai_pk_1).text(json[''] == null ? '' : json[''])
  let chung_loai_pk_2 = doc.createElement('chungloai2')
  $(chung_loai_pk_2).text(json[''] == null ? '' : json[''])
  let ma_phu_kien = doc.createElement('maphukien')
  $(ma_phu_kien).text(
    json['phu_kien'] == null ? '' : json['phu_kien']['ma_phu_kien']
  )
  phu_kien.appendChild(ten_phu_kien)
  phu_kien.appendChild(ma_phu_kien)
  phu_kien.appendChild(chung_loai_pk_1)
  phu_kien.appendChild(chung_loai_pk_2)
  placemark.appendChild(phu_kien)
  // end phu kien
  // phụ kiện ADSS
  let treo_neo_adss = doc.createElement('TreoNeo')
  $(treo_neo_adss).text(
    json['phu_kien_cap_ADSS'] == null
      ? ''
      : json['phu_kien_cap_ADSS']['treo_neo']
  )
  let UDJ = doc.createElement('UDJ')
  $(UDJ).text(
    json['phu_kien_cap_ADSS'] == null ? '' : json['phu_kien_cap_ADSS']['U_D_J']
  )
  let Gong = doc.createElement('Gong')
  $(Gong).text(
    json['phu_kien_cap_ADSS'] == null ? '' : json['phu_kien_cap_ADSS']['G0_C1']
  )
  let ChungLoai_adss = doc.createElement('ChungLoai')
  $(ChungLoai_adss).text(
    json['phu_kien_cap_ADSS'] == null
      ? ''
      : json['phu_kien_cap_ADSS']['chung_loai_ADSS']
  )
  let adss = doc.createElement('ADSS')
  adss.appendChild(treo_neo_adss)
  adss.appendChild(UDJ)
  adss.appendChild(Gong)
  adss.appendChild(ChungLoai_adss)
  placemark.appendChild(adss)
  // end phụ kiện ADSS
  // Phụ kiện AC
  let treo_ham = doc.createElement('TreoHam')
  $(treo_ham).text(
    json['phu_kien_cap_AC'] == null ? '' : json['phu_kien_cap_AC']['treo_ham']
  )
  let de_U = doc.createElement('UD')
  $(de_U).text(
    json['phu_kien_cap_AC'] == null ? '' : json['phu_kien_cap_AC']['de_U']
  )
  let dai_AC = doc.createElement('DAI')
  $(dai_AC).text(
    json['phu_kien_cap_AC'] == null ? '' : json['phu_kien_cap_AC']['dai_AC']
  )
  let chung_loai_AC = doc.createElement('ChungLoai')
  $(chung_loai_AC).text(
    json['phu_kien_cap_AC'] == null
      ? ''
      : json['phu_kien_cap_AC']['chung_loai_AC']
  )
  let ac = doc.createElement('AC')
  ac.appendChild(treo_ham)
  ac.appendChild(de_U)
  ac.appendChild(dai_AC)
  ac.appendChild(chung_loai_AC)
  placemark.appendChild(ac)
  // End phụ kiện AC
  return placemark
}
const createPlaceMark_DUONG = (json, doc) => {
  let placemark = doc.createElement('Placemark')
  // name
  let name_placemark = doc.createElement('name')
  $(name_placemark).text('Đo đường')
  placemark.appendChild(name_placemark)
  // style url
  let style_url = doc.createElement('styleUrl')
  $(style_url).text('#line-w2')
  placemark.appendChild(style_url)
  // line string
  let line_string = doc.createElement('LineString')
  let tessellate = doc.createElement('tessellate')
  $(tessellate).text('1')
  let coordinates = doc.createElement('coordinates')
  $(coordinates).text(
    json['list_do_duong'][0] == null ? '' : json['list_do_duong'][0].join(',0 ')
  )
  line_string.appendChild(tessellate)
  line_string.appendChild(coordinates)
  placemark.appendChild(line_string)
  return placemark
}
const createPlaceMark_Track = (json, doc) => {
  let placemark = doc.createElement('Placemark')
  // name
  let name_placemark = doc.createElement('name')
  $(name_placemark).text(json['name'])
  placemark.appendChild(name_placemark)
  // style url
  let style_url = doc.createElement('styleUrl')
  $(style_url).text('#multiTrack33')
  placemark.appendChild(style_url)
  // line string
  let balloonVisibility = doc.createElement('gx:balloonVisibility', 'gx:dcm')
  $(balloonVisibility).text('1')
  let gxTrack = doc.createElement(`gx:Track`)
  json['list_do_duong'][0].map(item => {
    let gxcoord = doc.createElement(`gx:coord`)
    $(gxcoord).text(item.join(' '))
    gxTrack.appendChild(gxcoord)
  })
  placemark.appendChild(balloonVisibility)
  placemark.appendChild(gxTrack)
  return placemark
}
