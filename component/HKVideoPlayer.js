/* eslint-disable */

import React, { Component, createRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  BackHandler,
  PermissionsAndroid,
  Platform,
} from 'react-native'
import Video from './HkPlayer'
import Orientation from 'react-native-orientation'
import {
  widthRatio,
  widthPxToDp,
  heightRatio,
  isIphoneX,
  heightPxToDp,
} from '../method'
import _ from 'lodash'
import moment from 'moment'
import Resolution from './resolution'
import { Slider } from '@ant-design/react-native'

/* eslint-disable */
const fullScreen = '\ue73c',
  smallScreen = '\ue73d'

let timer = ''

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props)
    this.video = createRef()
    this.state = {
      bottom: new Animated.Value(-widthPxToDp(150)),
      top: new Animated.Value(-widthPxToDp(150)),
      opacity: new Animated.Value(0),
      hideController: false,
      isFullScreen: false,
      videoHeight: widthPxToDp(500),
      videoWidth: widthRatio(1),
      fullScreenIcon: fullScreen,
      offset: 0,
      originSize: widthPxToDp(1),
      playStatus: 'success',
      message: '无正在播放的视频',
      isRecording: false,
      fontSizeSmall: 23,
      fontSize: 15,
      fontSizeMax: 35,
      wrapperHeight: widthPxToDp(160),
      contentHeight: widthPxToDp(110),
      isPlaying: true,
      loading: false,
      min: 0,
      max: 100,
      startTime: 0,
      endTime: 0,
    }
  }

  componentDidMount() {
    this.backEvent = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backHandle
    )

    const { startDate, endDate } = this.props
    if (startDate && endDate) {
      const endTime = moment(endDate).unix() - moment(startDate).unix()
      this.setState({
        endTime,
      })
    }
  }
  backHandle = () => {
    if (!this.state.isFullScreen) {
      Orientation.lockToPortrait()
      this.props.showNav(true)
      this.setState(
        {
          fullScreenIcon: fullScreen,
          videoHeight: this.state.originSize * 500,
          isFullScreen: false,
          videoWidth: widthRatio(1),
          offset: 0,
          bottom: new Animated.Value(0),
        },
        () => {
          console.log(heightPxToDp(13), heightPxToDp(60))
        }
      )
      return false
    } else {
      Orientation.lockToPortrait()
      this.props.showNav(true)
      this.setState(
        {
          fullScreenIcon: fullScreen,
          videoHeight: this.state.originSize * 500,
          isFullScreen: false,
          videoWidth: widthRatio(1),
          offset: 0,
          bottom: new Animated.Value(0),
        },
        () => {
          console.log(heightPxToDp(13), heightPxToDp(60))
        }
      )
      return true
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    // if(!_.isEmpty(_.get(nextProps,'currentUrl'))){
    //   if(this.video){
    //     this.video.startPlay()
    //   }
    //
    // }
  }

  onEnd = () => {}

  onClose = () => {
    Orientation.lockToPortrait()
    // this.props.onClose()
  }

  setDuration = () => {
    this.props.onPlaySuccess()
  }

  videoError = () => {}

  fullScreenChange = () => {
    const {offsetHeight=0,offsetWidth=0}= this.props;
    if (!this.state.isFullScreen) {
      Orientation.lockToLandscapeRight()
      this.props.showNav(false)
      this.setState(
        {
          fullScreenIcon: smallScreen,
          isFullScreen: true,
          videoHeight: widthRatio(1)-offsetHeight,
          videoWidth: heightRatio(1)+offsetWidth,
          offset: 0,
          bottom: isIphoneX()
            ? new Animated.Value(this.state.originSize * 20)
            : new Animated.Value(0),
        },
        () => {
          console.log(heightPxToDp(26), heightPxToDp(60))
        }
      )
    } else {
      Orientation.lockToPortrait()
      // this.props.onFullScreenChange(false)
      this.props.showNav(true)

      this.setState(
        {
          fullScreenIcon: fullScreen,
          videoHeight: this.state.originSize * 500,
          isFullScreen: false,
          videoWidth: widthRatio(1),
          offset: 0,
          bottom: new Animated.Value(0),
        },
        () => {
          console.log(heightPxToDp(13), heightPxToDp(60))
        }
      )
    }
  }
  showController = () => {
    if(this.props.currentUrl==''){
        return
    }
    if (this.state.hideController) {
      Animated.timing(
        // 随时间变化而执行的动画类型
        this.state.bottom, // 动画中的变量值
        {
          toValue: -widthPxToDp(160),
          duration: 300,
        }
      ).start()
      Animated.timing(
        // 随时间变化而执行的动画类型
        this.state.top, // 动画中的变量值
        {
          toValue: -widthPxToDp(160),
          duration: 300,
        }
      ).start()
      Animated.timing(
        // 随时间变化而执行的动画类型
        this.state.opacity, // 动画中的变量值
        {
          toValue: 0,
          duration: 300,
        }
      ).start()
    } else {
      Animated.timing(
        // 随时间变化而执行的动画类型
        this.state.bottom, // 动画中的变量值
        {
          toValue: this.state.isFullScreen && isIphoneX() ? 10 : 0,
          duration: 300,
        }
      ).start()
      Animated.timing(
        // 随时间变化而执行的动画类型
        this.state.top, // 动画中的变量值
        {
          toValue: this.state.isFullScreen && isIphoneX() ? 10 : 0,
          duration: 300,
        }
      ).start()
      Animated.timing(
        // 随时间变化而执行的动画类型
        this.state.opacity, // 动画中的变量值
        {
          toValue: this.state.isFullScreen && isIphoneX() ? 10 : 0.8,
          duration: 300,
        }
      ).start()
    }

    this.setState({ hideController: !this.state.hideController })
    // this.setState({pause:!this.state.pause,loading:false})
  }

  async requestReadPermission(callback) {
    try {
      const os = Platform.OS // android or ios
      if (os === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            //第一次请求【拒绝】后提示用户你为什么要这个权限
            title: '需要读写权限',
            message: '使用截图功能需打开app存储权限',
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('你已获取了读写权限')
          callback()
        } else {
          this.Toast.fail('获取读写权限失败，请在系统设置中手动打开')
          console.log('获取读写权限失败')
        }
      } else {
        console.log('你已获取了读写权限')
        callback()
      }
    } catch (err) {
      console.log(err.toString())
    }
  }

  onCapture = () => {
    if (this.video && this.video.current !== null) {
      console.log('截图')
      this.requestReadPermission(this.video.capture)
    }
  }

  onRecord = () => {
    if (this.video && this.video.current !== null) {
      console.log('录像')
      this.requestReadPermission(this.video.record)
      this.setState({
        isRecording: !this.state.isRecording,
      })
    }
  }

  stop = () => {
    if (this.video && this.video.current !== null) {
      // console.log('停止播放', this.video)
      this.video.stopPlay()
    }
  }

  componentWillUnmount() {
    if (this.video && this.video.current !== null) {
      // console.log('停止播放', this.video)
      this.video.stopPlay()
    }
    if (timer) {
      clearTimeout(timer)
    }

    this.backEvent && this.backEvent.remove()
    // this.state.isPlaying=false;
    // this.setState({
    //   isPlaying: false,
    // })
  }

  startPlayback = () => {
    if (this.video && this.video.current !== null) {
      this.video.startPlayback()
      this.setState({
        startTime: 0,
      })
    }
  }

  startPreview = () => {
    if (this.props.mode === 'preview') {
      if (this.video && this.video.current !== null) {
        if (!this.state.isPlaying) {
          this.video.startPlay()
          this.setState({
            isPlaying: true,
          })
        } else {
          this.video.stopPlay()
          this.setState({
            isPlaying: false,
          })
        }
      } else {
        // this.Toast.show('请选择通道')
      }
    } else {
        if (!this.state.isPlaying) {
            this.startPlayback()
            this.setState({
                isPlaying: true,
            })
            } else {
            this.video.stopPlay()
            this.setState({
                isPlaying: false,
            })
        }
    //   this.startPlayback()
    }
  }

  onStatusChange = ({ nativeEvent }) => {
    const { status } = nativeEvent
    console.log('event::', nativeEvent)
    if (status !== 'success') {
      this.setState({
        status: 'fail',
        message: '视频播放失败，请检查网络链路！',
        isPlaying: false,
      })
    } else {
      this.setState({
        isPlaying: true,
      })
      if (this.props.mode === 'playback') {
        this.startCounterTimer()
      }
    }
  }

  playBack = () => {
    const { modeHandle,mode } = this.props
    if(this.state.isPlaying)
    {
        this.video.stopPlay()
        this.setState({
          isPlaying: false,
        })
    }
    modeHandle&&modeHandle(mode=='preview'?"playback":'preview')
  }

  getTimeFormat = sec => {
    if (sec === 0) {
      return '00:00:00'
    }

    const hours = parseInt(sec / 3600) < 1 ? 0 : parseInt(sec / 3600)
    const mins =
      parseInt(sec / 60) > 59 ? parseInt(sec / 60) % 60 : parseInt(sec / 60)
    const seconds = sec % 60
    return `${hours > 9 ? hours : '0' + hours}:${
      mins > 9 ? mins : '0' + mins
    }:${seconds > 9 ? seconds : '0' + seconds}`
  }

  startCounterTimer = async () => {
    timer = setInterval(() => {
      let { startTime, endTime, isPlaying } = this.state
      if (startTime === endTime || !isPlaying) {
        clearTimeout(timer)
        return
      }
      this.setState({
        startTime: startTime + 1,
      })
    }, 1000)
  }

  slideChange = current => {
    const startDate = moment(this.props.startDate)
      .add(current, 's')
      .format('YYYY-MM-DD HH:mm:ss')
    console.log('start:', this.props.startDate)
    this.setState(
      {
        startTime: current,
        startDate,
        isPlaying: false,
      },
      () => {
        console.log('startDate::', startDate)
        this.seekTime(startDate)
      }
    )
  }

  seekTime = startDate => {
    if (this.video && this.video.current !== null) {
      this.video.seekTime(startDate)
    }
  }

  render() {
    const { mode = '', startDate = '', endDate = '' } = this.props
    const {
      originSize,
      message,
      isRecording,
      wrapperHeight,
      contentHeight,
      fontSizeSmall,
      fontSizeMax,
      fontSize,
      isPlaying,
      startTime,
      endTime,
    } = this.state
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: this.state.videoWidth,
          height: this.state.videoHeight,
          backgroundColor: 'rgba(0,0,0)',
        }}
      >
        <TouchableOpacity
          style={{ bacgroundColor: '#000' }}
          activeOpacity={1}
          onPress={this.showController}
        >
          {this.props.currentUrl !== '' ? (
            <Video
              // 当视频不能加载，或出错后的回调函数
              // ref={this.video}
              ref={r => (this.video = r)}
              uri={this.props.currentUrl}
              styles={{
                width: this.state.videoWidth,
                height: this.state.videoHeight,
                zIndex: 10,
              }}
              startDate={typeof startDate ==='String'?startDate:moment(startDate).format(
                'YYYY-MM-DD HH:mm:ss'
              )}
              endDate={typeof endDate ==='String'?endDate:moment(endDate).format(
                'YYYY-MM-DD HH:mm:ss'
              )}
            //   endDate={endDate}
              onChange={this.onStatusChange}
              mode={mode}
            />
          ) : (
            <View
              style={{
                width: this.state.videoWidth,
                height: this.state.videoHeight,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>{this.props.defaultMessage?this.props.defaultMessage:message}</Text>
            </View>
          )}

          <Animated.View
            style={{
              justifyContent: 'flex-end',
              // flexDirection: 'row',
              zIndex: 99,
              width: this.state.videoWidth,
              position: 'absolute',
              height: wrapperHeight,
              padding: originSize * 5,
              bottom: this.state.bottom,
              // right: this.state.bottom,
              backgroundColor: '#000',
              opacity: this.state.opacity,
            }}
          >
            <View
              style={{
                width: this.state.videoWidth,
                height: contentHeight,
                justifyContent: 'flex-end',
              }}
            >
              {mode === 'playback' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    width: this.state.videoWidth,
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      paddingLeft: 3,
                      width: 70,
                      fontSize: 13,
                    }}
                  >
                    {this.getTimeFormat(startTime)}
                  </Text>
                  <View style={{ width: this.state.videoWidth - 140 }}>
                    <Slider
                      defaultValue={0}
                      step={1}
                      value={startTime}
                      max={endTime}
                      onAfterChange={this.slideChange}
                    />
                  </View>
                  <Text
                    style={{
                      width: 70,
                      color: '#fff',
                      paddingRight: 3,
                      fontSize: 13,
                    }}
                  >
                    {this.getTimeFormat(endTime)}
                  </Text>
                </View>
              ) : (
                []
              )}

              <View
                style={{
                  flexDirection: 'row',
                  height: contentHeight,
                  width: this.state.videoWidth,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 5 }}
                  onPress={this.onCapture}
                >
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center',flexDirection:"row" }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'iconfont',
                        fontSize: fontSizeSmall,
                      }}
                    >
                      &#xe99a;
                    </Text>
                    <Text style={{ fontSize: fontSize, color: '#fff' }}>
                      抓 图
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  hitSlop={{ top: 0, bottom: 0, left: 10, right: 10 }}
                  onPress={this.onRecord}
                >
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'iconfont',
                        fontSize: fontSizeSmall,
                      }}
                    >
                      &#xe691;
                    </Text>
                    <Text style={{ fontSize: fontSize, color: '#fff' }}>
                      {isRecording ? '停  止' : '录 像'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.startPreview}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'iconfont',
                      fontSize: fontSizeMax,
                      // right: this.state.offset,
                    }}
                  >
                    {isPlaying ? `\ue68f` : `\ue68e`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.playBack}
                //   disabled={mode === 'playback'}
                >
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        color: '#fff', //mode === 'playback' ? '#999' :
                        fontFamily: 'iconfont',
                        fontSize: fontSizeSmall,
                        // right: this.state.offset,
                      }}
                    >
                      &#xe690;
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSize,
                        color: '#fff'
                      }}
                    >
                      {mode=='preview'?"实 况":"回 放"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {Platform.OS!=='ios'&&<TouchableOpacity  onPress={this.fullScreenChange}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'iconfont',
                        fontSize: fontSizeSmall,
                        // right: this.state.offset,
                      }}
                    >
                      {this.state.fullScreenIcon}
                    </Text>
                    <Text style={{ fontSize: fontSize, color: '#fff' }}>
                      全 屏
                    </Text>
                  </View>
                </TouchableOpacity>}
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  }
}
