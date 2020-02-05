import React, { Component } from 'react'
import { connect } from 'dva';
import { Select, Spin } from 'antd'
const { Option } = Select
const namespace = 'paytype';

@connect(({ paytype, loading }) => ({
  result: paytype.selectData,
  loading: loading.effects['paytype/queryAll'] ? true : false,
}))

export default class TKPaytypeSelect extends Component {
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
      payload: {
        mdrType: 9
      }
    });
  }

  render() {
    const {result, loading, ...others} = this.props
    let options = result ? result.data : []
    if(options  === undefined || options.length==0) {
      options = []
    }
    return(
      <Spin spinning={loading}>
        <Select {...this.props} allowClear={true} mode="multiple">
          {
            options.map( (item) => {
              return <Option value={item.paytypeId.toString()} key={item.paytypeId.toString()} >{item.paytypeName} </Option>
            })
          }
        </Select>
      </Spin>
    )
  }
}