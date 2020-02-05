import React, { Component } from 'react'
import { Select } from 'antd'
const { Option } = Select

export default class MsStatusSelect extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let options = this.props.options
    if(options  === undefined || options.length==0)  {
      options = []
    }

    return(
      <Select {...this.props} allowClear={true}>
        {
          options.map( (item) => {
            return <Option value={item.key} key={item.key} >{item.value} </Option>
          })
        }
      </Select>
    )
  }
}