/**
 * 工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */

/*
 设备的像素密度，例如：
 PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
 PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
 PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
 PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)
 PixelRatio.get() === 3.5        Nexus 6       */

 import { Dimensions, PixelRatio, Platform } from 'react-native'
 /* eslint-disable */
//  import './shim'
//  import crypto from 'crypto'
import hmacSHA256 from 'crypto-js/hmac-sha256';
import CryptoJS from 'crypto-js/index'
import Base64 from 'crypto-js/enc-base64';

 export const deviceWidth = Dimensions.get('window').width
 export const deviceHeight = Dimensions.get('window').height
 const fontScale = PixelRatio.getFontScale()
 
 const pixelRatio = PixelRatio.get()
 const defaultPixel = 2
 
 const w2 = 750 / defaultPixel
 const h2 = 1334 / defaultPixel
 const scale = Math.min(deviceHeight / h2, deviceWidth / w2)
 // iPhoneX
 const X_WIDTH = 375
 const X_HEIGHT = 812
 
 // screen
 const SCREEN_WIDTH = Dimensions.get('window').width
 const SCREEN_HEIGHT = Dimensions.get('window').height
 
 export const isIphoneX = () =>
   Platform.OS === 'ios' &&
   Number(`${deviceHeight / deviceWidth}`.substr(0, 4)) * 100 === 216
 
 /**
  * 设置text为sp
  * @param size sp
  * return number dp
  */
 export function setSpText(size) {
   const sizeNum = Math.round((size * scale * pixelRatio) / fontScale)
   return sizeNum / defaultPixel
 }
 
 export function scaleSize(size) {
   const sizeNum = Math.round(size * scale)
   return sizeNum / defaultPixel
 }
 
 export function widthRatio(ratio) {
   console.log("wj_widthRatio",deviceWidth)
   if (ratio > 1) return ratio * deviceWidth
   return Math.round(ratio * deviceWidth)
 }
 export function heightRatio(ratio) {
  console.log("wj_heightRatio",deviceHeight)
   if (ratio > 1) return ''
   return Math.round(ratio * deviceHeight)
 }
 export function widthPxToDp(value) {
   const deviceWidthDp = Dimensions.get('window').width
   const uiWidthPx = 750
   return (value * deviceWidthDp) / uiWidthPx
 }
 export function heightPxToDp(value) {
   // const den = PixelRatio.get()
   const deviceHeightDp = Dimensions.get('window').height
   const uiHeightPx = 1344
   // console.log('height:',deviceHeightDp,'translate:',value *  deviceHeightDp / uiHeightPx)
   return (value * deviceHeightDp) / uiHeightPx
 }
 

const post = (path, headers, body, plantOption) =>
  new Promise((resolve, reject) => {
      console.log("Wj_plantOption",plantOption)
      console.log("Wj_plantOptionbody",body)
      console.log("Wj_headers",headers)
    const pubIp = plantOption.pubIp
    const pubPort = plantOption.pubPort
    if (!pubIp || !pubPort) {
      throw Error('参数不全')
    }
    fetch(`http://${pubIp}:${pubPort}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then(resp => {
        console.log('resp::', resp)
        return resp.json()
      })
      .then(json => {
        resolve(json)
      })
      .catch(error => {
        console.log('error::', error)
      })
  })

const getHeaders = (url, plantOption, projectId) => {
  const time = new Date().getTime()
  const appKey = plantOption.appKey
  const shaNum = plantOption.secret

  if (!appKey || !projectId || !shaNum) {
    throw Error('参数不全')
  }

  const key = projectId.replace(/-/g, '').substr(0, 16)

  // const shaNum = Tooles.AesDecrypt(secret, key, key)

  console.log(shaNum, 666666)

  const signStr =
    Platform.OS === 'ios'
      ? `POST\n*/*\napplication/json\n${time}\nx-ca-key:${appKey}\n${url}`
      : `POST\n*/*\napplication/json; charset=utf-8\n${time}\nx-ca-key:${appKey}\n${url}`
//   const sign = crypto
//     .createHmac('sha256', shaNum)
//     .update(signStr)
//     .digest('base64')
  const sign = Base64.stringify(hmacSHA256(signStr, shaNum));
  console.log('wj_sign:::::', sign, signStr)
  const headers = {
    Date: time,
    'X-ca-key': appKey,
    'X-Ca-Signature-Headers': 'x-ca-key',
    Accept: '*/*',
    'Content-Type': Platform.OS === 'ios'?'application/json':'application/json; charset=utf-8',
    'X-Ca-Signature': sign,
  }
  return headers
}

export const getPlayUrl = (pointId, plantOption, projectId) => {
  const headers = getHeaders(
    '/artemis/api/video/v1/cameras/previewURLs',
    plantOption,
    projectId
  )
  const body = {
    cameraIndexCode: pointId,
    streamType: 1,
    transmode: 0,
    expand: 'streamform=ps',
  }
  console.log(headers, body, plantOption, ' hk ==========')
  return post(
    '/artemis/api/video/v1/cameras/previewURLs',
    headers,
    body,
    plantOption
  )
}

// LEFT 左转
// RIGHT右转
// UP 上转
// DOWN 下转
// ZOOM_IN 焦距变大
// ZOOM_OUT 焦距变小
// LEFT_UP 左上
// LEFT_DOWN 左下
// RIGHT_UP 右上
// RIGHT_DOWN 右下
// FOCUS_NEAR 焦点前移
// FOCUS_FAR 焦点后移
// IRIS_ENLARGE 光圈扩大
// IRIS_REDUCE 光圈缩小；
// 以下命令presetIndex不可为空：
// GOTO_PRESET到预置点

export const cameraControl = (
  cameraIndexCode,
  command,
  action,
  curPlatForm,
  projectId
) => {
  const commands = [
    'LEFT',
    'RIGHT',
    'UP',
    'DOWN',
    'ZOOM_IN',
    'ZOOM_OUT',
    'LEFT_UP',
    'LEFT_DOWN',
    'RIGHT_UP',
    'LEFT_DOWN',
    'RIGHT_UP',
    'RIGHT_DOWN',
    'FOCUS_NEAR',
    'FOCUS_FAR',
    'IRIS_ENLARGE',
    'IRIS_REDUCE',
  ]
  if (commands.indexOf(command) > -1) {
    const headers = getHeaders(
      '/artemis/api/video/v1/ptzs/controlling',
      curPlatForm,
      projectId
    )
    const body = {
      cameraIndexCode,
      action,
      command,
      speed: 80,
    }
    return post(
      '/artemis/api/video/v1/ptzs/controlling',
      headers,
      body,
      curPlatForm
    )
  }
}

// export const getPrestsCode = cameraIndexCode => {
//   const time = new Date().getTime()
//   const sign = crypto
//     .createHmac('sha256', 'ZtkUS26kpdP9i0HWAseu')
//     .update(`POST\n*/*\napplication/json\n${time}\nx-ca-key:26414865\n${url}`)
//     .digest('base64')
//   console.log('sign:::::', sign)
//   const headers = {
//     Date: time,
//     'X-ca-key': '26414865',
//     'X-Ca-Signature-Headers': 'x-ca-key',
//     Accept: '*/*',
//     'Content-Type': 'application/json',
//     'X-Ca-Signature': sign,
//   }
//   const body = {
//     cameraIndexCode,
//   }
//   return post('/artemis/api/video/v1/presets/searches', headers, body)
// }

export const getPlayBackUrls = (
  indexCode,
  beginTime,
  endTime,
  curPlatForm,
  projectId
) => {
  const headers = getHeaders(
    '/artemis/api/video/v1/cameras/playbackURLs',
    curPlatForm,
    projectId
  )

  const body = {
    cameraIndexCode: indexCode,
    beginTime:beginTime+"+08:00",
    endTime:endTime+"+08:00",
    recordLocation: 1,
    expand: 'streamform=ps',
    transmode: 1,
  }
  console.log('body::', body)
  return post(
    '/artemis/api/video/v1/cameras/playbackURLs',
    headers,
    body,
    curPlatForm
  )
}

  //解密方法
  export const AesDecrypt=(word, key, iv)=> {
    const decrypted = CryptoJS.AES.decrypt(word, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return CryptoJS.enc.Utf8.stringify(decrypted)
  }

// "{"code":"0x02401003","msg":"Invalid Signature! and StringToSign: POST\n*/*\napplication/json; charset=utf-8\n1574753217603\nx-ca-key:26414865\n/artemis/api/video/v1/cameras/previewURLs"}"
