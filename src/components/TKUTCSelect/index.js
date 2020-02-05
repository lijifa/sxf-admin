import React, { Component } from 'react'
import { Select } from 'antd'
const { Option } = Select

export default class TKUTCSelect extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let options = [{
        utcValue: 1,
        utcName: '东一区 UTC+1'
      },{
        utcValue: 2,
        utcName: '东二区 UTC+2'
      },{
        utcValue: 3,
        utcName: '东三区 UTC+3'
      },{
        utcValue: 3.5,
        utcName: '东三区 UTC+3.5'
      },,{
        utcValue: 4,
        utcName: '东四区 UTC+4'
      },{
        utcValue: 5,
        utcName: '东五区 UTC+5'
      },{
        utcValue: 5.5,
        utcName: '东五区 UTC+5.5'
      },{
        utcValue: 6,
        utcName: '东六区 UTC+6'
      },{
        utcValue: 7,
        utcName: '东七区 UTC+7'
      },{
        utcValue: 8,
        utcName: '东八区 UTC+8'
      },{
        utcValue: 9,
        utcName: '东九区 UTC+9'
      },{
        utcValue: 10,
        utcName: '东十区 UTC+10'
      },{
        utcValue: 11,
        utcName: '东十一区 UTC+11'
      },{
        utcValue: 12,
        utcName: '东十二区 UTC+12'
      },{
        utcValue: -1,
        utcName: '西一区 UTC-1'
      },{
        utcValue: -2,
        utcName: '西二区 UTC-2'
      },{
        utcValue: -3,
        utcName: '西三区 UTC-3'
      },{
        utcValue: -4,
        utcName: '西四区 UTC-4'
      },{
        utcValue: -5,
        utcName: '西五区 UTC-5'
      },{
        utcValue: -6,
        utcName: '西六区 UTC-6'
      },{
        utcValue: -7,
        utcName: '西七区 UTC-7'
      },{
        utcValue: -8,
        utcName: '西八区 UTC-8'
      },{
        utcValue: -9,
        utcName: '西九区 UTC-9'
      },{
        utcValue: -10,
        utcName: '西十区 UTC-10'
      },{
        utcValue: -11,
        utcName: '西十一区 UTC-11'
      },{
        utcValue: -12,
        utcName: '西十二区 UTC-12'
      }]

    return(
      <Select {...this.props} allowClear={true}>
        {
          options.map( (item) => {
            return <Option value={item.utcValue} key={item.utcValue} >{item.utcName} </Option>
          })
        }
      </Select>
    )
  }
}