import React, { Component } from 'react'
import { connect } from 'dva';
import { Select, Spin } from 'antd'
const { Option } = Select
const namespace = 'merchant';

@connect(({ merchant, loading }) => ({
  result: merchant.selectData,
  loading: loading.effects['institude/queryAll'] ? true : false,
}))

export default class MerNoSelect extends Component {
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
            options.filter(( item ) => {
              return item.merNo.length > 0
            }).map( (item) => {
              return <Option value={item.merNo} key={item.merNo} >{item.merName} </Option>
            })
          }
        </Select>
      </Spin>
    )
  }
}