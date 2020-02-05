import React, { Component } from 'react'
import { connect } from 'dva';
import { Select, Spin } from 'antd'
const { Option } = Select
const namespace = 'tradetype';

@connect(({ tradetype, loading }) => ({
  result: tradetype.selectData,
  loading: loading.effects['tradetype/queryAll'] ? true : false,
}))

export default class TKTransMapIdSelect extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.searchList()
  }

  /* 列表初始化 */
  searchList() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {}
    });
  }

  render() {
    const {result, loading, ...others} = this.props
    let options = result ? result.data : []
    if(options  === undefined || options.length==0)  {
      options = []
    }
    return(
      <Spin spinning={loading}>
        <Select {...this.props} allowClear={true}>
          {
            options.map( (item) => {
              return <Option value={item.transMapId} key={item.transMapId} >{item.transSubname} </Option>
            })
          }
        </Select>
      </Spin>
    )
  }
}