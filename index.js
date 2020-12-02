
import React, { Component, createRef } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import { widthRatio,heightRatio,widthPxToDp,AesDecrypt,getPlayUrl,getPlayBackUrls,isIphoneX} from './method'
import PropTypes from 'prop-types';
import CloudController from './component/cloudControl'
import VideoPlayer from './component/HKVideoPlayer'
import PlayBack from './component/playBack'

export default class HkPlayer extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.player = createRef()
    const{platform,decKey}=this.props
    this.state = {
      showNav: true,
      showNewNav: false,
      resolution: false,
      originSize: widthPxToDp(1),
      currCamera: '',
      cloudPlatformShow: false,
      modalVisible: false,
      currentUrl: '',
      projectId: this.props.projectId,
      platformContent:JSON.parse(AesDecrypt(platform,decKey,decKey)),
      showCloud:this.props?.showCloud??true,
      streamId:this.props.streamId,
      mode:this.props?.mode??"preview",
      startDate: moment().subtract(1, 'days'),
      endDate: moment(),
      animating:true,
    }
  }

  componentWillUnmount() {

  }

  componentDidMount(){
    // const{streamId, platformContent, projectId}=this.state
    this.getVideoUrl()
  }

  renderCloudControl=()=>{}

  getVideoUrl = async () => {
    this.setState({
      animating:true
    })
    const{streamId:pointId, platformContent:plantOption, projectId}=this.state
    console.log('pointId:::', pointId, plantOption, projectId)
    let resp = ''
    try {
      resp = await getPlayUrl(pointId, plantOption, projectId)
    } catch (e) {
      console.log(e, 111111)
      // this.Toast.info(e || '视频播放失败，请稍候再试')
      return
    }
    console.log('获取视频: resp', resp)
    const { data = {},code='' } = resp
    if (!_.get(data, 'url', '')) {
      this.setState({
        animating:false,
        message:"视频播放失败:"+code
      })
      return
    }
    const { url = '' } = data
    this.setState(
      {
        currentUrl: url,
      },
      () => {
        if (this.player) {
          this.player.startPreview()
          this.setState({
            animating:false
          })
        }
      }
    )
  }

  getPlaybackUrl = async (start, end) => {
    this.setState({
      animating:true
    })
    const { platformContent:curPlatForm, projectId,streamId:cameraIndexCode } = this.state

    if (cameraIndexCode) {
      try {
        // this.setState({
        //   isPlaying: false,
        // })
        const res = await getPlayBackUrls(
          cameraIndexCode,
          moment(start).format(
            'YYYY-MM-DDTHH:mm:ss.SSSzzz'
          ),
          moment(end).format(
            'YYYY-MM-DDTHH:mm:ss.SSSzzz'
          ),
          curPlatForm,
          projectId
        )
        const playbackList = _.get(res, 'data.list', [])
        if (playbackList && playbackList.length > 0) {
          const playbackUrl = _.get(res, 'data.url', '')
          const startDate = moment(playbackList[0].beginTime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          const endDate = moment(
            playbackList[playbackList.length - 1].endTime
          ).format('YYYY-MM-DD HH:mm:ss')

          this.setState(
            {
              currentUrl:playbackUrl,
              startDate,
              endDate,
            },
            () => {
              if (this.player) {
                this.player.startPlayback()
                this.setState({
                  animating:false
                })
              }
            }
          )
        } else {
          throw new Error()
        }
      } catch (e) {
        console.log('获取视频回放地址出错')
      }
    }
  }

  showNav = isShow => {
    this.setState(
      {
        showNav: isShow,
        resolution: isShow,
      },
      () => {
        console.log('rrrrrrrr', this.state.resolution)
      }
    )
  }

  modeHandle=(modeType)=>{
      this.setState({
        mode:modeType,
      },()=>{
        if(modeType=='playback'){
          this.getPlaybackUrl(this.state.startDate, this.state.endDate)
        }else{
          this.getVideoUrl()
        }
      })
  }

  backRender=(backHandler,originSize)=>{
    return(
      <TouchableOpacity
      style={{
        position: 'absolute',
        left: originSize * (isIphoneX() ? 30 : 20),
        top: originSize * (isIphoneX() ? 80 : 40),
        paddingLeft: originSize * 5,
        paddingRight: originSize * 10,
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
        alignItems: 'center',
        width: originSize * 50,
        height: originSize * 50,
        borderRadius: originSize * 25,
      }}
      onPress={backHandler}
    >
      <Text
        style={[
          styles.ico,
          {
            fontSize: originSize * 30,
            paddingLeft: originSize * 5,
            paddingRight: originSize * 5,
            textAlign: 'center',
            color: '#000',
          },
        ]}
      >
        &#xe600;
      </Text>
    </TouchableOpacity>
    )
  }
  render() {
    const { originSize,platformContent,projectId,streamId,mode,currentUrl,showCloud,startDate,endDate,message } = this.state
    const {offsetHeight,offsetWidth,backHandler} = this.props
    let flag =  currentUrl!==''&&showCloud
    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: '#f6f6f6',
          }}
        >
          <View
            style={{
              flex: 1,
            }}
            rotate={this.state.showNav}
          >
              <View
                style={{
                  flex: 1,
                }}
              >
                <VideoPlayer
                  ref={r => (this.player = r)}
                  style={{
                    height: 200,
                    width: widthRatio(1),
                    zIndex: 999,
                  }}
                  // playBack={this.playBack}
                  currentUrl={currentUrl}
                  mode={mode}
                  modeHandle={this.modeHandle}
                  showNav={this.showNav}
                  startDate={startDate}
                  endDate={endDate}
                  offsetHeight={offsetHeight}
                  offsetWidth={offsetWidth}
                  defaultMessage={message}
                />
                {this.state.showNav ? (
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: widthRatio(1),
                        paddingTop: originSize * 32,
                        paddingBottom: originSize * 32,
                        paddingLeft: originSize * 20,
                        paddingRight: originSize * 20,
                        borderBottomWidth: 1,
                        borderColor: '#dadada',
                        backgroundColor: '#fff',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text
                          style={[
                            styles.ico,
                            {
                              fontSize: originSize * 28,
                              color: '#999999',
                            },
                          ]}
                        >
                          &#xe61d;
                        </Text>
                        <Text
                          style={{
                            fontSize: originSize * 24,
                            color: '#999999',
                            marginLeft: originSize * 12,
                          }}
                        >
                          频道 {_.get(this.state, 'currCamera.index', '')}
                        </Text>
                      </View>
                    </View>

                    {flag&&mode==='preview'&&<CloudController 
                      curPlatForm={platformContent} 
                      projectId={projectId} 
                      streamId={streamId}
                      roundCiameter={this.props.roundCiameter}
                      controlButSize={this.props.controlButSize}
                      />}
                      {mode==='playback'&&<PlayBack
                        startDate={startDate}
                        endDate={endDate}
                        startHandler={async value=>{
                          await this.getPlaybackUrl(moment(value), moment(this.state.startDate))
                        }}
                        endHandler={async value=>{
                          await this.getPlaybackUrl(moment(this.state.startDate), moment(value))
                        }}
                      />}

                  </View>
                ) : null}
              </View>
          </View>
          {backHandler&&this.backRender(backHandler,originSize)}

          {this.state.animating&&<View
            style={{
              width:widthRatio(1),
              height:heightRatio(1),
              position:"absolute",
              left:0,
              top:0,
              backgroundColor:"#1514148c",
              justifyContent:"center",
              alignItems:"center"
            }}
        >
          <View style={{
              justifyContent:"center",
              alignItems:"center",
              marginTop:-100
          }}>
            <ActivityIndicator
              color="#fff"
              size="large"
            />
            <Text style={{color:"#fff"}}>
              加载视频中...
            </Text>
          </View>
        </View>}
        </View>
      </>
    )
  }
}

HkPlayer.propTypes = {
  platform: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  decKey: PropTypes.string.isRequired,
  streamId: PropTypes.string.isRequired,
  showCloud: PropTypes.bool,
  roundCiameter: PropTypes.number,
  controlButSize:PropTypes.number,
  offsetHeight:PropTypes.number,
  offsetWidth:PropTypes.number,
  backHandler:PropTypes.func
};

const styles = StyleSheet.create({
  ico: {
    fontSize: 60,
    fontFamily: 'iconfont',
    color: '#333',
    backgroundColor: 'transparent',
  },
})