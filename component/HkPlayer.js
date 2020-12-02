import React,{ Component } from 'react'
import { requireNativeComponent,View,Text,findNodeHandle,UIManager,Platform,NativeModules } from 'react-native';
import moment from 'moment'
const { HKPlayer } = NativeModules

const Player = requireNativeComponent("HKPlayer")


class VideoPlayer extends Component{

  isIos=()=> Platform.OS==='ios'
  componentDidMount() {
    this.videoHandle = findNodeHandle(this.videoRef)
  }

  componentWillReceiveProps(nextProps, nextContext) {

  }


  startPlay=()=>{
  if(this.isIos()){
    HKPlayer.startplay()
  }else{
    UIManager.dispatchViewManagerCommand(this.videoHandle,3,null)
  }

  }

  capture=()=>{
    if(this.isIos()){
      HKPlayer.captureVideo()
    }else {
      UIManager.dispatchViewManagerCommand(this.videoHandle, 0, null)
    }
  }

  sound =()=>{
    if(this.isIos()){
      HKPlayer.sound()
    }else {
      UIManager.dispatchViewManagerCommand(this.videoHandle, 2, null)
    }
  }

  record =()=>{
    if(this.isIos()){
      HKPlayer.record()
    }else {
      UIManager.dispatchViewManagerCommand(this.videoHandle, 1, null)
    }
  }

  stopPlay=()=>{
    if(this.isIos()){
      HKPlayer.stopplay()
    }else {
      UIManager.dispatchViewManagerCommand(this.videoHandle, 4, null)
    }
  }

  startPlayback = ()=>{
    if(this.isIos()){
      HKPlayer.startPlayback()
    }else {
      UIManager.dispatchViewManagerCommand(this.videoHandle, 5, null)
    }
  }

  seekTime =(startTime) =>{
    if(this.isIos()){
      HKPlayer.seekTime(moment(startTime).unix())
    }else {
      UIManager.dispatchViewManagerCommand(this.videoHandle, 6, [startTime])
    }
  }

  render(){
    const {uri='rtsp://39.106.138.150:554/openUrl/0zxZ3b2',styles, ...others} = this.props
    if(!uri){
      return <View style={styles}>
        <Text>获取播放链接失败！</Text>
      </View>
    }
    // console.log('styles:::',styles)
    if(uri){
      return <Player ref={(r)=>this.videoRef=r}  style={styles} uri={uri} {...others}  />
    }

  }
}

export default VideoPlayer
