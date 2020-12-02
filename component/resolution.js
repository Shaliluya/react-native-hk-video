/**
 * Created by yangchaoben on 2017/8/28.
 */
import React from 'react'
import { Dimensions, PixelRatio, Platform, StatusBar, View } from 'react-native'

const props = {}
export default class Resolution {
  static get(useFixWidth = true) {
    return useFixWidth ? { ...props.fw } : { ...props.fh }
  }

  static setDesignSize(dwidth = 720, dheight = 1280, dim = 'window') {
    const designSize = { width: dwidth, height: dheight }

    const navHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 64
    const pxRatio = PixelRatio.get(dim)
    const { width, height } = Dimensions.get(dim)
    // if(dim != "screen")height-=navHeight;
    const w = PixelRatio.getPixelSizeForLayoutSize(width)
    const h = PixelRatio.getPixelSizeForLayoutSize(height)
    /* eslint-disable */
    const fw_design_scale = designSize.width / w
    fw_width = designSize.width
    fw_height = h * fw_design_scale
    fw_scale = 1 / pxRatio / fw_design_scale

    const fh_design_scale = designSize.height / h
    fh_width = w * fh_design_scale
    fh_height = designSize.height
    fh_scale = 1 / pxRatio / fh_design_scale

    props.fw = {
      width: fw_width,
      height: fw_height,
      scale: fw_scale,
      navHeight,
    }
    props.fh = {
      width: fh_width,
      height: fh_height,
      scale: fh_scale,
      navHeight,
    }
  }

  static getScale() {
    return {
      scaleHeight: props.fh.scale,
      scaleWidth: props.fw.scale,
      navHeight: props.fh.navHeight,
    }
  }

  static FixWidthView = p => {
    const { width, height, scale, navHeight } = props.fw
    return (
      <View
        {...p}
        style={{
          // marginTop:navHeight,
          width,
          height,
          backgroundColor: 'transparent',
          transform: [
            { translateX: -width * 0.5 },
            { translateY: -height * 0.5 },
            { scale },
            { translateX: width * 0.5 },
            { translateY: height * 0.5 },
          ],
        }}
      />
    )
  }

  static FixWidthViewRotate = (p, rotate) => {
    console.log(p, 'rotate')
    const { width, height, scale, navHeight } = props.fw
    return (
      <View
        {...p}
        style={
          p.rotate
            ? {
                // marginTop:navHeight,
                width,
                height,
                backgroundColor: 'transparent',
                transform: [
                  { translateX: -width * 0.5 },
                  { translateY: -height * 0.5 },
                  { scale },
                  { translateX: width * 0.5 },
                  { translateY: height * 0.5 },
                ],
              }
            : {
                flex: 1,
              }
        }
      />
    )
  }

  static FixHeightView = p => {
    const { width, height, scale, navHeight } = props.fh
    return (
      <View
        {...p}
        style={{
          marginTop: navHeight,
          width,
          height,
          backgroundColor: 'transparent',
          transform: [
            { translateX: -width * 0.5 },
            { translateY: -height * 0.5 },
            { scale },
            { translateX: width * 0.5 },
            { translateY: height * 0.5 },
          ],
        }}
      >
        {p.children}
      </View>
    )
  }
}
// init
Resolution.setDesignSize()
