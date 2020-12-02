import React,{Component} from 'react'

import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
  } from 'react-native'
  import { widthRatio,cameraControl} from '../method'


export default class CloudController extends Component{

    constructor(props) {
        super(props)
        this.state = {
            controlling:false,
            fontSize:this.props?.controlButSize??25,
            roundCiameter:this.props?.roundCiameter??200,
        }
    }

    cameraControll= async command=>{
        // const indexCode = streamId
        const{controlling}=this.state
        const { curPlatForm, projectId,streamId:indexCode } = this.props
        if (indexCode && !controlling) {
          this.setState({
            controlling: true,
          })
          const resStart = await cameraControl(
            indexCode,
            command,
            0,
            curPlatForm,
            projectId
          )
    
          const resStop = await cameraControl(
            indexCode,
            command,
            1,
            curPlatForm,
            projectId
          )
          this.setState({
            controlling: false,
          })
          console.log('control result:', resStart, resStop)
        } else {
          console.log('control result:', state)
        }
      }

    render() {
        const{fontSize,roundCiameter}=this.state
        const radius = roundCiameter/2
        const offset= radius-radius/Math.sqrt(2)
        const offsetH= radius-13
        return(
            <View
            style={{
              backgroundColor: 'rgba(11,49,74,0.5)',
              height: roundCiameter,
              width: roundCiameter,
            //   zIndex: 9999,
              marginTop: 30,
              borderRadius: radius,
              justifyContent: 'center',
              alignItems: 'center',
              left: widthRatio(1) / 2 - radius,
              right: widthRatio(1) / 2 - radius,
            }}
          >
            <TouchableOpacity
              style={{ marginBottom: 20 }}
              onPress={() => this.cameraControll('ZOOM_IN')}
            >
              <Text style={{ fontSize: fontSize-4, color: 'rgba(255,255,255,0.5)' }}>
                放大
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.cameraControll('ZOOM_OUT')}>
              <Text style={{ fontSize: fontSize-4, color: 'rgba(255,255,255,0.5)' }}>
                缩小
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cameraControll('UP')}
              hitSlop={{ right: 15, top: 15, left: 15, bottom: 15 }}
              style={{
                position: 'absolute',
                top: 0,
                transform: [{ rotate: '180deg' }],
              }}
            >
              <Text
                style={[
                  styles.ico,
                  {
                    fontSize: fontSize,
                    color: 'rgba(255,255,255,0.5)',
                  },
                ]}
              >
                &#xe628;
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cameraControll('RIGHT_UP')}
              hitSlop={{ right: 15, top: 15, left: 15, bottom: 15 }}
              style={{
                position: 'absolute',
                top: offset,
                right: offset,
                transform: [{ rotate: '225deg' }],
              }}
            >
              <Text
                style={[
                  styles.ico,
                  {
                    fontSize: fontSize,
                    color: 'rgba(255,255,255,0.5)',
                  },
                ]}
              >
                &#xe628;
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cameraControll('RIGHT')}
              hitSlop={{ right: 15, top: 15, left: 15, bottom: 15 }}
              style={{
                position: 'absolute',
                right: 0,
                top: offsetH,
                transform: [{ rotate: '270deg' }],
              }}
            >
              <Text
                style={[
                  styles.ico,
                  {
                    fontSize: fontSize,
                    color: 'rgba(255,255,255,0.5)',
                  },
                ]}
              >
                &#xe628;
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cameraControll('RIGHT_DOWN')}
              hitSlop={{ right: 15, top: 15, left: 15, bottom: 15 }}
              style={{
                position: 'absolute',
                right: offset,
                bottom: offset,
                transform: [{ rotate: '-45deg' }],
              }}
            >
              <Text
                style={[
                  styles.ico,
                  {
                    fontSize: fontSize,
                    color: 'rgba(255,255,255,0.5)',
                  },
                ]}
              >
                &#xe628;
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cameraControll('DOWN')}
              hitSlop={{ right: 15, top: 15, left: 15, bottom: 15 }}
              style={{
                position: 'absolute',
                bottom: 0,
                transform: [{ rotate: '0deg' }],
              }}
            >
              <Text
                style={[
                  styles.ico,
                  {
                    fontSize: fontSize,
                    color: 'rgba(255,255,255,0.5)',
                  },
                ]}
              >
                &#xe628;
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cameraControll('LEFT_DOWN')}
              hitSlop={{ right: 15, top: 15, left: 15, bottom: 15 }}
              style={{
                position: 'absolute',
                bottom: offset,
                left: offset,
                transform: [{ rotate: '45deg' }],
              }}
            >
              <Text
                style={[
                  styles.ico,
                  {
                    fontSize: fontSize,
                    color: 'rgba(255,255,255,0.5)',
                  },
                ]}
              >
                &#xe628;
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cameraControll('LEFT')}
              hitSlop={{ right: 15, top: 15, left: 15, bottom: 15 }}
              style={{
                position: 'absolute',
                bottom: offsetH,
                left: 0,
                transform: [{ rotate: '90deg' }],
              }}
            >
              <Text
                style={[
                  styles.ico,
                  {
                    fontSize: fontSize,
                    color: 'rgba(255,255,255,0.5)',
                  },
                ]}
              >
                &#xe628;
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cameraControll('LEFT_UP')}
              hitSlop={{ right: 15, top: 15, left: 15, bottom: 15 }}
              style={{
                position: 'absolute',
                top: offset,
                left: offset,
                transform: [{ rotate: '135deg' }],
              }}
            >
              <Text
                style={[
                  styles.ico,
                  {
                    fontSize: fontSize,
                    color: 'rgba(255,255,255,0.5)',
                  },
                ]}
              >
                &#xe628;
              </Text>
            </TouchableOpacity>
          </View>
    )
    }

}

const styles = StyleSheet.create({
    ico: {
      fontSize: 60,
      fontFamily: 'iconfont',
      color: '#333',
      backgroundColor: 'transparent',
    },
  })