/* eslint-disable */
import React,{Component} from 'react'
import moment from 'moment'
import _ from 'lodash'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import {
    widthRatio,
    widthPxToDp,
  } from '../method'
import { List, DatePicker,Provider } from '@ant-design/react-native'



export default class PlaybackVideo extends Component {
  constructor(props) {
    super(props)
    this.state = {
    //   startDate: this.props.startDate,
    //   endDate: this.props.endDate,
      playbackUrl: '',
      playbackList: [],
      showNav: true,
      originSize: widthPxToDp(1),
    }
  }


  onStartDateChange = async value => {
      if(this.props.startHandler){
        await this.props.startHandler(value) 
      }
    // await this.getPlaybackUrl(moment(value), moment(this.state.endDate))
  }

  onEndDateChange = async value => {
    if(this.props.endHandler){
        await this.props.endHandler(value) 
      }
    // await this.getPlaybackUrl(moment(this.state.startDate), moment(value))
  }

  render() {
    const {
      startDate,
      endDate,
    } = this.props
    console.log("startDate",startDate)
    return (
    <Provider>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 10 }}>
          <ScrollView>
            {/* { this.getItems()} */}
            <List>
              <DatePicker
                value={new Date(moment(startDate))}
                mode="date"
                defaultDate={new Date()}
                onChange={this.onStartDateChange}
                format="YYYY-MM-DD"
              >
                <List.Item >选择起始日期</List.Item>
              </DatePicker>
              <DatePicker
                value={new Date(moment(endDate))}
                mode="date"
                defaultDate={new Date()}
                onChange={this.onEndDateChange}
                format="YYYY-MM-DD"
              >
                <List.Item >选择截止日期</List.Item>
              </DatePicker>
            </List>
          </ScrollView>
        </View>
      </View>
      </Provider>
    )
  }
}

