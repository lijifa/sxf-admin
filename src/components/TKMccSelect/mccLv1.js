import React, { Component } from 'react'
import { connect } from 'dva';
import { Select, Spin } from 'antd'
const { Option } = Select
const namespace = 'mcc';

@connect(({ mcc, loading }) => ({
  result: mcc.selectData,
  loading: loading.effects['mcc/queryAll'] ? true : false,
}))

export default class TKMccSelect extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    mccOption: []
  };

  componentDidMount() {
    this.searchList()
  }

  /* 列表初始化 */
  searchList() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {
        mccIdP: 0
      },
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            this.setState({
              mccOption: res.data.map(item => {
                const { mccName, mccId } = item
                return { mccName: mccName, mccId: mccId, key: mccId  }
              })
            })
          }
        }
      }
    });
  }

  render() {
    const {loading, ...others} = this.props
    const { mccOption } = this.state

    return(
      <Spin spinning={loading}>
        <Select {...this.props} allowClear={true}>
          <Option value={0} key={0} > 无 </Option>
          {
            mccOption.map( (item) => {
              return <Option value={item.mccId} key={item.mccId} >{item.mccName} </Option>
            })
          }
        </Select>
      </Spin>
    )
  }
}